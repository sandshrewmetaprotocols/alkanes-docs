import { NextRequest, NextResponse } from 'next/server';
import {
  POOLS,
  getPoolVolume,
  getAllPoolVolumes,
  type PoolKey,
} from '@/lib/pools/pool-service';

export const dynamic = 'force-dynamic';

/**
 * GET /api/pools/volume
 * Returns 24h trading volume estimates for AMM pools
 *
 * Query params:
 *   - pool: 'DIESEL_FRBTC' | 'DIESEL_BUSD' | 'all' (default: 'all')
 *
 * Volume is estimated using the constant product AMM formula:
 * - In x*y=k, the value of k only grows from trading fees
 * - Volume ≈ (Δ√k / √k) * TVL / fee_rate
 * - Fee rate is 1% (10/1000) total
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const poolParam = searchParams.get('pool') || 'all';

    if (poolParam === 'all') {
      // Get volume for all pools
      const volumes = await getAllPoolVolumes();

      return NextResponse.json({
        success: true,
        data: {
          pools: volumes,
          timestamp: Date.now(),
        },
      });
    }

    // Validate pool key
    if (!Object.keys(POOLS).includes(poolParam)) {
      return NextResponse.json(
        { success: false, error: `Invalid pool: ${poolParam}` },
        { status: 400 }
      );
    }

    const poolKey = poolParam as PoolKey;
    const volume = await getPoolVolume(poolKey);

    return NextResponse.json({
      success: true,
      data: volume,
    });
  } catch (error) {
    console.error('Volume API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
