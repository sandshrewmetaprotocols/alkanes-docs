import { vi } from "vitest";

// Create mock functions for all Prisma operations
export const createPrismaMock = () => ({
  proposal: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
  },
  vote: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
  },
  discussion: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    count: vi.fn(),
  },
  post: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    count: vi.fn(),
  },
  category: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
  },
  reaction: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
  },
  mention: {
    create: vi.fn(),
  },
  notification: {
    create: vi.fn(),
  },
  discussionParticipant: {
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    upsert: vi.fn(),
  },
  userProfile: {
    findUnique: vi.fn(),
    upsert: vi.fn(),
    updateMany: vi.fn(),
  },
  tag: {
    findUnique: vi.fn(),
    update: vi.fn(),
  },
  discussionTag: {
    create: vi.fn(),
  },
  governanceSettings: {
    findFirst: vi.fn(),
  },
  postRevision: {
    create: vi.fn(),
  },
  $transaction: vi.fn(),
  $queryRaw: vi.fn(),
  $executeRaw: vi.fn(),
  $connect: vi.fn(),
  $disconnect: vi.fn(),
});

// Singleton mock instance
let mockInstance: ReturnType<typeof createPrismaMock> | null = null;

export const getPrismaMock = () => {
  if (!mockInstance) {
    mockInstance = createPrismaMock();
  }
  return mockInstance;
};

export const resetPrismaMock = () => {
  mockInstance = null;
};

// Type for mock Prisma client
export type MockPrismaClient = ReturnType<typeof createPrismaMock>;
