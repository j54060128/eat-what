<script setup lang="ts">
import { computed, onBeforeUnmount } from 'vue'
import { RouterLink } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import GenieAvatar, { type GenieMood } from '@/components/GenieAvatar.vue'
import SpeechBubble from '@/components/SpeechBubble.vue'
import AnswerButtons from '@/components/AnswerButtons.vue'
import FoodCard from '@/components/FoodCard.vue'
import { DISHES, getCategory, getDish } from '@/data'
import { TRAIT_BY_ID } from '@/data/traits'
import { useGuessGameStore } from '@/stores/guessGame'
import { homeUrl, suggestFoodUrl, useShareResult } from '@/composables/useShareResult'

const game = useGuessGameStore()
const { share, copied } = useShareResult()
const suggestUrl = suggestFoodUrl()

// 離開頁面就重置，下次進來重新開始
onBeforeUnmount(() => game.quit())

const step = computed(() => game.step)
const finished = computed(() => step.value.kind === 'won' || step.value.kind === 'lost')
const stepKey = computed(() => `${game.events.length}-${step.value.kind}`)

const mood = computed<GenieMood>(() => {
  if (!game.started) return 'idle'
  switch (step.value.kind) {
    case 'question':
      return 'thinking'
    case 'confirmCategory':
    case 'guessDish':
      return 'confident'
    case 'pickFromList':
      return 'thinking'
    case 'won':
      return 'happy'
    case 'lost':
      return 'sad'
  }
  return 'idle'
})

/** 對上一個回答的反應（猜錯類型或料理時） */
const reaction = computed(() => {
  const last = game.events.at(-1)
  if (last?.type === 'category' && !last.correct) return '咦？不是這類嗎……'
  if (last?.type === 'dish' && !last.correct) return '可惡，猜錯了！再讓我問幾題……'
  return null
})

const thinkingLine = computed(() => {
  const c = game.confidence
  if (c < 0.35) return '讓我感應一下……'
  if (c < 0.65) return '有點眉目了……'
  return '快要抓到了！'
})

const wonDish = computed(() => (step.value.kind === 'won' ? getDish(step.value.dishId) : null))

function shareWin() {
  if (!wonDish.value) return
  const n = game.state.questionCount
  share(`神燈只用了 ${n} 題就猜中我想吃的「${wonDish.value.name}」！你也來考考神燈吧 🧞`, homeUrl())
}
</script>

