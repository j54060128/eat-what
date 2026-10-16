<script setup lang="ts">
import { RouterLink } from 'vue-router'
import GenieAvatar from '@/components/GenieAvatar.vue'
import { CATEGORIES, DISHES } from '@/data'

const modes = [
  {
    to: '/guess',
    emoji: '🔮',
    title: '猜謎模式',
    tagline: '你心裡想一道料理',
    desc: '回答神燈的是非題，看它幾題能猜中你想吃什麼。',
    accent: 'from-lamp-400/25 to-transparent border-lamp-400/40',
  },
  {
    to: '/recommend',
    emoji: '🍽️',
    title: '推薦模式',
    tagline: '不知道今天吃什麼？',
    desc: '回答幾個簡單問題，神燈幫你釐清現在想吃什麼。',
    accent: 'from-mist-400/25 to-transparent border-mist-400/40',
  },
]
</script>

<template>
  <main class="flex flex-1 flex-col justify-center py-6">
    <section class="text-center">
      <GenieAvatar size="lg" />
      <h1 class="mt-4 text-5xl tracking-wide text-lamp-300 sm:text-6xl">神燈吃什麼</h1>
      <p class="mt-3 text-lg text-ink-muted">摩擦神燈，說出你的胃的願望。</p>
    </section>

    <nav class="mt-10 grid gap-4" aria-label="選擇玩法">
      <RouterLink
        v-for="m in modes"
        :key="m.to"
        :to="m.to"
        class="group flex items-center gap-4 rounded-3xl border bg-gradient-to-br px-5 py-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_15px_40px_-15px_rgba(0,0,0,0.7)] active:scale-[0.99]"
        :class="m.accent"
      >
        <span class="text-5xl leading-none" aria-hidden="true">{{ m.emoji }}</span>
        <span class="min-w-0 flex-1">
          <span class="block text-sm text-ink-muted">{{ m.tagline }}</span>
          <span class="mt-0.5 block text-2xl">{{ m.title }}</span>
          <span class="mt-1 block text-sm leading-relaxed text-ink-muted">{{ m.desc }}</span>
        </span>
        <span
          class="text-2xl text-ink-muted transition-transform group-hover:translate-x-1"
          aria-hidden="true"
          >›</span
        >
      </RouterLink>
    </nav>

    <p class="mt-10 text-center text-xs text-ink-muted/80">
      神燈目前認得 {{ CATEGORIES.length }} 種類型、{{ DISHES.length }} 道台灣日常料理
    </p>
  </main>
</template>
