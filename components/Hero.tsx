// components/Hero.tsx
'use client';

import { Stream } from '@cloudflare/stream-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import Link from 'next/link';
import { ShoppingCart, Headphones, Video } from 'lucide-react';
import { Database } from '@/types/database.types';
import { Skeleton } from './ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { LightRays } from './ui/light-rays';

type Livestream = Database['public']['Tables']['livestreams']['Row'];

interface HeroSectionProps {
    currentLive: Livestream | null | undefined;
    latestReplay: Livestream | null | undefined;
    isLoading?: boolean;
}

export function HeroSection({ currentLive, latestReplay, isLoading }: HeroSectionProps) {
    if (isLoading) {
        return (
            <section className="relative bg-background py-12 lg:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Skeleton className="aspect-video w-full rounded-xl mb-8" />
                    <div className="text-center space-y-6">
                        <Skeleton className="h-16 w-3/4 mx-auto" />
                        <Skeleton className="h-8 w-1/2 mx-auto" />
                        <div className="flex justify-center gap-4">
                            <Skeleton className="h-12 w-40" />
                            <Skeleton className="h-12 w-40" />
                            <Skeleton className="h-12 w-40" />
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // Determine what to show
    const isLive = currentLive?.status === 'live';
    const showReplay = !isLive && latestReplay;
    const displayStream = isLive ? currentLive : latestReplay;

    // Default video if no live stream or replay
    const defaultVideoId = "34939fd83dcd38f946324f03c1fba2d7";
    const videoId = displayStream?.cloudflare_video_id || defaultVideoId;
    const videoTitle = displayStream?.title || 'Real Raw & Rare S2E08 ft. Andrew Kibe';
    const thumbnailUrl = displayStream?.thumbnail_url ||
        `https://customer-ugc6itgsiz8sxxq1.cloudflarestream.com/${videoId}/thumbnails/thumbnail.jpg`;

    return (
        <section className="relative bg-background py-12 lg:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Video Player */}
                <div className="aspect-video w-full rounded-xl overflow-hidden mb-8 border border-brand-red/20 relative">
                    {isLive && (
                        <div className="absolute top-4 left-4 z-10">
                            <Badge className="bg-brand-red animate-pulse">
                                🔴 LIVE NOW
                            </Badge>
                        </div>
                    )}

                    {showReplay && (
                        <div className="absolute top-4 left-4 z-10">
                            <Badge className="bg-brand-red/80">
                                LATEST EPISODE
                            </Badge>
                        </div>
                    )}

                    <Stream
                        controls
                        src={videoId}
                        autoplay={isLive}
                        muted={!isLive}
                        preload="auto"
                        poster={thumbnailUrl}
                        title={videoTitle}
                        responsive={true}
                    />
                </div>

                {/* Hero Content */}
                <div className="text-center space-y-6">
                    <div>
                        {isLive ? (
                            <>
                                <Badge className="bg-brand-red mb-4 text-lg px-4 py-2 animate-pulse">
                                    🔴 STREAMING LIVE
                                </Badge>
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 leading-tight">
                                    {currentLive?.title}
                                </h1>
                                <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                                    {currentLive?.description || 'Join the conversation happening right now!'}
                                </p>
                            </>
                        ) : showReplay ? (
                            <>
                                <Badge className="bg-brand-red/80 mb-4 text-base px-3 py-1">
                                    Latest Episode • {latestReplay?.ended_at && formatDistanceToNow(new Date(latestReplay.ended_at), { addSuffix: true })}
                                </Badge>
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 leading-tight">
                                    {latestReplay?.title}
                                </h1>
                                <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                                    {latestReplay?.description || 'Catch up on the latest episode'}
                                </p>
                            </>
                        ) : (
                            <>
                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4 leading-tight">
                                    WELCOME TO<br />
                                    <span className="text-brand-red">ANDREW KIBE MEDIA</span>
                                </h1>
                                <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                                    Join the livestreams, explore trainings, and shop exclusive merchandise.
                                </p>
                            </>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Button size="lg" variant="outline" asChild className="border-foreground/20 hover:bg-accent">
                            <Link href="/audiobooks">
                                <Headphones className="mr-2 h-5 w-5" />
                                AUDIOBOOKS
                            </Link>
                        </Button>
                        <Button
                            size="lg"
                            asChild
                            className={`${isLive ? 'bg-brand-red hover:bg-brand-red-muted animate-pulse' : 'bg-brand-red hover:bg-brand-red-muted'}`}
                        >
                            <Link href={isLive && currentLive ? `/live/${currentLive.id}` : showReplay && latestReplay ? `/live/${latestReplay.id}` : '/live'}>
                                <Video className="mr-2 h-5 w-5" />
                                {isLive ? 'JOIN LIVE NOW' : showReplay ? 'WATCH EPISODE' : 'WATCH LIVE'}
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" asChild className="border-foreground/20 hover:bg-accent">
                            <Link href="/shop">
                                <ShoppingCart className="mr-2 h-5 w-5" />
                                SHOP NOW
                            </Link>
                        </Button>
                    </div>

                    {/* View Count */}
                    {isLive && currentLive && (
                        <div className="mt-6">
                            <p className="text-sm text-muted-foreground">
                                👁️ {currentLive.view_count?.toLocaleString() || 0} viewers watching
                            </p>
                        </div>
                    )}

                    {/* Replay Stats */}
                    {showReplay && latestReplay && (
                        <div className="mt-6">
                            <p className="text-sm text-muted-foreground">
                                👁️ {latestReplay.view_count?.toLocaleString() || 0} views
                            </p>
                        </div>
                    )}
                </div>
            </div>
            <LightRays color='#b6a58131' blur={16} speed={16} length="10vh" />
        </section>
    )
}
