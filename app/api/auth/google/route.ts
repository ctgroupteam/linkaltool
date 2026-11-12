import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';
import os from 'os';

// Helper: Sync users database to GitHub ctgroupteam/linkaltool
async function saveUsersToGitHub(users: any[]): Promise<boolean> {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER || 'ctgroupteam';
  const repo = process.env.GITHUB_REPO || 'linkaltool';
  if (!token) return false;

  try {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/data/users.json`;
    let existingSha: string | undefined;
    const checkRes = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'Linkal-Website-Builder',
      },
      cache: 'no-store',
    });
    if (checkRes.ok) {
      const data = await checkRes.json();
      existingSha = data.sha;
    }

    const content = Buffer.from(JSON.stringify(users, null, 2), 'utf-8').toString('base64');
    const putRes = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'User-Agent': 'Linkal-Website-Builder',
      },
      body: JSON.stringify({
        message: `Sync registered users database [${users.length} users]`,
        content,
        sha: existingSha,
      }),
    });

    return putRes.ok;
  } catch (err) {
    console.warn('[Users] Remote GitHub sync note:', err);
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, fullName, googleId, avatarUrl, phoneNumber, password, action } = body;

    // Handle Forgot Password Request
    if (action === 'forgot_password') {
      if (!email && !phoneNumber) {
        return NextResponse.json({ error: 'Please enter your registered Email or WhatsApp Phone' }, { status: 400 });
      }

      // Notify Founder Admin immediately via dual-write to Supabase + Admin Push API
      try {
        await supabaseAdmin.from('admin_notifications').insert({
          id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          event_type: 'forgot_password',
          title: '🔑 Password Assistance Requested',
          body: `User ${fullName || 'Registered User'} (${email || 'No email'}) requested password assistance. Phone: ${phoneNumber || '—'}`,
          user_name: fullName || 'User',
          user_phone: phoneNumber || '',
          user_email: email || '',
          site_slug: '',
          is_read: false,
          created_at: new Date().toISOString(),
        });
      } catch (e) {}

      try {
        await fetch('https://admin.linkal.in/api/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventType: 'forgot_password',
            title: '🔑 Password Assistance Requested',
            body: `User ${fullName || 'Registered User'} (${email || 'No email'}) requested password assistance. Phone: ${phoneNumber || '—'}`,
            userName: fullName || 'User',
            userEmail: email || '',
            userPhone: phoneNumber || '',
          })
        });
      } catch (e) {}

      return NextResponse.json({
        success: true,
        message: 'Password reset request received. Linkal Admin has been notified and will assist you.'
      });
    }

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'A valid email address is required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanName = (fullName || cleanEmail.split('@')[0]).trim();
    const cleanPhone = (phoneNumber || '').trim();

    // 1. Check or Upsert in Supabase 'users' table
    let userRecord: any = null;
    let isNewUser = true;
    try {
      const { data: existingUser, error: selectErr } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('email', cleanEmail)
        .maybeSingle();

      if (existingUser) {
        isNewUser = false;
        if (action === 'signin' && existingUser.password_hash && password) {
          if (existingUser.password_hash !== password) {
            return NextResponse.json({ error: 'Incorrect password. Click "Forgot Password?" for assistance.' }, { status: 401 });
          }
        }

        const { data: updated } = await supabaseAdmin
          .from('users')
          .update({
            full_name: cleanName || existingUser.full_name,
            avatar_url: avatarUrl || existingUser.avatar_url,
            phone_number: cleanPhone || existingUser.phone_number,
            password_hash: password || existingUser.password_hash,
            last_login: new Date().toISOString()
          })
          .eq('id', existingUser.id)
          .select()
          .maybeSingle();

        userRecord = updated || existingUser;
      } else {
        isNewUser = true;
        const newId = `usr-${Date.now()}`;
        const { data: inserted, error: insertErr } = await supabaseAdmin
          .from('users')
          .insert({
            id: newId,
            email: cleanEmail,
            full_name: cleanName,
            google_id: googleId || `google-${Date.now()}`,
            avatar_url: avatarUrl,
            phone_number: cleanPhone,
            password_hash: password || '',
            role: 'user',
            created_at: new Date().toISOString()
          })
          .select()
          .maybeSingle();

        if (inserted) {
          userRecord = inserted;
        }
      }
    } catch (err: any) {
      console.warn('[Auth] Supabase upsert error fallback:', err);
    }

    // Guarantee userRecord is a valid object if Supabase returned null or failed
    if (!userRecord || !userRecord.id) {
      userRecord = {
        id: `usr-${Date.now()}`,
        email: cleanEmail,
        full_name: cleanName,
        phone_number: cleanPhone,
        avatar_url: avatarUrl,
        password_hash: password || '',
        created_at: new Date().toISOString()
      };
    }

    // 2. Persist to local disk and GitHub database
    try {
      const userFile = path.join(os.tmpdir(), 'users.json');
      let currentUsers: any[] = [];
      if (fs.existsSync(userFile)) {
        try { currentUsers = JSON.parse(fs.readFileSync(userFile, 'utf8')); } catch {}
      }
      const existingIdx = currentUsers.findIndex((u: any) => u.email === cleanEmail);
      if (existingIdx !== -1) {
        currentUsers[existingIdx] = { ...currentUsers[existingIdx], ...userRecord };
      } else {
        currentUsers.unshift(userRecord);
      }
      fs.writeFileSync(userFile, JSON.stringify(currentUsers, null, 2), 'utf8');

      // Also save to GitHub ctgroupteam/linkaltool/data/users.json
      saveUsersToGitHub(currentUsers).catch(() => {});
    } catch {}

    // 3. Dispatch Instant Notification to Founder Admin (Dual-Write: Supabase DB + Web Push)
    const eventType = isNewUser ? 'new_user' : 'user_login';
    const notifTitle = isNewUser ? '🎉 New User Registered' : '👤 User Logged In';
    const notifBody = isNewUser
      ? `${cleanName} signed up. Phone: ${cleanPhone || '—'}, Email: ${cleanEmail}`
      : `${cleanName} logged into Linkal Studio. Phone: ${cleanPhone || '—'}, Email: ${cleanEmail}`;

    try {
      await supabaseAdmin.from('admin_notifications').insert({
        id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        event_type: eventType,
        title: notifTitle,
        body: notifBody,
        user_name: cleanName,
        user_phone: cleanPhone,
        user_email: cleanEmail,
        site_slug: '',
        is_read: false,
        created_at: new Date().toISOString(),
      });
    } catch (dbErr) {
      console.warn('[Admin Notif Auth Insert]', dbErr);
    }

    try {
      await fetch('https://admin.linkal.in/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType,
          title: notifTitle,
          body: notifBody,
          userName: cleanName,
          userPhone: cleanPhone,
          userEmail: cleanEmail,
        })
      });
    } catch (e) {}

    return NextResponse.json({
      success: true,
      user: {
        id: userRecord.id,
        email: userRecord.email,
        fullName: userRecord.full_name || cleanName,
        phoneNumber: userRecord.phone_number || cleanPhone,
        avatarUrl: userRecord.avatar_url || avatarUrl,
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Authentication failed' }, { status: 500 });
  }
}
