// components/admin/sidebar.tsx
'use client'

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarHeader,
    SidebarFooter,
} from "@/components/ui/sidebar"
import {
    LayoutDashboard,
    ShoppingBag,
    Video,
    Calendar,
    BookOpen,
    Headphones,
    Mail,
    Users,
    Settings,
    LogOut
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"

const menuItems = [
    {
        title: "Overview",
        url: "/admin",
        icon: LayoutDashboard,
    },
    {
        title: "Products",
        url: "/admin/products",
        icon: ShoppingBag,
    },
    {
        title: "Livestreams",
        url: "/admin/livestreams",
        icon: Video,
    },
    {
        title: "Tour Dates",
        url: "/admin/tour-dates",
        icon: Calendar,
    },
    {
        title: "Featured Content",
        url: "/admin/featured-content",
        icon: BookOpen,
    },
    {
        title: "Audiobooks",
        url: "/admin/audiobooks",
        icon: Headphones,
    },
    {
        title: "Newsletter",
        url: "/admin/newsletter",
        icon: Mail,
    },
    {
        title: "Orders",
        url: "/admin/orders",
        icon: Users,
    },
]

export function AdminSidebar() {
    const pathname = usePathname()
    const { signOut } = useAuth()

    return (
        <Sidebar>
            <SidebarHeader>
                <div className="flex items-center gap-2 px-4 py-3">
                    <img src="/kibe-media-logo.png" alt="AK Logo" className="w-auto h-12" />
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Management</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={pathname === item.url}
                                    >
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link href="/">
                                <Settings />
                                <span>Back to Site</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton onClick={() => signOut()}>
                            <LogOut />
                            <span>Sign Out</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
