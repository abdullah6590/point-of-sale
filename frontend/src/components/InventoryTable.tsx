import type { Product } from '@/types'

type InventoryProduct = Pick<Product, 'id' | 'name' | 'category' | 'subCategory' | 'stockQuantity' | 'salePrice'>

export default function InventoryTable({ products }: { products: InventoryProduct[] }) {
  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_4px_6px_-1px_rgb(0_0_0/0.05)] overflow-hidden">
      <table className="min-w-full text-left text-sm">
        {/* Table Header */}
        <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
          <tr>
            <th className="px-6 py-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">
              Product Name
            </th>
            <th className="px-6 py-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">
              Stock Status
            </th>
            <th className="px-6 py-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider text-right">
              Price
            </th>
          </tr>
        </thead>
        
        {/* Table Body */}
        <tbody className="divide-y divide-[#F1F5F9]">
          {products.map((product) => (
            <tr 
              key={product.id} 
              className="hover:bg-[#F8FAFC] transition-colors"
            >
              {/* Product Name */}
              <td className="px-6 py-4">
                <span className="font-medium text-[#0F172A]">{product.name}</span>
              </td>
              
              {/* Category */}
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="text-[#0F172A]">{product.category}</span>
                  {product.subCategory && (
                    <span className="text-xs text-[#94A3B8] mt-0.5">
                      {product.subCategory}
                    </span>
                  )}
                </div>
              </td>
              
              {/* Stock Status - Pill Badge */}
              <td className="px-6 py-4">
                {product.stockQuantity < 5 ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FEE2E2] text-[#991B1B]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]"></span>
                    Low Stock ({product.stockQuantity})
                  </span>
                ) : product.stockQuantity < 20 ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FEF3C7] text-[#854D0E]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#CA8A04]"></span>
                    Limited ({product.stockQuantity})
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#DCFCE7] text-[#166534]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></span>
                    In Stock ({product.stockQuantity})
                  </span>
                )}
              </td>
              
              {/* Price */}
              <td className="px-6 py-4 text-right">
                <span className="font-semibold text-[#0F172A]">
                  ${product.salePrice.toFixed(2)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Empty State */}
      {products.length === 0 && (
        <div className="p-12 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#F1F5F9] flex items-center justify-center mb-4">
            <span className="text-2xl">📦</span>
          </div>
          <p className="text-[#64748B] font-medium">No products found</p>
          <p className="text-[#94A3B8] text-sm mt-1">Add your first product to get started</p>
        </div>
      )}
    </div>
  )
}
