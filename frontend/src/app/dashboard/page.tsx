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
import DateRangePicker from '@/components/dashboard/DateRangePicker'
import CategoryPieChart from '@/components/dashboard/CategoryPieChart'
import Navigation from '@/components/Navigation'
import Link from 'next/link'
import { BarChart3, ArrowLeft, Package } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ period?: string; startDate?: string; endDate?: string }> }) {
  const params = await searchParams
  const { period, startDate, endDate } = params
  
  // Parallel Fetching with Date Params
  const [metrics, peakHours, categorySplit, stockRunRate, deadStock, lowStock] = await Promise.all([
    getFinancialMetrics(period, startDate, endDate),
    getPeakHoursData(period, startDate, endDate),
    getCategorySplitData(period, startDate, endDate),
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
          
          <Navigation />
        </header>

        {/* Date Filter */}
        <div className="mb-8">
          <DateRangePicker />
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
               <CategoryPieChart data={categorySplit} />
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
