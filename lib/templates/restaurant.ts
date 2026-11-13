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

export function generateRestaurantHtml(site: SiteData): string {
  const phone = cleanPhone(site.whatsappNumber);
  const siteTitle = escapeHtml(site.name || 'Gourmet Restaurant & Cafe');
  const themeColor = site.themeColor || '#e11d48';
  const fontFamily = site.fontFamily || 'Plus Jakarta Sans';
  const logoUrl = site.logoUrl || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop&q=80';

  const menuItems = (site.restaurantMenu && site.restaurantMenu.length > 0)
    ? site.restaurantMenu
    : (site.products && site.products.length > 0
      ? site.products.map((p, idx) => ({
        id: p.id,
        name: p.name,
        category: idx % 2 === 0 ? 'Starters & Grills' : 'Main Course',
        price: p.price,
        description: p.description,
        imageUrl: p.imageUrl,
        isVeg: idx % 3 === 0,
        badge: p.badge || (idx === 0 ? 'Chef Special' : undefined)
      }))
      : [
        { id: 'm-1', name: 'Turkish Chicken Shish Kebab', category: 'Starters & Grills', price: '340', description: 'Tender marinated chicken cubes flame-grilled with Turkish spices and served with garlic toum.', isVeg: false, badge: 'Chef Special', imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=80' },
        { id: 'm-2', name: 'Paneer Tikka Angara', category: 'Starters & Grills', price: '280', description: 'Charcoal-smoked fresh cottage cheese infused with Kashmiri chili and roasted spices.', isVeg: true, badge: 'Bestseller', imageUrl: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&auto=format&fit=crop&q=80' },
        { id: 'm-3', name: 'Arabian Mandi Special', category: 'Main Course', price: '480', description: 'Fragrant smoked long-grain basmati rice topped with slow-cooked spiced meat and fried almonds.', isVeg: false, badge: 'Must Try', imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80' },
        { id: 'm-4', name: 'Dal Bukhara Royale', category: 'Main Course', price: '260', description: 'Black lentils slow-cooked overnight with churned butter and rich cream.', isVeg: true, imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80' },
        { id: 'm-5', name: 'Pistachio Turkish Kunafa', category: 'Desserts', price: '220', description: 'Crispy shredded filo pastry filled with melted cheese, soaked in orange blossom syrup and topped with crushed pistachios.', isVeg: true, badge: 'House Special', imageUrl: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=600&auto=format&fit=crop&q=80' }
      ]
    );

  const categories = Array.from(new Set(menuItems.map(m => m.category || 'Specialties')));

  const createdAtMs = site.createdAt ? new Date(site.createdAt).getTime() : Date.now();
  const ageDays = (Date.now() - createdAtMs) / (1000 * 60 * 60 * 24);
  const isPaid = (site as any).isPaid === true || ((site as any).planExpiresAt && new Date((site as any).planExpiresAt).getTime() > Date.now());
  const trialExpired = !isPaid && ageDays >= 7;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>${siteTitle} • Digital Menu</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-body: #faf7f2;
      --bg-card: #ffffff;
      --primary: ${themeColor};
      --navy: #0f1d38;
      --text: #111827;
      --text-muted: #6b7280;
      --border: #e6ded3;
      --green-veg: #10b981;
      --red-nonveg: #ef4444;
      --gold: #d97706;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
    html, body { max-width: 100vw; width: 100%; overflow-x: hidden; }
    body { background-color: var(--bg-body); color: var(--text); font-family: '${fontFamily}', 'Plus Jakarta Sans', sans-serif; min-height: 100vh; overflow-x: hidden; }
    img { max-width: 100%; height: auto; }

    /* --- TURKISH ZAIKA SIGNATURE ENTRANCE LOADING BAR --- */
    #loading-overlay {
      position: fixed; inset: 0; background: var(--bg-body); z-index: 99999;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      padding: 24px; transition: opacity 0.6s ease, visibility 0.6s;
    }
    #loading-overlay.hidden { opacity: 0; visibility: hidden; pointer-events: none; }
    .loader-box { text-align: center; max-width: 340px; width: 100%; }
    .loader-logo { width: 90px; height: 90px; border-radius: 50%; object-fit: cover; margin: 0 auto 18px; border: 3px solid ${themeColor}; box-shadow: 0 8px 24px rgba(15,29,56,0.15); animation: pulseLogo 2s infinite ease-in-out; }
    @keyframes pulseLogo { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.06); } }
    .loader-title { font-family: 'Cinzel', serif; font-size: 1.4rem; color: var(--navy); margin-bottom: 6px; font-weight: 700; }
    .loader-subtitle { font-size: 0.8rem; text-transform: uppercase; letter-spacing: 2px; color: ${themeColor}; margin-bottom: 20px; font-weight: 700; }
    .progress-track { width: 100%; height: 5px; background: var(--border); border-radius: 99px; overflow: hidden; margin-bottom: 8px; }
    .progress-fill { height: 100%; width: 0%; background: linear-gradient(90deg, var(--gold), var(--primary)); border-radius: 99px; transition: width 0.15s ease-out; }
    .progress-text { font-size: 0.75rem; color: var(--text-muted); font-weight: 600; }

    /* Header */
    .rest-header { background: linear-gradient(135deg, ${themeColor} 0%, #0f1d38 100%); color: #fff; padding: 2.5rem 1.5rem 2rem; text-align: center; border-bottom: 3px solid ${themeColor}; }
    .rest-badge { display: inline-block; background: rgba(255,255,255,0.2); color: #fff; border: 1px solid rgba(255,255,255,0.4); padding: 0.25rem 0.8rem; border-radius: 99px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.75rem; }
    .rest-title { font-family: 'Cinzel', serif; font-size: 2.2rem; font-weight: 800; letter-spacing: 0.5px; margin-bottom: 0.5rem; }
    .rest-desc { color: #f1f5f9; font-size: 0.95rem; max-width: 540px; margin: 0 auto; line-height: 1.5; }

    /* Category Nav */
    .cat-nav-wrapper { position: sticky; top: 0; background: rgba(250,247,242,0.96); backdrop-filter: blur(10px); z-index: 100; border-bottom: 1px solid var(--border); padding: 0.75rem 1rem; overflow-x: auto; white-space: nowrap; -webkit-overflow-scrolling: touch; }
    .cat-nav { display: flex; gap: 0.6rem; max-width: 900px; margin: 0 auto; }
    .cat-pill { background: #fff; border: 1px solid var(--border); color: var(--navy); padding: 0.5rem 1.1rem; border-radius: 99px; font-size: 0.85rem; font-weight: 700; cursor: pointer; transition: all 0.2s; text-decoration: none; }
    .cat-pill:hover, .cat-pill.active { background: var(--primary); color: #fff; border-color: var(--primary); }

    /* Menu Grid */
    .menu-container { max-width: 960px; margin: 2rem auto; padding: 0 1rem 6rem; }
    .cat-heading { font-family: 'Cinzel', serif; font-size: 1.5rem; color: var(--navy); margin: 2rem 0 1rem; padding-bottom: 0.5rem; border-bottom: 2px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
    .menu-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem; }
    .menu-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.04); display: flex; flex-direction: column; transition: transform 0.2s, box-shadow 0.2s; }
    .menu-card:hover { transform: translateY(-3px); box-shadow: 0 10px 25px rgba(15,29,56,0.1); }
    .menu-card-img-wrap { position: relative; height: 180px; width: 100%; overflow: hidden; background: #e2e8f0; }
    .menu-card-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease; }
    .menu-card:hover .menu-card-img { transform: scale(1.05); }
    .menu-card-badge { position: absolute; top: 10px; right: 10px; background: var(--gold); color: #fff; padding: 0.2rem 0.6rem; border-radius: 6px; font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }

    .menu-card-body { padding: 1rem; display: flex; flex-direction: column; flex: 1; }
    .menu-header-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 0.5rem; margin-bottom: 0.35rem; }
    .menu-dish-name { font-size: 1.05rem; font-weight: 800; color: var(--navy); display: flex; align-items: center; gap: 0.45rem; }
    .veg-dot { width: 14px; height: 14px; border: 1.5px solid var(--green-veg); border-radius: 3px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .veg-dot::after { content: ''; width: 6px; height: 6px; background: var(--green-veg); border-radius: 50%; }
    .nonveg-dot { width: 14px; height: 14px; border: 1.5px solid var(--red-nonveg); border-radius: 3px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .nonveg-dot::after { content: ''; width: 0; height: 0; border-left: 4px solid transparent; border-right: 4px solid transparent; border-bottom: 7px solid var(--red-nonveg); }
    .menu-price { font-size: 1.15rem; font-weight: 800; color: var(--primary); white-space: nowrap; }
    .menu-desc { font-size: 0.84rem; color: var(--text-muted); line-height: 1.45; margin-bottom: 1rem; flex: 1; }

    .menu-btn-order { background: #25D366; color: #fff; border: none; padding: 0.6rem 1rem; border-radius: 10px; font-size: 0.85rem; font-weight: 700; display: inline-flex; align-items: center; justify-content: center; gap: 0.4rem; text-decoration: none; transition: background 0.2s; width: 100%; }
    .menu-btn-order:hover { background: #1eb956; }

    /* Sticky Bottom WhatsApp Contact Bar */
    .rest-bottom-bar { position: fixed; bottom: 0; left: 0; right: 0; background: rgba(15,29,56,0.96); backdrop-filter: blur(12px); border-top: 1px solid rgba(255,255,255,0.1); padding: 0.85rem 1.25rem; display: flex; align-items: center; justify-content: space-between; z-index: 999; }
    .rest-bottom-brand { color: #fff; font-weight: 700; font-size: 0.95rem; }
    .rest-bottom-cta { background: #25D366; color: #fff; text-decoration: none; padding: 0.6rem 1.25rem; border-radius: 99px; font-weight: 800; font-size: 0.85rem; display: flex; align-items: center; gap: 0.4rem; box-shadow: 0 4px 14px rgba(37,211,102,0.4); }

    /* 7-Day Free Trial Notice Banner */
    .trial-expired-banner {
      position: sticky; top: 0; z-index: 99999;
      background: linear-gradient(90deg, #991b1b, #b91c1c);
      color: #fff; padding: 0.65rem 1rem; font-size: 0.82rem; font-weight: 600;
      box-shadow: 0 4px 15px rgba(0,0,0,0.25); border-bottom: 2px solid #fca5a5;
    }
    .trial-banner-content {
      max-width: 900px; margin: 0 auto; display: flex; align-items: center; justify-content: center; gap: 0.75rem; flex-wrap: wrap; text-align: center;
    }
    .trial-badge {
      background: #ffffff; color: #991b1b; padding: 2px 8px; border-radius: 99px; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;
    }
    .trial-renew-link {
      background: #fef08a; color: #854d0e; padding: 0.35rem 0.9rem; border-radius: 8px; font-weight: 800; font-size: 0.8rem; text-decoration: none; box-shadow: 0 2px 8px rgba(0,0,0,0.2); transition: transform 0.15s;
    }
    .trial-renew-link:hover { transform: scale(1.04); background: #ffffff; }

    /* Search Bar (Turkish Zaika Style) */
    .search-bar-wrap { max-width: 900px; margin: 1rem auto 0; padding: 0 1rem; }
    .search-input-box { display: flex; align-items: center; gap: 0.6rem; background: #fff; border: 1.5px solid var(--border); border-radius: 99px; padding: 0.6rem 1.1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.03); }
    .search-input-box svg { color: var(--text-muted); flex-shrink: 0; }
    .search-input-box input { border: none; outline: none; background: transparent; width: 100%; font-size: 0.9rem; color: var(--navy); font-family: inherit; }

    @media (max-width: 640px) {
      .rest-title { font-size: 1.7rem; }
      .menu-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>

  <!-- 7-Day Free Trial Notice Banner -->
  ${trialExpired ? `
    <aside class="trial-expired-banner">
      <div class="trial-banner-content">
        <span class="trial-badge">Due Notice</span>
        <span>7-Day Free Trial Completed. Keep this digital menu live with instant renewal.</span>
        <a href="https://studio.linkal.in/builder/${site.id}?renew=true" target="_blank" rel="noopener noreferrer" class="trial-renew-link">
          Continue &bull; Renew for ₹99 &rarr;
        </a>
      </div>
    </aside>
  ` : ''}

  <!-- TURKISH ZAIKA ENTRANCE LOADING ANIMATION OVERLAY -->
  <div id="loading-overlay">
    <div class="loader-box">
      <img src="${logoUrl}" alt="${siteTitle}" class="loader-logo" onerror="this.src='https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop&q=80'">
      <h2 class="loader-title">${siteTitle}</h2>
      <p class="loader-subtitle">Preparing Fresh Digital Menu</p>
      <div class="progress-track">
        <div class="progress-fill" id="loader-bar"></div>
      </div>
      <span class="progress-text" id="loader-pct">Loading 0%</span>
    </div>
  </div>

  <!-- Announcement Bar -->
  ${site.announcementBarEnabled !== false && site.announcementText ? `
    <div style="background: ${escapeHtml(site.announcementBgColor || themeColor)}; color: ${escapeHtml(site.announcementTextColor || '#ffffff')}; padding: 0.65rem 1rem; text-align: center; font-size: 0.82rem; font-weight: 700; position: sticky; top: 0; z-index: 1000; letter-spacing: 0.5px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">
      ${escapeHtml(site.announcementText)}
    </div>
  ` : ''}

  <!-- 7-Day Trial Expiration & Renewal Notice -->
  ${trialExpired ? `
    <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); color: #fff; border-bottom: 2px solid #f59e0b; padding: 0.85rem 1.25rem; position: sticky; top: 0; z-index: 10000; box-shadow: 0 4px 20px rgba(0,0,0,0.3);">
      <div style="max-width: 800px; margin: 0 auto; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 0.75rem;">
        <div style="text-align: left;">
          <div style="display: flex; align-items: center; gap: 0.4rem; font-weight: 800; font-size: 0.88rem; color: #fbbf24;">
            <span>⏱️ 7-Day Free Trial Ended • Renewal Due</span>
          </div>
          <p style="font-size: 0.75rem; color: #cbd5e1; margin-top: 2px; line-height: 1.4;">
            If you are the restaurant owner, renew your plan for ₹99 to keep your live QR menu active and avoid losing customers.
          </p>
        </div>
        <a href="https://studio.linkal.in/dashboard?renew=${encodeURIComponent(site.id || '')}&slug=${encodeURIComponent(site.slug || '')}" target="_blank" rel="noopener noreferrer" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #000; font-weight: 800; font-size: 0.78rem; padding: 0.55rem 1.25rem; border-radius: 99px; text-decoration: none; white-space: nowrap; box-shadow: 0 2px 8px rgba(245,158,11,0.3); display: inline-block;">
          Owner Login &amp; Renew Menu (₹99) &rarr;
        </a>
      </div>
    </div>
  ` : ''}

  <header class="rest-header">
    ${site.logoUrl ? `
      <img src="${escapeHtml(site.logoUrl)}" alt="${siteTitle}" style="width: 72px; height: 72px; border-radius: 50%; object-fit: cover; margin: 0 auto 0.85rem; border: 2.5px solid #fff; box-shadow: 0 4px 15px rgba(0,0,0,0.3); display: block;" onerror="this.style.display='none'" />
    ` : ''}
    <span class="rest-badge">Fresh &bull; Authentic &bull; Live Orders</span>
    <h1 class="rest-title">${siteTitle}</h1>
    <p class="rest-desc">Explore our authentic chef-crafted dishes and order directly to our live kitchen via WhatsApp.</p>
  </header>

  <nav class="cat-nav-wrapper">
    <div class="cat-nav">
      ${categories.map(c => {
        const cSlug = escapeHtml(c.toLowerCase().replace(/[^a-z0-9]/g, '-'));
        return `<a href="#cat-${cSlug}" onclick="event.preventDefault(); var target = document.getElementById('cat-${cSlug}'); if(target) target.scrollIntoView({ behavior: 'smooth' });" class="cat-pill">${escapeHtml(c)}</a>`;
      }).join('')}
    </div>
  </nav>

  <!-- Live Dish Search Bar (Turkish Zaika Style) -->
  <div class="search-bar-wrap">
    <div class="search-input-box">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
      <input type="text" id="menu-search-input" placeholder="Search delicious dishes, biryani, starters..." oninput="filterMenuItems(this.value)">
    </div>
  </div>

  <main class="menu-container">
    ${categories.map(cat => {
    const items = menuItems.filter(m => (m.category || 'Specialties') === cat);
    const catId = `cat-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
    return `
        <section id="${catId}">
          <h2 class="cat-heading">
            <span>${escapeHtml(cat)}</span>
            <span style="font-size:0.85rem; font-family:'Plus Jakarta Sans',sans-serif; color:var(--text-muted); font-weight:600;">${items.length} items</span>
          </h2>
          <div class="menu-grid">
            ${items.map(item => {
      const waMsg = encodeURIComponent(`Hi ${siteTitle}, I would like to order: ${item.name} (₹${item.price}). Please confirm order!`);
      const waUrl = `https://wa.me/${phone}?text=${waMsg}`;
      return `
                <article class="menu-card">
                  ${item.imageUrl ? `
                    <div class="menu-card-img-wrap">
                      <img src="${item.imageUrl}" alt="${escapeHtml(item.name)}" class="menu-card-img" loading="lazy">
                      ${item.badge ? `<span class="menu-card-badge">${escapeHtml(item.badge)}</span>` : ''}
                    </div>
                  ` : ''}
                  <div class="menu-card-body">
                    <div class="menu-header-row">
                      <h3 class="menu-dish-name">
                        <span class="${item.isVeg ? 'veg-dot' : 'nonveg-dot'}" title="${item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}"></span>
                        <span>${escapeHtml(item.name)}</span>
                      </h3>
                      <span class="menu-price">₹${escapeHtml(item.price)}</span>
                    </div>
                    ${item.description ? `<p class="menu-desc">${escapeHtml(item.description)}</p>` : ''}
                    <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="menu-btn-order">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 1.771.815 2.796.815 3.182 0 5.768-2.587 5.768-5.767.001-3.18-2.585-5.766-5.768-5.766zm9.969 5.768c0 5.48-4.453 9.932-9.969 9.932-1.748 0-3.38-.456-4.807-1.252l-5.224 1.38 1.399-5.109c-.896-1.487-1.408-3.228-1.408-5.087 0-5.48 4.453-9.932 9.969-9.932 5.516 0 10.04 4.452 10.04 9.932z"/></svg>
                      <span>Order on WhatsApp</span>
                    </a>
                  </div>
                </article>
              `;
    }).join('')}
          </div>
        </section>
      `;
  }).join('')}
  </main>

  <footer class="rest-bottom-bar">
    <div class="rest-bottom-brand">${siteTitle}</div>
    <a href="https://wa.me/${phone}?text=${encodeURIComponent(`Hi ${siteTitle}, I want to check table availability or place a custom order.`)}" target="_blank" rel="noopener noreferrer" class="rest-bottom-cta">
      <span>Chat on WhatsApp</span>
    </a>
  </footer>

  <script>
    // Smooth Turkish Zaika Entrance Loading Bar Simulation
    (function() {
      var overlay = document.getElementById('loading-overlay');
      var bar = document.getElementById('loader-bar');
      var pct = document.getElementById('loader-pct');
      var progress = 0;
      var interval = setInterval(function() {
        progress += Math.floor(Math.random() * 22) + 12;
        if (progress > 100) progress = 100;
        if (bar) bar.style.width = progress + '%';
        if (pct) pct.textContent = 'Loading ' + progress + '%';
        if (progress === 100) {
          clearInterval(interval);
          setTimeout(function() {
            if (overlay) overlay.classList.add('hidden');
          }, 250);
        }
      }, 70);
    })();

    function filterMenuItems(query) {
      var q = (query || '').toLowerCase().trim();
      var cards = document.querySelectorAll('.menu-card');
      cards.forEach(function(card) {
        var text = (card.textContent || '').toLowerCase();
        card.style.display = (!q || text.includes(q)) ? 'flex' : 'none';
      });
    }
  </script>
</body>
</html>`;
}

