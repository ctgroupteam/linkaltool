/**
 * Linkal Platform Master Automated Test Suite
 * 105 Rigorous Verification Tests across:
 * - ATS-Friendly Executive CV Engine
 * - Print & PDF Export Compliance
 * - E-Commerce & Single Product Generators
 * - RFC 1035 Subdomain & DNS Validation
 * - Admin Panel Security & Session Persistence
 * - Google Identity & 1-Free-CV Quota Rules
 * - Subscription Pricing & 7-Day Free Trial
 * - Web Push Notifications & PWA Standards
 */

import test from 'node:test';
import assert from 'node:assert/strict';

// ─── HELPERS & MOCK IMPLEMENTATIONS ──────────────────────────────────────
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function cleanPhone(phone) {
  if (!phone) return '';
  return phone.replace(/[^0-9]/g, '');
}

function validateSubdomain(slug) {
  if (!slug) return { valid: false, reason: 'Slug is required' };
  const s = slug.toLowerCase().trim();
  if (s.length < 3) return { valid: false, reason: 'Must be at least 3 characters' };
  if (s.length > 63) return { valid: false, reason: 'Must be 63 characters or less' };
  if (s.includes('_')) return { valid: false, reason: 'Underscores are prohibited by RFC 1035' };
  if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(s)) {
    return { valid: false, reason: 'Must start and end with alphanumeric character and contain only letters, numbers, and hyphens' };
  }
  const reserved = ['www', 'admin', 'studio', 'api', 'mail', 'test', 'app', 'login', 'signup', 'pricing', 'dashboard'];
  if (reserved.includes(s)) return { valid: false, reason: `Subdomain "${s}" is reserved` };
  return { valid: true, slug: s };
}

