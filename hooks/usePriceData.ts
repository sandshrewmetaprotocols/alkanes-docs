"use client";

import { useQuery } from "@tanstack/react-query";

interface BitcoinPrice {
  usd: number;
  timestamp: number;
}

interface PriceApiResponse {
  success: boolean;
  data?: BitcoinPrice;
  error?: string;
}

interface PoolData {
  poolId: string;
  poolName: string;
  price: number;
  priceInverse: number;
  reserve0: string;
  reserve1: string;
  blockHeight: number;
}

interface PoolsApiResponse {
  success: boolean;
  data?: {
    currentHeight: number;
    pools: {
      DIESEL_FRBTC: PoolData;
      DIESEL_BUSD: PoolData;
    };
  };
  error?: string;
}

/**
 * Hook to fetch BTC price in USD
 * Cached globally via react-query with 60s stale time
 */
export function useBtcPrice() {
  return useQuery({
    queryKey: ["btc-price"],
    queryFn: async (): Promise<BitcoinPrice> => {
      const res = await fetch("/api/btc-price");
      const data: PriceApiResponse = await res.json();

      if (!data.success || !data.data) {
        throw new Error(data.error || "Failed to fetch BTC price");
      }

      return data.data;
    },
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 60 * 1000, // Auto-refresh every minute
  });
}

/**
 * Hook to fetch all pool data
 * Cached globally via react-query with 30s stale time
 */
export function usePoolPrices() {
  return useQuery({
    queryKey: ["pool-prices"],
    queryFn: async () => {
      const res = await fetch("/api/pools?pool=all");
      const data: PoolsApiResponse = await res.json();

      if (!data.success || !data.data) {
        throw new Error(data.error || "Failed to fetch pool prices");
      }

      return data.data;
    },
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 30 * 1000, // Auto-refresh every 30 seconds
  });
}

/**
 * Hook to get DIESEL price in USD
 * Combines BTC price with DIESEL/frBTC pool price
 */
export function useDieselUsdPrice() {
  const { data: btcPrice, isLoading: btcLoading } = useBtcPrice();
  const { data: pools, isLoading: poolsLoading } = usePoolPrices();

  const isLoading = btcLoading || poolsLoading;

  if (!btcPrice || !pools) {
    return { priceUsd: null, isLoading };
  }

  // DIESEL/frBTC price = frBTC per DIESEL
  // frBTC is 1:1 with BTC
  // So DIESEL USD = (frBTC per DIESEL) * BTC USD
  const dieselFrbtcPrice = pools.pools.DIESEL_FRBTC.price;
  const priceUsd = dieselFrbtcPrice * btcPrice.usd;

  return { priceUsd, isLoading, btcPrice: btcPrice.usd };
}

/**
 * Format USD price with appropriate precision
 */
