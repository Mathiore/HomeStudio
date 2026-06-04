<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { Product } from '@/types'
import ProductImageUpload from './ProductImageUpload.vue'
import { useProductsStore } from '@/stores/products'

const props = defineProps<{
  product?: Product | null
}>()

const emit = defineEmits<{ submit: [data: Omit<Product, 'id' | 'createdAt'>]; cancel: [] }>()

const productsStore = useProductsStore()

const form = reactive({
  name: '',
  code: '',
  category: '',
  description: '',
  image: '',
  costPrice: 0,
  salePrice: 0,
  stockQuantity: 0,
  minStock: 0,
  unit: 'un',
  status: 'active' as Product['status'],
})

watch(
  () => props.product,
  (p) => {
    if (p) {
      Object.assign(form, {
        name: p.name,
        code: p.code,
        category: p.category,
        description: p.description,
        image: p.image,
        costPrice: p.costPrice,
        salePrice: p.salePrice,
        stockQuantity: p.stockQuantity,
        minStock: p.minStock,
        unit: p.unit,
        status: p.status,
      })
    } else {
      Object.assign(form, {
        name: '',
        code: productsStore.nextProductCode(),
        category: '',
        description: '',
        image: '',
        costPrice: 0,
        salePrice: 0,
        stockQuantity: 0,
        minStock: 0,
        unit: 'un',
        status: 'active' as Product['status'],
      })
    }
  },
  { immediate: true },
)

function handleSubmit() {
  emit('submit', { ...form })
}
</script>

<template>
  <form class="space-y-5" @submit.prevent="handleSubmit">
    <ProductImageUpload v-model="form.image" />

    <div class="grid gap-4 sm:grid-cols-2">
      <div>
        <label class="mb-1.5 block text-sm font-medium text-surface-700">Nome</label>
        <input
          v-model="form.name"
          required
          class="w-full rounded-xl border border-surface-200 px-3 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
          placeholder="Nome do produto"
        />
      </div>
      <div>
        <label class="mb-1.5 block text-sm font-medium text-surface-700">Código</label>
        <input
          v-model="form.code"
          required
          class="w-full rounded-xl border border-surface-200 px-3 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
        />
      </div>
      <div>
        <label class="mb-1.5 block text-sm font-medium text-surface-700">Categoria</label>
        <input
          v-model="form.category"
          required
          list="categories"
          class="w-full rounded-xl border border-surface-200 px-3 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
          placeholder="Ex: Móveis"
        />
        <datalist id="categories">
          <option v-for="cat in productsStore.categories" :key="cat" :value="cat" />
        </datalist>
      </div>
      <div>
        <label class="mb-1.5 block text-sm font-medium text-surface-700">Unidade</label>
        <select
          v-model="form.unit"
          class="w-full rounded-xl border border-surface-200 px-3 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
        >
          <option value="un">Unidade (un)</option>
          <option value="m">Metro (m)</option>
          <option value="m²">Metro² (m²)</option>
          <option value="cx">Caixa (cx)</option>
        </select>
      </div>
      <div>
        <label class="mb-1.5 block text-sm font-medium text-surface-700">Preço de custo</label>
        <input
          v-model.number="form.costPrice"
          type="number"
          min="0"
          step="0.01"
          required
          class="w-full rounded-xl border border-surface-200 px-3 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
        />
      </div>
      <div>
        <label class="mb-1.5 block text-sm font-medium text-surface-700">Preço de venda</label>
        <input
          v-model.number="form.salePrice"
          type="number"
          min="0"
          step="0.01"
          required
          class="w-full rounded-xl border border-surface-200 px-3 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
        />
      </div>
      <div>
        <label class="mb-1.5 block text-sm font-medium text-surface-700">Estoque atual</label>
        <input
          v-model.number="form.stockQuantity"
          type="number"
          min="0"
          required
          class="w-full rounded-xl border border-surface-200 px-3 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
        />
      </div>
      <div>
        <label class="mb-1.5 block text-sm font-medium text-surface-700">Estoque mínimo</label>
        <input
          v-model.number="form.minStock"
          type="number"
          min="0"
          required
          class="w-full rounded-xl border border-surface-200 px-3 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
        />
      </div>
      <div>
        <label class="mb-1.5 block text-sm font-medium text-surface-700">Status</label>
        <select
          v-model="form.status"
          class="w-full rounded-xl border border-surface-200 px-3 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
        >
          <option value="active">Ativo</option>
          <option value="inactive">Inativo</option>
        </select>
      </div>
    </div>

    <div>
      <label class="mb-1.5 block text-sm font-medium text-surface-700">Descrição</label>
      <textarea
        v-model="form.description"
        rows="3"
        class="w-full rounded-xl border border-surface-200 px-3 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
        placeholder="Descrição do produto"
      />
    </div>

    <div class="flex justify-end gap-3 pt-2">
      <button
        type="button"
        class="rounded-xl px-4 py-2.5 text-sm font-medium text-surface-700 hover:bg-surface-100"
        @click="emit('cancel')"
      >
        Cancelar
      </button>
      <button
        type="submit"
        class="rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
      >
        {{ product ? 'Salvar alterações' : 'Cadastrar produto' }}
      </button>
    </div>
  </form>
</template>
