import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getAllSites } from '@/lib/storage';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'fallback-used';
    const hasServiceKey = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
    const hasAnonKey = Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

    const { data, error } = await supabaseAdmin
      .from('stores')
      .select('id, slug, is_active, created_at')
      .order('created_at', { ascending: false });

    const allSites = await getAllSites();

    return NextResponse.json({
      env: {
        isVercel: Boolean(process.env.VERCEL),
        supabaseUrl,
        hasServiceKey,
        hasAnonKey,
      },
      directQuery: {
        error: error ? { message: error.message, code: error.code, details: error.details } : null,
        count: data?.length || 0,
        slugs: data?.map(d => ({ slug: d.slug, is_active: d.is_active })) || [],
      },
      allSites: {
        count: allSites.length,
        slugs: allSites.map(s => s.slug),
      }
    });
  } catch (err: any) {
    return NextResponse.json({
      error: err.message,
      stack: err.stack,
    }, { status: 500 });
  }
}
