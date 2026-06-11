<script setup lang="ts">
import { homeLogo } from '@/data/portfolio'
</script>

<template>
  <footer id="contato" class="border-t border-stone-200/80 py-16 lg:py-24">
    <div class="mx-auto max-w-7xl px-6 text-center lg:px-10">
      <img :src="homeLogo" alt="Home Studio" class="mx-auto h-10 w-auto opacity-90" />
      <p class="mt-8 font-display text-2xl font-light text-portfolio-text lg:text-3xl">
        Iluminação que transforma espaços
      </p>
      <p class="mt-4 text-sm text-portfolio-muted">
        Home Studio — Estúdio Luminotécnico
      </p>
      <p class="mt-10 text-[10px] uppercase tracking-[0.3em] text-stone-400">
        © {{ new Date().getFullYear() }} Home Studio
      </p>
    </div>
  </footer>
</template>
