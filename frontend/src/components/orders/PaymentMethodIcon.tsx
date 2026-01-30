import { Banknote, CreditCard, Smartphone } from 'lucide-react'
import type { PaymentMethod } from '@/types'

interface PaymentMethodIconProps {
  method: PaymentMethod
  showLabel?: boolean
}

const methodConfig: Record<PaymentMethod, { icon: typeof Banknote; label: string }> = {
  cash: {
    icon: Banknote,
    label: 'Cash',
  },
  credit_card: {
    icon: CreditCard,
    label: 'Card',
  },
  wallet: {
    icon: Smartphone,
    label: 'Online',
  },
}

export default function PaymentMethodIcon({ method, showLabel = true }: PaymentMethodIconProps) {
  const config = methodConfig[method] || methodConfig.cash
  const Icon = config.icon
  
  return (
    <div className="flex items-center gap-2 text-[#475569]">
      <Icon className="w-4 h-4" />
      {showLabel && <span className="text-sm">{config.label}</span>}
    </div>
  )
}
