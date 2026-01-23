export default function DashboardTables({ 
  lowStockItems, 
  trendingItems 
}: { 
  lowStockItems: any[], 
  trendingItems: any[] 
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
      {/* Low Stock Table */}
      <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-zinc-700">
        <h3 className="text-lg font-bold mb-4 text-red-600 dark:text-red-400">Low Stock Alert</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-zinc-700 dark:text-gray-400">
              <tr>
                <th className="px-4 py-2">Product</th>
                <th className="px-4 py-2">Stock</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {lowStockItems.length === 0 ? (
                <tr><td colSpan={3} className="px-4 py-4 text-center">No low stock items</td></tr>
              ) : (
                lowStockItems.map(item => (
                  <tr key={item.id} className="border-b dark:border-zinc-700">
                    <td className="px-4 py-2 font-medium">{item.name}</td>
                    <td className="px-4 py-2">{item.stockQuantity}</td>
                    <td className="px-4 py-2">
                       <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-red-900/30 dark:text-red-300">Low</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Trending Items Table */}
      <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-zinc-700">
        <h3 className="text-lg font-bold mb-4 text-black dark:text-white">Trending Items (Last 30 Days)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-zinc-700 dark:text-gray-400">
              <tr>
                <th className="px-4 py-2">Product</th>
                <th className="px-4 py-2">Sold Qty</th>
                <th className="px-4 py-2">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {trendingItems.length === 0 ? (
                <tr><td colSpan={3} className="px-4 py-4 text-center">No sales yet</td></tr>
              ) : (
                trendingItems.map(item => (
                  <tr key={item.id} className="border-b dark:border-zinc-700">
                    <td className="px-4 py-2 font-medium">{item.name}</td>
                    <td className="px-4 py-2">{item.soldQuantity}</td>
                    <td className="px-4 py-2">${(item.soldQuantity * item.salePrice).toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
