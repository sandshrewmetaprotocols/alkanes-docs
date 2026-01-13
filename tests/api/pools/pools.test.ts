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

// Import after setting up mocks
import { GET } from "@/app/api/pools/route";

// Helper to create mock cache response for pool price
function createMockPoolPrice(poolId: string, poolName: string, price: number, reserve0: string, reserve1: string) {
  return {
    poolId,
    poolName,
    price,
    priceInverse: 1 / price,
    reserve0,
    reserve1,
    blockHeight: 927483,
    timestamp: Date.now(),
  };
}

describe("GET /api/pools", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCacheGet.mockResolvedValue(null);
    mockCacheSet.mockResolvedValue(undefined);
  });

  describe("fetching all pools", () => {
    it("returns data for all pools when pool=all (using cache)", async () => {
      // Use cache to simplify test - mock cache hits for pool prices
      mockCacheGet
        .mockResolvedValueOnce(createMockPoolPrice("2:77087", "DIESEL/frBTC", 0.0000428, "273556314005", "11708493"))
        .mockResolvedValueOnce(createMockPoolPrice("2:68441", "DIESEL/bUSD", 4.24, "381720542218", "1618497433262"))
        .mockResolvedValueOnce(927483); // block height cache

      const request = new NextRequest("http://localhost/api/pools?pool=all");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.currentHeight).toBe(927483);
      expect(data.data.pools.DIESEL_FRBTC).toBeDefined();
      expect(data.data.pools.DIESEL_BUSD).toBeDefined();
      expect(data.data.pools.DIESEL_FRBTC.poolName).toBe("DIESEL/frBTC");
      expect(data.data.pools.DIESEL_BUSD.poolName).toBe("DIESEL/bUSD");
    });

    it("returns data for all pools when no pool param specified", async () => {
      // Use cache to simplify test
      mockCacheGet
        .mockResolvedValueOnce(createMockPoolPrice("2:77087", "DIESEL/frBTC", 0.0000428, "273556314005", "11708493"))
        .mockResolvedValueOnce(createMockPoolPrice("2:68441", "DIESEL/bUSD", 4.24, "381720542218", "1618497433262"))
        .mockResolvedValueOnce(927483);

      const request = new NextRequest("http://localhost/api/pools");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.pools).toBeDefined();
    });

    // Skipped: This test mocks fetch() but the code now uses alkanes-web-sys SDK via WASM.
    // Fresh data fetching is covered by integration tests (LIVE_RPC_TEST=true pnpm vitest)
    it.skip("fetches fresh data when cache misses", async () => {
      // Mock cache misses and fetch responses
      // The order is complex due to parallel calls - use mockImplementation for flexibility
      mockFetch.mockImplementation(async (_url: string, opts?: RequestInit) => {
        const body = opts?.body ? JSON.parse(opts.body as string) : null;

        // RPC call for block height
        if (body?.method === 'metashrew_height') {
          return {
            ok: true,
            json: async () => ({ jsonrpc: "2.0", result: "927483", id: 1 }),
          };
        }

        // Lua script calls for pools
        if (body?.method === 'lua_evalscript') {
          // Check which pool is being queried based on the payload
          const params = body?.params || [];
          const luaArgs = params[1] || [];
          const poolPayload = luaArgs[0] || '';

          if (poolPayload.includes('9fda04')) {
            // DIESEL_FRBTC pool
            return {
              ok: true,
              json: async () => ({
                jsonrpc: "2.0",
                result: {
                  calls: 3,
                  returns: {
                    data_points: [{
                      height: 927483,
                      timestamp: 1702000000,
                      reserve_a: 273556314005,
                      reserve_b: 11708493,
                      total_supply: 500000000,
                    }],
                    count: 1,
                  },
                  runtime: 50,
                },
                id: 1,
              }),
            };
          }
          if (poolPayload.includes('d99604')) {
            // DIESEL_BUSD pool
            return {
              ok: true,
              json: async () => ({
                jsonrpc: "2.0",
                result: {
                  calls: 3,
                  returns: {
                    data_points: [{
                      height: 927483,
                      timestamp: 1702000000,
                      reserve_a: 381720542218,
                      reserve_b: 1618497433262,
                      total_supply: 690109549844,
                    }],
                    count: 1,
                  },
                  runtime: 50,
                },
                id: 1,
              }),
            };
          }
        }

        // Default fallback
        return { ok: false, status: 404 };
      });

      const request = new NextRequest("http://localhost/api/pools?pool=all");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.pools.DIESEL_FRBTC).toBeDefined();
      expect(data.data.pools.DIESEL_BUSD).toBeDefined();
    });
  });

  describe("fetching single pool", () => {
    it("returns price data for DIESEL_FRBTC pool (cached)", async () => {
      // Use cache for simplicity
      mockCacheGet.mockResolvedValueOnce(
        createMockPoolPrice("2:77087", "DIESEL/frBTC", 0.0000428, "273556314005", "11708493")
      );

      const request = new NextRequest(
        "http://localhost/api/pools?pool=DIESEL_FRBTC"
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.poolId).toBe("2:77087");
      expect(data.data.poolName).toBe("DIESEL/frBTC");
      expect(data.data.price).toBeDefined();
      expect(data.data.priceInverse).toBeDefined();
      expect(data.data.reserve0).toBeDefined();
      expect(data.data.reserve1).toBeDefined();
    });

    it("returns price data for DIESEL_BUSD pool (cached)", async () => {
      mockCacheGet.mockResolvedValueOnce(
        createMockPoolPrice("2:68441", "DIESEL/bUSD", 4.24, "381720542218", "1618497433262")
      );

      const request = new NextRequest(
        "http://localhost/api/pools?pool=DIESEL_BUSD"
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.poolId).toBe("2:68441");
      expect(data.data.poolName).toBe("DIESEL/bUSD");
      expect(typeof data.data.price).toBe("number");
      expect(data.data.price).toBeGreaterThan(0);
    });

    // Skipped: This test mocks fetch() but the code now uses alkanes-web-sys SDK via WASM.
    // Fresh data fetching is covered by integration tests (LIVE_RPC_TEST=true pnpm vitest)
    it.skip("fetches fresh price data for single pool", async () => {
      mockFetch.mockImplementation(async (_url: string, opts?: RequestInit) => {
        const body = opts?.body ? JSON.parse(opts.body as string) : null;

        if (body?.method === 'metashrew_height') {
          return {
            ok: true,
            json: async () => ({ jsonrpc: "2.0", result: "927483", id: 1 }),
          };
        }

        // Mock lua_evalscript for pool data via Lua script
        if (body?.method === 'lua_evalscript') {
          return {
            ok: true,
            json: async () => ({
              jsonrpc: "2.0",
              result: {
                calls: 3,
                returns: {
                  data_points: [{
                    height: 927483,
                    timestamp: 1702000000,
                    reserve_a: 273556314005,
                    reserve_b: 11708493,
                    total_supply: 500000000,
                  }],
                  count: 1,
                },
                runtime: 50,
              },
              id: 1,
            }),
          };
        }

        return { ok: false, status: 404 };
      });

      const request = new NextRequest(
        "http://localhost/api/pools?pool=DIESEL_FRBTC"
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.poolId).toBe("2:77087");
      expect(data.data.poolName).toBe("DIESEL/frBTC");
    });

    it("returns 400 for invalid pool name", async () => {
      const request = new NextRequest(
        "http://localhost/api/pools?pool=INVALID_POOL"
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain("Invalid pool");
    });
  });

  describe("fetching at specific height", () => {
    // Skipped: This test mocks fetch() but the code now uses alkanes-web-sys SDK via WASM.
    // Historical data fetching is covered by integration tests (LIVE_RPC_TEST=true pnpm vitest)
    it.skip("returns reserves at specific height", async () => {
      mockFetch.mockImplementation(async (_url: string, opts?: RequestInit) => {
        const body = opts?.body ? JSON.parse(opts.body as string) : null;

        if (body?.method === 'metashrew_height') {
          return {
            ok: true,
            json: async () => ({ jsonrpc: "2.0", result: "927483", id: 1 }),
          };
        }

        // Mock lua_evalscript for pool data via Lua script
        if (body?.method === 'lua_evalscript') {
          return {
            ok: true,
            json: async () => ({
              jsonrpc: "2.0",
              result: {
                calls: 3,
                returns: {
                  data_points: [{
                    height: 927000,
                    timestamp: 1702000000,
                    reserve_a: 273556314005,
                    reserve_b: 11708493,
                    total_supply: 500000000,
                  }],
                  count: 1,
                },
                runtime: 50,
              },
              id: 1,
            }),
          };
        }

        return { ok: false, status: 404 };
      });

      const request = new NextRequest(
        "http://localhost/api/pools?pool=DIESEL_FRBTC&height=927000"
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.reserve0).toBeDefined();
      expect(data.data.reserve1).toBeDefined();
      expect(data.data.totalSupply).toBeDefined();
    });
  });

  describe("error handling", () => {
    it("returns 500 when RPC returns HTTP error", async () => {
      mockFetch.mockImplementation(async () => ({
        ok: false,
        status: 500,
      }));

      const request = new NextRequest(
        "http://localhost/api/pools?pool=DIESEL_FRBTC"
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBeDefined();
    });

    it("returns 500 when fetch throws network error", async () => {
      mockFetch.mockRejectedValue(new Error("Network error"));

      const request = new NextRequest(
        "http://localhost/api/pools?pool=DIESEL_FRBTC"
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
    });

    it("returns 500 when RPC returns error response", async () => {
      mockFetch.mockImplementation(async (_url: string, opts?: RequestInit) => {
        const body = opts?.body ? JSON.parse(opts.body as string) : null;

        if (body?.method === 'metashrew_height') {
          return {
            ok: true,
            json: async () => ({ jsonrpc: "2.0", error: { message: "RPC unavailable" }, id: 1 }),
          };
        }

        // For lua_evalscript, return an error too
        if (body?.method === 'lua_evalscript') {
          return {
            ok: true,
            json: async () => ({ jsonrpc: "2.0", error: { message: "RPC unavailable" }, id: 1 }),
          };
        }

        return { ok: false, status: 404 };
      });

      const request = new NextRequest(
        "http://localhost/api/pools?pool=DIESEL_FRBTC"
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      // Error can be either RPC error or "Failed to fetch pool reserves"
      expect(data.error).toBeDefined();
    });
  });

  describe("caching behavior", () => {
    it("uses cached data when available and skips fetch", async () => {
      // Return cached price data
      mockCacheGet.mockResolvedValueOnce(
        createMockPoolPrice("2:77087", "DIESEL/frBTC", 0.0000428, "273556314005", "11708493")
      );

      const request = new NextRequest(
        "http://localhost/api/pools?pool=DIESEL_FRBTC"
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.poolId).toBe("2:77087");
      // When cache is hit, fetch should not be called for pool data
      expect(mockFetch).not.toHaveBeenCalled();
    });

    // Skipped: This test mocks fetch() but the code now uses alkanes-web-sys SDK via WASM.
    // Cache behavior with fresh data is covered by integration tests (LIVE_RPC_TEST=true pnpm vitest)
    it.skip("stores fetched data in cache", async () => {
      mockFetch.mockImplementation(async (_url: string, opts?: RequestInit) => {
        const body = opts?.body ? JSON.parse(opts.body as string) : null;

        if (body?.method === 'metashrew_height') {
          return {
            ok: true,
            json: async () => ({ jsonrpc: "2.0", result: "927483", id: 1 }),
          };
        }

        // Mock lua_evalscript for pool data via Lua script
        if (body?.method === 'lua_evalscript') {
          return {
            ok: true,
            json: async () => ({
              jsonrpc: "2.0",
              result: {
                calls: 3,
                returns: {
                  data_points: [{
                    height: 927483,
                    timestamp: 1702000000,
                    reserve_a: 273556314005,
                    reserve_b: 11708493,
                    total_supply: 500000000,
                  }],
                  count: 1,
                },
                runtime: 50,
              },
              id: 1,
            }),
          };
        }

        return { ok: false, status: 404 };
      });

      const request = new NextRequest(
        "http://localhost/api/pools?pool=DIESEL_FRBTC"
      );
      await GET(request);

      // Verify cache was called with appropriate data
      expect(mockCacheSet).toHaveBeenCalled();
    });
  });

  describe("response structure", () => {
    it("serializes BigInt reserves as strings", async () => {
      mockCacheGet.mockResolvedValueOnce(
        createMockPoolPrice("2:77087", "DIESEL/frBTC", 0.0000428, "273556314005", "11708493")
      );

      const request = new NextRequest(
        "http://localhost/api/pools?pool=DIESEL_FRBTC"
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(typeof data.data.reserve0).toBe("string");
      expect(typeof data.data.reserve1).toBe("string");
    });

    it("includes all expected fields in pool response", async () => {
      mockCacheGet.mockResolvedValueOnce(
        createMockPoolPrice("2:77087", "DIESEL/frBTC", 0.0000428, "273556314005", "11708493")
      );

      const request = new NextRequest(
        "http://localhost/api/pools?pool=DIESEL_FRBTC"
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toMatchObject({
        success: true,
        data: {
          poolId: expect.any(String),
          poolName: expect.any(String),
          price: expect.any(Number),
          priceInverse: expect.any(Number),
          reserve0: expect.any(String),
          reserve1: expect.any(String),
          blockHeight: expect.any(Number),
        },
      });
    });
  });
});
