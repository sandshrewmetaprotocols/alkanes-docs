import { NextRequest, NextResponse } from 'next/server';
import {
  POOLS,
  getHistoricalPrices,
  buildCandles,
  getCurrentBlockHeight,
  type PoolKey,
} from '@/lib/pools/pool-service';

export const dynamic = 'force-dynamic';

// Cache for candle data (server-side memory cache)
const candleCache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 60 * 1000; // 1 minute

// Mock candle data generator for when RPC is unavailable
function generateMockCandles(poolKey: PoolKey, limit: number) {
  const pool = POOLS[poolKey];
  const basePrice = poolKey === 'DIESEL_FRBTC' ? 0.00005234 : 4.85;
  const candles = [];
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  for (let i = limit - 1; i >= 0; i--) {
    const volatility = 0.05; // 5% daily volatility
    const randomChange = (Math.random() - 0.5) * volatility;
    const open = basePrice * (1 + randomChange);
    const close = basePrice * (1 + (Math.random() - 0.5) * volatility);
    const high = Math.max(open, close) * (1 + Math.random() * 0.02);
    const low = Math.min(open, close) * (1 - Math.random() * 0.02);

    candles.push({
      timestamp: now - i * dayMs,
      open,
      high,
      low,
      close,
    });
  }

  return {
    pool: pool.name,
    poolId: pool.id,
    interval: 'daily',
    currentHeight: 878000,
    candles,
  };
}

/**
 * GET /api/pools/candles
 * Query params:
 *   - pool: 'DIESEL_FRBTC' | 'DIESEL_BUSD'
 *   - interval: 'hourly' | 'daily' | 'weekly' (default: daily)
 *   - limit: number of candles (default: 30)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const poolParam = searchParams.get('pool');
    const intervalParam = searchParams.get('interval') || 'daily';
    const limitParam = searchParams.get('limit') || '30';

    if (!poolParam) {
      return NextResponse.json(
        { success: false, error: 'Pool parameter is required' },
        { status: 400 }
      );
    }

    // Validate pool key
    if (!Object.keys(POOLS).includes(poolParam)) {
      return NextResponse.json(
        { success: false, error: `Invalid pool: ${poolParam}` },
        { status: 400 }
      );
    }

    const poolKey = poolParam as PoolKey;
    const limit = Math.min(parseInt(limitParam, 10), 100);

    // Calculate block interval based on candle interval
    // ~10 minute block time on Bitcoin
    let blockInterval: number;
    let candleBlocks: number;

    switch (intervalParam) {
      case 'hourly':
        blockInterval = 6; // Sample every ~1 hour
        candleBlocks = 6; // 1 hour candles
        break;
      case 'weekly':
        blockInterval = 144; // Sample daily
        candleBlocks = 1008; // 7 days
        break;
      case 'daily':
      default:
        blockInterval = 24; // Sample every ~4 hours
        candleBlocks = 144; // 1 day candles
        break;
    }

    // Check cache
    const cacheKey = `${poolKey}-${intervalParam}-${limit}`;
    const cached = candleCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json({
        success: true,
        cached: true,
        data: cached.data,
      });
    }

    // Get current block height
    const currentHeight = await getCurrentBlockHeight();

    // Calculate start height (go back enough blocks for the requested candles)
    const blocksNeeded = limit * candleBlocks;
    const startHeight = Math.max(0, currentHeight - blocksNeeded);

    // Fetch historical prices
    const prices = await getHistoricalPrices(
      poolKey,
      startHeight,
      currentHeight,
      blockInterval
    );

    // Build candles
    const candles = buildCandles(prices, candleBlocks);

    // Limit to requested number
    const limitedCandles = candles.slice(-limit);

    const responseData = {
      pool: POOLS[poolKey].name,
      poolId: POOLS[poolKey].id,
      interval: intervalParam,
      currentHeight,
      candles: limitedCandles,
    };

    // Update cache
    candleCache.set(cacheKey, {
      data: responseData,
      timestamp: Date.now(),
    });

    return NextResponse.json({
      success: true,
      cached: false,
      data: responseData,
    });
  } catch (error) {
    console.error('Candles API error:', error);

    // Return mock candles when RPC is unavailable
    const poolParam = request.nextUrl.searchParams.get('pool');
    const limitParam = request.nextUrl.searchParams.get('limit') || '30';
    if (poolParam && Object.keys(POOLS).includes(poolParam)) {
      console.log('Returning mock candle data due to RPC error');
      const mockData = generateMockCandles(poolParam as PoolKey, parseInt(limitParam, 10));
      return NextResponse.json({
        success: true,
        cached: false,
        mock: true,
        data: mockData,
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
