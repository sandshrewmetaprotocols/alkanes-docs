import { NextResponse } from 'next/server';
import { cacheGet, cacheSet } from '@/lib/redis';
import {
  fetchSdkVersionData,
  SDK_PACKAGE_BASE_URL,
  type SdkVersionData,
} from '@/lib/sdk-version';

// Cache key for SDK version
const CACHE_KEY = 'sdk:version:latest';
// Cache for 10 minutes
const CACHE_TTL_SECONDS = 600;

/**
 * GET /api/sdk-version
 * Returns the latest @alkanes/ts-sdk version info from the develop branch
 * Version format: {semver}-{shortHash} (e.g., 0.1.1-0bcdeabc)
 *
 * Caches result in Redis for 10 minutes
 */
export async function GET() {
  try {
    // Check Redis cache first
    const cached = await cacheGet<SdkVersionData & { cachedAt: string }>(CACHE_KEY);
    if (cached) {
      return NextResponse.json({
        success: true,
        data: cached,
        cached: true,
      });
    }

    // Fetch SDK version data using the shared library
    const versionData = await fetchSdkVersionData(
      'develop',
      process.env.GITHUB_TOKEN
    );

    // Add cache timestamp
    const versionDataWithCache = {
      ...versionData,
      cachedAt: new Date().toISOString(),
    };

    // Cache in Redis
    await cacheSet(CACHE_KEY, versionDataWithCache, CACHE_TTL_SECONDS);

    return NextResponse.json({
      success: true,
      data: versionDataWithCache,
      cached: false,
    });
  } catch (error) {
    console.error('SDK version API error:', error);

    // Return a fallback response with a static version
    // This ensures docs still render even if GitHub API is unavailable
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch SDK version',
        // Provide fallback data so the UI can still function
        fallback: {
          packageUrl: SDK_PACKAGE_BASE_URL,
          note: 'Using base URL without version pin. Check GitHub for latest version.',
        },
      },
      { status: 500 }
    );
  }
}
