import { NextResponse } from 'next/server';

interface NotificationPayload {
  title: string;
  body: string;
  eventType?: 'new_user' | 'new_cv' | 'new_site' | 'forgot_password';
  user?: {
    fullName?: string;
    email?: string;
    phoneNumber?: string;
  };
  site?: {
    name?: string;
    slug?: string;
    type?: string;
    url?: string;
  };
  timestamp?: string;
}

let inMemoryNotifications: any[] = [];

export async function POST(request: Request) {
  try {
    const body: NotificationPayload = await request.json();
    const { title, body: msgBody, eventType, user, site } = body;

    const record = {
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      title: title || 'New Notification',
      body: msgBody || '',
      eventType: eventType || 'general',
      user: user || null,
      site: site || null,
      createdAt: new Date().toISOString()
    };

    inMemoryNotifications.unshift(record);

    // Forward to Founder Admin command center if reachable
    try {
      await fetch('https://admin.linkal.in/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: record.title,
          body: record.body,
          eventType: record.eventType,
          userName: user?.fullName || 'User',
          siteSlug: site?.slug || '',
          userPhone: user?.phoneNumber || '',
          userEmail: user?.email || '',
        })
      });
    } catch (e) {
      console.warn('[Notify] Admin forward note:', e);
    }

    return NextResponse.json({ success: true, notification: record });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Notification error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ notifications: inMemoryNotifications });
}

