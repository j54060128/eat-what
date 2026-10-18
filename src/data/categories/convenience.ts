import { defineCategory } from '../types'

export default defineCategory({
  category: {
    id: 'convenience',
    name: '便利商店',
    emoji: '🏪',
    blurb: '走出門轉角就有，24 小時都能解決一餐。',
    traits: { convenienceStore: 1, taiwanese: 0.7, sharing: 0, pricey: 0 },
    vibes: { warm: 0.3, heavy: 0, comfort: 0.8, healthy: -0.3, speed: 1, social: -0.8 },
    meals: ['breakfast', 'lunch', 'tea', 'dinner', 'lateNight'],
    priceLevel: 1,
  },
  dishes: [
    {
      id: 'oden',
      name: '關東煮',
      emoji: '🍢',
      traits: {
        soup: 1,
        japanese: 0.6,
        chewy: 0.6,
        seafood: 0.5,
        tofu: 0.5,
        egg: 0.4,
        veggie: 0.5,
        skewer: 0.6,
        bowl: 0.8,
      },
      vibes: { warm: 0.9, heavy: -0.2, healthy: 0.2 },
    },
    {
      id: 'tea-egg',
      name: '茶葉蛋',
      emoji: '🥚',
      traits: { egg: 1, braised: 1, handheld: 0.6, bowl: 0 },
      vibes: { warm: 0.6, heavy: -0.6, healthy: 0.2 },
    },
    {
      id: 'onigiri',
      name: '御飯糰',
      emoji: '🍙',
      traits: { rice: 1, japanese: 0.6, taiwanese: 0.4, cold: 0.6, seafood: 0.5, handheld: 1 },
      vibes: { warm: -0.3, heavy: 0.2 },
    },
    {
      id: 'roasted-sweet-potato',
      name: '烤地瓜',
      emoji: '🍠',
      traits: { meatless: 1, sweet: 0.8, grilled: 1, handheld: 1, veggie: 0.5 },
      vibes: { warm: 0.7, heavy: 0, healthy: 0.6 },
    },
    {
      id: 'big-bite',
      name: '大亨堡',
      emoji: '🌭',
      traits: { dough: 1, pork: 0.8, grilled: 0.6, handheld: 1 },
      vibes: { heavy: 0.4, healthy: -0.6 },
    },
    {
      id: 'microwave-bento',
      name: '微波便當',
      emoji: '🍱',
      traits: { rice: 1, boxed: 1, pork: 0.5, chicken: 0.4, bowl: 0 },
      vibes: { warm: 0.6, heavy: 0.6 },
    },
  ],
})
