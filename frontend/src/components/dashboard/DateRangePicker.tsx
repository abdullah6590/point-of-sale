'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Calendar, X } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function DateRangePicker() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const currentPeriod = searchParams.get('period')
  const startDateParam = searchParams.get('startDate')
  const endDateParam = searchParams.get('endDate')

  // Local state for custom inputs
  const [customStart, setCustomStart] = useState('')
  const [customEnd, setCustomEnd] = useState('')

  useEffect(() => {
    if (startDateParam) setCustomStart(startDateParam)
    if (endDateParam) setCustomEnd(endDateParam)
  }, [startDateParam, endDateParam])

  const handlePeriodChange = (period: string) => {
    router.push(`/dashboard?period=${period}`)
    setCustomStart('')
    setCustomEnd('')
  }

  const handleCustomDateApply = () => {
    if (customStart && customEnd) {
      router.push(`/dashboard?startDate=${customStart}&endDate=${customEnd}`)
    }
  }

  const clearCustomDates = () => {
    setCustomStart('')
    setCustomEnd('')
    router.push('/dashboard?period=this-month')
  }

  const periods = [
    { id: 'this-month', label: 'This Month' },
    { id: 'last-month', label: 'Last Month' },
    { id: 'all-time', label: 'All Time' }
  ]

  const isCustomActive = !!startDateParam && !!endDateParam

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-2 rounded-xl border border-[#E2E8F0] shadow-sm">
      
      {/* Preset Periods */}
      <div className="flex items-center gap-1 bg-[#F8FAFC] p-1 rounded-lg">
        <div className="px-2 text-[#94A3B8]">
          <Calendar className="w-4 h-4" />
        </div>
        {periods.map((period) => (
          <button
            key={period.id}
            onClick={() => handlePeriodChange(period.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
              !isCustomActive && (currentPeriod === period.id || (!currentPeriod && period.id === 'this-month'))
                ? 'bg-white text-[#0F172A] shadow-sm ring-1 ring-[#E2E8F0]'
                : 'text-[#64748B] hover:text-[#0F172A] hover:bg-white/50'
            }`}
          >
            {period.label}
          </button>
        ))}
      </div>

      <div className="h-4 w-[1px] bg-[#E2E8F0] hidden sm:block" />

      {/* Custom Date Range */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
           <input 
             type="date"
             value={customStart}
             onChange={(e) => setCustomStart(e.target.value)}
             className="px-2 py-1.5 text-xs border border-[#E2E8F0] rounded-md text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
           />
           <span className="text-[#94A3B8] text-xs">to</span>
           <input 
             type="date"
             value={customEnd}
             onChange={(e) => setCustomEnd(e.target.value)}
             className="px-2 py-1.5 text-xs border border-[#E2E8F0] rounded-md text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
           />
        </div>
        
        {isCustomActive ? (
          <button
            onClick={clearCustomDates}
            className="p-1.5 text-[#64748B] hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title="Clear custom range"
          >
            <X className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleCustomDateApply}
            disabled={!customStart || !customEnd}
            className="px-3 py-1.5 text-xs font-medium bg-[#0F172A] text-white rounded-md hover:bg-[#1E293B] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Apply
          </button>
        )}
      </div>
    </div>
  )
}
