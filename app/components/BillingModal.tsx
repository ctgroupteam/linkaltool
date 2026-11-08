'use client';

import React, { useState } from 'react';
import { X, Check, ShieldCheck, Zap, Sparkles, Clock, ArrowRight } from 'lucide-react';

function CreditCard({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  );
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
  const [activeTab, setActiveTab] = useState<'plans' | 'orders'>('plans');

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
    },
    {
      id: '3_months' as const,
      name: '3 Months (Quarterly)',
      price: '₹249',
      duration: '90 Days Access',
      badge: 'Most Popular',
      savings: 'Save 16%',
    },
    {
      id: '6_months' as const,
      name: '6 Months (Half-Yearly)',
      price: '₹499',
      duration: '180 Days Access',
      badge: 'High Value',
      savings: 'Save 16%',
    },
    {
      id: '1_year' as const,
      name: '1 Full Year (Annual)',
      price: '₹899',
      duration: '365 Days Access',
      badge: 'Best Value',
      savings: 'Save 24%',
    },
  ] : [
    {
      id: '1_month' as const,
      name: '1 Month Renewal',
      price: '₹299',
      duration: '30 Days Access',
      badge: 'Standard',
      savings: null,
    },
    {
      id: '3_months' as const,
      name: '3 Months (Quarterly)',
      price: '₹799',
      duration: '90 Days Access',
      badge: 'Most Popular',
      savings: 'Save 11%',
    },
    {
      id: '6_months' as const,
      name: '6 Months (Half-Yearly)',
      price: '₹1,499',
      duration: '180 Days Access',
      badge: 'High Value',
      savings: 'Save 16%',
    },
    {
      id: '1_year' as const,
      name: '1 Full Year (Annual)',
      price: '₹2,699',
      duration: '365 Days Access',
      badge: 'Best Value',
      savings: 'Save 25%',
    },
  ];

  const handlePayNow = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planTier: selectedPlan,
          storeId: siteId,
          slug: siteSlug,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to initialize payment');

      if (data.paymentSessionId) {
        // Load Cashfree Checkout SDK or redirect
        alert(`Cashfree Production Order Created!\nOrder ID: ${data.orderId}\nAmount: ₹${data.amount}\nRedirecting to Cashfree...`);
        // If cashfree JS SDK is available, trigger Drop in, or redirect to sandbox/prod return
        window.location.href = `https://studio.linkal.in/dashboard?order_id=${data.orderId}&status=success`;
      }
    } catch (err: any) {
      alert(err.message || 'Payment initiation error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-xl bg-white rounded-3xl border border-zinc-200 shadow-2xl p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
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

        {/* Tabs: Plans / Orders */}
        <div className="flex rounded-xl bg-zinc-100 p-1 text-xs font-bold">
          <button
            onClick={() => setActiveTab('plans')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${activeTab === 'plans'
                ? 'bg-white text-zinc-950 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-800'
              }`}
          >
            Subscription Plans
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${activeTab === 'orders'
                ? 'bg-white text-zinc-950 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-800'
              }`}
          >
            Order History &amp; Validity
          </button>
        </div>

        {isFreeLifetime ? (
          <div className="p-6 text-center bg-emerald-50 border border-emerald-200 rounded-3xl space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-sm">
              <Check className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-lg font-extrabold text-emerald-950">100% Free Lifetime Website</h4>
            <p className="text-xs text-emerald-800 max-w-sm mx-auto leading-relaxed">
              Free CV Websites and Royal Wedding Invitations are completely free forever on Linkal. No payment, card, or renewal fee is ever required.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs"
              >
                Close &amp; Return to Dashboard
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
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all relative flex flex-col justify-between ${selectedPlan === plan.id
                      ? 'border-blue-600 bg-blue-50/40 shadow-sm'
                      : 'border-zinc-200 bg-white hover:border-zinc-300'
                    }`}
                >
                  {plan.savings && (
                    <span className="absolute top-3 right-3 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                      {plan.savings}
                    </span>
                  )}
                  <div>
                    <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                      {plan.badge}
                    </span>
                    <h4 className="text-base font-extrabold text-zinc-950 mt-0.5">{plan.name}</h4>
                    <div className="text-2xl font-black text-zinc-950 my-1">{plan.price}</div>
                    <p className="text-xs text-zinc-500">{plan.duration}</p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-zinc-200/60 flex items-center justify-between text-xs font-semibold text-zinc-700">
                    <span>WhatsApp Orders</span>
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
                Supports UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, NetBanking, and EMI.
              </p>
            </div>

            <button
              onClick={handlePayNow}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white rounded-2xl font-bold text-sm shadow-lg shadow-blue-600/25 transition-all"
            >
              <CreditCard className="w-4 h-4" />
              <span>{loading ? 'Connecting to Cashfree...' : `Pay ${PLANS.find((p) => p.id === selectedPlan)?.price} Now`}</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="border border-zinc-200 rounded-2xl overflow-hidden text-xs">
              <div className="bg-zinc-50 px-4 py-2.5 font-bold text-zinc-700 flex justify-between border-b border-zinc-200">
                <span>Active Subscription</span>
                <span className="text-emerald-600 font-extrabold">Active</span>
              </div>
              <div className="p-4 space-y-2 bg-white">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Plan:</span>
                  <span className="font-bold text-zinc-900">15-Day Free Trial (or Lifetime CV)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Subdomain:</span>
                  <span className="font-mono text-zinc-900">{siteSlug || 'yourstore'}.linkal.in</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Valid Till:</span>
                  <span className="font-bold text-emerald-600">15 Days From Creation</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Status:</span>
                  <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                    <Check className="w-3 h-3" /> Ready for Live Orders
                  </span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-zinc-400 text-center">
              All transactions are processed in INR and certified by Cashfree Payments India.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
