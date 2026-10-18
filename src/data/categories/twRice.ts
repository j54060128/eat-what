import { defineCategory } from '../types'

export default defineCategory({
  category: {
    id: 'tw-rice',
    name: '台式飯食',
    emoji: '🍚',
    blurb: '一碗白飯配上滷汁，台灣人的靈魂食物。',
    traits: { taiwanese: 1, rice: 1, bowl: 0.8, braised: 0.6, veggie: 0.1, pricey: 0, sharing: 0 },
    vibes: { warm: 0.6, heavy: 0.6, comfort: 0.9, healthy: -0.3, speed: 0.7, social: -0.4 },
    meals: ['lunch', 'dinner', 'lateNight'],
    priceLevel: 1,
  },
  dishes: [
    {
      id: 'braised-pork-rice',
      name: '滷肉飯',
      emoji: '🍚',
      traits: { pork: 1, braised: 1, nightMarket: 0.6 },
    },
    {
      id: 'chicken-rice',
      name: '雞肉飯',
      emoji: '🍗',
      traits: { chicken: 1, braised: 0.3 },
      vibes: { heavy: 0.3, healthy: 0 },
    },
    {
      id: 'tube-rice-pudding',
      name: '筒仔米糕',
      emoji: '🍘',
      traits: { chewy: 0.5, glutinous: 1, steamed: 1, pork: 0.8, braised: 0.5, bowl: 0.3 },
      vibes: { heavy: 0.8 },
    },
    {
      id: 'zongzi',
      name: '肉粽',
      emoji: '🍃',
      traits: { glutinous: 1, filled: 1, steamed: 1, pork: 0.8, egg: 0.3, bowl: 0, handheld: 0.7 },
      vibes: { heavy: 0.8 },
    },
    {
      id: 'rice-bowl-cake',
      name: '碗粿',
      emoji: '🍮',
      traits: {
        steamed: 1,
        glutinous: 0,
        pork: 0.5,
        egg: 0.5,
        braised: 0.2,
        bowl: 1,
        breakfast: 0.4,
      },
      vibes: { heavy: 0.2 },
      meals: ['breakfast', 'lunch', 'dinner', 'tea'],
    },
    {
      id: 'pork-knuckle-rice',
      name: '豬腳飯',
      emoji: '🐷',
      traits: { pork: 1, braised: 1, chewy: 0.8, bowl: 0.3 },
      vibes: { heavy: 0.9, healthy: -0.5 },
    },
    {
      id: 'duck-rice',
      name: '鴨肉飯',
      emoji: '🦆',
      traits: { duck: 1, braised: 0.3 },
      vibes: { heavy: 0.4 },
    },
  ],
})
