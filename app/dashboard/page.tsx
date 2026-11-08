'use client';

import React, { useState, useEffect, Suspense, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Globe,
  Plus,
  Search,
  Edit3,
  Rocket,
  Trash2,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  RefreshCw,
  LogOut,
  ShoppingBag,
  User,
  Zap,
  X,
  ShieldCheck,
  MessageCircle,
  Sparkles,
  Layers,
} from 'lucide-react';
import { SiteData, SiteType, SiteStatus } from '@/types/site';
import { generateQrSvg, downloadQrPng, downloadQrSvg } from '@/lib/qrcode';
import { BillingModal } from '@/app/components/BillingModal';
import { GoogleAuthModal } from '@/app/components/GoogleAuthModal';
import { PwaInstallPrompt } from '@/app/components/PwaInstallPrompt';

// ─── SAFE TYPED INLINE SVG HELPERS ───────────────────────────────────────
function Menu({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="18" x2="20" y2="18" />
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

function UtensilsIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3V2" />
      <path d="M15 2v19" />
      <path d="M5 2v19" />
      <path d="M8 2v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3V2" />
    </svg>
  );
}

function FileTextIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function CreditCard({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  );
}

function CopyIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function QrIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="3" height="3" />
      <rect x="18" y="18" width="3" height="3" />
      <rect x="18" y="14" width="3" height="3" />
    </svg>
  );
}

function GoogleIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
    </svg>
  );
}

function ShoppingBagIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function WatchIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="7" />
      <polyline points="12 9 12 12 13.5 13.5" />
      <path d="M16.51 17.35l-.85 3.22a1 1 0 0 1-.97.74H9.31a1 1 0 0 1-.97-.74l-.85-3.22" />
      <path d="M7.49 6.65l.85-3.22a1 1 0 0 1 .97-.74h5.38a1 1 0 0 1 .97.74l.85 3.22" />
    </svg>
  );
}

function HeartIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

function BoutiqueIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
    </svg>
  );
}

function GraduationCapIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}

function CakeIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8" />
      <path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1" />
      <path d="M2 21h20" />
      <path d="M7 8v2" />
      <path d="M12 8v2" />
      <path d="M17 8v2" />
      <path d="M7 4h.01" />
      <path d="M12 4h.01" />
      <path d="M17 4h.01" />
    </svg>
  );
}

function CpuIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <path d="M15 2v2M9 2v2M15 20v2M9 20v2M2 15h2M2 9h2M20 15h2M20 9h2" />
    </svg>
  );
}

function BriefcaseIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

function ScissorsIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="6" r="3" />
      <path d="M8.12 8.12 12 12" />
      <path d="M20 4 8.12 15.88" />
      <circle cx="6" cy="18" r="3" />
      <path d="M14.8 14.8 20 20" />
    </svg>
  );
}

function SettingsIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function BellIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function AppleIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.99.6-2.63 1.35-.57.65-1.07 1.72-.94 2.74 1.01.08 2.03-.49 2.64-1.24z" />
    </svg>
  );
}

function DownloadIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

