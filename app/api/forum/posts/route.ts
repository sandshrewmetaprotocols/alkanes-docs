import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { marked } from "marked";
import { verifyMessage } from "@/lib/bip322";

/**
 * POST /api/forum/posts
 * Create a new post (reply) in a discussion
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { discussionId, content, author, authorSig, replyToId } = body;

    // Validate required fields
    if (!discussionId || !content || !author) {
      return NextResponse.json(
        { error: "Missing required fields: discussionId, content, author" },
        { status: 400 }
      );
    }

    // Get discussion
    const discussion = await prisma.discussion.findUnique({
      where: { id: discussionId },
    });

    if (!discussion) {
      return NextResponse.json(
        { error: "Discussion not found" },
        { status: 404 }
      );
    }

    if (discussion.isLocked) {
      return NextResponse.json(
        { error: "Discussion is locked" },
        { status: 403 }
      );
    }

    // If replying to a specific post, verify it exists
    if (replyToId) {
      const replyTo = await prisma.post.findUnique({
        where: { id: replyToId },
      });
      if (!replyTo || replyTo.discussionId !== discussionId) {
        return NextResponse.json(
          { error: "Reply target post not found" },
          { status: 404 }
        );
      }
    }

    // Verify BIP-322 signature if provided
    if (authorSig) {
      const postMessage = JSON.stringify({ discussionId, content, author });
      const verificationResult = verifyMessage(author, postMessage, authorSig);
      if (!verificationResult.valid) {
        console.error("Post signature verification failed:", verificationResult.error);
        return NextResponse.json(
          {
            error: "Invalid signature",
            details: verificationResult.error
          },
          { status: 400 }
        );
      }
    }

    // TODO: Check minimum DIESEL balance requirements

    // Parse markdown to HTML
    const cooked = await marked.parse(content);

    // Extract mentions from content (@bc1...)
    const mentionRegex = /@(bc1[a-zA-HJ-NP-Z0-9]{25,39}|[13][a-km-zA-HJ-NP-Z1-9]{25,34})/g;
    const mentions: string[] = [];
    let match;
    while ((match = mentionRegex.exec(content)) !== null) {
      if (!mentions.includes(match[1])) {
        mentions.push(match[1]);
      }
    }

    // Create post in a transaction
    const post = await prisma.$transaction(async (tx) => {
      // Get next post number
      const lastPost = await tx.post.findFirst({
        where: { discussionId },
        orderBy: { postNumber: "desc" },
        select: { postNumber: true },
      });
      const postNumber = (lastPost?.postNumber || 0) + 1;

      // Create post
      const newPost = await tx.post.create({
        data: {
          discussionId,
          author,
          authorSig,
          raw: content,
          cooked,
          postNumber,
          replyToId,
          postType: "REGULAR",
        },
      });

      // Create mentions
      for (const mentioned of mentions) {
        await tx.mention.create({
          data: {
            postId: newPost.id,
            mentioned,
          },
        });

        // Create notification for mentioned user
        await tx.notification.create({
          data: {
            user: mentioned,
            type: "MENTION",
            discussionId,
            postId: newPost.id,
            title: `You were mentioned in "${discussion.title}"`,
            body: content.substring(0, 200),
            actorAddress: author,
          },
        });
      }

      // Update reply count if replying to a post
      if (replyToId) {
        await tx.post.update({
          where: { id: replyToId },
          data: { repliesCount: { increment: 1 } },
        });

        // Notify the post author being replied to
        const replyTo = await tx.post.findUnique({
          where: { id: replyToId },
          select: { author: true },
        });

        if (replyTo && replyTo.author !== author) {
          await tx.notification.create({
            data: {
              user: replyTo.author,
              type: "REPLY",
              discussionId,
              postId: newPost.id,
              title: `Someone replied to your post in "${discussion.title}"`,
              body: content.substring(0, 200),
              actorAddress: author,
            },
          });
        }
      }

      // Update discussion stats
      await tx.discussion.update({
        where: { id: discussionId },
        data: {
          postsCount: { increment: 1 },
          lastPostAt: new Date(),
          bumpedAt: new Date(),
        },
      });

      // Update or create participant
      await tx.discussionParticipant.upsert({
        where: {
          discussionId_user: { discussionId, user: author },
        },
        create: {
          discussionId,
          user: author,
          postsCount: 1,
          lastReadPostNumber: postNumber,
          notificationLevel: "TRACKING",
        },
        update: {
          postsCount: { increment: 1 },
          lastReadPostNumber: postNumber,
        },
      });

      // Update user profile stats
      await tx.userProfile.upsert({
        where: { address: author },
        create: {
          address: author,
          postsCount: 1,
        },
        update: {
          postsCount: { increment: 1 },
        },
      });

      return newPost;
    });

    // Fetch full post with relations
    const fullPost = await prisma.post.findUnique({
      where: { id: post.id },
      include: {
        replyTo: {
          select: { id: true, postNumber: true, author: true },
        },
        _count: { select: { replies: true } },
      },
    });

    return NextResponse.json({ post: fullPost }, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
