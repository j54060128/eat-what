<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import GenieAvatar from '@/components/GenieAvatar.vue'
import FoodCard from '@/components/FoodCard.vue'
import PersonaCard from '@/components/PersonaCard.vue'
import { DISHES } from '@/data'
import { createRng, randomSeed } from '@/engine/random'
import { buildProfile, decodeAnswers } from '@/engine/recommend/profile'
import { recommend } from '@/engine/recommend/score'
import { useShareResult } from '@/composables/useShareResult'

const route = useRoute()
const router = useRouter()
const { share, copied } = useShareResult()

const answers = computed(() => decodeAnswers(String(route.query.a ?? '')))
const profile = computed(() => buildProfile(answers.value))
const dishId = computed(() => (typeof route.query.d === 'string' ? route.query.d : undefined))

/** 這次看過、按了「換一個」的料理 */
const excluded = ref(new Set<string>())

const result = computed(() =>
  recommend(DISHES, profile.value, {
    rng: createRng(randomSeed()),
    dishId: dishId.value,
    exclude: excluded.value,
  }),
)

// 作答無效（例如網址被改壞）就回到測驗
watch(
  answers,
  (a) => {
    if (Object.keys(a).length === 0) router.replace({ name: 'recommend' })
  },
  { immediate: true },
)

// 揭曉前的小小懸念
const revealed = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined
function reveal(delay: number) {
  revealed.value = false
  clearTimeout(timer)
  timer = setTimeout(() => (revealed.value = true), delay)
}
onMounted(() => reveal(1200))
onBeforeUnmount(() => clearTimeout(timer))

function another() {
  if (!result.value) return
  excluded.value = new Set([...excluded.value, result.value.dish.id])
  const next = recommend(DISHES, profile.value, {
    rng: createRng(randomSeed()),
    exclude: excluded.value,
  })
  if (!next) return
  router.replace({ query: { ...route.query, d: next.dish.id } })
  reveal(500)
}

const relaxNotice = computed(() => {
  switch (result.value?.relaxed) {
    case 'price':
      return '符合預算的選擇太少，神燈稍微放寬了預算。'
    case 'meal':
      return '這個時段的選擇太少，神燈放寬了用餐時段。'
    case 'both':
      return '條件有點嚴格，神燈放寬了預算和用餐時段。'
    default:
      return null
  }
})

function shareResult() {
  const r = result.value
  if (!r) return
  share(
    `神燈說我現在是「${r.persona.name}」，今天該吃「${r.dish.name}」！你也來測測看 🧞`,
    window.location.href,
  )
}
</script>

<template>
  <AppHeader title="推薦結果" />

  <main v-if="result" class="flex flex-1 flex-col pt-4">
    <Transition name="card" mode="out-in">
      <div
        v-if="!revealed"
        key="loading"
        class="flex flex-1 flex-col items-center justify-center py-16"
      >
        <GenieAvatar mood="thinking" size="lg" />
        <p class="mt-6 text-xl text-ink-muted">神燈施法中……</p>
      </div>

      <div v-else :key="result.dish.id" class="grid gap-5">
        <PersonaCard :persona="result.persona" />

        <section>
          <p class="mb-3 text-center text-ink-muted">
            神燈建議你今天吃
            <span class="text-ink">{{ result.category.emoji }} {{ result.category.name }}</span>
          </p>
          <FoodCard :dish="result.dish">
            <ul class="mt-4 flex flex-wrap justify-center gap-2" aria-label="推薦理由">
              <li
                v-for="r in result.reasons"
                :key="r"
                class="rounded-full bg-white/8 px-3 py-1 text-sm text-ink-muted"
              >
                {{ r }}
              </li>
            </ul>
          </FoodCard>
          <p v-if="relaxNotice" class="mt-3 text-center text-xs text-ink-muted">
            {{ relaxNotice }}
          </p>
        </section>

        <div class="grid grid-cols-2 gap-3">
          <button
            type="button"
            class="rounded-2xl bg-lamp-400 py-3.5 text-lg font-bold text-night-950 transition hover:bg-lamp-300 active:scale-[0.98]"
            @click="another"
          >
            🎲 換一個
          </button>
          <button
            type="button"
            class="rounded-2xl border border-white/15 py-3.5 text-lg transition hover:bg-white/5"
            @click="shareResult"
          >
            {{ copied ? '已複製！' : '分享結果' }}
          </button>
        </div>

        <section v-if="result.sameCategory.length" class="grid gap-2.5">
          <h2 class="text-sm text-ink-muted">同類型也可以考慮</h2>
          <FoodCard v-for="d in result.sameCategory" :key="d.id" :dish="d" size="sm" />
        </section>

        <section v-if="result.otherCategories.length" class="grid gap-2.5">
          <h2 class="text-sm text-ink-muted">想換換口味的話</h2>
          <FoodCard v-for="d in result.otherCategories" :key="d.id" :dish="d" size="sm" />
        </section>

        <nav class="mt-2 grid gap-2 text-center">
          <RouterLink
            to="/recommend"
            class="rounded-2xl py-3 text-ink-muted transition hover:bg-white/5 hover:text-ink"
          >
            重新測驗
          </RouterLink>
          <RouterLink
            to="/guess"
            class="rounded-2xl py-3 text-ink-muted transition hover:bg-white/5 hover:text-ink"
          >
            🔮 換玩猜謎模式
          </RouterLink>
        </nav>
      </div>
    </Transition>
  </main>
</template>
