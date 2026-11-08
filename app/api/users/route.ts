import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';
import os from 'os';

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
        users = data.map((u: any) => ({
          id: u.id,
          email: u.email,
          fullName: u.full_name || u.fullName,
          phoneNumber: u.phone_number || u.phoneNumber,
          avatarUrl: u.avatar_url || u.avatarUrl,
          createdAt: u.created_at || u.createdAt
        }));
        return NextResponse.json({ success: true, users });
      }
    } catch {}

    // 2. Fetch from remote GitHub data/users.json
    try {
      const token = process.env.GITHUB_TOKEN;
      if (!token) throw new Error('No GitHub token');
      const url = `https://api.github.com/repos/ctgroupteam/linkaltool/contents/data/users.json`;
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
          'User-Agent': 'Linkal-Website-Builder'
        },
        cache: 'no-store'
      });
      if (res.ok) {
        const ghData = await res.json();
        if (ghData && ghData.content) {
          const content = Buffer.from(ghData.content, 'base64').toString('utf-8');
          const parsed = JSON.parse(content);
          if (Array.isArray(parsed) && parsed.length > 0) {
            users = parsed;
            return NextResponse.json({ success: true, users });
          }
        }
      }
    } catch {}

    // 3. Fallback to local disk / tmp
    const candidates = [
      path.join(os.tmpdir(), 'users.json'),
      path.join(process.cwd(), 'data', 'users.json'),
      path.join(process.cwd(), 'Linkal Tool', 'data', 'users.json'),
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

    return NextResponse.json({ success: true, users });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message, users: [] }, { status: 500 });
  }
}
