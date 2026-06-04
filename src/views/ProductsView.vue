<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import AppIcon from '@/components/ui/AppIcon.vue'
import DataTable from '@/components/ui/DataTable.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import ModalDrawer from '@/components/ui/ModalDrawer.vue'
import ProductForm from '@/components/products/ProductForm.vue'
import type { Product } from '@/types'
import { useProductsStore } from '@/stores/products'
import { useUiStore } from '@/stores/ui'
import { formatCurrency } from '@/utils/format'

const productsStore = useProductsStore()
const ui = useUiStore()

const showModal = ref(false)
const editingProduct = ref<Product | null>(null)

function openCreate() {
  editingProduct.value = null
  showModal.value = true
}

function openEdit(product: Product) {
  editingProduct.value = product
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingProduct.value = null
}

function handleSubmit(data: Omit<Product, 'id' | 'createdAt'>) {
  if (editingProduct.value) {
    productsStore.updateProduct(editingProduct.value.id, data)
  } else {
    productsStore.addProduct(data)
  }
  closeModal()
}

function handleDelete(product: Product) {
  ui.openConfirm({
    title: 'Excluir produto',
    message: `Deseja excluir "${product.name}"? Esta ação não pode ser desfeita.`,
    confirmLabel: 'Excluir',
    variant: 'danger',
    onConfirm: () => productsStore.deleteProduct(product.id),
  })
}

const tableRows = () =>
  productsStore.filteredProducts.map((p) => ({
    id: p.id,
    image: p.image,
    name: p.name,
    code: p.code,
    category: p.category,
    salePrice: formatCurrency(p.salePrice),
    stock: p.stockQuantity,
    status: p.status,
    _product: p,
  }))
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-surface-900">Produtos</h2>
        <p class="mt-1 text-sm text-surface-700/60">Gerencie o catálogo de produtos</p>
      </div>
      <button
        type="button"
        class="rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
        @click="openCreate"
      >
        + Novo produto
      </button>
    </div>

    <div class="flex flex-wrap gap-3 rounded-2xl border border-surface-200 bg-white p-4">
      <input
        v-model="productsStore.search"
        type="search"
        placeholder="Buscar por nome, código ou categoria..."
        class="min-w-[200px] flex-1 rounded-xl border border-surface-200 px-3 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
      />
      <select
        v-model="productsStore.categoryFilter"
        class="rounded-xl border border-surface-200 px-3 py-2.5 text-sm outline-none"
      >
        <option value="">Todas categorias</option>
        <option v-for="cat in productsStore.categories" :key="cat" :value="cat">{{ cat }}</option>
      </select>
      <select
        v-model="productsStore.statusFilter"
        class="rounded-xl border border-surface-200 px-3 py-2.5 text-sm outline-none"
      >
        <option value="">Todos status</option>
        <option value="active">Ativo</option>
        <option value="inactive">Inativo</option>
      </select>
    </div>

    <EmptyState
      v-if="!productsStore.filteredProducts.length"
      title="Nenhum produto encontrado"
      description="Ajuste os filtros ou cadastre um novo produto."
      icon="lamp"
    >
      <button
        type="button"
        class="rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
        @click="openCreate"
      >
        Cadastrar produto
      </button>
    </EmptyState>

    <DataTable
      v-else
      :columns="[
        { key: 'image', label: '', align: 'center' },
        { key: 'name', label: 'Produto' },
        { key: 'code', label: 'Código' },
        { key: 'category', label: 'Categoria' },
        { key: 'salePrice', label: 'Preço', align: 'right' },
        { key: 'stock', label: 'Estoque', align: 'center' },
        { key: 'status', label: 'Status', align: 'center' },
        { key: 'actions', label: 'Ações', align: 'right' },
      ]"
      :rows="tableRows()"
    >
      <template #cell-image="{ row }">
        <div class="mx-auto flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-surface-100 text-surface-400">
          <img v-if="row.image" :src="String(row.image)" alt="" class="h-full w-full object-cover" />
          <AppIcon v-else name="lamp" size="sm" />
        </div>
      </template>
      <template #cell-name="{ row }">
        <RouterLink
          :to="`/produtos/${row.id}`"
          class="font-medium text-primary-600 hover:text-primary-700"
        >
          {{ row.name }}
        </RouterLink>
      </template>
      <template #cell-status="{ row }">
        <StatusBadge :status="String(row.status)" type="product" />
      </template>
      <template #cell-actions="{ row }">
        <div class="flex justify-end gap-2">
          <button
            type="button"
            class="rounded-lg px-2 py-1 text-sm text-surface-700 hover:bg-surface-100"
            @click="openEdit((row._product as Product))"
          >
            Editar
          </button>
          <button
            type="button"
            class="rounded-lg px-2 py-1 text-sm text-red-600 hover:bg-red-50"
            @click="handleDelete(row._product as Product)"
          >
            Excluir
          </button>
        </div>
      </template>
    </DataTable>

    <ModalDrawer
      v-if="showModal"
      :title="editingProduct ? 'Editar produto' : 'Novo produto'"
      size="xl"
      @close="closeModal"
    >
      <ProductForm :product="editingProduct" @submit="handleSubmit" @cancel="closeModal" />
    </ModalDrawer>
  </div>
</template>
