import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Budget, BudgetItem } from '@/types'
import budgetsMock from '@/mocks/budgets.json'
import { generateId } from '@/utils/uuid'
import { todayISO } from '@/utils/format'
import { useUiStore } from './ui'

function calcTotals(items: BudgetItem[], discount: number) {
  const subtotal = items.reduce((sum, item) => sum + item.total, 0)
  const total = Math.max(subtotal - discount, 0)
  return { subtotal, total }
}

export const useBudgetsStore = defineStore('budgets', () => {
  const budgets = ref<Budget[]>([...budgetsMock] as Budget[])

  const totalBudgets = computed(() => budgets.value.length)

  function getById(id: string) {
    return budgets.value.find((b) => b.id === id)
  }

  function nextNumber(): string {
    const nums = budgets.value
      .map((b) => parseInt(b.number.replace('ORC-', ''), 10))
      .filter((n) => !isNaN(n))
    const next = nums.length ? Math.max(...nums) + 1 : 1
    return `ORC-${String(next).padStart(4, '0')}`
  }

  function addBudget(data: Omit<Budget, 'id' | 'number' | 'createdAt' | 'subtotal' | 'total'>) {
    const ui = useUiStore()
    const { subtotal, total } = calcTotals(data.items, data.discount)
    const budget: Budget = {
      ...data,
      id: generateId(),
      number: nextNumber(),
      subtotal,
      total,
      createdAt: todayISO(),
    }
    budgets.value.unshift(budget)
    ui.showToast('Orçamento criado com sucesso!')
    return budget
  }

  function updateBudget(id: string, data: Partial<Budget>) {
    const ui = useUiStore()
    const index = budgets.value.findIndex((b) => b.id === id)
    if (index === -1) return

    const current = budgets.value[index]!
    const items = data.items ?? current.items
    const discount = data.discount ?? current.discount
    const { subtotal, total } = calcTotals(items, discount)

    budgets.value[index] = {
      ...current,
      ...data,
      items,
      discount,
      subtotal,
      total,
    }
    ui.showToast('Orçamento atualizado com sucesso!')
  }

  function deleteBudget(id: string) {
    const ui = useUiStore()
    budgets.value = budgets.value.filter((b) => b.id !== id)
    ui.showToast('Orçamento excluído com sucesso!')
  }

  return {
    budgets,
    totalBudgets,
    getById,
    nextNumber,
    addBudget,
    updateBudget,
    deleteBudget,
    calcTotals,
  }
})
