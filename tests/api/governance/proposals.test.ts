import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// Mock BIP-322 verification for tests
vi.mock("@/lib/bip322", () => ({
  verifyMessage: () => ({ valid: true, addressType: "p2wpkh" }),
}));

// Mock prisma module - must be before imports
vi.mock("@/lib/prisma", () => {
  return {
    prisma: {
      proposal: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        count: vi.fn(),
      },
      governanceSettings: {
        findFirst: vi.fn(),
      },
      category: {
        findUnique: vi.fn(),
        create: vi.fn(),
      },
      discussion: {
        findUnique: vi.fn(),
        create: vi.fn(),
      },
      post: {
        create: vi.fn(),
      },
      discussionParticipant: {
        create: vi.fn(),
      },
      userProfile: {
        upsert: vi.fn(),
      },
      $transaction: vi.fn((fn: any) => fn({
        proposal: { create: vi.fn() },
        category: { findUnique: vi.fn(), create: vi.fn() },
        discussion: { findUnique: vi.fn(), create: vi.fn() },
        post: { create: vi.fn() },
        discussionParticipant: { create: vi.fn() },
        userProfile: { upsert: vi.fn() },
      })),
    },
    default: {
      proposal: { findMany: vi.fn(), count: vi.fn() },
    },
  };
});

import { GET, POST } from "@/app/api/governance/proposals/route";
import { prisma } from "@/lib/prisma";

// Type assertions for mocks
const mockProposal = prisma.proposal as any;
const mockSettings = prisma.governanceSettings as any;
const mockTransaction = prisma.$transaction as any;

describe("GET /api/governance/proposals", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns paginated proposals", async () => {
    const mockData = [
      { id: "1", title: "Test 1", _count: { votes: 1 }, discussion: null },
      { id: "2", title: "Test 2", _count: { votes: 0 }, discussion: null },
    ];
    mockProposal.findMany.mockResolvedValue(mockData);
    mockProposal.count.mockResolvedValue(2);

    const request = new NextRequest("http://localhost/api/governance/proposals");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.proposals).toHaveLength(2);
    expect(data.pagination.total).toBe(2);
  });

  it("filters by state", async () => {
    mockProposal.findMany.mockResolvedValue([]);
    mockProposal.count.mockResolvedValue(0);

    const request = new NextRequest(
      "http://localhost/api/governance/proposals?state=active"
    );
    await GET(request);

    expect(mockProposal.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ state: "ACTIVE" }),
      })
    );
  });

  it("filters by author", async () => {
    mockProposal.findMany.mockResolvedValue([]);
    mockProposal.count.mockResolvedValue(0);

    const request = new NextRequest(
      "http://localhost/api/governance/proposals?author=bc1qtest"
    );
    await GET(request);

    expect(mockProposal.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ author: "bc1qtest" }),
      })
    );
  });

  it("handles pagination", async () => {
    mockProposal.findMany.mockResolvedValue([]);
    mockProposal.count.mockResolvedValue(100);

    const request = new NextRequest(
      "http://localhost/api/governance/proposals?page=3&limit=20"
    );
    const response = await GET(request);
    const data = await response.json();

    expect(mockProposal.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 40, take: 20 })
    );
    expect(data.pagination.pages).toBe(5);
  });

  it("handles database errors", async () => {
    mockProposal.findMany.mockRejectedValue(new Error("DB error"));

    const request = new NextRequest("http://localhost/api/governance/proposals");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Failed to fetch proposals");
  });
});

