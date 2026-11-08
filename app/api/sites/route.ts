import { NextResponse } from 'next/server';
import { getAllSites, saveSite } from '@/lib/storage';
import { SiteData, SiteType } from '@/types/site';

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '') || 'my-site';
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get('userEmail')?.toLowerCase().trim();
    let sites = await getAllSites();

    if (userEmail) {
      sites = sites.filter(
        (s) =>
          (s.userEmail && s.userEmail.toLowerCase().trim() === userEmail) ||
          (s.cvEmail && s.cvEmail.toLowerCase().trim() === userEmail) ||
          (s.contactEmail && s.contactEmail.toLowerCase().trim() === userEmail)
      );
    }

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
      userEmail,
      userName,
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
      userEmail: userEmail ? userEmail.toLowerCase().trim() : undefined,
      userName: userName || name,
      whatsappNumber: cleanPhone,
      defaultWhatsappMessage: siteType === 'portfolio'
        ? `Hello ${name}, I reviewed your CV and would like to connect!`
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
      // Clean generic ATS CV fields for portfolios (NO Harvard / executive fallbacks)
      cvTitle: name || 'XYZ',
      cvHeadline: 'Professional Title',
      cvLocation: 'City, Country',
      cvEmail: userEmail || '',
      cvPhone: cleanPhone,
      cvLinkedin: '',
      cvGithub: '',
      cvWebsite: `https://${finalSlug}.linkal.in`,
      cvSummary: 'A brief professional summary highlighting key strengths, background, and career accomplishments.',
      cvExperiences: siteType === 'portfolio' ? [
        {
          id: 'exp-1',
          company: 'Company ABC',
          role: 'Role / Position',
          period: '2022 — Present',
          location: 'City, Country',
          description: 'Key responsibilities, accomplishments, and quantifiable impact.',
          companyUrl: ''
        }
      ] : undefined,
      cvEducations: siteType === 'portfolio' ? [
        {
          id: 'edu-1',
          institution: 'University / Institute Name',
          degree: 'Degree / Course Name',
          year: '2018 — 2022',
          honors: ''
        }
      ] : undefined,
      cvSkills: siteType === 'portfolio' ? [
        'Skill 1',
        'Skill 2',
        'Skill 3',
        'Project Planning',
        'Communication'
      ] : undefined,
      cvProjects: siteType === 'portfolio' ? [
        {
          id: 'proj-1',
          title: 'Project Title Alpha',
          description: 'Designed and implemented end-to-end functionality to meet client objectives.',
          link: `https://${finalSlug}.linkal.in`,
          techStack: 'Tools & Technologies'
        }
      ] : undefined,
      cvCertifications: siteType === 'portfolio' ? [
        {
          id: 'cert-1',
          name: 'Certification Title',
          issuer: 'Issuing Organization',
          year: '2024',
          url: ''
        }
      ] : undefined,
      // CV Display Toggles & Format Defaults
      cvShowSummary: true,
      cvShowExperience: true,
      cvShowEducation: true,
      cvShowSkills: true,
      cvShowProjects: true,
      cvShowCertifications: true,
      cvFormat: 'classic',
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

    // Notify Founder Admin of new site or CV initialized
    try {
      const isCv = newSite.type === 'portfolio';
      await fetch('https://admin.linkal.in/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: isCv ? 'new_cv' : 'new_site',
          title: isCv ? '📄 New Executive CV Started' : '🛍️ New Website Started',
          body: `${userName || saved.cvTitle || saved.name} started https://${saved.slug}.linkal.in | WhatsApp: ${whatsappNumber}`,
          userName: userName || saved.cvTitle || saved.name,
          siteSlug: saved.slug,
          userPhone: whatsappNumber,
          userEmail: userEmail || saved.cvEmail,
        }),
      });
    } catch (e) {}

    return NextResponse.json({ site: saved }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
