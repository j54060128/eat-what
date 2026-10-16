<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import GenieAvatar from '@/components/GenieAvatar.vue'
import SpeechBubble from '@/components/SpeechBubble.vue'
import AnswerButtons from '@/components/AnswerButtons.vue'
import { SITUATIONAL_QUESTIONS } from '@/data/recommend/questions'
import { PREFERENCE_BY_ID } from '@/data/recommend/preferences'
import {
  PREFERENCE_ANSWER_LABELS,
  encodePreferences,
  encodeSituational,
  mealByHour,
} from '@/engine/recommend/answers'
import { buildResult } from '@/engine/recommend/session'
import { useRecommendGameStore } from '@/stores/recommendGame'

const router = useRouter()
const game = useRecommendGameStore()

// 離開頁面就回到開場，下次進來重新開始
onBeforeUnmount(() => game.quit())

const situationalTotal = SITUATIONAL_QUESTIONS.length
const current = computed(() => game.currentSituational)
const preference = computed(() =>
  game.step?.kind === 'question' ? PREFERENCE_BY_ID[game.step.id] : undefined,
)
const bubbleKey = computed(() =>
  !game.started
    ? 'intro'
    : preference.value
      ? `pref-${game.prefs.length}`
      : `sit-${game.situationalIndex}`,
)

// 用餐時段題：依現在時間標示建議選項
const suggestedMealIndex = computed(() => {
  if (current.value?.id !== 'meal') return -1
  const meal = mealByHour(new Date().getHours())
  return current.value.options.findIndex((o) => o.filter?.meal === meal)
})

// ── 多選題（忌口） ──
const multiSelection = ref<number[]>([])
watch(
  current,
  (q) => {
    multiSelection.value = q?.multi ? [...(game.situational[q.id] ?? [])] : []
  },
  { immediate: true },
)

function toggle(optionIndex: number) {
  const q = current.value
  if (!q) return
  if (q.options[optionIndex]?.exclusive) {
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
  game.answerSituational(
    multiSelection.value.length ? multiSelection.value : [Math.max(exclusive, 0)],
  )
}

const thinkingLine = computed(() => {
  if (game.prefs.length === 0) return '來聊聊你現在的胃……'
  if (game.remaining > 15) return '還有不少選擇……'
  if (game.remaining > 5) return '範圍越來越小了……'
  return '快要決定了！'
})

// 神燈說可以推薦了 → 跳到結果頁（網址帶著作答，方便分享）
watch(
  () => game.step?.kind,
  (kind) => {
    if (kind !== 'done') return
    const result = buildResult(game.state, game.input)
    router.push({
      name: 'result',
      query: {
        a: encodeSituational(game.situational),
        p: encodePreferences(game.prefs),
        d: result?.dish.id,
      },
    })
  },
)
</script>

<template>
  <AppHeader title="推薦模式">
    <span v-if="game.started" class="text-sm text-ink-muted">
      {{
        game.inPreferences
          ? `第 ${game.prefs.length + 1} 題`
          : `${game.situationalIndex + 1} / ${situationalTotal}`
      }}
    </span>
  </AppHeader>

  <main class="flex flex-1 flex-col pt-4">
    <GenieAvatar :mood="game.started ? 'thinking' : 'idle'" />

    <!-- 情境題進度條 -->
    <div
      v-if="game.started && !game.inPreferences"
      class="mx-auto mt-3 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-white/10"
    >
      <div
        class="h-full rounded-full bg-gradient-to-r from-mist-400 to-lamp-300 transition-[width] duration-500"
        :style="{ width: `${Math.round((game.situationalIndex / situationalTotal) * 100)}%` }"
      />
    </div>

    <SpeechBubble>
      <Transition name="card" mode="out-in">
        <div v-if="!game.started" key="intro">
          <p class="text-2xl leading-snug">不知道今天吃什麼？<br />交給神燈吧！</p>
          <p class="mt-3 text-sm text-ink-muted">
            先確認幾個實際條件，再問你幾題「想不想吃」，神燈幫你一步步縮小範圍。
          </p>
        </div>
        <div v-else-if="preference" :key="bubbleKey">
          <p class="text-sm text-ink-muted">{{ thinkingLine }}</p>
          <p class="mt-2 text-2xl leading-snug">{{ preference.text }}</p>
        </div>
        <div v-else-if="current" :key="bubbleKey">
          <p class="text-sm text-ink-muted">先確認一下……</p>
          <p class="mt-2 text-2xl leading-snug">{{ current.text }}</p>
        </div>
      </Transition>
    </SpeechBubble>

    <!-- 還剩幾道 -->
    <p v-if="preference" class="mt-4 text-center text-sm text-ink-muted">
      神燈鎖定中：還剩約 <span class="text-lamp-300">{{ game.remaining }}</span> 道
    </p>

    <section class="mt-6">
      <button
        v-if="!game.started"
        type="button"
        class="w-full rounded-2xl bg-lamp-400 py-4 text-xl font-bold text-night-950 shadow-[0_10px_40px_-10px_var(--color-lamp-400)] transition hover:bg-lamp-300 active:scale-[0.98]"
        @click="game.start()"
      >
        開始
      </button>

      <!-- 偏好追問 -->
      <div v-else-if="preference">
        <AnswerButtons :labels="PREFERENCE_ANSWER_LABELS" @answer="game.answerPreference" />
        <button
          v-if="game.prefs.length >= 2"
          type="button"
          class="mt-4 w-full rounded-2xl border border-lamp-400/50 py-3.5 text-lg text-lamp-200 transition hover:bg-lamp-400/10"
          @click="game.stopNow()"
        >
          ✨ 夠了，直接幫我選
        </button>
      </div>

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
            下一題
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
              game.situational[current.id]?.[0] === i
                ? 'border-lamp-400/70 bg-lamp-400/10'
                : 'border-white/10 bg-night-800 hover:border-white/25 hover:bg-night-700'
            "
            @click="game.answerSituational([i])"
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

    <div v-if="game.started" class="mt-5 text-center">
      <button
        type="button"
        class="rounded-full px-4 py-2 text-sm text-ink-muted transition hover:bg-white/5 hover:text-ink"
        @click="game.back()"
      >
        ↶ {{ game.situationalIndex === 0 ? '返回' : '上一題' }}
      </button>
    </div>
  </main>
</template>
