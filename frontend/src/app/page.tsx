import { getProducts, getSale } from './actions'
import POSDashboard from '../components/POSDashboard'
import type { CartItem } from '@/types'

export const dynamic = 'force-dynamic'

export default async function Home({ searchParams }: { searchParams: Promise<{ quoteId?: string }> }) {
  const products = await getProducts()
  const params = await searchParams

  let initialCart: CartItem[] = []
  let initialCustomer = null
  
  if (params?.quoteId) {
    const quote = await getSale(params.quoteId)
    if (quote) {
      initialCart = quote.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price, 
        name: item.product.name,
        serialNumber: item.serialNumber ?? undefined
      }))
      
      initialCustomer = {
        customerName: quote.customerName || '',
        customerPhone: quote.customerPhone || '',
        customerEmail: quote.customerEmail || '',
        customerAddress: quote.customerAddress || '',
      }
    }
  }

  // Products from API are serialized (dates are strings), types already match
  const serializedProducts = products

  return (
    <main>
      <POSDashboard products={serializedProducts} initialCart={initialCart} initialCustomer={initialCustomer} />
    </main>
  )
}
