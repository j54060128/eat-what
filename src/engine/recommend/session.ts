import { getCategory } from '@/data'
import type { Category, ResolvedDish } from '@/data/types'
import { PREFERENCE_BY_ID, PREFERENCE_QUESTIONS } from '@/data/recommend/preferences'
import type { Filters, PreferenceSource } from '@/data/recommend/types'
import { createRng } from '../random'
import { answerTarget, likelihood } from '../guess/likelihood'
import { pickQuestion, rankQuestions } from '../guess/selectQuestion'
import {
  buildFilters,
  situationalEvidence,
  situationalSummary,
  type PreferenceAnswer,
  type SituationalAnswers,
} from './answers'
import { eligibleDishes, type Relaxation } from './filters'

/**
 * 推薦模式（自適應追問）。
 * 和猜謎模式用同一套機率模型：把「玩家現在最想吃的那道」當成要猜的目標，
 * 每題挑最能縮小範圍的偏好題，範圍夠小就推薦機率最高的料理。
 */
export interface RecommendConfig {
  epsilon: number
  /** 至少問幾題才可能自動結束 */
  minQuestions: number
  maxQuestions: number
  /** 最高機率料理達到這個值就推薦 */
  topThreshold: number
  /** 前 3 名合計達到這個值就推薦 */
  top3Threshold: number
  minGain: number
  topK: number
  tolerance: number
  /** 「還剩約 N 道」：機率達到最高者這個比例的料理才算 */
  aliveRatio: number
}

export const DEFAULT_RECOMMEND_CONFIG: RecommendConfig = {
  epsilon: 0.12,
  minQuestions: 3,
  maxQuestions: 12,
  topThreshold: 0.3,
  top3Threshold: 0.65,
  minGain: 0.02,
  topK: 3,
  tolerance: 0.12,
  aliveRatio: 0.2,
}

export function sourceValue(dish: ResolvedDish, source: PreferenceSource): number {
  return 'trait' in source ? dish.traits[source.trait] : (dish.vibes[source.vibe] + 1) / 2
}

/** 偏好題對某道料理的值（0~1） */
export function preferenceValue(dish: ResolvedDish, preferenceId: string): number {
  const question = PREFERENCE_BY_ID[preferenceId]
  return question ? sourceValue(dish, question.source) : 0.5
}

export interface RecommendInput {
  situational: SituationalAnswers
  prefs: PreferenceAnswer[]
}

export interface RecommendState {
  filters: Filters
  relaxed: Relaxation
  /** 通過篩選的候選料理 */
  candidates: ResolvedDish[]
  /** 與 candidates 對齊的機率 */
  posterior: number[]
  asked: Set<string>
}

function normalize(values: number[]): number[] {
  const total = values.reduce((s, v) => s + v, 0)
  return total > 0 ? values.map((v) => v / total) : values.map(() => 0)
}

export function deriveRecommendState(
  dishes: ResolvedDish[],
  input: RecommendInput,
  config: RecommendConfig = DEFAULT_RECOMMEND_CONFIG,
): RecommendState {
  const filters = buildFilters(input.situational)
  const { dishes: candidates, relaxed } = eligibleDishes(dishes, filters)
  let weights = candidates.map(() => 1)

  const apply = (valueOf: (d: ResolvedDish) => number, target: number) => {
    weights = normalize(
      weights.map((w, i) => w * likelihood(target, valueOf(candidates[i]!), config.epsilon)),
    )
  }

  for (const ev of situationalEvidence(input.situational)) {
    apply((d) => sourceValue(d, ev.source), ev.target)
  }

  const asked = new Set<string>()
  for (const p of input.prefs) {
    if (!PREFERENCE_BY_ID[p.id]) continue
    asked.add(p.id)
    const target = answerTarget(p.answer)
    if (target !== null) apply((d) => preferenceValue(d, p.id), target)
  }

  return { filters, relaxed, candidates, posterior: normalize(weights), asked }
}

export type RecommendStep = { kind: 'question'; id: string } | { kind: 'done' }

