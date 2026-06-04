<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import type { Budget, BudgetItem, Product } from '@/types'
import AppIcon from '@/components/ui/AppIcon.vue'
import { formatCurrency } from '@/utils/format'

const props = defineProps<{
  budget?: Budget | null
  products: Product[]
}>()

const emit = defineEmits<{
  submit: [data: Omit<Budget, 'id' | 'number' | 'createdAt' | 'subtotal' | 'total'>]
  cancel: []
}>()

const form = reactive({
  clientName: '',
  clientEmail: '',
  discount: 0,
  status: 'draft' as Budget['status'],
  items: [] as BudgetItem[],
})

const selectedProductId = reactive({ value: '' })
const itemQuantity = reactive({ value: 1 })

watch(
  () => props.budget,
  (b) => {
    if (b) {
      Object.assign(form, {
        clientName: b.clientName,
        clientEmail: b.clientEmail,
        discount: b.discount,
        status: b.status,
        items: b.items.map((i) => ({ ...i })),
      })
    } else {
      Object.assign(form, {
        clientName: '',
        clientEmail: '',
        discount: 0,
        status: 'draft' as Budget['status'],
        items: [],
      })
    }
  },
  { immediate: true },
)

const subtotal = computed(() => form.items.reduce((sum, i) => sum + i.total, 0))
const total = computed(() => Math.max(subtotal.value - form.discount, 0))

function addItem() {
  const product = props.products.find((p) => p.id === selectedProductId.value)
  if (!product) return

  const existing = form.items.find((i) => i.productId === product.id)
  if (existing) {
    existing.quantity += itemQuantity.value
    existing.total = existing.quantity * existing.unitPrice
  } else {
    form.items.push({
      productId: product.id,
      name: product.name,
      quantity: itemQuantity.value,
      unitPrice: product.salePrice,
      total: itemQuantity.value * product.salePrice,
    })
  }
  selectedProductId.value = ''
  itemQuantity.value = 1
}

function updateItemQuantity(index: number, qty: number) {
  const item = form.items[index]
  if (!item || qty < 1) return
  item.quantity = qty
  item.total = qty * item.unitPrice
}

function removeItem(index: number) {
  form.items.splice(index, 1)
}

function handleSubmit() {
  emit('submit', {
    clientName: form.clientName,
    clientEmail: form.clientEmail,
    discount: form.discount,
    status: form.status,
    items: form.items.map((i) => ({ ...i })),
  })
}
</script>

<template>
  <form class="space-y-5" @submit.prevent="handleSubmit">
    <div class="grid gap-4 sm:grid-cols-2">
      <div>
        <label class="mb-1.5 block text-sm font-medium text-surface-700">Cliente</label>
        <input
          v-model="form.clientName"
          required
          class="w-full rounded-xl border border-surface-200 px-3 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
          placeholder="Nome do cliente"
        />
      </div>
      <div>
        <label class="mb-1.5 block text-sm font-medium text-surface-700">E-mail</label>
        <input
          v-model="form.clientEmail"
          type="email"
          required
          class="w-full rounded-xl border border-surface-200 px-3 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
          placeholder="cliente@email.com"
        />
      </div>
      <div>
        <label class="mb-1.5 block text-sm font-medium text-surface-700">Status</label>
        <select
          v-model="form.status"
          class="w-full rounded-xl border border-surface-200 px-3 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
        >
          <option value="draft">Rascunho</option>
          <option value="sent">Enviado</option>
          <option value="approved">Aprovado</option>
          <option value="rejected">Recusado</option>
        </select>
      </div>
      <div>
        <label class="mb-1.5 block text-sm font-medium text-surface-700">Desconto (R$)</label>
        <input
          v-model.number="form.discount"
          type="number"
          min="0"
          step="0.01"
          class="w-full rounded-xl border border-surface-200 px-3 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
        />
      </div>
    </div>

    <div class="rounded-xl border border-surface-200 bg-surface-50 p-4">
      <p class="mb-3 text-sm font-medium text-surface-700">Adicionar produtos</p>
      <div class="flex flex-wrap gap-3">
        <select
          v-model="selectedProductId.value"
          class="min-w-[200px] flex-1 rounded-xl border border-surface-200 bg-white px-3 py-2 text-sm outline-none"
        >
          <option value="">Selecione um produto</option>
          <option v-for="p in products.filter((x) => x.status === 'active')" :key="p.id" :value="p.id">
            {{ p.name }} — {{ formatCurrency(p.salePrice) }}
          </option>
        </select>
        <input
          v-model.number="itemQuantity.value"
          type="number"
          min="1"
          class="w-24 rounded-xl border border-surface-200 bg-white px-3 py-2 text-sm outline-none"
        />
        <button
          type="button"
          class="rounded-xl bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
          :disabled="!selectedProductId.value"
          @click="addItem"
        >
          Adicionar
        </button>
      </div>
    </div>

    <div v-if="form.items.length" class="overflow-hidden rounded-xl border border-surface-200">
      <table class="min-w-full text-sm">
        <thead class="bg-surface-50">
          <tr>
            <th class="px-4 py-2 text-left font-medium text-surface-700">Produto</th>
            <th class="px-4 py-2 text-center font-medium text-surface-700">Qtd</th>
            <th class="px-4 py-2 text-right font-medium text-surface-700">Unit.</th>
            <th class="px-4 py-2 text-right font-medium text-surface-700">Total</th>
            <th class="px-4 py-2" />
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in form.items" :key="item.productId" class="border-t border-surface-100">
            <td class="px-4 py-2">{{ item.name }}</td>
            <td class="px-4 py-2 text-center">
              <input
                :value="item.quantity"
                type="number"
                min="1"
                class="w-16 rounded-lg border border-surface-200 px-2 py-1 text-center text-sm"
                @input="updateItemQuantity(index, Number(($event.target as HTMLInputElement).value))"
              />
            </td>
            <td class="px-4 py-2 text-right">{{ formatCurrency(item.unitPrice) }}</td>
            <td class="px-4 py-2 text-right font-medium">{{ formatCurrency(item.total) }}</td>
            <td class="px-4 py-2 text-right">
              <button type="button" class="text-red-500 hover:text-red-700" @click="removeItem(index)">
                <AppIcon name="trash" size="sm" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="rounded-xl bg-surface-50 p-4 text-sm">
      <div class="flex justify-between py-1">
        <span class="text-surface-700">Subtotal</span>
        <span class="font-medium">{{ formatCurrency(subtotal) }}</span>
      </div>
      <div class="flex justify-between py-1">
        <span class="text-surface-700">Desconto</span>
        <span class="font-medium text-red-600">- {{ formatCurrency(form.discount) }}</span>
      </div>
      <div class="mt-2 flex justify-between border-t border-surface-200 pt-2 text-base">
        <span class="font-semibold text-surface-900">Total</span>
        <span class="font-bold text-primary-700">{{ formatCurrency(total) }}</span>
      </div>
    </div>

    <div class="flex justify-end gap-3">
      <button type="button" class="rounded-xl px-4 py-2.5 text-sm font-medium text-surface-700 hover:bg-surface-100" @click="emit('cancel')">
        Cancelar
      </button>
      <button
        type="submit"
        class="rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
        :disabled="!form.items.length"
      >
        {{ budget ? 'Salvar orçamento' : 'Criar orçamento' }}
      </button>
    </div>
  </form>
</template>
