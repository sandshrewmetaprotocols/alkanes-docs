/**
 * FIRE Staking Hook
 *
 * React hook for fetching and managing FIRE staking data.
 * Provides user positions, pending rewards, and global staking stats.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useWallet } from '@/context/WalletContext';
import type {
  StakingPosition,
  UserStakingInfo,
  StakingStats,
  StakeParams,
  UnstakeParams,
  ExtendLockParams,
} from '@/lib/fire/types';
import {
  getFireContracts,
  getRelatedTokens,
  LOCK_OPTIONS,
  formatTokenAmount,
  formatLockTimeRemaining,
} from '@/lib/fire/constants';
import {
  executeStake,
  executeUnstake,
  executeClaim,
  executeExtendLock,
  validateStakeParams,
  validateUnstakeParams,
  validateExtendLockParams,
} from '@/lib/fire/transactions';

// ============================================================================
// API Response Types
// ============================================================================

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

interface StakingStatsResponse {
  totalStaked: string;
  totalWeightedStake: string;
  currentEpoch: number;
  emissionRate: string;
  totalDistributed: string;
  emissionPoolRemaining: string;
  stakerCount: number;
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Fetch user's staking positions from the API
 */
async function fetchUserStaking(address: string): Promise<UserStakingInfo> {
  const response = await fetch(
    `/api/fire/staking/positions?address=${encodeURIComponent(address)}`
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || 'Failed to fetch staking positions');
  }

  const data: UserStakingResponse = await response.json();

  // Convert string amounts to bigints
  const now = Math.floor(Date.now() / 1000);

  return {
    address: data.address,
    positions: data.positions.map((p) => ({
      id: p.id,
      amount: BigInt(p.amount),
      lockEnd: p.lockEnd,
      lockDuration: p.lockDuration,
      multiplierBps: p.multiplierBps,
      pendingRewards: BigInt(p.pendingRewards),
      weightedStake: BigInt(p.weightedStake),
      canUnstake: p.lockEnd === 0 || p.lockEnd <= now,
    })),
    totalStaked: BigInt(data.totalStaked),
    totalWeightedStake: BigInt(data.totalWeightedStake),
    totalPendingRewards: BigInt(data.totalPendingRewards),
    positionCount: data.positionCount,
  };
}

/**
 * Fetch global staking statistics
 */
async function fetchStakingStats(): Promise<StakingStats> {
  const response = await fetch('/api/fire/staking/stats');

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || 'Failed to fetch staking stats');
  }

  const data: StakingStatsResponse = await response.json();

  return {
    totalStaked: BigInt(data.totalStaked),
    totalWeightedStake: BigInt(data.totalWeightedStake),
    currentEpoch: data.currentEpoch,
    emissionRate: BigInt(data.emissionRate),
    totalDistributed: BigInt(data.totalDistributed),
    emissionPoolRemaining: BigInt(data.emissionPoolRemaining),
    stakerCount: data.stakerCount,
  };
}

/**
 * Fetch user's LP token balance
 */
async function fetchLpBalance(address: string): Promise<bigint> {
  const tokens = getRelatedTokens();
  const lpId = `${tokens.dieselFrbtcLp.block}:${tokens.dieselFrbtcLp.tx}`;

  const response = await fetch(
    `/api/wallet/balances?address=${encodeURIComponent(address)}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch LP balance');
  }

  const data = await response.json();
  const lpToken = data.tokens?.find((t: { runeId: string }) => t.runeId === lpId);

  return lpToken ? BigInt(lpToken.balance) : BigInt(0);
}

// ============================================================================
// Hooks
// ============================================================================

/**
 * Hook to fetch user's staking positions
 */
export function useUserStaking(enabled = true) {
  const { address, isConnected } = useWallet();

  return useQuery({
    queryKey: ['fire-staking', 'user', address],
    queryFn: () => fetchUserStaking(address!),
    enabled: enabled && isConnected && !!address,
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refresh every minute
  });
}

/**
 * Hook to fetch global staking statistics
 */
export function useStakingStats(enabled = true) {
  return useQuery({
    queryKey: ['fire-staking', 'stats'],
    queryFn: fetchStakingStats,
    enabled,
    staleTime: 60000, // 1 minute
    refetchInterval: 120000, // Refresh every 2 minutes
  });
}

/**
 * Hook to fetch user's LP token balance
 */
export function useLpBalance(enabled = true) {
  const { address, isConnected } = useWallet();

  return useQuery({
    queryKey: ['lp-balance', address],
    queryFn: () => fetchLpBalance(address!),
    enabled: enabled && isConnected && !!address,
    staleTime: 30000,
    refetchInterval: 60000,
  });
}

/**
 * Hook to fetch pending rewards for a specific position
 */
export function usePositionRewards(positionId: number | undefined, enabled = true) {
  const { address, isConnected } = useWallet();

  return useQuery({
    queryKey: ['fire-staking', 'rewards', address, positionId],
    queryFn: async () => {
      const response = await fetch(
        `/api/fire/staking/rewards?address=${encodeURIComponent(address!)}&positionId=${positionId}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch pending rewards');
      }

      const data = await response.json();
      return BigInt(data.pendingRewards);
    },
    enabled: enabled && isConnected && !!address && positionId !== undefined,
    staleTime: 15000, // 15 seconds - rewards change frequently
    refetchInterval: 30000,
  });
}

