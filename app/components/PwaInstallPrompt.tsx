'use client';

import React, { useEffect, useState } from 'react';
import { Smartphone, Download, X, Check } from 'lucide-react';

function BellRingIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
      <path d="M4 2C2.8 3.7 2 5.7 2 8" />
      <path d="M22 8c0-2.3-.8-4.3-2-6" />
    </svg>
  );
}

const VAPID_PUBLIC_KEY = 'BOZ3uNhKfGDsrsyU0dS9IDMclvoP04xu1YKur6xXY2byASP6tKbAlg4vKAy0Kbbi6cbVRr_0CAQ7ItTQ_UyP6Sc';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function PwaInstallPrompt() {
  const [showInstallPrompt, setShowInstallPrompt] = useState<boolean>(false);
  const [showNotificationPrompt, setShowNotificationPrompt] = useState<boolean>(false);
  const [showIosGuide, setShowIosGuide] = useState<boolean>(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [notifGranted, setNotifGranted] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Detect iOS
    const iosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(iosDevice);

    // 1. Register Service Worker for PWA & Push
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .catch((err) => {
          console.warn('[PWA] Service Worker registration issue:', err);
        });
    }

    // 2. Check if already installed in standalone mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    // Show Install Prompt if not installed
    if (!isStandalone) {
      const handleBeforeInstall = (e: any) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setShowInstallPrompt(true);
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstall as any);

      // If on mobile browser, show prompt after 1.5s
      const timer = setTimeout(() => {
        if (!sessionStorage.getItem('linkal_pwa_dismissed')) {
          setShowInstallPrompt(true);
        }
      }, 1500);

      return () => {
        clearTimeout(timer);
        window.removeEventListener('beforeinstallprompt', handleBeforeInstall as any);
      };
    }

    // 3. Persistent Notification Prompt until allowed
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        localStorage.setItem('linkal_notification_granted', 'true');
        setNotifGranted(true);
      } else {
        // Not granted yet: prompt user until allowed
        const timer = setTimeout(() => {
          setShowNotificationPrompt(true);
        }, 2000);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const dismissInstallPrompt = () => {
    setShowInstallPrompt(false);
    sessionStorage.setItem('linkal_pwa_dismissed', 'true');
  };

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIosGuide(true);
      return;
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowInstallPrompt(false);
        // After install, prompt notifications
        if ('Notification' in window && Notification.permission !== 'granted') {
          setTimeout(() => setShowNotificationPrompt(true), 1500);
        }
      }
      setDeferredPrompt(null);
    } else {
      setShowIosGuide(true);
    }
  };

  const handleAllowNotifications = async () => {
    try {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          setNotifGranted(true);
          localStorage.setItem('linkal_notification_granted', 'true');

          if ('serviceWorker' in navigator) {
            const reg = await navigator.serviceWorker.ready;
            try {
              const sub = await reg.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
              });
              await fetch('/api/push/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subscription: sub }),
              });
            } catch (subErr) {
              console.warn('[Push] Subscription failed:', subErr);
            }
          }
          setTimeout(() => setShowNotificationPrompt(false), 1200);
          return;
        }
      }
      setShowNotificationPrompt(false);
    } catch (e) {
      setShowNotificationPrompt(false);
    }
  };

  return (
    <>
      {/* 1. Install PWA Prompt */}
      {showInstallPrompt && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-sm z-50 animate-in slide-in-from-bottom duration-300">
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xl p-4.5 space-y-3.5 backdrop-blur-md bg-white/95">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <img
                  src="/linkal.jpeg"
                  alt="Linkal Studio"
                  className="w-10 h-10 rounded-xl object-cover shadow-md shrink-0 border border-zinc-200"
                />
                <div>
                  <h4 className="text-sm font-bold text-zinc-950">Install Linkal Studio</h4>
                  <p className="text-[11px] text-zinc-500 leading-tight">Fast website &amp; CV builder app</p>
                </div>
              </div>
              <button
                onClick={dismissInstallPrompt}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-600 leading-relaxed">
              Install to manage your sites, receive instant recruiter messages, and edit offline.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleInstallClick}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isIOS ? 'How to Install on iOS' : 'Install App'}</span>
              </button>
              <button
                onClick={dismissInstallPrompt}
                className="inline-flex items-center justify-center gap-1 px-3 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl text-xs font-semibold transition-colors"
              >
                <span>Later</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Persistent Notification Prompt (Prompts on open until user allows) */}
      {showNotificationPrompt && (
        <div className="fixed top-4 left-4 right-4 sm:left-auto sm:right-6 sm:top-6 sm:max-w-sm z-50 animate-in slide-in-from-top duration-300">
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xl p-4.5 space-y-3.5 backdrop-blur-md bg-white/95">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
                  <BellRingIcon className="w-5 h-5 text-white animate-bounce" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-950">Allow Notifications</h4>
                  <p className="text-[11px] text-zinc-500 leading-tight">Instant vibration alerts</p>
                </div>
              </div>
              <button
                onClick={() => setShowNotificationPrompt(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-600 leading-relaxed">
              Enable notifications to receive instant vibration alerts when recruiters view your CV or customers place orders.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleAllowNotifications}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
              >
                {notifGranted ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Enabled!</span>
                  </>
                ) : (
                  <span>Allow Notifications</span>
                )}
              </button>
              <button
                onClick={() => setShowNotificationPrompt(false)}
                className="inline-flex items-center justify-center px-3 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl text-xs font-semibold transition-colors"
              >
                <span>Dismiss</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Apple iOS Safari Installation Guide Modal */}
      {showIosGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowIosGuide(false)} />
          <div className="relative z-10 w-full max-w-sm bg-white rounded-3xl border border-zinc-200 shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-zinc-950 text-white flex items-center justify-center text-xs font-bold"></span>
                <h3 className="font-extrabold text-base text-zinc-950">Install on Apple iPhone / iPad</h3>
              </div>
              <button onClick={() => setShowIosGuide(false)} className="p-1 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-500 leading-relaxed">
              To install Linkal Studio and enable notifications on iOS Safari (iOS 16.4+):
            </p>

            <div className="space-y-2.5 text-xs text-zinc-800">
              <div className="flex items-start gap-2.5 p-2.5 bg-zinc-50 rounded-xl border border-zinc-100">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                <span>Tap the <strong>Share</strong> button <span className="font-mono font-bold">⎋</span> in Safari's bottom toolbar.</span>
              </div>
              <div className="flex items-start gap-2.5 p-2.5 bg-zinc-50 rounded-xl border border-zinc-100">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                <span>Scroll down and tap <strong>"Add to Home Screen"</strong> (<span className="font-mono font-bold">⊞</span>).</span>
              </div>
              <div className="flex items-start gap-2.5 p-2.5 bg-zinc-50 rounded-xl border border-zinc-100">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                <span>Open Linkal Studio from your Home Screen &amp; tap <strong>"Allow Notifications"</strong>!</span>
              </div>
            </div>

            <button
              onClick={() => setShowIosGuide(false)}
              className="w-full py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </>
  );
}
