export type ProductStatus = 'active' | 'inactive'
export type MovementType = 'entry' | 'exit'
export type BudgetStatus = 'draft' | 'sent' | 'approved' | 'rejected'
export type InvoiceType = 'entrada' | 'emitida'
export type InvoiceStatus = 'entrada' | 'emitida' | 'cancelada'
export type StockLevel = 'normal' | 'low' | 'empty'

export interface Product {
  id: string
  name: string
  code: string
  category: string
  description: string
  image: string
  costPrice: number
  salePrice: number
  stockQuantity: number
  minStock: number
  unit: string
  status: ProductStatus
  createdAt: string
}

export interface StockMovement {
  id: string
  productId: string
  type: MovementType
  quantity: number
  reason: string
  date: string
  responsible: string
}

export interface BudgetItem {
  productId: string
  name: string
  quantity: number
  unitPrice: number
  total: number
}

export interface Budget {
  id: string
  number: string
  clientName: string
  clientEmail: string
  items: BudgetItem[]
  subtotal: number
  discount: number
  total: number
  status: BudgetStatus
  createdAt: string
}

export interface InvoiceItem {
  productId: string
  name: string
  quantity: number
  unitPrice: number
  total: number
}

export interface Invoice {
  id: string
  number: string
  type: InvoiceType
  personName: string
  items: InvoiceItem[]
  total: number
  status: InvoiceStatus
  issueDate: string
}

export interface TableColumn {
  key: string
  label: string
  align?: 'left' | 'center' | 'right'
}
