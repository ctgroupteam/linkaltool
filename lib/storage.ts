import fs from 'fs';
import path from 'path';
import os from 'os';
import { SiteData } from '@/types/site';
import { supabaseAdmin } from '@/lib/supabase';
import { submitUrlToGoogleIndexing } from '@/lib/seo/googleIndexer';

const INITIAL_SITES: SiteData[] = [];

const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

// Helper: Dynamically locate the data file path across environments
function getDataFilePath(): string {
  if (isServerless) {
    const tmpFile = path.join(os.tmpdir(), 'sites.json');
    if (!fs.existsSync(tmpFile)) {
      const seedCandidates = [
        path.join(process.cwd(), 'data', 'sites.json'),
        path.join(process.cwd(), 'Linkal Tool', 'data', 'sites.json'),
      ];
      for (const sc of seedCandidates) {
        if (fs.existsSync(sc)) {
          try {
            const bundled = fs.readFileSync(sc, 'utf-8');
            fs.writeFileSync(tmpFile, bundled, 'utf-8');
            break;
          } catch {}
        }
      }
    }
    return tmpFile;
  }

  const localCandidates = [
    path.join(process.cwd(), 'data', 'sites.json'),
    path.join(process.cwd(), 'Linkal Tool', 'data', 'sites.json'),
  ];
  for (const candidate of localCandidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  if (fs.existsSync(path.join(process.cwd(), 'Linkal Tool'))) {
    return path.join(process.cwd(), 'Linkal Tool', 'data', 'sites.json');
  }
  return path.join(process.cwd(), 'data', 'sites.json');
}

function loadInitialDiskSites(): SiteData[] {
  try {
    const localCandidates = [
      path.join(process.cwd(), 'data', 'sites.json'),
      path.join(process.cwd(), 'Linkal Tool', 'data', 'sites.json'),
    ];
    for (const c of localCandidates) {
      if (fs.existsSync(c)) {
        const raw = fs.readFileSync(c, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Filter out legacy dummy sites
          return parsed.filter((s: any) => s.slug !== 'barchi-s-furniture' && s.slug !== 'adil-portfolio' && s.slug !== 'solapurshop');
        }
      }
    }
  } catch {}
  return [...INITIAL_SITES];
}

let inMemorySites: SiteData[] = loadInitialDiskSites();

function ensureDataFile(): void {
  try {
    const dataFile = getDataFilePath();
    const dataDir = path.dirname(dataFile);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    if (!fs.existsSync(dataFile)) {
      fs.writeFileSync(dataFile, JSON.stringify(inMemorySites, null, 2), 'utf-8');
    }
  } catch (error) {
    console.warn('Storage directory check fallback:', error);
  }
}

/**
 * Fetch all sites from Supabase (Primary Source of Truth) with local fallback.
 * Zero GitHub API calls — 100% safe from token suspensions.
 */
export async function getAllSites(): Promise<SiteData[]> {
  const dataFile = getDataFilePath();

  // 1. Primary Source: Supabase stores table
  try {
    const { data, error } = await supabaseAdmin
      .from('stores')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[Storage] Supabase getAllSites error:', error.message);
    } else if (data && data.length > 0) {
      const dbSites: SiteData[] = data.map((row: any) => {
        if (row.site_data && typeof row.site_data === 'object' && row.site_data.id) {
          return {
            ...row.site_data,
            visitsCount: row.visits_count || row.site_data.visitsCount || 0,
            clicksCount: row.clicks_count || row.site_data.clicksCount || 0,
          };
        }
        return {
          id: row.id,
          name: row.business_name || row.slug,
          slug: row.slug,
          type: row.category === 'portfolio' ? 'portfolio' : row.category === 'single_product' ? 'single_product' : 'ecommerce',
          whatsappNumber: row.whatsapp_number,
          userEmail: row.contact_email,
          status: row.is_active ? 'live' : 'draft',
          visitsCount: row.visits_count || 0,
          clicksCount: row.clicks_count || 0,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        } as SiteData;
      });

      inMemorySites = dbSites;
      return dbSites;
    }
  } catch (err) {
    console.warn('[Storage] Supabase fetch fallback to local cache:', err);
  }

  // 2. Local disk cache fallback
  try {
    ensureDataFile();
    if (fs.existsSync(dataFile)) {
      const content = fs.readFileSync(dataFile, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        inMemorySites = parsed.filter((s: any) => s.slug !== 'barchi-s-furniture' && s.slug !== 'adil-portfolio' && s.slug !== 'solapurshop');
        return inMemorySites;
      }
    }
  } catch (error) {
    console.warn('Read storage fallback to memory:', error);
  }

  return inMemorySites;
}

export async function getSiteById(id: string): Promise<SiteData | null> {
  const sites = await getAllSites();
  return sites.find(s => s.id === id) || null;
}

