import { TRAIT_IDS, type TraitId } from '@/data/traits'
import type { ResolvedDish } from '@/data/types'
import { createRng } from '../random'
import { answerTarget, likelihood, type Answer } from './likelihood'
import { pickQuestion, rankQuestions, traitValue } from './selectQuestion'

/**
 * 猜謎模式的狀態機。
 * 遊戲狀態完全由「事件歷史」重算而來，所以「上一題」＝把最後一個事件拿掉，結果可重現。
 */
export type GuessEvent =
  | { type: 'answer'; traitId: TraitId; answer: Answer }
  | { type: 'category'; categoryId: string; correct: boolean }
  | { type: 'dish'; dishId: string; correct: boolean }
  /** 從候選清單中挑選；null 代表「都不是」 */
  | { type: 'pick'; dishId: string | null }

export type GuessStep =
  | { kind: 'question'; traitId: TraitId; stage: 1 | 2 }
  | { kind: 'confirmCategory'; categoryId: string; confidence: number }
  | { kind: 'guessDish'; dishId: string; confidence: number }
  | { kind: 'pickFromList'; dishIds: string[] }
  | { kind: 'won'; dishId: string }
  | { kind: 'lost' }

export interface GuessConfig {
  /** 似然函數的容錯底線 */
  epsilon: number
  /** 類型機率達到這個值就提出「是 X 類嗎？」 */
  categoryThreshold: number
  /** 問了 categoryLateAfter 題之後，門檻降為這個值 */
  categoryLateThreshold: number
  categoryLateAfter: number
  /** 第一階段最多問幾題就一定要猜類型 */
  maxStage1Questions: number
  /** 料理機率達到這個值就猜料理 */
  dishThreshold: number
  /** 第二階段最多問幾題就一定要猜料理 */
  maxStage2Questions: number
  /** 玩家說「不是這類」時，該類型的機率乘上這個係數（不直接歸零，保留容錯） */
  categoryRejectFactor: number
  maxCategoryRejections: number
  maxWrongDishGuesses: number
  /** 整局問題數上限 */
  maxQuestions: number
  /** 認輸前列出的候選數量 */
  listSize: number
  /** 挑題：增益低於此值視為沒有值得問的題目 */
  minGain: number
  /** 挑題：從前 K 名、且增益在最佳值 (1 - tolerance) 倍以內的題目中隨機挑 */
  topK: number
  tolerance: number
}

export const DEFAULT_GUESS_CONFIG: GuessConfig = {
  epsilon: 0.06,
  categoryThreshold: 0.8,
  categoryLateThreshold: 0.6,
  categoryLateAfter: 8,
  maxStage1Questions: 12,
  dishThreshold: 0.85,
  maxStage2Questions: 8,
  categoryRejectFactor: 0.05,
  maxCategoryRejections: 4,
  maxWrongDishGuesses: 3,
  maxQuestions: 30,
  listSize: 5,
  minGain: 0.01,
  topK: 3,
  tolerance: 0.12,
}

export interface GuessState {
  /** 與 dishes 陣列對齊的機率（已正規化） */
  posterior: number[]
  confirmedCategoryId: string | null
  rejectedCategoryIds: Set<string>
  rejectedDishIds: Set<string>
  askedTraitIds: Set<TraitId>
  questionCount: number
  stage1Count: number
  stage2Count: number
  wrongDishGuesses: number
  /** 最後一個事件若結束了遊戲，記錄結果 */
  outcome: { kind: 'won'; dishId: string } | { kind: 'lost' } | null
  pickedFromList: boolean
}

function normalize(values: number[]): number[] {
  const total = values.reduce((s, v) => s + v, 0)
  return total > 0 ? values.map((v) => v / total) : values.map(() => 0)
}

/** 由事件歷史重算遊戲狀態 */
export function deriveState(
  dishes: ResolvedDish[],
  events: GuessEvent[],
  config: GuessConfig = DEFAULT_GUESS_CONFIG,
): GuessState {
  const weights = dishes.map(() => 1)
  const state: GuessState = {
    posterior: [],
    confirmedCategoryId: null,
    rejectedCategoryIds: new Set(),
    rejectedDishIds: new Set(),
    askedTraitIds: new Set(),
    questionCount: 0,
    stage1Count: 0,
    stage2Count: 0,
    wrongDishGuesses: 0,
    outcome: null,
    pickedFromList: false,
  }

  for (const event of events) {
    switch (event.type) {
      case 'answer': {
        state.askedTraitIds.add(event.traitId)
        state.questionCount++
        if (state.confirmedCategoryId) state.stage2Count++
        else state.stage1Count++
        const target = answerTarget(event.answer)
        if (target === null) break
        dishes.forEach((d, i) => {
          weights[i]! *= likelihood(target, d.traits[event.traitId], config.epsilon)
        })
        break
      }
      case 'category': {
        if (event.correct) {
          state.confirmedCategoryId = event.categoryId
          dishes.forEach((d, i) => {
            if (d.categoryId !== event.categoryId) weights[i]! *= config.categoryRejectFactor
          })
        } else {
          state.rejectedCategoryIds.add(event.categoryId)
          dishes.forEach((d, i) => {
            if (d.categoryId === event.categoryId) weights[i]! *= config.categoryRejectFactor
          })
        }
        break
      }
      case 'dish': {
        if (event.correct) {
          state.outcome = { kind: 'won', dishId: event.dishId }
        } else {
          state.rejectedDishIds.add(event.dishId)
          state.wrongDishGuesses++
        }
        break
      }
      case 'pick': {
        state.pickedFromList = true
        state.outcome = event.dishId ? { kind: 'won', dishId: event.dishId } : { kind: 'lost' }
        break
      }
    }
    // 防止連乘後數值過小：每步都正規化
    const n = normalize(weights)
    n.forEach((v, i) => (weights[i] = v))
  }

  dishes.forEach((d, i) => {
    if (state.rejectedDishIds.has(d.id)) weights[i] = 0
  })
  state.posterior = normalize(weights)
  return state
}

