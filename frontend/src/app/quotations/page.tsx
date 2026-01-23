import { getSalesByStatus, deleteSale } from '@/app/actions'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { FileText, PauseCircle, ArrowLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function QuotationsPage() {
  const quotations = await getSalesByStatus('QUOTATION')
  const parkedOrders = await getSalesByStatus('PARKED')

  async function handleDelete(formData: FormData) {
    'use server'
    const id = formData.get('id') as string
    if (id) {
      await deleteSale(id)
      redirect('/quotations')
    }
  }

  return (
    <div className="min-h-screen p-6 lg:p-8 bg-[#F8FAFC]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#0F172A]">
              Quotations & Held Orders
            </h1>
            <p className="text-[#64748B] mt-1">
              Manage saved quotes and drafts
            </p>
          </div>
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0F172A] text-white font-semibold rounded-lg shadow-[0_4px_6px_-1px_rgb(0_0_0/0.2)] hover:bg-[#1E293B] hover:shadow-[0_10px_15px_-3px_rgb(0_0_0/0.2)] transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to POS
          </Link>
        </header>

        <div className="space-y-10">
          {/* Quotations Section */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-[#EFF6FF]">
                <FileText className="w-5 h-5 text-[#2563EB]" strokeWidth={2} />
              </div>
              <h2 className="text-xl font-bold text-[#0F172A]">Quotations</h2>
              <span className="px-2.5 py-1 bg-[#F1F5F9] text-[#64748B] text-xs font-semibold rounded-full">
                {quotations.length}
              </span>
            </div>

            <div className="space-y-4">
              {quotations.length === 0 ? (
                <div className="bg-white p-10 rounded-xl border-2 border-dashed border-[#E2E8F0] text-center">
                  <div className="w-14 h-14 mx-auto rounded-full bg-[#F1F5F9] flex items-center justify-center mb-4">
                    <FileText className="w-6 h-6 text-[#94A3B8]" />
                  </div>
                  <p className="text-[#64748B] font-medium">No active quotations</p>
                  <p className="text-[#94A3B8] text-sm mt-1">Saved quotes will appear here</p>
                </div>
              ) : (
                quotations.map(quote => (
                  <div 
                    key={quote.id} 
                    className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-[0_4px_6px_-1px_rgb(0_0_0/0.05)] hover:shadow-[0_10px_15px_-3px_rgb(0_0_0/0.1)] transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                  >
                    {/* Quote Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-lg text-[#0F172A]">
                          {quote.customerName || 'Walk-in Customer'}
                        </h3>
                        <span className="px-2 py-0.5 bg-[#F1F5F9] text-[#64748B] text-xs font-medium rounded">
                          #{quote.id.slice(0, 8)}
                        </span>
                      </div>
                      <p className="text-sm text-[#64748B] mb-1">
                        {new Date(quote.createdAt).toLocaleDateString()} • {new Date(quote.createdAt).toLocaleTimeString()}
                      </p>
                      <p className="text-sm text-[#475569] truncate">
                        {quote.items.map(i => `${i.product.name} (×${i.quantity})`).join(', ')}
                      </p>
                    </div>
                    
                    {/* Total and Actions */}
                    <div className="flex items-center gap-5 w-full md:w-auto">
                      <div className="text-right">
                        <p className="text-xs text-[#94A3B8] font-medium">Total Amount</p>
                        <p className="text-2xl font-extrabold text-[#0F172A]">
                          ${quote.totalAmount.toFixed(2)}
                        </p>
                      </div>
                      
                      <div className="flex gap-2">
                        <Link 
                          href={`/?quoteId=${quote.id}`}
                          className="px-4 py-2.5 bg-[#2563EB] text-white text-sm font-semibold rounded-lg shadow-[0_2px_4px_rgb(37_99_235/0.3)] hover:bg-[#1D4ED8] hover:shadow-[0_4px_6px_rgb(37_99_235/0.4)] transition-all"
                        >
                          Load to POS
                        </Link>
                        <form action={handleDelete}>
                          <input type="hidden" name="id" value={quote.id} />
                          <button 
                            type="submit" 
                            className="px-4 py-2.5 bg-[#FEE2E2] text-[#DC2626] text-sm font-semibold rounded-lg hover:bg-[#FECACA] transition-colors"
                          >
                            Delete
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Parked Orders Section */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-[#FFFBEB]">
                <PauseCircle className="w-5 h-5 text-[#F59E0B]" strokeWidth={2} />
              </div>
              <h2 className="text-xl font-bold text-[#0F172A]">Held Orders</h2>
              <span className="px-2.5 py-1 bg-[#F1F5F9] text-[#64748B] text-xs font-semibold rounded-full">
                {parkedOrders.length}
              </span>
            </div>

            <div className="space-y-4">
              {parkedOrders.length === 0 ? (
                <div className="bg-white p-10 rounded-xl border-2 border-dashed border-[#E2E8F0] text-center">
                  <div className="w-14 h-14 mx-auto rounded-full bg-[#F1F5F9] flex items-center justify-center mb-4">
                    <PauseCircle className="w-6 h-6 text-[#94A3B8]" />
                  </div>
                  <p className="text-[#64748B] font-medium">No held orders</p>
                  <p className="text-[#94A3B8] text-sm mt-1">Parked orders will appear here</p>
                </div>
              ) : (
                parkedOrders.map(order => (
                  <div 
                    key={order.id} 
                    className="bg-white p-5 rounded-xl border border-[#E2E8F0] border-l-4 border-l-[#F59E0B] shadow-[0_4px_6px_-1px_rgb(0_0_0/0.05)] hover:shadow-[0_10px_15px_-3px_rgb(0_0_0/0.1)] transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                  >
                    {/* Order Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-lg text-[#0F172A]">
                          {order.customerName || 'Walk-in Customer'}
                        </h3>
                        <span className="px-2 py-0.5 bg-[#FEF3C7] text-[#854D0E] text-xs font-medium rounded">
                          #{order.id.slice(0, 8)}
                        </span>
                      </div>
                      <p className="text-sm text-[#64748B] mb-1">
                        {new Date(order.createdAt).toLocaleDateString()} • {new Date(order.createdAt).toLocaleTimeString()}
                      </p>
                      <p className="text-sm text-[#475569] truncate">
                        {order.items.map(i => `${i.product.name} (×${i.quantity})`).join(', ')}
                      </p>
                    </div>
                    
                    {/* Total and Actions */}
                    <div className="flex items-center gap-5 w-full md:w-auto">
                      <div className="text-right">
                        <p className="text-xs text-[#94A3B8] font-medium">Total Amount</p>
                        <p className="text-2xl font-extrabold text-[#0F172A]">
                          ${order.totalAmount.toFixed(2)}
                        </p>
                      </div>
                      
                      <div className="flex gap-2">
                        <Link 
                          href={`/?quoteId=${order.id}`}
                          className="px-4 py-2.5 bg-[#F59E0B] text-white text-sm font-semibold rounded-lg shadow-[0_2px_4px_rgb(245_158_11/0.3)] hover:bg-[#D97706] hover:shadow-[0_4px_6px_rgb(245_158_11/0.4)] transition-all"
                        >
                          Resume Order
                        </Link>
                        <form action={handleDelete}>
                          <input type="hidden" name="id" value={order.id} />
                          <button 
                            type="submit" 
                            className="px-4 py-2.5 bg-[#F1F5F9] text-[#64748B] text-sm font-semibold rounded-lg hover:bg-[#E2E8F0] hover:text-[#475569] transition-colors"
                          >
                            Discard
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
