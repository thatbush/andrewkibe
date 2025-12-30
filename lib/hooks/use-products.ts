// lib/hooks/use-products.ts
'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { productsApi } from '@/lib/api/products'

export function useProducts(filters?: { category?: string; featured?: boolean }) {
    return useQuery({
        queryKey: ['products', filters],
        queryFn: () => productsApi.getAll(filters),
    })
}

export function useProduct(id: string) {
    return useQuery({
        queryKey: ['product', id],
        queryFn: () => productsApi.getById(id),
        enabled: !!id,
    })
}

export function useFeaturedProducts(limit?: number) {
    return useQuery({
        queryKey: ['products', 'featured', limit],
        queryFn: () => productsApi.getFeatured(limit),
    })
}

export function useProductsByCategory(category: string) {
    return useQuery({
        queryKey: ['products', 'category', category],
        queryFn: () => productsApi.getByCategory(category),
        enabled: !!category,
    })
}
