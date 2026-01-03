// app/live/[id]/page.tsx
import { createClient } from '@/lib/server';
import { notFound } from 'next/navigation';
import { Database } from '@/types/database.types';
import { extractIdFromSlug } from '@/lib/utils/slug';
import { LiveStreamPlayer } from '@/components/live/LiveStreamPlayer';
import { LiveChat } from '@/components/live/LiveChat';
import { CommentsSection } from '@/components/live/CommentsSection';
import { StreamInfo } from '@/components/live/StreamInfo';
import { StreamEngagement } from '@/components/live/StreamEngagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const revalidate = 0; // Always fetch fresh data for live streams

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function LiveStreamPage({ params }: PageProps) {
    const supabase = await createClient();

    // Await params (Next.js 15+ requirement)
    const { id } = await params;

    // Extract the short ID from the slug
    const shortId = extractIdFromSlug(id);

    if (!shortId) {
        notFound();
    }

    // Use the Postgres function to find the stream
    const { data: streams, error } = await supabase
        .rpc('find_stream_by_short_id', {
            short_id: shortId
        });

    if (error) {
        console.error('Error fetching stream:', error);
        notFound();
    }

    const stream = streams?.[0];

    if (!stream) {
        notFound();
    }

    // Get user session
    const { data: { session } } = await supabase.auth.getSession();

    // Increment view count (in a real app, use a more sophisticated system)
    if (stream.status === 'live' || stream.status === 'ended') {
        await supabase
            .from('livestreams')
            .update({ view_count: (stream.view_count || 0) + 1 })
            .eq('id', stream.id);
    }

    const isLive = stream.status === 'live';
    const isEnded = stream.status === 'ended';
    const isUpcoming = stream.status === 'scheduled';

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content - Video & Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Video Player */}
                        <LiveStreamPlayer
                            stream={stream}
                            isLive={isLive}
                            isEnded={isEnded}
                            isUpcoming={isUpcoming}
                        />

                        {/* Stream Info & Engagement */}
                        <StreamInfo stream={stream} />
                        <StreamEngagement
                            streamId={stream.id}
                            userId={session?.user?.id}
                            initialLikes={stream.likes_count || 0}
                            initialShares={stream.shares_count || 0}
                        />

                        {/* Tabs for Comments & Description */}
                        <Tabs defaultValue="comments" className="w-full">
                            <TabsList>
                                <TabsTrigger value="comments">
                                    Comments ({stream.comments_count || 0})
                                </TabsTrigger>
                                <TabsTrigger value="description">
                                    Description
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="comments" className="mt-6">
                                {stream.comments_enabled ? (
                                    <CommentsSection
                                        streamId={stream.id}
                                        userId={session?.user?.id}
                                        userEmail={session?.user?.email}
                                    />
                                ) : (
                                    <div className="text-center py-12 text-muted-foreground">
                                        Comments are disabled for this stream.
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="description" className="mt-6">
                                <div className="prose prose-invert max-w-none">
                                    {stream.description ? (
                                        <p className="text-muted-foreground whitespace-pre-wrap">
                                            {stream.description}
                                        </p>
                                    ) : (
                                        <p className="text-muted-foreground italic">
                                            No description available.
                                        </p>
                                    )}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Sidebar - Live Chat */}
                    <div className="lg:col-span-1">
                        {isLive && stream.chat_enabled ? (
                            <div className="sticky top-6">
                                <LiveChat
                                    streamId={stream.id}
                                    userId={session?.user?.id}
                                    userName={session?.user?.user_metadata?.full_name}
                                />
                            </div>
                        ) : isEnded ? (
                            <div className="bg-muted/30 rounded-lg p-6 text-center">
                                <p className="text-muted-foreground">
                                    Chat replay is not available for this stream.
                                </p>
                            </div>
                        ) : isUpcoming ? (
                            <div className="bg-muted/30 rounded-lg p-6 text-center">
                                <p className="text-muted-foreground mb-4">
                                    Chat will be available when the stream goes live.
                                </p>
                                {stream.scheduled_at && (
                                    <p className="text-sm">
                                        Scheduled for {new Date(stream.scheduled_at).toLocaleString()}
                                    </p>
                                )}
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
}
