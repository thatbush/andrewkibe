// lib/hooks/use-newsletter.ts
'use client'

import { useMutation } from '@tanstack/react-query'
import { newsletterApi } from '@/lib/api/newsletter'
import { toast } from 'sonner'

export function useNewsletterSubscribe() {
    return useMutation({
        mutationFn: (email: string) => newsletterApi.subscribe(email),
        onSuccess: () => {
            toast.success('Successfully subscribed to newsletter!')
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to subscribe')
        },
    })
}
