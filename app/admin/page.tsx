// app/admin/page.tsx
import { createClient } from '@/lib/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ShoppingBag, Video, Calendar, Mail, DollarSign, Users } from 'lucide-react'

async function getStats() {
    const supabase = await createClient()

    const [
        { count: productsCount },
        { count: livestreamsCount },
        { count: tourDatesCount },
        { count: newsletterCount },
        { count: ordersCount },
        { data: recentOrders }
    ] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('livestreams').select('*', { count: 'exact', head: true }),
        supabase.from('tour_dates').select('*', { count: 'exact', head: true }),
        supabase.from('newsletter_subscriptions').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5)
    ])

    const totalRevenue = recentOrders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0

    return {
        productsCount: productsCount || 0,
        livestreamsCount: livestreamsCount || 0,
        tourDatesCount: tourDatesCount || 0,
        newsletterCount: newsletterCount || 0,
        ordersCount: ordersCount || 0,
        totalRevenue,
    }
}

export default async function AdminDashboard() {
    const stats = await getStats()

    const statCards = [
        {
            title: 'Total Products',
            value: stats.productsCount,
            icon: ShoppingBag,
            description: 'Active products in store',
        },
        {
            title: 'Livestreams',
            value: stats.livestreamsCount,
            icon: Video,
            description: 'Total streams recorded',
        },
        {
            title: 'Tour Dates',
            value: stats.tourDatesCount,
            icon: Calendar,
            description: 'Upcoming events',
        },
        {
            title: 'Newsletter Subscribers',
            value: stats.newsletterCount,
            icon: Mail,
            description: 'Active subscribers',
        },
        {
            title: 'Total Orders',
            value: stats.ordersCount,
            icon: Users,
            description: 'All time orders',
        },
        {
            title: 'Revenue (Recent)',
            value: `KES ${stats.totalRevenue.toLocaleString()}`,
            icon: DollarSign,
            description: 'Last 5 orders',
        },
    ]

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
                <p className="text-muted-foreground">
                    Quick stats and insights for Andrew Kibe Media
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {statCards.map((stat) => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">
                                {stat.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
