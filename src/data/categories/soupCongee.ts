import { defineCategory } from '../types'

export default defineCategory({
  category: {
    id: 'soup-congee',
    name: '羹湯・粥品',
    emoji: '🥣',
    blurb: '一碗熱湯或暖粥，從胃暖到心。',
    traits: { taiwanese: 1, soup: 1, bowl: 1, sharing: 0, pricey: 0 },
    vibes: { warm: 0.9, heavy: 0, comfort: 0.9, healthy: 0.2, speed: 0.8, social: -0.6 },
    meals: ['breakfast', 'lunch', 'dinner', 'lateNight'],
    priceLevel: 1,
  },
  dishes: [
    {
      id: 'savory-congee',
      name: '鹹粥',
      emoji: '🥣',
      traits: { rice: 1, seafood: 0.7, fish: 0.3, pork: 0.4, breakfast: 0.6 },
      vibes: { heavy: -0.2, healthy: 0.3 },
    },
    {
      id: 'milkfish-congee',
      name: '虱目魚粥',
      emoji: '🐟',
      traits: { rice: 1, seafood: 1, fish: 1, breakfast: 0.8 },
      vibes: { heavy: -0.2, healthy: 0.5 },
    },
    {
      id: 'century-egg-congee',
      name: '皮蛋瘦肉粥',
      emoji: '🥚',
      traits: { rice: 1, egg: 1, pork: 1, chinese: 0.8, taiwanese: 0.5, breakfast: 0.6 },
      vibes: { heavy: -0.1, healthy: 0.3 },
    },
    {
      id: 'pork-thick-soup',
      name: '肉羹',
      emoji: '🍲',
      traits: { starchy: 1, pork: 1, noodle: 0.4, sour: 0.3, sweet: 0.2, nightMarket: 0.5 },
    },
    {
      id: 'squid-thick-soup',
      name: '魷魚羹',
      emoji: '🦑',
      traits: { starchy: 1, seafood: 1, chewy: 0.6, sour: 0.3, nightMarket: 0.5 },
    },
    {
      id: 'mackerel-thick-soup',
      name: '土魠魚羹',
      emoji: '🐠',
      traits: { starchy: 1, seafood: 1, fish: 1, fried: 1, sour: 0.3 },
      vibes: { heavy: 0.3 },
    },
    {
      id: 'four-herb-soup',
      name: '四神湯',
      emoji: '🍵',
      traits: { offal: 1, pork: 0.8, veggie: 0 },
      vibes: { healthy: 0.4 },
    },
    {
      id: 'pork-rib-soup',
      name: '排骨酥湯',
      emoji: '🍖',
      traits: { pork: 1, fried: 1, veggie: 0.4 },
      vibes: { heavy: 0.4 },
    },
  ],
})
