/**
 * Shared TypeScript types for the POS application.
 * These types mirror the Prisma schema from the backend.
 */

// =============================================================================
// Product Types
// =============================================================================

/**
 * Full Product type matching the Prisma schema
 */
export interface Product {
  id: string
  name: string
  sku: string
  stockQuantity: number
  costPrice: number
  retailPrice: number
  salePrice: number
  category: string
  subCategory: string | null
  createdAt: string // ISO date string from API
}

/**
 * Minimal product info for POS display
 */
export interface ProductListItem {
  id: string
  name: string
  salePrice: number
  stockQuantity: number
}

/**
 * Data required to create a new product
 */
export interface CreateProductInput {
  name: string
  sku: string
  stockQuantity: number
  costPrice: number
  retailPrice: number
  salePrice: number
  category: string
  subCategory?: string
}

// =============================================================================
// Sale Types
// =============================================================================

export type SaleStatus = 'COMPLETED' | 'QUOTATION' | 'PARKED'

/**
 * Full Sale type matching the Prisma schema
 */
export interface Sale {
  id: string
  customerName: string | null
  customerPhone: string | null
  customerEmail: string | null
  customerAddress: string | null
  customerPostalCode: string | null
  totalAmount: number
  totalProfit: number
  status: SaleStatus
  createdAt: string // ISO date string from API
  items: SaleItem[]
}

/**
 * SaleItem type matching the Prisma schema
 */
export interface SaleItem {
  id: string
  saleId: string
  productId: string
  quantity: number
  price: number
  serialNumber: string | null
  product: {
    id: string
    name: string
  }
}

// =============================================================================
// Cart Types (Frontend-only)
// =============================================================================

/**
 * Item in the shopping cart (frontend state)
 */
export interface CartItem {
  productId: string
  quantity: number
  price: number
  name: string
  serialNumber?: string
}

/**
 * Customer details for checkout
 */
export interface CustomerDetails {
  customerName: string
  customerPhone: string
  customerEmail: string
}

/**
 * Cart item data sent to the backend for processing
 */
export interface CartItemInput {
  productId: string
  quantity: number
  serialNumber?: string
}
