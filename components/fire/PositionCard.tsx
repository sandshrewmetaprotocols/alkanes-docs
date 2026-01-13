'use client';

import { useState } from 'react';
import { Loader2, Lock, Unlock, Clock, Flame, ArrowUpRight } from 'lucide-react';
import type { StakingPosition } from '@/lib/fire/types';
import {
  formatTokenAmount,
  formatLockTimeRemaining,
  getMultiplierDisplay,
} from '@/lib/fire/constants';
import { useClaimRewards, useUnstake, useExtendLock } from '@/hooks/useFireStaking';

interface PositionCardProps {
  position: StakingPosition;
}

/**
 * Card displaying a single staking position
 */
export function PositionCard({ position }: PositionCardProps) {
  const claimMutation = useClaimRewards();
  const unstakeMutation = useUnstake();
  const [error, setError] = useState<string | null>(null);

  const isLocked = position.lockEnd > Math.floor(Date.now() / 1000);
  const lockTimeRemaining = formatLockTimeRemaining(position.lockEnd);
  const multiplier = getMultiplierDisplay(position.lockDuration);

  const handleClaim = async () => {
    setError(null);
    try {
      await claimMutation.mutateAsync();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to claim');
    }
  };

  const handleUnstake = async () => {
    setError(null);
    try {
      await unstakeMutation.mutateAsync({ positionId: position.id });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unstake');
    }
  };

  const isPending = claimMutation.isPending || unstakeMutation.isPending;

  return (
    <div className="glass-card p-5 hover:border-[color:var(--sf-primary)]/30 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[color:var(--sf-muted)]">
            Position #{position.id}
          </span>
          {isLocked ? (
            <div className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-500">
              <Lock className="w-3 h-3" />
              <span>{lockTimeRemaining}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-500">
              <Unlock className="w-3 h-3" />
              <span>Unlocked</span>
            </div>
          )}
        </div>
        <span className="text-sm font-semibold text-[color:var(--sf-primary)]">
          {multiplier}
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-[color:var(--sf-muted)] mb-1">Staked</p>
          <p className="text-lg font-semibold text-[color:var(--sf-text)]">
            {formatTokenAmount(position.amount)}
            <span className="text-sm font-normal text-[color:var(--sf-muted)] ml-1">
              LP
            </span>
          </p>
        </div>
        <div>
          <p className="text-xs text-[color:var(--sf-muted)] mb-1">Weighted</p>
          <p className="text-lg font-semibold text-[color:var(--sf-text)]">
            {formatTokenAmount(position.weightedStake)}
            <span className="text-sm font-normal text-[color:var(--sf-muted)] ml-1">
              LP
            </span>
          </p>
        </div>
      </div>

      {/* Pending Rewards */}
      <div className="p-3 rounded-lg bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-sm text-[color:var(--sf-muted)]">
              Pending Rewards
            </span>
          </div>
          <span className="text-lg font-bold text-orange-500">
            {formatTokenAmount(position.pendingRewards)} FIRE
          </span>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-2 rounded bg-red-500/10 border border-red-500/30 mb-4">
          <p className="text-xs text-red-400">{error}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={handleClaim}
          disabled={isPending || position.pendingRewards === BigInt(0)}
          className={`
            flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors
            flex items-center justify-center gap-2
            ${
              position.pendingRewards > BigInt(0) && !isPending
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:opacity-90'
                : 'bg-[color:var(--sf-surface)] text-[color:var(--sf-muted)] cursor-not-allowed'
            }
          `}
        >
          {claimMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Flame className="w-4 h-4" />
              Claim
            </>
          )}
        </button>

        <button
          onClick={handleUnstake}
          disabled={isPending || isLocked}
          className={`
            flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors
            flex items-center justify-center gap-2
            ${
              !isLocked && !isPending
                ? 'bg-[color:var(--sf-surface)] border border-[color:var(--sf-border)] text-[color:var(--sf-text)] hover:border-[color:var(--sf-primary)]'
                : 'bg-[color:var(--sf-surface)] text-[color:var(--sf-muted)] cursor-not-allowed'
            }
          `}
          title={isLocked ? `Locked for ${lockTimeRemaining}` : 'Unstake position'}
        >
          {unstakeMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : isLocked ? (
            <>
              <Lock className="w-4 h-4" />
              Locked
            </>
          ) : (
            <>
              <ArrowUpRight className="w-4 h-4" />
              Unstake
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default PositionCard;
