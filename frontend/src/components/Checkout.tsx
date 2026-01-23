'use client'

import { useState } from 'react'
import { processSale } from '@/app/actions'
import Link from 'next/link'
import type { CartItem } from '@/types'

interface CheckoutProps {
  cart: CartItem[]
  onSaleComplete: () => void
  onUpdateCartItem: (productId: string, updates: Partial<CartItem>) => void
}

export default function Checkout({ cart, onSaleComplete, onUpdateCartItem }: CheckoutProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: ''
  })
  const [expandedItem, setExpandedItem] = useState<string | null>(null)

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleProcess = async (status: 'COMPLETED' | 'QUOTATION' | 'PARKED') => {
    setLoading(true)
    setError(null)

    try {
      const sale = await processSale(
        cart.map(item => ({ productId: item.productId, quantity: item.quantity, serialNumber: item.serialNumber })),
        formData,
        status
      )
      
      const message = status === 'COMPLETED' ? 'Sale completed!' : status === 'QUOTATION' ? 'Quote saved!' : 'Order parked!'
      alert(`${message} ID: ${sale.id}`)
      setFormData({ customerName: '', customerPhone: '', customerEmail: '' }) 
      onSaleComplete()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleProcess('COMPLETED')
  }

  // Empty Cart State
  if (cart.length === 0) {
    return (
      <div className="h-80 flex flex-col items-center justify-center p-8 bg-white rounded-xl border border-[#E2E8F0] shadow-[0_4px_6px_-1px_rgb(0_0_0/0.05)]">
        <div className="w-16 h-16 rounded-full bg-[#F1F5F9] flex items-center justify-center mb-4">
          <span className="text-3xl">🛒</span>
        </div>
        <p className="text-[#64748B] font-medium">Your cart is empty</p>
        <p className="text-[#94A3B8] text-sm mt-1">Add products to get started</p>
        <div className="mt-6 flex gap-3">
          <Link 
            href="/quotations" 
            className="text-[#2563EB] hover:text-[#1D4ED8] text-sm font-medium hover:underline"
          >
            View Quotes
          </Link>
          <span className="text-[#E2E8F0]">|</span>
          <Link 
            href="/quotations" 
            className="text-[#64748B] hover:text-[#475569] text-sm font-medium hover:underline"
          >
            Parked Orders
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col bg-white rounded-xl border border-[#E2E8F0] shadow-[0_4px_6px_-1px_rgb(0_0_0/0.05)] overflow-hidden sticky top-6">
      {/* Header */}
      <div className="p-5 border-b border-[#E2E8F0]">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-[#0F172A]">Current Order</h2>
          <span className="px-2.5 py-1 bg-[#F1F5F9] text-[#475569] text-xs font-semibold rounded-full">
            {cart.reduce((acc, item) => acc + item.quantity, 0)} items
          </span>
        </div>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-5 max-h-[320px]">
        <ul className="space-y-3">
          {cart.map(item => (
            <li 
              key={item.productId} 
              className="p-3 rounded-lg hover:bg-[#F8FAFC] transition-colors cursor-pointer border border-transparent hover:border-[#E2E8F0]"
              onClick={() => setExpandedItem(expandedItem === item.productId ? null : item.productId)}
            >
              <div className="flex justify-between items-center">
                <div className="flex-1 min-w-0">
                  <span className="font-medium block text-[#0F172A] truncate">{item.name}</span>
                  <span className="text-xs text-[#64748B]">
                    {item.quantity} × ${item.price.toFixed(2)}
                  </span>
                  {item.serialNumber && (
                    <span className="text-xs text-[#2563EB] block mt-0.5">
                      SN: {item.serialNumber}
                    </span>
                  )}
                </div>
                <div className="text-right ml-3">
                  <span className="font-semibold text-[#0F172A] block">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                  <span className="text-[10px] text-[#94A3B8]">Click to edit</span>
                </div>
              </div>
              
              {/* Expandable Serial Input */}
              {expandedItem === item.productId && (
                <div className="mt-3 p-3 bg-[#F8FAFC] rounded-lg" onClick={e => e.stopPropagation()}>
                  <label className="text-xs text-[#64748B] block mb-1.5 font-medium">
                    Serial Number (Optional)
                  </label>
                  <input 
                    type="text" 
                    value={item.serialNumber || ''}
                    onChange={(e) => onUpdateCartItem(item.productId, { serialNumber: e.target.value })}
                    className="w-full p-2.5 text-sm rounded-lg bg-[#F1F5F9] text-[#0F172A] placeholder-[#94A3B8] border border-transparent focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#DBEAFE] outline-none transition-all"
                    placeholder="Scan or type SN..."
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Total & Checkout Section */}
      <div className="bg-[#0F172A] p-5 rounded-t-2xl shadow-[0_-4px_20px_rgb(0_0_0/0.1)]">
        {/* Total Display */}
        <div className="flex justify-between items-end mb-5">
          <span className="text-[#94A3B8] font-medium text-sm">Total Amount</span>
          <span className="text-3xl font-extrabold text-white tracking-tight">
            ${total.toFixed(2)}
          </span>
        </div>

        {/* Checkout Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {/* Customer Name */}
          <input
            type="text"
            placeholder="Customer Name"
            className="w-full p-3 rounded-lg bg-[#1E293B] border border-[#334155] text-white placeholder-[#64748B] focus:bg-[#0F172A] focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/30 outline-none transition-all"
            value={formData.customerName}
            onChange={e => setFormData({...formData, customerName: e.target.value})}
          />
          
          {/* Phone & Email */}
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Phone"
              className="w-1/2 p-3 rounded-lg bg-[#1E293B] border border-[#334155] text-white placeholder-[#64748B] focus:bg-[#0F172A] focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/30 outline-none transition-all"
              value={formData.customerPhone}
              onChange={e => setFormData({...formData, customerPhone: e.target.value})}
            />
            <input
              type="email"
              placeholder="Email"
              className="w-1/2 p-3 rounded-lg bg-[#1E293B] border border-[#334155] text-white placeholder-[#64748B] focus:bg-[#0F172A] focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/30 outline-none transition-all"
              value={formData.customerEmail}
              onChange={e => setFormData({...formData, customerEmail: e.target.value})}
            />
          </div>
          
          {/* Error Display */}
          {error && (
            <div className="p-3 bg-[#FEE2E2]/10 border border-[#FCA5A5]/30 rounded-lg">
              <p className="text-[#FCA5A5] text-sm">{error}</p>
            </div>
          )}

          {/* Pay Now Button - Primary Blue */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-1 bg-[#2563EB] text-white py-3.5 px-4 rounded-lg font-bold text-lg hover:bg-[#1D4ED8] disabled:bg-[#475569] disabled:cursor-not-allowed transition-all shadow-[0_4px_12px_rgb(37_99_235/0.4)] hover:shadow-[0_6px_20px_rgb(37_99_235/0.5)]"
          >
            {loading ? 'Processing...' : 'Pay Now'}
          </button>
          
          {/* Secondary Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button 
              type="button"
              onClick={() => handleProcess('QUOTATION')}
              disabled={loading}
              className="bg-[#334155] text-white py-2.5 px-3 rounded-lg text-sm font-medium hover:bg-[#475569] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Save Quote
            </button>
            <button 
              type="button"
              onClick={() => handleProcess('PARKED')}
              disabled={loading}
              className="bg-[#334155] text-white py-2.5 px-3 rounded-lg text-sm font-medium hover:bg-[#475569] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Hold Order
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
