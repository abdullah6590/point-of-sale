import { 
  getFinancialMetrics, 
  getPeakHoursData, 
  getCategorySplitData, 
  getStockRunRateData, 
  getDeadStockData,
  getLowStockItems
} from '@/app/analytics'
import DashboardMetrics from '@/components/DashboardMetrics'
import PeakHoursChart from '@/components/dashboard/PeakHoursChart'
import StockRunRateWidget from '@/components/dashboard/StockRunRateWidget'
import DeadStockWidget from '@/components/dashboard/DeadStockWidget'
import LowStockWidget from '@/components/dashboard/LowStockWidget'
import DateFilter from '@/components/DateFilter'
import Link from 'next/link'
import { BarChart3, ArrowLeft, Package } from 'lucide-react'
import CategoryTreemap from '@/components/dashboard/CategoryTreemap'

export const dynamic = 'force-dynamic'

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ period?: string }> }) {
  const params = await searchParams
  const period = params.period || 'this-month'
  
  // Parallel Fetching
  const [metrics, peakHours, categorySplit, stockRunRate, deadStock, lowStock] = await Promise.all([
    getFinancialMetrics(period),
    getPeakHoursData(),
    getCategorySplitData(),
    getStockRunRateData(),
    getDeadStockData(),
    getLowStockItems()
  ])

  return (
    <main className="min-h-screen p-6 lg:p-8 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-[#EFF6FF]">
              <BarChart3 className="w-7 h-7 text-[#2563EB]" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#0F172A]">
                Mission Control
              </h1>
              <p className="text-[#64748B] mt-0.5">
                Real-time business intelligence
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#F1F5F9] text-[#475569] font-medium rounded-lg hover:bg-[#E2E8F0] hover:text-[#0F172A] transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Open Terminal
            </Link>
            <Link 
              href="/inventory" 
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0F172A] text-white font-semibold rounded-lg shadow-[0_4px_6px_-1px_rgb(0_0_0/0.2)] hover:bg-[#1E293B] hover:shadow-[0_10px_15px_-3px_rgb(0_0_0/0.2)] transition-all duration-200"
            >
              <Package className="w-4 h-4" />
              Inventory
            </Link>
          </div>
        </header>

        {/* Date Filter */}
        <div className="mb-8">
          <DateFilter />
        </div>
        
        {/* Dashboard Grid */}
        <div className="space-y-6">
          
          {/* Key Metrics Row */}
          <section>
            <DashboardMetrics metrics={metrics} />
          </section>

          {/* Charts Row */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-[350px]">
              <PeakHoursChart data={peakHours} />
            </div>
            <div className="lg:col-span-1 h-[350px]">
              <CategoryTreemap data={categorySplit} />
            </div>
          </section>

          {/* Inventory Intelligence Row */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="h-[400px]">
              <LowStockWidget data={lowStock} />
            </div>
            <div className="h-[400px]">
              <StockRunRateWidget data={stockRunRate} />
            </div>
            <div className="h-[400px]">
              <DeadStockWidget data={deadStock} />
            </div>
          </section>

        </div>
      </div>
    </main>
  )
}
