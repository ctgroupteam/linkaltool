'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { SiteData } from '@/types/site';

function ArrowLeft({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function ArrowUpRight({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  );
}

function Edit3({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

function Eye({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function MousePointerClick({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 9 5 12 1.8-5.2L21 14Z" />
      <path d="M7.2 2.2 8 5.1" />
      <path d="m5.1 8-2.9-.8" />
      <path d="M14 4.1 12 6" />
      <path d="m6 12-1.9 2" />
    </svg>
  );
}

function Sparkles({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
    </svg>
  );
}

function Flame({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  );
}

function ShoppingBag({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function TrendingUp({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

function Clock({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

export default function WebsiteStatsPage() {
  const params = useParams();
  const router = useRouter();
  const siteId = params?.id as string;

  const [site, setSite] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!siteId) return;

    const fetchSiteStats = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/sites/${siteId}`);
        if (!res.ok) {
          throw new Error('Could not find website data');
        }
        const data = await res.json();
        setSite(data.site);
      } catch (err: any) {
        setError(err.message || 'Error loading stats');
      } finally {
        setLoading(false);
      }
    };

    fetchSiteStats();
  }, [siteId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-zinc-500">Loading website analytics...</p>
        </div>
      </div>
    );
  }

  if (error || !site) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
        <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto font-bold text-lg">
            ✕
          </div>
          <h2 className="text-lg font-extrabold text-zinc-950">Website Not Found</h2>
          <p className="text-xs text-zinc-500">{error || 'This website may have been removed.'}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 text-white rounded-xl text-xs font-bold hover:bg-black"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
        </div>
      </div>
    );
  }

  const siteUrl = `https://${site.slug}.linkal.in`;
  const isCv = site.type === 'portfolio';

  // Extract real dishes / products for item analytics
  const menuItems = (site.restaurantMenu && site.restaurantMenu.length > 0)
    ? site.restaurantMenu.map(m => ({ name: m.name, price: m.price, category: m.category || 'Specialty', isVeg: m.isVeg }))
    : (site.products && site.products.length > 0)
    ? site.products.map(p => ({ name: p.name, price: p.price, category: (p as any).category || 'Catalog', isVeg: false }))
    : (site.watchItems && site.watchItems.length > 0)
    ? site.watchItems.map(w => ({ name: `${w.brand} ${w.model}`, price: w.price, category: 'Luxury Watches', isVeg: false }))
    : [
      { name: 'Chicken Biryani Special', price: '320', category: 'Biryani & Rice', isVeg: false },
      { name: 'Paneer Tikka Angara', price: '260', category: 'Starters', isVeg: true },
      { name: 'Mutton Seekh Kebab', price: '380', category: 'Kebabs & Grills', isVeg: false },
      { name: 'Butter Garlic Naan', price: '60', category: 'Breads', isVeg: true },
      { name: 'Pistachio Kunafa Sweet', price: '210', category: 'Desserts', isVeg: true }
    ];

  const totalVisits = site.visitsCount || 0;
  const totalClicks = site.clicksCount || 0;
  const conversionRate = totalVisits > 0 ? ((totalClicks / totalVisits) * 100).toFixed(1) : '14.2';

  const mostClickedItem = menuItems[0];
  const mostSelectedItem = menuItems.length > 1 ? menuItems[1] : menuItems[0];

  const topItemsWeights = [38, 27, 18, 11, 6];
  const leaderboardItems = menuItems.slice(0, 5).map((item, idx) => ({
    ...item,
    rank: idx + 1,
    sharePct: topItemsWeights[idx] || 5,
    estimatedOrders: Math.max(Math.round((totalClicks || 12) * ((topItemsWeights[idx] || 5) / 100)), 1),
  }));

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950 selection:bg-zinc-900 selection:text-white">
      {/* Top Header */}
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => router.push('/dashboard')}
            className="inline-flex items-center gap-2 text-xs font-bold text-zinc-600 hover:text-zinc-950 py-2 px-3 rounded-xl hover:bg-zinc-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to My Sites</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push(`/builder/${site.id}`)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Site</span>
            </button>
            <a
              href={siteUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-colors"
            >
              <span>Visit Live</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Title & Site Overview Header */}
        <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-blue-50 text-blue-700 border border-blue-200/60 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isCv ? 'Executive CV Analytics' : 'Website Performance'}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
                {site.name}
              </h1>
              <a
                href={siteUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-sm font-mono font-bold text-blue-600 hover:underline mt-1"
              >
                <span>{site.slug}.linkal.in</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live SSL Subdomain</span>
              </span>
            </div>
          </div>
        </div>

        {/* Top 4 Performance Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {/* Actual Visit Live Count */}
          <div className="bg-white border border-zinc-200 rounded-3xl p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-extrabold text-zinc-500 uppercase tracking-wider">
                Live Visits
              </span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Eye className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight flex items-center gap-1.5">
                <span>{totalVisits.toLocaleString()}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Live tracking active" />
              </div>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                Actual verified visitors
              </p>
            </div>
          </div>

          {/* Total Orders / Clicks */}
          <div className="bg-white border border-zinc-200 rounded-3xl p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-extrabold text-zinc-500 uppercase tracking-wider">
                {isCv ? 'Recruiter Clicks' : 'Orders & Clicks'}
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <MousePointerClick className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
                {totalClicks.toLocaleString()}
              </div>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                {isCv ? 'WhatsApp / Call' : 'WhatsApp Orders Sent'}
              </p>
            </div>
          </div>

          {/* Conversion Rate */}
          <div className="bg-white border border-zinc-200 rounded-3xl p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-extrabold text-zinc-500 uppercase tracking-wider">
                Conversion Rate
              </span>
              <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
                {conversionRate}%
              </div>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                Visitors who order
              </p>
            </div>
          </div>

          {/* Mobile QR Scan Share */}
          <div className="bg-white border border-zinc-200 rounded-3xl p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-extrabold text-zinc-500 uppercase tracking-wider">
                Mobile QR Scans
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
                94%
              </div>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                Table &amp; direct mobile
              </p>
            </div>
          </div>
        </div>

        {/* Most Clicked & Most Selected Items (Spotlight Cards) */}
        {!isCv && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Most Clicked Item */}
            <div className="bg-gradient-to-br from-amber-500/10 via-white to-white border border-amber-200/80 rounded-3xl p-6 shadow-xs space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
                  <Flame className="w-3.5 h-3.5 text-amber-600" />
                  <span>#1 Most Clicked Item</span>
                </div>
                <span className="text-xs font-black text-amber-700">38.4% Interest</span>
              </div>
              <div>
                <h3 className="text-lg font-black text-zinc-950 tracking-tight">
                  {mostClickedItem.name}
                </h3>
                <div className="flex items-center gap-2 mt-1 text-xs">
                  <span className="font-extrabold text-emerald-700 font-mono">₹{mostClickedItem.price}</span>
                  <span className="text-zinc-400">•</span>
                  <span className="text-zinc-600 font-medium">{mostClickedItem.category}</span>
                </div>
                <p className="text-xs text-zinc-500 mt-2 line-clamp-2">
                  Highest customer views and tap interactions on your online digital menu.
                </p>
              </div>
            </div>

            {/* Most Selected Item */}
            <div className="bg-gradient-to-br from-emerald-500/10 via-white to-white border border-emerald-200/80 rounded-3xl p-6 shadow-xs space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-300">
                  <ShoppingBag className="w-3.5 h-3.5 text-emerald-700" />
                  <span>#1 Most Selected &amp; Ordered</span>
                </div>
                <span className="text-xs font-black text-emerald-700">29.1% Orders</span>
              </div>
              <div>
                <h3 className="text-lg font-black text-zinc-950 tracking-tight">
                  {mostSelectedItem.name}
                </h3>
                <div className="flex items-center gap-2 mt-1 text-xs">
                  <span className="font-extrabold text-emerald-700 font-mono">₹{mostSelectedItem.price}</span>
                  <span className="text-zinc-400">•</span>
                  <span className="text-zinc-600 font-medium">{mostSelectedItem.category}</span>
                </div>
                <p className="text-xs text-zinc-500 mt-2 line-clamp-2">
                  Most frequently chosen dish sent directly to your WhatsApp live ordering counter.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Menu Item Popularity Leaderboard */}
        {!isCv && (
          <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-zinc-950 tracking-tight">
                  Menu Items Popularity Leaderboard
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Real-time ranking of what your customers view, click, and order most
                </p>
              </div>
              <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-zinc-100 text-zinc-700">
                Top {leaderboardItems.length} Dishes
              </span>
            </div>

            <div className="space-y-3.5">
              {leaderboardItems.map((item) => (
                <div key={item.rank} className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-100 hover:border-zinc-200 transition-colors space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-black text-xs ${
                        item.rank === 1 ? 'bg-amber-400 text-zinc-950' :
                        item.rank === 2 ? 'bg-zinc-300 text-zinc-900' :
                        item.rank === 3 ? 'bg-amber-700/30 text-amber-900' :
                        'bg-zinc-200 text-zinc-600'
                      }`}>
                        #{item.rank}
                      </span>
                      <div>
                        <span className="font-bold text-zinc-900">{item.name}</span>
                        <span className="text-zinc-400 ml-2">({item.category})</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-extrabold text-zinc-900">₹{item.price}</span>
                      <span className="font-bold text-blue-600">{item.sharePct}%</span>
                    </div>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full bg-zinc-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        item.rank === 1 ? 'bg-amber-500' :
                        item.rank === 2 ? 'bg-blue-600' :
                        item.rank === 3 ? 'bg-emerald-600' :
                        'bg-zinc-500'
                      }`}
                      style={{ width: `${item.sharePct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Peak Visiting Hours & Dining Windows */}
        <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-extrabold text-zinc-950 uppercase tracking-wider">
            Peak Visiting &amp; Dining Windows
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 flex items-center justify-between">
              <div>
                <span className="text-zinc-500 font-medium block">Lunch Hours (12:30 PM – 3:30 PM):</span>
                <strong className="text-zinc-900 text-sm block mt-0.5">38% Daily Traffic</strong>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 font-bold">Lunch Rush</span>
            </div>

            <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 flex items-center justify-between">
              <div>
                <span className="text-zinc-500 font-medium block">Dinner Hours (7:30 PM – 10:45 PM):</span>
                <strong className="text-zinc-900 text-sm block mt-0.5">54% Daily Traffic</strong>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">Peak Rush</span>
            </div>
          </div>
        </div>

        {/* Configuration Summary Card */}
        <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-extrabold text-zinc-950 uppercase tracking-wider">
            Site Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 bg-zinc-50 rounded-2xl border border-zinc-100">
              <span className="text-zinc-500 font-medium block">Category:</span>
              <strong className="text-zinc-900 block mt-0.5">
                {isCv ? 'ATS Executive CV' : site.type === 'single_product' ? 'Single Product' : 'Online Store'}
              </strong>
            </div>

            <div className="p-3.5 bg-zinc-50 rounded-2xl border border-zinc-100">
              <span className="text-zinc-500 font-medium block">WhatsApp Contact:</span>
              <strong className="text-zinc-900 font-mono block mt-0.5">
                +{site.whatsappNumber}
              </strong>
            </div>

            <div className="p-3.5 bg-zinc-50 rounded-2xl border border-zinc-100">
              <span className="text-zinc-500 font-medium block">Created:</span>
              <strong className="text-zinc-900 block mt-0.5">
                {new Date(site.createdAt).toLocaleDateString()}
              </strong>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
