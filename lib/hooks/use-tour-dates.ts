// lib/hooks/use-tour-dates.ts
'use client'

import { useQuery } from '@tanstack/react-query'
import { tourDatesApi } from '@/lib/api/tour-dates'

export function useUpcomingTourDates() {
    return useQuery({
        queryKey: ['tour-dates', 'upcoming'],
        queryFn: () => tourDatesApi.getUpcoming(),
    })
}

export function useTourDate(id: string) {
    return useQuery({
        queryKey: ['tour-date', id],
        queryFn: () => tourDatesApi.getById(id),
        enabled: !!id,
    })
}

export function useTourAvailability(id: string) {
    return useQuery({
        queryKey: ['tour-date', id, 'availability'],
        queryFn: () => tourDatesApi.checkAvailability(id),
        enabled: !!id,
        refetchInterval: 60000, // Refetch every minute
    })
}
