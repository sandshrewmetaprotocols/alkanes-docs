'use client';

import { Flame } from 'lucide-react';
import { StakingStats } from './StakingStats';
import { StakeForm } from './StakeForm';
import { PositionsList } from './PositionsList';

/**
 * Main FIRE staking section combining all staking components
 */
export function FireStakingSection() {
  return (
    <section className="space-y-8">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500/20 to-red-500/20">
          <Flame className="w-8 h-8 text-orange-500" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[color:var(--sf-text)]">
            FIRE Staking
          </h2>
          <p className="text-sm text-[color:var(--sf-muted)]">
            Stake DIESEL/frBTC LP tokens to earn FIRE rewards
          </p>
        </div>
      </div>

      {/* Global Stats */}
      <StakingStats />

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Stake Form */}
        <div>
          <h3 className="text-lg font-semibold text-[color:var(--sf-text)] mb-4">
            Stake LP Tokens
          </h3>
          <StakeForm />
        </div>

        {/* Positions */}
        <div>
          <h3 className="text-lg font-semibold text-[color:var(--sf-text)] mb-4">
            Your Positions
          </h3>
          <PositionsList />
        </div>
      </div>

      {/* Info Section */}
      <div className="glass-card p-6">
        <h4 className="text-lg font-semibold text-[color:var(--sf-text)] mb-4">
          How FIRE Staking Works
        </h4>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <div className="text-3xl mb-2">1</div>
            <h5 className="font-medium text-[color:var(--sf-text)] mb-1">
              Provide Liquidity
            </h5>
            <p className="text-sm text-[color:var(--sf-muted)]">
              Add liquidity to the DIESEL/frBTC pool to receive LP tokens.
            </p>
          </div>
          <div>
            <div className="text-3xl mb-2">2</div>
            <h5 className="font-medium text-[color:var(--sf-text)] mb-1">
              Stake with Lock
            </h5>
            <p className="text-sm text-[color:var(--sf-muted)]">
              Lock your LP tokens for up to 1 year to earn up to 3x multiplier.
            </p>
          </div>
          <div>
            <div className="text-3xl mb-2">3</div>
            <h5 className="font-medium text-[color:var(--sf-text)] mb-1">
              Earn FIRE
            </h5>
            <p className="text-sm text-[color:var(--sf-muted)]">
              Claim your FIRE rewards anytime. Higher stakes earn more.
            </p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-[color:var(--sf-border)]">
          <h5 className="font-medium text-[color:var(--sf-text)] mb-3">
            Lock Multipliers
          </h5>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'No Lock', mult: '1.0x' },
              { label: '1 Week', mult: '1.25x' },
              { label: '1 Month', mult: '1.5x' },
              { label: '3 Months', mult: '2.0x' },
              { label: '6 Months', mult: '2.5x' },
              { label: '1 Year', mult: '3.0x' },
            ].map(({ label, mult }) => (
              <div
                key={label}
                className="px-3 py-2 rounded-lg bg-[color:var(--sf-surface)] border border-[color:var(--sf-border)]"
              >
                <span className="text-sm text-[color:var(--sf-muted)]">{label}:</span>{' '}
                <span className="font-semibold text-[color:var(--sf-primary)]">
                  {mult}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FireStakingSection;
