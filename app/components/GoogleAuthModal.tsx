'use client';

import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ShieldCheck, Sparkles, ArrowLeft, Check } from 'lucide-react';

const GOOGLE_CLIENT_ID = '645773310212-qf4dejug2l2aq275nke8e169j2tuq6su.apps.googleusercontent.com';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
  isCvSite?: boolean;
  initialName?: string;
  initialPhone?: string;
  inline?: boolean;
}

export function GoogleAuthModal({
  isOpen,
  onClose,
  onSuccess,
  isCvSite = true,
  initialName = '',
  initialPhone = '',
  inline = false,
}: GoogleAuthModalProps) {
  const [tab, setTab] = useState<'signup' | 'signin' | 'forgot'>('signup');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [googleUser, setGoogleUser] = useState<{
    email: string;
    name: string;
    picture?: string;
    sub?: string;
  } | null>(null);

  // Clean form fields (never stale)
  const [fullName, setFullName] = useState(initialName || '');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(initialPhone || '');
  const [password, setPassword] = useState('');
  const [gsiLoaded, setGsiLoaded] = useState(false);
  // Cross-domain cookie and localStorage session syncer
  const saveSessionAcrossDomains = (userData: any) => {
    try {
      localStorage.setItem('linkal_user', JSON.stringify(userData));
      const encoded = encodeURIComponent(JSON.stringify(userData));
      document.cookie = `linkal_user=${encoded}; path=/; domain=.linkal.in; max-age=31536000; SameSite=Lax`;
      document.cookie = `linkal_user=${encoded}; path=/; max-age=31536000; SameSite=Lax`;
      document.cookie = `linkal_user_email=${encodeURIComponent(userData.email || '')}; path=/; max-age=31536000; SameSite=Lax`;
    } catch {}
  };


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

  // When modal opens fresh: reset error and state so NO stale old account data appears
  useEffect(() => {
    if (isOpen) {
      setError(null);
      setSuccessMsg(null);
      setFullName(initialName || '');
      setPhoneNumber(initialPhone || '');
      setEmail('');
      setPassword('');
      setGoogleUser(null);
      if (typeof window !== 'undefined') {
        try {
          if ((window as any).google?.accounts?.id?.disableAutoSelect) {
            (window as any).google.accounts.id.disableAutoSelect();
          }
          const lastToken = sessionStorage.getItem('g_last_access_token');
          if (lastToken && (window as any).google?.accounts?.oauth2?.revoke) {
            (window as any).google.accounts.oauth2.revoke(lastToken, () => {});
            sessionStorage.removeItem('g_last_access_token');
          }
        } catch {}
      }
    }
  }, [isOpen, initialName, initialPhone]);

  if (!isOpen && !inline) return null;

  // Trigger Google Account Selector Popup (Forces account chooser on every device)
  const handleLaunchGooglePopup = () => {
    setError(null);
    setLoading(true);

    if (typeof window !== 'undefined' && (window as any).google?.accounts?.oauth2) {
      try {
        if ((window as any).google?.accounts?.id?.disableAutoSelect) {
          try {
            (window as any).google.accounts.id.disableAutoSelect();
          } catch {}
        }
        const lastToken = sessionStorage.getItem('g_last_access_token');
        if (lastToken && (window as any).google?.accounts?.oauth2?.revoke) {
          try {
            (window as any).google.accounts.oauth2.revoke(lastToken, () => {});
            sessionStorage.removeItem('g_last_access_token');
          } catch {}
        }

        const client = (window as any).google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: 'email profile openid',
          prompt: 'select_account consent',
          callback: async (tokenResponse: any) => {
            if (tokenResponse.error) {
              setLoading(false);
              setError(`Google Sign-In was cancelled: ${tokenResponse.error}`);
              return;
            }

            try {
              if (tokenResponse.access_token) {
                try {
                  sessionStorage.setItem('g_last_access_token', tokenResponse.access_token);
                } catch {}
              }

              const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
              });

              if (!userInfoRes.ok) throw new Error('Failed to retrieve Google profile');
              const profile = await userInfoRes.json();

              const cleanEmail = (profile.email || '').toLowerCase().trim();
              const cleanName = (profile.name || cleanEmail.split('@')[0]).trim();
              const avatar = profile.picture || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}&backgroundColor=2563eb,1e40af,4338ca`;

              setGoogleUser({
                email: cleanEmail,
                name: cleanName,
                picture: avatar,
                sub: profile.sub,
              });

              setEmail(cleanEmail);
              setFullName(cleanName);

              // Clear any stale cached user session
              try {
                localStorage.removeItem('linkal_user');
                sessionStorage.removeItem('linkal_user');
              } catch {}

              // Immediately authenticate user with backend and trigger admin push notification
              const authRes = await fetch('/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  action: 'google_signin',
                  email: cleanEmail,
                  fullName: cleanName,
                  googleId: profile.sub,
                  avatarUrl: avatar,
                  phoneNumber: phoneNumber.trim() || undefined,
                }),
              });

              const authData = await authRes.json();
              if (!authRes.ok) throw new Error(authData.error || 'Google Sign-In failed');

              const authenticatedUser = authData.user || {
                id: `usr-${Date.now()}`,
                email: cleanEmail,
                fullName: cleanName,
                phoneNumber: authData.user?.phoneNumber || phoneNumber.trim() || '',
                avatar_url: avatar,
              };

              saveSessionAcrossDomains(authenticatedUser);
              onSuccess(authenticatedUser);
              if (!inline) onClose();
            } catch (err: any) {
              setLoading(false);
              setError(err.message || 'Error reading Google profile');
            }
          },
        });

        client.requestAccessToken({ prompt: 'select_account consent' });
      } catch (err: any) {
        setLoading(false);
        setError('Could not open Google popup. Please enter your email below.');
      }
    } else {
      setLoading(false);
      setError('Google Sign-In is initializing. Please try again in 2 seconds.');
    }
  };

  // Submit Handler: Sign Up or Sign In
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setSuccessMsg(null);

      // Forgot Password Flow
      if (tab === 'forgot') {
        if (!email.trim() && !phoneNumber.trim()) {
          setError('Please enter your email or phone number');
          setLoading(false);
          return;
        }

        const res = await fetch('/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'forgot_password',
            email: email.trim().toLowerCase(),
            phoneNumber: phoneNumber.trim(),
            fullName: fullName.trim() || undefined,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Reset request failed');

        setSuccessMsg('Reset request sent! Founder Admin has been notified via WhatsApp and will assist you shortly.');
        setLoading(false);
        return;
      }

      // Sign In Flow
      if (tab === 'signin') {
        if (!email.trim() || !email.includes('@')) {
          setError('Please enter your registered email');
          setLoading(false);
          return;
        }
        if (!password.trim()) {
          setError('Please enter your password');
          setLoading(false);
          return;
        }

        const res = await fetch('/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'signin',
            email: email.trim().toLowerCase(),
            password: password.trim(),
            fullName: fullName.trim() || undefined,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Sign in failed');

        const authenticatedUser = data.user || {
          email: email.trim().toLowerCase(),
          fullName: fullName.trim() || email.split('@')[0],
          phoneNumber: phoneNumber.trim(),
        };

        saveSessionAcrossDomains(authenticatedUser);
        onSuccess(authenticatedUser);
        if (!inline) onClose();
        return;
      }

      // Sign Up Flow (Create Account)
      if (!fullName.trim()) {
        setError(isCvSite ? 'Please enter your full name to add in your CV' : 'Please enter your full name');
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

      if (!password.trim() || password.trim().length < 4) {
        setError('Please create a secure password (min 4 characters)');
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
          action: 'signup',
          email: email.trim().toLowerCase(),
          fullName: fullName.trim(),
          phoneNumber: phoneNumber.trim(),
          password: password.trim(),
          googleId: googleUser?.sub || `google-${Date.now()}`,
          avatarUrl: avatar,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Account creation failed');

      const authenticatedUser = data.user || {
        id: `usr-${Date.now()}`,
        email: email.trim().toLowerCase(),
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        avatar_url: avatar,
      };

      saveSessionAcrossDomains(authenticatedUser);
      onSuccess(authenticatedUser);
      if (!inline) onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  const formContent = (
    <div className={`relative w-full max-w-md bg-white rounded-3xl border border-zinc-200 p-6 sm:p-7 space-y-4 ${
      inline ? 'shadow-sm mx-auto' : 'shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto'
    }`}>
      {!inline && (
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      )}

        {/* Header Badge */}
        <div className="text-center space-y-1.5 pt-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Linkal Cloud Identity</span>
          </div>

          <h3 className="text-xl font-extrabold text-zinc-950 tracking-tight">
            {tab === 'forgot'
              ? 'Password Assistance'
              : tab === 'signin'
              ? isCvSite
                ? 'Sign In to Your CV'
                : 'Sign In to Your Store'
              : isCvSite
              ? 'Create Account to Build CV'
              : 'Create Account for Your Store'}
          </h3>

          <p className="text-xs text-zinc-500 max-w-xs mx-auto leading-relaxed">
            {tab === 'forgot'
              ? 'Enter your registered email or WhatsApp number to notify Founder Admin.'
              : tab === 'signin'
              ? 'Sign in with your credentials to manage your hosted websites and analytics.'
              : isCvSite
              ? 'Fill your contact details to add into your ATS-friendly CV and set a password.'
              : 'Fill your business contact details to receive WhatsApp customer orders.'}
          </p>
        </div>

        {/* Tab Switcher: Sign Up vs Sign In */}
        {tab !== 'forgot' && (
          <div className="flex rounded-2xl bg-zinc-100 p-1 border border-zinc-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setTab('signup');
                setError(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 py-2 rounded-xl transition-all ${
                tab === 'signup'
                  ? 'bg-white text-zinc-950 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              Create Account
            </button>
            <button
              type="button"
              onClick={() => {
                setTab('signin');
                setError(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 py-2 rounded-xl transition-all ${
                tab === 'signin'
                  ? 'bg-white text-zinc-950 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              Sign In
            </button>
          </div>
        )}

        {/* Free Lifetime CV Badge */}
        {isCvSite && tab === 'signup' && (
          <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between text-xs font-bold text-emerald-950">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Lifetime Free CV Website
            </span>
            <span className="bg-emerald-600 text-white px-2 py-0.5 rounded-full text-[10px] font-extrabold">
              Lifetime Free
            </span>
          </div>
        )}

        {/* Status Alerts */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-bold">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-bold">
            {successMsg}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-3 pt-1">
          {/* Google 1-Click Chooser Button */}
          {tab !== 'forgot' && (
            <div className="space-y-2">
              {googleUser ? (
                <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {googleUser.picture ? (
                      <img src={googleUser.picture} alt={googleUser.name} className="w-8 h-8 rounded-full border border-blue-300 object-cover shrink-0" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {googleUser.name ? googleUser.name[0].toUpperCase() : 'G'}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-zinc-950 truncate">{googleUser.name || 'Google Account'}</p>
                      <p className="text-[11px] text-zinc-500 font-mono truncate">{googleUser.email}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleLaunchGooglePopup}
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-800 underline shrink-0 ml-2"
                  >
                    Change Account
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleLaunchGooglePopup}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 bg-white border border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50 active:scale-[0.99] text-zinc-800 rounded-xl font-bold text-xs shadow-xs transition-all"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>1-Click Google Account Chooser</span>
                </button>
              )}

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-zinc-200"></div>
                <span className="flex-shrink mx-2 text-[10px] font-semibold text-zinc-400">or enter details</span>
                <div className="flex-grow border-t border-zinc-200"></div>
              </div>
            </div>
          )}

          {/* Full Name (Sign Up only) */}
          {tab === 'signup' && (
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
            </div>
          )}

          {/* Email Address */}
          <div>
            <label className="block text-[11px] font-bold text-zinc-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. name@gmail.com"
              className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-xs font-semibold text-zinc-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* WhatsApp Phone (Sign Up & Forgot Password) */}
          {(tab === 'signup' || tab === 'forgot') && (
            <div>
              <label className="block text-[11px] font-bold text-zinc-700 mb-1">
                {isCvSite
                  ? 'WhatsApp Phone (Add in your CV for recruiter contact) *'
                  : 'WhatsApp Orders Phone (Add to your store to receive orders) *'}
              </label>
              <input
                type="text"
                required={tab === 'signup'}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="e.g. 919307426215"
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-xs font-mono font-bold text-zinc-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          )}

          {/* Password (Sign Up & Sign In) */}
          {tab !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-zinc-700">
                  Password *
                </label>
                {tab === 'signin' && (
                  <button
                    type="button"
                    onClick={() => {
                      setTab('forgot');
                      setError(null);
                      setSuccessMsg(null);
                    }}
                    className="text-[10px] font-bold text-blue-600 hover:underline"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={tab === 'signup' ? 'Create a secure password' : 'Enter your password'}
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-xs font-semibold text-zinc-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          )}

          {/* Submit Actions */}
          <div className="pt-2 space-y-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-zinc-950 hover:bg-zinc-800 active:scale-[0.99] text-white rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all disabled:opacity-50"
            >
              {loading
                ? 'Processing...'
                : tab === 'forgot'
                ? 'Notify Admin for Password Reset →'
                : tab === 'signin'
                ? 'Sign In to Account →'
                : isCvSite
                ? 'Create Account & Build CV →'
                : 'Create Account & Open Store Builder →'}
            </button>

            {tab === 'forgot' && (
              <button
                type="button"
                onClick={() => {
                  setTab('signin');
                  setError(null);
                  setSuccessMsg(null);
                }}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 text-zinc-500 hover:text-zinc-950 text-xs font-bold"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </button>
            )}
          </div>
        </form>

        {/* Security Footnote */}
        <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-400 font-medium pt-1 border-t border-zinc-100">
          <ShieldCheck className="w-3.5 h-3.5 text-zinc-500" />
          <span>Encrypted Cloud Identity &bull; 0 hidden fees</span>
        </div>
      </div>
  );

  if (inline) {
    return formContent;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      {formContent}
    </div>
  );
}
