<script setup lang="ts">
import { computed } from 'vue'

export type GenieMood = 'idle' | 'thinking' | 'confident' | 'happy' | 'sad'

const props = withDefaults(defineProps<{ mood?: GenieMood; size?: 'md' | 'lg' }>(), {
  mood: 'idle',
  size: 'md',
})

const badge = computed(
  () =>
    ({
      idle: '',
      thinking: '💭',
      confident: '✨',
      happy: '🎉',
      sad: '💧',
    })[props.mood],
)
</script>

<template>
  <div
    class="relative mx-auto grid place-items-center"
    :class="size === 'lg' ? 'size-40 sm:size-48' : 'size-28 sm:size-32'"
    aria-hidden="true"
  >
    <!-- 神燈的光暈 -->
    <div
      class="absolute inset-0 animate-glow rounded-full bg-[radial-gradient(circle,var(--color-lamp-400)_0%,transparent_65%)] blur-md"
      :class="{ 'opacity-30': mood === 'sad' }"
    />
    <div
      class="relative animate-float leading-none select-none"
      :class="size === 'lg' ? 'text-8xl sm:text-9xl' : 'text-7xl sm:text-8xl'"
    >
      🧞
    </div>
    <Transition name="badge">
      <span
        v-if="badge"
        :key="mood"
        class="absolute -top-1 -right-1 grid size-10 place-items-center rounded-full border border-white/15 bg-night-800 text-xl shadow-lg"
      >
        {{ badge }}
      </span>
    </Transition>
  </div>
</template>

<style scoped>
.badge-enter-active {
  animation: var(--animate-pop);
}
.badge-leave-active {
  transition: opacity 0.15s;
}
.badge-leave-to {
  opacity: 0;
}
</style>
