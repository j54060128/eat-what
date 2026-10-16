import { SITUATIONAL_BY_ID } from '@/data/recommend/questions'
import { PREFERENCE_BY_ID } from '@/data/recommend/preferences'
import type { Evidence, Filters } from '@/data/recommend/types'
import type { Meal } from '@/data/types'
import type { Answer } from '../guess/likelihood'

/** 情境題的作答：題目 id → 選了第幾個選項（多選題可以有多個） */
export type SituationalAnswers = Record<string, number[]>

/** 偏好追問的作答（依回答順序） */
export interface PreferenceAnswer {
  id: string
  answer: Answer
}

export const DEFAULT_FILTERS: Filters = {
  meal: null,
  maxPrice: 3,
  vegetarian: false,
  noBeef: false,
  noPork: false,
  noSeafood: false,
  noSpicy: false,
}

function selectedOptions(answers: SituationalAnswers) {
  return Object.entries(answers).flatMap(([id, indexes]) => {
    const question = SITUATIONAL_BY_ID[id]
    if (!question) return []
    return indexes.map((i) => question.options[i]).filter((o) => o !== undefined)
  })
}

export function buildFilters(answers: SituationalAnswers): Filters {
  const filters: Filters = { ...DEFAULT_FILTERS }
  for (const option of selectedOptions(answers)) Object.assign(filters, option.filter)
  return filters
}

/** 情境題帶來的軟性證據（例如人數） */
export function situationalEvidence(answers: SituationalAnswers): Evidence[] {
  return selectedOptions(answers).flatMap((o) => o.evidence ?? [])
}

/** 結果頁「你的選擇」中，情境題的部分 */
export function situationalSummary(answers: SituationalAnswers): string[] {
  return selectedOptions(answers).flatMap((o) => (o.short ? [o.short] : []))
}

/** 依目前時間推測是哪一餐 */
export function mealByHour(hour: number): Meal {
  if (hour >= 5 && hour < 10) return 'breakfast'
  if (hour >= 10 && hour < 14) return 'lunch'
  if (hour >= 14 && hour < 17) return 'tea'
  if (hour >= 17 && hour < 21) return 'dinner'
  return 'lateNight'
}

// ── 網址編碼：分享連結只帶題目 id 與選項代號，不含任何個人資料 ──

/** `meal.3_budget.1_diet.1-5` */
export function encodeSituational(answers: SituationalAnswers): string {
  return Object.entries(answers)
    .map(([id, indexes]) => `${id}.${indexes.join('-')}`)
    .join('_')
}

export function decodeSituational(encoded: string): SituationalAnswers {
  const answers: SituationalAnswers = {}
  for (const part of encoded.split('_')) {
    const [id, raw] = part.split('.')
    const question = id ? SITUATIONAL_BY_ID[id] : undefined
    if (!question || !raw) continue
    const indexes = raw
      .split('-')
      .map(Number)
      .filter((n) => Number.isInteger(n) && n >= 0 && n < question.options.length)
    if (indexes.length) answers[question.id] = indexes
  }
  return answers
}

const ANSWER_CODES: Record<Answer, string> = {
  yes: 'y',
  probably: 'py',
  unknown: 'u',
  probablyNot: 'pn',
  no: 'n',
}
const CODE_TO_ANSWER = Object.fromEntries(
  Object.entries(ANSWER_CODES).map(([answer, code]) => [code, answer]),
) as Record<string, Answer>

/** `warm.y_soup.py_spicy.n` */
export function encodePreferences(prefs: PreferenceAnswer[]): string {
  return prefs.map((p) => `${p.id}.${ANSWER_CODES[p.answer]}`).join('_')
}

export function decodePreferences(encoded: string): PreferenceAnswer[] {
  const seen = new Set<string>()
  const prefs: PreferenceAnswer[] = []
  for (const part of encoded.split('_')) {
    const [id, code] = part.split('.')
    const answer = code ? CODE_TO_ANSWER[code] : undefined
    if (!id || !PREFERENCE_BY_ID[id] || !answer || seen.has(id)) continue
    seen.add(id)
    prefs.push({ id, answer })
  }
  return prefs
}

/** 推薦模式的回答標籤（與猜謎模式共用同一組回答與機率模型） */
export const PREFERENCE_ANSWER_LABELS: Record<Answer, string> = {
  yes: '想',
  probably: '有點想',
  unknown: '都可以',
  probablyNot: '不太想',
  no: '不想',
}