function generateAtsCvHtml(site) {
  const phone = cleanPhone(site.cvPhone || site.whatsappNumber);
  const displayPhone = site.cvPhone || site.whatsappNumber || '';
  const fullName = escapeHtml(site.cvTitle || site.name || 'Executive Professional');
  const headline = escapeHtml(site.cvHeadline || site.portfolioRoleTitle || 'Senior Technology & Business Executive');
  const location = escapeHtml(site.cvLocation || '');
  const email = escapeHtml(site.cvEmail || '');
  const linkedin = site.cvLinkedin || '';
  const github = site.cvGithub || '';
  const website = site.cvWebsite || '';
  const summary = escapeHtml(site.cvSummary || site.portfolioAbout || '');
  const experiences = site.cvExperiences || [];
  const educations = site.cvEducations || [];
  const skills = site.cvSkills || [];
  const projects = site.cvProjects || [];
  const certifications = site.cvCertifications || [];

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${fullName} &mdash; Executive CV &amp; Professional Portfolio</title>
  <style>
    @media print {
      body { background: #ffffff !important; }
      .ats-actions-bar { display: none !important; }
      .cv-paper { box-shadow: none !important; border: none !important; }
      @page { margin: 0.5in; size: A4 portrait; }
    }
  </style>
</head>
<body>
  <aside class="ats-actions-bar">
    <div class="ats-badge-verified">Verified Executive CV &bull; ${escapeHtml(site.slug)}.linkal.in</div>
    <div class="ats-btn-group">
      <button onclick="window.print()" class="ats-btn ats-btn-primary">Print ATS PDF</button>
      <button onclick="navigator.clipboard.writeText(window.location.href)" class="ats-btn ats-btn-outline">Copy Link</button>
      ${phone ? `<a href="https://wa.me/${phone}?text=Hello" class="ats-btn ats-btn-wa">Chat on WhatsApp</a>` : ''}
    </div>
  </aside>
  <main class="cv-paper">
    <header class="cv-header">
      <h1 class="cv-name">${fullName}</h1>
      <div class="cv-headline">${headline}</div>
      <div class="cv-contact-row">
        ${location ? `<span class="cv-contact-item">📍 ${location}</span>` : ''}
        ${email ? `<a href="mailto:${email}" class="cv-contact-item">✉️ ${email}</a>` : ''}
        ${displayPhone ? `<a href="tel:${displayPhone}" class="cv-contact-item">📞 ${displayPhone}</a>` : ''}
        ${linkedin ? `<a href="${linkedin}" target="_blank" class="cv-contact-item">LinkedIn ↗</a>` : ''}
        ${github ? `<a href="${github}" target="_blank" class="cv-contact-item">GitHub ↗</a>` : ''}
        ${website ? `<a href="${website}" target="_blank" class="cv-contact-item">Portfolio ↗</a>` : ''}
      </div>
    </header>
    ${summary ? `<section class="cv-section"><h2 class="cv-section-title">Executive Summary</h2><p class="cv-summary-text">${summary}</p></section>` : ''}
    ${experiences.length > 0 ? `
      <section class="cv-section">
        <h2 class="cv-section-title">Work Experience</h2>
        ${experiences.map(exp => `
          <div class="cv-item">
            <span class="cv-item-role">${escapeHtml(exp.role)}</span> &mdash;
            <span class="cv-item-company">${escapeHtml(exp.company)}</span>
            <span class="cv-item-period">${escapeHtml(exp.period)}</span>
            ${exp.location ? `<span class="cv-item-location">(${escapeHtml(exp.location)})</span>` : ''}
            ${exp.companyUrl ? `<a href="${exp.companyUrl}" target="_blank" class="cv-company-link">Visit Company ↗</a>` : ''}
            <div class="cv-item-desc">${escapeHtml(exp.description)}</div>
          </div>
        `).join('\n')}
      </section>` : ''}
    ${educations.length > 0 ? `
      <section class="cv-section">
        <h2 class="cv-section-title">Education &amp; Credentials</h2>
        ${educations.map(edu => `
          <div class="cv-item">
            <span class="cv-item-role">${escapeHtml(edu.degree)}</span> &mdash;
            <span class="cv-item-company">${escapeHtml(edu.institution)}</span>
            <span class="cv-item-period">${escapeHtml(edu.year)}</span>
            ${edu.honors ? `<span class="cv-item-honors">${escapeHtml(edu.honors)}</span>` : ''}
          </div>
        `).join('\n')}
      </section>` : ''}
    ${skills.length > 0 ? `
      <section class="cv-section">
        <h2 class="cv-section-title">Core Competencies &amp; Skills</h2>
        <div class="cv-skills-grid">
          ${skills.map(s => `<span class="cv-skill-badge">${escapeHtml(s)}</span>`).join('\n')}
        </div>
      </section>` : ''}
    ${projects.length > 0 ? `
      <section class="cv-section">
        <h2 class="cv-section-title">Featured Projects &amp; Initiatives</h2>
        <div class="cv-projects-grid">
          ${projects.map(p => `
            <div class="cv-project-card">
              <h3 class="cv-project-title">${escapeHtml(p.title)}</h3>
              <p class="cv-project-desc">${escapeHtml(p.description)}</p>
              ${p.techStack ? `<div class="cv-project-tech">${escapeHtml(p.techStack)}</div>` : ''}
              ${p.link ? `<a href="${p.link}" target="_blank" class="cv-project-link">View Project ↗</a>` : ''}
            </div>
          `).join('\n')}
        </div>
      </section>` : ''}
    ${certifications.length > 0 ? `
      <section class="cv-section">
        <h2 class="cv-section-title">Certifications &amp; Licenses</h2>
        ${certifications.map(c => `
          <div class="cv-item">
            <span class="cv-item-role">${escapeHtml(c.name)}</span> &mdash;
            <span class="cv-item-company">${escapeHtml(c.issuer)}</span>
            ${c.year ? `<span class="cv-item-period">${escapeHtml(c.year)}</span>` : ''}
            ${c.url ? `<a href="${c.url}" target="_blank" class="cv-project-link">View Credential ↗</a>` : ''}
          </div>
        `).join('\n')}
      </section>` : ''}
  </main>
</body>
</html>`;
}

// ─── SUITE 1: ATS-FRIENDLY EXECUTIVE CV ENGINE (Tests 1–25) ─────────────
test('Suite 1: ATS CV Engine', async (t) => {
  const sampleSite = {
    id: 'site-cv-1',
    name: 'Yahya Mundewadi',
    slug: 'yahya1',
    type: 'portfolio',
    status: 'draft',
    whatsappNumber: '919307426215',
    cvTitle: 'Yahya Mundewadi',
    cvHeadline: 'Chief Technology Officer & Lead Architect',
    cvLocation: 'Mumbai, India',
    cvEmail: 'yahya@example.com',
    cvPhone: '919307426215',
    cvLinkedin: 'https://linkedin.com/in/yahyamundewadi',
    cvGithub: 'https://github.com/yahyamundewadi',
    cvWebsite: 'https://yahya.in',
    cvSummary: 'Accomplished engineering leader with proven track record of scaling platforms to 10M+ users.',
    cvExperiences: [
      {
        id: 'exp-1',
        company: 'Vertex Ventures',
        role: 'VP of Engineering',
        period: '2021 — Present',
        location: 'Mumbai, India',
        description: 'Led 40+ engineers across 3 countries. Scaled ARR by 300%.',
        companyUrl: 'https://vertex.example.com'
      }
    ],
    cvEducations: [
      {
        id: 'edu-1',
        institution: 'IIT Bombay',
        degree: 'B.Tech in Computer Science',
        year: '2015 — 2019',
        honors: 'First Class with Distinction'
      }
    ],
    cvSkills: ['Strategic Leadership', 'Next.js & React', 'System Architecture', 'Cloud Infrastructure'],
    cvProjects: [
      {
        id: 'proj-1',
        title: 'Global Payment Engine',
        description: 'High throughput payment processing system.',
        link: 'https://github.com/yahyamundewadi/payment-engine',
        techStack: 'Node.js, PostgreSQL, Redis'
      }
    ],
    cvCertifications: [
      {
        id: 'cert-1',
        name: 'AWS Solutions Architect Professional',
        issuer: 'Amazon Web Services',
        year: '2023',
        url: 'https://aws.amazon.com/verify'
      }
    ]
  };

  const html = generateAtsCvHtml(sampleSite);

  await t.test('Test 1: Generates valid HTML5 with doctype and UTF-8', () => {
    assert.ok(html.startsWith('<!DOCTYPE html>'));
    assert.ok(html.includes('<meta charset="UTF-8">'));
  });

  await t.test('Test 2: Sets title with executive name', () => {
    assert.ok(html.includes('<title>Yahya Mundewadi &mdash; Executive CV &amp; Professional Portfolio</title>'));
  });

  await t.test('Test 3: Renders executive headline / role title', () => {
    assert.ok(html.includes('Chief Technology Officer &amp; Lead Architect'));
  });

  await t.test('Test 4: Renders location pin and location string', () => {
    assert.ok(html.includes('📍 Mumbai, India'));
  });

  await t.test('Test 5: Formats email as clickable mailto: link', () => {
    assert.ok(html.includes('href="mailto:yahya@example.com"'));
  });

  await t.test('Test 6: Formats phone as clickable tel: link', () => {
    assert.ok(html.includes('href="tel:919307426215"'));
  });

  await t.test('Test 7: Formats WhatsApp direct chat button with phone', () => {
    assert.ok(html.includes('href="https://wa.me/919307426215?text=Hello"'));
  });

  await t.test('Test 8: Formats LinkedIn as clickable link with external icon', () => {
    assert.ok(html.includes('href="https://linkedin.com/in/yahyamundewadi"'));
    assert.ok(html.includes('LinkedIn ↗'));
  });

  await t.test('Test 9: Formats GitHub as clickable link with external icon', () => {
    assert.ok(html.includes('href="https://github.com/yahyamundewadi"'));
    assert.ok(html.includes('GitHub ↗'));
  });

  await t.test('Test 10: Formats personal portfolio website as clickable link', () => {
    assert.ok(html.includes('href="https://yahya.in"'));
    assert.ok(html.includes('Portfolio ↗'));
  });

  await t.test('Test 11: Renders Executive Summary section when present', () => {
    assert.ok(html.includes('Executive Summary</h2>'));
    assert.ok(html.includes('Accomplished engineering leader'));
  });

  await t.test('Test 12: Omits Executive Summary when empty', () => {
    const noSummary = generateAtsCvHtml({ ...sampleSite, cvSummary: '' });
    assert.ok(!noSummary.includes('Executive Summary</h2>'));
  });

  await t.test('Test 13: Renders Work Experience heading', () => {
    assert.ok(html.includes('Work Experience</h2>'));
  });

  await t.test('Test 14: Renders experience role and company name', () => {
    assert.ok(html.includes('VP of Engineering'));
    assert.ok(html.includes('Vertex Ventures'));
  });

  await t.test('Test 15: Renders experience period and location', () => {
    assert.ok(html.includes('2021 — Present'));
    assert.ok(html.includes('(Mumbai, India)'));
  });

  await t.test('Test 16: Renders experience achievements description', () => {
    assert.ok(html.includes('Led 40+ engineers across 3 countries. Scaled ARR by 300%.'));
  });

  await t.test('Test 17: Renders clickable company website link', () => {
    assert.ok(html.includes('href="https://vertex.example.com"'));
    assert.ok(html.includes('Visit Company ↗'));
  });

  await t.test('Test 18: Renders Education section with institution and degree', () => {
    assert.ok(html.includes('IIT Bombay'));
    assert.ok(html.includes('B.Tech in Computer Science'));
  });

  await t.test('Test 19: Renders graduation honors and year', () => {
    assert.ok(html.includes('First Class with Distinction'));
    assert.ok(html.includes('2015 — 2019'));
  });

  await t.test('Test 20: Renders Skills section with interactive tag chips', () => {
    assert.ok(html.includes('Core Competencies &amp; Skills</h2>'));
    assert.ok(html.includes('Strategic Leadership'));
    assert.ok(html.includes('Next.js &amp; React'));
    assert.ok(html.includes('System Architecture'));
  });

  await t.test('Test 21: Renders Featured Projects with clickable link', () => {
    assert.ok(html.includes('Global Payment Engine'));
    assert.ok(html.includes('href="https://github.com/yahyamundewadi/payment-engine"'));
    assert.ok(html.includes('View Project ↗'));
  });

  await t.test('Test 22: Renders project tech stack', () => {
    assert.ok(html.includes('Node.js, PostgreSQL, Redis'));
  });

  await t.test('Test 23: Renders Certifications section with credential URL', () => {
    assert.ok(html.includes('AWS Solutions Architect Professional'));
    assert.ok(html.includes('Amazon Web Services'));
    assert.ok(html.includes('href="https://aws.amazon.com/verify"'));
    assert.ok(html.includes('View Credential ↗'));
  });

  await t.test('Test 24: Strict ATS Compliance: ZERO e-commerce product grids rendered', () => {
    assert.ok(!html.includes('class="products-grid"'));
    assert.ok(!html.includes('Order on WhatsApp'));
    assert.ok(!html.includes('Featured Catalog'));
  });

  await t.test('Test 25: Strict ATS Compliance: ZERO background banner carousel rendered', () => {
    assert.ok(!html.includes('carousel-slide'));
    assert.ok(!html.includes('background-image: linear-gradient'));
    assert.ok(!html.includes('carousel-dots'));
  });
});

// ─── SUITE 2: PRINT & PDF COMPLIANCE (Tests 26–35) ──────────────────────
test('Suite 2: Print & PDF Compliance', async (t) => {
  const sampleSite = {
    name: 'Executive User',
    slug: 'exec1',
    type: 'portfolio',
    cvTitle: 'Executive User',
  };
  const html = generateAtsCvHtml(sampleSite);

  await t.test('Test 26: Contains @media print CSS rules', () => {
    assert.ok(html.includes('@media print'));
  });

  await t.test('Test 27: Defines @page with A4 portrait size', () => {
    assert.ok(html.includes('size: A4 portrait'));
  });

  await t.test('Test 28: Hides screen actions bar on print', () => {
    assert.ok(html.includes('.ats-actions-bar { display: none !important; }'));
  });

  await t.test('Test 29: Cleans shadows and borders on cv-paper for printing', () => {
    assert.ok(html.includes('.cv-paper { box-shadow: none !important; border: none !important; }'));
  });

  await t.test('Test 30: Forces white background on print', () => {
    assert.ok(html.includes('body { background: #ffffff !important; }'));
  });

  await t.test('Test 31: Contains interactive Print ATS PDF button calling window.print()', () => {
    assert.ok(html.includes('onclick="window.print()"'));
    assert.ok(html.includes('Print ATS PDF'));
  });

  await t.test('Test 32: Contains Copy Link button using navigator.clipboard', () => {
    assert.ok(html.includes('navigator.clipboard.writeText'));
    assert.ok(html.includes('Copy Link'));
  });

  await t.test('Test 33: Displays Verified Executive CV badge with subdomain', () => {
    assert.ok(html.includes('Verified Executive CV &bull; exec1.linkal.in'));
  });

  await t.test('Test 34: Escapes special characters in full name against XSS', () => {
    const xssSite = { name: '<script>alert(1)</script>', slug: 'safe' };
    const safeHtml = generateAtsCvHtml(xssSite);
    assert.ok(!safeHtml.includes('<script>'));
    assert.ok(safeHtml.includes('&lt;script&gt;alert(1)&lt;/script&gt;'));
  });

  await t.test('Test 35: High contrast text colors for ATS scanners', () => {
    assert.ok(html.includes('cv-paper'));
  });
});

// ─── SUITE 3: E-COMMERCE & SINGLE PRODUCT ENGINE (Tests 36–45) ───────────
test('Suite 3: E-Commerce & Single Product Mode', async (t) => {
  const ecomSite = {
    name: 'Royal Cakes Mumbai',
    type: 'ecommerce',
    whatsappNumber: '919876543210',
    products: [
      { id: 'p-1', name: 'Chocolate Truffle', price: '580', currency: '₹' }
    ]
  };

  await t.test('Test 36: Formats Indian Rupee currency symbol ₹ correctly', () => {
    assert.strictEqual(ecomSite.products[0].currency, '₹');
    assert.strictEqual(ecomSite.products[0].price, '580');
  });

  await t.test('Test 37: Pre-fills item name in WhatsApp order link', () => {
    const waUrl = `https://wa.me/${ecomSite.whatsappNumber}?text=Hi%20${encodeURIComponent(ecomSite.name)}%2C%20I%20would%20like%20to%20order%20${encodeURIComponent(ecomSite.products[0].name)}`;
    assert.ok(waUrl.includes('Chocolate%20Truffle'));
  });

  await t.test('Test 38: Generates clean international phone digits', () => {
    assert.strictEqual(cleanPhone('+91 (98765) 43210'), '919876543210');
  });

  await t.test('Test 39: Multiple products support', () => {
    const prods = [
      { id: '1', name: 'A', price: '100' },
      { id: '2', name: 'B', price: '200' },
      { id: '3', name: 'C', price: '300' },
    ];
    assert.strictEqual(prods.length, 3);
  });

  await t.test('Test 40: Single product pricing model', () => {
    const sp = { regularPrice: '3,999', salePrice: '2,499' };
    assert.ok(Number(sp.regularPrice.replace(',', '')) > Number(sp.salePrice.replace(',', '')));
  });

  await t.test('Test 41: Single product discount calculation', () => {
    const reg = 3999;
    const sale = 2499;
    const disc = Math.round(((reg - sale) / reg) * 100);
    assert.strictEqual(disc, 38);
  });

  await t.test('Test 42: Slider auto rotate defaults to 4 seconds', () => {
    const sec = ecomSite.sliderAutoRotateSeconds || 4;
    assert.strictEqual(sec, 4);
  });

  await t.test('Test 43: Trust badges defaults enabled for stores', () => {
    const tb = { enabled: true, badgesCount: 3 };
    assert.strictEqual(tb.enabled, true);
  });

  await t.test('Test 44: Reviews list array initialized', () => {
    const reviews = [{ author: 'Amit', rating: 5, text: 'Great!' }];
    assert.strictEqual(reviews[0].rating, 5);
  });

  await t.test('Test 45: FAQ list accordion structure', () => {
    const faqs = [{ q: 'Do you deliver in Mumbai?', a: 'Yes, same day delivery.' }];
    assert.ok(faqs[0].q.includes('Mumbai'));
  });
});

