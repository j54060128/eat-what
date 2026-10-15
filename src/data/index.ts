import { TRAITS, type TraitId } from './traits'
import { VIBE_IDS, zeroVibes, type VibeVector } from './vibes'
import type { Category, CategoryModule, Dish, ResolvedDish } from './types'

import twRice from './categories/twRice'
import bento from './categories/bento'
import twNoodle from './categories/twNoodle'
import nightMarket from './categories/nightMarket'
import breakfast from './categories/breakfast'
import stirFry from './categories/stirFry'
import dimSum from './categories/dimSum'
import ramen from './categories/ramen'
import donburi from './categories/donburi'
import sushi from './categories/sushi'
import hotpot from './categories/hotpot'
import bbq from './categories/bbq'
import korean from './categories/korean'
import seAsian from './categories/seAsian'
import fastFood from './categories/fastFood'
import western from './categories/western'
import healthy from './categories/healthy'
import dessert from './categories/dessert'

/** 新增類型時：在 categories/ 建一個檔案，再加進這個陣列 */
export const CATEGORY_MODULES: CategoryModule[] = [
  twRice,
  bento,
  twNoodle,
  nightMarket,
  breakfast,
  stirFry,
  dimSum,
  ramen,
  donburi,
  sushi,
  hotpot,
  bbq,
  korean,
  seAsian,
  fastFood,
  western,
  healthy,
  dessert,
]

export const CATEGORIES: Category[] = CATEGORY_MODULES.map((m) => m.category)

export const RAW_DISHES: Dish[] = CATEGORY_MODULES.flatMap((m) =>
  m.dishes.map((d) => ({ ...d, categoryId: m.category.id })),
)

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

/** 解析繼承：特徵預設值 → 類型 → 料理覆寫 */
export function resolveDish(dish: Dish, category: Category): ResolvedDish {
  const traits = {} as Record<TraitId, number>
  for (const t of TRAITS) {
    traits[t.id] = dish.traits?.[t.id] ?? category.traits[t.id] ?? t.default
  }

  const vibes: VibeVector = zeroVibes()
  for (const id of VIBE_IDS) {
    vibes[id] = dish.vibes?.[id] ?? category.vibes[id] ?? 0
  }
  // 辣度的 vibe 沒特別寫的話，直接由「辣」特徵換算（0~1 → -1~1）
  if (dish.vibes?.spicy === undefined && category.vibes.spicy === undefined) {
    vibes.spicy = clamp(traits.spicy * 2 - 1, -1, 1)
  }

  return {
    id: dish.id,
    name: dish.name,
    emoji: dish.emoji,
    categoryId: category.id,
    traits,
    vibes,
    meals: dish.meals ?? category.meals,
    priceLevel: dish.priceLevel ?? category.priceLevel,
    mapKeyword: dish.mapKeyword ?? dish.name,
  }
}

export const CATEGORY_BY_ID: Record<string, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
)

export const DISHES: ResolvedDish[] = RAW_DISHES.map((d) => {
  const category = CATEGORY_BY_ID[d.categoryId]
  if (!category) throw new Error(`料理 ${d.id} 的類型 ${d.categoryId} 不存在`)
  return resolveDish(d, category)
})

export const DISH_BY_ID: Record<string, ResolvedDish> = Object.fromEntries(
  DISHES.map((d) => [d.id, d]),
)

export function getCategory(id: string): Category {
  const c = CATEGORY_BY_ID[id]
  if (!c) throw new Error(`找不到類型 ${id}`)
  return c
}

export function getDish(id: string): ResolvedDish {
  const d = DISH_BY_ID[id]
  if (!d) throw new Error(`找不到料理 ${id}`)
  return d
}

export function googleMapsUrl(dish: ResolvedDish): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(dish.mapKeyword)}`
}
