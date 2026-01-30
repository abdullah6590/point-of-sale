'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, Calendar, Filter, ChevronDown, X } from 'lucide-react'
import type { OrderFilters, OrderStatus, DateRangePreset } from '@/types'
import { format, subDays, startOfDay, endOfDay } from 'date-fns'

interface OrderFiltersBarProps {
  filters: OrderFilters
  onFiltersChange: (filters: OrderFilters) => void
}

const statusOptions: { value: OrderStatus; label: string }[] = [
  { value: 'completed', label: 'Completed' },
  { value: 'pending', label: 'Pending' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'refunded', label: 'Refunded' },
]

const datePresets: { value: DateRangePreset; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: 'last7days', label: 'Last 7 Days' },
  { value: 'last30days', label: 'Last 30 Days' },
]

export default function OrderFiltersBar({ filters, onFiltersChange }: OrderFiltersBarProps) {
  const [isStatusOpen, setIsStatusOpen] = useState(false)
  const [isDateOpen, setIsDateOpen] = useState(false)
  const [searchValue, setSearchValue] = useState(filters.search || '')
  const [selectedPreset, setSelectedPreset] = useState<DateRangePreset | null>(null)
  
  const statusRef = useRef<HTMLDivElement>(null)
  const dateRef = useRef<HTMLDivElement>(null)

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (statusRef.current && !statusRef.current.contains(event.target as Node)) {
        setIsStatusOpen(false)
      }
      if (dateRef.current && !dateRef.current.contains(event.target as Node)) {
        setIsDateOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== filters.search) {
        onFiltersChange({ ...filters, search: searchValue || undefined })
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [searchValue])

  const handleStatusChange = (status: OrderStatus | undefined) => {
    onFiltersChange({ ...filters, status })
    setIsStatusOpen(false)
  }

  const handleDatePresetChange = (preset: DateRangePreset) => {
    const today = new Date()
    let startDate: string | undefined
    let endDate: string | undefined

    switch (preset) {
      case 'today':
        startDate = format(startOfDay(today), 'yyyy-MM-dd')
        endDate = format(endOfDay(today), 'yyyy-MM-dd')
        break
      case 'last7days':
        startDate = format(subDays(today, 7), 'yyyy-MM-dd')
        endDate = format(today, 'yyyy-MM-dd')
        break
      case 'last30days':
        startDate = format(subDays(today, 30), 'yyyy-MM-dd')
        endDate = format(today, 'yyyy-MM-dd')
        break
    }

    setSelectedPreset(preset)
    onFiltersChange({ ...filters, startDate, endDate })
    setIsDateOpen(false)
  }

  const clearDateFilter = () => {
    setSelectedPreset(null)
    onFiltersChange({ ...filters, startDate: undefined, endDate: undefined })
  }

  const clearAllFilters = () => {
    setSearchValue('')
    setSelectedPreset(null)
    onFiltersChange({})
  }

  const hasFilters = filters.search || filters.status || filters.startDate

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
        <input
          type="text"
          placeholder="Search by Order ID or Customer..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-[#F1F5F9] border border-transparent rounded-lg text-sm text-[#0F172A] placeholder-[#94A3B8] focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#DBEAFE] outline-none transition-all"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {/* Date Range Filter */}
        <div className="relative" ref={dateRef}>
          <button
            onClick={() => setIsDateOpen(!isDateOpen)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${
              selectedPreset
                ? 'bg-[#EFF6FF] border-[#3B82F6] text-[#2563EB]'
                : 'bg-white border-[#E2E8F0] text-[#475569] hover:border-[#CBD5E1]'
            }`}
          >
            <Calendar className="w-4 h-4" />
            {selectedPreset
              ? datePresets.find((p) => p.value === selectedPreset)?.label
              : 'Date Range'}
            <ChevronDown className="w-4 h-4" />
          </button>

          {isDateOpen && (
            <div className="absolute left-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-[#E2E8F0] py-1 z-50">
              {datePresets.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => handleDatePresetChange(preset.value)}
                  className={`w-full px-4 py-2.5 text-left text-sm hover:bg-[#F8FAFC] transition-colors ${
                    selectedPreset === preset.value
                      ? 'text-[#2563EB] bg-[#EFF6FF]'
                      : 'text-[#0F172A]'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
              {selectedPreset && (
                <>
                  <div className="border-t border-[#E2E8F0] my-1" />
                  <button
                    onClick={clearDateFilter}
                    className="w-full px-4 py-2.5 text-left text-sm text-[#DC2626] hover:bg-[#FEF2F2] transition-colors"
                  >
                    Clear Date Filter
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Status Filter */}
        <div className="relative" ref={statusRef}>
          <button
            onClick={() => setIsStatusOpen(!isStatusOpen)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${
              filters.status
                ? 'bg-[#EFF6FF] border-[#3B82F6] text-[#2563EB]'
                : 'bg-white border-[#E2E8F0] text-[#475569] hover:border-[#CBD5E1]'
            }`}
          >
            <Filter className="w-4 h-4" />
            {filters.status
              ? statusOptions.find((s) => s.value === filters.status)?.label
              : 'Status'}
            <ChevronDown className="w-4 h-4" />
          </button>

          {isStatusOpen && (
            <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-[#E2E8F0] py-1 z-50">
              <button
                onClick={() => handleStatusChange(undefined)}
                className={`w-full px-4 py-2.5 text-left text-sm hover:bg-[#F8FAFC] transition-colors ${
                  !filters.status ? 'text-[#2563EB] bg-[#EFF6FF]' : 'text-[#0F172A]'
                }`}
              >
                All Statuses
              </button>
              {statusOptions.map((status) => (
                <button
                  key={status.value}
                  onClick={() => handleStatusChange(status.value)}
                  className={`w-full px-4 py-2.5 text-left text-sm hover:bg-[#F8FAFC] transition-colors ${
                    filters.status === status.value
                      ? 'text-[#2563EB] bg-[#EFF6FF]'
                      : 'text-[#0F172A]'
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Clear All Filters */}
        {hasFilters && (
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-1 px-3 py-2.5 text-sm font-medium text-[#DC2626] hover:text-[#B91C1C] transition-colors"
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>
    </div>
  )
}
