"use client";

import { useTranslations } from "next-intl";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { usePoolPrices, useBtcPrice, formatUsd, formatCompact } from "@/hooks/usePriceData";
import { FireStakingSection } from "@/components/fire";
import { POOL_IDS } from "@/lib/pools/pool-ids";

// All alkanes tokens use 8 decimals
const TOKEN_DECIMALS = 8;

function formatReserve(reserve: string, decimals: number = TOKEN_DECIMALS): number {
  return Number(reserve) / Math.pow(10, decimals);
}

export default function VaultsPage() {
  const t = useTranslations();
  const { data: pools, isLoading: poolsLoading, error: poolsError } = usePoolPrices();
  const { data: btcPrice } = useBtcPrice();

  const loading = poolsLoading;
  const error = poolsError?.message || null;

  // Calculate pool metrics
  const poolMetrics = pools && btcPrice ? {
    // DIESEL/frBTC Pool
    dieselReserve: formatReserve(pools.pools.DIESEL_FRBTC.reserve0),
    frbtcReserve: formatReserve(pools.pools.DIESEL_FRBTC.reserve1),
    dieselPrice: pools.pools.DIESEL_FRBTC.price * btcPrice.usd,
    frbtcPrice: btcPrice.usd,
    // Pool TVL = value of both sides (should be roughly equal in an AMM)
    poolTvl: (
      formatReserve(pools.pools.DIESEL_FRBTC.reserve0) * pools.pools.DIESEL_FRBTC.price * btcPrice.usd +
      formatReserve(pools.pools.DIESEL_FRBTC.reserve1) * btcPrice.usd
    ),
    // Price
    dieselPriceInFrbtc: pools.pools.DIESEL_FRBTC.price,
  } : null;

  // TODO: These will come from treasury contract queries
  const protocolMetrics = {
    // Protocol Owned Liquidity (LP tokens held by treasury)
    polLpTokens: 0, // Placeholder - need to query treasury
    polValueUsd: 0, // Placeholder
    polPercentOfPool: 0, // Placeholder
    // Treasury total value
    treasuryValueUsd: 0, // Placeholder
    // FIRE metrics
    fireCirculatingSupply: 0, // Placeholder
    liquidityBackedPerFire: 0, // Placeholder - POL value / FIRE supply
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-[color:var(--sf-text)]">
            Protocol Dashboard
          </h1>
          <p className="text-[color:var(--sf-muted)]">
            DIESEL/frBTC liquidity pool and FIRE staking metrics
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card p-6 animate-pulse">
                <div className="h-6 bg-[color:var(--sf-surface)] rounded w-1/4 mb-4" />
                <div className="h-16 bg-[color:var(--sf-surface)] rounded" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="glass-card p-6 text-center">
            <p className="text-red-500">{error}</p>
          </div>
        ) : poolMetrics ? (
          <div className="space-y-8">
            {/* Pool Depth Section */}
            <section>
              <h2 className="text-xl font-bold mb-4 text-[color:var(--sf-text)]">
                Pool Depth
              </h2>
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm text-[color:var(--sf-muted)]">DIESEL/frBTC Pool</p>
                    <p className="text-lg font-mono text-[color:var(--sf-muted)]">{POOL_IDS.DIESEL_FRBTC.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-[color:var(--sf-muted)]">Total Pool TVL</p>
                    <p className="text-2xl font-bold text-[color:var(--sf-primary)]">
                      {formatUsd(poolMetrics.poolTvl)}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* DIESEL Side */}
                  <div className="p-4 rounded-lg bg-[color:var(--sf-surface)]/50">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">D</span>
                      </div>
                      <div>
                        <p className="font-bold text-[color:var(--sf-text)]">DIESEL</p>
                        <p className="text-sm text-[color:var(--sf-muted)]">
                          {formatUsd(poolMetrics.dieselPrice)} per token
                        </p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-[color:var(--sf-muted)]">Amount in Pool</span>
                        <span className="font-mono text-[color:var(--sf-text)]">
                          {formatCompact(poolMetrics.dieselReserve)} DIESEL
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[color:var(--sf-muted)]">Value</span>
                        <span className="font-bold text-[color:var(--sf-primary)]">
                          {formatUsd(poolMetrics.dieselReserve * poolMetrics.dieselPrice)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* frBTC Side */}
                  <div className="p-4 rounded-lg bg-[color:var(--sf-surface)]/50">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-600 to-orange-400 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">₿</span>
                      </div>
                      <div>
                        <p className="font-bold text-[color:var(--sf-text)]">frBTC</p>
                        <p className="text-sm text-[color:var(--sf-muted)]">
                          {formatUsd(poolMetrics.frbtcPrice)} per token
                        </p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-[color:var(--sf-muted)]">Amount in Pool</span>
                        <span className="font-mono text-[color:var(--sf-text)]">
                          {poolMetrics.frbtcReserve.toFixed(8)} frBTC
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[color:var(--sf-muted)]">Value</span>
                        <span className="font-bold text-[color:var(--sf-primary)]">
                          {formatUsd(poolMetrics.frbtcReserve * poolMetrics.frbtcPrice)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Exchange Rate */}
                <div className="mt-4 pt-4 border-t border-[color:var(--sf-border)]">
                  <p className="text-sm text-[color:var(--sf-muted)]">
                    Exchange Rate: 1 DIESEL = {poolMetrics.dieselPriceInFrbtc.toFixed(8)} frBTC
                  </p>
                </div>
              </div>
            </section>

            {/* Protocol Owned Liquidity Section */}
            <section>
              <h2 className="text-xl font-bold mb-4 text-[color:var(--sf-text)]">
                Protocol Owned Liquidity
              </h2>
              <div className="glass-card p-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="p-4 rounded-lg bg-[color:var(--sf-surface)]/50">
                    <p className="text-sm text-[color:var(--sf-muted)] mb-1">POL Value</p>
                    <p className="text-2xl font-bold text-[color:var(--sf-primary)]">
                      {protocolMetrics.polValueUsd > 0
                        ? formatUsd(protocolMetrics.polValueUsd)
                        : "Coming Soon"}
                    </p>
                    <p className="text-xs text-[color:var(--sf-muted)] mt-1">
                      LP tokens held by treasury
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-[color:var(--sf-surface)]/50">
                    <p className="text-sm text-[color:var(--sf-muted)] mb-1">Treasury Value</p>
                    <p className="text-2xl font-bold text-[color:var(--sf-text)]">
                      {protocolMetrics.treasuryValueUsd > 0
                        ? formatUsd(protocolMetrics.treasuryValueUsd)
                        : "Coming Soon"}
                    </p>
                    <p className="text-xs text-[color:var(--sf-muted)] mt-1">
                      Total protocol holdings
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-[color:var(--sf-surface)]/50">
                    <p className="text-sm text-[color:var(--sf-muted)] mb-1">Liquidity Backed / FIRE</p>
                    <p className="text-2xl font-bold text-[color:var(--sf-text)]">
                      {protocolMetrics.liquidityBackedPerFire > 0
                        ? formatUsd(protocolMetrics.liquidityBackedPerFire)
                        : "Coming Soon"}
                    </p>
                    <p className="text-xs text-[color:var(--sf-muted)] mt-1">
                      POL value per FIRE token
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Current Block */}
            <div className="text-sm text-[color:var(--sf-muted)] text-right">
              Block #{pools?.currentHeight.toLocaleString()}
            </div>
          </div>
        ) : null}

        {/* FIRE Staking Section */}
        <div className="mt-12 pt-12 border-t border-[color:var(--sf-border)]">
          <FireStakingSection />
        </div>
      </main>

      <Footer />
    </div>
  );
}
