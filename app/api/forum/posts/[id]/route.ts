import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { marked } from "marked";

/**
 * GET /api/forum/posts/[id]
 * Get a single post with context
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        discussion: {
          select: { id: true, title: true, slug: true },
        },
        replyTo: {
          select: { id: true, postNumber: true, author: true, raw: true },
        },
        replies: {
          select: { id: true, postNumber: true, author: true },
          take: 10,
        },
        reactions: {
          select: { type: true, user: true },
        },
        revisions: {
          orderBy: { version: "desc" },
          take: 5,
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Aggregate reaction counts
    const reactionCounts: Record<string, number> = {};
    post.reactions.forEach((r) => {
      reactionCounts[r.type] = (reactionCounts[r.type] || 0) + 1;
    });

    return NextResponse.json({
      post: {
        ...post,
        reactionCounts,
      },
    });
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/forum/posts/[id]
 * Edit a post
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { content, author, authorSig, editReason } = body;

    if (!content || !author) {
      return NextResponse.json(
        { error: "Missing required fields: content, author" },
        { status: 400 }
      );
    }

    // Get post
    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // TODO: Verify author signature
    // Check if author is original author (or moderator)
    if (post.author !== author) {
      return NextResponse.json(
        { error: "Only the author can edit this post" },
        { status: 403 }
      );
    }

    // Parse new markdown
    const cooked = await marked.parse(content);

    // Update post and create revision in transaction
    const updated = await prisma.$transaction(async (tx) => {
      // Get current revision count
      const revisionCount = await tx.postRevision.count({
        where: { postId: id },
      });

      // Save current content as revision
      await tx.postRevision.create({
        data: {
          postId: id,
          raw: post.raw,
          cooked: post.cooked,
          editedBy: author,
          editReason,
          version: revisionCount + 1,
        },
      });

      // Update post
      return tx.post.update({
        where: { id },
        data: {
          raw: content,
          cooked,
          isEdited: true,
          editedAt: new Date(),
        },
        include: {
          discussion: { select: { id: true, title: true, slug: true } },
          _count: { select: { replies: true, revisions: true } },
        },
      });
    });

    return NextResponse.json({ post: updated });
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/forum/posts/[id]
 * Soft delete a post (hide it)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const author = searchParams.get("author");

    if (!author) {
      return NextResponse.json(
        { error: "Missing author parameter" },
        { status: 400 }
      );
    }

    // Get post
    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // TODO: Verify author signature
    // Check if author is original author (or moderator)
    if (post.author !== author) {
      return NextResponse.json(
        { error: "Only the author can delete this post" },
        { status: 403 }
      );
    }

    // Can't delete the first post (use discussion delete instead)
    if (post.postNumber === 1) {
      return NextResponse.json(
        { error: "Cannot delete the first post. Delete the discussion instead." },
        { status: 400 }
      );
    }

    // Soft delete by hiding
    await prisma.post.update({
      where: { id },
      data: { isHidden: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
