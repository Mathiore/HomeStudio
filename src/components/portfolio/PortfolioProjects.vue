<script setup lang="ts">
import { projects } from '@/data/portfolio'
import ProjectSection from './ProjectSection.vue'
</script>

<template>
  <section id="projetos" class="relative">
    <div class="mx-auto max-w-7xl px-6 pb-16 pt-8 lg:px-10 lg:pb-24">
      <p class="text-[10px] font-medium uppercase tracking-[0.35em] text-portfolio-accent">
        Portfólio
      </p>
      <h2 class="mt-4 font-display text-4xl font-light tracking-tight text-portfolio-text lg:text-5xl">
        Projetos
      </h2>
      <p class="mt-4 max-w-xl text-portfolio-muted">
        Uma seleção de ambientes transformados pela luz — residenciais, comerciais e industriais.
      </p>
    </div>

    <div class="divide-y divide-stone-200/80">
      <ProjectSection
        v-for="(project, index) in projects"
        :key="project.id"
        :project="project"
        :index="index"
      />
    </div>
  </section>
</template>