// ============================================================================
// Combined Hook
// ============================================================================

/**
 * Combined hook for all staking data
 */
export function useFireStaking() {
  const { address, isConnected } = useWallet();

  const userStaking = useUserStaking();
  const stats = useStakingStats();
  const lpBalance = useLpBalance();

  // Derived data
  const hasPositions = userStaking.data && userStaking.data.positions.length > 0;
  const canStake = lpBalance.data && lpBalance.data > BigInt(0);

  // Calculate user's share of emissions
  const userSharePercent =
    userStaking.data && stats.data && stats.data.totalWeightedStake > BigInt(0)
      ? Number(
          (userStaking.data.totalWeightedStake * BigInt(10000)) /
            stats.data.totalWeightedStake
        ) / 100
      : 0;

  // Estimate daily earnings
  const estimatedDailyRewards =
    stats.data && userStaking.data
      ? (stats.data.emissionRate *
          BigInt(86400) *
          userStaking.data.totalWeightedStake) /
        (stats.data.totalWeightedStake || BigInt(1))
      : BigInt(0);

  return {
    // Wallet state
    address,
    isConnected,

    // Queries
    userStaking,
    stats,
    lpBalance,

    // Derived state
    hasPositions,
    canStake,
    userSharePercent,
    estimatedDailyRewards,

    // Utility functions
    formatAmount: formatTokenAmount,
    formatLockTime: formatLockTimeRemaining,
    lockOptions: LOCK_OPTIONS,
  };
}

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * Hook for staking LP tokens
 */
export function useStake() {
  const queryClient = useQueryClient();
  // Use paymentAddress (p2wpkh) for alkanes operations as WASM works better with segwit
  const { address, paymentAddress, client } = useWallet();

  return useMutation({
    mutationFn: async (params: StakeParams) => {
      // Use paymentAddress (p2wpkh) for the transaction, fall back to address if not available
      const txAddress = paymentAddress || address;
      console.log('[useStake] Starting stake mutation', {
        address,
        paymentAddress,
        txAddress,
        hasClient: !!client
      });

      if (!txAddress || !client) {
        throw new Error('Wallet not connected');
      }

      // Check if client.alkanes exists
      const alkanes = (client as any).alkanes;
      console.log('[useStake] client.alkanes exists:', !!alkanes);
      if (alkanes) {
        console.log('[useStake] client.alkanes.execute is function:', typeof alkanes.execute === 'function');
      }

      // Validate parameters
      const validationError = validateStakeParams(params);
      if (validationError) {
        throw new Error(validationError);
      }

      console.log('[useStake] Calling executeStake with params:', {
        amount: params.amount.toString(),
        lockDuration: params.lockDuration,
        txAddress,
      });

      try {
        // Execute the stake transaction via AlkanesClient
        // Using txAddress (p2wpkh) for better WASM compatibility
        // Note: traceEnabled is disabled as it causes false failures when trace is empty
        const result = await executeStake(client, params, {
          address: txAddress,
          feeRate: 2,
        });
        console.log('[useStake] Stake successful:', result);
        return result;
      } catch (err) {
        console.error('[useStake] Stake failed:', err);
        throw err;
      }
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['fire-staking', 'user', address] });
      queryClient.invalidateQueries({ queryKey: ['fire-staking', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['lp-balance', address] });
    },
  });
}

/**
 * Hook for unstaking LP tokens
 */
export function useUnstake() {
  const queryClient = useQueryClient();
  const { address, client } = useWallet();

  return useMutation({
    mutationFn: async (params: UnstakeParams) => {
      if (!address || !client) {
        throw new Error('Wallet not connected');
      }

      // Validate parameters
      const validationError = validateUnstakeParams(params);
      if (validationError) {
        throw new Error(validationError);
      }

      // Execute the unstake transaction via AlkanesClient
      const result = await executeUnstake(client, params, {
        address,
        feeRate: 2,
      });

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fire-staking', 'user', address] });
      queryClient.invalidateQueries({ queryKey: ['fire-staking', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['lp-balance', address] });
    },
  });
}

/**
 * Hook for claiming rewards
 */
export function useClaimRewards() {
  const queryClient = useQueryClient();
  const { address, client } = useWallet();

  return useMutation({
    mutationFn: async () => {
      if (!address || !client) {
        throw new Error('Wallet not connected');
      }

      // Execute the claim transaction via AlkanesClient
      const result = await executeClaim(client, {
        address,
        feeRate: 2,
      });

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fire-staking', 'user', address] });
    },
  });
}

/**
 * Hook for extending lock duration
 */
export function useExtendLock() {
  const queryClient = useQueryClient();
  const { address, client } = useWallet();

  return useMutation({
    mutationFn: async (params: ExtendLockParams) => {
      if (!address || !client) {
        throw new Error('Wallet not connected');
      }

      // Validate parameters
      const validationError = validateExtendLockParams(params);
      if (validationError) {
        throw new Error(validationError);
      }

      // Execute the extend lock transaction via AlkanesClient
      const result = await executeExtendLock(client, params, {
        address,
        feeRate: 2,
      });

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fire-staking', 'user', address] });
    },
  });
}

export default useFireStaking;
