import type { TraitId } from '@/data/traits'
import type { ResolvedDish } from '@/data/types'
import type { Rng } from '../random'
import { likelihood } from './likelihood'

export interface QuestionCandidate<Q extends string = string> {
  id: Q
  gain: number
}

/** 題目對某道料理的值（0~1）：猜謎模式就是特徵值，推薦模式也可以是換算後的 vibe */
export type ValueOf<Q extends string> = (dish: ResolvedDish, questionId: Q) => number

export const traitValue: ValueOf<TraitId> = (dish, traitId) => dish.traits[traitId]

function entropy(masses: Iterable<number>): number {
  let h = 0
  for (const m of masses) if (m > 0) h -= m * Math.log2(m)
  return h
}

/**
 * 計算每一題的期望資訊增益（猜謎模式與推薦模式共用）。
 * @param dishes 候選料理
 * @param weights 候選料理目前的機率（不必正規化）
 * @param valueOf 題目對料理的值
 * @param groupOf 要「猜」的對象：猜類型時用類型 id、猜料理時用料理 id
 */
export function rankQuestions<Q extends string>(
  dishes: ResolvedDish[],
  weights: number[],
  questionIds: Q[],
  valueOf: ValueOf<Q>,
  groupOf: (d: ResolvedDish) => string,
  epsilon: number,
): QuestionCandidate<Q>[] {
  const total = weights.reduce((s, w) => s + w, 0)
  if (total <= 0 || dishes.length === 0) return []
  const w = weights.map((x) => x / total)

  const before = new Map<string, number>()
  dishes.forEach((d, i) => before.set(groupOf(d), (before.get(groupOf(d)) ?? 0) + w[i]!))
  const hBefore = entropy(before.values())

  const ranked: QuestionCandidate<Q>[] = []
  for (const id of questionIds) {
    let expected = 0
    for (const target of [1, 0]) {
      const masses = new Map<string, number>()
      let pAnswer = 0
      dishes.forEach((d, i) => {
        const m = w[i]! * likelihood(target, valueOf(d, id), epsilon)
        pAnswer += m
        masses.set(groupOf(d), (masses.get(groupOf(d)) ?? 0) + m)
      })
      if (pAnswer <= 0) continue
      const normalized = [...masses.values()].map((m) => m / pAnswer)
      expected += pAnswer * entropy(normalized)
    }
    ranked.push({ id, gain: hBefore - expected })
  }
  return ranked.sort((a, b) => b.gain - a.gain)
}

/**
 * 從資訊增益最高的幾題中隨機挑一題，讓每次的問法有點變化。
 * 回傳 null 代表已經沒有值得問的題目。
 */
export function pickQuestion<Q extends string>(
  ranked: QuestionCandidate<Q>[],
  rng: Rng,
  options: { minGain: number; topK: number; tolerance: number },
): Q | null {
  const best = ranked[0]
  if (!best || best.gain < options.minGain) return null
  const pool = ranked
    .slice(0, options.topK)
    .filter((q) => q.gain >= best.gain * (1 - options.tolerance))
  return pool[Math.floor(rng() * pool.length)]!.id
}
