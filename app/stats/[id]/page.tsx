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

        {/* The 2 Primary Stats Required: Visits & Clicks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Total Visits Card */}
          <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-7 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-zinc-500 uppercase tracking-wider">
                Total Visits
              </span>
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Eye className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight">
                {(site.visitsCount || 0).toLocaleString()}
              </div>
              <p className="text-xs text-zinc-500 mt-1">
                Unique visitor views on {site.slug}.linkal.in
              </p>
            </div>
          </div>

          {/* Total Clicks Card */}
          <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-7 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-zinc-500 uppercase tracking-wider">
                {isCv ? 'Direct Contact Clicks' : 'Total Orders & WhatsApp Clicks'}
              </span>
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <MousePointerClick className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight">
                {(site.clicksCount || 0).toLocaleString()}
              </div>
              <p className="text-xs text-zinc-500 mt-1">
                {isCv
                  ? 'Recruiters tapping phone, email, and LinkedIn links'
                  : 'Customers clicking "Buy on WhatsApp" and CTA buttons'}
              </p>
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
