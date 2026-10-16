import { defineCategory } from '../types'

export default defineCategory({
  category: {
    id: 'brunch',
    name: '早午餐',
    emoji: '🍳',
    blurb: '睡飽了再出門，悠閒的早午餐時光。',
    traits: { western: 0.8, breakfast: 0.8, egg: 0.6, dough: 0.5, sharing: 0.2, pricey: 0.5 },
    vibes: { warm: 0.4, heavy: 0.3, comfort: 0.2, healthy: 0, speed: -0.4, social: 0.4 },
    meals: ['breakfast', 'lunch', 'tea'],
    priceLevel: 2,
  },
  dishes: [
    {
      id: 'eggs-benedict',
      name: '班尼迪克蛋',
      emoji: '🥚',
      traits: { egg: 1, dough: 1, creamy: 1, pork: 0.6 },
      vibes: { heavy: 0.5 },
    },
    {
      id: 'french-toast',
      name: '法式吐司',
      emoji: '🍞',
      traits: { dough: 1, sweet: 1, egg: 0.8, creamy: 0.5, grilled: 0.8 },
    },
    {
      id: 'brunch-plate',
      name: '美式早午餐盤',
      emoji: '🥓',
      traits: { egg: 1, pork: 0.8, dough: 0.6, grilled: 0.8, creamy: 0 },
      vibes: { heavy: 0.8, healthy: -0.4 },
    },
    {
      id: 'bagel',
      name: '貝果',
      emoji: '🥯',
      traits: { dough: 1, handheld: 1, chewy: 0.8, cheese: 0.5, creamy: 0.6, egg: 0 },
      vibes: { speed: 0.5 },
      priceLevel: 1,
    },
    {
      id: 'avocado-toast',
      name: '酪梨吐司',
      emoji: '🥑',
      traits: { dough: 1, veggie: 0.8, egg: 0.5, handheld: 0.6 },
      vibes: { heavy: -0.2, healthy: 0.6, comfort: -0.4 },
    },
    {
      id: 'yogurt-bowl',
      name: '優格碗',
      emoji: '🥣',
      traits: {
        fruit: 1,
        creamy: 1,
        sweet: 0.7,
        cold: 1,
        bowl: 1,
        dough: 0,
        egg: 0,
        meatless: 1,
      },
      vibes: { warm: -0.6, heavy: -0.6, healthy: 0.8 },
    },
    {
      id: 'omelette',
      name: '歐姆蛋',
      emoji: '🍳',
      traits: { egg: 1, dough: 0, cheese: 0.5, grilled: 0.6, veggie: 0.4 },
    },
  ],
})
