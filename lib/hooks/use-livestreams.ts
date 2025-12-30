// lib/hooks/use-livestreams.ts
'use client'

import { useQuery, useMutation } from '@tanstack/react-query'
import { livestreamsApi } from '@/lib/api/livestreams'

export function useLivestreams(status?: 'scheduled' | 'live' | 'replay' | 'archived') {
    return useQuery({
        queryKey: ['livestreams', status],
        queryFn: () => livestreamsApi.getAll(status),
    })
}

export function useCurrentLive() {
    return useQuery({
        queryKey: ['livestreams', 'current-live'],
        queryFn: () => livestreamsApi.getCurrentLive(),
        refetchInterval: 30000, // Refetch every 30 seconds
    })
}

export function useReplays(limit?: number) {
    return useQuery({
        queryKey: ['livestreams', 'replays', limit],
        queryFn: () => livestreamsApi.getReplays(limit),
    })
}

export function useLivestream(id: string) {
    return useQuery({
        queryKey: ['livestream', id],
        queryFn: () => livestreamsApi.getById(id),
        enabled: !!id,
    })
}

export function useTrackView() {
    return useMutation({
        mutationFn: ({ livestreamId, userId }: { livestreamId: string; userId?: string }) =>
            livestreamsApi.trackView(livestreamId, userId),
    })
}