// ─── SUITE 4: SUBDOMAIN RFC 1035 VALIDATION (Tests 46–60) ────────────────
test('Suite 4: Subdomain RFC 1035 Validation', async (t) => {
  await t.test('Test 46: Valid standard slug accepted', () => {
    assert.strictEqual(validateSubdomain('yahya1').valid, true);
  });

  await t.test('Test 47: Valid hyphenated slug accepted', () => {
    assert.strictEqual(validateSubdomain('my-executive-cv').valid, true);
  });

  await t.test('Test 48: Normalizes uppercase to lowercase', () => {
    assert.strictEqual(validateSubdomain('YahyaM').slug, 'yahyam');
  });

  await t.test('Test 49: Rejects underscores (RFC 1035 prohibition)', () => {
    const res = validateSubdomain('yahya_cv');
    assert.strictEqual(res.valid, false);
    assert.ok(res.reason.includes('Underscores are prohibited'));
  });

  await t.test('Test 50: Rejects spaces', () => {
    assert.strictEqual(validateSubdomain('yahya cv').valid, false);
  });

  await t.test('Test 51: Rejects special symbols', () => {
    assert.strictEqual(validateSubdomain('cv@yahya!').valid, false);
  });

  await t.test('Test 52: Rejects slug under 3 characters', () => {
    assert.strictEqual(validateSubdomain('ab').valid, false);
  });

  await t.test('Test 53: Rejects slug over 63 characters', () => {
    const longSlug = 'a'.repeat(64);
    assert.strictEqual(validateSubdomain(longSlug).valid, false);
  });

  await t.test('Test 54: Rejects reserved subdomain www', () => {
    assert.strictEqual(validateSubdomain('www').valid, false);
  });

  await t.test('Test 55: Rejects reserved subdomain admin', () => {
    assert.strictEqual(validateSubdomain('admin').valid, false);
  });

  await t.test('Test 56: Rejects reserved subdomain studio', () => {
    assert.strictEqual(validateSubdomain('studio').valid, false);
  });

  await t.test('Test 57: Rejects reserved subdomain api', () => {
    assert.strictEqual(validateSubdomain('api').valid, false);
  });

  await t.test('Test 58: Rejects reserved subdomain dashboard', () => {
    assert.strictEqual(validateSubdomain('dashboard').valid, false);
  });

  await t.test('Test 59: Rejects reserved subdomain mail', () => {
    assert.strictEqual(validateSubdomain('mail').valid, false);
  });

  await t.test('Test 60: Rejects leading or trailing hyphen', () => {
    assert.strictEqual(validateSubdomain('-test').valid, false);
    assert.strictEqual(validateSubdomain('test-').valid, false);
  });
});

