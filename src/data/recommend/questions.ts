import type { RecommendQuestion } from './types'

/** 情境題：每次都會問，負責硬性篩選（用餐時段、預算、忌口）與人數 */
export const SITUATIONAL_QUESTIONS: RecommendQuestion[] = [
  {
    id: 'meal',
    kind: 'situational',
    text: '現在要吃哪一餐？',
    options: [
      { emoji: '🌅', label: '早餐', filter: { meal: 'breakfast' } },
      { emoji: '☀️', label: '午餐', filter: { meal: 'lunch' } },
      { emoji: '🍰', label: '下午茶', filter: { meal: 'tea' } },
      { emoji: '🌙', label: '晚餐', filter: { meal: 'dinner' } },
      { emoji: '🦉', label: '宵夜', filter: { meal: 'lateNight' } },
    ],
  },
  {
    id: 'budget',
    kind: 'situational',
    text: '這一餐的預算大概是？',
    options: [
      { emoji: '💰', label: '銅板價就好（150 元內）', filter: { maxPrice: 1 } },
      { emoji: '💵', label: '正常價位（400 元內）', filter: { maxPrice: 2 } },
      {
        emoji: '💎',
        label: '今天不設限',
        filter: { maxPrice: 3 },
        effect: { vibes: { healthy: -0.1 } },
      },
    ],
  },
  {
    id: 'company',
    kind: 'situational',
    text: '這一餐跟誰一起吃？',
    options: [
      { emoji: '🙋', label: '自己一個人', effect: { vibes: { social: -0.8 } } },
      { emoji: '👫', label: '兩三個人', effect: { vibes: { social: 0.3 } } },
      {
        emoji: '🎉',
        label: '一大群人',
        effect: { vibes: { social: 1 }, traits: { sharing: 0.5 } },
      },
    ],
  },
  {
    id: 'diet',
    kind: 'situational',
    text: '有什麼不吃的嗎？（可複選）',
    multi: true,
    options: [
      { emoji: '✅', label: '都可以', exclusive: true },
      { emoji: '🥬', label: '吃素', filter: { vegetarian: true } },
      { emoji: '🐮', label: '不吃牛', filter: { noBeef: true } },
      { emoji: '🐷', label: '不吃豬', filter: { noPork: true } },
      { emoji: '🦐', label: '不吃海鮮', filter: { noSeafood: true } },
      { emoji: '🌶️', label: '不吃辣', filter: { noSpicy: true }, effect: { vibes: { spicy: -1 } } },
    ],
  },
]

