import { NextRequest, NextResponse } from 'next/server';
import {
  validateSubdomainFormat,
  isSubdomainReserved,
  generateAvailableAlternatives,
  RESERVED_SUBDOMAINS
} from '@/lib/subdomain';
import { getSiteBySlug } from '@/lib/storage';

// Blazing-fast in-memory cache for live keystroke checking (TTL: 30 seconds)
const slugCheckCache = new Map<string, { res: any; timestamp: number }>();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug') || '';
    const siteId = searchParams.get('siteId') || '';

    // 1. Syntax & RFC 1035 check
    const formatCheck = validateSubdomainFormat(slug);
    if (!formatCheck.valid) {
      return NextResponse.json(
        {
          available: false,
          reason: 'invalid_format',
          message: formatCheck.reason
        },
        { status: 400 }
      );
    }

    const cleanSlug = slug.toLowerCase().trim();
    const cacheKey = `${cleanSlug}__${siteId}`;

    const cached = slugCheckCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < 30000) {
      return NextResponse.json(cached.res);
    }

    // 2. Check reserved names
    if (isSubdomainReserved(cleanSlug)) {
      const reservedInfo = RESERVED_SUBDOMAINS[cleanSlug];
      const payload = {
        available: false,
        reason: 'reserved',
        message: `The subdomain "${cleanSlug}.linkal.in" is reserved (${reservedInfo.note}).`,
        suggestions: generateAvailableAlternatives(cleanSlug)
      };
      slugCheckCache.set(cacheKey, { res: payload, timestamp: Date.now() });
      return NextResponse.json(payload);
    }

    // 3. Check existing registered storefronts / sites
    const existingSite = await getSiteBySlug(cleanSlug);
    if (existingSite && existingSite.id !== siteId) {
      const payload = {
        available: false,
        reason: 'taken',
        message: `The subdomain "${cleanSlug}.linkal.in" is already in use by another website.`,
        suggestions: generateAvailableAlternatives(cleanSlug)
      };
      slugCheckCache.set(cacheKey, { res: payload, timestamp: Date.now() });
      return NextResponse.json(payload);
    }

    // 4. Subdomain is fully available
    const payload = {
      available: true,
      subdomain: `${cleanSlug}.linkal.in`,
      slug: cleanSlug
    };
    slugCheckCache.set(cacheKey, { res: payload, timestamp: Date.now() });
    return NextResponse.json(payload);
  } catch (error: any) {
    return NextResponse.json(
      { available: false, error: error.message || 'Internal error' },
      { status: 500 }
    );
  }
}

