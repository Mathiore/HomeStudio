import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Invoice, InvoiceItem } from '@/types'
import invoicesMock from '@/mocks/invoices.json'
import { generateId } from '@/utils/uuid'
import { useStockStore } from './stock'
import { useUiStore } from './ui'

function calcTotal(items: InvoiceItem[]): number {
  return items.reduce((sum, item) => sum + item.total, 0)
}

export const useInvoicesStore = defineStore('invoices', () => {
  const invoices = ref<Invoice[]>([...invoicesMock] as Invoice[])

  const totalInvoices = computed(() => invoices.value.length)

  const issuedInvoices = computed(() =>
    invoices.value.filter((i) => i.status === 'emitida'),
  )

  function getById(id: string) {
    return invoices.value.find((i) => i.id === id)
  }

  function nextNumber(): string {
    const nums = invoices.value
      .map((i) => parseInt(i.number.replace('NF-', ''), 10))
      .filter((n) => !isNaN(n))
    const next = nums.length ? Math.max(...nums) + 1 : 1
    return `NF-${String(next).padStart(6, '0')}`
  }

  function addInvoice(data: Omit<Invoice, 'id' | 'total'> & { total?: number }) {
    const ui = useUiStore()
    const total = data.total ?? calcTotal(data.items)
    const invoice: Invoice = {
      ...data,
      id: generateId(),
      total,
    }
    invoices.value.unshift(invoice)
    ui.showToast('Nota fiscal registrada com sucesso!')
    return invoice
  }

  function updateInvoice(id: string, data: Partial<Invoice>) {
    const ui = useUiStore()
    const index = invoices.value.findIndex((i) => i.id === id)
    if (index === -1) return

    const current = invoices.value[index]!
    const items = data.items ?? current.items
    const total = calcTotal(items)

    invoices.value[index] = { ...current, ...data, items, total }
    ui.showToast('Nota fiscal atualizada com sucesso!')
  }

  function deleteInvoice(id: string) {
    const ui = useUiStore()
    invoices.value = invoices.value.filter((i) => i.id !== id)
    ui.showToast('Nota fiscal excluída com sucesso!')
  }

  function applyStockFromInvoice(invoice: Invoice): boolean {
    const stockStore = useStockStore()
    const ui = useUiStore()

    if (invoice.status === 'cancelada') {
      ui.showToast('Nota cancelada não pode movimentar estoque.', 'error')
      return false
    }

    const type = invoice.type === 'entrada' ? 'entry' : 'exit'
    const reason =
      invoice.type === 'entrada'
        ? `NF de entrada #${invoice.number}`
        : `NF emitida #${invoice.number}`

    let allSuccess = true
    for (const item of invoice.items) {
      const success = stockStore.registerMovement(
        item.productId,
        type,
        item.quantity,
        reason,
      )
      if (!success) allSuccess = false
    }

    if (allSuccess) {
      ui.showToast('Movimentação de estoque aplicada com sucesso!')
    }
    return allSuccess
  }

  return {
    invoices,
    totalInvoices,
    issuedInvoices,
    getById,
    nextNumber,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    applyStockFromInvoice,
    calcTotal,
  }
})
