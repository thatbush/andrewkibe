// app/contact/page.tsx
import { ContactForm } from '@/components/contact/ContactForm';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Phone, Instagram, Facebook, Twitter, Youtube } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
    title: 'Contact AK Media',
    description: 'Get in touch with Andrew Kibe for bookings, collaborations, and inquiries.',
};

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl sm:text-5xl font-black mb-4">
                        GET IN TOUCH
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Have a question, business inquiry, or want to collaborate?
                        Reach out and let's make something happen.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contact Form - 2 columns */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardContent className="p-6">
                                <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
                                <ContactForm />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Contact Info & Socials - 1 column */}
                    <div className="space-y-6">
                        {/* Direct Contact */}
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="text-xl font-bold mb-4">Direct Contact</h3>
                                <div className="space-y-4">
                                    <a
                                        href="mailto:kaguius@gmail.com"
                                        className="flex items-center gap-3 text-muted-foreground hover:text-brand-red transition-colors"
                                    >
                                        <Mail className="h-5 w-5" />
                                        <span className="text-sm">kaguius@gmail.com</span>
                                    </a>
                                    <a
                                        href="tel:+254712915936"
                                        className="flex items-center gap-3 text-muted-foreground hover:text-brand-red transition-colors"
                                    >
                                        <Phone className="h-5 w-5" />
                                        <span className="text-sm">+254 712 915 936</span>
                                    </a>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Social Media */}
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="text-xl font-bold mb-4">Follow Kibe</h3>
                                <div className="space-y-3">
                                    <SocialLink
                                        href="https://www.instagram.com/kibeandy/"
                                        icon={<Instagram className="h-5 w-5" />}
                                        label="Instagram"
                                        handle="@kibeandy"
                                        followers="431K"
                                    />
                                    <SocialLink
                                        href="https://www.facebook.com/realkibeandy/"
                                        icon={<Facebook className="h-5 w-5" />}
                                        label="Facebook"
                                        handle="@realkibeandy"
                                        followers="820K"
                                    />
                                    <SocialLink
                                        href="https://x.com/kibeandy"
                                        icon={<Twitter className="h-5 w-5" />}
                                        label="X (Twitter)"
                                        handle="@kibeandy"
                                    />
                                    <SocialLink
                                        href="https://www.youtube.com/@AndrewKibe"
                                        icon={<Youtube className="h-5 w-5" />}
                                        label="YouTube"
                                        handle="Andrew Kibe"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Business Hours */}
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="text-xl font-bold mb-4">Response Time</h3>
                                <p className="text-sm text-muted-foreground">
                                    We typically respond to inquiries within 24-48 hours during business days.
                                    For urgent matters, please call directly.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SocialLink({
    href,
    icon,
    label,
    handle,
    followers
}: {
    href: string;
    icon: React.ReactNode;
    label: string;
    handle: string;
    followers?: string;
}) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors group"
        >
            <div className="flex items-center gap-3">
                <div className="text-muted-foreground group-hover:text-brand-red transition-colors">
                    {icon}
                </div>
                <div>
                    <div className="text-sm font-medium">{label}</div>
                    <div className="text-xs text-muted-foreground">{handle}</div>
                </div>
            </div>
            {followers && (
                <div className="text-xs text-muted-foreground">
                    {followers}
                </div>
            )}
        </a>
    );
}
