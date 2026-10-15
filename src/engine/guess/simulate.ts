import type { ResolvedDish } from '@/data/types'
import { createRng } from '../random'
import type { Answer } from './likelihood'
import {
  DEFAULT_GUESS_CONFIG,
  deriveState,
  nextStep,
  type GuessConfig,
  type GuessEvent,
} from './game'

/** 依特徵值「如實」回答（模擬一個對料理很熟的玩家） */
export function truthfulAnswer(value: number): Answer {
  if (value >= 0.75) return 'yes'
  if (value >= 0.6) return 'probably'
  if (value <= 0.25) return 'no'
  if (value <= 0.4) return 'probablyNot'
  return 'unknown'
}

const FLIP: Record<Answer, Answer> = {
  yes: 'no',
  probably: 'probablyNot',
  unknown: 'unknown',
  probablyNot: 'probably',
  no: 'yes',
}

export interface SimulationResult {
  dishId: string
  /** 直接猜中（不含從清單挑） */
  guessed: boolean
  /** 從認輸前的清單挑中 */
  pickedFromList: boolean
  questions: number
  events: GuessEvent[]
}

/**
 * 模擬一場遊戲。noise = 每題答錯（是↔不是）的機率。
 * 開發時也可以用來檢查新增料理後，神燈還猜不猜得到。
 */
export function simulateGame(
  dishes: ResolvedDish[],
  target: ResolvedDish,
  options: { noise?: number; seed?: number; config?: GuessConfig } = {},
): SimulationResult {
  const { noise = 0, seed = 1, config = DEFAULT_GUESS_CONFIG } = options
  const rng = createRng(seed * 31 + 7)
  const events: GuessEvent[] = []

  for (let guard = 0; guard < 120; guard++) {
    const state = deriveState(dishes, events, config)
    const step = nextStep(dishes, state, config, seed)
    switch (step.kind) {
      case 'question': {
        let answer = truthfulAnswer(target.traits[step.traitId])
        if (noise > 0 && rng() < noise) answer = FLIP[answer]
        events.push({ type: 'answer', traitId: step.traitId, answer })
        break
      }
      case 'confirmCategory':
        events.push({
          type: 'category',
          categoryId: step.categoryId,
          correct: step.categoryId === target.categoryId,
        })
        break
      case 'guessDish':
        events.push({ type: 'dish', dishId: step.dishId, correct: step.dishId === target.id })
        break
      case 'pickFromList':
        events.push({
          type: 'pick',
          dishId: step.dishIds.includes(target.id) ? target.id : null,
        })
        break
      case 'won':
      case 'lost': {
        const won = step.kind === 'won' && step.dishId === target.id
        return {
          dishId: target.id,
          guessed: won && !state.pickedFromList,
          pickedFromList: won && state.pickedFromList,
          questions: state.questionCount,
          events,
        }
      }
    }
  }
  throw new Error(`模擬 ${target.id} 超過步數上限，狀態機可能卡住了`)
}
