<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div
    class="mx-auto flex min-h-dvh w-full max-w-xl flex-col px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))]"
  >
    <RouterView />
  </div>
</template>
