import type { Product, StockLevel } from '@/types'

export function getStockLevel(product: Product): StockLevel {
  if (product.stockQuantity <= 0) return 'empty'
  if (product.stockQuantity <= product.minStock) return 'low'
  return 'normal'
}

export function stockLevelLabel(level: StockLevel): string {
  const labels: Record<StockLevel, string> = {
    normal: 'Normal',
    low: 'Baixo',
    empty: 'Zerado',
  }
  return labels[level]
}
