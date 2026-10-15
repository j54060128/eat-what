import { describe, expect, it } from 'vitest'
import { DISHES } from '@/data'
import { likelihood } from '@/engine/guess/likelihood'
import { deriveState, nextStep, type GuessEvent } from '@/engine/guess/game'
import { simulateGame } from '@/engine/guess/simulate'

describe('似然函數', () => {
  it('回答與特徵一致時機率最高，相反時降到 epsilon', () => {
    expect(likelihood(1, 1, 0.05)).toBeCloseTo(0.95)
    expect(likelihood(1, 0, 0.05)).toBeCloseTo(0.05)
    expect(likelihood(1, 0.5, 0.05)).toBeCloseTo(0.5)
  })

  it('「是」與「不是」的機率加起來等於 1', () => {
    for (const v of [0, 0.25, 0.5, 0.8, 1]) {
      expect(likelihood(1, v, 0.06) + likelihood(0, v, 0.06)).toBeCloseTo(1)
    }
  })
})

describe('狀態機', () => {
  it('第一步一定是問問題', () => {
    const step = nextStep(DISHES, deriveState(DISHES, []))
    expect(step.kind).toBe('question')
  })

  it('同樣的事件歷史與種子，下一步完全相同（上一題可重現）', () => {
    const events: GuessEvent[] = [{ type: 'answer', traitId: 'noodle', answer: 'yes' }]
    const a = nextStep(DISHES, deriveState(DISHES, events), undefined, 42)
    const b = nextStep(DISHES, deriveState(DISHES, events), undefined, 42)
    expect(a).toEqual(b)
  })

  it('不會重複問同一題', () => {
    const result = simulateGame(DISHES, DISHES[0]!)
    const asked = result.events.filter((e) => e.type === 'answer').map((e) => e.traitId)
    expect(new Set(asked).size).toBe(asked.length)
  })

  it('猜錯的料理會被排除', () => {
    const target = DISHES[0]!
    const state = deriveState(DISHES, [{ type: 'dish', dishId: target.id, correct: false }])
    expect(state.posterior[0]).toBe(0)
  })
})

describe('模擬玩家（品質門檻）', () => {
  it('完美玩家：≥ 95% 料理在 25 題內直接猜中', () => {
    const results = DISHES.map((d) => simulateGame(DISHES, d, { seed: 1 }))
    const success = results.filter((r) => r.guessed && r.questions <= 25)
    const failed = results.filter((r) => !(r.guessed && r.questions <= 25)).map((r) => r.dishId)
    const avg = results.reduce((s, r) => s + r.questions, 0) / results.length
    console.info(
      `完美玩家：${success.length}/${results.length} 直接猜中，平均 ${avg.toFixed(1)} 題`,
      failed.length ? `\n未猜中：${failed.join(', ')}` : '',
    )
    expect(success.length / results.length).toBeGreaterThanOrEqual(0.95)
  })

  it('有雜訊玩家（10% 答錯）：成功率 ≥ 80%（含從清單挑中）', () => {
    let total = 0
    let ok = 0
    for (const seed of [1, 2, 3]) {
      for (const d of DISHES) {
        const r = simulateGame(DISHES, d, { noise: 0.1, seed })
        total++
        if (r.guessed || r.pickedFromList) ok++
      }
    }
    console.info(`雜訊玩家：${ok}/${total} 成功（${((ok / total) * 100).toFixed(1)}%）`)
    expect(ok / total).toBeGreaterThanOrEqual(0.8)
  })
})
