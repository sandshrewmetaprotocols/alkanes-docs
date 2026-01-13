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
        findUnique: vi.fn(),
        update: vi.fn(),
      },
      post: {
        findUnique: vi.fn(),
        findFirst: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
      },
      mention: {
        create: vi.fn(),
      },
      notification: {
        create: vi.fn(),
      },
      discussionParticipant: {
        upsert: vi.fn(),
      },
      userProfile: {
        upsert: vi.fn(),
      },
      $transaction: vi.fn(),
    },
    default: {
      discussion: { findUnique: vi.fn() },
    },
  };
});

import { POST } from "@/app/api/forum/posts/route";
import { prisma } from "@/lib/prisma";

// Type assertions for mocks
const mockDiscussion = prisma.discussion as any;
const mockPost = prisma.post as any;
const mockTransaction = prisma.$transaction as any;

const mockDiscussionData = {
  id: "disc-1",
  title: "Test Discussion",
  slug: "test-discussion",
  author: "bc1qauthor",
  isLocked: false,
};

const mockLockedDiscussion = {
  ...mockDiscussionData,
  id: "disc-locked",
  isLocked: true,
};

const mockPostData = {
  id: "post-1",
  discussionId: "disc-1",
  author: "bc1qposter",
  raw: "Test content",
  cooked: "<p>Test content</p>",
  postNumber: 1,
};

