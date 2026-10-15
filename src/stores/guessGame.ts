import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { DISHES } from '@/data'
import type { Answer } from '@/engine/guess/likelihood'
import { deriveState, nextStep, type GuessEvent } from '@/engine/guess/game'
import { randomSeed } from '@/engine/random'

export const useGuessGameStore = defineStore('guessGame', () => {
  const started = ref(false)
  const seed = ref(randomSeed())
  const events = ref<GuessEvent[]>([])

  const state = computed(() => deriveState(DISHES, events.value))
  const step = computed(() => nextStep(DISHES, state.value, undefined, seed.value))

  /** 神燈目前的把握程度：第一階段看最可能的類型，第二階段看類型內最可能的料理 */
  const confidence = computed(() => {
    const s = state.value
    if (s.confirmedCategoryId) {
      const inCategory = DISHES.map((d, i) =>
        d.categoryId === s.confirmedCategoryId ? s.posterior[i]! : 0,
      )
      const total = inCategory.reduce((a, b) => a + b, 0)
      return total > 0 ? Math.max(...inCategory) / total : 0
    }
    const masses = new Map<string, number>()
    DISHES.forEach((d, i) =>
      masses.set(d.categoryId, (masses.get(d.categoryId) ?? 0) + s.posterior[i]!),
    )
    return Math.max(...masses.values())
  })

  function start() {
    seed.value = randomSeed()
    events.value = []
    started.value = true
  }

  function push(event: GuessEvent) {
    events.value = [...events.value, event]
  }

  function answer(value: Answer) {
    const s = step.value
    if (s.kind !== 'question') return
    push({ type: 'answer', traitId: s.traitId, answer: value })
  }

  function judgeCategory(correct: boolean) {
    const s = step.value
    if (s.kind !== 'confirmCategory') return
    push({ type: 'category', categoryId: s.categoryId, correct })
  }

  function judgeDish(correct: boolean) {
    const s = step.value
    if (s.kind !== 'guessDish') return
    push({ type: 'dish', dishId: s.dishId, correct })
  }

  function pick(dishId: string | null) {
    if (step.value.kind !== 'pickFromList') return
    push({ type: 'pick', dishId })
  }

  function undo() {
    events.value = events.value.slice(0, -1)
  }

  function quit() {
    started.value = false
    events.value = []
  }

  return {
    started,
    events,
    state,
    step,
    confidence,
    start,
    answer,
    judgeCategory,
    judgeDish,
    pick,
    undo,
    quit,
  }
})
