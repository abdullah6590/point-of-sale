'use server'

import type { 
  Product, 
  CreateProductInput, 
  Sale, 
  SaleStatus, 
  CartItemInput, 
  CustomerDetails 
} from '@/types'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001/api';

export async function getProducts(query?: string): Promise<Product[]> {
  const url = query 
    ? `${BACKEND_URL}/products?query=${encodeURIComponent(query)}`
    : `${BACKEND_URL}/products`;
    
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

// ... createProduct ...
export async function createProduct(data: CreateProductInput): Promise<Product> {
  const res = await fetch(`${BACKEND_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create product');
  return res.json();
}

export async function updateProduct(id: string, data: Partial<CreateProductInput>): Promise<Product> {
  const res = await fetch(`${BACKEND_URL}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update product');
  return res.json();
}

export async function deleteProduct(id: string): Promise<void> {
  const res = await fetch(`${BACKEND_URL}/products/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete product');
}

export async function processSale(
  cart: CartItemInput[], 
  customerDetails: CustomerDetails, 
  status: SaleStatus = 'COMPLETED'
): Promise<Sale> {
  const res = await fetch(`${BACKEND_URL}/sales`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cart, customerDetails, status }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to process sale');
  }
  return res.json();
}

export async function getSalesByStatus(status: SaleStatus): Promise<Sale[]> {
  const res = await fetch(`${BACKEND_URL}/sales?status=${status}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch sales');
  return res.json();
}

export async function deleteSale(id: string): Promise<{ message: string }> {
  const res = await fetch(`${BACKEND_URL}/sales/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete sale');
  return res.json();
}

export async function getSale(id: string): Promise<Sale | null> {
  const res = await fetch(`${BACKEND_URL}/sales?id=${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch sale');
  const sales: Sale[] = await res.json();
  return sales.find((s) => s.id === id) || null;
}

// =============================================================================
// Order History Actions
// =============================================================================

import type { Order, OrderFilters, OrderStatus } from '@/types'

/**
 * Fetch all orders with optional filters
 */
export async function getOrders(filters?: OrderFilters): Promise<Order[]> {
  const params = new URLSearchParams();
  
  if (filters?.search) {
    params.append('search', filters.search);
  }
  if (filters?.status) {
    const statusValue = Array.isArray(filters.status) ? filters.status[0] : filters.status;
    params.append('status', statusValue.toUpperCase());
  }
  if (filters?.startDate) {
    params.append('startDate', filters.startDate);
  }
  if (filters?.endDate) {
    params.append('endDate', filters.endDate);
  }
  
  const queryString = params.toString();
  const url = queryString ? `${BACKEND_URL}/sales?${queryString}` : `${BACKEND_URL}/sales`;
  
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch orders');
  
  const sales = await res.json();
  
  // Transform backend Sale format to frontend Order format
  return sales.map((sale: any) => ({
    id: sale.id,
    created_at: sale.createdAt,
    customer: sale.customerName ? {
      name: sale.customerName,
      email: sale.customerEmail || '',
      phone: sale.customerPhone || undefined,
      address: sale.customerAddress || undefined,
    } : null,
    status: sale.status.toLowerCase() as OrderStatus,
    payment_method: 'cash' as const, // Default, can be extended when payment_method is added to schema
    total_amount: sale.totalAmount,
    shipping_price: sale.shippingPrice || 0,
    items: sale.items.map((item: any) => ({
      id: item.id,
      product_name: item.product?.name || 'Unknown Product',
      quantity: item.quantity,
      price: item.price,
      variant: item.serialNumber || undefined,
    })),
  }));
}

/**
 * Fetch a single order by ID
 */
export async function getOrderById(id: string): Promise<Order | null> {
  const res = await fetch(`${BACKEND_URL}/sales/${id}`, { cache: 'no-store' });
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error('Failed to fetch order');
  }
  
  const sale = await res.json();
  
  return {
    id: sale.id,
    created_at: sale.createdAt,
    customer: sale.customerName ? {
      name: sale.customerName,
      email: sale.customerEmail || '',
      phone: sale.customerPhone || undefined,
      address: sale.customerAddress || undefined,
    } : null,
    status: sale.status.toLowerCase() as OrderStatus,
    payment_method: 'cash' as const,
    total_amount: sale.totalAmount,
    shipping_price: sale.shippingPrice || 0,
    items: sale.items.map((item: any) => ({
      id: item.id,
      product_name: item.product?.name || 'Unknown Product',
      quantity: item.quantity,
      price: item.price,
      variant: item.serialNumber || undefined,
    })),
  };
}

/**
 * Update order status (for refunds, cancellations)
 */
export async function updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
  const res = await fetch(`${BACKEND_URL}/sales/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: status.toUpperCase() }),
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to update order status');
  }
  
  const sale = await res.json();
  
  return {
    id: sale.id,
    created_at: sale.createdAt,
    customer: sale.customerName ? {
      name: sale.customerName,
      email: sale.customerEmail || '',
      phone: sale.customerPhone || undefined,
      address: sale.customerAddress || undefined,
    } : null,
    status: sale.status.toLowerCase() as OrderStatus,
    payment_method: 'cash' as const,
    total_amount: sale.totalAmount,
    items: sale.items.map((item: any) => ({
      id: item.id,
      product_name: item.product?.name || 'Unknown Product',
      quantity: item.quantity,
      price: item.price,
      variant: item.serialNumber || undefined,
    })),
  };
}

