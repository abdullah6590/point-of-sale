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

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${BACKEND_URL}/products`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function createProduct(data: CreateProductInput): Promise<Product> {
  const res = await fetch(`${BACKEND_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create product');
  return res.json();
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
