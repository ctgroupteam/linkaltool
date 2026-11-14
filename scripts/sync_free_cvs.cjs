const fs = require('fs');
const path = require('path');

// Dynamically load .env.local without hardcoding any token
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["']|["']$/g, '');
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  }
}

loadEnv();

const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID;
const PROJECT_ID = 'prj_rh44s0jR9XlPk0Ykq7x4adMMChLS'; // linkaltool

if (!VERCEL_TOKEN) {
  console.log('[Sync CVs] No VERCEL_TOKEN found. Skipping domain auto-registration.');
  process.exit(0);
}

async function syncDomains() {
  const mappingFile = path.join(__dirname, '..', 'free CVs', 'mapping.json');
  if (!fs.existsSync(mappingFile)) {
    console.log('[Sync CVs] No mapping.json found.');
    return;
  }

  const mapping = JSON.parse(fs.readFileSync(mappingFile, 'utf8'));
  const subdomains = Object.keys(mapping);

  console.log(`[Sync CVs] Found ${subdomains.length} student subdomains to verify...`);

  // Fetch existing domains
  const teamParam = VERCEL_TEAM_ID ? `?teamId=${VERCEL_TEAM_ID}` : '';
  const res = await fetch(`https://api.vercel.com/v9/projects/${PROJECT_ID}/domains${teamParam}`, {
    headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
  });
  const data = await res.json();
  const existingDomains = new Set((data.domains || []).map((d) => d.name.toLowerCase()));

  for (const sub of subdomains) {
    const fullDomain = `${sub.toLowerCase().trim()}.linkal.in`;
    if (existingDomains.has(fullDomain)) {
      console.log(`[Sync CVs] ✓ ${fullDomain} already active & SSL provisioned.`);
      continue;
    }

    console.log(`[Sync CVs] + Registering ${fullDomain} for instant SSL...`);
    try {
      const addRes = await fetch(`https://api.vercel.com/v10/projects/${PROJECT_ID}/domains${teamParam}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${VERCEL_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: fullDomain }),
      });
      const addData = await addRes.json();
      if (addData.verified) {
        console.log(`[Sync CVs] ✓ ${fullDomain} registered with instant SSL!`);
      } else {
        console.log(`[Sync CVs] Notice for ${fullDomain}:`, addData.name || addData);
      }
    } catch (e) {
      console.error(`[Sync CVs] Error adding ${fullDomain}:`, e.message);
    }
  }
}

syncDomains().catch(console.error);
