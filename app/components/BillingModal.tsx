'use client';

import React, { useState, useEffect } from 'react';
import { X, Check, ShieldCheck, Zap, ArrowRight, Download } from 'lucide-react';

function AlertTriangle({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function CreditCard({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  );
}

function RefreshCw({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 21h5v-5" />
    </svg>
  );
}

function Calendar({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function Award({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="7" />
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </svg>
  );
}

function Printer({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 6 2 18 2 18 9" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="14" width="12" height="8" />
    </svg>
  );
}

function FileText({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

export interface PaymentReceipt {
  orderId: string;
  invoiceNo: string;
  siteId?: string;
  siteSlug?: string;
  siteName?: string;
  planName: string;
  amount: string;
  subtotal: string;
  gst: string;
  date: string;
  customerName?: string;
  customerEmail?: string;
  paymentMethod: string;
  status: 'PAID' | 'PENDING';
}

interface BillingModalProps {
  isOpen: boolean;
  onClose: () => void;
  siteSlug?: string;
  siteName?: string;
  siteId?: string;
  siteType?: string;
}

export function BillingModal({
  isOpen,
  onClose,
  siteSlug,
  siteName,
  siteId,
  siteType,
}: BillingModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<'1_month' | '3_months' | '6_months' | '1_year'>('1_month');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'plans' | 'orders' | 'receipt'>('plans');
  const [receiptList, setReceiptList] = useState<PaymentReceipt[]>([]);
  const [activeReceipt, setActiveReceipt] = useState<PaymentReceipt | null>(null);
  const [showAutoPayModal, setShowAutoPayModal] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('linkal_payment_history');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setReceiptList(parsed);
      }
    } catch {}
  }, [isOpen]);

  if (!isOpen) return null;

  const isFreeLifetime = siteType === 'cv' || siteType === 'wedding_card';
  const isRestaurant = siteType === 'restaurant';

  const PLANS = isRestaurant ? [
    {
      id: '1_month' as const,
      name: '1 Month Renewal (Special)',
      price: '₹99',
      duration: '30 Days Access',
      badge: 'Restaurant Special',
      savings: null,
      subtotal: '₹83.90',
      gst: '₹15.10',
    },
    {
      id: '3_months' as const,
      name: '3 Months (Quarterly)',
      price: '₹249',
      duration: '90 Days Access',
      badge: 'Most Popular',
      savings: 'Save 16%',
      subtotal: '₹211.02',
      gst: '₹37.98',
    },
    {
      id: '6_months' as const,
      name: '6 Months (Half-Yearly)',
      price: '₹499',
      duration: '180 Days Access',
      badge: 'High Value',
      savings: 'Save 16%',
      subtotal: '₹422.88',
      gst: '₹76.12',
    },
    {
      id: '1_year' as const,
      name: '1 Full Year (Annual)',
      price: '₹899',
      duration: '365 Days Access',
      badge: 'Best Value',
      savings: 'Save 24%',
      subtotal: '₹761.86',
      gst: '₹137.14',
    },
  ] : [
    {
      id: '1_month' as const,
      name: '1 Month Renewal',
      price: '₹299',
      duration: '30 Days Access',
      badge: 'Standard',
      savings: null,
      subtotal: '₹253.39',
      gst: '₹45.61',
    },
    {
      id: '3_months' as const,
      name: '3 Months (Quarterly)',
      price: '₹799',
      duration: '90 Days Access',
      badge: 'Most Popular',
      savings: 'Save 11%',
      subtotal: '₹677.12',
      gst: '₹121.88',
    },
    {
      id: '6_months' as const,
      name: '6 Months (Half-Yearly)',
      price: '₹1,499',
      duration: '180 Days Access',
      badge: 'High Value',
      savings: 'Save 16%',
      subtotal: '₹1,270.34',
      gst: '₹228.66',
    },
    {
      id: '1_year' as const,
      name: '1 Full Year (Annual)',
      price: '₹2,699',
      duration: '365 Days Access',
      badge: 'Best Value',
      savings: 'Save 25%',
      subtotal: '₹2,287.29',
      gst: '₹411.71',
    },
  ];

  // Initiate Cashfree checkout session
  const initiatePayment = async (planKey: string, isAutoPay: boolean) => {
    try {
      setLoading(true);

      const userStr = localStorage.getItem('linkal_user');
      let customerEmail = 'owner@linkal.in';
      let customerPhone = '919307426215';

      if (userStr) {
        try {
          const u = JSON.parse(userStr);
          if (u.email) customerEmail = u.email;
          if (u.phoneNumber) customerPhone = u.phoneNumber;
        } catch {}
      }

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planTier: planKey,
          isAutoPay,
          storeId: siteId,
          slug: siteSlug,
          customerEmail,
          customerPhone,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to create Cashfree checkout session');
      }

      if (data.checkoutUrl) {
        // Direct redirect to Cashfree Production checkout
        window.location.href = data.checkoutUrl;
      } else if (data.paymentSessionId) {
        // Official Cashfree Web SDK v3 Checkout
        const loadCashfreeSdk = async (): Promise<any> => {
          if ((window as any).Cashfree) return (window as any).Cashfree;
          return new Promise((resolve, reject) => {
            const existingScript = document.querySelector('script[src*="sdk.cashfree.com/js/v3/cashfree.js"]');
            if (existingScript) {
              const checkInterval = setInterval(() => {
                if ((window as any).Cashfree) {
                  clearInterval(checkInterval);
                  resolve((window as any).Cashfree);
                }
              }, 50);
              setTimeout(() => {
                clearInterval(checkInterval);
                if ((window as any).Cashfree) resolve((window as any).Cashfree);
                else reject(new Error('Cashfree SDK initialization timeout'));
              }, 3000);
              return;
            }
            const script = document.createElement('script');
            script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
            script.async = true;
            script.onload = () => resolve((window as any).Cashfree);
            script.onerror = () => reject(new Error('Failed to load Cashfree Payment SDK'));
            document.head.appendChild(script);
          });
        };

        const CashfreeSDK = await loadCashfreeSdk();
        const cashfreeInstance = CashfreeSDK({ mode: 'production' });
        await cashfreeInstance.checkout({
          paymentSessionId: data.paymentSessionId,
          redirectTarget: '_self',
        });
      } else {
        throw new Error('Cashfree payment link not received');
      }
    } catch (err: any) {
      alert(`Payment Gateway Error: ${err.message || 'Could not connect to Cashfree'}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePayButtonClick = () => {
    // If selecting ₹99 plan for restaurant, open the AutoPay / One-Time options dialog
    if (selectedPlan === '1_month' && isRestaurant) {
      setShowAutoPayModal(true);
    } else {
      initiatePayment(selectedPlan, false);
    }
  };

  const handleDownloadImage = (rc: PaymentReceipt) => {
    const canvas = document.createElement('canvas');
    canvas.width = 620;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.strokeRect(12, 12, canvas.width - 24, canvas.height - 24);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText('LINKAL AI — TAX INVOICE', 35, 60);

    ctx.fillStyle = '#059669';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('STATUS: PAYMENT COMPLETED (PAID)', 35, 90);

    ctx.fillStyle = '#475569';
    ctx.font = '13px sans-serif';
    ctx.fillText(`Invoice No: ${rc.invoiceNo}`, 35, 125);
    ctx.fillText(`Order ID: ${rc.orderId}`, 35, 145);
    ctx.fillText(`Date: ${new Date(rc.date).toLocaleString()}`, 35, 165);
    ctx.fillText(`Website: https://${rc.siteSlug}.linkal.in`, 35, 185);

    ctx.strokeStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.moveTo(35, 210);
    ctx.lineTo(585, 210);
    ctx.stroke();

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('Description', 35, 240);
    ctx.fillText('Amount', 490, 240);

    ctx.font = '13px sans-serif';
    ctx.fillText(rc.planName, 35, 280);
    ctx.fillText(rc.amount, 490, 280);

    ctx.fillText('Unlimited WhatsApp Online Orders', 35, 310);
    ctx.fillText('Included', 490, 310);

    ctx.fillText('High-Speed Cloud CDN & SSL Routing', 35, 340);
    ctx.fillText('Included', 490, 340);

    ctx.beginPath();
    ctx.moveTo(35, 370);
    ctx.lineTo(585, 370);
    ctx.stroke();

    ctx.fillStyle = '#475569';
    ctx.fillText('Subtotal:', 360, 410);
    ctx.fillText(rc.subtotal, 490, 410);

    ctx.fillText('GST (18%):', 360, 440);
    ctx.fillText(rc.gst, 490, 440);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText('Total Paid:', 360, 485);
    ctx.fillText(rc.amount, 490, 485);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px sans-serif';
    ctx.fillText('Payment Verified & Processed by Cashfree Payments India', 35, 570);
    ctx.fillText('Computer-generated tax receipt. No physical signature required.', 35, 590);
    ctx.fillText('Linkal SaaS Platform • support@linkal.in • https://linkal.in', 35, 610);

    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `Receipt_${rc.invoiceNo}.png`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-xl bg-white rounded-3xl border border-zinc-200 shadow-2xl p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-bold mb-1">
              <Zap className="w-3.5 h-3.5" />
              <span>Linkal Production Billing</span>
            </div>
            <h3 className="text-xl font-extrabold text-zinc-950">
              {siteName ? `Renew "${siteName}"` : 'Subscription & Plans'}
            </h3>
            {siteSlug && (
              <p className="text-xs text-zinc-500 font-mono">https://{siteSlug}.linkal.in</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex rounded-xl bg-zinc-100 p-1 text-xs font-bold">
          <button
            onClick={() => { setActiveTab('plans'); setShowAutoPayModal(false); }}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === 'plans'
                ? 'bg-white text-zinc-950 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Subscription Plans
          </button>
          <button
            onClick={() => { setActiveTab('orders'); setShowAutoPayModal(false); }}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === 'orders'
                ? 'bg-white text-zinc-950 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Order History &amp; Receipts ({receiptList.length})
          </button>
          {activeReceipt && (
            <button
              onClick={() => { setActiveTab('receipt'); setShowAutoPayModal(false); }}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                activeTab === 'receipt'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              📄 View Receipt
            </button>
          )}
        </div>

        {isFreeLifetime ? (
          <div className="p-6 text-center bg-emerald-50 border border-emerald-200 rounded-3xl space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-sm">
              <Check className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-lg font-extrabold text-emerald-950">Lifetime Free Website</h4>
            <p className="text-xs text-emerald-800 max-w-sm mx-auto leading-relaxed">
              Free CV Websites and Royal Wedding Invitations are Lifetime Free on Linkal. No payment, card, or renewal fee is ever required.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs"
              >
                Close &amp; Return
              </button>
            </div>
          </div>
        ) : showAutoPayModal ? (
          /* DECENT, DIGNIFIED AUTOPAY & ONE-TIME CHOICE MODAL (NO HUNKY-PUNKY STYLING) */
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-1 border-b border-zinc-100">
              <div>
                <h4 className="text-base font-extrabold text-zinc-950">
                  Select Subscription Frequency
                </h4>
                <p className="text-xs text-zinc-500">
                  Choose how you would like to protect your online QR menu website from downtime.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAutoPayModal(false)}
                className="text-xs font-bold text-zinc-500 hover:text-zinc-900"
              >
                ← Back
              </button>
            </div>

            {/* Option 1: AutoPay (₹99 / month - Highlighted in dignified style with SVG icons) */}
            <div className="p-5 rounded-2xl border-2 border-indigo-600/90 bg-indigo-50/30 relative space-y-3 shadow-xs">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                    <RefreshCw className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className="text-sm font-extrabold text-zinc-950">AutoPay — ₹99 / Month</h5>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                        Most Affordable
                      </span>
                    </div>
                    <p className="text-xs text-indigo-950/80 font-medium mt-0.5">
                      Add AutoPay every month to stop the online menu from closing. Cancel anytime.
                    </p>
                  </div>
                </div>
              </div>

              {/* Dignified Benefits List with clean SVGs */}
              <div className="space-y-1.5 text-xs text-zinc-700 pt-1">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>Never lose customers — keeps your table QR code live 24/7 without manual renewal</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>Supported on PhonePe, Google Pay, Paytm, BHIM &amp; all major UPI apps</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>Zero cancellation charges — pause or cancel anytime with 1 tap</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => initiatePayment('1_month_autopay', true)}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{loading ? 'Connecting to Cashfree...' : 'Set Up AutoPay ₹99 / Month (UPI / PhonePe)'}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </button>
            </div>

            {/* Option 2: One-Time Payment (₹99 for 30 Days) */}
            <div className="p-4 rounded-2xl border border-zinc-200 bg-white space-y-2.5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-zinc-100 text-zinc-700 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-zinc-600" />
                  </div>
                  <div>
                    <h5 className="text-sm font-extrabold text-zinc-950">Pay One-Time — ₹99 (30 Days)</h5>
                    <p className="text-xs text-zinc-500">Pay once without recurring billing.</p>
                  </div>
                </div>
                <span className="font-mono font-bold text-zinc-950 text-sm">₹99</span>
              </div>

              {/* Warning Notice about website stopping */}
              <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl flex items-start gap-2 text-xs text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="leading-snug">
                  <strong>Important Notice:</strong> Your website will be stopped after 30 days unless renewed manually. Don't lose customers or your active QR menu website.
                </p>
              </div>

              <button
                type="button"
                onClick={() => initiatePayment('1_month', false)}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-zinc-900 hover:bg-black text-white rounded-xl font-bold text-xs transition-colors cursor-pointer"
              >
                <span>{loading ? 'Connecting...' : 'Pay ₹99 Once for 30 Days'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Option 3: 1 Full Year Annual Saver (₹899) */}
            <div className="p-4 rounded-2xl border border-zinc-200 bg-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Award className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h5 className="text-xs font-extrabold text-zinc-950">1 Full Year (Annual Saver)</h5>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                      Save 24%
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500">365 days of uninterrupted service for ₹899.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => initiatePayment('1_year_899', false)}
                disabled={loading}
                className="px-3.5 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-xl font-bold text-xs transition-colors cursor-pointer"
              >
                Pay ₹899 ↗
              </button>
            </div>
          </div>
        ) : activeTab === 'plans' ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PLANS.map((plan) => (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all relative flex flex-col justify-between ${
                    selectedPlan === plan.id
                      ? 'border-indigo-600 bg-indigo-50/30 shadow-sm'
                      : 'border-zinc-200 bg-white hover:border-zinc-300'
                  }`}
                >
                  {plan.savings && (
                    <span className="absolute top-3 right-3 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                      {plan.savings}
                    </span>
                  )}

                  <div>
                    <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider block mb-1">
                      {plan.badge}
                    </span>
                    <h4 className="text-base font-extrabold text-zinc-950">{plan.name}</h4>
                    <p className="text-xs text-zinc-500 mt-0.5">{plan.duration}</p>
                    <div className="mt-3 flex items-baseline gap-1">
                      <span className="text-2xl font-black text-zinc-950">{plan.price}</span>
                      <span className="text-xs text-zinc-500 font-medium">/ term</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-zinc-200/60 flex items-center justify-between text-xs font-semibold text-zinc-700">
                    <span>Live QR Menu &amp; WhatsApp Orders</span>
                    <Check className="w-4 h-4 text-emerald-600" />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-1.5 text-xs text-zinc-600">
              <div className="flex items-center gap-2 font-bold text-zinc-950">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Cashfree Production Gateway &bull; 100% Secure Checkout</span>
              </div>
              <p className="text-[11px] text-zinc-500">
                Supports UPI AutoPay, PhonePe, Google Pay, Paytm, Credit/Debit Cards, NetBanking, and EMI.
              </p>
            </div>

            <button
              onClick={handlePayButtonClick}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              <span>{loading ? 'Processing via Cashfree...' : `Pay ${PLANS.find((p) => p.id === selectedPlan)?.price} Now`}</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        ) : activeTab === 'orders' ? (
          <div className="space-y-3">
            {receiptList.length === 0 ? (
              <div className="text-center py-10 px-4 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200 text-zinc-500 text-xs space-y-2">
                <FileText className="w-8 h-8 mx-auto text-zinc-400" />
                <h5 className="font-extrabold text-zinc-800 text-sm">No Completed Payment Receipts Yet</h5>
                <p className="text-[11px] text-zinc-500 max-w-sm mx-auto">
                  Official GST tax invoices, transaction IDs, and PDF/Image download options will appear here immediately after your Cashfree payment is completed.
                </p>
              </div>
            ) : (
              receiptList.map((rc, idx) => (
                <div key={idx} className="p-4 rounded-2xl border border-zinc-200 bg-zinc-50 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-zinc-900">{rc.invoiceNo}</span>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-extrabold">PAID</span>
                    </div>
                    <p className="text-xs text-zinc-700 font-semibold mt-1">{rc.planName} &bull; {rc.amount}</p>
                    <p className="text-[10px] text-zinc-500 mt-0.5">{new Date(rc.date).toLocaleDateString()} &bull; {rc.siteSlug}.linkal.in</p>
                  </div>
                  <button
                    onClick={() => {
                      setActiveReceipt(rc);
                      setActiveTab('receipt');
                    }}
                    className="px-3 py-1.5 bg-white border border-zinc-200 hover:bg-zinc-100 rounded-xl text-xs font-bold text-zinc-800 shadow-2xs cursor-pointer"
                  >
                    View Receipt ↗
                  </button>
                </div>
              ))
            )}
          </div>
        ) : (
          /* Real Receipt Modal View */
          activeReceipt && (
            <div className="space-y-4">
              <div id="receipt-print-area" className="p-5 rounded-2xl border border-zinc-300 bg-white space-y-4 text-xs">
                <div className="flex items-start justify-between border-b pb-3">
                  <div>
                    <span className="font-extrabold text-sm text-zinc-950 uppercase tracking-wide">LINKAL AI</span>
                    <p className="text-[10px] text-zinc-500">Official Tax Invoice &amp; Payment Receipt</p>
                  </div>
                  <span className="px-2.5 py-0.5 bg-emerald-600 text-white rounded-full font-bold text-[10px]">
                    PAID &bull; {activeReceipt.amount}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-zinc-500 block">Invoice No:</span>
                    <span className="font-mono font-bold text-zinc-900">{activeReceipt.invoiceNo}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Date &amp; Time:</span>
                    <span className="font-semibold text-zinc-900">{new Date(activeReceipt.date).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Subdomain:</span>
                    <span className="font-mono text-blue-600 font-bold">{activeReceipt.siteSlug}.linkal.in</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Payment Gateway:</span>
                    <span className="font-semibold text-zinc-800">{activeReceipt.paymentMethod}</span>
                  </div>
                </div>

                <div className="border-t border-b py-2 space-y-1.5 text-[11px]">
                  <div className="flex justify-between font-bold text-zinc-900">
                    <span>{activeReceipt.planName}</span>
                    <span>{activeReceipt.amount}</span>
                  </div>
                  <div className="flex justify-between text-zinc-500">
                    <span>Subtotal:</span>
                    <span>{activeReceipt.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-zinc-500">
                    <span>GST (18%):</span>
                    <span>{activeReceipt.gst}</span>
                  </div>
                  <div className="flex justify-between font-extrabold text-sm text-zinc-950 pt-1 border-t">
                    <span>Total Paid:</span>
                    <span>{activeReceipt.amount}</span>
                  </div>
                </div>

                <p className="text-[10px] text-zinc-400 text-center">
                  This is a verified computer-generated receipt for Linkal AI cloud hosting services.
                </p>
              </div>

              {/* Download Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl font-bold text-xs shadow-xs cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Download PDF (Print)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadImage(activeReceipt)}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Image (PNG)</span>
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
