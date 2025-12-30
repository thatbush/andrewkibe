// app/admin/livestreams/page.tsx
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
import { LivestreamDialog } from '@/components/admin/livestream-dialog'
import { toast } from 'sonner'
import { Database } from '@/types/database.types'
import { format } from 'date-fns'

type Livestream = Database['public']['Tables']['livestreams']['Row']

export default function LivestreamsPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [selectedLivestream, setSelectedLivestream] = useState<Livestream | null>(null)
    const queryClient = useQueryClient()
    const supabase = createClient()

    const { data: livestreams, isLoading } = useQuery({
        queryKey: ['admin-livestreams'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('livestreams')
                .select('*')
                .order('scheduled_at', { ascending: false })

            if (error) throw error
            return data as Livestream[]
        },
    })

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('livestreams')
                .delete()
                .eq('id', id)

            if (error) throw error
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-livestreams'] })
            toast.success('Livestream deleted successfully')
        },
        onError: (error: Error) => {
            toast.error(error.message)
        },
    })

    const handleEdit = (livestream: Livestream) => {
        setSelectedLivestream(livestream)
        setIsDialogOpen(true)
    }

    const handleAdd = () => {
        setSelectedLivestream(null)
        setIsDialogOpen(true)
    }

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this livestream?')) {
            deleteMutation.mutate(id)
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'live':
                return <Badge className="bg-brand-red">Live</Badge>
            case 'scheduled':
                return <Badge variant="secondary">Scheduled</Badge>
            case 'replay':
                return <Badge variant="outline">Replay</Badge>
            case 'archived':
                return <Badge variant="secondary">Archived</Badge>
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
                    <h2 className="text-3xl font-bold tracking-tight">Livestreams</h2>
                    <p className="text-muted-foreground">
                        Manage your livestreams and video content
                    </p>
                </div>
                <Button onClick={handleAdd}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Livestream
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Scheduled</TableHead>
                            <TableHead>Views</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {livestreams?.map((livestream) => (
                            <TableRow key={livestream.id}>
                                <TableCell className="font-medium">{livestream.title}</TableCell>
                                <TableCell>{getStatusBadge(livestream.status || 'scheduled')}</TableCell>
                                <TableCell>
                                    {livestream.scheduled_at
                                        ? format(new Date(livestream.scheduled_at), 'MMM d, yyyy h:mm a')
                                        : 'N/A'}
                                </TableCell>
                                <TableCell>{livestream.view_count || 0}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleEdit(livestream)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(livestream.id)}
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

            <LivestreamDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                livestream={selectedLivestream}
            />
        </div>
    )
}
