import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// Create hoisted mocks
const { mockCacheGet, mockCacheSet, mockFetch } = vi.hoisted(() => ({
  mockCacheGet: vi.fn(),
  mockCacheSet: vi.fn(),
  mockFetch: vi.fn(),
}));

// Mock fetch globally before imports
global.fetch = mockFetch;

// Mock Redis cache
vi.mock("@/lib/redis", () => ({
  cacheGet: mockCacheGet,
  cacheSet: mockCacheSet,
  cacheDel: vi.fn().mockResolvedValue(undefined),
}));

// We need to re-import the module for each test to reset the in-memory cache
let GET: typeof import("@/app/api/pools/candles/route").GET;

// Helper to create mock responses for alkanes_simulate (pool details)
function createMockPoolDetailsResponse(reserve0: string, reserve1: string, totalSupply: string) {
  const hexPadLE = (val: string, bytes: number) => {
    const num = BigInt(val);
    const hex = num.toString(16).padStart(bytes * 2, '0');
    let reversed = '';
    for (let i = hex.length - 2; i >= 0; i -= 2) {
      reversed += hex.slice(i, i + 2);
    }
    return reversed;
  };

  const tokenA = hexPadLE('2', 16) + hexPadLE('0', 16);
  const tokenB = hexPadLE('32', 16) + hexPadLE('0', 16);
  const reserveAHex = hexPadLE(reserve0, 16);
  const reserveBHex = hexPadLE(reserve1, 16);
  const totalSupplyHex = hexPadLE(totalSupply, 16);
  const nameBytes = Buffer.from('DIESEL / frBTC LP');
  const nameLenHex = nameBytes.length.toString(16).padStart(8, '0').match(/.{2}/g)!.reverse().join('');
  const nameHex = nameBytes.toString('hex');

  return '0x' + tokenA + tokenB + reserveAHex + reserveBHex + totalSupplyHex + nameLenHex + nameHex;
}

// Helper to setup standard mocks for candle tests
function setupCandleMocks(reserve0 = "273556314005", reserve1 = "11708493", totalSupply = "500000000") {
  mockFetch.mockImplementation(async (_url: string, opts?: RequestInit) => {
    const body = opts?.body ? JSON.parse(opts.body as string) : null;

    if (body?.method === 'metashrew_height') {
      return {
        ok: true,
        json: async () => ({ jsonrpc: "2.0", result: "927483", id: 1 }),
      };
    }

    if (body?.method === 'lua_evalscript') {
      // Generate multiple data points for candle building
      const startHeight = 925000;
      const dataPoints = [];
      for (let i = 0; i < 10; i++) {
        dataPoints.push({
          height: startHeight + i * 144,
          timestamp: 1702000000 + i * 86400,
          reserve_a: parseInt(reserve0) + i * 1000000,
          reserve_b: parseInt(reserve1) + i * 1000,
          total_supply: parseInt(totalSupply),
        });
      }

      return {
        ok: true,
        json: async () => ({
          jsonrpc: "2.0",
          result: {
            calls: dataPoints.length * 2,
            returns: {
              data_points: dataPoints,
              count: dataPoints.length,
            },
            runtime: 100,
          },
          id: 1,
        }),
      };
    }

    if (body?.method === 'alkanes_simulate') {
      return {
        ok: true,
        json: async () => ({
          jsonrpc: "2.0",
          result: {
            execution: {
              data: createMockPoolDetailsResponse(reserve0, reserve1, totalSupply),
            },
          },
          id: 1,
        }),
      };
    }

    return {
      ok: true,
      json: async () => ({
        reserve_a: reserve0,
        reserve_b: reserve1,
        total_supply: totalSupply,
        pool_name: "DIESEL / frBTC LP",
      }),
    };
  });
}