function topIndex(values: number[]): number {
  let best = -1
  let bestValue = -Infinity
  values.forEach((v, i) => {
    if (v > bestValue) {
      bestValue = v
      best = i
    }
  })
  return best
}

/** 決定下一步：問問題、猜類型、猜料理、列清單或結束 */
export function nextStep(
  dishes: ResolvedDish[],
  state: GuessState,
  config: GuessConfig = DEFAULT_GUESS_CONFIG,
  seed = 0,
): GuessStep {
  if (state.outcome) return state.outcome

  const rng = createRng(seed + state.questionCount * 7919 + state.wrongDishGuesses * 104729)
  const unasked = TRAIT_IDS.filter((t) => !state.askedTraitIds.has(t))
  const pickOptions = { minGain: config.minGain, topK: config.topK, tolerance: config.tolerance }

  const listStep = (): GuessStep => {
    const ranked = dishes
      .map((d, i) => ({ id: d.id, p: state.posterior[i]! }))
      .filter((x) => x.p > 0)
      .sort((a, b) => b.p - a.p)
      .slice(0, config.listSize)
      .map((x) => x.id)
    return ranked.length > 0 ? { kind: 'pickFromList', dishIds: ranked } : { kind: 'lost' }
  }

  if (
    state.wrongDishGuesses >= config.maxWrongDishGuesses ||
    state.rejectedCategoryIds.size >= config.maxCategoryRejections ||
    state.questionCount >= config.maxQuestions
  ) {
    return listStep()
  }

  // ── 第一階段：猜類型 ──
  if (!state.confirmedCategoryId) {
    const masses = new Map<string, number>()
    dishes.forEach((d, i) => {
      if (state.rejectedCategoryIds.has(d.categoryId)) return
      masses.set(d.categoryId, (masses.get(d.categoryId) ?? 0) + state.posterior[i]!)
    })
    const total = [...masses.values()].reduce((s, v) => s + v, 0)
    if (total <= 0) return listStep()

    let topCategory = ''
    let topMass = -1
    for (const [id, m] of masses) {
      if (m > topMass) {
        topCategory = id
        topMass = m
      }
    }
    const confidence = topMass / total
    const confirm: GuessStep = { kind: 'confirmCategory', categoryId: topCategory, confidence }

    if (
      confidence >= config.categoryThreshold ||
      (state.stage1Count >= config.categoryLateAfter &&
        confidence >= config.categoryLateThreshold) ||
      state.stage1Count >= config.maxStage1Questions
    ) {
      return confirm
    }

    const candidates = dishes.filter((d) => !state.rejectedCategoryIds.has(d.categoryId))
    const weights = candidates.map((d) => state.posterior[dishes.indexOf(d)]!)
    const ranked = rankQuestions(
      candidates,
      weights,
      unasked,
      traitValue,
      (d) => d.categoryId,
      config.epsilon,
    )
    const traitId = pickQuestion(ranked, rng, pickOptions)
    return traitId ? { kind: 'question', traitId, stage: 1 } : confirm
  }

  // ── 第二階段：在已確認的類型內猜料理 ──
  const indexes = dishes
    .map((d, i) => i)
    .filter(
      (i) =>
        dishes[i]!.categoryId === state.confirmedCategoryId &&
        !state.rejectedDishIds.has(dishes[i]!.id),
    )
  if (indexes.length === 0) return listStep()

  const candidates = indexes.map((i) => dishes[i]!)
  const weights = normalize(indexes.map((i) => state.posterior[i]!))
  const best = topIndex(weights)
  const guess: GuessStep = {
    kind: 'guessDish',
    dishId: candidates[best]!.id,
    confidence: weights[best]!,
  }

  if (
    candidates.length === 1 ||
    weights[best]! >= config.dishThreshold ||
    state.stage2Count >= config.maxStage2Questions
  ) {
    return guess
  }

  const ranked = rankQuestions(
    candidates,
    weights,
    unasked,
    traitValue,
    (d) => d.id,
    config.epsilon,
  )
  const traitId = pickQuestion(ranked, rng, pickOptions)
  return traitId ? { kind: 'question', traitId, stage: 2 } : guess
}
