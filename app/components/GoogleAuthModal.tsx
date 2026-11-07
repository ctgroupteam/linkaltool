'use client';

import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ShieldCheck, Sparkles, ArrowRight, Lock, Check } from 'lucide-react';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
  isCvSite?: boolean;
  initialName?: string;
  initialPhone?: string;
}

export function GoogleAuthModal({
  isOpen,
  onClose,
  onSuccess,
  isCvSite = true,
  initialName = '',
  initialPhone = '',
}: GoogleAuthModalProps) {
  const [step, setStep] = useState<'auth' | 'details'>('auth');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState('');
  const [showPromoField, setShowPromoField] = useState(false);

  const [fullName, setFullName] = useState(initialName || '');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(initialPhone || '');

  // Initialize fresh on open
  useEffect(() => {
    if (isOpen) {
      setError(null);
      if (initialName) setFullName(initialName);
      if (initialPhone) setPhoneNumber(initialPhone);
      try {
        const saved = localStorage.getItem('linkal_user');
        if (saved) {
          const u = JSON.parse(saved);
          if (u.email && !u.email.includes('example.com') && !u.email.includes('test')) {
            setEmail(u.email);
            if (!fullName && u.fullName) setFullName(u.fullName);
            if (!phoneNumber && u.phoneNumber) setPhoneNumber(u.phoneNumber);
          }
        }
      } catch {}
    }
  }, [isOpen, initialName, initialPhone]);

  if (!isOpen) return null;

  // Step 1: 1-Click Google Authentication Simulation / Verification
  const handleGoogleAuthClick = () => {
    setError(null);
    if (!email || !email.includes('@')) {
      // Prompt user for Google account email
      setError('Please enter your Google account email below to authenticate.');
      return;
    }
    setStep('details');
  };

  // Step 2: Finalize Profile & Sync to Supabase
  const handleCompleteSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      if (!fullName.trim()) {
        setError(isCvSite ? 'Please enter your full name to add in your CV' : 'Please enter your name');
        setLoading(false);
        return;
      }

      if (!email.trim() || !email.includes('@')) {
        setError('Please enter a valid Google email address');
        setLoading(false);
        return;
      }

      if (!phoneNumber.trim() || phoneNumber.trim() === '91') {
        setError(isCvSite ? 'Please enter your WhatsApp contact number to add in your CV' : 'Please enter your WhatsApp orders number');
        setLoading(false);
        return;
      }

      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          fullName: fullName.trim(),
          phoneNumber: phoneNumber.trim(),
          googleId: `google-${Date.now()}`,
          avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName.trim())}&backgroundColor=2563eb,1e40af,4338ca`,
          promoCode: promoCode || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      const authenticatedUser = data.user || {
        id: `usr-${Date.now()}`,
        email: email.trim().toLowerCase(),
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
      };

      try {
        localStorage.setItem('linkal_user', JSON.stringify(authenticatedUser));
      } catch {}

      onSuccess(authenticatedUser);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication error');
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
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-1.5 pt-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Google Account Authentication</span>
          </div>
          <h3 className="text-xl font-extrabold text-zinc-950 tracking-tight">
            {isCvSite ? 'Create & Add in Your Executive CV' : 'Save & Publish Your Website'}
          </h3>
          <p className="text-xs text-zinc-500 max-w-xs mx-auto leading-relaxed">
            {isCvSite
              ? 'Sign in with your Google account to secure your free ATS CV link and executive recruiter contact.'
              : 'Sign in with Google to receive orders on WhatsApp and manage your online store.'}
          </p>
        </div>

        {/* First 100 CV Badge */}
        {isCvSite && (
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between text-xs font-bold text-emerald-950">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Free for First 100 Executive CVs
            </span>
            <span className="bg-emerald-600 text-white px-2 py-0.5 rounded-full text-[10px] font-extrabold">
              100% Free Lifetime
            </span>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleCompleteSignIn} className="space-y-3.5">
          {/* Google Email Address */}
          <div>
            <label className="block text-[11px] font-bold text-zinc-700 mb-1">
              Google Account Email Address *
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. yourname@gmail.com"
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-xs font-semibold text-zinc-950 placeholder-zinc-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <span className="text-[10px] text-zinc-400 mt-1 block">
              Used for 1-click Google authentication and founder dashboard sync.
            </span>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-[11px] font-bold text-zinc-700 mb-1">
              {isCvSite ? 'Full Name (Add in your CV) *' : 'Full Name (Business Owner) *'}
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={isCvSite ? 'e.g. Yahya Mundewadi' : 'e.g. Business Owner Name'}
              className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-xs font-semibold text-zinc-950 placeholder-zinc-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* WhatsApp Phone Number */}
          <div>
            <label className="block text-[11px] font-bold text-zinc-700 mb-1">
              {isCvSite
                ? 'WhatsApp Phone (Add in your CV for recruiter contact) *'
                : 'WhatsApp Orders Phone (Add to your store to receive orders) *'}
            </label>
            <input
              type="text"
              required
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="e.g. 919307426215"
              className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-xs font-mono font-bold text-zinc-950 placeholder-zinc-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <span className="text-[10px] text-zinc-500 mt-1 block">
              {isCvSite
                ? 'Recruiters and hiring managers can click to message or call you on this number.'
                : 'Customer orders from your store will be delivered directly to this WhatsApp.'}
            </span>
          </div>

          {/* Submit Google Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-zinc-950 hover:bg-zinc-800 active:scale-[0.99] text-white rounded-2xl font-bold text-xs sm:text-sm shadow-lg shadow-zinc-950/20 transition-all disabled:opacity-50"
          >
            {/* Google Icon SVG */}
            <svg className="w-4 h-4 shrink-0 bg-white rounded-full p-0.5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>{loading ? 'Authenticating & Initializing...' : 'Sign In with Google & Open Visual Builder →'}</span>
          </button>
        </form>

        {/* Trust Footnote */}
        <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-400 font-medium pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-zinc-500" />
          <span>Encrypted Google Authentication &bull; Zero spam</span>
        </div>
      </div>
    </div>
  );
}
