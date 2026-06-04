<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import DataTable from '@/components/ui/DataTable.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import ModalDrawer from '@/components/ui/ModalDrawer.vue'
import InvoiceForm from '@/components/invoices/InvoiceForm.vue'
import type { Invoice } from '@/types'
import { useInvoicesStore } from '@/stores/invoices'
import { useProductsStore } from '@/stores/products'
import { useUiStore } from '@/stores/ui'
import { formatCurrency, formatDate } from '@/utils/format'

const invoicesStore = useInvoicesStore()
const productsStore = useProductsStore()
const ui = useUiStore()

const showModal = ref(false)
const editingInvoice = ref<Invoice | null>(null)

function openCreate(type: 'entrada' | 'emitida' = 'entrada') {
  editingInvoice.value = null
  showModal.value = true
}

function openEdit(invoice: Invoice) {
  editingInvoice.value = invoice
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingInvoice.value = null
}

function handleSubmit(data: Omit<Invoice, 'id' | 'total'>) {
  if (editingInvoice.value) {
    invoicesStore.updateInvoice(editingInvoice.value.id, data)
  } else {
    invoicesStore.addInvoice(data)
  }
  closeModal()
}

function handleDelete(invoice: Invoice) {
  ui.openConfirm({
    title: 'Excluir nota fiscal',
    message: `Deseja excluir a NF ${invoice.number}?`,
    confirmLabel: 'Excluir',
    variant: 'danger',
    onConfirm: () => invoicesStore.deleteInvoice(invoice.id),
  })
}

function applyStock(invoice: Invoice) {
  ui.openConfirm({
    title: 'Aplicar movimentação de estoque',
    message: `Deseja aplicar a movimentação de estoque referente à NF ${invoice.number}?`,
    confirmLabel: 'Aplicar',
    onConfirm: () => invoicesStore.applyStockFromInvoice(invoice),
  })
}

const tableRows = () =>
  invoicesStore.invoices.map((inv) => ({
    id: inv.id,
    number: inv.number,
    person: inv.personName,
    type: inv.type,
    total: formatCurrency(inv.total),
    status: inv.status,
    date: formatDate(inv.issueDate),
    _invoice: inv,
  }))
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-surface-900">Notas Fiscais</h2>
        <p class="mt-1 text-sm text-surface-700/60">Entrada e emissão de notas fiscais (mock)</p>
      </div>
      <div class="flex gap-2">
        <button
          type="button"
          class="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700 hover:bg-emerald-100"
          @click="openCreate('entrada')"
        >
          + NF Entrada
        </button>
        <button
          type="button"
          class="rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
          @click="openCreate('emitida')"
        >
          + NF Emitida
        </button>
      </div>
    </div>

    <EmptyState
      v-if="!invoicesStore.invoices.length"
      title="Nenhuma nota fiscal registrada"
      description="Registre uma NF de entrada ou emita uma NF para cliente."
      icon="🧾"
    >
      <button
        type="button"
        class="rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
        @click="openCreate()"
      >
        Registrar NF
      </button>
    </EmptyState>

    <DataTable
      v-else
      :columns="[
        { key: 'number', label: 'Número' },
        { key: 'person', label: 'Cliente/Fornecedor' },
        { key: 'type', label: 'Tipo', align: 'center' },
        { key: 'total', label: 'Total', align: 'right' },
        { key: 'status', label: 'Status', align: 'center' },
        { key: 'date', label: 'Data', align: 'right' },
        { key: 'actions', label: 'Ações', align: 'right' },
      ]"
      :rows="tableRows()"
    >
      <template #cell-number="{ row }">
        <RouterLink
          :to="`/notas-fiscais/${row.id}`"
          class="font-medium text-primary-600 hover:text-primary-700"
        >
          {{ row.number }}
        </RouterLink>
      </template>
      <template #cell-type="{ row }">
        <StatusBadge :status="String(row.type)" type="invoice" />
      </template>
      <template #cell-status="{ row }">
        <StatusBadge :status="String(row.status)" type="invoice" />
      </template>
      <template #cell-actions="{ row }">
        <div class="flex justify-end gap-2">
          <button
            v-if="(row._invoice as Invoice).status !== 'cancelada'"
            type="button"
            class="rounded-lg px-2 py-1 text-xs font-medium text-emerald-600 hover:bg-emerald-50"
            @click="applyStock(row._invoice as Invoice)"
          >
            Estoque
          </button>
          <button
            type="button"
            class="rounded-lg px-2 py-1 text-sm text-surface-700 hover:bg-surface-100"
            @click="openEdit(row._invoice as Invoice)"
          >
            Editar
          </button>
          <button
            type="button"
            class="rounded-lg px-2 py-1 text-sm text-red-600 hover:bg-red-50"
            @click="handleDelete(row._invoice as Invoice)"
          >
            Excluir
          </button>
        </div>
      </template>
    </DataTable>

    <ModalDrawer
      v-if="showModal"
      :title="editingInvoice ? 'Editar NF' : 'Nova nota fiscal'"
      size="xl"
      @close="closeModal"
    >
      <InvoiceForm
        :invoice="editingInvoice"
        :products="productsStore.products"
        @submit="handleSubmit"
        @cancel="closeModal"
      />
    </ModalDrawer>
  </div>
</template>
