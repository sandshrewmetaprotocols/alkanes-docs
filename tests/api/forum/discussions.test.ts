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
      discussion: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        count: vi.fn(),
        create: vi.fn(),
      },
      category: {
        findUnique: vi.fn(),
      },
      proposal: {
        findUnique: vi.fn(),
      },
      post: {
        create: vi.fn(),
      },
      discussionParticipant: {
        create: vi.fn(),
      },
      tag: {
        findUnique: vi.fn(),
      },
      discussionTag: {
        create: vi.fn(),
      },
      userProfile: {
        upsert: vi.fn(),
      },
      $transaction: vi.fn(),
    },
    default: {
      discussion: { findMany: vi.fn(), count: vi.fn() },
    },
  };
});

import { GET, POST } from "@/app/api/forum/discussions/route";
import { prisma } from "@/lib/prisma";

// Type assertions for mocks
const mockDiscussion = prisma.discussion as any;
const mockCategory = prisma.category as any;
const mockProposal = prisma.proposal as any;
const mockTransaction = prisma.$transaction as any;

const mockCategoryData = {
  id: "cat-1",
  name: "General",
  slug: "general",
  color: "#6366f1",
};

const mockDiscussions = [
  {
    id: "disc-1",
    title: "Pinned Discussion",
    slug: "pinned-discussion",
    author: "bc1qauthor1",
    categoryId: "cat-1",
    type: "GENERAL",
    isPinned: true,
    isLocked: false,
    isHidden: false,
    postsCount: 10,
    viewsCount: 100,
    bumpedAt: new Date(),
    category: mockCategoryData,
    tags: [],
    proposal: null,
    _count: { posts: 10, participants: 5 },
  },
  {
    id: "disc-2",
    title: "Regular Discussion",
    slug: "regular-discussion",
    author: "bc1qauthor2",
    categoryId: "cat-1",
    type: "GENERAL",
    isPinned: false,
    isLocked: false,
    isHidden: false,
    postsCount: 5,
    viewsCount: 50,
    bumpedAt: new Date(Date.now() - 3600000),
    category: mockCategoryData,
    tags: [{ tag: { id: "tag-1", name: "Test", slug: "test", color: "#000" } }],
    proposal: null,
    _count: { posts: 5, participants: 3 },
  },
];

const mockProposalData = {
  id: "prop-1",
  title: "Test Proposal",
  state: "ACTIVE",
};

describe("GET /api/forum/discussions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns paginated discussions", async () => {
    mockDiscussion.findMany.mockResolvedValue(mockDiscussions);
    mockDiscussion.count.mockResolvedValue(2);

    const request = new NextRequest("http://localhost/api/forum/discussions");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.discussions).toHaveLength(2);
    expect(data.pagination.total).toBe(2);
  });

  it("filters hidden discussions", async () => {
    mockDiscussion.findMany.mockResolvedValue([]);
    mockDiscussion.count.mockResolvedValue(0);

    const request = new NextRequest("http://localhost/api/forum/discussions");
    await GET(request);

    expect(mockDiscussion.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ isHidden: false }),
      })
    );
  });

  it("filters by category", async () => {
    mockDiscussion.findMany.mockResolvedValue([mockDiscussions[0]]);
    mockDiscussion.count.mockResolvedValue(1);

    const request = new NextRequest(
      "http://localhost/api/forum/discussions?category=cat-1"
    );
    await GET(request);

    expect(mockDiscussion.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ categoryId: "cat-1" }),
      })
    );
  });

  it("filters by type", async () => {
    mockDiscussion.findMany.mockResolvedValue([]);
    mockDiscussion.count.mockResolvedValue(0);

    const request = new NextRequest(
      "http://localhost/api/forum/discussions?type=proposal"
    );
    await GET(request);

    expect(mockDiscussion.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ type: "PROPOSAL" }),
      })
    );
  });

  it("filters by author", async () => {
    mockDiscussion.findMany.mockResolvedValue([]);
    mockDiscussion.count.mockResolvedValue(0);

    const request = new NextRequest(
      "http://localhost/api/forum/discussions?author=bc1qauthor1"
    );
    await GET(request);

    expect(mockDiscussion.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ author: "bc1qauthor1" }),
      })
    );
  });

  it("filters by tag", async () => {
    mockDiscussion.findMany.mockResolvedValue([]);
    mockDiscussion.count.mockResolvedValue(0);

    const request = new NextRequest(
      "http://localhost/api/forum/discussions?tag=test-tag"
    );
    await GET(request);

    expect(mockDiscussion.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          tags: { some: { tag: { slug: "test-tag" } } },
        }),
      })
    );
  });

  it("filters by proposal", async () => {
    mockDiscussion.findMany.mockResolvedValue([]);
    mockDiscussion.count.mockResolvedValue(0);

    const request = new NextRequest(
      "http://localhost/api/forum/discussions?proposal=prop-123"
    );
    await GET(request);

    expect(mockDiscussion.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ proposalId: "prop-123" }),
      })
    );
  });

  it("sorts by created", async () => {
    mockDiscussion.findMany.mockResolvedValue([]);
    mockDiscussion.count.mockResolvedValue(0);

    const request = new NextRequest(
      "http://localhost/api/forum/discussions?sort=created"
    );
    await GET(request);

    expect(mockDiscussion.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: expect.arrayContaining([{ createdAt: "desc" }]),
      })
    );
  });

  it("sorts by posts count", async () => {
    mockDiscussion.findMany.mockResolvedValue([]);
    mockDiscussion.count.mockResolvedValue(0);

    const request = new NextRequest(
      "http://localhost/api/forum/discussions?sort=posts"
    );
    await GET(request);

    expect(mockDiscussion.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: expect.arrayContaining([{ postsCount: "desc" }]),
      })
    );
  });

  it("handles pagination", async () => {
    mockDiscussion.findMany.mockResolvedValue([]);
    mockDiscussion.count.mockResolvedValue(100);

    const request = new NextRequest(
      "http://localhost/api/forum/discussions?page=3&limit=10"
    );
    const response = await GET(request);
    const data = await response.json();

    expect(mockDiscussion.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 20,
        take: 10,
      })
    );
    expect(data.pagination.pages).toBe(10);
  });

  it("transforms tags in response", async () => {
    mockDiscussion.findMany.mockResolvedValue(mockDiscussions);
    mockDiscussion.count.mockResolvedValue(2);

    const request = new NextRequest("http://localhost/api/forum/discussions");
    const response = await GET(request);
    const data = await response.json();

    expect(data.discussions[1].tags[0].name).toBe("Test");
  });

  it("handles database errors", async () => {
    mockDiscussion.findMany.mockRejectedValue(new Error("DB error"));

    const request = new NextRequest("http://localhost/api/forum/discussions");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Failed to fetch discussions");
  });
});

