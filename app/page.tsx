// app/page.tsx
'use client';

import { SiteHeader } from '@/components/Header';
import { SiteFooter } from '@/components/Footer';
import { HeroSection } from '@/components/Hero';
import { FeaturedContent } from '@/components/FeaturedContent';
import { MerchandiseSection } from '@/components/MerchSection';
import { TourSection } from '@/components/Tours';
import { LivestreamSection } from '@/components/LiveStream';
import { NewsletterCTA } from '@/components/Newsletter';
import { useFeaturedProducts } from '@/lib/hooks/use-products';
import { useReplays, useCurrentLive } from '@/lib/hooks/use-livestreams';
import { useUpcomingTourDates } from '@/lib/hooks/use-tour-dates';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/client';

export default function Home() {
  // Fetch all data using hooks
  const { data: products, isLoading: productsLoading } = useFeaturedProducts(4);
  const { data: currentLive } = useCurrentLive();
  const { data: livestreams, isLoading: livestreamsLoading } = useReplays(3);
  const { data: tourDates, isLoading: tourLoading } = useUpcomingTourDates();

  // Fetch featured content
  const { data: featuredContent, isLoading: featuredLoading } = useQuery({
    queryKey: ['featured-content'],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('featured_content')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  // Get the latest replay for hero section
  const latestReplay = livestreams && livestreams.length > 0 ? livestreams[0] : null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <HeroSection currentLive={currentLive} latestReplay={latestReplay} />
      <FeaturedContent
        items={featuredContent || []}
        isLoading={featuredLoading}
      />
      <MerchandiseSection
        products={products || []}
        isLoading={productsLoading}
      />
      <TourSection
        tourDates={tourDates || []}
        isLoading={tourLoading}
      />
      <LivestreamSection
        livestreams={livestreams || []}
        isLoading={livestreamsLoading}
      />
      <NewsletterCTA />
    </div>
  )
}
