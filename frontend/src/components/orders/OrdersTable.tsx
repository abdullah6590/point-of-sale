'use client'

import { useState, useEffect, useRef } from 'react'
import { format } from 'date-fns'
import { Copy, Check, Loader2, FileX, Printer, X, ChevronDown } from 'lucide-react'
import type { Order, OrderFilters, OrderStatus } from '@/types'
import { useOrders, useUpdateOrderStatus } from '@/hooks/useOrders'
import { formatCurrency } from '@/lib/utils'
import OrderFiltersBar from './OrderFilters'
import ColumnVisibility, { type ColumnConfig } from './ColumnVisibility'
import OrderStatusBadge from './OrderStatusBadge'
import PaymentMethodIcon from './PaymentMethodIcon'
import CustomerCell from './CustomerCell'
import OrderActions from './OrderActions'
import OrderDetailSheet from './OrderDetailSheet'
import PrintableInvoice from './PrintableInvoice'
import PrintableOrderList from './PrintableOrderList'

const DEFAULT_COLUMNS: ColumnConfig[] = [
  { id: 'orderId', label: 'Order ID', visible: true },
  { id: 'date', label: 'Date & Time', visible: true },
  { id: 'customer', label: 'Customer', visible: true },
  { id: 'address', label: 'Address', visible: true },
  { id: 'payment', label: 'Payment', visible: true },
  { id: 'total', label: 'Total', visible: true },
  { id: 'status', label: 'Status', visible: true },
  { id: 'actions', label: 'Actions', visible: true },
]

