<script setup lang="ts">
import { ref } from 'vue'
import type { PortfolioProject } from '@/data/portfolio'
import PortfolioLightbox from './PortfolioLightbox.vue'

defineProps<{
  project: PortfolioProject
  index: number
}>()

const lightboxOpen = ref(false)
const lightboxMedia = ref({ src: '', type: 'image' as const, alt: '' })

function openLightbox(src: string, type: 'image' | 'video', alt: string) {
  lightboxMedia.value = { src, type, alt }
  lightboxOpen.value = true
}
</script>

<template>
  <article class="project-section py-20 lg:py-28">
    <div class="mx-auto max-w-7xl px-6 lg:px-10">
      <header class="mb-12 flex flex-col gap-4 border-b border-stone-200/80 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span class="text-[10px] font-medium uppercase tracking-[0.35em] text-portfolio-muted">
            {{ String(index + 1).padStart(2, '0') }}
          </span>
          <h3 class="mt-2 font-display text-3xl font-light tracking-tight text-portfolio-text lg:text-4xl">
            {{ project.name }}
          </h3>
          <p
            v-if="project.legend"
            class="mt-4 max-w-2xl text-sm font-light leading-relaxed text-portfolio-muted md:text-base md:leading-relaxed"
          >
            {{ project.legend }}
          </p>
        </div>
        <span class="text-[10px] font-medium uppercase tracking-[0.3em] text-portfolio-accent">
          {{ project.category }}
        </span>
      </header>

      <div
        class="grid gap-3"
        :class="project.media.length === 1 ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'"
      >
        <button
          v-for="(item, i) in project.media"
          :key="item.src"
          type="button"
          class="group relative overflow-hidden bg-portfolio-surface focus:outline-none focus-visible:ring-1 focus-visible:ring-portfolio-accent"
          :class="[
            i === 0 && project.media.length > 2 ? 'col-span-2 row-span-2 aspect-[4/3]' : 'aspect-square',
            item.type === 'video' ? 'col-span-2 aspect-video' : '',
          ]"
          @click="openLightbox(item.src, item.type, item.alt)"
        >
          <img
            v-if="item.type === 'image'"
            :src="item.src"
            :alt="item.alt"
            class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            loading="lazy"
          />
          <template v-else>
            <video
              :src="item.src"
              muted
              loop
              playsinline
              class="h-full w-full object-cover"
            />
            <div class="absolute inset-0 flex items-center justify-center bg-black/30">
              <span class="flex h-14 w-14 items-center justify-center rounded-full border border-white/30 text-white/80 backdrop-blur-sm">
                <svg class="ml-1 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </div>
          </template>
          <div class="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/20" />
        </button>
      </div>
    </div>

    <PortfolioLightbox
      :open="lightboxOpen"
      :src="lightboxMedia.src"
      :type="lightboxMedia.type"
      :alt="lightboxMedia.alt"
      @close="lightboxOpen = false"
    />
  </article>
</template>
