import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, fullName, googleId, avatarUrl, phoneNumber, action, promoCode } = body;

    if (!email || !fullName) {
      return NextResponse.json(
        { error: 'Email and full name are required for authentication.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // 1. Upsert user in Supabase 'users' table
    let userRecord: any = null;
    try {
      const { data: existingUser } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('email', cleanEmail)
        .single();

      if (existingUser) {
        const { data: updated, error: updateError } = await supabaseAdmin
          .from('users')
          .update({
            full_name: fullName,
            avatar_url: avatarUrl || existingUser.avatar_url,
            phone_number: phoneNumber || existingUser.phone_number,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingUser.id)
          .select()
          .single();

        userRecord = updated || existingUser;
      } else {
        const { data: inserted, error: insertError } = await supabaseAdmin
          .from('users')
          .insert({
            email: cleanEmail,
            full_name: fullName,
            google_id: googleId || `google-${Date.now()}`,
            avatar_url: avatarUrl,
            phone_number: phoneNumber,
            cv_created_count: 0
          })
          .select()
          .single();

        userRecord = inserted;
      }
    } catch (err: any) {
      console.warn('Supabase users table sync note (using fallback):', err.message);
      userRecord = {
        id: `usr-${Date.now()}`,
        email: cleanEmail,
        full_name: fullName,
        phone_number: phoneNumber,
        cv_created_count: 0
      };
    }

    // 2. Check First 100 Free CVs logic
    let totalCvsCount = 0;
    try {
      const { count } = await supabaseAdmin
        .from('cv_profiles')
        .select('*', { count: 'exact', head: true });
      totalCvsCount = count || 0;
    } catch {}

    const isFirst100 = totalCvsCount < 100;
    const remainingFirst100 = Math.max(0, 100 - totalCvsCount);

    // 3. Check 1 Free CV per user rule
    const userCvCount = userRecord?.cv_created_count || 0;
    const hasUsedFreeCv = userCvCount >= 1;

    // 4. Validate Promo Code if provided or if past 100 free CVs
    let promoValid = false;
    let promoReason = '';
    if (promoCode) {
      try {
        const { data: promo } = await supabaseAdmin
          .from('promo_codes')
          .select('*')
          .eq('code', promoCode.toUpperCase().trim())
          .eq('is_active', true)
          .single();

        if (promo) {
          promoValid = true;
        } else {
          promoReason = 'Invalid or expired promotional code.';
        }
      } catch {
        // Fallback default promo check
        if (promoCode.toUpperCase().trim() === 'LINKALCV' || promoCode.toUpperCase().trim() === 'VIPCV') {
          promoValid = true;
        } else {
          promoReason = 'Invalid promotional code.';
        }
      }
    }

    return NextResponse.json({
      success: true,
      user: userRecord,
      cvEligibility: {
        canCreateFreeCv: !hasUsedFreeCv,
        hasUsedFreeCv,
        isFirst100,
        totalCvsCount,
        remainingFirst100,
        promoValid,
        promoReason
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Authentication error' },
      { status: 500 }
    );
  }
}

