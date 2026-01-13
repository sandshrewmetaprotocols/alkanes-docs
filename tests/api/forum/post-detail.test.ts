import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// Mock prisma module - must be before imports
vi.mock("@/lib/prisma", () => {
  return {
    prisma: {
      post: {
        findUnique: vi.fn(),
        update: vi.fn(),
      },
      postRevision: {
        count: vi.fn(),
        create: vi.fn(),
      },
      $transaction: vi.fn(),
    },
    default: {
      post: { findUnique: vi.fn() },
    },
  };
});

import { GET, PATCH, DELETE } from "@/app/api/forum/posts/[id]/route";
import { prisma } from "@/lib/prisma";

// Type assertions for mocks
const mockPost = prisma.post as any;
const mockTransaction = prisma.$transaction as any;

const mockPostData = {
  id: "post-1",
  discussionId: "disc-1",
  author: "bc1qauthor",
  raw: "Test content",
  cooked: "<p>Test content</p>",
  postNumber: 1,
  isHidden: false,
  isEdited: false,
  discussion: {
    id: "disc-1",
    title: "Test Discussion",
    slug: "test-discussion",
  },
  replyTo: null,
  replies: [
    { id: "post-2", postNumber: 2, author: "bc1quser1" },
  ],
  reactions: [
    { type: "LIKE", user: "bc1quser1" },
    { type: "LIKE", user: "bc1quser2" },
    { type: "HEART", user: "bc1quser1" },
  ],
  revisions: [],
};

const mockSecondPost = {
  ...mockPostData,
  id: "post-2",
  postNumber: 2,
  author: "bc1quser1",
  replies: [],
};

