'use client'

import { forwardRef } from 'react'
import { format } from 'date-fns'
import type { Order } from '@/types'
import { formatCurrency } from '@/lib/utils'

interface PrintableInvoiceProps {
  order: Order
}

const PrintableInvoice = forwardRef<HTMLDivElement, PrintableInvoiceProps>(
  ({ order }, ref) => {
    const formattedDate = format(new Date(order.created_at), 'dd MMM yyyy, HH:mm')
    
    // Calculate totals
    const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const tax = order.tax || subtotal * 0.13
    const discount = order.discount || 0
    const grandTotal = order.total_amount

    return (
      <div ref={ref} className="print-invoice bg-white p-8 max-w-[400px] mx-auto font-mono text-sm">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold mb-1">POS SYSTEM</h1>
          <p className="text-gray-600 text-xs">Your Trusted Point of Sale</p>
          <div className="border-t border-dashed border-gray-400 mt-4 pt-4">
            <p className="font-bold">SALES INVOICE</p>
          </div>
        </div>

        {/* Order Info */}
        <div className="mb-4 text-xs">
          <div className="flex justify-between">
            <span>Invoice #:</span>
            <span className="font-bold">{order.id.slice(0, 8).toUpperCase()}</span>
          </div>
          <div className="flex justify-between">
            <span>Date:</span>
            <span>{formattedDate}</span>
          </div>
          <div className="flex justify-between">
            <span>Status:</span>
            <span className="uppercase">{order.status}</span>
          </div>
        </div>

        {/* Customer Info */}
        {order.customer && (
          <div className="mb-4 text-xs border-t border-dashed border-gray-400 pt-3">
            <p className="font-bold mb-1">Bill To:</p>
            <p>{order.customer.name}</p>
            {order.customer.phone && <p>Phone: {order.customer.phone}</p>}
            {order.customer.email && <p>Email: {order.customer.email}</p>}
            {order.customer.address && <p>Address: {order.customer.address}</p>}
          </div>
        )}

        {/* Items */}
        <div className="border-t border-dashed border-gray-400 pt-3 mb-4">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="text-left py-1">Item</th>
                <th className="text-center py-1">Qty</th>
                <th className="text-right py-1">Price</th>
                <th className="text-right py-1">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id} className="border-b border-gray-200">
                  <td className="py-2 pr-2">
                    <div className="truncate max-w-[120px]" title={item.product_name}>
                      {item.product_name}
                    </div>
                    {item.variant && (
                      <div className="text-gray-500 text-[10px]">{item.variant}</div>
                    )}
                  </td>
                  <td className="text-center py-2">{item.quantity}</td>
                  <td className="text-right py-2">{formatCurrency(item.price)}</td>
                  <td className="text-right py-2">{formatCurrency(item.quantity * item.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="border-t border-dashed border-gray-400 pt-3 text-xs">
          <div className="flex justify-between py-1">
            <span>Subtotal:</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          {(order.shipping_price || 0) > 0 && (
            <div className="flex justify-between py-1">
              <span>Shipping:</span>
              <span>{formatCurrency(order.shipping_price || 0)}</span>
            </div>
          )}
          <div className="flex justify-between py-1">
            <span>Tax (13%):</span>
            <span>{formatCurrency(tax)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between py-1 text-green-600">
              <span>Discount:</span>
              <span>-{formatCurrency(discount)}</span>
            </div>
          )}
          <div className="flex justify-between py-2 font-bold text-base border-t border-double border-gray-400 mt-2 pt-2">
            <span>GRAND TOTAL:</span>
            <span>{formatCurrency(grandTotal)}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-gray-500 border-t border-dashed border-gray-400 pt-4">
          <p>Thank you for your business!</p>
          <p className="mt-2">--- END OF INVOICE ---</p>
        </div>
      </div>
    )
  }
)

PrintableInvoice.displayName = 'PrintableInvoice'

export default PrintableInvoice
