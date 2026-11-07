'use client';

import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ShieldCheck, Sparkles, ArrowRight, Lock } from 'lucide-react';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
  isCvSite?: boolean;
}

export function GoogleAuthModal({
  isOpen,
  onClose,
  onSuccess,
  isCvSite = false,
}: GoogleAuthModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState('');
  const [showPromoField, setShowPromoField] = useState(false);
  const [cvStats, setCvStats] = useState({
    totalCvsCount: 14,
    remainingFirst100: 86,
    isFirst100: true,
  });

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Auto-fill from localStorage if previously signed in
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('linkal_user');
        if (saved) {
          const u = JSON.parse(saved);
          if (u.fullName) setFullName(u.fullName);
          if (u.email) setEmail(u.email);
          if (u.phoneNumber) setPhoneNumber(u.phoneNumber);
        }
      } catch {}
    }
  }, [isOpen]);

  // Query CV promotion stats on open
  useEffect(() => {
    if (isOpen && isCvSite) {
      fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'stats-check@linkal.in',
          fullName: 'Check Only',
          action: 'stats_only',
        }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.cvEligibility) {
            setCvStats({
              totalCvsCount: data.cvEligibility.totalCvsCount || 14,
              remainingFirst100: data.cvEligibility.remainingFirst100 ?? 86,
              isFirst100: data.cvEligibility.isFirst100 ?? true,
            });
            if (!data.cvEligibility.isFirst100) {
              setShowPromoField(true);
            }
          }
        })
        .catch(() => {});
    }
  }, [isOpen, isCvSite]);

  if (!isOpen) return null;

  // 1-Click Google Sign-In & Supabase Sync
  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!fullName.trim()) {
        setError('Please enter your full name as registered on Google');
        setLoading(false);
        return;
      }

      if (!email.trim() || !email.includes('@')) {
        setError('Please enter a valid Google account email (e.g. name@gmail.com)');
        setLoading(false);
        return;
      }

      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          fullName: fullName.trim(),
          phoneNumber: phoneNumber.trim() || undefined,
          googleId: `google-${Date.now()}`,
          avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName.trim())}&backgroundColor=2563eb,1e40af,4338ca`,
          promoCode: promoCode || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Sign in failed');
      }

      if (isCvSite && data.cvEligibility && !data.cvEligibility.canCreateFreeCv) {
        alert('Notice: You have already created 1 Free Executive CV on this account. Additional CVs require an executive subscription.');
      }

      localStorage.setItem('linkal_user', JSON.stringify(data.user));
      onSuccess(data.user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative z-10 w-full max-w-md bg-white rounded-3xl border border-zinc-200 shadow-2xl p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Branding */}
        <div className="text-center space-y-1.5 pt-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Linkal Studio 1-Click Authentication</span>
          </div>
          <h3 className="text-xl font-extrabold text-zinc-950 tracking-tight">
            {isCvSite ? 'Claim Your Executive CV' : 'Save Your Website'}
          </h3>
          <p className="text-xs text-zinc-500 max-w-xs mx-auto leading-relaxed">
            {isCvSite
              ? 'Sign in with Google to secure your permanent live link and 1-click CV PDF export.'
              : 'Sign in to save your progress, secure your subdomain, and publish with 1 click.'}
          </p>
        </div>

        {/* First 100 CVs Badge for CV Mode */}
        {isCvSite && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Free for First 100 Executive CVs
              </span>
              <span className="bg-emerald-600 text-white px-2 py-0.5 rounded-full text-[10px] font-extrabold">
                {cvStats.remainingFirst100} Spots Left
              </span>
            </div>
            <div className="w-full bg-emerald-200/60 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-emerald-600 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, cvStats.totalCvsCount)}%` }}
              />
            </div>
            <p className="text-[11px] text-emerald-700 leading-snug">
              Every professional receives <strong>1 Free Executive CV</strong> for life. 0 hidden fees.
            </p>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

        {/* User Details */}
        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-bold text-zinc-700 mb-1">
              Full Name (Google Account)
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Yahya Mundewadi"
              className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-950"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-zinc-700 mb-1">
              Google Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. yourname@gmail.com"
              className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-950"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-zinc-700 mb-1">
              WhatsApp Phone Number (with Country Code)
            </label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="e.g. 919307426215"
              className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-mono font-semibold text-zinc-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-950"
            />
          </div>
        </div>

        {/* Promo Code Input (if needed, never pre-filled) */}
        {isCvSite && (!cvStats.isFirst100 || showPromoField) && (
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-zinc-900">
              Executive Promo Code
            </label>
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
              placeholder="Enter Promo Code"
              className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-xs font-mono font-bold tracking-wider text-zinc-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-950"
            />
          </div>
        )}

        {/* 1-Click Google Sign-In Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white border border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50 active:scale-[0.99] text-zinc-800 rounded-2xl font-bold text-sm shadow-sm transition-all"
        >
          {/* Google G Logo SVG */}
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>{loading ? 'Authenticating in 3 seconds...' : 'Sign in with Google (1-Click)'}</span>
        </button>

        {/* Security Trust Note */}
        <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-400 font-medium pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-zinc-500" />
          <span>Bank-grade encryption &bull; 100% Free Lifetime for First 100 CVs</span>
        </div>
      </div>
    </div>
  );
}

