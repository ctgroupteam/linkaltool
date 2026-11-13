import { NextRequest, NextResponse } from 'next/server';
import { createCashfreeOrder, createCashfreeSubscription } from '@/lib/cashfree';

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

    // 2. Pricing lookup (INR) - Special Restaurant & QR Menu pricing: ₹99/mo AutoPay, ₹99/mo One-time, ₹899/yr
    const pricingMap: Record<string, number> = {
      '1_month_autopay': 99,
      '1_month_99': 99,
      '1_month': 99,
      '3_months_249': 249,
      '3_months': 249,
      '6_months_499': 499,
      '6_months': 499,
      '1_year_899': 899,
      '1_year': 899,
      monthly: 99,
      yearly: 899,
      standard_1_month: 299,
      standard_3_months: 799,
      standard_6_months: 1499,
      standard_1_year: 2699,
    };

    const amount = pricingMap[planTier] || 99;
    const isAutoPay = planTier.includes('autopay') || body.isAutoPay === true;
    const orderId = `ord_${slug || 'site'}_${Date.now()}`;
    const returnUrl = `https://studio.linkal.in/dashboard?order_id={order_id}&status=success&site_id=${encodeURIComponent(storeId || '')}&slug=${encodeURIComponent(slug || '')}&amount=${amount}&plan=${encodeURIComponent(planTier || '1_month_autopay')}`;
    const cleanPhone = customerPhone ? customerPhone.replace(/[^0-9]/g, '') : '919307426215';
    const cleanEmail = customerEmail || 'payments@linkal.in';
    const customerId = `cust_${cleanPhone || Date.now()}`;

    // 3. Option B: Attempt True Cashfree Recurring AutoPay Subscription if requested
    if (isAutoPay) {
      const sub = await createCashfreeSubscription({
        subscriptionId: `sub_${slug || 'site'}_${Date.now()}`,
        planName: 'Digital Menu 99 Monthly AutoPay',
        amount: 99,
        customerPhone: cleanPhone,
        customerEmail: cleanEmail,
        customerId,
        returnUrl,
      });

      if (sub && sub.payment_session_id) {
        return NextResponse.json({
          success: true,
          orderId: sub.subscription_id,
          amount: 99,
          currency: 'INR',
          paymentSessionId: sub.payment_session_id,
          isAutoPay: true,
          isRecurringMandate: true,
        });
      }
    }

    // 4. Standard 30-Day Cashfree Production Order (Live PG Checkout fallback)
    const order = await createCashfreeOrder({
      orderId,
      orderAmount: amount,
      orderCurrency: 'INR',
      customerPhone: cleanPhone,
      customerEmail: cleanEmail,
      customerId,
      returnUrl,
    });

    return NextResponse.json({
      success: true,
      orderId: order.order_id,
      amount: order.order_amount,
      currency: order.order_currency,
      paymentSessionId: order.payment_session_id,
      isAutoPay,
      isRecurringMandate: false,
    });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Payment session creation failed' },
      { status: 500 }
    );
  }
}

