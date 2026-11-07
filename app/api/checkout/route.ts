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

    // 2. Pricing lookup (INR) - 1 Mo (₹299), 3 Mo (₹799), 6 Mo (₹1,499), 1 Yr (₹2,699)
    const pricingMap: Record<string, number> = {
      '1_month': 299,
      '3_months': 799,
      '6_months': 1499,
      '1_year': 2699,
      monthly: 299,
      quarterly: 799,
      halfyearly: 1499,
      yearly: 2699,
      basic: 299,
      starter: 299,
      growth: 799,
      pro: 1499,
    };

    const amount = pricingMap[planTier] || 299;
    const orderId = `order_${slug || 'site'}_${Date.now()}`;
    const returnUrl = `https://studio.linkal.in/dashboard?order_id={order_id}&status=success`;

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

