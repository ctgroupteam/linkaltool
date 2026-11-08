import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { PwaInstallPrompt } from './components/PwaInstallPrompt';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700', '800'],
});

export const viewport: Viewport = {
  themeColor: '#0D1B3E',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'Linkal Studio — Instant Website Builder & Storefront Creator | Linkal',
  description: 'Linkal Studio is India\'s fastest 1-minute visual website builder and digital store creator. Launch branded storefronts, digital QR menus, and CV websites on your own .linkal.in subdomain with direct WhatsApp ordering.',
  keywords: [
    'Linkal',
    'Linkal Studio',
    'Linkal AI',
    'linkal.in',
    'studio.linkal.in',
    'Linkal website builder',
    'Linkal builder',
    'AI website builder India',
    'digital QR menu generator',
    'free website maker',
    'WhatsApp store builder'
  ],
  alternates: {
    canonical: 'https://studio.linkal.in',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://studio.linkal.in',
    title: 'Linkal Studio — Instant Website Builder & Storefront Creator',
    description: 'Launch a branded storefront, digital QR menu, or CV website in 1 minute on custom subdomains with Linkal Studio.',
    siteName: 'Linkal Studio',
    images: [
      {
        url: 'https://linkal.in/linkal.jpeg',
        width: 1200,
        height: 630,
        alt: 'Linkal Studio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Linkal Studio — Instant Website Builder & Storefront Creator',
    description: 'Launch your branded website or digital menu in 1 minute with Linkal Studio.',
    images: ['https://linkal.in/linkal.jpeg'],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Linkal Studio',
  },
  icons: {
    icon: '/linkal.jpeg',
    apple: '/linkal.jpeg',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'application-name': 'Linkal Studio',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} overflow-x-hidden w-full max-w-full`}>
      <head>
        <link rel="icon" href="/linkal.jpeg" type="image/jpeg" />
        <link rel="shortcut icon" href="/linkal.jpeg" type="image/jpeg" />
        <link rel="apple-touch-icon" href="/linkal.jpeg" />
        <script src="https://accounts.google.com/gsi/client" async defer></script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'Linkal Studio',
              alternateName: ['Linkal', 'Linkal AI Studio', 'Linkal Builder', 'Linkal Website Builder'],
              url: 'https://studio.linkal.in/',
              applicationCategory: 'BusinessApplication',
              operatingSystem: 'All',
              browserRequirements: 'Requires JavaScript. Requires HTML5.',
              image: 'https://linkal.in/linkal.jpeg',
              description: 'Linkal Studio is India\'s fastest visual website builder and digital store creator. Launch branded storefronts and digital QR menus in 1 minute.',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'INR',
              },
            }),
          }}
        />
      </head>
      <body className="min-h-screen w-full max-w-full overflow-x-hidden bg-white text-zinc-950 antialiased selection:bg-zinc-900 selection:text-white">
        {children}
        <PwaInstallPrompt />
      </body>
    </html>
  );
}
