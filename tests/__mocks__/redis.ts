import { vi } from "vitest";

// In-memory cache store
let cacheStore = new Map<string, { value: string; expiry?: number }>();

export const resetRedisStore = () => {
  cacheStore = new Map();
};

export const createRedisMock = () => ({
  get: vi.fn(async (key: string) => {
    const entry = cacheStore.get(key);
    if (!entry) return null;
    if (entry.expiry && Date.now() > entry.expiry) {
      cacheStore.delete(key);
      return null;
    }
    return entry.value;
  }),

  set: vi.fn(async (key: string, value: string, options?: { EX?: number }) => {
    const expiry = options?.EX ? Date.now() + options.EX * 1000 : undefined;
    cacheStore.set(key, { value, expiry });
    return "OK";
  }),

  del: vi.fn(async (...keys: string[]) => {
    let count = 0;
    for (const key of keys) {
      if (cacheStore.delete(key)) count++;
    }
    return count;
  }),

  exists: vi.fn(async (...keys: string[]) => {
    let count = 0;
    for (const key of keys) {
      if (cacheStore.has(key)) count++;
    }
    return count;
  }),

  expire: vi.fn(async (key: string, seconds: number) => {
    const entry = cacheStore.get(key);
    if (!entry) return 0;
    entry.expiry = Date.now() + seconds * 1000;
    return 1;
  }),

  ttl: vi.fn(async (key: string) => {
    const entry = cacheStore.get(key);
    if (!entry) return -2;
    if (!entry.expiry) return -1;
    const remaining = Math.ceil((entry.expiry - Date.now()) / 1000);
    return remaining > 0 ? remaining : -2;
  }),

  keys: vi.fn(async (pattern: string) => {
    const regex = new RegExp(
      "^" + pattern.replace(/\*/g, ".*").replace(/\?/g, ".") + "$"
    );
    return Array.from(cacheStore.keys()).filter((key) => regex.test(key));
  }),

  flushall: vi.fn(async () => {
    cacheStore.clear();
    return "OK";
  }),

  ping: vi.fn(async () => "PONG"),

  quit: vi.fn(async () => "OK"),

  disconnect: vi.fn(async () => {}),

  connect: vi.fn(async () => {}),
});

export const redisMock = createRedisMock();
