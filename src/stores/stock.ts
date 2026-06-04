import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { StockMovement } from '@/types'
import movementsMock from '@/mocks/stockMovements.json'
import { generateId } from '@/utils/uuid'
import { todayISO } from '@/utils/format'
import { useProductsStore } from './products'
import { useUiStore } from './ui'

export const useStockStore = defineStore('stock', () => {
  const movements = ref<StockMovement[]>([...movementsMock] as StockMovement[])

  const recentMovements = computed(() =>
    [...movements.value].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 10),
  )

  function getByProductId(productId: string) {
    return movements.value
      .filter((m) => m.productId === productId)
      .sort((a, b) => b.date.localeCompare(a.date))
  }

  function registerMovement(
    productId: string,
    type: StockMovement['type'],
    quantity: number,
    reason: string,
    responsible = 'Usuário Demo',
  ): boolean {
    const productsStore = useProductsStore()
    const ui = useUiStore()
    const product = productsStore.getById(productId)

    if (!product) {
      ui.showToast('Produto não encontrado.', 'error')
      return false
    }

    if (quantity <= 0) {
      ui.showToast('Quantidade deve ser maior que zero.', 'error')
      return false
    }

    const delta = type === 'entry' ? quantity : -quantity

    if (type === 'exit' && product.stockQuantity < quantity) {
      ui.showToast('Estoque insuficiente para esta saída.', 'error')
      return false
    }

    const success = productsStore.adjustStock(productId, delta)
    if (!success) {
      ui.showToast('Não foi possível atualizar o estoque.', 'error')
      return false
    }

    movements.value.unshift({
      id: generateId(),
      productId,
      type,
      quantity,
      reason,
      date: todayISO(),
      responsible,
    })

    ui.showToast(
      type === 'entry' ? 'Entrada registrada com sucesso!' : 'Saída registrada com sucesso!',
    )
    return true
  }

  return {
    movements,
    recentMovements,
    getByProductId,
    registerMovement,
  }
})
