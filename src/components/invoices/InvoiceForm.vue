<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import type { Invoice, InvoiceItem, Product } from '@/types'
import AppIcon from '@/components/ui/AppIcon.vue'
import { formatCurrency } from '@/utils/format'
import { useInvoicesStore } from '@/stores/invoices'

const props = defineProps<{
  invoice?: Invoice | null
  products: Product[]
  initialType?: Invoice['type']
}>()

const emit = defineEmits<{
  submit: [data: Omit<Invoice, 'id' | 'total'>]
  cancel: []
}>()

const invoicesStore = useInvoicesStore()

const form = reactive({
  number: invoicesStore.nextNumber(),
  type: 'entrada' as Invoice['type'],
  personName: '',
  status: 'entrada' as Invoice['status'],
  issueDate: new Date().toISOString().split('T')[0]!,
  items: [] as InvoiceItem[],
})

const selectedProductId = reactive({ value: '' })
const itemQuantity = reactive({ value: 1 })

watch(
  () => props.invoice,
  (inv) => {
    if (inv) {
      Object.assign(form, {
        number: inv.number,
        type: inv.type,
        personName: inv.personName,
        status: inv.status,
        issueDate: inv.issueDate,
        items: inv.items.map((i) => ({ ...i })),
      })
    } else {
      const type = props.initialType ?? 'entrada'
      Object.assign(form, {
        number: invoicesStore.nextNumber(),
        type,
        personName: '',
        status: type === 'entrada' ? 'entrada' : 'emitida',
        issueDate: new Date().toISOString().split('T')[0]!,
        items: [],
      })
    }
  },
  { immediate: true },
)

watch(
  () => props.initialType,
  (type) => {
    if (!props.invoice && type) {
      form.type = type
      form.status = type === 'entrada' ? 'entrada' : 'emitida'
    }
  },
)

watch(
  () => form.type,
  (type) => {
    if (!props.invoice) {
      form.status = type === 'entrada' ? 'entrada' : 'emitida'
    }
  },
)

const total = computed(() => form.items.reduce((sum, i) => sum + i.total, 0))

function addItem() {
  const product = props.products.find((p) => p.id === selectedProductId.value)
  if (!product) return

  const unitPrice = form.type === 'entrada' ? product.costPrice : product.salePrice
  const existing = form.items.find((i) => i.productId === product.id)

  if (existing) {
    existing.quantity += itemQuantity.value
    existing.total = existing.quantity * existing.unitPrice
  } else {
    form.items.push({
      productId: product.id,
      name: product.name,
      quantity: itemQuantity.value,
      unitPrice,
      total: itemQuantity.value * unitPrice,
    })
  }
  selectedProductId.value = ''
  itemQuantity.value = 1
}

function removeItem(index: number) {
  form.items.splice(index, 1)
}

function handleSubmit() {
  emit('submit', {
    number: form.number,
    type: form.type,
    personName: form.personName,
    status: form.status,
    issueDate: form.issueDate,
    items: form.items.map((i) => ({ ...i })),
  })
}
</script>

<template>
  <form class="space-y-5" @submit.prevent="handleSubmit">
    <div class="grid gap-4 sm:grid-cols-2">
      <div>
        <label class="mb-1.5 block text-sm font-medium text-surface-700">Número da NF</label>
        <input
          v-model="form.number"
          required
          class="w-full rounded-xl border border-surface-200 px-3 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
        />
      </div>
      <div>
        <label class="mb-1.5 block text-sm font-medium text-surface-700">Data de emissão</label>
        <input
          v-model="form.issueDate"
          type="date"
          required
          class="w-full rounded-xl border border-surface-200 px-3 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
        />
      </div>
      <div>
        <label class="mb-1.5 block text-sm font-medium text-surface-700">Tipo</label>
        <select
          v-model="form.type"
          class="w-full rounded-xl border border-surface-200 px-3 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
        >
          <option value="entrada">Entrada (fornecedor)</option>
          <option value="emitida">Emitida (cliente)</option>
        </select>
      </div>
      <div>
        <label class="mb-1.5 block text-sm font-medium text-surface-700">Status</label>
        <select
          v-model="form.status"
          class="w-full rounded-xl border border-surface-200 px-3 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
        >
          <option value="entrada">Entrada</option>
          <option value="emitida">Emitida</option>
          <option value="cancelada">Cancelada</option>
        </select>
      </div>
      <div class="sm:col-span-2">
        <label class="mb-1.5 block text-sm font-medium text-surface-700">
          {{ form.type === 'entrada' ? 'Fornecedor' : 'Cliente' }}
        </label>
        <input
          v-model="form.personName"
          required
          class="w-full rounded-xl border border-surface-200 px-3 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
        />
      </div>
    </div>

    <div class="rounded-xl border border-surface-200 bg-surface-50 p-4">
      <p class="mb-3 text-sm font-medium text-surface-700">Produtos da NF</p>
      <div class="flex flex-wrap gap-3">
        <select
          v-model="selectedProductId.value"
          class="min-w-[200px] flex-1 rounded-xl border border-surface-200 bg-white px-3 py-2 text-sm outline-none"
        >
          <option value="">Selecione um produto</option>
          <option v-for="p in products" :key="p.id" :value="p.id">{{ p.name }}</option>
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
            <td class="px-4 py-2 text-center">{{ item.quantity }}</td>
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

    <div class="flex items-center justify-between rounded-xl bg-surface-50 p-4">
      <span class="font-semibold text-surface-900">Total da NF</span>
      <span class="text-lg font-bold text-primary-700">{{ formatCurrency(total) }}</span>
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
        {{ invoice ? 'Salvar NF' : 'Registrar NF' }}
      </button>
    </div>
  </form>
</template>
