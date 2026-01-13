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
      post: {
        findUnique: vi.fn(),
        update: vi.fn(),
      },
      reaction: {
        findUnique: vi.fn(),
        findMany: vi.fn(),
        create: vi.fn(),
        delete: vi.fn(),
      },
      userProfile: {
        upsert: vi.fn(),
        updateMany: vi.fn(),
      },
      notification: {
        create: vi.fn(),
      },
      $transaction: vi.fn(),
    },
    default: {
      reaction: { findMany: vi.fn() },
    },
  };
});

import { GET, POST } from "@/app/api/forum/reactions/route";
import { prisma } from "@/lib/prisma";

// Type assertions for mocks
const mockPost = prisma.post as any;
const mockReaction = prisma.reaction as any;
const mockTransaction = prisma.$transaction as any;

const mockPostData = {
  id: "post-1",
  author: "bc1qauthor",
  discussionId: "disc-1",
  discussion: { title: "Test Discussion" },
};

const mockReactions = [
  { type: "LIKE", user: "bc1quser1", createdAt: new Date() },
  { type: "LIKE", user: "bc1quser2", createdAt: new Date() },
  { type: "HEART", user: "bc1quser1", createdAt: new Date() },
];

describe("POST /api/forum/reactions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("adds a new LIKE reaction with notifications", async () => {
    mockPost.findUnique.mockResolvedValue(mockPostData);
    mockReaction.findUnique.mockResolvedValue(null);

    let notificationCreated = false;
    mockTransaction.mockImplementation(async (fn: any) => {
      const ctx = {
        reaction: { create: vi.fn() },
        post: { update: vi.fn() },
        userProfile: { upsert: vi.fn() },
        notification: {
          create: vi.fn().mockImplementation(() => {
            notificationCreated = true;
          }),
        },
      };
      return fn(ctx);
    });

    const request = new NextRequest("http://localhost/api/forum/reactions", {
      method: "POST",
      body: JSON.stringify({
        postId: "post-1",
        user: "bc1qtest",
        type: "LIKE",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.action).toBe("added");
    expect(data.type).toBe("LIKE");
    expect(notificationCreated).toBe(true);
  });

  it("adds a new LIKE reaction without notification for self-like", async () => {
    const selfLikePost = { ...mockPostData, author: "bc1qtest" };
    mockPost.findUnique.mockResolvedValue(selfLikePost);
    mockReaction.findUnique.mockResolvedValue(null);

    let notificationCreated = false;
    mockTransaction.mockImplementation(async (fn: any) => {
      const ctx = {
        reaction: { create: vi.fn() },
        post: { update: vi.fn() },
        userProfile: { upsert: vi.fn() },
        notification: {
          create: vi.fn().mockImplementation(() => {
            notificationCreated = true;
          }),
        },
      };
      return fn(ctx);
    });

    const request = new NextRequest("http://localhost/api/forum/reactions", {
      method: "POST",
      body: JSON.stringify({
        postId: "post-1",
        user: "bc1qtest", // Same as author
        type: "LIKE",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.action).toBe("added");
    expect(notificationCreated).toBe(false);
  });

  it("adds a new non-LIKE reaction", async () => {
    mockPost.findUnique.mockResolvedValue(mockPostData);
    mockReaction.findUnique.mockResolvedValue(null);
    mockTransaction.mockImplementation(async (fn: any) => {
      const ctx = {
        reaction: { create: vi.fn() },
        post: { update: vi.fn() },
        userProfile: { upsert: vi.fn() },
        notification: { create: vi.fn() },
      };
      return fn(ctx);
    });

    const request = new NextRequest("http://localhost/api/forum/reactions", {
      method: "POST",
      body: JSON.stringify({
        postId: "post-1",
        user: "bc1qtest",
        type: "HEART",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.action).toBe("added");
    expect(data.type).toBe("HEART");
  });

  it("removes existing reaction (toggle off)", async () => {
    mockPost.findUnique.mockResolvedValue(mockPostData);
    mockReaction.findUnique.mockResolvedValue({
      id: "reaction-1",
      postId: "post-1",
      user: "bc1qtest",
      type: "LIKE",
    });
    mockTransaction.mockImplementation(async (fn: any) => {
      const ctx = {
        reaction: { delete: vi.fn() },
        post: { update: vi.fn() },
        userProfile: { updateMany: vi.fn() },
      };
      return fn(ctx);
    });

    const request = new NextRequest("http://localhost/api/forum/reactions", {
      method: "POST",
      body: JSON.stringify({
        postId: "post-1",
        user: "bc1qtest",
        type: "LIKE",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.action).toBe("removed");
    expect(data.type).toBe("LIKE");
  });

  it("removes existing non-LIKE reaction (toggle off)", async () => {
    mockPost.findUnique.mockResolvedValue(mockPostData);
    mockReaction.findUnique.mockResolvedValue({
      id: "reaction-1",
      postId: "post-1",
      user: "bc1qtest",
      type: "HEART",
    });
    mockTransaction.mockImplementation(async (fn: any) => {
      const ctx = {
        reaction: { delete: vi.fn() },
        post: { update: vi.fn() },
        userProfile: { updateMany: vi.fn() },
      };
      return fn(ctx);
    });

    const request = new NextRequest("http://localhost/api/forum/reactions", {
      method: "POST",
      body: JSON.stringify({
        postId: "post-1",
        user: "bc1qtest",
        type: "HEART",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.action).toBe("removed");
    expect(data.type).toBe("HEART");
  });

  it("returns 400 for missing required fields", async () => {
    const request = new NextRequest("http://localhost/api/forum/reactions", {
      method: "POST",
      body: JSON.stringify({
        postId: "post-1",
        // Missing user and type
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain("Missing required fields");
  });

  it("returns 400 for invalid reaction type", async () => {
    const request = new NextRequest("http://localhost/api/forum/reactions", {
      method: "POST",
      body: JSON.stringify({
        postId: "post-1",
        user: "bc1qtest",
        type: "INVALID_TYPE",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain("Invalid reaction type");
  });

  it("returns 404 for non-existent post", async () => {
    mockPost.findUnique.mockResolvedValue(null);

    const request = new NextRequest("http://localhost/api/forum/reactions", {
      method: "POST",
      body: JSON.stringify({
        postId: "non-existent",
        user: "bc1qtest",
        type: "LIKE",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe("Post not found");
  });

  it("accepts all valid reaction types", async () => {
    mockPost.findUnique.mockResolvedValue(mockPostData);
    mockReaction.findUnique.mockResolvedValue(null);
    mockTransaction.mockResolvedValue(undefined);

    const validTypes = ["like", "heart", "celebrate", "thinking", "disagree"];

    for (const type of validTypes) {
      const request = new NextRequest("http://localhost/api/forum/reactions", {
        method: "POST",
        body: JSON.stringify({
          postId: "post-1",
          user: "bc1qtest",
          type,
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
    }
  });

  it("normalizes reaction type to uppercase", async () => {
    mockPost.findUnique.mockResolvedValue(mockPostData);
    mockReaction.findUnique.mockResolvedValue(null);
    mockTransaction.mockResolvedValue(undefined);

    const request = new NextRequest("http://localhost/api/forum/reactions", {
      method: "POST",
      body: JSON.stringify({
        postId: "post-1",
        user: "bc1qtest",
        type: "like", // lowercase
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(data.type).toBe("LIKE"); // Should be uppercase
  });

  it("handles database errors", async () => {
    mockPost.findUnique.mockRejectedValue(new Error("DB error"));

    const request = new NextRequest("http://localhost/api/forum/reactions", {
      method: "POST",
      body: JSON.stringify({
        postId: "post-1",
        user: "bc1qtest",
        type: "LIKE",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Failed to toggle reaction");
  });
});

describe("GET /api/forum/reactions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns reactions for a post", async () => {
    mockReaction.findMany.mockResolvedValue(mockReactions);

    const request = new NextRequest(
      "http://localhost/api/forum/reactions?postId=post-1"
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.counts.LIKE).toBe(2);
    expect(data.counts.HEART).toBe(1);
    expect(data.byType.LIKE).toContain("bc1quser1");
    expect(data.byType.LIKE).toContain("bc1quser2");
    expect(data.total).toBe(3);
  });

  it("returns 400 when postId is missing", async () => {
    const request = new NextRequest("http://localhost/api/forum/reactions");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Missing postId parameter");
  });

  it("returns empty counts for post with no reactions", async () => {
    mockReaction.findMany.mockResolvedValue([]);

    const request = new NextRequest(
      "http://localhost/api/forum/reactions?postId=post-1"
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.counts).toEqual({});
    expect(data.total).toBe(0);
  });

  it("handles database errors", async () => {
    mockReaction.findMany.mockRejectedValue(new Error("DB error"));

    const request = new NextRequest(
      "http://localhost/api/forum/reactions?postId=post-1"
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Failed to fetch reactions");
  });
});
