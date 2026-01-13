/**
 * SDK Version utilities
 *
 * Shared functions for fetching and constructing @alkanes/ts-sdk version info.
 * Used by both the API route and tests.
 */

export interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
}

export interface PackageJson {
  version: string;
  name: string;
}

export interface SdkVersionData {
  version: string;
  shortHash: string;
  fullHash: string;
  versionWithHash: string;
  packageUrl: string;
  commitMessage: string;
  commitDate: string;
  branch: string;
  repository: string;
  cachedAt?: string;
}

// Constants
export const SDK_PACKAGE_NAME = '@alkanes/ts-sdk';
export const SDK_REPOSITORY = 'kungfuflex/alkanes-rs';
export const SDK_BRANCH = 'develop';
export const SDK_PACKAGE_BASE_URL = 'https://pkg.alkanes.build/dist/@alkanes/ts-sdk';

/**
 * Build the package URL for a specific version
 */
export function buildPackageUrl(versionWithHash: string): string {
  return `${SDK_PACKAGE_BASE_URL}?v=${versionWithHash}`;
}

/**
 * Build the version string with hash
 */
export function buildVersionWithHash(version: string, commitHash: string): string {
  const shortHash = commitHash.substring(0, 7);
  return `${version}-${shortHash}`;
}

/**
 * Fetch package.json from the ts-sdk directory in alkanes-rs
 */
export async function fetchPackageJson(
  branch: string = SDK_BRANCH,
  githubToken?: string
): Promise<PackageJson> {
  const response = await fetch(
    `https://raw.githubusercontent.com/${SDK_REPOSITORY}/${branch}/ts-sdk/package.json`,
    {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'alkanes.build',
        ...(githubToken && {
          'Authorization': `Bearer ${githubToken}`,
        }),
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch package.json: ${response.status}`);
  }

  return response.json();
}

/**
 * Fetch latest commit from a branch
 */
export async function fetchLatestCommit(
  branch: string = SDK_BRANCH,
  githubToken?: string
): Promise<GitHubCommit> {
  const response = await fetch(
    `https://api.github.com/repos/${SDK_REPOSITORY}/commits/${branch}`,
    {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'alkanes.build',
        ...(githubToken && {
          'Authorization': `Bearer ${githubToken}`,
        }),
      },
    }
  );

  if (!response.ok) {
    throw new Error(`GitHub API returned ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch complete SDK version data
 * This is the main function that combines all the pieces
 */
export async function fetchSdkVersionData(
  branch: string = SDK_BRANCH,
  githubToken?: string
): Promise<SdkVersionData> {
  // Fetch package.json and latest commit in parallel
  const [packageJson, commit] = await Promise.all([
    fetchPackageJson(branch, githubToken),
    fetchLatestCommit(branch, githubToken),
  ]);

  // Get short commit hash (7 characters)
  const shortHash = commit.sha.substring(0, 7);

  // Build version string: {semver}-{shortHash}
  const versionWithHash = buildVersionWithHash(packageJson.version, commit.sha);

  // Build the package URL
  const packageUrl = buildPackageUrl(versionWithHash);

  return {
    version: packageJson.version,
    shortHash,
    fullHash: commit.sha,
    versionWithHash,
    packageUrl,
    commitMessage: commit.commit.message.split('\n')[0], // First line only
    commitDate: commit.commit.author.date,
    branch,
    repository: SDK_REPOSITORY,
  };
}

/**
 * Parse an installed SDK URL to extract version info
 * Example: "https://pkg.alkanes.build/dist/@alkanes/ts-sdk?v=0.1.1-bc35a718"
 * Returns: { version: "0.1.1", shortHash: "bc35a718", versionWithHash: "0.1.1-bc35a718" }
 */
export function parseInstalledSdkUrl(url: string): {
  version: string;
  shortHash: string;
  versionWithHash: string;
} | null {
  const match = url.match(/\?v=([^&]+)/);
  if (!match) return null;

  const versionWithHash = match[1];
  const parts = versionWithHash.split('-');

  if (parts.length < 2) return null;

  // Handle semver like "0.1.1-abc1234" or "0.1.1-beta.1-abc1234"
  const shortHash = parts[parts.length - 1];
  const version = parts.slice(0, -1).join('-');

  return {
    version,
    shortHash,
    versionWithHash,
  };
}

/**
 * Check if the installed SDK matches the expected version
 */
export function sdkVersionMatches(
  installedUrl: string,
  expectedVersionWithHash: string
): boolean {
  const parsed = parseInstalledSdkUrl(installedUrl);
  if (!parsed) return false;
  return parsed.versionWithHash === expectedVersionWithHash;
}
