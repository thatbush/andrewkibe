import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { createClient } from '@/lib/client'
import { AuthProvider } from '@/lib/auth-context'
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Andrew Kibe Media - Unfiltered Truth & Real Talk",
    template: "%s | Andrew Kibe Media"
  },
  description: "Official platform for Andrew Kibe content. Watch livestreams, read the 28 Commandments, shop exclusive merchandise, and book tour experiences. Unfiltered truth, real conversations.",
  keywords: [
    "Andrew Kibe",
    "28 Commandments",
    "Freedom Tour",
    "Kibe livestream",
    "Andrew Kibe merchandise",
    "Kenya podcasts",
    "self-improvement",
    "men's development"
  ],
  authors: [{ name: "Andrew Kibe Media" }],
  creator: "Andrew Kibe",
  publisher: "Andrew Kibe Media",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` :
      'http://localhost:3000'
  ),
  openGraph: {
    title: "Andrew Kibe Media - Unfiltered Truth & Real Talk",
    description: "Official platform for Andrew Kibe content. Watch livestreams, read the 28 Commandments, shop exclusive merchandise, and book tour experiences.",
    url: "/",
    siteName: "Andrew Kibe Media",
    locale: "en_KE",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Andrew Kibe Media",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Andrew Kibe Media - Unfiltered Truth & Real Talk",
    description: "Official platform for Andrew Kibe content. Livestreams, 28 Commandments, merchandise, and tour experiences.",
    creator: "@kibeandy",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.json",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch initial user server-side for auth context
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white cursor-smooth`}
      >
        <AuthProvider initialUser={user}>
          <Providers>
            {children}
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
