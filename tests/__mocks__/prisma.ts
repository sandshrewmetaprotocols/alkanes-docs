import { vi } from "vitest";

// Type-safe mock data store
interface MockStore {
  proposals: Map<string, any>;
  votes: Map<string, any>;
  delegates: Map<string, any>;
  categories: Map<string, any>;
  discussions: Map<string, any>;
  posts: Map<string, any>;
  reactions: Map<string, any>;
  mentions: Map<string, any>;
  tags: Map<string, any>;
  discussionTags: Map<string, any>;
  discussionParticipants: Map<string, any>;
  userProfiles: Map<string, any>;
  votingPowerSnapshots: Map<string, any>;
  addressBalances: Map<string, any>;
  governanceSettings: Map<string, any>;
  notifications: Map<string, any>;
  postRevisions: Map<string, any>;
}

// Generate unique IDs
let idCounter = 0;
export const generateId = () => `mock-id-${++idCounter}`;
export const resetIdCounter = () => { idCounter = 0; };

// Create fresh store
export const createMockStore = (): MockStore => ({
  proposals: new Map(),
  votes: new Map(),
  delegates: new Map(),
  categories: new Map(),
  discussions: new Map(),
  posts: new Map(),
  reactions: new Map(),
  mentions: new Map(),
  tags: new Map(),
  discussionTags: new Map(),
  discussionParticipants: new Map(),
  userProfiles: new Map(),
  votingPowerSnapshots: new Map(),
  addressBalances: new Map(),
  governanceSettings: new Map(),
  notifications: new Map(),
  postRevisions: new Map(),
});

// Global store instance
export let mockStore = createMockStore();

// Reset store between tests
export const resetMockStore = () => {
  mockStore = createMockStore();
  resetIdCounter();
};

// Helper to apply filters
const matchesWhere = (item: any, where: any): boolean => {
  if (!where) return true;

  for (const [key, value] of Object.entries(where)) {
    if (key === "AND") {
      return (value as any[]).every((condition) => matchesWhere(item, condition));
    }
    if (key === "OR") {
      return (value as any[]).some((condition) => matchesWhere(item, condition));
    }
    if (key === "NOT") {
      return !matchesWhere(item, value);
    }
    if (typeof value === "object" && value !== null) {
      if ("equals" in value) {
        if (item[key] !== value.equals) return false;
      } else if ("in" in value) {
        if (!value.in.includes(item[key])) return false;
      } else if ("contains" in value) {
        if (!String(item[key]).includes(value.contains)) return false;
      } else if ("gte" in value) {
        if (item[key] < value.gte) return false;
      } else if ("lte" in value) {
        if (item[key] > value.lte) return false;
      }
    } else {
      if (item[key] !== value) return false;
    }
  }
  return true;
};

// Helper to apply ordering
const applyOrderBy = (items: any[], orderBy: any): any[] => {
  if (!orderBy) return items;

  const sortFns = Array.isArray(orderBy) ? orderBy : [orderBy];

  return [...items].sort((a, b) => {
    for (const sortFn of sortFns) {
      const [key, direction] = Object.entries(sortFn)[0];
      const aVal = a[key];
      const bVal = b[key];

      if (aVal < bVal) return direction === "asc" ? -1 : 1;
      if (aVal > bVal) return direction === "asc" ? 1 : -1;
    }
    return 0;
  });
};

