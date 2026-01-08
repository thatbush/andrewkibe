'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useAuth } from '@/lib/auth-context';
import {
    RiHome5Fill,
    RiShoppingBag3Fill,
    RiBookOpenFill,
    RiLiveFill,
    RiUserLine,
    RiShoppingCart2Line,
    RiUserFill,
    RiSettings4Line,
    RiLogoutBoxRLine,
    RiShoppingBagLine
} from 'react-icons/ri';
import { HiSparkles } from 'react-icons/hi2';

export function SiteHeader() {
    const { user, isLoading, signOut } = useAuth();

    return (
        <>
            {/* Top Navigation */}
            <nav className="border-b border-brand-red/30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-8">
                        </div>

                        <div className="flex items-center gap-3">
                            {isLoading ? (
                                <div className="w-8 h-8 animate-pulse bg-muted rounded-full" />
                            ) : user ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:ring-2 hover:ring-brand-red/50 transition-all">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email || ''} />
                                                <AvatarFallback className="bg-gradient-to-br from-brand-red to-brand-red-muted text-brand-red-foreground font-bold">
                                                    {user.email?.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56 bg-card border-border" align="end">
                                        <DropdownMenuLabel>
                                            <div className="flex flex-col space-y-1">
                                                <p className="text-sm font-medium leading-none">{user.email}</p>
                                                <p className="text-xs leading-none text-muted-foreground">
                                                    {user.user_metadata?.full_name || 'Member'}
                                                </p>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild className="cursor-pointer hover:text-brand-red">
                                            <Link href="/account" className="flex items-center">
                                                <RiUserFill className="mr-2 h-4 w-4" />
                                                My Account
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild className="cursor-pointer hover:text-brand-red">
                                            <Link href="/orders" className="flex items-center">
                                                <RiShoppingBagLine className="mr-2 h-4 w-4" />
                                                My Orders
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild className="cursor-pointer hover:text-brand-red">
                                            <Link href="/settings" className="flex items-center">
                                                <RiSettings4Line className="mr-2 h-4 w-4" />
                                                Settings
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={signOut}
                                            className="cursor-pointer text-brand-red hover:text-brand-red focus:text-brand-red"
                                        >
                                            <RiLogoutBoxRLine className="mr-2 h-4 w-4" />
                                            Sign Out
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <>
                                    <Button variant="ghost" size="sm" asChild className="hover:text-brand-red">
                                        <Link href="/auth/login" className="flex items-center">
                                            <RiUserLine className="h-4 w-4 mr-2" />
                                            Login
                                        </Link>
                                    </Button>
                                    <Button size="sm" asChild className="bg-brand-red hover:bg-brand-red-muted">
                                        <Link href="/auth/sign-up" className="flex items-center">
                                            <HiSparkles className="h-4 w-4 mr-2" />
                                            Register
                                        </Link>
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Brand Header */}
            <header className="border-b border-brand-red/30 bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-12">
                            <Link href="/" className="group">
                                <div className="text-brand-red font-bold transition-transform group-hover:scale-105">
                                    <img
                                        src="/kibe-media-logo.png"
                                        alt="AK Logo"
                                        className='w-auto h-12'
                                    />
                                </div>
                            </Link>

                            <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold">
                                <Link href="/live" className="text-foreground hover:text-brand-red transition-colors">STREAMS</Link>
                                <Link href="/audiobooks" className="text-foreground hover:text-brand-red transition-colors">AUDIOBOOKS</Link>
                                <Link href="https://store.andrewkibemedia.com" target="_blank" className="text-foreground hover:text-brand-red transition-colors">MERCHANDISE</Link>
                                <Link href="https://store.andrewkibemedia.com/product/freedom-tour-2026-nairobi/" className="text-foreground hover:text-brand-red transition-colors">TOURS</Link>
                                <Link href="/contact" className="text-foreground hover:text-brand-red transition-colors">CONTACT</Link>
                            </nav>
                        </div>

                        <Button variant="ghost" size="icon" className="hover:text-brand-red relative group">
                            <RiShoppingCart2Line className="h-6 w-6" />
                            {/* Cart badge - you can add count later */}
                            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-brand-red text-brand-red-foreground text-xs flex items-center justify-center font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                0
                            </span>
                        </Button>
                    </div>
                </div>
            </header>
        </>
    )
}
