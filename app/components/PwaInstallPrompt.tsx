'use client';

import React, { useEffect, useState } from 'react';
import { Smartphone, Download, X, Clock } from 'lucide-react';

const STORAGE_KEY = 'linkal_pwa_prompt_history';
const MAX_PROMPTS_PER_DAY = 3;

export function PwaInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // 0. Register Service Worker for PWA installability
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('[PWA] Service Worker active:', reg.scope);
        })
        .catch((err) => {
          console.warn('[PWA] Service Worker registration issue:', err);
        });
    }

    // 1. Check if already installed in standalone mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    if (isStandalone) {
      return;
    }

    // 2. Check 3 times a day limit
    const checkFrequencyCap = () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const history: number[] = raw ? JSON.parse(raw) : [];
        const now = Date.now();
        const oneDayMs = 24 * 60 * 60 * 1000;
        const validToday = history.filter((t) => now - t < oneDayMs);

        if (validToday.length < MAX_PROMPTS_PER_DAY) {
          // Trigger prompt after a brief 2-second delay for smooth UX
          const timer = setTimeout(() => {
            setShowPrompt(true);
          }, 2000);
          return () => clearTimeout(timer);
        }
      } catch (err) {
        console.warn('PWA cap check error:', err);
      }
    };

    checkFrequencyCap();

    // 3. Capture native install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const recordImpression = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const history: number[] = raw ? JSON.parse(raw) : [];
      const now = Date.now();
      const oneDayMs = 24 * 60 * 60 * 1000;
      const validToday = history.filter((t) => now - t < oneDayMs);
      validToday.push(now);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(validToday));
    } catch {}
  };

  const handleInstallClick = async () => {
    recordImpression();
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    } else {
      // Fallback guide for iOS or desktop where beforeinstallprompt isn't fired
      alert('To install: Tap your browser share/menu icon and select "Add to Home Screen".');
      setShowPrompt(false);
    }
  };

  const handleRemindLater = () => {
    recordImpression();
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-sm z-50 animate-in slide-in-from-bottom duration-300">
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xl p-4.5 space-y-3.5 backdrop-blur-md bg-white/95">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-950">Install Linkal Studio</h4>
              <p className="text-[11px] text-zinc-500 leading-tight">Fast 1-tap mobile website management</p>
            </div>
          </div>
          <button
            onClick={handleRemindLater}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-zinc-600 leading-relaxed">
          Install Linkal Studio to keep editing your website seamlessly from your mobile anytime.
        </p>

        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={handleInstallClick}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install App</span>
          </button>
          <button
            onClick={handleRemindLater}
            className="inline-flex items-center justify-center gap-1 px-3 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl text-xs font-semibold transition-colors"
          >
            <Clock className="w-3.5 h-3.5 text-zinc-500" />
            <span>Remind Later</span>
          </button>
        </div>
      </div>
    </div>
  );
}