// Create model methods
const createModelMethods = (store: Map<string, any>, modelName: string) => ({
  findMany: vi.fn(async (args?: any) => {
    let items = Array.from(store.values());

    if (args?.where) {
      items = items.filter((item) => matchesWhere(item, args.where));
    }

    if (args?.orderBy) {
      items = applyOrderBy(items, args.orderBy);
    }

    if (args?.skip) {
      items = items.slice(args.skip);
    }

    if (args?.take) {
      items = items.slice(0, args.take);
    }

    // Handle includes
    if (args?.include) {
      items = items.map((item) => ({ ...item, _count: { votes: 0 } }));
    }

    return items;
  }),

  findUnique: vi.fn(async (args: any) => {
    const { where } = args;

    // Handle compound unique keys
    if (where.id) {
      return store.get(where.id) || null;
    }

    // Handle other unique fields
    for (const item of store.values()) {
      if (matchesWhere(item, where)) {
        return item;
      }
    }

    return null;
  }),

  findFirst: vi.fn(async (args?: any) => {
    for (const item of store.values()) {
      if (!args?.where || matchesWhere(item, args.where)) {
        return item;
      }
    }
    return null;
  }),

  create: vi.fn(async (args: any) => {
    const id = args.data.id || generateId();
    const now = new Date();
    const item = {
      id,
      ...args.data,
      createdAt: args.data.createdAt || now,
      updatedAt: args.data.updatedAt || now,
    };
    store.set(id, item);
    return item;
  }),

  update: vi.fn(async (args: any) => {
    const { where, data } = args;
    const id = where.id;
    const existing = store.get(id);

    if (!existing) {
      throw new Error(`Record not found: ${modelName} with id ${id}`);
    }

    const updated = {
      ...existing,
      ...data,
      updatedAt: new Date(),
    };

    // Handle increment operations
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === "object" && value !== null && "increment" in value) {
        updated[key] = (existing[key] || 0) + (value as any).increment;
      }
    }

    store.set(id, updated);
    return updated;
  }),

  upsert: vi.fn(async (args: any) => {
    const { where, create, update } = args;
    let existing = null;

    for (const item of store.values()) {
      if (matchesWhere(item, where)) {
        existing = item;
        break;
      }
    }

    if (existing) {
      const updated = { ...existing, ...update, updatedAt: new Date() };
      store.set(existing.id, updated);
      return updated;
    } else {
      const id = create.id || generateId();
      const now = new Date();
      const item = { id, ...create, createdAt: now, updatedAt: now };
      store.set(id, item);
      return item;
    }
  }),

  delete: vi.fn(async (args: any) => {
    const { where } = args;
    const id = where.id;
    const item = store.get(id);

    if (item) {
      store.delete(id);
    }

    return item || null;
  }),

  deleteMany: vi.fn(async (args?: any) => {
    let count = 0;

    for (const [id, item] of store.entries()) {
      if (!args?.where || matchesWhere(item, args.where)) {
        store.delete(id);
        count++;
      }
    }

    return { count };
  }),

  count: vi.fn(async (args?: any) => {
    let count = 0;

    for (const item of store.values()) {
      if (!args?.where || matchesWhere(item, args.where)) {
        count++;
      }
    }

    return count;
  }),

  aggregate: vi.fn(async (args?: any) => {
    const items = Array.from(store.values()).filter(
      (item) => !args?.where || matchesWhere(item, args.where)
    );

    const result: any = {};

    if (args?._count) {
      result._count = items.length;
    }

    if (args?._sum) {
      result._sum = {};
      for (const field of Object.keys(args._sum)) {
        result._sum[field] = items.reduce((sum, item) => sum + (Number(item[field]) || 0), 0);
      }
    }

    return result;
  }),
});

// Create Prisma mock
export const createPrismaMock = () => {
  const prisma = {
    // Models
    proposal: createModelMethods(mockStore.proposals, "Proposal"),
    vote: createModelMethods(mockStore.votes, "Vote"),
    delegate: createModelMethods(mockStore.delegates, "Delegate"),
    category: createModelMethods(mockStore.categories, "Category"),
    discussion: createModelMethods(mockStore.discussions, "Discussion"),
    post: createModelMethods(mockStore.posts, "Post"),
    reaction: createModelMethods(mockStore.reactions, "Reaction"),
    mention: createModelMethods(mockStore.mentions, "Mention"),
    tag: createModelMethods(mockStore.tags, "Tag"),
    discussionTag: createModelMethods(mockStore.discussionTags, "DiscussionTag"),
    discussionParticipant: createModelMethods(mockStore.discussionParticipants, "DiscussionParticipant"),
    userProfile: createModelMethods(mockStore.userProfiles, "UserProfile"),
    votingPowerSnapshot: createModelMethods(mockStore.votingPowerSnapshots, "VotingPowerSnapshot"),
    addressBalance: createModelMethods(mockStore.addressBalances, "AddressBalance"),
    governanceSettings: createModelMethods(mockStore.governanceSettings, "GovernanceSettings"),
    notification: createModelMethods(mockStore.notifications, "Notification"),
    postRevision: createModelMethods(mockStore.postRevisions, "PostRevision"),

    // Transaction support
    $transaction: vi.fn(async (fn: any) => {
      if (typeof fn === "function") {
        return fn(prisma);
      }
      return Promise.all(fn);
    }),

    // Connect/disconnect
    $connect: vi.fn(),
    $disconnect: vi.fn(),

    // Raw queries
    $queryRaw: vi.fn(async () => [{ "?column?": 1 }]),
    $executeRaw: vi.fn(async () => 0),
  };

  return prisma;
};

