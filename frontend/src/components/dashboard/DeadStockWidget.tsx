'use client'

import { Ghost, Tag, PartyPopper } from 'lucide-react'

type Product = {
  id: string
  name: string
  stockQuantity: number
  salePrice: number
}

export default function DeadStockWidget({ data }: { data: Product[] }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-[0_4px_6px_-1px_rgb(0_0_0/0.05)] h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-lg font-bold text-[#0F172A]">Graveyard</h3>
          <p className="text-sm text-[#64748B]">Zero sales in 60+ days</p>
        </div>
        <div className="p-2.5 rounded-xl bg-[#F1F5F9]">
          <Ghost className="w-5 h-5 text-[#64748B]" strokeWidth={2} />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-12 h-12 rounded-full bg-[#DCFCE7] flex items-center justify-center mb-3">
              <PartyPopper className="w-6 h-6 text-[#16A34A]" />
            </div>
            <p className="text-[#16A34A] font-medium text-sm">No dead stock found</p>
            <p className="text-[#94A3B8] text-xs mt-1">Great job keeping inventory moving!</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {data.map((item) => (
              <li 
                key={item.id} 
                className="flex items-center justify-between p-3 rounded-lg hover:bg-[#F8FAFC] transition-colors border border-transparent hover:border-[#E2E8F0] group"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[#475569] truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-[#94A3B8] mt-0.5">
                    {item.stockQuantity} units • ${item.salePrice.toFixed(2)}
                  </p>
                </div>
                
                <button className="shrink-0 ml-3 opacity-0 group-hover:opacity-100 flex items-center gap-1.5 text-xs font-semibold bg-[#0F172A] text-white px-3 py-1.5 rounded-lg transition-all hover:bg-[#1E293B]">
                  <Tag size={12} />
                  Discount
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {/* Footer */}
      {data.length > 0 && (
        <div className="mt-4 pt-4 border-t border-[#F1F5F9]">
          <button className="w-full py-2.5 text-sm font-medium text-[#64748B] hover:text-[#0F172A] bg-[#F8FAFC] hover:bg-[#F1F5F9] rounded-lg transition-colors">
            View All Dead Stock
          </button>
        </div>
      )}
    </div>
  )
}
