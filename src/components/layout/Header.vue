<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppIcon from '@/components/ui/AppIcon.vue'
import { useUiStore } from '@/stores/ui'

const route = useRoute()
const ui = useUiStore()

const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    dashboard: 'Dashboard',
    portfolio: 'Portfólio',
    products: 'Produtos',
    'product-detail': 'Detalhes do Produto',
    stock: 'Controle de Estoque',
    budgets: 'Orçamentos',
    'budget-detail': 'Detalhes do Orçamento',
    invoices: 'Notas Fiscais',
    'invoice-detail': 'Detalhes da NF',
    settings: 'Configurações',
  }
  return titles[String(route.name)] ?? 'HomeStudio'
})
</script>

<template>
  <header class="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-surface-200 bg-white/80 px-4 backdrop-blur-md lg:px-8">
    <div class="flex items-center gap-3">
      <button
        type="button"
        class="rounded-lg p-2 text-surface-500 hover:bg-surface-100 hover:text-surface-700 lg:hidden"
        @click="ui.toggleSidebar()"
      >
        <AppIcon name="menu" size="md" />
      </button>
      <div>
        <h1 class="text-lg font-semibold text-surface-900">{{ pageTitle }}</h1>
        <p class="hidden text-xs text-surface-700/60 sm:block">
          {{ new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }) }}
        </p>
      </div>
    </div>

    <div class="flex items-center gap-3">
      <div class="hidden items-center gap-2 rounded-full bg-surface-100 px-3 py-1.5 text-sm text-surface-700 sm:flex">
        <span class="h-2 w-2 rounded-full bg-emerald-500" />
        Usuário Demo
      </div>
      <div class="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
        UD
      </div>
    </div>
  </header>
</template>
