import { defineCategory } from '../types'

export default defineCategory({
  category: {
    id: 'bakery',
    name: '麵包烘焙',
    emoji: '🥐',
    blurb: '剛出爐的麵包香，隨手帶一個就出門。',
    traits: {
      dough: 1,
      handheld: 1,
      grilled: 0.6,
      breakfast: 0.6,
      taiwanese: 0.5,
      bowl: 0,
      pricey: 0,
    },
    vibes: { warm: 0.2, heavy: 0.1, comfort: 0.7, healthy: -0.4, speed: 1, social: -0.3 },
    meals: ['breakfast', 'tea'],
    priceLevel: 1,
  },
  dishes: [
    {
      id: 'pineapple-bun',
      name: '菠蘿麵包',
      emoji: '🍍',
      traits: { sweet: 0.8, taiwanese: 0.8, creamy: 0.3 },
    },
    {
      id: 'croissant',
      name: '可頌',
      emoji: '🥐',
      traits: { creamy: 1, western: 1, taiwanese: 0, sweet: 0.3 },
      vibes: { comfort: 0.2 },
    },
    {
      id: 'pork-floss-bun',
      name: '肉鬆麵包',
      emoji: '🍞',
      traits: { pork: 1, taiwanese: 1, sweet: 0.4, creamy: 0.5 },
    },
    {
      id: 'scallion-bread',
      name: '蔥花麵包',
      emoji: '🥖',
      traits: { veggie: 0.4, taiwanese: 1, meatless: 0.8, sweet: 0.1 },
    },
    {
      id: 'egg-tart',
      name: '蛋塔',
      emoji: '🥧',
      traits: { egg: 1, sweet: 1, creamy: 0.8, filled: 0.6, chinese: 0.5, taiwanese: 0.3 },
    },
    {
      id: 'donut',
      name: '甜甜圈',
      emoji: '🍩',
      traits: { fried: 1, sweet: 1, western: 1, taiwanese: 0 },
    },
    {
      id: 'cinnamon-roll',
      name: '肉桂捲',
      emoji: '🌀',
      traits: { sweet: 1, western: 1, taiwanese: 0, creamy: 0.6 },
    },
  ],
})
