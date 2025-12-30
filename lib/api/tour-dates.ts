// lib/api/tour-dates.ts
import { createClient } from '@/lib/client'
import { Database } from '@/types/database.types'

type TourDate = Database['public']['Tables']['tour_dates']['Row']

export const tourDatesApi = {
    // Get all upcoming tour dates
    async getUpcoming() {
        const supabase = createClient()
        const { data, error } = await supabase
            .from('tour_dates')
            .select('*')
            .gte('event_date', new Date().toISOString().split('T')[0])
            .order('event_date', { ascending: true })

        if (error) throw error
        return data as TourDate[]
    },

    // Get tour dates by status
    async getByStatus(status: 'available' | 'selling-fast' | 'sold-out') {
        const supabase = createClient()
        const { data, error } = await supabase
            .from('tour_dates')
            .select('*')
            .eq('status', status)
            .gte('event_date', new Date().toISOString().split('T')[0])
            .order('event_date', { ascending: true })

        if (error) throw error
        return data as TourDate[]
    },

    // Get tour date by ID
    async getById(id: string) {
        const supabase = createClient()
        const { data, error } = await supabase
            .from('tour_dates')
            .select('*')
            .eq('id', id)
            .single()

        if (error) throw error
        return data as TourDate
    },

    // Get tour dates by city
    async getByCity(city: string) {
        const supabase = createClient()
        const { data, error } = await supabase
            .from('tour_dates')
            .select('*')
            .ilike('city', `%${city}%`)
            .gte('event_date', new Date().toISOString().split('T')[0])
            .order('event_date', { ascending: true })

        if (error) throw error
        return data as TourDate[]
    },

    // Check ticket availability
    async checkAvailability(id: string) {
        const supabase = createClient()
        const { data, error } = await supabase
            .from('tour_dates')
            .select('total_tickets, tickets_sold, status')
            .eq('id', id)
            .single()

        if (error) throw error

        return {
            available: data.total_tickets - data.tickets_sold,
            total: data.total_tickets,
            sold: data.tickets_sold,
            status: data.status,
        }
    },
}
