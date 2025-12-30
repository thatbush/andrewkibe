// app/admin/featured-content/page.tsx
'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/client'
import { Button } from '@/components/ui/button'
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown } from 'lucide-react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { FeaturedContentDialog } from '@/components/admin/featured-content-dialog'
import { toast } from 'sonner'
import { Database } from '@/types/database.types'

type FeaturedContent = Database['public']['Tables']['featured_content']['Row']

export default function FeaturedContentPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [selectedContent, setSelectedContent] = useState<FeaturedContent | null>(null)
    const queryClient = useQueryClient()
    const supabase = createClient()

    const { data: contents, isLoading } = useQuery({
        queryKey: ['admin-featured-content'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('featured_content')
                .select('*')
                .order('display_order', { ascending: true })

            if (error) throw error
            return data as FeaturedContent[]
        },
    })

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('featured_content')
                .delete()
                .eq('id', id)

            if (error) throw error
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-featured-content'] })
            toast.success('Featured content deleted successfully')
        },
        onError: (error: Error) => {
            toast.error(error.message)
        },
    })

    const updateOrderMutation = useMutation({
        mutationFn: async ({ id, order }: { id: string; order: number }) => {
            const { error } = await supabase
                .from('featured_content')
                .update({ display_order: order })
                .eq('id', id)

            if (error) throw error
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-featured-content'] })
        },
    })

    const handleEdit = (content: FeaturedContent) => {
        setSelectedContent(content)
        setIsDialogOpen(true)
    }

    const handleAdd = () => {
        setSelectedContent(null)
        setIsDialogOpen(true)
    }

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this featured content?')) {
            deleteMutation.mutate(id)
        }
    }

    const handleMoveUp = (content: FeaturedContent, index: number) => {
        if (index === 0 || !contents) return

        const prevContent = contents[index - 1]
        updateOrderMutation.mutate({ id: content.id, order: prevContent.display_order || 0 })
        updateOrderMutation.mutate({ id: prevContent.id, order: content.display_order || 0 })
    }

    const handleMoveDown = (content: FeaturedContent, index: number) => {
        if (!contents || index === contents.length - 1) return

        const nextContent = contents[index + 1]
        updateOrderMutation.mutate({ id: content.id, order: nextContent.display_order || 0 })
        updateOrderMutation.mutate({ id: nextContent.id, order: content.display_order || 0 })
    }

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Featured Content</h2>
                    <p className="text-muted-foreground">
                        Manage homepage featured tabs
                    </p>
                </div>
                <Button onClick={handleAdd}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Content
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order</TableHead>
                            <TableHead>Tab Name</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {contents?.map((content, index) => (
                            <TableRow key={content.id}>
                                <TableCell>
                                    <div className="flex gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6"
                                            onClick={() => handleMoveUp(content, index)}
                                            disabled={index === 0}
                                        >
                                            <ArrowUp className="h-3 w-3" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6"
                                            onClick={() => handleMoveDown(content, index)}
                                            disabled={index === (contents?.length || 0) - 1}
                                        >
                                            <ArrowDown className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline">{content.tab_name}</Badge>
                                </TableCell>
                                <TableCell className="font-medium">{content.title}</TableCell>
                                <TableCell>
                                    {content.price
                                        ? `${content.currency} ${content.price}`
                                        : 'N/A'}
                                </TableCell>
                                <TableCell>
                                    {content.is_active ? (
                                        <Badge variant="default">Active</Badge>
                                    ) : (
                                        <Badge variant="secondary">Inactive</Badge>
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleEdit(content)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(content.id)}
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

            <FeaturedContentDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                content={selectedContent}
            />
        </div>
    )
}
