import fs from 'fs';
import path from 'path';
import os from 'os';
import { SiteData } from '@/types/site';
import { supabaseAdmin } from '@/lib/supabase';

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
let lastSyncedFromRemote = false;

// Helper: Sync sites from GitHub repository (ctgroupteam/linkaltool)
async function fetchRemoteSitesFromGitHub(): Promise<SiteData[] | null> {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER || 'ctgroupteam';
  const repo = process.env.GITHUB_REPO || 'linkaltool';
  if (!token) return null;

  const reposToTry = [
    { owner, repo },
    { owner: 'ctgroupteam', repo: 'linkaltool' },
    { owner: 'ctgroupteam', repo: 'linkal' },
  ].filter((v, idx, arr) => arr.findIndex(x => x.owner === v.owner && x.repo === v.repo) === idx);

  for (const target of reposToTry) {
    try {
      const url = `https://api.github.com/repos/${target.owner}/${target.repo}/contents/data/sites.json`;
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
          'User-Agent': 'Linkal-Website-Builder',
        },
        cache: 'no-store',
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.content) {
          const content = Buffer.from(data.content, 'base64').toString('utf-8');
          const rawSites = JSON.parse(content);
          if (Array.isArray(rawSites)) {
            // Clean out any legacy dummy sites
            const sites = rawSites.filter((s: any) => s.slug !== 'barchi-s-furniture' && s.slug !== 'adil-portfolio' && s.slug !== 'solapurshop');
            console.log(`[Storage] Synced ${sites.length} sites from GitHub (${target.owner}/${target.repo})`);
            return sites;
          }
        }
      }
    } catch (err) {
      console.warn(`[Storage] Could not fetch remote sites from GitHub (${target.owner}/${target.repo}):`, err);
    }
  }

  return null;
}

// Helper: Save sites to GitHub repository
async function saveRemoteSitesToGitHub(sites: SiteData[]): Promise<boolean> {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER || 'ctgroupteam';
  const repo = process.env.GITHUB_REPO || 'linkaltool';
  if (!token) return false;

  const reposToTry = [
    { owner, repo },
    { owner: 'ctgroupteam', repo: 'linkaltool' },
  ].filter((v, idx, arr) => arr.findIndex(x => x.owner === v.owner && x.repo === v.repo) === idx);

  // Clean out any legacy dummy sites before saving
  const cleanSites = sites.filter((s: any) => s.slug !== 'barchi-s-furniture' && s.slug !== 'adil-portfolio' && s.slug !== 'solapurshop');

  for (const target of reposToTry) {
    try {
      const url = `https://api.github.com/repos/${target.owner}/${target.repo}/contents/data/sites.json`;
      let existingSha: string | undefined;
      const checkRes = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
          'User-Agent': 'Linkal-Website-Builder',
        },
        cache: 'no-store',
      });
      if (checkRes.ok) {
        const data = await checkRes.json();
        existingSha = data.sha;
      }

      const content = Buffer.from(JSON.stringify(cleanSites, null, 2), 'utf-8').toString('base64');
      const putRes = await fetch(url, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
          'Content-Type': 'application/json',
          'User-Agent': 'Linkal-Website-Builder',
        },
        body: JSON.stringify({
          message: `Sync customer sites database [${cleanSites.length} sites]`,
          content,
          sha: existingSha,
        }),
      });

      if (putRes.ok) {
        console.log(`[Storage] Successfully committed ${cleanSites.length} sites to GitHub database (${target.owner}/${target.repo})`);
        return true;
      }
    } catch (err) {
      console.warn(`[Storage] Could not save sites to GitHub database (${target.owner}/${target.repo}):`, err);
    }
  }

  return false;
}

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

export async function getAllSites(): Promise<SiteData[]> {
  const dataFile = getDataFilePath();

  // 1. Try fetching from Supabase stores table if table exists
  try {
    const { data, error } = await supabaseAdmin
      .from('stores')
      .select('*')
      .order('created_at', { ascending: false });

    if (data && data.length > 0) {
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
    // Supabase table not created yet or connection error; fallback gracefully
  }

  // 2. Fetch from remote GitHub database
  if (!lastSyncedFromRemote) {
    const remoteSites = await fetchRemoteSitesFromGitHub();
    if (remoteSites !== null) {
      inMemorySites = remoteSites;
      lastSyncedFromRemote = true;
      try {
        ensureDataFile();
        fs.writeFileSync(dataFile, JSON.stringify(remoteSites, null, 2), 'utf-8');
      } catch {}
      return inMemorySites;
    }
    lastSyncedFromRemote = true;
  }

  // 3. Local disk cache
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
  const cleanSlug = slug.toLowerCase().trim();
  if (inMemorySites && inMemorySites.length > 0) {
    const match = inMemorySites.find(s => s.slug.toLowerCase().trim() === cleanSlug);
    if (match) return match;
  }
  const sites = await getAllSites();
  return sites.find(s => s.slug.toLowerCase().trim() === cleanSlug) || null;
}

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
  
  // 1. Save locally / tmp
  try {
    ensureDataFile();
    const dataFile = getDataFilePath();
    fs.writeFileSync(dataFile, JSON.stringify(sites, null, 2), 'utf-8');
  } catch (error) {
    console.warn('Write storage fallback:', error);
  }

  // 2. Commit to GitHub database
  try {
    await saveRemoteSitesToGitHub(sites);
  } catch (e) {
    console.error('[Storage] Remote GitHub save error:', e);
  }

  // 3. Upsert to Supabase stores table if available
  try {
    await supabaseAdmin.from('stores').upsert({
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
  } catch (err) {
    console.warn('[Storage] Supabase stores upsert note:', err);
  }

  return updatedSite;
}

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
    await saveRemoteSitesToGitHub(filtered);
  } catch (e) {
    console.error('[Storage] Remote GitHub delete error:', e);
  }

  try {
    await supabaseAdmin.from('stores').delete().eq('id', id);
  } catch (e) {}

  return true;
}
