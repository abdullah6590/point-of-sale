import { User } from 'lucide-react'
import type { OrderCustomer } from '@/types'

interface CustomerCellProps {
  customer: OrderCustomer | null
}

export default function CustomerCell({ customer }: CustomerCellProps) {
  const name = customer?.name || 'Guest'
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="flex items-center gap-3">
      {/* Avatar */}
      {customer?.avatar ? (
        <img
          src={customer.avatar}
          alt={name}
          className="w-8 h-8 rounded-full object-cover"
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-[#EFF6FF] text-[#3B82F6] flex items-center justify-center text-xs font-semibold">
          {customer ? initials : <User className="w-4 h-4" />}
        </div>
      )}
      
      {/* Name */}
      <span className={`text-sm font-medium ${customer ? 'text-[#0F172A]' : 'text-[#94A3B8]'}`}>
        {name}
      </span>
    </div>
  )
}
