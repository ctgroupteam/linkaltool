/**
 * Legacy GitHub deployment adapter - PERMANENTLY DISABLED
 * All deployments and live website storage are handled directly by Linkal Edge + Supabase.
 * Zero GitHub API calls to prevent any account suspension risk.
 */

export interface GitHubRepoResult {
  repoId?: number;
  repoName: string;
  repoUrl: string;
  isNew: boolean;
}

export async function createOrGetGitHubRepo(
  owner: string,
  repoName: string,
  token: string
): Promise<GitHubRepoResult> {
  console.log('[Deployment] GitHub repo creation bypassed (Zero-GitHub architecture active)');
  return {
    repoId: 0,
    repoName,
    repoUrl: `https://github.com/${owner}/${repoName}`,
    isNew: false,
  };
}

export async function commitFilesToGitHub(
  owner: string,
  repoName: string,
  token: string,
  files: Array<{ path: string; content: string }>,
  commitMessage: string
): Promise<void> {
  console.log('[Deployment] GitHub commitFiles bypassed (Zero-GitHub architecture active)');
}
