import type { TraitId } from '@/data/traits'
import { VIBE_BY_ID, VIBE_IDS } from '@/data/vibes'
import type { Category, ResolvedDish } from '@/data/types'
import type { Filters, Persona } from '@/data/recommend/types'
import { FALLBACK_PERSONA, PERSONAS, TRAIT_PREFERENCE_LABELS } from '@/data/recommend/personas'
import { getCategory } from '@/data'
import { weightedPick, type Rng } from '../random'
import type { Profile } from './profile'

/** 特徵偏好在總分中的權重（相對於 vibe） */
const TRAIT_WEIGHT = 0.6
/** softmax 溫度：越高推薦越隨機，越低越固定推最高分 */
export const DEFAULT_TEMPERATURE = 0.5

export function passesFilters(
  dish: ResolvedDish,
  filters: Filters,
  relax: { meal?: boolean; price?: boolean } = {},
): boolean {
  if (!relax.meal && filters.meal && !dish.meals.includes(filters.meal)) return false
  if (!relax.price && dish.priceLevel > filters.maxPrice) return false
  if (filters.vegetarian && dish.traits.meatless < 0.75) return false
  if (filters.noBeef && dish.traits.beef >= 0.5) return false
  if (filters.noPork && dish.traits.pork >= 0.5) return false
  if (filters.noSeafood && dish.traits.seafood >= 0.5) return false
  if (filters.noSpicy && dish.traits.spicy >= 0.6) return false
  return true
}

export type Relaxation = 'none' | 'price' | 'meal' | 'both'

/** 套用篩選；條件太嚴找不到料理時，依序放寬預算、用餐時段（忌口永遠不放寬） */
export function eligibleDishes(
  dishes: ResolvedDish[],
  filters: Filters,
): { dishes: ResolvedDish[]; relaxed: Relaxation } {
  const steps: [Relaxation, { meal?: boolean; price?: boolean }][] = [
    ['none', {}],
    ['price', { price: true }],
    ['meal', { meal: true }],
    ['both', { meal: true, price: true }],
  ]
  for (const [relaxed, relax] of steps) {
    const result = dishes.filter((d) => passesFilters(d, filters, relax))
    if (result.length > 0) return { dishes: result, relaxed }
  }
  return { dishes: [], relaxed: 'both' }
}

interface ScoreDetail {
  total: number
  /** 每個理由的貢獻分數，用來產生推薦理由 */
  parts: { label: string; value: number }[]
}

export function scoreDish(dish: ResolvedDish, profile: Profile): ScoreDetail {
  const parts: ScoreDetail['parts'] = []
  let total = 0

  for (const id of VIBE_IDS) {
    const want = profile.vibes[id]
    const value = want * dish.vibes[id]
    total += value
    if (Math.abs(want) >= 0.3) {
      parts.push({ label: want > 0 ? VIBE_BY_ID[id].positive : VIBE_BY_ID[id].negative, value })
    }
  }

  for (const id of Object.keys(profile.traits) as TraitId[]) {
    const want = profile.traits[id] ?? 0
    const value = TRAIT_WEIGHT * want * (2 * dish.traits[id] - 1)
    total += value
    const label = TRAIT_PREFERENCE_LABELS[id]
    if (label && want > 0.2) parts.push({ label, value })
  }

  return { total, parts }
}

export function reasonsFor(dish: ResolvedDish, profile: Profile, max = 3): string[] {
  return scoreDish(dish, profile)
    .parts.filter((p) => p.value >= 0.15)
    .sort((a, b) => b.value - a.value)
    .slice(0, max)
    .map((p) => p.label)
}

function cosine(a: number[], b: number[]): number {
  const dot = a.reduce((s, x, i) => s + x * b[i]!, 0)
  const na = Math.hypot(...a)
  const nb = Math.hypot(...b)
  return na && nb ? dot / (na * nb) : 0
}

/** 找出和玩家口味向量最像的人格 */
export function pickPersona(profile: Profile): Persona {
  const user = VIBE_IDS.map((id) => profile.vibes[id])
  if (Math.hypot(...user) < 0.5) return FALLBACK_PERSONA
  let best = FALLBACK_PERSONA
  let bestSim = -Infinity
  for (const p of PERSONAS) {
    const sim = cosine(
      user,
      VIBE_IDS.map((id) => p.prototype[id] ?? 0),
    )
    if (sim > bestSim) {
      bestSim = sim
      best = p
    }
  }
  return best
}

export interface Recommendation {
  dish: ResolvedDish
  category: Category
  /** 同類型的其他選擇 */
  sameCategory: ResolvedDish[]
  /** 換換口味：其他類型各挑一道最高分的 */
  otherCategories: ResolvedDish[]
  reasons: string[]
  persona: Persona
  relaxed: Relaxation
}

/**
 * 產生推薦。主推料理用 softmax 依分數抽樣，讓相近分數的料理都有機會出現；
 * 指定 dishId（例如從分享連結進來）時直接用該料理。
 */
export function recommend(
  dishes: ResolvedDish[],
  profile: Profile,
  options: { rng: Rng; exclude?: Set<string>; dishId?: string; temperature?: number },
): Recommendation | null {
  const { dishes: pool, relaxed } = eligibleDishes(dishes, profile.filters)
  const scored = pool
    .map((d) => ({ dish: d, score: scoreDish(d, profile).total }))
    .sort((a, b) => b.score - a.score)
  if (scored.length === 0) return null

  let main = options.dishId ? dishes.find((d) => d.id === options.dishId) : undefined
  if (!main) {
    const candidates = scored.filter((s) => !options.exclude?.has(s.dish.id))
    const usable = candidates.length > 0 ? candidates : scored
    const t = options.temperature ?? DEFAULT_TEMPERATURE
    const top = usable[0]!.score
    const index = weightedPick(
      usable.map((s) => Math.exp((s.score - top) / t)),
      options.rng,
    )
    main = usable[index]!.dish
  }

  const others = scored.filter((s) => s.dish.id !== main.id)
  const sameCategory = others
    .filter((s) => s.dish.categoryId === main.categoryId)
    .slice(0, 2)
    .map((s) => s.dish)
  const seen = new Set([main.categoryId])
  const otherCategories: ResolvedDish[] = []
  for (const s of others) {
    if (seen.has(s.dish.categoryId)) continue
    seen.add(s.dish.categoryId)
    otherCategories.push(s.dish)
    if (otherCategories.length >= 3) break
  }

  const reasons = reasonsFor(main, profile)
  return {
    dish: main,
    category: getCategory(main.categoryId),
    sameCategory,
    otherCategories,
    reasons: reasons.length ? reasons : ['神燈覺得這道剛剛好'],
    persona: pickPersona(profile),
    relaxed,
  }
}
