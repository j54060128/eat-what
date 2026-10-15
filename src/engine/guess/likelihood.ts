/** 玩家的五種回答 */
export const ANSWERS = [
  { id: 'yes', label: '是', target: 1 },
  { id: 'probably', label: '可能是', target: 0.75 },
  { id: 'unknown', label: '不知道', target: null },
  { id: 'probablyNot', label: '可能不是', target: 0.25 },
  { id: 'no', label: '不是', target: 0 },
] as const

export type Answer = (typeof ANSWERS)[number]['id']

export function answerTarget(answer: Answer): number | null {
  return ANSWERS.find((a) => a.id === answer)!.target
}

/**
 * P(回答 | 料理)：回答越接近料理的特徵值，機率越高。
 * epsilon 是容錯底線：就算答案完全相反，機率也不會是 0，答錯一題不會直接淘汰正解。
 *
 * 只看「是」與「不是」時，L(1, v) + L(0, v) = 1，剛好是一個合法的機率分佈，
 * 挑題時的期望資訊量就是用這個二元模型計算。
 */
export function likelihood(target: number, value: number, epsilon: number): number {
  return epsilon + (1 - 2 * epsilon) * (1 - Math.abs(target - value))
}
