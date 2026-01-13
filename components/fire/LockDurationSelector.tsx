'use client';

import { LOCK_OPTIONS } from '@/lib/fire/constants';
import type { LockOption } from '@/lib/fire/types';

interface LockDurationSelectorProps {
  value: number;
  onChange: (seconds: number) => void;
  disabled?: boolean;
}

/**
 * Lock duration selector component
 * Allows users to select how long to lock their staked LP tokens
 */
export function LockDurationSelector({
  value,
  onChange,
  disabled = false,
}: LockDurationSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[color:var(--sf-text)]">
        Lock Duration
      </label>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {LOCK_OPTIONS.map((option) => (
          <button
            key={option.seconds}
            type="button"
            onClick={() => onChange(option.seconds)}
            disabled={disabled}
            className={`
              relative p-3 rounded-lg border transition-all duration-200
              ${
                value === option.seconds
                  ? 'border-[color:var(--sf-primary)] bg-[color:var(--sf-primary)]/10'
                  : 'border-[color:var(--sf-border)] hover:border-[color:var(--sf-primary)]/50'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <div className="text-sm font-medium text-[color:var(--sf-text)]">
              {option.label}
            </div>
            <div
              className={`text-xs mt-1 ${
                value === option.seconds
                  ? 'text-[color:var(--sf-primary)]'
                  : 'text-[color:var(--sf-muted)]'
              }`}
            >
              {option.multiplierDisplay}
            </div>
          </button>
        ))}
      </div>
      <p className="text-xs text-[color:var(--sf-muted)] mt-2">
        Longer lock periods earn higher rewards. Lock ends in {formatLockDuration(value)}.
      </p>
    </div>
  );
}

function formatLockDuration(seconds: number): string {
  if (seconds === 0) return 'No lock (withdraw anytime)';
  const days = Math.floor(seconds / (24 * 60 * 60));
  if (days >= 365) return `${Math.floor(days / 365)} year${days >= 730 ? 's' : ''}`;
  if (days >= 30) return `${Math.floor(days / 30)} month${days >= 60 ? 's' : ''}`;
  if (days >= 7) return `${Math.floor(days / 7)} week${days >= 14 ? 's' : ''}`;
  return `${days} day${days !== 1 ? 's' : ''}`;
}

export default LockDurationSelector;
