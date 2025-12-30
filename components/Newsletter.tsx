import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterCTA() {
    return (
        <section className="py-16">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-4xl font-black mb-4 text-brand-red-foreground">STAY IN THE LOOP</h2>
                <p className="text-brand-red-foreground/80 text-lg mb-8">
                    Get exclusive updates, early access to content, and special offers delivered straight to your inbox.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                    <Input
                        type="email"
                        placeholder="Enter your email"
                        className="flex-1 bg-background border-brand-red-foreground/20 placeholder:text-muted-foreground focus-visible:ring-brand-red-foreground"
                    />
                    <Button size="lg" className="bg-background hover:bg-muted text-foreground">
                        Subscribe
                    </Button>
                </div>
            </div>
        </section>
    )
}
