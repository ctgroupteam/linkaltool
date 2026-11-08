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

    const validTypes: SiteType[] = [
      'cv',
      'portfolio',
      'watch_store',
      'restaurant',
      'boutique',
      'wedding_card',
      'tuition',
      'bakery',
      'salon',
      'electronics',
      'ecommerce',
      'single_product',
    ];
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
      defaultWhatsappMessage: siteType === 'cv' || siteType === 'portfolio'
        ? `Hello ${name}, I reviewed your CV/portfolio on Linkal and would like to connect!`
        : siteType === 'watch_store'
        ? `Hello ${name}, I am interested in purchasing a watch from your collection!`
        : siteType === 'restaurant'
        ? `Hello ${name}, I would like to place an order from your digital menu!`
        : siteType === 'wedding_card'
        ? `Hello, RSVP confirmation for the wedding celebration!`
        : siteType === 'tuition'
        ? `Hello ${name}, I would like to enquire about coaching admissions and batch timings!`
        : `Hi ${name}, I saw your website and would like to place an order!`,
      logoUrl: (siteType === 'cv' || siteType === 'portfolio') ? undefined : (logoUrl || undefined),
      themeColor: siteType === 'cv' ? '#0f172a' : siteType === 'watch_store' ? '#18181b' : siteType === 'wedding_card' ? '#7f1d1d' : siteType === 'single_product' ? '#ea580c' : '#059669',
      fontFamily: 'Inter',
      bannerSlider: (siteType === 'cv' || siteType === 'wedding_card') ? [] : [
        {
          id: `slide-1`,
          imageUrl: initialBannerImage,
          title: initialBannerTitle,
          subtitle: initialBannerSubtitle,
          ctaText: 'Chat on WhatsApp',
        },
      ],
      sliderAutoRotateSeconds: 4,
      products: siteType === 'ecommerce' || siteType === 'bakery' || siteType === 'salon' || siteType === 'electronics' ? [
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
      // Watch Business Catalog Defaults (3rd position)
      watchItems: siteType === 'watch_store' ? [
        {
          id: 'watch-1',
          brand: 'Chronos Heritage',
          model: 'Ocean Diver Pro 300M',
          price: '8,499',
          mrp: '14,999',
          dialColor: 'Midnight Black',
          caseDiameter: '41mm',
          movement: 'Automatic Self-Winding',
          waterResistance: '300m / 30 ATM',
          strapMaterial: '316L Stainless Steel Oyster',
          imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
          badge: 'Best Seller',
          inStock: true,
        },
        {
          id: 'watch-2',
          brand: 'Aethelgard Horology',
          model: 'Aviator GMT Automatic',
          price: '11,999',
          mrp: '19,999',
          dialColor: 'Sunburst Navy',
          caseDiameter: '40mm',
          movement: 'Swiss Mechanical Automatic',
          waterResistance: '100m / 10 ATM',
          strapMaterial: 'Handcrafted Italian Calf Leather',
          imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80',
          badge: 'New Arrival',
          inStock: true,
        }
      ] : undefined,
      // Turkish Zaika Restaurant Standard Menu Defaults
      restaurantLoadingAnimation: siteType === 'restaurant' ? true : undefined,
      restaurantMenu: siteType === 'restaurant' ? [
        {
          id: 'dish-1',
          name: 'Special Chicken Dum Biryani',
          category: 'Biryani & Rice',
          price: '280',
          description: 'Slow-cooked aromatic basmati rice layered with tender spiced chicken and saffron.',
          imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
          isVeg: false,
          badge: 'Signature Dish',
        },
        {
          id: 'dish-2',
          name: 'Paneer Butter Masala',
          category: 'Gravy & Curries',
          price: '240',
          description: 'Fresh cottage cheese simmered in rich buttery tomato and cashew gravy.',
          imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&auto=format&fit=crop&q=80',
          isVeg: true,
          badge: 'Chef Special',
        },
        {
          id: 'dish-3',
          name: 'Garlic Butter Naan',
          category: 'Tandoor Breads',
          price: '60',
          description: 'Traditional clay oven baked flatbread infused with roasted garlic and melted butter.',
          imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80',
          isVeg: true,
        }
      ] : undefined,
      // Wedding Card & Digital Invitation Defaults (10 Themes)
      weddingCard: siteType === 'wedding_card' ? {
        themeId: '1',
        groomName: 'Aarav Sharma',
        brideName: 'Ananya Verma',
        groomParents: 'Mr. Rajesh & Mrs. Sunita Sharma',
        brideParents: 'Mr. Vikram & Mrs. Meera Verma',
        weddingDate: '2026-12-18',
        venueName: 'The Grand Heritage Palace',
        venueAddress: 'Near Gateway Circle, Marine Drive, Mumbai',
        venueMapUrl: 'https://maps.google.com',
        rsvpPhone: cleanPhone,
        weddingHashtag: '#AaravWedsAnanya',
        events: [
          { id: 'ev-1', name: 'Mehendi & Sangeet', date: 'Dec 17, 2026', time: '6:30 PM Onwards', venue: 'Royal Ballroom' },
          { id: 'ev-2', name: 'Wedding Muhurat', date: 'Dec 18, 2026', time: '11:00 AM', venue: 'Heritage Mandap' },
          { id: 'ev-3', name: 'Grand Reception Dinner', date: 'Dec 18, 2026', time: '7:30 PM', venue: 'Palace Lawns' }
        ]
      } : undefined,
      // Tuition & Coaching Academy Defaults
      tuition: siteType === 'tuition' ? {
        academyName: name,
        tagline: 'Excellence in Academics & Competitive Exam Foundation',
        standardsCovered: 'Class 8th to 12th • CBSE / ICSE / State Board • NEET & JEE',
        admissionHelpline: cleanPhone,
        resultsHighlight: '98.6% Top Score in 2024 Boards • 45+ NEET / JEE Selections',
        batches: [
          { id: 'b-1', className: 'Class 10th Board Mastery', subjects: 'Mathematics, Science & English', timing: 'Mon - Fri: 5:00 PM - 7:00 PM', monthlyFee: '2,500', annualFee: '26,000' },
          { id: 'b-2', className: 'Class 11th - 12th Science (PCM/B)', subjects: 'Physics, Chemistry, Maths & Biology', timing: 'Daily: 7:00 AM - 10:00 AM', monthlyFee: '4,000', annualFee: '42,000' }
        ]
      } : undefined,
      // Boutique Fashion Collection Defaults
      boutiqueLookbook: siteType === 'boutique' ? [
        {
          id: 'btq-1',
          name: 'Handcrafted Chanderi Silk Saree',
          price: '3,899',
          currency: '₹',
          description: 'Pure Chanderi silk with antique gold zari border and handcrafted motifs.',
          imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
          badge: 'Bridal Collection',
          inStock: true,
        },
        {
          id: 'btq-2',
          name: 'Royal Velvet Embroidered Anarkali',
          price: '4,999',
          currency: '₹',
          description: 'Deep crimson velvet with intricate zardozi hand embroidery and matching dupatta.',
          imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80',
          badge: 'Limited Edition',
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
      cvLinkedinClickable: true,
      cvGithub: '',
      cvGithubClickable: true,
      cvWebsite: `https://${finalSlug}.linkal.in`,
      cvWebsiteClickable: true,
      cvSummary: 'A brief professional summary highlighting key strengths, background, and career accomplishments.',
      cvExperiences: (siteType === 'cv' || siteType === 'portfolio') ? [
        {
          id: 'exp-1',
          company: 'Company ABC',
          role: 'Role / Position',
          period: '2022 — Present',
          location: 'City, Country',
          description: 'Key responsibilities, accomplishments, and quantifiable impact.',
          companyUrl: '',
          isCompanyUrlClickable: true,
        }
      ] : undefined,
      cvEducations: (siteType === 'cv' || siteType === 'portfolio') ? [
        {
          id: 'edu-1',
          institution: 'University / Institute Name',
          degree: 'Degree / Course Name',
          year: '2018 — 2022',
          honors: ''
        }
      ] : undefined,
      cvSkills: (siteType === 'cv' || siteType === 'portfolio') ? [
        'Skill 1',
        'Skill 2',
        'Skill 3',
        'Project Planning',
        'Communication'
      ] : undefined,
      cvProjects: (siteType === 'cv' || siteType === 'portfolio') ? [
        {
          id: 'proj-1',
          title: 'Project Title Alpha',
          description: 'Designed and implemented end-to-end functionality to meet client objectives.',
          link: `https://${finalSlug}.linkal.in`,
          isLinkClickable: true,
          techStack: 'Tools & Technologies'
        }
      ] : undefined,
      cvCertifications: (siteType === 'cv' || siteType === 'portfolio') ? [
        {
          id: 'cert-1',
          name: 'Certification Title',
          issuer: 'Issuing Organization',
          year: '2024',
          url: '',
          isUrlClickable: true,
        }
      ] : undefined,
      cvCustomCategories: siteType === 'cv' ? [
        {
          id: 'cat-languages',
          name: 'Languages',
          visible: true,
          items: [
            { id: 'lang-1', title: 'English', subtitle: 'Professional Working Proficiency' },
            { id: 'lang-2', title: 'Hindi', subtitle: 'Native / Bilingual Proficiency' }
          ]
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
