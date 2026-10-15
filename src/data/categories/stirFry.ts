import { defineCategory } from '../types'

export default defineCategory({
  category: {
    id: 'stir-fry',
    name: '熱炒・中式合菜',
    emoji: '🥘',
    blurb: '大火快炒、鑊氣十足，一桌好菜配白飯。',
    traits: { stirFried: 1, sharing: 0.9, rice: 0.3, taiwanese: 0.7, bowl: 0, pricey: 0.4 },
    vibes: { warm: 0.8, heavy: 0.6, comfort: 0.7, healthy: -0.2, speed: 0, social: 1 },
    meals: ['lunch', 'dinner', 'lateNight'],
    priceLevel: 2,
  },
  dishes: [
    {
      id: 'fried-rice',
      name: '炒飯',
      emoji: '🍳',
      traits: { rice: 1, egg: 0.8, pork: 0.5, seafood: 0.4, sharing: 0.3, bowl: 0.3 },
      vibes: { speed: 0.7, social: -0.2 },
      priceLevel: 1,
    },
    {
      id: 'three-cup-chicken',
      name: '三杯雞',
      emoji: '🐓',
      traits: { chicken: 1, braised: 0.6, taiwanese: 1, sweet: 0.3 },
    },
    {
      id: 'kung-pao-chicken',
      name: '宮保雞丁',
      emoji: '🥜',
      traits: { chicken: 1, spicy: 0.7, chinese: 1, taiwanese: 0.4 },
    },
    {
      id: 'mapo-tofu',
      name: '麻婆豆腐',
      emoji: '🌶️',
      traits: { tofu: 1, spicy: 1, pork: 0.6, chinese: 1, rice: 0.5, taiwanese: 0.4 },
    },
    {
      id: 'hakka-stir-fry',
      name: '客家小炒',
      emoji: '🦑',
      traits: { pork: 0.8, seafood: 0.6, tofu: 0.7, taiwanese: 1 },
    },
    {
      id: 'stir-fried-greens',
      name: '炒青菜',
      emoji: '🥬',
      traits: { veggie: 1, meatless: 1 },
      vibes: { heavy: -0.6, healthy: 0.9 },
      mapKeyword: '熱炒',
    },
  ],
})
