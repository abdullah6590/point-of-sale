'use client'

import { Search, X } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

interface SearchBarProps {
  onSearch: (query: string) => void
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // Debounce logic
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(value)
    }, 300)

    return () => {
      clearTimeout(handler)
    }
  }, [value, onSearch])

  // Auto-focus when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleClose = () => {
    setIsOpen(false)
    setValue('') // clear input visually
    onSearch('') // fetch all products again
  }

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="p-3 rounded-lg bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] hover:border-[#0F172A] hover:shadow-md transition-all duration-200"
        aria-label="Search products"
      >
        <Search className="w-5 h-5" />
      </button>
    )
  }

  return (
    <div className="relative w-full md:w-64 animate-in fade-in zoom-in-95 duration-200">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="w-5 h-5 text-[#94A3B8]" />
      </div>
      <input
        ref={inputRef}
        type="text"
        className="block w-full p-3 pl-10 pr-10 text-sm text-[#0F172A] border border-[#2563EB] rounded-lg bg-white outline-none shadow-lg ring-4 ring-[#2563EB]/10 transition-all placeholder-[#94A3B8]"
        placeholder="Search products..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') handleClose()
        }}
      />
      <button 
        onClick={handleClose}
        className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#94A3B8] hover:text-[#DC2626] transition-colors"
        aria-label="Close search"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
