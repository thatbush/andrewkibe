// lib/api/livestreams.ts
import { createClient } from '@/lib/client'
import { Database } from '@/types/database.types'

type Livestream = Database['public']['Tables']['livestreams']['Row']

export const livestreamsApi = {
    // Get all livestreams
    async getAll(status?: 'scheduled' | 'live' | 'replay' | 'archived') {
        const supabase = createClient()
        let query = supabase
            .from('livestreams')
            .select('*')
            .order('scheduled_at', { ascending: false })

        if (status) {
            query = query.eq('status', status)
        }

        const { data, error } = await query

        if (error) throw error
        return data as Livestream[]
    },

    // Get current live stream
    async getCurrentLive() {
        const supabase = createClient()
        const { data, error } = await supabase
            .from('livestreams')
            .select('*')
            .eq('status', 'live')
            .order('started_at', { ascending: false })
            .limit(1)
            .maybeSingle()

        if (error) throw error
        return data as Livestream | null
    },

    // Get recent replays
    async getReplays(limit: number = 3) {
        const supabase = createClient()
        const { data, error } = await supabase
            .from('livestreams')
            .select('*')
            .eq('status', 'replay')
            .order('ended_at', { ascending: false })
            .limit(limit)

        if (error) throw error
        return data as Livestream[]
    },

    // Get single livestream
    async getById(id: string) {
        const supabase = createClient()
        const { data, error } = await supabase
            .from('livestreams')
            .select('*')
            .eq('id', id)
            .single()

        if (error) throw error
        return data as Livestream
    },

    // Increment view count
    async incrementViewCount(id: string) {
        const supabase = createClient()
        const { data, error } = await supabase.rpc('increment_view_count', {
            livestream_id: id
        })

        if (error) throw error
        return data
    },

    // Track view
    async trackView(livestreamId: string, userId?: string) {
        const supabase = createClient()
        const { data, error } = await supabase
            .from('content_views')
            .insert({
                content_type: 'livestream',
                content_id: livestreamId,
                user_id: userId || null,
            })

        if (error) throw error
        return data
    },
}

