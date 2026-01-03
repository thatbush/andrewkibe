// components/live/StreamInfo.tsx
'use client';

import { Database } from '@/types/database.types';
import { Badge } from '@/components/ui/badge';
import { Eye, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { formatViewCount } from '@/lib/utils/slug';

type Livestream = Database['public']['Tables']['livestreams']['Row'];

interface StreamInfoProps {
    stream: Livestream;
}

export function StreamInfo({ stream }: StreamInfoProps) {
    const isLive = stream.status === 'live';
    const isEnded = stream.status === 'ended';

    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-3xl sm:text-4xl font-black mb-3">
                    {stream.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    {/* View Count */}
                    <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{formatViewCount(stream.view_count || 0)} views</span>
                    </div>

                    {/* Timestamp */}
                    {isLive && stream.started_at && (
                        <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>Started {formatDistanceToNow(new Date(stream.started_at), { addSuffix: true })}</span>
                        </div>
                    )}

                    {isEnded && stream.ended_at && (
                        <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>Streamed {formatDistanceToNow(new Date(stream.ended_at), { addSuffix: true })}</span>
                        </div>
                    )}

                    {/* Status Badge */}
                    {isLive && (
                        <Badge className="bg-brand-red animate-pulse">
                            LIVE
                        </Badge>
                    )}

                    {stream.is_premium && (
                        <Badge className="bg-yellow-500 text-black">
                            PREMIUM
                        </Badge>
                    )}
                </div>
            </div>
        </div>
    );
}