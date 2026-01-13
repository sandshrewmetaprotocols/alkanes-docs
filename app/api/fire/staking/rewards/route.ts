/**
 * GET /api/fire/staking/rewards
 *
 * Fetch pending rewards for a user or specific position.
 * Currently returns mock data - will be connected to chain once contracts are deployed.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getFireContracts, alkaneIdToString } from '@/lib/fire/constants';

interface RewardsResponse {
  pendingRewards: string;
  positionId?: number;
  address: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');
    const positionId = searchParams.get('positionId');

    if (!address) {
      return NextResponse.json(
        { error: 'Missing address parameter' },
        { status: 400 }
      );
    }

    // TODO: Once contracts are deployed, query the staking contract here
    // const contracts = getFireContracts();
    // const stakingContract = alkaneIdToString(contracts.fireStaking);
    //
    // Query would use metashrew_view with GetPendingRewards opcode (11)
    // Parameters: address, optionally positionId

    // For now, return zero rewards (contracts not yet deployed)
    const response: RewardsResponse = {
      pendingRewards: '0',
      positionId: positionId ? parseInt(positionId, 10) : undefined,
      address,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Failed to fetch pending rewards:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pending rewards' },
      { status: 500 }
    );
  }
}
