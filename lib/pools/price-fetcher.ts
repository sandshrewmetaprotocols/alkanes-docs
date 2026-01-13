/**
 * Price Fetcher Module
 *
 * Provides functions for fetching Bitcoin and token prices from the Alkanes SDK.
 * This is a shared module used by both server-side routes and live integration tests.
 *
 * Used by:
 * - Server-side API routes (app/api/btc-price, app/api/pools)
 * - Live integration tests
 */
import { alkanesClient } from '../alkanes-client';

export interface BitcoinPrice {
  usd: number;
  timestamp: number;
}

export interface PriceFetcherConfig {
  dataApiUrl?: string;
}

/**
 * Fetch current Bitcoin price in USD via the SDK's Data API
 * Uses alkanes-client which internally uses alkanes-web-sys
 */
export async function fetchBitcoinPrice(
  _config?: PriceFetcherConfig
): Promise<BitcoinPrice> {
  const usd = await alkanesClient.getBitcoinPrice();

  if (typeof usd !== 'number' || usd <= 0) {
    throw new Error('Invalid BTC price response from SDK');
  }

  return {
    usd,
    timestamp: Date.now(),
  };
}

/**
 * Calculate DIESEL price in USD based on pool prices and BTC price
 *
 * @param dieselFrbtcPrice - DIESEL price in frBTC (from DIESEL/frBTC pool)
 * @param btcUsdPrice - BTC price in USD
 * @returns DIESEL price in USD
 */
export function calculateDieselUsdPrice(
  dieselFrbtcPrice: number,
  btcUsdPrice: number
): number {
  // frBTC is 1:1 with BTC, so DIESEL/frBTC * BTC/USD = DIESEL/USD
  return dieselFrbtcPrice * btcUsdPrice;
}

/**
 * Get comprehensive DIESEL price metrics
 */
export interface DieselPriceMetrics {
  // Direct pool prices
  dieselFrbtcPrice: number;  // DIESEL price in frBTC
  dieselBusdPrice: number;   // DIESEL price in bUSD

  // BTC reference
  btcUsdPrice: number;       // BTC price in USD

  // Calculated USD price (via frBTC)
  dieselUsdViaFrbtc: number; // DIESEL price in USD (via frBTC * BTC)

  // Timestamp
  timestamp: number;
}

export async function fetchDieselPriceMetrics(
  dieselFrbtcPrice: number,
  dieselBusdPrice: number,
  config?: PriceFetcherConfig
): Promise<DieselPriceMetrics> {
  const btcPrice = await fetchBitcoinPrice(config);

  return {
    dieselFrbtcPrice,
    dieselBusdPrice,
    btcUsdPrice: btcPrice.usd,
    dieselUsdViaFrbtc: calculateDieselUsdPrice(dieselFrbtcPrice, btcPrice.usd),
    timestamp: Date.now(),
  };
}
