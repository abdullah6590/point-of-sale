import { DollarSign, TrendingUp, Tag, ShoppingCart, Truck } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface MetricsProps {
  metrics: { 
    revenue: number
    profit: number
    salesCount: number
    costValue: number 
    shippingCost: number
  }
}

export default function DashboardMetrics({ metrics }: MetricsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5">
      
      {/* Total Revenue - Primary Stat */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_4px_6px_-1px_rgb(0_0_0/0.05)] p-6 hover:shadow-[0_10px_15px_-3px_rgb(0_0_0/0.1)] transition-all duration-300">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-[#64748B]">Total Revenue</p>
            <h3 className="text-3xl font-extrabold text-[#0F172A] mt-2">
              {formatCurrency(metrics.revenue)}
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
              {formatCurrency(metrics.profit)}
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

      {/* Total Cost / COGS */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_4px_6px_-1px_rgb(0_0_0/0.05)] p-6 hover:shadow-[0_10px_15px_-3px_rgb(0_0_0/0.1)] transition-all duration-300">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-[#64748B]">Total Cost (COGS)</p>
            <h3 className="text-3xl font-extrabold text-[#0F172A] mt-2">
              {formatCurrency(metrics.costValue)}
            </h3>
          </div>
          <div className="p-3 rounded-xl bg-[#F5F3FF]">
            <Tag className="w-6 h-6 text-[#8B5CF6]" strokeWidth={2} />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <span className="text-xs text-[#94A3B8]">Product cost only</span>
        </div>
      </div>

       {/* Shipping Cost */}
       <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_4px_6px_-1px_rgb(0_0_0/0.05)] p-6 hover:shadow-[0_10px_15px_-3px_rgb(0_0_0/0.1)] transition-all duration-300">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-[#64748B]">Shipping Revenue</p>
            <h3 className="text-3xl font-extrabold text-[#0F172A] mt-2">
              {formatCurrency(metrics.shippingCost)}
            </h3>
          </div>
          <div className="p-3 rounded-xl bg-[#FFF7ED]">
            <Truck className="w-6 h-6 text-[#EA580C]" strokeWidth={2} />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <span className="text-xs text-[#94A3B8]">Total shipping fees</span>
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
            {metrics.salesCount > 0 ? formatCurrency(metrics.revenue / metrics.salesCount) : formatCurrency(0)}
          </span>
          <span className="text-xs text-[#94A3B8]">per order</span>
        </div>
      </div>

    </div>
  )
}
