<script setup lang="ts">
import { founderPhoto } from '@/data/portfolio'
</script>

<template>
  <section id="historia" class="relative py-16 lg:py-24">
    <div class="mx-auto max-w-5xl px-6 lg:px-10">
      <p class="mb-10 text-[10px] font-medium uppercase tracking-[0.35em] text-portfolio-accent md:text-xs md:tracking-[0.4em]">
        Sobre nós
      </p>

      <div class="flex flex-col gap-10 md:flex-row md:items-start md:gap-12 lg:gap-16">
        <div class="min-w-0 flex-1 space-y-5 md:space-y-6">
          <p class="story-block text-sm font-light leading-relaxed text-portfolio-text sm:text-base md:text-lg md:leading-[1.75] lg:text-xl">
            Fundada por
            <span class="font-normal text-portfolio-accent">Euler Ganzer</span>,
            com mais de
            <span class="font-normal">10 anos</span>
            de experiência no mercado de iluminação. A
            <span class="font-normal">Home Estúdio luminotécnico</span>
            chega para transformar ambientes com iluminação criativa e eficaz.
          </p>

          <p class="story-block text-sm font-light leading-relaxed text-portfolio-muted sm:text-base md:text-lg md:leading-[1.75] lg:text-xl">
            Nosso método de atendimento focado em uma
            <span class="italic text-portfolio-text">personalização de ambientes</span>
            para atender é
            <span class="font-normal text-portfolio-text">única</span>
            as necessidades de cada cliente.
          </p>

          <p class="story-block text-sm font-light leading-relaxed text-portfolio-muted sm:text-base md:text-lg md:leading-[1.75] lg:text-xl">
            Seja um projeto comercial, residencial ou industrial, nós atendemos o seu objetivo com
            total suporte criativo e inovador.
          </p>

          <p class="story-block border-l border-portfolio-accent/40 pl-5 text-sm font-light leading-relaxed text-portfolio-text sm:text-base md:pl-6 md:text-lg md:leading-[1.7] lg:text-xl">
            Conte com a Home Studio na criação de um espaço único, por meio da iluminação!
          </p>
        </div>

        <div class="flex shrink-0 flex-col items-center md:items-end md:pt-1">
          <img
            :src="founderPhoto"
            alt="Euler Ganzer — fundador da Home Studio"
            class="w-36 opacity-60 object-contain md:w-56 lg:w-72 xl:w-80"
          />
          <p class="mt-3 text-center text-xs text-portfolio-muted md:text-right md:text-sm">
            Euler Ganzer
            <span class="mx-1.5 text-stone-300">—</span>
            Proprietário
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.story-block {
  opacity: 0;
  transform: translateY(16px);
  animation: storyReveal 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.story-block:nth-child(1) { animation-delay: 0.1s; }
.story-block:nth-child(2) { animation-delay: 0.2s; }
.story-block:nth-child(3) { animation-delay: 0.3s; }
.story-block:nth-child(4) { animation-delay: 0.4s; }

@keyframes storyReveal {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
