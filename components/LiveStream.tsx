// components/LiveStream.tsx
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Video } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Database } from "@/types/database.types";
import { formatDistanceToNow } from "date-fns";

type Livestream = Database['public']['Tables']['livestreams']['Row'];

interface LivestreamSectionProps {
    livestreams: Livestream[];
    isLoading?: boolean;
}

export function LivestreamSection({ livestreams, isLoading }: LivestreamSectionProps) {
    if (isLoading) {
        return (
            <section className="bg-background py-16 lg:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-12">
                        <Skeleton className="h-12 w-64" />
                        <Skeleton className="h-10 w-32" />
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-80" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-background py-16 lg:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h2 className="text-4xl lg:text-5xl font-black mb-2">LATEST LIVESTREAMS</h2>
                        <p className="text-muted-foreground">Catch up on recent episodes and exclusive content</p>
                    </div>
                    <Button variant="ghost" asChild className="text-brand-red hover:text-brand-red">
                        <Link href="/live">
                            View All →
                        </Link>
                    </Button>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {livestreams && livestreams.length > 0 ? (
                        livestreams.map((stream) => (
                            <Card key={stream.id} className="bg-card border-brand-red/10 hover:border-brand-red/30 transition-all group overflow-hidden">
                                <div className="h-48 bg-muted flex items-center justify-center group-hover:bg-muted/80 transition-colors relative">
                                    {stream.thumbnail_url ? (
                                        <img
                                            src={stream.thumbnail_url}
                                            alt={stream.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <Video className="h-16 w-16 text-muted-foreground group-hover:text-brand-red transition-colors" />
                                    )}
                                    <div className="absolute top-4 left-4">
                                        <Badge className="bg-brand-red">REPLAY</Badge>
                                    </div>
                                </div>
                                <CardHeader>
                                    <CardTitle className="text-lg line-clamp-2">{stream.title}</CardTitle>
                                    <CardDescription>
                                        {stream.ended_at && formatDistanceToNow(new Date(stream.ended_at), { addSuffix: true })}
                                    </CardDescription>
                                </CardHeader>
                                <CardFooter>
                                    <Button
                                        variant="ghost"
                                        className="w-full text-brand-red hover:text-brand-red hover:bg-brand-red/10"
                                        asChild
                                    >
                                        <Link href={`/live/${stream.id}`}>
                                            Watch Now →
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <p className="text-muted-foreground">No livestream replays available yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}
