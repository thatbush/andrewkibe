// app/audiobooks/page.tsx
import { createClient } from '@/lib/server';
import { AudiobookCard } from '@/components/audiobooks/AudioBookCard';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Headphones, BookOpen, Clock, Star } from 'lucide-react';

export const metadata = {
    title: 'Audiobooks | Real, Raw & Rare',
    description: 'Listen to exclusive audiobooks narrated by Andrew Kibe and special guests.',
};

export const revalidate = 60;

export default async function AudiobooksPage() {
    const supabase = await createClient();

    // Fetch audiobooks by category
    const { data: allAudiobooks } = await supabase
        .from('audiobooks')
        .select('*')
        .order('created_at', { ascending: false });

    const featured = allAudiobooks?.filter(book => book.is_featured) || [];
    const selfHelp = allAudiobooks?.filter(book => book.category === 'self-help') || [];
    const business = allAudiobooks?.filter(book => book.category === 'business') || [];
    const relationships = allAudiobooks?.filter(book => book.category === 'relationships') || [];

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <Headphones className="h-10 w-10 text-brand-red" />
                        <h1 className="text-4xl sm:text-5xl font-black">
                            AUDIOBOOKS
                        </h1>
                    </div>
                    <p className="text-lg text-muted-foreground max-w-2xl">
                        Dive deep into transformative content with exclusive audiobooks
                        narrated by Andrew Kibe. Real wisdom, raw truth, rare insights.
                    </p>
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    <StatCard
                        icon={<BookOpen className="h-5 w-5" />}
                        label="Total Books"
                        value={allAudiobooks?.length || 0}
                    />
                    <StatCard
                        icon={<Clock className="h-5 w-5" />}
                        label="Listening Hours"
                        value="120+"
                    />
                    <StatCard
                        icon={<Star className="h-5 w-5" />}
                        label="Premium Content"
                        value={allAudiobooks?.filter(b => b.is_premium).length || 0}
                    />
                    <StatCard
                        icon={<Headphones className="h-5 w-5" />}
                        label="Active Listeners"
                        value="5K+"
                    />
                </div>

                {/* Featured Section */}
                {featured.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <Star className="h-6 w-6 text-yellow-500" />
                            Featured Audiobooks
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {featured.map((book) => (
                                <AudiobookCard key={book.id} book={book} featured />
                            ))}
                        </div>
                    </div>
                )}

                {/* Categories Tabs */}
                <Tabs defaultValue="all" className="w-full">
                    <TabsList className="mb-8 bg-muted/30">
                        <TabsTrigger value="all">
                            All Books ({allAudiobooks?.length || 0})
                        </TabsTrigger>
                        <TabsTrigger value="self-help">
                            Self-Help ({selfHelp.length})
                        </TabsTrigger>
                        <TabsTrigger value="business">
                            Business ({business.length})
                        </TabsTrigger>
                        <TabsTrigger value="relationships">
                            Relationships ({relationships.length})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="all">
                        <AudiobookGrid books={allAudiobooks || []} />
                    </TabsContent>

                    <TabsContent value="self-help">
                        <AudiobookGrid books={selfHelp} />
                    </TabsContent>

                    <TabsContent value="business">
                        <AudiobookGrid books={business} />
                    </TabsContent>

                    <TabsContent value="relationships">
                        <AudiobookGrid books={relationships} />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
    return (
        <Card className="bg-muted/30 border-muted">
            <CardContent className="p-4 flex items-center gap-3">
                <div className="text-brand-red">{icon}</div>
                <div>
                    <div className="text-2xl font-bold">{value}</div>
                    <div className="text-xs text-muted-foreground">{label}</div>
                </div>
            </CardContent>
        </Card>
    );
}

function AudiobookGrid({ books }: { books: any[] }) {
    if (books.length === 0) {
        return (
            <div className="text-center py-12">
                <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No audiobooks in this category yet.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map((book) => (
                <AudiobookCard key={book.id} book={book} />
            ))}
        </div>
    );
}
