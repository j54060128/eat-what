import { defineCategory } from '../types'

export default defineCategory({
  category: {
    id: 'donburi',
    name: '丼飯・日式定食',
    emoji: '🍛',
    blurb: '一碗白飯鋪滿配料，日式食堂的安心選擇。',
    traits: { japanese: 1, rice: 1, bowl: 0.8, egg: 0.3, pricey: 0.3 },
    vibes: { warm: 0.6, heavy: 0.7, comfort: 0.4, healthy: -0.2, speed: 0.6, social: -0.6 },
    meals: ['lunch', 'dinner'],
    priceLevel: 2,
  },
  dishes: [
    {
      id: 'katsudon',
      name: '豬排丼',
      emoji: '🍖',
      traits: { pork: 1, fried: 1, egg: 1 },
      vibes: { heavy: 0.9, healthy: -0.5 },
    },
    {
      id: 'gyudon',
      name: '牛丼',
      emoji: '🐮',
      traits: { beef: 1, braised: 0.7, egg: 0.4, pricey: 0 },
      vibes: { speed: 0.9 },
      priceLevel: 1,
    },
    {
      id: 'oyakodon',
      name: '親子丼',
      emoji: '🐣',
      traits: { chicken: 1, egg: 1, braised: 0.5 },
      vibes: { comfort: 0.6 },
    },
    {
      id: 'unadon',
      name: '鰻魚飯',
      emoji: '🐍',
      traits: { seafood: 1, fish: 1, grilled: 1, sweet: 0.4, pricey: 1 },
      vibes: { comfort: 0, speed: 0 },
      priceLevel: 3,
    },
    {
      id: 'japanese-curry',
      name: '日式咖哩飯',
      emoji: '🍛',
      traits: { curry: 1, pork: 0.5, beef: 0.3, fried: 0.3, bowl: 0.3 },
      vibes: { comfort: 0.7 },
    },
    {
      id: 'tendon',
      name: '天丼',
      emoji: '🍤',
      traits: { fried: 1, seafood: 1, veggie: 0.4 },
      vibes: { healthy: -0.5 },
    },
    {
      id: 'karaage-teishoku',
      name: '唐揚雞定食',
      emoji: '🍗',
      traits: { chicken: 1, fried: 1, bowl: 0, egg: 0 },
      vibes: { heavy: 0.8, healthy: -0.4 },
    },
    {
      id: 'salmon-teishoku',
      name: '鮭魚定食',
      emoji: '🐟',
      traits: { fish: 1, seafood: 1, grilled: 1, bowl: 0, egg: 0 },
      vibes: { heavy: 0.3, healthy: 0.4 },
    },
  ],
})
