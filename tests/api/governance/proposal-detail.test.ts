import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// Mock prisma module - must be before imports
vi.mock("@/lib/prisma", () => {
  return {
    prisma: {
      proposal: {
        findUnique: vi.fn(),
        update: vi.fn(),
      },
    },
    default: {
      proposal: { findUnique: vi.fn(), update: vi.fn() },
    },
  };
});

import { GET } from "@/app/api/governance/proposals/[id]/route";
import { prisma } from "@/lib/prisma";

// Type assertions for mocks
const mockProposal = prisma.proposal as any;

const mockProposalData = {
  id: "prop-1",
  title: "Test Proposal",
  body: "Test body content",
  choices: ["For", "Against", "Abstain"],
  author: "bc1qauthor",
  authorSig: "sig123",
  snapshot: 100000,
  start: new Date("2024-01-01"),
  end: new Date("2024-12-31"),
  state: "ACTIVE",
  scores: ["100", "50", "25"],
  totalVotes: "175", // String to avoid BigInt serialization
  votes: [
    { id: "vote-1", voter: "bc1q1", choice: 0, votingPower: "100" },
    { id: "vote-2", voter: "bc1q2", choice: 1, votingPower: "50" },
  ],
  _count: { votes: 2 },
};

const mockPendingProposal = {
  ...mockProposalData,
  id: "prop-pending",
  state: "PENDING",
  start: new Date(Date.now() - 1000), // Start time has passed
  end: new Date(Date.now() + 86400000),
};

const mockActiveExpiredProposal = {
  ...mockProposalData,
  id: "prop-expired",
  state: "ACTIVE",
  start: new Date(Date.now() - 86400000),
  end: new Date(Date.now() - 1000), // End time has passed
};

describe("GET /api/governance/proposals/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns proposal with votes", async () => {
    mockProposal.findUnique.mockResolvedValue(mockProposalData);

    const request = new NextRequest(
      "http://localhost/api/governance/proposals/prop-1"
    );
    const response = await GET(request, { params: Promise.resolve({ id: "prop-1" }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.proposal.id).toBe("prop-1");
    expect(data.proposal.votes).toHaveLength(2);
    expect(data.proposal._count.votes).toBe(2);
  });

  it("returns 404 for non-existent proposal", async () => {
    mockProposal.findUnique.mockResolvedValue(null);

    const request = new NextRequest(
      "http://localhost/api/governance/proposals/non-existent"
    );
    const response = await GET(request, {
      params: Promise.resolve({ id: "non-existent" }),
    });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe("Proposal not found");
  });

  it("updates state from PENDING to ACTIVE when start time passed", async () => {
    mockProposal.findUnique.mockResolvedValue(mockPendingProposal);
    mockProposal.update.mockResolvedValue({
      ...mockPendingProposal,
      state: "ACTIVE",
    });

    const request = new NextRequest(
      "http://localhost/api/governance/proposals/prop-pending"
    );
    const response = await GET(request, {
      params: Promise.resolve({ id: "prop-pending" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(mockProposal.update).toHaveBeenCalledWith({
      where: { id: "prop-pending" },
      data: { state: "ACTIVE" },
    });
    expect(data.proposal.state).toBe("ACTIVE");
  });

  it("updates state from ACTIVE to CLOSED when end time passed", async () => {
    mockProposal.findUnique.mockResolvedValue(mockActiveExpiredProposal);
    mockProposal.update.mockResolvedValue({
      ...mockActiveExpiredProposal,
      state: "CLOSED",
    });

    const request = new NextRequest(
      "http://localhost/api/governance/proposals/prop-expired"
    );
    const response = await GET(request, {
      params: Promise.resolve({ id: "prop-expired" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(mockProposal.update).toHaveBeenCalledWith({
      where: { id: "prop-expired" },
      data: { state: "CLOSED" },
    });
    expect(data.proposal.state).toBe("CLOSED");
  });

  it("does not update state if unchanged", async () => {
    mockProposal.findUnique.mockResolvedValue(mockProposalData);

    const request = new NextRequest(
      "http://localhost/api/governance/proposals/prop-1"
    );
    await GET(request, { params: Promise.resolve({ id: "prop-1" }) });

    expect(mockProposal.update).not.toHaveBeenCalled();
  });

  it("handles database errors", async () => {
    mockProposal.findUnique.mockRejectedValue(new Error("DB error"));

    const request = new NextRequest(
      "http://localhost/api/governance/proposals/prop-1"
    );
    const response = await GET(request, {
      params: Promise.resolve({ id: "prop-1" }),
    });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Failed to fetch proposal");
  });
});
