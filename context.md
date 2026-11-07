# 🌐 Linkal Platform — Architecture, Scaling & Infrastructure Context

> **Document Purpose**: This file serves as the permanent knowledge base, technical research archive, and architectural blueprint for the Linkal Website Builder SaaS platform. It captures all discussions, evaluated alternatives, platform limits, and final decisions for scaling to 1,000–10,000+ customer storefronts.

---

## 📌 Executive Summary & Current Status

* **Project**: Linkal Website Builder (`Linkal Tool`) — A Next.js 16 (App Router) + React 19 + TypeScript platform designed to generate high-converting, mobile-responsive storefronts with direct WhatsApp conversion links.
* **Target Domain**: **`linkal.in`** (replacing test domain `dominal.in`).
* **Active Credentials Saved** (in `Linkal Tool/.env.local`):
  * **GitHub Token**: `[REDACTED_SECURE_TOKEN_SAVED_IN_ENV]`
  * **GitHub Account**: `ctgroupteam`
  * **Vercel Token**: `[REDACTED_SECURE_TOKEN_SAVED_IN_ENV]`
  * **Vercel Team ID**: `team_tvoncHtTym1zblw6TERP7Djt`
  * **Cloudflare Credentials**: Pending domain purchase & account setup.

---

## 🔍 Key Research Topics & Discussions

### 1. Domain Registration & Cloudflare Setup
* **Question**: *Can we obtain a Cloudflare Zone ID and API Token without adding or buying a domain first?*
* **Findings**:
  * **Zone ID**: **No.** Cloudflare verifies registration with the TLD registry. If `linkal.in` is unpurchased, Cloudflare rejects it with `"<domain> is not a registered domain"`. You must purchase/register the domain first, then add it to Cloudflare to receive the unique Zone ID.
  * **API Token**: **Yes.** You can generate a Custom API Token in advance with `Zone:DNS:Edit` permissions by selecting *"All zones from an account"*. As soon as `linkal.in` is added, the token automatically has control.
* **Action Order**:
  1. Buy `linkal.in` (Namecheap, GoDaddy, Hostinger, etc.).
  2. Add `linkal.in` to Cloudflare (Free Plan) &rarr; immediately get the Zone ID and nameservers.
  3. Create Cloudflare API Token.

---

### 2. Wildcard DNS (`*.linkal.in`) vs. Individual DNS Records

* **Question**: *Can we use a wildcard DNS record (`*`) instead of creating a DNS record via API on every site publish? Does Google SEO treat subdomains as independent sites?*
* **How Wildcard DNS Works**:
  * Add a single CNAME record in Cloudflare:
    * **Type**: `CNAME`
    * **Name**: `*` (matches `*.linkal.in`)
    * **Target**: `cname.vercel-dns.com`
    * **Proxy**: `DNS only` (Grey cloud)
  * Any subdomain request (e.g. `unitywatches.linkal.in`, `solapurshop.linkal.in`) automatically routes to Vercel without calling any DNS API.

#### Comprehensive Comparison:

| Feature | Method A: Individual DNS Record per Site | Method B: Wildcard DNS (`*.linkal.in`) [Selected] |
| :--- | :--- | :--- |
| **Publish Pipeline** | Must call Cloudflare API on every publish | **Zero API calls** during site publish |
| **Publish Speed** | Slower (waits for DNS propagation) | **Instant** (Subdomains resolve immediately) |
| **Failure Points** | High (API rate limits, token expiry, outages) | **None** (DNS routing is static & permanent) |
| **Subdomain Limits**| Hard-capped by Cloudflare DNS record limits (~1,000–3,500) | **Infinite** subdomains supported |
| **Google SEO Impact**| Treated as independent site | Treated as independent site (**Identical**) |
| **SSL Provisioning** | Dedicated per-domain certificate | Auto-provisioned by Vercel on domain bind |
| **Catch-All 404**   | Non-existent subdomains show browser DNS error | Non-existent subdomains route to platform 404 |

#### SEO Verdict for Subdomains:
* Google crawls and indexes subdomains as **completely independent entities**.
* Global giants (Shopify: `*.myshopify.com`, WordPress: `*.wordpress.com`, Webflow: `*.webflow.io`) use this identical model.
* Subdomains inherit the root domain's trust faster, bypassing the usual 6-month Google "sandbox" period for fresh domains.
* Each site maintains its own custom `<title>`, OpenGraph tags, meta description, and JSON-LD schema.

---

### 3. Scaling & Infrastructure Limits (1,000 to 10,000 Sites)

#### A. Vercel Limits (Hobby vs. Pro)
* **Vercel Hobby (Free)**:
  * **Max Projects**: 200 projects per account.
  * **Daily Deployments**: Hard limit of **100 deployments/day**.
  * **Bandwidth**: 100 GB/month.
* **Why the Old Approach Breaks**: The prototype created 1 separate Vercel project per customer (`POST /v9/projects`). At 200 users, new projects are blocked; at 1,000 users making edits, the 100 deploys/day cap is hit immediately.

#### B. GitHub Ban / Suspension Risk
* **Critical Finding**: Using GitHub as a live database by committing HTML/JSON files via API on every customer edit violates GitHub's Terms of Service.
* **Risks**:
  * API rate limit: 5,000 requests/hour.
  * Repository bloat: Thousands of commits cause repositories to exceed recommended 1–5 GB limits.
  * Automated abuse detection: Accounts running automated commit bots for data persistence risk shadow-bans or account termination.
