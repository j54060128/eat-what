import type { TraitId, TraitMap } from './traits'
import type { VibeMap, VibeVector } from './vibes'

/** 用餐時段，推薦模式的硬性篩選條件 */
export type Meal = 'breakfast' | 'lunch' | 'dinner' | 'tea' | 'lateNight'

/** 價位：1 = 150 元內、2 = 150~400 元、3 = 400 元以上 */
export type PriceLevel = 1 | 2 | 3

export interface Category {
  id: string
  name: string
  emoji: string
  /** 一句話介紹，顯示在猜中類型時 */
  blurb: string
  traits: TraitMap
  vibes: VibeMap
  meals: Meal[]
  priceLevel: PriceLevel
}

export interface Dish {
  id: string
  name: string
  emoji: string
  categoryId: string
  /** 覆寫／補充類型的特徵 */
  traits?: TraitMap
  /** 覆寫／補充類型的 vibe */
  vibes?: VibeMap
  /** 不填就沿用類型的設定 */
  meals?: Meal[]
  priceLevel?: PriceLevel
  /** Google Maps 搜尋關鍵字，不填就用料理名稱 */
  mapKeyword?: string
}

/** 一個類型檔案＝類型本身＋底下的料理（料理的 categoryId 由 index.ts 自動補上） */
export interface CategoryModule {
  category: Category
  dishes: Omit<Dish, 'categoryId'>[]
}

export function defineCategory(module: CategoryModule): CategoryModule {
  return module
}

/** 解析繼承後的料理，引擎只吃這個型別 */
export interface ResolvedDish {
  id: string
  name: string
  emoji: string
  categoryId: string
  traits: Record<TraitId, number>
  vibes: VibeVector
  meals: Meal[]
  priceLevel: PriceLevel
  mapKeyword: string
}
