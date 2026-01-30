'use client'

import { useState, useRef, useEffect } from 'react'
import { MoreVertical, Eye, Printer, RotateCcw, Loader2 } from 'lucide-react'
import type { Order } from '@/types'

interface OrderActionsProps {
  order: Order
  onViewDetails: (order: Order) => void
  onRefund: (order: Order) => void
  onPrint: (order: Order) => void
  isRefunding?: boolean
}

export default function OrderActions({
  order,
  onViewDetails,
  onRefund,
  onPrint,
  isRefunding = false,
}: OrderActionsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handlePrint = () => {
    setIsOpen(false)
    onPrint(order)
  }

  const handleViewDetails = () => {
    setIsOpen(false)
    onViewDetails(order)
  }

  const handleRefund = () => {
    setIsOpen(false)
    if (order.status !== 'refunded' && order.status !== 'cancelled') {
      onRefund(order)
    }
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-[#F1F5F9] transition-colors"
        aria-label="Order actions"
      >
        <MoreVertical className="w-4 h-4 text-[#64748B]" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-lg shadow-lg border border-[#E2E8F0] py-1 z-50">
          <button
            onClick={handleViewDetails}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#0F172A] hover:bg-[#F8FAFC] transition-colors"
          >
            <Eye className="w-4 h-4 text-[#64748B]" />
            View Details
          </button>
          
          <button
            onClick={handlePrint}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#0F172A] hover:bg-[#F8FAFC] transition-colors"
          >
            <Printer className="w-4 h-4 text-[#64748B]" />
            Print Invoice
          </button>
          
          <div className="border-t border-[#E2E8F0] my-1" />
          
          <button
            onClick={handleRefund}
            disabled={order.status === 'refunded' || order.status === 'cancelled' || isRefunding}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#DC2626] hover:bg-[#FEF2F2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          >
            {isRefunding ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RotateCcw className="w-4 h-4" />
            )}
            {order.status === 'refunded' ? 'Already Refunded' : 'Refund'}
          </button>
        </div>
      )}
    </div>
  )
}