describe("POST /api/forum/discussions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a new discussion", async () => {
    const newDiscussion = {
      id: "disc-new",
      title: "New Discussion",
      slug: "new-discussion",
      author: "bc1qtest",
      categoryId: "cat-1",
      type: "GENERAL",
    };

    mockDiscussion.findUnique.mockResolvedValue(null); // No existing slug
    mockCategory.findUnique.mockResolvedValue(mockCategoryData);
    mockTransaction.mockImplementation(async (fn: any) => {
      return fn({
        discussion: { create: vi.fn().mockResolvedValue(newDiscussion) },
        post: { create: vi.fn() },
        discussionParticipant: { create: vi.fn() },
        tag: { findUnique: vi.fn().mockResolvedValue(null) },
        discussionTag: { create: vi.fn() },
        userProfile: { upsert: vi.fn() },
      });
    });
    mockDiscussion.findUnique
      .mockResolvedValueOnce(null) // First call for slug check
      .mockResolvedValue({ ...newDiscussion, category: mockCategoryData, tags: [], posts: [] });

    const request = new NextRequest("http://localhost/api/forum/discussions", {
      method: "POST",
      body: JSON.stringify({
        title: "New Discussion",
        content: "Discussion content **with markdown**",
        categoryId: "cat-1",
        author: "bc1qtest",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.discussion).toBeDefined();
  });

  it("returns 400 for missing required fields", async () => {
    const request = new NextRequest("http://localhost/api/forum/discussions", {
      method: "POST",
      body: JSON.stringify({
        title: "Missing content",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain("Missing required fields");
  });

  it("returns 404 when category not found", async () => {
    mockDiscussion.findUnique.mockResolvedValue(null);
    mockCategory.findUnique.mockResolvedValue(null);

    const request = new NextRequest("http://localhost/api/forum/discussions", {
      method: "POST",
      body: JSON.stringify({
        title: "Test",
        content: "Content",
        categoryId: "non-existent",
        author: "bc1qtest",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe("Category not found");
  });

  it("returns 404 when linking to non-existent proposal", async () => {
    mockDiscussion.findUnique.mockResolvedValue(null);
    mockCategory.findUnique.mockResolvedValue(mockCategoryData);
    mockProposal.findUnique.mockResolvedValue(null);

    const request = new NextRequest("http://localhost/api/forum/discussions", {
      method: "POST",
      body: JSON.stringify({
        title: "Test",
        content: "Content",
        categoryId: "cat-1",
        author: "bc1qtest",
        proposalId: "non-existent-prop",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe("Proposal not found");
  });

  it("returns 400 when proposal already has discussion", async () => {
    mockDiscussion.findUnique
      .mockResolvedValueOnce(null) // Slug check
      .mockResolvedValueOnce({ id: "existing-disc" }); // proposalId check
    mockCategory.findUnique.mockResolvedValue(mockCategoryData);
    mockProposal.findUnique.mockResolvedValue(mockProposalData);

    const request = new NextRequest("http://localhost/api/forum/discussions", {
      method: "POST",
      body: JSON.stringify({
        title: "Test",
        content: "Content",
        categoryId: "cat-1",
        author: "bc1qtest",
        proposalId: "prop-1",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Proposal already has a discussion");
  });

  it("handles slug collision by appending suffix", async () => {
    mockDiscussion.findUnique
      .mockResolvedValueOnce({ id: "existing" }) // First slug exists
      .mockResolvedValueOnce(null); // With suffix doesn't exist
    mockCategory.findUnique.mockResolvedValue(mockCategoryData);

    const newDiscussion = {
      id: "disc-new",
      title: "Test",
      slug: "test-1",
      author: "bc1qtest",
    };

    mockTransaction.mockImplementation(async (fn: any) => {
      return fn({
        discussion: { create: vi.fn().mockResolvedValue(newDiscussion) },
        post: { create: vi.fn() },
        discussionParticipant: { create: vi.fn() },
        tag: { findUnique: vi.fn().mockResolvedValue(null) },
        userProfile: { upsert: vi.fn() },
      });
    });

    mockDiscussion.findUnique
      .mockResolvedValueOnce({ id: "existing" })
      .mockResolvedValueOnce(null)
      .mockResolvedValue({ ...newDiscussion, category: mockCategoryData, tags: [], posts: [] });

    const request = new NextRequest("http://localhost/api/forum/discussions", {
      method: "POST",
      body: JSON.stringify({
        title: "Test",
        content: "Content",
        categoryId: "cat-1",
        author: "bc1qtest",
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(201);
  });

  it("handles database errors", async () => {
    mockDiscussion.findUnique.mockRejectedValue(new Error("DB error"));

    const request = new NextRequest("http://localhost/api/forum/discussions", {
      method: "POST",
      body: JSON.stringify({
        title: "Test",
        content: "Content",
        categoryId: "cat-1",
        author: "bc1qtest",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Failed to create discussion");
  });

  it("creates a discussion with tags", async () => {
    const newDiscussion = {
      id: "disc-new",
      title: "Tagged Discussion",
      slug: "tagged-discussion",
      author: "bc1qtest",
      categoryId: "cat-1",
      type: "GENERAL",
    };

    mockDiscussion.findUnique.mockResolvedValue(null);
    mockCategory.findUnique.mockResolvedValue(mockCategoryData);

    let tagFound = false;
    let discussionTagCreated = false;
    let tagUpdated = false;

    mockTransaction.mockImplementation(async (fn: any) => {
      return fn({
        discussion: { create: vi.fn().mockResolvedValue(newDiscussion) },
        post: { create: vi.fn() },
        discussionParticipant: { create: vi.fn() },
        tag: {
          findUnique: vi.fn().mockImplementation(() => {
            tagFound = true;
            return { id: "tag-1", slug: "test-tag", name: "Test Tag" };
          }),
          update: vi.fn().mockImplementation(() => {
            tagUpdated = true;
          }),
        },
        discussionTag: {
          create: vi.fn().mockImplementation(() => {
            discussionTagCreated = true;
          }),
        },
        userProfile: { upsert: vi.fn() },
      });
    });

    mockDiscussion.findUnique
      .mockResolvedValueOnce(null)
      .mockResolvedValue({
        ...newDiscussion,
        category: mockCategoryData,
        tags: [{ tag: { id: "tag-1", name: "Test Tag", slug: "test-tag" } }],
        posts: [],
      });

    const request = new NextRequest("http://localhost/api/forum/discussions", {
      method: "POST",
      body: JSON.stringify({
        title: "Tagged Discussion",
        content: "Content with tags",
        categoryId: "cat-1",
        author: "bc1qtest",
        tags: ["test-tag"],
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.discussion).toBeDefined();
    expect(tagFound).toBe(true);
    expect(discussionTagCreated).toBe(true);
    expect(tagUpdated).toBe(true);
  });

  it("skips non-existent tags when creating discussion", async () => {
    const newDiscussion = {
      id: "disc-new",
      title: "Discussion with non-existent tag",
      slug: "discussion-with-non-existent-tag",
      author: "bc1qtest",
      categoryId: "cat-1",
      type: "GENERAL",
    };

    mockDiscussion.findUnique.mockResolvedValue(null);
    mockCategory.findUnique.mockResolvedValue(mockCategoryData);

    let discussionTagCreated = false;

    mockTransaction.mockImplementation(async (fn: any) => {
      return fn({
        discussion: { create: vi.fn().mockResolvedValue(newDiscussion) },
        post: { create: vi.fn() },
        discussionParticipant: { create: vi.fn() },
        tag: {
          findUnique: vi.fn().mockResolvedValue(null), // Tag not found
        },
        discussionTag: {
          create: vi.fn().mockImplementation(() => {
            discussionTagCreated = true;
          }),
        },
        userProfile: { upsert: vi.fn() },
      });
    });

    mockDiscussion.findUnique
      .mockResolvedValueOnce(null)
      .mockResolvedValue({
        ...newDiscussion,
        category: mockCategoryData,
        tags: [],
        posts: [],
      });

    const request = new NextRequest("http://localhost/api/forum/discussions", {
      method: "POST",
      body: JSON.stringify({
        title: "Discussion with non-existent tag",
        content: "Content",
        categoryId: "cat-1",
        author: "bc1qtest",
        tags: ["non-existent-tag"],
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(201);
    expect(discussionTagCreated).toBe(false); // Tag wasn't created because tag didn't exist
  });
});