export default function OrdersTable() {
  const [filters, setFilters] = useState<OrderFilters>({})
  const [columns, setColumns] = useState<ColumnConfig[]>(DEFAULT_COLUMNS)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [orderToPrint, setOrderToPrint] = useState<Order | null>(null)

  const [isPrintingAll, setIsPrintingAll] = useState(false)
  
  // Status Editing State
  const [editingId, setEditingId] = useState<string | null>(null)
  
  const printRef = useRef<HTMLDivElement>(null)
  const printAllRef = useRef<HTMLDivElement>(null)
  
  const { data: orders, isLoading, error, refetch } = useOrders(filters)
  const updateStatus = useUpdateOrderStatus()

  // Load column visibility from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('orderColumnsVisibility')
    if (saved) {
      try {
        const visibility = JSON.parse(saved)
        setColumns(prev =>
          prev.map(col => ({
            ...col,
            visible: visibility[col.id] ?? col.visible,
          }))
        )
      } catch {
        // Ignore parse errors
      }
    }
  }, [])

  const handleCopyId = async (orderId: string) => {
    try {
      await navigator.clipboard.writeText(orderId)
      setCopiedId(orderId)
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      console.error('Failed to copy')
    }
  }

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order)
    setIsSheetOpen(true)
  }

  const handleCloseSheet = () => {
    setIsSheetOpen(false)
    setTimeout(() => setSelectedOrder(null), 300)
  }

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateStatus.mutateAsync({ id: orderId, status: newStatus })
      setEditingId(null)
    } catch (err) {
      alert('Failed to update status')
    }
  }

  const handleRefund = async (order: Order) => {
    if (confirm(`Are you sure you want to refund order #${order.id.slice(0, 8).toUpperCase()}?`)) {
      try {
        await updateStatus.mutateAsync({ id: order.id, status: 'refunded' })
      } catch (err) {
        alert('Failed to refund order. Please try again.')
      }
    }
  }

  const handlePrint = (order: Order) => {
    setOrderToPrint(order)
    // Wait for state update and render, then print
    setTimeout(() => {
      if (printRef.current) {
        const printWindow = window.open('', '_blank')
        if (printWindow) {
          printWindow.document.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>Invoice - ${order.id.slice(0, 8).toUpperCase()}</title>
                <style>
                  * { margin: 0; padding: 0; box-sizing: border-box; }
                  body { font-family: 'Courier New', monospace; font-size: 12px; padding: 20px; }
                  .print-invoice { max-width: 400px; margin: 0 auto; }
                  table { width: 100%; border-collapse: collapse; }
                  th, td { padding: 4px; text-align: left; }
                  th { border-bottom: 1px solid #ccc; }
                  td { border-bottom: 1px dotted #eee; }
                  .text-center { text-align: center; }
                  .text-right { text-align: right; }
                  .font-bold { font-weight: bold; }
                  .border-dashed { border-top: 1px dashed #999; padding-top: 10px; margin-top: 10px; }
                  .text-gray-600 { color: #666; }
                  .text-gray-500 { color: #999; }
                  .mb-1 { margin-bottom: 4px; }
                  .mb-4 { margin-bottom: 16px; }
                  .mb-6 { margin-bottom: 24px; }
                  .mt-2 { margin-top: 8px; }
                  .mt-4 { margin-top: 16px; }
                  .mt-6 { margin-top: 24px; }
                  .pt-3 { padding-top: 12px; }
                  .pt-4 { padding-top: 16px; }
                  .py-1 { padding-top: 4px; padding-bottom: 4px; }
                  .py-2 { padding-top: 8px; padding-bottom: 8px; }
                  .text-xl { font-size: 18px; }
                  .text-xs { font-size: 10px; }
                  .uppercase { text-transform: uppercase; }
                  .grand-total { font-size: 16px; font-weight: bold; border-top: 2px double #333; padding-top: 10px; margin-top: 10px; }
                </style>
              </head>
              <body>
                ${printRef.current.innerHTML}
              </body>
            </html>
          `)
          printWindow.document.close()
          printWindow.focus()
          setTimeout(() => {
            printWindow.print()
            printWindow.close()
          }, 250)
        }
      }
      setOrderToPrint(null)
    }, 100)
  }

  const handlePrintAll = () => {
    if (!orders || orders.length === 0) {
      alert('No orders to print')
      return
    }
    
    setIsPrintingAll(true)
    setTimeout(() => {
      if (printAllRef.current) {
        const printWindow = window.open('', '_blank')
        if (printWindow) {
          printWindow.document.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>Order List Report</title>
                <style>
                  * { margin: 0; padding: 0; box-sizing: border-box; }
                  body { font-family: Arial, sans-serif; font-size: 12px; padding: 20px; }
                  .print-order-list { max-width: 800px; margin: 0 auto; }
                  table { width: 100%; border-collapse: collapse; }
                  th, td { padding: 6px 8px; text-align: left; border: 1px solid #ddd; }
                  th { background-color: #f0f0f0; font-weight: bold; }
                  tr:nth-child(even) { background-color: #f9f9f9; }
                  tfoot tr { background-color: #f0f0f0; font-weight: bold; }
                  .text-center { text-align: center; }
                  .text-right { text-align: right; }
                  .font-bold { font-weight: bold; }
                  .font-mono { font-family: monospace; }
                  .font-semibold { font-weight: 600; }
                  .uppercase { text-transform: uppercase; }
                  .bg-gray-100 { background-color: #f5f5f5; padding: 15px; border-radius: 4px; margin-bottom: 20px; }
                  .border-b { border-bottom: 1px solid #ddd; }
                  .mb-6 { margin-bottom: 24px; }
                  .mt-6 { margin-top: 24px; }
                  .pb-4 { padding-bottom: 16px; }
                  .pt-4 { padding-top: 16px; }
                  .text-2xl { font-size: 24px; }
                  .text-lg { font-size: 18px; }
                  .text-xs { font-size: 11px; }
                  .text-gray-700 { color: #444; }
                  .text-gray-500 { color: #888; }
                </style>
              </head>
              <body>
                ${printAllRef.current.innerHTML}
              </body>
            </html>
          `)
          printWindow.document.close()
          printWindow.focus()
          setTimeout(() => {
            printWindow.print()
            printWindow.close()
          }, 250)
        }
      }
      setIsPrintingAll(false)
    }, 100)
  }

  const isColumnVisible = (columnId: string) =>
    columns.find(c => c.id === columnId)?.visible ?? true

  // Loading State
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#2563EB] mb-4" />
        <p className="text-[#64748B]">Loading orders...</p>
      </div>
    )
  }

  // Error State
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-[#DC2626] mb-4">
          <FileX className="w-12 h-12 mx-auto mb-2" />
          <p className="font-medium">Failed to load orders</p>
        </div>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1D4ED8] transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <>
      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <OrderFiltersBar filters={filters} onFiltersChange={setFilters} />
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrintAll}
            disabled={!orders || orders.length === 0 || isPrintingAll}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#E2E8F0] bg-white text-sm font-medium text-[#475569] hover:border-[#2563EB] hover:text-[#2563EB] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            title="Print all orders"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print All</span>
          </button>
          <ColumnVisibility columns={columns} onColumnsChange={setColumns} />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                {isColumnVisible('orderId') && (
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                    Order ID
                  </th>
                )}
                {isColumnVisible('date') && (
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                    Date & Time
                  </th>
                )}
                {isColumnVisible('customer') && (
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                    Customer
                  </th>
                )}
                {isColumnVisible('address') && (
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                    Address
                  </th>
                )}
                {isColumnVisible('payment') && (
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                    Payment
                  </th>
                )}
                {isColumnVisible('total') && (
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                    Total
                  </th>
                )}
                {isColumnVisible('status') && (
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                    Status
                  </th>
                )}
                {isColumnVisible('actions') && (
                  <th className="px-6 py-4 text-right text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {orders && orders.length > 0 ? (
                orders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                    onClick={() => handleViewDetails(order)}
                  >
                    {isColumnVisible('orderId') && (
                      <td className="px-6 py-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCopyId(order.id)
                          }}
                          className="flex items-center gap-2 hover:text-[#2563EB] transition-colors group"
                          title="Click to copy"
                        >
                          <span className="font-mono font-medium text-[#0F172A]">
                            #{order.id.slice(0, 8).toUpperCase()}
                          </span>
                          {copiedId === order.id ? (
                            <Check className="w-4 h-4 text-[#22C55E]" />
                          ) : (
                            <Copy className="w-4 h-4 text-[#94A3B8] opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </button>
                      </td>
                    )}
                    {isColumnVisible('date') && (
                      <td className="px-6 py-4 text-sm text-[#475569]">
                        {format(new Date(order.created_at), 'dd MMM yyyy, HH:mm')}
                      </td>
                    )}
                    {isColumnVisible('customer') && (
                      <td className="px-6 py-4">
                        <CustomerCell customer={order.customer} />
                      </td>
                    )}
                    {isColumnVisible('address') && (
                      <td className="px-6 py-4">
                        <span className="text-sm text-[#475569] max-w-[200px] truncate block" title={order.customer?.address || 'N/A'}>
                          {order.customer?.address || <span className="text-[#94A3B8]">—</span>}
                        </span>
                      </td>
                    )}
                    {isColumnVisible('payment') && (
                      <td className="px-6 py-4">
                        <PaymentMethodIcon method={order.payment_method} />
                      </td>
                    )}
                    {isColumnVisible('total') && (
                      <td className="px-6 py-4">
                        <span className="font-bold text-[#0F172A]">
                          {formatCurrency(order.total_amount)}
                        </span>
                      </td>
                    )}
                    {isColumnVisible('status') && (
                      <td className="px-6 py-4">
                        {editingId === order.id ? (
                          <div className="relative" onClick={e => e.stopPropagation()}>
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusUpdate(order.id, e.target.value as OrderStatus)}
                              className="appearance-none w-full bg-white border border-[#E2E8F0] text-[#0F172A] text-sm rounded-lg px-3 py-1.5 padding-right-8 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] cursor-pointer"
                              autoFocus
                              onBlur={() => setEditingId(null)}
                            >
                              <option value="completed">Completed</option>
                              <option value="pending">Pending</option>
                              <option value="cancelled">Cancelled</option>
                              <option value="refunded">Refunded</option>
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] pointer-events-none" />
                          </div>
                        ) : (
                          <div 
                            className="group/status cursor-pointer relative inline-block"
                            onClick={(e) => {
                              e.stopPropagation()
                              setEditingId(order.id)
                            }}
                            title="Click to change status"
                          >
                            <OrderStatusBadge status={order.status} />
                            <div className="absolute -right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover/status:opacity-100 transition-opacity">
                              <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
                            </div>
                          </div>
                        )}
                      </td>
                    )}
                    {isColumnVisible('actions') && (
                      <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <OrderActions
                          order={order}
                          onViewDetails={handleViewDetails}
                          onRefund={handleRefund}
                          onPrint={handlePrint}
                          isRefunding={updateStatus.isPending}
                        />
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.filter(c => c.visible).length}
                    className="px-6 py-16 text-center"
                  >
                    <div className="flex flex-col items-center">
                      <FileX className="w-12 h-12 text-[#CBD5E1] mb-3" />
                      <p className="text-lg font-medium text-[#64748B]">No orders found</p>
                      <p className="text-sm text-[#94A3B8] mt-1">
                        Try adjusting your filters or search terms
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Sheet */}
      <OrderDetailSheet
        order={selectedOrder}
        isOpen={isSheetOpen}
        onClose={handleCloseSheet}
      />

      {/* Hidden Printable Invoice */}
      {orderToPrint && (
        <div className="hidden">
          <PrintableInvoice ref={printRef} order={orderToPrint} />
        </div>
      )}

      {/* Hidden Printable Order List */}
      {isPrintingAll && orders && (
        <div className="hidden">
          <PrintableOrderList ref={printAllRef} orders={orders} />
        </div>
      )}
    </>
  )
}

