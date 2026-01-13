import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// Mock prisma module - must be before imports
vi.mock("@/lib/prisma", () => {
  return {
    prisma: {
      discussion: {
        findFirst: vi.fn(),
        update: vi.fn(),
      },
      post: {
        findMany: vi.fn(),
        count: vi.fn(),
      },
      discussionParticipant: {
        findUnique: vi.fn(),
        update: vi.fn(),
      },
    },
    default: {
      discussion: { findFirst: vi.fn() },
    },
  };
});

import { GET, PATCH } from "@/app/api/forum/discussions/[slug]/route";
import { prisma } from "@/lib/prisma";

// Type assertions for mocks
const mockDiscussion = prisma.discussion as any;
const mockPost = prisma.post as any;
const mockParticipant = prisma.discussionParticipant as any;

const mockCategory = {
  id: "cat-1",
  name: "General",
  slug: "general",
  color: "#6366f1",
};

const mockDiscussionData = {
  id: "disc-1",
  title: "Test Discussion",
  slug: "test-discussion",
  author: "bc1qauthor",
  categoryId: "cat-1",
  type: "GENERAL",
  isPinned: false,
  isLocked: false,
  isHidden: false,
  postsCount: 5,
  viewsCount: 100,
  category: mockCategory,
  tags: [{ tag: { id: "tag-1", name: "Test", slug: "test", color: "#000" } }],
  proposal: null,
  participants: [
    { user: "bc1qauthor", postsCount: 3 },
    { user: "bc1quser1", postsCount: 2 },
  ],
};

const mockPosts = [
  {
    id: "post-1",
    discussionId: "disc-1",
    author: "bc1qauthor",
    raw: "First post",
    cooked: "<p>First post</p>",
    postNumber: 1,
    isHidden: false,
    reactions: [
      { type: "LIKE", user: "bc1quser1" },
      { type: "LIKE", user: "bc1quser2" },
    ],
    replyTo: null,
    _count: { replies: 1 },
  },
  {
    id: "post-2",
    discussionId: "disc-1",
    author: "bc1quser1",
    raw: "Reply post",
    cooked: "<p>Reply post</p>",
    postNumber: 2,
    isHidden: false,
    reactions: [],
    replyTo: { id: "post-1", postNumber: 1, author: "bc1qauthor" },
    _count: { replies: 0 },
  },
];

describe("GET /api/forum/discussions/[slug]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns discussion with posts", async () => {
    mockDiscussion.findFirst.mockResolvedValue(mockDiscussionData);
    mockDiscussion.update.mockResolvedValue(mockDiscussionData);
    mockPost.findMany.mockResolvedValue(mockPosts);
    mockPost.count.mockResolvedValue(2);

    const request = new NextRequest(
      "http://localhost/api/forum/discussions/test-discussion"
    );
    const response = await GET(request, {
      params: Promise.resolve({ slug: "test-discussion" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.discussion.id).toBe("disc-1");
    expect(data.posts).toHaveLength(2);
    expect(data.pagination.total).toBe(2);
  });

  it("returns 404 for non-existent discussion", async () => {
    mockDiscussion.findFirst.mockResolvedValue(null);

    const request = new NextRequest(
      "http://localhost/api/forum/discussions/non-existent"
    );
    const response = await GET(request, {
      params: Promise.resolve({ slug: "non-existent" }),
    });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe("Discussion not found");
  });

  it("increments view count", async () => {
    mockDiscussion.findFirst.mockResolvedValue(mockDiscussionData);
    mockDiscussion.update.mockResolvedValue(mockDiscussionData);
    mockPost.findMany.mockResolvedValue([]);
    mockPost.count.mockResolvedValue(0);

    const request = new NextRequest(
      "http://localhost/api/forum/discussions/test-discussion"
    );
    await GET(request, {
      params: Promise.resolve({ slug: "test-discussion" }),
    });

    expect(mockDiscussion.update).toHaveBeenCalledWith({
      where: { id: "disc-1" },
      data: { viewsCount: { increment: 1 } },
    });
  });

  it("handles pagination", async () => {
    mockDiscussion.findFirst.mockResolvedValue(mockDiscussionData);
    mockDiscussion.update.mockResolvedValue(mockDiscussionData);
    mockPost.findMany.mockResolvedValue([]);
    mockPost.count.mockResolvedValue(100);

    const request = new NextRequest(
      "http://localhost/api/forum/discussions/test-discussion?page=2&limit=20"
    );
    const response = await GET(request, {
      params: Promise.resolve({ slug: "test-discussion" }),
    });
    const data = await response.json();

    expect(mockPost.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 20,
        take: 20,
      })
    );
    expect(data.pagination.pages).toBe(5);
  });

  it("aggregates reaction counts", async () => {
    mockDiscussion.findFirst.mockResolvedValue(mockDiscussionData);
    mockDiscussion.update.mockResolvedValue(mockDiscussionData);
    mockPost.findMany.mockResolvedValue(mockPosts);
    mockPost.count.mockResolvedValue(2);

    const request = new NextRequest(
      "http://localhost/api/forum/discussions/test-discussion"
    );
    const response = await GET(request, {
      params: Promise.resolve({ slug: "test-discussion" }),
    });
    const data = await response.json();

    expect(data.posts[0].reactionCounts.LIKE).toBe(2);
  });

  it("tracks viewer reading progress", async () => {
    mockDiscussion.findFirst.mockResolvedValue(mockDiscussionData);
    mockDiscussion.update.mockResolvedValue(mockDiscussionData);
    mockPost.findMany.mockResolvedValue(mockPosts);
    mockPost.count.mockResolvedValue(2);
    mockParticipant.findUnique.mockResolvedValue({
      id: "part-1",
      discussionId: "disc-1",
      user: "bc1qviewer",
      lastReadPostNumber: 1,
      notificationLevel: "WATCHING",
    });
    mockParticipant.update.mockResolvedValue({});

    const request = new NextRequest(
      "http://localhost/api/forum/discussions/test-discussion?viewer=bc1qviewer"
    );
    const response = await GET(request, {
      params: Promise.resolve({ slug: "test-discussion" }),
    });
    const data = await response.json();

    expect(data.viewer).toBeDefined();
    expect(data.viewer.lastReadPostNumber).toBe(1);
    expect(mockParticipant.update).toHaveBeenCalled();
  });

  it("transforms tags in response", async () => {
    mockDiscussion.findFirst.mockResolvedValue(mockDiscussionData);
    mockDiscussion.update.mockResolvedValue(mockDiscussionData);
    mockPost.findMany.mockResolvedValue([]);
    mockPost.count.mockResolvedValue(0);

    const request = new NextRequest(
      "http://localhost/api/forum/discussions/test-discussion"
    );
    const response = await GET(request, {
      params: Promise.resolve({ slug: "test-discussion" }),
    });
    const data = await response.json();

    expect(data.discussion.tags[0].name).toBe("Test");
  });

  it("handles database errors", async () => {
    mockDiscussion.findFirst.mockRejectedValue(new Error("DB error"));

    const request = new NextRequest(
      "http://localhost/api/forum/discussions/test-discussion"
    );
    const response = await GET(request, {
      params: Promise.resolve({ slug: "test-discussion" }),
    });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Failed to fetch discussion");
  });
});

