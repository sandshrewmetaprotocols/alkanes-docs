import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// Mock the prisma module before imports - use hoisted pattern
vi.mock("@/lib/prisma", () => {
  return {
    prisma: {
      userProfile: {
        upsert: vi.fn(),
      },
    },
    default: {
      userProfile: {
        upsert: vi.fn(),
      },
    },
  };
});

// Mock bitcoin-address-validation
vi.mock("bitcoin-address-validation", () => ({
  validate: (address: string) => {
    // Accept common Bitcoin address formats
    if (address.startsWith("bc1p") || address.startsWith("bc1q")) return true;
    if (address.startsWith("tb1p") || address.startsWith("tb1q")) return true;
    if (address.startsWith("1") || address.startsWith("3")) return true;
    return false;
  },
}));

// Mock BIP-322 verification for tests
vi.mock("@/lib/bip322", () => ({
  verifyMessage: (address: string, message: string, signature: string) => {
    // In tests, accept any 64+ byte signature as valid
    try {
      const sigBuffer = Buffer.from(signature, "base64");
      if (sigBuffer.length >= 64) {
        return { valid: true, addressType: address.startsWith("bc1p") ? "p2tr" : "p2wpkh" };
      }
    } catch {
      // Invalid base64
    }
    return { valid: false, error: "Invalid signature format" };
  },
}));

// Import after mocking
import { POST } from "@/app/api/profile/verify/route";
import { prisma } from "@/lib/prisma";

// Cast to mock for typing
const mockUpsert = prisma.userProfile.upsert as ReturnType<typeof vi.fn>;

// Helper to create a valid signature (64+ bytes base64)
const createValidSignature = () => {
  // Create a 64-byte buffer and convert to base64
  const buffer = Buffer.alloc(64, "a");
  return buffer.toString("base64");
};

// Helper to create timestamps
const createTimestamp = (offsetMs = 0) => {
  return (Date.now() + offsetMs).toString();
};

