import { NextRequest, NextResponse } from 'next/server';
import {
  validateSubdomainFormat,
  isSubdomainReserved,
  generateAvailableAlternatives,
  RESERVED_SUBDOMAINS
} from '@/lib/subdomain';
import { getSiteBySlug } from '@/lib/storage';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug') || '';

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

    // 2. Check reserved names
    if (isSubdomainReserved(cleanSlug)) {
      const reservedInfo = RESERVED_SUBDOMAINS[cleanSlug];
      return NextResponse.json({
        available: false,
        reason: 'reserved',
        message: `The subdomain "${cleanSlug}.linkal.in" is reserved (${reservedInfo.note}).`,
        suggestions: generateAvailableAlternatives(cleanSlug)
      });
    }

    // 3. Check existing registered storefronts / sites
    const existingSite = await getSiteBySlug(cleanSlug);
    if (existingSite) {
      return NextResponse.json({
        available: false,
        reason: 'taken',
        message: `The subdomain "${cleanSlug}.linkal.in" is already in use by another website.`,
        suggestions: generateAvailableAlternatives(cleanSlug)
      });
    }

    // 4. Subdomain is fully available
    return NextResponse.json({
      available: true,
      subdomain: `${cleanSlug}.linkal.in`,
      slug: cleanSlug
    });
  } catch (error: any) {
    return NextResponse.json(
      { available: false, error: error.message || 'Internal error' },
      { status: 500 }
    );
  }
}
