/**
 * Mock Prisma client for development mode when PostgreSQL is not available.
 * This provides a working API experience without requiring external services.
 */

import {
  mockProposals,
  mockCategories,
  mockDiscussions,
  mockGovernanceSettings,
  mockVotes,
  mockUserProfiles,
} from "./data";

type WhereClause = Record<string, any>;

function filterByWhere<T extends Record<string, any>>(
  items: T[],
  where?: WhereClause
): T[] {
  if (!where || Object.keys(where).length === 0) return items;

  return items.filter((item) => {
    return Object.entries(where).every(([key, value]) => {
      if (item[key] === undefined) return true;
      if (typeof value === "string") {
        return item[key]?.toString().toLowerCase() === value.toLowerCase();
      }
      return item[key] === value;
    });
  });
}

function applyPagination<T>(
  items: T[],
  skip?: number,
  take?: number
): T[] {
  let result = items;
  if (skip) result = result.slice(skip);
  if (take) result = result.slice(0, take);
  return result;
}

function sortItems<T extends Record<string, any>>(
  items: T[],
  orderBy?: Record<string, "asc" | "desc">
): T[] {
  if (!orderBy) return items;
  const [field, direction] = Object.entries(orderBy)[0];
  return [...items].sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];
    if (aVal < bVal) return direction === "asc" ? -1 : 1;
    if (aVal > bVal) return direction === "asc" ? 1 : -1;
    return 0;
  });
}

