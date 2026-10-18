import { defineCategory } from '../types'

export default defineCategory({
  category: {
    id: 'hakka',
    name: '客家料理',
    emoji: '🌾',
    blurb: '鹹、香、肥，下飯又有古早味的客家菜。',
    traits: { taiwanese: 1, sharing: 0.6, pricey: 0.2 },
    vibes: { warm: 0.7, heavy: 0.6, comfort: 0.8, healthy: -0.1, speed: 0.2, social: 0.6 },
    meals: ['lunch', 'dinner'],
    priceLevel: 2,
  },
  dishes: [
    {
      id: 'hakka-stir-fry',
      name: '客家小炒',
      emoji: '🦑',
      traits: { veggie: 0.5, stirFried: 1, pork: 0.8, seafood: 0.6, tofu: 0.7, sharing: 0.9 },
    },
    {
      id: 'ban-tiao',
      name: '粄條',
      emoji: '🍜',
      traits: { veggie: 0.4, noodle: 1, chewy: 0.7, soup: 0.6, pork: 0.6, bowl: 1, sharing: 0 },
      vibes: { heavy: 0.3, speed: 0.8, social: -0.5 },
      priceLevel: 1,
    },
    {
      id: 'ginger-intestine',
      name: '薑絲炒大腸',
      emoji: '🥢',
      traits: { offal: 1, stirFried: 1, sour: 1, pork: 0.8 },
    },
    {
      id: 'meigan-pork',
      name: '梅干扣肉',
      emoji: '🥓',
      traits: { pork: 1, braised: 1, steamed: 0.6, rice: 0.5, sweet: 0.3 },
      vibes: { heavy: 0.9, healthy: -0.5 },
    },
    {
      id: 'lei-cha',
      name: '擂茶',
      emoji: '🍵',
      traits: { tea: 1, drink: 0.5, meatless: 1, sweet: 0.3, cold: 0.3, sharing: 0.3 },
      vibes: { heavy: -0.4, healthy: 0.5, speed: -0.3 },
      meals: ['lunch', 'tea', 'dinner'],
    },
    {
      id: 'hakka-salty-tangyuan',
      name: '客家鹹湯圓',
      emoji: '🥣',
      traits: { glutinous: 1, soup: 1, pork: 0.6, chewy: 0.8, bowl: 1, sharing: 0 },
      vibes: { warm: 1, social: -0.4 },
      priceLevel: 1,
    },
  ],
})