describe("POST /api/profile/verify", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 when address is missing", async () => {
    const request = new NextRequest("http://localhost/api/profile/verify", {
      method: "POST",
      body: JSON.stringify({
        message: "test",
        signature: createValidSignature(),
        timestamp: createTimestamp(),
      }),
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe(
      "Missing required fields: address, message, signature, timestamp"
    );
  });

  it("returns 400 when message is missing", async () => {
    const request = new NextRequest("http://localhost/api/profile/verify", {
      method: "POST",
      body: JSON.stringify({
        address: "bc1ptest",
        signature: createValidSignature(),
        timestamp: createTimestamp(),
      }),
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe(
      "Missing required fields: address, message, signature, timestamp"
    );
  });

  it("returns 400 when signature is missing", async () => {
    const request = new NextRequest("http://localhost/api/profile/verify", {
      method: "POST",
      body: JSON.stringify({
        address: "bc1ptest",
        message: "test",
        timestamp: createTimestamp(),
      }),
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe(
      "Missing required fields: address, message, signature, timestamp"
    );
  });

  it("returns 400 when timestamp is missing", async () => {
    const request = new NextRequest("http://localhost/api/profile/verify", {
      method: "POST",
      body: JSON.stringify({
        address: "bc1ptest",
        message: "test",
        signature: createValidSignature(),
      }),
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe(
      "Missing required fields: address, message, signature, timestamp"
    );
  });

  it("returns 400 for invalid Bitcoin address", async () => {
    const request = new NextRequest("http://localhost/api/profile/verify", {
      method: "POST",
      body: JSON.stringify({
        address: "invalid_address",
        message: "Verify ownership of invalid_address for alkanes.build forum",
        signature: createValidSignature(),
        timestamp: createTimestamp(),
      }),
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid Bitcoin address");
  });

  it("returns 400 when message has expired (> 5 minutes)", async () => {
    const expiredTimestamp = (Date.now() - 6 * 60 * 1000).toString(); // 6 minutes ago

    const request = new NextRequest("http://localhost/api/profile/verify", {
      method: "POST",
      body: JSON.stringify({
        address: "bc1ptest123",
        message: "Verify ownership of bc1ptest123 for alkanes.build forum",
        signature: createValidSignature(),
        timestamp: expiredTimestamp,
      }),
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe(
      "Verification message has expired. Please try again."
    );
  });

  it("returns 400 when message format is invalid", async () => {
    const request = new NextRequest("http://localhost/api/profile/verify", {
      method: "POST",
      body: JSON.stringify({
        address: "bc1ptest123",
        message: "Some random message",
        signature: createValidSignature(),
        timestamp: createTimestamp(),
      }),
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid verification message format");
  });

  it("returns 400 when signature is too short", async () => {
    const request = new NextRequest("http://localhost/api/profile/verify", {
      method: "POST",
      body: JSON.stringify({
        address: "bc1ptest123",
        message: "Verify ownership of bc1ptest123 for alkanes.build forum",
        signature: "short",
        timestamp: createTimestamp(),
      }),
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid signature");
    expect(data.details).toBeDefined();
  });

  it("returns 400 when signature format is invalid (< 64 bytes)", async () => {
    // Create a signature that's less than 64 bytes when decoded
    const shortSig = Buffer.alloc(32, "a").toString("base64");

    const request = new NextRequest("http://localhost/api/profile/verify", {
      method: "POST",
      body: JSON.stringify({
        address: "bc1ptest123",
        message: "Verify ownership of bc1ptest123 for alkanes.build forum",
        signature: shortSig,
        timestamp: createTimestamp(),
      }),
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid signature");
  });

  it("successfully verifies a valid taproot signature", async () => {
    const mockProfile = {
      id: "test-id",
      address: "bc1ptest123",
      displayName: null,
      bio: null,
      avatarUrl: null,
      verified: true,
      postsCount: 0,
      discussionsCount: 0,
      likesReceived: 0,
      trustLevel: 0,
      createdAt: new Date(),
      lastSeenAt: new Date(),
    };

    mockUpsert.mockResolvedValueOnce(mockProfile);

    const timestamp = createTimestamp();
    const request = new NextRequest("http://localhost/api/profile/verify", {
      method: "POST",
      body: JSON.stringify({
        address: "bc1ptest123",
        message: `Verify ownership of bc1ptest123 for alkanes.build forum\nTimestamp: ${timestamp}`,
        signature: createValidSignature(),
        timestamp,
      }),
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.profile.verified).toBe(true);
    expect(mockUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { address: "bc1ptest123" },
        update: expect.objectContaining({
          verified: true,
        }),
      })
    );
  });

  it("successfully verifies a valid native segwit signature", async () => {
    const mockProfile = {
      id: "test-id",
      address: "bc1qtest123",
      displayName: null,
      bio: null,
      avatarUrl: null,
      verified: true,
      postsCount: 0,
      discussionsCount: 0,
      likesReceived: 0,
      trustLevel: 0,
      createdAt: new Date(),
      lastSeenAt: new Date(),
    };

    mockUpsert.mockResolvedValueOnce(mockProfile);

    const timestamp = createTimestamp();
    const request = new NextRequest("http://localhost/api/profile/verify", {
      method: "POST",
      body: JSON.stringify({
        address: "bc1qtest123",
        message: `Verify ownership of bc1qtest123 for alkanes.build forum\nTimestamp: ${timestamp}`,
        signature: createValidSignature(),
        timestamp,
      }),
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.profile.verified).toBe(true);
  });

  it("returns success with _dbUnavailable when database fails", async () => {
    mockUpsert.mockRejectedValueOnce(new Error("Connection failed"));

    const timestamp = createTimestamp();
    const request = new NextRequest("http://localhost/api/profile/verify", {
      method: "POST",
      body: JSON.stringify({
        address: "bc1ptest123",
        message: `Verify ownership of bc1ptest123 for alkanes.build forum\nTimestamp: ${timestamp}`,
        signature: createValidSignature(),
        timestamp,
      }),
    });
    const response = await POST(request);
    const data = await response.json();

    // Should still return success since signature was valid
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.profile._dbUnavailable).toBe(true);
    expect(data.profile.verified).toBe(true);
  });

  it("accepts 64-byte Schnorr signatures for taproot", async () => {
    const mockProfile = {
      id: "test-id",
      address: "bc1ptest",
      displayName: null,
      bio: null,
      avatarUrl: null,
      verified: true,
      postsCount: 0,
      discussionsCount: 0,
      likesReceived: 0,
      trustLevel: 0,
      createdAt: new Date(),
      lastSeenAt: new Date(),
    };

    mockUpsert.mockResolvedValueOnce(mockProfile);

    // 64-byte Schnorr signature
    const schnorrSig = Buffer.alloc(64, "b").toString("base64");
    const timestamp = createTimestamp();

    const request = new NextRequest("http://localhost/api/profile/verify", {
      method: "POST",
      body: JSON.stringify({
        address: "bc1ptest",
        message: `Verify ownership of bc1ptest for alkanes.build forum\nTimestamp: ${timestamp}`,
        signature: schnorrSig,
        timestamp,
      }),
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it("accepts DER-encoded ECDSA signatures (70-72 bytes)", async () => {
    const mockProfile = {
      id: "test-id",
      address: "bc1qtest",
      displayName: null,
      bio: null,
      avatarUrl: null,
      verified: true,
      postsCount: 0,
      discussionsCount: 0,
      likesReceived: 0,
      trustLevel: 0,
      createdAt: new Date(),
      lastSeenAt: new Date(),
    };

    mockUpsert.mockResolvedValueOnce(mockProfile);

    // 71-byte DER-encoded signature
    const derSig = Buffer.alloc(71, "c").toString("base64");
    const timestamp = createTimestamp();

    const request = new NextRequest("http://localhost/api/profile/verify", {
      method: "POST",
      body: JSON.stringify({
        address: "bc1qtest",
        message: `Verify ownership of bc1qtest for alkanes.build forum\nTimestamp: ${timestamp}`,
        signature: derSig,
        timestamp,
      }),
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it("accepts testnet taproot addresses", async () => {
    const mockProfile = {
      id: "test-id",
      address: "tb1ptest",
      displayName: null,
      bio: null,
      avatarUrl: null,
      verified: true,
      postsCount: 0,
      discussionsCount: 0,
      likesReceived: 0,
      trustLevel: 0,
      createdAt: new Date(),
      lastSeenAt: new Date(),
    };

    mockUpsert.mockResolvedValueOnce(mockProfile);

    const timestamp = createTimestamp();
    const request = new NextRequest("http://localhost/api/profile/verify", {
      method: "POST",
      body: JSON.stringify({
        address: "tb1ptest",
        message: `Verify ownership of tb1ptest for alkanes.build forum\nTimestamp: ${timestamp}`,
        signature: createValidSignature(),
        timestamp,
      }),
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it("stores signature in database on successful verification", async () => {
    const mockProfile = {
      id: "test-id",
      address: "bc1ptest",
      displayName: null,
      bio: null,
      avatarUrl: null,
      verified: true,
      postsCount: 0,
      discussionsCount: 0,
      likesReceived: 0,
      trustLevel: 0,
      createdAt: new Date(),
      lastSeenAt: new Date(),
    };

    mockUpsert.mockResolvedValueOnce(mockProfile);

    const signature = createValidSignature();
    const timestamp = createTimestamp();

    const request = new NextRequest("http://localhost/api/profile/verify", {
      method: "POST",
      body: JSON.stringify({
        address: "bc1ptest",
        message: `Verify ownership of bc1ptest for alkanes.build forum\nTimestamp: ${timestamp}`,
        signature,
        timestamp,
      }),
    });
    await POST(request);

    expect(mockUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({
          signature,
          verified: true,
        }),
        update: expect.objectContaining({
          signature,
          verified: true,
        }),
      })
    );
  });
});
