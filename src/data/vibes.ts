/**
 * 推薦模式用的「情境維度」。值域 -1 ~ 1，0 代表中性。
 * 描述料理「適合什麼樣的狀態」，例如 warm = 1 是熱呼呼的、-1 是冰涼的。
 * 偏好追問題（recommend/preferences.ts）會把它換算成 0~1 來問。
 */
export const VIBES = [
  { id: 'warm', name: '熱呼呼 ↔ 冰涼' },
  { id: 'heavy', name: '飽足重口味 ↔ 清爽' },
  { id: 'comfort', name: '熟悉的老味道 ↔ 新鮮異國' },
  { id: 'healthy', name: '健康 ↔ 放縱' },
  { id: 'speed', name: '快速解決 ↔ 慢慢享受' },
  { id: 'social', name: '適合多人分享 ↔ 一個人吃' },
] as const satisfies readonly { id: string; name: string }[]

export type VibeId = (typeof VIBES)[number]['id']
export type VibeMap = Partial<Record<VibeId, number>>
export type VibeVector = Record<VibeId, number>

export const VIBE_IDS = VIBES.map((v) => v.id) as VibeId[]

export function zeroVibes(): VibeVector {
  return Object.fromEntries(VIBE_IDS.map((id) => [id, 0])) as VibeVector
}
