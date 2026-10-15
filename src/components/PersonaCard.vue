<script setup lang="ts">
import type { Persona } from '@/data/recommend/types'

defineProps<{ persona: Persona }>()
</script>

<template>
  <div
    class="rounded-3xl border border-mist-400/30 bg-gradient-to-br from-mist-400/15 via-night-800 to-night-800 px-5 py-5"
  >
    <p class="text-sm text-mist-300">🔮 測驗結果：現在的你是</p>
    <div class="mt-3 flex items-center gap-3">
      <span class="text-5xl leading-none" aria-hidden="true">{{ persona.emoji }}</span>
      <p class="text-2xl leading-snug text-mist-200">{{ persona.name }}</p>
    </div>
    <p class="mt-3 leading-relaxed text-ink-muted">{{ persona.description }}</p>
  </div>
</template>
