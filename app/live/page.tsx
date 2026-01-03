// app/live/page.tsx
import { createClient } from '@/lib/server';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database } from '@/types/database.types';
import { formatDistanceToNow } from 'date-fns';
import { PlayCircle, Eye, Calendar, Clock } from 'lucide-react';
import { generateLivestreamSlug, formatViewCount } from '@/lib/utils/slug';

type Livestream = Database['public']['Tables']['livestreams']['Row'];

export const revalidate = 30; // Revalidate every 30 seconds for live status

export default async function LivePage() {
    const supabase = await createClient();

    // Fetch live streams
    const { data: liveStreams } = await supabase
        .from('livestreams')
        .select('*')
        .eq('status', 'live')
        .order('started_at', { ascending: false });

    // Fetch upcoming streams
    const { data: upcomingStreams } = await supabase
        .from('livestreams')
        .select('*')
        .eq('status', 'scheduled')
        .gte('scheduled_at', new Date().toISOString())
        .order('scheduled_at', { ascending: true })
        .limit(12);

    // Fetch recent replays - FIXED: query for 'replay' status instead of 'ended'
    const { data: replayStreams } = await supabase
        .from('livestreams')
        .select('*')
        .in('status', ['replay', 'ended']) // Support both status values
        .not('cloudflare_video_id', 'is', null)
        .order('ended_at', { ascending: false })
        .limit(12);

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl sm:text-5xl font-black mb-4">
                        LIVE STREAMS
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl">
                        Watch live broadcasts, catch up on recent episodes, or check out upcoming events.
                    </p>
                </div>

                {/* Live Now Section - Priority Display */}
                {liveStreams && liveStreams.length > 0 && (
                    <div className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <Badge className="bg-brand-red animate-pulse text-lg px-4 py-2">
                                🔴 LIVE NOW
                            </Badge>
                            <span className="text-muted-foreground">
                                {liveStreams.length} {liveStreams.length === 1 ? 'stream' : 'streams'} broadcasting
                            </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {liveStreams.map((stream) => (
                                <LiveStreamCard key={stream.id} stream={stream} isLive />
                            ))}
                        </div>
                    </div>
                )}

                {/* Tabs for Replays and Upcoming */}
                <Tabs defaultValue="replays" className="w-full">
                    <TabsList className="mb-8">
                        <TabsTrigger value="replays" className="text-base">
                            Recent Episodes ({replayStreams?.length || 0})
                        </TabsTrigger>
                        <TabsTrigger value="upcoming" className="text-base">
                            Upcoming ({upcomingStreams?.length || 0})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="replays">
                        {replayStreams && replayStreams.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {replayStreams.map((stream) => (
                                    <LiveStreamCard key={stream.id} stream={stream} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground">No replays available yet.</p>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="upcoming">
                        {upcomingStreams && upcomingStreams.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {upcomingStreams.map((stream) => (
                                    <LiveStreamCard key={stream.id} stream={stream} isUpcoming />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground">No upcoming streams scheduled.</p>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

function LiveStreamCard({
    stream,
    isLive = false,
    isUpcoming = false
}: {
    stream: Livestream;
    isLive?: boolean;
    isUpcoming?: boolean;
}) {
    const slug = generateLivestreamSlug(stream.title, stream.id);
    const thumbnailUrl = stream.thumbnail_url ||
        (stream.cloudflare_video_id
            ? `https://customer-ugc6itgsiz8sxxq1.cloudflarestream.com/${stream.cloudflare_video_id}/thumbnails/thumbnail.jpg`
            : '/placeholder-thumbnail.jpg');

    return (
        <Link href={`/live/${slug}`}>
            <Card className="group overflow-hidden hover:border-brand-red/50 transition-all">
                <div className="relative aspect-video overflow-hidden">
                    <img
                        src={thumbnailUrl}
                        alt={stream.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Live Badge */}
                    {isLive && (
                        <div className="absolute top-3 left-3">
                            <Badge className="bg-brand-red animate-pulse">
                                🔴 LIVE
                            </Badge>
                        </div>
                    )}

                    {/* Premium Badge */}
                    {stream.is_premium && (
                        <div className="absolute top-3 right-3">
                            <Badge className="bg-yellow-500 text-black">
                                PREMIUM
                            </Badge>
                        </div>
                    )}

                    {/* View Count Overlay */}
                    {!isUpcoming && (
                        <div className="absolute bottom-3 right-3 bg-black/80 px-2 py-1 rounded text-sm flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            <span>{formatViewCount(stream.view_count || 0)}</span>
                        </div>
                    )}

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <PlayCircle className="h-16 w-16 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                </div>

                <CardContent className="p-4">
                    <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-brand-red transition-colors">
                        {stream.title}
                    </h3>

                    {stream.description && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {stream.description}
                        </p>
                    )}

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                        {isLive && stream.started_at && (
                            <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>Started {formatDistanceToNow(new Date(stream.started_at), { addSuffix: true })}</span>
                            </div>
                        )}

                        {isUpcoming && stream.scheduled_at && (
                            <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>{formatDistanceToNow(new Date(stream.scheduled_at), { addSuffix: true })}</span>
                            </div>
                        )}

                        {!isLive && !isUpcoming && stream.ended_at && (
                            <span>{formatDistanceToNow(new Date(stream.ended_at), { addSuffix: true })}</span>
                        )}
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