describe("GET /api/pools/candles", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    mockCacheGet.mockResolvedValue(null);
    mockCacheSet.mockResolvedValue(undefined);
    vi.resetModules();
    const module = await import("@/app/api/pools/candles/route");
    GET = module.GET;
  });

  describe("parameter validation", () => {
    it("returns 400 when pool parameter is missing", async () => {
      const request = new NextRequest("http://localhost/api/pools/candles");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain("Pool parameter is required");
    });

    it("returns 400 for invalid pool name", async () => {
      const request = new NextRequest(
        "http://localhost/api/pools/candles?pool=INVALID_POOL"
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain("Invalid pool");
    });
  });

  // Skipped: These tests mock fetch() but the code now uses alkanes-web-sys SDK via WASM.
  // Candle data fetching is covered by integration tests (LIVE_RPC_TEST=true pnpm vitest)
  describe.skip("fetching candle data", () => {
    it("returns candle data for DIESEL_FRBTC pool with daily interval", async () => {
      setupCandleMocks("273556314005", "11708493", "500000000");

      const request = new NextRequest(
        "http://localhost/api/pools/candles?pool=DIESEL_FRBTC"
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.pool).toBe("DIESEL/frBTC");
      expect(data.data.interval).toBe("daily");
      expect(data.data.candles).toBeDefined();
      expect(Array.isArray(data.data.candles)).toBe(true);
    });

    it("returns candle data for DIESEL_BUSD pool", async () => {
      setupCandleMocks("381720542218", "1618497433262", "690109549844");

      const request = new NextRequest(
        "http://localhost/api/pools/candles?pool=DIESEL_BUSD"
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.pool).toBe("DIESEL/bUSD");
    });
  });

  // Skipped: These tests mock fetch() but the code now uses alkanes-web-sys SDK via WASM.
  // Interval, limit, and response structure tests are covered by integration tests.
  describe.skip("interval parameter", () => {
    it("accepts hourly interval", async () => {
      setupCandleMocks();

      const request = new NextRequest(
        "http://localhost/api/pools/candles?pool=DIESEL_FRBTC&interval=hourly"
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.interval).toBe("hourly");
    });

    it("accepts weekly interval", async () => {
      setupCandleMocks();

      const request = new NextRequest(
        "http://localhost/api/pools/candles?pool=DIESEL_FRBTC&interval=weekly"
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.interval).toBe("weekly");
    });

    it("defaults to daily interval when not specified", async () => {
      setupCandleMocks();

      const request = new NextRequest(
        "http://localhost/api/pools/candles?pool=DIESEL_FRBTC"
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.interval).toBe("daily");
    });
  });

  // Skipped: These tests mock fetch() but the code now uses alkanes-web-sys SDK via WASM.
  describe.skip("limit parameter", () => {
    it("accepts limit parameter", async () => {
      setupCandleMocks();

      const request = new NextRequest(
        "http://localhost/api/pools/candles?pool=DIESEL_FRBTC&limit=10"
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.candles.length).toBeLessThanOrEqual(10);
    });

    it("defaults to 30 candles when limit not specified", async () => {
      setupCandleMocks();

      const request = new NextRequest(
        "http://localhost/api/pools/candles?pool=DIESEL_FRBTC"
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.candles.length).toBeLessThanOrEqual(30);
    });

    it("caps limit at 100", async () => {
      setupCandleMocks();

      const request = new NextRequest(
        "http://localhost/api/pools/candles?pool=DIESEL_FRBTC&limit=200"
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.candles.length).toBeLessThanOrEqual(100);
    });
  });

  // Skipped: These tests mock fetch() but the code now uses alkanes-web-sys SDK via WASM.
  describe.skip("response structure", () => {
    it("returns proper candle data structure", async () => {
      setupCandleMocks();

      const request = new NextRequest(
        "http://localhost/api/pools/candles?pool=DIESEL_FRBTC"
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toMatchObject({
        pool: expect.any(String),
        poolId: expect.any(String),
        interval: expect.any(String),
        currentHeight: expect.any(Number),
        candles: expect.any(Array),
      });

      if (data.data.candles.length > 0) {
        const candle = data.data.candles[0];
        expect(candle).toMatchObject({
          timestamp: expect.any(Number),
          open: expect.any(Number),
          high: expect.any(Number),
          low: expect.any(Number),
          close: expect.any(Number),
        });
      }
    });

    it("includes currentHeight in response", async () => {
      setupCandleMocks();

      const request = new NextRequest(
        "http://localhost/api/pools/candles?pool=DIESEL_FRBTC"
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.currentHeight).toBe(927483);
    });
  });

  // Skipped: These tests mock fetch() but the code now uses alkanes-web-sys SDK via WASM.
  // Error handling is covered by integration tests (LIVE_RPC_TEST=true pnpm vitest)
  describe.skip("error handling", () => {
    it("returns 500 when block height RPC fails with error response", async () => {
      mockFetch.mockImplementation(async (_url: string, opts?: RequestInit) => {
        const body = opts?.body ? JSON.parse(opts.body as string) : null;

        if (body?.method === 'metashrew_height') {
          return {
            ok: true,
            json: async () => ({ jsonrpc: "2.0", error: { message: "RPC error" }, id: 1 }),
          };
        }

        return { ok: false, status: 500 };
      });

      const request = new NextRequest(
        "http://localhost/api/pools/candles?pool=DIESEL_FRBTC"
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toContain("RPC error");
    });

    it("returns 500 when block height HTTP request fails", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
      });

      const request = new NextRequest(
        "http://localhost/api/pools/candles?pool=DIESEL_FRBTC"
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBeDefined();
    });

    // Skipped: This test mocks fetch() but the code now uses alkanes-web-sys SDK via WASM.
    // Error handling is covered by integration tests (LIVE_RPC_TEST=true pnpm vitest)
    it.skip("returns 500 when fetch throws an error", async () => {
      mockFetch.mockRejectedValue(new Error("Network error"));

      const request = new NextRequest(
        "http://localhost/api/pools/candles?pool=DIESEL_FRBTC"
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Network error");
    });
  });

  describe("caching behavior", () => {
    // Skipped: This test mocks fetch() but the code now uses alkanes-web-sys SDK via WASM.
    // Fresh data fetching is covered by integration tests (LIVE_RPC_TEST=true pnpm vitest)
    it.skip("returns non-cached response on first request", async () => {
      setupCandleMocks();

      const request = new NextRequest(
        "http://localhost/api/pools/candles?pool=DIESEL_FRBTC"
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.cached).toBe(false);
    });

    // Skipped: This test mocks fetch() but the code now uses alkanes-web-sys SDK via WASM.
    // Caching behavior is covered by integration tests (LIVE_RPC_TEST=true pnpm vitest)
    it.skip("returns cached response on subsequent requests", async () => {
      setupCandleMocks();

      const request1 = new NextRequest(
        "http://localhost/api/pools/candles?pool=DIESEL_FRBTC"
      );
      const response1 = await GET(request1);
      const data1 = await response1.json();
      expect(data1.cached).toBe(false);

      const request2 = new NextRequest(
        "http://localhost/api/pools/candles?pool=DIESEL_FRBTC"
      );
      const response2 = await GET(request2);
      const data2 = await response2.json();

      expect(response2.status).toBe(200);
      expect(data2.success).toBe(true);
      expect(data2.cached).toBe(true);
    });
  });
});