export const createMockPrismaClient = () => {
  const mockClient = {
    // Proposal model
    proposal: {
      findMany: async (args?: {
        where?: WhereClause;
        orderBy?: Record<string, "asc" | "desc">;
        skip?: number;
        take?: number;
        include?: any;
      }) => {
        let results = filterByWhere(mockProposals, args?.where);
        results = sortItems(results, args?.orderBy);
        results = applyPagination(results, args?.skip, args?.take);
        return results;
      },
      findUnique: async (args: { where: { id: string }; include?: any }) => {
        const proposal = mockProposals.find((p) => p.id === args.where.id);
        if (!proposal) return null;

        // If include.votes is requested, add votes to the proposal
        if (args.include?.votes) {
          const proposalVotes = mockVotes.filter((v) => v.proposalId === proposal.id);
          return { ...proposal, votes: proposalVotes };
        }

        return proposal;
      },
      findFirst: async (args?: { where?: WhereClause }) => {
        const results = filterByWhere(mockProposals, args?.where);
        return results[0] || null;
      },
      count: async (args?: { where?: WhereClause }) => {
        return filterByWhere(mockProposals, args?.where).length;
      },
      create: async (args: { data: any }) => {
        const newProposal = {
          id: `mock-proposal-${Date.now()}`,
          ...args.data,
          createdAt: new Date(),
          updatedAt: new Date(),
          _count: { votes: 0 },
        };
        mockProposals.push(newProposal);
        return newProposal;
      },
      update: async (args: { where: { id: string }; data: any }) => {
        const index = mockProposals.findIndex((p) => p.id === args.where.id);
        if (index >= 0) {
          mockProposals[index] = { ...mockProposals[index], ...args.data, updatedAt: new Date() };
          return mockProposals[index];
        }
        return null;
      },
      delete: async (args: { where: { id: string } }) => {
        const index = mockProposals.findIndex((p) => p.id === args.where.id);
        if (index >= 0) {
          const [deleted] = mockProposals.splice(index, 1);
          return deleted;
        }
        return null;
      },
    },

    // Vote model
    vote: {
      findMany: async (args?: { where?: WhereClause }) => {
        return filterByWhere(mockVotes, args?.where);
      },
      findUnique: async (args: { where: any }) => {
        if (args.where.proposalId_voter) {
          return mockVotes.find(
            (v) =>
              v.proposalId === args.where.proposalId_voter.proposalId &&
              v.voter === args.where.proposalId_voter.voter
          ) || null;
        }
        return mockVotes.find((v) => v.id === args.where.id) || null;
      },
      create: async (args: { data: any }) => {
        const newVote = {
          id: `vote-${Date.now()}`,
          ...args.data,
          createdAt: new Date(),
        };
        mockVotes.push(newVote);
        return newVote;
      },
      delete: async () => null,
    },

    // Discussion model
    discussion: {
      findMany: async (args?: {
        where?: WhereClause;
        orderBy?: Record<string, "asc" | "desc">;
        skip?: number;
        take?: number;
        include?: any;
      }) => {
        let results = filterByWhere(mockDiscussions, args?.where);
        results = sortItems(results, args?.orderBy);
        results = applyPagination(results, args?.skip, args?.take);
        return results;
      },
      findUnique: async (args: { where: { id?: string; slug?: string } }) => {
        if (args.where.id) {
          return mockDiscussions.find((d) => d.id === args.where.id) || null;
        }
        if (args.where.slug) {
          return mockDiscussions.find((d) => d.slug === args.where.slug) || null;
        }
        return null;
      },
      findFirst: async (args?: { where?: WhereClause }) => {
        const results = filterByWhere(mockDiscussions, args?.where);
        return results[0] || null;
      },
      count: async (args?: { where?: WhereClause }) => {
        return filterByWhere(mockDiscussions, args?.where).length;
      },
      create: async (args: { data: any }) => {
        const newDiscussion = {
          id: `discussion-${Date.now()}`,
          ...args.data,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        mockDiscussions.push(newDiscussion);
        return newDiscussion;
      },
      update: async (args: { where: { id: string }; data: any }) => {
        const index = mockDiscussions.findIndex((d) => d.id === args.where.id);
        if (index >= 0) {
          mockDiscussions[index] = { ...mockDiscussions[index], ...args.data };
          return mockDiscussions[index];
        }
        return null;
      },
    },

    // Category model
    category: {
      findMany: async () => mockCategories,
      findUnique: async (args: { where: { id?: string; slug?: string } }) => {
        if (args.where.id) {
          return mockCategories.find((c) => c.id === args.where.id) || null;
        }
        if (args.where.slug) {
          return mockCategories.find((c) => c.slug === args.where.slug) || null;
        }
        return null;
      },
      create: async (args: { data: any }) => {
        const newCategory = {
          id: `cat-${Date.now()}`,
          ...args.data,
        };
        mockCategories.push(newCategory);
        return newCategory;
      },
    },

    // GovernanceSettings model
    governanceSettings: {
      findFirst: async () => mockGovernanceSettings,
    },

    // Post model
    post: {
      findMany: async () => [],
      findUnique: async () => null,
      findFirst: async () => null,
      create: async (args: { data: any }) => ({
        id: `post-${Date.now()}`,
        ...args.data,
        createdAt: new Date(),
      }),
      update: async () => null,
      count: async () => 0,
    },

    // UserProfile model
    userProfile: {
      findUnique: async (args: { where: { address: string } }) => {
        return mockUserProfiles.get(args.where.address) || null;
      },
      upsert: async (args: { where: { address: string }; create: any; update: any }) => {
        const existing = mockUserProfiles.get(args.where.address);
        if (existing) {
          const updated = { ...existing };
          Object.entries(args.update).forEach(([key, value]) => {
            if (typeof value === "object" && value !== null && "increment" in value) {
              updated[key] = (updated[key] || 0) + (value as any).increment;
            } else {
              updated[key] = value;
            }
          });
          mockUserProfiles.set(args.where.address, updated);
          return updated;
        }
        const created = { ...args.create };
        mockUserProfiles.set(args.where.address, created);
        return created;
      },
      updateMany: async () => ({ count: 0 }),
    },

    // DiscussionParticipant model
    discussionParticipant: {
      findUnique: async () => null,
      create: async (args: { data: any }) => ({ id: `participant-${Date.now()}`, ...args.data }),
      update: async () => null,
      upsert: async (args: { create: any }) => ({ id: `participant-${Date.now()}`, ...args.create }),
    },

    // Reaction model
    reaction: {
      findMany: async () => [],
      findUnique: async () => null,
      create: async () => null,
      delete: async () => null,
    },

    // Mention model
    mention: {
      create: async () => null,
    },

    // Notification model
    notification: {
      create: async () => null,
    },

    // Tag model
    tag: {
      findUnique: async () => null,
      update: async () => null,
    },

    // DiscussionTag model
    discussionTag: {
      create: async () => null,
    },

    // Transaction support
    $transaction: async (fnOrPromises: any) => {
      if (typeof fnOrPromises === "function") {
        return fnOrPromises(mockClient);
      }
      return Promise.all(fnOrPromises);
    },

    $queryRaw: async () => [],
    $executeRaw: async () => 0,
    $connect: async () => {},
    $disconnect: async () => {},
  };

  return mockClient;
};

export type MockPrismaClient = ReturnType<typeof createMockPrismaClient>;
