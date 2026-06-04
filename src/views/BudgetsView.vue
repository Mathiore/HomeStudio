<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import DataTable from '@/components/ui/DataTable.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import ModalDrawer from '@/components/ui/ModalDrawer.vue'
import BudgetForm from '@/components/budgets/BudgetForm.vue'
import type { Budget } from '@/types'
import { useBudgetsStore } from '@/stores/budgets'
import { useProductsStore } from '@/stores/products'
import { useUiStore } from '@/stores/ui'
import { formatCurrency, formatDate } from '@/utils/format'

const budgetsStore = useBudgetsStore()
const productsStore = useProductsStore()
const ui = useUiStore()

const showModal = ref(false)
const editingBudget = ref<Budget | null>(null)

function openCreate() {
  editingBudget.value = null
  showModal.value = true
}

function openEdit(budget: Budget) {
  editingBudget.value = budget
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingBudget.value = null
}

function handleSubmit(data: Omit<Budget, 'id' | 'number' | 'createdAt' | 'subtotal' | 'total'>) {
  if (editingBudget.value) {
    budgetsStore.updateBudget(editingBudget.value.id, data)
  } else {
    budgetsStore.addBudget(data)
  }
  closeModal()
}

function handleDelete(budget: Budget) {
  ui.openConfirm({
    title: 'Excluir orçamento',
    message: `Deseja excluir o orçamento ${budget.number}?`,
    confirmLabel: 'Excluir',
    variant: 'danger',
    onConfirm: () => budgetsStore.deleteBudget(budget.id),
  })
}

const tableRows = () =>
  budgetsStore.budgets.map((b) => ({
    id: b.id,
    number: b.number,
    client: b.clientName,
    total: formatCurrency(b.total),
    status: b.status,
    date: formatDate(b.createdAt),
    _budget: b,
  }))
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-surface-900">Orçamentos Rápidos</h2>
        <p class="mt-1 text-sm text-surface-700/60">Crie e gerencie orçamentos para clientes</p>
      </div>
      <button
        type="button"
        class="rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
        @click="openCreate"
      >
        + Novo orçamento
      </button>
    </div>

    <EmptyState
      v-if="!budgetsStore.budgets.length"
      title="Nenhum orçamento criado"
      description="Comece criando um orçamento rápido para seu cliente."
      icon="📋"
    >
      <button
        type="button"
        class="rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
        @click="openCreate"
      >
        Criar orçamento
      </button>
    </EmptyState>

    <DataTable
      v-else
      :columns="[
        { key: 'number', label: 'Número' },
        { key: 'client', label: 'Cliente' },
        { key: 'total', label: 'Total', align: 'right' },
        { key: 'status', label: 'Status', align: 'center' },
        { key: 'date', label: 'Data', align: 'right' },
        { key: 'actions', label: 'Ações', align: 'right' },
      ]"
      :rows="tableRows()"
    >
      <template #cell-number="{ row }">
        <RouterLink
          :to="`/orcamentos/${row.id}`"
          class="font-medium text-primary-600 hover:text-primary-700"
        >
          {{ row.number }}
        </RouterLink>
      </template>
      <template #cell-status="{ row }">
        <StatusBadge :status="String(row.status)" type="budget" />
      </template>
      <template #cell-actions="{ row }">
        <div class="flex justify-end gap-2">
          <button
            type="button"
            class="rounded-lg px-2 py-1 text-sm text-surface-700 hover:bg-surface-100"
            @click="openEdit(row._budget as Budget)"
          >
            Editar
          </button>
          <button
            type="button"
            class="rounded-lg px-2 py-1 text-sm text-red-600 hover:bg-red-50"
            @click="handleDelete(row._budget as Budget)"
          >
            Excluir
          </button>
        </div>
      </template>
    </DataTable>

    <ModalDrawer
      v-if="showModal"
      :title="editingBudget ? 'Editar orçamento' : 'Novo orçamento'"
      size="xl"
      @close="closeModal"
    >
      <BudgetForm
        :budget="editingBudget"
        :products="productsStore.products"
        @submit="handleSubmit"
        @cancel="closeModal"
      />
    </ModalDrawer>
  </div>
</template>
