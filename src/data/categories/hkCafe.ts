import { defineCategory } from '../types'

export default defineCategory({
  category: {
    id: 'hk-cafe',
    name: '港式茶餐廳',
    emoji: '☕',
    blurb: '奶茶、菠蘿油、焗飯，熱鬧又快速的港式日常。',
    traits: { chinese: 1, sharing: 0.2, pricey: 0.2 },
    vibes: { warm: 0.6, heavy: 0.6, comfort: 0.3, healthy: -0.5, speed: 0.6, social: 0 },
    meals: ['breakfast', 'lunch', 'tea', 'dinner'],
    priceLevel: 2,
  },
  dishes: [
    {
      id: 'pineapple-bun-butter',
      name: '菠蘿油',
      emoji: '🧈',
      traits: { dough: 1, sweet: 0.8, creamy: 1, handheld: 1, breakfast: 0.5 },
      vibes: { heavy: 0.2 },
      meals: ['breakfast', 'tea'],
      priceLevel: 1,
    },
    {
      id: 'hk-french-toast',
      name: '西多士',
      emoji: '🍞',
      traits: { dough: 1, fried: 1, sweet: 0.8, egg: 0.8, creamy: 0.5 },
      meals: ['breakfast', 'tea'],
      priceLevel: 1,
    },
    {
      id: 'beef-chow-fun',
      name: '乾炒牛河',
      emoji: '🥢',
      traits: { noodle: 1, beef: 1, stirFried: 1 },
    },
    {
      id: 'baked-pork-chop-rice',
      name: '焗豬扒飯',
      emoji: '🧀',
      traits: { rice: 1, pork: 1, cheese: 1, tomato: 1, grilled: 0.8, fried: 0.5 },
      vibes: { heavy: 0.9 },
    },
    {
      id: 'spam-egg-noodle',
      name: '餐蛋麵',
      emoji: '🍜',
      traits: { noodle: 1, soup: 1, pork: 0.8, egg: 1, bowl: 1 },
      vibes: { speed: 0.9, social: -0.4 },
      priceLevel: 1,
    },
    {
      id: 'claypot-rice',
      name: '煲仔飯',
      emoji: '🍲',
      traits: { rice: 1, pork: 0.7, chicken: 0.4, steamed: 0.5, sweet: 0.2 },
      vibes: { speed: -0.5 },
    },
  ],
})
