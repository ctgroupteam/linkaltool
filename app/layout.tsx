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
  title: 'Linkal Studio — Instant Website Builder & Storefront Creator',
  description: 'Pure SaaS visual website builder, digital QR menu generator, and executive CV maker under custom .linkal.in subdomains.',
  manifest: '/manifest.json',
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
    <html lang="en" className={jakarta.variable}>
      <head>
        <script src="https://accounts.google.com/gsi/client" async defer></script>
      </head>
      <body className="min-h-screen bg-white text-zinc-950 antialiased selection:bg-zinc-900 selection:text-white">
        {children}
        <PwaInstallPrompt />
      </body>
    </html>
  );
}