/** 趣味題（心理測驗）：每次從題庫隨機抽幾題，選項只會調整口味傾向，不做硬性篩選 */
export const FUN_QUESTIONS: RecommendQuestion[] = [
  {
    id: 'weather',
    kind: 'fun',
    text: '現在的你，像哪一種天氣？',
    options: [
      {
        emoji: '☀️',
        label: '萬里無雲的大晴天',
        effect: { vibes: { warm: -0.3, heavy: -0.3, comfort: -0.3 } },
      },
      {
        emoji: '🌧️',
        label: '綿綿細雨',
        effect: { vibes: { warm: 0.6, comfort: 0.5 }, traits: { soup: 0.4 } },
      },
      { emoji: '⛈️', label: '雷雨交加', effect: { vibes: { spicy: 0.6, heavy: 0.4 } } },
      { emoji: '🌫️', label: '霧濛濛看不清', effect: { vibes: { comfort: 0.6, speed: 0.3 } } },
    ],
  },
  {
    id: 'battery',
    kind: 'fun',
    text: '今天的電量還剩多少？',
    options: [
      {
        emoji: '🔋',
        label: '滿格，還能再戰',
        effect: { vibes: { comfort: -0.4, social: 0.4, heavy: 0.2 } },
      },
      {
        emoji: '🥱',
        label: '快沒電了',
        effect: { vibes: { comfort: 0.7, heavy: 0.5, warm: 0.4 } },
      },
      { emoji: '⚡', label: '忽高忽低', effect: { vibes: { spicy: 0.4, speed: 0.4 } } },
    ],
  },
  {
    id: 'teleport',
    kind: 'fun',
    text: '如果現在能瞬間移動，你想去哪裡？',
    options: [
      {
        emoji: '🏖️',
        label: '南國海邊',
        effect: { vibes: { warm: -0.6, healthy: 0.3 }, traits: { seafood: 0.5, seAsian: 0.4 } },
      },
      {
        emoji: '🏔️',
        label: '雪山小木屋',
        effect: { vibes: { warm: 0.9, heavy: 0.5 }, traits: { soup: 0.5 } },
      },
      {
        emoji: '🗼',
        label: '東京街頭',
        effect: { vibes: { comfort: -0.4 }, traits: { japanese: 0.8 } },
      },
      {
        emoji: '🛏️',
        label: '自己的床上',
        effect: { vibes: { comfort: 0.8, speed: 0.6, social: -0.5 } },
      },
    ],
  },
  {
    id: 'music',
    kind: 'fun',
    text: '選一首今天的背景音樂',
    options: [
      { emoji: '🎸', label: '熱血搖滾', effect: { vibes: { spicy: 0.6, heavy: 0.5 } } },
      {
        emoji: '🎻',
        label: '優雅古典',
        effect: { vibes: { speed: -0.7, healthy: 0.3 }, traits: { western: 0.4 } },
      },
      { emoji: '🎧', label: '慵懶 Lo-fi', effect: { vibes: { comfort: 0.6, social: -0.4 } } },
      {
        emoji: '🕺',
        label: '派對舞曲',
        effect: { vibes: { social: 0.9 }, traits: { fried: 0.3 } },
      },
    ],
  },
  {
    id: 'hunger',
    kind: 'fun',
    text: '肚子現在的狀態是？',
    options: [
      { emoji: '🤤', label: '餓到前胸貼後背', effect: { vibes: { heavy: 1, speed: 0.5 } } },
      { emoji: '🙂', label: '有點餓', effect: { vibes: { heavy: 0.2 } } },
      {
        emoji: '🤏',
        label: '只是嘴饞',
        effect: { vibes: { heavy: -0.8 }, traits: { sweet: 0.3 } },
      },
    ],
  },
  {
    id: 'adventure',
    kind: 'fun',
    text: '今天想冒險一下嗎？',
    options: [
      { emoji: '🧭', label: '來點沒吃過的', effect: { vibes: { comfort: -1 } } },
      { emoji: '🏠', label: '熟悉的味道最安心', effect: { vibes: { comfort: 1 } } },
      { emoji: '🎲', label: '看神燈心情', effect: {} },
    ],
  },
  {
    id: 'pace',
    kind: 'fun',
    text: '最近的生活節奏像？',
    options: [
      { emoji: '🏃', label: '一直在趕趕趕', effect: { vibes: { speed: 0.9 } } },
      { emoji: '🐢', label: '悠悠哉哉', effect: { vibes: { speed: -0.8, social: 0.2 } } },
      { emoji: '🌀', label: '一團混亂', effect: { vibes: { comfort: 0.6, spicy: 0.3 } } },
    ],
  },
  {
    id: 'color',
    kind: 'fun',
    text: '用一個顏色形容現在的心情',
    options: [
      { emoji: '🔴', label: '熱情紅', effect: { vibes: { spicy: 0.8, heavy: 0.3 } } },
      { emoji: '🟢', label: '清新綠', effect: { vibes: { healthy: 0.9, heavy: -0.5 } } },
      { emoji: '🟡', label: '溫暖黃', effect: { vibes: { comfort: 0.6, warm: 0.5 } } },
      { emoji: '🔵', label: '冷靜藍', effect: { vibes: { warm: -0.7, heavy: -0.3 } } },
    ],
  },
  {
    id: 'guilt',
    kind: 'fun',
    text: '最近對身體的愧疚感有多少？',
    options: [
      {
        emoji: '😇',
        label: '吃太多了，該收斂',
        effect: { vibes: { healthy: 1, heavy: -0.6 }, traits: { fried: -0.6 } },
      },
      {
        emoji: '😈',
        label: '人生苦短，吃了再說',
        effect: { vibes: { healthy: -1, heavy: 0.6 }, traits: { fried: 0.4 } },
      },
      { emoji: '😐', label: '還好，普普通通', effect: {} },
    ],
  },
  {
    id: 'afterfeel',
    kind: 'fun',
    text: '吃完之後，你希望是什麼感覺？',
    options: [
      {
        emoji: '😌',
        label: '暖到心裡',
        effect: { vibes: { warm: 0.8, comfort: 0.6 }, traits: { soup: 0.4 } },
      },
      { emoji: '🤩', label: '超級過癮', effect: { vibes: { spicy: 0.6, heavy: 0.6 } } },
      { emoji: '🍃', label: '輕盈沒負擔', effect: { vibes: { heavy: -0.9, healthy: 0.7 } } },
      { emoji: '😴', label: '飽到想睡', effect: { vibes: { heavy: 1, healthy: -0.4 } } },
    ],
  },
  {
    id: 'want',
    kind: 'fun',
    text: '你現在最想要的是？',
    options: [
      { emoji: '🤗', label: '一個擁抱', effect: { vibes: { comfort: 0.9, warm: 0.5 } } },
      { emoji: '🎢', label: '一點刺激', effect: { vibes: { spicy: 0.7, comfort: -0.5 } } },
      {
        emoji: '🧘',
        label: '一點平靜',
        effect: { vibes: { healthy: 0.5, spicy: -0.6, heavy: -0.3 } },
      },
      { emoji: '🗣️', label: '有人陪我聊天', effect: { vibes: { social: 0.9, speed: -0.4 } } },
    ],
  },
  {
    id: 'temperature',
    kind: 'fun',
    text: '外面的天氣感覺？',
    options: [
      { emoji: '🥵', label: '熱到快融化', effect: { vibes: { warm: -1 }, traits: { cold: 0.7 } } },
      { emoji: '😊', label: '剛剛好', effect: {} },
      { emoji: '🥶', label: '冷到發抖', effect: { vibes: { warm: 1 }, traits: { soup: 0.6 } } },
    ],
  },
  {
    id: 'animal',
    kind: 'fun',
    text: '選一隻代表你現在狀態的動物',
    options: [
      {
        emoji: '🐱',
        label: '慵懶的貓',
        effect: { vibes: { comfort: 0.6, speed: -0.3, social: -0.5 } },
      },
      { emoji: '🐶', label: '熱情的狗', effect: { vibes: { social: 0.8, heavy: 0.3 } } },
      {
        emoji: '🐯',
        label: '霸氣的老虎',
        effect: { vibes: { spicy: 0.7, heavy: 0.6 }, traits: { beef: 0.4 } },
      },
      {
        emoji: '🐰',
        label: '輕巧的兔子',
        effect: { vibes: { heavy: -0.7, healthy: 0.6 }, traits: { veggie: 0.5 } },
      },
    ],
  },
  {
    id: 'patience',
    kind: 'fun',
    text: '等餐的耐心大概有多少？',
    options: [
      { emoji: '⏱️', label: '三分鐘都嫌久', effect: { vibes: { speed: 1 } } },
      { emoji: '☕', label: '等一下沒關係', effect: {} },
      { emoji: '🍷', label: '慢慢來，享受過程', effect: { vibes: { speed: -0.9, social: 0.3 } } },
    ],
  },
  {
    id: 'taste',
    kind: 'fun',
    text: '如果味蕾會說話，它現在在喊什麼？',
    options: [
      {
        emoji: '🧂',
        label: '我要鹹香重口味',
        effect: { vibes: { heavy: 0.6, healthy: -0.4 }, traits: { braised: 0.4 } },
      },
      {
        emoji: '🍋',
        label: '酸酸的才開胃',
        effect: { vibes: { heavy: -0.4 }, traits: { sour: 0.9 } },
      },
      { emoji: '🌶️', label: '給我辣！', effect: { vibes: { spicy: 1 } } },
      {
        emoji: '🍬',
        label: '甜的甜的甜的',
        effect: { vibes: { comfort: 0.3 }, traits: { sweet: 1 } },
      },
    ],
  },
  {
    id: 'carb',
    kind: 'fun',
    text: '今天的主食魂是？',
    options: [
      { emoji: '🍚', label: '白飯派', effect: { traits: { rice: 0.9 } } },
      { emoji: '🍜', label: '麵食派', effect: { traits: { noodle: 0.9 } } },
      { emoji: '🥟', label: '麵皮包餡派', effect: { traits: { dough: 0.6, filled: 0.5 } } },
      { emoji: '🤷', label: '都可以', effect: {} },
    ],
  },
]

export const ALL_RECOMMEND_QUESTIONS = [...SITUATIONAL_QUESTIONS, ...FUN_QUESTIONS]

export const RECOMMEND_QUESTION_BY_ID: Record<string, RecommendQuestion> = Object.fromEntries(
  ALL_RECOMMEND_QUESTIONS.map((q) => [q.id, q]),
)

/** 每次測驗抽幾題趣味題 */
export const FUN_QUESTION_COUNT = 5
