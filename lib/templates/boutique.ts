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

export function generateBoutiqueHtml(site: SiteData): string {
  const phone = cleanPhone(site.whatsappNumber);
  const siteTitle = escapeHtml(site.name || 'Aura Couture & Designer Boutique');
  const themeColor = site.themeColor || '#be123c';

  const items = (site.products && site.products.length > 0)
    ? site.products
    : [
        { id: 'bt-1', name: 'Banarasi Pure Katan Silk Saree', price: '4899', description: 'Handcrafted zari weaving with rich pallu and unstitched blouse piece.', imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=700&auto=format&fit=crop&q=80', badge: 'Handloom Pure' },
        { id: 'bt-2', name: 'Royal Velvet Embroidered Lehenga', price: '12499', description: 'Intricate zardozi and sequin embroidery with matching net dupatta.', imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=700&auto=format&fit=crop&q=80', badge: 'Bridal Edit' },
        { id: 'bt-3', name: 'Chanderi Silk Anarkali Set', price: '3499', description: 'Floor-length flared silhouette with gotta patti detailing and pant.', imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=700&auto=format&fit=crop&q=80', badge: 'Bestseller' },
        { id: 'bt-4', name: 'Organza Floral Pastel Saree', price: '2899', description: 'Airy lightweight organza with hand-painted digital florals and scalloped borders.', imageUrl: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=700&auto=format&fit=crop&q=80' }
      ];

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>${siteTitle} • Designer Boutique</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: ${themeColor};
      --bg: #fffcf9;
      --card: #ffffff;
      --border: #f0e6dc;
      --text: #292524;
      --muted: #78716c;
      --gold: #d97706;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: var(--bg); color: var(--text); font-family: 'Plus Jakarta Sans', sans-serif; min-height: 100vh; padding-bottom: 6rem; }

    .bt-hero { text-align: center; padding: 4rem 1.5rem 3rem; background: #fff5f2; border-bottom: 1px solid var(--border); }
    .bt-badge { display: inline-block; background: #ffe4e6; color: var(--primary); padding: 0.3rem 0.9rem; border-radius: 99px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 1rem; }
    .bt-title { font-family: 'Cormorant Garamond', serif; font-size: 3rem; font-weight: 700; color: #1c1917; margin-bottom: 0.5rem; }
    .bt-tagline { color: var(--muted); font-size: 1rem; max-width: 540px; margin: 0 auto; line-height: 1.6; }

    .bt-container { max-width: 1040px; margin: 3rem auto; padding: 0 1.25rem; }
    .section-head { text-align: center; margin-bottom: 2.5rem; }
    .section-title { font-family: 'Cormorant Garamond', serif; font-size: 2.2rem; font-weight: 700; color: #1c1917; margin-bottom: 0.3rem; }
    .section-desc { color: var(--muted); font-size: 0.92rem; }

    .bt-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.75rem; }
    .bt-card { background: var(--card); border: 1px solid var(--border); border-radius: 18px; overflow: hidden; display: flex; flex-direction: column; transition: transform 0.25s, box-shadow 0.25s; }
    .bt-card:hover { transform: translateY(-4px); box-shadow: 0 14px 30px rgba(0,0,0,0.06); }
    .bt-img-box { position: relative; width: 100%; height: 340px; overflow: hidden; background: #f5ebe6; }
    .bt-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
    .bt-card:hover .bt-img { transform: scale(1.05); }
    .bt-tag { position: absolute; top: 12px; left: 12px; background: var(--primary); color: #fff; padding: 0.25rem 0.7rem; border-radius: 6px; font-size: 0.72rem; font-weight: 800; text-transform: uppercase; }

    .bt-body { padding: 1.4rem; display: flex; flex-direction: column; flex: 1; }
    .bt-item-name { font-family: 'Cormorant Garamond', serif; font-size: 1.35rem; font-weight: 700; color: #1c1917; margin-bottom: 0.4rem; }
    .bt-item-desc { font-size: 0.86rem; color: var(--muted); line-height: 1.5; margin-bottom: 1.2rem; flex: 1; }

    .bt-card-footer { margin-top: auto; padding-top: 1rem; border-top: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; }
    .bt-price { font-size: 1.3rem; font-weight: 800; color: var(--primary); }
    .btn-wa-order { background: #25D366; color: #fff; text-decoration: none; padding: 0.65rem 1.15rem; border-radius: 10px; font-weight: 800; font-size: 0.85rem; display: flex; align-items: center; gap: 0.4rem; }

    .bt-bottom-bar { position: fixed; bottom: 0; left: 0; right: 0; background: rgba(255,252,249,0.96); backdrop-filter: blur(12px); border-top: 1px solid var(--border); padding: 0.85rem 1.25rem; display: flex; align-items: center; justify-content: space-between; z-index: 999; }
    .bt-bottom-title { font-family: 'Cormorant Garamond', serif; font-size: 1.2rem; font-weight: 700; color: #1c1917; }
    .bt-bottom-cta { background: #25D366; color: #fff; text-decoration: none; padding: 0.6rem 1.3rem; border-radius: 99px; font-weight: 800; font-size: 0.85rem; display: flex; align-items: center; gap: 0.4rem; }

    @media (max-width: 640px) {
      .bt-title { font-size: 2.2rem; }
      .bt-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>

  <header class="bt-hero">
    <span class="bt-badge">Curated Handloom &bull; Bespoke Tailoring</span>
    <h1 class="bt-title">${siteTitle}</h1>
    <p class="bt-tagline">Explore handcrafted ethnic silhouettes, pure heritage silks, and contemporary luxury festive wear. Custom sizing available via WhatsApp.</p>
  </header>

  <main class="bt-container">
    <div class="section-head">
      <h2 class="section-title">Festive &amp; Bridal Collection</h2>
      <p class="section-desc">Each ensemble is carefully hand-stitched by master artisans with pure fabrics and premium finish.</p>
    </div>

    <div class="bt-grid">
      ${items.map(p => {
        const waMsg = encodeURIComponent(`Hi ${siteTitle}, I would like to order/inquire about: ${p.name} (₹${p.price}). Please share available sizes and delivery timeline!`);
        const waUrl = `https://wa.me/${phone}?text=${waMsg}`;
        return `
          <article class="bt-card">
            ${p.imageUrl ? `
              <div class="bt-img-box">
                <img src="${p.imageUrl}" alt="${escapeHtml(p.name)}" class="bt-img" loading="lazy">
                ${p.badge ? `<span class="bt-tag">${escapeHtml(p.badge)}</span>` : ''}
              </div>
            ` : ''}
            <div class="bt-body">
              <h3 class="bt-item-name">${escapeHtml(p.name)}</h3>
              <p class="bt-item-desc">${escapeHtml(p.description)}</p>
              <div class="bt-card-footer">
                <span class="bt-price">₹${escapeHtml(p.price)}</span>
                <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn-wa-order">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 1.771.815 2.796.815 3.182 0 5.768-2.587 5.768-5.767.001-3.18-2.585-5.766-5.768-5.766zm9.969 5.768c0 5.48-4.453 9.932-9.969 9.932-1.748 0-3.38-.456-4.807-1.252l-5.224 1.38 1.399-5.109c-.896-1.487-1.408-3.228-1.408-5.087 0-5.48 4.453-9.932 9.969-9.932 5.516 0 10.04 4.452 10.04 9.932z"/></svg>
                  <span>Order on WhatsApp</span>
                </a>
              </div>
            </div>
          </article>
        `;
      }).join('')}
    </div>
  </main>

  <footer class="bt-bottom-bar">
    <div class="bt-bottom-title">${siteTitle}</div>
    <a href="https://wa.me/${phone}?text=${encodeURIComponent(`Hi ${siteTitle}, I have an inquiry about custom bridal stitching or fabric selection.`)}" target="_blank" rel="noopener noreferrer" class="bt-bottom-cta">
      <span>Chat on WhatsApp</span>
    </a>
  </footer>

</body>
</html>`;
}
