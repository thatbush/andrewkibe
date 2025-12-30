// app/admin/newsletter/page.tsx
'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/client'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Database } from '@/types/database.types'
import { format } from 'date-fns'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

type NewsletterSubscription = Database['public']['Tables']['newsletter_subscriptions']['Row']

export default function NewsletterPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const supabase = createClient()

    const { data: subscriptions, isLoading } = useQuery({
        queryKey: ['admin-newsletter'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('newsletter_subscriptions')
                .select('*')
                .order('subscribed_at', { ascending: false })

            if (error) throw error
            return data as NewsletterSubscription[]
        },
    })

    const filteredSubscriptions = subscriptions?.filter(sub =>
        sub.email.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleExport = () => {
        if (!subscriptions) return

        const csv = [
            ['Email', 'Status', 'Source', 'Subscribed At'],
            ...subscriptions.map(sub => [
                sub.email,
                sub.is_active ? 'Active' : 'Unsubscribed',
                sub.source || 'N/A',
                sub.subscribed_at ? format(new Date(sub.subscribed_at), 'yyyy-MM-dd HH:mm:ss') : 'N/A'
            ])
        ].map(row => row.join(',')).join('\n')

        const blob = new Blob([csv], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `newsletter-subscribers-${format(new Date(), 'yyyy-MM-dd')}.csv`
        a.click()
    }

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Newsletter Subscribers</h2>
                    <p className="text-muted-foreground">
                        Total subscribers: {subscriptions?.filter(s => s.is_active).length || 0}
                    </p>
                </div>
                <Button onClick={handleExport}>
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                </Button>
            </div>

            <Input
                placeholder="Search by email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
            />

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Email</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Source</TableHead>
                            <TableHead>Subscribed At</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredSubscriptions?.map((subscription) => (
                            <TableRow key={subscription.id}>
                                <TableCell className="font-medium">{subscription.email}</TableCell>
                                <TableCell>
                                    {subscription.is_active ? (
                                        <Badge variant="default">Active</Badge>
                                    ) : (
                                        <Badge variant="secondary">Unsubscribed</Badge>
                                    )}
                                </TableCell>
                                <TableCell>{subscription.source || 'N/A'}</TableCell>
                                <TableCell>
                                    {subscription.subscribed_at ? format(new Date(subscription.subscribed_at), 'MMM d, yyyy') : 'N/A'}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
