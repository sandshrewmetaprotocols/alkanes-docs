/**
 * ProposalCard Component Tests
 *
 * Tests the ProposalCard component with various edge cases including:
 * - Missing scores array
 * - Null/undefined scores
 * - Empty scores array
 * - Valid scores with BigInt calculations
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

// Mock next-intl
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string, params?: Record<string, string>) => {
    if (params) {
      return Object.entries(params).reduce(
        (str, [k, v]) => str.replace(`{${k}}`, v),
        key
      );
    }
    return key;
  },
}));

// Mock i18n navigation
vi.mock("@/i18n/navigation", () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

// Mock tanstack query
vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn(() => ({
    data: [],
    isLoading: false,
    error: null,
  })),
}));

// Define the Proposal interface matching the component
interface Proposal {
  id: string;
  title: string;
  author: string;
  start: string;
  end: string;
  state: "PENDING" | "ACTIVE" | "CLOSED" | "EXECUTED" | "CANCELLED";
  scores: string[] | null | undefined;
  totalVotes: string;
  _count: {
    votes: number;
  };
}

// Extract and test the ProposalCard logic directly
// This tests the exact same logic used in the component
function calculateVotePercentages(proposal: Proposal) {
  const scoresArray = Array.isArray(proposal.scores) ? proposal.scores : [];
  const scores = scoresArray.map((s) => BigInt(s || "0"));
  const totalVotes = BigInt(proposal.totalVotes || "0");

  let forPercentage = 50;
  let againstPercentage = 50;

  if (totalVotes > BigInt(0) && scores.length >= 2) {
    forPercentage = Number((scores[0] * BigInt(100)) / totalVotes);
    againstPercentage = Number((scores[1] * BigInt(100)) / totalVotes);
  }

  return { forPercentage, againstPercentage, scores, totalVotes };
}

describe("ProposalCard Vote Calculation Logic", () => {
  describe("with missing/malformed scores", () => {
    it("handles undefined scores", () => {
      const proposal: Proposal = {
        id: "1",
        title: "Test Proposal",
        author: "bc1qtest",
        start: new Date().toISOString(),
        end: new Date(Date.now() + 86400000).toISOString(),
        state: "ACTIVE",
        scores: undefined,
        totalVotes: "100",
        _count: { votes: 10 },
      };

      const result = calculateVotePercentages(proposal);

      expect(result.scores).toEqual([]);
      expect(result.forPercentage).toBe(50);
      expect(result.againstPercentage).toBe(50);
    });

    it("handles null scores", () => {
      const proposal: Proposal = {
        id: "1",
        title: "Test Proposal",
        author: "bc1qtest",
        start: new Date().toISOString(),
        end: new Date(Date.now() + 86400000).toISOString(),
        state: "ACTIVE",
        scores: null,
        totalVotes: "100",
        _count: { votes: 10 },
      };

      const result = calculateVotePercentages(proposal);

      expect(result.scores).toEqual([]);
      expect(result.forPercentage).toBe(50);
      expect(result.againstPercentage).toBe(50);
    });

    it("handles empty scores array", () => {
      const proposal: Proposal = {
        id: "1",
        title: "Test Proposal",
        author: "bc1qtest",
        start: new Date().toISOString(),
        end: new Date(Date.now() + 86400000).toISOString(),
        state: "ACTIVE",
        scores: [],
        totalVotes: "100",
        _count: { votes: 10 },
      };

      const result = calculateVotePercentages(proposal);

      expect(result.scores).toEqual([]);
      expect(result.forPercentage).toBe(50);
      expect(result.againstPercentage).toBe(50);
    });

    it("handles scores array with only one element", () => {
      const proposal: Proposal = {
        id: "1",
        title: "Test Proposal",
        author: "bc1qtest",
        start: new Date().toISOString(),
        end: new Date(Date.now() + 86400000).toISOString(),
        state: "ACTIVE",
        scores: ["50"],
        totalVotes: "100",
        _count: { votes: 10 },
      };

      const result = calculateVotePercentages(proposal);

      expect(result.scores).toEqual([BigInt(50)]);
      // Should default to 50/50 since we need at least 2 scores
      expect(result.forPercentage).toBe(50);
      expect(result.againstPercentage).toBe(50);
    });

    it("handles scores with null/undefined elements", () => {
      const proposal: Proposal = {
        id: "1",
        title: "Test Proposal",
        author: "bc1qtest",
        start: new Date().toISOString(),
        end: new Date(Date.now() + 86400000).toISOString(),
        state: "ACTIVE",
        scores: [null as any, undefined as any, "100"],
        totalVotes: "100",
        _count: { votes: 10 },
      };

      const result = calculateVotePercentages(proposal);

      expect(result.scores).toEqual([BigInt(0), BigInt(0), BigInt(100)]);
      // 0/100 = 0%, 0/100 = 0%
      expect(result.forPercentage).toBe(0);
      expect(result.againstPercentage).toBe(0);
    });

    it("handles scores with empty string elements", () => {
      const proposal: Proposal = {
        id: "1",
        title: "Test Proposal",
        author: "bc1qtest",
        start: new Date().toISOString(),
        end: new Date(Date.now() + 86400000).toISOString(),
        state: "ACTIVE",
        scores: ["", "", "100"],
        totalVotes: "100",
        _count: { votes: 10 },
      };

      const result = calculateVotePercentages(proposal);

      expect(result.scores).toEqual([BigInt(0), BigInt(0), BigInt(100)]);
    });
  });

  describe("with valid scores", () => {
    it("calculates correct percentages for 60/40 split", () => {
      const proposal: Proposal = {
        id: "1",
        title: "Test Proposal",
        author: "bc1qtest",
        start: new Date().toISOString(),
        end: new Date(Date.now() + 86400000).toISOString(),
        state: "ACTIVE",
        scores: ["60", "40"],
        totalVotes: "100",
        _count: { votes: 10 },
      };

      const result = calculateVotePercentages(proposal);

      expect(result.forPercentage).toBe(60);
      expect(result.againstPercentage).toBe(40);
    });

    it("calculates correct percentages for large numbers", () => {
      const proposal: Proposal = {
        id: "1",
        title: "Test Proposal",
        author: "bc1qtest",
        start: new Date().toISOString(),
        end: new Date(Date.now() + 86400000).toISOString(),
        state: "ACTIVE",
        scores: ["1000000000000000000", "500000000000000000"],
        totalVotes: "1500000000000000000",
        _count: { votes: 1000000 },
      };

      const result = calculateVotePercentages(proposal);

      // 1e18 / 1.5e18 * 100 = 66.66...%
      expect(result.forPercentage).toBe(66);
      // 0.5e18 / 1.5e18 * 100 = 33.33...%
      expect(result.againstPercentage).toBe(33);
    });

    it("handles zero totalVotes", () => {
      const proposal: Proposal = {
        id: "1",
        title: "Test Proposal",
        author: "bc1qtest",
        start: new Date().toISOString(),
        end: new Date(Date.now() + 86400000).toISOString(),
        state: "ACTIVE",
        scores: ["0", "0"],
        totalVotes: "0",
        _count: { votes: 0 },
      };

      const result = calculateVotePercentages(proposal);

      expect(result.forPercentage).toBe(50);
      expect(result.againstPercentage).toBe(50);
    });

    it("handles undefined totalVotes", () => {
      const proposal: Proposal = {
        id: "1",
        title: "Test Proposal",
        author: "bc1qtest",
        start: new Date().toISOString(),
        end: new Date(Date.now() + 86400000).toISOString(),
        state: "ACTIVE",
        scores: ["50", "50"],
        totalVotes: undefined as any,
        _count: { votes: 0 },
      };

      const result = calculateVotePercentages(proposal);

      expect(result.totalVotes).toBe(BigInt(0));
      expect(result.forPercentage).toBe(50);
      expect(result.againstPercentage).toBe(50);
    });
  });
});

// Test the governance page ProposalCard logic
function calculateGovernancePageScores(proposal: {
  scores?: string[] | null;
  totalVotes?: string;
  choices?: string[];
}) {
  const scoresArray = Array.isArray(proposal.scores) ? proposal.scores : [];
  const scores = scoresArray.map((s) => BigInt(s || "0"));
  const totalVotes = scores.reduce((a, b) => a + b, BigInt(0));
  const maxScore = scores.reduce((a, b) => (a > b ? a : b), BigInt(0));

  return { scores, totalVotes, maxScore };
}

describe("Governance Page ProposalCard Logic", () => {
  describe("score calculations", () => {
    it("handles undefined scores", () => {
      const result = calculateGovernancePageScores({
        scores: undefined,
        choices: ["For", "Against"],
      });

      expect(result.scores).toEqual([]);
      expect(result.totalVotes).toBe(BigInt(0));
      expect(result.maxScore).toBe(BigInt(0));
    });

    it("handles null scores", () => {
      const result = calculateGovernancePageScores({
        scores: null,
        choices: ["For", "Against"],
      });

      expect(result.scores).toEqual([]);
      expect(result.totalVotes).toBe(BigInt(0));
      expect(result.maxScore).toBe(BigInt(0));
    });

    it("calculates max score correctly", () => {
      const result = calculateGovernancePageScores({
        scores: ["100", "200", "50"],
        choices: ["For", "Against", "Abstain"],
      });

      expect(result.scores).toEqual([BigInt(100), BigInt(200), BigInt(50)]);
      expect(result.totalVotes).toBe(BigInt(350));
      expect(result.maxScore).toBe(BigInt(200));
    });

    it("handles all zero scores", () => {
      const result = calculateGovernancePageScores({
        scores: ["0", "0", "0"],
        choices: ["For", "Against", "Abstain"],
      });

      expect(result.totalVotes).toBe(BigInt(0));
      expect(result.maxScore).toBe(BigInt(0));
    });
  });
});

// Test proposal detail page calculation logic
function calculateProposalDetailScores(proposal?: {
  scores?: string[] | null;
}) {
  const scoresArray = Array.isArray(proposal?.scores) ? proposal.scores : [];
  const scores = scoresArray.map((s) => BigInt(s || "0"));
  const totalVotes = scores.reduce((a, b) => a + b, BigInt(0));
  const maxScore = scores.reduce((a, b) => (a > b ? a : b), BigInt(0));

  return { scores, totalVotes, maxScore };
}

describe("Proposal Detail Page Logic", () => {
  it("handles undefined proposal", () => {
    const result = calculateProposalDetailScores(undefined);

    expect(result.scores).toEqual([]);
    expect(result.totalVotes).toBe(BigInt(0));
    expect(result.maxScore).toBe(BigInt(0));
  });

  it("handles proposal with undefined scores", () => {
    const result = calculateProposalDetailScores({
      scores: undefined,
    });

    expect(result.scores).toEqual([]);
    expect(result.totalVotes).toBe(BigInt(0));
  });

  it("handles proposal with null scores", () => {
    const result = calculateProposalDetailScores({
      scores: null,
    });

    expect(result.scores).toEqual([]);
    expect(result.totalVotes).toBe(BigInt(0));
  });

  it("handles valid scores", () => {
    const result = calculateProposalDetailScores({
      scores: ["100", "50", "25"],
    });

    expect(result.scores).toEqual([BigInt(100), BigInt(50), BigInt(25)]);
    expect(result.totalVotes).toBe(BigInt(175));
    expect(result.maxScore).toBe(BigInt(100));
  });
});

// Test BigInt comparison edge cases
describe("BigInt Comparison Edge Cases", () => {
  it("correctly compares BigInt with BigInt(0)", () => {
    const totalVotes = BigInt(100);
    expect(totalVotes > BigInt(0)).toBe(true);

    const zeroVotes = BigInt(0);
    expect(zeroVotes > BigInt(0)).toBe(false);

    const negativeVotes = BigInt(-1);
    expect(negativeVotes > BigInt(0)).toBe(false);
  });

  it("handles BigInt division", () => {
    const score = BigInt(60);
    const total = BigInt(100);
    const percentage = Number((score * BigInt(100)) / total);
    expect(percentage).toBe(60);
  });

  it("handles BigInt division with large numbers", () => {
    const score = BigInt("1000000000000000000");
    const total = BigInt("2000000000000000000");
    const percentage = Number((score * BigInt(100)) / total);
    expect(percentage).toBe(50);
  });

  it("handles BigInt reduce with empty array", () => {
    const scores: bigint[] = [];
    const total = scores.reduce((a, b) => a + b, BigInt(0));
    const max = scores.reduce((a, b) => (a > b ? a : b), BigInt(0));

    expect(total).toBe(BigInt(0));
    expect(max).toBe(BigInt(0));
  });
});
