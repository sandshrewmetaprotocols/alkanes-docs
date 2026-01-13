/**
 * Pool Data Service for fetching AMM pool reserves and prices
 *
 * Uses the Subfrost Data API for pool data with Redis caching.
 * For candle/historical data, uses the shared candle-fetcher module.
 * For BTC price data, uses the shared price-fetcher module.
 */
import { cacheGet, cacheSet } from '../redis';
import {
  POOL_CONFIGS,
  fetchPoolDataPoints,
  calculatePrice as calculatePriceFromFetcher,
  buildCandlesFromDataPoints,
  getCurrentHeight,
  estimate24hVolume,
  POOL_FEES,
  DIESEL_TOKEN,
  fetchDieselStats,
  calculatePoolTvl,
  type PoolKey as CandleFetcherPoolKey,
  type CandleFetcherConfig,
  type DieselMarketStats,
  type TvlStats,
} from './candle-fetcher';
import {
  fetchBitcoinPrice as fetchBtcPriceFromApi,
  type PriceFetcherConfig,
} from './price-fetcher';
import { alkanesClient } from '../alkanes-client';

// Network detection
const isRegtest = process.env.NEXT_PUBLIC_NETWORK === 'regtest';

// Re-export pool configs as POOLS - network aware
// Regtest: 2:3 (DIESEL/frBTC only - no bUSD pool on regtest)
// Mainnet: 2:77087 (DIESEL/frBTC), 2:68441 (DIESEL/bUSD)
export const POOLS = isRegtest ? {
  DIESEL_FRBTC: {
    id: '2:3',
    block: 2,
    tx: 3,
    name: 'DIESEL/frBTC',
    token0: { block: 2, tx: 0, symbol: 'DIESEL', decimals: POOL_CONFIGS.DIESEL_FRBTC.token0Decimals },
    token1: { block: 32, tx: 0, symbol: 'frBTC', decimals: POOL_CONFIGS.DIESEL_FRBTC.token1Decimals },
    protobufPayload: POOL_CONFIGS.DIESEL_FRBTC.protobufPayload,
  },
  // Note: DIESEL/bUSD pool does not exist on regtest
  // We include it with null-ish values to maintain type compatibility
  DIESEL_BUSD: {
    id: 'regtest:unavailable',
    block: 0,
    tx: 0,
    name: 'DIESEL/bUSD (N/A on regtest)',
    token0: { block: 2, tx: 0, symbol: 'DIESEL', decimals: POOL_CONFIGS.DIESEL_BUSD.token0Decimals },
    token1: { block: 0, tx: 0, symbol: 'bUSD', decimals: POOL_CONFIGS.DIESEL_BUSD.token1Decimals },
    protobufPayload: '', // Empty - will fail gracefully
  },
} as const : {
  DIESEL_FRBTC: {
    id: POOL_CONFIGS.DIESEL_FRBTC.id,
    block: 2,
    tx: 77087,
    name: POOL_CONFIGS.DIESEL_FRBTC.name,
    token0: { block: 2, tx: 0, symbol: 'DIESEL', decimals: POOL_CONFIGS.DIESEL_FRBTC.token0Decimals },
    token1: { block: 32, tx: 0, symbol: 'frBTC', decimals: POOL_CONFIGS.DIESEL_FRBTC.token1Decimals },
    protobufPayload: POOL_CONFIGS.DIESEL_FRBTC.protobufPayload,
  },
  DIESEL_BUSD: {
    id: POOL_CONFIGS.DIESEL_BUSD.id,
    block: 2,
    tx: 68441,
    name: POOL_CONFIGS.DIESEL_BUSD.name,
    token0: { block: 2, tx: 0, symbol: 'DIESEL', decimals: POOL_CONFIGS.DIESEL_BUSD.token0Decimals },
    token1: { block: 2, tx: 56801, symbol: 'bUSD', decimals: POOL_CONFIGS.DIESEL_BUSD.token1Decimals },
    protobufPayload: POOL_CONFIGS.DIESEL_BUSD.protobufPayload,
  },
} as const;

export type PoolKey = keyof typeof POOLS;

// API endpoints
const DATA_API_URL = process.env.ALKANES_DATA_API_URL || 'https://mainnet.subfrost.io/v4/buildalkanes';
const RPC_URL = process.env.ALKANES_RPC_URL || 'https://mainnet.subfrost.io/v4/buildalkanes';

// Cache TTLs
const CACHE_TTL_PRICES = 30; // 30 seconds for current prices
const CACHE_TTL_CANDLES = 300; // 5 minutes for candles
const CACHE_TTL_BTC_PRICE = 60; // 1 minute for BTC price

export interface PoolReserves {
  poolId: string;
  poolName: string;
  token0Symbol: string;
  token1Symbol: string;
  reserve0: bigint;
  reserve1: bigint;
  totalSupply: bigint;
  blockHeight: number;
  timestamp?: number;
}

export interface PoolPrice {
  poolId: string;
  poolName: string;
  price: number;
  priceInverse: number;
  reserve0: bigint;
  reserve1: bigint;
  blockHeight: number;
  timestamp?: number;
}

export interface SerializedPoolPrice {
  poolId: string;
  poolName: string;
  price: number;
  priceInverse: number;
  reserve0: string;
  reserve1: string;
  blockHeight: number;
  timestamp?: number;
}

