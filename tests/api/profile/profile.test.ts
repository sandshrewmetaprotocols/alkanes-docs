import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// Mock the prisma module before imports - use hoisted pattern
vi.mock("@/lib/prisma", () => {
  return {
    prisma: {
      userProfile: {
        findUnique: vi.fn(),
        upsert: vi.fn(),
      },
    },
    default: {
      userProfile: {
        findUnique: vi.fn(),
        upsert: vi.fn(),
      },
    },
  };
});

// Import after mocking
import { GET, POST } from "@/app/api/profile/route";
import { prisma } from "@/lib/prisma";

// Cast to mocks for typing
const mockFindUnique = prisma.userProfile.findUnique as ReturnType<typeof vi.fn>;
const mockUpsert = prisma.userProfile.upsert as ReturnType<typeof vi.fn>;

describe("GET /api/profile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 when address is missing", async () => {
    const request = new NextRequest("http://localhost/api/profile");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Address is required");
  });

  it("returns existing profile when found", async () => {
    const mockProfile = {
      id: "test-id",
      address: "bc1ptest123",
      displayName: "Test User",
      bio: "Test bio",
      avatarUrl: null,
      verified: true,
      postsCount: 5,
      discussionsCount: 2,
      likesReceived: 10,
      likesGiven: 3,
      trustLevel: 1,
      createdAt: new Date("2024-01-01"),
      lastSeenAt: new Date("2024-01-02"),
    };

    mockFindUnique.mockResolvedValueOnce(mockProfile);

    const request = new NextRequest(
      "http://localhost/api/profile?address=bc1ptest123"
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.id).toBe("test-id");
    expect(data.address).toBe("bc1ptest123");
    expect(data.displayName).toBe("Test User");
    expect(data.verified).toBe(true);
  });

  it("returns default profile for new users (not found)", async () => {
    mockFindUnique.mockResolvedValueOnce(null);

    const request = new NextRequest(
      "http://localhost/api/profile?address=bc1pnewuser"
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.id).toBeNull();
    expect(data.address).toBe("bc1pnewuser");
    expect(data.verified).toBe(false);
    expect(data.postsCount).toBe(0);
  });

  it("returns default profile with _dbUnavailable when database fails", async () => {
    mockFindUnique.mockRejectedValueOnce(new Error("Connection failed"));

    const request = new NextRequest(
      "http://localhost/api/profile?address=bc1ptest"
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.address).toBe("bc1ptest");
    expect(data._dbUnavailable).toBe(true);
    expect(data.verified).toBe(false);
  });

  it("handles taproot addresses correctly", async () => {
    const taprootAddress =
      "bc1pye8e94vknqhxe7jkc4c84fvw3mpl0a9jjn78u7rwelgzp82ysvmqwjuwzw";
    mockFindUnique.mockResolvedValueOnce(null);

    const request = new NextRequest(
      `http://localhost/api/profile?address=${taprootAddress}`
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.address).toBe(taprootAddress);
  });
});

describe("POST /api/profile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 when address is missing", async () => {
    const request = new NextRequest("http://localhost/api/profile", {
      method: "POST",
      body: JSON.stringify({ displayName: "Test" }),
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Address is required");
  });

  it("returns 400 when displayName is too long", async () => {
    const request = new NextRequest("http://localhost/api/profile", {
      method: "POST",
      body: JSON.stringify({
        address: "bc1ptest",
        displayName: "A".repeat(51),
      }),
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Display name must be 50 characters or less");
  });

  it("returns 400 when bio is too long", async () => {
    const request = new NextRequest("http://localhost/api/profile", {
      method: "POST",
      body: JSON.stringify({
        address: "bc1ptest",
        bio: "A".repeat(501),
      }),
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Bio must be 500 characters or less");
  });

  it("creates new profile successfully", async () => {
    const mockProfile = {
      id: "new-id",
      address: "bc1ptest",
      displayName: "New User",
      bio: "My bio",
      avatarUrl: null,
      verified: false,
      postsCount: 0,
      discussionsCount: 0,
      likesReceived: 0,
      trustLevel: 0,
      createdAt: new Date(),
      lastSeenAt: new Date(),
    };

    mockUpsert.mockResolvedValueOnce(mockProfile);

    const request = new NextRequest("http://localhost/api/profile", {
      method: "POST",
      body: JSON.stringify({
        address: "bc1ptest",
        displayName: "New User",
        bio: "My bio",
      }),
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.id).toBe("new-id");
    expect(data.displayName).toBe("New User");
    expect(mockUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { address: "bc1ptest" },
      })
    );
  });

  it("sanitizes displayName by removing < and > characters", async () => {
    const mockProfile = {
      id: "test-id",
      address: "bc1ptest",
      displayName: "scriptalert(1)/script",
      bio: null,
      avatarUrl: null,
      verified: false,
      postsCount: 0,
      discussionsCount: 0,
      likesReceived: 0,
      trustLevel: 0,
      createdAt: new Date(),
      lastSeenAt: new Date(),
    };

    mockUpsert.mockResolvedValueOnce(mockProfile);

    const request = new NextRequest("http://localhost/api/profile", {
      method: "POST",
      body: JSON.stringify({
        address: "bc1ptest",
        displayName: "<script>alert(1)</script>",
      }),
    });
    await POST(request);

    expect(mockUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({
          displayName: "scriptalert(1)/script",
        }),
      })
    );
  });

  it("returns 503 when database is unavailable", async () => {
    mockUpsert.mockRejectedValueOnce(new Error("Connection failed"));

    const request = new NextRequest("http://localhost/api/profile", {
      method: "POST",
      body: JSON.stringify({
        address: "bc1ptest",
        displayName: "Test",
      }),
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(503);
    expect(data.error).toBe("Database unavailable. Please try again later.");
  });

  it("trims whitespace from displayName and bio", async () => {
    const mockProfile = {
      id: "test-id",
      address: "bc1ptest",
      displayName: "Trimmed Name",
      bio: "Trimmed bio",
      avatarUrl: null,
      verified: false,
      postsCount: 0,
      discussionsCount: 0,
      likesReceived: 0,
      trustLevel: 0,
      createdAt: new Date(),
      lastSeenAt: new Date(),
    };

    mockUpsert.mockResolvedValueOnce(mockProfile);

    const request = new NextRequest("http://localhost/api/profile", {
      method: "POST",
      body: JSON.stringify({
        address: "bc1ptest",
        displayName: "  Trimmed Name  ",
        bio: "  Trimmed bio  ",
      }),
    });
    await POST(request);

    expect(mockUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({
          displayName: "Trimmed Name",
          bio: "Trimmed bio",
        }),
      })
    );
  });
});