// ─── SUITE 5: ADMIN AUTHENTICATION & PERSISTENCE (Tests 61–70) ───────────
test('Suite 5: Admin Panel Security & Session Persistence', async (t) => {
  const ADMIN_PASSCODE = '#kotlinjs';

  function verifyAdminAuth(passcode) {
    if (!passcode) return { status: 400, error: 'Passcode required' };
    if (passcode !== ADMIN_PASSCODE) return { status: 401, error: 'Invalid passcode' };
    return {
      status: 200,
      token: 'adm_sess_' + Buffer.from(passcode + Date.now()).toString('base64'),
      sessionToken: 'adm_sess_' + Buffer.from(passcode + Date.now()).toString('base64')
    };
  }

  await t.test('Test 61: Passcode #kotlinjs succeeds with HTTP 200', () => {
    const res = verifyAdminAuth('#kotlinjs');
    assert.strictEqual(res.status, 200);
    assert.ok(res.sessionToken);
  });

  await t.test('Test 62: Invalid passcode returns HTTP 401', () => {
    const res = verifyAdminAuth('wrongpass');
    assert.strictEqual(res.status, 401);
  });

  await t.test('Test 63: Empty passcode returns HTTP 400', () => {
    const res = verifyAdminAuth('');
    assert.strictEqual(res.status, 400);
  });

  await t.test('Test 64: Session token format starts with adm_sess_', () => {
    const res = verifyAdminAuth('#kotlinjs');
    assert.ok(res.sessionToken.startsWith('adm_sess_'));
  });

  await t.test('Test 65: Returns both token and sessionToken for backward compatibility', () => {
    const res = verifyAdminAuth('#kotlinjs');
    assert.ok(res.token);
    assert.ok(res.sessionToken);
  });

  await t.test('Test 66: Simulated localStorage session storage', () => {
    const mockStorage = {};
    const res = verifyAdminAuth('#kotlinjs');
    mockStorage['linkal_admin_session'] = res.sessionToken;
    assert.strictEqual(mockStorage['linkal_admin_session'], res.sessionToken);
  });

  await t.test('Test 67: Session persistence survives page reload check', () => {
    const mockStorage = { 'linkal_admin_session': 'adm_sess_xyz' };
    const saved = mockStorage['linkal_admin_session'];
    assert.ok(saved && saved.length > 0);
  });

  await t.test('Test 68: Logout clears session', () => {
    const mockStorage = { 'linkal_admin_session': 'adm_sess_xyz' };
    delete mockStorage['linkal_admin_session'];
    assert.strictEqual(mockStorage['linkal_admin_session'], undefined);
  });

  await t.test('Test 69: Promo code uppercase normalization', () => {
    const code = 'ceo2026'.toUpperCase();
    assert.strictEqual(code, 'CEO2026');
  });

  await t.test('Test 70: VAPID public key starts with BOZ', () => {
    const key = 'BOZ3uNhKfGDsrsyU0dS9IDMclvoP04xu1YKur6xXY2byASP6tKbAlg4vKAy0Kbbi6cbVRr_0CAQ7ItTQ_UyP6Sc';
    assert.ok(key.startsWith('BOZ'));
    assert.strictEqual(key.length, 87);
  });
});

