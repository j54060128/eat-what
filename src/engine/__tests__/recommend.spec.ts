import { describe, expect, it } from 'vitest'
import { CATEGORIES, DISHES } from '@/data'
import { PREFERENCE_QUESTIONS } from '@/data/recommend/preferences'
import { SITUATIONAL_QUESTIONS } from '@/data/recommend/questions'
import { ANSWERS } from '@/engine/guess/likelihood'
import { createRng, type Rng } from '@/engine/random'
import {
  buildFilters,
  decodePreferences,
  decodeSituational,
  encodePreferences,
  encodeSituational,
  mealByHour,
  type PreferenceAnswer,
  type SituationalAnswers,
} from '@/engine/recommend/answers'
import { passesFilters } from '@/engine/recommend/filters'
import {
  buildResult,
  deriveRecommendState,
  nextRecommendStep,
  preferenceValue,
} from '@/engine/recommend/session'
import { simulateRecommend } from '@/engine/recommend/simulate'

/** 隨機情境作答：忌口題每個選項有 15% 機率被勾 */
function randomSituational(rng: Rng): SituationalAnswers {
  const answers: SituationalAnswers = {}
  for (const q of SITUATIONAL_QUESTIONS) {
    if (q.multi) {
      const picked = q.options
        .map((o, i) => (!o.exclusive && rng() < 0.15 ? i : -1))
        .filter((i) => i >= 0)
      answers[q.id] = picked.length ? picked : [0]
    } else {
      answers[q.id] = [Math.floor(rng() * q.options.length)]
    }
  }
  return answers
}

/** 隨機作答直到神燈說可以推薦了 */
function randomSession(rng: Rng) {
  const situational = randomSituational(rng)
  const prefs: PreferenceAnswer[] = []
  for (;;) {
    const state = deriveRecommendState(DISHES, { situational, prefs })
    const step = nextRecommendStep(state, 7)
    if (step.kind === 'done') {
      return { situational, prefs, state, result: buildResult(state, { situational, prefs }) }
    }
    prefs.push({ id: step.id, answer: ANSWERS[Math.floor(rng() * ANSWERS.length)]!.id })
  }
}

describe('作答編碼與篩選', () => {
  it('情境題與偏好題編碼後再解碼，作答完全相同', () => {
    const rng = createRng(3)
    for (let i = 0; i < 50; i++) {
      const { situational, prefs } = randomSession(rng)
      expect(decodeSituational(encodeSituational(situational))).toEqual(situational)
      expect(decodePreferences(encodePreferences(prefs))).toEqual(prefs)
    }
  })

  it('解碼時忽略不存在的題目、超出範圍的選項與重複的偏好題', () => {
    expect(decodeSituational('meal.1_hack.2_budget.99_diet.1-x')).toEqual({ meal: [1], diet: [1] })
    expect(decodePreferences('soup.y_nope.y_soup.n_spicy.zz_rice.pn')).toEqual([
      { id: 'soup', answer: 'yes' },
      { id: 'rice', answer: 'probablyNot' },
    ])
  })

  it('情境題的篩選條件會正確建立', () => {
    expect(buildFilters({ meal: [0], budget: [0], diet: [1, 5] })).toMatchObject({
      meal: 'breakfast',
      maxPrice: 1,
      vegetarian: true,
      noSpicy: true,
    })
  })

  it('依時間推測用餐時段', () => {
    expect(mealByHour(8)).toBe('breakfast')
    expect(mealByHour(12)).toBe('lunch')
    expect(mealByHour(15)).toBe('tea')
    expect(mealByHour(19)).toBe('dinner')
    expect(mealByHour(23)).toBe('lateNight')
    expect(mealByHour(2)).toBe('lateNight')
  })

  it('每一題偏好題都能區分出至少一道料理', () => {
    const useless = PREFERENCE_QUESTIONS.filter((q) => {
      const values = DISHES.map((d) => preferenceValue(d, q.id))
      return Math.max(...values) - Math.min(...values) < 0.5
    }).map((q) => q.id)
    expect(useless).toEqual([])
  })
})

describe('模擬「其實想吃 X」的玩家（品質門檻）', () => {
  it('如實回答：≥ 90% 的料理會是主推或前 3 名，平均題數 ≤ 9', () => {
    const results = DISHES.map((d) => simulateRecommend(DISHES, d, { seed: 1 }))
    const hit = results.filter((r) => r.rank >= 0 && r.rank < 3)
    const missed = results.filter((r) => !(r.rank >= 0 && r.rank < 3))
    const avg = results.reduce((s, r) => s + r.questions, 0) / results.length
    const top1 = results.filter((r) => r.rank === 0).length
    console.info(
      `推薦模擬：${hit.length}/${results.length} 進前 3（${top1} 道是主推），平均 ${avg.toFixed(1)} 題`,
      missed.length
        ? `\n沒進前 3：${missed.map((r) => `${r.dishId}#${r.rank + 1}`).join(', ')}`
        : '',
    )
    expect(hit.length / results.length).toBeGreaterThanOrEqual(0.9)
    expect(avg).toBeLessThanOrEqual(9)
  }, 60_000)
})

