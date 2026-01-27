import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { CartProvider } from "@/context/CartContext";
import { UserProvider } from "@/context/UserContext";
import SkipLink from "@/components/ui/SkipLink";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://reach-store.com';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "REACH | Premium Badminton Equipment - Worldwide Shipping",
    template: "%s | REACH Badminton"
  },
  description: "Shop premium badminton equipment from Thailand. Professional rackets, shoes, sportswear with international shipping. Free shipping on orders over $250.",
  keywords: [
    "badminton", "badminton racket", "badminton shoes", "badminton equipment",
    "professional badminton", "REACH badminton", "Thailand badminton store",
    "international badminton shop", "buy badminton online", "premium rackets"
  ],
  authors: [{ name: "REACH Pro Store" }],
  creator: "REACH",
  publisher: "REACH Pro Store",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["th_TH"],
    url: baseUrl,
    siteName: "REACH Badminton",
    title: "REACH | Premium Badminton Equipment",
    description: "Shop premium badminton equipment from Thailand. Professional rackets, shoes, and sportswear with worldwide shipping.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "REACH Badminton - Premium Equipment"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "REACH | Premium Badminton Equipment",
    description: "Shop premium badminton equipment from Thailand with worldwide shipping.",
    images: ["/og-image.jpg"]
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
  alternates: {
    canonical: baseUrl,
    languages: {
      'en': baseUrl,
      'th': `${baseUrl}?lang=th`,
    },
  },
  verification: {
    // Add these when you have the verification codes
    // google: 'verification_token',
    // yandex: 'verification_token',
    // bing: 'verification_token',
  },
  category: 'ecommerce',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.jpg" type="image/jpeg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${inter.variable} antialiased bg-brand-black`}
      >
        <SkipLink />
        <ErrorBoundary>
          <LanguageProvider>
            <UserProvider>
              <CartProvider>
                {children}
              </CartProvider>
            </UserProvider>
          </LanguageProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
