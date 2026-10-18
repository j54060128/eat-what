<script setup lang="ts">
import { computed, ref } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import { CATEGORIES, DISHES, googleMapsUrl } from '@/data'
import { dishTags } from '@/engine/recommend/tags'
import { suggestFoodUrl } from '@/composables/useShareResult'

const query = ref('')
const openId = ref<string | null>(null)
const suggestUrl = suggestFoodUrl()

// 依類型分組；搜尋字串符合類型名稱時整組顯示，否則只留名稱符合的料理
const groups = computed(() => {
  const q = query.value.trim()
  return CATEGORIES.map((category) => {
    const all = DISHES.filter((d) => d.categoryId === category.id)
    const dishes = !q || category.name.includes(q) ? all : all.filter((d) => d.name.includes(q))
    return { category, dishes }
  }).filter((g) => g.dishes.length > 0)
})

const found = computed(() => groups.value.reduce((s, g) => s + g.dishes.length, 0))

function toggle(id: string) {
  openId.value = openId.value === id ? null : id
}
</script>

<template>
  <AppHeader title="料理圖鑑" />

  <main class="flex flex-1 flex-col pt-2 pb-6">
    <p class="text-center text-sm text-ink-muted">
      神燈認得 {{ CATEGORIES.length }} 種類型、{{ DISHES.length }} 道料理
    </p>

    <label class="relative mt-4 block">
      <span class="sr-only">搜尋料理或類型</span>
      <span
        class="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-lg"
        aria-hidden="true"
        >🔍</span
      >
      <input
        v-model="query"
        type="search"
        placeholder="搜尋料理或類型，例如：拉麵"
        class="w-full rounded-2xl border border-white/10 bg-night-800 py-3 pr-4 pl-12 text-lg text-ink placeholder:text-ink-muted/70 focus:border-lamp-400/60 focus:outline-none"
      />
    </label>
    <p v-if="query.trim()" class="mt-2 text-sm text-ink-muted" aria-live="polite">
      找到 {{ found }} 道
    </p>

    <!-- 找不到 -->
    <div v-if="groups.length === 0" class="mt-12 text-center">
      <p class="text-5xl" aria-hidden="true">🤔</p>
      <p class="mt-4 text-lg">神燈還不認得「{{ query.trim() }}」</p>
      <a
        v-if="suggestUrl"
        :href="suggestUrl"
        target="_blank"
        rel="noopener"
        class="mt-5 inline-block rounded-2xl border border-lamp-400/50 px-5 py-3 text-lamp-200 transition hover:bg-lamp-400/10"
      >
        💡 告訴神燈這道料理
      </a>
    </div>

    <section v-for="g in groups" :key="g.category.id" class="mt-7">
      <h2 class="flex items-baseline gap-2 text-lg">
        <span aria-hidden="true">{{ g.category.emoji }}</span>
        {{ g.category.name }}
        <span class="text-sm text-ink-muted">{{ g.dishes.length }} 道</span>
      </h2>

      <ul class="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-3">
        <li
          v-for="d in g.dishes"
          :key="d.id"
          :class="{ 'col-span-2 sm:col-span-3': openId === d.id }"
        >
          <button
            type="button"
            class="flex w-full items-center gap-2.5 rounded-2xl border px-3 py-2.5 text-left transition"
            :class="
              openId === d.id
                ? 'border-lamp-400/50 bg-night-700'
                : 'border-white/10 bg-night-800 hover:bg-night-700'
            "
            :aria-expanded="openId === d.id"
            @click="toggle(d.id)"
          >
            <span class="text-2xl leading-none" aria-hidden="true">{{ d.emoji }}</span>
            <span class="min-w-0 flex-1 truncate">{{ d.name }}</span>
          </button>

          <div v-if="openId === d.id" class="mt-2 rounded-2xl bg-night-800/60 px-4 py-3">
            <p class="text-xs text-ink-muted">神燈眼中的它</p>
            <ul class="mt-2 flex flex-wrap gap-1.5" aria-label="特徵">
              <li
                v-for="t in dishTags(d)"
                :key="t"
                class="rounded-full bg-lamp-400/15 px-2.5 py-0.5 text-sm text-lamp-200"
              >
                {{ t }}
              </li>
            </ul>
            <a
              :href="googleMapsUrl(d)"
              target="_blank"
              rel="noopener"
              class="mt-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-1.5 text-sm text-ink transition-colors hover:bg-white/10"
            >
              📍 附近找找
            </a>
          </div>
        </li>
      </ul>
    </section>
  </main>
</template>
