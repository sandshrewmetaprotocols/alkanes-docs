import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { marked } from "marked";
import { verifyMessage } from "@/lib/bip322";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 100);
}

/**
 * GET /api/forum/discussions
 * List discussions with filtering and pagination
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const categoryId = searchParams.get("category");
    const proposalId = searchParams.get("proposal");
    const type = searchParams.get("type");
    const tag = searchParams.get("tag");
    const author = searchParams.get("author");
    const sort = searchParams.get("sort") || "bumped"; // bumped, created, posts

    const where: any = {
      isHidden: false,
    };

    if (categoryId) where.categoryId = categoryId;
    if (proposalId) where.proposalId = proposalId;
    if (type) where.type = type.toUpperCase();
    if (author) where.author = author;
    if (tag) {
      where.tags = {
        some: {
          tag: {
            slug: tag,
          },
        },
      };
    }

    const orderBy: any =
      sort === "created"
        ? { createdAt: "desc" }
        : sort === "posts"
        ? { postsCount: "desc" }
        : { bumpedAt: "desc" };

    const [discussions, total] = await Promise.all([
      prisma.discussion.findMany({
        where,
        orderBy: [{ isPinned: "desc" }, orderBy],
        skip: (page - 1) * limit,
        take: limit,
        include: {
          category: {
            select: { id: true, name: true, slug: true, color: true },
          },
          tags: {
            include: {
              tag: { select: { id: true, name: true, slug: true, color: true } },
            },
          },
          proposal: {
            select: { id: true, title: true, state: true },
          },
          _count: {
            select: { posts: true, participants: true },
          },
        },
      }),
      prisma.discussion.count({ where }),
    ]);

    return NextResponse.json({
      discussions: discussions.map((d) => ({
        ...d,
        tags: d.tags.map((t) => t.tag),
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching discussions:", error);
    return NextResponse.json(
      { error: "Failed to fetch discussions" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/forum/discussions
 * Create a new discussion
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      content,
      categoryId,
      author,
      authorSig,
      proposalId,
      tags,
      type,
    } = body;

    // Validate required fields
    if (!title || !content || !categoryId || !author) {
      return NextResponse.json(
        { error: "Missing required fields: title, content, categoryId, author" },
        { status: 400 }
      );
    }

    // Generate unique slug
    let slug = generateSlug(title);
    let suffix = 0;
    while (await prisma.discussion.findUnique({ where: { slug } })) {
      suffix++;
      slug = `${generateSlug(title)}-${suffix}`;
    }

    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // If linking to proposal, verify it exists
    if (proposalId) {
      const proposal = await prisma.proposal.findUnique({
        where: { id: proposalId },
      });
      if (!proposal) {
        return NextResponse.json(
          { error: "Proposal not found" },
          { status: 404 }
        );
      }
      // Check if proposal already has a discussion
      const existingDiscussion = await prisma.discussion.findUnique({
        where: { proposalId },
      });
      if (existingDiscussion) {
        return NextResponse.json(
          { error: "Proposal already has a discussion" },
          { status: 400 }
        );
      }
    }

    // Verify BIP-322 signature if provided
    if (authorSig) {
      const discussionMessage = JSON.stringify({ title, content, categoryId, author });
      const verificationResult = verifyMessage(author, discussionMessage, authorSig);
      if (!verificationResult.valid) {
        console.error("Discussion signature verification failed:", verificationResult.error);
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

    // Create discussion with first post in a transaction
    const discussion = await prisma.$transaction(async (tx) => {
      // Create discussion
      const newDiscussion = await tx.discussion.create({
        data: {
          title,
          slug,
          author,
          authorSig,
          categoryId,
          proposalId,
          type: type?.toUpperCase() || (proposalId ? "PROPOSAL" : "GENERAL"),
          postsCount: 1,
          lastPostAt: new Date(),
        },
      });

      // Create first post (the discussion content)
      await tx.post.create({
        data: {
          discussionId: newDiscussion.id,
          author,
          authorSig,
          raw: content,
          cooked,
          postNumber: 1,
          postType: "REGULAR",
        },
      });

      // Add author as participant
      await tx.discussionParticipant.create({
        data: {
          discussionId: newDiscussion.id,
          user: author,
          postsCount: 1,
          notificationLevel: "WATCHING",
        },
      });

      // Add tags if provided
      if (tags && Array.isArray(tags) && tags.length > 0) {
        for (const tagSlug of tags) {
          const tag = await tx.tag.findUnique({ where: { slug: tagSlug } });
          if (tag) {
            await tx.discussionTag.create({
              data: {
                discussionId: newDiscussion.id,
                tagId: tag.id,
              },
            });
            await tx.tag.update({
              where: { id: tag.id },
              data: { usageCount: { increment: 1 } },
            });
          }
        }
      }

      // Update user profile stats
      await tx.userProfile.upsert({
        where: { address: author },
        create: {
          address: author,
          discussionsCount: 1,
          postsCount: 1,
        },
        update: {
          discussionsCount: { increment: 1 },
          postsCount: { increment: 1 },
        },
      });

      return newDiscussion;
    });

    // Fetch full discussion with relations
    const fullDiscussion = await prisma.discussion.findUnique({
      where: { id: discussion.id },
      include: {
        category: true,
        tags: { include: { tag: true } },
        posts: { where: { postNumber: 1 } },
      },
    });

    return NextResponse.json({ discussion: fullDiscussion }, { status: 201 });
  } catch (error) {
    console.error("Error creating discussion:", error);
    return NextResponse.json(
      { error: "Failed to create discussion" },
      { status: 500 }
    );
  }
}
