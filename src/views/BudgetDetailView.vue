<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import ModalDrawer from '@/components/ui/ModalDrawer.vue'
import BudgetForm from '@/components/budgets/BudgetForm.vue'
import type { Budget } from '@/types'
import { useBudgetsStore } from '@/stores/budgets'
import { useProductsStore } from '@/stores/products'
import { useUiStore } from '@/stores/ui'
import { formatCurrency, formatDate } from '@/utils/format'

const route = useRoute()
const router = useRouter()
const budgetsStore = useBudgetsStore()
const productsStore = useProductsStore()
const ui = useUiStore()

const showEdit = ref(false)

const budget = computed(() => budgetsStore.getById(String(route.params.id)))

function handleUpdate(data: Omit<Budget, 'id' | 'number' | 'createdAt' | 'subtotal' | 'total'>) {
  if (budget.value) {
    budgetsStore.updateBudget(budget.value.id, data)
    showEdit.value = false
  }
}

function mockPdf() {
  ui.showToast('PDF gerado com sucesso! (mock)', 'info')
}

if (!budget.value) {
  router.replace('/orcamentos')
}
</script>

<template>
  <div v-if="budget" class="mx-auto max-w-3xl space-y-6">
    <button
      type="button"
      class="text-sm font-medium text-primary-600 hover:text-primary-700"
      @click="router.push('/orcamentos')"
    >
      ← Voltar para orçamentos
    </button>

    <div class="rounded-2xl border border-surface-200 bg-white p-8 shadow-sm">
      <div class="flex flex-wrap items-start justify-between gap-4 border-b border-surface-200 pb-6">
        <div>
          <p class="text-sm font-medium text-primary-600">HomeStudio</p>
          <h2 class="mt-1 text-2xl font-bold text-surface-900">{{ budget.number }}</h2>
          <p class="mt-1 text-sm text-surface-700/60">Emitido em {{ formatDate(budget.createdAt) }}</p>
        </div>
        <StatusBadge :status="budget.status" type="budget" />
      </div>

      <div class="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <p class="text-xs font-medium uppercase text-surface-700/50">Cliente</p>
          <p class="mt-1 font-medium text-surface-900">{{ budget.clientName }}</p>
          <p class="text-sm text-surface-700/60">{{ budget.clientEmail }}</p>
        </div>
      </div>

      <div class="mt-8 overflow-hidden rounded-xl border border-surface-200">
        <table class="min-w-full text-sm">
          <thead class="bg-surface-50">
            <tr>
              <th class="px-4 py-3 text-left font-medium text-surface-700">Produto</th>
              <th class="px-4 py-3 text-center font-medium text-surface-700">Qtd</th>
              <th class="px-4 py-3 text-right font-medium text-surface-700">Unit.</th>
              <th class="px-4 py-3 text-right font-medium text-surface-700">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in budget.items" :key="item.productId" class="border-t border-surface-100">
              <td class="px-4 py-3">{{ item.name }}</td>
              <td class="px-4 py-3 text-center">{{ item.quantity }}</td>
              <td class="px-4 py-3 text-right">{{ formatCurrency(item.unitPrice) }}</td>
              <td class="px-4 py-3 text-right font-medium">{{ formatCurrency(item.total) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-6 ml-auto max-w-xs space-y-2 text-sm">
        <div class="flex justify-between">
          <span class="text-surface-700">Subtotal</span>
          <span>{{ formatCurrency(budget.subtotal) }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-surface-700">Desconto</span>
          <span class="text-red-600">- {{ formatCurrency(budget.discount) }}</span>
        </div>
        <div class="flex justify-between border-t border-surface-200 pt-2 text-lg font-bold">
          <span>Total</span>
          <span class="text-primary-700">{{ formatCurrency(budget.total) }}</span>
        </div>
      </div>

      <div class="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          class="rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
          @click="mockPdf"
        >
          📄 Gerar PDF (mock)
        </button>
        <button
          type="button"
          class="rounded-xl border border-surface-200 px-4 py-2.5 text-sm font-medium text-surface-700 hover:bg-surface-50"
          @click="showEdit = true"
        >
          Editar orçamento
        </button>
      </div>
    </div>

    <ModalDrawer v-if="showEdit" title="Editar orçamento" size="xl" @close="showEdit = false">
      <BudgetForm
        :budget="budget"
        :products="productsStore.products"
        @submit="handleUpdate"
        @cancel="showEdit = false"
      />
    </ModalDrawer>
  </div>
</template>
