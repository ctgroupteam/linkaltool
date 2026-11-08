import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const url = request.nextUrl.clone();

  // Extract hostname without port
  const hostname = host.split(':')[0].toLowerCase();

  // Skip system routes, static files, and builder internals
  if (
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/sites') ||
    url.pathname.startsWith('/builder') ||
    url.pathname.startsWith('/dashboard') ||
    url.pathname.startsWith('/deploy') ||
    url.pathname.startsWith('/stats') ||
    url.pathname.startsWith('/login') ||
    url.pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Handle subdomain routing for *.linkal.in
  if (hostname.endsWith('.linkal.in')) {
    const slug = hostname.replace('.linkal.in', '').trim();
    
    // Pass platform & standalone subdomains through untouched
    if (slug === 'studio' || slug === 'www' || slug === 'linkal' || slug === 'turkishzaika' || slug === '') {
      return NextResponse.next();
    }
    
    if (slug === 'admin') {
      return NextResponse.redirect('https://admin.linkal.in');
    }

    // Rewrite customer subdomain request to /sites/[slug]
    url.pathname = `/sites/${slug}`;
    return NextResponse.rewrite(url);
  }

  // Support local development subdomains like test.localhost:3000
  if (hostname.endsWith('.localhost')) {
    const slug = hostname.replace('.localhost', '').trim();
    if (slug && slug !== 'studio') {
      url.pathname = `/sites/${slug}`;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api/|_next/static|_next/image|favicon.ico).*)'],
};

