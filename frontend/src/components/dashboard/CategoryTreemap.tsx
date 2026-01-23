'use client'

import { ResponsiveContainer, Treemap, Tooltip } from 'recharts'
import { LayoutGrid } from 'lucide-react'
import { useState, useEffect } from 'react'

const CustomizedContent = (props: any) => {
  const { root, depth, x, y, width, height, index, payload, colors, name, value } = props;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: depth < 2 ? 'none' : colors[index % colors.length] || '#eee', // Fallback color
          stroke: '#fff',
          strokeWidth: 2,
          strokeOpacity: 1,
        }}
      />
      {depth === 2 && width > 40 && height > 30 && (
        <text
          x={x + width / 2}
          y={y + height / 2 + 7}
          textAnchor="middle"
          fill="#fff"
          fontSize={11}
          fontWeight={600}
          className="pointer-events-none"
        >
          {name.length > 10 && width < 80 ? name.substring(0, 8) + '..' : name}
        </text>
      )}
      {depth === 2 && width > 40 && height > 50 && (
         <text
           x={x + width / 2}
           y={y + height / 2 + 24}
           textAnchor="middle"
           fill="rgba(255,255,255,0.9)"
           fontSize={10}
           className="pointer-events-none"
         >
           ${value?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
         </text>
      )}
    </g>
  );
};

const COLORS = ['#2563EB', '#8B5CF6', '#16A34A', '#F59E0B', '#EC4899', '#6366F1'];

interface CategoryTreemapProps {
  data: Array<{ name: string; children: Array<{ name: string; size: number }> }>;
}

export default function CategoryTreemap({ data }: CategoryTreemapProps) {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] h-full animate-pulse" />

  // Safe default
  if (!data || !Array.isArray(data)) {
    return (
      <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] h-full flex items-center justify-center text-[#94A3B8]">
        No data available
      </div>
    );
  }

  const treeData = [
    {
      name: 'All Sales',
      children: data
    }
  ];

  return (
    <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-[0_4px_6px_-1px_rgb(0_0_0/0.05)] h-full flex flex-col">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="text-lg font-bold text-[#0F172A]">Category Performance</h3>
          <p className="text-sm text-[#64748B]">Product breakdown by revenue</p>
        </div>
        <div className="p-2.5 rounded-xl bg-[#F5F3FF]">
          <LayoutGrid className="w-5 h-5 text-[#8B5CF6]" strokeWidth={2} />
        </div>
      </div>

      <div className="flex-1 w-full min-h-0">
        {data.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-[#94A3B8]">
             <p>No sales data yet</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <Treemap
              data={treeData}
              dataKey="size"
              aspectRatio={4 / 3}
              stroke="#fff"
              content={<CustomizedContent colors={COLORS} />}
            >
              <Tooltip 
                 content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const node = payload[0].payload;
                    // Check if node is a leaf (Product)
                    // Recharts structures payloads differently depending on version/nesting
                    // Usually for Treemap: payload[0].payload is the node data
                    if (!node || !node.value) return null;

                    return (
                      <div className="bg-white p-3 rounded-xl border border-[#E2E8F0] shadow-xl z-50">
                        <p className="text-sm font-bold text-[#0F172A] mb-1">{node.name}</p>
                        <p className="text-lg font-extrabold text-[#0F172A]">
                          ${node.value.toLocaleString()}
                        </p>
                        <p className="text-xs text-[#16A34A] font-medium mt-1">Revenue</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </Treemap>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
