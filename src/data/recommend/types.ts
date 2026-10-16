import type { TraitId } from '../traits'
import type { VibeId } from '../vibes'
import type { Meal, PriceLevel } from '../types'

/** 推薦模式的硬性篩選條件 */
export interface Filters {
  meal: Meal | null
  maxPrice: PriceLevel
  vegetarian: boolean
  noBeef: boolean
  noPork: boolean
  noSeafood: boolean
  noSpicy: boolean
}

/** 偏好題對應到料理的哪個值：客觀特徵，或情境維度（vibe） */
export type PreferenceSource = { trait: TraitId } | { vibe: VibeId }

/** 軟性證據：不篩掉料理，只調整機率（例如一大群人 → 偏好適合分享的） */
export interface Evidence {
  source: PreferenceSource
  /** 期望的值（0~1） */
  target: number
}

export interface ChoiceOption {
  emoji: string
  label: string
  /** 結果頁「你的選擇」摘要用的短語；不填就不顯示 */
  short?: string
  filter?: Partial<Filters>
  evidence?: Evidence[]
  /** 多選題裡的「都可以」：選了它就清掉其他選項 */
  exclusive?: boolean
}

/** 情境題：每次都會問，負責硬性篩選 */
export interface SituationalQuestion {
  id: string
  text: string
  multi?: boolean
  options: ChoiceOption[]
}

/** 偏好追問：由神燈依資訊增益挑選，回答「想／有點想／都可以／不太想／不想」 */
export interface PreferenceQuestion {
  id: string
  text: string
  /** 回答「想」時的摘要短語 */
  yes: string
  /** 回答「不想」時的摘要短語 */
  no: string
  source: PreferenceSource
}
