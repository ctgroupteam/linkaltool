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

const THEMES: Record<string, { bg: string; card: string; primary: string; accent: string; text: string; sub: string; border: string }> = {
  '1': { bg: '#2b060d', card: '#400914', primary: '#f6d365', accent: '#fda085', text: '#ffffff', sub: '#fed7aa', border: '#d4af37' }, // Royal Maroon & Gold
  '2': { bg: '#062013', card: '#0c3520', primary: '#dfb15b', accent: '#a7f3d0', text: '#ffffff', sub: '#bbf7d0', border: '#dfb15b' }, // Emerald Green & Gold
  '3': { bg: '#09111e', card: '#111d33', primary: '#e2b17a', accent: '#fca5a5', text: '#ffffff', sub: '#cbd5e1', border: '#e2b17a' }, // Midnight Navy & Rose Gold
  '4': { bg: '#fff1f2', card: '#ffffff', primary: '#be123c', accent: '#9f1239', text: '#1e293b', sub: '#64748b', border: '#f43f5e' }, // Blush Pink & Ruby
  '5': { bg: '#faf7f0', card: '#ffffff', primary: '#b45309', accent: '#d97706', text: '#1c1917', sub: '#78716c', border: '#d4af37' }, // Imperial Ivory & Gold
  '6': { bg: '#1c0a1a', card: '#2e102a', primary: '#f0abfc', accent: '#e879f9', text: '#ffffff', sub: '#f5d0fe', border: '#d946ef' }, // Velvet Plum & Lilac
  '7': { bg: '#022126', card: '#04353d', primary: '#e5c158', accent: '#5eead4', text: '#ffffff', sub: '#99f6e4', border: '#e5c158' }, // Peacock Teal & Gold
  '8': { bg: '#33120d', card: '#4a1b13', primary: '#fcd34d', accent: '#fb923c', text: '#ffffff', sub: '#fed7aa', border: '#f59e0b' }, // Royal Terracotta & Amber
  '9': { bg: '#000000', card: '#121212', primary: '#e6ca65', accent: '#fef08a', text: '#ffffff', sub: '#d4d4d4', border: '#e6ca65' }, // Classic Onyx & Gold
  '10': { bg: '#1a102f', card: '#271947', primary: '#c084fc', accent: '#e9d5ff', text: '#ffffff', sub: '#e9d5ff', border: '#c084fc' } // Royal Lavender & Silver
};

