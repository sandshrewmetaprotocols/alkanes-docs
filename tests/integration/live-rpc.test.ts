/**
 * Live Integration Tests for Pool Candle Data and Price Metrics
 *
 * These tests verify that the candle computation and price fetching logic
 * works correctly against the live Alkanes RPC/Data API infrastructure.
 *
 * To run these tests:
 *   npm run test:live
 *
 * Environment:
 *   RPC_URL - Override the default RPC endpoint
 *   DATA_API_URL - Override the default Data API endpoint
 */

import { describe, it, expect } from "vitest";
import {
  fetchPoolCandles,
  fetchPoolDataPoints,
  getCurrentHeight,
  POOL_CONFIGS,
  calculatePrice,
  estimate24hVolume,
  estimateVolumeBetweenPoints,
  POOL_FEES,
  DIESEL_TOKEN,
  getDieselTotalSupply,
  fetchDieselStats,
  calculatePoolTvl,
  type PoolKey,
  type CandleFetcherConfig,
} from "@/lib/pools/candle-fetcher";
import {
  fetchBitcoinPrice,
  fetchDieselPriceMetrics,
  calculateDieselUsdPrice,
  type PriceFetcherConfig,
} from "@/lib/pools/price-fetcher";

// Skip all tests unless explicitly running integration tests
const runIntegration = process.env.RUN_INTEGRATION === "true";

// Set longer timeout for network calls
const TEST_TIMEOUT = 60000; // 60 seconds

const rpcConfig: CandleFetcherConfig = {
  rpcUrl: process.env.RPC_URL || "https://mainnet.subfrost.io/v4/buildalkanes",
};

const priceConfig: PriceFetcherConfig = {
  dataApiUrl: process.env.DATA_API_URL || "https://mainnet.subfrost.io/v4/buildalkanes",
};

describe.skipIf(!runIntegration)("Live Pool Candle Integration Tests", () => {
  describe("getCurrentHeight", () => {
    it("should return current block height", async () => {
      const height = await getCurrentHeight(rpcConfig);

      expect(height).toBeGreaterThan(900000);
      console.log(`Current block height: ${height}`);
    });
  });

  describe("fetchPoolDataPoints", () => {
    it("should fetch DIESEL/frBTC data points for last 7 blocks", async () => {
      const currentHeight = await getCurrentHeight(rpcConfig);
      const startHeight = currentHeight - 7 * 144; // ~7 days
      const interval = 144; // ~1 day

      console.log(`Fetching DIESEL/frBTC data from block ${startHeight} to ${currentHeight}...`);

      const dataPoints = await fetchPoolDataPoints(
        "DIESEL_FRBTC",
        startHeight,
        currentHeight,
        interval,
        rpcConfig
      );

      expect(dataPoints.length).toBeGreaterThan(0);
      console.log(`Got ${dataPoints.length} data points`);

      // Verify data structure
      for (const dp of dataPoints) {
        expect(dp.height).toBeGreaterThanOrEqual(startHeight);
        expect(dp.height).toBeLessThanOrEqual(currentHeight);
        expect(dp.reserve0).toBeGreaterThan(BigInt(0));
        expect(dp.reserve1).toBeGreaterThan(BigInt(0));
        expect(dp.totalSupply).toBeGreaterThan(BigInt(0));

        // Calculate and log price
        const price = calculatePrice(
          dp.reserve0,
          dp.reserve1,
          POOL_CONFIGS.DIESEL_FRBTC.token0Decimals,
          POOL_CONFIGS.DIESEL_FRBTC.token1Decimals
        );

        const timestampStr = dp.timestamp
          ? new Date(dp.timestamp * 1000).toISOString()
          : "N/A";

        console.log(
          `  Block ${dp.height}: price=${price.toFixed(8)} frBTC/DIESEL, ` +
          `timestamp=${timestampStr}`
        );
      }
    }, TEST_TIMEOUT);

    it("should fetch DIESEL/bUSD data points for last 7 blocks", async () => {
      const currentHeight = await getCurrentHeight(rpcConfig);
      const startHeight = currentHeight - 7 * 144;
      const interval = 144;

      console.log(`Fetching DIESEL/bUSD data from block ${startHeight} to ${currentHeight}...`);

      const dataPoints = await fetchPoolDataPoints(
        "DIESEL_BUSD",
        startHeight,
        currentHeight,
        interval,
        rpcConfig
      );

      expect(dataPoints.length).toBeGreaterThan(0);
      console.log(`Got ${dataPoints.length} data points`);

      for (const dp of dataPoints) {
        const price = calculatePrice(
          dp.reserve0,
          dp.reserve1,
          POOL_CONFIGS.DIESEL_BUSD.token0Decimals,
          POOL_CONFIGS.DIESEL_BUSD.token1Decimals
        );

        const timestampStr = dp.timestamp
          ? new Date(dp.timestamp * 1000).toISOString()
          : "N/A";

        console.log(
          `  Block ${dp.height}: price=${price.toFixed(4)} bUSD/DIESEL, ` +
          `timestamp=${timestampStr}`
        );
      }
    }, TEST_TIMEOUT);
  });

  describe("fetchPoolCandles", () => {
    it("should fetch and build DIESEL/frBTC candles", async () => {
      const currentHeight = await getCurrentHeight(rpcConfig);
      const startHeight = currentHeight - 14 * 144; // ~14 days
      const interval = 144;

      console.log(`Building DIESEL/frBTC candles...`);

      const result = await fetchPoolCandles(
        "DIESEL_FRBTC",
        startHeight,
        currentHeight,
        interval,
        rpcConfig
      );

      expect(result.poolKey).toBe("DIESEL_FRBTC");
      expect(result.poolName).toBe("DIESEL/frBTC");
      expect(result.dataPoints.length).toBeGreaterThan(0);
      expect(result.candles.length).toBeGreaterThan(0);

      console.log(`Got ${result.dataPoints.length} data points, ${result.candles.length} candles`);

      for (const candle of result.candles) {
        expect(candle.open).toBeGreaterThan(0);
        expect(candle.high).toBeGreaterThanOrEqual(candle.open);
        expect(candle.high).toBeGreaterThanOrEqual(candle.close);
        expect(candle.low).toBeLessThanOrEqual(candle.open);
        expect(candle.low).toBeLessThanOrEqual(candle.close);
        expect(candle.timestamp).toBeGreaterThan(0);

        const dateStr = new Date(candle.timestamp).toISOString();
        console.log(
          `  ${dateStr}: O=${candle.open.toFixed(8)} H=${candle.high.toFixed(8)} ` +
          `L=${candle.low.toFixed(8)} C=${candle.close.toFixed(8)}`
        );
      }
    }, TEST_TIMEOUT);

    it("should fetch and build DIESEL/bUSD candles", async () => {
      const currentHeight = await getCurrentHeight(rpcConfig);
      const startHeight = currentHeight - 14 * 144;
      const interval = 144;

      console.log(`Building DIESEL/bUSD candles...`);

      const result = await fetchPoolCandles(
        "DIESEL_BUSD",
        startHeight,
        currentHeight,
        interval,
        rpcConfig
      );

      expect(result.poolKey).toBe("DIESEL_BUSD");
      expect(result.poolName).toBe("DIESEL/bUSD");
      expect(result.dataPoints.length).toBeGreaterThan(0);
      expect(result.candles.length).toBeGreaterThan(0);

      console.log(`Got ${result.dataPoints.length} data points, ${result.candles.length} candles`);

      for (const candle of result.candles) {
        const dateStr = new Date(candle.timestamp).toISOString();
        console.log(
          `  ${dateStr}: O=${candle.open.toFixed(4)} H=${candle.high.toFixed(4)} ` +
          `L=${candle.low.toFixed(4)} C=${candle.close.toFixed(4)}`
        );
      }
    }, TEST_TIMEOUT);
  });

  describe("price consistency", () => {
    it("should have consistent prices between pools", async () => {
      const currentHeight = await getCurrentHeight(rpcConfig);

      // Fetch current data for both pools
      const [frbtcData, busdData] = await Promise.all([
        fetchPoolDataPoints("DIESEL_FRBTC", currentHeight - 144, currentHeight, 144, rpcConfig),
        fetchPoolDataPoints("DIESEL_BUSD", currentHeight - 144, currentHeight, 144, rpcConfig),
      ]);

      expect(frbtcData.length).toBeGreaterThan(0);
      expect(busdData.length).toBeGreaterThan(0);

      const frbtcPrice = calculatePrice(
        frbtcData[frbtcData.length - 1].reserve0,
        frbtcData[frbtcData.length - 1].reserve1,
        6, 8
      );

      const busdPrice = calculatePrice(
        busdData[busdData.length - 1].reserve0,
        busdData[busdData.length - 1].reserve1,
        6, 6
      );

      console.log(`Current DIESEL prices:`);
      console.log(`  vs frBTC: ${frbtcPrice.toFixed(8)} frBTC/DIESEL`);
      console.log(`  vs bUSD: ${busdPrice.toFixed(4)} bUSD/DIESEL`);

      // Both prices should be positive
      expect(frbtcPrice).toBeGreaterThan(0);
      expect(busdPrice).toBeGreaterThan(0);
    }, TEST_TIMEOUT);
  });
});

