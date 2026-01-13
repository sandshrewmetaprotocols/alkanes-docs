/**
 * FIRE Staking Constants
 *
 * Contract IDs, lock durations, multipliers, and configuration for the FIRE staking system.
 * Network-aware configuration supports mainnet, regtest, and other environments.
 */

import type { AlkaneId } from '@alkanes/ts-sdk';
import type { FireContracts, RelatedTokens, LockOption } from './types';

// ============================================================================
// Network Configuration
// ============================================================================

export type NetworkType = 'mainnet' | 'regtest' | 'testnet' | 'signet';

/**
 * Get current network from environment
 */
export function getCurrentNetwork(): NetworkType {
  const network = process.env.NEXT_PUBLIC_NETWORK;
  if (network === 'mainnet' || network === 'regtest' || network === 'testnet' || network === 'signet') {
    return network;
  }
  return 'mainnet';
}

// ============================================================================
// Contract IDs by Network
// ============================================================================

/**
 * FIRE contract addresses by network
 * Template IDs are in the 0x100 (256) range to avoid conflicts
 */
export const FIRE_CONTRACTS: Record<NetworkType, FireContracts> = {
  mainnet: {
    fireToken: { block: 4, tx: 256 },      // 0x100
    fireStaking: { block: 4, tx: 257 },    // 0x101
    fireTreasury: { block: 4, tx: 258 },   // 0x102
    fireBonding: { block: 4, tx: 259 },    // 0x103
    fireRedemption: { block: 4, tx: 260 }, // 0x104
    fireDistributor: { block: 4, tx: 261 }, // 0x105
  },
  regtest: {
    // Regtest uses different staking contract ID (redeployed with correct LP token)
    fireToken: { block: 4, tx: 256 },
    fireStaking: { block: 4, tx: 263 },    // 0x107 - redeployed with LP 2:3
    fireTreasury: { block: 4, tx: 258 },
    fireBonding: { block: 4, tx: 259 },
    fireRedemption: { block: 4, tx: 260 },
    fireDistributor: { block: 4, tx: 261 },
  },
  testnet: {
    fireToken: { block: 4, tx: 256 },
    fireStaking: { block: 4, tx: 257 },
    fireTreasury: { block: 4, tx: 258 },
    fireBonding: { block: 4, tx: 259 },
    fireRedemption: { block: 4, tx: 260 },
    fireDistributor: { block: 4, tx: 261 },
  },
  signet: {
    fireToken: { block: 4, tx: 256 },
    fireStaking: { block: 4, tx: 257 },
    fireTreasury: { block: 4, tx: 258 },
    fireBonding: { block: 4, tx: 259 },
    fireRedemption: { block: 4, tx: 260 },
    fireDistributor: { block: 4, tx: 261 },
  },
};

/**
 * Related token addresses by network
 */
export const RELATED_TOKENS: Record<NetworkType, RelatedTokens> = {
  mainnet: {
    diesel: { block: 2, tx: 0 },
    frbtc: { block: 32, tx: 0 },
    dieselFrbtcLp: { block: 2, tx: 77087 }, // 0x12d1f
  },
  regtest: {
    diesel: { block: 2, tx: 0 },
    frbtc: { block: 32, tx: 0 },
    dieselFrbtcLp: { block: 2, tx: 3 }, // Regtest pool ID
  },
  testnet: {
    diesel: { block: 2, tx: 0 },
    frbtc: { block: 32, tx: 0 },
    dieselFrbtcLp: { block: 2, tx: 77087 },
  },
  signet: {
    diesel: { block: 2, tx: 0 },
    frbtc: { block: 32, tx: 0 },
    dieselFrbtcLp: { block: 2, tx: 77087 },
  },
};

/**
 * Get FIRE contracts for current network
 */
export function getFireContracts(): FireContracts {
  return FIRE_CONTRACTS[getCurrentNetwork()];
}

/**
 * Get related tokens for current network
 */
export function getRelatedTokens(): RelatedTokens {
  return RELATED_TOKENS[getCurrentNetwork()];
}

// ============================================================================
// Lock Duration Options
// ============================================================================

/**
 * Lock duration constants in seconds
 */
export const LOCK_DURATIONS = {
  NONE: 0,
  ONE_WEEK: 7 * 24 * 60 * 60,         // 604,800 seconds
  ONE_MONTH: 30 * 24 * 60 * 60,       // 2,592,000 seconds
  THREE_MONTHS: 90 * 24 * 60 * 60,    // 7,776,000 seconds
  SIX_MONTHS: 180 * 24 * 60 * 60,     // 15,552,000 seconds
  ONE_YEAR: 365 * 24 * 60 * 60,       // 31,536,000 seconds
} as const;

/**
 * Lock multipliers in basis points (100 = 1.0x)
 */
export const LOCK_MULTIPLIERS_BPS = {
  NONE: 100,           // 1.0x
  ONE_WEEK: 125,       // 1.25x
  ONE_MONTH: 150,      // 1.5x
  THREE_MONTHS: 200,   // 2.0x
  SIX_MONTHS: 250,     // 2.5x
  ONE_YEAR: 300,       // 3.0x
} as const;

