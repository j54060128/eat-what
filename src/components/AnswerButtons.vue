<script setup lang="ts">
import { onKeyStroke } from '@vueuse/core'
import { ANSWERS, type Answer } from '@/engine/guess/likelihood'

const emit = defineEmits<{ answer: [value: Answer] }>()

// 每個回答的樣式：是／不是最醒目，「可能」次之，「不知道」最低調
const styles: Record<Answer, string> = {
  yes: 'bg-lamp-400 text-night-950 hover:bg-lamp-300 font-bold',
  probably: 'border border-lamp-400/60 text-lamp-200 hover:bg-lamp-400/10',
  unknown: 'text-ink-muted hover:bg-white/5 hover:text-ink',
  probablyNot: 'border border-mist-400/50 text-mist-200 hover:bg-mist-400/10',
  no: 'bg-mist-300 text-night-950 hover:bg-mist-200 font-bold',
}

// 桌機可以用數字鍵 1~5 快速作答
onKeyStroke(['1', '2', '3', '4', '5'], (e) => {
  const answer = ANSWERS[Number(e.key) - 1]
  if (answer) emit('answer', answer.id)
})
</script>

<template>
  <div class="grid gap-2.5">
    <button
      v-for="(a, i) in ANSWERS"
      :key="a.id"
      type="button"
      class="group relative rounded-2xl px-4 py-3.5 text-lg transition-[background-color,transform] duration-150 active:scale-[0.98]"
      :class="styles[a.id]"
      @click="emit('answer', a.id)"
    >
      {{ a.label }}
      <kbd
        class="absolute top-1/2 right-4 hidden -translate-y-1/2 text-xs font-normal opacity-50 sm:inline"
        >{{ i + 1 }}</kbd
      >
    </button>
  </div>
</template>
