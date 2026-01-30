'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ShoppingCart, FileText, History, LayoutDashboard, Package } from 'lucide-react'

export default function Navigation() {
  const pathname = usePathname()

  const tabs = [
    { href: '/', label: 'New Order', icon: ShoppingCart, matcher: (path: string) => path === '/' || path.startsWith('/?quoteId') },
    { href: '/quotations', label: 'Quotations', icon: FileText, matcher: (path: string) => path.startsWith('/quotations') },
    { href: '/orders', label: 'Order History', icon: History, matcher: (path: string) => path.startsWith('/orders') },
    { href: '/dashboard', label: 'Analytics', icon: LayoutDashboard, matcher: (path: string) => path.startsWith('/dashboard') },
    { href: '/inventory', label: 'Inventory', icon: Package, matcher: (path: string) => path.startsWith('/inventory') },
  ]

  return (
    <nav className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {tabs.map((tab) => {
        const isActive = tab.matcher ? tab.matcher(pathname) : pathname === tab.href
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap",
              isActive 
                ? "bg-[#2563EB] text-white shadow-sm" 
                : "bg-white border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
            )}
          >
            <tab.icon className={cn("w-4 h-4", isActive ? "text-white" : "text-[#94A3B8]")} />
            {tab.label}
          </Link>
        )
      })}
    </nav>
  )
}