<template>
  <AppHeader title="猜謎模式">
    <span v-if="game.started && !finished" class="text-sm text-ink-muted">
      第 {{ game.state.questionCount + 1 }} 題
    </span>
  </AppHeader>

  <main class="flex flex-1 flex-col pt-4">
    <GenieAvatar :mood="mood" />

    <SpeechBubble>
      <Transition name="card" mode="out-in">
        <!-- 開場 -->
        <div v-if="!game.started" key="intro">
          <p class="text-2xl leading-snug">在心裡想好一道料理，<br />我來猜猜看！</p>
          <p class="mt-3 text-sm text-ink-muted">
            便當、拉麵、夜市小吃、甜點都可以，神燈目前認得 {{ DISHES.length }} 道料理。
          </p>
        </div>

        <div v-else :key="stepKey">
          <template v-if="step.kind === 'question'">
            <p class="text-sm text-ink-muted">{{ reaction ?? thinkingLine }}</p>
            <p class="mt-2 text-2xl leading-snug sm:text-[1.7rem]">
              {{ TRAIT_BY_ID[step.traitId].question }}
            </p>
          </template>

          <template v-else-if="step.kind === 'confirmCategory'">
            <p class="text-sm text-ink-muted">{{ reaction ?? '我感覺到了……' }}</p>
            <p class="mt-3 text-4xl">{{ getCategory(step.categoryId).emoji }}</p>
            <p class="mt-2 text-2xl text-lamp-300">「{{ getCategory(step.categoryId).name }}」</p>
            <p class="mt-2 text-lg">你想的是這一類的料理嗎？</p>
            <p class="mt-3 text-sm text-ink-muted">{{ getCategory(step.categoryId).blurb }}</p>
          </template>

          <template v-else-if="step.kind === 'guessDish'">
            <p class="text-sm text-ink-muted">我知道了！</p>
            <p class="mt-2 text-2xl">你想吃的是……</p>
          </template>

          <template v-else-if="step.kind === 'pickFromList'">
            <p class="text-2xl leading-snug">唔……我有點混亂了。</p>
            <p class="mt-2 text-ink-muted">是下面其中一道嗎？</p>
          </template>

          <template v-else-if="step.kind === 'won'">
            <p class="text-2xl">就知道是這個！</p>
            <p class="mt-2 text-ink-muted">
              {{
                game.state.pickedFromList
                  ? '差點就被你考倒了'
                  : `神燈只用了 ${game.state.questionCount} 題`
              }}
            </p>
          </template>

          <template v-else-if="step.kind === 'lost'">
            <p class="text-2xl leading-snug">可惡……這次被你難倒了！</p>
            <p class="mt-2 text-ink-muted">神燈的料理清單還不夠多，下次一定猜到。</p>
          </template>
        </div>
      </Transition>
    </SpeechBubble>

    <!-- 把握程度 -->
    <div
      v-if="game.started && (step.kind === 'question' || step.kind === 'confirmCategory')"
      class="mx-auto mt-4 flex w-full max-w-xs items-center gap-3 text-xs text-ink-muted"
    >
      <span class="shrink-0">神燈的把握</span>
      <div class="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
        <div
          class="h-full rounded-full bg-gradient-to-r from-lamp-500 to-lamp-300 transition-[width] duration-500"
          :style="{ width: `${Math.round(game.confidence * 100)}%` }"
        />
      </div>
    </div>

    <!-- 操作區 -->
    <section class="mt-6">
      <button
        v-if="!game.started"
        type="button"
        class="w-full rounded-2xl bg-lamp-400 py-4 text-xl font-bold text-night-950 shadow-[0_10px_40px_-10px_var(--color-lamp-400)] transition hover:bg-lamp-300 active:scale-[0.98]"
        @click="game.start()"
      >
        想好了，開始！
      </button>

      <AnswerButtons v-else-if="step.kind === 'question'" @answer="game.answer" />

      <div v-else-if="step.kind === 'confirmCategory'" class="grid grid-cols-2 gap-3">
        <button
          type="button"
          class="rounded-2xl bg-lamp-400 py-4 text-lg font-bold text-night-950 transition hover:bg-lamp-300 active:scale-[0.98]"
          @click="game.judgeCategory(true)"
        >
          對，就是這類！
        </button>
        <button
          type="button"
          class="rounded-2xl bg-mist-300 py-4 text-lg font-bold text-night-950 transition hover:bg-mist-200 active:scale-[0.98]"
          @click="game.judgeCategory(false)"
        >
          不是這類
        </button>
      </div>

      <div v-else-if="step.kind === 'guessDish'" class="grid gap-4">
        <FoodCard :dish="getDish(step.dishId)" :show-map="false" />
        <div class="grid grid-cols-2 gap-3">
          <button
            type="button"
            class="rounded-2xl bg-lamp-400 py-4 text-lg font-bold text-night-950 transition hover:bg-lamp-300 active:scale-[0.98]"
            @click="game.judgeDish(true)"
          >
            猜對了！
          </button>
          <button
            type="button"
            class="rounded-2xl bg-mist-300 py-4 text-lg font-bold text-night-950 transition hover:bg-mist-200 active:scale-[0.98]"
            @click="game.judgeDish(false)"
          >
            不對喔
          </button>
        </div>
      </div>

      <div v-else-if="step.kind === 'pickFromList'" class="grid gap-2.5">
        <button
          v-for="id in step.dishIds"
          :key="id"
          type="button"
          class="rounded-2xl text-left transition hover:brightness-125 active:scale-[0.99]"
          @click="game.pick(id)"
        >
          <FoodCard :dish="getDish(id)" size="sm" :show-map="false" />
        </button>
        <button
          type="button"
          class="mt-1 rounded-2xl py-3.5 text-lg text-ink-muted transition hover:bg-white/5 hover:text-ink"
          @click="game.pick(null)"
        >
          都不是
        </button>
      </div>

      <div v-else-if="step.kind === 'won' && wonDish" class="grid gap-4">
        <FoodCard :dish="wonDish" />
        <div class="grid grid-cols-2 gap-3">
          <button
            type="button"
            class="rounded-2xl bg-lamp-400 py-3.5 text-lg font-bold text-night-950 transition hover:bg-lamp-300 active:scale-[0.98]"
            @click="game.start()"
          >
            再玩一次
          </button>
          <button
            type="button"
            class="rounded-2xl border border-white/15 py-3.5 text-lg transition hover:bg-white/5"
            @click="shareWin"
          >
            {{ copied ? '已複製！' : '分享戰績' }}
          </button>
        </div>
      </div>

      <div v-else-if="step.kind === 'lost'" class="grid gap-3">
        <a
          v-if="suggestUrl"
          :href="suggestUrl"
          target="_blank"
          rel="noopener"
          class="rounded-2xl border border-lamp-400/50 py-3.5 text-center text-lg text-lamp-200 transition hover:bg-lamp-400/10"
        >
          💡 告訴神燈你想的料理
        </a>
        <button
          type="button"
          class="rounded-2xl bg-lamp-400 py-3.5 text-lg font-bold text-night-950 transition hover:bg-lamp-300 active:scale-[0.98]"
          @click="game.start()"
        >
          再挑戰一次
        </button>
        <RouterLink
          to="/recommend"
          class="rounded-2xl py-3 text-center text-ink-muted transition hover:bg-white/5 hover:text-ink"
        >
          還是讓神燈推薦你吃什麼？
        </RouterLink>
      </div>
    </section>

    <!-- 上一步 -->
    <div v-if="game.started && !finished && game.events.length > 0" class="mt-5 text-center">
      <button
        type="button"
        class="rounded-full px-4 py-2 text-sm text-ink-muted transition hover:bg-white/5 hover:text-ink"
        @click="game.undo()"
      >
        ↶ 上一步
      </button>
    </div>
  </main>
</template>
