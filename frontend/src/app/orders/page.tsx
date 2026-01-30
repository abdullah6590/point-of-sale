import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import OrdersTable from '@/components/orders/OrdersTable'
import Navigation from '@/components/Navigation'

export const metadata: Metadata = {
  title: 'Order History - POS System',
  description: 'View and manage all past orders',
}

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="p-2 rounded-lg hover:bg-[#E2E8F0] transition-colors"
            title="Back to POS"
          >
            <ArrowLeft className="w-5 h-5 text-[#64748B]" />
          </Link>
          <div>
            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#0F172A]">
              Order History
            </h1>
            <p className="text-[#64748B] mt-1">
              View and manage all past orders
            </p>
          </div>
        </div>

        {/* Navigation */}
        {/* Navigation */}
        <Navigation />
      </header>

      {/* Orders Table */}
      <OrdersTable />
    </div>
  )
}
