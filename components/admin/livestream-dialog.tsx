// components/admin/livestream-dialog.tsx
'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/client'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Database } from '@/types/database.types'

type Livestream = Database['public']['Tables']['livestreams']['Row']
type LivestreamInsert = Database['public']['Tables']['livestreams']['Insert']

interface LivestreamDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    livestream: Livestream | null
}

export function LivestreamDialog({ open, onOpenChange, livestream }: LivestreamDialogProps) {
    const queryClient = useQueryClient()
    const supabase = createClient()

    const form = useForm<LivestreamInsert>({
        defaultValues: {
            title: '',
            description: '',
            cloudflare_video_id: '',
            thumbnail_url: '',
            status: 'scheduled',
            scheduled_at: '',
            is_premium: false,
        },
    })

    useEffect(() => {
        if (livestream) {
            form.reset({
                ...livestream,
                scheduled_at: livestream.scheduled_at ? new Date(livestream.scheduled_at).toISOString().slice(0, 16) : '',
            })
        } else {
            form.reset({
                title: '',
                description: '',
                cloudflare_video_id: '',
                thumbnail_url: '',
                status: 'scheduled',
                scheduled_at: '',
                is_premium: false,
            })
        }
    }, [livestream, form])

    const mutation = useMutation({
        mutationFn: async (data: LivestreamInsert) => {
            if (livestream) {
                const { error } = await supabase
                    .from('livestreams')
                    .update(data)
                    .eq('id', livestream.id)

                if (error) throw error
            } else {
                const { error } = await supabase
                    .from('livestreams')
                    .insert(data)

                if (error) throw error
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-livestreams'] })
            toast.success(livestream ? 'Livestream updated' : 'Livestream created')
            onOpenChange(false)
        },
        onError: (error: Error) => {
            toast.error(error.message)
        },
    })

    const onSubmit = (data: LivestreamInsert) => {
        mutation.mutate(data)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{livestream ? 'Edit Livestream' : 'Add Livestream'}</DialogTitle>
                    <DialogDescription>
                        {livestream ? 'Update livestream details' : 'Create a new livestream'}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} value={field.value || ''} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="cloudflare_video_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cloudflare Video ID</FormLabel>
                                    <FormControl>
                                        <Input {...field} value={field.value || ''} placeholder="34939fd83dcd38f946324f03c1fba2d7" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="thumbnail_url"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Thumbnail URL</FormLabel>
                                    <FormControl>
                                        <Input {...field} value={field.value || ''} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value || 'scheduled'}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="scheduled">Scheduled</SelectItem>
                                                <SelectItem value="live">Live</SelectItem>
                                                <SelectItem value="replay">Replay</SelectItem>
                                                <SelectItem value="archived">Archived</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="scheduled_at"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Scheduled At</FormLabel>
                                        <FormControl>
                                            <Input type="datetime-local" {...field} value={field.value || ''} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="is_premium"
                            render={({ field }) => (
                                <FormItem className="flex items-center gap-2">
                                    <FormControl>
                                        <Switch
                                            checked={field.value || false}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormLabel className="!mt-0">Premium Content</FormLabel>
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={mutation.isPending}>
                                {mutation.isPending ? 'Saving...' : 'Save'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
