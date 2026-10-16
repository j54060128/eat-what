import type { ResolvedDish } from '@/data/types'
import { SITUATIONAL_BY_ID } from '@/data/recommend/questions'
import { createRng } from '../random'
import type { Answer } from '../guess/likelihood'
import { truthfulAnswer } from '../guess/simulate'
import type { PreferenceAnswer, SituationalAnswers } from './answers'
import {
  DEFAULT_RECOMMEND_CONFIG,
  buildResult,
  deriveRecommendState,
  nextRecommendStep,
  preferenceValue,
  rankDishes,
  type RecommendConfig,
} from './session'

const FLIP: Record<Answer, Answer> = {
  yes: 'no',
  probably: 'probablyNot',
  unknown: 'unknown',
  probablyNot: 'probably',
  no: 'yes',
}

export interface RecommendSimulation {
  dishId: string
  /** 目標料理在最終排名的名次（0 = 主推） */
  rank: number
  questions: number
  mainDishId: string
}

/** 讓目標料理一定通過篩選的情境作答：選它能吃的時段、不限預算、兩三個人、都可以 */
export function situationalFor(target: ResolvedDish): SituationalAnswers {
  const meal = SITUATIONAL_BY_ID.meal!.options.findIndex((o) => o.filter?.meal === target.meals[0])
  return { meal: [meal], budget: [2], company: [1], diet: [0] }
}

/**
 * 模擬一個「其實想吃 target」的玩家：依 target 的特徵如實回答偏好題。
 * noise = 每題答反的機率。
 */
export function simulateRecommend(
  dishes: ResolvedDish[],
  target: ResolvedDish,
  options: { noise?: number; seed?: number; config?: RecommendConfig } = {},
): RecommendSimulation {
  const { noise = 0, seed = 1, config = DEFAULT_RECOMMEND_CONFIG } = options
  const rng = createRng(seed * 31 + 11)
  const situational = situationalFor(target)
  const prefs: PreferenceAnswer[] = []

  for (let guard = 0; guard < 50; guard++) {
    const state = deriveRecommendState(dishes, { situational, prefs }, config)
    const step = nextRecommendStep(state, seed, config)
    if (step.kind === 'done') {
      const result = buildResult(state, { situational, prefs })!
      return {
        dishId: target.id,
        rank: rankDishes(state).findIndex((d) => d.id === target.id),
        questions: prefs.length,
        mainDishId: result.dish.id,
      }
    }
    let answer = truthfulAnswer(preferenceValue(target, step.id))
    if (noise > 0 && rng() < noise) answer = FLIP[answer]
    prefs.push({ id: step.id, answer })
  }
  throw new Error(`模擬 ${target.id} 超過步數上限`)
}