export function nextRecommendStep(
  state: RecommendState,
  seed = 0,
  config: RecommendConfig = DEFAULT_RECOMMEND_CONFIG,
): RecommendStep {
  const done: RecommendStep = { kind: 'done' }
  const answered = state.asked.size
  if (state.candidates.length <= 1 || answered >= config.maxQuestions) return done

  const sorted = [...state.posterior].sort((a, b) => b - a)
  const top = sorted[0] ?? 0
  const top3 = sorted.slice(0, 3).reduce((s, p) => s + p, 0)
  if (
    answered >= config.minQuestions &&
    (top >= config.topThreshold || top3 >= config.top3Threshold)
  ) {
    return done
  }

  const unasked = PREFERENCE_QUESTIONS.map((q) => q.id).filter((id) => !state.asked.has(id))
  const ranked = rankQuestions(
    state.candidates,
    state.posterior,
    unasked,
    preferenceValue,
    (d) => d.id,
    config.epsilon,
  )
  const id = pickQuestion(ranked, createRng(seed + answered * 7919), {
    minGain: config.minGain,
    topK: config.topK,
    tolerance: config.tolerance,
  })
  return id ? { kind: 'question', id } : done
}

/** 目前還算「有機會」的料理數量，給畫面顯示「還剩約 N 道」 */
export function aliveCount(
  state: RecommendState,
  config: RecommendConfig = DEFAULT_RECOMMEND_CONFIG,
): number {
  const max = Math.max(0, ...state.posterior)
  return state.posterior.filter((p) => p > 0 && p >= max * config.aliveRatio).length
}

/** 依機率由高到低排序（同分時維持資料原本的順序） */
export function rankDishes(state: RecommendState): ResolvedDish[] {
  return state.candidates
    .map((dish, i) => ({ dish, p: state.posterior[i]!, i }))
    .sort((a, b) => b.p - a.p || a.i - b.i)
    .map((x) => x.dish)
}

function preferenceChip(p: PreferenceAnswer): string | null {
  const question = PREFERENCE_BY_ID[p.id]
  const target = answerTarget(p.answer)
  if (!question || target === null) return null
  return target >= 0.5 ? question.yes : question.no
}

export interface RecommendResult {
  dish: ResolvedDish
  category: Category
  /** 同類型的其他選擇 */
  sameCategory: ResolvedDish[]
  /** 換換口味：其他類型各挑一道機率最高的 */
  otherCategories: ResolvedDish[]
  /** 「你的選擇」摘要 */
  summary: string[]
  /** 主推料理符合了哪些偏好 */
  matched: string[]
  relaxed: Relaxation
}

export function buildResult(
  state: RecommendState,
  input: RecommendInput,
  options: { exclude?: Set<string>; dishId?: string } = {},
): RecommendResult | null {
  const ranking = rankDishes(state)
  if (ranking.length === 0) return null

  const main =
    (options.dishId && ranking.find((d) => d.id === options.dishId)) ||
    ranking.find((d) => !options.exclude?.has(d.id)) ||
    ranking[0]!

  const others = ranking.filter((d) => d.id !== main.id)
  const sameCategory = others.filter((d) => d.categoryId === main.categoryId).slice(0, 2)
  const seen = new Set([main.categoryId])
  const otherCategories: ResolvedDish[] = []
  for (const d of others) {
    if (seen.has(d.categoryId)) continue
    seen.add(d.categoryId)
    otherCategories.push(d)
    if (otherCategories.length >= 3) break
  }

  const matched = input.prefs
    .filter((p) => {
      const target = answerTarget(p.answer)
      return target !== null && Math.abs(target - preferenceValue(main, p.id)) <= 0.35
    })
    .map(preferenceChip)
    .filter((c): c is string => c !== null)

  return {
    dish: main,
    category: getCategory(main.categoryId),
    sameCategory,
    otherCategories,
    summary: [
      ...situationalSummary(input.situational),
      ...input.prefs.map(preferenceChip).filter((c): c is string => c !== null),
    ],
    matched,
    relaxed: state.relaxed,
  }
}
