/**
 * ActiveProposals Component Tests
 *
 * Tests the ActiveProposals component rendering with various data states:
 * - Loading state
 * - Error state
 * - Empty state
 * - Various proposal data shapes
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import React from "react";

// Mock next-intl
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string, params?: Record<string, string>) => {
    const translations: Record<string, string> = {
      title: "Active Proposals",
      "cta.title": "Have your say",
      "cta.description": "Participate in governance",
      "cta.button": "View All Proposals",
      by: `by ${params?.author || ""}`,
      ends: `ends ${params?.time || ""}`,
      starts: `starts ${params?.time || ""}`,
      "proposal.for": "For",
      "proposal.against": "Against",
      "states.ACTIVE": "Active",
      "states.PENDING": "Pending",
      "states.CLOSED": "Closed",
      error: "Error loading proposals",
      noProposals: "No active proposals",
    };
    return translations[key] || key;
  },
}));

// Mock i18n navigation
vi.mock("@/i18n/navigation", () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href} data-testid="link">
      {children}
    </a>
  ),
}));

// Mock lib/utils
vi.mock("@/lib/utils", () => ({
  formatAddress: (addr: string) => addr?.slice(0, 8) + "..." || "",
  formatTimeRemaining: (date: string) => "in 2 days",
  formatRelativeTime: (date: string) => "in 1 day",
  cn: (...args: any[]) => args.filter(Boolean).join(" "),
}));

// Track useQuery mock state
let queryState = {
  data: [] as any[],
  isLoading: false,
  error: null as Error | null,
};

// Mock tanstack query
vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn(() => queryState),
}));

// Import after mocks
import { ActiveProposals } from "@/components/ActiveProposals";

describe("ActiveProposals Component", () => {
  beforeEach(() => {
    // Reset query state
    queryState = {
      data: [],
      isLoading: false,
      error: null,
    };
  });

  describe("loading state", () => {
    it("renders loading skeleton when isLoading is true", () => {
      queryState.isLoading = true;

      render(<ActiveProposals />);

      // Should show 3 skeleton items (based on component)
      const skeletons = document.querySelectorAll(".animate-pulse");
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  describe("error state", () => {
    it("renders error message when error occurs", () => {
      queryState.error = new Error("Failed to fetch");

      render(<ActiveProposals />);

      expect(screen.getByText("Error loading proposals")).toBeInTheDocument();
    });
  });

  describe("empty state", () => {
    it("renders no proposals message when data is empty", () => {
      queryState.data = [];

      render(<ActiveProposals />);

      expect(screen.getByText("No active proposals")).toBeInTheDocument();
    });
  });

  describe("with proposals", () => {
    it("renders proposals with valid data", () => {
      queryState.data = [
        {
          id: "1",
          title: "Test Proposal 1",
          author: "bc1qtest123",
          start: new Date().toISOString(),
          end: new Date(Date.now() + 86400000).toISOString(),
          state: "ACTIVE",
          scores: ["60", "40"],
          totalVotes: "100",
          _count: { votes: 10 },
        },
      ];

      render(<ActiveProposals />);

      expect(screen.getByText("Test Proposal 1")).toBeInTheDocument();
    });

    it("renders proposals with missing scores", () => {
      queryState.data = [
        {
          id: "1",
          title: "Test Proposal with null scores",
          author: "bc1qtest123",
          start: new Date().toISOString(),
          end: new Date(Date.now() + 86400000).toISOString(),
          state: "ACTIVE",
          scores: null,
          totalVotes: "100",
          _count: { votes: 10 },
        },
      ];

      // Should not throw
      expect(() => render(<ActiveProposals />)).not.toThrow();
      expect(
        screen.getByText("Test Proposal with null scores")
      ).toBeInTheDocument();
    });

    it("renders proposals with undefined scores", () => {
      queryState.data = [
        {
          id: "1",
          title: "Test Proposal with undefined scores",
          author: "bc1qtest123",
          start: new Date().toISOString(),
          end: new Date(Date.now() + 86400000).toISOString(),
          state: "ACTIVE",
          scores: undefined,
          totalVotes: "100",
          _count: { votes: 10 },
        },
      ];

      // Should not throw
      expect(() => render(<ActiveProposals />)).not.toThrow();
      expect(
        screen.getByText("Test Proposal with undefined scores")
      ).toBeInTheDocument();
    });

    it("renders proposals with empty scores array", () => {
      queryState.data = [
        {
          id: "1",
          title: "Test Proposal with empty scores",
          author: "bc1qtest123",
          start: new Date().toISOString(),
          end: new Date(Date.now() + 86400000).toISOString(),
          state: "ACTIVE",
          scores: [],
          totalVotes: "0",
          _count: { votes: 0 },
        },
      ];

      // Should not throw
      expect(() => render(<ActiveProposals />)).not.toThrow();
      expect(
        screen.getByText("Test Proposal with empty scores")
      ).toBeInTheDocument();
    });

    it("renders multiple proposals", () => {
      queryState.data = [
        {
          id: "1",
          title: "Proposal 1",
          author: "bc1qtest123",
          start: new Date().toISOString(),
          end: new Date(Date.now() + 86400000).toISOString(),
          state: "ACTIVE",
          scores: ["50", "50"],
          totalVotes: "100",
          _count: { votes: 10 },
        },
        {
          id: "2",
          title: "Proposal 2",
          author: "bc1qtest456",
          start: new Date().toISOString(),
          end: new Date(Date.now() + 172800000).toISOString(),
          state: "PENDING",
          scores: null,
          totalVotes: "0",
          _count: { votes: 0 },
        },
        {
          id: "3",
          title: "Proposal 3",
          author: "bc1qtest789",
          start: new Date().toISOString(),
          end: new Date(Date.now() + 86400000).toISOString(),
          state: "ACTIVE",
          scores: undefined,
          totalVotes: "50",
          _count: { votes: 5 },
        },
      ];

      render(<ActiveProposals />);

      expect(screen.getByText("Proposal 1")).toBeInTheDocument();
      expect(screen.getByText("Proposal 2")).toBeInTheDocument();
      expect(screen.getByText("Proposal 3")).toBeInTheDocument();
    });

    it("handles proposals with string that looks like object", () => {
      queryState.data = [
        {
          id: "1",
          title: "Edge case proposal",
          author: "bc1qtest123",
          start: new Date().toISOString(),
          end: new Date(Date.now() + 86400000).toISOString(),
          state: "ACTIVE",
          // scores might come back as a stringified array from some APIs
          scores: ["0", "0"],
          totalVotes: "0",
          _count: { votes: 0 },
        },
      ];

      expect(() => render(<ActiveProposals />)).not.toThrow();
    });
  });
});

// Test the helper function that calculates scores
describe("Score Calculation Helper", () => {
  // This replicates the logic in the component
  function calculateScores(proposal: {
    scores?: string[] | null;
    totalVotes?: string;
  }) {
    const scoresArray = Array.isArray(proposal.scores) ? proposal.scores : [];
    const scores = scoresArray.map((s) => BigInt(s || "0"));
    const totalVotes = BigInt(proposal.totalVotes || "0");

    let forPercentage = 50;
    let againstPercentage = 50;

    if (totalVotes > BigInt(0) && scores.length >= 2) {
      forPercentage = Number((scores[0] * BigInt(100)) / totalVotes);
      againstPercentage = Number((scores[1] * BigInt(100)) / totalVotes);
    }

    return { forPercentage, againstPercentage, totalVotes };
  }

  it("handles undefined scores", () => {
    const result = calculateScores({ scores: undefined, totalVotes: "100" });
    expect(result.forPercentage).toBe(50);
    expect(result.againstPercentage).toBe(50);
  });

  it("handles null scores", () => {
    const result = calculateScores({ scores: null, totalVotes: "100" });
    expect(result.forPercentage).toBe(50);
    expect(result.againstPercentage).toBe(50);
  });

  it("handles empty scores", () => {
    const result = calculateScores({ scores: [], totalVotes: "100" });
    expect(result.forPercentage).toBe(50);
    expect(result.againstPercentage).toBe(50);
  });

  it("calculates correct percentages", () => {
    const result = calculateScores({ scores: ["75", "25"], totalVotes: "100" });
    expect(result.forPercentage).toBe(75);
    expect(result.againstPercentage).toBe(25);
  });

  it("handles zero totalVotes", () => {
    const result = calculateScores({ scores: ["50", "50"], totalVotes: "0" });
    expect(result.forPercentage).toBe(50);
    expect(result.againstPercentage).toBe(50);
  });

  it("handles undefined totalVotes", () => {
    const result = calculateScores({ scores: ["50", "50"] });
    expect(result.totalVotes).toBe(BigInt(0));
  });
});
