'use client'

import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts'
import { formatCurrency } from '@/lib/utils'

export default function RevenueTrendChart({ data }: { data: { date: string; revenue: number; profit: number; retail: number }[] }) {
  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-zinc-800 h-full">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Revenue Analysis</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Retail Value vs Actual Revenue vs Profit (Last 7 Days)</p>
      </div>
      
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorRetail" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.5} />
            <XAxis 
              dataKey="date" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              tick={{ fill: '#9CA3AF' }}
              dy={10}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              formatter={(value: any) => [formatCurrency(Number(value)), '']}
            />
            <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
            
            <Area 
              type="monotone" 
              dataKey="retail" 
              name="Retail Value (MSRP)" 
              stroke="#8b5cf6" 
              fillOpacity={1} 
              fill="url(#colorRetail)" 
              strokeWidth={2}
            />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              name="Actual Revenue" 
              stroke="#3b82f6" 
              fillOpacity={1} 
              fill="url(#colorRevenue)" 
              strokeWidth={2}
            />
            <Area 
              type="monotone" 
              dataKey="profit" 
              name="Net Profit" 
              stroke="#10b981" 
              fillOpacity={1} 
              fill="url(#colorProfit)" 
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
