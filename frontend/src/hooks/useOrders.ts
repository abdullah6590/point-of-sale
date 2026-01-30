'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getOrders, getOrderById, updateOrderStatus } from '@/app/actions'
import type { Order, OrderFilters, OrderStatus } from '@/types'

/**
 * Hook to fetch orders with optional filters
 */
export function useOrders(filters?: OrderFilters) {
  return useQuery({
    queryKey: ['orders', filters],
    queryFn: () => getOrders(filters),
    staleTime: 30 * 1000, // 30 seconds
  })
}

/**
 * Hook to fetch a single order by ID
 */
export function useOrder(id: string | null) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => (id ? getOrderById(id) : null),
    enabled: !!id,
    staleTime: 60 * 1000, // 1 minute
  })
}

/**
 * Hook to update order status (refunds, cancellations)
 */
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      updateOrderStatus(id, status),
    onSuccess: (updatedOrder) => {
      // Invalidate orders list
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      // Update the specific order in cache
      queryClient.setQueryData(['order', updatedOrder.id], updatedOrder)
    },
  })
}
