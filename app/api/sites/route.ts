import { NextResponse } from 'next/server';
import { getAllSites, saveSite } from '@/lib/storage';
import { SiteData, SiteType } from '@/types/site';

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '') || 'my-site';
}

export async function GET() {
  try {
    const sites = await getAllSites();
    return NextResponse.json({ sites });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      type,
      slug,
      whatsappNumber,
      bannerImageUrl,
      bannerTitle,
      bannerSubtitle,
      logoUrl,
      productName,
      productPrice,
      productImageUrl,
      productDescription,
    } = body;

    if (!name || !whatsappNumber) {
      return NextResponse.json(
        { error: 'Site name and WhatsApp number are required' },
        { status: 400 }
      );
    }

    const validTypes: SiteType[] = ['ecommerce', 'portfolio', 'single_product'];
    const siteType: SiteType = validTypes.includes(type) ? type : 'ecommerce';

    const existingSites = await getAllSites();
    let baseSlug = (slug ? slug.toLowerCase().trim().replace(/[^a-z0-9-]+/g, '-') : generateSlug(name));
    let finalSlug = baseSlug;
    let counter = 1;

    while (existingSites.some((s) => s.slug === finalSlug)) {
      finalSlug = `${baseSlug}-${counter++}`;
    }

    const id = `site-${Date.now()}`;
    const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');

    const initialBannerImage = bannerImageUrl || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1600&auto=format&fit=crop&q=80';
    const initialBannerTitle = bannerTitle || `Welcome to ${name}`;
    const initialBannerSubtitle = bannerSubtitle || 'Explore our exclusive offerings and order directly on WhatsApp with instant support.';

    const initialProdName = productName || 'Signature Collection Item';
    const initialProdPrice = productPrice || '1,499';
    const initialProdImage = productImageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80';
    const initialProdDesc = productDescription || 'Premium quality handcrafted product with instant doorstep delivery.';

    const newSite: SiteData = {
      id,
      name,
      slug: finalSlug,
      type: siteType,
      status: 'draft',
      whatsappNumber: cleanPhone,
      defaultWhatsappMessage: siteType === 'portfolio'
        ? `Hello ${name}, I reviewed your Executive CV and would like to connect!`
        : `Hi ${name}, I saw your website and would like to place an order!`,
      logoUrl: siteType === 'portfolio' ? undefined : (logoUrl || undefined),
      themeColor: siteType === 'portfolio' ? '#0f172a' : siteType === 'single_product' ? '#ea580c' : '#059669',
      fontFamily: 'Inter',
      bannerSlider: siteType === 'portfolio' ? [] : [
        {
          id: `slide-1`,
          imageUrl: initialBannerImage,
          title: initialBannerTitle,
          subtitle: initialBannerSubtitle,
          ctaText: 'Chat on WhatsApp',
        },
      ],
      sliderAutoRotateSeconds: 4,
      products: siteType === 'ecommerce' ? [
        {
          id: 'prod-1',
          name: initialProdName,
          price: initialProdPrice,
          currency: '₹',
          description: initialProdDesc,
          imageUrl: initialProdImage,
          badge: 'Featured',
          inStock: true,
        }
      ] : undefined,
      // Dedicated ATS CV fields for portfolios
      cvTitle: name,
      cvLocation: 'Mumbai, India',
      cvEmail: '',
      cvPhone: cleanPhone,
      cvLinkedin: '',
      cvGithub: '',
      cvWebsite: `https://${finalSlug}.linkal.in`,
      cvSummary: 'Accomplished executive with a track record of leading strategic initiatives, scaling high-impact operations, and driving sustainable business growth.',
      cvExperiences: siteType === 'portfolio' ? [
        {
          id: 'exp-1',
          company: 'Global Enterprises Ltd.',
          role: 'Executive Director & Head of Strategy',
          period: '2021 — Present',
          location: 'Mumbai, India',
          description: 'Spearheaded corporate digital transformation and cross-functional operations. Accelerated revenue by 42% and oversaw strategic talent development.',
          companyUrl: 'https://example.com'
        }
      ] : undefined,
      cvEducations: siteType === 'portfolio' ? [
        {
          id: 'edu-1',
          institution: 'Premier Institute of Management',
          degree: 'Master of Business Administration (MBA)',
          year: '2016 — 2018',
          honors: 'Dean\'s Honor List'
        }
      ] : undefined,
      cvSkills: siteType === 'portfolio' ? [
        'Strategic Leadership',
        'Business Transformation',
        'Stakeholder Management',
        'P&L Management',
        'Executive Decision Making'
      ] : undefined,
      cvProjects: siteType === 'portfolio' ? [
        {
          id: 'proj-1',
          title: 'Flagship Digital Transformation',
          description: 'Architected and rolled out automated workflows across 14 divisions, reducing processing turnaround time by 60%.',
          link: `https://${finalSlug}.linkal.in`,
          techStack: 'Strategy, Enterprise Systems'
        }
      ] : undefined,
      cvCertifications: siteType === 'portfolio' ? [
        {
          id: 'cert-1',
          name: 'Executive Leadership Certification',
          issuer: 'Harvard Business Publishing',
          year: '2022',
          url: 'https://harvardbusiness.org'
        }
      ] : undefined,
      singleProduct: siteType === 'single_product' ? {
        productName: initialProdName || name,
        tagline: initialBannerSubtitle || 'Engineered for Performance & Everyday Excellence',
        regularPrice: '3,999',
        salePrice: initialProdPrice || '2,499',
        currency: '₹',
        description: initialProdDesc || 'Designed with precision engineering and world-class craftsmanship.',
        images: [initialProdImage || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'],
        features: ['Premium Grade Finish', '1 Year Replacement Guarantee', 'Fast Priority Dispatch'],
        specifications: [{ label: 'Condition', value: 'Brand New In Box' }]
      } : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const saved = await saveSite(newSite);
    return NextResponse.json({ site: saved }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
