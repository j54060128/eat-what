import {
  FUN_QUESTION_COUNT,
  FUN_QUESTIONS,
  SITUATIONAL_QUESTIONS,
} from '@/data/recommend/questions'
import type { RecommendQuestion } from '@/data/recommend/types'
import type { Meal } from '@/data/types'
import { shuffle, type Rng } from '../random'

/** 一份測驗：固定的情境題＋隨機抽出的趣味題 */
export function buildQuiz(rng: Rng): RecommendQuestion[] {
  return [...SITUATIONAL_QUESTIONS, ...shuffle(FUN_QUESTIONS, rng).slice(0, FUN_QUESTION_COUNT)]
}

/** 依目前時間推測是哪一餐 */
export function mealByHour(hour: number): Meal {
  if (hour >= 5 && hour < 10) return 'breakfast'
  if (hour >= 10 && hour < 14) return 'lunch'
  if (hour >= 14 && hour < 17) return 'tea'
  if (hour >= 17 && hour < 21) return 'dinner'
  return 'lateNight'
}
