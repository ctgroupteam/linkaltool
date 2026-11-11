'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  Rocket,
  Download,
  Smartphone,
  Tablet,
  Monitor,
  Plus,
  Trash2,
  ExternalLink,
  ExternalLink as ArrowUpRight,
  Check,
  Globe,
  Sliders,
  Sparkles,
  ShoppingBag,
  User,
  Zap,
  Image as ImageIcon,
  MessageCircle,
  Palette,
  Type,
  AlertCircle,
  X,
  CheckCircle2,
  Layers,
  Sliders as Menu,
  Eye,
  Edit3,
  ChevronRight,
  LogOut,
  ShieldCheck,
  Globe as LayoutGrid,
  HelpCircle,
  RefreshCw,
} from 'lucide-react';
import {
  SiteData,
  BannerSlide,
  ProductItem,
  WatchItem,
  RestaurantMenuItem,
  WeddingCardDetails,
  TuitionDetails,
  PortfolioProject,
  PortfolioSkill,
  TrustBadgeItem,
  ReviewItem,
  FaqItem,
} from '@/types/site';
import { generateStaticHtml } from '@/lib/generator';
import { generateQrSvg, downloadQrPng, downloadQrSvg } from '@/lib/qrcode';
import { GoogleAuthModal } from '@/app/components/GoogleAuthModal';

function Maximize2({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 3 21 3 21 9" />
      <polyline points="9 21 3 21 3 15" />
      <line x1="21" y1="3" x2="14" y2="10" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  );
}

function Minimize2({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 14 10 14 10 20" />
      <polyline points="20 10 14 10 14 4" />
      <line x1="14" y1="10" x2="21" y2="3" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  );
}

function Upload({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function Star({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function FileText({ className = 'w-4 h-4' }: { className?: string }) {
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

function QrIcon({ className = 'w-4 h-4' }: { className?: string }) {
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

function BriefcaseIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

function GraduationCapIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
    </svg>
  );
}

function AwardIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="7" />
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </svg>
  );
}

function FolderGitIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
      <circle cx="12" cy="13" r="2" />
    </svg>
  );
}

const THEME_PRESETS = [
  { name: 'Emerald', hex: '#059669' },
  { name: 'Royal Blue', hex: '#2563eb' },
  { name: 'Indigo', hex: '#4f46e5' },
  { name: 'Violet', hex: '#7c3aed' },
  { name: 'Amber', hex: '#d97706' },
  { name: 'Rose', hex: '#e11d48' },
  { name: 'Sunset Orange', hex: '#ea580c' },
  { name: 'Cyan Tech', hex: '#0891b2' },
  { name: 'Dark Slate', hex: '#18181b' },
];

const FONTS: Array<SiteData['fontFamily']> = [
  'Inter',
  'Plus Jakarta Sans',
  'Outfit',
  'Roboto',
  'Poppins',
];

export type TabType =
  | 'general'
  | 'branding'
  | 'announcement'
  | 'slider'
  | 'type_specific'
  | 'trust_badges'
  | 'reviews'
  | 'faq'
  | 'about'
  | 'footer'
  | 'cv_format'
  | 'cv_profile'
  | 'cv_summary'
  | 'cv_experience'
  | 'cv_education'
  | 'cv_skills'
  | 'cv_projects'
  | 'cv_certifications'
  | 'cv_custom';

