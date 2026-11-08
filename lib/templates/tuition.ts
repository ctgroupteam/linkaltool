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

export function generateTuitionHtml(site: SiteData): string {
  const phone = cleanPhone(site.whatsappNumber);
  const siteTitle = escapeHtml(site.name || 'Apex Coaching Academy');
  const themeColor = site.themeColor || '#2563eb';
  const fontFamily = site.fontFamily || 'Plus Jakarta Sans';

  const tuition = site.tuition || {
    academyName: siteTitle,
    tagline: 'Empowering Students for Board & Competitive Excellence',
    standardsCovered: '8th, 9th, 10th (CBSE / State) & 11th-12th Science / Commerce',
    resultsHighlight: '100% Board Pass Rate &bull; 24+ Students scored above 90% in 2026',
    admissionHelpline: phone,
    batches: [
      { id: 'b-1', className: '10th Standard Board Toppers', subjects: 'Mathematics, Science & English', timing: 'Mon - Fri: 5:30 PM - 7:30 PM', monthlyFee: '₹1,500/mo', annualFee: '₹15,000/yr' },
      { id: 'b-2', className: '9th Foundation Batch', subjects: 'Maths & Science Concept Mastery', timing: 'Mon - Fri: 4:00 PM - 5:30 PM', monthlyFee: '₹1,200/mo', annualFee: '₹12,000/yr' },
      { id: 'b-3', className: '11th & 12th Science (PCM / PCB)', subjects: 'Physics, Chemistry, Maths & Biology', timing: 'Daily: 7:00 AM - 9:30 AM', monthlyFee: '₹2,500/mo', annualFee: '₹26,000/yr' },
      { id: 'b-4', className: '11th & 12th Commerce', subjects: 'Accountancy, Economics & OCM', timing: 'Daily: 6:00 PM - 8:00 PM', monthlyFee: '₹1,800/mo', annualFee: '₹19,000/yr' }
    ]
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>${siteTitle} • Tuition &amp; Coaching Classes</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: ${themeColor};
      --navy: #0f172a;
      --bg: #f8fafc;
      --card: #ffffff;
      --border: #e2e8f0;
      --text: #1e293b;
      --muted: #64748b;
      --green: #10b981;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: var(--bg); color: var(--text); font-family: '${fontFamily}', 'Plus Jakarta Sans', sans-serif; min-height: 100vh; padding-bottom: 6rem; }

    .tui-header { background: linear-gradient(135deg, ${themeColor} 0%, #0f172a 100%); color: #fff; padding: 3.5rem 1.5rem 2.5rem; text-align: center; }
    .tui-badge { display: inline-block; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.25); color: #93c5fd; padding: 0.3rem 0.9rem; border-radius: 99px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.8rem; }
    .tui-title { font-family: 'Outfit', sans-serif; font-size: 2.4rem; font-weight: 800; margin-bottom: 0.5rem; }
    .tui-tagline { color: #cbd5e1; font-size: 1rem; max-width: 580px; margin: 0 auto; line-height: 1.5; }

    /* Highlights Banner */
    .highlight-strip { background: #eff6ff; border-bottom: 1px solid #bfdbfe; color: #1e40af; text-align: center; padding: 0.85rem 1rem; font-size: 0.88rem; font-weight: 700; }

    .tui-container { max-width: 980px; margin: 2.5rem auto; padding: 0 1.25rem; }
    .section-title { font-family: 'Outfit', sans-serif; font-size: 1.6rem; font-weight: 800; color: var(--navy); margin-bottom: 0.4rem; text-align: center; }
    .section-desc { text-align: center; color: var(--muted); font-size: 0.92rem; margin-bottom: 2rem; }

    /* Fee & Timing Table / Cards */
    .batches-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; margin-bottom: 3rem; }
    .batch-card { background: var(--card); border: 1px solid var(--border); border-radius: 18px; padding: 1.5rem; display: flex; flex-direction: column; box-shadow: 0 4px 15px rgba(0,0,0,0.03); transition: transform 0.2s, box-shadow 0.2s; }
    .batch-card:hover { transform: translateY(-4px); box-shadow: 0 12px 28px rgba(37,99,235,0.08); border-color: var(--primary); }
    .batch-class { font-family: 'Outfit', sans-serif; font-size: 1.25rem; font-weight: 800; color: var(--navy); margin-bottom: 0.4rem; }
    .batch-subjects { font-size: 0.85rem; color: var(--primary); font-weight: 700; margin-bottom: 1rem; }

    .timing-box { background: #f1f5f9; padding: 0.75rem 1rem; border-radius: 10px; margin-bottom: 1rem; font-size: 0.84rem; }
    .timing-label { font-size: 0.72rem; text-transform: uppercase; color: var(--muted); font-weight: 700; margin-bottom: 0.2rem; }
    .timing-val { font-weight: 800; color: var(--navy); }

    .fee-row { display: flex; align-items: baseline; justify-content: space-between; margin-top: auto; padding-top: 1rem; border-top: 1px solid var(--border); }
    .fee-monthly { font-size: 1.35rem; font-weight: 900; color: var(--green); }
    .fee-annual { font-size: 0.82rem; color: var(--muted); }

    .btn-enquire-batch { background: #25D366; color: #fff; text-decoration: none; padding: 0.65rem 1rem; border-radius: 10px; font-weight: 800; font-size: 0.85rem; display: flex; align-items: center; justify-content: center; gap: 0.4rem; margin-top: 1rem; transition: background 0.2s; }
    .btn-enquire-batch:hover { background: #1eb956; }

    /* Features Grid */
    .features-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 3rem; }
    .feat-card { background: #fff; border: 1px solid var(--border); border-radius: 14px; padding: 1.25rem; text-align: center; }
    .feat-icon { font-size: 1.8rem; margin-bottom: 0.5rem; display: block; }
    .feat-title { font-weight: 800; color: var(--navy); font-size: 0.95rem; margin-bottom: 0.3rem; }
    .feat-desc { font-size: 0.82rem; color: var(--muted); line-height: 1.4; }

    /* Sticky Bottom Bar */
    .tui-bottom-bar { position: fixed; bottom: 0; left: 0; right: 0; background: rgba(15,23,42,0.96); backdrop-filter: blur(12px); border-top: 1px solid var(--border); padding: 0.85rem 1.25rem; display: flex; align-items: center; justify-content: space-between; z-index: 999; }
    .tui-bottom-name { color: #fff; font-weight: 800; font-size: 0.95rem; }
    .tui-bottom-cta { background: #25D366; color: #fff; text-decoration: none; padding: 0.65rem 1.3rem; border-radius: 99px; font-weight: 800; font-size: 0.85rem; display: flex; align-items: center; gap: 0.4rem; }

    @media (max-width: 640px) {
      .tui-title { font-size: 1.8rem; }
      .batches-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>

  <!-- Announcement Bar -->
  ${site.announcementBarEnabled !== false && site.announcementText ? `
    <div style="background: ${escapeHtml(site.announcementBgColor || themeColor)}; color: ${escapeHtml(site.announcementTextColor || '#ffffff')}; padding: 0.65rem 1rem; text-align: center; font-size: 0.82rem; font-weight: 700; position: sticky; top: 0; z-index: 1000; letter-spacing: 0.5px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">
      ${escapeHtml(site.announcementText)}
    </div>
  ` : ''}

  <header class="tui-header">
    ${site.logoUrl ? `
      <img src="${escapeHtml(site.logoUrl)}" alt="${siteTitle}" style="width: 72px; height: 72px; border-radius: 50%; object-fit: cover; margin: 0 auto 0.85rem; border: 2.5px solid #fff; box-shadow: 0 4px 15px rgba(0,0,0,0.3); display: block;" onerror="this.style.display='none'" />
    ` : ''}
    <span class="tui-badge">Admissions Open 2026-27</span>
    <h1 class="tui-title">${siteTitle}</h1>
    <p class="tui-tagline">${escapeHtml(tuition.tagline || 'Empowering Students for Academic Brilliance')}</p>
  </header>

  ${tuition.resultsHighlight ? `
    <div class="highlight-strip">
      🏆 ${tuition.resultsHighlight}
    </div>
  ` : ''}

  <main class="tui-container">
    <h2 class="section-title">Batch Timings &amp; Fee Structure</h2>
    <p class="section-desc">Transparent tuition fees with individual attention, weekly test series, and comprehensive study material.</p>

    <div class="batches-grid">
      ${tuition.batches.map(b => {
        const waMsg = encodeURIComponent(`Hi ${siteTitle}, I would like to inquire about admission for: ${b.className} (${b.subjects}). Please share admission process!`);
        const waUrl = `https://wa.me/${phone}?text=${waMsg}`;
        return `
          <div class="batch-card">
            <h3 class="batch-class">${escapeHtml(b.className)}</h3>
            <div class="batch-subjects">${escapeHtml(b.subjects)}</div>

            <div class="timing-box">
              <div class="timing-label">Batch Schedule</div>
              <div class="timing-val">⏰ ${escapeHtml(b.timing)}</div>
            </div>

            <div class="fee-row">
              <div>
                <span class="fee-monthly">${escapeHtml(b.monthlyFee)}</span>
              </div>
              ${b.annualFee ? `<span class="fee-annual">${escapeHtml(b.annualFee)}</span>` : ''}
            </div>

            <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn-enquire-batch">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 1.771.815 2.796.815 3.182 0 5.768-2.587 5.768-5.767.001-3.18-2.585-5.766-5.768-5.766zm9.969 5.768c0 5.48-4.453 9.932-9.969 9.932-1.748 0-3.38-.456-4.807-1.252l-5.224 1.38 1.399-5.109c-.896-1.487-1.408-3.228-1.408-5.087 0-5.48 4.453-9.932 9.969-9.932 5.516 0 10.04 4.452 10.04 9.932z"/></svg>
              <span>Enquire on WhatsApp</span>
            </a>
          </div>
        `;
      }).join('')}
    </div>

    <div class="features-row">
      <div class="feat-card">
        <span class="feat-icon">👨‍🏫</span>
        <div class="feat-title">Expert Faculty</div>
        <div class="feat-desc">10+ years experienced subject specialists providing individual doubt clearing.</div>
      </div>
      <div class="feat-card">
        <span class="feat-icon">📝</span>
        <div class="feat-title">Weekly Mock Tests</div>
        <div class="feat-desc">Regular tests with printed progress cards sent directly to parents on WhatsApp.</div>
      </div>
      <div class="feat-card">
        <span class="feat-icon">📚</span>
        <div class="feat-title">Printed Notes</div>
        <div class="feat-desc">Comprehensive chapter notes, question banks, and previous 10-year solved papers.</div>
      </div>
    </div>
  </main>

  <footer class="tui-bottom-bar">
    <div class="tui-bottom-name">${siteTitle}</div>
    <a href="https://wa.me/${phone}?text=${encodeURIComponent(`Hi ${siteTitle}, I want to speak to the director regarding admission.`)}" target="_blank" rel="noopener noreferrer" class="tui-bottom-cta">
      <span>Chat on WhatsApp</span>
    </a>
  </footer>

</body>
</html>`;
}

