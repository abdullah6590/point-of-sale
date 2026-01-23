import { DollarSign, TrendingUp, Tag, ShoppingCart } from 'lucide-react'

interface MetricsProps {
  metrics: { 
    revenue: number
    profit: number
    salesCount: number
    retailValue: number 
  }
}

export default function DashboardMetrics({ metrics }: MetricsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
      
      {/* Total Revenue - Primary Stat */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_4px_6px_-1px_rgb(0_0_0/0.05)] p-6 hover:shadow-[0_10px_15px_-3px_rgb(0_0_0/0.1)] transition-all duration-300">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-[#64748B]">Total Revenue</p>
            <h3 className="text-3xl font-extrabold text-[#0F172A] mt-2">
              ${metrics.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
          </div>
          <div className="p-3 rounded-xl bg-[#EFF6FF]">
            <DollarSign className="w-6 h-6 text-[#2563EB]" strokeWidth={2} />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-[#DCFCE7] text-[#166534]">
            <TrendingUp className="w-3 h-3" />
            Active
          </span>
          <span className="text-xs text-[#94A3B8]">Real-time tracking</span>
        </div>
      </div>

      {/* Net Profit */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_4px_6px_-1px_rgb(0_0_0/0.05)] p-6 hover:shadow-[0_10px_15px_-3px_rgb(0_0_0/0.1)] transition-all duration-300">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-[#64748B]">Net Profit</p>
            <h3 className="text-3xl font-extrabold text-[#0F172A] mt-2">
              ${metrics.profit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
          </div>
          <div className="p-3 rounded-xl bg-[#F0FDF4]">
            <TrendingUp className="w-6 h-6 text-[#16A34A]" strokeWidth={2} />
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#16A34A] rounded-full" 
                style={{ width: `${Math.min((metrics.profit / metrics.revenue) * 100 || 0, 100)}%` }}
              />
            </div>
            <span className="text-xs font-medium text-[#64748B]">
              {((metrics.profit / metrics.revenue) * 100 || 0).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Retail Value */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_4px_6px_-1px_rgb(0_0_0/0.05)] p-6 hover:shadow-[0_10px_15px_-3px_rgb(0_0_0/0.1)] transition-all duration-300">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-[#64748B]">Retail Value (MSRP)</p>
            <h3 className="text-3xl font-extrabold text-[#0F172A] mt-2">
              ${metrics.retailValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
          </div>
          <div className="p-3 rounded-xl bg-[#F5F3FF]">
            <Tag className="w-6 h-6 text-[#8B5CF6]" strokeWidth={2} />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <span className="text-xs text-[#94A3B8]">Total market price of sold items</span>
        </div>
      </div>

      {/* Total Transactions */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_4px_6px_-1px_rgb(0_0_0/0.05)] p-6 hover:shadow-[0_10px_15px_-3px_rgb(0_0_0/0.1)] transition-all duration-300">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-[#64748B]">Total Orders</p>
            <h3 className="text-3xl font-extrabold text-[#0F172A] mt-2">
              {metrics.salesCount.toLocaleString()}
            </h3>
          </div>
          <div className="p-3 rounded-xl bg-[#FFFBEB]">
            <ShoppingCart className="w-6 h-6 text-[#F59E0B]" strokeWidth={2} />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <span className="text-xs text-[#64748B]">Avg: </span>
          <span className="text-xs font-semibold text-[#0F172A]">
            ${metrics.salesCount > 0 ? (metrics.revenue / metrics.salesCount).toFixed(2) : '0.00'}
          </span>
          <span className="text-xs text-[#94A3B8]">per order</span>
        </div>
      </div>

    </div>
  )
}
