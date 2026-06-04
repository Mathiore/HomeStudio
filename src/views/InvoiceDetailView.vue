<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppIcon from '@/components/ui/AppIcon.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import ModalDrawer from '@/components/ui/ModalDrawer.vue'
import InvoiceForm from '@/components/invoices/InvoiceForm.vue'
import type { Invoice } from '@/types'
import { useInvoicesStore } from '@/stores/invoices'
import { useProductsStore } from '@/stores/products'
import { useUiStore } from '@/stores/ui'
import { formatCurrency, formatDate } from '@/utils/format'

const route = useRoute()
const router = useRouter()
const invoicesStore = useInvoicesStore()
const productsStore = useProductsStore()
const ui = useUiStore()

const showEdit = ref(false)

const invoice = computed(() => invoicesStore.getById(String(route.params.id)))

function handleUpdate(data: Omit<Invoice, 'id' | 'total'>) {
  if (invoice.value) {
    invoicesStore.updateInvoice(invoice.value.id, data)
    showEdit.value = false
  }
}

function applyStock() {
  if (!invoice.value) return
  ui.openConfirm({
    title: 'Aplicar movimentação de estoque',
    message: `Deseja aplicar a movimentação referente à NF ${invoice.value.number}?`,
    confirmLabel: 'Aplicar',
    onConfirm: () => invoicesStore.applyStockFromInvoice(invoice.value!),
  })
}

function mockEmit() {
  ui.showToast('NF emitida com sucesso! (mock)', 'info')
}

if (!invoice.value) {
  router.replace('/notas-fiscais')
}
</script>

<template>
  <div v-if="invoice" class="mx-auto max-w-3xl space-y-6">
    <button
      type="button"
      class="text-sm font-medium text-primary-600 hover:text-primary-700"
      @click="router.push('/notas-fiscais')"
    >
      ← Voltar para notas fiscais
    </button>

    <div class="rounded-2xl border border-surface-200 bg-white p-8 shadow-sm">
      <div class="flex flex-wrap items-start justify-between gap-4 border-b border-surface-200 pb-6">
        <div>
          <p class="text-sm font-medium text-primary-600">HomeStudio</p>
          <h2 class="mt-1 text-2xl font-bold text-surface-900">{{ invoice.number }}</h2>
          <p class="mt-1 text-sm text-surface-700/60">
            {{ invoice.type === 'entrada' ? 'Nota de entrada' : 'Nota emitida' }} ·
            {{ formatDate(invoice.issueDate) }}
          </p>
        </div>
        <StatusBadge :status="invoice.status" type="invoice" />
      </div>

      <div class="mt-6">
        <p class="text-xs font-medium uppercase text-surface-700/50">
          {{ invoice.type === 'entrada' ? 'Fornecedor' : 'Cliente' }}
        </p>
        <p class="mt-1 text-lg font-medium text-surface-900">{{ invoice.personName }}</p>
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
            <tr v-for="item in invoice.items" :key="item.productId" class="border-t border-surface-100">
              <td class="px-4 py-3">{{ item.name }}</td>
              <td class="px-4 py-3 text-center">{{ item.quantity }}</td>
              <td class="px-4 py-3 text-right">{{ formatCurrency(item.unitPrice) }}</td>
              <td class="px-4 py-3 text-right font-medium">{{ formatCurrency(item.total) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-6 flex justify-end">
        <div class="text-lg font-bold text-primary-700">
          Total: {{ formatCurrency(invoice.total) }}
        </div>
      </div>

      <div class="mt-8 flex flex-wrap gap-3">
        <button
          v-if="invoice.status !== 'cancelada'"
          type="button"
          class="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700"
          @click="applyStock"
        >
          <AppIcon name="layers" size="sm" />
          Aplicar ao estoque
        </button>
        <button
          v-if="invoice.type === 'emitida'"
          type="button"
          class="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
          @click="mockEmit"
        >
          <AppIcon name="receipt" size="sm" />
          Emitir NF (mock)
        </button>
        <button
          type="button"
          class="rounded-xl border border-surface-200 px-4 py-2.5 text-sm font-medium text-surface-700 hover:bg-surface-50"
          @click="showEdit = true"
        >
          Editar
        </button>
      </div>
    </div>

    <ModalDrawer v-if="showEdit" title="Editar NF" size="xl" @close="showEdit = false">
      <InvoiceForm
        :invoice="invoice"
        :products="productsStore.products"
        @submit="handleUpdate"
        @cancel="showEdit = false"
      />
    </ModalDrawer>
  </div>
</template>
