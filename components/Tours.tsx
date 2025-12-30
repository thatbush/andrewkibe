// components/Tours.tsx
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Database } from "@/types/database.types";
import { format } from "date-fns";

type TourDate = Database['public']['Tables']['tour_dates']['Row'];

interface TourSectionProps {
    tourDates: TourDate[];
    isLoading?: boolean;
}

export function TourSection({ tourDates, isLoading }: TourSectionProps) {
    if (isLoading) {
        return (
            <section className="bg-gradient-to-br from-brand-red-subtle to-background py-16 lg:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12">
                        <div className="space-y-4">
                            <Skeleton className="h-8 w-48" />
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-24 w-full" />
                        </div>
                        <Skeleton className="h-96" />
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-background py-16 lg:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-4xl lg:text-5xl font-black mb-6">
                            BOOK YOUR TOUR EXPERIENCE
                        </h2>
                        <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                            Experience book signings, real talks, and unfiltered conversations across Kenya.
                            Secure your spot at the most transformative event of 2025.
                        </p>

                        <div className="space-y-3 mb-8">
                            {tourDates && tourDates.length > 0 ? (
                                tourDates.map((date) => (
                                    <div key={date.id} className="flex items-center justify-between p-4 bg-card rounded-lg border border-border hover:border-brand-red/30 transition-colors">
                                        <div>
                                            <div className="font-bold text-lg">{date.city}</div>
                                            <div className="text-sm text-muted-foreground">
                                                {format(new Date(date.event_date), 'MMM d, yyyy')}
                                            </div>
                                        </div>
                                        {date.status === 'sold-out' ? (
                                            <Badge variant="destructive">Sold Out</Badge>
                                        ) : date.status === 'selling-fast' ? (
                                            <Badge className="bg-chart-4">Selling Fast</Badge>
                                        ) : (
                                            <Button size="sm" className="bg-brand-red hover:bg-brand-red-muted">
                                                <Calendar className="mr-2 h-4 w-4" />
                                                Book Now
                                            </Button>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted-foreground text-center py-8">
                                    No upcoming tour dates. Check back soon!
                                </p>
                            )}
                        </div>

                        <Button size="lg" variant="outline" className="border-brand-red/40 hover:bg-brand-red/10">
                            View Full Tour Schedule
                        </Button>
                    </div>

                    <Card className="w-full h-full">
                        <img src="/images/tour-image.webp" alt="Tour" className="w-full h-full object-cover" />
                    </Card>
                </div>
            </div>
        </section>
    )
}
