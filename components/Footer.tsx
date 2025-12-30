import Link from "next/link";
import { Button } from "@/components/ui/button";

export function SiteFooter() {
    return (
        <footer className="bg-background border-t border-brand-red/30 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                    <div>
                        <h3 className="font-bold mb-4 text-foreground">SHOP</h3>
                        <ul className="space-y-2 text-muted-foreground">
                            <li><Link href="/merchandise" className="hover:text-brand-red transition-colors">Merchandise</Link></li>
                            <li><Link href="/audiobooks" className="hover:text-brand-red transition-colors">Audiobooks</Link></li>
                            <li><Link href="/trainings" className="hover:text-brand-red transition-colors">Trainings</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold mb-4 text-foreground">CONTENT</h3>
                        <ul className="space-y-2 text-muted-foreground">
                            <li><Link href="/live" className="hover:text-brand-red transition-colors">Livestreams</Link></li>
                            <li><Link href="/podcasts" className="hover:text-brand-red transition-colors">Podcasts</Link></li>
                            <li><Link href="/news" className="hover:text-brand-red transition-colors">News</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold mb-4 text-foreground">SUPPORT</h3>
                        <ul className="space-y-2 text-muted-foreground">
                            <li><Link href="/donations" className="hover:text-brand-red transition-colors">Donations</Link></li>
                            <li><Link href="/affiliate" className="hover:text-brand-red transition-colors">Affiliate Program</Link></li>
                            <li><Link href="/contact" className="hover:text-brand-red transition-colors">Contact</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold mb-4 text-foreground">FOLLOW</h3>
                        <ul className="space-y-2 text-muted-foreground">
                            <li><a href="https://youtube.com/@andrewkibe" target="_blank" rel="noopener noreferrer" className="hover:text-brand-red transition-colors">YouTube</a></li>
                            <li><a href="https://x.com/kibeandy" target="_blank" rel="noopener noreferrer" className="hover:text-brand-red transition-colors">Twitter/X</a></li>
                            <li><a href="https://instagram.com/kibeandy" target="_blank" rel="noopener noreferrer" className="hover:text-brand-red transition-colors">Instagram</a></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-brand-red/30 pt-8 text-center text-muted-foreground text-sm">
                    <p>&copy; {new Date().getFullYear()} Andrew Kibe Media. All rights reserved. | Powered by <a href="https://menengai.cloud" target="_blank" rel="noopener noreferrer" className="hover:text-brand-red transition-colors">Menengai Cloud</a></p>
                </div>
            </div>
        </footer>
    )
}