describe('推薦結果（隨機作答抽樣）', () => {
  const rng = createRng(2024)
  const sessions = Array.from({ length: 1500 }, () => randomSession(rng))

  it('每次都有推薦結果，且最多問 12 題', () => {
    expect(sessions.every((s) => s.result !== null)).toBe(true)
    expect(Math.max(...sessions.map((s) => s.prefs.length))).toBeLessThanOrEqual(12)
  })

  it('忌口條件永遠被遵守（不會放寬）', () => {
    const violations: string[] = []
    for (const { state, result } of sessions) {
      const f = state.filters
      const t = result!.dish.traits
      const broken =
        (f.vegetarian && t.meatless < 0.75) ||
        (f.noBeef && t.beef >= 0.5) ||
        (f.noPork && t.pork >= 0.5) ||
        (f.noSeafood && t.seafood >= 0.5) ||
        (f.noSpicy && t.spicy >= 0.6)
      if (broken) violations.push(result!.dish.id)
    }
    expect(violations).toEqual([])
  })

  it('沒有放寬條件時，用餐時段與預算也都符合', () => {
    const violations = sessions
      .filter(({ result }) => result!.relaxed === 'none')
      .filter(({ state, result }) => !passesFilters(result!.dish, state.filters))
      .map(({ result }) => result!.dish.id)
    expect(violations).toEqual([])
  })

  it('「想／不想」是硬條件：主推的違反數一定是所有候選中最少的', () => {
    const problems: string[] = []
    for (const { state, result } of sessions) {
      const counts = state.violations.map((v) => v.length)
      const min = Math.min(...counts)
      const main = counts[state.candidates.indexOf(result!.dish)]!
      if (main !== min)
        problems.push(`${result!.dish.id} 違反 ${main} 個，但有料理只違反 ${min} 個`)
      if (result!.unmet.length !== main) problems.push(`${result!.dish.id} 的 unmet 數量不符`)
    }
    expect(problems).toEqual([])
  })

  it('只要有料理能符合全部硬條件，主推就一定全部符合、沒有「沒辦法滿足」', () => {
    const satisfiable = sessions.filter(({ state }) => state.violations.some((v) => v.length === 0))
    expect(satisfiable.length).toBeGreaterThan(100)
    const broken = satisfiable
      .filter(({ result }) => result!.unmet.length > 0)
      .map(({ result }) => result!.dish.id)
    expect(broken).toEqual([])
  })

  it('回歸：台式＋有湯＋吃麵＋多蔬菜，不會默默推出蔬菜少的料理', () => {
    const input = {
      situational: { meal: [3], budget: [2], company: [1], diet: [0] },
      prefs: [
        { id: 'taiwanese', answer: 'yes' },
        { id: 'soup', answer: 'yes' },
        { id: 'noodle', answer: 'yes' },
        { id: 'veggie', answer: 'yes' },
      ] satisfies PreferenceAnswer[],
    }
    const result = buildResult(deriveRecommendState(DISHES, input), input)!
    // 要嘛蔬菜夠多，要嘛明確告訴玩家「沒辦法滿足：多蔬菜」
    expect(result.dish.traits.veggie >= 0.4 || result.unmet.includes('多蔬菜')).toBe(true)
  })

  it('每個類型都至少被推薦過一次', () => {
    const seen = new Set(sessions.map((s) => s.result!.category.id))
    const missing = CATEGORIES.filter((c) => !seen.has(c.id)).map((c) => c.id)
    expect(missing).toEqual([])
  })

  it('同樣的作答，推薦結果相同', () => {
    const input = {
      situational: { meal: [3], budget: [1], company: [0], diet: [0] },
      prefs: [
        { id: 'warm', answer: 'yes' },
        { id: 'soup', answer: 'yes' },
      ] satisfies PreferenceAnswer[],
    }
    const a = buildResult(deriveRecommendState(DISHES, input), input)
    const b = buildResult(deriveRecommendState(DISHES, input), input)
    expect(a!.dish.id).toBe(b!.dish.id)
    expect(a!.summary).toEqual(['晚餐', '400 元內', '一個人', '熱的', '有湯'])
  })

  it('換一個：排除的料理不會再被推薦', () => {
    const input = { situational: { meal: [3], budget: [2], company: [1], diet: [0] }, prefs: [] }
    const state = deriveRecommendState(DISHES, input)
    const exclude = new Set<string>()
    for (let i = 0; i < 10; i++) {
      const result = buildResult(state, input, { exclude })!
      expect(exclude.has(result.dish.id)).toBe(false)
      exclude.add(result.dish.id)
    }
  })
})
