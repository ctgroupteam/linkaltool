import { NextRequest, NextResponse } from 'next/server';
import { createCashfreeOrder } from '@/lib/cashfree';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { planTier, storeId, slug, customerPhone, customerEmail, promoCode } = body;

    // 1. Check for Free Lifetime Promo Code (LINKALCV)
    if (promoCode && promoCode.toUpperCase() === 'LINKALCV') {
      return NextResponse.json({
        success: true,
        isFreeLifetime: true,
        message: 'Promo code LINKALCV applied successfully! Your site is 100% Free Lifetime with zero dues.',
      });
    }

    // 2. Pricing lookup (INR)
    const pricingMap: Record<string, number> = {
      basic: 300,
      starter: 300,
      growth: 500,
      pro: 700,
    };

    const amount = pricingMap[planTier] || 300;
    const orderId = `order_${slug || 'site'}_${Date.now()}`;
    const returnUrl = `https://linkal.in/order/verify?order_id={order_id}&slug=${encodeURIComponent(slug || '')}`;

    // 3. Create Cashfree Production Order
    const order = await createCashfreeOrder({
      orderId,
      orderAmount: amount,
      orderCurrency: 'INR',
      customerPhone: customerPhone || '9876543210',
      customerEmail: customerEmail || 'customer@linkal.in',
      customerId: `cust_${Date.now()}`,
      returnUrl,
    });

    return NextResponse.json({
      success: true,
      orderId: order.order_id,
      amount: order.order_amount,
      currency: order.order_currency,
      paymentSessionId: order.payment_session_id,
    });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Payment session creation failed' },
      { status: 500 }
    );
  }
}
