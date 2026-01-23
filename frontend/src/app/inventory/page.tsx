import { getProducts } from '@/app/actions'
import AddProductForm from '@/components/AddProductForm'
import InventoryTable from '@/components/InventoryTable'
import Link from 'next/link'
import { Package, ArrowLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function InventoryPage() {
  const products = await getProducts()

  return (
    <main className="min-h-screen p-6 lg:p-8 bg-[#F8FAFC]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-[#F5F3FF]">
              <Package className="w-7 h-7 text-[#8B5CF6]" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-[#0F172A]">
                Inventory Management
              </h1>
              <p className="text-[#64748B] mt-0.5">
                {products.length} products in stock
              </p>
            </div>
          </div>
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#F1F5F9] text-[#475569] font-medium rounded-lg hover:bg-[#E2E8F0] hover:text-[#0F172A] transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to POS
          </Link>
        </header>
        
        {/* Add Product Form */}
        <AddProductForm />
        
        {/* Inventory Table */}
        <div className="mt-8">
          <InventoryTable products={products} />
        </div>
      </div>
    </main>
  )
}
