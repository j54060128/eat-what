<script setup lang="ts">
import { computed } from 'vue'
import { getCategory, googleMapsUrl } from '@/data'
import type { ResolvedDish } from '@/data/types'

const props = withDefaults(
  defineProps<{ dish: ResolvedDish; size?: 'sm' | 'lg'; showMap?: boolean }>(),
  {
    size: 'lg',
    showMap: true,
  },
)

const category = computed(() => getCategory(props.dish.categoryId))
</script>

<template>
  <div
    v-if="size === 'lg'"
    class="animate-pop rounded-3xl border border-lamp-400/30 bg-gradient-to-b from-night-700 to-night-800 px-6 py-7 text-center shadow-[0_0_60px_-15px_var(--color-lamp-500)]"
  >
    <div class="text-7xl leading-none sm:text-8xl" aria-hidden="true">{{ dish.emoji }}</div>
    <p class="mt-4 text-3xl text-lamp-300 sm:text-4xl">{{ dish.name }}</p>
    <p class="mt-2 text-sm text-ink-muted">{{ category.emoji }} {{ category.name }}</p>
    <slot />
    <a
      v-if="showMap"
      :href="googleMapsUrl(dish)"
      target="_blank"
      rel="noopener"
      class="mt-5 inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-sm text-ink transition-colors hover:bg-white/10"
    >
      📍 附近找找
    </a>
  </div>

  <div
    v-else
    class="flex items-center gap-3 rounded-2xl border border-white/10 bg-night-800 px-4 py-3"
  >
    <span class="text-3xl leading-none" aria-hidden="true">{{ dish.emoji }}</span>
    <div class="min-w-0 flex-1">
      <p class="truncate text-lg">{{ dish.name }}</p>
      <p class="text-xs text-ink-muted">{{ category.name }}</p>
    </div>
    <slot />
    <a
      v-if="showMap"
      :href="googleMapsUrl(dish)"
      target="_blank"
      rel="noopener"
      class="shrink-0 rounded-full px-3 py-1.5 text-sm text-ink-muted transition-colors hover:bg-white/10 hover:text-ink"
      :aria-label="`在 Google 地圖搜尋附近的${dish.name}`"
    >
      📍
    </a>
  </div>
</template>
