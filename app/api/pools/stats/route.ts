import { NextRequest, NextResponse } from "next/server";
import {
  getDieselMarketStats,
  getTvlStats,
  getDashboardStats,
} from "@/lib/pools/pool-service";

/**
 * GET /api/pools/stats
 *
 * Returns market stats and TVL data for the dashboard.
 *
 * Query params:
 * - type: "market" | "tvl" | "all" (default: "all")
 *
 * Response:
 * - For type=market: { marketStats: DieselMarketStats }
 * - For type=tvl: { tvlStats: TvlStats }
 * - For type=all: { marketStats, tvlStats, btcPrice }
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "all";

    if (type === "market") {
      const marketStats = await getDieselMarketStats();

      return NextResponse.json({
        success: true,
        data: {
          totalSupply: marketStats.totalSupply.toString(),
          totalSupplyFormatted: marketStats.totalSupplyFormatted,
          priceUsd: marketStats.priceUsd,
          priceBtc: marketStats.priceBtc,
          marketCapUsd: marketStats.marketCapUsd,
          timestamp: marketStats.timestamp,
        },
      });
    }

    if (type === "tvl") {
      const tvlStats = await getTvlStats();

      // Serialize bigints
      const pools: Record<string, unknown> = {};
      for (const [key, pool] of Object.entries(tvlStats.pools)) {
        pools[key] = {
          ...pool,
          reserve0: pool.reserve0.toString(),
          reserve1: pool.reserve1.toString(),
          lpTotalSupply: pool.lpTotalSupply.toString(),
        };
      }

      return NextResponse.json({
        success: true,
        data: {
          pools,
          totalTvlUsd: tvlStats.totalTvlUsd,
          timestamp: tvlStats.timestamp,
        },
      });
    }

    // Default: fetch all stats
    const stats = await getDashboardStats();

    // Serialize bigints
    const pools: Record<string, unknown> = {};
    for (const [key, pool] of Object.entries(stats.tvlStats.pools)) {
      pools[key] = {
        ...pool,
        reserve0: pool.reserve0.toString(),
        reserve1: pool.reserve1.toString(),
        lpTotalSupply: pool.lpTotalSupply.toString(),
      };
    }

    return NextResponse.json({
      success: true,
      data: {
        marketStats: {
          totalSupply: stats.marketStats.totalSupply.toString(),
          totalSupplyFormatted: stats.marketStats.totalSupplyFormatted,
          priceUsd: stats.marketStats.priceUsd,
          priceBtc: stats.marketStats.priceBtc,
          marketCapUsd: stats.marketStats.marketCapUsd,
          timestamp: stats.marketStats.timestamp,
        },
        tvlStats: {
          pools,
          totalTvlUsd: stats.tvlStats.totalTvlUsd,
          timestamp: stats.tvlStats.timestamp,
        },
        btcPrice: stats.btcPrice,
        timestamp: stats.timestamp,
      },
    });
  } catch (error) {
    console.error("Stats API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch stats",
      },
      { status: 500 }
    );
  }
}
