"use client"

import { usePathname } from 'next/navigation'
import { SiteHeader } from "@/components/Header"
import { SiteFooter } from "@/components/Footer"

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isAdminPage = pathname.startsWith('/admin')

    return (
        <>
            {!isAdminPage && <SiteHeader />}
            {children}
            {!isAdminPage && <SiteFooter />}
        </>
    )
}
