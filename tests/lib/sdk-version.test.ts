/**
 * Tests for SDK version utilities
 *
 * These tests verify that:
 * 1. We can fetch the latest SDK version from GitHub
 * 2. The version URL is correctly constructed
 * 3. The installed SDK in package.json matches the expected format
 *
 * @vitest-environment node
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { readFile } from 'fs/promises';
import path from 'path';
import {
  fetchSdkVersionData,
  fetchPackageJson,
  fetchLatestCommit,
  buildPackageUrl,
  buildVersionWithHash,
  parseInstalledSdkUrl,
  sdkVersionMatches,
  SDK_PACKAGE_BASE_URL,
  SDK_REPOSITORY,
  SDK_BRANCH,
} from '@/lib/sdk-version';

describe('SDK Version Utilities', () => {
  describe('buildVersionWithHash', () => {
    it('should build version string with 7-char hash', () => {
      const version = '0.1.1';
      const fullHash = 'abc1234567890abcdef';
      const result = buildVersionWithHash(version, fullHash);
      expect(result).toBe('0.1.1-abc1234');
    });

    it('should handle short hashes', () => {
      const version = '0.1.1';
      const shortHash = 'abc1234';
      const result = buildVersionWithHash(version, shortHash);
      expect(result).toBe('0.1.1-abc1234');
    });
  });

  describe('buildPackageUrl', () => {
    it('should build correct package URL', () => {
      const versionWithHash = '0.1.1-abc1234';
      const result = buildPackageUrl(versionWithHash);
      expect(result).toBe('https://pkg.alkanes.build/dist/@alkanes/ts-sdk?v=0.1.1-abc1234');
    });

    it('should use the correct base URL', () => {
      expect(SDK_PACKAGE_BASE_URL).toBe('https://pkg.alkanes.build/dist/@alkanes/ts-sdk');
    });
  });

  describe('parseInstalledSdkUrl', () => {
    it('should parse a valid SDK URL', () => {
      const url = 'https://pkg.alkanes.build/dist/@alkanes/ts-sdk?v=0.1.1-bc35a718';
      const result = parseInstalledSdkUrl(url);
      expect(result).toEqual({
        version: '0.1.1',
        shortHash: 'bc35a718',
        versionWithHash: '0.1.1-bc35a718',
      });
    });

    it('should handle pre-release versions', () => {
      const url = 'https://pkg.alkanes.build/dist/@alkanes/ts-sdk?v=0.1.1-beta.1-abc1234';
      const result = parseInstalledSdkUrl(url);
      expect(result).toEqual({
        version: '0.1.1-beta.1',
        shortHash: 'abc1234',
        versionWithHash: '0.1.1-beta.1-abc1234',
      });
    });

    it('should return null for URL without version', () => {
      const url = 'https://pkg.alkanes.build/dist/@alkanes/ts-sdk';
      const result = parseInstalledSdkUrl(url);
      expect(result).toBeNull();
    });

    it('should return null for invalid format', () => {
      const url = 'https://pkg.alkanes.build/dist/@alkanes/ts-sdk?v=invalid';
      const result = parseInstalledSdkUrl(url);
      expect(result).toBeNull();
    });
  });

  describe('sdkVersionMatches', () => {
    it('should return true for matching versions', () => {
      const url = 'https://pkg.alkanes.build/dist/@alkanes/ts-sdk?v=0.1.1-abc1234';
      expect(sdkVersionMatches(url, '0.1.1-abc1234')).toBe(true);
    });

    it('should return false for non-matching versions', () => {
      const url = 'https://pkg.alkanes.build/dist/@alkanes/ts-sdk?v=0.1.1-abc1234';
      expect(sdkVersionMatches(url, '0.1.1-xyz5678')).toBe(false);
    });

    it('should return false for invalid URL', () => {
      const url = 'https://pkg.alkanes.build/dist/@alkanes/ts-sdk';
      expect(sdkVersionMatches(url, '0.1.1-abc1234')).toBe(false);
    });
  });
});

describe('SDK Version Live Fetching', () => {
  // Skip these tests in CI unless RUN_INTEGRATION is set
  const runIntegration = process.env.RUN_INTEGRATION === 'true';

  describe.skipIf(!runIntegration)('fetchPackageJson', () => {
    it('should fetch package.json from GitHub', async () => {
      const packageJson = await fetchPackageJson();

      expect(packageJson.name).toBe('@alkanes/ts-sdk');
      expect(packageJson.version).toMatch(/^\d+\.\d+\.\d+/);

      console.log(`[SDK Version] Package version: ${packageJson.version}`);
    });
  });

  describe.skipIf(!runIntegration)('fetchLatestCommit', () => {
    it('should fetch latest commit from GitHub', async () => {
      const commit = await fetchLatestCommit();

      expect(commit.sha).toHaveLength(40);
      expect(commit.commit.message).toBeDefined();
      expect(commit.commit.author.date).toBeDefined();

      console.log(`[SDK Version] Latest commit: ${commit.sha.substring(0, 7)}`);
      console.log(`[SDK Version] Commit message: ${commit.commit.message.split('\n')[0]}`);
    });
  });

  describe.skipIf(!runIntegration)('fetchSdkVersionData', () => {
    it('should fetch complete SDK version data', async () => {
      const data = await fetchSdkVersionData();

      expect(data.version).toMatch(/^\d+\.\d+\.\d+/);
      expect(data.shortHash).toHaveLength(7);
      expect(data.fullHash).toHaveLength(40);
      expect(data.versionWithHash).toBe(`${data.version}-${data.shortHash}`);
      expect(data.packageUrl).toBe(buildPackageUrl(data.versionWithHash));
      expect(data.branch).toBe(SDK_BRANCH);
      expect(data.repository).toBe(SDK_REPOSITORY);

      console.log('\n=== Latest SDK Version ===');
      console.log(`  Version: ${data.version}`);
      console.log(`  Commit:  ${data.shortHash}`);
      console.log(`  Full:    ${data.versionWithHash}`);
      console.log(`  URL:     ${data.packageUrl}`);
      console.log(`  Message: ${data.commitMessage}`);
      console.log(`  Date:    ${data.commitDate}`);
    });
  });
});

describe('Installed SDK Version Verification', () => {
  let installedSdkUrl: string;
  let packageJsonPath: string;

  beforeAll(async () => {
    // Read the local package.json to get the installed SDK version
    packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJsonContent = await readFile(packageJsonPath, 'utf-8');
    const packageJson = JSON.parse(packageJsonContent);

    installedSdkUrl = packageJson.dependencies?.['@alkanes/ts-sdk'] ||
                      packageJson.devDependencies?.['@alkanes/ts-sdk'] ||
                      '';

    console.log(`[Test] Installed SDK URL: ${installedSdkUrl}`);
  });

  it('should have @alkanes/ts-sdk installed', () => {
    expect(installedSdkUrl).toBeTruthy();
    expect(installedSdkUrl).toContain('pkg.alkanes.build');
  });

  it('should have a valid version format in package.json', () => {
    const parsed = parseInstalledSdkUrl(installedSdkUrl);
    expect(parsed).not.toBeNull();
    expect(parsed?.version).toMatch(/^\d+\.\d+\.\d+/);
    expect(parsed?.shortHash).toMatch(/^[a-f0-9]+$/);

    console.log(`[Test] Parsed installed version: ${parsed?.versionWithHash}`);
  });

  // This test fetches from GitHub to compare - skip unless RUN_INTEGRATION is set
  const runIntegration = process.env.RUN_INTEGRATION === 'true';

  it.skipIf(!runIntegration)('should match or be aware of latest version', async () => {
    const latestData = await fetchSdkVersionData();
    const installedParsed = parseInstalledSdkUrl(installedSdkUrl);

    console.log('\n=== Version Comparison ===');
    console.log(`  Installed: ${installedParsed?.versionWithHash}`);
    console.log(`  Latest:    ${latestData.versionWithHash}`);

    if (installedParsed?.versionWithHash === latestData.versionWithHash) {
      console.log('  Status:    ✓ Up to date');
    } else {
      console.log('  Status:    ⚠ Different version installed');
      console.log(`  To update: pnpm add "${latestData.packageUrl}"`);
    }

    // This test passes regardless - it's informational
    // To enforce latest version, uncomment:
    // expect(installedParsed?.versionWithHash).toBe(latestData.versionWithHash);
  });
});

/**
 * Export a helper function that can be used by other scripts
 * to get the expected SDK URL for installation
 */
export async function getExpectedSdkUrl(): Promise<string> {
  const data = await fetchSdkVersionData();
  return data.packageUrl;
}
