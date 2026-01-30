'use client'

import { forwardRef } from 'react'
import { format } from 'date-fns'
import type { Order } from '@/types'
import { formatCurrency } from '@/lib/utils'

interface PrintableOrderListProps {
  orders: Order[]
  title?: string
}

const PrintableOrderList = forwardRef<HTMLDivElement, PrintableOrderListProps>(
  ({ orders, title = 'Order List Report' }, ref) => {
    const printDate = format(new Date(), 'dd MMM yyyy, HH:mm')
    const totalAmount = orders.reduce((sum, order) => sum + order.total_amount, 0)

    return (
      <div ref={ref} className="print-order-list bg-white p-8 max-w-[800px] mx-auto font-sans text-sm">
        {/* Header */}
        <div className="text-center mb-6 border-b border-gray-300 pb-4">
          <h1 className="text-2xl font-bold mb-1">POS SYSTEM</h1>
          <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
          <p className="text-gray-500 text-xs mt-2">Generated on: {printDate}</p>
        </div>

        {/* Summary */}
        <div className="mb-6 bg-gray-100 p-4 rounded">
          <div className="flex justify-between">
            <span className="font-semibold">Total Orders:</span>
            <span>{orders.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Total Amount:</span>
            <span className="font-bold">{formatCurrency(totalAmount)}</span>
          </div>
        </div>

        {/* Orders Table */}
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-2 py-2 text-left">Order ID</th>
              <th className="border border-gray-300 px-2 py-2 text-left">Date</th>
              <th className="border border-gray-300 px-2 py-2 text-left">Customer</th>
              <th className="border border-gray-300 px-2 py-2 text-left">Status</th>
              <th className="border border-gray-300 px-2 py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={order.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border border-gray-300 px-2 py-1.5 font-mono">
                  #{order.id.slice(0, 8).toUpperCase()}
                </td>
                <td className="border border-gray-300 px-2 py-1.5">
                  {format(new Date(order.created_at), 'dd MMM yyyy, HH:mm')}
                </td>
                <td className="border border-gray-300 px-2 py-1.5">
                  {order.customer?.name || 'Guest'}
                </td>
                <td className="border border-gray-300 px-2 py-1.5 uppercase">
                  {order.status}
                </td>
                <td className="border border-gray-300 px-2 py-1.5 text-right font-semibold">
                  {formatCurrency(order.total_amount)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-200 font-bold">
              <td colSpan={4} className="border border-gray-300 px-2 py-2 text-right">
                TOTAL:
              </td>
              <td className="border border-gray-300 px-2 py-2 text-right">
                {formatCurrency(totalAmount)}
              </td>
            </tr>
          </tfoot>
        </table>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-gray-500 border-t border-gray-300 pt-4">
          <p>--- End of Report ---</p>
        </div>
      </div>
    )
  }
)

PrintableOrderList.displayName = 'PrintableOrderList'

export default PrintableOrderList
