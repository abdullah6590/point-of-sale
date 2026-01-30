import type { OrderStatus } from '@/types'

interface OrderStatusBadgeProps {
  status: OrderStatus
}

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  completed: {
    label: 'Completed',
    className: 'bg-[#DCFCE7] text-[#166534]',
  },
  pending: {
    label: 'Pending',
    className: 'bg-[#FEF3C7] text-[#854D0E]',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-[#F1F5F9] text-[#475569]',
  },
  refunded: {
    label: 'Refunded',
    className: 'bg-[#FEE2E2] text-[#991B1B]',
  },
}

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.pending
  
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${config.className}`}
    >
      {config.label}
    </span>
  )
}
