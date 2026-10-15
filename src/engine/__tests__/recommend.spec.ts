import { describe, expect, it } from 'vitest'
import { CATEGORIES, DISHES } from '@/data'
import { FUN_QUESTIONS, SITUATIONAL_QUESTIONS } from '@/data/recommend/questions'
import { PERSONAS } from '@/data/recommend/personas'
import { createRng, type Rng } from '@/engine/random'
import {
  buildProfile,
  decodeAnswers,
  encodeAnswers,
  type RecommendAnswers,
} from '@/engine/recommend/profile'
import { buildQuiz, mealByHour } from '@/engine/recommend/quiz'
import { passesFilters, recommend } from '@/engine/recommend/score'

/** 隨機作答：忌口題每個選項有 15% 機率被勾 */
function randomAnswers(rng: Rng): RecommendAnswers {
  const answers: RecommendAnswers = {}
  for (const q of buildQuiz(rng)) {
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

describe('作答與口味輪廓', () => {
  it('編碼後再解碼，作答完全相同', () => {
    const rng = createRng(3)
    for (let i = 0; i < 50; i++) {
      const answers = randomAnswers(rng)
      expect(decodeAnswers(encodeAnswers(answers))).toEqual(answers)
    }
  })

  it('解碼時忽略不存在的題目與超出範圍的選項', () => {
    expect(decodeAnswers('meal.1_hack.2_budget.99_diet.1-x')).toEqual({ meal: [1], diet: [1] })
  })

  it('選項的篩選條件會反映在輪廓中', () => {
    const profile = buildProfile({ meal: [0], budget: [0], diet: [1, 5] })
    expect(profile.filters).toMatchObject({
      meal: 'breakfast',
      maxPrice: 1,
      vegetarian: true,
      noSpicy: true,
    })
  })

  it('每份測驗都有 4 題情境題＋5 題不重複的趣味題', () => {
    const quiz = buildQuiz(createRng(1))
    expect(quiz.slice(0, SITUATIONAL_QUESTIONS.length)).toEqual(SITUATIONAL_QUESTIONS)
    const fun = quiz.slice(SITUATIONAL_QUESTIONS.length)
    expect(fun).toHaveLength(5)
    expect(new Set(fun.map((q) => q.id)).size).toBe(5)
  })

  it('依時間推測用餐時段', () => {
    expect(mealByHour(8)).toBe('breakfast')
    expect(mealByHour(12)).toBe('lunch')
    expect(mealByHour(15)).toBe('tea')
    expect(mealByHour(19)).toBe('dinner')
    expect(mealByHour(23)).toBe('lateNight')
    expect(mealByHour(2)).toBe('lateNight')
  })

  it('題庫裡每個選項的 vibe 增量都在 -1~1', () => {
    for (const q of [...SITUATIONAL_QUESTIONS, ...FUN_QUESTIONS]) {
      for (const o of q.options) {
        for (const v of Object.values(o.effect?.vibes ?? {})) {
          expect(Math.abs(v), `${q.id}/${o.label}`).toBeLessThanOrEqual(1)
        }
      }
    }
  })
})

describe('推薦結果（隨機作答抽樣）', () => {
  const RUNS = 3000
  const rng = createRng(2024)
  const results = Array.from({ length: RUNS }, () => {
    const profile = buildProfile(randomAnswers(rng))
    return { profile, rec: recommend(DISHES, profile, { rng }) }
  })

  it('每次都有推薦結果', () => {
    expect(results.every((r) => r.rec !== null)).toBe(true)
  })

  it('忌口條件永遠被遵守（不會放寬）', () => {
    const violations: string[] = []
    for (const { profile, rec } of results) {
      const f = profile.filters
      const t = rec!.dish.traits
      const broken =
        (f.vegetarian && t.meatless < 0.75) ||
        (f.noBeef && t.beef >= 0.5) ||
        (f.noPork && t.pork >= 0.5) ||
        (f.noSeafood && t.seafood >= 0.5) ||
        (f.noSpicy && t.spicy >= 0.6)
      if (broken) violations.push(rec!.dish.id)
    }
    expect(violations).toEqual([])
  })

  it('沒有放寬條件時，用餐時段與預算也都符合', () => {
    const violations = results
      .filter(({ rec }) => rec!.relaxed === 'none')
      .filter(({ profile, rec }) => !passesFilters(rec!.dish, profile.filters))
      .map(({ rec }) => rec!.dish.id)
    expect(violations).toEqual([])
  })

  it('每個類型都至少被推薦過一次', () => {
    const seen = new Set(results.map((r) => r.rec!.category.id))
    const missing = CATEGORIES.filter((c) => !seen.has(c.id)).map((c) => c.id)
    expect(missing).toEqual([])
  })

  it('每種人格都至少出現過一次', () => {
    const seen = new Set(results.map((r) => r.rec!.persona.id))
    const missing = PERSONAS.filter((p) => !seen.has(p.id)).map((p) => p.id)
    expect(missing).toEqual([])
  })

  it('推薦夠分散：最常出現的料理不超過 8%', () => {
    const counts = new Map<string, number>()
    for (const r of results) counts.set(r.rec!.dish.id, (counts.get(r.rec!.dish.id) ?? 0) + 1)
    const [topId, topCount] = [...counts].sort((a, b) => b[1] - a[1])[0]!
    console.info(
      `推薦分佈：${counts.size}/${DISHES.length} 道料理出現過，最常見 ${topId}（${((topCount / RUNS) * 100).toFixed(1)}%）`,
    )
    expect(topCount / RUNS).toBeLessThanOrEqual(0.08)
  })

  it('同樣的作答與種子，推薦結果相同', () => {
    const profile = buildProfile({ meal: [3], budget: [1], company: [0], diet: [0] })
    const a = recommend(DISHES, profile, { rng: createRng(9) })
    const b = recommend(DISHES, profile, { rng: createRng(9) })
    expect(a!.dish.id).toBe(b!.dish.id)
  })

  it('換一個：排除的料理不會再被推薦', () => {
    const profile = buildProfile({ meal: [3], budget: [2], company: [1], diet: [0] })
    const exclude = new Set<string>()
    const r = createRng(5)
    for (let i = 0; i < 10; i++) {
      const rec = recommend(DISHES, profile, { rng: r, exclude })!
      expect(exclude.has(rec.dish.id)).toBe(false)
      exclude.add(rec.dish.id)
    }
  })
})
