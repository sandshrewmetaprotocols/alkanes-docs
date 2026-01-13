/**
 * Candle Data Fetcher using alkanes-web-sys
 *
 * This module provides the core logic for fetching pool candle data using
 * lua_evalscript with metashrew_view. It uses alkanes-web-sys WebProvider
 * for the RPC calls, making it compatible with both Node.js and browser.
 *
 * Used by:
 * - Server-side API routes (app/api/pools/candles)
 * - Live integration tests
 */

import { alkanesClient } from '@/lib/alkanes-client';

// Network detection
const isRegtest = process.env.NEXT_PUBLIC_NETWORK === 'regtest';

// Pool configuration - network-aware
// Mainnet pool IDs from alkanes-cli get-all-pools
// Regtest pool ID: 2:3 (DIESEL/frBTC LP)
export const POOL_CONFIGS = isRegtest ? {
  // Regtest pools (from alkanes-cli -p regtest alkanes get-all-pools)
  DIESEL_FRBTC: {
    id: '2:3',
    name: 'DIESEL/frBTC',
    protobufPayload: '0x20c1162a040203e7073001', // Regtest payload
    token0Decimals: 8,
    token1Decimals: 8,
  },
  // No BUSD pool on regtest, use same as frBTC for now
  DIESEL_BUSD: {
    id: '2:3',
    name: 'DIESEL/frBTC',
    protobufPayload: '0x20c1162a040203e7073001',
    token0Decimals: 8,
    token1Decimals: 8,
  },
} as const : {
  // Mainnet pools
  DIESEL_FRBTC: {
    id: '2:77087',
    name: 'DIESEL/frBTC',
    protobufPayload: '0x2096ce382a06029fda04e7073001',
    token0Decimals: 8,
    token1Decimals: 8,
  },
  DIESEL_BUSD: {
    id: '2:68441',
    name: 'DIESEL/bUSD',
    protobufPayload: '0x2096ce382a0602d99604e7073001',
    token0Decimals: 8,
    token1Decimals: 8,
  },
} as const;

export type PoolKey = keyof typeof POOL_CONFIGS;

export interface PoolDataPoint {
  height: number;
  timestamp?: number;  // Unix timestamp from block header
  reserve0: bigint;
  reserve1: bigint;
  totalSupply: bigint;
}

export interface CandleData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

/**
 * Inline Lua script for fetching pool candles using metashrew_view
 * Uses _RPC.metashrew_view for pool reserves and _RPC.btc_getblockhash + _RPC.btc_getblock
 * for actual block timestamps from the Bitcoin block headers.
 */
export const POOL_CANDLES_LUA_SCRIPT = `
-- Pool candles: Fetch pool reserves at multiple block heights for OHLC data
-- args is passed as a table where args[1] is the array of parameters
local params = args[1] or {}
local pool_payload = params[1]
local start_height = tonumber(params[2])
local end_height = tonumber(params[3])
local interval = tonumber(params[4]) or 144

if not pool_payload or not start_height or not end_height then
    return { error = "Missing required arguments" }
end

-- Helper to parse little-endian u128 from hex string at given byte offset
local function parse_u128_le(hex_str, byte_offset)
    local hex_offset = byte_offset * 2
    local hex_len = 32
    if #hex_str < hex_offset + hex_len then return nil end
    local hex_slice = hex_str:sub(hex_offset + 1, hex_offset + hex_len)
    local reversed = ""
    for i = #hex_slice - 1, 1, -2 do
        reversed = reversed .. hex_slice:sub(i, i + 1)
    end
    return tonumber(reversed, 16) or 0
end

-- Get block timestamp from Bitcoin block header
local function get_block_timestamp(height)
    local success, block_hash = pcall(function()
        return _RPC.btc_getblockhash(height)
    end)
    if not success or not block_hash then return nil end

    local success2, block = pcall(function()
        return _RPC.btc_getblock(block_hash, 1)
    end)
    if not success2 or not block then return nil end

    return block.time or block.mediantime
end

local results = { data_points = {} }

for height = start_height, end_height, interval do
    local block_tag = tostring(height)
    local success, response = pcall(function()
        return _RPC.metashrew_view("simulate", pool_payload, block_tag)
    end)

    if success and response and type(response) == "string" then
        local data_hex = response
        if data_hex:sub(1, 2) == "0x" then
            data_hex = data_hex:sub(3)
        end

        -- Find inner data after protobuf wrapper (look for "1a" marker)
        local inner_start = nil
        if #data_hex >= 8 then
            local marker_pos = data_hex:find("1a")
            if marker_pos then
                local len_byte = tonumber(data_hex:sub(marker_pos + 2, marker_pos + 3), 16) or 0
                inner_start = marker_pos + (len_byte < 128 and 4 or 6)
            end
        end

        if inner_start and #data_hex >= inner_start + 223 then
            local inner_hex = data_hex:sub(inner_start)
            local reserve_a = parse_u128_le(inner_hex, 64)
            local reserve_b = parse_u128_le(inner_hex, 80)
            local total_supply = parse_u128_le(inner_hex, 96)

            if reserve_a and reserve_b and total_supply then
                local timestamp = get_block_timestamp(height)

                table.insert(results.data_points, {
                    height = height,
                    timestamp = timestamp,
                    reserve_a = reserve_a,
                    reserve_b = reserve_b,
                    total_supply = total_supply
                })
            end
        end
    end
end

results.count = #results.data_points
return results
`;

