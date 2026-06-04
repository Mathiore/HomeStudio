<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { Product } from '@/types'

const props = defineProps<{
  products: Product[]
  initialProductId?: string
  initialType?: 'entry' | 'exit'
}>()

const emit = defineEmits<{
  submit: [data: { productId: string; type: 'entry' | 'exit'; quantity: number; reason: string; responsible: string }]
  cancel: []
}>()

const form = reactive({
  productId: props.initialProductId ?? '',
  type: props.initialType ?? ('entry' as 'entry' | 'exit'),
  quantity: 1,
  reason: '',
  responsible: 'Usuário Demo',
})

watch(
  () => props.initialProductId,
  (id) => {
    if (id) form.productId = id
  },
)

watch(
  () => props.initialType,
  (type) => {
    if (type) form.type = type
  },
)

function handleSubmit() {
  emit('submit', { ...form })
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="handleSubmit">
    <div>
      <label class="mb-1.5 block text-sm font-medium text-surface-700">Produto</label>
      <select
        v-model="form.productId"
        required
        class="w-full rounded-xl border border-surface-200 px-3 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
      >
        <option value="" disabled>Selecione um produto</option>
        <option v-for="p in products" :key="p.id" :value="p.id">
          {{ p.name }} ({{ p.code }}) — {{ p.stockQuantity }} {{ p.unit }}
        </option>
      </select>
    </div>

    <div>
      <label class="mb-1.5 block text-sm font-medium text-surface-700">Tipo de movimentação</label>
      <div class="grid grid-cols-2 gap-3">
        <button
          type="button"
          class="rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors"
          :class="
            form.type === 'entry'
              ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
              : 'border-surface-200 text-surface-700 hover:bg-surface-50'
          "
          @click="form.type = 'entry'"
        >
          ↑ Entrada
        </button>
        <button
          type="button"
          class="rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors"
          :class="
            form.type === 'exit'
              ? 'border-red-500 bg-red-50 text-red-700'
              : 'border-surface-200 text-surface-700 hover:bg-surface-50'
          "
          @click="form.type = 'exit'"
        >
          ↓ Saída
        </button>
      </div>
    </div>

    <div>
      <label class="mb-1.5 block text-sm font-medium text-surface-700">Quantidade</label>
      <input
        v-model.number="form.quantity"
        type="number"
        min="1"
        required
        class="w-full rounded-xl border border-surface-200 px-3 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
      />
    </div>

    <div>
      <label class="mb-1.5 block text-sm font-medium text-surface-700">Motivo</label>
      <input
        v-model="form.reason"
        required
        class="w-full rounded-xl border border-surface-200 px-3 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
        placeholder="Ex: Compra de fornecedor"
      />
    </div>

    <div>
      <label class="mb-1.5 block text-sm font-medium text-surface-700">Responsável</label>
      <input
        v-model="form.responsible"
        required
        class="w-full rounded-xl border border-surface-200 px-3 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
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
        Registrar movimentação
      </button>
    </div>
  </form>
</template>
