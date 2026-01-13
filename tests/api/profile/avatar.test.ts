import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// Use vi.hoisted to ensure mocks are available before vi.mock hoisting
const { mockWriteFile, mockMkdir, mockExistsSync, mockUpsert } = vi.hoisted(
  () => ({
    mockWriteFile: vi.fn().mockResolvedValue(undefined),
    mockMkdir: vi.fn().mockResolvedValue(undefined),
    mockExistsSync: vi.fn().mockReturnValue(true),
    mockUpsert: vi.fn().mockResolvedValue({}),
  })
);

vi.mock("fs/promises", () => ({
  default: {
    writeFile: mockWriteFile,
    mkdir: mockMkdir,
  },
  writeFile: mockWriteFile,
  mkdir: mockMkdir,
}));

vi.mock("fs", () => ({
  default: {
    existsSync: mockExistsSync,
  },
  existsSync: mockExistsSync,
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    userProfile: {
      upsert: mockUpsert,
    },
  },
  default: {
    userProfile: {
      upsert: mockUpsert,
    },
  },
}));

// Import after mocking
import { POST } from "@/app/api/profile/avatar/route";

// Helper to create a mock file
const createMockFile = (
  name: string,
  type: string,
  size: number
): File => {
  const blob = new Blob([new ArrayBuffer(size)], { type });
  return new File([blob], name, { type });
};

// Helper to create FormData request
const createFormDataRequest = (
  file: File | null,
  address: string | null
): NextRequest => {
  const formData = new FormData();
  if (file) formData.append("file", file);
  if (address) formData.append("address", address);

  return new NextRequest("http://localhost/api/profile/avatar", {
    method: "POST",
    body: formData,
  });
};

describe("POST /api/profile/avatar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockExistsSync.mockReturnValue(true);
    mockWriteFile.mockResolvedValue(undefined);
    mockMkdir.mockResolvedValue(undefined);
    mockUpsert.mockResolvedValue({});
  });

  it("returns 400 when no file provided", async () => {
    const request = createFormDataRequest(null, "bc1ptest");
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("No file provided");
  });

  it("returns 400 when address is missing", async () => {
    const file = createMockFile("avatar.jpg", "image/jpeg", 1024);
    const request = createFormDataRequest(file, null);
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Address is required");
  });

  it("returns 400 for invalid file type", async () => {
    const file = createMockFile("document.pdf", "application/pdf", 1024);
    const request = createFormDataRequest(file, "bc1ptest");
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid file type. Allowed: JPEG, PNG, GIF, WebP");
  });

  it("returns 400 when file is too large (>2MB)", async () => {
    const file = createMockFile(
      "large.jpg",
      "image/jpeg",
      3 * 1024 * 1024 // 3MB
    );
    const request = createFormDataRequest(file, "bc1ptest");
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("File too large. Maximum size is 2MB");
  });

  it("successfully uploads a JPEG image", async () => {
    const file = createMockFile("avatar.jpg", "image/jpeg", 1024);
    const request = createFormDataRequest(file, "bc1ptest123");
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    // Filename format: ${address.slice(0, 16)}-${Date.now()}.${ext}
    expect(data.url).toMatch(/^\/uploads\/avatars\/bc1ptest123-\d+\.jpg$/);
    expect(mockWriteFile).toHaveBeenCalled();
    expect(mockUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { address: "bc1ptest123" },
        update: expect.objectContaining({
          avatarUrl: expect.stringMatching(/^\/uploads\/avatars\//),
        }),
      })
    );
  });

  it("successfully uploads a PNG image", async () => {
    const file = createMockFile("avatar.png", "image/png", 1024);
    const request = createFormDataRequest(file, "bc1ptest");
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.url).toMatch(/\.png$/);
  });

  it("successfully uploads a GIF image", async () => {
    const file = createMockFile("avatar.gif", "image/gif", 1024);
    const request = createFormDataRequest(file, "bc1ptest");
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.url).toMatch(/\.gif$/);
  });

  it("successfully uploads a WebP image", async () => {
    const file = createMockFile("avatar.webp", "image/webp", 1024);
    const request = createFormDataRequest(file, "bc1ptest");
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.url).toMatch(/\.webp$/);
  });

  it("creates upload directory if it does not exist", async () => {
    mockExistsSync.mockReturnValue(false);

    const file = createMockFile("avatar.jpg", "image/jpeg", 1024);
    const request = createFormDataRequest(file, "bc1ptest");
    await POST(request);

    expect(mockMkdir).toHaveBeenCalledWith(
      expect.stringContaining("avatars"),
      { recursive: true }
    );
  });

  it("does not create directory if it already exists", async () => {
    mockExistsSync.mockReturnValue(true);

    const file = createMockFile("avatar.jpg", "image/jpeg", 1024);
    const request = createFormDataRequest(file, "bc1ptest");
    await POST(request);

    expect(mockMkdir).not.toHaveBeenCalled();
  });

  it("returns 500 when file write fails", async () => {
    mockWriteFile.mockRejectedValueOnce(new Error("Write failed"));

    const file = createMockFile("avatar.jpg", "image/jpeg", 1024);
    const request = createFormDataRequest(file, "bc1ptest");
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Failed to upload avatar");
  });

  it("returns 500 when database update fails", async () => {
    mockUpsert.mockRejectedValueOnce(new Error("Database error"));

    const file = createMockFile("avatar.jpg", "image/jpeg", 1024);
    const request = createFormDataRequest(file, "bc1ptest");
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Failed to upload avatar");
  });

  it("generates unique filename with address prefix and timestamp", async () => {
    const file = createMockFile("avatar.jpg", "image/jpeg", 1024);
    const request = createFormDataRequest(file, "bc1ptest123456789");
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    // Filename uses first 16 chars of address: bc1ptest12345678
    expect(data.url).toMatch(/^\/uploads\/avatars\/bc1ptest12345678-\d+\.jpg$/);
  });
});