describe("POST /api/governance/proposals", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 for missing required fields", async () => {
    const request = new NextRequest("http://localhost/api/governance/proposals", {
      method: "POST",
      body: JSON.stringify({ title: "Test" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Missing required fields");
  });

  it("returns 400 for insufficient choices", async () => {
    const request = new NextRequest("http://localhost/api/governance/proposals", {
      method: "POST",
      body: JSON.stringify({
        title: "Test",
        body: "Content",
        choices: ["Only one"],
        author: "bc1qtest",
        authorSig: "sig",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("At least 2 choices are required");
  });

  it("creates proposal successfully", async () => {
    mockSettings.findFirst.mockResolvedValue({ votingDelay: 0, votingPeriod: 100 });
    mockTransaction.mockImplementation(async (fn: any) => {
      const ctx = {
        proposal: { create: vi.fn().mockResolvedValue({ id: "new-id" }) },
        category: { findUnique: vi.fn().mockResolvedValue({ id: "cat-1" }), create: vi.fn() },
        discussion: { findUnique: vi.fn().mockResolvedValue(null), create: vi.fn().mockResolvedValue({ id: "disc-1" }) },
        post: { create: vi.fn() },
        discussionParticipant: { create: vi.fn() },
        userProfile: { upsert: vi.fn() },
      };
      return fn(ctx);
    });
    mockProposal.findUnique.mockResolvedValue({
      id: "new-id",
      title: "Test",
      discussion: { id: "disc-1", slug: "test" },
    });

    const request = new NextRequest("http://localhost/api/governance/proposals", {
      method: "POST",
      body: JSON.stringify({
        title: "Test",
        body: "Content",
        choices: ["For", "Against"],
        author: "bc1qtest",
        authorSig: "sig",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.proposal).toBeDefined();
  });

  it("creates governance category if not exists", async () => {
    mockSettings.findFirst.mockResolvedValue(null);

    let categoryCreated = false;
    mockTransaction.mockImplementation(async (fn: any) => {
      const ctx = {
        proposal: { create: vi.fn().mockResolvedValue({ id: "new-id" }) },
        category: {
          findUnique: vi.fn().mockResolvedValue(null), // Category doesn't exist
          create: vi.fn().mockImplementation(() => {
            categoryCreated = true;
            return { id: "cat-new", slug: "governance" };
          }),
        },
        discussion: { findUnique: vi.fn().mockResolvedValue(null), create: vi.fn().mockResolvedValue({ id: "disc-1" }) },
        post: { create: vi.fn() },
        discussionParticipant: { create: vi.fn() },
        userProfile: { upsert: vi.fn() },
      };
      return fn(ctx);
    });
    mockProposal.findUnique.mockResolvedValue({
      id: "new-id",
      title: "Test",
      discussion: { id: "disc-1", slug: "test" },
    });

    const request = new NextRequest("http://localhost/api/governance/proposals", {
      method: "POST",
      body: JSON.stringify({
        title: "Test Proposal",
        body: "Content",
        choices: ["For", "Against"],
        author: "bc1qtest",
        authorSig: "sig",
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(201);
    expect(categoryCreated).toBe(true);
  });

  it("handles discussion slug collision", async () => {
    mockSettings.findFirst.mockResolvedValue(null);

    let slugAttempts = 0;
    mockTransaction.mockImplementation(async (fn: any) => {
      const ctx = {
        proposal: { create: vi.fn().mockResolvedValue({ id: "new-id" }) },
        category: { findUnique: vi.fn().mockResolvedValue({ id: "cat-1" }), create: vi.fn() },
        discussion: {
          findUnique: vi.fn().mockImplementation(() => {
            slugAttempts++;
            // First call returns existing discussion, second returns null
            return slugAttempts === 1 ? { id: "existing-disc" } : null;
          }),
          create: vi.fn().mockResolvedValue({ id: "disc-1" }),
        },
        post: { create: vi.fn() },
        discussionParticipant: { create: vi.fn() },
        userProfile: { upsert: vi.fn() },
      };
      return fn(ctx);
    });
    mockProposal.findUnique.mockResolvedValue({
      id: "new-id",
      title: "Test",
      discussion: { id: "disc-1", slug: "proposal-test-1" },
    });

    const request = new NextRequest("http://localhost/api/governance/proposals", {
      method: "POST",
      body: JSON.stringify({
        title: "Test",
        body: "Content",
        choices: ["For", "Against"],
        author: "bc1qtest",
        authorSig: "sig",
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(201);
    expect(slugAttempts).toBe(2); // Should have tried twice (first failed, second succeeded)
  });

  it("handles database errors", async () => {
    mockSettings.findFirst.mockRejectedValue(new Error("DB error"));

    const request = new NextRequest("http://localhost/api/governance/proposals", {
      method: "POST",
      body: JSON.stringify({
        title: "Test",
        body: "Content",
        choices: ["For", "Against"],
        author: "bc1qtest",
        authorSig: "sig",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Failed to create proposal");
  });
});
