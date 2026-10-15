import type { TraitId } from '../traits'
import type { Persona } from './types'

export const PERSONAS: Persona[] = [
  {
    id: 'cozy',
    emoji: '🛋️',
    name: '需要被抱抱的療癒系',
    description: '今天的你需要一點溫暖。熱呼呼、吃了會安心的食物，就是最好的充電器。',
    prototype: { warm: 0.7, comfort: 1, heavy: 0.3 },
  },
  {
    id: 'fiery',
    emoji: '🔥',
    name: '熱血沸騰的重口味派',
    description: '能量滿點、想要刺激！今天就該吃點夠味、夠辣、夠過癮的。',
    prototype: { spicy: 1, heavy: 0.6 },
  },
  {
    id: 'explorer',
    emoji: '🧭',
    name: '好奇心爆棚的美食探險家',
    description: '平常吃的已經滿足不了你，今天適合嘗試一點新鮮的異國風味。',
    prototype: { comfort: -1, social: 0.2 },
  },
  {
    id: 'light',
    emoji: '🍃',
    name: '自律清爽的輕盈派',
    description: '身體會跟你說謝謝。清爽、少負擔的一餐，讓你吃完更有精神。',
    prototype: { healthy: 1, heavy: -0.7 },
  },
  {
    id: 'rush',
    emoji: '⚡',
    name: '分秒必爭的效率派',
    description: '時間就是一切！快速、方便、不用等，吃飽就能繼續衝。',
    prototype: { speed: 1, social: -0.3 },
  },
  {
    id: 'party',
    emoji: '🎉',
    name: '揪團吃飯的派對咖',
    description: '一個人吃飯太無聊，今天適合大家圍在一起，邊吃邊聊。',
    prototype: { social: 1, speed: -0.4 },
  },
  {
    id: 'chill',
    emoji: '🧊',
    name: '需要降溫的冷靜派',
    description: '心裡和外面都有點熱，來點冰涼清爽的，讓自己冷靜一下。',
    prototype: { warm: -1, heavy: -0.3 },
  },
  {
    id: 'indulge',
    emoji: '👑',
    name: '今天要犒賞自己的享樂派',
    description: '辛苦了！今天不算熱量，好好享受一頓豐盛的大餐。',
    prototype: { healthy: -1, heavy: 0.8, speed: -0.4 },
  },
]

/** 回答都很中性、看不出傾向時的人格 */
export const FALLBACK_PERSONA: Persona = {
  id: 'zen',
  emoji: '🍀',
  name: '隨遇而安的佛系吃貨',
  description: '什麼都好、什麼都可以——那就讓神燈幫你挑個剛剛好的吧。',
  prototype: {},
}

export const PERSONA_BY_ID: Record<string, Persona> = Object.fromEntries(
  [...PERSONAS, FALLBACK_PERSONA].map((p) => [p.id, p]),
)

/** 推薦理由用：玩家對某個特徵有偏好時的說法 */
export const TRAIT_PREFERENCE_LABELS: Partial<Record<TraitId, string>> = {
  sweet: '想吃點甜的',
  sour: '想吃酸酸開胃的',
  soup: '想喝口熱湯',
  cold: '想吃冰涼的',
  rice: '今天是白飯派',
  noodle: '今天是麵食派',
  dough: '想吃麵皮包餡的',
  seafood: '想吃海味',
  japanese: '心在東京',
  seAsian: '想來點南洋風',
  western: '想吃得優雅一點',
  braised: '想吃鹹香重口味',
  sharing: '適合大家分著吃',
  veggie: '想多吃點菜',
  beef: '想吃肉',
}
