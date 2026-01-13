import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyMessage } from "@/lib/bip322";

const VALID_REACTIONS = ["LIKE", "HEART", "CELEBRATE", "THINKING", "DISAGREE"];

/**
 * POST /api/forum/reactions
 * Add or toggle a reaction on a post
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { postId, user, type, signature } = body;

    // Validate required fields
    if (!postId || !user || !type) {
      return NextResponse.json(
        { error: "Missing required fields: postId, user, type" },
        { status: 400 }
      );
    }

    // Validate reaction type
    if (!VALID_REACTIONS.includes(type.toUpperCase())) {
      return NextResponse.json(
        { error: `Invalid reaction type. Must be one of: ${VALID_REACTIONS.join(", ")}` },
        { status: 400 }
      );
    }

    // Get post
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: { discussion: { select: { title: true } } },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Verify BIP-322 signature if provided
    if (signature) {
      const reactionMessage = JSON.stringify({ postId, user, type });
      const verificationResult = verifyMessage(user, reactionMessage, signature);
      if (!verificationResult.valid) {
        console.error("Reaction signature verification failed:", verificationResult.error);
        return NextResponse.json(
          {
            error: "Invalid signature",
            details: verificationResult.error
          },
          { status: 400 }
        );
      }
    }

    const reactionType = type.toUpperCase();

    // Check if reaction already exists
    const existingReaction = await prisma.reaction.findUnique({
      where: {
        postId_user_type: { postId, user, type: reactionType },
      },
    });

    if (existingReaction) {
      // Remove reaction (toggle off)
      await prisma.$transaction(async (tx) => {
        await tx.reaction.delete({
          where: { id: existingReaction.id },
        });

        // Update post like count if it was a LIKE
        if (reactionType === "LIKE") {
          await tx.post.update({
            where: { id: postId },
            data: { likesCount: { decrement: 1 } },
          });

          // Update author's likes received
          await tx.userProfile.updateMany({
            where: { address: post.author },
            data: { likesReceived: { decrement: 1 } },
          });

          // Update reactor's likes given
          await tx.userProfile.updateMany({
            where: { address: user },
            data: { likesGiven: { decrement: 1 } },
          });
        }
      });

      return NextResponse.json({ action: "removed", type: reactionType });
    }

    // Add new reaction
    await prisma.$transaction(async (tx) => {
      await tx.reaction.create({
        data: {
          postId,
          user,
          type: reactionType,
        },
      });

      // Update post like count if it's a LIKE
      if (reactionType === "LIKE") {
        await tx.post.update({
          where: { id: postId },
          data: { likesCount: { increment: 1 } },
        });

        // Update author's likes received
        await tx.userProfile.upsert({
          where: { address: post.author },
          create: { address: post.author, likesReceived: 1 },
          update: { likesReceived: { increment: 1 } },
        });

        // Update reactor's likes given
        await tx.userProfile.upsert({
          where: { address: user },
          create: { address: user, likesGiven: 1 },
          update: { likesGiven: { increment: 1 } },
        });

        // Notify post author (if not self)
        if (post.author !== user) {
          await tx.notification.create({
            data: {
              user: post.author,
              type: "LIKE",
              discussionId: post.discussionId,
              postId,
              title: `Someone liked your post in "${post.discussion.title}"`,
              actorAddress: user,
            },
          });
        }
      }
    });

    return NextResponse.json({ action: "added", type: reactionType });
  } catch (error) {
    console.error("Error toggling reaction:", error);
    return NextResponse.json(
      { error: "Failed to toggle reaction" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/forum/reactions
 * Get reactions for a post
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("postId");

    if (!postId) {
      return NextResponse.json(
        { error: "Missing postId parameter" },
        { status: 400 }
      );
    }

    const reactions = await prisma.reaction.findMany({
      where: { postId },
      select: { type: true, user: true, createdAt: true },
    });

    // Aggregate by type
    const counts: Record<string, number> = {};
    const byType: Record<string, string[]> = {};

    reactions.forEach((r) => {
      counts[r.type] = (counts[r.type] || 0) + 1;
      if (!byType[r.type]) byType[r.type] = [];
      byType[r.type].push(r.user);
    });

    return NextResponse.json({ counts, byType, total: reactions.length });
  } catch (error) {
    console.error("Error fetching reactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch reactions" },
      { status: 500 }
    );
  }
}
