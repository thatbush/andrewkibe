// app/admin/tour-dates/page.tsx
'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/client'
import { Button } from '@/components/ui/button'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { TourDateDialog } from '@/components/admin/tour-date-dialog'
import { toast } from 'sonner'
import { Database } from '@/types/database.types'
import { format } from 'date-fns'

type TourDate = Database['public']['Tables']['tour_dates']['Row']

export default function TourDatesPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [selectedTourDate, setSelectedTourDate] = useState<TourDate | null>(null)
    const queryClient = useQueryClient()
    const supabase = createClient()

    const { data: tourDates, isLoading } = useQuery({
        queryKey: ['admin-tour-dates'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('tour_dates')
                .select('*')
                .order('event_date', { ascending: true })

            if (error) throw error
            return data as TourDate[]
        },
    })

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('tour_dates')
                .delete()
                .eq('id', id)

            if (error) throw error
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-tour-dates'] })
            toast.success('Tour date deleted successfully')
        },
        onError: (error: Error) => {
            toast.error(error.message)
        },
    })

    const handleEdit = (tourDate: TourDate) => {
        setSelectedTourDate(tourDate)
        setIsDialogOpen(true)
    }

    const handleAdd = () => {
        setSelectedTourDate(null)
        setIsDialogOpen(true)
    }

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this tour date?')) {
            deleteMutation.mutate(id)
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'available':
                return <Badge variant="default">Available</Badge>
            case 'selling-fast':
                return <Badge className="bg-chart-4">Selling Fast</Badge>
            case 'sold-out':
                return <Badge variant="destructive">Sold Out</Badge>
            case 'cancelled':
                return <Badge variant="secondary">Cancelled</Badge>
            default:
                return <Badge>{status}</Badge>
        }
    }

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Tour Dates</h2>
                    <p className="text-muted-foreground">
                        Manage tour schedule and events
                    </p>
                </div>
                <Button onClick={handleAdd}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Tour Date
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>City</TableHead>
                            <TableHead>Venue</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Tickets</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tourDates?.map((tourDate) => (
                            <TableRow key={tourDate.id}>
                                <TableCell className="font-medium">{tourDate.city}</TableCell>
                                <TableCell>{tourDate.venue || 'TBA'}</TableCell>
                                <TableCell>
                                    {format(new Date(tourDate.event_date), 'MMM d, yyyy')}
                                </TableCell>
                                <TableCell>
                                    {tourDate.ticket_price
                                        ? `${tourDate.currency} ${tourDate.ticket_price}`
                                        : 'Free'}
                                </TableCell>
                                <TableCell>
                                    {tourDate.tickets_sold || 0} / {tourDate.total_tickets || 'Unlimited'}
                                </TableCell>
                                <TableCell>{getStatusBadge(tourDate.status || 'available')}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleEdit(tourDate)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(tourDate.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <TourDateDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                tourDate={selectedTourDate}
            />
        </div>
    )
}
