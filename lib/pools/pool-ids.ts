/**
 * Client-safe pool ID configuration
 *
 * This file contains only the pool IDs without any server-side dependencies.
 * Safe to import in client components.
 */

// Network detection using NEXT_PUBLIC_ prefix (available on client)
const isRegtest = process.env.NEXT_PUBLIC_NETWORK === 'regtest';

/**
 * Pool IDs by network
 * Regtest: 2:3 (DIESEL/frBTC only - no bUSD pool)
 * Mainnet: 2:77087 (DIESEL/frBTC), 2:68441 (DIESEL/bUSD)
 */
export const POOL_IDS = isRegtest ? {
  DIESEL_FRBTC: {
    id: '2:3',
    block: 2,
    tx: 3,
    name: 'DIESEL/frBTC',
  },
  DIESEL_BUSD: {
    id: 'regtest:unavailable',
    block: 0,
    tx: 0,
    name: 'DIESEL/bUSD (N/A on regtest)',
  },
} as const : {
  DIESEL_FRBTC: {
    id: '2:77087',
    block: 2,
    tx: 77087,
    name: 'DIESEL/frBTC',
  },
  DIESEL_BUSD: {
    id: '2:68441',
    block: 2,
    tx: 68441,
    name: 'DIESEL/bUSD',
  },
} as const;

export type PoolKey = keyof typeof POOL_IDS;
