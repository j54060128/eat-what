<template>
  <div class="relative mt-4">
    <!-- 對話框的小尖角，指向上方的神燈 -->
    <div
      class="absolute -top-2 left-1/2 size-4 -translate-x-1/2 rotate-45 border-t border-l border-white/10 bg-night-800"
    />
    <div
      class="relative rounded-3xl border border-white/10 bg-night-800 px-5 py-5 text-center shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] sm:px-7"
      aria-live="polite"
    >
      <slot />
    </div>
  </div>
</template>
