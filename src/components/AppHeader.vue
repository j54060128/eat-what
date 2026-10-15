<script setup lang="ts">
import { RouterLink } from 'vue-router'

defineProps<{ title: string }>()
</script>

<template>
  <header class="flex items-center justify-between py-2">
    <RouterLink
      to="/"
      class="-ml-2 rounded-full px-3 py-2 text-sm text-ink-muted transition-colors hover:bg-white/5 hover:text-ink"
    >
      ← 首頁
    </RouterLink>
    <h1 class="text-base text-lamp-300">{{ title }}</h1>
    <div class="min-w-16 text-right">
      <slot />
    </div>
  </header>
</template>
