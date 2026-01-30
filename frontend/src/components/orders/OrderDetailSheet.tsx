'use client'

import { X, Copy, Check, Phone, Mail, MapPin, Package } from 'lucide-react'
import { useState } from 'react'
import { format } from 'date-fns'
import type { Order } from '@/types'
import { formatCurrency } from '@/lib/utils'
import OrderStatusBadge from './OrderStatusBadge'
import PaymentMethodIcon from './PaymentMethodIcon'

interface OrderDetailSheetProps {
  order: Order | null
  isOpen: boolean
  onClose: () => void
}

export default function OrderDetailSheet({ order, isOpen, onClose }: OrderDetailSheetProps) {
  const [copied, setCopied] = useState(false)

  if (!order) return null

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(order.id)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const formattedDate = format(new Date(order.created_at), 'dd MMM yyyy, HH:mm')
  
  // Calculate totals
  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = order.tax || subtotal * 0.13 // Default 13% tax
  const discount = order.discount || 0
  const grandTotal = order.total_amount

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#E2E8F0]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg font-bold text-[#0F172A]">
                #{order.id.slice(0, 8).toUpperCase()}
              </h2>
              <button
                onClick={handleCopyId}
                className="p-1 rounded hover:bg-[#F1F5F9] transition-colors"
                title="Copy Order ID"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-[#22C55E]" />
                ) : (
                  <Copy className="w-4 h-4 text-[#64748B]" />
                )}
              </button>
            </div>
            <p className="text-sm text-[#64748B]">{formattedDate}</p>
          </div>
          
          <div className="flex items-center gap-3">
            <OrderStatusBadge status={order.status} />
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-[#F1F5F9] transition-colors"
            >
              <X className="w-5 h-5 text-[#64748B]" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto h-[calc(100%-80px)] p-6">
          {/* Customer Section */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-[#64748B] uppercase tracking-wider mb-3">
              Customer
            </h3>
            <div className="bg-[#F8FAFC] rounded-xl p-4">
              {order.customer ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#EFF6FF] text-[#3B82F6] flex items-center justify-center font-semibold">
                      {order.customer.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-semibold text-[#0F172A]">{order.customer.name}</p>
                      <p className="text-sm text-[#64748B]">Customer</p>
                    </div>
                  </div>
                  
                  {order.customer.phone && (
                    <div className="flex items-center gap-2 text-sm text-[#475569]">
                      <Phone className="w-4 h-4 text-[#64748B]" />
                      {order.customer.phone}
                    </div>
                  )}
                  
                  {order.customer.email && (
                    <div className="flex items-center gap-2 text-sm text-[#475569]">
                      <Mail className="w-4 h-4 text-[#64748B]" />
                      {order.customer.email}
                    </div>
                  )}
                  
                  {order.customer.address && (
                    <div className="flex items-center gap-2 text-sm text-[#475569]">
                      <MapPin className="w-4 h-4 text-[#64748B]" />
                      {order.customer.address}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-[#94A3B8] text-center py-2">Guest Customer</p>
              )}
            </div>
          </div>

          {/* Payment Method */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-[#64748B] uppercase tracking-wider mb-3">
              Payment
            </h3>
            <div className="bg-[#F8FAFC] rounded-xl p-4">
              <PaymentMethodIcon method={order.payment_method} />
            </div>
          </div>

          {/* Items Section */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-[#64748B] uppercase tracking-wider mb-3">
              Items ({order.items.length})
            </h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 p-3 bg-[#F8FAFC] rounded-xl"
                >
                  {/* Product Icon */}
                  <div className="w-12 h-12 rounded-lg bg-[#E2E8F0] flex items-center justify-center shrink-0">
                    {item.thumbnail ? (
                      <img
                        src={item.thumbnail}
                        alt={item.product_name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Package className="w-6 h-6 text-[#64748B]" />
                    )}
                  </div>
                  
                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#0F172A] truncate">
                      {item.product_name}
                    </p>
                    <p className="text-sm text-[#64748B]">
                      {item.quantity} × {formatCurrency(item.price)}
                    </p>
                    {item.variant && (
                      <p className="text-xs text-[#94A3B8] mt-1">
                        {item.variant}
                      </p>
                    )}
                  </div>
                  
                  {/* Subtotal */}
                  <p className="font-semibold text-[#0F172A]">
                    {formatCurrency(item.quantity * item.price)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Summary */}
          <div>
            <h3 className="text-sm font-semibold text-[#64748B] uppercase tracking-wider mb-3">
              Payment Summary
            </h3>
            <div className="bg-[#F8FAFC] rounded-xl p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[#64748B]">Subtotal</span>
                <span className="text-[#0F172A]">{formatCurrency(subtotal)}</span>
              </div>
              
              {(order.shipping_price || 0) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-[#64748B]">Shipping</span>
                  <span className="text-[#0F172A]">{formatCurrency(order.shipping_price || 0)}</span>
                </div>
              )}
              
              <div className="flex justify-between text-sm">
                <span className="text-[#64748B]">Tax/VAT (13%)</span>
                <span className="text-[#0F172A]">{formatCurrency(tax)}</span>
              </div>
              
              {discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-[#64748B]">Discount</span>
                  <span className="text-[#22C55E]">{formatCurrency(discount)}</span>
                </div>
              )}
              
              <div className="border-t border-[#E2E8F0] pt-3 mt-3">
                <div className="flex justify-between">
                  <span className="font-semibold text-[#0F172A]">Grand Total</span>
                  <span className="text-xl font-bold text-[#2563EB]">
                    {formatCurrency(grandTotal)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
