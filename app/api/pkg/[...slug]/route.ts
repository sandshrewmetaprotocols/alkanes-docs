import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import * as path from "path";
import * as fs from "fs";

export const dynamic = "force-dynamic";

// Supported packages and their source directories
const PACKAGES: Record<string, string> = {
  "@alkanes/ts-sdk": "ts-sdk",
};

/**
 * GET /api/pkg/[...slug]
 * Serves npm-installable tarballs for packages
 *
 * Usage:
 *   npm install "https://alkanes.build/pkg/@alkanes/ts-sdk"
 *   yarn add "https://alkanes.build/pkg/@alkanes/ts-sdk"
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;

  // Reconstruct package name from slug
  // e.g., ["@alkanes", "ts-sdk"] -> "@alkanes/ts-sdk"
  const packageName = slug.join("/");

  // Check if package is supported
  const sourceDir = PACKAGES[packageName];
  if (!sourceDir) {
    return NextResponse.json(
      {
        error: "Package not found",
        available: Object.keys(PACKAGES),
      },
      { status: 404 }
    );
  }

  const packagePath = path.join(process.cwd(), sourceDir);

  // Verify package directory exists
  if (!fs.existsSync(packagePath)) {
    return NextResponse.json(
      { error: "Package directory not found in repository." },
      { status: 500 }
    );
  }

  // Verify package.json exists
  const packageJsonPath = path.join(packagePath, "package.json");
  if (!fs.existsSync(packageJsonPath)) {
    return NextResponse.json(
      { error: "Invalid package: missing package.json" },
      { status: 500 }
    );
  }

  // Check for pre-built tarball
  const tarballPath = path.join(packagePath, "package.tgz");
  if (fs.existsSync(tarballPath)) {
    // Serve pre-built tarball
    const tarball = fs.readFileSync(tarballPath);
    return new NextResponse(tarball, {
      headers: {
        "Content-Type": "application/gzip",
        "Content-Disposition": `attachment; filename="${packageName.replace("/", "-")}.tgz"`,
        "Cache-Control": "public, max-age=3600",
      },
    });
  }

  // Generate tarball on-the-fly using npm pack
  try {
    const tarball = await createTarball(packagePath);
    // Convert Buffer to Uint8Array for NextResponse compatibility
    return new NextResponse(new Uint8Array(tarball), {
      headers: {
        "Content-Type": "application/gzip",
        "Content-Disposition": `attachment; filename="${packageName.replace("/", "-")}.tgz"`,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Failed to create tarball:", error);
    return NextResponse.json(
      { error: "Failed to create package tarball" },
      { status: 500 }
    );
  }
}

/**
 * Creates a tarball using npm pack
 */
async function createTarball(packagePath: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];

    // Use tar command to create tarball with package/ prefix (npm convention)
    // This includes: package.json, dist/, build/, README.md
    const tar = spawn(
      "tar",
      [
        "-czf",
        "-", // Output to stdout
        "--transform",
        "s,^,package/,", // Add package/ prefix
        "-C",
        packagePath,
        "package.json",
        "dist",
        "build",
        "README.md",
        "index.d.ts",
      ],
      {
        cwd: packagePath,
      }
    );

    tar.stdout.on("data", (chunk) => {
      chunks.push(chunk);
    });

    tar.stderr.on("data", (data) => {
      console.error("tar stderr:", data.toString());
    });

    tar.on("close", (code) => {
      if (code === 0) {
        resolve(Buffer.concat(chunks));
      } else {
        reject(new Error(`tar process exited with code ${code}`));
      }
    });

    tar.on("error", (error) => {
      reject(error);
    });
  });
}
