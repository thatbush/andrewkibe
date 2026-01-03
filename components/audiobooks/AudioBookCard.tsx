// components/audiobooks/AudiobookCard.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Clock, Lock, Headphones } from 'lucide-react';
import { Database } from '@/types/database.types';

type Audiobook = Database['public']['Tables']['audiobooks']['Row'];

interface AudiobookCardProps {
    book: Audiobook;
    featured?: boolean;
}

export function AudiobookCard({ book, featured = false }: AudiobookCardProps) {
    const coverImage = book.cover_image_url || '/placeholder-audiobook.jpg';

    return (
        <Link href={`/audiobooks/${book.id}`}>
            <Card className={`group overflow-hidden hover:border-brand-red/50 transition-all ${featured ? 'border-yellow-500/30' : ''
                }`}>
                <div className="relative aspect-[3/4] overflow-hidden">
                    <Image
                        src={coverImage}
                        alt={book.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80" />

                    {/* Premium Badge */}
                    {book.is_premium && (
                        <div className="absolute top-3 right-3">
                            <Badge className="bg-yellow-500 text-black">
                                <Lock className="h-3 w-3 mr-1" />
                                Premium
                            </Badge>
                        </div>
                    )}

                    {/* Featured Badge */}
                    {featured && (
                        <div className="absolute top-3 left-3">
                            <Badge className="bg-brand-red">Featured</Badge>
                        </div>
                    )}

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="h-16 w-16 rounded-full bg-brand-red/90 flex items-center justify-center">
                            <Play className="h-8 w-8 text-white ml-1" fill="white" />
                        </div>
                    </div>

                    {/* Duration Badge */}
                    {book.duration_minutes && (
                        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/80 px-2 py-1 rounded text-xs">
                            <Clock className="h-3 w-3" />
                            <span>{formatDuration(book.duration_minutes)}</span>
                        </div>
                    )}
                </div>

                <CardContent className="p-4">
                    <h3 className="font-bold text-lg mb-1 line-clamp-2 group-hover:text-brand-red transition-colors">
                        {book.title}
                    </h3>

                    {book.author && (
                        <p className="text-sm text-muted-foreground mb-2">
                            by {book.author}
                        </p>
                    )}

                    {book.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {book.description}
                        </p>
                    )}

                    <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                            {book.category}
                        </Badge>

                        {book.listen_count && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Headphones className="h-3 w-3" />
                                <span>{formatListens(book.listen_count)}</span>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}

function formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
}

function formatListens(count: number): string {
    if (count < 1000) return count.toString();
    if (count < 1000000) return `${(count / 1000).toFixed(1)}K`;
    return `${(count / 1000000).toFixed(1)}M`;
}
