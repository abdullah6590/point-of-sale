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
  imageUrl?: string | null
  hasPromo: boolean
  discountType?: 'percentage' | 'fixed' | null
  discountAmount?: number | null
  promoStartDate?: string | null
  promoEndDate?: string | null
}

/**
 * Minimal product info for POS display
 */
export interface ProductListItem {
  id: string
  name: string
  salePrice: number
  stockQuantity: number
  imageUrl?: string | null
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
  imageUrl?: string
  hasPromo?: boolean
  discountType?: 'percentage' | 'fixed'
  discountAmount?: number
  promoStartDate?: string
  promoEndDate?: string
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
  shippingPrice: number
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
  customerAddress?: string
  shippingPrice?: number
}

/**
 * Cart item data sent to the backend for processing
 */
export interface CartItemInput {
  productId: string
  quantity: number
  serialNumber?: string
  price?: number // Custom price for discounts
}

// =============================================================================
// Order History Types (Extended for Order Management Module)
// =============================================================================

/**
 * Extended order status for order history display
 */
export type OrderStatus = 'completed' | 'pending' | 'cancelled' | 'refunded'

/**
 * Payment method types
 */
export type PaymentMethod = 'cash' | 'credit_card' | 'wallet'

/**
 * Customer info for order display
 */
export interface OrderCustomer {
  name: string
  email: string
  phone?: string
  avatar?: string
  address?: string
}

/**
 * Order item for display in order history
 */
export interface OrderItem {
  id: string
  product_name: string
  variant?: string
  quantity: number
  price: number
  thumbnail?: string
}

/**
 * Full Order type for order history (UI-facing)
 */
export interface Order {
  id: string
  created_at: string // ISO String
  customer: OrderCustomer | null
  status: OrderStatus
  payment_method: PaymentMethod
  total_amount: number
  subtotal?: number
  tax?: number
  discount?: number
  shipping_price?: number
  items: OrderItem[]
}

/**
 * Filters for order list queries
 */
export interface OrderFilters {
  search?: string
  status?: OrderStatus | OrderStatus[]
  startDate?: string
  endDate?: string
  paymentMethod?: PaymentMethod
}

/**
 * Date range presets for filtering
 */
export type DateRangePreset = 'today' | 'last7days' | 'last30days' | 'custom'

