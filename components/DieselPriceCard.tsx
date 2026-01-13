"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { usePoolPrices, useBtcPrice, usePoolCandles, usePoolVolume, useMarketStats, formatUsd, formatCompact } from "@/hooks/usePriceData";
import { AreaPriceChart, type CandleDataPoint } from "@/components/charts";

export function DieselPriceCard() {
  const t = useTranslations("dashboard.diesel");
  const { data: pools, isLoading: poolsLoading } = usePoolPrices();
  const { data: btcPrice, isLoading: btcLoading } = useBtcPrice();
  const { data: candles } = usePoolCandles("DIESEL_FRBTC", "hourly", 24);
  const { data: volume } = usePoolVolume("DIESEL_FRBTC");
  const { data: marketStats } = useMarketStats();

  const isLoading = poolsLoading || btcLoading;

  // Calculate price from DIESEL/frBTC pool (more liquid) with BTC conversion
  const dieselPriceFrbtc = pools?.pools.DIESEL_FRBTC.price || 0;
  const dieselPriceUsd = btcPrice ? dieselPriceFrbtc * btcPrice.usd : 0;

  // Also get bUSD price for comparison/display
  const dieselPriceBusd = pools?.pools.DIESEL_BUSD.price || 0;

  // Calculate 24h change from candle data
  let change24h = 0;
  let high24h = dieselPriceFrbtc;
  let low24h = dieselPriceFrbtc;

  if (candles && candles.candles.length > 0) {
    const firstCandle = candles.candles[0];
    const lastCandle = candles.candles[candles.candles.length - 1];

    if (firstCandle.open > 0) {
      change24h = ((lastCandle.close - firstCandle.open) / firstCandle.open) * 100;
    }

    high24h = Math.max(...candles.candles.map(c => c.high));
    low24h = Math.min(...candles.candles.map(c => c.low));
  }

  const change24hStr = change24h >= 0 ? `+${change24h.toFixed(1)}%` : `${change24h.toFixed(1)}%`;
  const isPositiveChange = change24h >= 0;

  // Format volume - show USD if available, otherwise show in frBTC
  let volume24hStr = "--";
  if (volume) {
    if (volume.volume24hUsd !== undefined && volume.volume24hUsd > 0) {
      volume24hStr = formatUsd(volume.volume24hUsd);
    } else if (volume.volume24h > 0) {
      volume24hStr = `${formatCompact(volume.volume24h)} frBTC`;
    }
  }

  // Format market cap from market stats
  let marketCapStr = "--";
  if (marketStats && marketStats.marketCapUsd > 0) {
    marketCapStr = formatUsd(marketStats.marketCapUsd);
  }

  // Convert high/low to USD
  const high24hUsd = btcPrice ? high24h * btcPrice.usd : 0;
  const low24hUsd = btcPrice ? low24h * btcPrice.usd : 0;

  // Format prices
  const priceData = {
    priceBTC: dieselPriceFrbtc.toFixed(8),
    priceUSD: formatUsd(dieselPriceUsd),
    change24h: change24hStr,
    high24h: formatUsd(high24hUsd),
    low24h: formatUsd(low24hUsd),
    volume24h: volume24hStr,
    marketCap: marketCapStr,
  };

  return (
    <div className="glass-card overflow-hidden">
      {/* Header with rainbow accent */}
      <div className="card-header flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/images/diesel-logo.png"
            alt="DIESEL"
            width={40}
            height={40}
            className="rounded-xl"
          />
          <div>
            <h3 className="font-bold text-lg text-[color:var(--sf-text)]">{t("title")}</h3>
            <p className="text-xs text-[color:var(--sf-muted)]">{t("subtitle")}</p>
          </div>
        </div>
        <span className={`badge ${isPositiveChange ? 'badge-active' : 'badge-closed'}`}>
          {priceData.change24h}
        </span>
      </div>

      {/* Price Display */}
      <div className="p-6">
        <div className="mb-6">
          {isLoading ? (
            <>
              <div className="h-9 w-48 bg-[color:var(--sf-surface)] rounded animate-pulse mb-1" />
              <div className="h-7 w-24 bg-[color:var(--sf-surface)] rounded animate-pulse" />
            </>
          ) : (
            <>
              <div className="text-3xl font-bold text-[color:var(--sf-primary)] mb-1">
                {priceData.priceBTC} BTC
              </div>
              <div className="text-lg text-[color:var(--sf-muted)]">
                {priceData.priceUSD}
              </div>
            </>
          )}
        </div>

        {/* Professional Price Chart */}
        <div className="mb-6">
          <AreaPriceChart
            data={(candles?.candles || []) as CandleDataPoint[]}
            height={120}
            showGradient={true}
          />
          <p className="text-xs text-[color:var(--sf-muted)] mt-2 text-center">{t("chart")}</p>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid grid-cols-2">
          <div className="stat-item">
            <span className="stat-label">{t("high")}</span>
            <span className="stat-value">{priceData.high24h}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">{t("low")}</span>
            <span className="stat-value">{priceData.low24h}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">{t("volume")}</span>
            <span className="stat-value">{priceData.volume24h}</span>
            <a
              href="https://oyl.io/swap"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-[color:var(--sf-muted)] hover:text-[color:var(--sf-primary)] transition-colors mt-0.5 block"
              title={t("volumeLink")}
            >
              {t("volumeDisclaimer")}
            </a>
          </div>
          <div className="stat-item">
            <span className="stat-label">{t("marketCap")}</span>
            <span className="stat-value">{priceData.marketCap}</span>
          </div>
        </div>
      </div>

      {/* Rainbow bar at bottom */}
      <div className="diesel-rainbow-bar" />
    </div>
  );
}
