import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getSiteBySlug, saveSite } from '@/lib/storage';
import { generateStaticHtml } from '@/lib/generator';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';


// Helper: Check if slug matches a static student CV in "free CVs"
function getFreeCvHtml(slug: string): string | null {
  try {
    const cleanSlug = slug.toLowerCase().trim();
    const baseDirs = [
      path.join(process.cwd(), 'free CVs'),
      path.join(process.cwd(), 'free-cvs'),
      path.join(process.cwd(), '..', 'free CVs'),
      path.join(process.cwd(), 'public', 'free-cvs'),
    ];

    for (const baseDir of baseDirs) {
      if (!fs.existsSync(baseDir)) continue;

      // 1. Check mapping.json
      const mappingFile = path.join(baseDir, 'mapping.json');
      let targetFolder = cleanSlug;
      if (fs.existsSync(mappingFile)) {
        try {
          const mapping = JSON.parse(fs.readFileSync(mappingFile, 'utf8'));
          if (mapping[cleanSlug]) {
            targetFolder = String(mapping[cleanSlug]);
          }
        } catch {}
      }

      // 2. Direct folder check
      const directPath = path.join(baseDir, targetFolder, 'index.html');
      if (fs.existsSync(directPath)) {
        return fs.readFileSync(directPath, 'utf8');
      }

      // 3. Case-insensitive folder search
      const items = fs.readdirSync(baseDir);
      for (const item of items) {
        if (item.toLowerCase() === targetFolder.toLowerCase()) {
          const subFile = path.join(baseDir, item, 'index.html');
          if (fs.existsSync(subFile)) {
            return fs.readFileSync(subFile, 'utf8');
          }
        }
      }
    }
  } catch (e) {
    console.warn('[Free CV] lookup note:', e);
  }
  return null;
}

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(request: Request, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const cleanSlug = (slug || '').toLowerCase().trim();

    if (!cleanSlug) {
      return new Response(
        `<!DOCTYPE html><html><body style="font-family:sans-serif;text-align:center;padding:50px;"><h1>Invalid Site Subdomain</h1><p>Powered by <a href="https://linkal.in">Linkal AI</a></p></body></html>`,
        { status: 400, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
      );
    }

    // 1. Check if this subdomain is a direct student CV from "free CVs"
    const staticCvHtml = getFreeCvHtml(cleanSlug);
    if (staticCvHtml) {
      return new Response(staticCvHtml, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      });
    }

    // 2. Otherwise look up in Linkal customer database
    const site = await getSiteBySlug(cleanSlug);

    if (!site) {
      return new Response(
        `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Site Not Found | Linkal AI</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #0f172a; color: #f8fafc; }
    .card { background: #1e293b; padding: 40px; border-radius: 16px; max-width: 440px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.3); border: 1px solid #334155; }
    h1 { font-size: 24px; margin-bottom: 12px; }
    p { color: #94a3b8; font-size: 14px; line-height: 1.6; margin-bottom: 24px; }
    .btn { display: inline-block; background: #2563eb; color: #fff; padding: 12px 24px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 14px; transition: background 0.2s; }
    .btn:hover { background: #1d4ed8; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Website Under Construction</h1>
    <p>The subdomain <strong>${cleanSlug}.linkal.in</strong> has not been published yet or is being prepared by its owner.</p>
    <a href="https://linkal.in" class="btn">Create Your Website on Linkal AI &rarr;</a>
  </div>
</body>
</html>`,
        { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
      );
    }

    // Async increment visit counter (fire-and-forget)
    try {
      site.visitsCount = (site.visitsCount || 0) + 1;
      Promise.resolve(saveSite(site)).catch(() => {});
      Promise.resolve(
        supabaseAdmin.from('site_visits').insert({
          slug: cleanSlug,
          visited_at: new Date().toISOString(),
        })
      ).catch(() => {});
    } catch {}

    const html = generateStaticHtml(site);

    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error: any) {
    return new Response(
      `<!DOCTYPE html><html><body><h1>Error rendering site: ${error.message}</h1></body></html>`,
      { status: 500, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }
}

