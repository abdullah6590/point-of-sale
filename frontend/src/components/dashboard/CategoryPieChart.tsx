'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { formatCurrency } from '@/lib/utils'

interface CategoryData {
  name: string
  value: number
  [key: string]: any
}

interface CategoryPieChartProps {
  data: CategoryData[]
}

const COLORS = ['#2563EB', '#16A34A', '#F59E0B', '#F97316', '#DC2626', '#9333EA', '#0F172A']

export default function CategoryPieChart({ data }: CategoryPieChartProps) {
  // Process data: Top 5 + Others
  const processedData = (() => {
    if (!data || data.length === 0) return []
    const sorted = [...data].sort((a, b) => b.value - a.value)
    if (sorted.length <= 5) return sorted
    
    const top5 = sorted.slice(0, 5)
    const others = sorted.slice(5).reduce((sum, item) => sum + item.value, 0)
    
    return [
      ...top5,
      { name: 'Others', value: others }
    ]
  })()



  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const total = processedData.reduce((sum, item) => sum + item.value, 0)
      const percent = ((data.value / total) * 100).toFixed(1)

      return (
        <div className="bg-white p-3 border border-[#E2E8F0] shadow-lg rounded-lg">
          <p className="font-semibold text-[#0F172A] mb-1">{data.name}</p>
          <div className="space-y-1 text-xs">
            <p className="text-[#64748B]">Revenue: <span className="font-medium text-[#0F172A]">{formatCurrency(data.value)}</span></p>
            <p className="text-[#64748B]">Share: <span className="font-medium text-[#0F172A]">{percent}%</span></p>
          </div>
        </div>
      )
    }
    return null
  }

  if (processedData.length === 0) {
     return (
        <div className="w-full h-full flex items-center justify-center text-[#94A3B8] text-sm">
           No category data available
        </div>
     )
  }

  return (
    <div className="w-full h-full bg-white rounded-xl border border-[#E2E8F0] shadow-[0_4px_6px_-1px_rgb(0_0_0/0.05)] p-4">
      <h3 className="text-sm font-semibold text-[#0F172A] mb-4">Category Performance</h3>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={processedData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {processedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
               verticalAlign="bottom" 
               height={36}
               iconType="circle"
               iconSize={8}
               wrapperStyle={{ fontSize: '12px', color: '#64748B' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
