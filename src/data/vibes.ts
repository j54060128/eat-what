/**
 * 推薦模式用的「情境維度」。值域 -1 ~ 1，0 代表中性。
 * 料理的 vibe 描述「它適合什麼樣的心情／情境」；玩家的回答會累積成同一組維度的向量。
 */
export const VIBES = [
  { id: 'warm', positive: '想吃點熱呼呼的', negative: '想來點冰涼的' },
  { id: 'heavy', positive: '需要扎實的飽足感', negative: '想吃清爽一點' },
  { id: 'spicy', positive: '想吃辣過過癮', negative: '今天不想碰辣' },
  { id: 'comfort', positive: '想要熟悉安心的味道', negative: '想嚐點新鮮的' },
  { id: 'healthy', positive: '想吃得健康一點', negative: '今天想放縱一下' },
  { id: 'speed', positive: '想快速解決一餐', negative: '想慢慢享受' },
  { id: 'social', positive: '適合大家一起吃', negative: '一個人也能好好吃' },
] as const satisfies readonly { id: string; positive: string; negative: string }[]

export type VibeId = (typeof VIBES)[number]['id']
export type VibeMap = Partial<Record<VibeId, number>>
export type VibeVector = Record<VibeId, number>

export const VIBE_IDS = VIBES.map((v) => v.id) as VibeId[]
export const VIBE_BY_ID = Object.fromEntries(VIBES.map((v) => [v.id, v])) as Record<
  VibeId,
  (typeof VIBES)[number]
>

export function zeroVibes(): VibeVector {
  return Object.fromEntries(VIBE_IDS.map((id) => [id, 0])) as VibeVector
}
