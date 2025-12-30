// lib/api/products.ts
import { createClient } from '@/lib/client'
import { Database } from '@/types/database.types'

type Product = Database['public']['Tables']['products']['Row']
type ProductInsert = Database['public']['Tables']['products']['Insert']
type ProductUpdate = Database['public']['Tables']['products']['Update']

export const productsApi = {
    // Get all available products
    async getAll(filters?: { category?: string; featured?: boolean }) {
        const supabase = createClient()
        let query = supabase
            .from('products')
            .select('*')
            .eq('is_available', true)
            .order('created_at', { ascending: false })

        if (filters?.category) {
            query = query.eq('category', filters.category)
        }

        if (filters?.featured) {
            query = query.eq('featured', true)
        }

        const { data, error } = await query

        if (error) throw error
        return data as Product[]
    },

    // Get single product
    async getById(id: string) {
        const supabase = createClient()
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single()

        if (error) throw error
        return data as Product
    },

    // Get featured products
    async getFeatured(limit: number = 4) {
        const supabase = createClient()
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('is_available', true)
            .eq('featured', true)
            .limit(limit)

        if (error) throw error
        return data as Product[]
    },

    // Get products by category
    async getByCategory(category: string) {
        const supabase = createClient()
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('is_available', true)
            .eq('category', category)
            .order('created_at', { ascending: false })

        if (error) throw error
        return data as Product[]
    },

    // Search products
    async search(query: string) {
        const supabase = createClient()
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('is_available', true)
            .or(`name.ilike.%${query}%,description.ilike.%${query}%`)

        if (error) throw error
        return data as Product[]
    },
}
