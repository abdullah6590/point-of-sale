'use client'

import { useState, useEffect } from 'react'
import { getProducts } from '@/app/actions'
import AddProductForm from '@/components/AddProductForm'
import InventoryTable from '@/components/InventoryTable'
import Navigation from '@/components/Navigation'
import Link from 'next/link'
import { Package, ArrowLeft, Plus } from 'lucide-react'
import type { Product } from '@/types'

// Extended type to match what we use
type InventoryProduct = Pick<Product, 'id' | 'name' | 'category' | 'subCategory' | 'stockQuantity' | 'salePrice' | 'retailPrice' | 'costPrice' | 'imageUrl' | 'hasPromo' | 'discountType' | 'discountAmount'>

export default function InventoryPage() {
  const [products, setProducts] = useState<InventoryProduct[]>([])
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<InventoryProduct | undefined>(undefined)

  const fetchProducts = async () => {
    try {
      const data = await getProducts()
      setProducts(data as InventoryProduct[])
    } catch (error) {
      console.error('Failed to fetch products', error)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // Refresh data when form succeeds (and close sheet)
  const handleSuccess = () => {
    setIsSheetOpen(false)
    setEditingProduct(undefined)
    fetchProducts()
  }

  const handleEdit = (product: InventoryProduct) => {
    setEditingProduct(product)
    setIsSheetOpen(true)
  }

  const handleAddNew = () => {
    setEditingProduct(undefined)
    setIsSheetOpen(true)
  }

  return (
    <main className="min-h-screen p-6 lg:p-8 bg-[#F8FAFC]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 w-full">
          <div className="flex items-center gap-4 flex-1">
            <div className="p-3 rounded-xl bg-[#F5F3FF]">
              <Package className="w-8 h-8 text-[#8B5CF6]" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#0F172A]">
                Inventory
              </h1>
              <p className="text-[#64748B] mt-1 font-medium">
                {products.length} Items Total
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
            <Navigation />
            <button
              onClick={handleAddNew}
              className="bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white px-6 py-2.5 rounded-xl font-bold shadow-[0_4px_12px_rgb(34_197_94/0.4)] hover:shadow-[0_6px_20px_rgb(34_197_94/0.5)] hover:from-[#16A34A] hover:to-[#15803D] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 group whitespace-nowrap"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" strokeWidth={3} />
              Add Product
            </button>
          </div>
        </header>

        {/* Inventory Table */}
        <InventoryTable products={products} onEdit={handleEdit} />
      </div>

      {/* Custom Sheet Overlay */}
      {isSheetOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm animate-in fade-in duration-300" 
            onClick={() => setIsSheetOpen(false)}
          />
          
          {/* Slide-over Panel */}
          <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl animate-in slide-in-from-right duration-300 overflow-y-auto border-l border-[#E2E8F0]">
             <div className="p-6">
                <AddProductForm 
                  initialData={editingProduct as Product} // Casting for compatibility
                  onSuccess={handleSuccess}
                  onCancel={() => setIsSheetOpen(false)}
                />
             </div>
          </div>
        </div>
      )}
    </main>
  )
}