/**
 * Available lock options for UI selection
 */
export const LOCK_OPTIONS: LockOption[] = [
  {
    label: 'No Lock',
    seconds: LOCK_DURATIONS.NONE,
    multiplierBps: LOCK_MULTIPLIERS_BPS.NONE,
    multiplierDisplay: '1.0x',
  },
  {
    label: '1 Week',
    seconds: LOCK_DURATIONS.ONE_WEEK,
    multiplierBps: LOCK_MULTIPLIERS_BPS.ONE_WEEK,
    multiplierDisplay: '1.25x',
  },
  {
    label: '1 Month',
    seconds: LOCK_DURATIONS.ONE_MONTH,
    multiplierBps: LOCK_MULTIPLIERS_BPS.ONE_MONTH,
    multiplierDisplay: '1.5x',
  },
  {
    label: '3 Months',
    seconds: LOCK_DURATIONS.THREE_MONTHS,
    multiplierBps: LOCK_MULTIPLIERS_BPS.THREE_MONTHS,
    multiplierDisplay: '2.0x',
  },
  {
    label: '6 Months',
    seconds: LOCK_DURATIONS.SIX_MONTHS,
    multiplierBps: LOCK_MULTIPLIERS_BPS.SIX_MONTHS,
    multiplierDisplay: '2.5x',
  },
  {
    label: '1 Year',
    seconds: LOCK_DURATIONS.ONE_YEAR,
    multiplierBps: LOCK_MULTIPLIERS_BPS.ONE_YEAR,
    multiplierDisplay: '3.0x',
  },
];

/**
 * Get multiplier in basis points for a given lock duration
 */
export function getMultiplierBps(lockDurationSeconds: number): number {
  const option = LOCK_OPTIONS.find(opt => opt.seconds === lockDurationSeconds);
  return option?.multiplierBps ?? LOCK_MULTIPLIERS_BPS.NONE;
}

/**
 * Get human-readable multiplier string for a lock duration
 */
export function getMultiplierDisplay(lockDurationSeconds: number): string {
  const option = LOCK_OPTIONS.find(opt => opt.seconds === lockDurationSeconds);
  return option?.multiplierDisplay ?? '1.0x';
}

// ============================================================================
// Token Metadata
// ============================================================================

export const FIRE_TOKEN_METADATA = {
  symbol: 'FIRE',
  name: 'FIRE Token',
  decimals: 8,
} as const;

export const LP_TOKEN_METADATA = {
  symbol: 'DIESEL/frBTC LP',
  name: 'DIESEL/frBTC Liquidity Pool Token',
  decimals: 8,
} as const;

// ============================================================================
// Tokenomics Constants
// ============================================================================

/** Maximum FIRE supply: 2.1M tokens (with 8 decimals = 210,000,000,000,000 units) */
export const MAX_SUPPLY = BigInt('210000000000000000');

/** Treasury pre-mine: 50% of max supply */
export const TREASURY_PREMINE = BigInt('105000000000000000');

/** Team pre-mine: 20% of max supply */
export const TEAM_PREMINE = BigInt('42000000000000000');

/** Emission pool: 30% of max supply */
export const EMISSION_POOL = BigInt('63000000000000000');

/** Initial emission rate: ~173 FIRE/day (200,000 units/second with 8 decimals) */
export const INITIAL_EMISSION_RATE = BigInt('20000000');

/** Emission halving period in seconds (~2 years) */
export const HALVING_PERIOD = 2 * 365 * 24 * 60 * 60;

// ============================================================================
// Display Helpers
// ============================================================================

/**
 * Format a token amount for display (8 decimals)
 */
export function formatTokenAmount(amount: bigint, decimals: number = 8): string {
  const divisor = BigInt(10 ** decimals);
  const whole = amount / divisor;
  const fraction = amount % divisor;
  const fractionStr = fraction.toString().padStart(decimals, '0').replace(/0+$/, '');

  if (fractionStr.length === 0) {
    return whole.toLocaleString();
  }

  return `${whole.toLocaleString()}.${fractionStr}`;
}

/**
 * Parse a token amount from string input
 */
export function parseTokenAmount(value: string, decimals: number = 8): bigint {
  const [whole, fraction = ''] = value.split('.');
  const paddedFraction = fraction.padEnd(decimals, '0').slice(0, decimals);
  return BigInt(whole + paddedFraction);
}

/**
 * Format remaining lock time for display
 */
export function formatLockTimeRemaining(lockEnd: number): string {
  const now = Math.floor(Date.now() / 1000);
  const remaining = lockEnd - now;

  if (remaining <= 0) return 'Unlocked';

  const days = Math.floor(remaining / (24 * 60 * 60));
  const hours = Math.floor((remaining % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((remaining % (60 * 60)) / 60);

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

/**
 * Convert AlkaneId to string format
 */
export function alkaneIdToString(id: AlkaneId): string {
  return `${id.block}:${id.tx}`;
}

/**
 * Parse AlkaneId from string format
 */
export function parseAlkaneId(str: string): AlkaneId {
  const [block, tx] = str.split(':').map(Number);
  return { block, tx };
}
