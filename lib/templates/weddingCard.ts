import { SiteData } from '@/types/site';

function cleanPhone(phone: string): string {
  return (phone || '').replace(/[^0-9]/g, '');
}

function escapeHtml(str: string): string {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export interface WeddingThemeConfig {
  id: string;
  name: string;
  tagline: string;
  bgGradient: string;
  cardBg: string;
  primary: string;
  accent: string;
  text: string;
  sub: string;
  border: string;
  ornamentStyle: string;
  badgeBg: string;
  badgeText: string;
}

export const WEDDING_THEMES: Record<string, WeddingThemeConfig> = {
  '1': {
    id: '1',
    name: 'Royal Rajputana Mandap',
    tagline: 'Deep Crimson, Gilded Mandap Gold & Rich Ivory',
    bgGradient: 'radial-gradient(circle at 50% 20%, #4a0410 0%, #200106 100%)',
    cardBg: 'linear-gradient(180deg, #38030d 0%, #250208 100%)',
    primary: '#f6d365',
    accent: '#fda085',
    text: '#ffffff',
    sub: '#fed7aa',
    border: '#d4af37',
    ornamentStyle: 'mandap',
    badgeBg: 'rgba(212,175,55,0.18)',
    badgeText: '#f6d365'
  },
  '2': {
    id: '2',
    name: 'Mughal Emerald Jaali',
    tagline: 'Deep Royal Emerald, Antique Filigree & Mint Pearl',
    bgGradient: 'radial-gradient(circle at 50% 20%, #062e21 0%, #02140e 100%)',
    cardBg: 'linear-gradient(180deg, #093b2b 0%, #052118 100%)',
    primary: '#dfb15b',
    accent: '#6ee7b7',
    text: '#ffffff',
    sub: '#bbf7d0',
    border: '#dfb15b',
    ornamentStyle: 'jaali',
    badgeBg: 'rgba(223,177,91,0.2)',
    badgeText: '#dfb15b'
  },
  '3': {
    id: '3',
    name: 'Midnight Celestial Starlight',
    tagline: 'Sapphire Midnight Navy, Starlight Rose Gold & Slate',
    bgGradient: 'radial-gradient(circle at 50% 20%, #0a1329 0%, #030611 100%)',
    cardBg: 'linear-gradient(180deg, #111d3d 0%, #091124 100%)',
    primary: '#f2b59b',
    accent: '#fca5a5',
    text: '#ffffff',
    sub: '#cbd5e1',
    border: '#e2b17a',
    ornamentStyle: 'constellation',
    badgeBg: 'rgba(242,181,155,0.2)',
    badgeText: '#f2b59b'
  },
  '4': {
    id: '4',
    name: 'Parisian Blush & Rose Garden',
    tagline: 'Soft Rose Petal, Vintage Wine Script & Pure Pearl',
    bgGradient: 'radial-gradient(circle at 50% 20%, #fff0f3 0%, #ffe4e6 100%)',
    cardBg: '#ffffff',
    primary: '#9f1239',
    accent: '#be123c',
    text: '#1c1917',
    sub: '#71717a',
    border: '#fb7185',
    ornamentStyle: 'floral',
    badgeBg: '#ffe4e6',
    badgeText: '#9f1239'
  },
  '5': {
    id: '5',
    name: 'Vedic Sandalwood & Bridal Vermillion',
    tagline: 'Sacred Sindoor Red, Chandan Saffron & Auspicious Gold',
    bgGradient: 'radial-gradient(circle at 50% 20%, #680d0d 0%, #300303 100%)',
    cardBg: 'linear-gradient(180deg, #4d0a0a 0%, #350606 100%)',
    primary: '#fcd34d',
    accent: '#fb923c',
    text: '#ffffff',
    sub: '#ffedd5',
    border: '#f59e0b',
    ornamentStyle: 'vedic',
    badgeBg: 'rgba(245,158,11,0.2)',
    badgeText: '#fcd34d'
  },
  '6': {
    id: '6',
    name: 'Boho Terracotta & Desert Sand',
    tagline: 'Sunbaked Terracotta, Bohemian Clay & Pure Linen',
    bgGradient: 'radial-gradient(circle at 50% 20%, #431407 0%, #1c0602 100%)',
    cardBg: 'linear-gradient(180deg, #351006 0%, #220903 100%)',
    primary: '#fdba74',
    accent: '#f97316',
    text: '#ffffff',
    sub: '#ffedd5',
    border: '#ea580c',
    ornamentStyle: 'boho',
    badgeBg: 'rgba(234,88,12,0.22)',
    badgeText: '#fdba74'
  },
  '7': {
    id: '7',
    name: 'Peacock Symphony & Azure Sea',
    tagline: 'Majestic Peacock Teal, Royal Turquoise & 24K Gold',
    bgGradient: 'radial-gradient(circle at 50% 20%, #032b30 0%, #011214 100%)',
    cardBg: 'linear-gradient(180deg, #053b42 0%, #022428 100%)',
    primary: '#e5c158',
    accent: '#22d3ee',
    text: '#ffffff',
    sub: '#a5f3fc',
    border: '#06b6d4',
    ornamentStyle: 'peacock',
    badgeBg: 'rgba(6,182,212,0.2)',
    badgeText: '#e5c158'
  },
  '8': {
    id: '8',
    name: 'Modern Champagne Mirage & Bronze',
    tagline: 'Truffle Champagne, Polished Bronze & Ivory Silk',
    bgGradient: 'radial-gradient(circle at 50% 20%, #262422 0%, #121110 100%)',
    cardBg: 'linear-gradient(180deg, #1f1d1b 0%, #141312 100%)',
    primary: '#e4c590',
    accent: '#c09858',
    text: '#ffffff',
    sub: '#e7e5e4',
    border: '#c09858',
    ornamentStyle: 'modern',
    badgeBg: 'rgba(192,152,88,0.2)',
    badgeText: '#e4c590'
  },
  '9': {
    id: '9',
    name: 'Royal Velvet Lilac & Lavender Mist',
    tagline: 'Imperial Violet, Ethereal Lavender & Silver Radiance',
    bgGradient: 'radial-gradient(circle at 50% 20%, #23083b 0%, #0e021a 100%)',
    cardBg: 'linear-gradient(180deg, #320d54 0%, #1e0533 100%)',
    primary: '#e9d5ff',
    accent: '#c084fc',
    text: '#ffffff',
    sub: '#f3e8ff',
    border: '#c084fc',
    ornamentStyle: 'lavender',
    badgeBg: 'rgba(192,132,252,0.22)',
    badgeText: '#e9d5ff'
  },
  '10': {
    id: '10',
    name: '24K Liquid Gold & Onyx Grandeur',
    tagline: 'Jet Velvet Black & Liquid Mirror 24K Gold Luxury',
    bgGradient: 'radial-gradient(circle at 50% 20%, #141416 0%, #050505 100%)',
    cardBg: 'linear-gradient(180deg, #111113 0%, #080809 100%)',
    primary: '#facc15',
    accent: '#fef08a',
    text: '#ffffff',
    sub: '#d4d4d8',
    border: '#eab308',
    ornamentStyle: 'onyx',
    badgeBg: 'rgba(234,179,8,0.22)',
    badgeText: '#facc15'
  }
};

export function generateWeddingCardHtml(site: SiteData): string {
  const phone = cleanPhone(site.whatsappNumber || (site.weddingCard as any)?.rsvpPhone);
  const w = site.weddingCard || {
    themeId: '1',
    groomName: 'Aarav Sharma',
    brideName: 'Ananya Verma',
    groomParents: 'Mr. Rajesh & Mrs. Sunita Sharma',
    brideParents: 'Mr. Vikram & Mrs. Meera Verma',
    weddingDate: '2026-12-18',
    venueName: 'The Grand Heritage Palace',
    venueAddress: 'Near Gateway Circle, Marine Drive, Mumbai',
    venueMapUrl: 'https://maps.google.com',
    rsvpPhone: phone,
    weddingHashtag: '#AaravWedsAnanya',
    events: [
      { id: 'ev-1', name: 'Mehendi & Sangeet Celebration', date: 'Dec 17, 2026', time: '6:30 PM Onwards', venue: 'Royal Palace Ballroom' },
      { id: 'ev-2', name: 'Auspicious Wedding Muhurat', date: 'Dec 18, 2026', time: '11:00 AM (Baraat Arrival)', venue: 'Grand Heritage Mandap' },
      { id: 'ev-3', name: 'Grand Dinner Feast & Reception', date: 'Dec 18, 2026', time: '7:30 PM Onwards', venue: 'Imperial Central Lawns' }
    ]
  };

  const themeKey = String(w.themeId || '1');
  const theme = WEDDING_THEMES[themeKey] || WEDDING_THEMES['1'];
  const t = site.themeColor ? { ...theme, primary: site.themeColor, border: site.themeColor } : theme;
  const fontFamily = site.fontFamily || 'Plus Jakarta Sans';

  const groom = escapeHtml(w.groomName || 'Groom');
  const bride = escapeHtml(w.brideName || 'Bride');
  const gParents = escapeHtml(w.groomParents || 'Groom Family');
  const bParents = escapeHtml(w.brideParents || 'Bride Family');
  const hashtag = escapeHtml(w.weddingHashtag || '');
  const venue = escapeHtml(w.venueName || 'Grand Palace');
  const address = escapeHtml(w.venueAddress || 'City, State');
  const mapUrl = w.venueMapUrl || 'https://maps.google.com';
  const rawDate = w.weddingDate || '2026-12-18';

  const defaultBlessing = `Namaste! Heartiest congratulations to ${groom} and ${bride}! Delighted to confirm our attendance and celebrate with your lovely family. Best wishes!`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>${groom} &amp; ${bride} • Wedding Celebration</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900&family=Great+Vibes&family=Playfair+Display:ital,wght@0,600;0,800;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
    html, body { max-width: 100vw; width: 100%; overflow-x: hidden; }
    body {
      background: ${t.bgGradient};
      color: ${t.text};
      font-family: '${fontFamily}', 'Plus Jakarta Sans', sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      padding: 1.5rem 1rem 6.5rem;
    }
    img { max-width: 100%; height: auto; }

    /* Outer Container */
    .card-shell {
      max-width: 660px;
      width: 100%;
      background: ${t.cardBg};
      border: 2px solid ${t.border};
      border-radius: 32px;
      padding: 3.5rem 2rem;
      text-align: center;
      box-shadow: 0 30px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.12);
      position: relative;
      overflow: hidden;
    }

    /* Backward compatibility class aliases */
    .invitation-wrapper { }
    .groom-name { }
    .bride-name { }
    .hashtag-pill { }
    .timeline-list { }
    /* Easy language: Replaced hard-to-understand RSVP with friendly attendance confirmation and WhatsApp blessings */
    .corner-accent {
      position: absolute;
      width: 48px;
      height: 48px;
      border: 2px solid ${t.border};
      pointer-events: none;
      opacity: 0.75;
    }
    .corner-tl { top: 14px; left: 14px; border-right: none; border-bottom: none; border-top-left-radius: 18px; }
    .corner-tr { top: 14px; right: 14px; border-left: none; border-bottom: none; border-top-right-radius: 18px; }
    .corner-bl { bottom: 14px; left: 14px; border-right: none; border-top: none; border-bottom-left-radius: 18px; }
    .corner-br { bottom: 14px; right: 14px; border-left: none; border-top: none; border-bottom-right-radius: 18px; }

    .invitation-header-pill {
      display: inline-block;
      background: ${t.badgeBg};
      color: ${t.badgeText};
      border: 1px solid ${t.border};
      padding: 0.35rem 1.1rem;
      border-radius: 99px;
      font-size: 0.75rem;
      font-weight: 800;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-bottom: 1.25rem;
    }

    .shloka-text {
      font-size: 0.95rem;
      color: ${t.primary};
      font-weight: 700;
      letter-spacing: 1px;
      margin-bottom: 0.75rem;
    }

    .blessing-intro {
      font-family: 'Playfair Display', serif;
      font-style: italic;
      font-size: 1rem;
      color: ${t.sub};
      line-height: 1.7;
      max-width: 520px;
      margin: 0 auto 2rem;
    }

    /* Names Calligraphy */
    .couple-hero {
      margin: 1.75rem 0 2rem;
    }
    .groom-calligraphy, .bride-calligraphy {
      font-family: 'Great Vibes', cursive;
      font-size: 4rem;
      color: ${t.primary};
      line-height: 1.1;
      text-shadow: 0 4px 18px rgba(0,0,0,0.35);
    }
    .ampersand-sign {
      font-family: 'Cinzel Decorative', serif;
      font-size: 1.8rem;
      color: ${t.border};
      margin: 0.4rem 0;
      opacity: 0.9;
    }

    .parents-block {
      font-size: 0.92rem;
      color: ${t.sub};
      line-height: 1.8;
      margin-bottom: 2rem;
    }
    .parents-block strong { color: #fff; font-weight: 700; }

    .hashtag-badge {
      display: inline-block;
      background: rgba(255,255,255,0.06);
      border: 1px solid ${t.border};
      color: ${t.primary};
      padding: 0.4rem 1.2rem;
      border-radius: 99px;
      font-size: 0.85rem;
      font-weight: 800;
      letter-spacing: 1.5px;
      margin-bottom: 2.25rem;
    }

    /* Countdown Section */
    .countdown-card {
      background: rgba(0,0,0,0.25);
      border: 1px solid ${t.border};
      border-radius: 20px;
      padding: 1.5rem 1rem;
      margin: 0 auto 2.5rem;
      max-width: 520px;
    }
    .countdown-title {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: ${t.primary};
      font-weight: 800;
      margin-bottom: 1rem;
    }
    .countdown-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0.5rem;
    }
    .cd-box {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 12px;
      padding: 0.75rem 0.25rem;
    }
    .cd-num {
      font-family: 'Cinzel Decorative', serif;
      font-size: 1.6rem;
      font-weight: 900;
      color: ${t.primary};
      line-height: 1;
      margin-bottom: 0.25rem;
    }
    .cd-label {
      font-size: 0.65rem;
      text-transform: uppercase;
      color: ${t.sub};
      letter-spacing: 1px;
      font-weight: 700;
    }

    /* Calendar Save Button */
    .btn-cal {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(255,255,255,0.1);
      border: 1px solid ${t.border};
      color: ${t.primary};
      padding: 0.55rem 1.3rem;
      border-radius: 12px;
      font-size: 0.82rem;
      font-weight: 700;
      text-decoration: none;
      transition: all 0.2s;
      margin-top: 1rem;
    }
    .btn-cal:hover {
      background: ${t.primary};
      color: #000;
    }

    /* Itinerary & Events */
    .section-title {
      font-family: 'Cinzel Decorative', serif;
      font-size: 1.45rem;
      color: ${t.primary};
      letter-spacing: 1.5px;
      margin-bottom: 1.5rem;
    }
    .timeline-wrap {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 2.5rem;
      text-align: left;
    }
    .event-card {
      background: rgba(0,0,0,0.22);
      border-left: 4px solid ${t.border};
      border-radius: 0 16px 16px 0;
      padding: 1.1rem 1.25rem;
      border-top: 1px solid rgba(255,255,255,0.05);
      border-right: 1px solid rgba(255,255,255,0.05);
      border-bottom: 1px solid rgba(255,255,255,0.05);
    }
    .event-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.35rem;
      flex-wrap: wrap;
      gap: 0.4rem;
    }
    .event-name {
      font-weight: 800;
      font-size: 1.15rem;
      color: ${t.primary};
    }
    .event-time-badge {
      font-size: 0.72rem;
      font-weight: 700;
      background: ${t.badgeBg};
      color: ${t.badgeText};
      padding: 2px 8px;
      border-radius: 6px;
    }
    .event-date {
      font-size: 0.85rem;
      color: #fff;
      font-weight: 600;
      margin-bottom: 0.25rem;
    }
    .event-loc {
      font-size: 0.8rem;
      color: ${t.sub};
    }

    /* Venue Card */
    .venue-box {
      background: rgba(255,255,255,0.04);
      border: 1px solid ${t.border};
      border-radius: 20px;
      padding: 1.75rem 1.25rem;
      margin-bottom: 2rem;
    }
    .venue-title {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: ${t.primary};
      font-weight: 800;
      margin-bottom: 0.5rem;
    }
    .venue-place {
      font-size: 1.3rem;
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 0.35rem;
    }
    .venue-detail {
      font-size: 0.88rem;
      color: ${t.sub};
      line-height: 1.5;
      margin-bottom: 1.25rem;
    }
    .btn-maps {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: ${t.border};
      color: #000;
      padding: 0.65rem 1.4rem;
      border-radius: 12px;
      font-weight: 800;
      font-size: 0.85rem;
      text-decoration: none;
      box-shadow: 0 4px 15px rgba(0,0,0,0.3);
      transition: transform 0.2s;
    }
    .btn-maps:hover { transform: scale(1.02); }

    /* Sticky Bottom Attendance & Blessings Bar */
    .attendance-sticky-bar {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(10, 10, 12, 0.94);
      backdrop-filter: blur(14px);
      border-top: 1px solid rgba(255,255,255,0.15);
      padding: 0.85rem 1.25rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      z-index: 9999;
      box-shadow: 0 -10px 30px rgba(0,0,0,0.5);
    }
    .attendance-prompt {
      color: #fff;
      text-align: left;
    }
    .attendance-label {
      font-size: 0.9rem;
      font-weight: 800;
      color: #ffffff;
      line-height: 1.2;
    }
    .attendance-sublabel {
      font-size: 0.72rem;
      color: #cbd5e1;
    }
    .btn-confirm-wa {
      background: #25D366;
      color: #ffffff;
      text-decoration: none;
      padding: 0.65rem 1.3rem;
      border-radius: 99px;
      font-weight: 800;
      font-size: 0.85rem;
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      box-shadow: 0 4px 16px rgba(37,211,102,0.4);
      transition: transform 0.2s;
    }
    .btn-confirm-wa:hover {
      transform: scale(1.03);
    }

    @media (max-width: 640px) {
      .card-shell { padding: 2.5rem 1.25rem; border-radius: 24px; }
      .groom-calligraphy, .bride-calligraphy { font-size: 3.1rem; }
      .countdown-grid { gap: 0.35rem; }
      .cd-num { font-size: 1.35rem; }
      .attendance-label { font-size: 0.82rem; }
      .btn-confirm-wa { padding: 0.6rem 1.1rem; font-size: 0.8rem; }
    }
  </style>
