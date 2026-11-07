'use client';

import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ShieldCheck, Sparkles, ArrowRight, Lock, Check } from 'lucide-react';

const GOOGLE_CLIENT_ID = '645773310212-qf4dejug2l2aq275nke8e169j2tuq6su.apps.googleusercontent.com';

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

  const [googleUser, setGoogleUser] = useState<{
    email: string;
    name: string;
    picture?: string;
    sub?: string;
  } | null>(null);

  const [fullName, setFullName] = useState(initialName || '');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(initialPhone || '');
  const [gsiLoaded, setGsiLoaded] = useState(false);

  // Load Google Identity Services script
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if ((window as any).google?.accounts?.oauth2) {
      setGsiLoaded(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => setGsiLoaded(true);
    document.body.appendChild(script);
  }, []);

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
          if (u.email && !u.email.includes('example.com')) {
            setEmail(u.email);
            if (!fullName && u.fullName) setFullName(u.fullName);
            if (!phoneNumber && u.phoneNumber) setPhoneNumber(u.phoneNumber);
          }
        }
      } catch {}
    }
  }, [isOpen, initialName, initialPhone]);

  if (!isOpen) return null;

  // Trigger real Google multiple-accounts selector popup
  const handleLaunchGooglePopup = () => {
    setError(null);
    setLoading(true);

    if (typeof window !== 'undefined' && (window as any).google?.accounts?.oauth2) {
      try {
        const client = (window as any).google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: 'email profile openid',
          prompt: 'select_account',
          callback: async (tokenResponse: any) => {
            if (tokenResponse.error) {
              setLoading(false);
              setError(`Google Sign-In was cancelled or failed: ${tokenResponse.error}`);
              return;
            }

            try {
              // Fetch authenticated user profile from Google's userinfo endpoint
              const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
              });

              if (!userInfoRes.ok) throw new Error('Failed to retrieve Google profile');
              const profile = await userInfoRes.json();

              setGoogleUser({
                email: profile.email,
                name: profile.name,
                picture: profile.picture,
                sub: profile.sub,
              });

              setEmail(profile.email);
              if (profile.name) setFullName(profile.name);

              // Move to Step 2: Compulsory contact details
              setStep('details');
              setLoading(false);
            } catch (err: any) {
              setLoading(false);
              setError(err.message || 'Error reading Google profile');
            }
          },
        });

        client.requestAccessToken({ prompt: 'select_account' });
      } catch (err: any) {
        setLoading(false);
        setError('Could not initialize Google popup. Please check browser popup permissions.');
      }
    } else {
      setLoading(false);
      // Fallback if Google SDK hasn't loaded yet
      setStep('details');
    }
  };

  // Step 2: Save Compulsory Name & WhatsApp Phone Number and Sync
  const handleFinalizeProfile = async (e: React.FormEvent) => {
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
        setError('Please enter a valid Google account email');
        setLoading(false);
        return;
      }

      if (!phoneNumber.trim() || phoneNumber.trim() === '91') {
        setError(
          isCvSite
            ? 'WhatsApp Phone is compulsory for recruiter direct contact on your CV'
            : 'WhatsApp Orders Phone is compulsory to receive customer orders'
        );
        setLoading(false);
        return;
      }

      const avatar =
        googleUser?.picture ||
        `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName.trim())}&backgroundColor=2563eb,1e40af,4338ca`;

      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          fullName: fullName.trim(),
          phoneNumber: phoneNumber.trim(),
          googleId: googleUser?.sub || `google-${Date.now()}`,
          avatarUrl: avatar,
          promoCode: promoCode || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication sync failed');
      }

      const authenticatedUser = data.user || {
        id: `usr-${Date.now()}`,
        email: email.trim().toLowerCase(),
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        avatar_url: avatar,
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
            <span>Linkal 1-Click Google Authentication</span>
          </div>
          <h3 className="text-xl font-extrabold text-zinc-950 tracking-tight">
            {step === 'auth'
              ? isCvSite
                ? 'Sign In to Build Your CV'
                : 'Sign In to Build Your Store'
              : isCvSite
              ? 'Add Contact Info in Your CV'
              : 'Add Details to Your Online Store'}
          </h3>
          <p className="text-xs text-zinc-500 max-w-xs mx-auto leading-relaxed">
            {step === 'auth'
              ? 'Select your Google account from the popup to secure your live link and verified identity.'
              : 'Your verified details will be saved to your profile and displayed on your site.'}
          </p>
        </div>

        {/* First 100 CV Badge */}
        {isCvSite && (
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between text-xs font-bold text-emerald-950">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              100% Free for First 100 CVs
            </span>
            <span className="bg-emerald-600 text-white px-2 py-0.5 rounded-full text-[10px] font-extrabold">
              ₹0 Free Lifetime
            </span>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-bold">
            {error}
          </div>
        )}

        {/* STEP 1: Launch Real Google Multiple-Accounts Selector */}
        {step === 'auth' ? (
          <div className="space-y-4 pt-1">
            <button
              onClick={handleLaunchGooglePopup}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-white border-2 border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50 active:scale-[0.99] text-zinc-800 rounded-2xl font-bold text-sm shadow-sm transition-all"
            >
              {/* Official Google G Logo */}
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>{loading ? 'Opening Google Account Chooser...' : 'Continue with Google (Choose Account)'}</span>
            </button>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-zinc-200"></div>
              <span className="flex-shrink mx-3 text-[11px] font-semibold text-zinc-400">or enter details directly</span>
              <div className="flex-grow border-t border-zinc-200"></div>
            </div>

            <button
              onClick={() => setStep('details')}
              className="w-full py-2.5 px-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl font-bold text-xs transition-colors"
            >
              Enter Name &amp; Phone Manually
            </button>
          </div>
        ) : (
          /* STEP 2: Compulsory Name & Phone Number */
          <form onSubmit={handleFinalizeProfile} className="space-y-3.5">
            {googleUser && (
              <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-2xl flex items-center gap-3">
                {googleUser.picture ? (
                  <img src={googleUser.picture} alt="" className="w-9 h-9 rounded-full object-cover border border-zinc-200" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                    {googleUser.name?.charAt(0) || 'G'}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-xs text-zinc-950 truncate flex items-center gap-1.5">
                    <span>{googleUser.name}</span>
                    <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded">✓ Google Verified</span>
                  </div>
                  <div className="text-[11px] text-zinc-500 font-mono truncate">{googleUser.email}</div>
                </div>
              </div>
            )}

            {/* Email (if not logged via popup) */}
            {!googleUser && (
              <div>
                <label className="block text-[11px] font-bold text-zinc-700 mb-1">
                  Google Account Email *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. yourname@gmail.com"
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-xs font-semibold text-zinc-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            )}

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
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-xs font-semibold text-zinc-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <span className="text-[10px] text-zinc-400 mt-1 block">
                {isCvSite ? 'Displayed in the header and metadata of your CV.' : 'Used for business profile and admin directory.'}
              </span>
            </div>

            {/* Compulsory WhatsApp Phone */}
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
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-xs font-mono font-bold text-zinc-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <span className="text-[10px] text-zinc-500 mt-1 block">
                {isCvSite
                  ? 'Compulsory: Recruiters will tap to message or call you directly.'
                  : 'Compulsory: Customer orders will arrive directly on this WhatsApp.'}
              </span>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setStep('auth')}
                className="px-3.5 py-3 border border-zinc-300 rounded-xl text-xs font-bold text-zinc-600 hover:bg-zinc-50"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 px-4 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all disabled:opacity-50"
              >
                {loading ? 'Saving Profile...' : isCvSite ? 'Save & Build Executive CV →' : 'Save & Open Store Builder →'}
              </button>
            </div>
          </form>
        )}

        {/* Security Footnote */}
        <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-400 font-medium pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-zinc-500" />
          <span>Encrypted with Google Identity &bull; 0 hidden fees</span>
        </div>
      </div>
    </div>
  );
}