/**
 * Configuration for the candle fetcher
 */
export interface CandleFetcherConfig {
  rpcUrl?: string;
}

/**
 * Result from Lua script execution
 */
interface LuaScriptResult {
  data_points?: Array<{
    height: number;
    timestamp?: number;
    reserve_a: number;
    reserve_b: number;
    total_supply: number;
  }>;
  error?: string;
  count?: number;
}

/**
 * Fetch pool data points using lua_evalscript RPC
 * This is the core function that calls the Lua script with metashrew_view
 *
 * Uses alkanes-client which provides automatic scripthash caching for better performance
 */
export async function fetchPoolDataPoints(
  poolKey: PoolKey,
  startHeight: number,
  endHeight: number,
  interval: number,
  _config?: CandleFetcherConfig
): Promise<PoolDataPoint[]> {
  const pool = POOL_CONFIGS[poolKey];

  // Use alkanes-client with scripthash caching
  // Pass args as flat array - the RPC will wrap it correctly for Lua to access as args[1]
  const luaResult = await alkanesClient.executeLuaScript<LuaScriptResult>(
    POOL_CANDLES_LUA_SCRIPT,
    [pool.protobufPayload, startHeight.toString(), endHeight.toString(), interval.toString()]
  );

  if (luaResult?.error) {
    throw new Error(`Lua script error: ${luaResult.error}`);
  }

  const dataPoints = luaResult?.data_points || [];
  return dataPoints.map(dp => ({
    height: dp.height,
    timestamp: dp.timestamp,
    reserve0: BigInt(Math.floor(dp.reserve_a)),
    reserve1: BigInt(Math.floor(dp.reserve_b)),
    totalSupply: BigInt(Math.floor(dp.total_supply)),
  }));
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
  const adjusted0 = Number(reserve0) / Math.pow(10, decimals0);
  const adjusted1 = Number(reserve1) / Math.pow(10, decimals1);
  return adjusted1 / adjusted0;
}

/**
 * Build candles from pool data points
 */
