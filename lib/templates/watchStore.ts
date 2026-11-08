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

export function generateWatchStoreHtml(site: SiteData): string {
  const phone = cleanPhone(site.whatsappNumber);
  const siteTitle = escapeHtml(site.name || 'Chronos Luxury Timepieces');
  const themeColor = site.themeColor || '#d97706';

  const watches = (site.watchItems && site.watchItems.length > 0)
    ? site.watchItems
    : (site.products && site.products.length > 0
        ? site.products.map((p, idx) => ({
            id: p.id,
            brand: 'Signature Collection',
            model: p.name,
            price: p.price,
            mrp: (parseFloat(p.price) * 1.25).toFixed(0),
            dialColor: idx % 2 === 0 ? 'Midnight Sunray' : 'Emerald Green',
            caseDiameter: idx % 2 === 0 ? '40mm' : '42mm',
            movement: idx % 3 === 0 ? 'Automatic 24-Jewel' : 'Precision Quartz',
            waterResistance: '100M (10 ATM)',
            strapMaterial: idx % 2 === 0 ? 'Oystersteel Solid Links' : 'Italian Calfskin Leather',
            imageUrl: p.imageUrl,
            badge: p.badge || (idx === 0 ? 'Limited Edition' : undefined)
          }))
        : [
            {
              id: 'w-1',
              brand: 'Rolex Heritage',
              model: 'Submariner Date 41mm',
              price: '18499',
              mrp: '24999',
              dialColor: 'Cerachrom Black',
              caseDiameter: '41mm',
              movement: 'Calibre 3235 Automatic',
              waterResistance: '300M (30 ATM)',
              strapMaterial: 'Oystersteel Solid Links',
              badge: 'Exclusive',
              imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700&auto=format&fit=crop&q=80'
            },
            {
              id: 'w-2',
              brand: 'Omega Masters',
              model: 'Seamaster Aqua Terra 150M',
              price: '14299',
              mrp: '18999',
              dialColor: 'Teak Pattern Ice Blue',
              caseDiameter: '41mm',
              movement: 'Co-Axial Master Chronometer',
              waterResistance: '150M (15 ATM)',
              strapMaterial: 'Brushed Steel Bracelet',
              badge: 'Bestseller',
              imageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=700&auto=format&fit=crop&q=80'
            },
            {
              id: 'w-3',
              brand: 'Patek Chrono',
              model: 'Nautilus Rose Gold Skeleton',
              price: '22999',
              mrp: '29999',
              dialColor: 'Skeletonised Grey Dial',
              caseDiameter: '40.5mm',
              movement: 'Self-Winding Mechanical',
              waterResistance: '120M (12 ATM)',
              strapMaterial: 'Rose Gold 18K Link',
              badge: 'Iconic',
              imageUrl: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=700&auto=format&fit=crop&q=80'
            },
            {
              id: 'w-4',
              brand: 'Tag Heuer Pro',
              model: 'Monaco Automatic Chronograph',
              price: '12499',
              mrp: '16500',
              dialColor: 'Square Sunray Blue',
              caseDiameter: '39mm',
              movement: 'Calibre Heuer 02',
              waterResistance: '100M (10 ATM)',
              strapMaterial: 'Perforated Blue Leather',
              imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=700&auto=format&fit=crop&q=80'
            }
          ]
      );

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>${siteTitle} • Luxury Timepieces</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-dark: #0a0b0e;
      --bg-card: #12141a;
      --bg-subtle: #191c24;
      --gold: ${themeColor};
      --gold-light: #f59e0b;
      --text: #f8fafc;
      --text-muted: #94a3b8;
      --border: rgba(255, 255, 255, 0.08);
      --border-gold: rgba(217, 119, 6, 0.3);
    }
    * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
    body { background-color: var(--bg-dark); color: var(--text); font-family: 'Plus Jakarta Sans', sans-serif; min-height: 100vh; overflow-x: hidden; }

    /* Loading Entrance */
    #watch-loader { position: fixed; inset: 0; background: var(--bg-dark); z-index: 99999; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px; transition: opacity 0.6s ease, visibility 0.6s; }
    #watch-loader.hidden { opacity: 0; visibility: hidden; pointer-events: none; }
    .loader-crown { font-size: 2.8rem; margin-bottom: 12px; animation: crownPulse 2s infinite ease-in-out; }
    @keyframes crownPulse { 0%, 100% { transform: scale(1); filter: drop-shadow(0 0 10px rgba(217,119,6,0.3)); } 50% { transform: scale(1.1); filter: drop-shadow(0 0 20px rgba(245,158,11,0.6)); } }
    .loader-title { font-family: 'Cinzel', serif; font-size: 1.5rem; color: #fff; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 6px; }
    .loader-sub { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 3px; color: var(--gold); margin-bottom: 20px; font-weight: 700; }
    .progress-track { width: 280px; max-width: 80%; height: 3px; background: rgba(255,255,255,0.1); border-radius: 99px; overflow: hidden; margin-bottom: 10px; }
    .progress-bar { height: 100%; width: 0%; background: linear-gradient(90deg, var(--gold), #fef08a); transition: width 0.15s ease-out; }
    .progress-pct { font-size: 0.75rem; color: var(--text-muted); font-weight: 600; letter-spacing: 1px; }

    /* Hero Banner */
    .watch-hero { text-align: center; padding: 4.5rem 1.5rem 3rem; background: radial-gradient(circle at top, #1e2230 0%, var(--bg-dark) 70%); border-bottom: 1px solid var(--border); }
    .watch-badge-hero { display: inline-block; background: rgba(217,119,6,0.15); color: var(--gold-light); border: 1px solid var(--border-gold); padding: 0.35rem 1rem; border-radius: 99px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 1rem; }
    .watch-hero-title { font-family: 'Cinzel', serif; font-size: 2.8rem; font-weight: 900; letter-spacing: 1px; color: #fff; margin-bottom: 0.75rem; text-transform: uppercase; }
    .watch-hero-sub { color: var(--text-muted); font-size: 1.05rem; max-width: 600px; margin: 0 auto; line-height: 1.6; }

    /* Watch Showcase Grid */
    .watch-container { max-width: 1100px; margin: 3rem auto; padding: 0 1.25rem 6rem; }
    .section-header { text-align: center; margin-bottom: 2.5rem; }
    .section-title { font-family: 'Cinzel', serif; font-size: 1.8rem; font-weight: 800; color: #fff; margin-bottom: 0.5rem; letter-spacing: 1px; }
    .section-sub { color: var(--text-muted); font-size: 0.9rem; }

    .watch-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.75rem; }
    .watch-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 20px; overflow: hidden; display: flex; flex-direction: column; transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s; position: relative; }
    .watch-card:hover { transform: translateY(-5px); border-color: var(--gold); box-shadow: 0 16px 36px rgba(0,0,0,0.6); }

    .watch-img-box { position: relative; width: 100%; height: 260px; overflow: hidden; background: #07080a; display: flex; align-items: center; justify-content: center; }
    .watch-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
    .watch-card:hover .watch-img { transform: scale(1.08); }
    .watch-tag { position: absolute; top: 12px; left: 12px; background: linear-gradient(135deg, var(--gold), #b45309); color: #fff; padding: 0.25rem 0.75rem; border-radius: 6px; font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 4px 10px rgba(0,0,0,0.4); }

    .watch-body { padding: 1.4rem; display: flex; flex-direction: column; flex: 1; }
    .watch-brand { font-size: 0.78rem; text-transform: uppercase; letter-spacing: 2px; color: var(--gold-light); font-weight: 800; margin-bottom: 0.3rem; }
    .watch-model { font-family: 'Cinzel', serif; font-size: 1.25rem; font-weight: 800; color: #fff; margin-bottom: 0.8rem; line-height: 1.35; }

    /* Specification Matrix Pills */
    .specs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.45rem; margin-bottom: 1.25rem; }
    .spec-pill { background: var(--bg-subtle); border: 1px solid var(--border); padding: 0.35rem 0.6rem; border-radius: 8px; font-size: 0.75rem; }
    .spec-label { color: var(--text-muted); font-size: 0.68rem; text-transform: uppercase; display: block; margin-bottom: 0.1rem; }
    .spec-val { color: #f1f5f9; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; }

    /* Price & WhatsApp Action */
    .watch-footer-row { margin-top: auto; padding-top: 1rem; border-top: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; }
    .price-box { display: flex; flex-direction: column; }
    .price-now { font-size: 1.4rem; font-weight: 900; color: #fff; }
    .price-mrp { font-size: 0.8rem; color: #64748b; text-decoration: line-through; }

    .btn-buy-wa { background: #25D366; color: #fff; padding: 0.7rem 1.2rem; border-radius: 12px; font-weight: 800; font-size: 0.88rem; text-decoration: none; display: inline-flex; align-items: center; gap: 0.45rem; transition: background 0.2s, transform 0.1s; white-space: nowrap; box-shadow: 0 4px 15px rgba(37,211,102,0.3); }
    .btn-buy-wa:hover { background: #1eb956; transform: scale(1.02); }

    /* Bottom Floating Action */
    .watch-bottom-strip { position: fixed; bottom: 0; left: 0; right: 0; background: rgba(10,11,14,0.95); backdrop-filter: blur(12px); border-top: 1px solid var(--border); padding: 0.85rem 1.25rem; display: flex; align-items: center; justify-content: space-between; z-index: 999; }
    .bottom-title { color: #fff; font-family: 'Cinzel', serif; font-size: 1rem; font-weight: 700; }
    .bottom-cta { background: #25D366; color: #fff; text-decoration: none; padding: 0.6rem 1.25rem; border-radius: 99px; font-weight: 800; font-size: 0.85rem; display: flex; align-items: center; gap: 0.4rem; }

    @media (max-width: 640px) {
      .watch-hero-title { font-size: 2rem; }
      .watch-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>

  <!-- Loading Screen -->
  <div id="watch-loader">
    <div class="loader-crown">👑</div>
    <h2 class="loader-title">${siteTitle}</h2>
    <p class="loader-sub">Mastering Haute Horlogerie</p>
    <div class="progress-track">
      <div class="progress-bar" id="p-bar"></div>
    </div>
    <span class="progress-pct" id="p-txt">0%</span>
  </div>

  <header class="watch-hero">
    <span class="watch-badge-hero">100% Certified Authentic &bull; Doorstep Insured Delivery</span>
    <h1 class="watch-hero-title">${siteTitle}</h1>
    <p class="watch-hero-sub">Explore our curated catalog of prestigious luxury chronographs, automatic movements, and heritage timepieces. Direct purchase via WhatsApp.</p>
  </header>

  <main class="watch-container">
    <div class="section-header">
      <h2 class="section-title">Available Timepieces</h2>
      <p class="section-sub">Click "Buy on WhatsApp" to initiate order confirmation, warranty details, and instant doorstep dispatch.</p>
    </div>

    <div class="watch-grid">
      ${watches.map(w => {
        const waMsg = encodeURIComponent(`Hi ${siteTitle}, I am interested in purchasing: ${w.brand} ${w.model} (₹${w.price}). Please share availability and dispatch details!`);
        const waUrl = `https://wa.me/${phone}?text=${waMsg}`;
        return `
          <article class="watch-card">
            ${w.imageUrl ? `
              <div class="watch-img-box">
                <img src="${w.imageUrl}" alt="${escapeHtml(w.brand + ' ' + w.model)}" class="watch-img" loading="lazy">
                ${w.badge ? `<span class="watch-tag">${escapeHtml(w.badge)}</span>` : ''}
              </div>
            ` : ''}
            <div class="watch-body">
              <span class="watch-brand">${escapeHtml(w.brand || 'Luxury Watch')}</span>
              <h3 class="watch-model">${escapeHtml(w.model)}</h3>

              <div class="specs-grid">
                ${w.movement ? `
                  <div class="spec-pill">
                    <span class="spec-label">Movement</span>
                    <span class="spec-val">${escapeHtml(w.movement)}</span>
                  </div>
                ` : ''}
                ${w.caseDiameter ? `
                  <div class="spec-pill">
                    <span class="spec-label">Case Diameter</span>
                    <span class="spec-val">${escapeHtml(w.caseDiameter)}</span>
                  </div>
                ` : ''}
                ${w.dialColor ? `
                  <div class="spec-pill">
                    <span class="spec-label">Dial</span>
                    <span class="spec-val">${escapeHtml(w.dialColor)}</span>
                  </div>
                ` : ''}
                ${w.waterResistance ? `
                  <div class="spec-pill">
                    <span class="spec-label">Water Resist</span>
                    <span class="spec-val">${escapeHtml(w.waterResistance)}</span>
                  </div>
                ` : ''}
              </div>

              <div class="watch-footer-row">
                <div class="price-box">
                  <span class="price-now">₹${escapeHtml(w.price)}</span>
                  ${w.mrp ? `<span class="price-mrp">₹${escapeHtml(w.mrp)}</span>` : ''}
                </div>
                <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn-buy-wa">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 1.771.815 2.796.815 3.182 0 5.768-2.587 5.768-5.767.001-3.18-2.585-5.766-5.768-5.766zm9.969 5.768c0 5.48-4.453 9.932-9.969 9.932-1.748 0-3.38-.456-4.807-1.252l-5.224 1.38 1.399-5.109c-.896-1.487-1.408-3.228-1.408-5.087 0-5.48 4.453-9.932 9.969-9.932 5.516 0 10.04 4.452 10.04 9.932z"/></svg>
                  <span>Buy on WhatsApp</span>
                </a>
              </div>
            </div>
          </article>
        `;
      }).join('')}
    </div>
  </main>

  <footer class="watch-bottom-strip">
    <div class="bottom-title">${siteTitle}</div>
    <a href="https://wa.me/${phone}?text=${encodeURIComponent(`Hi ${siteTitle}, I have a question regarding a timepiece model.`)}" target="_blank" rel="noopener noreferrer" class="bottom-cta">
      <span>Enquire on WhatsApp</span>
    </a>
  </footer>

  <script>
    (function() {
      var loader = document.getElementById('watch-loader');
      var bar = document.getElementById('p-bar');
      var txt = document.getElementById('p-txt');
      var p = 0;
      var intv = setInterval(function() {
        p += Math.floor(Math.random() * 25) + 15;
        if (p > 100) p = 100;
        if (bar) bar.style.width = p + '%';
        if (txt) txt.textContent = p + '%';
        if (p === 100) {
          clearInterval(intv);
          setTimeout(function() {
            if (loader) loader.classList.add('hidden');
          }, 200);
        }
      }, 60);
    })();
  </script>
</body>
</html>`;
}
