import { defineCategory } from '../types'

export default defineCategory({
  category: {
    id: 'western',
    name: '西式餐廳',
    emoji: '🍝',
    blurb: '義大利麵、燉飯、牛排，來點有氣氛的一餐。',
    traits: { western: 1, bowl: 0.2, sharing: 0.2, pricey: 0.6 },
    vibes: { warm: 0.6, heavy: 0.6, comfort: -0.1, healthy: -0.3, speed: -0.3, social: 0.3 },
    meals: ['lunch', 'dinner'],
    priceLevel: 2,
  },
  dishes: [
    {
      id: 'tomato-pasta',
      name: '紅醬義大利麵',
      emoji: '🍝',
      traits: { noodle: 1, tomato: 1, sour: 0.4 },
    },
    {
      id: 'cream-pasta',
      name: '白醬義大利麵',
      emoji: '🍝',
      traits: { noodle: 1, creamy: 1, cheese: 0.5 },
      vibes: { heavy: 0.8 },
    },
    {
      id: 'pesto-pasta',
      name: '青醬義大利麵',
      emoji: '🌿',
      traits: { noodle: 1, veggie: 0.5 },
      vibes: { heavy: 0.4, healthy: 0 },
    },
    {
      id: 'risotto',
      name: '燉飯',
      emoji: '🥘',
      traits: { rice: 1, creamy: 0.8, cheese: 0.7, braised: 0.4 },
      vibes: { comfort: 0.2 },
    },
    {
      id: 'steak',
      name: '牛排',
      emoji: '🥩',
      traits: { beef: 1, grilled: 1, pricey: 1 },
      vibes: { heavy: 1, speed: -0.6 },
      priceLevel: 3,
    },
    {
      id: 'gratin',
      name: '焗烤',
      emoji: '🧀',
      traits: { cheese: 1, creamy: 0.8, grilled: 0.8, rice: 0.5, noodle: 0.5 },
      vibes: { heavy: 0.9, warm: 0.8, comfort: 0.4 },
      mapKeyword: '焗烤',
    },
  ],
})