export default function BuilderPage() {
  const params = useParams();
  const router = useRouter();
  const siteId = params.id as string;

  const [site, setSite] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [mobileViewMode, setMobileViewMode] = useState<'editor' | 'preview'>('editor');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [deploymentLogs, setDeploymentLogs] = useState<any[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [propagationSeconds, setPropagationSeconds] = useState(30);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [previewCvFormatModal, setPreviewCvFormatModal] = useState<string | null>(null);
  const [isFullScreenPreview, setIsFullScreenPreview] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('linkal_user');
      if (saved) setCurrentUser(JSON.parse(saved));
    } catch {}
  }, []);

  const [subdomainStatus, setSubdomainStatus] = useState<{
    checking: boolean;
    available?: boolean;
    reason?: string;
    suggestions?: string[];
  }>({ checking: false });

  // Debounced 200ms RFC 1035 Subdomain Availability Verification
  useEffect(() => {
    if (!site?.slug) return;
    const timer = setTimeout(async () => {
      try {
        setSubdomainStatus({ checking: true });
        const res = await fetch(
          `/api/subdomain/check?slug=${encodeURIComponent(site.slug)}&siteId=${encodeURIComponent(site.id)}`
        );
        const data = await res.json();
        setSubdomainStatus({
          checking: false,
          available: data.available,
          reason: data.message || data.reason,
          suggestions: data.suggestions,
        });
      } catch {
        setSubdomainStatus({ checking: false, available: true });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [site?.slug, site?.id]);

  // 30-Second Propagation Countdown Timer
  useEffect(() => {
    let timer: any;
    if (deploying) {
      setPropagationSeconds(30);
      timer = setInterval(() => {
        setPropagationSeconds((prev) => (prev > 1 ? prev - 1 : 1));
      }, 1000);
    } else {
      setPropagationSeconds(30);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [deploying]);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Anti-Frame Nesting Guard: Builder UI must NEVER render inside an iframe
  useEffect(() => {
    if (typeof window !== 'undefined' && window.self !== window.top) {
      console.warn('Builder UI detected inside an iframe, redirecting to standalone preview...');
      window.location.replace(`/api/sites/${siteId}/preview`);
    }
  }, [siteId]);

  // Load site data
  useEffect(() => {
    async function loadSite() {
      try {
        setLoading(true);
        const res = await fetch(`/api/sites/${siteId}`);
        if (res.ok) {
          const data = await res.json();
          const loadedSite: SiteData = data.site;
          if (loadedSite.type === 'cv') {
            setActiveTab('cv_profile');
            // Ensure clean generic CV defaults if missing (NO Harvard / executive hardcoding)
            if (!loadedSite.cvExperiences || loadedSite.cvExperiences.length === 0) {
              loadedSite.cvExperiences = [
                {
                  id: 'exp-1',
                  company: 'Company ABC',
                  role: 'Role / Position',
                  period: '2022 — Present',
                  location: 'City, Country',
                  description: 'Key responsibilities, achievements, and measurable business impact.',
                  companyUrl: ''
                }
              ];
            }
            if (!loadedSite.cvEducations || loadedSite.cvEducations.length === 0) {
              loadedSite.cvEducations = [
                {
                  id: 'edu-1',
                  institution: 'University / Institute Name',
                  degree: 'Degree / Course Name',
                  year: '2018 — 2022',
                  honors: ''
                }
              ];
            }
            if (!loadedSite.cvSkills || loadedSite.cvSkills.length === 0) {
              loadedSite.cvSkills = [
                'Skill 1',
                'Skill 2',
                'Skill 3',
                'Project Planning',
                'Communication'
              ];
            }
            if (!loadedSite.cvProjects || loadedSite.cvProjects.length === 0) {
              loadedSite.cvProjects = [
                {
                  id: 'proj-1',
                  title: 'Project Title Alpha',
                  description: 'Designed and implemented end-to-end functionality to meet client objectives.',
                  link: `https://${loadedSite.slug}.linkal.in`,
                  techStack: 'Tools & Technologies'
                }
              ];
            }
            if (!loadedSite.cvCertifications || loadedSite.cvCertifications.length === 0) {
              loadedSite.cvCertifications = [
                {
                  id: 'cert-1',
                  name: 'Certification Title',
                  issuer: 'Issuing Organization',
                  year: '2024',
                  url: ''
                }
              ];
            }
            if (loadedSite.cvShowSummary === undefined) loadedSite.cvShowSummary = true;
            if (loadedSite.cvShowExperience === undefined) loadedSite.cvShowExperience = true;
            if (loadedSite.cvShowEducation === undefined) loadedSite.cvShowEducation = true;
            if (loadedSite.cvShowSkills === undefined) loadedSite.cvShowSkills = true;
            if (loadedSite.cvShowProjects === undefined) loadedSite.cvShowProjects = true;
            if (loadedSite.cvShowCertifications === undefined) loadedSite.cvShowCertifications = true;
            if (!loadedSite.cvFormat) loadedSite.cvFormat = 'classic';
          }
          setSite(loadedSite);
          return;
        }

        // Fallback: check localStorage if server cold started
        try {
          const cached = localStorage.getItem('linkal_sites_history');
          if (cached) {
            const list: SiteData[] = JSON.parse(cached);
            const found = list.find((s) => s.id === siteId);
            if (found) {
              if (found.type === 'portfolio') {
                setActiveTab('cv_profile');
              }
              setSite(found);
              // Sync back to server
              fetch(`/api/sites/${siteId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(found),
              }).catch(console.error);
              return;
            }
          }
        } catch {}

        throw new Error('Site not found');
      } catch (err) {
        console.error('Failed to load site:', err);
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    }
    if (siteId) loadSite();
  }, [siteId, router]);

  // Generate live preview HTML instantly on every state change
  const previewHtml = useMemo(() => {
    if (!site) return '';
    return generateStaticHtml(site);
  }, [site]);

  // Helper: 99% Client-Side WebP Canvas Compression
  const compressImageToWebP = (
    file: File,
    maxWidth = 800,
    maxHeight = 800,
    quality = 0.8
  ): Promise<string> => {
    return new Promise((resolve) => {
      if (file.type === 'image/svg+xml' || file.size < 15 * 1024) {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => resolve('');
        reader.readAsDataURL(file);
        return;
      }

      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        let { width, height } = img;
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          const r = new FileReader();
          r.onload = () => resolve(r.result as string);
          r.onerror = () => resolve('');
          r.readAsDataURL(file);
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        const webpDataUrl = canvas.toDataURL('image/webp', quality);
        resolve(webpDataUrl);
      };
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        const r = new FileReader();
        r.onload = () => resolve(r.result as string);
        r.onerror = () => resolve('');
        r.readAsDataURL(file);
      };
      img.src = objectUrl;
    });
  };

  // Image Upload Helper with 99% WebP Canvas Compression
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onComplete: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      // Auto-compress to WebP (drops 5MB to ~25KB)
      const compressedBase64 = await compressImageToWebP(file, 800, 800, 0.8);
      
      // Immediate visual update in editor & live preview
      onComplete(compressedBase64);

      // Async upload to persistent repo storage
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          base64: compressedBase64,
          filename: file.name.replace(/\.[^/.]+$/, '') + '.webp',
          siteSlug: site?.slug,
        }),
      });
      const data = await res.json();
      if (data && data.url) {
        onComplete(data.url);
      }
    } catch (err) {
      console.warn('Upload error, kept local preview:', err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAuthSuccess = (user: any) => {
    if (site) {
      const updated = {
        ...site,
        userEmail: user.email,
        userGoogleId: user.google_id || user.id,
      };
      setSite(updated);
      // Auto-save after successful Google Auth
      fetch(`/api/sites/${site.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      }).catch(console.warn);
    }
  };

  // Handle Save Draft
  const handleSave = async () => {
    if (!site) return;

    // Check Google Auth requirement
    const localUser = typeof window !== 'undefined' ? localStorage.getItem('linkal_user') : null;
    if (!localUser) {
      setShowAuthModal(true);
      return;
    }

    try {
      setSaving(true);
      const res = await fetch(`/api/sites/${site.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(site),
      });
      if (!res.ok) throw new Error('Failed to save site');
      const data = await res.json();
      setSite(data.site);

      // Also backup to localStorage
      try {
        const local = localStorage.getItem('linkal_sites_history');
        if (local) {
          const list: SiteData[] = JSON.parse(local);
          const idx = list.findIndex((s) => s.id === site.id);
          if (idx >= 0) list[idx] = data.site;
          else list.unshift(data.site);
          localStorage.setItem('linkal_sites_history', JSON.stringify(list));
        } else {
          localStorage.setItem('linkal_sites_history', JSON.stringify([data.site]));
        }
      } catch {}

      alert('Changes saved successfully!');
    } catch (err: any) {
      alert(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  // Handle Publish
  const handlePublish = async () => {
    if (!site) return;

    // Check Google Auth requirement
    const localUser = typeof window !== 'undefined' ? localStorage.getItem('linkal_user') : null;
    if (!localUser) {
      setShowAuthModal(true);
      return;
    }

    setSaving(true);

    try {
      // Save any pending builder changes first
      await fetch(`/api/sites/${site.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(site),
      });
    } catch (err) {
      console.warn('Auto-save before deploy:', err);
    } finally {
      setSaving(false);
    }

    // Launch the agentic AI deployment engine page
    router.push(`/deploy/${site.id}`);
  };

  // Update site helper with instant state & local cache update
  const updateSiteField = <K extends keyof SiteData>(field: K, value: SiteData[K]) => {
    if (!site) return;
    const updated = { ...site, [field]: value };
    setSite(updated);

    try {
      const cached = localStorage.getItem('linkal_sites_history');
      if (cached) {
        const list: SiteData[] = JSON.parse(cached);
        const idx = list.findIndex((s) => s.id === site.id);
        if (idx >= 0) list[idx] = updated;
        else list.unshift(updated);
        localStorage.setItem('linkal_sites_history', JSON.stringify(list));
      } else {
        localStorage.setItem('linkal_sites_history', JSON.stringify([updated]));
      }
    } catch {}
  };

  // ─── DEDICATED ATS CV EDITING HANDLERS ─────────────────────────────────
  const handleAddExperience = () => {
    if (!site) return;
    const newExp: any = {
      id: `exp-${Date.now()}`,
      company: '',
      role: '',
      period: '2022 — Present',
      location: 'Mumbai, India',
      description: '',
      companyUrl: '',
    };
    const updated = [...(site.cvExperiences || []), newExp];
    updateSiteField('cvExperiences', updated);
  };

  const handleUpdateExperience = (idx: number, field: string, val: string) => {
    if (!site) return;
    const list = [...(site.cvExperiences || [])];
    if (list[idx]) {
      list[idx] = { ...list[idx], [field]: val };
      updateSiteField('cvExperiences', list);
    }
  };

  const handleDeleteExperience = (idx: number) => {
    if (!site) return;
    const list = (site.cvExperiences || []).filter((_, i) => i !== idx);
    updateSiteField('cvExperiences', list);
  };

  const handleAddEducation = () => {
    if (!site) return;
    const newEdu: any = {
      id: `edu-${Date.now()}`,
      institution: '',
      degree: '',
      year: `${new Date().getFullYear() - 4} — ${new Date().getFullYear()}`,
      honors: '',
    };
    const updated = [...(site.cvEducations || []), newEdu];
    updateSiteField('cvEducations', updated);
  };

  const handleUpdateEducation = (idx: number, field: string, val: string) => {
    if (!site) return;
    const list = [...(site.cvEducations || [])];
    if (list[idx]) {
      list[idx] = { ...list[idx], [field]: val };
      updateSiteField('cvEducations', list);
    }
  };

  const handleDeleteEducation = (idx: number) => {
    if (!site) return;
    const list = (site.cvEducations || []).filter((_, i) => i !== idx);
    updateSiteField('cvEducations', list);
  };

  const [newSkillInput, setNewSkillInput] = useState('');
  const handleAddSkill = (skillName?: string) => {
    if (!site) return;
    const nameToAdd = (skillName || newSkillInput).trim();
    if (!nameToAdd) return;
    const current = site.cvSkills || [];
    if (!current.includes(nameToAdd)) {
      updateSiteField('cvSkills', [...current, nameToAdd]);
    }
    if (!skillName) setNewSkillInput('');
  };

  const handleDeleteSkill = (idx: number) => {
    if (!site) return;
    const list = (site.cvSkills || []).filter((_, i) => i !== idx);
    updateSiteField('cvSkills', list);
  };

  const handleAddCvProject = () => {
    if (!site) return;
    const newProj: any = {
      id: `proj-${Date.now()}`,
      title: '',
      description: '',
      link: '',
      techStack: '',
    };
    const updated = [...(site.cvProjects || []), newProj];
    updateSiteField('cvProjects', updated);
  };

  const handleUpdateCvProject = (idx: number, field: string, val: string) => {
    if (!site) return;
    const list = [...(site.cvProjects || [])];
    if (list[idx]) {
      list[idx] = { ...list[idx], [field]: val };
      updateSiteField('cvProjects', list);
    }
  };

  const handleDeleteCvProject = (idx: number) => {
    if (!site) return;
    const list = (site.cvProjects || []).filter((_, i) => i !== idx);
    updateSiteField('cvProjects', list);
  };

  const handleAddCertification = () => {
    if (!site) return;
    const newCert: any = {
      id: `cert-${Date.now()}`,
      name: '',
      issuer: '',
      year: `${new Date().getFullYear()}`,
      url: '',
    };
    const updated = [...(site.cvCertifications || []), newCert];
    updateSiteField('cvCertifications', updated);
  };

  const handleUpdateCertification = (idx: number, field: string, val: string) => {
    if (!site) return;
    const list = [...(site.cvCertifications || [])];
    if (list[idx]) {
      list[idx] = { ...list[idx], [field]: val };
      updateSiteField('cvCertifications', list);
    }
  };

  const handleDeleteCertification = (idx: number) => {
    if (!site) return;
    const list = (site.cvCertifications || []).filter((_, i) => i !== idx);
    updateSiteField('cvCertifications', list);
  };

  // ─── DEDICATED ATS CV CUSTOM SECTIONS HANDLERS ─────────────────────────
  const handleAddCustomCategory = () => {
    if (!site) return;
    const newCat = {
      id: `cat-${Date.now()}`,
      name: 'New Custom Section',
      visible: true,
      items: [
        {
          id: `item-${Date.now()}`,
          title: 'Section Item Title',
          subtitle: 'Role / Context',
          period: '2023',
          description: 'Description of key achievement or detail.',
          link: '',
          isLinkClickable: true,
        },
      ],
    };
    const updated = [...(site.cvCustomCategories || []), newCat];
    updateSiteField('cvCustomCategories', updated);
  };

  const handleDeleteCustomCategory = (catIdx: number) => {
    if (!site) return;
    const list = (site.cvCustomCategories || []).filter((_, i) => i !== catIdx);
    updateSiteField('cvCustomCategories', list);
  };

  const handleUpdateCustomCategory = (catIdx: number, field: string, val: any) => {
    if (!site) return;
    const list = [...(site.cvCustomCategories || [])];
    if (list[catIdx]) {
      list[catIdx] = { ...list[catIdx], [field]: val };
      updateSiteField('cvCustomCategories', list);
    }
  };

  const handleAddCustomCategoryItem = (catIdx: number) => {
    if (!site) return;
    const list = [...(site.cvCustomCategories || [])];
    if (list[catIdx]) {
      const newItem = {
        id: `item-${Date.now()}`,
        title: '',
        subtitle: '',
        period: '',
        description: '',
        link: '',
        isLinkClickable: true,
      };
      list[catIdx] = {
        ...list[catIdx],
        items: [...(list[catIdx].items || []), newItem],
      };
      updateSiteField('cvCustomCategories', list);
    }
  };

  const handleDeleteCustomCategoryItem = (catIdx: number, itemIdx: number) => {
    if (!site) return;
    const list = [...(site.cvCustomCategories || [])];
    if (list[catIdx]) {
      list[catIdx] = {
        ...list[catIdx],
        items: (list[catIdx].items || []).filter((_, i) => i !== itemIdx),
      };
      updateSiteField('cvCustomCategories', list);
    }
  };

  const handleUpdateCustomCategoryItem = (catIdx: number, itemIdx: number, field: string, val: any) => {
    if (!site) return;
    const list = [...(site.cvCustomCategories || [])];
    if (list[catIdx] && list[catIdx].items?.[itemIdx]) {
      const items = [...list[catIdx].items];
      items[itemIdx] = { ...items[itemIdx], [field]: val };
      list[catIdx] = { ...list[catIdx], items };
      updateSiteField('cvCustomCategories', list);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  if (loading || !site) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-3 border-zinc-950 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-zinc-600">Loading site builder studio...</p>
      </div>
    );
  }

  // Device width class
  const getDeviceClass = () => {
    switch (previewDevice) {
      case 'mobile':
        return 'w-[375px] max-w-full h-[667px] max-h-full rounded-3xl shadow-xl border-8 border-zinc-900';
      case 'tablet':
        return 'w-[768px] max-w-full h-[900px] max-h-full rounded-2xl shadow-xl border-8 border-zinc-900';
      default:
        return 'w-full h-full rounded-xl border border-zinc-200 shadow-xs';
    }
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-zinc-50 flex flex-col text-zinc-950">
      {/* Studio Header Bar */}
      <header className="sticky top-0 z-30 bg-white border-b border-zinc-200 px-3 sm:px-4 h-15 flex items-center justify-between shadow-xs w-full max-w-full overflow-hidden">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink">
          {/* Top-Left Hamburger Drawer Menu */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="p-1.5 rounded-lg border border-zinc-200 text-zinc-900 hover:bg-zinc-100 transition-colors shrink-0"
            title="Open Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            onClick={() => router.push('/dashboard')}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-zinc-200 text-xs font-bold text-zinc-700 hover:bg-zinc-100 transition-all shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>My Sites</span>
          </button>

          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 shrink">
            <span className="font-extrabold text-xs sm:text-sm text-zinc-950 truncate max-w-[100px] sm:max-w-[140px] md:max-w-[180px] shrink-0">
              {site.name}
            </span>
            <span className="hidden lg:inline-flex px-2 py-0.5 rounded bg-zinc-100 font-mono text-[10px] font-bold text-zinc-700 truncate max-w-[140px] shrink">
              {site.slug}.linkal.in
            </span>
            <select
              value={site.type}
              onChange={(e) => {
                const newType = e.target.value as any;
                const updated = { ...site, type: newType };
                setSite(updated);
                if (newType === 'cv') {
                  setActiveTab('cv_profile');
                } else if (['watch_store', 'restaurant', 'wedding_card', 'tuition', 'boutique', 'portfolio'].includes(newType)) {
                  setActiveTab('type_specific');
                } else {
                  setActiveTab('general');
                }
              }}
              className="text-[11px] font-extrabold px-2 py-1 rounded-lg border border-zinc-300 bg-white text-zinc-900 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-xs max-w-[130px] sm:max-w-[180px] md:max-w-[240px] truncate shrink"
              title="Change Blueprint Template"
            >
              <option value="cv">1. Free CV Website (Lifetime Free)</option>
              <option value="ecommerce">2. E-Commerce Website (Multi-Templates)</option>
              <option value="boutique">3. Fashion &amp; Boutique</option>
              <option value="watch_store">4. Luxury Watch Business</option>
              <option value="restaurant">5. Restaurant &amp; Cafe Menu (₹99 Special)</option>
              <option value="wedding_card">6. Wedding Card Invitation (Lifetime Free)</option>
              <option value="electronics">7. Electronics &amp; Gadgets</option>
              <option value="portfolio">8. Creative Portfolio (Max 5 WebP)</option>
              <option value="bakery">9. Bakery &amp; Cake Shop</option>
              <option value="tuition">10. Tuition &amp; Coaching Academy</option>
              <option value="salon">11. Salon &amp; Beauty Lounge</option>
              <option value="single_product">12. Single Product Launchpad</option>
            </select>
          </div>
        </div>

        {/* Center: Device Viewport Switcher */}
        <div className="hidden xl:flex items-center gap-1 bg-zinc-100 p-1 rounded-xl border border-zinc-200 shrink-0">
          <button
            onClick={() => setPreviewDevice('desktop')}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
              previewDevice === 'desktop'
                ? 'bg-white text-zinc-950 shadow-xs font-bold'
                : 'text-zinc-500 hover:text-zinc-950'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span>Desktop</span>
          </button>
          <button
            onClick={() => setPreviewDevice('tablet')}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
              previewDevice === 'tablet'
                ? 'bg-white text-zinc-950 shadow-xs font-bold'
                : 'text-zinc-500 hover:text-zinc-950'
            }`}
          >
            <Tablet className="w-4 h-4" />
            <span>Tablet</span>
          </button>
          <button
            onClick={() => setPreviewDevice('mobile')}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
              previewDevice === 'mobile'
                ? 'bg-white text-zinc-950 shadow-xs font-bold'
                : 'text-zinc-500 hover:text-zinc-950'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Mobile</span>
          </button>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={() => setShowQrModal(true)}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-100 text-xs font-bold transition-all shadow-xs"
            title="Generate & Download QR Code"
          >
            <QrIcon className="w-3.5 h-3.5 text-zinc-900" />
            <span className="hidden md:inline">QR Code</span>
          </button>

          <button
            onClick={() => window.open(`/api/sites/${site.id}/export`, '_blank')}
            className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-100 text-xs font-bold transition-all"
            title="Download index.html bundle"
          >
            <Download className="w-3.5 h-3.5" />
            <span>HTML</span>
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl border border-zinc-300 bg-white hover:bg-zinc-100 text-zinc-950 text-xs font-bold transition-all disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5 text-zinc-900" />
            <span className="hidden sm:inline">{saving ? 'Saving...' : 'Save Changes'}</span>
            <span className="sm:hidden">{saving ? '...' : 'Save'}</span>
          </button>

          <button
            onClick={handlePublish}
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl bg-zinc-950 hover:bg-black text-white text-xs font-bold transition-all shadow-xs active:scale-95"
          >
            <Rocket className="w-3.5 h-3.5 text-emerald-400" />
            <span>Publish</span>
          </button>

          {currentUser && (
            <div className="hidden xl:flex items-center gap-2 pl-2 border-l border-zinc-200">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                {currentUser.avatarUrl ? (
                  <img src={currentUser.avatarUrl} alt={currentUser.fullName || ''} className="w-full h-full object-cover" />
                ) : (
                  <span>{currentUser.fullName ? currentUser.fullName[0].toUpperCase() : 'U'}</span>
                )}
              </div>
              <div className="text-left leading-none max-w-[100px] truncate">
                <span className="text-[11px] font-bold text-zinc-900 block truncate">
                  {currentUser.fullName || 'User'}
                </span>
                <span className="text-[9px] text-zinc-500 font-mono block truncate">
                  {currentUser.email}
                </span>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Slide-over Left Navigation Drawer */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 drawer-backdrop" onClick={() => setIsMenuOpen(false)} />
          <div className="relative z-10 w-80 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col justify-between border-r border-zinc-200 animate-in slide-in-from-left duration-200">
            <div>
              <div className="p-5 border-b border-zinc-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-zinc-950 text-white flex items-center justify-center font-bold">
                    <Globe className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-zinc-950">Linkal Studio</h3>
                    <p className="text-[11px] text-zinc-500 font-medium">Website Customizer</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-1.5 rounded-lg border border-zinc-200 text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <nav className="p-4 space-y-1">
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    router.push('/dashboard');
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-zinc-100 text-zinc-700 hover:text-zinc-950 text-xs font-bold transition-all text-left"
                >
                  <LayoutGrid className="w-4 h-4 text-zinc-950" />
                  <span>My Sites Overview</span>
                </button>

                {site.type === 'cv' ? (
                  <>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        setActiveTab('cv_format');
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-left transition-all ${
                        activeTab === 'cv_format'
                          ? 'bg-zinc-100 text-zinc-950'
                          : 'hover:bg-zinc-100 text-zinc-700'
                      }`}
                    >
                      <LayoutGrid className="w-4 h-4 text-purple-600" />
                      <span>Formats &amp; Visibility</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        setActiveTab('cv_profile');
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-left transition-all ${
                        activeTab === 'cv_profile'
                          ? 'bg-zinc-100 text-zinc-950'
                          : 'hover:bg-zinc-100 text-zinc-700'
                      }`}
                    >
                      <User className="w-4 h-4 text-blue-600" />
                      <span>Profile &amp; Contact</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        setActiveTab('cv_summary');
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-left transition-all ${
                        activeTab === 'cv_summary'
                          ? 'bg-zinc-100 text-zinc-950'
                          : 'hover:bg-zinc-100 text-zinc-700'
                      }`}
                    >
                      <FileText className="w-4 h-4 text-indigo-600" />
                      <span>Summary</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        setActiveTab('cv_experience');
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-left transition-all ${
                        activeTab === 'cv_experience'
                          ? 'bg-zinc-100 text-zinc-950'
                          : 'hover:bg-zinc-100 text-zinc-700'
                      }`}
                    >
                      <BriefcaseIcon className="w-4 h-4 text-emerald-600" />
                      <span>Work Experience</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        setActiveTab('cv_education');
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-left transition-all ${
                        activeTab === 'cv_education'
                          ? 'bg-zinc-100 text-zinc-950'
                          : 'hover:bg-zinc-100 text-zinc-700'
                      }`}
                    >
                      <GraduationCapIcon className="w-4 h-4 text-purple-600" />
                      <span>Education &amp; Credentials</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        setActiveTab('cv_skills');
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-left transition-all ${
                        activeTab === 'cv_skills'
                          ? 'bg-zinc-100 text-zinc-950'
                          : 'hover:bg-zinc-100 text-zinc-700'
                      }`}
                    >
                      <Zap className="w-4 h-4 text-amber-500" />
                      <span>Skills &amp; Competencies</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        setActiveTab('cv_projects');
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-left transition-all ${
                        activeTab === 'cv_projects'
                          ? 'bg-zinc-100 text-zinc-950'
                          : 'hover:bg-zinc-100 text-zinc-700'
                      }`}
                    >
                      <FolderGitIcon className="w-4 h-4 text-blue-500" />
                      <span>Featured Projects</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        setActiveTab('cv_certifications');
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-left transition-all ${
                        activeTab === 'cv_certifications'
                          ? 'bg-zinc-100 text-zinc-950'
                          : 'hover:bg-zinc-100 text-zinc-700'
                      }`}
                    >
                      <AwardIcon className="w-4 h-4 text-yellow-600" />
                      <span>Certifications</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        setActiveTab('cv_custom');
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-left transition-all ${
                        activeTab === 'cv_custom'
                          ? 'bg-zinc-100 text-zinc-950'
                          : 'hover:bg-zinc-100 text-zinc-700'
                      }`}
                    >
                      <Plus className="w-4 h-4 text-emerald-600" />
                      <span>Custom Sections</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        setActiveTab('branding');
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-left transition-all ${
                        activeTab === 'branding'
                          ? 'bg-zinc-100 text-zinc-950'
                          : 'hover:bg-zinc-100 text-zinc-700'
                      }`}
                    >
                      <Palette className="w-4 h-4 text-zinc-600" />
                      <span>Theme Accent Color</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        setActiveTab('general');
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-left transition-all ${
                        activeTab === 'general'
                          ? 'bg-zinc-100 text-zinc-950'
                          : 'hover:bg-zinc-100 text-zinc-700'
                      }`}
                    >
                      <Sliders className="w-4 h-4 text-zinc-900" />
                      <span>General &amp; WhatsApp</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        setActiveTab('branding');
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-left transition-all ${
                        activeTab === 'branding'
                          ? 'bg-zinc-100 text-zinc-950'
                          : 'hover:bg-zinc-100 text-zinc-700'
                      }`}
                    >
                      <Palette className="w-4 h-4 text-purple-600" />
                      <span>Logo &amp; Theme Colors</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        setActiveTab('announcement');
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-left transition-all ${
                        activeTab === 'announcement'
                          ? 'bg-zinc-100 text-zinc-950'
                          : 'hover:bg-zinc-100 text-zinc-700'
                      }`}
                    >
                      <Zap className="w-4 h-4 text-amber-500" />
                      <span>Top Banner Ticker</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        setActiveTab('slider');
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-left transition-all ${
                        activeTab === 'slider'
                          ? 'bg-zinc-100 text-zinc-950'
                          : 'hover:bg-zinc-100 text-zinc-700'
                      }`}
                    >
                      <ImageIcon className="w-4 h-4 text-blue-600" />
                      <span>Hero Banner Images</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        setActiveTab('type_specific');
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-left transition-all ${
                        activeTab === 'type_specific'
                          ? 'bg-zinc-100 text-zinc-950'
                          : 'hover:bg-zinc-100 text-zinc-700'
                      }`}
                    >
                      <ShoppingBag className="w-4 h-4 text-emerald-600" />
                      <span>Products &amp; Catalog</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        setActiveTab('trust_badges');
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-left transition-all ${
                        activeTab === 'trust_badges'
                          ? 'bg-zinc-100 text-zinc-950'
                          : 'hover:bg-zinc-100 text-zinc-700'
                      }`}
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Trust Badges</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        setActiveTab('reviews');
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-left transition-all ${
                        activeTab === 'reviews'
                          ? 'bg-zinc-100 text-zinc-950'
                          : 'hover:bg-zinc-100 text-zinc-700'
                      }`}
                    >
                      <Star className="w-4 h-4 text-amber-500" />
                      <span>Customer Reviews</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        setActiveTab('faq');
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-left transition-all ${
                        activeTab === 'faq'
                          ? 'bg-zinc-100 text-zinc-950'
                          : 'hover:bg-zinc-100 text-zinc-700'
                      }`}
                    >
                      <HelpCircle className="w-4 h-4 text-blue-500" />
                      <span>FAQ Accordion</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        setActiveTab('about');
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-left transition-all ${
                        activeTab === 'about'
                          ? 'bg-zinc-100 text-zinc-950'
                          : 'hover:bg-zinc-100 text-zinc-700'
                      }`}
                    >
                      <FileText className="w-4 h-4 text-indigo-500" />
                      <span>About Brand Story</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        setActiveTab('footer');
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-left transition-all ${
                        activeTab === 'footer'
                          ? 'bg-zinc-100 text-zinc-950'
                          : 'hover:bg-zinc-100 text-zinc-700'
                      }`}
                    >
                      <Layers className="w-4 h-4 text-zinc-600" />
                      <span>Footer &amp; Social</span>
                    </button>
                  </>
                )}
              </nav>
            </div>

            <div className="p-4 border-t border-zinc-100 bg-zinc-50">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-zinc-300 bg-white hover:bg-red-50 text-red-700 text-xs font-bold transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Builder Main Work Area */}
      <div className="flex-1 flex flex-col md:flex-row w-full max-w-full min-w-0 h-[calc(100dvh-60px)] min-h-[600px] overflow-hidden pb-16 md:pb-0">
        {/* Left Control Editor Pane */}
        <div
          className={`w-full md:w-[460px] lg:w-[500px] shrink-0 min-w-0 max-w-full bg-white border-r border-zinc-200 flex flex-col h-full overflow-y-auto overflow-x-hidden ${
            mobileViewMode === 'preview' ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Editor Sub-Tabs */}
          <div className="p-2.5 border-b border-zinc-200 bg-zinc-50 flex items-center gap-1.5 overflow-x-auto">
            {site.type === 'cv' ? (
              <>
                <button
                  onClick={() => setActiveTab('cv_format')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    activeTab === 'cv_format'
                      ? 'bg-zinc-950 text-white shadow-xs'
                      : 'text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  Formats &amp; Visibility
                </button>
                <button
                  onClick={() => setActiveTab('cv_profile')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    activeTab === 'cv_profile'
                      ? 'bg-zinc-950 text-white shadow-xs'
                      : 'text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  Profile &amp; Contact
                </button>
                <button
                  onClick={() => setActiveTab('cv_summary')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    activeTab === 'cv_summary'
                      ? 'bg-zinc-950 text-white shadow-xs'
                      : 'text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  Summary
                </button>
                <button
                  onClick={() => setActiveTab('cv_experience')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    activeTab === 'cv_experience'
                      ? 'bg-zinc-950 text-white shadow-xs'
                      : 'text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  Experience
                </button>
                <button
                  onClick={() => setActiveTab('cv_education')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    activeTab === 'cv_education'
                      ? 'bg-zinc-950 text-white shadow-xs'
                      : 'text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  Education
                </button>
                <button
                  onClick={() => setActiveTab('cv_skills')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    activeTab === 'cv_skills'
                      ? 'bg-zinc-950 text-white shadow-xs'
                      : 'text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  Skills
                </button>
                <button
                  onClick={() => setActiveTab('cv_projects')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    activeTab === 'cv_projects'
                      ? 'bg-zinc-950 text-white shadow-xs'
                      : 'text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  Projects
                </button>
                <button
                  onClick={() => setActiveTab('cv_certifications')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    activeTab === 'cv_certifications'
                      ? 'bg-zinc-950 text-white shadow-xs'
                      : 'text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  Certifications
                </button>
                <button
                  onClick={() => setActiveTab('cv_custom')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    activeTab === 'cv_custom'
                      ? 'bg-zinc-950 text-white shadow-xs'
                      : 'text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  Custom Sections
                </button>
                <button
                  onClick={() => setActiveTab('branding')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    activeTab === 'branding'
                      ? 'bg-zinc-950 text-white shadow-xs'
                      : 'text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  Theme Accent
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setActiveTab('type_specific')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    activeTab === 'type_specific'
                      ? 'bg-zinc-950 text-white shadow-xs'
                      : 'text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  {site.type === 'watch_store'
                    ? '⌚ Watch Catalog'
                    : site.type === 'restaurant'
                    ? 'Digital Menu & Dishes'
                    : site.type === 'wedding_card'
                    ? '💌 10 Themes & Details'
                    : site.type === 'tuition'
                    ? '📚 Batches & Fee Structure'
                    : site.type === 'boutique'
                    ? '👗 Boutique Lookbook'
                    : site.type === 'portfolio'
                    ? '🎨 Portfolio Showcase'
                    : '🛍️ Products Catalog'}
                </button>
                <button
                  onClick={() => setActiveTab('general')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    activeTab === 'general'
                      ? 'bg-zinc-950 text-white shadow-xs'
                      : 'text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  General
                </button>
                <button
                  onClick={() => setActiveTab('branding')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    activeTab === 'branding'
                      ? 'bg-zinc-950 text-white shadow-xs'
                      : 'text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  Logo &amp; Theme
                </button>
                <button
                  onClick={() => setActiveTab('announcement')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    activeTab === 'announcement'
                      ? 'bg-zinc-950 text-white shadow-xs'
                      : 'text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  Announcement
                </button>
                <button
                  onClick={() => setActiveTab('slider')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    activeTab === 'slider'
                      ? 'bg-zinc-950 text-white shadow-xs'
                      : 'text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  Banners
                </button>
                <button
                  onClick={() => setActiveTab('trust_badges')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    activeTab === 'trust_badges'
                      ? 'bg-zinc-950 text-white shadow-xs'
                      : 'text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  Trust Badges
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    activeTab === 'reviews'
                      ? 'bg-zinc-950 text-white shadow-xs'
                      : 'text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  Reviews
                </button>
                <button
                  onClick={() => setActiveTab('faq')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    activeTab === 'faq'
                      ? 'bg-zinc-950 text-white shadow-xs'
                      : 'text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  FAQ
                </button>
                <button
                  onClick={() => setActiveTab('about')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    activeTab === 'about'
                      ? 'bg-zinc-950 text-white shadow-xs'
                      : 'text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  About Story
                </button>
                <button
                  onClick={() => setActiveTab('footer')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    activeTab === 'footer'
                      ? 'bg-zinc-950 text-white shadow-xs'
                      : 'text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  Footer
                </button>
              </>
            )}
          </div>

          {/* Form Content */}
          <div className="p-5 space-y-5 flex-1 overflow-y-auto">
            {/* ─── DEDICATED ATS CV EDITORS ─── */}
            {activeTab === 'cv_format' && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-extrabold text-zinc-950">CV Template Formats (5 ATS Designs)</h3>
                  <p className="text-xs text-zinc-500 mt-0.5">Select your preferred ATS-optimized layout format. All 5 are 100% free lifetime.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    { key: 'classic', title: '1. Classic ATS', badge: '99.8% Pass', desc: 'Single-column reverse chronological. Highest ATS scanner score.' },
                    { key: 'modern', title: '2. Modern Two-Column', badge: 'Split Sidebar', desc: 'Dual-column with sidebar for skills, contact & education. Modern crisp look.' },
                    { key: 'tech', title: '3. Tech & Developer', badge: 'Code & Stack', desc: 'Projects & code showcase, tech stack pills, GitHub emphasis & clean monospace tags.' },
                    { key: 'elegant', title: '4. Editorial & Elegant', badge: 'Executive Serif', desc: 'Classic serif typography, centered masthead, refined dividers for leaders & consultants.' },
                    { key: 'compact', title: '5. Compact 1-Page ATS', badge: '1-Page Guarantee', desc: 'Dense, concise layout engineered to fit exactly on 1 printed page for rapid screening.' },
                  ].map((fmt) => {
                    const isSelected = (site.cvFormat || 'classic') === fmt.key;
                    return (
                      <div
                        key={fmt.key}
                        onClick={() => setPreviewCvFormatModal(fmt.key)}
                        className={`group p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer hover:border-blue-500 hover:shadow-md flex flex-col justify-between ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/20 shadow-xs'
                            : 'border-zinc-200 bg-white'
                        }`}
                      >
                        <div>
                          <div className="font-extrabold text-xs text-zinc-950 flex items-center justify-between mb-1">
                            <span className="flex items-center gap-1.5">{fmt.title}</span>
                            {isSelected ? (
                              <span className="text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full flex items-center gap-0.5">
                                <Check className="w-3 h-3" /> Active
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded-full">
                                {fmt.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-zinc-500 leading-snug">{fmt.desc}</p>
                        </div>

                        <div className="mt-3 pt-2 border-t border-zinc-200/60 flex items-center justify-between text-[11px] font-extrabold text-blue-600">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" />
                            <span>Preview Format Layout</span>
                          </span>
                          <span className="group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-2 border-t border-zinc-200">
                  <h3 className="text-sm font-extrabold text-zinc-950 mb-1">Section Display Toggles</h3>
                  <p className="text-xs text-zinc-500 mb-3.5">Choose which sections are displayed on your live CV and PDF export.</p>

                  <div className="space-y-2.5">
                    {[
                      { key: 'cvShowSummary', label: 'Summary', desc: 'Brief professional overview' },
                      { key: 'cvShowExperience', label: 'Work Experience', desc: 'Roles, companies, and achievements' },
                      { key: 'cvShowEducation', label: 'Education', desc: 'Degrees, institutions, and dates' },
                      { key: 'cvShowSkills', label: 'Skills', desc: 'Core competencies and tools' },
                      { key: 'cvShowProjects', label: 'Projects', desc: 'Featured projects with clickable links' },
                      { key: 'cvShowCertifications', label: 'Certifications', desc: 'Licenses and professional credentials' },
                    ].map((sec) => (
                      <label key={sec.key} className="flex items-center justify-between p-3 bg-zinc-50 rounded-xl border border-zinc-200 cursor-pointer hover:bg-zinc-100 transition-colors">
                        <div>
                          <div className="text-xs font-bold text-zinc-950">{sec.label}</div>
                          <div className="text-[11px] text-zinc-500">{sec.desc}</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={(site as any)[sec.key] !== false}
                          onChange={(e) => updateSiteField(sec.key as any, e.target.checked)}
                          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'cv_profile' && (
              <div className="space-y-4">
                <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-900 flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-bold">Free ATS Resume Profile</p>
                    <p className="text-[11px] text-blue-700 mt-0.5">Fill in your contact details below. All links are automatically clickable in the ATS layout and PDF export.</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-900 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={site.cvTitle || site.name}
                    onChange={(e) => {
                      updateSiteField('cvTitle', e.target.value);
                      updateSiteField('name', e.target.value);
                    }}
                    placeholder="e.g. Yahya Mundewadi"
                    className="w-full px-3.5 py-2 bg-white border border-zinc-300 rounded-xl text-xs font-semibold text-zinc-950 focus:ring-2 focus:ring-zinc-950"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-900 mb-1">
                    Professional Headline / Target Role *
                  </label>
                  <input
                    type="text"
                    value={site.cvHeadline || site.portfolioRoleTitle || ''}
                    onChange={(e) => {
                      updateSiteField('cvHeadline', e.target.value);
                      updateSiteField('portfolioRoleTitle', e.target.value);
                    }}
                    placeholder="e.g. Chief Technology Officer | Full-Stack Architect"
                    className="w-full px-3.5 py-2 bg-white border border-zinc-300 rounded-xl text-xs font-semibold text-zinc-950 focus:ring-2 focus:ring-zinc-950"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-900 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={site.cvLocation || ''}
                      onChange={(e) => updateSiteField('cvLocation', e.target.value)}
                      placeholder="e.g. Mumbai, India"
                      className="w-full px-3.5 py-2 bg-white border border-zinc-300 rounded-xl text-xs font-medium text-zinc-950 focus:ring-2 focus:ring-zinc-950"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-900 mb-1">
                      Email Address (Clickable mailto)
                    </label>
                    <input
                      type="email"
                      value={site.cvEmail || ''}
                      onChange={(e) => updateSiteField('cvEmail', e.target.value)}
                      placeholder="e.g. yahya@example.com"
                      className="w-full px-3.5 py-2 bg-white border border-zinc-300 rounded-xl text-xs font-medium text-zinc-950 focus:ring-2 focus:ring-zinc-950"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-900 mb-1">
                      Phone Number (Clickable tel)
                    </label>
                    <input
                      type="tel"
                      value={site.cvPhone || site.whatsappNumber || ''}
                      onChange={(e) => {
                        updateSiteField('cvPhone', e.target.value);
                        updateSiteField('whatsappNumber', e.target.value.replace(/[^0-9]/g, ''));
                      }}
                      placeholder="e.g. 919307426215"
                      className="w-full px-3.5 py-2 bg-white border border-zinc-300 rounded-xl text-xs font-medium text-zinc-950 focus:ring-2 focus:ring-zinc-950"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-900 mb-1">
                      WhatsApp Direct Chat Number
                    </label>
                    <input
                      type="text"
                      value={site.whatsappNumber}
                      onChange={(e) => updateSiteField('whatsappNumber', e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="919307426215"
                      className="w-full px-3.5 py-2 bg-white border border-zinc-300 rounded-xl text-xs font-medium text-zinc-950 focus:ring-2 focus:ring-zinc-950"
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-extrabold text-zinc-900 uppercase tracking-wider">Social &amp; Professional Links (ATS Verified)</h4>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-zinc-700">
                        LinkedIn Profile URL
                      </label>
                      <label className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-semibold cursor-pointer">
                        <input
                          type="checkbox"
                          checked={site.cvLinkedinClickable !== false}
                          onChange={(e) => updateSiteField('cvLinkedinClickable', e.target.checked)}
                          className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span>Clickable Link</span>
                      </label>
                    </div>
                    <input
                      type="url"
                      value={site.cvLinkedin || ''}
                      onChange={(e) => updateSiteField('cvLinkedin', e.target.value)}
                      placeholder="https://linkedin.com/in/username"
                      className="w-full px-3.5 py-2 bg-white border border-zinc-300 rounded-xl text-xs text-zinc-950 focus:ring-2 focus:ring-zinc-950"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-zinc-700">
                        GitHub Profile URL
                      </label>
                      <label className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-semibold cursor-pointer">
                        <input
                          type="checkbox"
                          checked={site.cvGithubClickable !== false}
                          onChange={(e) => updateSiteField('cvGithubClickable', e.target.checked)}
                          className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span>Clickable Link</span>
                      </label>
                    </div>
                    <input
                      type="url"
                      value={site.cvGithub || ''}
                      onChange={(e) => updateSiteField('cvGithub', e.target.value)}
                      placeholder="https://github.com/username"
                      className="w-full px-3.5 py-2 bg-white border border-zinc-300 rounded-xl text-xs text-zinc-950 focus:ring-2 focus:ring-zinc-950"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-zinc-700">
                        Personal Portfolio / Website
                      </label>
                      <label className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-semibold cursor-pointer">
                        <input
                          type="checkbox"
                          checked={site.cvWebsiteClickable !== false}
                          onChange={(e) => updateSiteField('cvWebsiteClickable', e.target.checked)}
                          className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span>Clickable Link</span>
                      </label>
                    </div>
                    <input
                      type="url"
                      value={site.cvWebsite || ''}
                      onChange={(e) => updateSiteField('cvWebsite', e.target.value)}
                      placeholder="https://mysite.in"
                      className="w-full px-3.5 py-2 bg-white border border-zinc-300 rounded-xl text-xs text-zinc-950 focus:ring-2 focus:ring-zinc-950"
                    />
                  </div>
                </div>

                {/* Subdomain Slug Config */}
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-zinc-900">
                      Subdomain Slug (*.linkal.in)
                    </label>
                    <span className="text-[10px] text-zinc-400 font-mono">RFC 1035</span>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={site.slug}
                      onChange={(e) =>
                        updateSiteField(
                          'slug',
                          e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')
                        )
                      }
                      className={`w-full pl-3.5 pr-10 py-2 bg-white border rounded-xl text-xs font-mono font-bold text-zinc-950 focus:outline-none focus:ring-2 ${
                        subdomainStatus.available === false
                          ? 'border-red-500 focus:ring-red-500'
                          : subdomainStatus.available === true
                          ? 'border-emerald-500 focus:ring-emerald-500'
                          : 'border-zinc-300 focus:ring-zinc-950'
                      }`}
                    />
                    <div className="absolute right-3 top-2.5">
                      {subdomainStatus.checking ? (
                        <div className="w-3.5 h-3.5 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
                      ) : subdomainStatus.available === true ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : subdomainStatus.available === false ? (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      ) : null}
                    </div>
                  </div>
                  {subdomainStatus.available === true && (
                    <p className="text-[11px] font-bold text-emerald-600 mt-1">
                      ✓ https://{site.slug}.linkal.in is available!
                    </p>
                  )}
                  {subdomainStatus.available === false && (
                    <p className="text-[11px] font-bold text-red-600 mt-1">
                      {subdomainStatus.reason || 'This subdomain is already claimed. Try another.'}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* TAB: CV Summary */}
            {activeTab === 'cv_summary' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-zinc-50 border border-zinc-200 rounded-2xl">
                  <div>
                    <span className="text-xs font-bold text-zinc-950 block">Show Summary in CV</span>
                    <span className="text-[11px] text-zinc-500">Toggle whether the summary section appears on your live CV.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={site.cvShowSummary !== false}
                    onChange={(e) => updateSiteField('cvShowSummary', e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                </div>

                <div className="p-3.5 bg-zinc-100 border border-zinc-200 rounded-2xl text-xs text-zinc-700">
                  <span className="font-bold block text-zinc-950 mb-0.5">ATS Tip: Summary</span>
                  Highlight your core strengths, professional background, and accomplishments. Keep it clear and concise (2–4 sentences).
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-900 mb-1.5">
                    Summary
                  </label>
                  <textarea
                    rows={6}
                    value={site.cvSummary || site.portfolioAbout || ''}
                    onChange={(e) => {
                      updateSiteField('cvSummary', e.target.value);
                      updateSiteField('portfolioAbout', e.target.value);
                    }}
                    placeholder="A brief professional summary highlighting key strengths, background, and career accomplishments..."
                    className="w-full px-3.5 py-2.5 bg-white border border-zinc-300 rounded-xl text-xs text-zinc-800 leading-relaxed focus:ring-2 focus:ring-zinc-950 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* TAB: CV Work Experience */}
            {activeTab === 'cv_experience' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-extrabold text-zinc-900 uppercase tracking-wider">Work Experience</h4>
                    <p className="text-[11px] text-zinc-500">Reverse chronological order recommended.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddExperience}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-950 text-white rounded-xl text-xs font-bold hover:bg-black transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Experience</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {(!site.cvExperiences || site.cvExperiences.length === 0) ? (
                    <div className="text-center py-8 bg-zinc-50 rounded-2xl border border-dashed border-zinc-300 p-6">
                      <BriefcaseIcon className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
                      <p className="text-xs font-bold text-zinc-700">No work experiences added yet</p>
                      <p className="text-[11px] text-zinc-500 mt-1">Click "Add Experience" to add your roles, companies, and achievements.</p>
                    </div>
                  ) : (
                    site.cvExperiences.map((exp, idx) => (
                      <div key={exp.id || idx} className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-3 relative group">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-zinc-200 text-zinc-800">
                            Experience #{idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteExperience(idx)}
                            className="text-zinc-400 hover:text-red-600 p-1 transition-colors"
                            title="Remove Experience"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div>
                            <label className="block text-[10px] font-bold text-zinc-600 uppercase mb-1">Job Title / Role *</label>
                            <input
                              type="text"
                              value={exp.role}
                              onChange={(e) => handleUpdateExperience(idx, 'role', e.target.value)}
                              placeholder="e.g. Senior Vice President"
                              className="w-full px-3 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs font-bold text-zinc-950"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-zinc-600 uppercase mb-1">Company Name *</label>
                            <input
                              type="text"
                              value={exp.company}
                              onChange={(e) => handleUpdateExperience(idx, 'company', e.target.value)}
                              placeholder="e.g. Microsoft India"
                              className="w-full px-3 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs font-semibold text-zinc-950"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div>
                            <label className="block text-[10px] font-bold text-zinc-600 uppercase mb-1">Time Period *</label>
                            <input
                              type="text"
                              value={exp.period}
                              onChange={(e) => handleUpdateExperience(idx, 'period', e.target.value)}
                              placeholder="e.g. 2021 — Present"
                              className="w-full px-3 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs font-medium text-zinc-950"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-zinc-600 uppercase mb-1">Location</label>
                            <input
                              type="text"
                              value={exp.location || ''}
                              onChange={(e) => handleUpdateExperience(idx, 'location', e.target.value)}
                              placeholder="e.g. Mumbai, India (Hybrid)"
                              className="w-full px-3 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs font-medium text-zinc-950"
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-[10px] font-bold text-zinc-600 uppercase">Company Website URL</label>
                            <label className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-semibold cursor-pointer">
                              <input
                                type="checkbox"
                                checked={exp.isCompanyUrlClickable !== false}
                                onChange={(e) => handleUpdateExperience(idx, 'isCompanyUrlClickable', e.target.checked as any)}
                                className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500"
                              />
                              <span>Clickable Link</span>
                            </label>
                          </div>
                          <input
                            type="url"
                            value={exp.companyUrl || ''}
                            onChange={(e) => handleUpdateExperience(idx, 'companyUrl', e.target.value)}
                            placeholder="https://company.com"
                            className="w-full px-3 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs text-zinc-800"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-zinc-600 uppercase mb-1">Key Responsibilities &amp; Impact (Bullet Points)</label>
                          <textarea
                            rows={3}
                            value={exp.description}
                            onChange={(e) => handleUpdateExperience(idx, 'description', e.target.value)}
                            placeholder="• Directed cross-functional engineering and design team of 35+ engineers.&#10;• Increased system throughput by 300% and cut cloud compute costs by ₹40 Lakhs/year."
                            className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-xl text-xs text-zinc-800 leading-relaxed focus:ring-2 focus:ring-zinc-950"
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB: CV Education */}
            {activeTab === 'cv_education' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-extrabold text-zinc-900 uppercase tracking-wider">Education &amp; Credentials</h4>
                    <p className="text-[11px] text-zinc-500">List your degrees, universities, and honors.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddEducation}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-950 text-white rounded-xl text-xs font-bold hover:bg-black transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Education</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {(!site.cvEducations || site.cvEducations.length === 0) ? (
                    <div className="text-center py-8 bg-zinc-50 rounded-2xl border border-dashed border-zinc-300 p-6">
                      <GraduationCapIcon className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
                      <p className="text-xs font-bold text-zinc-700">No education entries added yet</p>
                      <p className="text-[11px] text-zinc-500 mt-1">Click "Add Education" to list degrees, colleges, or universities.</p>
                    </div>
                  ) : (
                    site.cvEducations.map((edu, idx) => (
                      <div key={edu.id || idx} className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-3 relative">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-zinc-200 text-zinc-800">
                            Degree #{idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteEducation(idx)}
                            className="text-zinc-400 hover:text-red-600 p-1 transition-colors"
                            title="Remove Education"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div>
                            <label className="block text-[10px] font-bold text-zinc-600 uppercase mb-1">Degree &amp; Major *</label>
                            <input
                              type="text"
                              value={edu.degree}
                              onChange={(e) => handleUpdateEducation(idx, 'degree', e.target.value)}
                              placeholder="e.g. Master of Business Administration (MBA)"
                              className="w-full px-3 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs font-bold text-zinc-950"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-zinc-600 uppercase mb-1">Institution / University *</label>
                            <input
                              type="text"
                              value={edu.institution}
                              onChange={(e) => handleUpdateEducation(idx, 'institution', e.target.value)}
                              placeholder="e.g. Indian Institute of Management (IIM)"
                              className="w-full px-3 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs font-semibold text-zinc-950"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div>
                            <label className="block text-[10px] font-bold text-zinc-600 uppercase mb-1">Graduation Year / Period</label>
                            <input
                              type="text"
                              value={edu.year}
                              onChange={(e) => handleUpdateEducation(idx, 'year', e.target.value)}
                              placeholder="e.g. 2016 — 2018"
                              className="w-full px-3 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs font-medium text-zinc-950"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-zinc-600 uppercase mb-1">Honors / Grade (Optional)</label>
                            <input
                              type="text"
                              value={edu.honors || ''}
                              onChange={(e) => handleUpdateEducation(idx, 'honors', e.target.value)}
                              placeholder="e.g. First Class with Distinction"
                              className="w-full px-3 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs font-medium text-zinc-950"
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB: CV Skills */}
            {activeTab === 'cv_skills' && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-extrabold text-zinc-900 uppercase tracking-wider mb-1">Skills &amp; Specializations</h4>
                  <p className="text-[11px] text-zinc-500">Add keywords, tools, frameworks, and leadership skills. ATS parsers match these directly against job descriptions.</p>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                    placeholder="Type a skill and press Enter (e.g. Strategic Planning)..."
                    className="flex-1 px-3.5 py-2 bg-white border border-zinc-300 rounded-xl text-xs font-medium text-zinc-950 focus:ring-2 focus:ring-zinc-950 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddSkill()}
                    className="px-4 py-2 bg-zinc-950 text-white rounded-xl text-xs font-bold hover:bg-black transition-all"
                  >
                    Add
                  </button>
                </div>

                <div>
                  <span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Quick Add Popular Professional Skills:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'Team Leadership',
                      'P&L Management',
                      'Strategic Planning',
                      'Cloud Architecture',
                      'Next.js & React',
                      'Product Roadmap',
                      'Team Mentorship',
                      'Enterprise Scalability',
                      'DevOps & CI/CD',
                      'Stakeholder Relations',
                    ].map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleAddSkill(tag)}
                        className="px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-[11px] font-semibold rounded-lg transition-colors"
                      >
                        + {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <label className="block text-[11px] font-bold text-zinc-700 mb-2">
                    Active Skills on Resume ({site.cvSkills?.length || 0})
                  </label>
                  <div className="flex flex-wrap gap-2 p-3 bg-zinc-50 border border-zinc-200 rounded-2xl min-h-[60px]">
                    {(!site.cvSkills || site.cvSkills.length === 0) ? (
                      <p className="text-[11px] text-zinc-400 italic">No skills added yet. Use the input above to add skills.</p>
                    ) : (
                      site.cvSkills.map((sk, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-zinc-300 text-zinc-900 rounded-lg text-xs font-bold shadow-xs"
                        >
                          <span>{sk}</span>
                          <button
                            type="button"
                            onClick={() => handleDeleteSkill(idx)}
                            className="text-zinc-400 hover:text-red-600 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: CV Projects */}
            {activeTab === 'cv_projects' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-extrabold text-zinc-900 uppercase tracking-wider">Featured Projects &amp; Deliverables</h4>
                    <p className="text-[11px] text-zinc-500">Every project link is rendered as an interactive clickable link.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddCvProject}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-950 text-white rounded-xl text-xs font-bold hover:bg-black transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Project</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {(!site.cvProjects || site.cvProjects.length === 0) ? (
                    <div className="text-center py-8 bg-zinc-50 rounded-2xl border border-dashed border-zinc-300 p-6">
                      <FolderGitIcon className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
                      <p className="text-xs font-bold text-zinc-700">No projects added yet</p>
                      <p className="text-[11px] text-zinc-500 mt-1">Click "Add Project" to showcase key initiatives, apps, or business cases.</p>
                    </div>
                  ) : (
                    site.cvProjects.map((proj, idx) => (
                      <div key={proj.id || idx} className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-3 relative">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-zinc-200 text-zinc-800">
                            Project #{idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteCvProject(idx)}
                            className="text-zinc-400 hover:text-red-600 p-1 transition-colors"
                            title="Remove Project"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-zinc-600 uppercase mb-1">Project Title *</label>
                          <input
                            type="text"
                            value={proj.title}
                            onChange={(e) => handleUpdateCvProject(idx, 'title', e.target.value)}
                            placeholder="e.g. Enterprise Payment Gateway"
                            className="w-full px-3 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs font-bold text-zinc-950"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="text-[10px] font-bold text-zinc-600 uppercase">Project Link / URL</label>
                              <label className="flex items-center gap-1 text-[10px] text-zinc-500 font-semibold cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={proj.isLinkClickable !== false}
                                  onChange={(e) => handleUpdateCvProject(idx, 'isLinkClickable', e.target.checked as any)}
                                  className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500"
                                />
                                <span>Clickable</span>
                              </label>
                            </div>
                            <input
                              type="url"
                              value={proj.link || ''}
                              onChange={(e) => handleUpdateCvProject(idx, 'link', e.target.value)}
                              placeholder="https://github.com/..."
                              className="w-full px-3 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs font-mono text-zinc-950"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-zinc-600 uppercase mb-1">Tech Stack / Tools</label>
                            <input
                              type="text"
                              value={proj.techStack || ''}
                              onChange={(e) => handleUpdateCvProject(idx, 'techStack', e.target.value)}
                              placeholder="e.g. Next.js, Node.js, AWS"
                              className="w-full px-3 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs text-zinc-800"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-zinc-600 uppercase mb-1">Project Summary / Metrics</label>
                          <textarea
                            rows={2}
                            value={proj.description}
                            onChange={(e) => handleUpdateCvProject(idx, 'description', e.target.value)}
                            placeholder="Engineered high-throughput architecture servicing 50k transactions/sec with 99.99% uptime..."
                            className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-xl text-xs text-zinc-800 leading-relaxed focus:ring-2 focus:ring-zinc-950"
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB: CV Certifications */}
            {activeTab === 'cv_certifications' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-zinc-50 border border-zinc-200 rounded-2xl">
                  <div>
                    <span className="text-xs font-bold text-zinc-950 block">Show Certifications in CV</span>
                    <span className="text-[11px] text-zinc-500">Toggle whether this section appears on your live CV and PDF export.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={site.cvShowCertifications !== false}
                    onChange={(e) => updateSiteField('cvShowCertifications', e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-extrabold text-zinc-900 uppercase tracking-wider">Certifications &amp; Licenses</h4>
                    <p className="text-[11px] text-zinc-500">Professional credentials and verified badges.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddCertification}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-950 text-white rounded-xl text-xs font-bold hover:bg-black transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Certification</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {(!site.cvCertifications || site.cvCertifications.length === 0) ? (
                    <div className="text-center py-8 bg-zinc-50 rounded-2xl border border-dashed border-zinc-300 p-6">
                      <AwardIcon className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
                      <p className="text-xs font-bold text-zinc-700">No certifications added yet</p>
                      <p className="text-[11px] text-zinc-500 mt-1">Click "Add Certification" to list AWS, Google, or professional licenses.</p>
                    </div>
                  ) : (
                    site.cvCertifications.map((cert, idx) => (
                      <div key={cert.id || idx} className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-3 relative">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-zinc-200 text-zinc-800">
                            Certification #{idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteCertification(idx)}
                            className="text-zinc-400 hover:text-red-600 p-1 transition-colors"
                            title="Remove Certification"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div>
                            <label className="block text-[10px] font-bold text-zinc-600 uppercase mb-1">Certification Name *</label>
                            <input
                              type="text"
                              value={cert.name}
                              onChange={(e) => handleUpdateCertification(idx, 'name', e.target.value)}
                              placeholder="e.g. AWS Certified Solutions Architect"
                              className="w-full px-3 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs font-bold text-zinc-950"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-zinc-600 uppercase mb-1">Issuer / Organization *</label>
                            <input
                              type="text"
                              value={cert.issuer}
                              onChange={(e) => handleUpdateCertification(idx, 'issuer', e.target.value)}
                              placeholder="e.g. Amazon Web Services"
                              className="w-full px-3 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs font-semibold text-zinc-950"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div>
                            <label className="block text-[10px] font-bold text-zinc-600 uppercase mb-1">Year / Date</label>
                            <input
                              type="text"
                              value={cert.year || ''}
                              onChange={(e) => handleUpdateCertification(idx, 'year', e.target.value)}
                              placeholder="e.g. 2023"
                              className="w-full px-3 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs font-medium text-zinc-950"
                            />
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="text-[10px] font-bold text-zinc-600 uppercase">Credential URL</label>
                              <label className="flex items-center gap-1 text-[10px] text-zinc-500 font-semibold cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={cert.isUrlClickable !== false}
                                  onChange={(e) => handleUpdateCertification(idx, 'isUrlClickable', e.target.checked as any)}
                                  className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500"
                                />
                                <span>Clickable</span>
                              </label>
                            </div>
                            <input
                              type="url"
                              value={cert.url || ''}
                              onChange={(e) => handleUpdateCertification(idx, 'url', e.target.value)}
                              placeholder="https://aws.amazon.com/verify/..."
                              className="w-full px-3 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs font-mono text-zinc-950"
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB: CV Custom Categories / Sections */}
            {activeTab === 'cv_custom' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-extrabold text-zinc-900 uppercase tracking-wider">Custom Sections &amp; Categories</h4>
                    <p className="text-[11px] text-zinc-500">Add custom sections like Languages, Publications, Patents, or Awards.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddCustomCategory}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-950 text-white rounded-xl text-xs font-bold hover:bg-black transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Custom Section</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {(!site.cvCustomCategories || site.cvCustomCategories.length === 0) ? (
                    <div className="text-center py-8 bg-zinc-50 rounded-2xl border border-dashed border-zinc-300 p-6">
                      <Layers className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
                      <p className="text-xs font-bold text-zinc-700">No custom sections created yet</p>
                      <p className="text-[11px] text-zinc-500 mt-1">Click "Add Custom Section" to create your own category (e.g. Languages, Patents, Honors).</p>
                    </div>
                  ) : (
                    site.cvCustomCategories.map((cat, catIdx) => (
                      <div key={cat.id || catIdx} className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-3">
                        <div className="flex items-center justify-between gap-2 border-b border-zinc-200/80 pb-2.5">
                          <div className="flex-1">
                            <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-0.5">Section Title</label>
                            <input
                              type="text"
                              value={cat.name}
                              onChange={(e) => handleUpdateCustomCategory(catIdx, 'name', e.target.value)}
                              placeholder="e.g. Languages / Publications / Honors"
                              className="w-full px-2.5 py-1 bg-white border border-zinc-300 rounded-lg text-xs font-extrabold text-zinc-950"
                            />
                          </div>
                          <div className="flex items-center gap-2 pt-3">
                            <label className="flex items-center gap-1 text-[10px] text-zinc-600 font-semibold cursor-pointer">
                              <input
                                type="checkbox"
                                checked={cat.visible !== false}
                                onChange={(e) => handleUpdateCustomCategory(catIdx, 'visible', e.target.checked)}
                                className="w-3.5 h-3.5 rounded text-blue-600"
                              />
                              <span>Visible</span>
                            </label>
                            <button
                              type="button"
                              onClick={() => handleDeleteCustomCategory(catIdx)}
                              className="text-zinc-400 hover:text-red-600 p-1 transition-colors"
                              title="Delete Section"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Section Items */}
                        <div className="space-y-2.5 pt-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-zinc-600 uppercase">Items ({cat.items?.length || 0})</span>
                            <button
                              type="button"
                              onClick={() => handleAddCustomCategoryItem(catIdx)}
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Add Item</span>
                            </button>
                          </div>

                          {cat.items?.map((item, itemIdx) => (
                            <div key={item.id || itemIdx} className="p-3 bg-white border border-zinc-200 rounded-xl space-y-2 relative">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-zinc-400">#{itemIdx + 1}</span>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteCustomCategoryItem(catIdx, itemIdx)}
                                  className="text-zinc-300 hover:text-red-600 p-0.5"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <input
                                  type="text"
                                  value={item.title}
                                  onChange={(e) => handleUpdateCustomCategoryItem(catIdx, itemIdx, 'title', e.target.value)}
                                  placeholder="Title (e.g. English, Patent Title)"
                                  className="px-2.5 py-1 bg-zinc-50 border border-zinc-200 rounded text-xs font-bold text-zinc-950"
                                />
                                <input
                                  type="text"
                                  value={item.subtitle || ''}
                                  onChange={(e) => handleUpdateCustomCategoryItem(catIdx, itemIdx, 'subtitle', e.target.value)}
                                  placeholder="Subtitle / Role (e.g. Fluent, USPTO)"
                                  className="px-2.5 py-1 bg-zinc-50 border border-zinc-200 rounded text-xs text-zinc-700"
                                />
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <input
                                  type="text"
                                  value={item.period || ''}
                                  onChange={(e) => handleUpdateCustomCategoryItem(catIdx, itemIdx, 'period', e.target.value)}
                                  placeholder="Year / Period (e.g. 2024)"
                                  className="px-2.5 py-1 bg-zinc-50 border border-zinc-200 rounded text-xs text-zinc-600"
                                />
                                <div className="flex items-center gap-1.5">
                                  <input
                                    type="url"
                                    value={item.link || ''}
                                    onChange={(e) => handleUpdateCustomCategoryItem(catIdx, itemIdx, 'link', e.target.value)}
                                    placeholder="Optional URL..."
                                    className="flex-1 px-2.5 py-1 bg-zinc-50 border border-zinc-200 rounded text-xs text-zinc-600 font-mono"
                                  />
                                  <label className="flex items-center gap-1 text-[9px] text-zinc-500 font-semibold shrink-0 cursor-pointer" title="Make link clickable">
                                    <input
                                      type="checkbox"
                                      checked={item.isLinkClickable !== false}
                                      onChange={(e) => handleUpdateCustomCategoryItem(catIdx, itemIdx, 'isLinkClickable', e.target.checked)}
                                      className="w-3 h-3 text-blue-600 rounded"
                                    />
                                    <span>Link</span>
                                  </label>
                                </div>
                              </div>
                              <input
                                type="text"
                                value={item.description || ''}
                                onChange={(e) => handleUpdateCustomCategoryItem(catIdx, itemIdx, 'description', e.target.value)}
                                placeholder="Short description or notes..."
                                className="w-full px-2.5 py-1 bg-zinc-50 border border-zinc-200 rounded text-xs text-zinc-600"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB: General (For E-Commerce / Store) */}
            {activeTab === 'general' && (
              <div className="space-y-4">
                {/* Website Blueprint Mode Switcher */}
                <div>
                  <label className="block text-xs font-bold text-zinc-900 mb-1.5">
                    Website Blueprint / Template Mode
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { type: 'cv', label: '1. Free CV Website (Free)', icon: '📄' },
                      { type: 'ecommerce', label: '2. E-Commerce Store', icon: '🛍️' },
                      { type: 'boutique', label: '3. Fashion Boutique', icon: '👗' },
                      { type: 'watch_store', label: '4. Luxury Watch', icon: '⌚' },
                      { type: 'restaurant', label: '5. Restaurant Menu (₹99)', icon: '🍽️' },
                      { type: 'wedding_card', label: '6. Wedding Card (Free)', icon: '💌' },
                      { type: 'electronics', label: '7. Electronics & Tech', icon: '📱' },
                      { type: 'portfolio', label: '8. Creative Portfolio', icon: '🎨' },
                      { type: 'bakery', label: '9. Bakery & Cake Shop', icon: '🎂' },
                      { type: 'tuition', label: '10. Tuition Academy', icon: '📚' },
                      { type: 'salon', label: '11. Salon & Spa', icon: '✂️' },
                      { type: 'single_product', label: '12. Single Product', icon: '⚡' },
                    ].map((m) => (
                      <button
                        key={m.type}
                        type="button"
                        onClick={() => {
                          updateSiteField('type', m.type as any);
                          if (m.type === 'cv') setActiveTab('cv_format');
                          else if (['watch_store', 'restaurant', 'wedding_card', 'tuition', 'boutique', 'portfolio'].includes(m.type)) setActiveTab('type_specific');
                        }}
                        className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all flex items-center gap-1.5 min-w-0 ${
                          site.type === m.type
                            ? 'border-blue-600 bg-blue-50 text-blue-900 font-extrabold shadow-xs'
                            : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
                        }`}
                      >
                        <span className="shrink-0">{m.icon}</span>
                        <span className="truncate">{m.label}</span>
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-1">
                    Select your website blueprint. CV and Wedding cards are Lifetime Free, Restaurant digital menu is ₹99/mo, and all other blueprints include a 15-day free trial.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-900 mb-1">
                    Website Name
                  </label>
                  <input
                    type="text"
                    value={site.name}
                    onChange={(e) => updateSiteField('name', e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-zinc-300 rounded-xl text-xs font-semibold text-zinc-950 focus:ring-2 focus:ring-zinc-950"
                  />
                  <p className="text-[10px] text-zinc-500 mt-1">Updates live across headers, titles, and WhatsApp links.</p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-zinc-900">
                      Subdomain Slug (*.linkal.in)
                    </label>
                    <span className="text-[10px] text-zinc-400 font-mono">RFC 1035</span>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={site.slug}
                      onChange={(e) =>
                        updateSiteField(
                          'slug',
                          e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')
                        )
                      }
                      className={`w-full pl-3.5 pr-10 py-2 bg-white border rounded-xl text-xs font-mono font-bold text-zinc-950 focus:outline-none focus:ring-2 ${
                        subdomainStatus.available === false
                          ? 'border-red-500 focus:ring-red-500'
                          : subdomainStatus.available === true
                          ? 'border-emerald-500 focus:ring-emerald-500'
                          : 'border-zinc-300 focus:ring-zinc-950'
                      }`}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {subdomainStatus.checking ? (
                        <RefreshCw className="w-3.5 h-3.5 text-zinc-400 animate-spin" />
                      ) : subdomainStatus.available === true ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : subdomainStatus.available === false ? (
                        <AlertCircle className="w-4 h-4 text-red-600" />
                      ) : null}
                    </div>
                  </div>

                  {/* Instant Inline Feedback */}
                  {subdomainStatus.available === true && !subdomainStatus.checking && (
                    <p className="text-[11px] text-emerald-600 font-semibold mt-1.5 flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-600" />
                      https://{site.slug}.linkal.in is available!
                    </p>
                  )}

                  {subdomainStatus.available === false && !subdomainStatus.checking && (
                    <div className="mt-1.5 space-y-1">
                      <p className="text-[11px] text-red-600 font-semibold flex items-center gap-1">
                        <X className="w-3 h-3 text-red-600" />
                        {subdomainStatus.reason || 'This subdomain is taken or reserved.'}
                      </p>
                      {subdomainStatus.suggestions && subdomainStatus.suggestions.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1 pt-0.5">
                          <span className="text-[10px] text-zinc-500 font-medium">Available:</span>
                          {subdomainStatus.suggestions.slice(0, 3).map((sug) => (
                            <button
                              key={sug}
                              type="button"
                              onClick={() => updateSiteField('slug', sug)}
                              className="text-[10px] bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-mono font-bold px-1.5 py-0.5 rounded border border-zinc-200 transition-colors"
                            >
                              {sug}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <p className="text-[10px] text-zinc-500 font-mono mt-1">Live URL: https://{site.slug}.linkal.in</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-900 mb-1">
                    WhatsApp Orders Phone Number (with Country Code)
                  </label>
                  <div className="relative">
                    <MessageCircle className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={site.whatsappNumber}
                      onChange={(e) => updateSiteField('whatsappNumber', e.target.value)}
                      placeholder="919876543210"
                      className="w-full pl-10 pr-4 py-2 bg-white border border-zinc-300 rounded-xl text-xs font-mono font-bold text-zinc-950 focus:ring-2 focus:ring-zinc-950"
                    />
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-1">All customer &quot;Buy on WhatsApp&quot; buttons open direct chat with this phone.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-900 mb-1">
                    Default WhatsApp Message Pattern
                  </label>
                  <textarea
                    rows={3}
                    value={site.defaultWhatsappMessage || ''}
                    onChange={(e) =>
                      updateSiteField('defaultWhatsappMessage', e.target.value)
                    }
                    placeholder="Hi! I am interested in ordering {item}."
                    className="w-full px-3.5 py-2 bg-white border border-zinc-300 rounded-xl text-xs font-medium text-zinc-950 focus:ring-2 focus:ring-zinc-950"
                  />
                  <p className="text-[10px] text-zinc-500 font-medium mt-1">
                    Use <code className="text-zinc-950 font-bold font-mono">&#123;item&#125;</code> as placeholder for product name.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-900 mb-1">
                    Header WhatsApp CTA Button Label
                  </label>
                  <input
                    type="text"
                    value={site.headerCtaText || ''}
                    onChange={(e) => updateSiteField('headerCtaText', e.target.value)}
                    placeholder="Order on WhatsApp"
                    className="w-full px-3.5 py-2 bg-white border border-zinc-300 rounded-xl text-xs font-medium text-zinc-950 focus:ring-2 focus:ring-zinc-950"
                  />
                  <p className="text-[10px] text-zinc-500 font-medium mt-1">
                    Customizes the top navbar button text (e.g. &quot;Order on WhatsApp&quot;, &quot;Hire Me&quot;, &quot;Shop Now&quot;).
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'branding' && (
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-zinc-900 mb-1.5">
                    Brand Logo
                  </label>
                  
                  <div className="flex items-center gap-3 p-3 border border-zinc-200 rounded-xl bg-zinc-50">
                    {site.logoUrl ? (
                      <img
                        src={site.logoUrl}
                        alt="Logo"
                        className="w-12 h-12 rounded-xl object-cover border border-zinc-300 bg-white"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-zinc-200 text-zinc-600 flex items-center justify-center font-bold text-xs">
                        Logo
                      </div>
                    )}
                    
                    <div className="flex-1 space-y-1.5">
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-950 hover:bg-black text-white text-xs font-bold cursor-pointer transition-all shadow-xs">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Logo File</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, (url) => updateSiteField('logoUrl', url))}
                        />
                      </label>
                      <input
                        type="url"
                        value={site.logoUrl || ''}
                        onChange={(e) => updateSiteField('logoUrl', e.target.value)}
                        placeholder="Or paste image URL..."
                        className="w-full px-2.5 py-1 bg-white border border-zinc-300 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-900 mb-1.5">
                    Theme Color Preset
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {THEME_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => updateSiteField('themeColor', preset.hex)}
                        className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-bold transition-all ${
                          site.themeColor === preset.hex
                            ? 'border-zinc-950 bg-zinc-100 shadow-xs ring-1 ring-zinc-950'
                            : 'border-zinc-200 bg-white hover:border-zinc-300'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-zinc-300"
                          style={{ backgroundColor: preset.hex }}
                        />
                        <span className="truncate text-zinc-950">{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-900 mb-1">
                    Typography Font Family
                  </label>
                  <select
                    value={site.fontFamily || 'Plus Jakarta Sans'}
                    onChange={(e) =>
                      updateSiteField('fontFamily', e.target.value as any)
                    }
                    className="w-full px-3.5 py-2 bg-white border border-zinc-300 rounded-xl text-xs font-bold text-zinc-950 focus:ring-2 focus:ring-zinc-950"
                  >
                    {FONTS.map((font) => (
                      <option key={font} value={font}>
                        {font}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {activeTab === 'slider' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-zinc-900">Hero Banner Slides</h4>
                    <p className="text-[11px] text-zinc-500 font-medium">Upload banner photos or paste URLs.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newSlide: BannerSlide = {
                        id: `slide-${Date.now()}`,
                        imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1600&auto=format&fit=crop&q=80',
                        title: 'New Season Collection',
                        subtitle: 'Premium handcrafted quality delivered to your doorstep.',
                        ctaText: 'Shop via WhatsApp',
                      };
                      updateSiteField('bannerSlider', [...(site.bannerSlider || []), newSlide]);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Slide</span>
                  </button>
                </div>

                {site.bannerSlider?.map((slide, index) => (
                  <div key={slide.id} className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-zinc-950">
                          {index === 0 ? 'Slide #1 (Main Page Hero Banner)' : `Slide #${index + 1}`}
                        </span>
                        {index === 0 && (
                          <span className="px-1.5 py-0.5 rounded bg-zinc-950 text-white font-mono text-[9px] font-bold">
                            STARTING BANNER
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = site.bannerSlider?.filter((s) => s.id !== slide.id);
                          updateSiteField('bannerSlider', updated);
                        }}
                        className="text-red-600 hover:text-red-800 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Banner Image Preview & Upload Button */}
                    <div className="relative aspect-video rounded-lg overflow-hidden border border-zinc-300 bg-zinc-200">
                      <img
                        src={slide.imageUrl}
                        alt="Banner Preview"
                        className="w-full h-full object-cover"
                      />
                      <label className="absolute bottom-2 right-2 inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-zinc-950/80 hover:bg-black text-white text-[10px] font-bold cursor-pointer transition-all shadow-sm">
                        <Upload className="w-3 h-3" />
                        <span>Upload Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleFileUpload(e, (url) => {
                              const updated = [...(site.bannerSlider || [])];
                              updated[index].imageUrl = url;
                              updateSiteField('bannerSlider', updated);
                            })
                          }
                        />
                      </label>
                    </div>

                    <input
                      type="url"
                      value={slide.imageUrl}
                      onChange={(e) => {
                        const updated = [...(site.bannerSlider || [])];
                        updated[index].imageUrl = e.target.value;
                        updateSiteField('bannerSlider', updated);
                      }}
                      placeholder="Or paste banner image URL..."
                      className="w-full px-3 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs font-medium"
                    />

                    <input
                      type="text"
                      value={slide.title}
                      onChange={(e) => {
                        const updated = [...(site.bannerSlider || [])];
                        updated[index].title = e.target.value;
                        updateSiteField('bannerSlider', updated);
                      }}
                      placeholder="Slide Title..."
                      className="w-full px-3 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs font-bold text-zinc-950"
                    />

                    <input
                      type="text"
                      value={slide.subtitle}
                      onChange={(e) => {
                        const updated = [...(site.bannerSlider || [])];
                        updated[index].subtitle = e.target.value;
                        updateSiteField('bannerSlider', updated);
                      }}
                      placeholder="Slide Subtitle / Description..."
                      className="w-full px-3 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs text-zinc-700 font-medium"
                    />
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'type_specific' && (
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                  Products &amp; Catalog
                </h4>
                <p className="text-xs text-zinc-500 font-medium">
                  Upload images, set prices and names. Live preview reflects edits immediately.
                </p>

                {/* 3. Luxury Watch Business Catalog (3rd Position) */}
                {site.type === 'watch_store' && (
                  <div className="space-y-4">
                    <div className="p-3 bg-zinc-900 text-zinc-100 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 font-bold text-sm">⌚</span>
                        <div>
                          <p className="text-xs font-bold text-white">Watch Business &amp; Horology</p>
                          <p className="text-[10px] text-zinc-400">Positioned in #3. Add dial photos, specs, prices, and 1-tap WhatsApp orders.</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const newWatch: WatchItem = {
                            id: `watch-${Date.now()}`,
                            brand: 'Chronos',
                            model: 'Diver Pro 300M',
                            price: '7,999',
                            mrp: '12,999',
                            dialColor: 'Sunburst Black',
                            caseDiameter: '41mm',
                            movement: 'Automatic Mechanical',
                            waterResistance: '200m / 20 ATM',
                            strapMaterial: 'Stainless Steel',
                            imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
                            badge: 'Best Seller',
                            inStock: true,
                          };
                          updateSiteField('watchItems', [...(site.watchItems || []), newWatch]);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-zinc-950 rounded-xl text-xs font-extrabold transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Watch</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {(!site.watchItems || site.watchItems.length === 0) ? (
                        <div className="p-6 text-center bg-zinc-50 border border-dashed border-zinc-300 rounded-2xl">
                          <p className="text-xs font-bold text-zinc-700">No timepieces added yet</p>
                          <p className="text-[10px] text-zinc-500 mt-1">Click "Add Watch" to add timepieces with dial photos and horology specs.</p>
                        </div>
                      ) : (
                        site.watchItems.map((watch, index) => (
                          <div key={watch.id || index} className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-extrabold text-zinc-950">
                                {watch.brand || 'Watch'} {watch.model || ''}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = site.watchItems?.filter((_, i) => i !== index);
                                  updateSiteField('watchItems', updated);
                                }}
                                className="text-zinc-400 hover:text-red-600 p-1 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Watch Dial Photo Upload */}
                            <div className="flex items-center gap-3">
                              <img
                                src={watch.imageUrl}
                                alt="Watch Dial"
                                className="w-14 h-14 rounded-xl object-cover border border-zinc-300 bg-white shrink-0"
                              />
                              <div className="flex-1 space-y-1">
                                <label className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-zinc-950 hover:bg-black text-white text-[10px] font-bold cursor-pointer transition-all">
                                  <Upload className="w-3 h-3" />
                                  <span>Upload Watch Photo (WebP)</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) =>
                                      handleFileUpload(e, (url) => {
                                        const updated = [...(site.watchItems || [])];
                                        updated[index].imageUrl = url;
                                        updateSiteField('watchItems', updated);
                                      })
                                    }
                                  />
                                </label>
                                <input
                                  type="url"
                                  value={watch.imageUrl}
                                  onChange={(e) => {
                                    const updated = [...(site.watchItems || [])];
                                    updated[index].imageUrl = e.target.value;
                                    updateSiteField('watchItems', updated);
                                  }}
                                  placeholder="Or paste image URL..."
                                  className="w-full px-2 py-1 bg-white border border-zinc-300 rounded text-[11px]"
                                />
                              </div>
                            </div>

                            {/* Brand & Model */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-0.5">Brand</label>
                                <input
                                  type="text"
                                  value={watch.brand}
                                  onChange={(e) => {
                                    const updated = [...(site.watchItems || [])];
                                    updated[index].brand = e.target.value;
                                    updateSiteField('watchItems', updated);
                                  }}
                                  placeholder="e.g. Rolex / Seiko / Casio"
                                  className="w-full px-2.5 py-1 bg-white border border-zinc-300 rounded text-xs font-bold text-zinc-950"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-0.5">Model</label>
                                <input
                                  type="text"
                                  value={watch.model}
                                  onChange={(e) => {
                                    const updated = [...(site.watchItems || [])];
                                    updated[index].model = e.target.value;
                                    updateSiteField('watchItems', updated);
                                  }}
                                  placeholder="e.g. Submariner 41mm"
                                  className="w-full px-2.5 py-1 bg-white border border-zinc-300 rounded text-xs font-semibold text-zinc-950"
                                />
                              </div>
                            </div>

                            {/* Price & MRP */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-0.5">Selling Price (₹)</label>
                                <input
                                  type="text"
                                  value={watch.price}
                                  onChange={(e) => {
                                    const updated = [...(site.watchItems || [])];
                                    updated[index].price = e.target.value;
                                    updateSiteField('watchItems', updated);
                                  }}
                                  placeholder="e.g. 7,999"
                                  className="w-full px-2.5 py-1 bg-white border border-zinc-300 rounded text-xs font-bold text-emerald-700"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-0.5">MRP / Strikethrough (₹)</label>
                                <input
                                  type="text"
                                  value={watch.mrp || ''}
                                  onChange={(e) => {
                                    const updated = [...(site.watchItems || [])];
                                    updated[index].mrp = e.target.value;
                                    updateSiteField('watchItems', updated);
                                  }}
                                  placeholder="e.g. 14,999"
                                  className="w-full px-2.5 py-1 bg-white border border-zinc-300 rounded text-xs text-zinc-500"
                                />
                              </div>
                            </div>

                            {/* Horology Specs */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                              <div>
                                <label className="block text-[9px] font-bold text-zinc-500 uppercase">Movement</label>
                                <input
                                  type="text"
                                  value={watch.movement || ''}
                                  onChange={(e) => {
                                    const updated = [...(site.watchItems || [])];
                                    updated[index].movement = e.target.value;
                                    updateSiteField('watchItems', updated);
                                  }}
                                  placeholder="Automatic"
                                  className="w-full px-2 py-1 bg-white border border-zinc-300 rounded text-[11px]"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] font-bold text-zinc-500 uppercase">Case Size</label>
                                <input
                                  type="text"
                                  value={watch.caseDiameter || ''}
                                  onChange={(e) => {
                                    const updated = [...(site.watchItems || [])];
                                    updated[index].caseDiameter = e.target.value;
                                    updateSiteField('watchItems', updated);
                                  }}
                                  placeholder="41mm"
                                  className="w-full px-2 py-1 bg-white border border-zinc-300 rounded text-[11px]"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] font-bold text-zinc-500 uppercase">Dial Color</label>
                                <input
                                  type="text"
                                  value={watch.dialColor || ''}
                                  onChange={(e) => {
                                    const updated = [...(site.watchItems || [])];
                                    updated[index].dialColor = e.target.value;
                                    updateSiteField('watchItems', updated);
                                  }}
                                  placeholder="Sunburst Navy"
                                  className="w-full px-2 py-1 bg-white border border-zinc-300 rounded text-[11px]"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] font-bold text-zinc-500 uppercase">Water Resist</label>
                                <input
                                  type="text"
                                  value={watch.waterResistance || ''}
                                  onChange={(e) => {
                                    const updated = [...(site.watchItems || [])];
                                    updated[index].waterResistance = e.target.value;
                                    updateSiteField('watchItems', updated);
                                  }}
                                  placeholder="100m / 10 ATM"
                                  className="w-full px-2 py-1 bg-white border border-zinc-300 rounded text-[11px]"
                                />
                              </div>
                            </div>

                            {/* Badge & In Stock */}
                            <div className="flex items-center justify-between pt-1 border-t border-zinc-200">
                              <input
                                type="text"
                                value={watch.badge || ''}
                                onChange={(e) => {
                                  const updated = [...(site.watchItems || [])];
                                  updated[index].badge = e.target.value;
                                  updateSiteField('watchItems', updated);
                                }}
                                placeholder="Badge (e.g. Best Seller, Limited Edition)"
                                className="w-48 px-2 py-0.5 bg-white border border-zinc-300 rounded text-[10px]"
                              />
                              <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={watch.inStock !== false}
                                  onChange={(e) => {
                                    const updated = [...(site.watchItems || [])];
                                    updated[index].inStock = e.target.checked;
                                    updateSiteField('watchItems', updated);
                                  }}
                                  className="w-3.5 h-3.5 text-emerald-600 rounded"
                                />
                                <span>In Stock</span>
                              </label>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* 5. Restaurant & Cafe Digital Menu */}
                {site.type === 'restaurant' && (
                  <div className="space-y-4">
                    {/* Entrance Loading Overlay Toggle */}
                    <div className="p-3.5 bg-orange-50 border border-orange-200 rounded-2xl flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-orange-950 block">Signature Entrance Loading Bar</span>
                        <span className="text-[11px] text-orange-700">Display luxury 0%–100% progress bar animation with restaurant logo pulse on site load.</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={site.restaurantLoadingAnimation !== false}
                        onChange={(e) => updateSiteField('restaurantLoadingAnimation', e.target.checked)}
                        className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-900 uppercase">
                        Menu Dishes ({site.restaurantMenu?.length || 0})
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const newDish: RestaurantMenuItem = {
                            id: `dish-${Date.now()}`,
                            name: 'Signature Chicken Dum Biryani',
                            category: 'Biryani & Rice',
                            price: '280',
                            description: 'Aromatic basmati rice layered with spiced tender chicken and saffron.',
                            imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
                            isVeg: false,
                            badge: 'Chef Special',
                          };
                          updateSiteField('restaurantMenu', [...(site.restaurantMenu || []), newDish]);
                        }}
                        className="inline-flex items-center gap-1 text-xs font-bold text-orange-700 hover:text-orange-800"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Dish</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {site.restaurantMenu?.map((dish, index) => (
                        <div key={dish.id || index} className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {/* Veg/Non-Veg Dot Badge Indicator */}
                              <span
                                className={`w-3.5 h-3.5 rounded border flex items-center justify-center p-0.5 ${
                                  dish.isVeg ? 'border-emerald-600 bg-emerald-50' : 'border-red-600 bg-red-50'
                                }`}
                                title={dish.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${dish.isVeg ? 'bg-emerald-600' : 'bg-red-600'}`} />
                              </span>
                              <span className="text-xs font-bold text-zinc-950">{dish.name}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = site.restaurantMenu?.filter((_, i) => i !== index);
                                updateSiteField('restaurantMenu', updated);
                              }}
                              className="text-red-600 hover:text-red-800 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Dish Photo Upload */}
                          {dish.imageUrl && (
                            <div className="flex items-center gap-3">
                              <img src={dish.imageUrl} alt={dish.name} className="w-12 h-12 rounded-lg object-cover border" />
                              <div className="flex-1 space-y-1">
                                <label className="inline-flex items-center gap-1 px-2 py-0.5 bg-zinc-950 text-white rounded text-[10px] font-bold cursor-pointer">
                                  <Upload className="w-3 h-3" />
                                  <span>Change Photo (WebP)</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) =>
                                      handleFileUpload(e, (url) => {
                                        const updated = [...(site.restaurantMenu || [])];
                                        updated[index].imageUrl = url;
                                        updateSiteField('restaurantMenu', updated);
                                      })
                                    }
                                  />
                                </label>
                                <input
                                  type="url"
                                  value={dish.imageUrl}
                                  onChange={(e) => {
                                    const updated = [...(site.restaurantMenu || [])];
                                    updated[index].imageUrl = e.target.value;
                                    updateSiteField('restaurantMenu', updated);
                                  }}
                                  placeholder="Image URL..."
                                  className="w-full px-2 py-0.5 bg-white border border-zinc-300 rounded text-[10px]"
                                />
                              </div>
                            </div>
                          )}

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <input
                              type="text"
                              value={dish.name}
                              onChange={(e) => {
                                const updated = [...(site.restaurantMenu || [])];
                                updated[index].name = e.target.value;
                                updateSiteField('restaurantMenu', updated);
                              }}
                              placeholder="Dish Name"
                              className="w-full px-2.5 py-1 bg-white border border-zinc-300 rounded text-xs font-bold"
                            />
                            <input
                              type="text"
                              value={dish.category}
                              onChange={(e) => {
                                const updated = [...(site.restaurantMenu || [])];
                                updated[index].category = e.target.value;
                                updateSiteField('restaurantMenu', updated);
                              }}
                              placeholder="Category (e.g. Starters, Biryani)"
                              className="w-full px-2.5 py-1 bg-white border border-zinc-300 rounded text-xs"
                            />
                            <input
                              type="text"
                              value={dish.price}
                              onChange={(e) => {
                                const updated = [...(site.restaurantMenu || [])];
                                updated[index].price = e.target.value;
                                updateSiteField('restaurantMenu', updated);
                              }}
                              placeholder="Price (₹)"
                              className="w-full px-2.5 py-1 bg-white border border-zinc-300 rounded text-xs font-bold text-emerald-700"
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={dish.isVeg === true}
                                onChange={(e) => {
                                  const updated = [...(site.restaurantMenu || [])];
                                  updated[index].isVeg = e.target.checked;
                                  updateSiteField('restaurantMenu', updated);
                                }}
                                className="w-3.5 h-3.5 text-emerald-600 rounded"
                              />
                              <span>Pure Veg (Green Dot)</span>
                            </label>
                            <input
                              type="text"
                              value={dish.badge || ''}
                              onChange={(e) => {
                                const updated = [...(site.restaurantMenu || [])];
                                updated[index].badge = e.target.value;
                                updateSiteField('restaurantMenu', updated);
                              }}
                              placeholder="Badge (e.g. Chef Special)"
                              className="w-36 px-2 py-0.5 bg-white border border-zinc-300 rounded text-[10px]"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 6. Wedding Card Invitation (10 Themes) */}
                {site.type === 'wedding_card' && (
                  <div className="space-y-4">
                    {/* 10 Luxury Color Themes Palette */}
                    <div>
                      <label className="block text-xs font-bold text-zinc-900 mb-1.5 uppercase">
                        Select Luxury Theme (10 Designer Color Themes)
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        {[
                          { id: '1', name: 'Maroon & Gold', primary: '#7F1D1D', secondary: '#F59E0B' },
                          { id: '2', name: 'Emerald & Champagne', primary: '#064E3B', secondary: '#D97706' },
                          { id: '3', name: 'Navy & Rose Gold', primary: '#0F172A', secondary: '#F43F5E' },
                          { id: '4', name: 'Royal Purple', primary: '#581C87', secondary: '#E2E8F0' },
                          { id: '5', name: 'Ruby & Ivory', primary: '#881337', secondary: '#FEF3C7' },
                          { id: '6', name: 'Sapphire Gold', primary: '#1E3A8A', secondary: '#FBBF24' },
                          { id: '7', name: 'Sunset Terracotta', primary: '#9A3412', secondary: '#F97316' },
                          { id: '8', name: 'Forest Jade', primary: '#14532D', secondary: '#F0FDF4' },
                          { id: '9', name: 'Black Tie Gold', primary: '#09090B', secondary: '#EAB308' },
                          { id: '10', name: 'Rose Blush', primary: '#831843', secondary: '#FBCFE8' },
                        ].map((thm) => (
                          <button
                            key={thm.id}
                            type="button"
                            onClick={() => {
                              updateSiteField('weddingCard', {
                                ...(site.weddingCard || {
                                  themeId: '1',
                                  groomName: '',
                                  brideName: '',
                                  weddingDate: '',
                                  venueName: '',
                                  venueAddress: '',
                                  rsvpPhone: site.whatsappNumber,
                                  events: []
                                }),
                                themeId: thm.id,
                              });
                            }}
                            className={`p-2 rounded-xl border text-left transition-all ${
                              (site.weddingCard?.themeId || '1') === thm.id
                                ? 'border-blue-600 ring-2 ring-blue-600/30 bg-blue-50/50'
                                : 'border-zinc-200 bg-white hover:border-zinc-300'
                            }`}
                          >
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: thm.primary }} />
                              <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: thm.secondary }} />
                            </div>
                            <span className="text-[10px] font-bold text-zinc-950 block truncate">{thm.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Couple & Parents */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-600 uppercase mb-1">Groom's Name</label>
                        <input
                          type="text"
                          value={site.weddingCard?.groomName || ''}
                          onChange={(e) => updateSiteField('weddingCard', { ...(site.weddingCard as any), groomName: e.target.value })}
                          placeholder="e.g. Aarav Sharma"
                          className="w-full px-2.5 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-600 uppercase mb-1">Bride's Name</label>
                        <input
                          type="text"
                          value={site.weddingCard?.brideName || ''}
                          onChange={(e) => updateSiteField('weddingCard', { ...(site.weddingCard as any), brideName: e.target.value })}
                          placeholder="e.g. Ananya Verma"
                          className="w-full px-2.5 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs font-bold"
                        />
                      </div>
                    </div>

                    {/* Date & RSVP */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-600 uppercase mb-1">Wedding Date</label>
                        <input
                          type="date"
                          value={site.weddingCard?.weddingDate || ''}
                          onChange={(e) => updateSiteField('weddingCard', { ...(site.weddingCard as any), weddingDate: e.target.value })}
                          className="w-full px-2.5 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-600 uppercase mb-1">RSVP WhatsApp Phone</label>
                        <input
                          type="text"
                          value={site.weddingCard?.rsvpPhone || site.whatsappNumber}
                          onChange={(e) => updateSiteField('weddingCard', { ...(site.weddingCard as any), rsvpPhone: e.target.value })}
                          placeholder="919307426215"
                          className="w-full px-2.5 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs"
                        />
                      </div>
                    </div>

                    {/* Venue & Google Maps */}
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-600 uppercase mb-1">Venue &amp; Google Maps Link</label>
                      <input
                        type="text"
                        value={site.weddingCard?.venueName || ''}
                        onChange={(e) => updateSiteField('weddingCard', { ...(site.weddingCard as any), venueName: e.target.value })}
                        placeholder="Venue Name (e.g. The Grand Palace)"
                        className="w-full px-2.5 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs font-bold mb-1"
                      />
                      <input
                        type="text"
                        value={site.weddingCard?.venueAddress || ''}
                        onChange={(e) => updateSiteField('weddingCard', { ...(site.weddingCard as any), venueAddress: e.target.value })}
                        placeholder="Full Street Address"
                        className="w-full px-2.5 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs mb-1"
                      />
                      <input
                        type="url"
                        value={site.weddingCard?.venueMapUrl || ''}
                        onChange={(e) => updateSiteField('weddingCard', { ...(site.weddingCard as any), venueMapUrl: e.target.value })}
                        placeholder="Google Maps Link (e.g. https://maps.google.com/?q=...)"
                        className="w-full px-2.5 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs font-mono"
                      />
                    </div>
                  </div>
                )}

                {/* 7. Tuition & Coaching Academy */}
                {site.type === 'tuition' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-zinc-900 mb-1">Academy Name &amp; Standards</label>
                      <input
                        type="text"
                        value={site.tuition?.academyName || site.name}
                        onChange={(e) => updateSiteField('tuition', { ...(site.tuition as any), academyName: e.target.value })}
                        placeholder="Academy / Coaching Classes Name"
                        className="w-full px-3 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs font-bold mb-1.5"
                      />
                      <input
                        type="text"
                        value={site.tuition?.standardsCovered || ''}
                        onChange={(e) => updateSiteField('tuition', { ...(site.tuition as any), standardsCovered: e.target.value })}
                        placeholder="e.g. Class 8th to 12th • CBSE / State Board • NEET &amp; JEE"
                        className="w-full px-3 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs text-zinc-700"
                      />
                    </div>

                    {/* Batches & Fee Structure */}
                    <div className="space-y-2 pt-2 border-t border-zinc-200">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-zinc-900">Batches &amp; Fee Matrix</span>
                        <button
                          type="button"
                          onClick={() => {
                            const newBatch = {
                              id: `batch-${Date.now()}`,
                              className: 'Class 10th Board Mastery',
                              subjects: 'Maths, Science & English',
                              timing: 'Mon - Fri: 5:00 PM - 7:00 PM',
                              monthlyFee: '2,500',
                              annualFee: '26,000',
                            };
                            updateSiteField('tuition', {
                              ...(site.tuition || { academyName: site.name, admissionHelpline: site.whatsappNumber, batches: [] }),
                              batches: [...(site.tuition?.batches || []), newBatch],
                            });
                          }}
                          className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Batch</span>
                        </button>
                      </div>

                      {site.tuition?.batches?.map((b, bIdx) => (
                        <div key={b.id || bIdx} className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-zinc-950">{b.className}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = site.tuition?.batches?.filter((_, i) => i !== bIdx);
                                updateSiteField('tuition', { ...(site.tuition as any), batches: updated || [] });
                              }}
                              className="text-red-500 hover:text-red-700 p-0.5"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={b.className}
                              onChange={(e) => {
                                const updated = [...(site.tuition?.batches || [])];
                                updated[bIdx].className = e.target.value;
                                updateSiteField('tuition', { ...(site.tuition as any), batches: updated });
                              }}
                              placeholder="Batch Name (e.g. Class 10th)"
                              className="px-2 py-1 bg-white border border-zinc-300 rounded text-xs font-bold"
                            />
                            <input
                              type="text"
                              value={b.timing}
                              onChange={(e) => {
                                const updated = [...(site.tuition?.batches || [])];
                                updated[bIdx].timing = e.target.value;
                                updateSiteField('tuition', { ...(site.tuition as any), batches: updated });
                              }}
                              placeholder="Timings (e.g. 5:00 PM - 7:00 PM)"
                              className="px-2 py-1 bg-white border border-zinc-300 rounded text-xs"
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={b.monthlyFee}
                              onChange={(e) => {
                                const updated = [...(site.tuition?.batches || [])];
                                updated[bIdx].monthlyFee = e.target.value;
                                updateSiteField('tuition', { ...(site.tuition as any), batches: updated });
                              }}
                              placeholder="Monthly Fee (₹)"
                              className="px-2 py-1 bg-white border border-zinc-300 rounded text-xs font-bold text-emerald-700"
                            />
                            <input
                              type="text"
                              value={b.annualFee || ''}
                              onChange={(e) => {
                                const updated = [...(site.tuition?.batches || [])];
                                updated[bIdx].annualFee = e.target.value;
                                updateSiteField('tuition', { ...(site.tuition as any), batches: updated });
                              }}
                              placeholder="Annual Fee (₹)"
                              className="px-2 py-1 bg-white border border-zinc-300 rounded text-xs"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. Fashion & Boutique */}
                {site.type === 'boutique' && (
                  <div className="space-y-4">
                    <div className="p-3 bg-pink-50 border border-pink-200 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 rounded-lg bg-pink-100 text-pink-700 text-sm">👗</span>
                        <div>
                          <p className="text-xs font-bold text-pink-950">Boutique &amp; Ethnic Wear Lookbook</p>
                          <p className="text-[10px] text-pink-700">Display sarees, kurtis, lehengas with fabric details and S-XXL sizes.</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const newBoutiqueItem: ProductItem = {
                            id: `btq-${Date.now()}`,
                            name: 'Handcrafted Silk Saree',
                            price: '3,499',
                            currency: '₹',
                            description: 'Pure handcrafted silk with antique zari border. Available in S, M, L, XL.',
                            imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
                            badge: 'Bridal Pick',
                            inStock: true,
                          };
                          updateSiteField('boutiqueLookbook', [...(site.boutiqueLookbook || []), newBoutiqueItem]);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-bold"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Look</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {site.boutiqueLookbook?.map((item, index) => (
                        <div key={item.id || index} className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-zinc-950">{item.name}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = site.boutiqueLookbook?.filter((_, i) => i !== index);
                                updateSiteField('boutiqueLookbook', updated);
                              }}
                              className="text-red-500 hover:text-red-700 p-0.5"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={item.name}
                              onChange={(e) => {
                                const updated = [...(site.boutiqueLookbook || [])];
                                updated[index].name = e.target.value;
                                updateSiteField('boutiqueLookbook', updated);
                              }}
                              placeholder="Outfit Name"
                              className="px-2.5 py-1 bg-white border border-zinc-300 rounded text-xs font-bold"
                            />
                            <input
                              type="text"
                              value={item.price}
                              onChange={(e) => {
                                const updated = [...(site.boutiqueLookbook || [])];
                                updated[index].price = e.target.value;
                                updateSiteField('boutiqueLookbook', updated);
                              }}
                              placeholder="Price (₹)"
                              className="px-2.5 py-1 bg-white border border-zinc-300 rounded text-xs font-bold text-emerald-700"
                            />
                          </div>
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => {
                              const updated = [...(site.boutiqueLookbook || [])];
                              updated[index].description = e.target.value;
                              updateSiteField('boutiqueLookbook', updated);
                            }}
                            placeholder="Fabric details, embroidery &amp; sizes (e.g. Pure Georgette • S, M, L, XL)"
                            className="w-full px-2.5 py-1 bg-white border border-zinc-300 rounded text-xs text-zinc-700"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* General E-Commerce / Bakery / Salon / Electronics */}
                {['ecommerce', 'bakery', 'salon', 'electronics'].includes(site.type) && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-900">
                        Products ({site.products?.length || 0})
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const newProd: ProductItem = {
                            id: `prod-${Date.now()}`,
                            name: 'New Product Item',
                            price: '1,999',
                            currency: '₹',
                            description: 'High quality product material with fast express shipping.',
                            imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80',
                            badge: 'New',
                            inStock: true,
                          };
                          updateSiteField('products', [...(site.products || []), newProd]);
                        }}
                        className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Product</span>
                      </button>
                    </div>

                    {site.products?.map((prod, index) => (
                      <div
                        key={prod.id}
                        className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-zinc-950">{prod.name}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = site.products?.filter((p) => p.id !== prod.id);
                              updateSiteField('products', updated);
                            }}
                            className="text-red-600 hover:text-red-800 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Product Image & Upload Button */}
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.imageUrl}
                            alt={prod.name}
                            className="w-16 h-16 rounded-xl object-cover border border-zinc-300 bg-white shrink-0"
                          />
                          <div className="flex-1 space-y-1.5">
                            <label className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-zinc-950 hover:bg-black text-white text-[10px] font-bold cursor-pointer transition-all">
                              <Upload className="w-3 h-3" />
                              <span>Upload Product Photo</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) =>
                                  handleFileUpload(e, (url) => {
                                    const updated = [...(site.products || [])];
                                    updated[index].imageUrl = url;
                                    updateSiteField('products', updated);
                                  })
                                }
                              />
                            </label>
                            <input
                              type="url"
                              value={prod.imageUrl}
                              onChange={(e) => {
                                const updated = [...(site.products || [])];
                                updated[index].imageUrl = e.target.value;
                                updateSiteField('products', updated);
                              }}
                              placeholder="Or image URL..."
                              className="w-full px-2 py-1 bg-white border border-zinc-300 rounded text-[11px]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={prod.name}
                            onChange={(e) => {
                              const updated = [...(site.products || [])];
                              updated[index].name = e.target.value;
                              updateSiteField('products', updated);
                            }}
                            placeholder="Name..."
                            className="w-full px-2.5 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs font-bold text-zinc-950"
                          />
                          <input
                            type="text"
                            value={prod.price}
                            onChange={(e) => {
                              const updated = [...(site.products || [])];
                              updated[index].price = e.target.value;
                              updateSiteField('products', updated);
                            }}
                            placeholder="Price (e.g. 2,999)..."
                            className="w-full px-2.5 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs font-bold text-zinc-950"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={prod.badge || ''}
                            onChange={(e) => {
                              const updated = [...(site.products || [])];
                              updated[index].badge = e.target.value;
                              updateSiteField('products', updated);
                            }}
                            placeholder="Badge (e.g. Best Seller)..."
                            className="w-full px-2.5 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs text-zinc-700"
                          />
                          <input
                            type="text"
                            value={prod.description || ''}
                            onChange={(e) => {
                              const updated = [...(site.products || [])];
                              updated[index].description = e.target.value;
                              updateSiteField('products', updated);
                            }}
                            placeholder="Description..."
                            className="w-full px-2.5 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs text-zinc-700"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {site.type === 'single_product' && site.singleProduct && (
                  <div className="space-y-3">
                    {/* Single Product Photo Upload */}
                    <div>
                      <label className="block text-xs font-bold text-zinc-900 mb-1">
                        Product Photo
                      </label>
                      <div className="flex items-center gap-3 p-3 bg-zinc-50 border border-zinc-200 rounded-xl">
                        <img
                          src={site.singleProduct.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'}
                          alt={site.singleProduct.productName}
                          className="w-16 h-16 rounded-xl object-cover border border-zinc-300 bg-white shrink-0"
                        />
                        <div className="flex-1 space-y-1.5">
                          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-950 hover:bg-black text-white text-xs font-bold cursor-pointer transition-all shadow-xs">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload Product Photo</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) =>
                                handleFileUpload(e, (url) => {
                                  updateSiteField('singleProduct', {
                                    ...site.singleProduct!,
                                    images: [url, ...(site.singleProduct?.images?.slice(1) || [])],
                                  });
                                })
                              }
                            />
                          </label>
                          <input
                            type="url"
                            value={site.singleProduct.images?.[0] || ''}
                            onChange={(e) => {
                              updateSiteField('singleProduct', {
                                ...site.singleProduct!,
                                images: [e.target.value, ...(site.singleProduct?.images?.slice(1) || [])],
                              });
                            }}
                            placeholder="Or paste image URL..."
                            className="w-full px-2.5 py-1 bg-white border border-zinc-300 rounded-lg text-xs"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-900 mb-1">Product Title</label>
                      <input
                        type="text"
                        value={site.singleProduct.productName}
                        onChange={(e) => {
                          updateSiteField('singleProduct', {
                            ...site.singleProduct!,
                            productName: e.target.value,
                          });
                        }}
                        className="w-full px-3 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs font-bold text-zinc-950"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-bold text-zinc-900 mb-1">Regular Price</label>
                        <input
                          type="text"
                          value={site.singleProduct.regularPrice}
                          onChange={(e) => {
                            updateSiteField('singleProduct', {
                              ...site.singleProduct!,
                              regularPrice: e.target.value,
                            });
                          }}
                          className="w-full px-3 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs font-bold text-zinc-950"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-zinc-900 mb-1">Sale Price</label>
                        <input
                          type="text"
                          value={site.singleProduct.salePrice}
                          onChange={(e) => {
                            updateSiteField('singleProduct', {
                              ...site.singleProduct!,
                              salePrice: e.target.value,
                            });
                          }}
                          className="w-full px-3 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs font-bold text-emerald-700"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-900 mb-1">Tagline</label>
                      <input
                        type="text"
                        value={site.singleProduct.tagline || ''}
                        onChange={(e) => {
                          updateSiteField('singleProduct', {
                            ...site.singleProduct!,
                            tagline: e.target.value,
                          });
                        }}
                        placeholder="e.g. Immersive Spatial Audio with Active Noise Cancellation"
                        className="w-full px-3 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs text-zinc-800"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-900 mb-1">Description</label>
                      <textarea
                        rows={3}
                        value={site.singleProduct.description || ''}
                        onChange={(e) => {
                          updateSiteField('singleProduct', {
                            ...site.singleProduct!,
                            description: e.target.value,
                          });
                        }}
                        placeholder="Detailed product specifications and highlights..."
                        className="w-full px-3 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs text-zinc-800"
                      />
                    </div>
                  </div>
                )}

                {site.type === 'portfolio' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-zinc-900 mb-1">Role / Headline Title</label>
                      <input
                        type="text"
                        value={site.portfolioRoleTitle || ''}
                        onChange={(e) => updateSiteField('portfolioRoleTitle', e.target.value)}
                        placeholder="e.g. Senior Creative Director & Product Designer"
                        className="w-full px-3 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs font-bold text-zinc-950"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-900 mb-1">Profile Avatar Photo</label>
                      <div className="flex items-center gap-3 p-3 bg-zinc-50 border border-zinc-200 rounded-xl">
                        {site.portfolioAvatarUrl ? (
                          <img
                            src={site.portfolioAvatarUrl}
                            alt="Avatar"
                            className="w-12 h-12 rounded-full object-cover border border-zinc-300 bg-white shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-zinc-200 text-zinc-600 flex items-center justify-center font-bold text-xs shrink-0">
                            Avatar
                          </div>
                        )}
                        <div className="flex-1 space-y-1.5">
                          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-950 hover:bg-black text-white text-xs font-bold cursor-pointer transition-all shadow-xs">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload Avatar</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleFileUpload(e, (url) => updateSiteField('portfolioAvatarUrl', url))}
                            />
                          </label>
                          <input
                            type="url"
                            value={site.portfolioAvatarUrl || ''}
                            onChange={(e) => updateSiteField('portfolioAvatarUrl', e.target.value)}
                            placeholder="Or image URL..."
                            className="w-full px-2.5 py-1 bg-white border border-zinc-300 rounded-lg text-xs"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-900 mb-1">About Me Narrative</label>
                      <textarea
                        rows={3}
                        value={site.portfolioAbout || ''}
                        onChange={(e) => updateSiteField('portfolioAbout', e.target.value)}
                        placeholder="Tell visitors about your background, experience, and what you specialize in..."
                        className="w-full px-3 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs text-zinc-800"
                      />
                    </div>

                    {/* Skills */}
                    <div className="space-y-2 pt-2 border-t border-zinc-200">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-zinc-900">Skills &amp; Expertise</span>
                        <button
                          type="button"
                          onClick={() => {
                            const newSkill: PortfolioSkill = {
                              id: `skill-${Date.now()}`,
                              name: 'Brand Strategy',
                              level: 'Expert',
                            };
                            updateSiteField('portfolioSkills', [...(site.portfolioSkills || []), newSkill]);
                          }}
                          className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Skill</span>
                        </button>
                      </div>
                      <div className="space-y-2">
                        {site.portfolioSkills?.map((skill, index) => (
                          <div key={skill.id} className="flex items-center gap-2 p-2 bg-zinc-50 border border-zinc-200 rounded-lg">
                            <input
                              type="text"
                              value={skill.name}
                              onChange={(e) => {
                                const updated = [...(site.portfolioSkills || [])];
                                updated[index].name = e.target.value;
                                updateSiteField('portfolioSkills', updated);
                              }}
                              placeholder="Skill name..."
                              className="flex-1 px-2 py-1 bg-white border border-zinc-300 rounded text-xs font-bold text-zinc-900"
                            />
                            <input
                              type="text"
                              value={skill.level || ''}
                              onChange={(e) => {
                                const updated = [...(site.portfolioSkills || [])];
                                updated[index].level = e.target.value;
                                updateSiteField('portfolioSkills', updated);
                              }}
                              placeholder="Level (e.g. Expert)..."
                              className="w-24 px-2 py-1 bg-white border border-zinc-300 rounded text-xs text-zinc-700"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const updated = site.portfolioSkills?.filter((s) => s.id !== skill.id);
                                updateSiteField('portfolioSkills', updated);
                              }}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Portfolio Projects */}
                    <div className="space-y-2 pt-2 border-t border-zinc-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-zinc-900 block">
                            Projects Showcase ({site.portfolioProjects?.length || 0}/5)
                          </span>
                          <span className="text-[10px] text-zinc-500 font-medium">
                            Max 5 project images allowed. 15-day free trial.
                          </span>
                        </div>
                        {(site.portfolioProjects?.length || 0) < 5 ? (
                          <button
                            type="button"
                            onClick={() => {
                              const newProj: PortfolioProject = {
                                id: `proj-${Date.now()}`,
                                title: 'Brand Identity & Web Showcase',
                                description: 'Designed end-to-end creative deliverables and digital experience.',
                                imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
                                tags: ['Branding', 'Web'],
                                link: '',
                              };
                              updateSiteField('portfolioProjects', [...(site.portfolioProjects || []), newProj]);
                            }}
                            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Project (Max 5)</span>
                          </button>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                            Max 5 Reached
                          </span>
                        )}
                      </div>

                      {site.portfolioProjects?.map((proj, index) => (
                        <div key={proj.id} className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-zinc-950">{proj.title}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = site.portfolioProjects?.filter((p) => p.id !== proj.id);
                                updateSiteField('portfolioProjects', updated);
                              }}
                              className="text-red-600 hover:text-red-800 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="flex items-center gap-3">
                            <img
                              src={proj.imageUrl}
                              alt={proj.title}
                              className="w-14 h-14 rounded-lg object-cover border border-zinc-300 bg-white shrink-0"
                            />
                            <div className="flex-1 space-y-1">
                              <label className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-zinc-950 hover:bg-black text-white text-[10px] font-bold cursor-pointer transition-all">
                                <Upload className="w-3 h-3" />
                                <span>Upload Project Image</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) =>
                                    handleFileUpload(e, (url) => {
                                      const updated = [...(site.portfolioProjects || [])];
                                      updated[index].imageUrl = url;
                                      updateSiteField('portfolioProjects', updated);
                                    })
                                  }
                                />
                              </label>
                              <input
                                type="url"
                                value={proj.imageUrl}
                                onChange={(e) => {
                                  const updated = [...(site.portfolioProjects || [])];
                                  updated[index].imageUrl = e.target.value;
                                  updateSiteField('portfolioProjects', updated);
                                }}
                                placeholder="Image URL..."
                                className="w-full px-2 py-1 bg-white border border-zinc-300 rounded text-[11px]"
                              />
                            </div>
                          </div>

                          <input
                            type="text"
                            value={proj.title}
                            onChange={(e) => {
                              const updated = [...(site.portfolioProjects || [])];
                              updated[index].title = e.target.value;
                              updateSiteField('portfolioProjects', updated);
                            }}
                            placeholder="Project Title..."
                            className="w-full px-2.5 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs font-bold text-zinc-950"
                          />

                          <div className="flex items-center gap-2">
                            <input
                              type="url"
                              value={proj.link || ''}
                              onChange={(e) => {
                                const updated = [...(site.portfolioProjects || [])];
                                updated[index].link = e.target.value;
                                updateSiteField('portfolioProjects', updated);
                              }}
                              placeholder="Project live URL (e.g. https://...)"
                              className="flex-1 px-2.5 py-1 bg-white border border-zinc-300 rounded text-xs font-mono"
                            />
                            <label className="flex items-center gap-1 text-[10px] text-zinc-600 font-semibold cursor-pointer shrink-0">
                              <input
                                type="checkbox"
                                checked={(proj as any).isLinkClickable !== false}
                                onChange={(e) => {
                                  const updated = [...(site.portfolioProjects || [])];
                                  (updated[index] as any).isLinkClickable = e.target.checked;
                                  updateSiteField('portfolioProjects', updated);
                                }}
                                className="w-3.5 h-3.5 text-blue-600 rounded"
                              />
                              <span>Clickable</span>
                            </label>
                          </div>

                          <textarea
                            rows={2}
                            value={proj.description}
                            onChange={(e) => {
                              const updated = [...(site.portfolioProjects || [])];
                              updated[index].description = e.target.value;
                              updateSiteField('portfolioProjects', updated);
                            }}
                            placeholder="Project description..."
                            className="w-full px-2.5 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs text-zinc-700"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB: Announcement Bar */}
            {activeTab === 'announcement' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-zinc-50 border border-zinc-200 rounded-xl">
                  <div>
                    <span className="text-xs font-bold text-zinc-900 block">Enable Top Announcement Bar</span>
                    <span className="text-[11px] text-zinc-500 font-medium">Shows a sticky notice banner at the very top of your website.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={site.announcementEnabled ?? true}
                    onChange={(e) => updateSiteField('announcementEnabled', e.target.checked)}
                    className="w-4 h-4 rounded border-zinc-300 text-zinc-950 focus:ring-zinc-950"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-900 mb-1">Banner Announcement Text</label>
                  <textarea
                    rows={3}
                    value={site.announcementText ?? 'SPECIAL OFFER: FREE EXPRESS SHIPPING ACROSS INDIA • ORDER DIRECTLY VIA WHATSAPP'}
                    onChange={(e) => updateSiteField('announcementText', e.target.value)}
                    placeholder="e.g. FREE ALL-INDIA SHIPPING ON ORDERS ABOVE ₹999 • LIMITED PERIOD OFFER"
                    className="w-full px-3.5 py-2 bg-white border border-zinc-300 rounded-xl text-xs font-bold text-zinc-950 focus:ring-2 focus:ring-zinc-950"
                  />
                  <p className="text-[10px] text-zinc-500 mt-1">Updates live across the top banner in real-time preview.</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-900 mb-1.5">Background Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={site.announcementBgColor || '#18181b'}
                        onChange={(e) => updateSiteField('announcementBgColor', e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer border border-zinc-300 p-0.5"
                      />
                      <input
                        type="text"
                        value={site.announcementBgColor || '#18181b'}
                        onChange={(e) => updateSiteField('announcementBgColor', e.target.value)}
                        className="w-full px-2.5 py-1 bg-white border border-zinc-300 rounded-lg text-xs font-mono font-bold text-zinc-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-900 mb-1.5">Text Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={site.announcementTextColor || '#ffffff'}
                        onChange={(e) => updateSiteField('announcementTextColor', e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer border border-zinc-300 p-0.5"
                      />
                      <input
                        type="text"
                        value={site.announcementTextColor || '#ffffff'}
                        onChange={(e) => updateSiteField('announcementTextColor', e.target.value)}
                        className="w-full px-2.5 py-1 bg-white border border-zinc-300 rounded-lg text-xs font-mono font-bold text-zinc-900"
                      />
                    </div>
                  </div>
                </div>

                {/* Quick Color Presets */}
                <div>
                  <label className="block text-xs font-bold text-zinc-900 mb-1.5">Quick Color Combinations</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { name: 'Dark Slate', bg: '#18181b', text: '#ffffff' },
                      { name: 'Emerald', bg: '#059669', text: '#ffffff' },
                      { name: 'Royal Blue', bg: '#2563eb', text: '#ffffff' },
                      { name: 'Crimson', bg: '#dc2626', text: '#ffffff' },
                      { name: 'Violet', bg: '#7c3aed', text: '#ffffff' },
                      { name: 'Gold & Dark', bg: '#fef08a', text: '#18181b' },
                    ].map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => {
                          updateSiteField('announcementBgColor', preset.bg);
                          updateSiteField('announcementTextColor', preset.text);
                        }}
                        className="p-2 rounded-lg border border-zinc-200 hover:border-zinc-400 text-left transition-all text-xs font-bold flex items-center gap-1.5"
                      >
                        <span className="w-3.5 h-3.5 rounded-full border border-zinc-300 shrink-0" style={{ backgroundColor: preset.bg }} />
                        <span className="truncate text-zinc-800">{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Trust Badges */}
            {activeTab === 'trust_badges' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-zinc-50 border border-zinc-200 rounded-xl">
                  <div>
                    <span className="text-xs font-bold text-zinc-900 block">Enable Trust Badges Bar</span>
                    <span className="text-[11px] text-zinc-500 font-medium">Build instant buyer confidence with guarantee icons and perks.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={site.trustBadgesEnabled ?? true}
                    onChange={(e) => updateSiteField('trustBadgesEnabled', e.target.checked)}
                    className="w-4 h-4 rounded border-zinc-300 text-zinc-950 focus:ring-zinc-950"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-900">
                    Trust Badges ({site.trustBadges?.length ?? 4})
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const current = site.trustBadges || [
                        { id: 'b1', icon: 'truck', title: 'Free Express Shipping', subtitle: 'On all orders across India' },
                        { id: 'b2', icon: 'shield', title: '100% Genuine Quality', subtitle: 'Handcrafted verified materials' },
                        { id: 'b3', icon: 'refresh', title: 'Easy Returns & Exchange', subtitle: '7-day hassle-free process' },
                        { id: 'b4', icon: 'clock', title: '24/7 WhatsApp Support', subtitle: 'Instant answers & direct order tracking' },
                      ];
                      const newBadge: TrustBadgeItem = {
                        id: `badge-${Date.now()}`,
                        icon: 'star',
                        title: 'Premium Quality',
                        subtitle: 'Certified and guaranteed',
                      };
                      updateSiteField('trustBadges', [...current, newBadge]);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Badge</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {(site.trustBadges || [
                    { id: 'b1', icon: 'truck', title: 'Free Express Shipping', subtitle: 'On all orders across India' },
                    { id: 'b2', icon: 'shield', title: '100% Genuine Quality', subtitle: 'Handcrafted verified materials' },
                    { id: 'b3', icon: 'refresh', title: 'Easy Returns & Exchange', subtitle: '7-day hassle-free process' },
                    { id: 'b4', icon: 'clock', title: '24/7 WhatsApp Support', subtitle: 'Instant answers & direct order tracking' },
                  ]).map((badge, index) => (
                    <div key={badge.id} className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-zinc-950">Badge #{index + 1}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const list = site.trustBadges || [
                              { id: 'b1', icon: 'truck', title: 'Free Express Shipping', subtitle: 'On all orders across India' },
                              { id: 'b2', icon: 'shield', title: '100% Genuine Quality', subtitle: 'Handcrafted verified materials' },
                              { id: 'b3', icon: 'refresh', title: 'Easy Returns & Exchange', subtitle: '7-day hassle-free process' },
                              { id: 'b4', icon: 'clock', title: '24/7 WhatsApp Support', subtitle: 'Instant answers & direct order tracking' },
                            ];
                            const updated = list.filter((b) => b.id !== badge.id);
                            updateSiteField('trustBadges', updated);
                          }}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-1">
                          <label className="block text-[10px] font-bold text-zinc-600 mb-0.5">Icon</label>
                          <select
                            value={badge.icon}
                            onChange={(e) => {
                              const list = [...(site.trustBadges || [
                                { id: 'b1', icon: 'truck', title: 'Free Express Shipping', subtitle: 'On all orders across India' },
                                { id: 'b2', icon: 'shield', title: '100% Genuine Quality', subtitle: 'Handcrafted verified materials' },
                                { id: 'b3', icon: 'refresh', title: 'Easy Returns & Exchange', subtitle: '7-day hassle-free process' },
                                { id: 'b4', icon: 'clock', title: '24/7 WhatsApp Support', subtitle: 'Instant answers & direct order tracking' },
                              ])];
                              list[index].icon = e.target.value as any;
                              updateSiteField('trustBadges', list);
                            }}
                            className="w-full px-2 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs font-bold text-zinc-900"
                          >
                            <option value="truck">Fast Shipping (Truck)</option>
                            <option value="shield">Verified Authentic (Shield)</option>
                            <option value="refresh">Easy Returns (Exchange)</option>
                            <option value="clock">Direct Support (Clock)</option>
                            <option value="star">Top Rated (Star)</option>
                            <option value="heart">Premium Craft (Heart)</option>
                          </select>
                        </div>

                        <div className="col-span-2">
                          <label className="block text-[10px] font-bold text-zinc-600 mb-0.5">Badge Title</label>
                          <input
                            type="text"
                            value={badge.title}
                            onChange={(e) => {
                              const list = [...(site.trustBadges || [
                                { id: 'b1', icon: 'truck', title: 'Free Express Shipping', subtitle: 'On all orders across India' },
                                { id: 'b2', icon: 'shield', title: '100% Genuine Quality', subtitle: 'Handcrafted verified materials' },
                                { id: 'b3', icon: 'refresh', title: 'Easy Returns & Exchange', subtitle: '7-day hassle-free process' },
                                { id: 'b4', icon: 'clock', title: '24/7 WhatsApp Support', subtitle: 'Instant answers & direct order tracking' },
                              ])];
                              list[index].title = e.target.value;
                              updateSiteField('trustBadges', list);
                            }}
                            placeholder="e.g. Free Express Shipping"
                            className="w-full px-2.5 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs font-bold text-zinc-950"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-zinc-600 mb-0.5">Subtitle / Description</label>
                        <input
                          type="text"
                          value={badge.subtitle}
                          onChange={(e) => {
                            const list = [...(site.trustBadges || [
                              { id: 'b1', icon: 'truck', title: 'Free Express Shipping', subtitle: 'On all orders across India' },
                              { id: 'b2', icon: 'shield', title: '100% Genuine Quality', subtitle: 'Handcrafted verified materials' },
                              { id: 'b3', icon: 'refresh', title: 'Easy Returns & Exchange', subtitle: '7-day hassle-free process' },
                              { id: 'b4', icon: 'clock', title: '24/7 WhatsApp Support', subtitle: 'Instant answers & direct order tracking' },
                            ])];
                            list[index].subtitle = e.target.value;
                            updateSiteField('trustBadges', list);
                          }}
                          placeholder="e.g. On all orders across India"
                          className="w-full px-2.5 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs text-zinc-700"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: Reviews & Testimonials */}
            {activeTab === 'reviews' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-zinc-50 border border-zinc-200 rounded-xl">
                  <div>
                    <span className="text-xs font-bold text-zinc-900 block">Enable Customer Reviews Section</span>
                    <span className="text-[11px] text-zinc-500 font-medium">Show verified testimonials, star ratings, and buyer comments.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={site.reviewsEnabled ?? true}
                    onChange={(e) => updateSiteField('reviewsEnabled', e.target.checked)}
                    className="w-4 h-4 rounded border-zinc-300 text-zinc-950 focus:ring-zinc-950"
                  />
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-zinc-900 mb-1">Section Heading Title</label>
                    <input
                      type="text"
                      value={site.reviewsTitle ?? 'Loved by Over 10,000+ Happy Customers'}
                      onChange={(e) => updateSiteField('reviewsTitle', e.target.value)}
                      placeholder="e.g. Loved by Over 10,000+ Happy Customers"
                      className="w-full px-3 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs font-bold text-zinc-950"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-900 mb-1">Section Subtitle</label>
                    <input
                      type="text"
                      value={site.reviewsSubtitle ?? 'Real authentic feedback and verified WhatsApp reviews.'}
                      onChange={(e) => updateSiteField('reviewsSubtitle', e.target.value)}
                      placeholder="e.g. Real authentic feedback and verified WhatsApp reviews."
                      className="w-full px-3 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs text-zinc-700"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-zinc-200">
                  <span className="text-xs font-bold text-zinc-900">
                    Customer Reviews List ({site.reviews?.length ?? 3})
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const current = site.reviews || [
                        { id: 'r1', reviewerName: 'Priya Sharma', rating: 5, comment: 'Exceptional craftsmanship! The product exceeded my expectations and delivery was fast. Placing order on WhatsApp was super smooth.', location: 'Mumbai, MH', verifiedBuyer: true },
                        { id: 'r2', reviewerName: 'Arjun Mehta', rating: 5, comment: 'Outstanding quality and very responsive customer support on WhatsApp. Will definitely recommend to friends and family!', location: 'Bengaluru, KA', verifiedBuyer: true },
                        { id: 'r3', reviewerName: 'Aanya Patel', rating: 5, comment: 'Exactly as described in the pictures. The attention to detail and packaging was premium. 10/10 experience!', location: 'Ahmedabad, GJ', verifiedBuyer: true },
                      ];
                      const newRev: ReviewItem = {
                        id: `rev-${Date.now()}`,
                        reviewerName: 'Happy Customer',
                        rating: 5,
                        comment: 'Amazing experience! Loved the fast communication on WhatsApp.',
                        location: 'New Delhi, DL',
                        verifiedBuyer: true,
                      };
                      updateSiteField('reviews', [...current, newRev]);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Review</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {(site.reviews || [
                    { id: 'r1', reviewerName: 'Priya Sharma', rating: 5, comment: 'Exceptional craftsmanship! The product exceeded my expectations and delivery was fast. Placing order on WhatsApp was super smooth.', location: 'Mumbai, MH', verifiedBuyer: true },
                    { id: 'r2', reviewerName: 'Arjun Mehta', rating: 5, comment: 'Outstanding quality and very responsive customer support on WhatsApp. Will definitely recommend to friends and family!', location: 'Bengaluru, KA', verifiedBuyer: true },
                    { id: 'r3', reviewerName: 'Aanya Patel', rating: 5, comment: 'Exactly as described in the pictures. The attention to detail and packaging was premium. 10/10 experience!', location: 'Ahmedabad, GJ', verifiedBuyer: true },
                  ]).map((rev, index) => (
                    <div key={rev.id} className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-zinc-950">{rev.reviewerName}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const list = site.reviews || [
                              { id: 'r1', reviewerName: 'Priya Sharma', rating: 5, comment: 'Exceptional craftsmanship! The product exceeded my expectations and delivery was fast. Placing order on WhatsApp was super smooth.', location: 'Mumbai, MH', verifiedBuyer: true },
                              { id: 'r2', reviewerName: 'Arjun Mehta', rating: 5, comment: 'Outstanding quality and very responsive customer support on WhatsApp. Will definitely recommend to friends and family!', location: 'Bengaluru, KA', verifiedBuyer: true },
                              { id: 'r3', reviewerName: 'Aanya Patel', rating: 5, comment: 'Exactly as described in the pictures. The attention to detail and packaging was premium. 10/10 experience!', location: 'Ahmedabad, GJ', verifiedBuyer: true },
                            ];
                            const updated = list.filter((r) => r.id !== rev.id);
                            updateSiteField('reviews', updated);
                          }}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-zinc-600 mb-0.5">Reviewer Name</label>
                          <input
                            type="text"
                            value={rev.reviewerName}
                            onChange={(e) => {
                              const list = [...(site.reviews || [
                                { id: 'r1', reviewerName: 'Priya Sharma', rating: 5, comment: 'Exceptional craftsmanship! The product exceeded my expectations and delivery was fast. Placing order on WhatsApp was super smooth.', location: 'Mumbai, MH', verifiedBuyer: true },
                                { id: 'r2', reviewerName: 'Arjun Mehta', rating: 5, comment: 'Outstanding quality and very responsive customer support on WhatsApp. Will definitely recommend to friends and family!', location: 'Bengaluru, KA', verifiedBuyer: true },
                                { id: 'r3', reviewerName: 'Aanya Patel', rating: 5, comment: 'Exactly as described in the pictures. The attention to detail and packaging was premium. 10/10 experience!', location: 'Ahmedabad, GJ', verifiedBuyer: true },
                              ])];
                              list[index].reviewerName = e.target.value;
                              updateSiteField('reviews', list);
                            }}
                            placeholder="Name..."
                            className="w-full px-2.5 py-1 bg-white border border-zinc-300 rounded text-xs font-bold text-zinc-950"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-zinc-600 mb-0.5">Rating (Stars)</label>
                          <select
                            value={rev.rating}
                            onChange={(e) => {
                              const list = [...(site.reviews || [
                                { id: 'r1', reviewerName: 'Priya Sharma', rating: 5, comment: 'Exceptional craftsmanship! The product exceeded my expectations and delivery was fast. Placing order on WhatsApp was super smooth.', location: 'Mumbai, MH', verifiedBuyer: true },
                                { id: 'r2', reviewerName: 'Arjun Mehta', rating: 5, comment: 'Outstanding quality and very responsive customer support on WhatsApp. Will definitely recommend to friends and family!', location: 'Bengaluru, KA', verifiedBuyer: true },
                                { id: 'r3', reviewerName: 'Aanya Patel', rating: 5, comment: 'Exactly as described in the pictures. The attention to detail and packaging was premium. 10/10 experience!', location: 'Ahmedabad, GJ', verifiedBuyer: true },
                              ])];
                              list[index].rating = Number(e.target.value);
                              updateSiteField('reviews', list);
                            }}
                            className="w-full px-2 py-1 bg-white border border-zinc-300 rounded text-xs font-bold text-amber-600"
                          >
                            <option value={5}>5 Stars (Excellent)</option>
                            <option value={4}>4 Stars (Very Good)</option>
                            <option value={3}>3 Stars (Average)</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-zinc-600 mb-0.5">Location / City</label>
                          <input
                            type="text"
                            value={rev.location || ''}
                            onChange={(e) => {
                              const list = [...(site.reviews || [
                                { id: 'r1', reviewerName: 'Priya Sharma', rating: 5, comment: 'Exceptional craftsmanship! The product exceeded my expectations and delivery was fast. Placing order on WhatsApp was super smooth.', location: 'Mumbai, MH', verifiedBuyer: true },
                                { id: 'r2', reviewerName: 'Arjun Mehta', rating: 5, comment: 'Outstanding quality and very responsive customer support on WhatsApp. Will definitely recommend to friends and family!', location: 'Bengaluru, KA', verifiedBuyer: true },
                                { id: 'r3', reviewerName: 'Aanya Patel', rating: 5, comment: 'Exactly as described in the pictures. The attention to detail and packaging was premium. 10/10 experience!', location: 'Ahmedabad, GJ', verifiedBuyer: true },
                              ])];
                              list[index].location = e.target.value;
                              updateSiteField('reviews', list);
                            }}
                            placeholder="e.g. Mumbai, MH"
                            className="w-full px-2.5 py-1 bg-white border border-zinc-300 rounded text-xs text-zinc-700"
                          />
                        </div>

                        <div className="flex items-center gap-2 pt-3">
                          <input
                            type="checkbox"
                            checked={rev.verifiedBuyer ?? true}
                            onChange={(e) => {
                              const list = [...(site.reviews || [
                                { id: 'r1', reviewerName: 'Priya Sharma', rating: 5, comment: 'Exceptional craftsmanship! The product exceeded my expectations and delivery was fast. Placing order on WhatsApp was super smooth.', location: 'Mumbai, MH', verifiedBuyer: true },
                                { id: 'r2', reviewerName: 'Arjun Mehta', rating: 5, comment: 'Outstanding quality and very responsive customer support on WhatsApp. Will definitely recommend to friends and family!', location: 'Bengaluru, KA', verifiedBuyer: true },
                                { id: 'r3', reviewerName: 'Aanya Patel', rating: 5, comment: 'Exactly as described in the pictures. The attention to detail and packaging was premium. 10/10 experience!', location: 'Ahmedabad, GJ', verifiedBuyer: true },
                              ])];
                              list[index].verifiedBuyer = e.target.checked;
                              updateSiteField('reviews', list);
                            }}
                            className="w-3.5 h-3.5 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-600"
                          />
                          <span className="text-[11px] font-bold text-emerald-800">Verified Buyer Badge</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-zinc-600 mb-0.5">Review Comment</label>
                        <textarea
                          rows={2}
                          value={rev.comment}
                          onChange={(e) => {
                            const list = [...(site.reviews || [
                              { id: 'r1', reviewerName: 'Priya Sharma', rating: 5, comment: 'Exceptional craftsmanship! The product exceeded my expectations and delivery was fast. Placing order on WhatsApp was super smooth.', location: 'Mumbai, MH', verifiedBuyer: true },
                              { id: 'r2', reviewerName: 'Arjun Mehta', rating: 5, comment: 'Outstanding quality and very responsive customer support on WhatsApp. Will definitely recommend to friends and family!', location: 'Bengaluru, KA', verifiedBuyer: true },
                              { id: 'r3', reviewerName: 'Aanya Patel', rating: 5, comment: 'Exactly as described in the pictures. The attention to detail and packaging was premium. 10/10 experience!', location: 'Ahmedabad, GJ', verifiedBuyer: true },
                            ])];
                            list[index].comment = e.target.value;
                            updateSiteField('reviews', list);
                          }}
                          placeholder="Customer review comment..."
                          className="w-full px-2.5 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs text-zinc-700"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: FAQ Accordion */}
            {activeTab === 'faq' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-zinc-50 border border-zinc-200 rounded-xl">
                  <div>
                    <span className="text-xs font-bold text-zinc-900 block">Enable FAQ Accordion Section</span>
                    <span className="text-[11px] text-zinc-500 font-medium">Interactive questions &amp; answers with smooth accordion toggles.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={site.faqEnabled ?? true}
                    onChange={(e) => updateSiteField('faqEnabled', e.target.checked)}
                    className="w-4 h-4 rounded border-zinc-300 text-zinc-950 focus:ring-zinc-950"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-900 mb-1">Section Title</label>
                  <input
                    type="text"
                    value={site.faqTitle ?? 'Frequently Asked Questions'}
                    onChange={(e) => updateSiteField('faqTitle', e.target.value)}
                    placeholder="Frequently Asked Questions"
                    className="w-full px-3 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs font-bold text-zinc-950"
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-zinc-200">
                  <span className="text-xs font-bold text-zinc-900">
                    Questions List ({site.faqs?.length ?? 4})
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const current = site.faqs || [
                        { id: 'f1', question: 'How do I place an order?', answer: 'Simply click "Order on WhatsApp" on any product. It opens WhatsApp with item details ready.' },
                        { id: 'f2', question: 'What payment methods do you accept?', answer: 'We accept all major UPI apps (Google Pay, PhonePe, Paytm), Net Banking, and COD.' },
                        { id: 'f3', question: 'How long does delivery take?', answer: 'Standard delivery takes 3-5 business days across India.' },
                        { id: 'f4', question: 'What is your return policy?', answer: 'We offer a 7-day hassle-free return or exchange for damaged or wrong products.' },
                      ];
                      const newFaq: FaqItem = {
                        id: `faq-${Date.now()}`,
                        question: 'Do you offer customization?',
                        answer: 'Yes! Send us your requirements directly on WhatsApp and we will make it happen.',
                      };
                      updateSiteField('faqs', [...current, newFaq]);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Question</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {(site.faqs || [
                    { id: 'f1', question: 'How do I place an order?', answer: 'Simply click "Order on WhatsApp" on any product. It opens WhatsApp with item details ready.' },
                    { id: 'f2', question: 'What payment methods do you accept?', answer: 'We accept all major UPI apps (Google Pay, PhonePe, Paytm), Net Banking, and COD.' },
                    { id: 'f3', question: 'How long does delivery take?', answer: 'Standard delivery takes 3-5 business days across India.' },
                    { id: 'f4', question: 'What is your return policy?', answer: 'We offer a 7-day hassle-free return or exchange for damaged or wrong products.' },
                  ]).map((faq, index) => (
                    <div key={faq.id} className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-zinc-950">Q#{index + 1}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const list = site.faqs || [
                              { id: 'f1', question: 'How do I place an order?', answer: 'Simply click "Order on WhatsApp" on any product. It opens WhatsApp with item details ready.' },
                              { id: 'f2', question: 'What payment methods do you accept?', answer: 'We accept all major UPI apps (Google Pay, PhonePe, Paytm), Net Banking, and COD.' },
                              { id: 'f3', question: 'How long does delivery take?', answer: 'Standard delivery takes 3-5 business days across India.' },
                              { id: 'f4', question: 'What is your return policy?', answer: 'We offer a 7-day hassle-free return or exchange for damaged or wrong products.' },
                            ];
                            const updated = list.filter((f) => f.id !== faq.id);
                            updateSiteField('faqs', updated);
                          }}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-zinc-600 mb-0.5">Question</label>
                        <input
                          type="text"
                          value={faq.question}
                          onChange={(e) => {
                            const list = [...(site.faqs || [
                              { id: 'f1', question: 'How do I place an order?', answer: 'Simply click "Order on WhatsApp" on any product. It opens WhatsApp with item details ready.' },
                              { id: 'f2', question: 'What payment methods do you accept?', answer: 'We accept all major UPI apps (Google Pay, PhonePe, Paytm), Net Banking, and COD.' },
                              { id: 'f3', question: 'How long does delivery take?', answer: 'Standard delivery takes 3-5 business days across India.' },
                              { id: 'f4', question: 'What is your return policy?', answer: 'We offer a 7-day hassle-free return or exchange for damaged or wrong products.' },
                            ])];
                            list[index].question = e.target.value;
                            updateSiteField('faqs', list);
                          }}
                          placeholder="Question..."
                          className="w-full px-2.5 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs font-bold text-zinc-950"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-zinc-600 mb-0.5">Answer</label>
                        <textarea
                          rows={2}
                          value={faq.answer}
                          onChange={(e) => {
                            const list = [...(site.faqs || [
                              { id: 'f1', question: 'How do I place an order?', answer: 'Simply click "Order on WhatsApp" on any product. It opens WhatsApp with item details ready.' },
                              { id: 'f2', question: 'What payment methods do you accept?', answer: 'We accept all major UPI apps (Google Pay, PhonePe, Paytm), Net Banking, and COD.' },
                              { id: 'f3', question: 'How long does delivery take?', answer: 'Standard delivery takes 3-5 business days across India.' },
                              { id: 'f4', question: 'What is your return policy?', answer: 'We offer a 7-day hassle-free return or exchange for damaged or wrong products.' },
                            ])];
                            list[index].answer = e.target.value;
                            updateSiteField('faqs', list);
                          }}
                          placeholder="Detailed answer..."
                          className="w-full px-2.5 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs text-zinc-700"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: About Story */}
            {activeTab === 'about' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-zinc-50 border border-zinc-200 rounded-xl">
                  <div>
                    <span className="text-xs font-bold text-zinc-900 block">Enable Brand Story Section</span>
                    <span className="text-[11px] text-zinc-500 font-medium">A dedicated story section highlighting your craft, history, and values.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={site.aboutEnabled ?? true}
                    onChange={(e) => updateSiteField('aboutEnabled', e.target.checked)}
                    className="w-4 h-4 rounded border-zinc-300 text-zinc-950 focus:ring-zinc-950"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-900 mb-1">Story Heading Title</label>
                  <input
                    type="text"
                    value={site.aboutTitle ?? 'Our Craftsmanship & Heritage'}
                    onChange={(e) => updateSiteField('aboutTitle', e.target.value)}
                    placeholder="e.g. Our Craftsmanship & Heritage"
                    className="w-full px-3 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs font-bold text-zinc-950"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-900 mb-1">Story Photo</label>
                  <div className="flex items-center gap-3 p-3 bg-zinc-50 border border-zinc-200 rounded-xl">
                    <img
                      src={site.aboutImageUrl || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80'}
                      alt="About Story"
                      className="w-16 h-16 rounded-xl object-cover border border-zinc-300 bg-white shrink-0"
                    />
                    <div className="flex-1 space-y-1.5">
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-950 hover:bg-black text-white text-xs font-bold cursor-pointer transition-all shadow-xs">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Story Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, (url) => updateSiteField('aboutImageUrl', url))}
                        />
                      </label>
                      <input
                        type="url"
                        value={site.aboutImageUrl || ''}
                        onChange={(e) => updateSiteField('aboutImageUrl', e.target.value)}
                        placeholder="Or paste image URL..."
                        className="w-full px-2.5 py-1 bg-white border border-zinc-300 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-900 mb-1">About Narrative Text</label>
                  <textarea
                    rows={4}
                    value={site.aboutText ?? 'Founded with an unwavering dedication to exceptional quality, we blend traditional craftsmanship with contemporary design. Every piece in our collection is meticulously crafted with the finest materials to ensure lasting beauty and performance.'}
                    onChange={(e) => updateSiteField('aboutText', e.target.value)}
                    placeholder="Tell your brand's story..."
                    className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-xl text-xs text-zinc-800 focus:ring-2 focus:ring-zinc-950"
                  />
                </div>
              </div>
            )}

            {/* TAB: Footer & Social */}
            {activeTab === 'footer' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-900 mb-1">Brand Bio / Short Blurb</label>
                  <textarea
                    rows={2}
                    value={site.footerBlurb ?? 'Handcrafted premium goods made with devotion. Contact us anytime directly on WhatsApp for custom orders.'}
                    onChange={(e) => updateSiteField('footerBlurb', e.target.value)}
                    placeholder="Short description displayed in the footer..."
                    className="w-full px-3 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs text-zinc-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-900 mb-1">Instagram Profile URL</label>
                  <input
                    type="url"
                    value={site.footerInstagramUrl || ''}
                    onChange={(e) => updateSiteField('footerInstagramUrl', e.target.value)}
                    placeholder="https://instagram.com/yourbrand"
                    className="w-full px-3 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs text-zinc-800"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-900 mb-1">Store / Studio Location</label>
                    <input
                      type="text"
                      value={site.footerAddress || ''}
                      onChange={(e) => updateSiteField('footerAddress', e.target.value)}
                      placeholder="e.g. Bandra West, Mumbai, MH"
                      className="w-full px-3 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs text-zinc-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-900 mb-1">Support Email</label>
                    <input
                      type="email"
                      value={site.footerEmail || ''}
                      onChange={(e) => updateSiteField('footerEmail', e.target.value)}
                      placeholder="hello@yourbrand.in"
                      className="w-full px-3 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs text-zinc-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-900 mb-1">Copyright Notice</label>
                  <input
                    type="text"
                    value={site.footerCopyright ?? `© ${new Date().getFullYear()} ${site.name}. All rights reserved.`}
                    onChange={(e) => updateSiteField('footerCopyright', e.target.value)}
                    placeholder={`© ${new Date().getFullYear()} ${site.name}. All rights reserved.`}
                    className="w-full px-3 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs text-zinc-800"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sandbox Live Iframe Preview (Renders Instant Realtime srcDoc) */}
        <div
          className={`flex-1 min-w-0 max-w-full bg-zinc-100 p-2 sm:p-4 md:p-6 flex flex-col items-center justify-start h-full relative overflow-y-auto ${
            mobileViewMode === 'editor' ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Preview Toolbar with Full Screen & Device switchers */}
          <div className="w-full max-w-5xl flex items-center justify-between pb-2 mb-2 border-b border-zinc-200 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-500">Live Preview</span>
              <span className="text-[10px] font-mono font-bold bg-zinc-200 text-zinc-800 px-2 py-0.5 rounded truncate max-w-[150px] sm:max-w-none">
                {site.slug}.linkal.in
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1 bg-white border border-zinc-200 p-0.5 rounded-xl">
                <button
                  type="button"
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                    previewDevice === 'desktop' ? 'bg-zinc-950 text-white' : 'text-zinc-500 hover:text-zinc-950'
                  }`}
                  title="Desktop Preview"
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice('tablet')}
                  className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                    previewDevice === 'tablet' ? 'bg-zinc-950 text-white' : 'text-zinc-500 hover:text-zinc-950'
                  }`}
                  title="Tablet Preview"
                >
                  <Tablet className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                    previewDevice === 'mobile' ? 'bg-zinc-950 text-white' : 'text-zinc-500 hover:text-zinc-950'
                  }`}
                  title="Mobile Preview"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsFullScreenPreview(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-zinc-300 hover:bg-zinc-50 text-xs font-bold text-zinc-800 shadow-xs transition-all active:scale-95"
                title="Open Full Screen Preview"
              >
                <Maximize2 className="w-3.5 h-3.5 text-zinc-600" />
                <span>Full Screen</span>
              </button>
            </div>
          </div>

          <div className="w-full max-w-6xl flex-1 flex flex-col items-center justify-center min-h-0 overflow-hidden">
            <iframe
              ref={iframeRef}
              src={`/api/sites/${site.id}/preview`}
              srcDoc={previewHtml}
              sandbox="allow-scripts allow-modals allow-forms allow-popups allow-popups-to-escape-sandbox allow-same-origin"
              className={`transition-all duration-300 bg-white max-w-full h-full shadow-lg ${getDeviceClass()}`}
              title="Live Website Sandbox Preview"
            />
          </div>
        </div>
      </div>

      {/* Mobile Bottom Taskbar for Switching Editor/Preview */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-zinc-200 px-3 py-2 shadow-lg">
        <div className="grid grid-cols-4 gap-1.5 text-center">
          <button
            onClick={() => setMobileViewMode('editor')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-colors ${
              mobileViewMode === 'editor'
                ? 'bg-zinc-950 text-white font-bold'
                : 'text-zinc-700 hover:bg-zinc-100'
            }`}
          >
            <Edit3 className="w-4 h-4 mb-0.5" />
            <span className="text-[10px]">Edit Form</span>
          </button>

          <button
            onClick={() => setMobileViewMode('preview')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-colors ${
              mobileViewMode === 'preview'
                ? 'bg-zinc-950 text-white font-bold'
                : 'text-zinc-700 hover:bg-zinc-100'
            }`}
          >
            <Eye className="w-4 h-4 mb-0.5" />
            <span className="text-[10px]">Preview</span>
          </button>

          <button
            onClick={() => setIsFullScreenPreview(true)}
            className="flex flex-col items-center justify-center py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold transition-colors active:scale-95"
          >
            <Maximize2 className="w-4 h-4 mb-0.5 text-blue-600" />
            <span className="text-[10px]">Full View</span>
          </button>

          <button
            onClick={handlePublish}
            className="flex flex-col items-center justify-center py-1.5 rounded-xl bg-emerald-600 text-white font-bold shadow-xs active:scale-95"
          >
            <Rocket className="w-4 h-4 mb-0.5" />
            <span className="text-[10px]">Publish</span>
          </button>
        </div>
      </nav>

      {/* QR Code Modal */}
      {showQrModal && site && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <div
            className="fixed inset-0 drawer-backdrop"
            onClick={() => setShowQrModal(false)}
          />
          <div className="relative z-10 w-full max-w-md bg-white rounded-2xl border border-zinc-200 shadow-2xl p-5 sm:p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-zinc-950 text-white flex items-center justify-center">
                  <QrIcon className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-zinc-950">
                    Storefront QR Code
                  </h3>
                  <p className="text-xs text-zinc-500 font-mono">
                    https://{site.slug}.linkal.in
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowQrModal(false)}
                className="p-1.5 rounded-lg border border-zinc-200 text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col items-center justify-center p-5 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-3">
              <div
                className="p-3 bg-white rounded-xl shadow-xs border border-zinc-200"
                dangerouslySetInnerHTML={{
                  __html: generateQrSvg(
                    site.liveUrl || `https://${site.slug}.linkal.in`,
                    220
                  ),
                }}
              />
              <div className="text-center">
                <span className="text-xs font-mono font-bold text-zinc-900 block">
                  https://{site.slug}.linkal.in
                </span>
                <span className="text-[11px] text-zinc-500 font-medium">
                  Scan to instantly open on any smartphone camera
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    downloadQrPng(
                      site.liveUrl || `https://${site.slug}.linkal.in`,
                      `${site.slug}-qr.png`,
                      800
                    )
                  }
                  className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-zinc-950 hover:bg-black text-white text-xs font-bold transition-all shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PNG (HD)</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    downloadQrSvg(
                      site.liveUrl || `https://${site.slug}.linkal.in`,
                      `${site.slug}-qr.svg`
                    )
                  }
                  className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-zinc-300 bg-white hover:bg-zinc-100 text-zinc-950 text-xs font-bold transition-all"
                >
                  <Download className="w-3.5 h-3.5 text-zinc-700" />
                  <span>Download SVG</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(
                    site.liveUrl || `https://${site.slug}.linkal.in`
                  );
                  alert('Live link copied to clipboard!');
                }}
                className="w-full py-2 px-3 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 text-xs font-bold transition-all"
              >
                Copy Direct Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Publish Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <div
            className="fixed inset-0 drawer-backdrop"
            onClick={() => !deploying && setShowPublishModal(false)}
          />
          <div className="relative z-10 w-full max-w-xl bg-white rounded-2xl border border-zinc-200 shadow-2xl p-5 sm:p-6 space-y-4 max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-zinc-950 text-white flex items-center justify-center">
                  <Rocket className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-zinc-950">
                    {deploying
                      ? 'Publishing Storefront'
                      : site.status === 'live'
                      ? 'Storefront is Live & Published!'
                      : 'Publishing Complete'}
                  </h3>
                  <p className="text-xs text-zinc-500 font-mono">
                    https://{site.slug}.linkal.in
                  </p>
                </div>
              </div>
              {!deploying && (
                <button
                  onClick={() => setShowPublishModal(false)}
                  className="p-1.5 rounded-lg border border-zinc-200 text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* 30-Second Propagation Progress Timer */}
            {deploying && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full border-2 border-amber-600 border-t-transparent animate-spin shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-amber-950 block">
                        Publishing &amp; Configuring SSL (~{propagationSeconds}s remaining)
                      </span>
                      <span className="text-[11px] text-amber-800 font-medium">
                        Cloud DNS routing &amp; automated zero-config certificate issuance
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-black text-amber-900 bg-amber-200/80 px-2.5 py-1 rounded-lg shrink-0">
                    {Math.min(30, 30 - propagationSeconds + 1)}s / 30s
                  </span>
                </div>

                {/* Animated Progress Bar */}
                <div className="w-full bg-amber-200/70 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-amber-600 h-full rounded-full transition-all duration-1000 ease-linear"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round(((30 - propagationSeconds) / 30) * 100)
                      )}%`,
                    }}
                  />
                </div>

                {/* Milestone Indicators */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-bold">
                  <div
                    className={`p-2 rounded-lg border flex items-center gap-1.5 ${
                      propagationSeconds <= 28
                        ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
                        : 'bg-white border-amber-200 text-zinc-500'
                    }`}
                  >
                    <span>{propagationSeconds <= 28 ? '✓' : '1.'} HTML Bundle</span>
                  </div>
                  <div
                    className={`p-2 rounded-lg border flex items-center gap-1.5 ${
                      propagationSeconds <= 20
                        ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
                        : 'bg-white border-amber-200 text-zinc-500'
                    }`}
                  >
                    <span>{propagationSeconds <= 20 ? '✓' : '2.'} Cloud Push</span>
                  </div>
                  <div
                    className={`p-2 rounded-lg border flex items-center gap-1.5 ${
                      propagationSeconds <= 10
                        ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
                        : 'bg-white border-amber-200 text-zinc-500'
                    }`}
                  >
                    <span>{propagationSeconds <= 10 ? '✓' : '3.'} DNS Routing</span>
                  </div>
                  <div
                    className={`p-2 rounded-lg border flex items-center gap-1.5 ${
                      propagationSeconds <= 2
                        ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
                        : 'bg-white border-amber-200 text-zinc-500'
                    }`}
                  >
                    <span>{propagationSeconds <= 2 ? '✓' : '4.'} SSL Verified</span>
                  </div>
                </div>

                <p className="text-[11px] text-amber-800 font-medium">
                  DNS propagation across global edge nodes takes approximately 30 seconds. Your storefront will be live automatically.
                </p>
              </div>
            )}

            {/* When live: Celebratory Live Domain Link & Preview & QR Code */}
            {!deploying && site.status === 'live' && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2 text-emerald-950 font-extrabold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Storefront Published Successfully!</span>
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-[10px] font-bold self-start sm:self-auto">
                    ✓ Saved to My Websites &amp; History
                  </span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-emerald-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-500 font-medium">Live Domain Link:</span>
                    <span className="text-emerald-700 font-mono font-bold">
                      https://{site.slug}.linkal.in
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <a
                      href={site.liveUrl || `https://${site.slug}.linkal.in`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-xs"
                    >
                      <span>Open Live Website</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </a>

                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          site.liveUrl || `https://${site.slug}.linkal.in`
                        );
                        alert('Live link copied to clipboard!');
                      }}
                      className="px-3 py-2 rounded-xl border border-emerald-300 bg-white hover:bg-emerald-100 text-emerald-950 text-xs font-bold transition-all"
                    >
                      Copy Link
                    </button>
                  </div>
                </div>

                {/* Inline QR Code Export Box */}
                <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-emerald-200">
                  <div
                    className="p-1.5 bg-white rounded-lg border border-zinc-200 shrink-0"
                    dangerouslySetInnerHTML={{
                      __html: generateQrSvg(site.liveUrl || `https://${site.slug}.linkal.in`, 76),
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-950">
                      <QrIcon className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Website QR Code Ready</span>
                    </div>
                    <p className="text-[10px] text-zinc-500 font-medium mt-0.5">
                      Use for packaging, business cards, stickers, or store flyers.
                    </p>
                    <div className="flex items-center gap-2 pt-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          downloadQrPng(
                            site.liveUrl || `https://${site.slug}.linkal.in`,
                            `${site.slug}-qr.png`,
                            800
                          )
                        }
                        className="px-2.5 py-1 rounded-lg bg-zinc-950 hover:bg-black text-white text-[10px] font-bold inline-flex items-center gap-1 transition-all shadow-xs"
                      >
                        <Download className="w-3 h-3" />
                        <span>Download PNG</span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          downloadQrSvg(
                            site.liveUrl || `https://${site.slug}.linkal.in`,
                            `${site.slug}-qr.svg`
                          )
                        }
                        className="px-2.5 py-1 rounded-lg border border-zinc-300 bg-white hover:bg-zinc-100 text-zinc-800 text-[10px] font-bold inline-flex items-center gap-1 transition-all"
                      >
                        <Download className="w-3 h-3 text-zinc-600" />
                        <span>Download SVG</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Embedded Live Preview in Modal */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-xs text-zinc-600 font-medium">
                    <span>Live Preview:</span>
                    <span className="text-[10px] text-zinc-400">Interactive</span>
                  </div>
                  <div className="w-full h-48 sm:h-56 rounded-xl overflow-hidden border border-zinc-300 bg-white shadow-inner">
                    <iframe
                      srcDoc={previewHtml}
                      className="w-full h-full border-0"
                      title="Published Preview"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Deployment Logs Box */}
            <div className="bg-zinc-950 rounded-xl p-3.5 font-mono text-xs text-zinc-300 max-h-36 overflow-y-auto space-y-1.5 border border-zinc-800">
              {deploymentLogs.map((log, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-zinc-500 text-[10px]">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  <span className="font-bold uppercase text-[10px] text-emerald-400">
                    [{log.step}]
                  </span>
                  <span className="text-zinc-200">{log.message}</span>
                </div>
              ))}

              {deploying && (
                <div className="flex items-center gap-2 text-amber-400 pt-1 border-t border-zinc-800">
                  <div className="w-3.5 h-3.5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                  <span>Publishing to Linkal servers...</span>
                </div>
              )}
            </div>

            {/* Modal Actions: stays open until user clicks */}
            <div className="pt-2 flex items-center justify-end gap-2 border-t border-zinc-100">
              <button
                onClick={() => setShowPublishModal(false)}
                disabled={deploying}
                className="px-4 py-2 rounded-xl border border-zinc-300 bg-white hover:bg-zinc-100 text-zinc-800 text-xs font-bold transition-all disabled:opacity-50"
              >
                Keep Editing
              </button>

              <button
                onClick={() => router.push(`/dashboard?published=${site.id}`)}
                disabled={deploying}
                className="px-5 py-2 rounded-xl bg-zinc-950 hover:bg-black text-white text-xs font-bold transition-all disabled:opacity-50 shadow-xs"
              >
                Close &amp; Go to My Sites
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── CV TEMPLATE FORMAT EXACT PREVIEW POPUP MODAL ─── */}
      {previewCvFormatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs animate-in fade-in"
            onClick={() => setPreviewCvFormatModal(null)}
          />

          <div className="relative z-10 w-full max-w-3xl bg-white border border-zinc-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-zinc-200 flex items-center justify-between bg-zinc-50/80">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5 text-blue-700" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm sm:text-base text-zinc-950">
                      {previewCvFormatModal === 'modern' ? '2. Modern Two-Column Split Layout' :
                       previewCvFormatModal === 'tech' ? '3. Tech & Developer Layout' :
                       previewCvFormatModal === 'elegant' ? '4. Editorial & Elegant Layout' :
                       previewCvFormatModal === 'compact' ? '5. Compact 1-Page ATS Layout' :
                       '1. Classic ATS (Single Column) Layout'}
                    </h3>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {previewCvFormatModal === 'modern' ? 'ATS 97.5% Pass' :
                       previewCvFormatModal === 'tech' ? 'Code & Git Stack' :
                       previewCvFormatModal === 'elegant' ? 'Executive Serif' :
                       previewCvFormatModal === 'compact' ? '1-Page Guarantee' :
                       'ATS 99.8% Pass Rate'}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 font-medium mt-0.5">
                    Exact visual structure of how your CV website and PDF printout will format.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setPreviewCvFormatModal(null)}
                className="p-1.5 rounded-xl border border-zinc-200 text-zinc-400 hover:text-zinc-950 hover:bg-zinc-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body: Left Wireframe, Right Spec Breakdown */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
                {/* Visual Layout Mockup */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-zinc-700">
                    <span>Layout Wireframe</span>
                    <span className="text-[10px] text-zinc-400 font-mono">100% Free Lifetime</span>
                  </div>
                  <div className="bg-zinc-100 p-3 rounded-2xl border border-zinc-200 flex items-center justify-center">
                    {/* Visual wireframe */}
                    {previewCvFormatModal === 'modern' ? (
                      <div className="w-full bg-white border border-zinc-300 rounded-xl p-3 shadow-sm flex gap-2.5 text-[9px] aspect-[4/5] overflow-hidden select-none font-sans">
                        <div className="w-1/3 bg-blue-50/60 border-r border-blue-100 p-2 rounded-lg flex flex-col justify-between">
                          <div className="space-y-2">
                            <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold mx-auto flex items-center justify-center text-[10px]">YC</div>
                            <div className="space-y-1">
                              <div className="font-extrabold text-[8px] text-zinc-900 uppercase">Contact</div>
                              <div className="h-1 bg-zinc-300 rounded w-full"></div>
                              <div className="h-1 bg-zinc-300 rounded w-4/5"></div>
                              <div className="h-1 bg-zinc-300 rounded w-2/3"></div>
                            </div>
                            <div className="space-y-1">
                              <div className="font-extrabold text-[8px] text-zinc-900 uppercase">Core Skills</div>
                              <div className="flex flex-wrap gap-0.5">
                                <span className="px-1 py-0.2 bg-blue-100 text-blue-800 rounded text-[6px] font-bold">Strategy</span>
                                <span className="px-1 py-0.2 bg-blue-100 text-blue-800 rounded text-[6px] font-bold">Ops</span>
                                <span className="px-1 py-0.2 bg-blue-100 text-blue-800 rounded text-[6px] font-bold">Leadership</span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div className="font-extrabold text-[8px] text-zinc-900 uppercase">Education</div>
                            <div className="h-1 bg-zinc-300 rounded w-full"></div>
                          </div>
                        </div>
                        <div className="w-2/3 p-1.5 flex flex-col justify-between">
                          <div className="space-y-2">
                            <div>
                              <div className="font-extrabold text-xs text-zinc-950">YAHYA MUNDE</div>
                              <div className="text-[8px] font-bold text-blue-600">Senior Professional</div>
                            </div>
                            <div className="space-y-1">
                              <div className="font-bold text-[8px] text-zinc-900 uppercase border-b border-zinc-200 pb-0.5">Executive Summary</div>
                              <div className="h-1 bg-zinc-200 rounded w-full"></div>
                              <div className="h-1 bg-zinc-200 rounded w-11/12"></div>
                            </div>
                            <div className="space-y-1">
                              <div className="font-bold text-[8px] text-zinc-900 uppercase border-b border-zinc-200 pb-0.5">Experience</div>
                              <div className="flex justify-between text-[7px] font-bold">
                                <span>Senior Lead @ TechCorp</span>
                                <span className="text-zinc-400">2022 — Present</span>
                              </div>
                              <div className="pl-1 border-l border-zinc-300 space-y-0.5">
                                <div className="h-1 bg-zinc-200 rounded w-full"></div>
                                <div className="h-1 bg-zinc-200 rounded w-5/6"></div>
                              </div>
                            </div>
                          </div>
                          <div className="text-[7px] font-mono text-zinc-400 text-right">Modern 2-Column Split</div>
                        </div>
                      </div>
                    ) : previewCvFormatModal === 'tech' ? (
                      <div className="w-full bg-zinc-950 text-zinc-200 border border-zinc-800 rounded-xl p-3 shadow-sm flex flex-col justify-between text-[9px] font-mono aspect-[4/5] overflow-hidden select-none">
                        <div className="space-y-2">
                          <div className="flex items-center gap-1 border-b border-zinc-800 pb-1">
                            <span className="w-2 h-2 rounded-full bg-red-500"></span>
                            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            <span className="text-[7px] text-zinc-400 ml-1">candidate@bash:~$ cv-preview</span>
                          </div>
                          <div>
                            <div className="text-emerald-400 font-bold text-[10px]">&gt; YAHYA // FULL-STACK ENGINEER</div>
                            <div className="text-[7px] text-zinc-400">github.com/developer &bull; yahya@tech.in &bull; +91 9307426215</div>
                          </div>
                          <div>
                            <div className="text-[7px] text-cyan-400 font-bold mb-0.5">// TECH_STACK</div>
                            <div className="flex flex-wrap gap-0.5">
                              <span className="px-1 py-0.2 bg-zinc-900 text-cyan-300 rounded text-[6px] border border-cyan-800">TypeScript</span>
                              <span className="px-1 py-0.2 bg-zinc-900 text-cyan-300 rounded text-[6px] border border-cyan-800">React</span>
                              <span className="px-1 py-0.2 bg-zinc-900 text-cyan-300 rounded text-[6px] border border-cyan-800">Next.js</span>
                              <span className="px-1 py-0.2 bg-zinc-900 text-cyan-300 rounded text-[6px] border border-cyan-800">PostgreSQL</span>
                            </div>
                          </div>
                          <div>
                            <div className="text-[7px] text-amber-400 font-bold mb-0.5">// FEATURED_PROJECTS</div>
                            <div className="bg-zinc-900 border border-zinc-800 rounded p-1 space-y-0.5">
                              <div className="flex justify-between text-[7px] text-emerald-300 font-bold">
                                <span>repo: linkal-platform</span>
                                <span className="text-zinc-500">⭐ 450+ stars</span>
                              </div>
                              <div className="h-0.5 bg-zinc-700 rounded w-11/12"></div>
                            </div>
                          </div>
                        </div>
                        <div className="text-[7px] text-cyan-400 text-right">// Tech &amp; Developer Monospace</div>
                      </div>
                    ) : previewCvFormatModal === 'elegant' ? (
                      <div className="w-full bg-[#fdfbf7] text-zinc-900 border border-amber-200 rounded-xl p-3 shadow-sm flex flex-col justify-between text-[9px] aspect-[4/5] overflow-hidden select-none font-serif">
                        <div className="space-y-2">
                          <div className="text-center border-b border-amber-300/80 pb-1.5">
                            <div className="text-xs font-bold tracking-widest uppercase">YAHYA MUNDEWADI</div>
                            <div className="text-[7px] text-zinc-600 italic">Executive Director &bull; Strategic Leadership</div>
                            <div className="text-[6px] text-zinc-500 font-sans tracking-wide mt-0.5">MUMBAI, INDIA &bull; YAHYA@LINKAL.IN</div>
                          </div>
                          <div className="space-y-0.5 font-sans">
                            <div className="text-center text-[7px] font-bold tracking-widest text-zinc-800 uppercase font-serif">Executive Profile</div>
                            <div className="h-1 bg-zinc-300 rounded w-full"></div>
                            <div className="h-1 bg-zinc-300 rounded w-11/12 mx-auto"></div>
                          </div>
                          <div className="space-y-1 font-sans">
                            <div className="text-center text-[7px] font-bold tracking-widest text-zinc-800 uppercase font-serif">Career Milestones</div>
                            <div className="border-t border-b border-zinc-200 py-1 space-y-0.5">
                              <div className="flex justify-between font-serif text-[7px] font-bold">
                                <span>Managing Partner &bull; Apex Global</span>
                                <span className="font-sans text-[6px] text-zinc-500">2020 — PRESENT</span>
                              </div>
                              <div className="h-1 bg-zinc-300 rounded w-full"></div>
                            </div>
                          </div>
                        </div>
                        <div className="text-[7px] font-sans text-amber-800 text-center uppercase tracking-wider">Editorial &amp; Elegant Serif Wireframe</div>
                      </div>
                    ) : previewCvFormatModal === 'compact' ? (
                      <div className="w-full bg-white border border-zinc-300 rounded-xl p-3 shadow-sm flex flex-col justify-between text-[9px] aspect-[4/5] overflow-hidden select-none font-sans">
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-end border-b-2 border-zinc-950 pb-1">
                            <div>
                              <div className="font-extrabold text-xs text-zinc-950">YAHYA MUNDE</div>
                              <div className="text-[7px] font-bold text-zinc-600">Senior Associate</div>
                            </div>
                            <div className="text-[6px] text-zinc-500 text-right font-mono">
                              yahya@linkal.in &bull; +91 9307426215 &bull; Mumbai
                            </div>
                          </div>
                          <div className="space-y-0.5">
                            <div className="font-extrabold text-[7px] uppercase tracking-wider text-zinc-900 border-b border-zinc-200">Summary</div>
                            <div className="h-1 bg-zinc-200 rounded w-full"></div>
                            <div className="h-1 bg-zinc-200 rounded w-11/12"></div>
                          </div>
                          <div className="space-y-0.5">
                            <div className="font-extrabold text-[7px] uppercase tracking-wider text-zinc-900 border-b border-zinc-200">Experience</div>
                            <div className="flex justify-between text-[6px] font-bold">
                              <span>Senior Product Lead &bull; Acme Inc</span>
                              <span>2022 — Present</span>
                            </div>
                            <div className="h-0.5 bg-zinc-200 rounded w-full"></div>
                          </div>
                        </div>
                        <div className="text-[6px] font-mono text-zinc-400 text-center border-t border-dashed border-zinc-300 pt-1">
                          Exact 1-Page A4 Guarantee (Zero Spillover)
                        </div>
                      </div>
                    ) : (
                      <div className="w-full bg-white border border-zinc-300 rounded-xl p-3 shadow-sm flex flex-col justify-between text-[9px] aspect-[4/5] overflow-hidden select-none font-sans">
                        <div className="space-y-2">
                          <div className="text-center border-b border-zinc-900 pb-1">
                            <div className="font-extrabold text-xs text-zinc-950 uppercase tracking-wider">YAHYA MUNDEWADI</div>
                            <div className="text-[7px] font-bold text-zinc-600">Senior Engineering Manager</div>
                            <div className="text-[6px] text-zinc-500 font-mono mt-0.5">
                              yahya@linkal.in &bull; +91 9307426215 &bull; Mumbai &bull; linkedin.com/in/yahya
                            </div>
                          </div>
                          <div className="space-y-0.5">
                            <div className="font-extrabold text-[7px] text-zinc-950 uppercase border-b border-zinc-200 pb-0.5">Professional Summary</div>
                            <div className="h-1 bg-zinc-200 rounded w-full"></div>
                            <div className="h-1 bg-zinc-200 rounded w-5/6"></div>
                          </div>
                          <div className="space-y-1">
                            <div className="font-extrabold text-[7px] text-zinc-950 uppercase border-b border-zinc-200 pb-0.5">Work Experience</div>
                            <div className="flex justify-between text-[7px] font-bold">
                              <span>Lead Architect &bull; Linkal AI</span>
                              <span className="text-zinc-400 font-mono">2022 — Present</span>
                            </div>
                            <div className="pl-1 border-l border-zinc-300 space-y-0.5">
                              <div className="h-1 bg-zinc-200 rounded w-full"></div>
                              <div className="h-1 bg-zinc-200 rounded w-4/5"></div>
                            </div>
                          </div>
                        </div>
                        <div className="text-[7px] font-mono text-emerald-700 text-right">Classic ATS (99.8% Scanner Score)</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Specification & Features */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-extrabold text-zinc-900 uppercase tracking-wider mb-1.5">
                      Layout Overview
                    </h4>
                    <p className="text-xs text-zinc-600 leading-relaxed">
                      {previewCvFormatModal === 'modern' ?
                        'A balanced two-column format that places your contact information, skill tags, and credentials into a neat sidebar, leaving the main content area for prominent achievements.' :
                       previewCvFormatModal === 'tech' ?
                        'Purpose-built for software engineers, cloud architects, and tech creators. Highlights tech stack badges, GitHub repository links, commit stars, and clean monospace prompt accents.' :
                       previewCvFormatModal === 'elegant' ?
                        'Refined editorial styling with classical serif typography, centered executive masthead, and subtle dividers designed for directors, consultants, and senior leadership.' :
                       previewCvFormatModal === 'compact' ?
                        'High-density single-page format with optimized line heights, inline dates, and horizontal skills engineered to ensure your CV never spills over onto page 2.' :
                        'Universally accepted single-column reverse chronological format. Guaranteed 99.8% automated parser pass rate across Workday, Taleo, Greenhouse, and Lever.'}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-extrabold text-zinc-900 uppercase tracking-wider mb-1.5">
                      Key Highlights
                    </h4>
                    <ul className="space-y-1.5 text-xs text-zinc-700">
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>ATS Parser Safe: Tested on Workday, Taleo &amp; Greenhouse</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>100% Free Lifetime hosting on your custom subdomain</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Instant 1-Click Print &amp; Clean PDF Export</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Direct WhatsApp chat button for recruiters</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-3 border-t border-zinc-200 flex flex-col sm:flex-row gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        updateSiteField('cvFormat', previewCvFormatModal as any);
                        setPreviewCvFormatModal(null);
                      }}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <Check className="w-4 h-4" />
                      <span>Apply This Template Format</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewCvFormatModal(null)}
                      className="py-2.5 px-4 rounded-xl border border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-bold transition-all text-center"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── FULL-SCREEN INTERACTIVE LIVE PREVIEW MODAL ─── */}
      {isFullScreenPreview && (
        <div className="fixed inset-0 z-50 bg-zinc-950/95 flex flex-col animate-in fade-in duration-200">
          <div className="h-14 px-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsFullScreenPreview(false)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white transition-all active:scale-95"
              >
                <X className="w-4 h-4" />
                <span>Exit Full View</span>
              </button>
              <span className="text-xs font-extrabold text-white hidden sm:inline">{site.name}</span>
              <span className="text-[11px] font-mono text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">
                {site.slug}.linkal.in
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1 bg-zinc-800 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                    previewDevice === 'desktop' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                  title="Desktop View"
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice('tablet')}
                  className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                    previewDevice === 'tablet' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                  title="Tablet View"
                >
                  <Tablet className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                    previewDevice === 'mobile' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                  title="Mobile View"
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>

              {site.type === 'cv' && (
                <button
                  type="button"
                  onClick={() => {
                    if (iframeRef.current?.contentWindow) {
                      iframeRef.current.contentWindow.print();
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white shadow-sm transition-all active:scale-95"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Print PDF</span>
                </button>
              )}

              <a
                href={`https://${site.slug}.linkal.in`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white shadow-sm transition-all active:scale-95"
              >
                <span>Open Live</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="flex-1 bg-zinc-950 p-2 sm:p-4 flex items-center justify-center overflow-hidden">
            <iframe
              srcDoc={previewHtml}
              sandbox="allow-scripts allow-modals allow-forms allow-popups allow-popups-to-escape-sandbox allow-same-origin"
              className={`bg-white transition-all duration-300 ${
                previewDevice === 'mobile'
                  ? 'w-[375px] max-w-full h-full max-h-[812px] rounded-3xl shadow-2xl border-8 border-zinc-800'
                  : previewDevice === 'tablet'
                  ? 'w-[768px] max-w-full h-full max-h-[900px] rounded-2xl shadow-2xl border-8 border-zinc-800'
                  : 'w-full h-full rounded-xl border border-zinc-800 shadow-2xl'
              }`}
              title="Full Screen Live Preview"
            />
          </div>
        </div>
      )}

      {/* 1-Click Google Sign-In Modal */}
      <GoogleAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
        isCvSite={site?.type === 'portfolio'}
      />
    </div>
  );
}
