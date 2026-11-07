import { NextRequest, NextResponse } from 'next/server';
import { verifyCashfreeWebhookSignature } from '@/lib/cashfree';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-webhook-signature') || '';
    const timestamp = req.headers.get('x-webhook-timestamp') || '';

    // Verify webhook authenticity
    const isValid = verifyCashfreeWebhookSignature(timestamp, rawBody, signature);
    if (!isValid) {
      console.warn('Invalid Cashfree webhook signature received');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const eventType = payload.type; // e.g. PAYMENT_SUCCESS_WEBHOOK
    const orderData = payload.data?.order;
    const paymentData = payload.data?.payment;

    console.log(`[Cashfree Webhook] Event: ${eventType}, Order: ${orderData?.order_id}, Status: ${paymentData?.payment_status}`);

    if (eventType === 'PAYMENT_SUCCESS_WEBHOOK') {
      // Order paid successfully — activate or extend plan for 30 days
      return NextResponse.json({ success: true, processed: true });
    }

    return NextResponse.json({ success: true, received: true });
  } catch (error: any) {
    console.error('Cashfree webhook error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

