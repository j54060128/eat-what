<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import GenieAvatar from '@/components/GenieAvatar.vue'
import SpeechBubble from '@/components/SpeechBubble.vue'
import { DISHES } from '@/data'
import type { RecommendQuestion } from '@/data/recommend/types'
import { createRng, randomSeed } from '@/engine/random'
import { buildProfile, encodeAnswers, type RecommendAnswers } from '@/engine/recommend/profile'
import { buildQuiz, mealByHour } from '@/engine/recommend/quiz'
import { recommend } from '@/engine/recommend/score'

const router = useRouter()

const started = ref(false)
const quiz = ref<RecommendQuestion[]>([])
const index = ref(0)
const answers = ref<RecommendAnswers>({})
/** 多選題目前勾選的選項 */
const multiSelection = ref<number[]>([])

const current = computed(() => quiz.value[index.value])
const progress = computed(() => (quiz.value.length ? index.value / quiz.value.length : 0))

// 用餐時段題：依現在時間標示建議選項
const suggestedMealIndex = computed(() => {
  if (current.value?.id !== 'meal') return -1
  const meal = mealByHour(new Date().getHours())
  return current.value.options.findIndex((o) => o.filter?.meal === meal)
})

function start() {
  quiz.value = buildQuiz(createRng(randomSeed()))
  index.value = 0
  answers.value = {}
  multiSelection.value = []
  started.value = true
}

function choose(optionIndex: number) {
  const q = current.value
  if (!q) return
  answers.value = { ...answers.value, [q.id]: [optionIndex] }
  advance()
}

function toggle(optionIndex: number) {
  const q = current.value
  if (!q) return
  const option = q.options[optionIndex]
  if (option?.exclusive) {
    multiSelection.value = [optionIndex]
    return
  }
  const exclusive = q.options.findIndex((o) => o.exclusive)
  const set = new Set(multiSelection.value.filter((i) => i !== exclusive))
  if (set.has(optionIndex)) set.delete(optionIndex)
  else set.add(optionIndex)
  multiSelection.value = [...set].sort((a, b) => a - b)
}

function confirmMulti() {
  const q = current.value
  if (!q) return
  const exclusive = q.options.findIndex((o) => o.exclusive)
  const picked = multiSelection.value.length ? multiSelection.value : [Math.max(exclusive, 0)]
  answers.value = { ...answers.value, [q.id]: picked }
  advance()
}

function advance() {
  if (index.value < quiz.value.length - 1) {
    index.value++
    restoreMulti()
    return
  }
  finish()
}

function back() {
  if (index.value === 0) {
    started.value = false
    return
  }
  index.value--
  restoreMulti()
}

function restoreMulti() {
  const q = current.value
  multiSelection.value = q?.multi ? [...(answers.value[q.id] ?? [])] : []
}

function finish() {
  const encoded = encodeAnswers(answers.value)
  const rec = recommend(DISHES, buildProfile(answers.value), { rng: createRng(randomSeed()) })
  router.push({ name: 'result', query: { a: encoded, d: rec?.dish.id } })
}
</script>

<template>
  <AppHeader title="推薦模式">
    <span v-if="started" class="text-sm text-ink-muted">{{ index + 1 }} / {{ quiz.length }}</span>
  </AppHeader>

  <main class="flex flex-1 flex-col pt-4">
    <GenieAvatar :mood="started ? 'thinking' : 'idle'" />

    <!-- 進度條 -->
    <div
      v-if="started"
      class="mx-auto mt-3 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-white/10"
    >
      <div
        class="h-full rounded-full bg-gradient-to-r from-mist-400 to-lamp-300 transition-[width] duration-500"
        :style="{ width: `${Math.round(progress * 100)}%` }"
      />
    </div>

    <SpeechBubble>
      <Transition name="card" mode="out-in">
        <div v-if="!started" key="intro">
          <p class="text-2xl leading-snug">不知道今天吃什麼？<br />交給神燈吧！</p>
          <p class="mt-3 text-sm text-ink-muted">
            先問幾個實際的問題，再來一份美食心理測驗，大約 1 分鐘。
          </p>
        </div>
        <div v-else-if="current" :key="current.id">
          <p class="text-sm text-ink-muted">
            {{ current.kind === 'situational' ? '先確認一下……' : '🔮 心理測驗' }}
          </p>
          <p class="mt-2 text-2xl leading-snug">{{ current.text }}</p>
        </div>
      </Transition>
    </SpeechBubble>

    <section class="mt-6">
      <button
        v-if="!started"
        type="button"
        class="w-full rounded-2xl bg-lamp-400 py-4 text-xl font-bold text-night-950 shadow-[0_10px_40px_-10px_var(--color-lamp-400)] transition hover:bg-lamp-300 active:scale-[0.98]"
        @click="start"
      >
        開始測驗
      </button>

      <Transition v-else-if="current" name="card" mode="out-in">
        <!-- 多選題 -->
        <div v-if="current.multi" :key="`${current.id}-multi`">
          <div class="grid grid-cols-2 gap-2.5">
            <button
              v-for="(o, i) in current.options"
              :key="o.label"
              type="button"
              class="flex items-center gap-2 rounded-2xl border px-4 py-3.5 text-left text-lg transition active:scale-[0.98]"
              :class="
                multiSelection.includes(i)
                  ? 'border-lamp-400 bg-lamp-400/15 text-lamp-200'
                  : 'border-white/10 bg-night-800 hover:bg-night-700'
              "
              :aria-pressed="multiSelection.includes(i)"
              @click="toggle(i)"
            >
              <span aria-hidden="true">{{ o.emoji }}</span>
              {{ o.label }}
            </button>
          </div>
          <button
            type="button"
            class="mt-4 w-full rounded-2xl bg-lamp-400 py-3.5 text-lg font-bold text-night-950 transition hover:bg-lamp-300 active:scale-[0.98]"
            @click="confirmMulti"
          >
            {{ index === quiz.length - 1 ? '看結果' : '下一題' }}
          </button>
        </div>

        <!-- 單選題 -->
        <div v-else :key="current.id" class="grid gap-2.5">
          <button
            v-for="(o, i) in current.options"
            :key="o.label"
            type="button"
            class="flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-left text-lg transition active:scale-[0.98]"
            :class="
              answers[current.id]?.[0] === i
                ? 'border-lamp-400/70 bg-lamp-400/10'
                : 'border-white/10 bg-night-800 hover:border-white/25 hover:bg-night-700'
            "
            @click="choose(i)"
          >
            <span class="text-2xl leading-none" aria-hidden="true">{{ o.emoji }}</span>
            <span class="flex-1">{{ o.label }}</span>
            <span
              v-if="i === suggestedMealIndex"
              class="rounded-full bg-lamp-400/20 px-2 py-0.5 text-xs text-lamp-200"
              >現在</span
            >
          </button>
        </div>
      </Transition>
    </section>

    <div v-if="started" class="mt-5 text-center">
      <button
        type="button"
        class="rounded-full px-4 py-2 text-sm text-ink-muted transition hover:bg-white/5 hover:text-ink"
        @click="back"
      >
        ↶ {{ index === 0 ? '返回' : '上一題' }}
      </button>
    </div>
  </main>
</template>
