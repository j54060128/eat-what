import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { DISHES } from '@/data'
import { SITUATIONAL_QUESTIONS } from '@/data/recommend/questions'
import type { Answer } from '@/engine/guess/likelihood'
import { randomSeed } from '@/engine/random'
import type { PreferenceAnswer, SituationalAnswers } from '@/engine/recommend/answers'
import { aliveCount, deriveRecommendState, nextRecommendStep } from '@/engine/recommend/session'

export const useRecommendGameStore = defineStore('recommendGame', () => {
  const started = ref(false)
  const seed = ref(randomSeed())
  /** 目前在第幾題情境題；等於情境題總數時代表進入偏好追問 */
  const situationalIndex = ref(0)
  const situational = ref<SituationalAnswers>({})
  const prefs = ref<PreferenceAnswer[]>([])
  /** 玩家按了「夠了，直接幫我選」 */
  const stoppedEarly = ref(false)

  const inPreferences = computed(() => situationalIndex.value >= SITUATIONAL_QUESTIONS.length)
  const currentSituational = computed(() => SITUATIONAL_QUESTIONS[situationalIndex.value])

  const input = computed(() => ({ situational: situational.value, prefs: prefs.value }))
  const state = computed(() => deriveRecommendState(DISHES, input.value))
  const step = computed(() =>
    !inPreferences.value
      ? null
      : stoppedEarly.value
        ? ({ kind: 'done' } as const)
        : nextRecommendStep(state.value, seed.value),
  )
  const remaining = computed(() => aliveCount(state.value))

  function start() {
    seed.value = randomSeed()
    situationalIndex.value = 0
    situational.value = {}
    prefs.value = []
    stoppedEarly.value = false
    started.value = true
  }

  function answerSituational(indexes: number[]) {
    const q = currentSituational.value
    if (!q) return
    situational.value = { ...situational.value, [q.id]: indexes }
    situationalIndex.value++
  }

  function answerPreference(answer: Answer) {
    const s = step.value
    if (s?.kind !== 'question') return
    prefs.value = [...prefs.value, { id: s.id, answer }]
  }

  function quit() {
    started.value = false
  }

  function stopNow() {
    stoppedEarly.value = true
  }

  function back() {
    stoppedEarly.value = false
    if (inPreferences.value && prefs.value.length > 0) {
      prefs.value = prefs.value.slice(0, -1)
    } else if (situationalIndex.value > 0) {
      situationalIndex.value--
    } else {
      started.value = false
    }
  }

  return {
    started,
    situationalIndex,
    situational,
    prefs,
    inPreferences,
    currentSituational,
    input,
    state,
    step,
    remaining,
    start,
    answerSituational,
    answerPreference,
    stopNow,
    back,
    quit,
  }
})
