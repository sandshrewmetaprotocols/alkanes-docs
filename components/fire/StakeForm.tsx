'use client';

import { useState } from 'react';
import { Loader2, Flame } from 'lucide-react';
import { LockDurationSelector } from './LockDurationSelector';
import { useFireStaking, useStake, useLpBalance } from '@/hooks/useFireStaking';
import {
  formatTokenAmount,
  parseTokenAmount,
  getMultiplierDisplay,
  LOCK_DURATIONS,
} from '@/lib/fire/constants';
import { useWallet } from '@/context/WalletContext';

interface StakeFormProps {
  onSuccess?: () => void;
}

/**
 * Form for staking LP tokens
 */
export function StakeForm({ onSuccess }: StakeFormProps) {
  const { isConnected, onConnectModalOpenChange } = useWallet();
  const { lpBalance } = useFireStaking();
  const stakeMutation = useStake();

  const [amount, setAmount] = useState('');
  const [lockDuration, setLockDuration] = useState(LOCK_DURATIONS.ONE_MONTH);
  const [error, setError] = useState<string | null>(null);

  const balance = lpBalance.data ?? BigInt(0);
  const balanceFormatted = formatTokenAmount(balance);

  const amountBigInt = amount ? parseTokenAmount(amount) : BigInt(0);
  const multiplier = getMultiplierDisplay(lockDuration);
  const weightedStake =
    (amountBigInt * BigInt(getMultiplierBps(lockDuration))) / BigInt(100);

  const isValidAmount = amountBigInt > BigInt(0) && amountBigInt <= balance;
  const canSubmit = isConnected && isValidAmount && !stakeMutation.isPending;

  const handleMax = () => {
    setAmount(formatTokenAmount(balance));
    setError(null);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and decimals
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isConnected) {
      onConnectModalOpenChange(true);
      return;
    }

    if (!isValidAmount) {
      setError('Invalid amount');
      return;
    }

    try {
      await stakeMutation.mutateAsync({
        amount: amountBigInt,
        lockDuration,
      });
      setAmount('');
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to stake');
    }
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2 mb-6">
        <Flame className="w-5 h-5 text-orange-500" />
        <h3 className="text-lg font-semibold text-[color:var(--sf-text)]">
          Stake LP Tokens
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Amount Input */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium text-[color:var(--sf-text)]">
              Amount
            </label>
            <span className="text-sm text-[color:var(--sf-muted)]">
              Balance: {balanceFormatted} LP
            </span>
          </div>
          <div className="relative">
            <input
              type="text"
              value={amount}
              onChange={handleAmountChange}
              placeholder="0.00"
              disabled={stakeMutation.isPending}
              className={`
                w-full p-4 pr-20 rounded-lg border bg-[color:var(--sf-surface)]
                text-[color:var(--sf-text)] placeholder:text-[color:var(--sf-muted)]
                focus:outline-none focus:ring-2 focus:ring-[color:var(--sf-primary)]
                ${error ? 'border-red-500' : 'border-[color:var(--sf-border)]'}
              `}
            />
            <button
              type="button"
              onClick={handleMax}
              disabled={stakeMutation.isPending || balance === BigInt(0)}
              className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1 text-sm
                        bg-[color:var(--sf-primary)]/20 text-[color:var(--sf-primary)]
                        rounded hover:bg-[color:var(--sf-primary)]/30 transition-colors
                        disabled:opacity-50 disabled:cursor-not-allowed"
            >
              MAX
            </button>
          </div>
        </div>

        {/* Lock Duration Selector */}
        <LockDurationSelector
          value={lockDuration}
          onChange={setLockDuration}
          disabled={stakeMutation.isPending}
        />

        {/* Preview */}
        {amountBigInt > BigInt(0) && (
          <div className="p-4 rounded-lg bg-[color:var(--sf-surface)] border border-[color:var(--sf-border)]">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-[color:var(--sf-muted)]">Stake Amount</span>
              <span className="text-[color:var(--sf-text)]">
                {formatTokenAmount(amountBigInt)} LP
              </span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-[color:var(--sf-muted)]">Multiplier</span>
              <span className="text-[color:var(--sf-primary)]">{multiplier}</span>
            </div>
            <div className="flex justify-between text-sm pt-2 border-t border-[color:var(--sf-border)]">
              <span className="text-[color:var(--sf-muted)]">Weighted Stake</span>
              <span className="text-[color:var(--sf-text)] font-semibold">
                {formatTokenAmount(weightedStake)} LP
              </span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!canSubmit}
          className={`
            w-full py-4 rounded-lg font-semibold transition-all duration-200
            flex items-center justify-center gap-2
            ${
              canSubmit
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:opacity-90'
                : 'bg-[color:var(--sf-surface)] text-[color:var(--sf-muted)] cursor-not-allowed'
            }
          `}
        >
          {stakeMutation.isPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Staking...
            </>
          ) : !isConnected ? (
            'Connect Wallet to Stake'
          ) : balance === BigInt(0) ? (
            'No LP Tokens to Stake'
          ) : (
            <>
              <Flame className="w-5 h-5" />
              Stake LP Tokens
            </>
          )}
        </button>
      </form>
    </div>
  );
}

function getMultiplierBps(lockDuration: number): number {
  const option = [
    { seconds: 0, bps: 100 },
    { seconds: 604800, bps: 125 },
    { seconds: 2592000, bps: 150 },
    { seconds: 7776000, bps: 200 },
    { seconds: 15552000, bps: 250 },
    { seconds: 31536000, bps: 300 },
  ].find((o) => o.seconds === lockDuration);
  return option?.bps ?? 100;
}

export default StakeForm;
