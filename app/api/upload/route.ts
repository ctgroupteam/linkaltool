import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { base64, filename, siteSlug } = body;

    if (!base64 || !filename) {
      return NextResponse.json(
        { error: 'Image base64 data and filename are required' },
        { status: 400 }
      );
    }

    // Clean base64 data
    const cleanBase64 = base64.includes(',') ? base64.split(',')[1] : base64;
    const cleanFilename = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const mimeMatch = base64.match(/^data:([^;]+);base64,/);
    const contentType = mimeMatch ? mimeMatch[1] : 'image/webp';

    // 1. Primary: Save to Supabase Storage "uploads" bucket (Zero GitHub calls, Instant CDN URL)
    try {
      const buffer = Buffer.from(cleanBase64, 'base64');
      const { data, error } = await supabaseAdmin.storage
        .from('uploads')
        .upload(cleanFilename, buffer, {
          contentType,
          upsert: true,
        });

      if (!error && data) {
        const { data: publicData } = supabaseAdmin.storage
          .from('uploads')
          .getPublicUrl(cleanFilename);

        if (publicData?.publicUrl) {
          console.log(`[Upload] Image saved to Supabase Storage: ${publicData.publicUrl}`);
          return NextResponse.json({
            success: true,
            url: publicData.publicUrl,
            rawUrl: publicData.publicUrl,
            dataUrl: base64,
            filename: cleanFilename,
          });
        }
      } else if (error) {
        console.warn('[Upload] Supabase Storage upload note:', error.message);
      }
    } catch (err: any) {
      console.warn('[Upload] Supabase Storage exception fallback:', err.message);
    }

    // 2. Fallback to high-efficiency WebP data URL
    return NextResponse.json({
      success: true,
      url: base64,
      dataUrl: base64,
      filename: cleanFilename,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Image upload failed' },
      { status: 500 }
    );
  }
}
