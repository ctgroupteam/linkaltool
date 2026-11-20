import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';
import os from 'os';

// All registered users are persisted directly in Supabase (Zero GitHub API calls, Zero suspension risk)

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
          signal: AbortSignal.timeout(6000),
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
    const rawDigits = (phoneNumber || '').replace(/\D/g, '');
    const validPhone = rawDigits.length >= 10 ? rawDigits : '';

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
        if ((action === 'signin' || action === 'verify_or_create_with_password') && existingUser.password_hash && password) {
          if (existingUser.password_hash !== password) {
            return NextResponse.json({ error: 'Incorrect password. Click "Forgot Password?" for assistance.' }, { status: 401 });
          }
        }

        const effectivePhone = validPhone || (existingUser.phone_number && existingUser.phone_number !== '91' ? existingUser.phone_number : '');

        const { data: updated } = await supabaseAdmin
          .from('users')
          .update({
            full_name: cleanName || existingUser.full_name,
            avatar_url: avatarUrl || existingUser.avatar_url,
            phone_number: effectivePhone,
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
            phone_number: validPhone,
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
        phone_number: validPhone,
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
    } catch {}

    // 3. Dispatch Instant Notification to Founder Admin (Dual-Write: Supabase DB + Web Push)
    const effectivePhoneDisplay = userRecord.phone_number || validPhone || '';
    const eventType = isNewUser ? 'new_user' : 'user_login';
    const notifTitle = isNewUser ? `🎉 New User Registered: ${cleanName}` : `👤 Google Sign-In: ${cleanName}`;
    const notifBody = `Name: ${cleanName}\nEmail: ${cleanEmail}\nAction: ${isNewUser ? 'New Google Sign-Up' : 'Google Account Login'}\nWhatsApp: ${effectivePhoneDisplay || 'Not provided'}`;

    try {
      await supabaseAdmin.from('admin_notifications').insert({
        id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        event_type: eventType,
        title: notifTitle,
        body: notifBody,
        user_name: cleanName,
        user_phone: effectivePhoneDisplay,
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
        signal: AbortSignal.timeout(6000),
        body: JSON.stringify({
          eventType,
          title: notifTitle,
          body: notifBody,
          userName: cleanName,
          userPhone: effectivePhoneDisplay,
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
        phoneNumber: userRecord.phone_number || effectivePhoneDisplay,
        avatarUrl: userRecord.avatar_url || avatarUrl,
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Authentication failed' }, { status: 500 });
  }
}
