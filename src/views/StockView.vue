<script setup lang="ts">
import { ref } from 'vue'
import DataTable from '@/components/ui/DataTable.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import ModalDrawer from '@/components/ui/ModalDrawer.vue'
import StockMovementForm from '@/components/stock/StockMovementForm.vue'
import { useProductsStore } from '@/stores/products'
import { useStockStore } from '@/stores/stock'
import { formatDate } from '@/utils/format'
import { getStockLevel } from '@/utils/stock'

const productsStore = useProductsStore()
const stockStore = useStockStore()

const showModal = ref(false)
const modalProductId = ref<string>()
const modalType = ref<'entry' | 'exit'>('entry')

function openMovement(productId?: string, type: 'entry' | 'exit' = 'entry') {
  modalProductId.value = productId
  modalType.value = type
  showModal.value = true
}

function handleMovement(data: {
  productId: string
  type: 'entry' | 'exit'
  quantity: number
  reason: string
  responsible: string
}) {
  const success = stockStore.registerMovement(
    data.productId,
    data.type,
    data.quantity,
    data.reason,
    data.responsible,
  )
  if (success) showModal.value = false
}

const stockRows = () =>
  productsStore.products
    .filter((p) => p.status === 'active')
    .map((p) => ({
      id: p.id,
      name: p.name,
      code: p.code,
      stock: p.stockQuantity,
      min: p.minStock,
      unit: p.unit,
      level: getStockLevel(p),
      _id: p.id,
    }))

const historyRows = () =>
  stockStore.movements.map((m) => {
    const product = productsStore.getById(m.productId)
    return {
      id: m.id,
      product: product?.name ?? m.productId,
      type: m.type,
      quantity: m.quantity,
      reason: m.reason,
      date: formatDate(m.date),
      responsible: m.responsible,
      _productId: m.productId,
    }
  })
</script>

<template>
  <div class="space-y-8">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-surface-900">Controle de Estoque</h2>
        <p class="mt-1 text-sm text-surface-700/60">Entradas, saídas e histórico de movimentações</p>
      </div>
      <div class="flex gap-2">
        <button
          type="button"
          class="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700 hover:bg-emerald-100"
          @click="openMovement(undefined, 'entry')"
        >
          + Entrada
        </button>
        <button
          type="button"
          class="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 hover:bg-red-100"
          @click="openMovement(undefined, 'exit')"
        >
          − Saída
        </button>
      </div>
    </div>

    <div>
      <h3 class="mb-4 font-semibold text-surface-900">Situação do estoque</h3>
      <DataTable
        :columns="[
          { key: 'name', label: 'Produto' },
          { key: 'code', label: 'Código' },
          { key: 'stock', label: 'Atual', align: 'center' },
          { key: 'min', label: 'Mínimo', align: 'center' },
          { key: 'level', label: 'Status', align: 'center' },
          { key: 'actions', label: 'Ações', align: 'right' },
        ]"
        :rows="stockRows()"
      >
        <template #cell-stock="{ row }">
          <span
            class="font-medium"
            :class="{
              'text-red-600': row.level === 'empty',
              'text-amber-600': row.level === 'low',
            }"
          >
            {{ row.stock }} {{ row.unit }}
          </span>
        </template>
        <template #cell-level="{ row }">
          <StatusBadge :status="String(row.level)" type="stock" />
        </template>
        <template #cell-actions="{ row }">
          <div class="flex justify-end gap-1">
            <button
              type="button"
              class="rounded-lg px-2 py-1 text-xs font-medium text-emerald-600 hover:bg-emerald-50"
              @click="openMovement(String(row._id), 'entry')"
            >
              Entrada
            </button>
            <button
              type="button"
              class="rounded-lg px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
              @click="openMovement(String(row._id), 'exit')"
            >
              Saída
            </button>
          </div>
        </template>
      </DataTable>
    </div>

    <div>
      <h3 class="mb-4 font-semibold text-surface-900">Histórico de movimentações</h3>
      <DataTable
        :columns="[
          { key: 'date', label: 'Data' },
          { key: 'product', label: 'Produto' },
          { key: 'type', label: 'Tipo', align: 'center' },
          { key: 'quantity', label: 'Qtd', align: 'center' },
          { key: 'reason', label: 'Motivo' },
          { key: 'responsible', label: 'Responsável', align: 'right' },
        ]"
        :rows="historyRows()"
      >
        <template #cell-type="{ row }">
          <StatusBadge :status="String(row.type)" type="stock" />
        </template>
      </DataTable>
    </div>

    <ModalDrawer v-if="showModal" title="Registrar movimentação" @close="showModal = false">
      <StockMovementForm
        :products="productsStore.products.filter((p) => p.status === 'active')"
        :initial-product-id="modalProductId"
        :initial-type="modalType"
        @submit="handleMovement"
        @cancel="showModal = false"
      />
    </ModalDrawer>
  </div>
</template>
