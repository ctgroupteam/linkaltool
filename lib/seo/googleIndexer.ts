import crypto from 'crypto';

interface GoogleIndexingResult {
  success: boolean;
  message: string;
  statusCode?: number;
}

/**
 * Creates a signed JWT for Google OAuth2 using standard Node crypto.
 * Zero npm dependencies required.
 */
function createGoogleJwt(clientEmail: string, privateKeyPem: string): string {
  const header = {
    alg: 'RS256',
    typ: 'JWT',
  };

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: clientEmail,
    scope: 'https://www.googleapis.com/auth/indexing',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };

  const base64UrlEncode = (obj: object) =>
    Buffer.from(JSON.stringify(obj))
      .toString('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

  const encodedHeader = base64UrlEncode(header);
  const encodedPayload = base64UrlEncode(payload);
  const data = `${encodedHeader}.${encodedPayload}`;

  const signer = crypto.createSign('RSA-SHA256');
  signer.update(data);
  const signature = signer
    .sign(privateKeyPem, 'base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${data}.${signature}`;
}

/**
 * Request OAuth2 Access Token from Google OAuth endpoint
 */
async function getGoogleAccessToken(clientEmail: string, privateKeyPem: string): Promise<string | null> {
  try {
    const jwt = createGoogleJwt(clientEmail, privateKeyPem);
    const body = new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    });

    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.warn('[GoogleIndexer] OAuth token error:', res.status, errText);
      return null;
    }

    const json = await res.json();
    return json.access_token || null;
  } catch (err: any) {
    console.warn('[GoogleIndexer] Access token generation failed:', err.message);
    return null;
  }
}

/**
 * Submit URL to Google Indexing API (URL_UPDATED)
 * Instant crawler trigger directly from Linkal Platform
 */
export async function submitUrlToGoogleIndexing(url: string): Promise<GoogleIndexingResult> {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || process.env.GOOGLE_CLIENT_EMAIL;
  let privateKey = process.env.GOOGLE_PRIVATE_KEY;

  // Support JSON bundle format
  if (!clientEmail && process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    try {
      const parsed = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
      return submitUrlWithCreds(url, parsed.client_email, parsed.private_key);
    } catch {}
  }

  if (!clientEmail || !privateKey) {
    // Fallback: Ping sitemap for instant crawl notification
    try {
      await fetch(`https://www.google.com/ping?sitemap=https://studio.linkal.in/sitemap.xml`);
    } catch {}

    return {
      success: false,
      message: 'Google Service Account credentials not yet configured. Fallback sitemap ping triggered.',
    };
  }

  // Format private key PEM (handling \n escaped strings in env vars)
  if (privateKey.includes('\\n')) {
    privateKey = privateKey.replace(/\\n/g, '\n');
  }

  return submitUrlWithCreds(url, clientEmail, privateKey);
}

async function submitUrlWithCreds(
  url: string,
  clientEmail: string,
  privateKey: string
): Promise<GoogleIndexingResult> {
  try {
    const accessToken = await getGoogleAccessToken(clientEmail, privateKey);
    if (!accessToken) {
      return { success: false, message: 'Failed to acquire Google OAuth2 access token.' };
    }

    const endpoint = 'https://indexing.googleapis.com/v3/urlNotifications:publish';
    const payload = {
      url: url.trim(),
      type: 'URL_UPDATED',
    };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    const resData = await res.json();
    if (res.ok) {
      console.log(`[GoogleIndexer] Successfully submitted ${url} to Google Indexing API`);
      return { success: true, message: 'Indexed', statusCode: res.status };
    } else {
      console.warn(`[GoogleIndexer] Submission returned error:`, resData);
      return { success: false, message: resData.error?.message || 'Error', statusCode: res.status };
    }
  } catch (err: any) {
    console.error('[GoogleIndexer] Error submitting URL:', err.message);
    return { success: false, message: err.message };
  }
}

