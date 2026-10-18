import type { PreferenceQuestion } from './types'

/**
 * 推薦模式的偏好追問題庫。神燈會依目前的候選料理，挑「最能縮小範圍」的題目來問，
 * 所以不是每題都會出現。新增題目時，source 指向一個特徵（0~1）或情境維度（-1~1，會換算成 0~1）。
 */
export const PREFERENCE_QUESTIONS: PreferenceQuestion[] = [
  // ── 狀態 ──
  { id: 'warm', text: '想吃熱呼呼的嗎？', yes: '熱的', no: '冰涼的', source: { vibe: 'warm' } },
  {
    id: 'heavy',
    text: '想吃飽足一點、重口味的嗎？',
    yes: '重口味',
    no: '清爽',
    source: { vibe: 'heavy' },
  },
  {
    id: 'healthy',
    text: '想吃得健康一點嗎？',
    yes: '健康',
    no: '放縱一下',
    source: { vibe: 'healthy' },
  },
  {
    id: 'speed',
    text: '想快速解決這一餐嗎？',
    yes: '快速',
    no: '慢慢吃',
    source: { vibe: 'speed' },
  },
  {
    id: 'comfort',
    text: '想吃熟悉的老味道嗎？',
    yes: '熟悉的味道',
    no: '新鮮的',
    source: { vibe: 'comfort' },
  },

  // ── 主食與形式 ──
  { id: 'soup', text: '想吃有湯的嗎？', yes: '有湯', no: '不要湯', source: { trait: 'soup' } },
  { id: 'rice', text: '想吃飯嗎？', yes: '吃飯', no: '不吃飯', source: { trait: 'rice' } },
  { id: 'noodle', text: '想吃麵嗎？', yes: '吃麵', no: '不吃麵', source: { trait: 'noodle' } },
  {
    id: 'dough',
    text: '想吃麵包、餅皮或包子類的嗎？',
    yes: '麵包餅皮',
    no: '不要麵皮',
    source: { trait: 'dough' },
  },

  // ── 烹調與味道 ──
  { id: 'fried', text: '想吃炸的嗎？', yes: '炸物', no: '不要炸的', source: { trait: 'fried' } },
  {
    id: 'grilled',
    text: '想吃燒烤或煎烤的嗎？',
    yes: '燒烤煎烤',
    no: '不要燒烤',
    source: { trait: 'grilled' },
  },
  { id: 'spicy', text: '想吃辣的嗎？', yes: '辣', no: '不辣', source: { trait: 'spicy' } },
  { id: 'sweet', text: '想吃甜的嗎？', yes: '甜的', no: '不要甜', source: { trait: 'sweet' } },
  { id: 'sour', text: '想吃酸酸開胃的嗎？', yes: '酸的', no: '不要酸', source: { trait: 'sour' } },
  {
    id: 'cheese',
    text: '想吃有起司的嗎？',
    yes: '起司',
    no: '不要起司',
    source: { trait: 'cheese' },
  },
  {
    id: 'raw',
    text: '想吃生魚片之類的生食嗎？',
    yes: '生食',
    no: '不要生食',
    source: { trait: 'raw' },
  },

  // ── 食材 ──
  { id: 'beef', text: '想吃牛肉嗎？', yes: '牛肉', no: '不要牛肉', source: { trait: 'beef' } },
  { id: 'pork', text: '想吃豬肉嗎？', yes: '豬肉', no: '不要豬肉', source: { trait: 'pork' } },
  {
    id: 'chicken',
    text: '想吃雞肉嗎？',
    yes: '雞肉',
    no: '不要雞肉',
    source: { trait: 'chicken' },
  },
  {
    id: 'seafood',
    text: '想吃海鮮嗎？',
    yes: '海鮮',
    no: '不要海鮮',
    source: { trait: 'seafood' },
  },
  {
    id: 'veggie',
    text: '想多吃點蔬菜嗎？',
    yes: '多蔬菜',
    no: '蔬菜少一點',
    source: { trait: 'veggie' },
  },
  { id: 'fruit', text: '想吃點水果嗎？', yes: '水果', no: '不要水果', source: { trait: 'fruit' } },
  {
    id: 'offal',
    text: '想吃大腸、豬血這類內臟嗎？',
    yes: '內臟',
    no: '不要內臟',
    source: { trait: 'offal' },
  },
  {
    id: 'chewy',
    text: '想吃 QQ 有嚼勁的嗎？',
    yes: 'QQ 口感',
    no: '不要 QQ',
    source: { trait: 'chewy' },
  },
  {
    id: 'drink',
    text: '想喝點飲料就好嗎？',
    yes: '喝飲料',
    no: '不要飲料',
    source: { trait: 'drink' },
  },
  {
    id: 'convenienceStore',
    text: '想在便利商店隨便解決嗎？',
    yes: '超商',
    no: '不要超商',
    source: { trait: 'convenienceStore' },
  },

  // ── 菜系 ──
  {
    id: 'taiwanese',
    text: '想吃台灣在地的味道嗎？',
    yes: '台式',
    no: '不要台式',
    source: { trait: 'taiwanese' },
  },
  {
    id: 'japanese',
    text: '想吃日式料理嗎？',
    yes: '日式',
    no: '不要日式',
    source: { trait: 'japanese' },
  },
  {
    id: 'korean',
    text: '想吃韓式料理嗎？',
    yes: '韓式',
    no: '不要韓式',
    source: { trait: 'korean' },
  },
  {
    id: 'western',
    text: '想吃西式料理嗎？',
    yes: '西式',
    no: '不要西式',
    source: { trait: 'western' },
  },
  {
    id: 'seAsian',
    text: '想吃東南亞或南洋風味嗎？',
    yes: '南洋風味',
    no: '不要南洋',
    source: { trait: 'seAsian' },
  },
  {
    id: 'chinese',
    text: '想吃港式或中式菜系嗎？',
    yes: '港式中式',
    no: '不要港式中式',
    source: { trait: 'chinese' },
  },
]

export const PREFERENCE_BY_ID: Record<string, PreferenceQuestion> = Object.fromEntries(
  PREFERENCE_QUESTIONS.map((q) => [q.id, q]),
)
