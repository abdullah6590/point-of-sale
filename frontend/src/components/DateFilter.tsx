'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Calendar } from 'lucide-react'

export default function DateFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentPeriod = searchParams.get('period') || 'this-month'

  const handleChange = (period: string) => {
    router.push(`/dashboard?period=${period}`)
  }

  const periods = [
    { id: 'this-month', label: 'This Month' },
    { id: 'last-month', label: 'Last Month' },
    { id: 'all-time', label: 'All Time' }
  ]

  return (
    <div className="inline-flex items-center gap-3 bg-white p-1.5 rounded-xl border border-[#E2E8F0] shadow-[0_2px_4px_rgb(0_0_0/0.05)]">
      <div className="pl-2 text-[#94A3B8]">
        <Calendar className="w-4 h-4" />
      </div>
      <div className="flex gap-1">
        {periods.map((period) => (
          <button
            key={period.id}
            onClick={() => handleChange(period.id)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              currentPeriod === period.id
                ? 'bg-[#0F172A] text-white shadow-sm'
                : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
            }`}
          >
            {period.label}
          </button>
        ))}
      </div>
    </div>
  )
}