export interface Candle {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface BitcoinPrice {
  usd: number;
  timestamp: number;
}

/**
 * Get the current block height (with caching)
 */
export async function getCurrentBlockHeight(): Promise<number> {
  const cacheKey = 'pool:blockHeight';

  // Try cache first (short TTL)
  const cached = await cacheGet<number>(cacheKey);
  if (cached !== null) return cached;

  // Use shared module's getCurrentHeight
  const config: CandleFetcherConfig = { rpcUrl: RPC_URL };
  const height = await getCurrentHeight(config);

  // Cache for 10 seconds
  await cacheSet(cacheKey, height, 10);

  return height;
}

/**
 * Fetch pool data using lua_evalscript with metashrew_view
 * This uses the Lua script approach via the candle-fetcher module
 */
async function fetchPoolViaLuaScript(poolKey: PoolKey): Promise<{
  reserve0: bigint;
  reserve1: bigint;
  totalSupply: bigint;
  timestamp?: number;
} | null> {
  try {
    // Get current height first
    const config: CandleFetcherConfig = { rpcUrl: RPC_URL };
    const currentHeight = await getCurrentHeight(config);

    // Fetch single data point at current height using the Lua script
    // Use interval=1 and same start/end to get just one point
    const dataPoints = await fetchPoolDataPoints(
      poolKey as CandleFetcherPoolKey,
      currentHeight,
      currentHeight,
      1,
      config
    );

    if (dataPoints.length === 0) {
      console.error(`No data returned from Lua script for pool ${poolKey}`);
      return null;
    }

    const dp = dataPoints[0];
    return {
      reserve0: dp.reserve0,
      reserve1: dp.reserve1,
      totalSupply: dp.totalSupply,
      timestamp: dp.timestamp,
    };
  } catch (error) {
    console.error('Failed to fetch pool via Lua script:', error);
    return null;
  }
}

/**
 * Fetch all pools data via Lua scripts
 */
async function fetchAllPoolsViaLuaScript(): Promise<Map<string, {
  reserve0: bigint;
  reserve1: bigint;
  totalSupply: bigint;
  name: string;
  timestamp?: number;
}>> {
  const pools = new Map();

  // Fetch each pool in parallel
  const poolKeys = Object.keys(POOLS) as PoolKey[];
  const results = await Promise.allSettled(
    poolKeys.map(async (key) => {
      const data = await fetchPoolViaLuaScript(key);
      return { key, data };
    })
  );

  for (const result of results) {
    if (result.status === 'fulfilled' && result.value.data) {
      const { key, data } = result.value;
      const pool = POOLS[key];
      pools.set(pool.id, {
        reserve0: data.reserve0,
        reserve1: data.reserve1,
        totalSupply: data.totalSupply,
        name: pool.name,
        timestamp: data.timestamp,
      });
    }
  }

  return pools;
}

/**
 * Fetch pool reserves
 */
export async function getPoolReserves(
  poolKey: PoolKey,
  _blockHeight?: number | 'latest'
): Promise<PoolReserves> {
  const pool = POOLS[poolKey];
  const cacheKey = `pool:reserves:${pool.id}`;

  // Try cache first
  const cached = await cacheGet<{
    reserve0: string;
    reserve1: string;
    totalSupply: string;
    blockHeight: number;
  }>(cacheKey);

  if (cached) {
    return {
      poolId: pool.id,
      poolName: pool.name,
      token0Symbol: pool.token0.symbol,
      token1Symbol: pool.token1.symbol,
      reserve0: BigInt(cached.reserve0),
      reserve1: BigInt(cached.reserve1),
      totalSupply: BigInt(cached.totalSupply),
      blockHeight: cached.blockHeight,
    };
  }

  // Fetch via Lua script (metashrew_view)
  const data = await fetchPoolViaLuaScript(poolKey);

  if (!data) {
    throw new Error(`Failed to fetch pool reserves for ${pool.id}`);
  }

  const height = await getCurrentBlockHeight();

  // Cache the result
  await cacheSet(cacheKey, {
    reserve0: data.reserve0.toString(),
    reserve1: data.reserve1.toString(),
    totalSupply: data.totalSupply.toString(),
    blockHeight: height,
  }, CACHE_TTL_PRICES);

  return {
    poolId: pool.id,
    poolName: pool.name,
    token0Symbol: pool.token0.symbol,
    token1Symbol: pool.token1.symbol,
    reserve0: data.reserve0,
    reserve1: data.reserve1,
    totalSupply: data.totalSupply,
    blockHeight: height,
    timestamp: data.timestamp,
  };
}

/**
 * Calculate price from reserves
 */
export function calculatePrice(
  reserve0: bigint,
  reserve1: bigint,
  decimals0: number,
  decimals1: number
): number {
  if (reserve0 === BigInt(0)) return 0;

  const adjustedReserve0 = Number(reserve0) / Math.pow(10, decimals0);
  const adjustedReserve1 = Number(reserve1) / Math.pow(10, decimals1);

  return adjustedReserve1 / adjustedReserve0;
}

/**
 * Get current pool price with caching
 */
export async function getPoolPrice(poolKey: PoolKey): Promise<PoolPrice> {
  const pool = POOLS[poolKey];
  const cacheKey = `pool:price:${pool.id}`;

  // Try cache first
  const cached = await cacheGet<SerializedPoolPrice>(cacheKey);

  if (cached) {
    return {
      ...cached,
      reserve0: BigInt(cached.reserve0),
      reserve1: BigInt(cached.reserve1),
    };
  }

  // Fetch fresh data
  const reserves = await getPoolReserves(poolKey);

  const price = calculatePrice(
    reserves.reserve0,
    reserves.reserve1,
    pool.token0.decimals,
    pool.token1.decimals
  );

  const result: PoolPrice = {
    poolId: pool.id,
    poolName: pool.name,
    price,
    priceInverse: price > 0 ? 1 / price : 0,
    reserve0: reserves.reserve0,
    reserve1: reserves.reserve1,
    blockHeight: reserves.blockHeight,
    timestamp: Date.now(),
  };

  // Cache the result (serialize bigints)
  await cacheSet<SerializedPoolPrice>(cacheKey, {
    ...result,
    reserve0: result.reserve0.toString(),
    reserve1: result.reserve1.toString(),
  }, CACHE_TTL_PRICES);

  return result;
}

/**
 * Get all pool prices (optimized batch fetch)
 */
export async function getAllPoolPrices(): Promise<Record<PoolKey, PoolPrice>> {
  const cacheKey = 'pool:allPrices';

  // Try cache first
  const cached = await cacheGet<Record<PoolKey, SerializedPoolPrice>>(cacheKey);

  if (cached) {
    return {
      DIESEL_FRBTC: {
        ...cached.DIESEL_FRBTC,
        reserve0: BigInt(cached.DIESEL_FRBTC.reserve0),
        reserve1: BigInt(cached.DIESEL_FRBTC.reserve1),
      },
      DIESEL_BUSD: {
        ...cached.DIESEL_BUSD,
        reserve0: BigInt(cached.DIESEL_BUSD.reserve0),
        reserve1: BigInt(cached.DIESEL_BUSD.reserve1),
      },
    };
  }

  // Fetch both pools in parallel
  const [frbtcPrice, busdPrice] = await Promise.all([
    getPoolPrice('DIESEL_FRBTC'),
    getPoolPrice('DIESEL_BUSD'),
  ]);

  const result = {
    DIESEL_FRBTC: frbtcPrice,
    DIESEL_BUSD: busdPrice,
  };

  // Cache the combined result
  await cacheSet<Record<PoolKey, SerializedPoolPrice>>(cacheKey, {
    DIESEL_FRBTC: {
      ...frbtcPrice,
      reserve0: frbtcPrice.reserve0.toString(),
      reserve1: frbtcPrice.reserve1.toString(),
    },
    DIESEL_BUSD: {
      ...busdPrice,
      reserve0: busdPrice.reserve0.toString(),
      reserve1: busdPrice.reserve1.toString(),
    },
  }, CACHE_TTL_PRICES);

  return result;
}

/**
 * Build LEB128 encoded calldata for pool_details opcode (999)
 */
function buildPoolDetailsCalldata(poolBlock: number, poolTx: number): number[] {
  const calldata: number[] = [];

  // LEB128 encode helper
  const leb128Encode = (value: number): number[] => {
    const result: number[] = [];
    do {
      let byte = value & 0x7f;
      value = Math.floor(value / 128);
      if (value > 0) {
        byte |= 0x80;
      }
      result.push(byte);
    } while (value > 0);
    return result;
  };

  // Target alkane block
  calldata.push(...leb128Encode(poolBlock));
  // Target alkane tx
  calldata.push(...leb128Encode(poolTx));
  // Opcode 999 (POOL_DETAILS)
  calldata.push(...leb128Encode(999));

  return calldata;
}

/**
 * Parse pool details response from hex data
 * Format: token_a(32) + token_b(32) + reserve_a(16) + reserve_b(16) + total_supply(16) + name_len(4) + name
 */
function parsePoolDetailsHex(dataHex: string): { reserve0: bigint; reserve1: bigint; totalSupply: bigint } | null {
  try {
    // Remove 0x prefix if present
    const hex = dataHex.startsWith('0x') ? dataHex.slice(2) : dataHex;

    // Need at least 112 bytes = 224 hex chars (without name)
    if (hex.length < 224) {
      return null;
    }

    // Helper to parse little-endian u128 from hex
    const parseU128LE = (hexStr: string): bigint => {
      // Reverse byte pairs for little-endian
      let reversed = '';
      for (let i = hexStr.length - 2; i >= 0; i -= 2) {
        reversed += hexStr.slice(i, i + 2);
      }
      return BigInt('0x' + reversed);
    };

    // reserve_a is at offset 64 bytes (128 hex chars), 16 bytes (32 hex chars)
    const reserve0Hex = hex.slice(128, 160);
    // reserve_b is at offset 80 bytes (160 hex chars), 16 bytes (32 hex chars)
    const reserve1Hex = hex.slice(160, 192);
    // total_supply is at offset 96 bytes (192 hex chars), 16 bytes (32 hex chars)
    const totalSupplyHex = hex.slice(192, 224);

    return {
      reserve0: parseU128LE(reserve0Hex),
      reserve1: parseU128LE(reserve1Hex),
      totalSupply: parseU128LE(totalSupplyHex),
    };
  } catch {
    return null;
  }
}

/**
 * Fetch pool reserves using metashrew_view with prebuilt protobuf payload
 * This is the recommended approach - uses the same method as alkanes-cli
 * Uses alkanes-client (which uses the SDK) instead of direct fetch
 */
async function fetchPoolReservesViaMetashrewView(
  poolKey: PoolKey,
  blockTag: string = 'latest'
): Promise<{ reserve0: bigint; reserve1: bigint; totalSupply: bigint } | null> {
  const pool = POOLS[poolKey];

  try {
    const result = await alkanesClient.metashrewView('simulate', pool.protobufPayload, blockTag);

    if (result) {
      return parseMetashrewViewResponse(result);
    }

    return null;
  } catch (error) {
    console.error(`Error fetching reserves via metashrew_view:`, error);
    return null;
  }
}

/**
 * Parse metashrew_view response for pool details
 * Response format: protobuf wrapper (0a XX 1a YY) + inner data
 * Inner data: token_a(32) + token_b(32) + reserve_a(16) + reserve_b(16) + total_supply(16) + name
 */
function parseMetashrewViewResponse(resultHex: string): { reserve0: bigint; reserve1: bigint; totalSupply: bigint } | null {
  try {
    let hex = resultHex.startsWith('0x') ? resultHex.slice(2) : resultHex;

    // Find inner data after protobuf wrapper (look for "1a" marker which is field 3)
    const markerPos = hex.indexOf('1a');
    if (markerPos === -1 || hex.length < markerPos + 8) {
      return null;
    }

    // Skip "1a" and length byte(s)
    const lenByte = parseInt(hex.slice(markerPos + 2, markerPos + 4), 16);
    const innerStart = markerPos + (lenByte < 128 ? 4 : 6);

    if (hex.length < innerStart + 224) { // Need at least 112 bytes for reserves
      return null;
    }

    const innerHex = hex.slice(innerStart);

    // Helper to parse little-endian u128 from hex
    const parseU128LE = (hexStr: string, byteOffset: number): bigint => {
      const hexOffset = byteOffset * 2;
      const slice = hexStr.slice(hexOffset, hexOffset + 32);
      // Reverse byte pairs for little-endian
      let reversed = '';
      for (let i = slice.length - 2; i >= 0; i -= 2) {
        reversed += slice.slice(i, i + 2);
      }
      return BigInt('0x' + (reversed || '0'));
    };

    // Parse reserves from inner data
    // token_a: bytes 0-31, token_b: bytes 32-63
    // reserve_a: bytes 64-79 (16 bytes, u128 LE)
    // reserve_b: bytes 80-95 (16 bytes, u128 LE)
    // total_supply: bytes 96-111 (16 bytes, u128 LE)
    return {
      reserve0: parseU128LE(innerHex, 64),
      reserve1: parseU128LE(innerHex, 80),
      totalSupply: parseU128LE(innerHex, 96),
    };
  } catch {
    return null;
  }
}

/**
 * Fetch pool reserves at a specific block height using metashrew_view
 */
async function fetchPoolReservesAtHeight(
  poolKey: PoolKey,
  blockHeight: number
): Promise<{ reserve0: bigint; reserve1: bigint; totalSupply: bigint } | null> {
  return fetchPoolReservesViaMetashrewView(poolKey, blockHeight.toString());
}

/**
 * Fetch historical pool data using the shared candle-fetcher module
 * Uses lua_evalscript with metashrew_view for efficient batch queries
 */
async function fetchHistoricalPoolDataBatched(
  poolKey: PoolKey,
  startHeight: number,
  endHeight: number,
  interval: number
): Promise<Array<{ height: number; timestamp?: number; reserve0: bigint; reserve1: bigint; totalSupply: bigint }>> {
  try {
    // Use shared module's fetchPoolDataPoints
    const config: CandleFetcherConfig = { rpcUrl: RPC_URL };
    const dataPoints = await fetchPoolDataPoints(
      poolKey as CandleFetcherPoolKey,
      startHeight,
      endHeight,
      interval,
      config
    );

    return dataPoints.map(dp => ({
      height: dp.height,
      timestamp: dp.timestamp,  // Actual block timestamp (Unix seconds)
      reserve0: dp.reserve0,
      reserve1: dp.reserve1,
      totalSupply: dp.totalSupply,
    }));
  } catch (error) {
    console.error('Error in batched historical data fetch:', error);
    return [];
  }
}

/**
 * Get historical prices for building candles
 * Uses batched lua_evalscript for efficiency, falls back to individual calls
 */
export async function getHistoricalPrices(
  poolKey: PoolKey,
  startHeight: number,
  endHeight: number,
  interval: number = 144
): Promise<PoolPrice[]> {
  const pool = POOLS[poolKey];
  const cacheKey = `pool:history:${pool.id}:${startHeight}:${endHeight}:${interval}`;

  // Check cache first
  const cached = await cacheGet<SerializedPoolPrice[]>(cacheKey);
  if (cached) {
    return cached.map(p => ({
      ...p,
      reserve0: BigInt(p.reserve0),
      reserve1: BigInt(p.reserve1),
    }));
  }

  const prices: PoolPrice[] = [];

  // Try batched Lua script first for efficiency (uses metashrew_view with prebuilt protobuf)
  const batchedData = await fetchHistoricalPoolDataBatched(poolKey, startHeight, endHeight, interval);

  if (batchedData.length > 0) {
    // Use batched results
    for (const dp of batchedData) {
      if (dp.reserve0 > 0) {
        const price = calculatePrice(
          dp.reserve0,
          dp.reserve1,
          pool.token0.decimals,
          pool.token1.decimals
        );

        prices.push({
          poolId: pool.id,
          poolName: pool.name,
          price,
          priceInverse: price > 0 ? 1 / price : 0,
          reserve0: dp.reserve0,
          reserve1: dp.reserve1,
          blockHeight: dp.height,
          // Use actual block timestamp from Lua (Unix seconds -> milliseconds), fallback to Date.now()
          timestamp: dp.timestamp ? dp.timestamp * 1000 : Date.now(),
        });
      }
    }
  } else {
    // Fallback to individual RPC calls
    for (let height = startHeight; height <= endHeight; height += interval) {
      // Check individual height cache
      const heightCacheKey = `pool:reserves:${pool.id}:${height}`;
      const cachedReserves = await cacheGet<{
        reserve0: string;
        reserve1: string;
        totalSupply: string;
      }>(heightCacheKey);

      let reserves: { reserve0: bigint; reserve1: bigint; totalSupply: bigint } | null = null;

      if (cachedReserves) {
        reserves = {
          reserve0: BigInt(cachedReserves.reserve0),
          reserve1: BigInt(cachedReserves.reserve1),
          totalSupply: BigInt(cachedReserves.totalSupply),
        };
      } else {
        // Fetch from RPC using metashrew_view
        reserves = await fetchPoolReservesAtHeight(poolKey, height);

        // Cache individual height data (long TTL since historical data doesn't change)
        if (reserves) {
          await cacheSet(heightCacheKey, {
            reserve0: reserves.reserve0.toString(),
            reserve1: reserves.reserve1.toString(),
            totalSupply: reserves.totalSupply.toString(),
          }, 86400); // 24 hours
        }
      }

      if (reserves && reserves.reserve0 > 0) {
        const price = calculatePrice(
          reserves.reserve0,
          reserves.reserve1,
          pool.token0.decimals,
          pool.token1.decimals
        );

        prices.push({
          poolId: pool.id,
          poolName: pool.name,
          price,
          priceInverse: price > 0 ? 1 / price : 0,
          reserve0: reserves.reserve0,
          reserve1: reserves.reserve1,
          blockHeight: height,
          timestamp: Date.now(),
        });
      }
    }
  }

  // If we couldn't get any historical data, fall back to current price
  if (prices.length === 0) {
    const currentPrice = await getPoolPrice(poolKey);
    return [currentPrice];
  }

  // Cache the complete result (shorter TTL since it may be extended)
  const serialized: SerializedPoolPrice[] = prices.map(p => ({
    ...p,
    reserve0: p.reserve0.toString(),
    reserve1: p.reserve1.toString(),
  }));
  await cacheSet(cacheKey, serialized, CACHE_TTL_CANDLES);

  return prices;
}

/**
 * Build candles from historical prices
 * Uses actual Unix timestamps from block headers when available
 */
export function buildCandles(
  prices: PoolPrice[],
  candleBlocks: number = 144
): Candle[] {
  if (prices.length === 0) return [];

  const sorted = [...prices].sort((a, b) => a.blockHeight - b.blockHeight);

  const candles: Candle[] = [];
  let candleStartBlock = sorted[0].blockHeight;
  let candleStartTimestamp = sorted[0].timestamp || Date.now();
  let candlePrices: number[] = [];

  for (const price of sorted) {
    if (price.blockHeight >= candleStartBlock + candleBlocks) {
      if (candlePrices.length > 0) {
        candles.push({
          // Use actual Unix timestamp (milliseconds) from first price in candle
          timestamp: candleStartTimestamp,
          open: candlePrices[0],
          high: Math.max(...candlePrices),
          low: Math.min(...candlePrices),
          close: candlePrices[candlePrices.length - 1],
        });
      }

      candleStartBlock = Math.floor(price.blockHeight / candleBlocks) * candleBlocks;
      candleStartTimestamp = price.timestamp || Date.now();
      candlePrices = [price.price];
    } else {
      candlePrices.push(price.price);
    }
  }

  if (candlePrices.length > 0) {
    candles.push({
      timestamp: candleStartTimestamp,
      open: candlePrices[0],
      high: Math.max(...candlePrices),
      low: Math.min(...candlePrices),
      close: candlePrices[candlePrices.length - 1],
    });
  }

  return candles;
}

/**
 * Get current Bitcoin price in USD (with caching)
 * Uses the shared price-fetcher module
 */
export async function getBitcoinPrice(): Promise<BitcoinPrice> {
  const cacheKey = 'btc:price:usd';

  // Try cache first
  const cached = await cacheGet<BitcoinPrice>(cacheKey);
  if (cached) {
    return cached;
  }

  // Use shared price-fetcher module
  const config: PriceFetcherConfig = { dataApiUrl: DATA_API_URL };
  const result = await fetchBtcPriceFromApi(config);

  // Cache the result
  await cacheSet(cacheKey, result, CACHE_TTL_BTC_PRICE);

  return result;
}

// Cache TTL for volume data
const CACHE_TTL_VOLUME = 300; // 5 minutes

export interface PoolVolume {
  poolId: string;
  poolName: string;
  volume24h: number;       // Volume in quote token (frBTC or bUSD)
  volume24hUsd?: number;   // Volume in USD (if BTC price available)
  startHeight: number;
  endHeight: number;
  timestamp: number;
}

/**
 * Get 24h trading volume estimate for a pool
 * Uses the constant product formula: volume ≈ (Δ√k / √k) * TVL / fee_rate
 *
 * This estimates volume by measuring the growth in sqrt(k) which indicates
 * fees collected. In an AMM, k only grows from fees (it stays constant or
 * grows slightly from LP additions).
 */
export async function getPoolVolume(poolKey: PoolKey): Promise<PoolVolume> {
  const pool = POOLS[poolKey];
  const cacheKey = `pool:volume:${pool.id}`;

  // Try cache first
  const cached = await cacheGet<PoolVolume>(cacheKey);
  if (cached) {
    return cached;
  }

  // Fetch volume using the candle-fetcher module
  const config: CandleFetcherConfig = { rpcUrl: RPC_URL };
  const volumeData = await estimate24hVolume(poolKey as CandleFetcherPoolKey, config);

  // Get BTC price for USD conversion if this is frBTC pool
  let volume24hUsd: number | undefined;
  if (poolKey === 'DIESEL_FRBTC' && volumeData.volumeToken1 > 0) {
    try {
      const btcPrice = await getBitcoinPrice();
      volume24hUsd = volumeData.volumeToken1 * btcPrice.usd;
    } catch {
      // BTC price fetch failed, leave USD undefined
    }
  } else if (poolKey === 'DIESEL_BUSD') {
    // bUSD is already in USD terms
    volume24hUsd = volumeData.volumeToken1;
  }

  const result: PoolVolume = {
    poolId: pool.id,
    poolName: pool.name,
    volume24h: volumeData.volumeToken1,
    volume24hUsd,
    startHeight: volumeData.startHeight,
    endHeight: volumeData.endHeight,
    timestamp: Date.now(),
  };

  // Cache the result
  await cacheSet(cacheKey, result, CACHE_TTL_VOLUME);

  return result;
}

/**
 * Get 24h volume for all pools
 */
export async function getAllPoolVolumes(): Promise<Record<PoolKey, PoolVolume>> {
  const cacheKey = 'pool:allVolumes';

  // Try cache first
  const cached = await cacheGet<Record<PoolKey, PoolVolume>>(cacheKey);
  if (cached) {
    return cached;
  }

  // Fetch both pools in parallel
  const [frbtcVolume, busdVolume] = await Promise.all([
    getPoolVolume('DIESEL_FRBTC'),
    getPoolVolume('DIESEL_BUSD'),
  ]);

  const result = {
    DIESEL_FRBTC: frbtcVolume,
    DIESEL_BUSD: busdVolume,
  };

  // Cache the combined result
  await cacheSet(cacheKey, result, CACHE_TTL_VOLUME);

  return result;
}

// Cache TTL for stats
const CACHE_TTL_STATS = 60; // 1 minute

/**
 * Serialized market stats for caching (bigints as strings)
 */
interface SerializedMarketStats {
  totalSupply: string;
  totalSupplyFormatted: number;
  priceUsd: number;
  priceBtc: number;
  marketCapUsd: number;
  timestamp: number;
}

/**
 * Serialized TVL stats for caching
 */
interface SerializedTvlStats {
  pools: {
    [key: string]: {
      poolId: string;
      poolName: string;
      reserve0: string;
      reserve1: string;
      tvlToken0: number;
      tvlToken1: number;
      tvlUsd: number;
      lpTotalSupply: string;
    };
  };
  totalTvlUsd: number;
  timestamp: number;
}

// Re-export types
export type { DieselMarketStats, TvlStats };

/**
 * Get DIESEL market stats including total supply and market cap
 */
export async function getDieselMarketStats(): Promise<DieselMarketStats> {
  const cacheKey = 'diesel:marketStats';

  // Try cache first
  const cached = await cacheGet<SerializedMarketStats>(cacheKey);
  if (cached) {
    return {
      ...cached,
      totalSupply: BigInt(cached.totalSupply),
    };
  }

  // Fetch stats via Lua script
  const config: CandleFetcherConfig = { rpcUrl: RPC_URL };
  const stats = await fetchDieselStats(config);

  // Get BTC price for USD conversion
  const btcPrice = await getBitcoinPrice();

  // Get DIESEL price from frBTC pool (more liquid)
  let dieselPriceBtc = 0;
  if (stats.pools.DIESEL_FRBTC) {
    const pool = POOLS.DIESEL_FRBTC;
    dieselPriceBtc = calculatePrice(
      stats.pools.DIESEL_FRBTC.reserve0,
      stats.pools.DIESEL_FRBTC.reserve1,
      pool.token0.decimals,
      pool.token1.decimals
    );
  }

  const dieselPriceUsd = dieselPriceBtc * btcPrice.usd;
  const totalSupplyFormatted = Number(stats.dieselTotalSupply) / Math.pow(10, DIESEL_TOKEN.decimals);
  const marketCapUsd = totalSupplyFormatted * dieselPriceUsd;

  const result: DieselMarketStats = {
    totalSupply: stats.dieselTotalSupply,
    totalSupplyFormatted,
    priceUsd: dieselPriceUsd,
    priceBtc: dieselPriceBtc,
    marketCapUsd,
    timestamp: Date.now(),
  };

  // Cache the result
  await cacheSet<SerializedMarketStats>(cacheKey, {
    ...result,
    totalSupply: result.totalSupply.toString(),
  }, CACHE_TTL_STATS);

  return result;
}

/**
 * Get TVL stats for all pools
 */
export async function getTvlStats(): Promise<TvlStats> {
  const cacheKey = 'pools:tvlStats';

  // Try cache first
  const cached = await cacheGet<SerializedTvlStats>(cacheKey);
  if (cached) {
    const pools: TvlStats['pools'] = {};
    for (const [key, pool] of Object.entries(cached.pools)) {
      pools[key] = {
        ...pool,
        reserve0: BigInt(pool.reserve0),
        reserve1: BigInt(pool.reserve1),
        lpTotalSupply: BigInt(pool.lpTotalSupply),
      };
    }
    return {
      pools,
      totalTvlUsd: cached.totalTvlUsd,
      timestamp: cached.timestamp,
    };
  }

  // Fetch stats via Lua script
  const config: CandleFetcherConfig = { rpcUrl: RPC_URL };
  const stats = await fetchDieselStats(config);

  // Get BTC price for USD conversion
  const btcPrice = await getBitcoinPrice();

  const pools: TvlStats['pools'] = {};
  let totalTvlUsd = 0;

  // Calculate TVL for DIESEL/frBTC pool
  if (stats.pools.DIESEL_FRBTC) {
    const pool = POOLS.DIESEL_FRBTC;
    const { tvlToken0, tvlToken1, tvlUsd } = calculatePoolTvl(
      stats.pools.DIESEL_FRBTC.reserve0,
      stats.pools.DIESEL_FRBTC.reserve1,
      pool.token0.decimals,
      pool.token1.decimals,
      btcPrice.usd // frBTC price in USD
    );

    pools.DIESEL_FRBTC = {
      poolId: pool.id,
      poolName: pool.name,
      reserve0: stats.pools.DIESEL_FRBTC.reserve0,
      reserve1: stats.pools.DIESEL_FRBTC.reserve1,
      tvlToken0,
      tvlToken1,
      tvlUsd,
      lpTotalSupply: stats.pools.DIESEL_FRBTC.lpSupply,
    };

    totalTvlUsd += tvlUsd;
  }

  // Calculate TVL for DIESEL/bUSD pool
  if (stats.pools.DIESEL_BUSD) {
    const pool = POOLS.DIESEL_BUSD;
    const { tvlToken0, tvlToken1, tvlUsd } = calculatePoolTvl(
      stats.pools.DIESEL_BUSD.reserve0,
      stats.pools.DIESEL_BUSD.reserve1,
      pool.token0.decimals,
      pool.token1.decimals,
      1 // bUSD is 1:1 with USD
    );

    pools.DIESEL_BUSD = {
      poolId: pool.id,
      poolName: pool.name,
      reserve0: stats.pools.DIESEL_BUSD.reserve0,
      reserve1: stats.pools.DIESEL_BUSD.reserve1,
      tvlToken0,
      tvlToken1,
      tvlUsd,
      lpTotalSupply: stats.pools.DIESEL_BUSD.lpSupply,
    };

    totalTvlUsd += tvlUsd;
  }

  const result: TvlStats = {
    pools,
    totalTvlUsd,
    timestamp: Date.now(),
  };

  // Cache the result
  const serialized: SerializedTvlStats = {
    pools: {},
    totalTvlUsd: result.totalTvlUsd,
    timestamp: result.timestamp,
  };
  for (const [key, pool] of Object.entries(result.pools)) {
    serialized.pools[key] = {
      ...pool,
      reserve0: pool.reserve0.toString(),
      reserve1: pool.reserve1.toString(),
      lpTotalSupply: pool.lpTotalSupply.toString(),
    };
  }
  await cacheSet(cacheKey, serialized, CACHE_TTL_STATS);

  return result;
}

/**
 * Combined stats for dashboard display
 * Fetches market stats and TVL in one call
 */
export interface DashboardStats {
  marketStats: DieselMarketStats;
  tvlStats: TvlStats;
  btcPrice: BitcoinPrice;
  timestamp: number;
}

/**
 * Serialized dashboard stats for caching
 */
interface SerializedDashboardStats {
  marketStats: SerializedMarketStats;
  tvlStats: SerializedTvlStats;
  btcPrice: BitcoinPrice;
  timestamp: number;
}

/**
 * Get all dashboard stats in one call (for efficiency)
 * Optimized to fetch data via single Lua script call instead of multiple parallel calls
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const cacheKey = 'dashboard:stats';

  // Try cache first
  const cached = await cacheGet<SerializedDashboardStats>(cacheKey);
  if (cached) {
    const tvlPools: TvlStats['pools'] = {};
    for (const [key, pool] of Object.entries(cached.tvlStats.pools)) {
      tvlPools[key] = {
        ...pool,
        reserve0: BigInt(pool.reserve0),
        reserve1: BigInt(pool.reserve1),
        lpTotalSupply: BigInt(pool.lpTotalSupply),
      };
    }

    return {
      marketStats: {
        ...cached.marketStats,
        totalSupply: BigInt(cached.marketStats.totalSupply),
      },
      tvlStats: {
        pools: tvlPools,
        totalTvlUsd: cached.tvlStats.totalTvlUsd,
        timestamp: cached.tvlStats.timestamp,
      },
      btcPrice: cached.btcPrice,
      timestamp: cached.timestamp,
    };
  }

  // Optimized: Fetch stats and BTC price in parallel (single Lua script call for all alkane data)
  const config: CandleFetcherConfig = { rpcUrl: RPC_URL };
  const [stats, btcPrice] = await Promise.all([
    fetchDieselStats(config),
    getBitcoinPrice(),
  ]);

  // Calculate market stats from shared data
  let dieselPriceBtc = 0;
  if (stats.pools.DIESEL_FRBTC) {
    const pool = POOLS.DIESEL_FRBTC;
    dieselPriceBtc = calculatePrice(
      stats.pools.DIESEL_FRBTC.reserve0,
      stats.pools.DIESEL_FRBTC.reserve1,
      pool.token0.decimals,
      pool.token1.decimals
    );
  }
  const dieselPriceUsd = dieselPriceBtc * btcPrice.usd;
  const totalSupplyFormatted = Number(stats.dieselTotalSupply) / Math.pow(10, DIESEL_TOKEN.decimals);
  const marketCapUsd = totalSupplyFormatted * dieselPriceUsd;

  const marketStats: DieselMarketStats = {
    totalSupply: stats.dieselTotalSupply,
    totalSupplyFormatted,
    priceUsd: dieselPriceUsd,
    priceBtc: dieselPriceBtc,
    marketCapUsd,
    timestamp: Date.now(),
  };

  // Calculate TVL stats from shared data
  const tvlPools: TvlStats['pools'] = {};
  let totalTvlUsd = 0;

  if (stats.pools.DIESEL_FRBTC) {
    const pool = POOLS.DIESEL_FRBTC;
    const { tvlToken0, tvlToken1, tvlUsd } = calculatePoolTvl(
      stats.pools.DIESEL_FRBTC.reserve0,
      stats.pools.DIESEL_FRBTC.reserve1,
      pool.token0.decimals,
      pool.token1.decimals,
      btcPrice.usd
    );

    tvlPools.DIESEL_FRBTC = {
      poolId: pool.id,
      poolName: pool.name,
      reserve0: stats.pools.DIESEL_FRBTC.reserve0,
      reserve1: stats.pools.DIESEL_FRBTC.reserve1,
      tvlToken0,
      tvlToken1,
      tvlUsd,
      lpTotalSupply: stats.pools.DIESEL_FRBTC.lpSupply,
    };
    totalTvlUsd += tvlUsd;
  }

  if (stats.pools.DIESEL_BUSD) {
    const pool = POOLS.DIESEL_BUSD;
    const { tvlToken0, tvlToken1, tvlUsd } = calculatePoolTvl(
      stats.pools.DIESEL_BUSD.reserve0,
      stats.pools.DIESEL_BUSD.reserve1,
      pool.token0.decimals,
      pool.token1.decimals,
      1 // bUSD is 1:1 with USD
    );

    tvlPools.DIESEL_BUSD = {
      poolId: pool.id,
      poolName: pool.name,
      reserve0: stats.pools.DIESEL_BUSD.reserve0,
      reserve1: stats.pools.DIESEL_BUSD.reserve1,
      tvlToken0,
      tvlToken1,
      tvlUsd,
      lpTotalSupply: stats.pools.DIESEL_BUSD.lpSupply,
    };
    totalTvlUsd += tvlUsd;
  }

  const tvlStats: TvlStats = {
    pools: tvlPools,
    totalTvlUsd,
    timestamp: Date.now(),
  };

  const result: DashboardStats = {
    marketStats,
    tvlStats,
    btcPrice,
    timestamp: Date.now(),
  };

  // Cache the combined result
  const serialized: SerializedDashboardStats = {
    marketStats: {
      ...marketStats,
      totalSupply: marketStats.totalSupply.toString(),
    },
    tvlStats: {
      pools: {},
      totalTvlUsd: tvlStats.totalTvlUsd,
      timestamp: tvlStats.timestamp,
    },
    btcPrice,
    timestamp: result.timestamp,
  };
  for (const [key, pool] of Object.entries(tvlStats.pools)) {
    serialized.tvlStats.pools[key] = {
      ...pool,
      reserve0: pool.reserve0.toString(),
      reserve1: pool.reserve1.toString(),
      lpTotalSupply: pool.lpTotalSupply.toString(),
    };
  }
  await cacheSet(cacheKey, serialized, CACHE_TTL_STATS);

  return result;
}
