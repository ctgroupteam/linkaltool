import crypto from 'crypto';

const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID || '';
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY || '';
const CASHFREE_API_VERSION = process.env.CASHFREE_API_VERSION || '2023-08-01';

// Base URL: Production
const CASHFREE_BASE_URL = 'https://api.cashfree.com/pg';

export interface CreateOrderParams {
  orderId: string;
  orderAmount: number;
  orderCurrency?: string;
  customerPhone: string;
  customerEmail: string;
  customerId: string;
  returnUrl: string;
}

export async function createCashfreeOrder(params: CreateOrderParams) {
  const payload = {
    order_id: params.orderId,
    order_amount: params.orderAmount,
    order_currency: params.orderCurrency || 'INR',
    customer_details: {
      customer_id: params.customerId,
      customer_phone: params.customerPhone,
      customer_email: params.customerEmail,
    },
    order_meta: {
      return_url: params.returnUrl,
    },
  };

  const response = await fetch(`${CASHFREE_BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'x-client-id': CASHFREE_APP_ID,
      'x-client-secret': CASHFREE_SECRET_KEY,
      'x-api-version': CASHFREE_API_VERSION,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `Cashfree order creation failed (${response.status}): ${
        errorData.message || response.statusText
      }`
    );
  }

  return await response.json();
}

export async function getCashfreeOrderStatus(orderId: string) {
  const response = await fetch(`${CASHFREE_BASE_URL}/orders/${orderId}`, {
    method: 'GET',
    headers: {
      'x-client-id': CASHFREE_APP_ID,
      'x-client-secret': CASHFREE_SECRET_KEY,
      'x-api-version': CASHFREE_API_VERSION,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Cashfree order status: ${response.statusText}`);
  }

  return await response.json();
}

export interface CreateSubscriptionParams {
  subscriptionId: string;
  planName?: string;
  amount: number;
  customerPhone: string;
  customerEmail: string;
  customerId: string;
  customerName?: string;
  returnUrl: string;
}

export async function createCashfreeSubscription(params: CreateSubscriptionParams) {
  const payload = {
    subscription_id: params.subscriptionId,
    customer_details: {
      customer_id: params.customerId,
      customer_phone: params.customerPhone,
      customer_email: params.customerEmail,
      customer_name: params.customerName || 'Restaurant Owner',
    },
    plan_details: {
      plan_name: params.planName || 'Digital Menu Monthly AutoPay',
      plan_type: 'PERIODIC',
      plan_amount: params.amount,
      plan_max_amount: params.amount,
      plan_intervals: 1,
      plan_interval_type: 'MONTH',
      plan_currency: 'INR',
      plan_note: 'Monthly recurring subscription for digital menu site',
    },
    authorization_details: {
      authorization_amount: params.amount,
      payment_methods: ['upi', 'card'],
    },
    subscription_meta: {
      return_url: params.returnUrl,
    },
  };

  try {
    const response = await fetch(`${CASHFREE_BASE_URL}/subscriptions`, {
      method: 'POST',
      headers: {
        'x-client-id': CASHFREE_APP_ID,
        'x-client-secret': CASHFREE_SECRET_KEY,
        'x-api-version': CASHFREE_API_VERSION,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      if (data.code === 'profile_inactive') {
        console.warn('[Cashfree] Subscriptions profile inactive in merchant dashboard; falling back to 30-day PG order.');
        return null;
      }
      throw new Error(`Subscription creation failed: ${data.message || response.statusText}`);
    }

    return data;
  } catch (err: any) {
    console.warn('[Cashfree Subscription Error]', err.message);
    return null;
  }
}

export function verifyCashfreeWebhookSignature(
  timestamp: string,
  rawBody: string,
  signature: string
): boolean {
  if (!signature || !timestamp || !rawBody) return false;
  try {
    const bodyToSign = `${timestamp}${rawBody}`;
    const expectedSignature = crypto
      .createHmac('sha256', CASHFREE_SECRET_KEY)
      .update(bodyToSign)
      .digest('base64');
    return expectedSignature === signature;
  } catch (err) {
    console.error('Signature verification error:', err);
    return false;
  }
}
