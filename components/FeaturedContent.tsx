// components/FeaturedContent.tsx
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Database } from '@/types/database.types'

type FeaturedContent = Database['public']['Tables']['featured_content']['Row'];

interface FeaturedContentProps {
    items: FeaturedContent[] | undefined;
    isLoading?: boolean;
}

export function FeaturedContent({ items, isLoading }: FeaturedContentProps) {
    if (isLoading) {
        return (
            <section className="bg-background py-16 lg:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Skeleton className="h-12 w-full max-w-md mx-auto mb-12" />
                    <Skeleton className="h-96 w-full" />
                </div>
            </section>
        );
    }

    // Handle undefined or empty items
    if (!items || items.length === 0) {
        return null; // Or show default content
    }

    const groupedByTab = items.reduce((acc, item) => {
        if (!acc[item.tab_name]) {
            acc[item.tab_name] = [];
        }
        acc[item.tab_name].push(item);
        return acc;
    }, {} as Record<string, FeaturedContent[]>);

    const tabs = Object.keys(groupedByTab);
    const defaultTab = tabs[0] || 'book';

    return (
        <section className="bg-background py-16 lg:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Tabs defaultValue={defaultTab} className="w-full">
                    <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-12">
                        {tabs.map((tab) => (
                            <TabsTrigger key={tab} value={tab}>
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {tabs.map((tab) => (
                        <TabsContent key={tab} value={tab} className="space-y-8">
                            {groupedByTab[tab].map((item) => (
                                <div key={item.id} className="grid lg:grid-cols-2 gap-12 items-center">
                                    <div className="relative h-[300px] lg:h-[400px]">
                                        <div className="absolute inset-0 bg-gradient-to-br from-brand-red/30 to-muted rounded-2xl transform -rotate-3 blur-sm"></div>
                                        <Card className="absolute inset-0 border-brand-red/20 flex items-center justify-center transform rotate-2 hover:rotate-0 transition-transform duration-300">
                                            <CardContent className="p-2">
                                                {item.image_url ? (
                                                    <img
                                                        src={item.image_url}
                                                        alt={item.title}
                                                        className="w-full h-auto object-cover rounded-lg"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                                        No Image
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <h2 className="text-4xl lg:text-5xl font-black mb-4">
                                                {item.title}
                                            </h2>
                                            {item.subtitle && (
                                                <p className="text-brand-red text-xl font-semibold mb-6">
                                                    {item.subtitle}
                                                </p>
                                            )}
                                        </div>

                                        {item.description && (
                                            <p className="text-muted-foreground text-lg leading-relaxed">
                                                {item.description}
                                            </p>
                                        )}

                                        <div className="flex flex-wrap gap-4">
                                            {item.button_text && item.button_url && (
                                                <Button size="lg" className="bg-brand-red hover:bg-brand-red-muted" asChild>
                                                    <a href={item.button_url}>
                                                        {item.button_text}
                                                        {item.price && ` - ${item.currency} ${item.price}`}
                                                    </a>
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </section>
    )
}
