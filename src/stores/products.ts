import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Product } from '@/types'
import productsMock from '@/mocks/products.json'
import { generateId } from '@/utils/uuid'
import { todayISO } from '@/utils/format'
import { getStockLevel } from '@/utils/stock'
import { useUiStore } from './ui'

export const useProductsStore = defineStore('products', () => {
  const products = ref<Product[]>([...productsMock] as Product[])
  const search = ref('')
  const categoryFilter = ref('')
  const statusFilter = ref('')

  const categories = computed(() =>
    [...new Set(products.value.map((p) => p.category))].sort(),
  )

  const filteredProducts = computed(() => {
    const term = search.value.toLowerCase().trim()
    return products.value.filter((p) => {
      const matchesSearch =
        !term ||
        p.name.toLowerCase().includes(term) ||
        p.code.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term)
      const matchesCategory = !categoryFilter.value || p.category === categoryFilter.value
      const matchesStatus = !statusFilter.value || p.status === statusFilter.value
      return matchesSearch && matchesCategory && matchesStatus
    })
  })

  const totalProducts = computed(() => products.value.filter((p) => p.status === 'active').length)

  const lowStockProducts = computed(() =>
    products.value.filter((p) => p.status === 'active' && getStockLevel(p) === 'low'),
  )

  const emptyStockProducts = computed(() =>
    products.value.filter((p) => p.status === 'active' && getStockLevel(p) === 'empty'),
  )

  const estimatedStockValue = computed(() =>
    products.value.reduce((sum, p) => sum + p.costPrice * p.stockQuantity, 0),
  )

  function getById(id: string) {
    return products.value.find((p) => p.id === id)
  }

  function getByCode(code: string) {
    return products.value.find((p) => p.code === code)
  }

  function addProduct(data: Omit<Product, 'id' | 'createdAt'>) {
    const ui = useUiStore()
    const product: Product = {
      ...data,
      id: generateId(),
      createdAt: todayISO(),
    }
    products.value.unshift(product)
    ui.showToast('Produto cadastrado com sucesso!')
    return product
  }

  function updateProduct(id: string, data: Partial<Product>) {
    const ui = useUiStore()
    const index = products.value.findIndex((p) => p.id === id)
    if (index === -1) return
    products.value[index] = { ...products.value[index]!, ...data }
    ui.showToast('Produto atualizado com sucesso!')
  }

  function deleteProduct(id: string) {
    const ui = useUiStore()
    products.value = products.value.filter((p) => p.id !== id)
    ui.showToast('Produto excluído com sucesso!')
  }

  function adjustStock(productId: string, delta: number) {
    const product = getById(productId)
    if (!product) return false
    const newQty = product.stockQuantity + delta
    if (newQty < 0) return false
    product.stockQuantity = newQty
    return true
  }

  function nextProductCode(): string {
    const nums = products.value
      .map((p) => parseInt(p.code.replace('PROD-', ''), 10))
      .filter((n) => !isNaN(n))
    const next = nums.length ? Math.max(...nums) + 1 : 1
    return `PROD-${String(next).padStart(3, '0')}`
  }

  return {
    products,
    search,
    categoryFilter,
    statusFilter,
    categories,
    filteredProducts,
    totalProducts,
    lowStockProducts,
    emptyStockProducts,
    estimatedStockValue,
    getById,
    getByCode,
    addProduct,
    updateProduct,
    deleteProduct,
    adjustStock,
    nextProductCode,
  }
})
