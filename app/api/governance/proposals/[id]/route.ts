import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeBigInt } from "@/lib/serialize";

/**
 * GET /api/governance/proposals/[id]
 * Get a single proposal with votes
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const proposal = await prisma.proposal.findUnique({
      where: { id },
      include: {
        votes: {
          orderBy: { votingPower: "desc" },
          take: 100, // Limit to top 100 votes
        },
        _count: {
          select: { votes: true },
        },
      },
    });

    if (!proposal) {
      return NextResponse.json(
        { error: "Proposal not found" },
        { status: 404 }
      );
    }

    // Check if proposal state needs updating
    const now = new Date();
    let updatedState = proposal.state;

    if (proposal.state === "PENDING" && now >= proposal.start) {
      updatedState = "ACTIVE";
    } else if (proposal.state === "ACTIVE" && now >= proposal.end) {
      updatedState = "CLOSED";
    }

    // Update state if changed
    if (updatedState !== proposal.state) {
      await prisma.proposal.update({
        where: { id },
        data: { state: updatedState },
      });
      proposal.state = updatedState;
    }

    return NextResponse.json({ proposal: serializeBigInt(proposal) });
  } catch (error) {
    console.error("Error fetching proposal:", error);
    return NextResponse.json(
      { error: "Failed to fetch proposal" },
      { status: 500 }
    );
  }
}