</head>
<body>

  <!-- Top Announcement Bar if enabled -->
  ${site.announcementBarEnabled !== false && site.announcementText ? `
    <div style="width: 100%; max-width: 660px; background: ${escapeHtml(site.announcementBgColor || t.border)}; color: ${escapeHtml(site.announcementTextColor || '#ffffff')}; padding: 0.65rem 1rem; text-align: center; font-size: 0.82rem; font-weight: 700; border-radius: 12px; margin-bottom: 1.25rem; letter-spacing: 0.5px;">
      ${escapeHtml(site.announcementText)}
    </div>
  ` : ''}

  <article class="card-shell invitation-wrapper">
    <div class="corner-accent corner-tl"></div>
    <div class="corner-accent corner-tr"></div>
    <div class="corner-accent corner-bl"></div>
    <div class="corner-accent corner-br"></div>

    <div class="invitation-header-pill">Wedding Invitation</div>
    <div class="shloka-text">&bull; With The Blessings Of The Almighty &bull;</div>
    <p class="blessing-intro">
      "Together with their families, we request the honor of your presence and warm blessings as we celebrate the sacred union of love, friendship &amp; togetherness."
    </p>

    <div class="parents-block">
      Son of <strong>${gParents}</strong><br>&amp;<br>
      Daughter of <strong>${bParents}</strong>
    </div>

    <div class="couple-hero">
      <div class="groom-calligraphy groom-name">${groom}</div>
      <div class="ampersand-sign">&amp;</div>
      <div class="bride-calligraphy bride-name">${bride}</div>
    </div>

    ${hashtag ? `<div class="hashtag-badge hashtag-pill">${hashtag}</div>` : ''}

    <!-- Live Interactive Countdown Timer -->
    <div class="countdown-card">
      <div class="countdown-title">Celebration Begins In</div>
      <div class="countdown-grid">
        <div class="cd-box"><div class="cd-num" id="cd-days">--</div><div class="cd-label">Days</div></div>
        <div class="cd-box"><div class="cd-num" id="cd-hours">--</div><div class="cd-label">Hours</div></div>
        <div class="cd-box"><div class="cd-num" id="cd-mins">--</div><div class="cd-label">Mins</div></div>
        <div class="cd-box"><div class="cd-num" id="cd-secs">--</div><div class="cd-label">Secs</div></div>
      </div>
      <div>
        <a href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(groom + ' & ' + bride + ' Wedding Celebration')}&details=${encodeURIComponent('Wedding celebration of ' + groom + ' & ' + bride + ' at ' + venue)}&location=${encodeURIComponent(venue + ', ' + address)}" target="_blank" rel="noopener noreferrer" class="btn-cal">
          <span>📅 Add to Google Calendar</span>
        </a>
      </div>
    </div>

    <!-- Celebration Schedule -->
    <h2 class="section-title">Celebration Schedule</h2>
    <div class="timeline-wrap timeline-list">
      ${(w.events || []).map(ev => `
        <div class="event-card">
          <div class="event-head">
            <span class="event-name">${escapeHtml(ev.name)}</span>
            <span class="event-time-badge">⏰ ${escapeHtml(ev.time)}</span>
          </div>
          <div class="event-date">🗓️ ${escapeHtml(ev.date)}</div>
          <div class="event-loc">📍 ${escapeHtml(ev.venue)}</div>
        </div>
      `).join('')}
    </div>

    <!-- Venue Card -->
    <div class="venue-box">
      <div class="venue-title">Wedding &amp; Reception Venue</div>
      <div class="venue-place">${venue}</div>
      <div class="venue-detail">${address}</div>
      <a href="${mapUrl}" target="_blank" rel="noopener noreferrer" class="btn-maps">
        <span>📍 Open in Google Maps</span>
      </a>
    </div>

    <p style="font-size:0.85rem; color:${t.sub}; line-height:1.7;">
      Warm Regards &amp; Heartfelt Compliments from Family, Relatives &amp; Friends.
    </p>
  </article>

  <!-- Sticky Attendance Confirmation & Blessing Bar -->
  <footer class="attendance-sticky-bar">
    <div class="attendance-prompt">
      <div class="attendance-label">Bless the Couple</div>
      <div class="attendance-sublabel">Confirm your attendance</div>
    </div>
    <a href="https://wa.me/${phone}?text=${encodeURIComponent(defaultBlessing)}" target="_blank" rel="noopener noreferrer" class="btn-confirm-wa">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 1.771.815 2.796.815 3.182 0 5.768-2.587 5.768-5.767.001-3.18-2.585-5.766-5.768-5.766zm9.969 5.768c0 5.48-4.453 9.932-9.969 9.932-1.748 0-3.38-.456-4.807-1.252l-5.224 1.38 1.399-5.109c-.896-1.487-1.408-3.228-1.408-5.087 0-5.48 4.453-9.932 9.969-9.932 5.516 0 10.04 4.452 10.04 9.932z"/></svg>
      <span>Send Wishes on WhatsApp</span>
    </a>
  </footer>

  <script>
    (function initCountdown() {
      const targetStr = '${rawDate}';
      let targetDate = new Date(targetStr);
      if (isNaN(targetDate.getTime())) {
        targetDate = new Date('2026-12-18T10:00:00');
      }

      function tick() {
        const now = new Date().getTime();
        const diff = targetDate.getTime() - now;
        if (diff <= 0) {
          const titleEl = document.querySelector('.countdown-title');
          if (titleEl) titleEl.textContent = 'Happily Married • Celebrations Live';
          const cdDays = document.getElementById('cd-days');
          const cdHours = document.getElementById('cd-hours');
          const cdMins = document.getElementById('cd-mins');
          const cdSecs = document.getElementById('cd-secs');
          if (cdDays) cdDays.textContent = '00';
          if (cdHours) cdHours.textContent = '00';
          if (cdMins) cdMins.textContent = '00';
          if (cdSecs) cdSecs.textContent = '00';
          return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);

        const cdDays = document.getElementById('cd-days');
        const cdHours = document.getElementById('cd-hours');
        const cdMins = document.getElementById('cd-mins');
        const cdSecs = document.getElementById('cd-secs');
        if (cdDays) cdDays.textContent = String(days).padStart(2, '0');
        if (cdHours) cdHours.textContent = String(hours).padStart(2, '0');
        if (cdMins) cdMins.textContent = String(mins).padStart(2, '0');
        if (cdSecs) cdSecs.textContent = String(secs).padStart(2, '0');
      }
      tick();
      setInterval(tick, 1000);
    })();
  </script>
</body>
</html>`;
}
