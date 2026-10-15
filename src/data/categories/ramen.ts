import { defineCategory } from '../types'

export default defineCategory({
  category: {
    id: 'ramen',
    name: '日式拉麵',
    emoji: '🍥',
    blurb: '濃郁湯頭配上叉燒和溏心蛋，排隊也甘願。',
    traits: { japanese: 1, noodle: 1, soup: 1, bowl: 1, pork: 0.8, egg: 0.6, pricey: 0.5 },
    vibes: { warm: 0.9, heavy: 0.8, comfort: 0.3, healthy: -0.4, speed: 0.4, social: -0.6 },
    meals: ['lunch', 'dinner', 'lateNight'],
    priceLevel: 2,
  },
  dishes: [
    {
      id: 'tonkotsu-ramen',
      name: '豚骨拉麵',
      emoji: '🍜',
      traits: { pork: 1, richBroth: 1 },
      vibes: { heavy: 1 },
    },
    {
      id: 'miso-ramen',
      name: '味噌拉麵',
      emoji: '🍜',
      traits: { miso: 1, richBroth: 0.4, veggie: 0.4 },
    },
    {
      id: 'shoyu-ramen',
      name: '醬油拉麵',
      emoji: '🍜',
      traits: { richBroth: 0 },
      vibes: { heavy: 0.5 },
    },
    {
      id: 'chicken-paitan-ramen',
      name: '雞白湯拉麵',
      emoji: '🐔',
      traits: { chicken: 1, pork: 0.3, richBroth: 1 },
    },
    {
      id: 'spicy-ramen',
      name: '辛辣拉麵',
      emoji: '🌶️',
      traits: { spicy: 1, richBroth: 0.5 },
      mapKeyword: '辣味拉麵',
    },
    {
      id: 'tsukemen',
      name: '沾麵',
      emoji: '🥢',
      traits: { soup: 0.3, richBroth: 0.6, cold: 0.3, bowl: 0.5 },
      vibes: { warm: 0.4 },
    },
  ],
})
