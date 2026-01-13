/**
 * FIRE Staking Types
 *
 * Type definitions for the FIRE token staking system.
 * Users stake DIESEL/frBTC LP tokens with timelocked multipliers to earn FIRE rewards.
 */

import type { AlkaneId } from '@alkanes/ts-sdk';

// ============================================================================
// Staking Position Types
// ============================================================================

/**
 * A single staking position
 */
export interface StakingPosition {
  /** Unique position identifier */
  id: number;
  /** Amount of LP tokens staked (raw, 8 decimals) */
  amount: bigint;
  /** Unix timestamp when lock expires (0 if no lock) */
  lockEnd: number;
  /** Original lock duration in seconds */
  lockDuration: number;
  /** Lock multiplier (100 = 1.0x, 300 = 3.0x) in basis points */
  multiplierBps: number;
  /** Pending FIRE rewards (raw, 8 decimals) */
  pendingRewards: bigint;
  /** Weighted stake amount (amount * multiplier) */
  weightedStake: bigint;
  /** Whether position can be unstaked (lock expired or no lock) */
  canUnstake: boolean;
}

/**
 * Summary of user's staking positions
 */
export interface UserStakingInfo {
  /** User's wallet address */
  address: string;
  /** Array of user's positions */
  positions: StakingPosition[];
  /** Total LP staked across all positions */
  totalStaked: bigint;
  /** Total weighted stake */
  totalWeightedStake: bigint;
  /** Total pending rewards across all positions */
  totalPendingRewards: bigint;
  /** Number of positions */
  positionCount: number;
}

// ============================================================================
// Global Staking Stats Types
// ============================================================================

/**
 * Global staking statistics
 */
export interface StakingStats {
  /** Total LP tokens staked across all users */
  totalStaked: bigint;
  /** Total weighted stake (includes multipliers) */
  totalWeightedStake: bigint;
  /** Current emission epoch (0-indexed, halves every ~2 years) */
  currentEpoch: number;
  /** Current FIRE emission rate (tokens per second, 8 decimals) */
  emissionRate: bigint;
  /** Total FIRE distributed so far */
  totalDistributed: bigint;
  /** Remaining FIRE in emission pool */
  emissionPoolRemaining: bigint;
  /** Number of active stakers */
  stakerCount: number;
}

// ============================================================================
// Lock Duration Types
// ============================================================================

/**
 * Available lock duration options
 */
export interface LockOption {
  /** Display label */
  label: string;
  /** Duration in seconds (0 = no lock) */
  seconds: number;
  /** Multiplier in basis points (100 = 1.0x) */
  multiplierBps: number;
  /** Human-readable multiplier string */
  multiplierDisplay: string;
}

// ============================================================================
// Transaction Types
// ============================================================================

/**
 * Staking operation types
 */
export enum StakingOpcode {
  Stake = 1,
  Unstake = 2,
  ClaimRewards = 3,
  ExtendLock = 4,
}

/**
 * Query opcodes for reading staking state
 */
export enum StakingQueryOpcode {
  GetPosition = 10,
  GetPendingRewards = 11,
  GetTotalStaked = 12,
  GetUserPositionCount = 13,
  GetGlobalStats = 14,
  GetEmissionRate = 15,
}

/**
 * Stake transaction parameters
 */
export interface StakeParams {
  /** Amount of LP tokens to stake (raw) */
  amount: bigint;
  /** Lock duration in seconds (0 for no lock) */
  lockDuration: number;
}

/**
 * Unstake transaction parameters
 */
export interface UnstakeParams {
  /** Position ID to unstake */
  positionId: number;
}

/**
 * Extend lock transaction parameters
 */
export interface ExtendLockParams {
  /** Position ID to extend */
  positionId: number;
  /** New lock duration in seconds (must be >= current remaining) */
  newDuration: number;
}

// ============================================================================
// Token/Contract ID Types
// ============================================================================

/**
 * FIRE system contract identifiers
 */
export interface FireContracts {
  fireToken: AlkaneId;
  fireStaking: AlkaneId;
  fireTreasury: AlkaneId;
  fireBonding: AlkaneId;
  fireRedemption: AlkaneId;
  fireDistributor: AlkaneId;
}

/**
 * Related token identifiers
 */
export interface RelatedTokens {
  diesel: AlkaneId;
  frbtc: AlkaneId;
  dieselFrbtcLp: AlkaneId;
}

// ============================================================================
// UI State Types
// ============================================================================

/**
 * Staking form state
 */
export interface StakeFormState {
  amount: string;
  lockDuration: number;
  isLoading: boolean;
  error: string | null;
}

/**
 * Position action state
 */
export interface PositionActionState {
  positionId: number | null;
  action: 'claim' | 'unstake' | 'extend' | null;
  isLoading: boolean;
  error: string | null;
}
