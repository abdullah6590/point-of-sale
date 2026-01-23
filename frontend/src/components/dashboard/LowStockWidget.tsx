'use client'

import { AlertOctagon, ArrowRight } from 'lucide-react'
import Link from 'next/link'

type Product = {
  id: string
  name: string
  stockQuantity: number
  sku: string
}

export default function LowStockWidget({ data }: { data: Product[] }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-[0_4px_6px_-1px_rgb(0_0_0/0.05)] h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-lg font-bold text-[#0F172A]">Low Stock</h3>
          <p className="text-sm text-[#64748B]">Restock needed immediately</p>
        </div>
        <div className="p-2.5 rounded-xl bg-[#FEE2E2]">
          <AlertOctagon className="w-5 h-5 text-[#DC2626]" strokeWidth={2} />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-12 h-12 rounded-full bg-[#DCFCE7] flex items-center justify-center mb-3">
              <span className="text-xl">✓</span>
            </div>
            <p className="text-[#16A34A] font-medium text-sm">All stock levels healthy</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {data.map((item) => (
              <li 
                key={item.id} 
                className="flex items-center justify-between p-3 rounded-lg hover:bg-[#F8FAFC] transition-colors border border-transparent hover:border-[#E2E8F0]"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[#0F172A] truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-[#94A3B8] font-mono mt-0.5">
                    {item.sku}
                  </p>
                </div>
                
                <span className="shrink-0 ml-3 px-2.5 py-1 rounded-full bg-[#FEE2E2] text-[#DC2626] text-xs font-bold">
                  {item.stockQuantity} left
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-[#F1F5F9]">
        <Link 
          href="/inventory" 
          className="flex items-center justify-between w-full p-2 text-sm font-medium text-[#64748B] hover:text-[#2563EB] transition-colors group"
        >
          <span>Manage Inventory</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  )
}
