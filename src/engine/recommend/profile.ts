import type { TraitId, TraitMap } from '@/data/traits'
import { VIBE_IDS, zeroVibes, type VibeVector } from '@/data/vibes'
import { RECOMMEND_QUESTION_BY_ID } from '@/data/recommend/questions'
import type { Filters } from '@/data/recommend/types'

/** 玩家的作答：題目 id → 選了第幾個選項（多選題可以有多個） */
export type RecommendAnswers = Record<string, number[]>

/** 由作答累積出的「口味輪廓」 */
export interface Profile {
  vibes: VibeVector
  traits: TraitMap
  filters: Filters
}

export const DEFAULT_FILTERS: Filters = {
  meal: null,
  maxPrice: 3,
  vegetarian: false,
  noBeef: false,
  noPork: false,
  noSeafood: false,
  noSpicy: false,
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

export function buildProfile(answers: RecommendAnswers): Profile {
  const vibes = zeroVibes()
  const traits: TraitMap = {}
  const filters: Filters = { ...DEFAULT_FILTERS }

  for (const [questionId, indexes] of Object.entries(answers)) {
    const question = RECOMMEND_QUESTION_BY_ID[questionId]
    if (!question) continue
    for (const index of indexes) {
      const option = question.options[index]
      if (!option) continue
      for (const [id, delta] of Object.entries(option.effect?.vibes ?? {})) {
        vibes[id as keyof VibeVector] += delta
      }
      for (const [id, delta] of Object.entries(option.effect?.traits ?? {})) {
        traits[id as TraitId] = (traits[id as TraitId] ?? 0) + delta
      }
      Object.assign(filters, option.filter)
    }
  }

  for (const id of VIBE_IDS) vibes[id] = clamp(vibes[id], -1.5, 1.5)
  for (const id of Object.keys(traits) as TraitId[]) traits[id] = clamp(traits[id]!, -1, 1)
  return { vibes, traits, filters }
}

/**
 * 把作答編碼成網址參數，例如 `meal.3_budget.1_diet.1-5_weather.0`。
 * 分享連結只帶題目 id 與選項序號，不含任何個人資料。
 */
export function encodeAnswers(answers: RecommendAnswers): string {
  return Object.entries(answers)
    .map(([id, indexes]) => `${id}.${indexes.join('-')}`)
    .join('_')
}

export function decodeAnswers(encoded: string): RecommendAnswers {
  const answers: RecommendAnswers = {}
  for (const part of encoded.split('_')) {
    const [id, raw] = part.split('.')
    const question = id ? RECOMMEND_QUESTION_BY_ID[id] : undefined
    if (!question || !raw) continue
    const indexes = raw
      .split('-')
      .map(Number)
      .filter((n) => Number.isInteger(n) && n >= 0 && n < question.options.length)
    if (indexes.length) answers[question.id] = indexes
  }
  return answers
}
