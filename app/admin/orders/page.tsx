// app/admin/orders/page.tsx
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
import { Button } from '@/components/ui/button'
import { Eye } from 'lucide-react'
import { Database } from '@/types/database.types'
import { format } from 'date-fns'
import { useState } from 'react'
import { OrderDetailsDialog } from '@/components/admin/order-details-dialog'

type Order = Database['public']['Tables']['orders']['Row']

export default function OrdersPage() {
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
    const supabase = createClient()

    const { data: orders, isLoading } = useQuery({
        queryKey: ['admin-orders'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            return data as Order[]
        },
    })

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
                return <Badge variant="default">Completed</Badge>
            case 'processing':
                return <Badge className="bg-chart-4">Processing</Badge>
            case 'pending':
                return <Badge variant="secondary">Pending</Badge>
            case 'cancelled':
                return <Badge variant="destructive">Cancelled</Badge>
            default:
                return <Badge>{status}</Badge>
        }
    }

    const getPaymentBadge = (status: string) => {
        switch (status) {
            case 'paid':
                return <Badge variant="default">Paid</Badge>
            case 'pending':
                return <Badge variant="secondary">Pending</Badge>
            case 'failed':
                return <Badge variant="destructive">Failed</Badge>
            default:
                return <Badge>{status}</Badge>
        }
    }

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
                <p className="text-muted-foreground">
                    Manage customer orders and transactions
                </p>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Payment</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders?.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell className="font-mono text-xs">
                                    {order.id.slice(0, 8)}...
                                </TableCell>
                                <TableCell>
                                    <div>
                                        <div className="font-medium">{order.customer_name || 'N/A'}</div>
                                        <div className="text-sm text-muted-foreground">{order.customer_email}</div>
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium">
                                    {order.currency} {order.total_amount.toLocaleString()}
                                </TableCell>
                                <TableCell>{getStatusBadge(order.status || 'pending')}</TableCell>
                                <TableCell>{getPaymentBadge(order.payment_status || 'pending')}</TableCell>
                                <TableCell>
                                    {order.created_at ? format(new Date(order.created_at), 'MMM d, yyyy') : 'N/A'}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setSelectedOrder(order)}
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <OrderDetailsDialog
                open={!!selectedOrder}
                onOpenChange={(open) => !open && setSelectedOrder(null)}
                orderId={selectedOrder?.id || ''}
            />
        </div>
    )
}
