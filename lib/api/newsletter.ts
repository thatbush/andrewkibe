// lib/api/newsletter.ts
import { createClient } from '@/lib/client'
import { Database } from '@/types/database.types'

type NewsletterSubscription = Database['public']['Tables']['newsletter_subscriptions']['Row']

export const newsletterApi = {
    // Subscribe to newsletter
    async subscribe(email: string, source?: string) {
        const supabase = createClient()
        const { data, error } = await supabase
            .from('newsletter_subscriptions')
            .insert({
                email,
                source: source || 'website',
            })
            .select()
            .single()

        if (error) {
            // Check if email already exists
            if (error.code === '23505') {
                throw new Error('This email is already subscribed')
            }
            throw error
        }

        return data as NewsletterSubscription
    },

    // Check if email is subscribed
    async isSubscribed(email: string) {
        const supabase = createClient()
        const { data, error } = await supabase
            .from('newsletter_subscriptions')
            .select('id, is_active')
            .eq('email', email)
            .maybeSingle()

        if (error) throw error
        return data ? data.is_active : false
    },

    // Unsubscribe
    async unsubscribe(email: string) {
        const supabase = createClient()
        const { data, error } = await supabase
            .from('newsletter_subscriptions')
            .update({
                is_active: false,
                unsubscribed_at: new Date().toISOString(),
            })
            .eq('email', email)

        if (error) throw error
        return data
    },
}
