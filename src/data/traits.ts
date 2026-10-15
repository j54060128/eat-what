/**
 * 猜謎模式用的「客觀特徵」。每個特徵就是一道是非題。
 *
 * 特徵值為 0~1：1 = 一定是、0 = 一定不是、0.5 = 不一定（此題對該料理沒有區辨力）。
 * 料理的最終特徵值解析順序：特徵預設值 → 類型（Category）設定 → 料理（Dish）覆寫。
 * 預設值選「大多數料理的答案」，類型與料理就只需要寫例外，資料量少很多。
 */
export const TRAITS = [
  // ── 菜系 ──
  { id: 'taiwanese', question: '它是台灣在地的料理或小吃嗎？', default: 0 },
  { id: 'japanese', question: '它是日式料理嗎？', default: 0 },
  { id: 'korean', question: '它是韓式料理嗎？', default: 0 },
  { id: 'western', question: '它是西式（歐美）料理嗎？', default: 0 },
  { id: 'seAsian', question: '它是東南亞或印度風味的料理嗎？', default: 0 },
  { id: 'chinese', question: '它是港式或中式菜系（川菜、江浙菜…）嗎？', default: 0 },

  // ── 主食與形式 ──
  { id: 'rice', question: '主食是米飯嗎？', default: 0 },
  { id: 'noodle', question: '裡面有麵條嗎？', default: 0 },
  { id: 'dough', question: '是用麵皮、餅皮或麵包包著／夾著的嗎？', default: 0 },
  { id: 'soup', question: '它是有湯的（湯湯水水）嗎？', default: 0 },
  { id: 'glutinous', question: '有用到糯米嗎？', default: 0 },
  { id: 'filled', question: '它是包餡的嗎？（像餃子、包子那樣）', default: 0 },
  { id: 'bowl', question: '通常是裝成一碗端上桌的嗎？', default: 0.3 },
  { id: 'boxed', question: '通常是裝在便當盒或餐盒裡嗎？', default: 0 },
  { id: 'handheld', question: '可以直接用手拿著吃嗎？', default: 0 },
  { id: 'skewer', question: '是串在竹籤上的嗎？', default: 0 },

  // ── 烹調方式 ──
  { id: 'fried', question: '它是油炸的嗎？', default: 0 },
  { id: 'grilled', question: '是用烤的或煎的嗎？', default: 0 },
  { id: 'braised', question: '是滷的或燉煮入味的嗎？', default: 0 },
  { id: 'stirFried', question: '是用大火快炒的嗎？', default: 0 },
  { id: 'steamed', question: '是蒸出來的嗎？', default: 0 },
  { id: 'raw', question: '有生的食材（例如生魚片）嗎？', default: 0 },
  { id: 'diy', question: '需要自己在桌上煮或烤嗎？', default: 0 },

  // ── 味道 ──
  { id: 'spicy', question: '它通常是辣的嗎？', default: 0.1 },
  { id: 'sweet', question: '它吃起來主要是甜的嗎？', default: 0 },
  { id: 'sour', question: '吃起來偏酸嗎？', default: 0 },
  { id: 'curry', question: '是咖哩口味的嗎？', default: 0 },
  { id: 'cheese', question: '有加起司嗎？', default: 0 },
  { id: 'creamy', question: '有用到奶油、牛奶或奶醬嗎？', default: 0 },
  { id: 'tomato', question: '是番茄或番茄醬口味為主嗎？', default: 0 },
  { id: 'starchy', question: '湯汁是勾芡、黏稠的嗎？', default: 0 },
  { id: 'richBroth', question: '湯頭是濃郁白濁的嗎？', default: 0 },
  { id: 'miso', question: '是味噌口味的嗎？', default: 0 },

  // ── 食材 ──
  { id: 'beef', question: '主要的肉是牛肉嗎？', default: 0 },
  { id: 'pork', question: '主要的肉是豬肉嗎？', default: 0 },
  { id: 'chicken', question: '主要的肉是雞肉嗎？', default: 0 },
  { id: 'lamb', question: '主要的肉是羊肉嗎？', default: 0 },
  { id: 'duck', question: '主要的肉是鴨肉嗎？', default: 0 },
  { id: 'seafood', question: '有海鮮（魚、蝦、蚵仔…）嗎？', default: 0 },
  { id: 'fish', question: '主角是魚嗎？', default: 0 },
  { id: 'egg', question: '蛋是主角之一嗎？', default: 0 },
  { id: 'tofu', question: '有豆腐或豆製品嗎？', default: 0 },
  { id: 'meatless', question: '它通常是不含肉的嗎？', default: 0 },
  { id: 'veggie', question: '蔬菜的份量很多嗎？', default: 0.2 },

  // ── 情境 ──
  { id: 'breakfast', question: '早餐時段常吃到它嗎？', default: 0 },
  { id: 'nightMarket', question: '夜市常看得到它嗎？', default: 0 },
  { id: 'sharing', question: '通常是好幾個人一起分著吃嗎？', default: 0.2 },
  { id: 'pricey', question: '一個人吃通常要超過 300 元嗎？', default: 0.2 },
  { id: 'cold', question: '通常是冰的或冷的嗎？', default: 0 },
] as const satisfies readonly { id: string; question: string; default: number }[]

export type TraitId = (typeof TRAITS)[number]['id']
export type TraitMap = Partial<Record<TraitId, number>>

export const TRAIT_IDS = TRAITS.map((t) => t.id) as TraitId[]
export const TRAIT_BY_ID = Object.fromEntries(TRAITS.map((t) => [t.id, t])) as Record<
  TraitId,
  (typeof TRAITS)[number]
>
