'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import {
  Check,
  ShieldCheck,
  Zap,
  ArrowRight,
  ArrowLeft,
  Download,
  Clock,
  ExternalLink,
  Sparkles,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { downloadReceiptPdf, downloadReceiptImage, ReceiptData } from '@/lib/receiptGenerator';

const CreditCard = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <line x1="2" y1="10" x2="22" y2="10" />
  </svg>
);

const FileText = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

interface SiteData {
  id: string;
  name: string;
  slug: string;
  type: string;
  status: string;
  whatsappNumber: string;
  planStatus?: string;
  planType?: string;
  isPaid?: boolean;
  planExpiresAt?: string;
  subscriptionEndsAt?: string;
  lastPaymentAmount?: number;
  lastPaymentDate?: string;
  userEmail?: string;
  userName?: string;
}

export default function PlanManagementPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const siteParam = (params?.id as string) || '';

  const [site, setSite] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [selectedPlanTier, setSelectedPlanTier] = useState<'1_month_autopay' | '1_month_99' | '1_year'>('1_month_autopay');
  const [paymentSuccessData, setPaymentSuccessData] = useState<any | null>(null);
  const [previewReceipt, setPreviewReceipt] = useState<ReceiptData | null>(null);

  // Load site and orders
  useEffect(() => {
    async function loadData() {
      if (!siteParam) return;
      try {
        setLoading(true);

        // Fetch site
        const res = await fetch(`/api/sites/${siteParam}`);
        let siteData: SiteData | null = null;
        if (res.ok) {
          const json = await res.json();
          siteData = json.site || json;
        }

        // Fallback: search by slug
        if (!siteData) {
          const listRes = await fetch('/api/sites');
          if (listRes.ok) {
            const listJson = await listRes.json();
            const allSites: SiteData[] = listJson.sites || listJson || [];
            siteData = allSites.find((s) => s.id === siteParam || s.slug === siteParam) || null;
          }
        }

        setSite(siteData);

        // Fetch orders for this site
        const ordersRes = await fetch(`/api/orders?site=${encodeURIComponent(siteData?.id || siteParam)}`);
        if (ordersRes.ok) {
          const oJson = await ordersRes.json();
          setOrders(oJson.orders || []);
        }

        // Check if returning from Cashfree payment redirect
        const orderIdParam = searchParams.get('order_id');
        const statusParam = searchParams.get('status');

        if (orderIdParam) {
          try {
            const verifyRes = await fetch('/api/checkout/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: orderIdParam,
                siteId: siteData?.id || siteParam,
                slug: siteData?.slug || '',
                amount: searchParams.get('amount') || 99,
                planTier: searchParams.get('plan') || '1_month_autopay',
              }),
            });

            if (verifyRes.ok) {
              const verifyJson = await verifyRes.json();
              if (verifyJson.success) {
                setPaymentSuccessData(verifyJson.order);
                if (verifyJson.site) setSite(verifyJson.site);
                // Refresh orders
                const rOrders = await fetch(`/api/orders?site=${encodeURIComponent(siteData?.id || siteParam)}`);
                if (rOrders.ok) {
                  const rData = await rOrders.json();
                  setOrders(rData.orders || []);
                }
              }
            }
          } catch (e) {
            console.error('Verify error:', e);
          }
        }
      } catch (err) {
        console.error('Plan page load error:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [siteParam, searchParams]);

  // Handle renewal payment
  const handlePayNow = async (tier: '1_month_autopay' | '1_month_99' | '1_year' = selectedPlanTier) => {
    if (!site) return;
    setIsProcessingPayment(true);

    try {
      let storedUser: any = null;
      try {
        const u = localStorage.getItem('linkal_user');
        if (u) storedUser = JSON.parse(u);
      } catch { }

      const cleanPhone = site.whatsappNumber?.replace(/[^0-9]/g, '') || storedUser?.phoneNumber?.replace(/[^0-9]/g, '') || '919307426215';
      const cleanEmail = site.userEmail || storedUser?.email || 'payments@linkal.in';

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planTier: tier,
          storeId: site.id,
          slug: site.slug,
          customerPhone: cleanPhone,
          customerEmail: cleanEmail,
          isAutoPay: tier === '1_month_autopay',
        }),
      });

      const data = await res.json();
      if (!data.success || !data.paymentSessionId) {
        alert(data.error || 'Payment gateway connection error. Please try again.');
        setIsProcessingPayment(false);
        return;
      }

      // Load Cashfree Checkout SDK dynamically
      const script = document.createElement('script');
      script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
      script.onload = () => {
        try {
          const cf = new (window as any).Cashfree({ mode: 'production' });
          cf.checkout({
            paymentSessionId: data.paymentSessionId,
            redirectTarget: '_self',
          });
        } catch (e: any) {
          console.error('[Cashfree SDK Error]', e);
          window.location.href = `https://payments.cashfree.com/order/#${data.paymentSessionId}`;
        }
      };
      document.body.appendChild(script);
    } catch (err: any) {
      alert(err.message || 'Payment initiation failed.');
      setIsProcessingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-bold text-slate-700">Loading plan &amp; subscription details...</p>
        </div>
      </div>
    );
  }

  if (!site) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 max-w-md text-center shadow-lg">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-900 mb-1">Website Not Found</h2>
          <p className="text-xs text-slate-500 mb-6">We could not locate the website subscription details.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-5 py-2.5 rounded-xl bg-[#0D1B3E] text-white text-xs font-bold hover:bg-black transition-colors"
          >
            ← Back to Studio Dashboard
          </button>
        </div>
      </div>
    );
  }

  const isFreeLifetime = site.type === 'cv' || site.type === 'portfolio' || site.type === 'wedding_card';
  const isActive = isFreeLifetime || site.planStatus === 'active' || site.isPaid === true;

  // Calculate days remaining
  const expiryDate = site.subscriptionEndsAt || site.planExpiresAt;
  const expiryTime = expiryDate ? new Date(expiryDate).getTime() : 0;
  const daysLeft = expiryTime > Date.now() ? Math.ceil((expiryTime - Date.now()) / (1000 * 60 * 60 * 24)) : 0;
  const formattedExpiry = expiryDate
    ? new Date(expiryDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Active';

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-20">
      {/* ─── TOP HEADER BAR ─── */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Studio</span>
            </button>
            <div className="h-4 w-px bg-slate-200 hidden sm:block" />
            <div className="hidden sm:block">
              <span className="text-xs text-slate-500 font-medium">Managing:</span>{' '}
              <strong className="text-xs text-slate-900 font-bold">{site.name}</strong>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`https://${site.slug}.linkal.in`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl border border-blue-200 transition-colors"
            >
              <span>{site.slug}.linkal.in</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </header>

      {/* ─── MAIN CONTENT CONTAINER ─── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 space-y-6">

        {/* ─── INSTANT PAYMENT SUCCESS CONFIRMATION ─── */}
        {paymentSuccessData && (
          <div className="p-6 bg-emerald-500 text-white rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-5 animate-in slide-in-from-top-4 duration-300">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-emerald-100">Payment Successful &bull; Cashfree Verified</span>
                <h3 className="text-xl font-extrabold text-white">Subscription Active &amp; Extended!</h3>
                <p className="text-xs text-emerald-100 mt-0.5">
                  Your restaurant website is paid &amp; verified live at{' '}
                  <a href={`https://${site.slug}.linkal.in`} target="_blank" rel="noreferrer" className="underline font-bold text-white">
                    https://{site.slug}.linkal.in
                  </a>
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                onClick={() => downloadReceiptPdf(paymentSuccessData)}
                className="px-4 py-2.5 rounded-xl bg-white text-emerald-900 text-xs font-extrabold hover:bg-emerald-50 transition-colors shadow-md inline-flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF Receipt</span>
              </button>
              <button
                onClick={() => downloadReceiptImage(paymentSuccessData)}
                className="px-4 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition-colors border border-emerald-400/40 inline-flex items-center gap-1.5"
              >
                <span>Image Receipt (.png)</span>
              </button>
            </div>
          </div>
        )}

        {/* ─── TOP HERO: CURRENT SUBSCRIPTION SUMMARY ─── */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">Subscription Status</span>
                {isFreeLifetime ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-extrabold border border-emerald-300">
                    LIFETIME 100% FREE
                  </span>
                ) : isActive ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-extrabold border border-emerald-300 inline-flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    ACTIVE &bull; PAID
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[11px] font-extrabold border border-rose-300">
                    EXPIRED / DUE
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D1B3E]">
                {site.name} — Plan &amp; Subscription
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                {isFreeLifetime
                  ? 'This website is permanently free on Linkal. Zero hosting fees or dues required.'
                  : `Digital Menu & QR Ordering Website &bull; Managed via Cashfree India`}
              </p>
            </div>

            {/* Quick Action Pill */}
            {!isFreeLifetime && (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex items-center justify-between sm:justify-start gap-4">
                <div>
                  <div className="text-[11px] font-medium text-slate-500">Subscription Valid Until</div>
                  <div className="text-base font-extrabold text-slate-900">{formattedExpiry}</div>
                  <div className="text-[11px] font-bold text-emerald-600 mt-0.5">
                    {daysLeft > 0 ? `✓ ${daysLeft} days remaining` : 'Needs Renewal'}
                  </div>
                </div>
                <button
                  onClick={() => handlePayNow('1_month_autopay')}
                  disabled={isProcessingPayment}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 transition-all inline-flex items-center gap-1.5 shrink-0"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isProcessingPayment ? 'animate-spin' : ''}`} />
                  <span>Renew for ₹99</span>
                </button>
              </div>
            )}
          </div>

          {/* Feature Badges Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-slate-100">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[11px] text-slate-500 block">WhatsApp Orders</span>
              <strong className="text-xs text-slate-900 font-bold">Unlimited &bull; 0% Cut</strong>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[11px] text-slate-500 block">Custom Subdomain</span>
              <strong className="text-xs text-slate-900 font-bold">{site.slug}.linkal.in</strong>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[11px] text-slate-500 block">Edge SSL Security</span>
              <strong className="text-xs text-emerald-700 font-bold">✓ Active (HTTPS)</strong>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[11px] text-slate-500 block">QR Code Ordering</span>
              <strong className="text-xs text-slate-900 font-bold">Instant Print Ready</strong>
            </div>
          </div>
        </div>

        {/* ─── RENEW / EXTEND PLAN SECTION ─── */}
        {!isFreeLifetime && (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Extend Subscription</span>
                <h2 className="text-xl font-extrabold text-slate-900">Renew for Next Month or Full Year</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Your renewal adds another 30 days onto your existing end date without losing any days.
                </p>
              </div>
            </div>

            {/* Plan Tier Selection Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Option 1: ₹99 Monthly */}
              <div
                onClick={() => setSelectedPlanTier('1_month_autopay')}
                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all relative ${selectedPlanTier === '1_month_autopay'
                    ? 'border-blue-600 bg-blue-50/40 shadow-md'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-extrabold">
                    <Zap className="w-3 h-3 text-blue-600" />
                    <span>MOST POPULAR</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-slate-950">₹99</span>
                    <span className="text-xs text-slate-500 font-medium"> / month</span>
                  </div>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 mb-1">1 Month Renewal (AutoPay / UPI)</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Full access for 30 days. Unlimited customer orders, live menu updates, high-speed hosting, and direct WhatsApp alerts.
                </p>

                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handlePayNow('1_month_autopay'); }}
                  disabled={isProcessingPayment}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs transition-colors shadow-sm flex items-center justify-center gap-1.5"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>{isProcessingPayment ? 'Opening Cashfree...' : 'Pay ₹99 for Next Month'}</span>
                </button>
              </div>

              {/* Option 2: ₹899 1 Full Year */}
              <div
                onClick={() => setSelectedPlanTier('1_year')}
                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all relative ${selectedPlanTier === '1_year'
                    ? 'border-blue-600 bg-blue-50/40 shadow-md'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    <span>SAVE 25% DISCOUNT</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-slate-950">₹899</span>
                    <span className="text-xs text-slate-500 font-medium"> / year</span>
                  </div>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 mb-1">1 Full Year All-Access</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Full 365 days of uninterrupted service. Zero monthly renewal hassles, priority support, and advanced menu branding.
                </p>

                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handlePayNow('1_year'); }}
                  disabled={isProcessingPayment}
                  className="w-full py-2.5 rounded-xl bg-[#0D1B3E] hover:bg-black text-white font-extrabold text-xs transition-colors shadow-sm flex items-center justify-center gap-1.5"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>{isProcessingPayment ? 'Opening Cashfree...' : 'Pay ₹899 for 1 Full Year'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── ORDER HISTORY & OFFICIAL RECEIPTS ─── */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Billing History</span>
              <h2 className="text-xl font-extrabold text-slate-900">Order Receipts &amp; Invoices</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Download verified computer-generated official receipts with Linkal AI confirmation.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
              {orders.length} {orders.length === 1 ? 'Receipt' : 'Receipts'}
            </span>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-600">No previous payment orders recorded yet.</p>
              <p className="text-[11px] text-slate-400 mt-1">Receipts will appear here automatically upon payment.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-extrabold text-[10px]">
                    <th className="py-3 px-3">Invoice No</th>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Plan / Description</th>
                    <th className="py-3 px-3">Amount</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((ord) => {
                    const receiptData: ReceiptData = {
                      orderId: ord.orderId,
                      invoiceNo: ord.invoiceNo || `INV-2026-${ord.orderId.slice(-5)}`,
                      siteSlug: ord.siteSlug || site.slug,
                      siteName: ord.siteName || site.name,
                      planName: ord.planName || 'Digital Menu Monthly Subscription',
                      amount: ord.amount || 99,
                      subtotal: ord.amount || 99,
                      gst: 0,
                      date: ord.paidAt || ord.createdAt || new Date().toISOString(),
                      customerName: ord.userName || site.userName || 'Website Owner',
                      customerEmail: ord.userEmail || site.userEmail || '',
                      customerPhone: ord.userPhone || site.whatsappNumber || '',
                      paymentMethod: ord.paymentMethod || 'Cashfree Production (UPI / Cards)',
                      status: ord.paymentStatus || 'PAID',
                      subscriptionEndsAt: ord.subscriptionEndsAt || site.subscriptionEndsAt,
                    };

                    return (
                      <tr key={ord.orderId} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-3 font-mono font-bold text-slate-900">
                          {receiptData.invoiceNo}
                          <span className="block text-[10px] text-slate-400 font-mono font-normal">{ord.orderId}</span>
                        </td>
                        <td className="py-3.5 px-3 text-slate-600">
                          {new Date(receiptData.date).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </td>
                        <td className="py-3.5 px-3">
                          <strong className="text-slate-800 font-bold block">{receiptData.planName}</strong>
                          <span className="text-[10px] text-slate-400">Cashfree Production</span>
                        </td>
                        <td className="py-3.5 px-3 font-black text-slate-900">
                          ₹{receiptData.amount}
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold border border-emerald-300">
                            ✓ PAID
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => downloadReceiptPdf(receiptData)}
                              title="Download PDF Tax Invoice"
                              className="px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-[11px] inline-flex items-center gap-1 border border-blue-200 transition-colors"
                            >
                              <Download className="w-3 h-3 text-blue-700" />
                              <span>PDF Receipt</span>
                            </button>
                            <button
                              onClick={() => downloadReceiptImage(receiptData)}
                              title="Download Image Receipt"
                              className="px-2 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-[11px] transition-colors"
                            >
                              <span>PNG</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
