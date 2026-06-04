<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import StatCard from '@/components/ui/StatCard.vue'
import DataTable from '@/components/ui/DataTable.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import { useProductsStore } from '@/stores/products'
import { useBudgetsStore } from '@/stores/budgets'
import { useInvoicesStore } from '@/stores/invoices'
import { useStockStore } from '@/stores/stock'
import { formatCurrency, formatDate } from '@/utils/format'
import { getStockLevel } from '@/utils/stock'

const productsStore = useProductsStore()
const budgetsStore = useBudgetsStore()
const invoicesStore = useInvoicesStore()
const stockStore = useStockStore()

const lowStockCount = computed(
  () => productsStore.lowStockProducts.length + productsStore.emptyStockProducts.length,
)

const recentMovementRows = computed(() =>
  stockStore.recentMovements.slice(0, 5).map((m) => {
    const product = productsStore.getById(m.productId)
    return {
      id: m.id,
      product: product?.name ?? m.productId,
      type: m.type,
      quantity: m.quantity,
      date: formatDate(m.date),
      reason: m.reason,
    }
  }),
)

const lowStockRows = computed(() =>
  [...productsStore.lowStockProducts, ...productsStore.emptyStockProducts]
    .slice(0, 5)
    .map((p) => ({
      id: p.id,
      name: p.name,
      code: p.code,
      stock: p.stockQuantity,
      min: p.minStock,
      level: getStockLevel(p),
    })),
)
</script>

<template>
  <div class="space-y-8">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-surface-900">Visão geral</h2>
        <p class="mt-1 text-sm text-surface-700/60">
          Resumo do seu negócio em tempo real (dados mockados)
        </p>
      </div>
      <div class="flex flex-wrap gap-2">
        <RouterLink
          to="/produtos"
          class="rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
        >
          + Novo produto
        </RouterLink>
        <RouterLink
          to="/orcamentos"
          class="rounded-xl border border-surface-200 bg-white px-4 py-2.5 text-sm font-medium text-surface-700 hover:bg-surface-50"
        >
          Criar orçamento
        </RouterLink>
      </div>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <StatCard
        title="Produtos cadastrados"
        :value="productsStore.totalProducts"
        subtitle="Produtos ativos"
        icon="lamp"
      />
      <StatCard
        title="Estoque baixo"
        :value="lowStockCount"
        subtitle="Produtos abaixo do mínimo ou zerados"
        icon="alert-triangle"
        variant="warning"
      />
      <StatCard
        title="Orçamentos"
        :value="budgetsStore.totalBudgets"
        subtitle="Total de orçamentos criados"
        icon="file-text"
      />
      <StatCard
        title="Notas fiscais"
        :value="invoicesStore.totalInvoices"
        subtitle="NFs registradas no sistema"
        icon="receipt"
      />
      <StatCard
        title="Entradas recentes"
        :value="stockStore.recentMovements.filter((m) => m.type === 'entry').length"
        subtitle="Movimentações de entrada"
        icon="arrow-down-tray"
        variant="success"
      />
      <StatCard
        title="Valor em estoque"
        :value="formatCurrency(productsStore.estimatedStockValue)"
        subtitle="Baseado no preço de custo"
        icon="currency"
      />
    </div>

    <div class="grid gap-6 lg:grid-cols-2">
      <div>
        <div class="mb-4 flex items-center justify-between">
          <h3 class="font-semibold text-surface-900">Produtos com estoque crítico</h3>
          <RouterLink to="/estoque" class="text-sm font-medium text-primary-600 hover:text-primary-700">
            Ver estoque →
          </RouterLink>
        </div>
        <DataTable
          :columns="[
            { key: 'name', label: 'Produto' },
            { key: 'stock', label: 'Estoque', align: 'center' },
            { key: 'level', label: 'Status', align: 'center' },
          ]"
          :rows="lowStockRows"
          empty-message="Nenhum produto com estoque crítico."
        >
          <template #cell-level="{ row }">
            <StatusBadge :status="String(row.level)" type="stock" />
          </template>
        </DataTable>
      </div>

      <div>
        <div class="mb-4 flex items-center justify-between">
          <h3 class="font-semibold text-surface-900">Movimentações recentes</h3>
          <RouterLink to="/estoque" class="text-sm font-medium text-primary-600 hover:text-primary-700">
            Ver histórico →
          </RouterLink>
        </div>
        <DataTable
          :columns="[
            { key: 'product', label: 'Produto' },
            { key: 'type', label: 'Tipo', align: 'center' },
            { key: 'quantity', label: 'Qtd', align: 'center' },
            { key: 'date', label: 'Data', align: 'right' },
          ]"
          :rows="recentMovementRows"
        >
          <template #cell-type="{ row }">
            <StatusBadge :status="String(row.type)" type="stock" />
          </template>
        </DataTable>
      </div>
    </div>
  </div>
</template>