describe.skipIf(!runIntegration)("Live Price Metrics Integration Tests", () => {
  describe("fetchBitcoinPrice", () => {
    it("should fetch current BTC price in USD", async () => {
      const btcPrice = await fetchBitcoinPrice(priceConfig);

      // BTC price should be positive and reasonable (between $1k and $1M)
      expect(btcPrice.usd).toBeGreaterThan(1000);
      expect(btcPrice.usd).toBeLessThan(1000000);
      expect(btcPrice.timestamp).toBeGreaterThan(0);

      console.log(`Current BTC price: $${btcPrice.usd.toLocaleString()}`);
    }, TEST_TIMEOUT);
  });

  describe("calculateDieselUsdPrice", () => {
    it("should calculate DIESEL USD price from frBTC price", () => {
      // Example: DIESEL = 0.0000005 frBTC, BTC = $100,000
      // DIESEL USD = 0.0000005 * 100000 = $0.05
      const dieselFrbtcPrice = 0.0000005;
      const btcUsdPrice = 100000;

      const dieselUsd = calculateDieselUsdPrice(dieselFrbtcPrice, btcUsdPrice);

      expect(dieselUsd).toBeCloseTo(0.05, 6);
      console.log(`Test calculation: ${dieselFrbtcPrice} frBTC * $${btcUsdPrice} = $${dieselUsd.toFixed(4)}`);
    });
  });

  describe("fetchDieselPriceMetrics", () => {
    it("should fetch comprehensive DIESEL price metrics", async () => {
      // First get pool prices from live data
      const currentHeight = await getCurrentHeight(rpcConfig);

      const [frbtcData, busdData] = await Promise.all([
        fetchPoolDataPoints("DIESEL_FRBTC", currentHeight - 144, currentHeight, 144, rpcConfig),
        fetchPoolDataPoints("DIESEL_BUSD", currentHeight - 144, currentHeight, 144, rpcConfig),
      ]);

      expect(frbtcData.length).toBeGreaterThan(0);
      expect(busdData.length).toBeGreaterThan(0);

      const dieselFrbtcPrice = calculatePrice(
        frbtcData[frbtcData.length - 1].reserve0,
        frbtcData[frbtcData.length - 1].reserve1,
        POOL_CONFIGS.DIESEL_FRBTC.token0Decimals,
        POOL_CONFIGS.DIESEL_FRBTC.token1Decimals
      );

      const dieselBusdPrice = calculatePrice(
        busdData[busdData.length - 1].reserve0,
        busdData[busdData.length - 1].reserve1,
        POOL_CONFIGS.DIESEL_BUSD.token0Decimals,
        POOL_CONFIGS.DIESEL_BUSD.token1Decimals
      );

      // Fetch comprehensive metrics
      const metrics = await fetchDieselPriceMetrics(
        dieselFrbtcPrice,
        dieselBusdPrice,
        priceConfig
      );

      // Verify all metrics are present and reasonable
      expect(metrics.dieselFrbtcPrice).toBe(dieselFrbtcPrice);
      expect(metrics.dieselBusdPrice).toBe(dieselBusdPrice);
      expect(metrics.btcUsdPrice).toBeGreaterThan(1000);
      expect(metrics.dieselUsdViaFrbtc).toBeGreaterThan(0);
      expect(metrics.timestamp).toBeGreaterThan(0);

      // Log all the metrics
      console.log(`\nDIESEL Price Metrics:`);
      console.log(`  DIESEL/frBTC: ${metrics.dieselFrbtcPrice.toFixed(8)} frBTC`);
      console.log(`  DIESEL/bUSD:  ${metrics.dieselBusdPrice.toFixed(4)} bUSD`);
      console.log(`  BTC/USD:      $${metrics.btcUsdPrice.toLocaleString()}`);
      console.log(`  DIESEL/USD:   $${metrics.dieselUsdViaFrbtc.toFixed(4)} (via frBTC)`);

      // Compare bUSD price vs calculated USD price (should be similar if market is efficient)
      const priceDifference = Math.abs(metrics.dieselBusdPrice - metrics.dieselUsdViaFrbtc);
      const percentDiff = (priceDifference / metrics.dieselBusdPrice) * 100;
      console.log(`\nPrice Comparison:`);
      console.log(`  bUSD price:   $${metrics.dieselBusdPrice.toFixed(4)}`);
      console.log(`  frBTC->USD:   $${metrics.dieselUsdViaFrbtc.toFixed(4)}`);
      console.log(`  Difference:   ${percentDiff.toFixed(2)}%`);
    }, TEST_TIMEOUT);
  });

  describe("end-to-end price flow", () => {
    it("should fetch all price data in a single flow", async () => {
      console.log("\n=== End-to-End Price Data Flow ===\n");

      // 1. Get current block height
      const currentHeight = await getCurrentHeight(rpcConfig);
      console.log(`1. Current block height: ${currentHeight}`);

      // 2. Fetch pool data for both pools
      const [frbtcData, busdData] = await Promise.all([
        fetchPoolDataPoints("DIESEL_FRBTC", currentHeight, currentHeight, 1, rpcConfig),
        fetchPoolDataPoints("DIESEL_BUSD", currentHeight, currentHeight, 1, rpcConfig),
      ]);

      expect(frbtcData.length).toBeGreaterThan(0);
      expect(busdData.length).toBeGreaterThan(0);

      const dieselFrbtcPrice = calculatePrice(
        frbtcData[0].reserve0,
        frbtcData[0].reserve1,
        POOL_CONFIGS.DIESEL_FRBTC.token0Decimals,
        POOL_CONFIGS.DIESEL_FRBTC.token1Decimals
      );

      const dieselBusdPrice = calculatePrice(
        busdData[0].reserve0,
        busdData[0].reserve1,
        POOL_CONFIGS.DIESEL_BUSD.token0Decimals,
        POOL_CONFIGS.DIESEL_BUSD.token1Decimals
      );

      console.log(`2. Pool prices fetched:`);
      console.log(`   DIESEL/frBTC: ${dieselFrbtcPrice.toFixed(8)}`);
      console.log(`   DIESEL/bUSD:  ${dieselBusdPrice.toFixed(4)}`);

      // 3. Fetch BTC price
      const btcPrice = await fetchBitcoinPrice(priceConfig);
      console.log(`3. BTC price: $${btcPrice.usd.toLocaleString()}`);

      // 4. Calculate DIESEL USD price
      const dieselUsd = calculateDieselUsdPrice(dieselFrbtcPrice, btcPrice.usd);
      console.log(`4. DIESEL/USD (calculated): $${dieselUsd.toFixed(4)}`);

      // 5. Summary
      console.log(`\n=== Summary ===`);
      console.log(`DIESEL token value: $${dieselUsd.toFixed(4)}`);
      console.log(`Equivalent to: ${(dieselFrbtcPrice * 100000000).toFixed(2)} sats`);

      // All values should be positive
      expect(dieselFrbtcPrice).toBeGreaterThan(0);
      expect(dieselBusdPrice).toBeGreaterThan(0);
      expect(btcPrice.usd).toBeGreaterThan(0);
      expect(dieselUsd).toBeGreaterThan(0);
    }, TEST_TIMEOUT);
  });
});

