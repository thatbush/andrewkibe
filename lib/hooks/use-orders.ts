// lib/hooks/use-orders.ts
'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ordersApi } from '@/lib/api/orders'
import { toast } from 'sonner'

export function useUserOrders() {
    return useQuery({
        queryKey: ['orders', 'user'],
        queryFn: () => ordersApi.getUserOrders(),
    })
}

export function useOrder(orderId: string) {
    return useQuery({
        queryKey: ['order', orderId],
        queryFn: () => ordersApi.getById(orderId),
        enabled: !!orderId,
    })
}

export function useCreateOrder() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ordersApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] })
            toast.success('Order created successfully!')
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to create order')
        },
    })
}
