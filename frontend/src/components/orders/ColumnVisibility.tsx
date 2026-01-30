'use client'

import { useState, useRef, useEffect } from 'react'
import { Settings2, Check } from 'lucide-react'

export interface ColumnConfig {
  id: string
  label: string
  visible: boolean
}

interface ColumnVisibilityProps {
  columns: ColumnConfig[]
  onColumnsChange: (columns: ColumnConfig[]) => void
}

export default function ColumnVisibility({ columns, onColumnsChange }: ColumnVisibilityProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleColumn = (columnId: string) => {
    const updated = columns.map((col) =>
      col.id === columnId ? { ...col, visible: !col.visible } : col
    )
    onColumnsChange(updated)
    
    // Save to localStorage
    const visibility = updated.reduce((acc, col) => ({ ...acc, [col.id]: col.visible }), {})
    localStorage.setItem('orderColumnsVisibility', JSON.stringify(visibility))
  }

  const visibleCount = columns.filter((c) => c.visible).length

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-sm font-medium text-[#475569] hover:border-[#CBD5E1] transition-all"
        title="Toggle column visibility"
      >
        <Settings2 className="w-4 h-4" />
        <span className="hidden sm:inline">Columns</span>
        <span className="text-xs bg-[#F1F5F9] px-1.5 py-0.5 rounded-full">
          {visibleCount}/{columns.length}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-[#E2E8F0] py-2 z-50">
          <div className="px-3 pb-2 mb-2 border-b border-[#E2E8F0]">
            <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
              Toggle Columns
            </span>
          </div>
          
          {columns.map((column) => (
            <button
              key={column.id}
              onClick={() => toggleColumn(column.id)}
              className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-[#F8FAFC] transition-colors"
            >
              <span className={column.visible ? 'text-[#0F172A]' : 'text-[#94A3B8]'}>
                {column.label}
              </span>
              {column.visible && <Check className="w-4 h-4 text-[#22C55E]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
