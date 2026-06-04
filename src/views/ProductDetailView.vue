<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppIcon from '@/components/ui/AppIcon.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import ModalDrawer from '@/components/ui/ModalDrawer.vue'
import ProductForm from '@/components/products/ProductForm.vue'
import { ref } from 'vue'
import type { Product } from '@/types'
import { useProductsStore } from '@/stores/products'
import { useStockStore } from '@/stores/stock'
import { formatCurrency, formatDate } from '@/utils/format'
import { getStockLevel } from '@/utils/stock'

const route = useRoute()
const router = useRouter()
const productsStore = useProductsStore()
const stockStore = useStockStore()

const showEdit = ref(false)

const product = computed(() => productsStore.getById(String(route.params.id)))

const movements = computed(() =>
  product.value ? stockStore.getByProductId(product.value.id) : [],
)

function handleUpdate(data: Omit<Product, 'id' | 'createdAt'>) {
  if (product.value) {
    productsStore.updateProduct(product.value.id, data)
    showEdit.value = false
  }
}

if (!product.value) {
  router.replace('/produtos')
}
</script>

<template>
  <div v-if="product" class="space-y-6">
    <button
      type="button"
      class="text-sm font-medium text-primary-600 hover:text-primary-700"
      @click="router.push('/produtos')"
    >
      ← Voltar para produtos
    </button>

    <div class="grid gap-6 lg:grid-cols-3">
      <div class="rounded-2xl border border-surface-200 bg-white p-6 lg:col-span-1">
        <div class="flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-surface-100 text-surface-300">
          <img v-if="product.image" :src="product.image" alt="" class="h-full w-full object-cover" />
          <AppIcon v-else name="lamp" size="xl" />
        </div>
        <div class="mt-4 flex flex-wrap gap-2">
          <StatusBadge :status="product.status" type="product" />
          <StatusBadge :status="getStockLevel(product)" type="stock" />
        </div>
      </div>

      <div class="rounded-2xl border border-surface-200 bg-white p-6 lg:col-span-2">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 class="text-2xl font-bold text-surface-900">{{ product.name }}</h2>
            <p class="mt-1 text-sm text-surface-700/60">{{ product.code }} · {{ product.category }}</p>
          </div>
          <button
            type="button"
            class="rounded-xl bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
            @click="showEdit = true"
          >
            Editar
          </button>
        </div>

        <p class="mt-4 text-sm text-surface-700">{{ product.description }}</p>

        <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div class="rounded-xl bg-surface-50 p-4">
            <p class="text-xs text-surface-700/60">Preço de custo</p>
            <p class="mt-1 font-semibold">{{ formatCurrency(product.costPrice) }}</p>
          </div>
          <div class="rounded-xl bg-surface-50 p-4">
            <p class="text-xs text-surface-700/60">Preço de venda</p>
            <p class="mt-1 font-semibold text-primary-700">{{ formatCurrency(product.salePrice) }}</p>
          </div>
          <div class="rounded-xl bg-surface-50 p-4">
            <p class="text-xs text-surface-700/60">Estoque</p>
            <p class="mt-1 font-semibold">{{ product.stockQuantity }} {{ product.unit }}</p>
          </div>
          <div class="rounded-xl bg-surface-50 p-4">
            <p class="text-xs text-surface-700/60">Estoque mínimo</p>
            <p class="mt-1 font-semibold">{{ product.minStock }} {{ product.unit }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="rounded-2xl border border-surface-200 bg-white p-6">
      <h3 class="mb-4 font-semibold text-surface-900">Histórico de movimentações</h3>
      <div v-if="!movements.length" class="py-8 text-center text-sm text-surface-700/60">
        Nenhuma movimentação registrada para este produto.
      </div>
      <div v-else class="divide-y divide-surface-100">
        <div
          v-for="mov in movements"
          :key="mov.id"
          class="flex flex-wrap items-center justify-between gap-3 py-3"
        >
          <div>
            <StatusBadge :status="mov.type" type="stock" />
            <p class="mt-1 text-sm text-surface-700">{{ mov.reason }}</p>
          </div>
          <div class="text-right text-sm">
            <p class="font-medium">{{ mov.type === 'entry' ? '+' : '-' }}{{ mov.quantity }}</p>
            <p class="text-surface-700/60">{{ formatDate(mov.date) }} · {{ mov.responsible }}</p>
          </div>
        </div>
      </div>
    </div>

    <ModalDrawer v-if="showEdit" title="Editar produto" size="xl" @close="showEdit = false">
      <ProductForm :product="product" @submit="handleUpdate" @cancel="showEdit = false" />
    </ModalDrawer>
  </div>
</template>
