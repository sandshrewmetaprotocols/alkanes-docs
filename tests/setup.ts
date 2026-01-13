import { vi, beforeAll, afterAll, afterEach, beforeEach } from "vitest";
import "@testing-library/jest-dom/vitest";

// Note: We do NOT polyfill window/self - the alkanes-web-sys SDK properly detects
// Node.js environment and uses global fetch. Polyfilling window would make is_browser()
// return true incorrectly.

// Polyfill crypto for Node.js (needed for cryptographic operations)
if (typeof globalThis.crypto === "undefined") {
  // @ts-expect-error - polyfill crypto for Node.js
  globalThis.crypto = require("crypto").webcrypto;
}

// Polyfill TextEncoder/TextDecoder for older Node.js versions
if (typeof globalThis.TextEncoder === "undefined") {
  const { TextEncoder, TextDecoder } = require("util");
  // @ts-expect-error - polyfill
  globalThis.TextEncoder = TextEncoder;
  // @ts-expect-error - polyfill
  globalThis.TextDecoder = TextDecoder;
}

// Mock environment variables
process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test";
process.env.REDIS_URL = "redis://localhost:6379";
// NODE_ENV is set by vitest automatically

// Mock Next.js modules
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
}));

vi.mock("next/headers", () => ({
  cookies: () => ({
    get: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
  }),
  headers: () => new Headers(),
}));

// Global test lifecycle
beforeAll(() => {
  // Setup before all tests
});

afterEach(() => {
  // Cleanup after each test
  vi.clearAllMocks();
});

afterAll(() => {
  // Cleanup after all tests
});

// Export mock creation helpers
export const createMockPrismaClient = () => ({
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
  $transaction: vi.fn((fn: any) => {
    if (typeof fn === "function") {
      return fn(createMockPrismaClient());
    }
    return Promise.all(fn);
  }),
  $queryRaw: vi.fn(),
  $executeRaw: vi.fn(),
  $connect: vi.fn(),
  $disconnect: vi.fn(),
});
