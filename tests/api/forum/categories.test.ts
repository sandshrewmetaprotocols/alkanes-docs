import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// Mock prisma module - must be before imports
vi.mock("@/lib/prisma", () => {
  return {
    prisma: {
      category: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
      },
    },
    default: {
      category: { findMany: vi.fn() },
    },
  };
});

import { GET, POST, PUT } from "@/app/api/forum/categories/route";
import { prisma } from "@/lib/prisma";

// Type assertions for mocks
const mockCategory = prisma.category as any;

const mockCategories = [
  {
    id: "cat-1",
    name: "Announcements",
    slug: "announcements",
    description: "Official announcements",
    color: "#ef4444",
    position: 0,
    parentId: null,
    isReadOnly: true,
    children: [],
    _count: { discussions: 5 },
  },
  {
    id: "cat-2",
    name: "General",
    slug: "general",
    description: "General discussion",
    color: "#6366f1",
    position: 1,
    parentId: null,
    isReadOnly: false,
    children: [
      {
        id: "cat-2-1",
        name: "Introductions",
        slug: "introductions",
        parentId: "cat-2",
        position: 0,
      },
    ],
    _count: { discussions: 20 },
  },
  {
    id: "cat-2-1",
    name: "Introductions",
    slug: "introductions",
    description: "Introduce yourself",
    color: "#10b981",
    position: 0,
    parentId: "cat-2",
    isReadOnly: false,
    children: [],
    _count: { discussions: 10 },
  },
];

describe("GET /api/forum/categories", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns hierarchical categories", async () => {
    mockCategory.findMany.mockResolvedValue(mockCategories);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.categories).toBeDefined();
    // Only root categories in result
    expect(data.categories.length).toBe(2);
    // Child should be nested
    expect(data.categories[1].children.length).toBe(1);
  });

  it("handles database errors", async () => {
    mockCategory.findMany.mockRejectedValue(new Error("DB error"));

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Failed to fetch categories");
  });

  it("returns empty array when no categories", async () => {
    mockCategory.findMany.mockResolvedValue([]);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.categories).toEqual([]);
  });
});

describe("POST /api/forum/categories", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a new category", async () => {
    mockCategory.findUnique.mockResolvedValue(null);
    mockCategory.create.mockResolvedValue({
      id: "cat-new",
      name: "New Category",
      slug: "new-category",
      description: "A new category",
      color: "#0070c5",
      position: 5,
      isReadOnly: false,
    });

    const request = new NextRequest("http://localhost/api/forum/categories", {
      method: "POST",
      body: JSON.stringify({
        name: "New Category",
        slug: "new-category",
        description: "A new category",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.category.name).toBe("New Category");
  });

  it("returns 400 for missing required fields", async () => {
    const request = new NextRequest("http://localhost/api/forum/categories", {
      method: "POST",
      body: JSON.stringify({
        name: "Test",
        // Missing slug
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain("Missing required fields");
  });

  it("returns 400 for duplicate slug", async () => {
    mockCategory.findUnique.mockResolvedValue({ id: "existing" });

    const request = new NextRequest("http://localhost/api/forum/categories", {
      method: "POST",
      body: JSON.stringify({
        name: "Test",
        slug: "existing-slug",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Category slug already exists");
  });

  it("returns 404 for non-existent parent", async () => {
    mockCategory.findUnique
      .mockResolvedValueOnce(null) // slug check
      .mockResolvedValueOnce(null); // parent check

    const request = new NextRequest("http://localhost/api/forum/categories", {
      method: "POST",
      body: JSON.stringify({
        name: "Test",
        slug: "test",
        parentId: "non-existent",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe("Parent category not found");
  });

  it("accepts custom color", async () => {
    mockCategory.findUnique.mockResolvedValue(null);
    mockCategory.create.mockResolvedValue({
      id: "cat-new",
      name: "Test",
      slug: "test",
      color: "#ff0000",
    });

    const request = new NextRequest("http://localhost/api/forum/categories", {
      method: "POST",
      body: JSON.stringify({
        name: "Test",
        slug: "test",
        color: "#ff0000",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.category.color).toBe("#ff0000");
  });

  it("handles database errors", async () => {
    mockCategory.findUnique.mockRejectedValue(new Error("DB error"));

    const request = new NextRequest("http://localhost/api/forum/categories", {
      method: "POST",
      body: JSON.stringify({
        name: "Test",
        slug: "test",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Failed to create category");
  });
});

describe("PUT /api/forum/categories (seed)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("seeds default categories", async () => {
    mockCategory.findUnique.mockResolvedValue(null);
    mockCategory.create.mockImplementation((args: any) =>
      Promise.resolve({
        id: `cat-${args.data.slug}`,
        ...args.data,
      })
    );

    const request = new NextRequest("http://localhost/api/forum/categories", {
      method: "PUT",
    });

    const response = await PUT(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toContain("Seeded");
    expect(data.categories.length).toBe(5); // 5 default categories
  });

  it("skips existing categories", async () => {
    mockCategory.findUnique
      .mockResolvedValueOnce({ id: "existing-governance" })
      .mockResolvedValueOnce({ id: "existing-general" })
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);
    mockCategory.create.mockImplementation((args: any) =>
      Promise.resolve({
        id: `cat-${args.data.slug}`,
        ...args.data,
      })
    );

    const request = new NextRequest("http://localhost/api/forum/categories", {
      method: "PUT",
    });

    const response = await PUT(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.categories.length).toBe(3); // Only 3 new categories created
  });

  it("handles database errors", async () => {
    mockCategory.findUnique.mockRejectedValue(new Error("DB error"));

    const request = new NextRequest("http://localhost/api/forum/categories", {
      method: "PUT",
    });

    const response = await PUT(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Failed to seed categories");
  });
});
