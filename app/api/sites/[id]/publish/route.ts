import { NextResponse } from 'next/server';
import { getSiteById, saveSite } from '@/lib/storage';
import { executeDeploymentPipeline } from '@/lib/deployment/pipeline';
import { supabaseAdmin } from '@/lib/supabase';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    let bodySite = null;
    try {
      const body = await request.json();
      if (body && body.site) {
        bodySite = body.site;
      }
    } catch {}

    let site = bodySite || await getSiteById(id);

    if (!site) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    }

    if (bodySite) {
      site = await saveSite(bodySite);
    }

    const result = await executeDeploymentPipeline(site);

    // Notify Founder Admin of new live published site / CV (Dual-write: Supabase DB + Web Push)
    try {
      const TYPE_LABELS: Record<string, string> = {
        cv: 'Free Executive CV Website',
        portfolio: 'Personal Portfolio Website',
        wedding_card: 'Royal Wedding Card Invitation',
        restaurant: 'Hotel & Restaurant Digital Menu',
        watch_store: 'Luxury Watch Store',
        ecommerce: 'Online E-Commerce Store',
        boutique: 'Fashion Boutique Store',
        tuition: 'Tuition & Coaching Academy',
        salon: 'Salon & Spa Studio',
        bakery: 'Bakery & Cake Shop',
        electronics: 'Electronics & Gadget Store',
        single_product: 'Single Product Landing Page',
      };
      const siteTypeLabel = TYPE_LABELS[site.type] || 'Website';
      const creatorName = site.userName || site.cvTitle || site.name || 'Owner';
      const creatorEmail = site.userEmail || site.cvEmail || 'Not provided';
      const notifTitle = `🚀 Website Published: ${siteTypeLabel}`;
      const notifBody = `Name: ${creatorName}\nEmail: ${creatorEmail}\nWebsite Type: ${siteTypeLabel}\nLive URL: https://${site.slug}.linkal.in\nWhatsApp: ${site.whatsappNumber || '—'}`;

      // 1. Supabase Insert
      try {
        await supabaseAdmin.from('admin_notifications').insert({
          id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          event_type: 'publish_site',
          title: notifTitle,
          body: notifBody,
          user_name: creatorName,
          user_phone: site.whatsappNumber || '',
          user_email: creatorEmail,
          site_slug: site.slug,
          is_read: false,
          created_at: new Date().toISOString(),
        });
      } catch (dbErr) {
        console.warn('[Admin Notif Publish DB Insert]', dbErr);
      }

      // 2. Dispatch to Admin Push API
      await fetch('https://admin.linkal.in/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'publish_site',
          siteTypeLabel,
          title: notifTitle,
          body: notifBody,
          userName: creatorName,
          siteSlug: site.slug,
          userPhone: site.whatsappNumber,
          userEmail: creatorEmail,
        }),
      });
    } catch (e) {}

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Pipeline execution failed' },
      { status: 500 }
    );
  }
}