describe("POST /api/forum/posts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a new post", async () => {
    const newPost = {
      id: "post-new",
      discussionId: "disc-1",
      author: "bc1qposter",
      raw: "New reply content",
      cooked: "<p>New reply content</p>",
      postNumber: 2,
      replyTo: null,
      _count: { replies: 0 },
    };

    mockDiscussion.findUnique.mockResolvedValue(mockDiscussionData);
    mockTransaction.mockImplementation(async (fn: any) => {
      return fn({
        post: {
          findFirst: vi.fn().mockResolvedValue({ postNumber: 1 }),
          create: vi.fn().mockResolvedValue(newPost),
          update: vi.fn(),
          findUnique: vi.fn().mockResolvedValue(null),
        },
        mention: { create: vi.fn() },
        notification: { create: vi.fn() },
        discussion: { update: vi.fn() },
        discussionParticipant: { upsert: vi.fn() },
        userProfile: { upsert: vi.fn() },
      });
    });
    mockPost.findUnique.mockResolvedValue(newPost);

    const request = new NextRequest("http://localhost/api/forum/posts", {
      method: "POST",
      body: JSON.stringify({
        discussionId: "disc-1",
        content: "New reply content",
        author: "bc1qposter",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.post).toBeDefined();
  });

  it("returns 400 for missing required fields", async () => {
    const request = new NextRequest("http://localhost/api/forum/posts", {
      method: "POST",
      body: JSON.stringify({
        discussionId: "disc-1",
        // Missing content and author
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain("Missing required fields");
  });

  it("returns 404 for non-existent discussion", async () => {
    mockDiscussion.findUnique.mockResolvedValue(null);

    const request = new NextRequest("http://localhost/api/forum/posts", {
      method: "POST",
      body: JSON.stringify({
        discussionId: "non-existent",
        content: "Content",
        author: "bc1qtest",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe("Discussion not found");
  });

  it("returns 403 for locked discussion", async () => {
    mockDiscussion.findUnique.mockResolvedValue(mockLockedDiscussion);

    const request = new NextRequest("http://localhost/api/forum/posts", {
      method: "POST",
      body: JSON.stringify({
        discussionId: "disc-locked",
        content: "Content",
        author: "bc1qtest",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toBe("Discussion is locked");
  });

  it("returns 404 for non-existent reply target", async () => {
    mockDiscussion.findUnique.mockResolvedValue(mockDiscussionData);
    mockPost.findUnique.mockResolvedValue(null);

    const request = new NextRequest("http://localhost/api/forum/posts", {
      method: "POST",
      body: JSON.stringify({
        discussionId: "disc-1",
        content: "Content",
        author: "bc1qtest",
        replyToId: "non-existent-post",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe("Reply target post not found");
  });

  it("returns 404 when reply target is in different discussion", async () => {
    mockDiscussion.findUnique.mockResolvedValue(mockDiscussionData);
    mockPost.findUnique.mockResolvedValue({
      ...mockPostData,
      discussionId: "different-disc",
    });

    const request = new NextRequest("http://localhost/api/forum/posts", {
      method: "POST",
      body: JSON.stringify({
        discussionId: "disc-1",
        content: "Content",
        author: "bc1qtest",
        replyToId: "post-1",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe("Reply target post not found");
  });

  it("extracts and creates mentions", async () => {
    mockDiscussion.findUnique.mockResolvedValue(mockDiscussionData);

    const mentionCreateMock = vi.fn();
    mockTransaction.mockImplementation(async (fn: any) => {
      const ctx = {
        post: {
          findFirst: vi.fn().mockResolvedValue({ postNumber: 1 }),
          create: vi.fn().mockResolvedValue({ id: "post-new", discussionId: "disc-1" }),
          update: vi.fn(),
        },
        mention: {
          create: mentionCreateMock,
        },
        notification: { create: vi.fn() },
        discussion: { update: vi.fn() },
        discussionParticipant: { upsert: vi.fn() },
        userProfile: { upsert: vi.fn() },
      };
      return fn(ctx);
    });
    mockPost.findUnique.mockResolvedValue({ id: "post-new", _count: { replies: 0 } });

    const request = new NextRequest("http://localhost/api/forum/posts", {
      method: "POST",
      body: JSON.stringify({
        discussionId: "disc-1",
        content: "Hello @bc1qtest123456789abcdefghijklmnop!",
        author: "bc1qposter",
      }),
    });

    await POST(request);

    // Verify mention.create was called with the extracted mention
    expect(mentionCreateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          mentioned: "bc1qtest123456789abcdefghijklmnop",
        }),
      })
    );
  });

  it("deduplicates duplicate mentions", async () => {
    mockDiscussion.findUnique.mockResolvedValue(mockDiscussionData);

    const mentionCreateMock = vi.fn();
    mockTransaction.mockImplementation(async (fn: any) => {
      const ctx = {
        post: {
          findFirst: vi.fn().mockResolvedValue({ postNumber: 1 }),
          create: vi.fn().mockResolvedValue({ id: "post-new", discussionId: "disc-1" }),
          update: vi.fn(),
        },
        mention: {
          create: mentionCreateMock,
        },
        notification: { create: vi.fn() },
        discussion: { update: vi.fn() },
        discussionParticipant: { upsert: vi.fn() },
        userProfile: { upsert: vi.fn() },
      };
      return fn(ctx);
    });
    mockPost.findUnique.mockResolvedValue({ id: "post-new", _count: { replies: 0 } });

    const request = new NextRequest("http://localhost/api/forum/posts", {
      method: "POST",
      body: JSON.stringify({
        discussionId: "disc-1",
        // Same mention appearing twice
        content: "Hello @bc1qtest123456789abcdefghijklmnop and @bc1qtest123456789abcdefghijklmnop again!",
        author: "bc1qposter",
      }),
    });

    await POST(request);

    // Should only be called once despite two @mentions
    expect(mentionCreateMock).toHaveBeenCalledTimes(1);
  });

  it("handles first post in discussion (no previous posts)", async () => {
    mockDiscussion.findUnique.mockResolvedValue(mockDiscussionData);

    let createdPostNumber = 0;
    mockTransaction.mockImplementation(async (fn: any) => {
      const ctx = {
        post: {
          findFirst: vi.fn().mockResolvedValue(null), // No previous posts
          create: vi.fn((args: any) => {
            createdPostNumber = args.data.postNumber;
            return { id: "post-new", postNumber: args.data.postNumber };
          }),
          update: vi.fn(),
        },
        mention: { create: vi.fn() },
        notification: { create: vi.fn() },
        discussion: { update: vi.fn() },
        discussionParticipant: { upsert: vi.fn() },
        userProfile: { upsert: vi.fn() },
      };
      return fn(ctx);
    });
    mockPost.findUnique.mockResolvedValue({ id: "post-new", _count: { replies: 0 } });

    const request = new NextRequest("http://localhost/api/forum/posts", {
      method: "POST",
      body: JSON.stringify({
        discussionId: "disc-1",
        content: "First post content",
        author: "bc1qtest",
      }),
    });

    await POST(request);

    expect(createdPostNumber).toBe(1); // Should be 1 since no previous posts
  });

  it("creates reply notification when replying to another user", async () => {
    mockDiscussion.findUnique.mockResolvedValue(mockDiscussionData);
    // Use mockResolvedValueOnce to sequence: first for replyTo check, second for final fetch
    mockPost.findUnique
      .mockResolvedValueOnce({
        ...mockPostData,
        discussionId: "disc-1",
      })
      .mockResolvedValueOnce({ id: "post-reply", _count: { replies: 0 } });

    let notificationCreated = false;
    let notifiedUser = "";
    mockTransaction.mockImplementation(async (fn: any) => {
      const ctx = {
        post: {
          findFirst: vi.fn().mockResolvedValue({ postNumber: 1 }),
          create: vi.fn().mockResolvedValue({ id: "post-reply", discussionId: "disc-1" }),
          update: vi.fn(),
          findUnique: vi.fn().mockResolvedValue({ author: "bc1qauthor" }),
        },
        mention: { create: vi.fn() },
        notification: {
          create: vi.fn().mockImplementation((args: any) => {
            notificationCreated = true;
            notifiedUser = args.data.user;
          }),
        },
        discussion: { update: vi.fn() },
        discussionParticipant: { upsert: vi.fn() },
        userProfile: { upsert: vi.fn() },
      };
      return fn(ctx);
    });

    const request = new NextRequest("http://localhost/api/forum/posts", {
      method: "POST",
      body: JSON.stringify({
        discussionId: "disc-1",
        content: "This is a reply",
        author: "bc1qreplier",
        replyToId: "post-1",
      }),
    });

    await POST(request);

    expect(notificationCreated).toBe(true);
    expect(notifiedUser).toBe("bc1qauthor");
  });

  it("does not create notification when replying to self", async () => {
    mockDiscussion.findUnique.mockResolvedValue(mockDiscussionData);
    // Use mockResolvedValueOnce to sequence: first for replyTo check, second for final fetch
    mockPost.findUnique
      .mockResolvedValueOnce({
        ...mockPostData,
        discussionId: "disc-1",
      })
      .mockResolvedValueOnce({ id: "post-reply", _count: { replies: 0 } });

    let notificationCreated = false;
    mockTransaction.mockImplementation(async (fn: any) => {
      const ctx = {
        post: {
          findFirst: vi.fn().mockResolvedValue({ postNumber: 1 }),
          create: vi.fn().mockResolvedValue({ id: "post-reply", discussionId: "disc-1" }),
          update: vi.fn(),
          findUnique: vi.fn().mockResolvedValue({ author: "bc1qauthor" }),
        },
        mention: { create: vi.fn() },
        notification: {
          create: vi.fn().mockImplementation(() => {
            notificationCreated = true;
          }),
        },
        discussion: { update: vi.fn() },
        discussionParticipant: { upsert: vi.fn() },
        userProfile: { upsert: vi.fn() },
      };
      return fn(ctx);
    });

    const request = new NextRequest("http://localhost/api/forum/posts", {
      method: "POST",
      body: JSON.stringify({
        discussionId: "disc-1",
        content: "Replying to myself",
        author: "bc1qauthor", // Same as post author
        replyToId: "post-1",
      }),
    });

    await POST(request);

    expect(notificationCreated).toBe(false);
  });

  it("increments post number correctly", async () => {
    mockDiscussion.findUnique.mockResolvedValue(mockDiscussionData);

    let createdPostNumber = 0;
    mockTransaction.mockImplementation(async (fn: any) => {
      const ctx = {
        post: {
          findFirst: vi.fn().mockResolvedValue({ postNumber: 5 }),
          create: vi.fn((args: any) => {
            createdPostNumber = args.data.postNumber;
            return { id: "post-new", postNumber: args.data.postNumber };
          }),
          update: vi.fn(),
        },
        mention: { create: vi.fn() },
        notification: { create: vi.fn() },
        discussion: { update: vi.fn() },
        discussionParticipant: { upsert: vi.fn() },
        userProfile: { upsert: vi.fn() },
      };
      return fn(ctx);
    });
    mockPost.findUnique.mockResolvedValue({ id: "post-new", _count: { replies: 0 } });

    const request = new NextRequest("http://localhost/api/forum/posts", {
      method: "POST",
      body: JSON.stringify({
        discussionId: "disc-1",
        content: "Content",
        author: "bc1qtest",
      }),
    });

    await POST(request);

    expect(createdPostNumber).toBe(6);
  });

  it("handles database errors", async () => {
    mockDiscussion.findUnique.mockRejectedValue(new Error("DB error"));

    const request = new NextRequest("http://localhost/api/forum/posts", {
      method: "POST",
      body: JSON.stringify({
        discussionId: "disc-1",
        content: "Content",
        author: "bc1qtest",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Failed to create post");
  });
});
