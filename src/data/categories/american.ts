import { defineCategory } from '../types'

export default defineCategory({
  category: {
    id: 'american',
    name: '美式・墨西哥',
    emoji: '🌮',
    blurb: '大份量、重口味，用手抓著吃最過癮。',
    traits: { western: 1, sharing: 0.5, pricey: 0.5 },
    vibes: { warm: 0.6, heavy: 0.9, comfort: -0.2, healthy: -0.7, speed: 0, social: 0.6 },
    meals: ['lunch', 'dinner', 'lateNight'],
    priceLevel: 2,
  },
  dishes: [
    {
      id: 'bbq-ribs',
      name: '美式豬肋排',
      emoji: '🍖',
      traits: { pork: 1, grilled: 1, sweet: 0.5, pricey: 0.9 },
      priceLevel: 3,
    },
    {
      id: 'buffalo-wings',
      name: '水牛城辣雞翅',
      emoji: '🍗',
      traits: { chicken: 1, fried: 1, spicy: 0.8, sour: 0.4, handheld: 1 },
    },
    {
      id: 'fish-and-chips',
      name: '炸魚薯條',
      emoji: '🐟',
      traits: { fish: 1, seafood: 1, fried: 1, handheld: 0.4 },
    },
    {
      id: 'mac-and-cheese',
      name: '起司通心粉',
      emoji: '🧀',
      traits: { noodle: 1, cheese: 1, creamy: 1, grilled: 0.4 },
      vibes: { comfort: 0.3, social: 0 },
    },
    {
      id: 'burrito',
      name: '墨西哥捲餅',
      emoji: '🌯',
      traits: {
        dough: 1,
        handheld: 1,
        rice: 0.7,
        beef: 0.5,
        chicken: 0.5,
        spicy: 0.4,
        cheese: 0.5,
      },
      vibes: { speed: 0.6, social: -0.2 },
    },
    {
      id: 'taco',
      name: '塔可',
      emoji: '🌮',
      traits: { dough: 1, handheld: 1, rice: 0, beef: 0.6, spicy: 0.5, veggie: 0.5, sour: 0.3 },
      vibes: { speed: 0.5 },
    },
  ],
})
