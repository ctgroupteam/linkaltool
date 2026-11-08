import { SiteData } from '@/types/site';

function cleanPhone(raw?: string): string {
  if (!raw) return '';
  return raw.replace(/[^0-9]/g, '');
}

function escapeHtml(text?: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Clean, Minimal Inline SVG Icons (Zero External Dependencies, Crisp at Any Resolution)
const ICONS = {
  location: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
  email: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
  phone: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  linkedin: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>`,
  github: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>`,
  globe: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>`,
  external: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`,
  print: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>`,
  copy: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
  check: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>`,
  whatsapp: `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 1.771.815 2.796.815 3.182 0 5.768-2.587 5.768-5.767.001-3.18-2.585-5.766-5.768-5.766zm9.969 5.768c0 5.48-4.453 9.932-9.969 9.932-1.748 0-3.38-.456-4.807-1.252l-5.224 1.38 1.399-5.109c-.896-1.487-1.408-3.228-1.408-5.087 0-5.48 4.453-9.932 9.969-9.932 5.516 0 10.04 4.452 10.04 9.932z"/></svg>`,
  badge: `<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>`,
  calendar: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>`,
  code: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
};

export function generateAtsCvHtml(site: SiteData): string {
  const phone = cleanPhone(site.cvPhone || site.whatsappNumber);
  const fullName = escapeHtml(site.name || site.cvTitle || 'Candidate Name');
  const headline = escapeHtml(site.cvHeadline || site.portfolioRoleTitle || 'Professional Role');
  const location = escapeHtml(site.cvLocation || '');
  const email = escapeHtml(site.cvEmail || site.userEmail || '');
  const displayPhone = escapeHtml(site.cvPhone || site.whatsappNumber || '');
  const linkedin = site.cvLinkedin || '';
  const github = site.cvGithub || '';
  const website = site.cvWebsite || '';
  const summary = escapeHtml(
    site.cvSummary ||
    site.portfolioAbout ||
    'Experienced and results-driven professional with a proven track record of delivering high-impact projects, streamlining team operations, and consistently exceeding organizational milestones.'
  );

  const showSummary = site.cvShowSummary !== false;
  const showExperience = site.cvShowExperience !== false;
  const showEducation = site.cvShowEducation !== false;
  const showSkills = site.cvShowSkills !== false;
  const showProjects = site.cvShowProjects !== false;
  const showCertifications = site.cvShowCertifications !== false;
  const format = site.cvFormat || 'classic';

  const experiences = (site.cvExperiences && site.cvExperiences.length > 0)
    ? site.cvExperiences
    : [
      {
        id: 'exp-1',
        company: 'Company / Organization',
        role: 'Senior Professional Role',
        period: '2022 — Present',
        location: 'City, Country',
        description: '• Managed key project workflows and delivered milestone targets on schedule.\n• Collaborated with cross-functional team members to optimize process efficiency.\n• Spearheaded daily operations and quality assurance standards.',
        companyUrl: ''
      }
    ];

  const educations = (site.cvEducations && site.cvEducations.length > 0)
    ? site.cvEducations
    : [
      {
        id: 'edu-1',
        institution: 'University / Institute Name',
        degree: 'Bachelor of Science / Arts / Engineering',
        year: '2018 — 2022',
        honors: 'Graduated with Honors'
      }
    ];

  const skills = (site.cvSkills && site.cvSkills.length > 0)
    ? site.cvSkills
    : (site.portfolioSkills && site.portfolioSkills.length > 0
      ? site.portfolioSkills.map(s => s.name)
      : [
        'Project Planning',
        'Team Leadership',
        'Communication',
        'Process Optimization',
        'Strategic Problem Solving',
        'Quality Assurance'
      ]
    );

  const projects = (site.cvProjects && site.cvProjects.length > 0)
    ? site.cvProjects
    : (site.portfolioProjects && site.portfolioProjects.length > 0
      ? site.portfolioProjects.map(p => ({
        id: p.id,
        title: p.title,
        description: p.description,
        link: p.link,
        techStack: (p.tags || []).join(', ')
      }))
      : [
        {
          id: 'proj-1',
          title: 'Core Production Initiative',
          description: 'Architected and deployed high-performance solutions meeting enterprise standards and measurable business KPIs.',
          link: `https://${site.slug || 'mysite'}.linkal.in`,
          techStack: 'Frameworks, Tools & Protocols'
        }
      ]
    );

  const certifications = (site.cvCertifications && site.cvCertifications.length > 0)
    ? site.cvCertifications
    : [
      {
        id: 'cert-1',
        name: 'Professional Industry Certification',
        issuer: 'Recognized Industry Board',
        year: '2024',
        url: ''
      }
    ];

  const customCategories = (site.cvCustomCategories || []).filter(cat => cat.visible !== false);

  // Helper to render contact item with clean SVG icon
  const renderContactList = (layout: 'inline' | 'stacked' = 'inline') => {
    const items: string[] = [];

    if (location) {
      items.push(`<span class="cv-contact-item"><span class="cv-icon">${ICONS.location}</span><span>${location}</span></span>`);
    }
    if (email) {
      items.push(`<a href="mailto:${email}" class="cv-contact-item"><span class="cv-icon">${ICONS.email}</span><span>${email}</span></a>`);
    }
    if (displayPhone) {
      items.push(`<a href="tel:${displayPhone}" class="cv-contact-item"><span class="cv-icon">${ICONS.phone}</span><span>${displayPhone}</span></a>`);
    }
    if (linkedin) {
      const url = linkedin.startsWith('http') ? linkedin : `https://${linkedin}`;
      const text = linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\/?/i, '').replace(/\/$/, '') || 'LinkedIn';
      items.push(site.cvLinkedinClickable !== false
        ? `<a href="${url}" target="_blank" rel="noopener noreferrer" class="cv-contact-item"><span class="cv-icon">${ICONS.linkedin}</span><span>${text}</span><span class="cv-ext">${ICONS.external}</span></a>`
        : `<span class="cv-contact-item"><span class="cv-icon">${ICONS.linkedin}</span><span>${text}</span></span>`);
    }
    if (github) {
      const url = github.startsWith('http') ? github : `https://${github}`;
      const text = github.replace(/^https?:\/\/(www\.)?github\.com\/?/i, '').replace(/\/$/, '') || 'GitHub';
      items.push(site.cvGithubClickable !== false
        ? `<a href="${url}" target="_blank" rel="noopener noreferrer" class="cv-contact-item"><span class="cv-icon">${ICONS.github}</span><span>${text}</span><span class="cv-ext">${ICONS.external}</span></a>`
        : `<span class="cv-contact-item"><span class="cv-icon">${ICONS.github}</span><span>${text}</span></span>`);
    }
    if (website) {
      const url = website.startsWith('http') ? website : `https://${website}`;
      const text = website.replace(/^https?:\/\/(www\.)?/i, '').replace(/\/$/, '') || 'Portfolio';
      items.push(site.cvWebsiteClickable !== false
        ? `<a href="${url}" target="_blank" rel="noopener noreferrer" class="cv-contact-item"><span class="cv-icon">${ICONS.globe}</span><span>${text}</span><span class="cv-ext">${ICONS.external}</span></a>`
        : `<span class="cv-contact-item"><span class="cv-icon">${ICONS.globe}</span><span>${text}</span></span>`);
    }

    if (layout === 'stacked') {
      return items.map(it => `<div class="cv-contact-stacked-item">${it}</div>`).join('\n');
    }
    return items.join('<span class="cv-dot" aria-hidden="true">•</span>');
  };

  // Helper to render Work Experience
  const renderExperienceSection = () => {
    if (!showExperience || experiences.length === 0) return '';
    return `
      <section class="cv-section">
        <h2 class="cv-section-title">Work Experience</h2>
        <div class="cv-timeline">
          ${experiences.map(exp => `
            <article class="cv-item">
              <div class="cv-item-header">
                <div>
                  <h3 class="cv-item-role">${escapeHtml(exp.role)}</h3>
                  <div class="cv-item-company">
                    ${exp.companyUrl ? `
                      <a href="${exp.companyUrl.startsWith('http') ? exp.companyUrl : `https://${exp.companyUrl}`}" target="_blank" rel="noopener noreferrer">
                        ${escapeHtml(exp.company)} <span class="cv-ext">${ICONS.external}</span>
                      </a>
                    ` : `
                      <span>${escapeHtml(exp.company)}</span>
                    `}
                  </div>
                </div>
                <div class="cv-item-meta">
                  <span class="cv-item-period">${escapeHtml(exp.period)}</span>
                  ${exp.location ? `<span class="cv-item-loc">${escapeHtml(exp.location)}</span>` : ''}
                </div>
              </div>
              ${exp.description ? `
                <div class="cv-item-desc">${escapeHtml(exp.description)}</div>
              ` : ''}
            </article>
          `).join('\n')}
        </div>
      </section>
    `;
  };

  // Helper to render Projects
  const renderProjectsSection = (techStyle: boolean = false) => {
    if (!showProjects || projects.length === 0) return '';
    return `
      <section class="cv-section">
        <h2 class="cv-section-title">Featured Projects</h2>
        <div class="cv-projects-grid">
          ${projects.map(proj => `
            <div class="cv-project-card ${techStyle ? 'cv-project-card-tech' : ''}">
              <div class="cv-project-header">
                <h3 class="cv-project-title">${escapeHtml(proj.title)}</h3>
                ${proj.link ? `
                  <a href="${proj.link.startsWith('http') ? proj.link : `https://${proj.link}`}" target="_blank" rel="noopener noreferrer" class="cv-project-link">
                    <span>View Project</span>
                    <span class="cv-ext">${ICONS.external}</span>
                  </a>
                ` : ''}
              </div>
              ${proj.techStack ? `
                <div class="cv-project-tech">
                  <span class="cv-tech-label">Stack:</span> ${escapeHtml(proj.techStack)}
                </div>
              ` : ''}
              ${proj.description ? `<p class="cv-project-desc">${escapeHtml(proj.description)}</p>` : ''}
            </div>
          `).join('\n')}
        </div>
      </section>
    `;
  };

  // Helper to render Education
  const renderEducationSection = () => {
    if (!showEducation || educations.length === 0) return '';
    return `
      <section class="cv-section">
        <h2 class="cv-section-title">Education</h2>
        <div class="cv-timeline">
          ${educations.map(edu => `
            <div class="cv-item cv-item-compact">
              <div class="cv-item-header">
                <div>
                  <h3 class="cv-item-role">${escapeHtml(edu.degree)}</h3>
                  <div class="cv-item-company">${escapeHtml(edu.institution)}</div>
                </div>
                <div class="cv-item-meta">
                  <span class="cv-item-period">${escapeHtml(edu.year)}</span>
                  ${edu.honors ? `<span class="cv-item-loc">${escapeHtml(edu.honors)}</span>` : ''}
                </div>
              </div>
            </div>
          `).join('\n')}
        </div>
      </section>
    `;
  };

  // Helper to render Skills
  const renderSkillsSection = (style: 'badges' | 'inline' | 'tech' = 'badges') => {
    if (!showSkills || skills.length === 0) return '';
    return `
      <section class="cv-section">
        <h2 class="cv-section-title">Skills &amp; Competencies</h2>
        ${style === 'inline' ? `
          <p class="cv-skills-inline">${skills.map(s => escapeHtml(s)).join(' &bull; ')}</p>
        ` : `
          <div class="cv-skills-grid ${style === 'tech' ? 'cv-skills-tech' : ''}">
            ${skills.map(s => `<span class="cv-skill-pill">${escapeHtml(s)}</span>`).join('\n')}
          </div>
        `}
      </section>
    `;
  };

  // Helper to render Certifications
  const renderCertificationsSection = () => {
    if (!showCertifications || certifications.length === 0) return '';
    return `
      <section class="cv-section">
        <h2 class="cv-section-title">Certifications</h2>
        <div class="cv-timeline">
          ${certifications.map(c => `
            <div class="cv-item cv-item-compact">
              <div class="cv-item-header">
                <div>
                  <h3 class="cv-item-role">${escapeHtml(c.name)}</h3>
                  <div class="cv-item-company">${escapeHtml(c.issuer)}</div>
                </div>
                <div class="cv-item-meta">
                  ${c.year ? `<span class="cv-item-period">${escapeHtml(c.year)}</span>` : ''}
                  ${c.url ? `
                    <a href="${c.url.startsWith('http') ? c.url : `https://${c.url}`}" target="_blank" rel="noopener noreferrer" class="cv-project-link">
                      <span>Credential</span> <span class="cv-ext">${ICONS.external}</span>
                    </a>
                  ` : ''}
                </div>
              </div>
            </div>
          `).join('\n')}
        </div>
      </section>
    `;
  };

  // Helper to render Custom Categories
  const renderCustomCategoriesSection = () => {
    if (!customCategories || customCategories.length === 0) return '';
    return customCategories.map(cat => `
      <section class="cv-section">
        <h2 class="cv-section-title">${escapeHtml(cat.name)}</h2>
        <div class="cv-timeline">
          ${(cat.items || []).map(item => `
            <div class="cv-item">
              <div class="cv-item-header">
                <div>
                  <h3 class="cv-item-role">${escapeHtml(item.title)}</h3>
                  ${item.subtitle ? `<div class="cv-item-company">${escapeHtml(item.subtitle)}</div>` : ''}
                </div>
                <div class="cv-item-meta">
                  ${item.period ? `<span class="cv-item-period">${escapeHtml(item.period)}</span>` : ''}
                  ${item.link ? (item.isLinkClickable !== false
        ? `<a href="${item.link.startsWith('http') ? item.link : `https://${item.link}`}" target="_blank" rel="noopener noreferrer" class="cv-project-link"><span>Link</span> <span class="cv-ext">${ICONS.external}</span></a>`
        : `<span class="cv-item-loc">${escapeHtml(item.link)}</span>`)
        : ''}
                </div>
              </div>
              ${item.description ? `<div class="cv-item-desc">${escapeHtml(item.description)}</div>` : ''}
            </div>
          `).join('\n')}
        </div>
      </section>
    `).join('\n');
  };

  // Generate body HTML based on chosen format (1 of 5)
  let cvBodyHtml = '';

  if (format === 'modern') {
    // 2. Modern Two-Column Split
    cvBodyHtml = `
      <main class="cv-paper cv-format-modern">
        <header class="cv-header">
          <h1 class="cv-name">${fullName}</h1>
          <div class="cv-headline">${headline}</div>
        </header>

        <div class="cv-modern-grid">
          <!-- Left Column (Contact, Skills, Education, Certifications) -->
          <aside class="cv-sidebar">
            <section class="cv-section">
              <h2 class="cv-section-title">Contact</h2>
              <div class="cv-contact-stacked">
                ${renderContactList('stacked')}
              </div>
            </section>

            ${renderSkillsSection('badges')}
            ${renderEducationSection()}
            ${renderCertificationsSection()}
          </aside>

          <!-- Right Column (Summary, Experience, Projects, Custom) -->
          <div class="cv-main-column">
            ${showSummary && summary ? `
              <section class="cv-section">
                <h2 class="cv-section-title">Professional Summary</h2>
                <p class="cv-summary-text">${summary}</p>
              </section>
            ` : ''}

            ${renderExperienceSection()}
            ${renderProjectsSection()}
            ${renderCustomCategoriesSection()}
          </div>
        </div>
      </main>
    `;
  } else if (format === 'tech') {
    // 3. Tech & Developer
    cvBodyHtml = `
      <main class="cv-paper cv-format-tech">
        <header class="cv-header cv-header-tech">
          <div class="cv-tech-tag">&lt;developer_profile&gt;</div>
          <h1 class="cv-name">${fullName}</h1>
          <div class="cv-headline">${headline}</div>
          <div class="cv-contact-row">
            ${renderContactList('inline')}
          </div>
        </header>

        ${showSummary && summary ? `
          <section class="cv-section">
            <h2 class="cv-section-title">Overview</h2>
            <p class="cv-summary-text">${summary}</p>
          </section>
        ` : ''}

        ${renderSkillsSection('tech')}
        ${renderProjectsSection(true)}
        ${renderExperienceSection()}
        ${renderEducationSection()}
        ${renderCertificationsSection()}
        ${renderCustomCategoriesSection()}
      </main>
    `;
  } else if (format === 'elegant') {
    // 4. Editorial & Elegant
    cvBodyHtml = `
      <main class="cv-paper cv-format-elegant">
        <header class="cv-header cv-header-elegant">
          <h1 class="cv-name cv-name-serif">${fullName}</h1>
          <div class="cv-headline cv-headline-serif">${headline}</div>
          <div class="cv-divider-ornament"></div>
          <div class="cv-contact-row cv-contact-center">
            ${renderContactList('inline')}
          </div>
        </header>

        ${showSummary && summary ? `
          <section class="cv-section">
            <h2 class="cv-section-title cv-title-serif">Executive Summary</h2>
            <p class="cv-summary-text cv-summary-serif">${summary}</p>
          </section>
        ` : ''}

        ${renderExperienceSection()}
        ${renderEducationSection()}
        ${renderProjectsSection()}
        ${renderSkillsSection('inline')}
        ${renderCertificationsSection()}
        ${renderCustomCategoriesSection()}
      </main>
    `;
  } else if (format === 'compact') {
    // 5. Compact 1-Page ATS
    cvBodyHtml = `
      <main class="cv-paper cv-format-compact">
        <header class="cv-header cv-header-compact">
          <h1 class="cv-name cv-name-compact">${fullName}</h1>
          <div class="cv-headline cv-headline-compact">${headline}</div>
          <div class="cv-contact-row cv-contact-compact">
            ${renderContactList('inline')}
          </div>
        </header>

        ${showSummary && summary ? `
          <section class="cv-section">
            <h2 class="cv-section-title">Summary</h2>
            <p class="cv-summary-text cv-summary-compact">${summary}</p>
          </section>
        ` : ''}

        ${renderExperienceSection()}
        ${renderSkillsSection('badges')}
        ${renderEducationSection()}
        ${renderProjectsSection()}
        ${renderCertificationsSection()}
        ${renderCustomCategoriesSection()}
      </main>
    `;
  } else {
    // 1. Classic ATS (Default)
    cvBodyHtml = `
      <main class="cv-paper cv-format-classic">
        <header class="cv-header">
          <h1 class="cv-name">${fullName}</h1>
          <div class="cv-headline">${headline}</div>
          <div class="cv-contact-row">
            ${renderContactList('inline')}
          </div>
        </header>

        ${showSummary && summary ? `
          <section class="cv-section">
            <h2 class="cv-section-title">Professional Summary</h2>
            <p class="cv-summary-text">${summary}</p>
          </section>
        ` : ''}

        ${renderExperienceSection()}
        ${renderSkillsSection('badges')}
        ${renderEducationSection()}
        ${renderProjectsSection()}
        ${renderCertificationsSection()}
        ${renderCustomCategoriesSection()}
      </main>
    `;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
  <title>${fullName} — CV Website</title>
  <meta name="description" content="${fullName} &bull; ${headline}. Verified CV website powered by Linkal AI." />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="https://${escapeHtml(site.slug)}.linkal.in" />

  <!-- Google SEO Structured Data (Person Schema) -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "${fullName}",
    "jobTitle": "${headline}",
    ${email ? `"email": "${email}",` : ''}
    ${displayPhone ? `"telephone": "${displayPhone}",` : ''}
    ${location ? `"address": { "@type": "PostalAddress", "addressLocality": "${location}" },` : ''}
    "url": "https://${escapeHtml(site.slug)}.linkal.in"
  }
  </script>

  <style>
    :root {
      --primary: ${site.themeColor || '#1E40AF'};
    }
    /* ─── RESET & ATS COLOR SYSTEM (STRICT WHITE BG, BLACK TEXT) ─── */
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      word-wrap: break-word;
      overflow-wrap: anywhere;
    }

    html, body {
      width: 100%;
      max-width: 100vw;
      overflow-x: hidden;
      margin: 0;
      padding: 0;
      background-color: #fafafa;
      color: #111827;
      font-family: '${site.fontFamily || 'Plus Jakarta Sans'}', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      line-height: 1.55;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    a {
      color: #111827;
      text-decoration: underline;
      text-underline-offset: 2.5px;
      transition: color 0.15s ease;
    }
    a:hover {
      color: #2563eb;
    }

    /* ─── TOP ACTION STRIP (SCREEN ONLY) ─── */
    .ats-actions-bar {
      position: sticky;
      top: 0;
      z-index: 100;
      background: #0f172a;
      color: #f8fafc;
      border-bottom: 1px solid #1e293b;
      padding: 0.65rem 1.25rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
    }
    .ats-verified-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 0.78rem;
      font-weight: 700;
      color: #93c5fd;
      letter-spacing: -0.01em;
    }
    .ats-btn-group {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
    }
    .ats-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 0.45rem 0.85rem;
      border-radius: 8px;
      font-size: 0.75rem;
      font-weight: 700;
      cursor: pointer;
      border: 1px solid transparent;
      transition: all 0.15s ease;
      text-decoration: none !important;
      line-height: 1;
    }
    .ats-btn-primary {
      background: #ffffff;
      color: #0f172a;
      border-color: #ffffff;
    }
    .ats-btn-primary:hover {
      background: #f1f5f9;
    }
    .ats-btn-ghost {
      background: rgba(255, 255, 255, 0.1);
      color: #ffffff;
      border-color: rgba(255, 255, 255, 0.2);
    }
    .ats-btn-ghost:hover {
      background: rgba(255, 255, 255, 0.2);
    }
    .ats-btn-wa {
      background: #16a34a;
      color: #ffffff;
    }
    .ats-btn-wa:hover {
      background: #15803d;
    }

    /* ─── RESUME PAPER CONTAINER ─── */
    .cv-paper {
      width: 100%;
      max-width: 820px;
      margin: 2rem auto;
      background: #ffffff;
      padding: 3rem 3.25rem;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
    }

    /* ─── CANDIDATE HEADER ─── */
    .cv-header {
      padding-bottom: 1.25rem;
      border-bottom: 2px solid #111827;
      margin-bottom: 1.75rem;
    }
    .cv-name {
      font-size: 2.25rem;
      font-weight: 800;
      color: #111827;
      letter-spacing: -0.03em;
      line-height: 1.15;
    }
    .cv-headline {
      font-size: 1.05rem;
      font-weight: 600;
      color: #374151;
      margin-top: 0.35rem;
      letter-spacing: -0.01em;
    }
    .cv-contact-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.65rem 0.85rem;
      margin-top: 0.85rem;
      font-size: 0.82rem;
      color: #4b5563;
      font-weight: 500;
    }
    .cv-contact-item {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      color: #374151;
      text-decoration: none;
    }
    .cv-contact-item:hover {
      color: #111827;
      text-decoration: underline;
    }
    .cv-icon {
      display: inline-flex;
      align-items: center;
      color: #4b5563;
      shrink: 0;
    }
    .cv-ext {
      display: inline-flex;
      align-items: center;
      color: #9ca3af;
      margin-left: 2px;
    }
    .cv-dot {
      color: #9ca3af;
      user-select: none;
    }

    /* ─── SECTION STYLING ─── */
    .cv-section {
      margin-bottom: 1.65rem;
    }
    .cv-section:last-child {
      margin-bottom: 0;
    }
    .cv-section-title {
      font-size: 0.82rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #111827;
      border-bottom: 1.5px solid #111827;
      padding-bottom: 0.3rem;
      margin-bottom: 0.95rem;
    }

    /* ─── SUMMARY ─── */
    .cv-summary-text {
      font-size: 0.9rem;
      color: #374151;
      line-height: 1.65;
    }

    /* ─── TIMELINE & ITEMS (EXPERIENCE / EDUCATION) ─── */
    .cv-timeline {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .cv-item {
      page-break-inside: avoid;
    }
    .cv-item-compact {
      margin-bottom: 0;
    }
    .cv-item-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .cv-item-role {
      font-size: 0.95rem;
      font-weight: 700;
      color: #111827;
    }
    .cv-item-company {
      font-size: 0.88rem;
      font-weight: 600;
      color: #1f2937;
      margin-top: 0.1rem;
    }
    .cv-item-meta {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.8rem;
      color: #6b7280;
      font-weight: 600;
      white-space: nowrap;
    }
    .cv-item-period {
      color: #4b5563;
    }
    .cv-item-loc {
      color: #6b7280;
    }
    .cv-item-desc {
      font-size: 0.87rem;
      color: #374151;
      line-height: 1.6;
      margin-top: 0.4rem;
      white-space: pre-line;
    }

    /* ─── PROJECTS ─── */
    .cv-projects-grid {
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
    }
    .cv-project-card {
      padding: 0.85rem 1rem;
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      page-break-inside: avoid;
    }
    .cv-project-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
    }
    .cv-project-title {
      font-size: 0.92rem;
      font-weight: 700;
      color: #111827;
    }
    .cv-project-link {
      font-size: 0.78rem;
      font-weight: 600;
      color: #111827;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      text-decoration: underline;
    }
    .cv-project-tech {
      font-size: 0.78rem;
      color: #4b5563;
      margin-top: 0.25rem;
      font-weight: 500;
    }
    .cv-tech-label {
      font-weight: 700;
      color: #111827;
    }
    .cv-project-desc {
      font-size: 0.84rem;
      color: #374151;
      line-height: 1.5;
      margin-top: 0.35rem;
    }

    /* ─── SKILLS ─── */
    .cv-skills-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 0.45rem;
    }
    .cv-skill-pill {
      display: inline-block;
      padding: 0.25rem 0.65rem;
      background: #f3f4f6;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 600;
      color: #111827;
    }
    .cv-skills-inline {
      font-size: 0.88rem;
      color: #374151;
      line-height: 1.6;
    }

    /* ─── TEMPLATE 2: MODERN TWO-COLUMN ─── */
    .cv-modern-grid {
      display: grid;
      grid-template-columns: 260px 1fr;
      gap: 2.25rem;
      margin-top: 1.25rem;
    }
    .cv-contact-stacked {
      display: flex;
      flex-direction: column;
      gap: 0.55rem;
    }
    .cv-contact-stacked-item {
      font-size: 0.82rem;
    }
    .cv-contact-stacked-item .cv-contact-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    /* ─── TEMPLATE 3: TECH & DEVELOPER ─── */
    .cv-format-tech {
      border-color: #cbd5e1;
    }
    .cv-header-tech {
      border-bottom: 2px solid #0f172a;
    }
    .cv-tech-tag {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.72rem;
      font-weight: 700;
      color: #64748b;
      margin-bottom: 0.25rem;
      letter-spacing: 0.05em;
    }
    .cv-project-card-tech {
      border-left: 3px solid #0f172a;
      background: #fafafa;
    }
    .cv-skills-tech .cv-skill-pill {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.76rem;
      background: #ffffff;
      border-color: #d1d5db;
    }

    /* ─── TEMPLATE 4: EDITORIAL & ELEGANT ─── */
    .cv-format-elegant {
      font-family: Georgia, Cambria, "Times New Roman", Times, serif;
    }
    .cv-header-elegant {
      text-align: center;
      border-bottom: none;
      padding-bottom: 1.5rem;
    }
    .cv-name-serif {
      font-family: "Playfair Display", Georgia, serif;
      font-size: 2.4rem;
      letter-spacing: -0.01em;
    }
    .cv-headline-serif {
      font-family: Georgia, serif;
      font-style: italic;
      color: #4b5563;
      margin-top: 0.25rem;
    }
    .cv-divider-ornament {
      width: 60px;
      height: 1.5px;
      background: #111827;
      margin: 1rem auto;
    }
    .cv-contact-center {
      justify-content: center;
    }
    .cv-title-serif {
      font-family: "Playfair Display", Georgia, serif;
      letter-spacing: 0.15em;
      text-align: center;
    }
    .cv-summary-serif {
      text-align: center;
      font-size: 0.95rem;
    }

    /* ─── TEMPLATE 5: COMPACT 1-PAGE ATS ─── */
    .cv-format-compact {
      padding: 1.75rem 2rem;
      max-width: 800px;
      font-size: 0.84rem;
      line-height: 1.45;
    }
    .cv-format-compact .cv-section {
      margin-bottom: 1rem;
    }
    .cv-format-compact .cv-section-title {
      font-size: 0.76rem;
      margin-bottom: 0.5rem;
      padding-bottom: 0.2rem;
    }
    .cv-name-compact {
      font-size: 1.85rem;
    }
    .cv-headline-compact {
      font-size: 0.95rem;
    }
    .cv-contact-compact {
      gap: 0.4rem 0.65rem;
      font-size: 0.78rem;
      margin-top: 0.5rem;
    }
    .cv-summary-compact {
      font-size: 0.84rem;
    }
    .cv-format-compact .cv-timeline {
      gap: 0.75rem;
    }
    .cv-format-compact .cv-item-desc {
      font-size: 0.82rem;
      margin-top: 0.25rem;
    }

    /* ─── MOBILE RESPONSIVENESS (ZERO HORIZONTAL OVERFLOW GUARANTEE) ─── */
    @media (max-width: 768px) {
      body {
        background-color: #ffffff !important;
        padding-bottom: 2rem !important;
      }
      .cv-paper {
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 !important;
        padding: 1.25rem 1rem !important;
        border: none !important;
        border-radius: 0 !important;
        box-shadow: none !important;
      }
      .cv-modern-grid {
        display: flex !important;
        flex-direction: column !important;
        gap: 1.5rem !important;
      }
      .cv-name {
        font-size: 1.75rem !important;
      }
      .cv-headline {
        font-size: 0.95rem !important;
      }
      .cv-item-header {
        flex-direction: column !important;
        align-items: flex-start !important;
        gap: 0.15rem !important;
      }
      .cv-item-meta {
        margin-top: 0.15rem !important;
      }
      .cv-contact-row {
        flex-direction: column !important;
        align-items: flex-start !important;
        gap: 0.4rem !important;
      }
      .cv-dot {
        display: none !important;
      }
      .ats-actions-bar {
        flex-direction: column !important;
        align-items: stretch !important;
        padding: 0.65rem 0.85rem !important;
        gap: 0.65rem !important;
      }
      .ats-verified-badge {
        justify-content: center !important;
        font-size: 0.72rem !important;
      }
      .ats-btn-group {
        display: grid !important;
        grid-template-columns: repeat(2, 1fr) !important;
        gap: 0.45rem !important;
        width: 100% !important;
      }
      .ats-btn {
        width: 100% !important;
        padding: 0.55rem 0.5rem !important;
        font-size: 0.72rem !important;
      }
    }

    /* ─── PRINT SPECIFIC FORMATTING (A4 STANDARD) ─── */
    @media print {
      body {
        background: #ffffff !important;
        color: #000000 !important;
        padding: 0 !important;
        font-size: 10pt !important;
      }
      .ats-actions-bar {
        display: none !important;
      }
      .cv-paper {
        max-width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        border: none !important;
        box-shadow: none !important;
        border-radius: 0 !important;
      }
      a {
        color: #000000 !important;
        text-decoration: none !important;
      }
      .cv-project-card {
        border: 1px solid #d1d5db !important;
        background: #ffffff !important;
      }
      @page {
        margin: 0.4in;
        size: A4 portrait;
      }
    }
  </style>
</head>
<body>

  <!-- Top Sticky Actions Strip -->
  <aside class="ats-actions-bar" aria-label="Resume Actions">
    <div class="ats-verified-badge">
      <span class="cv-icon">${ICONS.badge}</span>
      <span>Verified CV Website &bull; ${escapeHtml(site.slug)}.linkal.in</span>
    </div>
    <div class="ats-btn-group">
      <button type="button" onclick="window.print()" class="ats-btn ats-btn-primary" title="Print to paper or save as clean ATS PDF">
        <span class="cv-icon">${ICONS.print}</span>
        <span>Print ATS PDF</span>
      </button>
      <button type="button" onclick="navigator.clipboard.writeText(window.location.href); alert('CV link copied to clipboard!');" class="ats-btn ats-btn-ghost">
        <span class="cv-icon">${ICONS.copy}</span>
        <span>Copy Link</span>
      </button>
      ${phone ? `
        <a href="https://wa.me/${phone}?text=Hello%20${encodeURIComponent(fullName)}%2C%20I%20reviewed%20your%20CV%20website%20and%20would%20like%20to%20connect!" target="_blank" rel="noopener noreferrer" class="ats-btn ats-btn-wa">
          <span class="cv-icon">${ICONS.whatsapp}</span>
          <span>WhatsApp</span>
        </a>
      ` : ''}
      ${email ? `
        <a href="mailto:${email}?subject=Career%20Opportunity%20-%20CV%20Inquiry" class="ats-btn ats-btn-ghost">
          <span class="cv-icon">${ICONS.email}</span>
          <span>Email</span>
        </a>
      ` : ''}
    </div>
  </aside>

  <!-- Resume Main Paper -->
  ${cvBodyHtml}

</body>
</html>`;
}
