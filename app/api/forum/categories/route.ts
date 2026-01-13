import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/forum/categories
 * List all categories
 */
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: [{ position: "asc" }, { name: "asc" }],
      include: {
        children: {
          orderBy: { position: "asc" },
        },
        _count: {
          select: { discussions: true },
        },
      },
    });

    // Build hierarchical structure
    const rootCategories = categories.filter((c) => !c.parentId);
    const result = rootCategories.map((cat) => ({
      ...cat,
      children: categories.filter((c) => c.parentId === cat.id),
    }));

    return NextResponse.json({ categories: result });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/forum/categories
 * Create a new category (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, description, color, parentId, position, isReadOnly } = body;

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json(
        { error: "Missing required fields: name, slug" },
        { status: 400 }
      );
    }

    // TODO: Check admin permissions

    // Check if slug is unique
    const existing = await prisma.category.findUnique({
      where: { slug },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Category slug already exists" },
        { status: 400 }
      );
    }

    // If parent specified, verify it exists
    if (parentId) {
      const parent = await prisma.category.findUnique({
        where: { id: parentId },
      });
      if (!parent) {
        return NextResponse.json(
          { error: "Parent category not found" },
          { status: 404 }
        );
      }
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        color: color || "#0070c5",
        parentId,
        position: position || 0,
        isReadOnly: isReadOnly || false,
      },
    });

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}

/**
 * Seed default categories for governance forum
 */
export async function PUT(request: NextRequest) {
  try {
    // TODO: Check admin permissions

    const defaultCategories = [
      {
        name: "Governance Proposals",
        slug: "governance",
        description: "Discussion of active and pending governance proposals",
        color: "#10b981", // emerald
        position: 1,
        isReadOnly: false,
      },
      {
        name: "General Discussion",
        slug: "general",
        description: "General discussion about DIESEL and the Alkanes ecosystem",
        color: "#6366f1", // indigo
        position: 2,
        isReadOnly: false,
      },
      {
        name: "Development",
        slug: "development",
        description: "Technical discussions, development updates, and protocol improvements",
        color: "#f59e0b", // amber
        position: 3,
        isReadOnly: false,
      },
      {
        name: "Announcements",
        slug: "announcements",
        description: "Official announcements from the DIESEL team",
        color: "#ef4444", // red
        position: 0,
        isReadOnly: true,
      },
      {
        name: "Support",
        slug: "support",
        description: "Get help with DIESEL, alkanes, and the ecosystem",
        color: "#8b5cf6", // violet
        position: 4,
        isReadOnly: false,
      },
    ];

    const created = [];
    for (const cat of defaultCategories) {
      const existing = await prisma.category.findUnique({
        where: { slug: cat.slug },
      });

      if (!existing) {
        const category = await prisma.category.create({
          data: cat,
        });
        created.push(category);
      }
    }

    return NextResponse.json({
      message: `Seeded ${created.length} categories`,
      categories: created,
    });
  } catch (error) {
    console.error("Error seeding categories:", error);
    return NextResponse.json(
      { error: "Failed to seed categories" },
      { status: 500 }
    );
  }
}
