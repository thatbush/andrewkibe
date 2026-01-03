// components/live/LiveStreamPlayer.tsx
'use client';

import { Stream } from '@cloudflare/stream-react';
import { Badge } from '@/components/ui/badge';
import { Database } from '@/types/database.types';
import { Calendar } from 'lucide-react';

type Livestream = Database['public']['Tables']['livestreams']['Row'];

interface LiveStreamPlayerProps {
    stream: Livestream;
    isLive: boolean;
    isEnded: boolean;
    isUpcoming: boolean;
}

export function LiveStreamPlayer({
    stream,
    isLive,
    isEnded,
    isUpcoming
}: LiveStreamPlayerProps) {
    const videoId = stream.cloudflare_video_id;
    const thumbnailUrl = stream.thumbnail_url ||
        (videoId
            ? `https://customer-ugc6itgsiz8sxxq1.cloudflarestream.com/${videoId}/thumbnails/thumbnail.jpg`
            : undefined);

    if (isUpcoming) {
        return (
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-muted relative">
                {thumbnailUrl && (
                    <img
                        src={thumbnailUrl}
                        alt={stream.title}
                        className="object-cover w-full h-full opacity-50"
                    />
                )}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60">
                    <Badge className="mb-4 text-lg px-4 py-2">
                        <Calendar className="mr-2 h-5 w-5" />
                        UPCOMING
                    </Badge>
                    <h3 className="text-2xl font-bold text-center px-4">
                        {stream.title}
                    </h3>
                    {stream.scheduled_at && (
                        <p className="mt-4 text-muted-foreground">
                            Scheduled for {new Date(stream.scheduled_at).toLocaleString()}
                        </p>
                    )}
                </div>
            </div>
        );
    }

    if (!videoId) {
        return (
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-muted flex items-center justify-center">
                <p className="text-muted-foreground">Video not available</p>
            </div>
        );
    }

    return (
        <div className="aspect-video w-full rounded-xl overflow-hidden border border-brand-red/20 relative">
            {isLive && (
                <div className="absolute top-4 left-4 z-10">
                    <Badge className="bg-brand-red animate-pulse text-lg px-4 py-2">
                        🔴 LIVE
                    </Badge>
                </div>
            )}

            {stream.is_premium && (
                <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-yellow-500 text-black">
                        PREMIUM
                    </Badge>
                </div>
            )}

            <Stream
                controls
                src={videoId}
                autoplay={isLive}
                muted={false}
                preload="auto"
                poster={thumbnailUrl}
                title={stream.title}
                responsive={true}
            />
        </div>
    );
}