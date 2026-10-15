import type { TraitMap } from '../traits'
import type { VibeMap } from '../vibes'
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

/** 選項對玩家「口味向量」的影響 */
export interface Effect {
  /** 情境維度的增量 */
  vibes?: VibeMap
  /** 對料理特徵的偏好（-1 ~ 1），例如 sweet: 1 代表想吃甜的 */
  traits?: TraitMap
}

export interface ChoiceOption {
  emoji: string
  label: string
  effect?: Effect
  filter?: Partial<Filters>
  /** 多選題裡的「都可以」：選了它就清掉其他選項 */
  exclusive?: boolean
}

export interface RecommendQuestion {
  id: string
  kind: 'situational' | 'fun'
  text: string
  multi?: boolean
  options: ChoiceOption[]
}

export interface Persona {
  id: string
  emoji: string
  name: string
  description: string
  /** 人格的 vibe 原型，玩家向量和它越像就越可能是這個人格 */
  prototype: VibeMap
}