export function buildCandlesFromDataPoints(
  dataPoints: PoolDataPoint[],
  poolKey: PoolKey,
  candleBlocks: number = 144
): CandleData[] {
  if (dataPoints.length === 0) return [];

  const pool = POOL_CONFIGS[poolKey];
  const sorted = [...dataPoints].sort((a, b) => a.height - b.height);

  const candles: CandleData[] = [];
  let candleStartBlock = sorted[0].height;
  let candleStartTimestamp = sorted[0].timestamp ? sorted[0].timestamp * 1000 : Date.now();
  let candlePrices: number[] = [];

  for (const dp of sorted) {
    const price = calculatePrice(dp.reserve0, dp.reserve1, pool.token0Decimals, pool.token1Decimals);

    if (dp.height >= candleStartBlock + candleBlocks) {
      if (candlePrices.length > 0) {
        candles.push({
          timestamp: candleStartTimestamp,
          open: candlePrices[0],
          high: Math.max(...candlePrices),
          low: Math.min(...candlePrices),
          close: candlePrices[candlePrices.length - 1],
        });
      }

      candleStartBlock = Math.floor(dp.height / candleBlocks) * candleBlocks;
      candleStartTimestamp = dp.timestamp ? dp.timestamp * 1000 : Date.now();
      candlePrices = [price];
    } else {
      candlePrices.push(price);
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
 * High-level function to fetch candles for a pool
 * This is the main entry point for both server routes and tests
 */
export async function fetchPoolCandles(
  poolKey: PoolKey,
  startHeight: number,
  endHeight: number,
  interval: number = 144,
  config?: CandleFetcherConfig
): Promise<{
  poolKey: PoolKey;
  poolName: string;
  dataPoints: PoolDataPoint[];
  candles: CandleData[];
}> {
  const pool = POOL_CONFIGS[poolKey];
  const dataPoints = await fetchPoolDataPoints(poolKey, startHeight, endHeight, interval, config);
  const candles = buildCandlesFromDataPoints(dataPoints, poolKey, interval);

  return {
    poolKey,
    poolName: pool.name,
    dataPoints,
    candles,
  };
}

/**
 * Get current block height from RPC
 */
export async function getCurrentHeight(_config?: CandleFetcherConfig): Promise<number> {
  return alkanesClient.getCurrentHeight();
}

/**
 * Fee constants from oyl-amm contracts
 */
export const POOL_FEES = {
  TOTAL_FEE_PER_1000: 10,    // 1% total fee
  PROTOCOL_FEE_PER_1000: 2,  // 0.2% protocol fee
  LP_FEE_PER_1000: 8,        // 0.8% LP fee
};

/**
 * Estimate trading volume between two data points using constant product formula
 *
 * Volume estimation approach:
 * - In a constant product AMM (x * y = k), swaps cause k to grow due to fees
 * - The growth in sqrt(k) is proportional to the fee collected
 * - Volume = fee_collected / fee_rate
 * - fee_collected ≈ TVL * (sqrt(k_new) - sqrt(k_old)) / sqrt(k_old)
 *
 * @param startPoint - Pool state at start of period
 * @param endPoint - Pool state at end of period
 * @param decimals0 - Decimals for token0
 * @param decimals1 - Decimals for token1
 * @returns Estimated volume in token1 terms (e.g., frBTC or bUSD)
 */
export function estimateVolumeBetweenPoints(
  startPoint: PoolDataPoint,
  endPoint: PoolDataPoint,
  decimals0: number,
  decimals1: number
): number {
  // Calculate k values
  const k0 = Number(startPoint.reserve0) * Number(startPoint.reserve1);
  const k1 = Number(endPoint.reserve0) * Number(endPoint.reserve1);

  if (k0 <= 0 || k1 <= 0) return 0;

  const sqrtK0 = Math.sqrt(k0);
  const sqrtK1 = Math.sqrt(k1);

  // If k decreased (shouldn't happen in normal operation), return 0
  if (sqrtK1 <= sqrtK0) return 0;

  // Growth in sqrt(k) indicates fees collected
  const sqrtKGrowth = (sqrtK1 - sqrtK0) / sqrtK0;

  // TVL in terms of token1 (convert reserve0 to token1 equivalent)
  const reserve0Adjusted = Number(startPoint.reserve0) / Math.pow(10, decimals0);
  const reserve1Adjusted = Number(startPoint.reserve1) / Math.pow(10, decimals1);
  const tvl = reserve1Adjusted * 2; // Both sides contribute equally

  // Fee earned ≈ tvl * sqrtKGrowth (simplified)
  const feeEarned = tvl * sqrtKGrowth;

  // Volume = fee / fee_rate
  // Only LP fees (0.8%) grow k - protocol fees (0.2%) are extracted
  const lpFeeRate = POOL_FEES.LP_FEE_PER_1000 / 1000;
  const estimatedVolume = feeEarned / lpFeeRate;

  return estimatedVolume;
}

/**
 * Calculate 24h volume estimate for a pool
 *
 * Samples pool state at regular intervals in the 24h period (~144 blocks) to
 * capture fee accumulation from trades. Default interval of 6 blocks gives
 * ~24 samples which balances precision with RPC performance.
 *
 * @param poolKey - The pool to estimate volume for
 * @param config - RPC configuration
 * @param sampleInterval - Block interval between samples (default: 6 blocks for ~24 samples)
 */
export async function estimate24hVolume(
  poolKey: PoolKey,
  config?: CandleFetcherConfig,
  sampleInterval: number = 6
): Promise<{
  volume: number;
  volumeToken1: number;
  volumeUsd?: number;
  startHeight: number;
  endHeight: number;
  samples: number;
}> {
  const pool = POOL_CONFIGS[poolKey];
  const rpcUrl = config?.rpcUrl || process.env.ALKANES_RPC_URL || 'https://mainnet.subfrost.io/v4/buildalkanes';

  // Get current height
  const currentHeight = await getCurrentHeight({ rpcUrl });

  // 24 hours ≈ 144 blocks
  const blocksIn24h = 144;
  const startHeight = currentHeight - blocksIn24h;

  // Fetch data points at regular intervals for better precision
  const dataPoints = await fetchPoolDataPoints(
    poolKey,
    startHeight,
    currentHeight,
    sampleInterval,
    { rpcUrl }
  );

  if (dataPoints.length < 2) {
    return {
      volume: 0,
      volumeToken1: 0,
      startHeight,
      endHeight: currentHeight,
      samples: dataPoints.length,
    };
  }

  // Sum volume estimates between consecutive samples
  let totalVolume = 0;
  for (let i = 1; i < dataPoints.length; i++) {
    const segmentVolume = estimateVolumeBetweenPoints(
      dataPoints[i - 1],
      dataPoints[i],
      pool.token0Decimals,
      pool.token1Decimals
    );
    totalVolume += segmentVolume;
  }

  return {
    volume: totalVolume,
    volumeToken1: totalVolume,
    startHeight,
    endHeight: currentHeight,
    samples: dataPoints.length,
  };
}

/**
 * DIESEL Token Configuration
 * The DIESEL token is at alkane [2, 0]
 */
export const DIESEL_TOKEN = {
  block: 2,
  tx: 0,
  id: '2:0',
  symbol: 'DIESEL',
  decimals: 8,
  // Protobuf payload for GetTotalSupply opcode (101)
  // Format: 0x20 <version> 2a <len> 02 <block> 00 <tx> 65 <opcode 101> 30 01
  // Obtained via: mainnet-cli.sh alkanes simulate 2:0:101
  totalSupplyPayload: '0x20e3ce382a030200653001',
} as const;

/**
 * Parse total supply from metashrew_view response
 * Response format: protobuf wrapper with u128 total supply value
 */
function parseTotalSupplyResponse(resultHex: string): bigint | null {
  try {
    let hex = resultHex.startsWith('0x') ? resultHex.slice(2) : resultHex;

    // Find the inner data (after 0a XX 1a YY prefix)
    // The response contains: 0a <outer_len> 1a <inner_len> <u128 LE value> 10 <varint>
    const marker1a = hex.indexOf('1a');
    if (marker1a === -1) return null;

    // Skip marker and length byte to get to the value
    const lenByte = parseInt(hex.slice(marker1a + 2, marker1a + 4), 16);
    const valueStart = marker1a + 4; // Skip "1a" and length byte

    // Extract the u128 little-endian value (16 bytes = 32 hex chars)
    // But the actual length varies - let's find where "10" marker is (field separator)
    const valueEnd = hex.indexOf('10', valueStart);
    if (valueEnd === -1 || valueEnd <= valueStart) return null;

    const valueHex = hex.slice(valueStart, valueEnd);

    // Pad to 32 chars if shorter
    const paddedHex = valueHex.padEnd(32, '0');

    // Reverse byte pairs for little-endian
    let reversed = '';
    for (let i = paddedHex.length - 2; i >= 0; i -= 2) {
      reversed += paddedHex.slice(i, i + 2);
    }

    return BigInt('0x' + (reversed || '0'));
  } catch {
    return null;
  }
}

/**
 * Fetch DIESEL token total supply via metashrew_view
 */
export async function getDieselTotalSupply(
  _config?: CandleFetcherConfig
): Promise<bigint> {
  const totalSupply = await alkanesClient.getDieselTotalSupply();
  if (totalSupply === null) {
    throw new Error('Failed to fetch DIESEL total supply');
  }
  return totalSupply;
}

/**
 * Market stats for DIESEL token
 */
export interface DieselMarketStats {
  totalSupply: bigint;         // Raw total supply (8 decimals)
  totalSupplyFormatted: number; // Total supply as number (divided by 10^8)
  priceUsd: number;            // DIESEL price in USD
  priceBtc: number;            // DIESEL price in BTC (frBTC)
  marketCapUsd: number;        // totalSupply * priceUsd
  timestamp: number;
}

/**
 * TVL (Total Value Locked) stats for all vaults
 */
export interface TvlStats {
  pools: {
    [key: string]: {
      poolId: string;
      poolName: string;
      reserve0: bigint;      // DIESEL reserves
      reserve1: bigint;      // Counterparty reserves
      tvlToken0: number;     // TVL in DIESEL terms
      tvlToken1: number;     // TVL in counterparty token terms
      tvlUsd: number;        // TVL in USD
      lpTotalSupply: bigint; // LP token total supply
    };
  };
  totalTvlUsd: number;        // Sum of all pool TVLs in USD
  timestamp: number;
}

/**
 * Calculate TVL for a pool
 * TVL = (reserve0 value in USD) + (reserve1 value in USD)
 * For AMM pools, both sides have equal value, so TVL = 2 * reserve1_value
 */
export function calculatePoolTvl(
  reserve0: bigint,
  reserve1: bigint,
  decimals0: number,
  decimals1: number,
  token1PriceUsd: number
): { tvlToken0: number; tvlToken1: number; tvlUsd: number } {
  const reserve0Formatted = Number(reserve0) / Math.pow(10, decimals0);
  const reserve1Formatted = Number(reserve1) / Math.pow(10, decimals1);

  // In a constant product AMM, both sides have equal value
  // So TVL = 2 * (reserve1 * price_of_token1)
  const tvlToken1 = reserve1Formatted;
  const tvlUsd = reserve1Formatted * token1PriceUsd * 2;

  // TVL in token0 terms (DIESEL)
  const tvlToken0 = reserve0Formatted * 2;

  return { tvlToken0, tvlToken1, tvlUsd };
}

/**
 * Lua script to fetch all stats in a single call:
 * - DIESEL total supply
 * - Both pool reserves
 * - Current block height
 */
export const STATS_LUA_SCRIPT = `
-- Fetch DIESEL stats and pool TVL in a single call
local results = {
  diesel = {},
  pools = {},
  height = 0
}

-- Helper to parse little-endian u128 from hex string at given byte offset
local function parse_u128_le(hex_str, byte_offset)
    local hex_offset = byte_offset * 2
    local hex_len = 32
    if #hex_str < hex_offset + hex_len then return nil end
    local hex_slice = hex_str:sub(hex_offset + 1, hex_offset + hex_len)
    local reversed = ""
    for i = #hex_slice - 1, 1, -2 do
        reversed = reversed .. hex_slice:sub(i, i + 1)
    end
    return tonumber(reversed, 16) or 0
end

-- Parse total supply from response (simpler format)
local function parse_total_supply(hex_str)
    if not hex_str then return nil end
    if hex_str:sub(1, 2) == "0x" then
        hex_str = hex_str:sub(3)
    end
    -- Find "1a" marker and extract value before "10"
    local marker_pos = hex_str:find("1a")
    if not marker_pos then return nil end
    local value_start = marker_pos + 4  -- Skip "1a" and length byte
    local value_end = hex_str:find("10", value_start)
    if not value_end then return nil end
    local value_hex = hex_str:sub(value_start, value_end - 1)
    -- Pad and reverse for LE
    while #value_hex < 32 do value_hex = value_hex .. "0" end
    local reversed = ""
    for i = #value_hex - 1, 1, -2 do
        reversed = reversed .. value_hex:sub(i, i + 1)
    end
    return tonumber(reversed, 16) or 0
end

-- Get current height
local success, height_result = pcall(function()
    return _RPC.metashrew_height()
end)
if success and height_result then
    results.height = tonumber(height_result) or 0
end

-- Fetch DIESEL total supply (opcode 101)
local success, diesel_response = pcall(function()
    return _RPC.metashrew_view("simulate", "0x20e3ce382a030200653001", "latest")
end)
if success and diesel_response then
    results.diesel.total_supply = parse_total_supply(diesel_response)
end

-- Fetch DIESEL/frBTC pool
local success, frbtc_response = pcall(function()
    return _RPC.metashrew_view("simulate", "0x2096ce382a06029fda04e7073001", "latest")
end)
if success and frbtc_response then
    local data_hex = frbtc_response
    if data_hex:sub(1, 2) == "0x" then
        data_hex = data_hex:sub(3)
    end
    local marker_pos = data_hex:find("1a")
    if marker_pos then
        local len_byte = tonumber(data_hex:sub(marker_pos + 2, marker_pos + 3), 16) or 0
        local inner_start = marker_pos + (len_byte < 128 and 4 or 6)
        if #data_hex >= inner_start + 223 then
            local inner_hex = data_hex:sub(inner_start)
            results.pools.DIESEL_FRBTC = {
                reserve_a = parse_u128_le(inner_hex, 64),
                reserve_b = parse_u128_le(inner_hex, 80),
                total_supply = parse_u128_le(inner_hex, 96)
            }
        end
    end
end

-- Fetch DIESEL/bUSD pool
local success, busd_response = pcall(function()
    return _RPC.metashrew_view("simulate", "0x2096ce382a0602d99604e7073001", "latest")
end)
if success and busd_response then
    local data_hex = busd_response
    if data_hex:sub(1, 2) == "0x" then
        data_hex = data_hex:sub(3)
    end
    local marker_pos = data_hex:find("1a")
    if marker_pos then
        local len_byte = tonumber(data_hex:sub(marker_pos + 2, marker_pos + 3), 16) or 0
        local inner_start = marker_pos + (len_byte < 128 and 4 or 6)
        if #data_hex >= inner_start + 223 then
            local inner_hex = data_hex:sub(inner_start)
            results.pools.DIESEL_BUSD = {
                reserve_a = parse_u128_le(inner_hex, 64),
                reserve_b = parse_u128_le(inner_hex, 80),
                total_supply = parse_u128_le(inner_hex, 96)
            }
        end
    end
end

return results
`;

/**
 * Result from the stats Lua script
 */
interface StatsLuaResult {
  diesel?: {
    total_supply?: number;
  };
  pools?: {
    DIESEL_FRBTC?: {
      reserve_a: number;
      reserve_b: number;
      total_supply: number;
    };
    DIESEL_BUSD?: {
      reserve_a: number;
      reserve_b: number;
      total_supply: number;
    };
  };
  height?: number;
}

/**
 * Fetch all DIESEL stats in a single RPC call
 * Returns DIESEL total supply, both pool reserves, and current height
 *
 * Uses alkanes-client with scripthash caching for better performance
 */
export async function fetchDieselStats(
  _config?: CandleFetcherConfig
): Promise<{
  dieselTotalSupply: bigint;
  pools: {
    DIESEL_FRBTC: { reserve0: bigint; reserve1: bigint; lpSupply: bigint } | null;
    DIESEL_BUSD: { reserve0: bigint; reserve1: bigint; lpSupply: bigint } | null;
  };
  height: number;
}> {
  const luaResult = await alkanesClient.executeLuaScript<StatsLuaResult>(
    STATS_LUA_SCRIPT,
    []
  );

  return {
    dieselTotalSupply: BigInt(Math.floor(luaResult?.diesel?.total_supply || 0)),
    pools: {
      DIESEL_FRBTC: luaResult?.pools?.DIESEL_FRBTC ? {
        reserve0: BigInt(Math.floor(luaResult.pools.DIESEL_FRBTC.reserve_a)),
        reserve1: BigInt(Math.floor(luaResult.pools.DIESEL_FRBTC.reserve_b)),
        lpSupply: BigInt(Math.floor(luaResult.pools.DIESEL_FRBTC.total_supply)),
      } : null,
      DIESEL_BUSD: luaResult?.pools?.DIESEL_BUSD ? {
        reserve0: BigInt(Math.floor(luaResult.pools.DIESEL_BUSD.reserve_a)),
        reserve1: BigInt(Math.floor(luaResult.pools.DIESEL_BUSD.reserve_b)),
        lpSupply: BigInt(Math.floor(luaResult.pools.DIESEL_BUSD.total_supply)),
      } : null,
    },
    height: luaResult?.height || 0,
  };
}