describe.skipIf(!runIntegration)("Live Volume Estimation Integration Tests", () => {
  describe("POOL_FEES constants", () => {
    it("should have correct fee structure", () => {
      // Verify fee constants match oyl-amm contracts
      expect(POOL_FEES.TOTAL_FEE_PER_1000).toBe(10);    // 1%
      expect(POOL_FEES.PROTOCOL_FEE_PER_1000).toBe(2);  // 0.2%
      expect(POOL_FEES.LP_FEE_PER_1000).toBe(8);        // 0.8%

      // Verify LP + protocol = total
      expect(POOL_FEES.LP_FEE_PER_1000 + POOL_FEES.PROTOCOL_FEE_PER_1000)
        .toBe(POOL_FEES.TOTAL_FEE_PER_1000);

      console.log("Fee structure verified:");
      console.log(`  Total fee:    ${POOL_FEES.TOTAL_FEE_PER_1000 / 10}%`);
      console.log(`  Protocol fee: ${POOL_FEES.PROTOCOL_FEE_PER_1000 / 10}%`);
      console.log(`  LP fee:       ${POOL_FEES.LP_FEE_PER_1000 / 10}%`);
    });
  });

  describe("estimateVolumeBetweenPoints", () => {
    it("should estimate volume from pool data changes for DIESEL/frBTC", async () => {
      const currentHeight = await getCurrentHeight(rpcConfig);
      const blocksIn24h = 144;
      const startHeight = currentHeight - blocksIn24h;

      console.log(`\nFetching DIESEL/frBTC pool state at blocks ${startHeight} and ${currentHeight}...`);

      // Fetch data at start and end of 24h period
      const [startData, endData] = await Promise.all([
        fetchPoolDataPoints("DIESEL_FRBTC", startHeight, startHeight, 1, rpcConfig),
        fetchPoolDataPoints("DIESEL_FRBTC", currentHeight, currentHeight, 1, rpcConfig),
      ]);

      expect(startData.length).toBeGreaterThan(0);
      expect(endData.length).toBeGreaterThan(0);

      const start = startData[0];
      const end = endData[0];

      console.log(`\nPool state comparison:`);
      console.log(`  Start (block ${start.height}):`);
      console.log(`    reserve0: ${start.reserve0.toString()}`);
      console.log(`    reserve1: ${start.reserve1.toString()}`);
      console.log(`    totalSupply: ${start.totalSupply.toString()}`);
      console.log(`  End (block ${end.height}):`);
      console.log(`    reserve0: ${end.reserve0.toString()}`);
      console.log(`    reserve1: ${end.reserve1.toString()}`);
      console.log(`    totalSupply: ${end.totalSupply.toString()}`);

      // Calculate k values
      const k0 = Number(start.reserve0) * Number(start.reserve1);
      const k1 = Number(end.reserve0) * Number(end.reserve1);
      const sqrtK0 = Math.sqrt(k0);
      const sqrtK1 = Math.sqrt(k1);

      console.log(`\nConstant product analysis:`);
      console.log(`  k_start: ${k0.toExponential(4)}`);
      console.log(`  k_end:   ${k1.toExponential(4)}`);
      console.log(`  sqrt(k) growth: ${((sqrtK1 - sqrtK0) / sqrtK0 * 100).toFixed(6)}%`);

      // Estimate volume
      const volume = estimateVolumeBetweenPoints(
        start,
        end,
        POOL_CONFIGS.DIESEL_FRBTC.token0Decimals,
        POOL_CONFIGS.DIESEL_FRBTC.token1Decimals
      );

      console.log(`\n24h Volume Estimate (DIESEL/frBTC):`);
      console.log(`  Volume: ${volume.toFixed(8)} frBTC`);

      // Volume should be non-negative
      expect(volume).toBeGreaterThanOrEqual(0);
    }, TEST_TIMEOUT);

    it("should estimate volume from pool data changes for DIESEL/bUSD", async () => {
      const currentHeight = await getCurrentHeight(rpcConfig);
      const blocksIn24h = 144;
      const startHeight = currentHeight - blocksIn24h;

      console.log(`\nFetching DIESEL/bUSD pool state at blocks ${startHeight} and ${currentHeight}...`);

      const [startData, endData] = await Promise.all([
        fetchPoolDataPoints("DIESEL_BUSD", startHeight, startHeight, 1, rpcConfig),
        fetchPoolDataPoints("DIESEL_BUSD", currentHeight, currentHeight, 1, rpcConfig),
      ]);

      expect(startData.length).toBeGreaterThan(0);
      expect(endData.length).toBeGreaterThan(0);

      const start = startData[0];
      const end = endData[0];

      console.log(`\nPool state comparison:`);
      console.log(`  Start (block ${start.height}):`);
      console.log(`    reserve0: ${start.reserve0.toString()}`);
      console.log(`    reserve1: ${start.reserve1.toString()}`);
      console.log(`  End (block ${end.height}):`);
      console.log(`    reserve0: ${end.reserve0.toString()}`);
      console.log(`    reserve1: ${end.reserve1.toString()}`);

      const volume = estimateVolumeBetweenPoints(
        start,
        end,
        POOL_CONFIGS.DIESEL_BUSD.token0Decimals,
        POOL_CONFIGS.DIESEL_BUSD.token1Decimals
      );

      console.log(`\n24h Volume Estimate (DIESEL/bUSD):`);
      console.log(`  Volume: ${volume.toFixed(2)} bUSD`);

      expect(volume).toBeGreaterThanOrEqual(0);
    }, TEST_TIMEOUT);
  });

  describe("estimate24hVolume", () => {
    it("should estimate 24h volume for DIESEL/frBTC pool", async () => {
      console.log("\n=== 24h Volume Estimation: DIESEL/frBTC ===\n");

      const result = await estimate24hVolume("DIESEL_FRBTC", rpcConfig);

      console.log(`Block range: ${result.startHeight} -> ${result.endHeight}`);
      console.log(`Blocks covered: ${result.endHeight - result.startHeight}`);
      console.log(`Volume (frBTC): ${result.volumeToken1.toFixed(8)}`);

      // Volume should be non-negative
      expect(result.volume).toBeGreaterThanOrEqual(0);
      expect(result.volumeToken1).toBeGreaterThanOrEqual(0);
      expect(result.startHeight).toBeLessThan(result.endHeight);
      expect(result.endHeight - result.startHeight).toBe(144); // ~24 hours
    }, TEST_TIMEOUT);

    it("should estimate 24h volume for DIESEL/bUSD pool", async () => {
      console.log("\n=== 24h Volume Estimation: DIESEL/bUSD ===\n");

      const result = await estimate24hVolume("DIESEL_BUSD", rpcConfig);

      console.log(`Block range: ${result.startHeight} -> ${result.endHeight}`);
      console.log(`Blocks covered: ${result.endHeight - result.startHeight}`);
      console.log(`Volume (bUSD): ${result.volumeToken1.toFixed(2)}`);

      expect(result.volume).toBeGreaterThanOrEqual(0);
      expect(result.volumeToken1).toBeGreaterThanOrEqual(0);
      expect(result.startHeight).toBeLessThan(result.endHeight);
    }, TEST_TIMEOUT);
  });

  describe("volume with USD conversion", () => {
    it("should calculate volume in USD terms", async () => {
      console.log("\n=== 24h Volume in USD ===\n");

      // Fetch volumes and BTC price in parallel
      const [frbtcVolume, busdVolume, btcPrice] = await Promise.all([
        estimate24hVolume("DIESEL_FRBTC", rpcConfig),
        estimate24hVolume("DIESEL_BUSD", rpcConfig),
        fetchBitcoinPrice(priceConfig),
      ]);

      // Calculate USD volumes
      const frbtcVolumeUsd = frbtcVolume.volumeToken1 * btcPrice.usd;
      const busdVolumeUsd = busdVolume.volumeToken1; // bUSD is already in USD

      const totalVolumeUsd = frbtcVolumeUsd + busdVolumeUsd;

      console.log(`BTC Price: $${btcPrice.usd.toLocaleString()}`);
      console.log(`\nDIESEL/frBTC Pool:`);
      console.log(`  Volume: ${frbtcVolume.volumeToken1.toFixed(8)} frBTC`);
      console.log(`  Volume: $${frbtcVolumeUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })} USD`);
      console.log(`\nDIESEL/bUSD Pool:`);
      console.log(`  Volume: ${busdVolume.volumeToken1.toFixed(2)} bUSD`);
      console.log(`  Volume: $${busdVolumeUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })} USD`);
      console.log(`\nTotal 24h Volume: $${totalVolumeUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })} USD`);

      // Volumes should be non-negative
      expect(frbtcVolumeUsd).toBeGreaterThanOrEqual(0);
      expect(busdVolumeUsd).toBeGreaterThanOrEqual(0);
    }, TEST_TIMEOUT);
  });

  describe("end-to-end volume and metrics flow", () => {
    it("should fetch complete pool metrics including volume", async () => {
      console.log("\n=== Complete Pool Metrics ===\n");

      // Get current height
      const currentHeight = await getCurrentHeight(rpcConfig);
      console.log(`Current block height: ${currentHeight}`);

      // Fetch all data in parallel
      const [
        frbtcData,
        busdData,
        frbtcVolume,
        busdVolume,
        btcPrice,
      ] = await Promise.all([
        fetchPoolDataPoints("DIESEL_FRBTC", currentHeight, currentHeight, 1, rpcConfig),
        fetchPoolDataPoints("DIESEL_BUSD", currentHeight, currentHeight, 1, rpcConfig),
        estimate24hVolume("DIESEL_FRBTC", rpcConfig),
        estimate24hVolume("DIESEL_BUSD", rpcConfig),
        fetchBitcoinPrice(priceConfig),
      ]);

      // Calculate prices
      const frbtcPrice = calculatePrice(
        frbtcData[0].reserve0,
        frbtcData[0].reserve1,
        POOL_CONFIGS.DIESEL_FRBTC.token0Decimals,
        POOL_CONFIGS.DIESEL_FRBTC.token1Decimals
      );

      const busdPrice = calculatePrice(
        busdData[0].reserve0,
        busdData[0].reserve1,
        POOL_CONFIGS.DIESEL_BUSD.token0Decimals,
        POOL_CONFIGS.DIESEL_BUSD.token1Decimals
      );

      const dieselUsd = frbtcPrice * btcPrice.usd;

      // Calculate TVL (all alkane tokens use 8 decimals)
      const frbtcTvl = (Number(frbtcData[0].reserve1) / 1e8) * btcPrice.usd * 2;
      const busdTvl = (Number(busdData[0].reserve1) / 1e8) * 2;  // bUSD also 8 decimals
      const totalTvl = frbtcTvl + busdTvl;

      // Calculate volumes in USD
      const frbtcVolumeUsd = frbtcVolume.volumeToken1 * btcPrice.usd;
      const busdVolumeUsd = busdVolume.volumeToken1;
      const totalVolume = frbtcVolumeUsd + busdVolumeUsd;

      console.log(`\n--- DIESEL Token ---`);
      console.log(`  Price (frBTC): ${frbtcPrice.toFixed(8)} frBTC`);
      console.log(`  Price (bUSD):  ${busdPrice.toFixed(4)} bUSD`);
      console.log(`  Price (USD):   $${dieselUsd.toFixed(4)}`);

      console.log(`\n--- Pool TVL ---`);
      console.log(`  DIESEL/frBTC: $${frbtcTvl.toLocaleString(undefined, { maximumFractionDigits: 0 })}`);
      console.log(`  DIESEL/bUSD:  $${busdTvl.toLocaleString(undefined, { maximumFractionDigits: 0 })}`);
      console.log(`  Total:        $${totalTvl.toLocaleString(undefined, { maximumFractionDigits: 0 })}`);

      console.log(`\n--- 24h Volume ---`);
      console.log(`  DIESEL/frBTC: $${frbtcVolumeUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}`);
      console.log(`  DIESEL/bUSD:  $${busdVolumeUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}`);
      console.log(`  Total:        $${totalVolume.toLocaleString(undefined, { maximumFractionDigits: 2 })}`);

      // All values should be positive
      expect(frbtcPrice).toBeGreaterThan(0);
      expect(busdPrice).toBeGreaterThan(0);
      expect(dieselUsd).toBeGreaterThan(0);
      expect(frbtcTvl).toBeGreaterThan(0);
      expect(busdTvl).toBeGreaterThan(0);
    }, TEST_TIMEOUT);
  });
});