export async function getSiteBySlug(slug: string): Promise<SiteData | null> {
  const cleanSlug = (slug || '').toLowerCase().trim();
  if (!cleanSlug) return null;

  // 1. Direct query to Supabase (primary source of truth, instantaneous, bypasses stale memory)
  try {
    const { data, error } = await supabaseAdmin
      .from('stores')
      .select('*')
      .eq('slug', cleanSlug)
      .maybeSingle();

    if (error) {
      console.warn(`[Storage] Supabase direct lookup for '${cleanSlug}' error:`, error.message);
    } else if (data) {
      if (data.site_data && typeof data.site_data === 'object' && data.site_data.id) {
        return {
          ...data.site_data,
          visitsCount: data.visits_count || data.site_data.visitsCount || 0,
          clicksCount: data.clicks_count || data.site_data.clicksCount || 0,
        };
      }
      return {
        id: data.id,
        name: data.business_name || data.slug,
        slug: data.slug,
        type: data.category === 'portfolio' ? 'portfolio' : data.category === 'single_product' ? 'single_product' : 'ecommerce',
        whatsappNumber: data.whatsapp_number,
        userEmail: data.contact_email,
        status: data.is_active ? 'live' : 'draft',
        visitsCount: data.visits_count || 0,
        clicksCount: data.clicks_count || 0,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      } as SiteData;
    }
  } catch (err) {
    console.warn(`[Storage] Supabase direct query exception for '${cleanSlug}':`, err);
  }

  // 2. Memory / disk fallback
  if (inMemorySites && inMemorySites.length > 0) {
    const match = inMemorySites.find(s => s.slug.toLowerCase().trim() === cleanSlug);
    if (match) return match;
  }
  const sites = await getAllSites();
  return sites.find(s => s.slug.toLowerCase().trim() === cleanSlug) || null;
}

/**
 * Save site directly to Supabase and memory cache.
 * ZERO GitHub commits, ZERO Vercel rebuilds, INSTANT live updates.
 */
export async function saveSite(site: SiteData): Promise<SiteData> {
  const sites = await getAllSites();
  const index = sites.findIndex(s => s.id === site.id);
  
  const updatedSite: SiteData = {
    ...site,
    visitsCount: site.visitsCount || 0,
    clicksCount: site.clicksCount || 0,
    updatedAt: new Date().toISOString()
  };
  
  if (index >= 0) {
    sites[index] = updatedSite;
  } else {
    sites.unshift(updatedSite);
  }

  inMemorySites = sites;
  
  // 1. Save to local disk cache / tmp
  try {
    ensureDataFile();
    const dataFile = getDataFilePath();
    fs.writeFileSync(dataFile, JSON.stringify(sites, null, 2), 'utf-8');
  } catch (error) {
    console.warn('Write storage fallback:', error);
  }

  // 2. Primary Database: Upsert directly to Supabase stores table
  try {
    const { error: sbError } = await supabaseAdmin.from('stores').upsert({
      id: site.id,
      slug: site.slug,
      business_name: site.name,
      category: site.type || 'ecommerce',
      template_id: site.templateId || 'modern',
      whatsapp_number: site.whatsappNumber || '',
      contact_email: site.userEmail || site.cvEmail || '',
      site_data: updatedSite,
      is_active: site.status === 'live',
      visits_count: updatedSite.visitsCount || 0,
      clicks_count: updatedSite.clicksCount || 0,
      updated_at: new Date().toISOString(),
    });
    if (sbError) {
      console.warn('[Storage] Supabase upsert error:', sbError.message);
    } else {
      console.log(`[Storage] Saved ${site.slug} directly to Supabase (Zero-Deploy)`);
      if (site.status === 'live') {
        try {
          const siteUrl = site.liveUrl || `https://${site.slug}.linkal.in`;
          Promise.resolve(submitUrlToGoogleIndexing(siteUrl)).catch(() => {});
        } catch {}
      }
    }
  } catch (err) {
    console.warn('[Storage] Supabase stores upsert exception:', err);
  }

  return updatedSite;
}

/**
 * Delete site directly from Supabase and memory cache.
 * ZERO GitHub commits.
 */
export async function deleteSite(id: string): Promise<boolean> {
  const sites = await getAllSites();
  const filtered = sites.filter(s => s.id !== id);
  if (filtered.length === sites.length) return false;

  inMemorySites = filtered;

  try {
    ensureDataFile();
    const dataFile = getDataFilePath();
    fs.writeFileSync(dataFile, JSON.stringify(filtered, null, 2), 'utf-8');
  } catch (error) {
    console.warn('Delete storage fallback:', error);
  }

  try {
    await supabaseAdmin.from('stores').delete().eq('id', id);
    console.log(`[Storage] Deleted site ${id} directly from Supabase`);
  } catch (e) {
    console.warn('[Storage] Supabase delete exception:', e);
  }

  return true;
}
