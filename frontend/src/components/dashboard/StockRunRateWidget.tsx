'use client'

import { AlertTriangle, CheckCircle, Package } from 'lucide-react'

type StockData = {
  id: string
  name: string
  stock: number
  avgDailySales: number
  daysUntilStockout: number
}

export default function StockRunRateWidget({ data }: { data: StockData[] }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-[0_4px_6px_-1px_rgb(0_0_0/0.05)] h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-lg font-bold text-[#0F172A]">Smart Inventory</h3>
          <p className="text-sm text-[#64748B]">Re-order recommendations by run-rate</p>
        </div>
        <div className="p-2.5 rounded-xl bg-[#EFF6FF]">
          <Package className="w-5 h-5 text-[#2563EB]" strokeWidth={2} />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto space-y-4">
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-12 h-12 rounded-full bg-[#DCFCE7] flex items-center justify-center mb-3">
              <CheckCircle className="w-6 h-6 text-[#16A34A]" />
            </div>
            <p className="text-[#16A34A] font-medium text-sm">Sufficient stock for all items</p>
          </div>
        ) : (
          data.map((item) => {
            const isUrgent = item.daysUntilStockout < 7
            const daysLabel = item.daysUntilStockout > 365 ? '>1y' : `${item.daysUntilStockout} days`
            
            return (
              <div key={item.id} className="flex items-center gap-3">
                {/* Status Icon */}
                <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  isUrgent 
                    ? 'bg-[#FEE2E2] text-[#DC2626]' 
                    : 'bg-[#DCFCE7] text-[#16A34A]'
                }`}>
                  {isUrgent ? <AlertTriangle size={18} /> : <CheckCircle size={18} />}
                </div>
                
                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm font-medium text-[#0F172A] truncate">
                      {item.name}
                    </span>
                    <span className={`text-xs font-bold ${
                      isUrgent ? 'text-[#DC2626]' : 'text-[#64748B]'
                    }`}>
                      {daysLabel} left
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="h-1.5 w-full bg-[#F1F5F9] rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        isUrgent ? 'bg-[#DC2626]' : 'bg-[#16A34A]'
                      }`}
                      style={{ width: `${Math.min(100, (7 / (item.daysUntilStockout || 1)) * 100)}%` }}
                    />
                  </div>
                  
                  <p className="text-[10px] text-[#94A3B8] mt-1">
                    {item.stock} in stock • Selling ~{item.avgDailySales.toFixed(1)}/day
                  </p>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
