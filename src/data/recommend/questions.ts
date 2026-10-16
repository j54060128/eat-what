import type { SituationalQuestion } from './types'

/** 情境題：每次都會問，負責硬性篩選（用餐時段、預算、忌口）與人數 */
export const SITUATIONAL_QUESTIONS: SituationalQuestion[] = [
  {
    id: 'meal',
    text: '現在要吃哪一餐？',
    options: [
      { emoji: '🌅', label: '早餐', short: '早餐', filter: { meal: 'breakfast' } },
      { emoji: '☀️', label: '午餐', short: '午餐', filter: { meal: 'lunch' } },
      { emoji: '🍰', label: '下午茶', short: '下午茶', filter: { meal: 'tea' } },
      { emoji: '🌙', label: '晚餐', short: '晚餐', filter: { meal: 'dinner' } },
      { emoji: '🦉', label: '宵夜', short: '宵夜', filter: { meal: 'lateNight' } },
    ],
  },
  {
    id: 'budget',
    text: '這一餐的預算大概是？',
    options: [
      { emoji: '💰', label: '銅板價就好（150 元內）', short: '150 元內', filter: { maxPrice: 1 } },
      { emoji: '💵', label: '正常價位（400 元內）', short: '400 元內', filter: { maxPrice: 2 } },
      { emoji: '💎', label: '今天不設限', short: '不限預算', filter: { maxPrice: 3 } },
    ],
  },
  {
    id: 'company',
    text: '這一餐跟誰一起吃？',
    options: [
      {
        emoji: '🙋',
        label: '自己一個人',
        short: '一個人',
        evidence: [{ source: { vibe: 'social' }, target: 0.2 }],
      },
      { emoji: '👫', label: '兩三個人', short: '兩三個人' },
      {
        emoji: '🎉',
        label: '一大群人',
        short: '一大群人',
        evidence: [{ source: { vibe: 'social' }, target: 0.9 }],
      },
    ],
  },
  {
    id: 'diet',
    text: '有什麼不吃的嗎？（可複選）',
    multi: true,
    options: [
      { emoji: '✅', label: '都可以', exclusive: true },
      { emoji: '🥬', label: '吃素', short: '吃素', filter: { vegetarian: true } },
      { emoji: '🐮', label: '不吃牛', short: '不吃牛', filter: { noBeef: true } },
      { emoji: '🐷', label: '不吃豬', short: '不吃豬', filter: { noPork: true } },
      { emoji: '🦐', label: '不吃海鮮', short: '不吃海鮮', filter: { noSeafood: true } },
      { emoji: '🌶️', label: '不吃辣', short: '不吃辣', filter: { noSpicy: true } },
    ],
  },
]

export const SITUATIONAL_BY_ID: Record<string, SituationalQuestion> = Object.fromEntries(
  SITUATIONAL_QUESTIONS.map((q) => [q.id, q]),
)