describe.skipIf(!runIntegration)("Live DIESEL Stats Integration Tests", () => {
  describe("DIESEL_TOKEN configuration", () => {
    it("should have correct token configuration", () => {
      expect(DIESEL_TOKEN.block).toBe(2);
      expect(DIESEL_TOKEN.tx).toBe(0);
      expect(DIESEL_TOKEN.id).toBe("2:0");
      expect(DIESEL_TOKEN.symbol).toBe("DIESEL");
      expect(DIESEL_TOKEN.decimals).toBe(8);
      expect(DIESEL_TOKEN.totalSupplyPayload).toBe("0x20e3ce382a030200653001");

      console.log("DIESEL token configuration verified:");
      console.log(`  ID: ${DIESEL_TOKEN.id}`);
      console.log(`  Symbol: ${DIESEL_TOKEN.symbol}`);
      console.log(`  Decimals: ${DIESEL_TOKEN.decimals}`);
    });
  });

  describe("getDieselTotalSupply", () => {
    it("should fetch DIESEL total supply via metashrew_view", async () => {
      console.log("\n=== Fetching DIESEL Total Supply ===\n");

      const totalSupply = await getDieselTotalSupply(rpcConfig);

      // Total supply should be a positive bigint
      expect(totalSupply).toBeGreaterThan(BigInt(0));

      // Convert to human readable format (8 decimals)
      const formatted = Number(totalSupply) / Math.pow(10, DIESEL_TOKEN.decimals);

      console.log(`Total Supply (raw): ${totalSupply.toString()}`);
      console.log(`Total Supply (formatted): ${formatted.toLocaleString()} DIESEL`);

      // Known: DIESEL supply is around 574,838.60 DIESEL (57483860295594 raw)
      // Should be greater than 500,000 DIESEL
      expect(formatted).toBeGreaterThan(500000);
    }, TEST_TIMEOUT);
  });

  describe("fetchDieselStats (Lua script)", () => {
    it("should fetch all stats in a single RPC call", async () => {
      console.log("\n=== Fetching DIESEL Stats via Lua Script ===\n");

      const stats = await fetchDieselStats(rpcConfig);

      // Verify DIESEL total supply
      expect(stats.dieselTotalSupply).toBeGreaterThan(BigInt(0));
      const totalSupplyFormatted = Number(stats.dieselTotalSupply) / Math.pow(10, 8);
      console.log(`DIESEL Total Supply: ${totalSupplyFormatted.toLocaleString()} DIESEL`);

      // Verify current height
      expect(stats.height).toBeGreaterThan(900000);
      console.log(`Current Height: ${stats.height}`);

      // Verify DIESEL/frBTC pool
      expect(stats.pools.DIESEL_FRBTC).not.toBeNull();
      if (stats.pools.DIESEL_FRBTC) {
        expect(stats.pools.DIESEL_FRBTC.reserve0).toBeGreaterThan(BigInt(0));
        expect(stats.pools.DIESEL_FRBTC.reserve1).toBeGreaterThan(BigInt(0));
        expect(stats.pools.DIESEL_FRBTC.lpSupply).toBeGreaterThan(BigInt(0));

        const reserve0 = Number(stats.pools.DIESEL_FRBTC.reserve0) / 1e8;
        const reserve1 = Number(stats.pools.DIESEL_FRBTC.reserve1) / 1e8;
        const price = reserve1 / reserve0;

        console.log(`\nDIESEL/frBTC Pool:`);
        console.log(`  Reserve0 (DIESEL): ${reserve0.toLocaleString()}`);
        console.log(`  Reserve1 (frBTC): ${reserve1.toFixed(8)}`);
        console.log(`  LP Supply: ${(Number(stats.pools.DIESEL_FRBTC.lpSupply) / 1e8).toLocaleString()}`);
        console.log(`  Price: ${price.toFixed(8)} frBTC/DIESEL`);
      }

      // Verify DIESEL/bUSD pool
      expect(stats.pools.DIESEL_BUSD).not.toBeNull();
      if (stats.pools.DIESEL_BUSD) {
        expect(stats.pools.DIESEL_BUSD.reserve0).toBeGreaterThan(BigInt(0));
        expect(stats.pools.DIESEL_BUSD.reserve1).toBeGreaterThan(BigInt(0));
        expect(stats.pools.DIESEL_BUSD.lpSupply).toBeGreaterThan(BigInt(0));

        const reserve0 = Number(stats.pools.DIESEL_BUSD.reserve0) / 1e8;
        const reserve1 = Number(stats.pools.DIESEL_BUSD.reserve1) / 1e8;
        const price = reserve1 / reserve0;

        console.log(`\nDIESEL/bUSD Pool:`);
        console.log(`  Reserve0 (DIESEL): ${reserve0.toLocaleString()}`);
        console.log(`  Reserve1 (bUSD): ${reserve1.toFixed(2)}`);
        console.log(`  LP Supply: ${(Number(stats.pools.DIESEL_BUSD.lpSupply) / 1e8).toLocaleString()}`);
        console.log(`  Price: ${price.toFixed(4)} bUSD/DIESEL`);
      }
    }, TEST_TIMEOUT);

    it("should return consistent data with individual calls", async () => {
      console.log("\n=== Comparing Lua Script vs Individual Calls ===\n");

      // Fetch via Lua script (single call)
      const stats = await fetchDieselStats(rpcConfig);

      // Fetch individual pool data points
      const currentHeight = stats.height;
      const [frbtcData, busdData] = await Promise.all([
        fetchPoolDataPoints("DIESEL_FRBTC", currentHeight, currentHeight, 1, rpcConfig),
        fetchPoolDataPoints("DIESEL_BUSD", currentHeight, currentHeight, 1, rpcConfig),
      ]);

      // Compare DIESEL/frBTC pool
      if (stats.pools.DIESEL_FRBTC && frbtcData.length > 0) {
        const luaReserve0 = stats.pools.DIESEL_FRBTC.reserve0;
        const individualReserve0 = frbtcData[0].reserve0;

        console.log(`DIESEL/frBTC Reserve0:`);
        console.log(`  Lua script: ${luaReserve0.toString()}`);
        console.log(`  Individual: ${individualReserve0.toString()}`);

        // Values should be equal or very close (may differ slightly if block changed)
        const diff = Math.abs(Number(luaReserve0 - individualReserve0));
        const maxDiff = Number(luaReserve0) * 0.01; // 1% tolerance
        expect(diff).toBeLessThan(maxDiff);
      }

      // Compare DIESEL/bUSD pool
      if (stats.pools.DIESEL_BUSD && busdData.length > 0) {
        const luaReserve0 = stats.pools.DIESEL_BUSD.reserve0;
        const individualReserve0 = busdData[0].reserve0;

        console.log(`\nDIESEL/bUSD Reserve0:`);
        console.log(`  Lua script: ${luaReserve0.toString()}`);
        console.log(`  Individual: ${individualReserve0.toString()}`);

        const diff = Math.abs(Number(luaReserve0 - individualReserve0));
        const maxDiff = Number(luaReserve0) * 0.01;
        expect(diff).toBeLessThan(maxDiff);
      }
    }, TEST_TIMEOUT);
  });

  describe("calculatePoolTvl", () => {
    it("should calculate TVL correctly for both pools", async () => {
      console.log("\n=== TVL Calculation Test ===\n");

      const stats = await fetchDieselStats(rpcConfig);
      const btcPrice = await fetchBitcoinPrice(priceConfig);

      console.log(`BTC Price: $${btcPrice.usd.toLocaleString()}`);

      // Calculate TVL for DIESEL/frBTC
      if (stats.pools.DIESEL_FRBTC) {
        const { tvlToken0, tvlToken1, tvlUsd } = calculatePoolTvl(
          stats.pools.DIESEL_FRBTC.reserve0,
          stats.pools.DIESEL_FRBTC.reserve1,
          8, // DIESEL decimals
          8, // frBTC decimals
          btcPrice.usd
        );

        console.log(`\nDIESEL/frBTC TVL:`);
        console.log(`  TVL in DIESEL: ${tvlToken0.toLocaleString()}`);
        console.log(`  TVL in frBTC: ${tvlToken1.toFixed(8)}`);
        console.log(`  TVL in USD: $${tvlUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}`);

        // TVL should be positive and reasonable
        expect(tvlUsd).toBeGreaterThan(0);

        // Verify calculation: TVL = 2 * reserve1 * token1Price
        const reserve1Formatted = Number(stats.pools.DIESEL_FRBTC.reserve1) / 1e8;
        const expectedTvl = reserve1Formatted * btcPrice.usd * 2;
        expect(Math.abs(tvlUsd - expectedTvl)).toBeLessThan(1); // Within $1
      }

      // Calculate TVL for DIESEL/bUSD
      if (stats.pools.DIESEL_BUSD) {
        const { tvlToken0, tvlToken1, tvlUsd } = calculatePoolTvl(
          stats.pools.DIESEL_BUSD.reserve0,
          stats.pools.DIESEL_BUSD.reserve1,
          8, // DIESEL decimals
          8, // bUSD decimals
          1  // bUSD is 1:1 with USD
        );

        console.log(`\nDIESEL/bUSD TVL:`);
        console.log(`  TVL in DIESEL: ${tvlToken0.toLocaleString()}`);
        console.log(`  TVL in bUSD: ${tvlToken1.toFixed(2)}`);
        console.log(`  TVL in USD: $${tvlUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}`);

        expect(tvlUsd).toBeGreaterThan(0);

        // Verify calculation: TVL = 2 * reserve1 * 1 (bUSD price)
        const reserve1Formatted = Number(stats.pools.DIESEL_BUSD.reserve1) / 1e8;
        const expectedTvl = reserve1Formatted * 2;
        expect(Math.abs(tvlUsd - expectedTvl)).toBeLessThan(1);
      }
    }, TEST_TIMEOUT);
  });

  describe("Market Cap Calculation", () => {
    it("should calculate market cap correctly", async () => {
      console.log("\n=== Market Cap Calculation Test ===\n");

      // Fetch all necessary data
      const [stats, btcPrice] = await Promise.all([
        fetchDieselStats(rpcConfig),
        fetchBitcoinPrice(priceConfig),
      ]);

      // Calculate DIESEL price from frBTC pool
      let dieselPriceBtc = 0;
      if (stats.pools.DIESEL_FRBTC) {
        dieselPriceBtc = calculatePrice(
          stats.pools.DIESEL_FRBTC.reserve0,
          stats.pools.DIESEL_FRBTC.reserve1,
          8, 8
        );
      }

      const dieselPriceUsd = dieselPriceBtc * btcPrice.usd;
      const totalSupplyFormatted = Number(stats.dieselTotalSupply) / 1e8;
      const marketCapUsd = totalSupplyFormatted * dieselPriceUsd;

      console.log(`DIESEL Price (BTC): ${dieselPriceBtc.toFixed(8)}`);
      console.log(`DIESEL Price (USD): $${dieselPriceUsd.toFixed(4)}`);
      console.log(`Total Supply: ${totalSupplyFormatted.toLocaleString()} DIESEL`);
      console.log(`Market Cap: $${marketCapUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}`);

      // Market cap should be positive and reasonable
      expect(marketCapUsd).toBeGreaterThan(0);

      // Verify the calculation
      const expectedMarketCap = totalSupplyFormatted * dieselPriceBtc * btcPrice.usd;
      expect(Math.abs(marketCapUsd - expectedMarketCap)).toBeLessThan(1);
    }, TEST_TIMEOUT);
  });

  describe("End-to-end Dashboard Stats", () => {
    it("should calculate all dashboard stats correctly", async () => {
      console.log("\n=== Complete Dashboard Stats ===\n");

      // Fetch all data via Lua script (single RPC call)
      const stats = await fetchDieselStats(rpcConfig);
      const btcPrice = await fetchBitcoinPrice(priceConfig);

      // Calculate prices
      const dieselFrbtcPrice = stats.pools.DIESEL_FRBTC
        ? calculatePrice(
            stats.pools.DIESEL_FRBTC.reserve0,
            stats.pools.DIESEL_FRBTC.reserve1,
            8, 8
          )
        : 0;

      const dieselBusdPrice = stats.pools.DIESEL_BUSD
        ? calculatePrice(
            stats.pools.DIESEL_BUSD.reserve0,
            stats.pools.DIESEL_BUSD.reserve1,
            8, 8
          )
        : 0;

      const dieselUsdPrice = dieselFrbtcPrice * btcPrice.usd;

      // Calculate TVL
      let totalTvlUsd = 0;
      if (stats.pools.DIESEL_FRBTC) {
        const { tvlUsd } = calculatePoolTvl(
          stats.pools.DIESEL_FRBTC.reserve0,
          stats.pools.DIESEL_FRBTC.reserve1,
          8, 8, btcPrice.usd
        );
        totalTvlUsd += tvlUsd;
      }
      if (stats.pools.DIESEL_BUSD) {
        const { tvlUsd } = calculatePoolTvl(
          stats.pools.DIESEL_BUSD.reserve0,
          stats.pools.DIESEL_BUSD.reserve1,
          8, 8, 1
        );
        totalTvlUsd += tvlUsd;
      }

      // Calculate market cap
      const totalSupplyFormatted = Number(stats.dieselTotalSupply) / 1e8;
      const marketCapUsd = totalSupplyFormatted * dieselUsdPrice;

      console.log(`=== DIESEL Token ===`);
      console.log(`  Price (frBTC): ${dieselFrbtcPrice.toFixed(8)}`);
      console.log(`  Price (bUSD):  ${dieselBusdPrice.toFixed(4)}`);
      console.log(`  Price (USD):   $${dieselUsdPrice.toFixed(4)}`);
      console.log(`  Total Supply:  ${totalSupplyFormatted.toLocaleString()}`);
      console.log(`  Market Cap:    $${marketCapUsd.toLocaleString(undefined, { maximumFractionDigits: 0 })}`);

      console.log(`\n=== TVL ===`);
      console.log(`  Total TVL:     $${totalTvlUsd.toLocaleString(undefined, { maximumFractionDigits: 0 })}`);

      console.log(`\n=== Network ===`);
      console.log(`  Block Height:  ${stats.height.toLocaleString()}`);
      console.log(`  BTC Price:     $${btcPrice.usd.toLocaleString()}`);

      // Verify all values are positive and reasonable
      expect(dieselFrbtcPrice).toBeGreaterThan(0);
      expect(dieselBusdPrice).toBeGreaterThan(0);
      expect(dieselUsdPrice).toBeGreaterThan(0);
      expect(totalSupplyFormatted).toBeGreaterThan(500000);
      expect(marketCapUsd).toBeGreaterThan(0);
      expect(totalTvlUsd).toBeGreaterThan(0);

      // Price consistency check: bUSD price should be close to USD price via frBTC
      const priceDiff = Math.abs(dieselBusdPrice - dieselUsdPrice);
      const percentDiff = (priceDiff / dieselBusdPrice) * 100;
      console.log(`\n=== Price Consistency ===`);
      console.log(`  bUSD vs frBTC->USD diff: ${percentDiff.toFixed(2)}%`);

      // Prices should be within 20% of each other (allowing for some arbitrage)
      expect(percentDiff).toBeLessThan(20);
    }, TEST_TIMEOUT);
  });
});

