'use client'

import { useState, useEffect } from 'react'
import Checkout from './Checkout'
import Link from 'next/link'
import SearchBar from './SearchBar'
import type { ProductListItem, CartItem } from '@/types'
import { getProducts } from '@/app/actions' // We will reuse this

export default function POSDashboard({ products: initialProducts, initialCart = [] }: { products: ProductListItem[], initialCart?: CartItem[] }) {
  const [cart, setCart] = useState<CartItem[]>(initialCart)
  const [products, setProducts] = useState<ProductListItem[]>(initialProducts)
  const [isSearching, setIsSearching] = useState(false)
  
  // Effect to load initialCart when it changes (for loading quotes)
  useEffect(() => {
    if (initialCart && initialCart.length > 0) {
      setCart(initialCart)
    }
  }, [initialCart])

  const handleSearch = async (query: string) => {
    setIsSearching(true)
    try {
      if (!query.trim()) {
        setProducts(initialProducts)
        return
      }
      const results = await getProducts(query) // We need to update this action
      setProducts(results)
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const addToCart = (product: ProductListItem) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id)
      if (existing) {
        return prev.map(item => item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      }
      return [...prev, { productId: product.id, quantity: 1, price: product.salePrice, name: product.name }]
    })
  }
  
  const updateCartItem = (productId: string, updates: Partial<CartItem>) => {
    setCart(prev => prev.map(item => item.productId === productId ? { ...item, ...updates } : item))
  }

  const clearCart = () => setCart([])

  return (
    <div className="flex flex-col xl:flex-row gap-8 p-6 lg:p-8 min-h-screen bg-[#F8FAFC]">
      <div className="flex-1">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#0F172A]">
              New Orders
            </h1>
            <p className="text-[#64748B] mt-1">
              Manage sales and inventory efficiently
            </p>
          </div>
          
          <div className="flex flex-row items-center gap-3 w-auto">
             <SearchBar onSearch={handleSearch} />
             
             {/* Navigation Buttons */}
             <div className="flex flex-row items-center gap-2">
               <Link 
                 href="/quotations" 
                 className="px-4 py-2.5 bg-[#2563EB] text-white font-semibold rounded-lg shadow-sm hover:bg-[#1D4ED8] transition-all text-sm whitespace-nowrap"
               >
                 Quotations
               </Link>
               <Link 
                 href="/dashboard" 
                 className="px-4 py-2.5 bg-[#F1F5F9] text-[#475569] font-medium rounded-lg hover:bg-[#E2E8F0] hover:text-[#0F172A] transition-all text-sm whitespace-nowrap"
               >
                 Analytics
               </Link>
               <Link 
                 href="/inventory" 
                 className="px-4 py-2.5 bg-[#0F172A] text-white font-semibold rounded-lg shadow-sm hover:bg-[#1E293B] transition-all text-sm whitespace-nowrap"
               >
                 Inventory
               </Link>
             </div>
          </div>
        </header>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
          {products.length === 0 ? (
             <div className="col-span-full py-12 text-center text-[#64748B]">
               <p className="text-lg font-medium">No products found</p>
               <p className="text-sm">Try adjusting your search terms</p>
             </div>
          ) : (
            products.map(product => (
            <div 
              key={product.id} 
              className="group p-5 bg-white rounded-xl border border-[#E2E8F0] shadow-[0_4px_6px_-1px_rgb(0_0_0/0.05)] hover:shadow-[0_10px_15px_-3px_rgb(0_0_0/0.1)] transition-all duration-300 flex flex-col justify-between h-52"
            >
              {/* Product Info */}
              <div>
                <div className="flex justify-between items-start gap-3">
                  <h3 className="font-bold text-lg leading-tight line-clamp-2 text-[#0F172A]">
                    {product.name}
                  </h3>
                  {/* Stock Status Pill Badge */}
                  <span className={`shrink-0 text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full ${
                    product.stockQuantity > 0 
                      ? 'bg-[#DCFCE7] text-[#166534]' 
                      : 'bg-[#FEE2E2] text-[#991B1B]'
                  }`}>
                    {product.stockQuantity > 0 ? 'In Stock' : 'Out'}
                  </span>
                </div>
                <p className="text-sm text-[#64748B] mt-2">
                  Qty: <span className="font-medium text-[#475569]">{product.stockQuantity}</span>
                </p>
              </div>
              
              {/* Price and Action */}
              <div className="mt-4 flex justify-between items-end">
                <span className="font-extrabold text-2xl text-[#0F172A]">
                  ${product.salePrice.toFixed(2)}
                </span>
                <button 
                  onClick={() => addToCart(product)}
                  disabled={product.stockQuantity <= 0}
                  className="px-4 py-2 bg-[#2563EB] text-white text-sm font-semibold rounded-lg shadow-[0_2px_4px_rgb(37_99_235/0.3)] hover:bg-[#1D4ED8] hover:shadow-[0_4px_6px_rgb(37_99_235/0.4)] disabled:bg-[#CBD5E1] disabled:text-[#94A3B8] disabled:shadow-none disabled:cursor-not-allowed transition-all duration-200"
                >
                  Add to Cart
                </button>
              </div>
            </div>
            ))
          )}
        </div>
      </div>
      
      {/* Checkout Sidebar */}
      <div className="w-full xl:w-[420px] shrink-0">
        <Checkout 
          cart={cart} 
          onSaleComplete={clearCart} 
          onUpdateCartItem={updateCartItem}
        />
        {cart.length > 0 && (
          <div className="text-center mt-4">
            <button 
              onClick={clearCart} 
              className="text-[#DC2626] hover:text-[#B91C1C] text-sm font-medium transition-colors hover:underline"
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
