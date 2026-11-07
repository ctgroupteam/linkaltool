import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    let users: any[] = [];

    // 1. Try Supabase users table
    try {
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (data && data.length > 0) {
        users = data;
      }
    } catch {}

    // 2. Fallback to local users storage if exists
    if (users.length === 0) {
      const candidates = [
        path.join(process.cwd(), 'data', 'users.json'),
        path.join(process.cwd(), 'Linkal Tool', 'data', 'users.json'),
        path.join('/tmp', 'users.json')
      ];
      for (const c of candidates) {
        if (fs.existsSync(c)) {
          try {
            const raw = fs.readFileSync(c, 'utf8');
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length > 0) {
              users = parsed;
              break;
            }
          } catch {}
        }
      }
    }

    return NextResponse.json({ success: true, users });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message, users: [] }, { status: 500 });
  }
}