describe("GET /api/forum/posts/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns post with reactions", async () => {
    mockPost.findUnique.mockResolvedValue(mockPostData);

    const request = new NextRequest("http://localhost/api/forum/posts/post-1");
    const response = await GET(request, {
      params: Promise.resolve({ id: "post-1" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.post.id).toBe("post-1");
    expect(data.post.reactionCounts.LIKE).toBe(2);
    expect(data.post.reactionCounts.HEART).toBe(1);
  });

  it("returns 404 for non-existent post", async () => {
    mockPost.findUnique.mockResolvedValue(null);

    const request = new NextRequest(
      "http://localhost/api/forum/posts/non-existent"
    );
    const response = await GET(request, {
      params: Promise.resolve({ id: "non-existent" }),
    });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe("Post not found");
  });

  it("includes discussion context", async () => {
    mockPost.findUnique.mockResolvedValue(mockPostData);

    const request = new NextRequest("http://localhost/api/forum/posts/post-1");
    const response = await GET(request, {
      params: Promise.resolve({ id: "post-1" }),
    });
    const data = await response.json();

    expect(data.post.discussion.title).toBe("Test Discussion");
    expect(data.post.discussion.slug).toBe("test-discussion");
  });

  it("includes replies", async () => {
    mockPost.findUnique.mockResolvedValue(mockPostData);

    const request = new NextRequest("http://localhost/api/forum/posts/post-1");
    const response = await GET(request, {
      params: Promise.resolve({ id: "post-1" }),
    });
    const data = await response.json();

    expect(data.post.replies).toHaveLength(1);
    expect(data.post.replies[0].postNumber).toBe(2);
  });

  it("handles database errors", async () => {
    mockPost.findUnique.mockRejectedValue(new Error("DB error"));

    const request = new NextRequest("http://localhost/api/forum/posts/post-1");
    const response = await GET(request, {
      params: Promise.resolve({ id: "post-1" }),
    });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Failed to fetch post");
  });
});

describe("PATCH /api/forum/posts/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("updates post content", async () => {
    mockPost.findUnique.mockResolvedValue(mockPostData);
    mockTransaction.mockImplementation(async (fn: any) => {
      const ctx = {
        postRevision: {
          count: vi.fn().mockResolvedValue(0),
          create: vi.fn().mockResolvedValue({}),
        },
        post: {
          update: vi.fn().mockResolvedValue({
            ...mockPostData,
            raw: "Updated content",
            cooked: "<p>Updated content</p>",
            isEdited: true,
          }),
        },
      };
      return fn(ctx);
    });

    const request = new NextRequest("http://localhost/api/forum/posts/post-1", {
      method: "PATCH",
      body: JSON.stringify({
        content: "Updated content",
        author: "bc1qauthor",
        editReason: "Fixed typo",
      }),
    });
    const response = await PATCH(request, {
      params: Promise.resolve({ id: "post-1" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.post.raw).toBe("Updated content");
    expect(data.post.isEdited).toBe(true);
  });

  it("returns 400 for missing required fields", async () => {
    const request = new NextRequest("http://localhost/api/forum/posts/post-1", {
      method: "PATCH",
      body: JSON.stringify({
        // Missing content and author
      }),
    });
    const response = await PATCH(request, {
      params: Promise.resolve({ id: "post-1" }),
    });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Missing required fields: content, author");
  });

  it("returns 404 for non-existent post", async () => {
    mockPost.findUnique.mockResolvedValue(null);

    const request = new NextRequest("http://localhost/api/forum/posts/post-1", {
      method: "PATCH",
      body: JSON.stringify({
        content: "Updated content",
        author: "bc1qauthor",
      }),
    });
    const response = await PATCH(request, {
      params: Promise.resolve({ id: "post-1" }),
    });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe("Post not found");
  });

  it("returns 403 when non-author tries to edit", async () => {
    mockPost.findUnique.mockResolvedValue(mockPostData);

    const request = new NextRequest("http://localhost/api/forum/posts/post-1", {
      method: "PATCH",
      body: JSON.stringify({
        content: "Updated content",
        author: "bc1qhacker", // Not the original author
      }),
    });
    const response = await PATCH(request, {
      params: Promise.resolve({ id: "post-1" }),
    });
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toBe("Only the author can edit this post");
  });

  it("creates revision when editing", async () => {
    mockPost.findUnique.mockResolvedValue(mockPostData);

    let revisionCreated = false;
    mockTransaction.mockImplementation(async (fn: any) => {
      const ctx = {
        postRevision: {
          count: vi.fn().mockResolvedValue(0),
          create: vi.fn().mockImplementation(() => {
            revisionCreated = true;
            return {};
          }),
        },
        post: {
          update: vi.fn().mockResolvedValue({
            ...mockPostData,
            isEdited: true,
          }),
        },
      };
      return fn(ctx);
    });

    const request = new NextRequest("http://localhost/api/forum/posts/post-1", {
      method: "PATCH",
      body: JSON.stringify({
        content: "Updated content",
        author: "bc1qauthor",
      }),
    });
    await PATCH(request, {
      params: Promise.resolve({ id: "post-1" }),
    });

    expect(revisionCreated).toBe(true);
  });

  it("handles database errors", async () => {
    mockPost.findUnique.mockRejectedValue(new Error("DB error"));

    const request = new NextRequest("http://localhost/api/forum/posts/post-1", {
      method: "PATCH",
      body: JSON.stringify({
        content: "Updated content",
        author: "bc1qauthor",
      }),
    });
    const response = await PATCH(request, {
      params: Promise.resolve({ id: "post-1" }),
    });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Failed to update post");
  });
});

describe("DELETE /api/forum/posts/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("soft deletes a post (not first post)", async () => {
    mockPost.findUnique.mockResolvedValue(mockSecondPost);
    mockPost.update.mockResolvedValue({ ...mockSecondPost, isHidden: true });

    const request = new NextRequest(
      "http://localhost/api/forum/posts/post-2?author=bc1quser1"
    );
    const response = await DELETE(request, {
      params: Promise.resolve({ id: "post-2" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(mockPost.update).toHaveBeenCalledWith({
      where: { id: "post-2" },
      data: { isHidden: true },
    });
  });

  it("returns 400 when author parameter is missing", async () => {
    const request = new NextRequest(
      "http://localhost/api/forum/posts/post-2"
    );
    const response = await DELETE(request, {
      params: Promise.resolve({ id: "post-2" }),
    });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Missing author parameter");
  });

  it("returns 404 for non-existent post", async () => {
    mockPost.findUnique.mockResolvedValue(null);

    const request = new NextRequest(
      "http://localhost/api/forum/posts/non-existent?author=bc1quser1"
    );
    const response = await DELETE(request, {
      params: Promise.resolve({ id: "non-existent" }),
    });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe("Post not found");
  });

  it("returns 403 when non-author tries to delete", async () => {
    mockPost.findUnique.mockResolvedValue(mockSecondPost);

    const request = new NextRequest(
      "http://localhost/api/forum/posts/post-2?author=bc1qhacker"
    );
    const response = await DELETE(request, {
      params: Promise.resolve({ id: "post-2" }),
    });
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toBe("Only the author can delete this post");
  });

  it("returns 400 when trying to delete first post", async () => {
    mockPost.findUnique.mockResolvedValue(mockPostData); // postNumber is 1

    const request = new NextRequest(
      "http://localhost/api/forum/posts/post-1?author=bc1qauthor"
    );
    const response = await DELETE(request, {
      params: Promise.resolve({ id: "post-1" }),
    });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Cannot delete the first post. Delete the discussion instead.");
  });

  it("handles database errors", async () => {
    mockPost.findUnique.mockRejectedValue(new Error("DB error"));

    const request = new NextRequest(
      "http://localhost/api/forum/posts/post-2?author=bc1quser1"
    );
    const response = await DELETE(request, {
      params: Promise.resolve({ id: "post-2" }),
    });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Failed to delete post");
  });
});
