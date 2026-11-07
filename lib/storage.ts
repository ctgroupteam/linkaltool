import fs from 'fs';
import path from 'path';
import os from 'os';
import { SiteData } from '@/types/site';

const INITIAL_SITES: SiteData[] = [];

const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

// Helper: Dynamically locate the data file path across environments (root, subfolder, serverless)
function getDataFilePath(): string {
  if (isServerless) {
    const tmpFile = path.join(os.tmpdir(), 'sites.json');
    // If /tmp file doesn't exist yet on cold start, seed from bundled project data
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

  // Local development / server environment: detect active directory
  const localCandidates = [
    path.join(process.cwd(), 'data', 'sites.json'),
    path.join(process.cwd(), 'Linkal Tool', 'data', 'sites.json'),
  ];
  for (const candidate of localCandidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  // Fallback path creation
  if (fs.existsSync(path.join(process.cwd(), 'Linkal Tool'))) {
    return path.join(process.cwd(), 'Linkal Tool', 'data', 'sites.json');
  }
  return path.join(process.cwd(), 'data', 'sites.json');
}

// Seed in-memory store from disk immediately on module load if available
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
          return parsed;
        }
      }
    }
  } catch {}
  return [...INITIAL_SITES];
}

// Memory store initialized with available local disk sites or default demos
let inMemorySites: SiteData[] = loadInitialDiskSites();
let lastSyncedFromRemote = false;

// Helper: Sync sites from GitHub repository if available
async function fetchRemoteSitesFromGitHub(): Promise<SiteData[] | null> {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER || 'ctgroupteam';
  const repo = process.env.GITHUB_REPO || 'linkal-tool';
  if (!token) return null;

  // Search candidate repositories in order:
  // 1. Configured owner/repo
  // 2. Upstream repo where data/sites.json is published
  // 3. Main multi-tenant repo fallback
  const reposToTry = [
    { owner, repo },
    { owner: 'mdyahhya', repo: 'linkal-tool' },
    { owner, repo: 'linkal' },
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
          const sites = JSON.parse(content);
          if (Array.isArray(sites) && sites.length > 0) {
            console.log(`[Storage] Synced ${sites.length} sites from GitHub (${target.owner}/${target.repo})`);
            return sites;
          }
        }
      } else if (res.status !== 404) {
        console.warn(`[Storage] GitHub fetch from ${target.owner}/${target.repo} returned status: ${res.status}`);
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
  const repo = process.env.GITHUB_REPO || 'linkal-tool';
  if (!token) return false;

  const reposToTry = [
    { owner, repo },
    { owner: 'mdyahhya', repo: 'linkal-tool' },
  ].filter((v, idx, arr) => arr.findIndex(x => x.owner === v.owner && x.repo === v.repo) === idx);

  for (const target of reposToTry) {
    try {
      const url = `https://api.github.com/repos/${target.owner}/${target.repo}/contents/data/sites.json`;
      // 1. Get existing file sha
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

      // 2. Put file
      const content = Buffer.from(JSON.stringify(sites, null, 2), 'utf-8').toString('base64');
      const putRes = await fetch(url, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
          'Content-Type': 'application/json',
          'User-Agent': 'Linkal-Website-Builder',
        },
        body: JSON.stringify({
          message: `Sync customer sites database [${sites.length} sites]`,
          content,
          sha: existingSha,
        }),
      });

      if (putRes.ok) {
        console.log(`[Storage] Successfully committed ${sites.length} sites to GitHub database (${target.owner}/${target.repo})`);
        return true;
      } else {
        const errText = await putRes.text();
        console.warn(`[Storage] GitHub commit to ${target.owner}/${target.repo} returned ${putRes.status}:`, errText);
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

  // 1. If not yet synced from GitHub on this instance, fetch remote database
  if (!lastSyncedFromRemote && process.env.GITHUB_TOKEN) {
    const remoteSites = await fetchRemoteSitesFromGitHub();
    if (remoteSites && remoteSites.length > 0) {
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

  // 2. Check local disk
  try {
    ensureDataFile();
    if (fs.existsSync(dataFile)) {
      const content = fs.readFileSync(dataFile, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        inMemorySites = parsed;
        return parsed;
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
  const sites = await getAllSites();
  return sites.find(s => s.slug === slug) || null;
}

export async function saveSite(site: SiteData): Promise<SiteData> {
  const sites = await getAllSites();
  const index = sites.findIndex(s => s.id === site.id);
  
  const updatedSite: SiteData = {
    ...site,
    updatedAt: new Date().toISOString()
  };
  
  if (index >= 0) {
    sites[index] = updatedSite;
  } else {
    sites.unshift(updatedSite);
  }

  inMemorySites = sites;
  
  // Save locally / tmp
  try {
    ensureDataFile();
    const dataFile = getDataFilePath();
    fs.writeFileSync(dataFile, JSON.stringify(sites, null, 2), 'utf-8');
  } catch (error) {
    console.warn('Write storage fallback:', error);
  }

  // Save to GitHub database safely without crashing local operations
  try {
    await saveRemoteSitesToGitHub(sites);
  } catch (e) {
    console.error('[Storage] Remote GitHub save error:', e);
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

  // Sync delete to GitHub database
  try {
    await saveRemoteSitesToGitHub(filtered);
  } catch (e) {
    console.error('[Storage] Remote GitHub delete error:', e);
  }

  return true;
}
