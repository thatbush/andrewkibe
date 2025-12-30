// components/MerchSection.tsx
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Database } from "@/types/database.types";

type Product = Database['public']['Tables']['products']['Row'];

interface MerchandiseSectionProps {
    products: Product[];
    isLoading?: boolean;
}

export function MerchandiseSection({ products, isLoading }: MerchandiseSectionProps) {
    if (isLoading) {
        return (
            <section className="bg-background py-16 lg:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <Skeleton className="h-12 w-64 mb-2" />
                            <Skeleton className="h-6 w-48" />
                        </div>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <Skeleton key={i} className="h-96" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (!products || products.length === 0) {
        return (
            <section className="bg-background py-16 lg:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl lg:text-5xl font-black mb-4">SHOP MERCHANDISE</h2>
                    <p className="text-muted-foreground">No products available at the moment. Check back soon!</p>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-background py-16 lg:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h2 className="text-4xl lg:text-5xl font-black mb-2">SHOP MERCHANDISE</h2>
                        <p className="text-muted-foreground">Exclusive AK gear and collectibles</p>
                    </div>
                    <Button variant="ghost" asChild className="text-brand-red hover:text-brand-red hidden sm:flex">
                        <Link href="/shop">
                            View All →
                        </Link>
                    </Button>
                </div>

                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full"
                >
                    <CarouselContent className="-ml-2 md:-ml-4">
                        {products.map((product) => (
                            <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                                <Card className="bg-card border-brand-red/10 hover:border-brand-red/30 transition-all group overflow-hidden h-full">
                                    <div className="relative h-64 bg-muted overflow-hidden">
                                        {product.image_url ? (
                                            <Image
                                                src={product.image_url}
                                                alt={product.name}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                                No Image
                                            </div>
                                        )}
                                    </div>
                                    <CardHeader className="space-y-2">
                                        <Badge variant="outline" className="w-fit border-brand-red/30 text-brand-red">
                                            {product.category}
                                        </Badge>
                                        <CardTitle className="text-lg line-clamp-1">{product.name}</CardTitle>
                                        <CardDescription className="text-sm line-clamp-2">
                                            {product.description}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardFooter className="flex flex-col gap-3 pt-0">
                                        <div className="w-full">
                                            <span className="text-2xl text-brand-red font-bold">
                                                {product.currency} {product.price.toLocaleString()}
                                            </span>
                                        </div>
                                        <Button
                                            size="sm"
                                            className="w-full bg-brand-red hover:bg-brand-red-muted"
                                            disabled
                                        >
                                            Coming Soon
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="hidden md:flex -left-12 bg-card border-brand-red/30 hover:bg-brand-red hover:text-brand-red-foreground" />
                    <CarouselNext className="hidden md:flex -right-12 bg-card border-brand-red/30 hover:bg-brand-red hover:text-brand-red-foreground" />
                </Carousel>

                <div className="flex justify-center mt-6 sm:hidden">
                    <Button variant="outline" asChild className="border-brand-red/40 text-brand-red hover:bg-brand-red/10">
                        <Link href="/shop">
                            View All Products →
                        </Link>
                    </Button>
                </div>

                <div className="mt-12 text-center">
                    <p className="text-muted-foreground text-sm mb-2">
                        For orders and inquiries:
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 text-sm">
                        <a
                            href="https://wa.me/254712915936"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand-red hover:text-brand-red-muted transition-colors"
                        >
                            WhatsApp: +254 712 915 936
                        </a>
                        <span className="text-muted-foreground">•</span>
                        <a
                            href="tel:+254718721490"
                            className="text-brand-red hover:text-brand-red-muted transition-colors"
                        >
                            Call: +254 718 721 490
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}