describe("PATCH /api/forum/discussions/[slug]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("updates discussion title", async () => {
    mockDiscussion.findFirst.mockResolvedValue(mockDiscussionData);
    mockDiscussion.update.mockResolvedValue({
      ...mockDiscussionData,
      title: "Updated Title",
    });

    const request = new NextRequest(
      "http://localhost/api/forum/discussions/test-discussion",
      {
        method: "PATCH",
        body: JSON.stringify({
          title: "Updated Title",
          author: "bc1qauthor",
        }),
      }
    );
    const response = await PATCH(request, {
      params: Promise.resolve({ slug: "test-discussion" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(mockDiscussion.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ title: "Updated Title" }),
      })
    );
  });

  it("locks a discussion", async () => {
    mockDiscussion.findFirst.mockResolvedValue(mockDiscussionData);
    mockDiscussion.update.mockResolvedValue({
      ...mockDiscussionData,
      isLocked: true,
    });

    const request = new NextRequest(
      "http://localhost/api/forum/discussions/test-discussion",
      {
        method: "PATCH",
        body: JSON.stringify({
          isLocked: true,
          author: "bc1qauthor",
        }),
      }
    );
    const response = await PATCH(request, {
      params: Promise.resolve({ slug: "test-discussion" }),
    });

    expect(response.status).toBe(200);
    expect(mockDiscussion.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ isLocked: true }),
      })
    );
  });

  it("pins a discussion", async () => {
    mockDiscussion.findFirst.mockResolvedValue(mockDiscussionData);
    mockDiscussion.update.mockResolvedValue({
      ...mockDiscussionData,
      isPinned: true,
    });

    const request = new NextRequest(
      "http://localhost/api/forum/discussions/test-discussion",
      {
        method: "PATCH",
        body: JSON.stringify({
          isPinned: true,
          author: "bc1qauthor",
        }),
      }
    );
    const response = await PATCH(request, {
      params: Promise.resolve({ slug: "test-discussion" }),
    });

    expect(response.status).toBe(200);
    expect(mockDiscussion.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ isPinned: true }),
      })
    );
  });

  it("hides a discussion", async () => {
    mockDiscussion.findFirst.mockResolvedValue(mockDiscussionData);
    mockDiscussion.update.mockResolvedValue({
      ...mockDiscussionData,
      isHidden: true,
    });

    const request = new NextRequest(
      "http://localhost/api/forum/discussions/test-discussion",
      {
        method: "PATCH",
        body: JSON.stringify({
          isHidden: true,
          author: "bc1qauthor",
        }),
      }
    );
    const response = await PATCH(request, {
      params: Promise.resolve({ slug: "test-discussion" }),
    });

    expect(response.status).toBe(200);
    expect(mockDiscussion.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ isHidden: true }),
      })
    );
  });

  it("returns 404 for non-existent discussion", async () => {
    mockDiscussion.findFirst.mockResolvedValue(null);

    const request = new NextRequest(
      "http://localhost/api/forum/discussions/non-existent",
      {
        method: "PATCH",
        body: JSON.stringify({
          title: "New Title",
          author: "bc1qauthor",
        }),
      }
    );
    const response = await PATCH(request, {
      params: Promise.resolve({ slug: "non-existent" }),
    });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe("Discussion not found");
  });

  it("handles database errors", async () => {
    mockDiscussion.findFirst.mockRejectedValue(new Error("DB error"));

    const request = new NextRequest(
      "http://localhost/api/forum/discussions/test-discussion",
      {
        method: "PATCH",
        body: JSON.stringify({
          title: "New Title",
          author: "bc1qauthor",
        }),
      }
    );
    const response = await PATCH(request, {
      params: Promise.resolve({ slug: "test-discussion" }),
    });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Failed to update discussion");
  });
});