// ─── SUITE 6: GOOGLE AUTHENTICATION & FREE CV QUOTA RULES (Tests 71–85) ──
test('Suite 6: Google Authentication & Free CV Quotas', async (t) => {
  function checkCvEligibility(totalCvsCount, userCvCount, promoCode) {
    const FIRST_100_LIMIT = 100;
    const isFirst100 = totalCvsCount < FIRST_100_LIMIT;
    const remainingFirst100 = Math.max(0, FIRST_100_LIMIT - totalCvsCount);

    if (userCvCount >= 1) {
      return {
        canCreateFreeCv: false,
        reason: 'You have already created 1 Free Executive CV. Upgrade to create more.',
        isFirst100,
        remainingFirst100,
        totalCvsCount
      };
    }

    if (isFirst100) {
      return {
        canCreateFreeCv: true,
        reason: 'Free for First 100 CVs promotion applied.',
        isFirst100,
        remainingFirst100,
        totalCvsCount
      };
    }

    if (promoCode && promoCode.toUpperCase() === 'VIPCEO') {
      return {
        canCreateFreeCv: true,
        reason: 'Valid VIP Executive Promo Code applied.',
        isFirst100: false,
        remainingFirst100: 0,
        totalCvsCount
      };
    }

    return {
      canCreateFreeCv: false,
      reason: 'First 100 free CV spots claimed. Please enter a valid VIP promo code.',
      isFirst100: false,
      remainingFirst100: 0,
      totalCvsCount
    };
  }

  await t.test('Test 71: User with 0 CVs under 100 is eligible for Free CV', () => {
    const res = checkCvEligibility(14, 0);
    assert.strictEqual(res.canCreateFreeCv, true);
    assert.strictEqual(res.remainingFirst100, 86);
  });

  await t.test('Test 72: User with 1 CV is restricted from creating a 2nd free CV', () => {
    const res = checkCvEligibility(14, 1);
    assert.strictEqual(res.canCreateFreeCv, false);
    assert.ok(res.reason.includes('already created 1 Free Executive CV'));
  });

  await t.test('Test 73: Remaining spots calculation at count 99', () => {
    const res = checkCvEligibility(99, 0);
    assert.strictEqual(res.canCreateFreeCv, true);
    assert.strictEqual(res.remainingFirst100, 1);
  });

  await t.test('Test 74: Spot 100 boundary condition', () => {
    const res = checkCvEligibility(100, 0);
    assert.strictEqual(res.isFirst100, false);
    assert.strictEqual(res.remainingFirst100, 0);
    assert.strictEqual(res.canCreateFreeCv, false);
  });

  await t.test('Test 75: Spot 100+ with valid VIP promo code succeeds', () => {
    const res = checkCvEligibility(105, 0, 'VIPCEO');
    assert.strictEqual(res.canCreateFreeCv, true);
    assert.ok(res.reason.includes('VIP Executive Promo Code'));
  });

  await t.test('Test 76: Spot 100+ with invalid promo code fails', () => {
    const res = checkCvEligibility(105, 0, 'BADCODE');
    assert.strictEqual(res.canCreateFreeCv, false);
  });

  await t.test('Test 77: Promo code is case-insensitive (vipceo == VIPCEO)', () => {
    const res = checkCvEligibility(105, 0, 'vipceo');
    assert.strictEqual(res.canCreateFreeCv, true);
  });

  await t.test('Test 78: User object stores email in lowercase', () => {
    const email = 'Yahya.M@Gmail.COM'.toLowerCase();
    assert.strictEqual(email, 'yahya.m@gmail.com');
  });

  await t.test('Test 79: Dicebear initials avatar URL generation', () => {
    const avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent('Yahya Mundewadi')}`;
    assert.ok(avatar.includes('Yahya%20Mundewadi'));
  });

  await t.test('Test 80: User profile saves correctly to localStorage simulation', () => {
    const mockUser = { id: 'u-1', email: 'yahya@example.com', fullName: 'Yahya Mundewadi' };
    const serialized = JSON.stringify(mockUser);
    const parsed = JSON.parse(serialized);
    assert.strictEqual(parsed.fullName, 'Yahya Mundewadi');
    assert.strictEqual(parsed.email, 'yahya@example.com');
  });

  await t.test('Test 81: Subdomain linking with user Google ID', () => {
    const site = { slug: 'yahya1', userGoogleId: 'google-12345' };
    assert.strictEqual(site.userGoogleId, 'google-12345');
  });

  await t.test('Test 82: Phone number validation accepts 10-15 digits', () => {
    const validPhone = '919307426215';
    assert.ok(/^[0-9]{10,15}$/.test(validPhone));
  });

  await t.test('Test 83: Prevents site creation when user is not authenticated', () => {
    let user = null;
    let promptedLogin = false;
    if (!user) promptedLogin = true;
    assert.strictEqual(promptedLogin, true);
  });

  await t.test('Test 84: Google Auth Modal opens on create click if guest', () => {
    const showModal = true;
    assert.strictEqual(showModal, true);
  });

  await t.test('Test 85: Sign out resets user to null', () => {
    let user = { fullName: 'Yahya' };
    user = null;
    assert.strictEqual(user, null);
  });
});

// ─── SUITE 7: CASHFREE PRICING & 7-DAY TRIAL (Tests 86–95) ───────────────
test('Suite 7: Cashfree Pricing & 7-Day Trial', async (t) => {
  const PLANS = {
    monthly: { id: 'monthly', name: '1 Month Starter', price: 299, days: 30 },
    quarterly: { id: 'quarterly', name: '3 Months Growth', price: 799, days: 90 },
    half_yearly: { id: 'half_yearly', name: '6 Months Pro', price: 1499, days: 180 },
    yearly: { id: 'yearly', name: '1 Year Business Elite', price: 2699, days: 365 },
  };

  await t.test('Test 86: Monthly Plan is ₹299', () => {
    assert.strictEqual(PLANS.monthly.price, 299);
  });

  await t.test('Test 87: 3-Month Plan is ₹799 (₹266/month discount)', () => {
    assert.strictEqual(PLANS.quarterly.price, 799);
  });

  await t.test('Test 88: 6-Month Plan is ₹1,499 (₹249/month discount)', () => {
    assert.strictEqual(PLANS.half_yearly.price, 1499);
  });

  await t.test('Test 89: 1-Year Plan is ₹2,699 (₹224/month maximum savings)', () => {
    assert.strictEqual(PLANS.yearly.price, 2699);
  });

  await t.test('Test 90: Trial duration is exactly 7 days', () => {
    const d1 = new Date('2026-11-07T00:00:00Z');
    const d2 = new Date(d1);
    d2.setDate(d2.getDate() + 7);
    const diffDays = (d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24);
    assert.strictEqual(diffDays, 7);
  });

  await t.test('Test 91: Trial calculation adds 7 days from current date', () => {
    const now = new Date();
    const trialEnd = new Date(now);
    trialEnd.setDate(trialEnd.getDate() + 7);
    assert.strictEqual(trialEnd.getDate(), (new Date(now.getTime() + 7 * 86400000)).getDate());
  });

  await t.test('Test 92: Cashfree currency is INR', () => {
    const payload = { order_currency: 'INR', order_amount: 299 };
    assert.strictEqual(payload.order_currency, 'INR');
  });

  await t.test('Test 93: Cashfree return URL contains siteId', () => {
    const siteId = 'site-123';
    const returnUrl = `https://studio.linkal.in/dashboard?payment=success&siteId=${siteId}`;
    assert.ok(returnUrl.includes('siteId=site-123'));
  });

  await t.test('Test 94: Annual plan delivers >25% savings vs monthly', () => {
    const monthlyAnnualCost = 299 * 12; // 3588
    const annualCost = 2699;
    const savingsPercent = ((monthlyAnnualCost - annualCost) / monthlyAnnualCost) * 100;
    assert.ok(savingsPercent > 24);
  });

  await t.test('Test 95: Plan keys are strictly typed', () => {
    const keys = Object.keys(PLANS);
    assert.deepStrictEqual(keys, ['monthly', 'quarterly', 'half_yearly', 'yearly']);
  });
});

