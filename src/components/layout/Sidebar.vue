<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import type { IconName } from '@/types'
import AppIcon from '@/components/ui/AppIcon.vue'
import { useUiStore } from '@/stores/ui'

const route = useRoute()
const ui = useUiStore()

const navItems: { to: string; name: string; icon: IconName }[] = [
  { to: '/', name: 'Dashboard', icon: 'layout-grid' },
  { to: '/produtos', name: 'Produtos', icon: 'lamp' },
  { to: '/estoque', name: 'Estoque', icon: 'layers' },
  { to: '/orcamentos', name: 'Orçamentos', icon: 'file-text' },
  { to: '/notas-fiscais', name: 'Notas Fiscais', icon: 'receipt' },
  { to: '/configuracoes', name: 'Configurações', icon: 'settings' },
]

function isActive(path: string) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<template>
  <aside
    :class="[
      'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-surface-200 bg-white transition-transform lg:static lg:translate-x-0',
      ui.sidebarOpen ? 'translate-x-0' : '-translate-x-full',
    ]"
  >
    <div class="flex h-16 items-center gap-3 border-b border-surface-200 px-6">
      <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-sm font-bold text-white">
        HS
      </div>
      <div>
        <p class="text-sm font-semibold text-surface-900">HomeStudio</p>
        <p class="text-xs text-surface-700/60">Iluminação & estoque</p>
      </div>
    </div>

    <nav class="flex-1 space-y-1 overflow-y-auto p-4">
      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors"
        :class="
          isActive(item.to)
            ? 'bg-primary-50 text-primary-700'
            : 'text-surface-700 hover:bg-surface-100'
        "
        @click="ui.sidebarOpen = false"
      >
        <span
          class="flex h-8 w-8 items-center justify-center rounded-lg"
          :class="isActive(item.to) ? 'bg-primary-100 text-primary-600' : 'bg-surface-100 text-surface-500'"
        >
          <AppIcon :name="item.icon" size="sm" />
        </span>
        {{ item.name }}
      </RouterLink>
    </nav>

    <div class="border-t border-surface-200 p-4">
      <div class="rounded-xl bg-surface-50 p-3">
        <p class="text-xs font-medium text-surface-700">Modo protótipo</p>
        <p class="mt-1 text-xs text-surface-700/60">Dados mockados localmente</p>
      </div>
    </div>
  </aside>

  <div
    v-if="ui.sidebarOpen"
    class="fixed inset-0 z-30 bg-surface-900/40 lg:hidden"
    @click="ui.sidebarOpen = false"
  />
</template>
