// lib/api/featured-content.ts
import { createClient } from '@/lib/client'
import { Database } from '@/types/database.types'

type FeaturedContent = Database['public']['Tables']['featured_content']['Row']

export const featuredContentApi = {
    // Get all active featured content
    async getAll() {
        const supabase = createClient()
        const { data, error } = await supabase
            .from('featured_content')
            .select('*')
            .eq('is_active', true)
            .order('display_order', { ascending: true })

        if (error) throw error
        return data as FeaturedContent[]
    },

    // Get by tab name
    async getByTab(tabName: string) {
        const supabase = createClient()
        const { data, error } = await supabase
            .from('featured_content')
            .select('*')
            .eq('is_active', true)
            .eq('tab_name', tabName)
            .single()

        if (error) throw error
        return data as FeaturedContent
    },
}