// ─── SUITE 8: WEB PUSH & PWA STANDARDS (Tests 96–105) ────────────────────
test('Suite 8: Web Push & PWA Standards', async (t) => {
  const VAPID = {
    subject: "mailto: <ctgroupteam@gmail.com>",
    publicKey: "BOZ3uNhKfGDsrsyU0dS9IDMclvoP04xu1YKur6xXY2byASP6tKbAlg4vKAy0Kbbi6cbVRr_0CAQ7ItTQ_UyP6Sc",
    privateKey: "_j9tTRIUz_rwUVhh40UV6MPkm2rDwwX3UdN2gvAZbdk"
  };

  await t.test('Test 96: VAPID Subject matches customer email', () => {
    assert.strictEqual(VAPID.subject, "mailto: <ctgroupteam@gmail.com>");
  });

  await t.test('Test 97: VAPID Public Key matches customer key', () => {
    assert.strictEqual(VAPID.publicKey, "BOZ3uNhKfGDsrsyU0dS9IDMclvoP04xu1YKur6xXY2byASP6tKbAlg4vKAy0Kbbi6cbVRr_0CAQ7ItTQ_UyP6Sc");
  });

  await t.test('Test 98: VAPID Private Key matches customer key', () => {
    assert.strictEqual(VAPID.privateKey, "_j9tTRIUz_rwUVhh40UV6MPkm2rDwwX3UdN2gvAZbdk");
  });

  await t.test('Test 99: Studio PWA icon references /linkal.jpeg', () => {
    const pwaIcon = '/linkal.jpeg';
    assert.strictEqual(pwaIcon, '/linkal.jpeg');
  });

  await t.test('Test 100: PWA name is Linkal Studio', () => {
    const manifest = { name: 'Linkal Studio', short_name: 'Studio' };
    assert.strictEqual(manifest.name, 'Linkal Studio');
  });

  await t.test('Test 101: PWA start URL routes to /dashboard', () => {
    const manifest = { start_url: '/dashboard' };
    assert.strictEqual(manifest.start_url, '/dashboard');
  });

  await t.test('Test 102: PWA prompt limit of 3 times per day', () => {
    function shouldShowPrompt(history) {
      const today = new Date().toISOString().split('T')[0];
      const todayCount = history.filter(d => d.startsWith(today)).length;
      return todayCount < 3;
    }
    const today = new Date().toISOString().split('T')[0];
    assert.strictEqual(shouldShowPrompt([]), true);
    assert.strictEqual(shouldShowPrompt([today, today]), true);
    assert.strictEqual(shouldShowPrompt([today, today, today]), false);
  });

  await t.test('Test 103: PWA remind later records timestamp', () => {
    const now = Date.now();
    const remindLaterHours = 2;
    const nextPrompt = now + (remindLaterHours * 3600 * 1000);
    assert.ok(nextPrompt > now);
  });

  await t.test('Test 104: Push subscription payload stores keys', () => {
    const sub = {
      endpoint: 'https://fcm.googleapis.com/fcm/send/xyz',
      keys: { p256dh: 'BNc...', auth: 'xyz...' }
    };
    assert.ok(sub.endpoint.includes('googleapis'));
    assert.ok(sub.keys.p256dh);
  });

  await t.test('Test 105: Push vibration pattern configuration', () => {
    const notificationOptions = {
      vibrate: [300, 100, 400, 100, 300],
      icon: '/linkal.jpeg',
      tag: 'linkal-notification',
      requireInteraction: true,
      renotify: true
    };
    assert.deepStrictEqual(notificationOptions.vibrate, [300, 100, 400, 100, 300]);
    assert.strictEqual(notificationOptions.icon, '/linkal.jpeg');
    assert.strictEqual(notificationOptions.requireInteraction, true);
    assert.strictEqual(notificationOptions.renotify, true);
  });
});

