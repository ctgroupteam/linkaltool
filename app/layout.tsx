import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { PwaInstallPrompt } from './components/PwaInstallPrompt';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'Linkal Studio — Instant Website Builder & Storefront Creator',
  description: 'Pure SaaS visual website builder, digital QR menu generator, and executive CV maker under custom .linkal.in subdomains.',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="min-h-screen bg-white text-zinc-950 antialiased selection:bg-zinc-900 selection:text-white">
        {children}
        <PwaInstallPrompt />
      </body>
    </html>
  );
}
