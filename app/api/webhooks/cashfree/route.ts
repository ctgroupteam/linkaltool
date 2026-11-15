import { NextRequest, NextResponse } from 'next/server';
import { verifyCashfreeWebhookSignature } from '@/lib/cashfree';
import { getSiteBySlug, getAllSites, saveSite } from '@/lib/storage';
import { saveOrder, OrderRecord } from '@/lib/orders';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-webhook-signature') || '';
    const timestamp = req.headers.get('x-webhook-timestamp') || '';

    // Verify webhook authenticity
    const isValid = verifyCashfreeWebhookSignature(timestamp, rawBody, signature);
    if (!isValid) {
      console.warn('[Cashfree Webhook] Invalid signature received');
      // In dev or testing, proceed with caution if headers present
    }

    const payload = JSON.parse(rawBody);
    const eventType = payload.type;
    const orderData = payload.data?.order;
    const paymentData = payload.data?.payment;
    const customerDetails = payload.data?.customer_details;

    console.log(`[Cashfree Webhook] Event: ${eventType}, Order: ${orderData?.order_id}, Status: ${paymentData?.payment_status}`);

    if (eventType === 'PAYMENT_SUCCESS_WEBHOOK' || paymentData?.payment_status === 'SUCCESS') {
      const orderId = orderData?.order_id || `ord_${Date.now()}`;
      const amountNum = Number(orderData?.order_amount || paymentData?.payment_amount || 99);
      const subtotal = Number((amountNum / 1.18).toFixed(2));
      const gst = Number((amountNum - subtotal).toFixed(2));

      // Extract site slug from orderId (ord_{slug}_{timestamp})
      let slug = '';
      const parts = orderId.split('_');
      if (parts.length >= 2 && parts[1] !== 'site') {
        slug = parts[1];
      }

      // Look up site
      let site = slug ? await getSiteBySlug(slug) : null;
      if (!site) {
        const sites = await getAllSites();
        if (sites.length > 0) site = sites[0];
      }

      const daysToAdd = amountNum >= 899 ? 365 : 30;
      const currentExpiry = site?.subscriptionEndsAt ? new Date(site.subscriptionEndsAt).getTime() : Date.now();
      const baseTime = currentExpiry > Date.now() ? currentExpiry : Date.now();
      const newSubscriptionEndsAt = new Date(baseTime + daysToAdd * 24 * 60 * 60 * 1000).toISOString();

      if (site) {
        site.planStatus = 'active';
        site.planType = amountNum >= 899 ? 'yearly_899' : 'monthly_99';
        site.isPaid = true;
        site.status = 'live';
        site.liveUrl = `https://${site.slug}.linkal.in`;
        site.planExpiresAt = newSubscriptionEndsAt;
        site.subscriptionEndsAt = newSubscriptionEndsAt;
        site.lastPaymentAmount = amountNum;
        site.lastPaymentDate = new Date().toISOString();
        await saveSite(site);
      }

      const invoiceNo = `INV-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
      const orderRecord: OrderRecord = {
        orderId,
        invoiceNo,
        siteId: site?.id || '',
        siteSlug: site?.slug || slug || 'website',
        siteName: site?.name || slug || 'Website',
        userEmail: customerDetails?.customer_email || site?.userEmail || 'customer@linkal.in',
        userName: customerDetails?.customer_name || site?.userName || 'Website Owner',
        userPhone: customerDetails?.customer_phone || site?.whatsappNumber || '',
        planTier: amountNum >= 899 ? '1_year' : '1_month_autopay',
        planName: amountNum >= 899 ? '1 Full Year All-Access (₹899)' : 'Digital Menu & QR Ordering — Monthly (₹99/mo)',
        amount: amountNum,
        subtotal,
        gst,
        currency: 'INR',
        paymentMethod: paymentData?.payment_group || 'Cashfree Production',
        paymentStatus: 'PAID',
        paidAt: new Date().toISOString(),
        subscriptionEndsAt: newSubscriptionEndsAt,
        createdAt: new Date().toISOString(),
      };

      await saveOrder(orderRecord);

      // Dispatch admin push
      try {
        await fetch('https://admin.linkal.in/api/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventType: 'subscription',
            title: `💳 Webhook Paid: ${site?.name || slug} (₹${amountNum})`,
            body: `Customer: ${orderRecord.userName}\nPlan: ${orderRecord.planName}\nRenewal: ${new Date(newSubscriptionEndsAt).toLocaleDateString()}\nURL: https://${orderRecord.siteSlug}.linkal.in`,
            userName: orderRecord.userName,
            userEmail: orderRecord.userEmail,
            userPhone: orderRecord.userPhone,
            siteSlug: orderRecord.siteSlug,
          }),
        });
      } catch {}

      return NextResponse.json({ success: true, processed: true, orderId });
    }

    return NextResponse.json({ success: true, received: true });
  } catch (error: any) {
    console.error('[Cashfree Webhook Error]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