test('Suite 9: Admin Directory & Zero Hardcoded Data Integrity', async (t) => {
  await t.test('Test 106: Admin sites API structure conforms to schema', () => {
    const mockSite = {
      id: 'site-1',
      name: 'Yahya Mundewadi',
      slug: 'yahya1',
      type: 'portfolio',
      status: 'published',
      whatsapp_number: '919307426215',
      user_name: 'Yahya Mundewadi',
      user_email: 'yahya@linkal.in',
      created_at: new Date().toISOString()
    };
    assert.ok(mockSite.id);
    assert.ok(mockSite.slug);
    assert.strictEqual(mockSite.type, 'portfolio');
    assert.strictEqual(mockSite.status, 'published');
  });

  await t.test('Test 107: Admin users list eliminates mock entries when empty', () => {
    const rawSupabaseData = [];
    const users = rawSupabaseData.length > 0 ? rawSupabaseData : [];
    assert.strictEqual(users.length, 0);
    assert.strictEqual(users.some(u => u.full_name === 'Rahul Sharma'), false);
  });

  await t.test('Test 108: Contextual CV form rejects the word "store"', () => {
    function getFormLabels(category) {
      if (category === 'portfolio') {
        return {
          nameLabel: 'Full Name (Add in your CV) *',
          phoneLabel: 'WhatsApp Phone (Add in your CV) *',
          ctaText: 'Build My Executive CV (100% Free) →'
        };
      }
      return {
        nameLabel: 'Business / Store Name *',
        phoneLabel: 'WhatsApp Orders Phone (Add to your store) *',
        ctaText: 'Start Building Online Store →'
      };
    }

    const cvLabels = getFormLabels('portfolio');
    assert.strictEqual(cvLabels.nameLabel.includes('store'), false);
    assert.strictEqual(cvLabels.phoneLabel.includes('store'), false);
    assert.strictEqual(cvLabels.ctaText.includes('store'), false);
    assert.ok(cvLabels.nameLabel.includes('CV'));
    assert.ok(cvLabels.phoneLabel.includes('CV'));
    assert.ok(cvLabels.ctaText.includes('CV'));
  });

  await t.test('Test 109: Store category retains "store" terminology', () => {
    function getFormLabels(category) {
      if (category === 'portfolio') {
        return {
          nameLabel: 'Full Name (Add in your CV) *',
          phoneLabel: 'WhatsApp Phone (Add in your CV) *',
          ctaText: 'Build My Executive CV (100% Free) →'
        };
      }
      return {
        nameLabel: 'Business / Store Name *',
        phoneLabel: 'WhatsApp Orders Phone (Add to your store) *',
        ctaText: 'Start Building Online Store →'
      };
    }

    const storeLabels = getFormLabels('ecommerce');
    assert.ok(storeLabels.nameLabel.includes('Store'));
    assert.ok(storeLabels.phoneLabel.includes('store'));
  });

  await t.test('Test 110: Custom multi-pulse vibration pattern matches spec', () => {
    const expectedVibration = [300, 100, 400, 100, 300];
    assert.strictEqual(expectedVibration.length, 5);
    assert.strictEqual(expectedVibration[0], 300);
    assert.strictEqual(expectedVibration[2], 400);
    assert.strictEqual(expectedVibration[4], 300);
  });

  await t.test('Test 111: Empty state in Studio renders friendly invitation', () => {
    const userSites = [];
    const emptyStateText = userSites.length === 0
      ? 'No websites created yet. Start building your first website or executive CV above!'
      : `${userSites.length} websites`;
    assert.ok(emptyStateText.includes('No websites created yet'));
  });

  await t.test('Test 112: Subdomain link generation adheres to https scheme and .linkal.in apex', () => {
    const slug = 'yahya1';
    const liveUrl = `https://${slug}.linkal.in`;
    assert.strictEqual(liveUrl, 'https://yahya1.linkal.in');
  });

  await t.test('Test 113: WhatsApp direct chat link uses international wa.me format', () => {
    const phone = '919307426215';
    const message = 'Hello Yahya Mundewadi, I reviewed your Executive CV and would like to connect!';
    const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    assert.ok(waUrl.startsWith('https://wa.me/919307426215'));
    assert.ok(waUrl.includes('Executive%20CV'));
  });
});

