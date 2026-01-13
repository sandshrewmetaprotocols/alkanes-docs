import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeBigInt } from "@/lib/serialize";

/**
 * GET /api/forum/discussions/[slug]
 * Get a discussion with all posts
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const viewer = searchParams.get("viewer"); // Bitcoin address of viewer

    // Get discussion by slug or ID
    const discussion = await prisma.discussion.findFirst({
      where: {
        OR: [{ slug }, { id: slug }],
        isHidden: false,
      },
      include: {
        category: true,
        tags: { include: { tag: true } },
        proposal: {
          include: {
            votes: {
              take: 10,
              orderBy: { votingPower: "desc" },
            },
            _count: { select: { votes: true } },
          },
        },
        participants: {
          orderBy: { postsCount: "desc" },
          take: 10,
        },
      },
    });

    if (!discussion) {
      return NextResponse.json(
        { error: "Discussion not found" },
        { status: 404 }
      );
    }

    // Increment view count
    await prisma.discussion.update({
      where: { id: discussion.id },
      data: { viewsCount: { increment: 1 } },
    });

    // Get posts with pagination
    const [posts, totalPosts] = await Promise.all([
      prisma.post.findMany({
        where: {
          discussionId: discussion.id,
          isHidden: false,
        },
        orderBy: { postNumber: "asc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          reactions: {
            select: { type: true, user: true },
          },
          replyTo: {
            select: { id: true, postNumber: true, author: true },
          },
          _count: {
            select: { replies: true },
          },
        },
      }),
      prisma.post.count({
        where: {
          discussionId: discussion.id,
          isHidden: false,
        },
      }),
    ]);

    // Get viewer's reading progress if viewer is specified
    let viewerParticipant = null;
    if (viewer) {
      viewerParticipant = await prisma.discussionParticipant.findUnique({
        where: {
          discussionId_user: {
            discussionId: discussion.id,
            user: viewer,
          },
        },
      });

      // Update last read
      if (viewerParticipant && posts.length > 0) {
        const lastPostNumber = posts[posts.length - 1].postNumber;
        if (lastPostNumber > viewerParticipant.lastReadPostNumber) {
          await prisma.discussionParticipant.update({
            where: { id: viewerParticipant.id },
            data: {
              lastReadPostNumber: lastPostNumber,
              lastReadAt: new Date(),
            },
          });
        }
      }
    }

    // Aggregate reaction counts per post
    const postsWithReactionCounts = posts.map((post) => {
      const reactionCounts: Record<string, number> = {};
      const userReactions: string[] = [];

      post.reactions.forEach((r) => {
        reactionCounts[r.type] = (reactionCounts[r.type] || 0) + 1;
        if (viewer && r.user === viewer) {
          userReactions.push(r.type);
        }
      });

      return {
        ...post,
        reactionCounts,
        userReactions,
        reactions: undefined, // Remove raw reactions from response
      };
    });

    return NextResponse.json(serializeBigInt({
      discussion: {
        ...discussion,
        tags: discussion.tags.map((t) => t.tag),
      },
      posts: postsWithReactionCounts,
      pagination: {
        page,
        limit,
        total: totalPosts,
        pages: Math.ceil(totalPosts / limit),
      },
      viewer: viewerParticipant
        ? {
            lastReadPostNumber: viewerParticipant.lastReadPostNumber,
            notificationLevel: viewerParticipant.notificationLevel,
          }
        : null,
    }));
  } catch (error) {
    console.error("Error fetching discussion:", error);
    return NextResponse.json(
      { error: "Failed to fetch discussion" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/forum/discussions/[slug]
 * Update a discussion (lock, pin, edit title)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { author, authorSig, title, isLocked, isPinned, isHidden } = body;

    // Get discussion
    const discussion = await prisma.discussion.findFirst({
      where: { OR: [{ slug }, { id: slug }] },
    });

    if (!discussion) {
      return NextResponse.json(
        { error: "Discussion not found" },
        { status: 404 }
      );
    }

    // TODO: Verify author signature
    // TODO: Check if author is original author or moderator

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (isLocked !== undefined) updateData.isLocked = isLocked;
    if (isPinned !== undefined) updateData.isPinned = isPinned;
    if (isHidden !== undefined) updateData.isHidden = isHidden;

    const updated = await prisma.discussion.update({
      where: { id: discussion.id },
      data: updateData,
      include: {
        category: true,
        tags: { include: { tag: true } },
      },
    });

    return NextResponse.json({ discussion: updated });
  } catch (error) {
    console.error("Error updating discussion:", error);
    return NextResponse.json(
      { error: "Failed to update discussion" },
      { status: 500 }
    );
  }
}
