'use client';

import { Loader2, Flame, Users, TrendingUp, Clock } from 'lucide-react';
import { useStakingStats } from '@/hooks/useFireStaking';
import { formatTokenAmount, HALVING_PERIOD } from '@/lib/fire/constants';

/**
 * Global staking statistics card
 */
export function StakingStats() {
  const { data, isLoading, error, refetch } = useStakingStats();

  if (isLoading) {
    return (
      <div className="glass-card p-6">
        <div className="flex items-center justify-center h-32">
          <Loader2 className="w-8 h-8 animate-spin text-[color:var(--sf-primary)]" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card p-6 text-center">
        <p className="text-red-400 mb-2">Failed to load stats</p>
        <button
          onClick={() => refetch()}
          className="text-sm text-[color:var(--sf-primary)] hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!data) return null;

  // Calculate daily emissions
  const dailyEmissions = data.emissionRate * BigInt(86400);

  // Calculate epoch progress (approximate)
  const epochDays = HALVING_PERIOD / (24 * 60 * 60);

  return (
    <div className="grid md:grid-cols-4 gap-4">
      {/* Total Value Locked */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 rounded-lg bg-[color:var(--sf-primary)]/10">
            <TrendingUp className="w-4 h-4 text-[color:var(--sf-primary)]" />
          </div>
          <span className="text-sm text-[color:var(--sf-muted)]">
            Total Staked
          </span>
        </div>
        <p className="text-2xl font-bold text-[color:var(--sf-text)]">
          {formatTokenAmount(data.totalStaked)}
        </p>
        <p className="text-sm text-[color:var(--sf-muted)]">LP Tokens</p>
      </div>

      {/* Daily Emissions */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 rounded-lg bg-orange-500/10">
            <Flame className="w-4 h-4 text-orange-500" />
          </div>
          <span className="text-sm text-[color:var(--sf-muted)]">
            Daily Emissions
          </span>
        </div>
        <p className="text-2xl font-bold text-orange-500">
          {formatTokenAmount(dailyEmissions)}
        </p>
        <p className="text-sm text-[color:var(--sf-muted)]">FIRE / day</p>
      </div>

      {/* Current Epoch */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 rounded-lg bg-purple-500/10">
            <Clock className="w-4 h-4 text-purple-500" />
          </div>
          <span className="text-sm text-[color:var(--sf-muted)]">
            Current Epoch
          </span>
        </div>
        <p className="text-2xl font-bold text-[color:var(--sf-text)]">
          {data.currentEpoch}
        </p>
        <p className="text-sm text-[color:var(--sf-muted)]">
          ~{epochDays} days / epoch
        </p>
      </div>

      {/* Active Stakers */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 rounded-lg bg-green-500/10">
            <Users className="w-4 h-4 text-green-500" />
          </div>
          <span className="text-sm text-[color:var(--sf-muted)]">
            Active Stakers
          </span>
        </div>
        <p className="text-2xl font-bold text-[color:var(--sf-text)]">
          {data.stakerCount.toLocaleString()}
        </p>
        <p className="text-sm text-[color:var(--sf-muted)]">Unique addresses</p>
      </div>
    </div>
  );
}

export default StakingStats;
