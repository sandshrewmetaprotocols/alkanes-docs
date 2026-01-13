/**
 * GET /api/fire/staking/positions
 *
 * Fetch user's staking positions from the FIRE staking contract.
 * Currently returns mock data - will be connected to chain once contracts are deployed.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getFireContracts, alkaneIdToString } from '@/lib/fire/constants';

interface StakingPositionResponse {
  id: number;
  amount: string;
  lockEnd: number;
  lockDuration: number;
  multiplierBps: number;
  pendingRewards: string;
  weightedStake: string;
}

interface UserStakingResponse {
  address: string;
  positions: StakingPositionResponse[];
  totalStaked: string;
  totalWeightedStake: string;
  totalPendingRewards: string;
  positionCount: number;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

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
    // Query would use metashrew_view with GetPosition opcode (10)
    // and GetUserPositionCount opcode (13)

    // For now, return empty positions (contracts not yet deployed)
    const response: UserStakingResponse = {
      address,
      positions: [],
      totalStaked: '0',
      totalWeightedStake: '0',
      totalPendingRewards: '0',
      positionCount: 0,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Failed to fetch staking positions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch staking positions' },
      { status: 500 }
    );
  }
}
