<script setup lang="ts">
import PortfolioHero from '@/components/portfolio/PortfolioHero.vue'
import PortfolioStory from '@/components/portfolio/PortfolioStory.vue'
import PortfolioProjects from '@/components/portfolio/PortfolioProjects.vue'
import PortfolioFooter from '@/components/portfolio/PortfolioFooter.vue'
</script>

<template>
  <div class="portfolio min-h-screen bg-portfolio-bg text-portfolio-text selection:bg-portfolio-accent/20">
    <main>
      <PortfolioHero />
      <PortfolioStory />
      <PortfolioProjects />
    </main>
    <PortfolioFooter />
  </div>
</template>
