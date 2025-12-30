// lib/api/orders.ts
import { createClient } from '@/lib/client'
import { Database } from '@/types/database.types'

type Order = Database['public']['Tables']['orders']['Row']
type OrderInsert = Database['public']['Tables']['orders']['Insert']
type OrderItem = Database['public']['Tables']['order_items']['Row']

export const ordersApi = {
    // Create new order
    async create(orderData: {
        customer_email: string
        customer_name?: string
        customer_phone?: string
        total_amount: number
        currency?: string
        shipping_address?: any
        items: Array<{
            product_id: string
            product_name: string
            product_image_url?: string
            quantity: number
            unit_price: number
            total_price: number
        }>
    }) {
        const supabase = createClient()

        // Get current user ID if logged in
        const { data: { user } } = await supabase.auth.getUser()

        // Create order
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
                user_id: user?.id || null,
                customer_email: orderData.customer_email,
                customer_name: orderData.customer_name,
                customer_phone: orderData.customer_phone,
                total_amount: orderData.total_amount,
                currency: orderData.currency || 'KES',
                shipping_address: orderData.shipping_address,
            })
            .select()
            .single()

        if (orderError) throw orderError

        // Create order items
        const orderItems = orderData.items.map(item => ({
            order_id: order.id,
            ...item,
        }))

        const { data: items, error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItems)
            .select()

        if (itemsError) throw itemsError

        return { order, items }
    },

    // Get user orders
    async getUserOrders() {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) throw new Error('User not authenticated')

        const { data, error } = await supabase
            .from('orders')
            .select(`
        *,
        order_items (*)
      `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

        if (error) throw error
        return data
    },

    // Get order by ID
    async getById(orderId: string) {
        const supabase = createClient()
        const { data, error } = await supabase
            .from('orders')
            .select(`
        *,
        order_items (*)
      `)
            .eq('id', orderId)
            .single()

        if (error) throw error
        return data
    },

    // Update order status
    async updateStatus(orderId: string, status: Order['status']) {
        const supabase = createClient()
        const { data, error } = await supabase
            .from('orders')
            .update({ status })
            .eq('id', orderId)
            .select()
            .single()

        if (error) throw error
        return data
    },
}