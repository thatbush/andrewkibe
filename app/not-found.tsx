import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ChevronDown, Home, Construction } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <div className="max-w-2xl w-full space-y-8 text-center">
                {/* Main 404 Content */}
                <div className="space-y-4">

                    <h1 className="text-8xl font-black">404</h1>

                    <h2 className="text-3xl font-bold">
                        Page not available... yet
                    </h2>

                    <p className="text-muted-foreground text-lg max-w-md mx-auto">
                        This page is probably still in development.
                        Check back soon or return to the homepage.
                    </p>
                </div>

                {/* Action Button */}
                <div className="flex justify-center">
                    <Button asChild size="lg" className="bg-brand-red hover:bg-brand-red-muted">
                        <Link href="/">
                            Go Home
                        </Link>
                    </Button>
                </div>

                {/* Hidden Owner Section */}
                <div className="pt-8">
                    <Collapsible className="w-full">
                        <CollapsibleTrigger className="flex items-center justify-center w-full text-sm text-muted-foreground hover:text-foreground transition-colors group">
                            <span className="mr-2">Is this a mistake?</span>
                            <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                        </CollapsibleTrigger>

                        <CollapsibleContent className="pt-4">
                            <Card className="border-brand-red/20">
                                <CardContent className="pt-6 space-y-4">
                                    <div className="space-y-2">
                                        <h3 className="font-semibold text-lg">
                                            Are you the site owner?
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            If you believe this page should exist or there's an error with the routing,
                                            please contact our support team. We'll be happy to help.
                                        </p>
                                    </div>

                                    <Button
                                        asChild
                                        variant="outline"
                                        className="w-full border-brand-red/40 text-brand-red hover:bg-brand-red/10"
                                    >
                                        <a href="mailto:support@menengai.cloud">
                                            Contact Support
                                        </a>
                                    </Button>

                                    <p className="text-xs text-muted-foreground">
                                        We'll only accept emails from the site owner's registered email address.
                                    </p>
                                </CardContent>
                            </Card>
                        </CollapsibleContent>
                    </Collapsible>
                </div>
            </div>
        </div>
    )
}
