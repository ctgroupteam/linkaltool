import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getAllSites, saveSite } from '@/lib/storage';
import fs from 'fs';
import path from 'path';
import os from 'os';

export async function GET() {
  try {
    let users: any[] = [];

    // 1. Try Supabase users table
    try {
      const { data } = await supabaseAdmin
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

    // 2. Fallback to local disk / tmp
    const candidates = [
      path.join(process.cwd(), 'data', 'users.json'),
      path.join(process.cwd(), 'Linkal Tool', 'data', 'users.json'),
      path.join(os.tmpdir(), 'users.json'),
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = (body.email || '').toLowerCase().trim();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const cleanPhone = (body.phoneNumber || body.phone_number || '').replace(/\D/g, '');
    const cleanName = (body.fullName || body.full_name || '').trim();
    const avatarUrl = body.avatarUrl || body.avatar_url || '';

    // 1. Update local users.json files
    const userCandidates = [
      path.join(process.cwd(), 'data', 'users.json'),
      path.join(process.cwd(), 'Linkal Tool', 'data', 'users.json'),
      path.join(os.tmpdir(), 'users.json'),
    ];

    let targetUser: any = null;

    for (const uc of userCandidates) {
      try {
        let users: any[] = [];
        if (fs.existsSync(uc)) {
          const raw = fs.readFileSync(uc, 'utf8');
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) users = parsed;
        }

        const idx = users.findIndex((u: any) => (u.email || '').toLowerCase().trim() === email);
        if (idx !== -1) {
          if (cleanPhone) users[idx].phone_number = cleanPhone;
          if (cleanName) users[idx].full_name = cleanName;
          if (avatarUrl) users[idx].avatar_url = avatarUrl;
          targetUser = users[idx];
        } else {
          targetUser = {
            id: `usr-${Date.now()}`,
            email,
            full_name: cleanName || email.split('@')[0],
            phone_number: cleanPhone,
            avatar_url: avatarUrl,
            created_at: new Date().toISOString()
          };
          users.unshift(targetUser);
        }

        // Ensure parent dir exists
        const dir = path.dirname(uc);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(uc, JSON.stringify(users, null, 2), 'utf8');
      } catch {}
    }

    // 2. Update Supabase users table
    try {
      if (cleanPhone) {
        await supabaseAdmin
          .from('users')
          .update({
            phone_number: cleanPhone,
            ...(cleanName ? { full_name: cleanName } : {}),
            ...(avatarUrl ? { avatar_url: avatarUrl } : {})
          })
          .eq('email', email);
      }
    } catch {}

    // 3. Automatically sync this phone number to ALL sites created by this user!
    if (cleanPhone) {
      try {
        const allSites = await getAllSites();
        const userSites = allSites.filter(s => (s.userEmail || '').toLowerCase().trim() === email);
        for (const s of userSites) {
          let modified = false;
          if (s.whatsappNumber !== cleanPhone) {
            s.whatsappNumber = cleanPhone;
            modified = true;
          }
          if (s.cvPhone !== cleanPhone) {
            s.cvPhone = cleanPhone;
            modified = true;
          }
          if (cleanName && s.userName !== cleanName) {
            s.userName = cleanName;
            modified = true;
          }
          if (modified) {
            await saveSite(s);
          }
        }
      } catch (siteErr) {
        console.warn('[User Phone Sync to Sites Note]', siteErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Phone number and user profile saved and applied across all sites',
      user: {
        id: targetUser?.id || `usr-${Date.now()}`,
        email,
        fullName: cleanName || targetUser?.full_name || email.split('@')[0],
        phoneNumber: cleanPhone,
        avatarUrl: avatarUrl || targetUser?.avatar_url || ''
      }
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
