import { defineCategory } from '../types'

export default defineCategory({
  category: {
    id: 'bento',
    name: '便當',
    emoji: '🍱',
    blurb: '一盒搞定主菜、配菜和白飯，上班族的好朋友。',
    traits: { taiwanese: 1, rice: 1, boxed: 1, bowl: 0, veggie: 0.5, pricey: 0 },
    vibes: { warm: 0.5, heavy: 0.7, comfort: 0.8, healthy: -0.1, speed: 0.8, social: -0.6 },
    meals: ['lunch', 'dinner'],
    priceLevel: 1,
  },
  dishes: [
    {
      id: 'pork-chop-bento',
      name: '排骨便當',
      emoji: '🍱',
      traits: { pork: 1, fried: 0.9 },
      vibes: { healthy: -0.4 },
    },
    {
      id: 'chicken-leg-bento',
      name: '雞腿便當',
      emoji: '🍗',
      traits: { chicken: 1, fried: 0.6, grilled: 0.4 },
      vibes: { heavy: 0.9, healthy: -0.3 },
    },
    {
      id: 'braised-pork-bento',
      name: '控肉便當',
      emoji: '🥓',
      traits: { pork: 1, braised: 1, fried: 0 },
      vibes: { heavy: 0.9, healthy: -0.5 },
    },
    {
      id: 'mackerel-bento',
      name: '鯖魚便當',
      emoji: '🐟',
      traits: { seafood: 1, fish: 1, grilled: 1 },
      vibes: { heavy: 0.4, healthy: 0.3 },
    },
    {
      id: 'roast-meat-rice',
      name: '燒臘便當',
      emoji: '🦆',
      traits: { chinese: 1, taiwanese: 0.5, pork: 0.7, duck: 0.6, chicken: 0.4, grilled: 1 },
      vibes: { comfort: 0.5 },
      mapKeyword: '燒臘便當',
    },
    {
      id: 'veggie-bento',
      name: '素食便當',
      emoji: '🥬',
      traits: { meatless: 1, veggie: 1, tofu: 0.7 },
      vibes: { heavy: 0.2, healthy: 0.7 },
    },
  ],
})
