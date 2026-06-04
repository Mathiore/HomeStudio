<script setup lang="ts">
import { useProductsStore } from '@/stores/products'
import { useBudgetsStore } from '@/stores/budgets'
import { useInvoicesStore } from '@/stores/invoices'
import { useStockStore } from '@/stores/stock'

const productsStore = useProductsStore()
const budgetsStore = useBudgetsStore()
const invoicesStore = useInvoicesStore()
const stockStore = useStockStore()
</script>

<template>
  <div class="mx-auto max-w-2xl space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-surface-900">Configurações</h2>
      <p class="mt-1 text-sm text-surface-700/60">Preferências do protótipo HomeStudio</p>
    </div>

    <div class="space-y-4">
      <div class="rounded-2xl border border-surface-200 bg-white p-6">
        <h3 class="font-semibold text-surface-900">Perfil</h3>
        <div class="mt-4 space-y-3">
          <div>
            <label class="mb-1 block text-sm font-medium text-surface-700">Nome</label>
            <input
              value="Usuário Demo"
              disabled
              class="w-full rounded-xl border border-surface-200 bg-surface-50 px-3 py-2.5 text-sm text-surface-700/60"
            />
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-surface-700">E-mail</label>
            <input
              value="demo@homestudio.app"
              disabled
              class="w-full rounded-xl border border-surface-200 bg-surface-50 px-3 py-2.5 text-sm text-surface-700/60"
            />
          </div>
        </div>
      </div>

      <div class="rounded-2xl border border-surface-200 bg-white p-6">
        <h3 class="font-semibold text-surface-900">Sobre o protótipo</h3>
        <p class="mt-2 text-sm text-surface-700/70">
          O HomeStudio está rodando em modo protótipo com dados mockados localmente. Todas as
          operações de CRUD são persistidas apenas na memória do navegador durante a sessão.
        </p>
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl bg-surface-50 p-4">
            <p class="text-2xl font-bold text-primary-700">{{ productsStore.products.length }}</p>
            <p class="text-xs text-surface-700/60">Produtos no mock</p>
          </div>
          <div class="rounded-xl bg-surface-50 p-4">
            <p class="text-2xl font-bold text-primary-700">{{ stockStore.movements.length }}</p>
            <p class="text-xs text-surface-700/60">Movimentações</p>
          </div>
          <div class="rounded-xl bg-surface-50 p-4">
            <p class="text-2xl font-bold text-primary-700">{{ budgetsStore.budgets.length }}</p>
            <p class="text-xs text-surface-700/60">Orçamentos</p>
          </div>
          <div class="rounded-xl bg-surface-50 p-4">
            <p class="text-2xl font-bold text-primary-700">{{ invoicesStore.invoices.length }}</p>
            <p class="text-xs text-surface-700/60">Notas fiscais</p>
          </div>
        </div>
      </div>

      <div class="rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <h3 class="font-semibold text-amber-900">Próximos passos</h3>
        <ul class="mt-2 list-inside list-disc space-y-1 text-sm text-amber-800/80">
          <li>Integração com backend REST</li>
          <li>Autenticação de usuários</li>
          <li>Persistência em banco de dados</li>
          <li>Emissão real de NF-e</li>
          <li>Geração de PDF de orçamentos</li>
        </ul>
      </div>
    </div>
  </div>
</template>
