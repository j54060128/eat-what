import type { TraitId } from '@/data/traits'
import type { ResolvedDish } from '@/data/types'
import type { Rng } from '../random'
import { likelihood } from './likelihood'

export interface QuestionCandidate {
  traitId: TraitId
  gain: number
}

function entropy(masses: Iterable<number>): number {
  let h = 0
  for (const m of masses) if (m > 0) h -= m * Math.log2(m)
  return h
}

/**
 * 計算每一題的期望資訊增益。
 * @param dishes 候選料理
 * @param weights 候選料理目前的機率（不必正規化）
 * @param groupOf 要「猜」的對象：第一階段用類型 id、第二階段用料理 id
 */
export function rankQuestions(
  dishes: ResolvedDish[],
  weights: number[],
  traitIds: TraitId[],
  groupOf: (d: ResolvedDish) => string,
  epsilon: number,
): QuestionCandidate[] {
  const total = weights.reduce((s, w) => s + w, 0)
  if (total <= 0 || dishes.length === 0) return []
  const w = weights.map((x) => x / total)

  const before = new Map<string, number>()
  dishes.forEach((d, i) => before.set(groupOf(d), (before.get(groupOf(d)) ?? 0) + w[i]!))
  const hBefore = entropy(before.values())

  const ranked: QuestionCandidate[] = []
  for (const traitId of traitIds) {
    let expected = 0
    for (const target of [1, 0]) {
      const masses = new Map<string, number>()
      let pAnswer = 0
      dishes.forEach((d, i) => {
        const m = w[i]! * likelihood(target, d.traits[traitId], epsilon)
        pAnswer += m
        masses.set(groupOf(d), (masses.get(groupOf(d)) ?? 0) + m)
      })
      if (pAnswer <= 0) continue
      const normalized = [...masses.values()].map((m) => m / pAnswer)
      expected += pAnswer * entropy(normalized)
    }
    ranked.push({ traitId, gain: hBefore - expected })
  }
  return ranked.sort((a, b) => b.gain - a.gain)
}

/**
 * 從資訊增益最高的幾題中隨機挑一題，讓每次遊戲的問法有點變化。
 * 回傳 null 代表已經沒有值得問的題目。
 */
export function pickQuestion(
  ranked: QuestionCandidate[],
  rng: Rng,
  options: { minGain: number; topK: number; tolerance: number },
): TraitId | null {
  const best = ranked[0]
  if (!best || best.gain < options.minGain) return null
  const pool = ranked
    .slice(0, options.topK)
    .filter((q) => q.gain >= best.gain * (1 - options.tolerance))
  return pool[Math.floor(rng() * pool.length)]!.traitId
}
