import { NextResponse } from 'next/server';

// In-memory / Supabase push subscriber store
let subscribers: any[] = [];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { subscription, userEmail } = body;

    if (!subscription || !subscription.endpoint) {
      return NextResponse.json({ error: 'Invalid subscription' }, { status: 400 });
    }

    const exists = subscribers.find((s) => s.endpoint === subscription.endpoint);
    if (!exists) {
      subscribers.push({
        ...subscription,
        userEmail: userEmail || 'guest',
        createdAt: new Date().toISOString()
      });
    }

    return NextResponse.json({ success: true, count: subscribers.length });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ count: subscribers.length });
}
