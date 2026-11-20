import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getAllSites } from '@/lib/storage';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const urls: Array<{ loc: string; lastmod: string; changefreq: string; priority: string }> = [
      {
        loc: 'https://studio.linkal.in/',
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'daily',
        priority: '1.0',
      },
    ];

    // 1. Fetch static sites from free CVs
    const baseDirs = [
      path.join(process.cwd(), 'free CVs'),
      path.join(process.cwd(), 'public', 'free-cvs'),
    ];
    const seenSlugs = new Set<string>();

    for (const bDir of baseDirs) {
      if (fs.existsSync(bDir)) {
        try {
          const entries = fs.readdirSync(bDir, { withFileTypes: true });
          for (const ent of entries) {
            if (ent.isDirectory()) {
              const s = ent.name.toLowerCase();
              if (!seenSlugs.has(s)) {
                seenSlugs.add(s);
                urls.push({
                  loc: `https://${s}.linkal.in/`,
                  lastmod: new Date().toISOString().split('T')[0],
                  changefreq: 'weekly',
                  priority: '0.9',
                });
              }
            }
          }
        } catch {}
      }
    }

    // 2. Fetch all active customer stores from Supabase
    try {
      const { data: stores } = await supabaseAdmin
        .from('stores')
        .select('slug, updated_at, is_active')
        .eq('is_active', true);

      if (stores && Array.isArray(stores)) {
        for (const store of stores) {
          const s = (store.slug || '').toLowerCase().trim();
          if (s && !seenSlugs.has(s)) {
            seenSlugs.add(s);
            const dateStr = store.updated_at ? store.updated_at.split('T')[0] : new Date().toISOString().split('T')[0];
            urls.push({
              loc: `https://${s}.linkal.in/`,
              lastmod: dateStr,
              changefreq: 'daily',
              priority: '0.95',
            });
          }
        }
      }
    } catch (sbErr) {
      console.warn('[Sitemap] Supabase query error:', sbErr);
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

    return new Response(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error: any) {
    return new Response(`<error>${error.message}</error>`, {
      status: 500,
      headers: { 'Content-Type': 'application/xml' },
    });
  }
}

