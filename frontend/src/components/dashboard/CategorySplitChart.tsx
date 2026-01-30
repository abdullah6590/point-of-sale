'use client'

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts'
import { PieChartIcon } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

// Enterprise color palette
const COLORS = ['#2563EB', '#8B5CF6', '#16A34A', '#F59E0B', '#EC4899']

export default function CategorySplitChart({ data }: { data: { name: string; value: number }[] }) {
  const totalValue = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-[0_4px_6px_-1px_rgb(0_0_0/0.05)] h-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-[#0F172A]">Sales Split</h3>
          <p className="text-sm text-[#64748B]">Revenue by Category</p>
        </div>
        <div className="p-2.5 rounded-xl bg-[#F5F3FF]">
          <PieChartIcon className="w-5 h-5 text-[#8B5CF6]" strokeWidth={2} />
        </div>
      </div>

      {/* Chart */}
      <div className="h-[250px] w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={55}
              outerRadius={75}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                  stroke="none" 
                />
              ))}
              <Label
                position="center"
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    const { cx, cy } = viewBox
                    return (
                      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan 
                          x={cx} 
                          y={cy as number - 8} 
                          className="fill-[#94A3B8] text-xs font-medium"
                        >
                          Total
                        </tspan>
                        <tspan 
                          x={cx} 
                          y={(cy as number) + 14} 
                          className="fill-[#0F172A] text-lg font-bold"
                        >
                          {formatCurrency(totalValue)}
                        </tspan>
                      </text>
                    )
                  }
                  return null
                }}
              />
            </Pie>
            <Tooltip 
              formatter={(value: any) => [formatCurrency(Number(value)), 'Revenue']}
              contentStyle={{ 
                borderRadius: '12px', 
                border: '1px solid #E2E8F0', 
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                backgroundColor: 'white'
              }}
            />
            <Legend 
              verticalAlign="middle" 
              align="right"
              layout="vertical" 
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ 
                fontSize: '12px', 
                paddingLeft: '16px',
                color: '#475569'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
