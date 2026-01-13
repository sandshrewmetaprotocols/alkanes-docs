"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { usePoolPrices, useBtcPrice, useTvlStats, formatUsd, formatCompact } from "@/hooks/usePriceData";

interface Vault {
  id: string;
  name: string;
  symbol: string;
  priceNative: string;
  priceUsd: string | null;
  tvl: string;
  tvlUsd: string | null;
  token1Symbol: string;
}

// All alkane tokens use 8 decimals
const TOKEN_DECIMALS = 8;

function formatReserve(reserve: string, decimals: number): number {
  return Number(reserve) / Math.pow(10, decimals);
}

export function VaultPerformance() {
  const t = useTranslations("dashboard.vaults");
  const tCommon = useTranslations("common");

  const { data: pools, isLoading: poolsLoading, error: poolsError } = usePoolPrices();
  const { data: btcPrice, isLoading: btcLoading } = useBtcPrice();
  const { data: tvlStats, isLoading: tvlLoading } = useTvlStats();

  const loading = poolsLoading || tvlLoading;
  const error = poolsError?.message || null;

  // Build vault list from live pool data with proper TVL calculation
  // TVL = both sides of the pool valued in USD (2 * reserve1 value)
  const vaults: Vault[] = pools
    ? [
        {
          id: "diesel-frbtc",
          name: "DIESEL/frBTC",
          symbol: "D-frBTC",
          priceNative: pools.pools.DIESEL_FRBTC.price.toFixed(8),
          priceUsd: btcPrice
            ? formatUsd(pools.pools.DIESEL_FRBTC.price * btcPrice.usd)
            : null,
          tvl: `${formatCompact(formatReserve(pools.pools.DIESEL_FRBTC.reserve0, TOKEN_DECIMALS) * 2)} DIESEL`,
          // TVL = value of both sides = 2 * (reserve1 * btcPrice)
          tvlUsd: tvlStats?.pools.DIESEL_FRBTC
            ? formatUsd(tvlStats.pools.DIESEL_FRBTC.tvlUsd)
            : btcPrice
            ? formatUsd(
                formatReserve(pools.pools.DIESEL_FRBTC.reserve1, TOKEN_DECIMALS) *
                  btcPrice.usd *
                  2
              )
            : null,
          token1Symbol: "frBTC",
        },
        {
          id: "diesel-busd",
          name: "DIESEL/bUSD",
          symbol: "D-bUSD",
          priceNative: pools.pools.DIESEL_BUSD.price.toFixed(4),
          priceUsd: formatUsd(pools.pools.DIESEL_BUSD.price), // bUSD is already USD
          tvl: `${formatCompact(formatReserve(pools.pools.DIESEL_BUSD.reserve0, TOKEN_DECIMALS) * 2)} DIESEL`,
          // TVL = value of both sides = 2 * reserve1 (bUSD is 1:1 USD)
          tvlUsd: tvlStats?.pools.DIESEL_BUSD
            ? formatUsd(tvlStats.pools.DIESEL_BUSD.tvlUsd)
            : formatUsd(
                formatReserve(pools.pools.DIESEL_BUSD.reserve1, TOKEN_DECIMALS) * 2
              ),
          token1Symbol: "bUSD",
        },
      ]
    : [];

  // Calculate total DIESEL in pools (both sides)
  const totalDieselAmount = pools
    ? formatReserve(pools.pools.DIESEL_FRBTC.reserve0, TOKEN_DECIMALS) * 2 +
      formatReserve(pools.pools.DIESEL_BUSD.reserve0, TOKEN_DECIMALS) * 2
    : 0;

  // Use TVL stats if available, otherwise calculate
  const totalTvlUsd = tvlStats
    ? tvlStats.totalTvlUsd
    : pools && btcPrice
    ? formatReserve(pools.pools.DIESEL_FRBTC.reserve1, TOKEN_DECIMALS) *
        btcPrice.usd *
        2 +
      formatReserve(pools.pools.DIESEL_BUSD.reserve1, TOKEN_DECIMALS) * 2
    : null;

  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <div className="card-header flex items-center justify-between">
        <h3 className="font-bold text-lg text-[color:var(--sf-text)]">{t("title")}</h3>
        <Link
          href="/vaults"
          className="text-sm text-[color:var(--sf-primary)] hover:text-[color:var(--sf-boost-label)] transition-colors"
        >
          {tCommon("viewAll")} →
        </Link>
      </div>

      {/* Pool List */}
      <div className="p-4">
        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-16 rounded-xl bg-[color:var(--sf-surface)]/50 animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-4 text-[color:var(--sf-muted)]">
            <p className="text-sm">{error}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {vaults.map((vault) => (
              <VaultRow key={vault.id} vault={vault} tvlLabel={t("tvl")} />
            ))}
          </div>
        )}

        {/* Total TVL */}
        <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-[var(--sf-boost-bg-from)] to-[var(--sf-boost-bg-to)] border border-[color:var(--sf-primary)]/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[color:var(--sf-boost-label)] uppercase tracking-wider font-bold">{t("totalTvl")}</p>
              <p className="text-2xl font-bold text-[color:var(--sf-boost-value)]">
                {totalTvlUsd ? formatUsd(totalTvlUsd) : `${formatCompact(totalDieselAmount)} DIESEL`}
              </p>
              {totalTvlUsd && (
                <p className="text-xs text-[color:var(--sf-muted)]">
                  {formatCompact(totalDieselAmount)} DIESEL
                </p>
              )}
            </div>
            <div className="text-right">
              {pools && (
                <p className="text-xs text-[color:var(--sf-muted)]">
                  Block #{pools.currentHeight.toLocaleString()}
                </p>
              )}
              {btcPrice && (
                <p className="text-xs text-[color:var(--sf-muted)]">
                  BTC: {formatUsd(btcPrice.usd)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VaultRow({ vault, tvlLabel }: { vault: Vault; tvlLabel: string }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-[color:var(--sf-surface)]/50 border border-[color:var(--sf-outline)] hover:border-[color:var(--sf-primary)]/40 transition-colors cursor-pointer">
      <div className="flex items-center gap-3">
        <img
          src="/alkanes-mark.png"
          alt={vault.name}
          className="h-10 w-auto object-contain"
        />
        <div>
          <p className="font-semibold text-[color:var(--sf-text)]">{vault.name}</p>
          <p className="text-xs text-[color:var(--sf-muted)]">
            {tvlLabel}: {vault.tvlUsd || vault.tvl}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold text-[color:var(--sf-primary)]">
          {vault.priceUsd || `${vault.priceNative} ${vault.token1Symbol}`}
        </p>
        <p className="text-xs text-[color:var(--sf-muted)]">
          {vault.priceNative} {vault.token1Symbol}
        </p>
      </div>
    </div>
  );
}
