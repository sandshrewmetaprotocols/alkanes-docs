import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the entire prisma module
vi.mock("@/lib/prisma", () => {
  const mockQueryRaw = vi.fn();
  return {
    prisma: { $queryRaw: mockQueryRaw },
    default: { $queryRaw: mockQueryRaw },
  };
});

// Import after mocking
import { GET } from "@/app/api/health/route";
import { prisma } from "@/lib/prisma";

// Cast to mock for typing
const mockQueryRaw = prisma.$queryRaw as ReturnType<typeof vi.fn>;

describe("GET /api/health", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns healthy status when database is connected", async () => {
    mockQueryRaw.mockResolvedValueOnce([{ "?column?": 1 }]);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.status).toBe("healthy");
    expect(data.checks.app.status).toBe("ok");
    expect(data.checks.database.status).toBe("ok");
    expect(data.checks.database.latency).toBeDefined();
    expect(data.timestamp).toBeDefined();
  });

  it("returns degraded status when database connection fails", async () => {
    mockQueryRaw.mockRejectedValueOnce(new Error("Connection failed"));

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(503);
    expect(data.status).toBe("degraded");
    expect(data.checks.app.status).toBe("ok");
    expect(data.checks.database.status).toBe("error");
    expect(data.checks.database.latency).toBeDefined();
  });

  it("includes timestamp in response", async () => {
    mockQueryRaw.mockResolvedValueOnce([{ "?column?": 1 }]);

    const before = new Date().toISOString();
    const response = await GET();
    const data = await response.json();
    const after = new Date().toISOString();

    expect(data.timestamp).toBeDefined();
    expect(new Date(data.timestamp).getTime()).toBeGreaterThanOrEqual(
      new Date(before).getTime()
    );
    expect(new Date(data.timestamp).getTime()).toBeLessThanOrEqual(
      new Date(after).getTime()
    );
  });
});
