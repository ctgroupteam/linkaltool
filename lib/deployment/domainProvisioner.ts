export async function provisionSubdomainSSL(slug: string): Promise<boolean> {
  const token = process.env.VERCEL_TOKEN;
  const teamId = process.env.VERCEL_TEAM_ID;
  const projectId = process.env.VERCEL_PROJECT_ID || 'linkaltool';

  if (!token || !slug) {
    return false;
  }

  const cleanSlug = slug.toLowerCase().trim();
  const domain = `${cleanSlug}.linkal.in`;
  const teamParam = teamId ? `?teamId=${encodeURIComponent(teamId)}` : '';

  try {
    const res = await fetch(`https://api.vercel.com/v10/projects/${projectId}/domains${teamParam}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: domain }),
    });

    if (res.ok) {
      console.log(`[DomainProvisioner] Successfully provisioned Vercel SSL for ${domain}`);
      return true;
    }

    if (res.status === 409) {
      // Already registered and active
      return true;
    }

    const err = await res.json().catch(() => ({}));
    console.warn(`[DomainProvisioner] Notice provisioning ${domain}:`, err);
    return false;
  } catch (error) {
    console.warn(`[DomainProvisioner] Error provisioning domain ${domain}:`, error);
    return false;
  }
}