export function generateWeddingCardHtml(site: SiteData): string {
  const phone = cleanPhone(site.whatsappNumber);
  const w = site.weddingCard || {
    themeId: '1',
    groomName: 'Zaid Khan',
    brideName: 'Ayesha Patel',
    groomParents: 'Mr. & Mrs. Farooq Khan',
    brideParents: 'Mr. & Mrs. Tariq Patel',
    weddingDate: 'Sunday, 28th December 2026',
    venueName: 'The Royal Grand Palace Hall',
    venueAddress: 'Near City Gardens, Main Ring Road, Solapur',
    venueMapUrl: 'https://maps.google.com',
    rsvpPhone: phone,
    weddingHashtag: '#ZaidWedsAyesha',
    events: [
      { id: 'ev-1', name: 'Haldi & Mehendi Celebration', date: '26th Dec 2026', time: '5:00 PM Onwards', venue: 'Bride Residence & Lawn' },
      { id: 'ev-2', name: 'Sangeet & Musical Evening', date: '27th Dec 2026', time: '7:30 PM Onwards', venue: 'Emerald Banquet Hall' },
      { id: 'ev-3', name: 'Nikah & Wedding Ceremony', date: '28th Dec 2026', time: '11:30 AM (Baraat Arrival)', venue: 'The Royal Grand Palace' },
      { id: 'ev-4', name: 'Grand Dinner Reception', date: '28th Dec 2026', time: '7:00 PM to 11:00 PM', venue: 'Palace Central Lawns' }
    ]
  };

  const themeKey = String(w.themeId || '1');
  const baseT = THEMES[themeKey] || THEMES['1'];
  const t = site.themeColor ? { ...baseT, primary: site.themeColor } : baseT;
  const fontFamily = site.fontFamily || 'Plus Jakarta Sans';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>${escapeHtml(w.groomName)} &amp; ${escapeHtml(w.brideName)} • Wedding Invitation</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900&family=Great+Vibes&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { max-width: 100vw; width: 100%; overflow-x: hidden; }
    body { background: ${t.bg}; color: ${t.text}; font-family: '${fontFamily}', 'Plus Jakarta Sans', sans-serif; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; padding: 2rem 1rem 6rem; }
    img { max-width: 100%; height: auto; }

    .invitation-wrapper { max-width: 680px; width: 100%; background: ${t.card}; border: 2px solid ${t.border}; border-radius: 28px; padding: 3.5rem 2rem; text-align: center; box-shadow: 0 25px 60px rgba(0,0,0,0.45); position: relative; overflow: hidden; }

    /* Ornate Filigree Corner Accents */
    .ornate-border { position: absolute; inset: 12px; border: 1px dashed ${t.border}; border-radius: 20px; pointer-events: none; opacity: 0.6; }

    .wedding-bismillah { font-size: 1.15rem; color: ${t.primary}; letter-spacing: 2px; margin-bottom: 1.25rem; }
    .wedding-blessing { font-size: 0.95rem; color: ${t.sub}; line-height: 1.6; max-width: 480px; margin: 0 auto 2rem; font-style: italic; }

    .couple-title { margin: 1.5rem 0; }
    .groom-name, .bride-name { font-family: 'Great Vibes', cursive; font-size: 3.8rem; color: ${t.primary}; line-height: 1.1; text-shadow: 0 4px 15px rgba(0,0,0,0.3); }
    .ampersand { font-family: 'Cinzel Decorative', serif; font-size: 1.8rem; color: ${t.border}; margin: 0.5rem 0; }

    .parents-section { font-size: 0.9rem; color: ${t.sub}; margin-bottom: 2.5rem; line-height: 1.7; }
    .hashtag-pill { display: inline-block; background: rgba(255,255,255,0.08); border: 1px solid ${t.border}; color: ${t.primary}; padding: 0.35rem 1rem; border-radius: 99px; font-weight: 700; font-size: 0.85rem; letter-spacing: 1px; margin-bottom: 2rem; }

    .date-highlight-card { background: rgba(255,255,255,0.04); border: 1px solid ${t.border}; border-radius: 16px; padding: 1.5rem 1rem; margin: 0 auto 2.5rem; max-width: 450px; }
    .date-main { font-family: 'Cinzel Decorative', serif; font-size: 1.5rem; color: ${t.primary}; font-weight: 900; margin-bottom: 0.4rem; }
    .date-sub { font-size: 0.85rem; color: ${t.sub}; }

    /* Events Timeline */
    .events-title { font-family: 'Cinzel Decorative', serif; font-size: 1.4rem; color: ${t.primary}; margin-bottom: 1.5rem; letter-spacing: 1px; }
    .timeline-list { display: flex; flex-direction: column; gap: 1.2rem; margin-bottom: 2.5rem; text-align: left; }
    .timeline-card { background: rgba(0,0,0,0.18); border-left: 4px solid ${t.border}; padding: 1rem 1.25rem; border-radius: 0 12px 12px 0; }
    .event-name { font-weight: 800; font-size: 1.1rem; color: ${t.primary}; margin-bottom: 0.25rem; }
    .event-time { font-size: 0.85rem; color: ${t.text}; font-weight: 600; margin-bottom: 0.25rem; }
    .event-venue { font-size: 0.82rem; color: ${t.sub}; }

    /* Venue Box */
    .venue-card { background: rgba(255,255,255,0.04); border: 1px solid ${t.border}; border-radius: 16px; padding: 1.5rem; margin-bottom: 2rem; }
    .venue-label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 2px; color: ${t.primary}; font-weight: 800; margin-bottom: 0.5rem; }
    .venue-name { font-size: 1.25rem; font-weight: 800; color: #fff; margin-bottom: 0.4rem; }
    .venue-addr { font-size: 0.88rem; color: ${t.sub}; line-height: 1.5; margin-bottom: 1rem; }
    .btn-maps { display: inline-flex; align-items: center; gap: 0.4rem; background: ${t.border}; color: #000; padding: 0.6rem 1.25rem; border-radius: 10px; font-weight: 800; font-size: 0.85rem; text-decoration: none; }

    /* Sticky WhatsApp RSVP Bar */
    .rsvp-bar { position: fixed; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.92); backdrop-filter: blur(12px); border-top: 1px solid rgba(255,255,255,0.15); padding: 0.85rem 1.25rem; display: flex; align-items: center; justify-content: space-between; z-index: 999; }
    .rsvp-blurb { color: #fff; font-size: 0.9rem; font-weight: 700; }
    .btn-rsvp-wa { background: #25D366; color: #fff; text-decoration: none; padding: 0.65rem 1.4rem; border-radius: 99px; font-weight: 800; font-size: 0.88rem; display: flex; align-items: center; gap: 0.45rem; box-shadow: 0 4px 15px rgba(37,211,102,0.4); }

    @media (max-width: 640px) {
      .invitation-wrapper { padding: 2.5rem 1.2rem; }
      .groom-name, .bride-name { font-size: 2.9rem; }
    }
  </style>
</head>
<body>

  <!-- Announcement Bar -->
  ${site.announcementBarEnabled !== false && site.announcementText ? `
    <div style="width: 100%; max-width: 680px; background: ${escapeHtml(site.announcementBgColor || t.border)}; color: ${escapeHtml(site.announcementTextColor || '#ffffff')}; padding: 0.65rem 1rem; text-align: center; font-size: 0.82rem; font-weight: 700; border-radius: 12px; margin-bottom: 1.5rem; letter-spacing: 0.5px;">
      ${escapeHtml(site.announcementText)}
    </div>
  ` : ''}

  <article class="invitation-wrapper">
    <div class="ornate-border"></div>

    <div class="wedding-bismillah">&bull; Bismillah Hir Rahman Nir Rahim &bull;</div>
    <p class="wedding-blessing">
      "Together with their families, we request the honor of your presence and blessings as we celebrate the auspicious union of love &amp; togetherness."
    </p>

    <div class="parents-section">
      Son of <strong>${escapeHtml(w.groomParents || 'Groom Parents')}</strong><br>&amp;<br>
      Daughter of <strong>${escapeHtml(w.brideParents || 'Bride Parents')}</strong>
    </div>

    <div class="couple-title">
      <div class="groom-name">${escapeHtml(w.groomName)}</div>
      <div class="ampersand">&amp;</div>
      <div class="bride-name">${escapeHtml(w.brideName)}</div>
    </div>

    ${w.weddingHashtag ? `<div class="hashtag-pill">${escapeHtml(w.weddingHashtag)}</div>` : ''}

    <div class="date-highlight-card">
      <div class="date-main">${escapeHtml(w.weddingDate)}</div>
      <div class="date-sub">Save The Date &bull; Solapur, Maharashtra</div>
    </div>

    <h2 class="events-title">Celebration Schedule</h2>
    <div class="timeline-list">
      ${w.events.map(ev => `
        <div class="timeline-card">
          <div class="event-name">${escapeHtml(ev.name)}</div>
          <div class="event-time">🗓️ ${escapeHtml(ev.date)} &bull; ⏰ ${escapeHtml(ev.time)}</div>
          <div class="event-venue">📍 ${escapeHtml(ev.venue)}</div>
        </div>
      `).join('')}
    </div>

    <div class="venue-card">
      <div class="venue-label">Wedding &amp; Reception Venue</div>
      <div class="venue-name">${escapeHtml(w.venueName)}</div>
      <div class="venue-addr">${escapeHtml(w.venueAddress)}</div>
      <a href="${w.venueMapUrl || 'https://maps.google.com'}" target="_blank" rel="noopener noreferrer" class="btn-maps">
        <span>📍 Open in Google Maps</span>
      </a>
    </div>

    <p style="font-size:0.85rem; color:${t.sub}; line-height:1.6;">
      Warm Regards &amp; Best Compliments from Near &amp; Dear Family Members.
    </p>
  </article>

  <footer class="rsvp-bar">
    <div class="rsvp-blurb">Bless the Couple</div>
    <a href="https://wa.me/${phone}?text=${encodeURIComponent(`Dear ${w.groomName} & ${w.brideName}, congratulations! We would be delighted to attend your wedding celebration.`)}" target="_blank" rel="noopener noreferrer" class="btn-rsvp-wa">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 1.771.815 2.796.815 3.182 0 5.768-2.587 5.768-5.767.001-3.18-2.585-5.766-5.768-5.766zm9.969 5.768c0 5.48-4.453 9.932-9.969 9.932-1.748 0-3.38-.456-4.807-1.252l-5.224 1.38 1.399-5.109c-.896-1.487-1.408-3.228-1.408-5.087 0-5.48 4.453-9.932 9.969-9.932 5.516 0 10.04 4.452 10.04 9.932z"/></svg>
      <span>RSVP on WhatsApp</span>
    </a>
  </footer>

</body>
</html>`;
}

