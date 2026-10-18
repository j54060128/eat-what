import { TRAITS, type TraitId } from './traits'
import { VIBE_IDS, zeroVibes, type VibeVector } from './vibes'
import type { Category, CategoryModule, Dish, ResolvedDish } from './types'

import twRice from './categories/twRice'
import bento from './categories/bento'
import twNoodle from './categories/twNoodle'
import soupCongee from './categories/soupCongee'
import nightMarket from './categories/nightMarket'
import convenience from './categories/convenience'
import breakfast from './categories/breakfast'
import stirFry from './categories/stirFry'
import hakka from './categories/hakka'
import dimSum from './categories/dimSum'
import hkCafe from './categories/hkCafe'
import ramen from './categories/ramen'
import donburi from './categories/donburi'
import sushi from './categories/sushi'
import hotpot from './categories/hotpot'
import bbq from './categories/bbq'
import korean from './categories/korean'
import seAsian from './categories/seAsian'
import indianMideast from './categories/indianMideast'
import fastFood from './categories/fastFood'
import american from './categories/american'
import western from './categories/western'
import brunch from './categories/brunch'
import healthy from './categories/healthy'
import bakery from './categories/bakery'
import dessert from './categories/dessert'
import drinks from './categories/drinks'

/** 新增類型時：在 categories/ 建一個檔案，再加進這個陣列 */
export const CATEGORY_MODULES: CategoryModule[] = [
  twRice,
  bento,
  twNoodle,
  soupCongee,
  nightMarket,
  convenience,
  breakfast,
  stirFry,
  hakka,
  dimSum,
  hkCafe,
  ramen,
  donburi,
  sushi,
  hotpot,
  bbq,
  korean,
  seAsian,
  indianMideast,
  fastFood,
  american,
  western,
  brunch,
  healthy,
  bakery,
  dessert,
  drinks,
]

export const CATEGORIES: Category[] = CATEGORY_MODULES.map((m) => m.category)

export const RAW_DISHES: Dish[] = CATEGORY_MODULES.flatMap((m) =>
  m.dishes.map((d) => ({ ...d, categoryId: m.category.id })),
)

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
