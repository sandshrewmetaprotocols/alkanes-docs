'use client';

import { Loader2, Flame, Wallet } from 'lucide-react';
import { PositionCard } from './PositionCard';
import { useFireStaking } from '@/hooks/useFireStaking';
import { formatTokenAmount } from '@/lib/fire/constants';
import { useWallet } from '@/context/WalletContext';

/**
 * List of user's staking positions
 */
export function PositionsList() {
  const { isConnected, onConnectModalOpenChange } = useWallet();
  const { userStaking, hasPositions } = useFireStaking();

  // Not connected state
  if (!isConnected) {
    return (
      <div className="glass-card p-8 text-center">
        <Wallet className="w-12 h-12 mx-auto mb-4 text-[color:var(--sf-muted)]" />
        <h3 className="text-lg font-semibold text-[color:var(--sf-text)] mb-2">
          Connect Wallet
        </h3>
        <p className="text-sm text-[color:var(--sf-muted)] mb-4">
          Connect your wallet to view your staking positions
        </p>
        <button
          onClick={() => onConnectModalOpenChange(true)}
          className="px-6 py-2 rounded-lg bg-[color:var(--sf-primary)] text-white
                     hover:opacity-90 transition-opacity"
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  // Loading state
  if (userStaking.isLoading) {
    return (
      <div className="glass-card p-8 text-center">
        <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-[color:var(--sf-primary)]" />
        <p className="text-sm text-[color:var(--sf-muted)]">
          Loading positions...
        </p>
      </div>
    );
  }

  // Error state
  if (userStaking.error) {
    return (
      <div className="glass-card p-8 text-center">
        <p className="text-red-400 mb-2">Failed to load positions</p>
        <button
          onClick={() => userStaking.refetch()}
          className="text-sm text-[color:var(--sf-primary)] hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  // No positions state
  if (!hasPositions) {
    return (
      <div className="glass-card p-8 text-center">
        <Flame className="w-12 h-12 mx-auto mb-4 text-orange-500/50" />
        <h3 className="text-lg font-semibold text-[color:var(--sf-text)] mb-2">
          No Staking Positions
        </h3>
        <p className="text-sm text-[color:var(--sf-muted)]">
          Stake your DIESEL/frBTC LP tokens to earn FIRE rewards
        </p>
      </div>
    );
  }

  const data = userStaking.data!;

  return (
    <div className="space-y-4">
      {/* Summary Header */}
      <div className="glass-card p-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-[color:var(--sf-muted)] mb-1">
              Total Staked
            </p>
            <p className="text-lg font-semibold text-[color:var(--sf-text)]">
              {formatTokenAmount(data.totalStaked)} LP
            </p>
          </div>
          <div>
            <p className="text-xs text-[color:var(--sf-muted)] mb-1">
              Weighted Stake
            </p>
            <p className="text-lg font-semibold text-[color:var(--sf-text)]">
              {formatTokenAmount(data.totalWeightedStake)} LP
            </p>
          </div>
          <div>
            <p className="text-xs text-[color:var(--sf-muted)] mb-1">
              Pending Rewards
            </p>
            <p className="text-lg font-semibold text-orange-500">
              {formatTokenAmount(data.totalPendingRewards)} FIRE
            </p>
          </div>
        </div>
      </div>

      {/* Positions Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {data.positions.map((position) => (
          <PositionCard key={position.id} position={position} />
        ))}
      </div>
    </div>
  );
}

export default PositionsList;
