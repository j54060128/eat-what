import { defineCategory } from '../types'

export default defineCategory({
  category: {
    id: 'fast-food',
    name: '速食',
    emoji: '🍔',
    blurb: '點了馬上拿，罪惡又快樂的速食時光。',
    traits: { western: 1, fried: 0.6, handheld: 0.8, bowl: 0, pricey: 0 },
    vibes: { warm: 0.4, heavy: 0.8, comfort: 0.6, healthy: -0.9, speed: 1, social: 0 },
    meals: ['lunch', 'dinner', 'tea', 'lateNight'],
    priceLevel: 1,
  },
  dishes: [
    {
      id: 'burger',
      name: '漢堡',
      emoji: '🍔',
      traits: { dough: 1, beef: 0.8, cheese: 0.6, grilled: 0.6, fried: 0.2 },
    },
    {
      id: 'fried-chicken',
      name: '炸雞',
      emoji: '🍗',
      traits: { chicken: 1, fried: 1, sharing: 0.5 },
    },
    {
      id: 'pizza',
      name: '披薩',
      emoji: '🍕',
      traits: { dough: 1, cheese: 1, tomato: 1, grilled: 1, fried: 0, sharing: 0.8, handheld: 0.6 },
      vibes: { social: 0.7, speed: 0.4 },
      priceLevel: 2,
    },
    {
      id: 'submarine',
      name: '潛艇堡',
      emoji: '🥖',
      traits: { dough: 1, veggie: 0.7, fried: 0, cold: 0.4 },
      vibes: { warm: 0, heavy: 0.4, healthy: 0 },
    },
    {
      id: 'hot-dog',
      name: '熱狗堡',
      emoji: '🌭',
      traits: { convenienceStore: 0.5, dough: 1, pork: 0.8, grilled: 0.5, fried: 0.2 },
      vibes: { heavy: 0.5 },
    },
  ],
})
