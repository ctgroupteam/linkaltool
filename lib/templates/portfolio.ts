import { SiteData } from '@/types/site';

function cleanPhone(phone: string): string {
  return phone.replace(/[^0-9]/g, '');
}

function escapeHtml(str: string): string {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function generateCreativePortfolioHtml(site: SiteData): string {
  const phone = cleanPhone(site.whatsappNumber);
  const fullName = escapeHtml(site.name || site.portfolioRoleTitle || 'Creative Professional');
  const role = escapeHtml(site.portfolioRoleTitle || 'Full-Stack Developer & UI/UX Designer');
  const about = escapeHtml(site.portfolioAbout || 'I build high-converting digital products, scalable web applications, and intuitive user experiences for modern brands.');
  const themeColor = site.themeColor || '#6366f1';
  const fontFamily = site.fontFamily || 'Plus Jakarta Sans';

  // Limit project gallery to max 5 images
  const allProjects = (site.portfolioProjects && site.portfolioProjects.length > 0)
    ? site.portfolioProjects.slice(0, 5)
    : [
      { id: 'p-1', title: 'Fintech Dashboard Web App', description: 'Real-time analytics and investment tracking platform with dark mode.', imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=700&auto=format&fit=crop&q=80', tags: ['React', 'Next.js', 'Tailwind'], link: `https://${site.slug || 'mysite'}.linkal.in` },
      { id: 'p-2', title: 'E-Commerce Mobile Experience', description: 'Streamlined checkout with 1-tap WhatsApp order integrations.', imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=700&auto=format&fit=crop&q=80', tags: ['UI/UX', 'Mobile', 'Figma'], link: `https://${site.slug || 'mysite'}.linkal.in` },
      { id: 'p-3', title: 'SaaS Multi-Tenant Architecture', description: 'High-speed cloud system serving 50k+ instant custom subdomains.', imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=700&auto=format&fit=crop&q=80', tags: ['Node.js', 'PostgreSQL', 'Cloudflare'], link: `https://${site.slug || 'mysite'}.linkal.in` },
      { id: 'p-4', title: 'Brand Identity & Visual System', description: 'Complete typography, logo design, and component library.', imageUrl: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=700&auto=format&fit=crop&q=80', tags: ['Branding', 'Design System'], link: `https://${site.slug || 'mysite'}.linkal.in` },
      { id: 'p-5', title: 'AI Assistant Interface Design', description: 'Conversational UI with rich streaming feedback widgets.', imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=700&auto=format&fit=crop&q=80', tags: ['AI', 'React', 'TypeScript'], link: `https://${site.slug || 'mysite'}.linkal.in` }
    ];

  const skills = (site.portfolioSkills && site.portfolioSkills.length > 0)
    ? site.portfolioSkills
    : [
      { id: 's-1', name: 'UI / UX Design', level: 'Expert' },
      { id: 's-2', name: 'Full-Stack Development', level: 'Advanced' },
      { id: 's-3', name: 'React & Next.js', level: 'Expert' },
      { id: 's-4', name: 'TypeScript & Node.js', level: 'Advanced' },
      { id: 's-5', name: 'Database Architecture', level: 'Proficient' }
    ];

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>${fullName} • Creative Portfolio</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@700;800;900&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: ${themeColor};
      --bg: #090d16;
      --card: #111827;
      --text: #f9fafb;
      --muted: #9ca3af;
      --border: rgba(255, 255, 255, 0.08);
      --border-accent: rgba(99, 102, 241, 0.3);
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: var(--bg); color: var(--text); font-family: '${fontFamily}', 'Plus Jakarta Sans', sans-serif; min-height: 100vh; padding-bottom: 6rem; overflow-x: hidden; }

    /* Hero */
    .hero-section { text-align: center; padding: 5rem 1.5rem 3.5rem; background: radial-gradient(circle at 50% 20%, #1e1b4b 0%, var(--bg) 75%); border-bottom: 1px solid var(--border); }
    .hero-badge { display: inline-flex; align-items: center; gap: 0.4rem; background: rgba(99,102,241,0.15); border: 1px solid var(--border-accent); color: #a5b4fc; padding: 0.35rem 1rem; border-radius: 99px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 1.25rem; }
    .pulse-dot { width: 8px; height: 8px; background: #22c55e; border-radius: 50%; display: inline-block; box-shadow: 0 0 10px #22c55e; }
    .hero-name { font-family: 'Outfit', sans-serif; font-size: 3.2rem; font-weight: 900; margin-bottom: 0.6rem; letter-spacing: -0.5px; }
    .hero-role { font-size: 1.25rem; color: #a5b4fc; font-weight: 700; margin-bottom: 1.25rem; }
    .hero-about { max-width: 620px; margin: 0 auto 2rem; color: var(--muted); font-size: 1.05rem; line-height: 1.6; }

    /* Skills Row */
    .skills-row { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.6rem; max-width: 700px; margin: 0 auto; }
    .skill-chip { background: var(--card); border: 1px solid var(--border); color: #e2e8f0; padding: 0.45rem 1rem; border-radius: 99px; font-size: 0.82rem; font-weight: 700; }

    /* Projects Gallery (Max 5 Visual Projects) */
    .port-container { max-width: 1080px; margin: 3.5rem auto; padding: 0 1.25rem; }
    .section-title { font-family: 'Outfit', sans-serif; font-size: 1.9rem; font-weight: 800; text-align: center; margin-bottom: 0.4rem; }
    .section-desc { text-align: center; color: var(--muted); font-size: 0.95rem; margin-bottom: 2.5rem; }

    .projects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.75rem; }
    .project-card { background: var(--card); border: 1px solid var(--border); border-radius: 20px; overflow: hidden; display: flex; flex-direction: column; transition: transform 0.25s, border-color 0.25s; }
    .project-card:hover { transform: translateY(-5px); border-color: var(--primary); box-shadow: 0 15px 30px rgba(0,0,0,0.5); }
    .project-img-wrap { width: 100%; height: 210px; overflow: hidden; background: #1e293b; }
    .project-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
    .project-card:hover .project-img { transform: scale(1.06); }

    .project-body { padding: 1.4rem; display: flex; flex-direction: column; flex: 1; }
    .project-title { font-family: 'Outfit', sans-serif; font-size: 1.2rem; font-weight: 800; margin-bottom: 0.5rem; color: #fff; }
    .project-desc { font-size: 0.88rem; color: var(--muted); line-height: 1.5; margin-bottom: 1.2rem; flex: 1; }
    .tags-row { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1.2rem; }
    .tag-item { background: rgba(255,255,255,0.06); color: #cbd5e1; padding: 0.2rem 0.6rem; border-radius: 6px; font-size: 0.72rem; font-weight: 700; }

    .btn-project-link { font-size: 0.85rem; font-weight: 800; color: #a5b4fc; text-decoration: none; display: inline-flex; align-items: center; gap: 0.35rem; }
    .btn-project-link:hover { color: #fff; text-decoration: underline; }

    /* Sticky Bottom Action Bar */
    .port-bottom-bar { position: fixed; bottom: 0; left: 0; right: 0; background: rgba(9,13,22,0.96); backdrop-filter: blur(12px); border-top: 1px solid var(--border); padding: 0.85rem 1.25rem; display: flex; align-items: center; justify-content: space-between; z-index: 999; }
    .port-bottom-name { color: #fff; font-weight: 800; font-size: 0.95rem; }
    .port-bottom-cta { background: #25D366; color: #fff; text-decoration: none; padding: 0.65rem 1.35rem; border-radius: 99px; font-weight: 800; font-size: 0.88rem; display: flex; align-items: center; gap: 0.45rem; box-shadow: 0 4px 15px rgba(37,211,102,0.3); }

    @media (max-width: 640px) {
      .hero-name { font-size: 2.2rem; }
      .projects-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>

  <!-- Announcement Bar -->
  ${site.announcementBarEnabled !== false && site.announcementText ? `
    <div style="background: ${escapeHtml(site.announcementBgColor || themeColor)}; color: ${escapeHtml(site.announcementTextColor || '#ffffff')}; padding: 0.65rem 1rem; text-align: center; font-size: 0.82rem; font-weight: 700; position: sticky; top: 0; z-index: 1000; letter-spacing: 0.5px; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
      ${escapeHtml(site.announcementText)}
    </div>
  ` : ''}

  <header class="hero-section">
    <div class="hero-badge">
      <span class="pulse-dot"></span>
      <span>Available for High-Impact Projects</span>
    </div>
    <h1 class="hero-name">${fullName}</h1>
    <div class="hero-role">${role}</div>
    <p class="hero-about">${about}</p>

    <div class="skills-row">
      ${skills.map(s => `<span class="skill-chip">${escapeHtml(s.name)}</span>`).join('')}
    </div>
  </header>

  <main class="port-container">
    <h2 class="section-title">Selected Visual Projects</h2>
    <p class="section-desc">Curated showcase of high-performance products, client work, and design engineering.</p>

    <div class="projects-grid">
      ${allProjects.map(p => `
        <article class="project-card">
          ${p.imageUrl ? `
            <div class="project-img-wrap">
              <img src="${p.imageUrl}" alt="${escapeHtml(p.title)}" class="project-img" loading="lazy">
            </div>
          ` : ''}
          <div class="project-body">
            <h3 class="project-title">${escapeHtml(p.title)}</h3>
            <p class="project-desc">${escapeHtml(p.description)}</p>
            ${(p.tags && p.tags.length > 0) ? `
              <div class="tags-row">
                ${p.tags.map(t => `<span class="tag-item">${escapeHtml(t)}</span>`).join('')}
              </div>
            ` : ''}
            ${p.link ? `
              <a href="${p.link.startsWith('http') ? p.link : 'https://' + p.link}" target="_blank" rel="noopener noreferrer" class="btn-project-link">
                <span>View Live Demo</span>
                <span>↗</span>
              </a>
            ` : ''}
          </div>
        </article>
      `).join('')}
    </div>
  </main>

  <footer class="port-bottom-bar">
    <div class="port-bottom-name">${fullName}</div>
    <a href="https://wa.me/${phone}?text=${encodeURIComponent(`Hi ${fullName}, I saw your creative portfolio and would like to discuss a project!`)}" target="_blank" rel="noopener noreferrer" class="port-bottom-cta">
      <span>Hire Me on WhatsApp</span>
    </a>
  </footer>

</body>
</html>`;
}