const SETTINGS_I18N = {
  en: {
    title: 'Linkal Studio Settings',
    subtitle: 'App preferences, PWA installation, notifications, and platform guide.',
    langSelect: 'Choose Language / भाषा निवडा / भाषा चुनें',
    pwaTitle: 'Linkal Studio PWA App',
    pwaDesc: 'Install Linkal Studio directly on your device for lightning-fast loading and offline access.',
    pwaInstallBtn: 'Install Studio App on Device',
    pwaAlreadyInstalled: '✓ Studio App Already Installed',
    notifTitle: 'Push Notifications',
    notifDesc: 'Get instant alerts when orders arrive, visits occur, or CVs are viewed.',
    notifEnableBtn: 'Allow Push Notifications',
    notifActive: '✓ Notifications Enabled & Active',
    iosTitle: 'iPhone & iOS Safari Installation Guide',
    iosStep1: '1. Open Safari and tap the Share icon at the bottom of the screen.',
    iosStep2: '2. Scroll down and tap "Add to Home Screen".',
    iosStep3: '3. Open Linkal Studio from your home screen and allow notifications.',
    trialTitle: 'How 15-Day Free Trial & Pricing Works',
    trialPoint1: 'Start with ₹0 Payment: No credit card or upfront fee required. Launch your live website in 2 minutes.',
    trialPoint2: '15 Days Full Access: Test all features, add products or dishes, and receive direct WhatsApp customer orders.',
    trialPoint3: 'Simple Renewal After 15 Days: Keep your domain active with simple renewal (just ₹99 for restaurants).',
    trialPoint4: '100% Free Forever for CV & Wedding: CV Websites & Wedding Websites are 100% Completely Free Lifetime!',
    supportTitle: 'Founder Direct Support',
    supportDesc: 'Need help setting up your website? Chat with the founder team on WhatsApp.',
    supportBtn: 'Chat on WhatsApp Support',
  },
  hi: {
    title: 'लिंकल स्टूडियो सेटिंग्स',
    subtitle: 'ऐप प्राथमिकताएं, PWA इंस्टॉलेशन, नोटिफिकेशन और आसान गाइड।',
    langSelect: 'भाषा चुनें (Select Language)',
    pwaTitle: 'लिंकल स्टूडियो ऐप (PWA)',
    pwaDesc: 'तेज़ स्पीड और आसान इस्तेमाल के लिए लिंकल स्टूडियो को सीधे अपने फ़ोन में इंस्टॉल करें।',
    pwaInstallBtn: 'फ़ोन पर ऐप इंस्टॉल करें',
    pwaAlreadyInstalled: '✓ ऐप पहले से इंस्टॉल है',
    notifTitle: 'सूचनाएं (Push Notifications)',
    notifDesc: 'नए आर्डर आने पर, वेबसाइट विज़िट होने पर तुरंत नोटिफिकेशन पाएं।',
    notifEnableBtn: 'नोटिफिकेशन चालू करें',
    notifActive: '✓ नोटिफिकेशन चालू है',
    iosTitle: 'iPhone और iOS के लिए आसान तरीके',
    iosStep1: '1. सफारी (Safari) ब्राउज़र खोलें और नीचे शेयर (Share) बटन दबाएं।',
    iosStep2: '2. नीचे जाकर "Add to Home Screen" पर टैप करें।',
    iosStep3: '3. होम स्क्रीन से लिंकल स्टूडियो खोलें और नोटिफिकेशन Allow करें।',
    trialTitle: '15 दिन का फ़्री ट्रायल और कीमत कैसे काम करती है',
    trialPoint1: 'बिना पैसे तुरंत शुरू करें: ₹0 में अपनी वेबसाइट आज ही लाइव करें, कोई एडवांस पेमेंट नहीं।',
    trialPoint2: '15 दिन पूरा फ़्री: अपने प्रोडक्ट, मेन्यू जोड़ें और सीधे व्हाट्सएप पर कस्टमर ऑर्डर लें।',
    trialPoint3: '15 दिन बाद आसान पेमेंट: रेस्टोरेंट के लिए केवल ₹99 में अपनी वेबसाइट चालू रखें।',
    trialPoint4: 'सीवी और शादी के कार्ड हमेशा 100% मुफ़्त: Executive CV और शादी के डिजिटल कार्ड पूरी ज़िंदगी बिल्कुल मुफ़्त रहेंगे।',
    supportTitle: 'डायरेक्ट सपोर्ट हेल्पलाइन',
    supportDesc: 'वेबसाइट बनाने में कोई परेशानी? सीधे फ़ाउंडर टीम से व्हाट्सएप पर बात करें।',
    supportBtn: 'व्हाट्सएप सपोर्ट पर बात करें',
  },
  mr: {
    title: 'लिंकल स्टुडिओ सेटिंग्ज',
    subtitle: 'ॲप सेटिंग्ज, PWA इन्स्टॉलेशन, नोटिफिकेशन्स आणि सोपी माहिती.',
    langSelect: 'भाषा निवडा (Select Language)',
    pwaTitle: 'लिंकल स्टुडिओ ॲप (PWA)',
    pwaDesc: 'जलद गती आणि सोप्या वापरासाठी लिंकल स्टुडिओ थेट तुमच्या फोनमध्ये इन्स्टॉल करा.',
    pwaInstallBtn: 'फोनवर ॲप इन्स्टॉल करा',
    pwaAlreadyInstalled: '✓ ॲप आधीच इन्स्टॉल आहे',
    notifTitle: 'सूचना (Push Notifications)',
    notifDesc: 'नवीन ऑर्डर्स किंवा वेबसाइट व्हिजिट्सवर त्वरित सूचना मिळवा.',
    notifEnableBtn: 'नोटिफिकेशन्स सुरू करा',
    notifActive: '✓ नोटिफिकेशन्स सुरू आहेत',
    iosTitle: 'iPhone आणि iOS साठी सोप्या पायऱ्या',
    iosStep1: '1. सफारी (Safari) ब्राउझर उघडा आणि खालील शेअर (Share) बटण दाबा.',
    iosStep2: '2. खाली स्क्रोल करून "Add to Home Screen" निवडा.',
    iosStep3: '3. होम स्क्रीनवरून लिंकल स्टुडिओ उघडा आणि नोटिफिकेशन्स Allow करा.',
    trialTitle: '15 दिवसांची मोफत चाचणी आणि किंमत कशी चालते',
    trialPoint1: '₹0 मध्ये लगेच सुरू करा: कोणतीही आगाऊ फी न भरता 2 मिनिटांत तुमची वेबसाइट लाइव्ह करा.',
    trialPoint2: '15 दिवस पूर्ण मोफत: सर्व फिचर्स वापरा, उत्पादने जोडा आणि थेट व्हॉट्सॲपवर ऑर्डर्स मिळवा.',
    trialPoint3: '15 दिवसांनंतर सोपे रिन्यूअल: रेस्टॉरंट्ससाठी फक्त ₹99 मध्ये वेबसाइट सुरू ठेवा.',
    trialPoint4: 'सीव्ही आणि लग्नपत्रिका कायमस्वरूपी 100% मोफत: Executive CV आणि डिजिटल लग्नपत्रिका आयुष्यभरासाठी पूर्णपणे मोफत राहतील.',
    supportTitle: 'थेट संस्थापक मदत',
    supportDesc: 'वेबसाइट तयार करण्यात काही मदत हवी असल्यास थेट व्हॉट्सॲपवर संपर्क करा.',
    supportBtn: 'व्हॉट्सॲपवर मदत मिळवा',
  }
};

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sites, setSites] = useState<SiteData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // User state (Google sign-in)
  const [user, setUser] = useState<{ id: string; email: string; fullName: string; phoneNumber?: string } | null>(null);
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  // Active category selection - default to executive CV
  const [category, setCategory] = useState<SiteType>('cv');

  // Creation form state
  const [siteName, setSiteName] = useState('');
  const [desiredSlug, setDesiredSlug] = useState('');
  const [whatsappPhone, setWhatsappPhone] = useState('91');
  const [promoCode, setPromoCode] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Live subdomain availability state
  const [slugChecking, setSlugChecking] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [slugMessage, setSlugMessage] = useState<string>('');
  const [underscoreWarning, setUnderscoreWarning] = useState(false);

  // Modals state
  const [billingModalSite, setBillingModalSite] = useState<SiteData | null>(null);
  const [qrModalSite, setQrModalSite] = useState<SiteData | null>(null);
  const [recentlyPublishedSite, setRecentlyPublishedSite] = useState<SiteData | null>(null);

  // Auto-fill slug from site name if slug is untouched
  const [slugTouched, setSlugTouched] = useState(false);

  // Check saved user in localStorage
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('linkal_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch {}
  }, []);

  // Subdomain live debounce checker
  useEffect(() => {
    if (!desiredSlug || desiredSlug.length < 3) {
      setSlugAvailable(null);
      setSlugMessage('');
      setUnderscoreWarning(false);
      return;
    }

    if (desiredSlug.includes('_')) {
      setUnderscoreWarning(true);
      setSlugAvailable(false);
      setSlugMessage('Underscores (_) are prohibited by domain standards. Use hyphens (-) instead.');
      return;
    } else {
      setUnderscoreWarning(false);
    }

    setSlugChecking(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/subdomain/check?slug=${encodeURIComponent(desiredSlug)}`);
        const data = await res.json();
        if (data.available) {
          setSlugAvailable(true);
          setSlugMessage(`✓ ${data.slug}.linkal.in is available!`);
        } else {
          setSlugAvailable(false);
          setSlugMessage(data.message || `✗ ${desiredSlug}.linkal.in is taken.`);
        }
      } catch {
        setSlugAvailable(null);
      } finally {
        setSlugChecking(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [desiredSlug]);

  // Active dashboard view tab: 'sites' | 'templates' | 'settings' | 'profile'
  const [dashboardTab, setDashboardTab] = useState<'sites' | 'templates' | 'settings' | 'profile'>('sites');
  const [settingsLang, setSettingsLang] = useState<'en' | 'hi' | 'mr'>('en');
  const [pwaInstalled, setPwaInstalled] = useState(false);
  const [notifPermission, setNotifPermission] = useState<string>('default');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
      setPwaInstalled(!!isStandalone);
      if ('Notification' in window) {
        setNotifPermission(Notification.permission);
      }
    }
  }, []);

  // Load customer sites strictly isolated by logged-in user email (Zero Hardcoded Data)
  const fetchSites = async (userEmail?: string) => {
    if (!userEmail) {
      setSites([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/sites?userEmail=${encodeURIComponent(userEmail.toLowerCase().trim())}`);
      if (res.ok) {
        const data = await res.json();
        const serverSites: SiteData[] = data.sites || [];
        setSites(serverSites);
        try {
          localStorage.setItem(`linkal_sites_${userEmail}`, JSON.stringify(serverSites));
        } catch {}
      } else {
        setSites([]);
      }
    } catch (err) {
      console.warn('Could not fetch server sites:', err);
      setSites([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchSites(user.email);
    } else {
      setSites([]);
      setLoading(false);
    }
  }, [user?.email]);

  // Handle site creation
  const handleStartBuilding = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);

    if (!siteName.trim()) {
      setCreateError(
        category === 'cv'
          ? 'Please enter your full name to generate your ATS CV'
          : category === 'portfolio'
          ? 'Please enter your name or studio name'
          : category === 'wedding_card'
          ? 'Please enter Couple names (e.g. Aarav & Ananya)'
          : category === 'tuition'
          ? 'Please enter your Academy or Tuition name'
          : 'Please enter your website or brand name'
      );
      return;
    }

    if (!whatsappPhone.trim() || whatsappPhone.trim() === '91') {
      setCreateError(
        category === 'cv'
          ? 'Please enter your WhatsApp contact number for your CV'
          : category === 'wedding_card'
          ? 'Please enter your WhatsApp RSVP contact number'
          : 'Please enter a valid WhatsApp orders number'
      );
      return;
    }

    if (desiredSlug && slugAvailable === false) {
      setCreateError('Please choose an available subdomain before proceeding.');
      return;
    }

    // Always require Google sign-in before creating
    if (!user) {
      setShowGoogleModal(true);
      return;
    }

    await executeSiteCreation(user);
  };

  const executeSiteCreation = async (currentUser: any) => {
    try {
      setCreating(true);
      setCreateError(null);

      // Determine template type
      const siteType: SiteType = category;

      const res = await fetch('/api/sites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: siteName.trim(),
          type: siteType,
          slug: desiredSlug.trim() || undefined,
          whatsappNumber: whatsappPhone.trim(),
          promoCode: promoCode.trim() || undefined,
          userEmail: currentUser?.email,
          userName: currentUser?.fullName,
          // For CV: strictly NO images as requested by customer
          bannerImageUrl: (category === 'cv' || category === 'wedding_card') ? undefined : 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1600&auto=format&fit=crop&q=80',
          logoUrl: category === 'cv' ? undefined : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to initialize site');

      const created = data.site;
      const updatedList = [created, ...sites.filter((s) => s.id !== created.id)];
      setSites(updatedList);
      try {
        localStorage.setItem('linkal_sites_history', JSON.stringify(updatedList));
      } catch {}

      // Reset form
      setSiteName('');
      setDesiredSlug('');
      setSlugTouched(false);
      setPromoCode('');

      // Redirect directly to website builder
      router.push(`/builder/${created.id}`);
    } catch (err: any) {
      setCreateError(err.message || 'Error creating site');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteSite = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await fetch(`/api/sites/${id}`, { method: 'DELETE' });
      const filtered = sites.filter((s) => s.id !== id);
      setSites(filtered);
      try {
        localStorage.setItem('linkal_sites_history', JSON.stringify(filtered));
      } catch {}
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredSites = sites.filter((site) => {
    const matchesSearch =
      site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || site.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || site.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950 pb-20">
      {/* ─── PWA & NOTIFICATIONS CONTROLLER ─── */}
      <PwaInstallPrompt />

      {/* ─── GOOGLE 1-CLICK AUTH MODAL ─── */}
      <GoogleAuthModal
        isOpen={showGoogleModal}
        onClose={() => setShowGoogleModal(false)}
        isCvSite={category === 'cv'}
        initialName={siteName}
        initialPhone={whatsappPhone}
        onSuccess={(authedUser) => {
          setUser(authedUser);
          setShowGoogleModal(false);
          // If form was already filled, automatically create site
          if (siteName.trim()) {
            executeSiteCreation(authedUser);
          }
        }}
      />

      {/* ─── CASHFREE BILLING MODAL ─── */}
      {billingModalSite && (
        <BillingModal
          isOpen={!!billingModalSite}
          onClose={() => setBillingModalSite(null)}
          siteId={billingModalSite.id}
          siteSlug={billingModalSite.slug}
          siteName={billingModalSite.name}
          siteType={billingModalSite.type}
        />
      )}

      {/* ─── TOP CUSTOMER HEADER ─── */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-zinc-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2.5 text-decoration-none">
              <img
                src="/linkal.jpeg"
                alt="Linkal Studio"
                className="w-9 h-9 rounded-xl object-cover shadow-xs border border-zinc-200"
              />
              <div>
                <span className="font-extrabold text-base tracking-tight text-zinc-950 block leading-tight">
                  Linkal Studio
                </span>
                <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider block">
                  Customer Website Studio
                </span>
              </div>
            </a>
          </div>

          <div className="flex items-center gap-2.5">
            {user ? (
              <div className="flex items-center gap-2.5 bg-zinc-50 hover:bg-zinc-100/80 px-3 py-1.5 rounded-2xl border border-zinc-200 transition-colors">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs overflow-hidden shrink-0">
                  {(user as any).avatarUrl ? (
                    <img src={(user as any).avatarUrl} alt={user.fullName || 'User'} className="w-full h-full object-cover" />
                  ) : (
                    <span>{user.fullName ? user.fullName[0].toUpperCase() : 'U'}</span>
                  )}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-zinc-950 flex items-center gap-1.5 leading-tight">
                    <span>{user.fullName || 'Executive User'}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono block leading-tight">
                    {user.email}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowGoogleModal(true)}
                  className="px-2 py-1 rounded-lg text-[10px] font-bold text-blue-600 hover:bg-blue-50 border border-blue-200 transition-colors ml-1"
                  title="Switch to another Google Account"
                >
                  Switch
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem('linkal_user');
                    setUser(null);
                  }}
                  className="p-1 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Sign out of Google"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowGoogleModal(true)}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-800 text-xs font-bold shadow-xs transition-all active:scale-[0.98]"
              >
                <GoogleIcon className="w-4 h-4" />
                <span>1-Click Google Login</span>
              </button>
            )}

            <a
              href="#builder-box"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20 active:scale-[0.98]"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>New Site</span>
            </a>
          </div>
        </div>
      </header>

      {/* ─── MAIN CUSTOMER CONTENT ─── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* ─── TOP FREE LIFETIME ANNOUNCEMENT BANNER ─── */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 text-white rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <span className="font-extrabold text-sm sm:text-base block">
                CV Websites &amp; Wedding Websites are 100% Completely Free Lifetime!
              </span>
              <span className="text-xs text-emerald-100 font-medium block">
                Start with ₹0 &bull; No renewal fees &bull; Restaurant digital menus start at just ₹99/month.
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setDashboardTab('templates');
              setCategory('cv');
            }}
            className="px-4 py-2 rounded-xl bg-white text-emerald-800 hover:bg-emerald-50 text-xs font-extrabold shadow-sm transition-all shrink-0 active:scale-95"
          >
            Create Free Now &rarr;
          </button>
        </div>

        {/* Navigation Tabs (Desktop & Mobile) */}
        <div className="flex items-center gap-1.5 p-1 bg-zinc-200/80 rounded-2xl max-w-xl mx-auto">
          <button
            type="button"
            onClick={() => setDashboardTab('sites')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              dashboardTab === 'sites'
                ? 'bg-white text-zinc-950 shadow-xs'
                : 'text-zinc-600 hover:text-zinc-950'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span>My Websites {user ? `(${sites.length})` : ''}</span>
          </button>
          <button
            type="button"
            onClick={() => setDashboardTab('templates')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              dashboardTab === 'templates'
                ? 'bg-white text-zinc-950 shadow-xs'
                : 'text-zinc-600 hover:text-zinc-950'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Templates</span>
          </button>
          <button
            type="button"
            onClick={() => setDashboardTab('settings')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              dashboardTab === 'settings'
                ? 'bg-white text-zinc-950 shadow-xs'
                : 'text-zinc-600 hover:text-zinc-950'
            }`}
          >
            <SettingsIcon className="w-3.5 h-3.5 text-indigo-600" />
            <span>Settings</span>
          </button>
          <button
            type="button"
            onClick={() => setDashboardTab('profile')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              dashboardTab === 'profile'
                ? 'bg-white text-zinc-950 shadow-xs'
                : 'text-zinc-600 hover:text-zinc-950'
            }`}
          >
            <User className="w-3.5 h-3.5 text-emerald-600" />
            <span>Profile</span>
          </button>
        </div>

        {/* ─── SECTION 1: CUSTOMER CREATION STUDIO (TEMPLATES) ─── */}
        {dashboardTab === 'templates' && (
        <section id="builder-box" className="bg-white border border-zinc-200 rounded-3xl p-5 sm:p-8 shadow-sm space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3 h-3 text-blue-600" /> Start Building Your Website
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">
              Choose Website Category &amp; Launch in 2 Minutes
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 font-medium mt-1">
              Select your template blueprint, choose your custom subdomain on <strong>.linkal.in</strong>, and start editing.
            </p>
          </div>

          <form onSubmit={handleStartBuilding} className="space-y-6">
            {/* 1. Category Blueprint Cards */}
            <div>
              <label className="block text-xs font-bold text-zinc-900 uppercase tracking-wider mb-2.5">
                1. Select Website Blueprint *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {/* 1. Executive ATS CV */}
                <div
                  onClick={() => setCategory('cv')}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    category === 'cv'
                      ? 'border-blue-600 bg-blue-50/50 shadow-md ring-2 ring-blue-600/20'
                      : 'border-zinc-200 bg-white hover:border-zinc-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="p-2 rounded-xl bg-blue-100 text-blue-700">
                        <FileTextIcon className="w-5 h-5 text-blue-700" />
                      </span>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        100% Free
                      </span>
                    </div>
                    <h3 className="font-extrabold text-xs text-zinc-950">1. Executive ATS CV</h3>
                    <p className="text-[11px] text-zinc-500 font-medium mt-1 leading-snug">
                      ATS-optimized typography, 0 image uploads, clickable link toggles &amp; custom career categories.
                    </p>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-zinc-200/60 text-[10px] font-bold text-emerald-700">
                    ₹0 Free Lifetime
                  </div>
                </div>

                {/* 2. E-Commerce Website */}
                <div
                  onClick={() => setCategory('ecommerce')}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    category === 'ecommerce'
                      ? 'border-blue-600 bg-blue-50/50 shadow-md ring-2 ring-blue-600/20'
                      : 'border-zinc-200 bg-white hover:border-zinc-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                        <ShoppingBagIcon className="w-5 h-5 text-emerald-700" />
                      </span>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                        Multi-Templates
                      </span>
                    </div>
                    <h3 className="font-extrabold text-xs text-zinc-950">2. E-Commerce Store</h3>
                    <p className="text-[11px] text-zinc-500 font-medium mt-1 leading-snug">
                      Modern grid &amp; minimal storefront designs, product catalog, cart summary &amp; WhatsApp checkout.
                    </p>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-zinc-200/60 text-[10px] font-bold text-blue-700">
                    Trial ends after 15 days
                  </div>
                </div>

                {/* 3. Fashion & Apparel Boutique */}
                <div
                  onClick={() => setCategory('boutique')}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    category === 'boutique'
                      ? 'border-blue-600 bg-blue-50/50 shadow-md ring-2 ring-blue-600/20'
                      : 'border-zinc-200 bg-white hover:border-zinc-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="p-2 rounded-xl bg-pink-100 text-pink-700">
                        <BoutiqueIcon className="w-5 h-5 text-pink-700" />
                      </span>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-pink-100 text-pink-800">
                        Lookbook &amp; Sizes
                      </span>
                    </div>
                    <h3 className="font-extrabold text-xs text-zinc-950">3. Fashion Boutique</h3>
                    <p className="text-[11px] text-zinc-500 font-medium mt-1 leading-snug">
                      Sarees, lehengas &amp; apparel lookbook, S-XXL size selector, fabric specs &amp; WhatsApp orders.
                    </p>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-zinc-200/60 text-[10px] font-bold text-pink-700">
                    Trial ends after 15 days
                  </div>
                </div>

                {/* 4. Luxury Watch Business */}
                <div
                  onClick={() => setCategory('watch_store')}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    category === 'watch_store'
                      ? 'border-blue-600 bg-blue-50/50 shadow-md ring-2 ring-blue-600/20'
                      : 'border-zinc-200 bg-white hover:border-zinc-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="p-2 rounded-xl bg-amber-100 text-amber-700">
                        <WatchIcon className="w-5 h-5 text-amber-700" />
                      </span>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                        Horology Dark
                      </span>
                    </div>
                    <h3 className="font-extrabold text-xs text-zinc-950">4. Luxury Watch Business</h3>
                    <p className="text-[11px] text-zinc-500 font-medium mt-1 leading-snug">
                      Luxury dark showcase, timepiece dial photos, movement/case specs, MRP discounts &amp; 1-tap WhatsApp buy.
                    </p>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-zinc-200/60 text-[10px] font-bold text-amber-700">
                    Trial ends after 15 days
                  </div>
                </div>

                {/* 5. Restaurant & Cafe Menu (Generic for all restaurants & cafes, ₹99) */}
                <div
                  onClick={() => setCategory('restaurant')}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    category === 'restaurant'
                      ? 'border-blue-600 bg-blue-50/50 shadow-md ring-2 ring-blue-600/20'
                      : 'border-zinc-200 bg-white hover:border-zinc-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="p-2 rounded-xl bg-orange-100 text-orange-700">
                        <UtensilsIcon className="w-5 h-5 text-orange-700" />
                      </span>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">
                        ₹99 Special
                      </span>
                    </div>
                    <h3 className="font-extrabold text-xs text-zinc-950">5. Restaurant &amp; Cafe Menu</h3>
                    <p className="text-[11px] text-zinc-500 font-medium mt-1 leading-snug">
                      Signature entrance loading animation, veg/non-veg dot badges, dish photos &amp; WhatsApp orders.
                    </p>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-zinc-200/60 text-[10px] font-bold text-orange-700">
                    ₹99/mo &bull; All Restaurants &amp; Cafes
                  </div>
                </div>

                {/* 6. Royal Wedding Cards & Invitations (100% Free Lifetime) */}
                <div
                  onClick={() => setCategory('wedding_card')}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    category === 'wedding_card'
                      ? 'border-blue-600 bg-blue-50/50 shadow-md ring-2 ring-blue-600/20'
                      : 'border-zinc-200 bg-white hover:border-zinc-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="p-2 rounded-xl bg-rose-100 text-rose-700">
                        <HeartIcon className="w-5 h-5 text-rose-700" />
                      </span>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        100% Free
                      </span>
                    </div>
                    <h3 className="font-extrabold text-xs text-zinc-950">6. Wedding Card Invitation</h3>
                    <p className="text-[11px] text-zinc-500 font-medium mt-1 leading-snug">
                      10 luxury pre-built color themes, couple bios, countdown timer, event itinerary &amp; Google Maps RSVP.
                    </p>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-zinc-200/60 text-[10px] font-bold text-emerald-700">
                    ₹0 Free Lifetime
                  </div>
                </div>

                {/* 7. Electronics & Gadgets */}
                <div
                  onClick={() => setCategory('electronics')}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    category === 'electronics'
                      ? 'border-blue-600 bg-blue-50/50 shadow-md ring-2 ring-blue-600/20'
                      : 'border-zinc-200 bg-white hover:border-zinc-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="p-2 rounded-xl bg-cyan-100 text-cyan-700">
                        <CpuIcon className="w-5 h-5 text-cyan-700" />
                      </span>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800">
                        15-Day Trial
                      </span>
                    </div>
                    <h3 className="font-extrabold text-xs text-zinc-950">7. Electronics &amp; Gadgets</h3>
                    <p className="text-[11px] text-zinc-500 font-medium mt-1 leading-snug">
                      Smart devices, tech specs, accessories, warranty highlights &amp; fast WhatsApp checkout.
                    </p>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-zinc-200/60 text-[10px] font-bold text-cyan-700">
                    Trial ends after 15 days
                  </div>
                </div>

                {/* 8. Freelancer & Creative Portfolio */}
                <div
                  onClick={() => setCategory('portfolio')}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    category === 'portfolio'
                      ? 'border-blue-600 bg-blue-50/50 shadow-md ring-2 ring-blue-600/20'
                      : 'border-zinc-200 bg-white hover:border-zinc-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="p-2 rounded-xl bg-purple-100 text-purple-700">
                        <BriefcaseIcon className="w-5 h-5 text-purple-700" />
                      </span>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                        Max 5 WebP
                      </span>
                    </div>
                    <h3 className="font-extrabold text-xs text-zinc-950">8. Creative Portfolio</h3>
                    <p className="text-[11px] text-zinc-500 font-medium mt-1 leading-snug">
                      Visual project showcase with up to 5 WebP project image uploads, clickable links &amp; WhatsApp hire CTA.
                    </p>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-zinc-200/60 text-[10px] font-bold text-purple-700">
                    Trial ends after 15 days
                  </div>
                </div>

                {/* 9. Bakery & Cake Shop */}
                <div
                  onClick={() => setCategory('bakery')}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    category === 'bakery'
                      ? 'border-blue-600 bg-blue-50/50 shadow-md ring-2 ring-blue-600/20'
                      : 'border-zinc-200 bg-white hover:border-zinc-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="p-2 rounded-xl bg-amber-100 text-amber-700">
                        <CakeIcon className="w-5 h-5 text-amber-700" />
                      </span>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                        15-Day Trial
                      </span>
                    </div>
                    <h3 className="font-extrabold text-xs text-zinc-950">9. Bakery &amp; Cake Shop</h3>
                    <p className="text-[11px] text-zinc-500 font-medium mt-1 leading-snug">
                      Custom designer cakes, pastries, egg/eggless flavor options &amp; WhatsApp cake ordering.
                    </p>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-zinc-200/60 text-[10px] font-bold text-amber-700">
                    Trial ends after 15 days
                  </div>
                </div>

                {/* 10. Tuition & Coaching Academy */}
                <div
                  onClick={() => setCategory('tuition')}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    category === 'tuition'
                      ? 'border-blue-600 bg-blue-50/50 shadow-md ring-2 ring-blue-600/20'
                      : 'border-zinc-200 bg-white hover:border-zinc-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
                        <GraduationCapIcon className="w-5 h-5 text-indigo-700" />
                      </span>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                        15-Day Trial
                      </span>
                    </div>
                    <h3 className="font-extrabold text-xs text-zinc-950">10. Tuition &amp; Coaching</h3>
                    <p className="text-[11px] text-zinc-500 font-medium mt-1 leading-snug">
                      8th-12th standards, batch timings schedule, subject fee matrix (monthly/annual) &amp; admission helpline.
                    </p>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-zinc-200/60 text-[10px] font-bold text-indigo-700">
                    Trial ends after 15 days
                  </div>
                </div>

                {/* 11. Salon & Beauty Lounge */}
                <div
                  onClick={() => setCategory('salon')}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    category === 'salon'
                      ? 'border-blue-600 bg-blue-50/50 shadow-md ring-2 ring-blue-600/20'
                      : 'border-zinc-200 bg-white hover:border-zinc-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="p-2 rounded-xl bg-fuchsia-100 text-fuchsia-700">
                        <ScissorsIcon className="w-5 h-5 text-fuchsia-700" />
                      </span>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-fuchsia-100 text-fuchsia-800">
                        15-Day Trial
                      </span>
                    </div>
                    <h3 className="font-extrabold text-xs text-zinc-950">11. Salon &amp; Lounge</h3>
                    <p className="text-[11px] text-zinc-500 font-medium mt-1 leading-snug">
                      Hair styling, bridal makeup, spa treatments, pricing menu &amp; WhatsApp appointment booking.
                    </p>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-zinc-200/60 text-[10px] font-bold text-fuchsia-700">
                    Trial ends after 15 days
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Site Name & WhatsApp Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-900 mb-1">
                  {category === 'portfolio' ? 'Full Name (Add in your CV) *' : 'Business / Store Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={siteName}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSiteName(val);
                    if (!slugTouched) {
                      setDesiredSlug(
                        val
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, '-')
                          .replace(/(^-|-$)+/g, '')
                      );
                    }
                  }}
                  placeholder={category === 'portfolio' ? 'e.g. Yahya Mundewadi' : 'e.g. Royal Cakes Mumbai'}
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-xs sm:text-sm font-semibold text-zinc-950 placeholder-zinc-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <span className="text-[11px] text-zinc-500 font-medium mt-1 block">
                  {category === 'portfolio' ? 'Your executive name as displayed on your CV.' : 'Your brand or store name for customer orders.'}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-900 mb-1">
                  {category === 'portfolio' ? 'WhatsApp Phone (Add in your CV) *' : 'WhatsApp Orders Phone (Add to your store) *'}
                </label>
                <div className="relative">
                  <MessageCircle className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={whatsappPhone}
                    onChange={(e) => setWhatsappPhone(e.target.value)}
                    placeholder={category === 'portfolio' ? '919307426215' : '919876543210'}
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-xs sm:text-sm font-mono font-bold text-zinc-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <span className="text-[11px] text-zinc-500 font-medium mt-1 block">
                  {category === 'portfolio' ? 'Direct WhatsApp line for recruiters & executive hiring.' : 'Customer orders will be dispatched directly to this WhatsApp.'}
                </span>
              </div>
            </div>

            {/* 3. Subdomain Live Checker */}
            <div>
              <label className="block text-xs font-bold text-zinc-900 mb-1">
                Desired Web Address (.linkal.in Subdomain) *
              </label>
              <div className="flex items-center max-w-lg">
                <input
                  type="text"
                  required
                  value={desiredSlug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setDesiredSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                  }}
                  placeholder="your-subdomain"
                  className="flex-1 px-4 py-2.5 bg-zinc-50 border border-zinc-300 rounded-l-xl text-xs sm:text-sm font-mono font-bold text-zinc-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <span className="px-4 py-2.5 bg-zinc-200 border border-l-0 border-zinc-300 rounded-r-xl text-xs sm:text-sm font-mono font-bold text-zinc-700">
                  .linkal.in
                </span>
              </div>

              {/* Subdomain Feedback Banner */}
              <div className="mt-2 text-xs">
                {slugChecking ? (
                  <span className="text-zinc-500 font-semibold flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Checking subdomain availability...
                  </span>
                ) : underscoreWarning ? (
                  <span className="text-red-600 font-bold flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    Underscores (_) are prohibited by domain standards. Use hyphens (-) instead.
                  </span>
                ) : slugAvailable === true ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 inline-flex">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    {desiredSlug}.linkal.in is available!
                  </span>
                ) : slugAvailable === false ? (
                  <span className="text-red-700 font-semibold flex items-center gap-1.5 bg-red-50 px-3 py-1.5 rounded-lg border border-red-200 inline-flex">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    {slugMessage || `${desiredSlug}.linkal.in is unavailable.`}
                  </span>
                ) : (
                  <span className="text-zinc-400 text-[11px]">
                    Only lowercase letters, numbers, and hyphens (-) allowed.
                  </span>
                )}
              </div>
            </div>

            {/* 4. Promo Code & Trial Notices */}
            {category === 'portfolio' ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-emerald-950 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600" /> Executive CV Tier: 100% Free with LINKAL
                  </span>
                  <span className="text-[10px] font-bold bg-emerald-600 text-white px-2.5 py-0.5 rounded-full">
                    Free for First 100 CVs
                  </span>
                </div>
                <p className="text-xs text-emerald-900 leading-relaxed">
                  Every user can create <strong>1 free executive CV website</strong> for life. Designed strictly without images for maximum readability and PDF printing.
                </p>
                <div className="pt-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    placeholder="Enter Promo Code (Optional)"
                    className="w-full sm:max-w-xs px-3.5 py-2 bg-white border border-emerald-300 rounded-xl text-xs font-mono font-bold text-zinc-950 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-blue-950 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-blue-600" /> Includes 15-Day Free Trial
                  </span>
                  <span className="text-[10px] font-bold bg-blue-600 text-white px-2.5 py-0.5 rounded-full">
                    No Credit Card Required
                  </span>
                </div>
                <p className="text-xs text-blue-900 leading-relaxed">
                  Your 15-day free trial ends after 15 days. Afterward, keep your site live with our simple flexible plan via Cashfree.
                </p>
              </div>
            )}

            {createError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
                {createError}
              </div>
            )}

            {/* 5. Submit Button */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={creating || slugAvailable === false}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-extrabold transition-all shadow-lg shadow-blue-600/25 active:scale-[0.98]"
              >
                {creating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>{category === 'portfolio' ? 'Initializing Executive CV...' : 'Initializing Website...'}</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 text-white" />
                    <span>{category === 'portfolio' ? 'Build My Executive CV (100% Free) →' : 'Open Visual Builder Now →'}</span>
                  </>
                )}
              </button>

              <span className="text-xs text-zinc-500 font-medium">
                {user ? `Logged in as ${user.fullName || user.email}` : 'Sign in with Google on next step'}
              </span>
            </div>
          </form>
        </section>
        )}

        {/* ─── SECTION 2: MY WEBSITES ─── */}
        {dashboardTab === 'sites' && (
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold text-zinc-950 tracking-tight">My Active Websites</h2>
              <p className="text-xs text-zinc-500 font-medium mt-0.5">
                Manage, edit in visual builder, and view live subdomains.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search websites..."
                  className="pl-8 pr-3 py-1.5 bg-white border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-950 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-2.5 py-1.5 bg-white border border-zinc-200 rounded-xl text-xs font-bold text-zinc-800 focus:outline-none"
              >
                <option value="all">All Types</option>
                <option value="portfolio">Personal CV</option>
                <option value="ecommerce">E-commerce</option>
                <option value="single_product">Single Product</option>
              </select>
            </div>
          </div>

          {!user ? (
            <div className="py-14 text-center bg-white border border-zinc-200 rounded-3xl p-6 space-y-4 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <User className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-zinc-950">Sign In with Google to View Your Websites</h3>
                <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto leading-relaxed">
                  Your websites are securely linked to your Google account. Sign in to access your dashboard, edit live subdomains, and view order analytics.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowGoogleModal(true)}
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-extrabold shadow-md transition-all active:scale-[0.98]"
              >
                <GoogleIcon className="w-4 h-4" />
                <span>1-Click Google Sign In (Choose Account)</span>
              </button>
            </div>
          ) : loading ? (
            <div className="py-16 text-center bg-white border border-zinc-200 rounded-3xl space-y-2">
              <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mx-auto" />
              <p className="text-xs text-zinc-500 font-bold">Loading your websites...</p>
            </div>
          ) : filteredSites.length === 0 ? (
            <div className="py-14 text-center bg-white border border-zinc-200 rounded-3xl p-6 space-y-4 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <Globe className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-zinc-950">No websites created yet</h3>
                <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto leading-relaxed">
                  You haven&apos;t created any websites or CVs yet. Select a template blueprint to launch your live site on <strong>.linkal.in</strong> in 2 minutes.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDashboardTab('templates')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all active:scale-[0.98]"
              >
                <Sparkles className="w-4 h-4" />
                <span>Explore Templates &amp; Build Now →</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSites.map((site) => (
                <div
                  key={site.id}
                  className="bg-white border border-zinc-200 rounded-3xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold mb-1.5 bg-blue-50 text-blue-700 border border-blue-200/60">
                          {site.type === 'portfolio'
                            ? 'Executive CV'
                            : site.type === 'single_product'
                            ? 'Single Product'
                            : 'E-commerce'}
                        </span>
                        <a
                          href={`/stats/${site.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="font-extrabold text-base text-zinc-950 tracking-tight hover:text-blue-600 block transition-colors"
                        >
                          {site.name} ↗
                        </a>
                        <a
                          href={`/stats/${site.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-blue-600 font-mono font-bold mt-0.5 hover:underline block"
                        >
                          {site.slug}.linkal.in
                        </a>
                      </div>

                      <a
                        href={`/stats/${site.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 flex items-center justify-center font-bold text-xs border border-blue-200/80 transition-colors"
                        title="View Website Stats"
                      >
                        {site.name.substring(0, 2).toUpperCase()}
                      </a>
                    </div>

                    {/* Quick Live Stats Indicator */}
                    <div className="grid grid-cols-2 gap-2 p-2.5 rounded-2xl bg-zinc-50 border border-zinc-100 text-xs">
                      <div className="flex items-center gap-1.5 text-zinc-600">
                        <span className="text-[10px] uppercase font-bold text-zinc-400">Visits:</span>
                        <strong className="text-zinc-950 font-mono font-bold">{(site.visitsCount || 0).toLocaleString()}</strong>
                      </div>
                      <div className="flex items-center gap-1.5 text-zinc-600">
                        <span className="text-[10px] uppercase font-bold text-zinc-400">Clicks:</span>
                        <strong className="text-emerald-700 font-mono font-bold">{(site.clicksCount || 0).toLocaleString()}</strong>
                      </div>
                    </div>

                    {/* Trial / Subscription Status Card */}
                    <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-100 text-xs space-y-1">
                      <div className="flex items-center justify-between text-zinc-600">
                        <span className="font-medium">Plan Status:</span>
                        <span className="font-bold text-zinc-900">
                          {site.type === 'portfolio' ? (
                            <span className="text-emerald-700">100% Free Lifetime</span>
                          ) : (
                            <span className="text-blue-700">15-Day Free Trial</span>
                          )}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-zinc-600">
                        <span className="font-medium">WhatsApp:</span>
                        <span className="font-mono font-bold text-zinc-900">+{site.whatsappNumber}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Action Buttons */}
                  <div className="space-y-2 pt-2 border-t border-zinc-100">
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        onClick={() => router.push(`/builder/${site.id}`)}
                        className="inline-flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold transition-all shadow-xs"
                      >
                        <Edit3 className="w-3 h-3 text-white" />
                        <span>Edit</span>
                      </button>

                      <a
                        href={`/stats/${site.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold transition-all shadow-xs"
                      >
                        <span>Stats 📊</span>
                      </a>

                      <a
                        href={site.liveUrl || `https://${site.slug}.linkal.in`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl bg-zinc-900 hover:bg-black text-white text-[11px] font-bold transition-all shadow-xs"
                      >
                        <span>Live</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => setBillingModalSite(site)}
                        className="text-[11px] font-bold text-blue-700 hover:text-blue-900 inline-flex items-center gap-1"
                      >
                        <CreditCard className="w-3 h-3 text-blue-700" />
                        <span>Billing &amp; Plans</span>
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setQrModalSite(site)}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100"
                          title="Generate QR code"
                        >
                          <QrIcon className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeleteSite(site.id, site.name)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50"
                          title="Delete site"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
        )}

        {/* ─── SECTION 3: USER PROFILE ─── */}
        {/* ─── SECTION: SETTINGS & GUIDE TAB ─── */}
        {dashboardTab === 'settings' && (
          <section className="bg-white border border-zinc-200 rounded-3xl p-5 sm:p-8 shadow-sm space-y-6 max-w-2xl mx-auto">
            {/* Header & Language Switcher */}
            <div className="space-y-3 pb-4 border-b border-zinc-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold mb-1">
                    <SettingsIcon className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{SETTINGS_I18N[settingsLang].title}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-950 tracking-tight">
                    {SETTINGS_I18N[settingsLang].title}
                  </h2>
                  <p className="text-xs text-zinc-500 font-medium mt-0.5">
                    {SETTINGS_I18N[settingsLang].subtitle}
                  </p>
                </div>

                {/* Language Switcher Buttons (English / हिंदी / मराठी) */}
                <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded-xl border border-zinc-200 shrink-0">
                  <button
                    type="button"
                    onClick={() => setSettingsLang('en')}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      settingsLang === 'en' ? 'bg-white text-zinc-950 shadow-xs' : 'text-zinc-600 hover:text-zinc-950'
                    }`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => setSettingsLang('hi')}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      settingsLang === 'hi' ? 'bg-white text-zinc-950 shadow-xs' : 'text-zinc-600 hover:text-zinc-950'
                    }`}
                  >
                    हिंदी
                  </button>
                  <button
                    type="button"
                    onClick={() => setSettingsLang('mr')}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      settingsLang === 'mr' ? 'bg-white text-zinc-950 shadow-xs' : 'text-zinc-600 hover:text-zinc-950'
                    }`}
                  >
                    मराठी
                  </button>
                </div>
              </div>
            </div>

            {/* PWA App Installation Card */}
            <div className="p-4 sm:p-5 bg-gradient-to-br from-zinc-50 to-blue-50/40 rounded-2xl border border-zinc-200 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <DownloadIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-zinc-950">
                      {SETTINGS_I18N[settingsLang].pwaTitle}
                    </h3>
                    <p className="text-xs text-zinc-500 font-medium">
                      {SETTINGS_I18N[settingsLang].pwaDesc}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-1">
                {pwaInstalled ? (
                  <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-100/80 border border-emerald-300 text-emerald-800 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{SETTINGS_I18N[settingsLang].pwaAlreadyInstalled}</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (typeof window !== 'undefined' && (window as any).deferredPrompt) {
                        (window as any).deferredPrompt.prompt();
                      } else {
                        alert(
                          settingsLang === 'hi'
                            ? 'ऐप इंस्टॉल करने के लिए ब्राउज़र मेनू (⋮) में जाकर "Install App" या "Add to Home Screen" चुनें।'
                            : settingsLang === 'mr'
                            ? 'ॲप इन्स्टॉल करण्यासाठी ब्राउझर मेनू (⋮) उघडून "Install App" किंवा "Add to Home Screen" निवडा.'
                            : 'To install the PWA, tap your browser menu (⋮) and select "Install App" or "Add to Home Screen".'
                        );
                      }
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm active:scale-98"
                  >
                    <DownloadIcon className="w-4 h-4 text-white" />
                    <span>{SETTINGS_I18N[settingsLang].pwaInstallBtn}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Notifications Permissions Card */}
            <div className="p-4 sm:p-5 bg-gradient-to-br from-zinc-50 to-emerald-50/40 rounded-2xl border border-zinc-200 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <BellIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-zinc-950">
                      {SETTINGS_I18N[settingsLang].notifTitle}
                    </h3>
                    <p className="text-xs text-zinc-500 font-medium">
                      {SETTINGS_I18N[settingsLang].notifDesc}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-1">
                {notifPermission === 'granted' ? (
                  <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-100/80 border border-emerald-300 text-emerald-800 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{SETTINGS_I18N[settingsLang].notifActive}</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={async () => {
                      if ('Notification' in window) {
                        const perm = await Notification.requestPermission();
                        setNotifPermission(perm);
                        if (perm === 'granted') {
                          alert(
                            settingsLang === 'hi'
                              ? 'नोटिफिकेशन सफलतापूर्वक चालू हो गई हैं!'
                              : settingsLang === 'mr'
                              ? 'सूचना यशस्वीरित्या सुरू झाल्या आहेत!'
                              : 'Notifications successfully enabled!'
                          );
                        }
                      }
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm active:scale-98"
                  >
                    <BellIcon className="w-4 h-4 text-white" />
                    <span>{SETTINGS_I18N[settingsLang].notifEnableBtn}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Apple iOS Safari Installation Guide */}
            <div className="p-4 sm:p-5 bg-zinc-900 text-zinc-100 rounded-2xl space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
                  <AppleIcon className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-extrabold text-sm text-white">
                  {SETTINGS_I18N[settingsLang].iosTitle}
                </h3>
              </div>

              <div className="space-y-2 text-xs text-zinc-300 pt-1">
                <div className="flex items-start gap-2 bg-zinc-800/80 p-2.5 rounded-xl">
                  <span className="font-bold text-blue-400">1.</span>
                  <p className="leading-snug">{SETTINGS_I18N[settingsLang].iosStep1}</p>
                </div>
                <div className="flex items-start gap-2 bg-zinc-800/80 p-2.5 rounded-xl">
                  <span className="font-bold text-blue-400">2.</span>
                  <p className="leading-snug">{SETTINGS_I18N[settingsLang].iosStep2}</p>
                </div>
                <div className="flex items-start gap-2 bg-zinc-800/80 p-2.5 rounded-xl">
                  <span className="font-bold text-blue-400">3.</span>
                  <p className="leading-snug">{SETTINGS_I18N[settingsLang].iosStep3}</p>
                </div>
              </div>
            </div>

            {/* How 15-Day Free Trial & Pricing Works */}
            <div className="p-4 sm:p-5 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-sm text-zinc-950">
                  {SETTINGS_I18N[settingsLang].trialTitle}
                </h3>
              </div>

              <ul className="space-y-2 text-xs text-zinc-700 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>{SETTINGS_I18N[settingsLang].trialPoint1}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>{SETTINGS_I18N[settingsLang].trialPoint2}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>{SETTINGS_I18N[settingsLang].trialPoint3}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>{SETTINGS_I18N[settingsLang].trialPoint4}</span>
                </li>
              </ul>
            </div>

            {/* Direct Founder Support */}
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div>
                <h4 className="font-extrabold text-xs text-emerald-950">{SETTINGS_I18N[settingsLang].supportTitle}</h4>
                <p className="text-[11px] text-emerald-700 mt-0.5">{SETTINGS_I18N[settingsLang].supportDesc}</p>
              </div>
              <a
                href="https://wa.me/919307426215"
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs shrink-0"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{SETTINGS_I18N[settingsLang].supportBtn}</span>
              </a>
            </div>
          </section>
        )}

        {/* ─── SECTION: PROFILE TAB ─── */}
        {dashboardTab === 'profile' && (
          <section className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 max-w-xl mx-auto">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xl flex items-center justify-center shadow-md overflow-hidden shrink-0">
                {(user as any)?.avatarUrl ? (
                  <img src={(user as any).avatarUrl} alt={user?.fullName || 'User'} className="w-full h-full object-cover" />
                ) : (
                  <span>{user?.fullName ? user.fullName[0].toUpperCase() : 'U'}</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-extrabold text-zinc-950 truncate">{user?.fullName || 'Guest User'}</h2>
                  {user && (
                    <span className="text-[10px] font-extrabold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                      ✓ Google Verified
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-500 font-mono truncate">{user?.email || 'Not signed in'}</p>
              </div>
            </div>

            {user ? (
              <div className="space-y-4 pt-2 border-t border-zinc-200">
                <div>
                  <label className="block text-xs font-bold text-zinc-900 mb-1">
                    Full Name (Compulsory &bull; Displayed in CV &amp; Stores) *
                  </label>
                  <input
                    type="text"
                    required
                    value={user.fullName || ''}
                    onChange={(e) => {
                      const updated = { ...user, fullName: e.target.value };
                      setUser(updated);
                      try {
                        localStorage.setItem('linkal_user', JSON.stringify(updated));
                      } catch {}
                    }}
                    className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-xs font-semibold text-zinc-950 focus:bg-white focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-900 mb-1">
                    Compulsory WhatsApp Phone Number (Direct Contact) *
                  </label>
                  <input
                    type="text"
                    required
                    value={user.phoneNumber || ''}
                    onChange={(e) => {
                      const updated = { ...user, phoneNumber: e.target.value };
                      setUser(updated);
                      try {
                        localStorage.setItem('linkal_user', JSON.stringify(updated));
                      } catch {}
                    }}
                    placeholder="e.g. 919307426215"
                    className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-xs font-mono font-bold text-zinc-950 focus:bg-white focus:ring-2 focus:ring-blue-600"
                  />
                  <span className="text-[10px] text-zinc-500 mt-1 block">
                    Compulsory: Recruiters contact you on this number for your CV, or customers place WhatsApp store orders.
                  </span>
                </div>

                <div className="p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-zinc-800 block">Active Websites Owned</span>
                    <span className="text-[10px] text-zinc-500">Only your created websites appear here.</span>
                  </div>
                  <span className="font-extrabold text-blue-600 font-mono text-base">{sites.length}</span>
                </div>

                {/* Apple iOS Safari Installation & Web Push Instructions */}
                <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 text-xs space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-zinc-900 text-white flex items-center justify-center text-xs font-bold"></span>
                    <strong className="text-zinc-950 font-extrabold">Apple iOS (iPhone &amp; iPad) Installation &amp; Notifications</strong>
                  </div>
                  <p className="text-[11px] text-zinc-500 leading-relaxed">
                    On iOS 16.4+, Apple requires adding the app to your Home Screen from Safari to enable Web Push notifications:
                  </p>
                  <ol className="text-[11px] text-zinc-700 space-y-1.5 pl-4 list-decimal leading-relaxed">
                    <li>Open <strong>studio.linkal.in</strong> in <strong>Safari</strong> on your iPhone or iPad.</li>
                    <li>Tap the <strong>Share</strong> button (box with upward arrow <span className="font-mono font-bold">⎋</span>) in Safari's bottom toolbar.</li>
                    <li>Scroll down and tap <strong>"Add to Home Screen"</strong> (<span className="font-mono font-bold">⊞</span>).</li>
                    <li>Launch Linkal Studio from your Home Screen &amp; tap <strong>"Allow Notifications"</strong> when prompted.</li>
                  </ol>
                </div>

                <div className="pt-2 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setDashboardTab('templates')}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
                  >
                    Create New Site →
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      try {
                        localStorage.removeItem('linkal_user');
                      } catch {}
                      setUser(null);
                      setSites([]);
                      setDashboardTab('sites');
                    }}
                    className="px-3.5 py-2 text-red-600 hover:bg-red-50 rounded-xl text-xs font-bold transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 space-y-4">
                <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed">
                  Sign in with your Google account to secure your sites, access your profile, and receive notifications.
                </p>
                <button
                  type="button"
                  onClick={() => setShowGoogleModal(true)}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white border-2 border-zinc-300 hover:border-zinc-400 text-zinc-800 rounded-2xl font-bold text-sm shadow-sm transition-all"
                >
                  <GoogleIcon className="w-5 h-5" />
                  <span>Sign In with Google (Choose Account)</span>
                </button>
              </div>
            )}
          </section>
        )}
      </main>

      {/* ─── MOBILE BOTTOM STICKY TASKBAR ─── */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-zinc-200 px-3 py-2 flex items-center justify-around shadow-lg">
        <button
          type="button"
          onClick={() => setDashboardTab('sites')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all ${
            dashboardTab === 'sites' ? 'text-blue-600 font-extrabold' : 'text-zinc-500 font-medium'
          }`}
        >
          <Globe className="w-5 h-5" />
          <span className="text-[10px]">Websites</span>
        </button>

        <button
          type="button"
          onClick={() => setDashboardTab('templates')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all ${
            dashboardTab === 'templates' ? 'text-blue-600 font-extrabold' : 'text-zinc-500 font-medium'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-[10px]">Templates</span>
        </button>

        <button
          type="button"
          onClick={() => setDashboardTab('settings')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all ${
            dashboardTab === 'settings' ? 'text-blue-600 font-extrabold' : 'text-zinc-500 font-medium'
          }`}
        >
          <SettingsIcon className="w-5 h-5" />
          <span className="text-[10px]">Settings</span>
        </button>

        <button
          type="button"
          onClick={() => setDashboardTab('profile')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all ${
            dashboardTab === 'profile' ? 'text-blue-600 font-extrabold' : 'text-zinc-500 font-medium'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px]">Profile</span>
        </button>
      </nav>

      {/* ─── QR CODE MODAL ─── */}
      {qrModalSite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setQrModalSite(null)}
          />
          <div className="relative z-10 w-full max-w-sm bg-white rounded-3xl border border-zinc-200 shadow-2xl p-6 space-y-4 text-center animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-zinc-950">Website QR Code</h3>
              <button
                onClick={() => setQrModalSite(null)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div
              className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 inline-block mx-auto"
              dangerouslySetInnerHTML={{
                __html: generateQrSvg(`https://${qrModalSite.slug}.linkal.in`, 200),
              }}
            />

            <div>
              <p className="font-bold text-xs text-zinc-900">{qrModalSite.name}</p>
              <p className="font-mono text-[11px] text-blue-600 mt-0.5">https://{qrModalSite.slug}.linkal.in</p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => downloadQrPng(`https://${qrModalSite.slug}.linkal.in`, qrModalSite.slug)}
                className="py-2 px-3 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-sm"
              >
                Download PNG
              </button>
              <button
                onClick={() => downloadQrSvg(`https://${qrModalSite.slug}.linkal.in`, qrModalSite.slug)}
                className="py-2 px-3 rounded-xl border border-zinc-300 text-zinc-800 text-xs font-bold hover:bg-zinc-100"
              >
                Download SVG
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-bold text-zinc-600">Loading Linkal Studio...</span>
          </div>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