export function formatUsd(value: number): string {
  if (value >= 1000) {
    return `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  }
  if (value >= 1) {
    return `$${value.toFixed(2)}`;
  }
  if (value >= 0.01) {
    return `$${value.toFixed(4)}`;
  }
  return `$${value.toFixed(6)}`;
}

interface Candle {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface CandlesApiResponse {
  success: boolean;
  data?: {
    pool: string;
    poolId: string;
    interval: string;
    currentHeight: number;
    candles: Candle[];
  };
  error?: string;
}

/**
 * Hook to fetch candle data for a pool
 * @param pool Pool key (e.g., "DIESEL_FRBTC")
 * @param interval "hourly" | "daily" | "weekly"
 * @param limit Number of candles to fetch
 */
export function usePoolCandles(pool: string, interval: string = "daily", limit: number = 30) {
  return useQuery({
    queryKey: ["pool-candles", pool, interval, limit],
    queryFn: async () => {
      const params = new URLSearchParams({
        pool,
        interval,
        limit: limit.toString(),
      });
      const res = await fetch(`/api/pools/candles?${params}`);
      const data: CandlesApiResponse = await res.json();

      if (!data.success || !data.data) {
        throw new Error(data.error || "Failed to fetch candle data");
      }

      return data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - candles don't change frequently
    refetchInterval: 5 * 60 * 1000,
  });
}

/**
 * Format large numbers with K/M/B suffixes
 */
export function formatCompact(value: number): string {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(2)}B`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(2)}K`;
  }
  return value.toFixed(2);
}

interface PoolVolume {
  poolId: string;
  poolName: string;
  volume24h: number;
  volume24hUsd?: number;
  startHeight: number;
  endHeight: number;
  timestamp: number;
}

interface VolumeApiResponse {
  success: boolean;
  data?: {
    pools: {
      DIESEL_FRBTC: PoolVolume;
      DIESEL_BUSD: PoolVolume;
    };
    timestamp: number;
  };
  error?: string;
}

interface SingleVolumeApiResponse {
  success: boolean;
  data?: PoolVolume;
  error?: string;
}

/**
 * Hook to fetch 24h volume for all pools
 * Volume is estimated using constant product AMM fee mechanics
 */
export function usePoolVolumes() {
  return useQuery({
    queryKey: ["pool-volumes"],
    queryFn: async () => {
      const res = await fetch("/api/pools/volume?pool=all");
      const data: VolumeApiResponse = await res.json();

      if (!data.success || !data.data) {
        throw new Error(data.error || "Failed to fetch volume data");
      }

      return data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch 24h volume for a specific pool
 */
export function usePoolVolume(pool: string) {
  return useQuery({
    queryKey: ["pool-volume", pool],
    queryFn: async () => {
      const res = await fetch(`/api/pools/volume?pool=${pool}`);
      const data: SingleVolumeApiResponse = await res.json();

      if (!data.success || !data.data) {
        throw new Error(data.error || "Failed to fetch volume data");
      }

      return data.data;
    },
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });
}

// Market stats types
interface MarketStats {
  totalSupply: string;
  totalSupplyFormatted: number;
  priceUsd: number;
  priceBtc: number;
  marketCapUsd: number;
  timestamp: number;
}

interface TvlPoolData {
  poolId: string;
  poolName: string;
  reserve0: string;
  reserve1: string;
  tvlToken0: number;
  tvlToken1: number;
  tvlUsd: number;
  lpTotalSupply: string;
}

interface TvlStats {
  pools: {
    DIESEL_FRBTC?: TvlPoolData;
    DIESEL_BUSD?: TvlPoolData;
  };
  totalTvlUsd: number;
  timestamp: number;
}

interface DashboardStats {
  marketStats: MarketStats;
  tvlStats: TvlStats;
  btcPrice: {
    usd: number;
    timestamp: number;
  };
  timestamp: number;
}

interface StatsApiResponse {
  success: boolean;
  data?: DashboardStats;
  error?: string;
}

interface MarketStatsApiResponse {
  success: boolean;
  data?: MarketStats;
  error?: string;
}

interface TvlStatsApiResponse {
  success: boolean;
  data?: TvlStats;
  error?: string;
}

/**
 * Hook to fetch all dashboard stats (market stats + TVL)
 * This is the most efficient way to get all data for the dashboard
 */
export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const res = await fetch("/api/pools/stats?type=all");
      const data: StatsApiResponse = await res.json();

      if (!data.success || !data.data) {
        throw new Error(data.error || "Failed to fetch dashboard stats");
      }

      return data.data;
    },
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 60 * 1000,
  });
}

/**
 * Hook to fetch DIESEL market stats (total supply, market cap)
 */
export function useMarketStats() {
  return useQuery({
    queryKey: ["market-stats"],
    queryFn: async () => {
      const res = await fetch("/api/pools/stats?type=market");
      const data: MarketStatsApiResponse = await res.json();

      if (!data.success || !data.data) {
        throw new Error(data.error || "Failed to fetch market stats");
      }

      return data.data;
    },
    staleTime: 60 * 1000,
    refetchInterval: 60 * 1000,
  });
}

/**
 * Hook to fetch TVL stats for all pools
 */
export function useTvlStats() {
  return useQuery({
    queryKey: ["tvl-stats"],
    queryFn: async () => {
      const res = await fetch("/api/pools/stats?type=tvl");
      const data: TvlStatsApiResponse = await res.json();

      if (!data.success || !data.data) {
        throw new Error(data.error || "Failed to fetch TVL stats");
      }

      return data.data;
    },
    staleTime: 60 * 1000,
    refetchInterval: 60 * 1000,
  });
}
