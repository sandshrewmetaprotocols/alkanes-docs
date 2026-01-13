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
import { GET } from "@/app/api/pools/volume/route";

// Helper to create mock volume response
function createMockVolumeData(poolId: string, poolName: string, volume: number) {
  return {
    poolId,
    poolName,
    volume24h: volume,
    volume24hUsd: volume * 100000, // Mock USD conversion
    startHeight: 927339,
    endHeight: 927483,
    timestamp: Date.now(),
  };
}

// Helper to setup standard mocks for volume tests
function setupVolumeMocks() {
  mockFetch.mockImplementation(async (_url: string, opts?: RequestInit) => {
    const body = opts?.body ? JSON.parse(opts.body as string) : null;

    if (body?.method === 'metashrew_height') {
      return {
        ok: true,
        json: async () => ({ jsonrpc: "2.0", result: "927483", id: 1 }),
      };
    }

    // Mock lua_evalscript for pool data (used by estimate24hVolume)
    if (body?.method === 'lua_evalscript') {
      // Return two data points for volume calculation
      const startHeight = 927339;
      const endHeight = 927483;

      return {
        ok: true,
        json: async () => ({
          jsonrpc: "2.0",
          result: {
            calls: 2,
            returns: {
              data_points: [
                {
                  height: startHeight,
                  timestamp: 1702000000,
                  reserve_a: 273556314005,
                  reserve_b: 11708493,
                  total_supply: 500000000,
                },
                {
                  height: endHeight,
                  timestamp: 1702086400,
                  reserve_a: 273656314005, // Slightly higher (fee accumulation)
                  reserve_b: 11718493,
                  total_supply: 500000000,
                },
              ],
              count: 2,
            },
            runtime: 100,
          },
          id: 1,
        }),
      };
    }

    return { ok: false, status: 404 };
  });
}

describe("GET /api/pools/volume", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCacheGet.mockResolvedValue(null);
    mockCacheSet.mockResolvedValue(undefined);
  });

  describe("fetching all pool volumes", () => {
    it("returns volume data for all pools when pool=all", async () => {
      // Use cache for simplicity
      mockCacheGet.mockResolvedValueOnce({
        DIESEL_FRBTC: createMockVolumeData("2:77087", "DIESEL/frBTC", 0.05),
        DIESEL_BUSD: createMockVolumeData("2:68441", "DIESEL/bUSD", 1500),
      });

      const request = new NextRequest("http://localhost/api/pools/volume?pool=all");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.pools.DIESEL_FRBTC).toBeDefined();
      expect(data.data.pools.DIESEL_BUSD).toBeDefined();
    });

    it("returns volume data for all pools when no pool param specified", async () => {
      mockCacheGet.mockResolvedValueOnce({
        DIESEL_FRBTC: createMockVolumeData("2:77087", "DIESEL/frBTC", 0.05),
        DIESEL_BUSD: createMockVolumeData("2:68441", "DIESEL/bUSD", 1500),
      });

      const request = new NextRequest("http://localhost/api/pools/volume");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.pools).toBeDefined();
    });
  });

  describe("fetching single pool volume", () => {
    it("returns volume data for DIESEL_FRBTC pool", async () => {
      mockCacheGet.mockResolvedValueOnce(
        createMockVolumeData("2:77087", "DIESEL/frBTC", 0.05)
      );

      const request = new NextRequest(
        "http://localhost/api/pools/volume?pool=DIESEL_FRBTC"
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.poolId).toBe("2:77087");
      expect(data.data.poolName).toBe("DIESEL/frBTC");
      expect(data.data.volume24h).toBeDefined();
    });

    it("returns volume data for DIESEL_BUSD pool", async () => {
      mockCacheGet.mockResolvedValueOnce(
        createMockVolumeData("2:68441", "DIESEL/bUSD", 1500)
      );

      const request = new NextRequest(
        "http://localhost/api/pools/volume?pool=DIESEL_BUSD"
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.poolId).toBe("2:68441");
      expect(data.data.poolName).toBe("DIESEL/bUSD");
    });

    it("returns 400 for invalid pool name", async () => {
      const request = new NextRequest(
        "http://localhost/api/pools/volume?pool=INVALID_POOL"
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain("Invalid pool");
    });
  });

  describe("fetching fresh volume data", () => {
    // Skipped: This test mocks fetch() but the code now uses alkanes-web-sys SDK via WASM.
    // Fresh volume data fetching is covered by integration tests (LIVE_RPC_TEST=true pnpm vitest)
    it.skip("calculates volume from Lua script when cache misses", async () => {
      setupVolumeMocks();

      // Also need to mock BTC price for USD conversion
      mockCacheGet
        .mockResolvedValueOnce(null) // volume cache miss
        .mockResolvedValueOnce(null) // block height cache miss
        .mockResolvedValueOnce({ usd: 100000, timestamp: Date.now() }); // BTC price cache hit

      const request = new NextRequest(
        "http://localhost/api/pools/volume?pool=DIESEL_FRBTC"
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.poolId).toBe("2:77087");
      expect(typeof data.data.volume24h).toBe("number");
    });
  });

  describe("response structure", () => {
    it("includes all expected fields in volume response", async () => {
      mockCacheGet.mockResolvedValueOnce(
        createMockVolumeData("2:77087", "DIESEL/frBTC", 0.05)
      );

      const request = new NextRequest(
        "http://localhost/api/pools/volume?pool=DIESEL_FRBTC"
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toMatchObject({
        success: true,
        data: {
          poolId: expect.any(String),
          poolName: expect.any(String),
          volume24h: expect.any(Number),
          startHeight: expect.any(Number),
          endHeight: expect.any(Number),
          timestamp: expect.any(Number),
        },
      });
    });

    it("includes volume24hUsd when available", async () => {
      mockCacheGet.mockResolvedValueOnce({
        poolId: "2:77087",
        poolName: "DIESEL/frBTC",
        volume24h: 0.05,
        volume24hUsd: 5000,
        startHeight: 927339,
        endHeight: 927483,
        timestamp: Date.now(),
      });

      const request = new NextRequest(
        "http://localhost/api/pools/volume?pool=DIESEL_FRBTC"
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.volume24hUsd).toBe(5000);
    });
  });

  describe("error handling", () => {
    it("returns 500 when RPC fails", async () => {
      mockFetch.mockRejectedValue(new Error("Network error"));

      const request = new NextRequest(
        "http://localhost/api/pools/volume?pool=DIESEL_FRBTC"
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBeDefined();
    });
  });

  describe("caching behavior", () => {
    it("uses cached data when available", async () => {
      const cachedVolume = createMockVolumeData("2:77087", "DIESEL/frBTC", 0.05);
      mockCacheGet.mockResolvedValueOnce(cachedVolume);

      const request = new NextRequest(
        "http://localhost/api/pools/volume?pool=DIESEL_FRBTC"
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.volume24h).toBe(0.05);
      // Fetch should not be called when cache hits
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });
});
