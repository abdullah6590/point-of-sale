'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Clock } from 'lucide-react'

export default function PeakHoursChart({ data }: { data: { hour: string; sales: number }[] }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-[0_4px_6px_-1px_rgb(0_0_0/0.05)] h-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-[#0F172A]">Peak Hours</h3>
          <p className="text-sm text-[#64748B]">Activity by hour (Last 7 Days)</p>
        </div>
        <div className="p-2.5 rounded-xl bg-[#EFF6FF]">
          <Clock className="w-5 h-5 text-[#2563EB]" strokeWidth={2} />
        </div>
      </div>
      
      {/* Chart */}
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
            <XAxis 
              dataKey="hour" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false} 
              interval={2}
              tick={{ fill: '#94A3B8' }}
            />
            <YAxis
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#94A3B8' }}
            />
            <Tooltip 
              cursor={{ fill: '#F8FAFC' }}
              contentStyle={{ 
                borderRadius: '12px', 
                border: '1px solid #E2E8F0', 
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                backgroundColor: 'white'
              }}
              labelStyle={{ color: '#0F172A', fontWeight: 600 }}
            />
            <Bar dataKey="sales" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill="url(#peakGradient)" />
              ))}
            </Bar>
            <defs>
              <linearGradient id="peakGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563EB" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.6} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
