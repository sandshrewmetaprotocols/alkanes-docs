import { useQuery } from '@tanstack/react-query';

export interface TokenBalance {
  runeId: string;
  symbol: string;
  name: string;
  balance: string;           // Raw balance as string (for BigInt)
  balanceFormatted: number;  // Human-readable balance
  decimals: number;
}

export interface WalletBalancesResponse {
  btcBalance: number;           // BTC balance in satoshis
  btcBalanceFormatted: string;  // BTC balance formatted
  tokens: TokenBalance[];
  address: string;
  timestamp: number;
}

/**
 * Fetch wallet balances from the API
 */
async function fetchWalletBalances(address: string): Promise<WalletBalancesResponse> {
  const response = await fetch(`/api/wallet/balances?address=${encodeURIComponent(address)}`);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || 'Failed to fetch wallet balances');
  }

  return response.json();
}

/**
 * Hook to fetch wallet balances (BTC + alkane tokens)
 *
 * @param address - Bitcoin address to fetch balances for
 * @param enabled - Whether to enable the query (default: true when address is provided)
 */
export function useWalletBalances(address: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ['walletBalances', address],
    queryFn: () => fetchWalletBalances(address!),
    enabled: enabled && !!address,
    staleTime: 30000, // Cache for 30 seconds
    refetchInterval: 60000, // Refresh every minute
  });
}

/**
 * Format a balance with appropriate precision
 */
export function formatBalance(balance: number, decimals = 8): string {
  if (balance === 0) return '0';

  if (balance >= 1000000) {
    return `${(balance / 1000000).toFixed(2)}M`;
  }
  if (balance >= 1000) {
    return `${(balance / 1000).toFixed(2)}K`;
  }
  if (balance >= 1) {
    return balance.toFixed(Math.min(decimals, 4));
  }
  return balance.toFixed(Math.min(decimals, 8));
}

/**
 * Format BTC balance
 */
export function formatBtcBalance(satoshis: number): string {
  const btc = satoshis / 100000000;
  if (btc === 0) return '0 BTC';
  if (btc >= 1) return `${btc.toFixed(4)} BTC`;
  if (btc >= 0.001) return `${btc.toFixed(6)} BTC`;
  return `${satoshis.toLocaleString()} sats`;
}
