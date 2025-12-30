// app/admin/layout.tsx
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/admin/sidebar"
import { Separator } from "@/components/ui/separator"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full">
                <AdminSidebar />
                <main className="flex-1">
                    <div className="border-b">
                        <div className="flex h-16 items-center px-4 gap-4">
                            <SidebarTrigger />
                            <Separator orientation="vertical" className="h-6" />
                            <h1 className="text-xl font-bold">Admin Dashboard</h1>
                        </div>
                    </div>
                    <div className="p-6">
                        {children}
                    </div>
                </main>
            </div>
        </SidebarProvider>
    )
}
