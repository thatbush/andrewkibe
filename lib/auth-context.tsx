'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/client'

type AuthContextType = {
    user: User | null
    isLoading: boolean
    signOut: () => Promise<void>
    refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoading: true,
    signOut: async () => { },
    refreshUser: async () => { },
})

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider')
    }
    return context
}

export function AuthProvider({
    children,
    initialUser,
}: {
    children: React.ReactNode
    initialUser: User | null
}) {
    const [user, setUser] = useState<User | null>(initialUser)
    const [isLoading, setIsLoading] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        // Initialize with SSR data
        setUser(initialUser)
        setIsLoading(false)

        // Listen for auth changes (login, logout, token refresh)
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('Auth event:', event)

            if (session?.user) {
                setUser(session.user)
            } else {
                setUser(null)
            }

            setIsLoading(false)

            // Refresh the page to sync server components
            if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
                window.location.reload()
            }
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [initialUser, supabase])

    const signOut = async () => {
        setIsLoading(true)
        await supabase.auth.signOut()
        setUser(null)
        setIsLoading(false)
        window.location.href = '/'
    }

    const refreshUser = async () => {
        setIsLoading(true)
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
        setIsLoading(false)
    }

    const value = {
        user,
        isLoading,
        signOut,
        refreshUser,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
