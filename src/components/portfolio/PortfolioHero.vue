<script setup lang="ts">
import { homeLogo } from '@/data/portfolio'
</script>

<template>
  <section id="hero" class="relative flex min-h-[min(75vh,640px)] items-center justify-center overflow-hidden">
    <div class="pointer-events-none absolute inset-0">
      <div class="absolute left-1/2 top-1/3 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-portfolio-accent/8 blur-[100px]" />
      <div class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-stone-300/60 to-transparent" />
    </div>

    <div class="relative z-10 flex flex-col items-center px-6 text-center">
      <img
        :src="homeLogo"
        alt="Home Studio — Estúdio Luminotécnico"
        class="hero-logo w-[min(60vw,280px)] opacity-0"
      />
    </div>

    <div class="hero-scroll absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0">
      <div class="flex flex-col items-center gap-3">
        <span class="text-[9px] uppercase tracking-[0.3em] text-portfolio-muted">Scroll</span>
        <div class="h-8 w-px bg-gradient-to-b from-portfolio-accent/50 to-transparent" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-logo {
  animation: fadeUp 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards;
}

.hero-tagline {
  animation: fadeUp 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.6s forwards;
}

.hero-scroll {
  animation: fadeUp 1.4s cubic-bezier(0.16, 1, 0.3, 1) 1.2s forwards;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