// Seed test data helpers
export const seedCategory = (data: Partial<any> = {}) => {
  const id = generateId();
  const category = {
    id,
    name: data.name || "Test Category",
    slug: data.slug || "test-category",
    description: data.description || "Test category description",
    color: data.color || "#10b981",
    position: data.position ?? 0,
    isReadOnly: data.isReadOnly ?? false,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  };
  mockStore.categories.set(id, category);
  return category;
};

export const seedProposal = (data: Partial<any> = {}) => {
  const id = generateId();
  const proposal = {
    id,
    title: data.title || "Test Proposal",
    body: data.body || "Test proposal body",
    choices: data.choices || ["For", "Against", "Abstain"],
    author: data.author || "bc1qtest123",
    authorSig: data.authorSig || "sig123",
    snapshot: data.snapshot ?? 100000,
    start: data.start || new Date(),
    end: data.end || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    quorum: data.quorum ?? BigInt(0),
    state: data.state || "ACTIVE",
    scores: data.scores || ["0", "0", "0"],
    totalVotes: data.totalVotes ?? BigInt(0),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  };
  mockStore.proposals.set(id, proposal);
  return proposal;
};

export const seedDiscussion = (data: Partial<any> = {}) => {
  const id = generateId();
  const discussion = {
    id,
    title: data.title || "Test Discussion",
    slug: data.slug || `test-discussion-${id}`,
    author: data.author || "bc1qtest123",
    categoryId: data.categoryId || generateId(),
    type: data.type || "GENERAL",
    isPinned: data.isPinned ?? false,
    isLocked: data.isLocked ?? false,
    isHidden: data.isHidden ?? false,
    postsCount: data.postsCount ?? 1,
    viewsCount: data.viewsCount ?? 0,
    likesCount: data.likesCount ?? 0,
    lastPostAt: data.lastPostAt || new Date(),
    bumpedAt: data.bumpedAt || new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  };
  mockStore.discussions.set(id, discussion);
  return discussion;
};

export const seedPost = (data: Partial<any> = {}) => {
  const id = generateId();
  const post = {
    id,
    discussionId: data.discussionId || generateId(),
    author: data.author || "bc1qtest123",
    raw: data.raw || "Test post content",
    cooked: data.cooked || "<p>Test post content</p>",
    postNumber: data.postNumber ?? 1,
    postType: data.postType || "REGULAR",
    isHidden: data.isHidden ?? false,
    isEdited: data.isEdited ?? false,
    likesCount: data.likesCount ?? 0,
    repliesCount: data.repliesCount ?? 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  };
  mockStore.posts.set(id, post);
  return post;
};

export const seedUserProfile = (data: Partial<any> = {}) => {
  const id = generateId();
  const profile = {
    id,
    address: data.address || `bc1qtest${id}`,
    displayName: data.displayName || null,
    bio: data.bio || null,
    avatarUrl: data.avatarUrl || null,
    verified: data.verified ?? false,
    postsCount: data.postsCount ?? 0,
    discussionsCount: data.discussionsCount ?? 0,
    likesReceived: data.likesReceived ?? 0,
    likesGiven: data.likesGiven ?? 0,
    dieselBalance: data.dieselBalance ?? BigInt(0),
    trustLevel: data.trustLevel ?? 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  };
  mockStore.userProfiles.set(id, profile);
  return profile;
};

export const seedGovernanceSettings = (data: Partial<any> = {}) => {
  const id = data.id || "default";
  const settings = {
    id,
    votingDelay: data.votingDelay ?? 0,
    votingPeriod: data.votingPeriod ?? 17280,
    proposalThreshold: data.proposalThreshold ?? BigInt(1000000000),
    quorumNumerator: data.quorumNumerator ?? 4,
    quorumDenominator: data.quorumDenominator ?? 100,
    dieselAlkaneBlock: data.dieselAlkaneBlock ?? 2,
    dieselAlkaneTx: data.dieselAlkaneTx ?? 0,
    minDieselToPost: data.minDieselToPost ?? BigInt(0),
    minDieselToCreateDiscussion: data.minDieselToCreateDiscussion ?? BigInt(0),
    updatedAt: new Date(),
    ...data,
  };
  mockStore.governanceSettings.set(id, settings);
  return settings;
};
