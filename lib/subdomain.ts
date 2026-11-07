export interface ReservedSubdomain {
  note: string;
  reservedFor: 'founder' | 'system' | 'vip';
}

export const RESERVED_SUBDOMAINS: Record<string, ReservedSubdomain> = {
  yahya: { note: 'Founder Yahya', reservedFor: 'founder' },
  amir: { note: 'Partner Amir', reservedFor: 'founder' },
  ai: { note: 'Platform AI Root', reservedFor: 'founder' },
  studio: { note: 'Linkal Studio Builder', reservedFor: 'system' },
  app: { note: 'Admin App Gateway', reservedFor: 'system' },
  linkal: { note: 'Brand Master', reservedFor: 'system' },
  admin: { note: 'Admin Portal', reservedFor: 'system' },
  api: { note: 'Backend API Route', reservedFor: 'system' },
  cdn: { note: 'Image CDN Shield', reservedFor: 'system' },
  www: { note: 'Web Subdomain', reservedFor: 'system' },
  auth: { note: 'Authentication Route', reservedFor: 'system' },
  login: { note: 'Login Gateway', reservedFor: 'system' },
  pay: { note: 'Payment Gateway', reservedFor: 'system' },
  checkout: { note: 'Checkout Gateway', reservedFor: 'system' },
  billing: { note: 'Billing Gateway', reservedFor: 'system' },
  dashboard: { note: 'Dashboard Route', reservedFor: 'system' },
  status: { note: 'Status Page', reservedFor: 'system' },
  mail: { note: 'Mail Gateway', reservedFor: 'system' },
  dev: { note: 'Development Environment', reservedFor: 'system' },
  turkishzaika: { note: 'Turkish Zaika Restaurant Flagship', reservedFor: 'vip' },
  'turkish-zaika': { note: 'Turkish Zaika Restaurant Alt', reservedFor: 'vip' }
};

export function validateSubdomainFormat(slug: string): { valid: boolean; reason?: string } {
  if (!slug || typeof slug !== 'string') {
    return { valid: false, reason: 'Subdomain is required.' };
  }

  const clean = slug.toLowerCase().trim();

  if (clean.includes('_')) {
    return {
      valid: false,
      reason: 'Underscores (_) are strictly prohibited by internet domain standards. Use hyphens (-) instead.'
    };
  }

  if (clean.length < 3) {
    return { valid: false, reason: 'Subdomain must be at least 3 characters long.' };
  }

  if (clean.length > 30) {
    return { valid: false, reason: 'Subdomain must be at most 30 characters long.' };
  }

  const rfc1035Regex = /^[a-z0-9]([a-z0-9-]{1,28}[a-z0-9])?$/;
  if (!rfc1035Regex.test(clean)) {
    return {
      valid: false,
      reason: 'Subdomain can only contain lowercase letters (a-z), numbers (0-9), and hyphens (-), and cannot begin or end with a hyphen.'
    };
  }

  return { valid: true };
}

export function isSubdomainReserved(slug: string): boolean {
  const clean = slug.toLowerCase().trim();
  return clean in RESERVED_SUBDOMAINS;
}

export function generateAvailableAlternatives(slug: string): string[] {
  const clean = slug.toLowerCase().trim();
  return [
    `${clean}-pro`,
    `${clean}-official`,
    `${clean}-in`,
    `${clean}-live`,
    `my-${clean}`
  ];
}

