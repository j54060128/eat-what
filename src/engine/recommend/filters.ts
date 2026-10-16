import type { ResolvedDish } from '@/data/types'
import type { Filters } from '@/data/recommend/types'

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