/**
 * Wallet Balance Integration Tests
 *
 * Tests the alkanes-web-sys bindings for:
 * - esploraGetAddressUtxo (BTC balance)
 * - alkanesByAddress (protorunes token balances)
 */
describe.skipIf(!runIntegration)("Live Wallet Balance Integration Tests", () => {
  // Test address with known balances
  const TEST_ADDRESS = "bc1puvfmy5whzdq35nd2trckkm09em9u7ps6lal564jz92c9feswwrpsr7ach5";

  describe("esplora_address::utxo", () => {
    it("should fetch UTXOs for address and calculate BTC balance", async () => {
      const rpcUrl = rpcConfig.rpcUrl || "https://mainnet.subfrost.io/v4/buildalkanes";

      const response = await fetch(rpcUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "esplora_address::utxo",
          params: [TEST_ADDRESS],
        }),
      });

      expect(response.ok).toBe(true);
      const json = await response.json();

      console.log("\n=== esplora_address::utxo Response ===");
      console.log(`Address: ${TEST_ADDRESS}`);

      expect(json.result).toBeDefined();
      expect(Array.isArray(json.result)).toBe(true);

      // Calculate total BTC balance
      let totalSats = 0;
      console.log(`\nUTXOs:`);
      for (const utxo of json.result) {
        console.log(`  ${utxo.txid}:${utxo.vout} - ${utxo.value} sats`);
        totalSats += utxo.value;
      }

      const btcBalance = totalSats / 100000000;
      console.log(`\nTotal: ${totalSats} sats (${btcBalance.toFixed(8)} BTC)`);

      expect(totalSats).toBeGreaterThan(0);
      expect(json.result.length).toBeGreaterThan(0);

      // Verify UTXO structure
      for (const utxo of json.result) {
        expect(utxo.txid).toBeDefined();
        expect(typeof utxo.txid).toBe("string");
        expect(utxo.vout).toBeDefined();
        expect(typeof utxo.vout).toBe("number");
        expect(utxo.value).toBeDefined();
        expect(typeof utxo.value).toBe("number");
      }
    }, TEST_TIMEOUT);
  });

  describe("protorunesbyaddress (via metashrew_view)", () => {
    it("should fetch alkane token balances for address", async () => {
      const rpcUrl = rpcConfig.rpcUrl || "https://mainnet.subfrost.io/v4/buildalkanes";

      // Build the protobuf payload (same format as alkanes-cli)
      // Structure: field 1 (0a) = address string, field 2 (12) = protocol tag (u128 = 1)
      const addressHex = Buffer.from(TEST_ADDRESS, "utf8").toString("hex");
      const addressLen = (addressHex.length / 2).toString(16).padStart(2, "0");
      // Direct format without extra wrapping: 0a + len + address + 12020801
      const payload = `0x0a${addressLen}${addressHex}12020801`;

      console.log("\n=== protorunesbyaddress Request ===");
      console.log(`Address: ${TEST_ADDRESS}`);
      console.log(`Payload: ${payload}`);

      const response = await fetch(rpcUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "metashrew_view",
          params: ["protorunesbyaddress", payload, "latest"],
        }),
      });

      expect(response.ok).toBe(true);
      const json = await response.json();

      console.log("\n=== protorunesbyaddress Response ===");
      expect(json.result).toBeDefined();
      expect(typeof json.result).toBe("string");

      // The response should not be empty for this address
      expect(json.result).not.toBe("0x");
      expect(json.result.length).toBeGreaterThan(4);

      console.log(`Response length: ${json.result.length} chars`);
      console.log(`Response (first 200 chars): ${json.result.slice(0, 200)}...`);

      // The CLI shows this address has:
      // - DIESEL (2:0): 444121520576 (~4441.21 DIESEL)
      // - bUSD (2:56801): 2
      // - DIESEL/bUSD LP (2:68441): 21794010852
      // - DIESEL/frBTC LP (2:77087): 487503109
      // - alkanes-Domains-3 (2:25474): 1

      // Verify the response contains expected rune ID markers
      // Block 2 encoded as varint: 0802
      expect(json.result).toContain("0802");
    }, TEST_TIMEOUT);
  });

  describe("AlkanesProvider SDK", () => {
    it("should use SDK to get UTXOs and alkane balances", async () => {
      // Dynamic import to avoid WASM issues in test environment
      const { AlkanesProvider } = await import("@alkanes/ts-sdk");

      const provider = new AlkanesProvider({
        network: "mainnet",
        rpcUrl: "https://mainnet.subfrost.io/v4/buildalkanes"
      });

      console.log("\n=== Provider config ===");
      console.log(`rpcUrl: ${provider.rpcUrl}`);

      await provider.initialize();

      console.log("\n=== AlkanesProvider.esplora.getAddressUtxos ===");
      const utxos = await provider.esplora.getAddressUtxos(TEST_ADDRESS);

      console.log("UTXOs response:", JSON.stringify(utxos, null, 2).slice(0, 500));

      expect(Array.isArray(utxos)).toBe(true);
      expect(utxos.length).toBeGreaterThan(0);

      let totalSats = 0;
      for (const utxo of utxos) {
        totalSats += utxo.value || 0;
      }
      console.log(`BTC Balance: ${totalSats} sats (${(totalSats / 1e8).toFixed(8)} BTC)`);

      console.log("\n=== AlkanesProvider.alkanes.getByAddress ===");
      const alkanesData = await provider.alkanes.getByAddress(TEST_ADDRESS, undefined, 1);

      console.log("Alkanes response:", JSON.stringify(alkanesData, null, 2).slice(0, 2000));

      expect(alkanesData).toBeDefined();

      // The SDK should decode the protobuf and give us structured data
      if (alkanesData && Array.isArray(alkanesData)) {
        console.log(`\nFound ${alkanesData.length} balance entries`);
        for (const entry of alkanesData) {
          console.log("Entry:", JSON.stringify(entry, null, 2));
        }
      } else if (alkanesData && alkanesData.outpoints) {
        console.log(`\nFound ${alkanesData.outpoints.length} outpoints with alkane balances`);

        for (const outpoint of alkanesData.outpoints) {
          console.log(`\nOutpoint: ${outpoint.outpoint?.txid || "unknown"}:${outpoint.outpoint?.vout || 0}`);
          if (outpoint.balance_sheet && outpoint.balance_sheet.balances) {
            for (const [runeId, balance] of Object.entries(outpoint.balance_sheet.balances)) {
              const formattedBalance = Number(balance) / 1e8;
              console.log(`  ${runeId}: ${balance} (${formattedBalance.toFixed(8)})`);
            }
          }
        }
      }
    }, TEST_TIMEOUT);

    it("should get alkane token balance using getBalance", async () => {
      const { AlkanesProvider } = await import("@alkanes/ts-sdk");

      const provider = new AlkanesProvider({
        network: "mainnet",
        rpcUrl: "https://mainnet.subfrost.io/v4/buildalkanes"
      });
      await provider.initialize();

      console.log("\n=== AlkanesProvider.alkanes.getBalance ===");

      // Get all alkane balances using the alkanes.getBalance method
      const balances = await provider.alkanes.getBalance(TEST_ADDRESS);

      console.log("All balances:", JSON.stringify(balances, null, 2));

      expect(balances).toBeDefined();

      // Check if it's an array or object and log accordingly
      if (Array.isArray(balances)) {
        console.log(`\nFound ${balances.length} token balances`);

        // Look for DIESEL (2:0)
        const dieselBalance = balances.find(
          (b: { id?: { block: number; tx: number } }) => b.id?.block === 2 && b.id?.tx === 0
        );

        if (dieselBalance) {
          console.log(`\nDIESEL balance found:`, dieselBalance);
        }

        // Look for LP tokens
        const lpBalances = balances.filter(
          (b: { id?: { block: number; tx: number } }) =>
            b.id?.block === 2 && (b.id?.tx === 68441 || b.id?.tx === 77087)
        );

        if (lpBalances.length > 0) {
          console.log(`\nLP token balances:`, lpBalances);
        }
      }
    }, TEST_TIMEOUT);
  });
});

