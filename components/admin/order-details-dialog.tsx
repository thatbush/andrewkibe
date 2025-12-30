// components/admin/order-details-dialog.tsx
'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/client'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { format } from 'date-fns'
import { toast } from 'sonner'

interface OrderDetailsDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    orderId: string
}

export function OrderDetailsDialog({ open, onOpenChange, orderId }: OrderDetailsDialogProps) {
    const queryClient = useQueryClient()
    const supabase = createClient()

    const { data: order } = useQuery({
        queryKey: ['order', orderId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('orders')
                .select(`
          *,
          order_items (*)
        `)
                .eq('id', orderId)
                .single()

            if (error) throw error
            return data
        },
        enabled: !!orderId,
    })

    const updateStatusMutation = useMutation({
        mutationFn: async (status: string) => {
            const { error } = await supabase
                .from('orders')
                .update({ status })
                .eq('id', orderId)

            if (error) throw error
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['order', orderId] })
            queryClient.invalidateQueries({ queryKey: ['admin-orders'] })
            toast.success('Order status updated')
        },
    })

    if (!order) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Order Details</DialogTitle>
                    <DialogDescription>
                        Order ID: {order.id}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Customer Info */}
                    <div>
                        <h3 className="font-semibold mb-2">Customer Information</h3>
                        <div className="space-y-1 text-sm">
                            <p><span className="text-muted-foreground">Name:</span> {order.customer_name || 'N/A'}</p>
                            <p><span className="text-muted-foreground">Email:</span> {order.customer_email}</p>
                            <p><span className="text-muted-foreground">Phone:</span> {order.customer_phone || 'N/A'}</p>
                        </div>
                    </div>

                    <Separator />

                    {/* Order Status */}
                    <div>
                        <h3 className="font-semibold mb-2">Order Status</h3>
                        <div className="flex items-center gap-4">
                            <Select
                                value={order.status || 'pending'}
                                onValueChange={(value) => updateStatusMutation.mutate(value)}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="processing">Processing</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                            <Badge>{order.payment_status}</Badge>
                        </div>
                    </div>

                    <Separator />

                    {/* Order Items */}
                    <div>
                        <h3 className="font-semibold mb-2">Order Items</h3>
                        <div className="space-y-2">
                            {order.order_items?.map((item: any) => (
                                <div key={item.id} className="flex justify-between items-center p-2 border rounded">
                                    <div className="flex items-center gap-3">
                                        {item.product_image_url && (
                                            <img
                                                src={item.product_image_url}
                                                alt={item.product_name}
                                                className="h-10 w-10 rounded object-cover"
                                            />
                                        )}
                                        <div>
                                            <p className="font-medium">{item.product_name}</p>
                                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <p className="font-medium">
                                        {order.currency} {item.total_price.toLocaleString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Separator />

                    {/* Total */}
                    <div className="flex justify-between items-center text-lg font-bold">
                        <span>Total</span>
                        <span>{order.currency} {order.total_amount.toLocaleString()}</span>
                    </div>

                    {/* Order Date */}
                    <p className="text-sm text-muted-foreground">
                        Ordered on {format(new Date(order.created_at), 'MMMM d, yyyy h:mm a')}
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    )
}
