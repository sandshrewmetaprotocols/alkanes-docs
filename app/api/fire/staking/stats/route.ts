/**
 * GET /api/fire/staking/stats
 *
 * Fetch global staking statistics from the FIRE staking contract.
 * Currently returns mock data - will be connected to chain once contracts are deployed.
 */

import { NextResponse } from 'next/server';
import { getFireContracts, alkaneIdToString, INITIAL_EMISSION_RATE } from '@/lib/fire/constants';

interface StakingStatsResponse {
  totalStaked: string;
  totalWeightedStake: string;
  currentEpoch: number;
  emissionRate: string;
  totalDistributed: string;
  emissionPoolRemaining: string;
  stakerCount: number;
}

export async function GET() {
  try {
    // TODO: Once contracts are deployed, query the staking contract here
    // const contracts = getFireContracts();
    // const stakingContract = alkaneIdToString(contracts.fireStaking);
    //
    // Query would use metashrew_view with:
    // - GetTotalStaked opcode (12)
    // - GetGlobalStats opcode (14)
    // - GetEmissionRate opcode (15)

    // For now, return initial/empty stats (contracts not yet deployed)
    const response: StakingStatsResponse = {
      totalStaked: '0',
      totalWeightedStake: '0',
      currentEpoch: 0,
      emissionRate: INITIAL_EMISSION_RATE.toString(),
      totalDistributed: '0',
      emissionPoolRemaining: '63000000000000000', // 630K FIRE (30% of max supply)
      stakerCount: 0,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Failed to fetch staking stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch staking stats' },
      { status: 500 }
    );
  }
}