/**
 * Concurrent Access Tests
 *
 * These tests verify that the AlkanesProvider handles concurrent requests correctly.
 * The WASM WebProvider is not thread-safe, so we need to either:
 * 1. Create a fresh provider for each request (current fix in alkanes-client.ts)
 * 2. Or serialize access to the provider
 *
 * The "recursive use of an object detected" error occurs when the same
 * WebProvider instance is accessed concurrently.
 */
describe.skipIf(!runIntegration)("Concurrent Access Tests", () => {
  const TEST_ADDRESS = "bc1puvfmy5whzdq35nd2trckkm09em9u7ps6lal564jz92c9feswwrpsr7ach5";

  describe("Shared provider concurrent access (should fail with singleton)", () => {
    it("should handle concurrent requests with shared provider", async () => {
      const { AlkanesProvider } = await import("@alkanes/ts-sdk");

      // Create a SINGLE provider instance (simulating singleton pattern)
      const provider = new AlkanesProvider({
        network: "mainnet",
        rpcUrl: "https://mainnet.subfrost.io/v4/buildalkanes"
      });
      await provider.initialize();

      console.log("\n=== Testing concurrent access with SHARED provider ===");

      // Make 5 concurrent requests using the SAME provider
      const promises = Array(5).fill(null).map(async (_, i) => {
        try {
          console.log(`Request ${i + 1}: starting...`);
          const start = Date.now();
          const utxos = await provider.esplora.getAddressUtxos(TEST_ADDRESS);
          const elapsed = Date.now() - start;
          console.log(`Request ${i + 1}: completed in ${elapsed}ms, got ${utxos.length} UTXOs`);
          return { success: true, index: i + 1, utxos: utxos.length };
        } catch (error: any) {
          console.log(`Request ${i + 1}: FAILED - ${error.message}`);
          return { success: false, index: i + 1, error: error.message };
        }
      });

      const results = await Promise.all(promises);

      // Log summary
      const successes = results.filter(r => r.success);
      const failures = results.filter(r => !r.success);

      console.log(`\nResults: ${successes.length} succeeded, ${failures.length} failed`);

      if (failures.length > 0) {
        console.log("Failures:");
        for (const f of failures) {
          console.log(`  Request ${f.index}: ${f.error}`);
        }
      }

      // With the singleton pattern, we expect some failures due to WASM threading issues
      // This test documents the expected behavior
      expect(results.length).toBe(5);
    }, TEST_TIMEOUT);
  });

  describe("Fresh provider per request (should succeed)", () => {
    it("should handle concurrent requests with fresh providers", async () => {
      const { AlkanesProvider } = await import("@alkanes/ts-sdk");

      console.log("\n=== Testing concurrent access with FRESH providers ===");

      // Make 5 concurrent requests, each with its OWN provider
      const promises = Array(5).fill(null).map(async (_, i) => {
        try {
          console.log(`Request ${i + 1}: creating fresh provider...`);
          const provider = new AlkanesProvider({
            network: "mainnet",
            rpcUrl: "https://mainnet.subfrost.io/v4/buildalkanes"
          });
          await provider.initialize();

          const start = Date.now();
          const utxos = await provider.esplora.getAddressUtxos(TEST_ADDRESS);
          const elapsed = Date.now() - start;
          console.log(`Request ${i + 1}: completed in ${elapsed}ms, got ${utxos.length} UTXOs`);
          return { success: true, index: i + 1, utxos: utxos.length };
        } catch (error: any) {
          console.log(`Request ${i + 1}: FAILED - ${error.message}`);
          return { success: false, index: i + 1, error: error.message };
        }
      });

      const results = await Promise.all(promises);

      // Log summary
      const successes = results.filter(r => r.success);
      const failures = results.filter(r => !r.success);

      console.log(`\nResults: ${successes.length} succeeded, ${failures.length} failed`);

      // With fresh providers, all requests should succeed
      expect(successes.length).toBe(5);
      expect(failures.length).toBe(0);
    }, TEST_TIMEOUT);
  });

  describe("alkanesClient concurrent access", () => {
    it("should handle concurrent requests via alkanesClient", async () => {
      // This tests the actual fix in alkanes-client.ts
      const { alkanesClient } = await import("@/lib/alkanes-client");

      console.log("\n=== Testing concurrent access via alkanesClient ===");

      // Make 5 concurrent requests using alkanesClient
      const promises = Array(5).fill(null).map(async (_, i) => {
        try {
          console.log(`Request ${i + 1}: starting...`);
          const start = Date.now();
          const height = await alkanesClient.getCurrentHeight();
          const elapsed = Date.now() - start;
          console.log(`Request ${i + 1}: completed in ${elapsed}ms, height=${height}`);
          return { success: true, index: i + 1, height };
        } catch (error: any) {
          console.log(`Request ${i + 1}: FAILED - ${error.message}`);
          return { success: false, index: i + 1, error: error.message };
        }
      });

      const results = await Promise.all(promises);

      // Log summary
      const successes = results.filter(r => r.success);
      const failures = results.filter(r => !r.success);

      console.log(`\nResults: ${successes.length} succeeded, ${failures.length} failed`);

      if (failures.length > 0) {
        console.log("Failures:");
        for (const f of failures) {
          console.log(`  Request ${f.index}: ${f.error}`);
        }
      }

      // After our fix, all requests should succeed
      expect(successes.length).toBe(5);
      expect(failures.length).toBe(0);
    }, TEST_TIMEOUT);
  });
});