* **Rule**: **GitHub must only store the core platform code, never customer runtime content.**

#### C. Database & Storage: Supabase vs. Firebase (Spark Free Plan)
* **Firebase (Spark Free)**:
  * Firestore: 50,000 reads/day, 20,000 writes/day. (At 1,000 users, 50 reads each exhausts the entire daily limit).
  * Storage: 1 GB/day download egress (exhausted in hours under normal traffic).
* **Supabase (Free Tier)**:
  * **Unlimited API reads & writes** (PostgreSQL).
  * 500 MB database (easily stores >50,000 site records).
  * 1 GB storage, 2 GB egress bandwidth.
* **Verdict**: **Supabase is vastly superior** because it does not artificially throttle daily read/write volume.

#### D. Cloudflare Egress & Bandwidth Superpower
* Cloudflare CDN has **zero egress charges and unlimited bandwidth**.
* **Cloudflare R2** (Object Storage): 10 GB free, $0 egress fees. However, activating R2 requires a credit card on file.

---

## 🏗️ Architectural Options Evaluated

### Option 1: Multi-Tenant Single Next.js Project on Vercel *(RECOMMENDED)*
* **Concept**: One core Next.js application deployed once on Vercel. Wildcard domain `*.linkal.in` points to this single project.
* **Workflow**:
  1. Visitor opens `https://unitywatches.linkal.in`.
  2. `middleware.ts` extracts the slug (`unitywatches`).
  3. Dynamic route `app/sites/[slug]/page.tsx` fetches the site JSON from Supabase.
  4. The page is rendered and cached at the edge.
* **Edits**: When an owner changes prices or products, it writes to Supabase in 10ms. **0 Vercel deployments needed. Instant updates.**

### Option 2: Cloudflare Pages Hosting
* **Concept**: Host static site builds on Cloudflare Pages.
* **Pros**: 100% free, unlimited bandwidth, no credit card required.
* **Cons**: Next.js 16 App Router requires complex edge adapters (`@cloudflare/next-on-pages`) which can cause Node.js compatibility issues with libraries like `jose` or dynamic database drivers.
* **Future Utility**: Excellent fallback if hosting pure compiled static `index.html` files.

### Option 3: Self-Hosting via Cheap VPS ($4–$5/mo)
* **Concept**: Run Docker / Coolify / Dokku on Hetzner or DigitalOcean.
* **Pros**: Complete control, unlimited projects, zero deployment limits.
* **Cons**: Requires Linux server maintenance, manual SSL management, and database backups.

### Option 4: Image Handling Without Credit Cards (Supabase Storage + Cloudflare CDN Cache)
* **The Problem**: Cloudflare R2 requires a credit card on file to activate.
* **The Zero-Card Solution**:
  1. Upload images to **Supabase Storage** (1 GB free, no credit card needed).
  2. Proxy image URLs through Cloudflare CDN (`cdn.linkal.in`).
  3. Cloudflare fetches each image from Supabase **only once** on the first visit, then caches it permanently across 300+ edge locations.
  4. Subsequent thousands of downloads are served from Cloudflare's free cache.
  5. **Supabase egress used: < 10 MB. Total cost: $0. Credit card needed: NONE.**

---

## 🎯 Final Blueprint: 100% Free, Zero-Card Production Stack

```
                                [ Visitor Browser ]
                                         │
                                         ▼
                      [ Cloudflare Wildcard *.linkal.in ]
                               (Unlimited Bandwidth)
                                         │
                    ┌────────────────────┴────────────────────┐
                    ▼                                         ▼
         [ Web App / Storefront ]                     [ Media & Assets ]
       1 Single Next.js on Vercel                    Cloudflare CDN Edge Cache
                    │                                         │
                    ▼                                         ▼
          [ Supabase Database ]                      [ Supabase Storage ]
       (Products, Menus, Slugs)                    (1GB Free, 0 Egress Bleed)
```

### Exact Breakdown:

| Service | Provider | Purpose | Limits / Cost | Credit Card Required? |
| :--- | :--- | :--- | :--- | :--- |
| **Domain & DNS** | Cloudflare | Wildcard DNS (`*.linkal.in`) | Free, unlimited | ❌ **No** |
| **CDN & SSL** | Cloudflare | Global edge caching & HTTPS | Free, unlimited bandwidth | ❌ **No** |
| **App Engine** | Vercel | 1 Multi-Tenant Project | 1 project total, 0 deploys per edit | ❌ **No** |
| **Database** | Supabase | Site content, menus, WhatsApp | Free tier (Unlimited reads) | ❌ **No** |
| **Image Storage** | Supabase Storage | Product/menu photos | 1 GB Free (Protected by Cloudflare CDN) | ❌ **No** |

---

## 📝 Implementation Checklist

- [x] Save GitHub credentials to `.env.local`
- [x] Save Vercel credentials to `.env.local`
- [x] Create `.env.example` template
- [ ] Buy `linkal.in` domain
- [ ] Add `linkal.in` to Cloudflare (Free Plan)
- [ ] Add Wildcard CNAME: `*` &rarr; `cname.vercel-dns.com` (DNS only)
- [ ] Add Cloudflare Zone ID and Token to `.env.local`
- [ ] Replace `dominal.in` with `linkal.in` in codebase
- [ ] Implement Multi-Tenant `middleware.ts` for dynamic subdomain routing
- [ ] Connect Supabase client for instant site data persistence
- [ ] Configure Cloudflare CDN caching rule for Supabase image storage
