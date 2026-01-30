'use client'

import { useState, useEffect } from 'react'
import { processSale } from '@/app/actions'
import Link from 'next/link'
import type { CartItem } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { Trash2, Plus, Minus, Edit2, Check, X, Truck } from 'lucide-react'

interface CheckoutProps {
  cart: CartItem[]
  onSaleComplete: () => void
  onUpdateCartItem: (productId: string, updates: Partial<CartItem>) => void
  onRemoveItem: (productId: string) => void
  initialCustomer?: any
}

export default function Checkout({ cart, onSaleComplete, onUpdateCartItem, onRemoveItem, initialCustomer }: CheckoutProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    customerName: initialCustomer?.customerName || '',
    customerPhone: initialCustomer?.customerPhone || '',
    customerEmail: initialCustomer?.customerEmail || '',
    customerAddress: initialCustomer?.customerAddress || ''
  })
  const [shippingPrice, setShippingPrice] = useState<number>(0)
  const [expandedItem, setExpandedItem] = useState<string | null>(null)
  const [editingPrice, setEditingPrice] = useState<string | null>(null)
  const [tempPrice, setTempPrice] = useState<string>('')

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const total = subtotal + shippingPrice

  const handleProcess = async (status: 'COMPLETED' | 'QUOTATION' | 'PARKED') => {
    setLoading(true)
    setError(null)

    try {
      const sale = await processSale(
        cart.map(item => ({ productId: item.productId, quantity: item.quantity, serialNumber: item.serialNumber, price: item.price })),
        { ...formData, shippingPrice },
        status
      )
      
      const message = status === 'COMPLETED' ? 'Sale completed!' : status === 'QUOTATION' ? 'Quote saved!' : 'Order parked!'
      alert(`${message} ID: ${sale.id}`)
      setFormData({ customerName: '', customerPhone: '', customerEmail: '', customerAddress: '' }) 
      setShippingPrice(0)
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

  const startEditingPrice = (productId: string, currentPrice: number) => {
    setEditingPrice(productId)
    setTempPrice(currentPrice.toString())
  }

  const savePrice = (productId: string) => {
    const newPrice = parseFloat(tempPrice)
    if (!isNaN(newPrice) && newPrice >= 0) {
      onUpdateCartItem(productId, { price: newPrice })
    }
    setEditingPrice(null)
    setTempPrice('')
  }

  const cancelEditingPrice = () => {
    setEditingPrice(null)
    setTempPrice('')
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
      <div className="flex-1 overflow-y-auto p-5 max-h-[280px]">
        <ul className="space-y-3">
          {cart.map(item => (
            <li 
              key={item.productId} 
              className="p-3 rounded-lg hover:bg-[#F8FAFC] transition-colors border border-transparent hover:border-[#E2E8F0] group"
              onClick={() => setExpandedItem(expandedItem === item.productId ? null : item.productId)}
            >
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1 min-w-0">
                  <span className="font-medium block text-[#0F172A] truncate mb-1">{item.name}</span>
                  
                  <div className="flex items-center gap-2">
                    <CartQuantityInput 
                      value={item.quantity} 
                      onChange={(val) => onUpdateCartItem(item.productId, { quantity: val })} 
                    />
                    
                    {/* Editable Price */}
                    <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                      <span className="text-xs text-[#64748B]">×</span>
                      {editingPrice === item.productId ? (
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-[#64748B]">Rs.</span>
                          <input
                            type="number"
                            value={tempPrice}
                            onChange={e => setTempPrice(e.target.value)}
                            className="w-16 text-xs p-1 rounded border border-[#2563EB] bg-white text-[#0F172A] focus:outline-none"
                            step="0.01"
                            min="0"
                            autoFocus
                            onKeyDown={e => {
                              if (e.key === 'Enter') savePrice(item.productId)
                              if (e.key === 'Escape') cancelEditingPrice()
                            }}
                          />
                          <button onClick={() => savePrice(item.productId)} className="p-0.5 text-[#22C55E] hover:bg-[#DCFCE7] rounded">
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={cancelEditingPrice} className="p-0.5 text-[#EF4444] hover:bg-[#FEE2E2] rounded">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => startEditingPrice(item.productId, item.price)}
                          className="flex items-center gap-1 text-xs text-[#64748B] hover:text-[#2563EB] group/price"
                          title="Click to edit price"
                        >
                          <span>{formatCurrency(item.price)}</span>
                          <Edit2 className="w-3 h-3 opacity-0 group-hover/price:opacity-100 transition-opacity" />
                        </button>
                      )}
                    </div>
                  </div>

                  {item.serialNumber && (
                    <span className="text-xs text-[#2563EB] block mt-1.5">
                      SN: {item.serialNumber}
                    </span>
                  )}
                </div>
                
                <div className="text-right flex flex-col items-end gap-2">
                  <span className="font-bold text-[#0F172A]">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                   <button 
                     onClick={(e) => {
                       e.stopPropagation()
                       onRemoveItem(item.productId)
                     }}
                     className="text-[#94A3B8] hover:text-[#EF4444] p-1 rounded-md hover:bg-[#FEE2E2] transition-colors opacity-0 group-hover:opacity-100"
                     title="Remove Item"
                     aria-label="Remove item"
                   >
                     <Trash2 className="w-4 h-4" />
                   </button>
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

      {/* Shipping Price */}
      <div className="px-5 py-3 border-t border-[#E2E8F0] bg-[#F8FAFC]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-[#475569]">
            <Truck className="w-4 h-4" />
            <span>Shipping</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm text-[#64748B]">Rs.</span>
            <input
              type="number"
              value={shippingPrice || ''}
              onChange={e => setShippingPrice(parseFloat(e.target.value) || 0)}
              className="w-20 text-sm p-1.5 rounded-lg bg-white border border-[#E2E8F0] text-[#0F172A] focus:border-[#2563EB] focus:ring-1 focus:ring-[#DBEAFE] outline-none transition-all text-right"
              placeholder="0.00"
              step="0.01"
              min="0"
            />
          </div>
        </div>
      </div>

      {/* Total & Checkout Section */}
      <div className="bg-[#0F172A] p-5 rounded-t-2xl shadow-[0_-4px_20px_rgb(0_0_0/0.1)]">
        {/* Subtotal & Total Display */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-[#94A3B8]">Subtotal</span>
            <span className="text-white">{formatCurrency(subtotal)}</span>
          </div>
          {shippingPrice > 0 && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-[#94A3B8]">Shipping</span>
              <span className="text-white">{formatCurrency(shippingPrice)}</span>
            </div>
          )}
          <div className="flex justify-between items-end pt-2 border-t border-[#334155]">
            <span className="text-[#94A3B8] font-medium">Total Amount</span>
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {formatCurrency(total)}
            </span>
          </div>
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

          {/* Customer Address */}
          <textarea
            placeholder="Delivery Address (optional)"
            className="w-full p-3 rounded-lg bg-[#1E293B] border border-[#334155] text-white placeholder-[#64748B] focus:bg-[#0F172A] focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/30 outline-none transition-all resize-none"
            rows={2}
            value={formData.customerAddress}
            onChange={e => setFormData({...formData, customerAddress: e.target.value})}
          />
          
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

function CartQuantityInput({ value, onChange }: { value: number, onChange: (val: number) => void }) {
  const [localValue, setLocalValue] = useState(value.toString())

  useEffect(() => {
    // Only update local value if it differs significantly and we want to ensure sync.
    // However, for typing flow, we rely on localValue.
    // This effect ensures if external source updates quantity (e.g. duplicating item logic somewhere else?), we reflect it.
    // Checking strict inequality to avoid loop if possible, though React handles primitive deps well.
    if (parseInt(localValue) !== value && localValue !== '') {
        setLocalValue(value.toString())
    }
    // Handle edge case where value became valid but local was empty? No, value is always valid number from parent.
    // If parent says 5, and we have "", we should probably show 5? 
    // IF we are typing, we don't want to be overwritten.
    // Let's rely on simple sync:
    // setLocalValue(value.toString()) 
    // BUT this kills typing if parent re-renders fast.
    // Actually Checkout re-renders on every cart update.
    // If I type "1", parent updates to 1. Re-render with 1. localValue "1".
    // I type "12", parent updates to 12. Re-render with 12. localValue "12".
    // I type "" (delete). Parent NOT updated (stays 12). Re-render with 12. localValue becomes "12" again!
    // This is the bug. I need to NOT sync if I am the one editing?
    
    // Better: Don't sync if the parsed localValue matches value.
    // If I have "", parsed is NaN. value is 12. NaN != 12. Syncs to "12". FORCE.
    // This logic prevents empty string.
  }, [value])
  
  // FIX: If we want to allow empty string, we should effectively debounce or only sync on blur?
  // OR: Don't use a controlled parent-child sync, just use initial state?
  // But if I add same item again externally, it needs to update.
  
  // Revised approach:
  // We accept that "controlled" input is hard with "number" type and non-nullable source.
  // We will strictly update parent ONLY on valid input.
  // We will NOT reset from parent if the current local input effectively means "I am typing".
  
  // Actually, simpler: Use key={value} to force re-mount if we want? No, loses focus.
  
  // CORRECT FIX:
  // If the user inputs something invalid (like empty string), we keep it in local state.
  // The parent passes back the OLD valid value.
  // We see new props.value != current valid localValue?
  
  // Let's try a simpler version: 
  // If `localValue` is empty string, DON't overwrite it with `value` from props.
  // Only overwrite if `value` changes to something different than what we last emitted?
  
  // Actually, the previous implementation in the `replace_file_content` block had `useEffect` which overwrites.
  
  // Let's implement this:
  // passing `key={item.productId + item.quantity}` to the input? No.
  
  // I will implement a `useEffect` that checks:
  // If `localValue` parses to `value`, do nothing.
  // If `localValue` is empty or invalid, AND `value` is different from what we expect?
  
  // Actually, simpler:
  // Just use the input as fully controlled by local state.
  // Sync from props ONLY if the prop value is different from what our current local value represents.
  
  if (parseInt(localValue) !== value && localValue !== '' && !isNaN(parseInt(localValue))) {
       setLocalValue(value.toString())
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value)
    const val = parseInt(e.target.value)
    if (!isNaN(val)) {
      onChange(val)
    }
  }

  return (
    <input
      type="number"
      value={localValue}
      onChange={handleChange}
      onBlur={() => setLocalValue(value.toString())} // On blur, revert to actual valid value if we left it empty
      className="w-16 min-w-[60px] text-center text-sm font-semibold bg-[#F1F5F9] text-[#0F172A] border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#DBEAFE] rounded-lg px-2 py-1.5 outline-none transition-all no-spinners"
      placeholder="Qty"
    />
  )
}

