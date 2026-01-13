/**
 * FIRE Staking Transaction Builders
 *
 * Builds and executes transactions for staking, unstaking, claiming, and extending locks.
 * Uses AlkanesProvider.alkanesExecuteTyped() for contract interactions.
 *
 * SDK Usage:
 * - AlkanesClient has a `.provider` which is an `AlkanesProvider`
 * - AlkanesProvider has `.alkanesExecuteTyped()` which handles the full flow
 * - For keystore wallets: loads mnemonic into WASM provider for signing
 * - For browser wallets: Currently requires PSBT-based flow (not yet implemented)
 */

import type { AlkaneId, AlkanesClient, KeystoreSigner } from '@alkanes/ts-sdk';
import type { StakeParams, UnstakeParams, ExtendLockParams } from './types';
import {
  getFireContracts,
  getRelatedTokens,
  alkaneIdToString,
  LOCK_DURATIONS,
} from './constants';

// ============================================================================
// Wallet Loading Helpers
// ============================================================================

/**
 * Ensure the WASM provider has a loaded wallet for signing.
 * For keystore signers, loads the mnemonic into the WASM provider.
 * For browser wallets, throws an error as they require PSBT-based flow.
 *
 * Returns the AlkanesProvider for use in transaction execution.
 */
async function ensureWalletLoaded(client: AlkanesClient): Promise<any> {
  console.log('[ensureWalletLoaded] Starting wallet load check');

  // Check signer type FIRST - if it's a browser wallet, we can give a helpful error
  // without needing to access the WASM provider
  let signerType: string;

  // Try getSignerType method first
  if (typeof client.getSignerType === 'function') {
    signerType = client.getSignerType();
    console.log('[ensureWalletLoaded] Signer type (from method):', signerType);
  } else {
    // Fallback: detect from constructor name
    const signerName = (client.signer as any)?.constructor?.name || '';
    console.log('[ensureWalletLoaded] Signer constructor name:', signerName);

    if (signerName.toLowerCase().includes('keystore')) {
      signerType = 'keystore';
    } else if (signerName.toLowerCase().includes('browser')) {
      signerType = 'browser';
    } else {
      // Unknown - try to detect from signer properties
      const signer = client.signer as any;
      if (typeof signer?.exportMnemonic === 'function') {
        signerType = 'keystore';
      } else if (typeof signer?.getAdapter === 'function') {
        signerType = 'browser';
      } else {
        signerType = 'unknown';
      }
    }
    console.log('[ensureWalletLoaded] Signer type (detected):', signerType);
  }

  // For browser wallets, immediately show helpful error
  if (signerType === 'browser') {
    throw new Error(
      'Staking transactions currently require a keystore wallet. ' +
      'Browser wallet support (Unisat, Xverse, etc.) is coming soon. ' +
      'Please use "Unlock Wallet" with your recovery phrase to stake.'
    );
  }

  // For keystore wallets, we need to load the mnemonic into WASM
  if (signerType === 'keystore') {
    const signer = client.signer as KeystoreSigner;
    const alkanesProvider = client.provider as any;

    console.log('[ensureWalletLoaded] Keystore wallet detected');
    console.log('[ensureWalletLoaded] Provider type:', alkanesProvider?.constructor?.name);

    // Initialize provider if needed
    if (typeof alkanesProvider.initialize === 'function') {
      console.log('[ensureWalletLoaded] Calling provider.initialize()...');
      await alkanesProvider.initialize();
      console.log('[ensureWalletLoaded] Provider initialized');
    }

    // Get the raw WASM provider to load the mnemonic
    let rawProvider = null;

    // Try _provider directly (the internal WASM provider)
    try {
      rawProvider = alkanesProvider._provider;
    } catch (e) {
      console.log('[ensureWalletLoaded] _provider access error:', (e as Error).message);
    }

    // Fallback: try getProvider()
    if (!rawProvider && typeof alkanesProvider.getProvider === 'function') {
      try {
        rawProvider = await alkanesProvider.getProvider();
      } catch (e) {
        console.log('[ensureWalletLoaded] getProvider() error:', (e as Error).message);
      }
    }

    if (!rawProvider) {
      throw new Error('WASM provider not available. Please try refreshing the page.');
    }

    console.log('[ensureWalletLoaded] Raw provider type:', rawProvider?.constructor?.name);

    // Check if wallet is already loaded
    if (typeof rawProvider.walletIsLoaded === 'function' && rawProvider.walletIsLoaded()) {
      console.log('[ensureWalletLoaded] Wallet already loaded in WASM');
      return alkanesProvider;
    }

    // Export mnemonic from keystore signer and load into WASM
    if (typeof signer.exportMnemonic === 'function') {
      const mnemonic = signer.exportMnemonic();
      console.log('[ensureWalletLoaded] Mnemonic length:', mnemonic?.split(' ')?.length, 'words');
      rawProvider.walletLoadMnemonic(mnemonic);
      console.log('[ensureWalletLoaded] Loaded mnemonic into WASM provider');
    } else {
      throw new Error('Unable to export mnemonic from keystore signer');
    }

    // Return the AlkanesProvider (not raw provider) for high-level API access
    return alkanesProvider;
  }

  // Unknown signer type
  throw new Error(
    `Unknown wallet type. Please disconnect and reconnect your wallet.`
  );
}

// ============================================================================
// Types
// ============================================================================

export interface TransactionConfig {
  /** User's wallet address */
  address: string;
  /** Fee rate in sats/vbyte (default: 2) */
  feeRate?: number;
  /** Enable execution traces for debugging */
  traceEnabled?: boolean;
  /** Auto-confirm transaction (default: true) */
  autoConfirm?: boolean;
}

export interface TransactionResult {
  /** Transaction ID */
  txid: string;
  /** Raw transaction hex (if available) */
  rawTx?: string;
  /** Reveal transaction ID (for two-phase commits) */
  revealTxid?: string;
}

// ============================================================================
// Protostone Helpers
// ============================================================================

/**
 * Build protostone string for a contract call
 * Format: [block,tx,opcode,...args]:output_targets
 */
export function buildProtostoneString(
  contract: AlkaneId,
  opcode: number,
  args: (bigint | number)[] = [],
  outputs: string = 'v0:v0'
): string {
  const argsStr = args.length > 0 ? `,${args.map((a) => a.toString()).join(',')}` : '';
  return `[${contract.block},${contract.tx},${opcode}${argsStr}]:${outputs}`;
}

/**
 * Build input requirements string for token transfers
 * Format: block:tx:amount,block:tx:amount,...
 * This matches the CLI format expected by alkanesExecuteWithStrings
 */
export function buildInputRequirementsString(
  tokens: { id: AlkaneId; amount: bigint }[]
): string {
  return tokens
    .map((t) => `${t.id.block}:${t.id.tx}:${t.amount.toString()}`)
    .join(',');
}

// ============================================================================
// Staking Transaction Executors
// ============================================================================

/**
 * Execute a stake transaction
 *
 * Stakes LP tokens into the FIRE staking contract with a lock duration.
 *
 * @param client - AlkanesClient instance
 * @param params - Stake parameters (amount, lockDuration)
 * @param config - Transaction configuration
 */
export async function executeStake(
  client: AlkanesClient,
  params: StakeParams,
  config: TransactionConfig
): Promise<TransactionResult> {
  const contracts = getFireContracts();
  const tokens = getRelatedTokens();

  // Validate parameters
  const validationError = validateStakeParams(params);
  if (validationError) {
    throw new Error(validationError);
  }

  // Ensure wallet is loaded in WASM provider and get the AlkanesProvider
  // This will throw an informative error for browser wallets
  const alkanesProvider = await ensureWalletLoaded(client);
  if (!alkanesProvider) {
    throw new Error('AlkanesProvider is not available');
  }

  // Get raw WASM provider for pre-flight checks and execution
  const rawProvider = alkanesProvider._provider;
  if (!rawProvider) {
    throw new Error('WASM WebProvider is not available');
  }

  // Pre-flight check: Verify the staking contract exists
  const stakingContractId = `${contracts.fireStaking.block}:${contracts.fireStaking.tx}`;
  console.log('[executeStake] Checking if staking contract exists:', stakingContractId);

  try {
    // Try to get bytecode for the staking contract
    const bytecode = await rawProvider.alkanesBytecode(stakingContractId);
    console.log('[executeStake] Contract bytecode length:', bytecode?.length ?? 0);

    if (!bytecode || bytecode.length === 0) {
      throw new Error(
        `FIRE staking contract (${stakingContractId}) does not exist on this network. ` +
        'The FIRE contracts need to be deployed before staking can work. ' +
        'Please contact the team or check the deployment status.'
      );
    }
  } catch (err) {
    const errorMsg = (err as Error).message;
    // If it's our own error about contract not existing, re-throw
    if (errorMsg.includes('does not exist')) {
      throw err;
    }
    // Otherwise log and continue (the bytecode check might not be available)
    console.warn('[executeStake] Could not verify contract existence:', errorMsg);
  }

  // Build protostone string: [block,tx,opcode,...args]:pointer:refund
  // Opcode 1 = Stake, with lock_duration arg
  const protostone = buildProtostoneString(contracts.fireStaking, 1, [
    BigInt(params.lockDuration),
  ]);

  // Build input requirements string: block:tx:amount
  const inputRequirements = buildInputRequirementsString([
    { id: tokens.dieselFrbtcLp, amount: params.amount },
  ]);

  // Use alkanesExecuteWithStrings - the newer WASM should handle p2tr:0 correctly
  const toAddresses = JSON.stringify(['p2tr:0']);

  // IMPORTANT: Include p2tr:0 in from_addresses because alkanes (LP tokens)
  // are typically held on the taproot address, not the default p2wpkh address.
  // The WASM defaults to querying only p2wpkh which won't find our LP tokens.
  // NOTE: trace_enabled is disabled because alkanesExecuteFull errors on empty traces
  // even when the transaction succeeds. Tracing requires the contract to emit trace output.
  const optionsJson = JSON.stringify({
    trace_enabled: false,  // Disabled - causes false failures on empty trace
    auto_confirm: config.autoConfirm ?? true,
    mine_enabled: true,
    from_addresses: ['p2tr:0', 'p2wpkh:0'],  // Query both address types for UTXOs
  });

  console.log('[executeStake] Calling alkanesExecuteFull:', {
    toAddresses,
    inputRequirements,
    protostone,
    feeRate: config.feeRate ?? 2,
    options: optionsJson,
  });

  // Use alkanesExecuteFull which handles the complete flow:
  // sign -> broadcast -> mine (on regtest) -> trace
  let result;
  try {
    result = await rawProvider.alkanesExecuteFull(
      toAddresses,
      inputRequirements,
      protostone,
      config.feeRate ?? 2,
      null,
      optionsJson
    );
  } catch (err) {
    console.error('[executeStake] WASM execution error:', err);
    throw new Error(`Staking transaction failed: ${(err as Error).message}`);
  }

  console.log('[executeStake] Raw result:', result);
  console.log('[executeStake] Result type:', typeof result);

  // Parse the result
  const parsed = typeof result === 'string' ? JSON.parse(result) : result;
  console.log('[executeStake] Parsed result:', JSON.stringify(parsed, null, 2));

  // Check for error conditions
  if (parsed?.error) {
    throw new Error(`Staking failed: ${parsed.error}`);
  }

  // Check if we got a readyToSign state (incomplete)
  if (parsed?.readyToSign || parsed?.needsConfirmation || parsed?.state === 'pending') {
    console.error('[executeStake] Transaction incomplete - needs confirmation:', parsed);
    throw new Error('Transaction requires confirmation but auto_confirm was set. This may indicate a wallet or network issue.');
  }

  // Extract txid from various possible field names
  const txid = parsed?.txid || parsed?.reveal_txid || parsed?.broadcast_txid || '';

  if (!txid) {
    console.error('[executeStake] No txid in result:', parsed);
    throw new Error('Transaction completed but no txid was returned. The transaction may have failed silently.');
  }

  console.log('[executeStake] Success! TXID:', txid);

  return {
    txid,
    revealTxid: parsed?.reveal_txid,
    rawTx: parsed?.rawTx,
  };
}

/**
 * Execute an unstake transaction
 *
 * Withdraws staked LP tokens from a position (if lock has expired).
 *
 * @param client - AlkanesClient instance
 * @param params - Unstake parameters (positionId)
 * @param config - Transaction configuration
 */
export async function executeUnstake(
  client: AlkanesClient,
  params: UnstakeParams,
  config: TransactionConfig
): Promise<TransactionResult> {
  const contracts = getFireContracts();

  // Validate parameters
  const validationError = validateUnstakeParams(params);
  if (validationError) {
    throw new Error(validationError);
  }

  // Ensure wallet is loaded in WASM provider and get the AlkanesProvider
  const alkanesProvider = await ensureWalletLoaded(client);
  if (!alkanesProvider) {
    throw new Error('AlkanesProvider is not available');
  }

  // Get raw WASM provider
  const rawProvider = alkanesProvider._provider;
  if (!rawProvider) {
    throw new Error('WASM WebProvider is not available');
  }

  // Build protostone: Opcode 2 = Unstake with position_id
  const protostone = buildProtostoneString(contracts.fireStaking, 2, [
    BigInt(params.positionId),
  ]);

  const toAddresses = JSON.stringify(['p2tr:0']);
  const optionsJson = JSON.stringify({
    trace_enabled: false,  // Disabled - causes false failures on empty trace
    auto_confirm: config.autoConfirm ?? true,
    mine_enabled: true,
    from_addresses: ['p2tr:0', 'p2wpkh:0'],
  });

  const result = await rawProvider.alkanesExecuteFull(
    toAddresses,
    '',
    protostone,
    config.feeRate ?? 2,
    null,
    optionsJson
  );

  const parsed = typeof result === 'string' ? JSON.parse(result) : result;

  return {
    txid: parsed?.txid || parsed?.reveal_txid || '',
    revealTxid: parsed?.reveal_txid,
    rawTx: parsed?.rawTx,
  };
}

/**
 * Execute a claim rewards transaction
 *
 * Claims all pending FIRE rewards across all positions.
 *
 * @param client - AlkanesClient instance
 * @param config - Transaction configuration
 */
export async function executeClaim(
  client: AlkanesClient,
  config: TransactionConfig
): Promise<TransactionResult> {
  const contracts = getFireContracts();

  // Ensure wallet is loaded in WASM provider and get the AlkanesProvider
  const alkanesProvider = await ensureWalletLoaded(client);
  if (!alkanesProvider) {
    throw new Error('AlkanesProvider is not available');
  }

  // Get raw WASM provider
  const rawProvider = alkanesProvider._provider;
  if (!rawProvider) {
    throw new Error('WASM WebProvider is not available');
  }

  // Build protostone: Opcode 3 = ClaimRewards (no params)
  const protostone = buildProtostoneString(contracts.fireStaking, 3, []);

  const toAddresses = JSON.stringify(['p2tr:0']);
  const optionsJson = JSON.stringify({
    trace_enabled: false,  // Disabled - causes false failures on empty trace
    auto_confirm: config.autoConfirm ?? true,
    mine_enabled: true,
    from_addresses: ['p2tr:0', 'p2wpkh:0'],
  });

  const result = await rawProvider.alkanesExecuteFull(
    toAddresses,
    '',
    protostone,
    config.feeRate ?? 2,
    null,
    optionsJson
  );

  const parsed = typeof result === 'string' ? JSON.parse(result) : result;

  return {
    txid: parsed?.txid || parsed?.reveal_txid || '',
    revealTxid: parsed?.reveal_txid,
    rawTx: parsed?.rawTx,
  };
}

/**
 * Execute an extend lock transaction
 *
 * Extends the lock duration for an existing staking position.
 *
 * @param client - AlkanesClient instance
 * @param params - Extend lock parameters (positionId, newDuration)
 * @param config - Transaction configuration
 */
export async function executeExtendLock(
  client: AlkanesClient,
  params: ExtendLockParams,
  config: TransactionConfig
): Promise<TransactionResult> {
  const contracts = getFireContracts();

  // Validate parameters
  const validationError = validateExtendLockParams(params);
  if (validationError) {
    throw new Error(validationError);
  }

  // Ensure wallet is loaded in WASM provider and get the AlkanesProvider
  const alkanesProvider = await ensureWalletLoaded(client);
  if (!alkanesProvider) {
    throw new Error('AlkanesProvider is not available');
  }

  // Get raw WASM provider
  const rawProvider = alkanesProvider._provider;
  if (!rawProvider) {
    throw new Error('WASM WebProvider is not available');
  }

  // Build protostone: Opcode 4 = ExtendLock with position_id, new_duration
  const protostone = buildProtostoneString(contracts.fireStaking, 4, [
    BigInt(params.positionId),
    BigInt(params.newDuration),
  ]);

  const toAddresses = JSON.stringify(['p2tr:0']);
  const optionsJson = JSON.stringify({
    trace_enabled: false,  // Disabled - causes false failures on empty trace
    auto_confirm: config.autoConfirm ?? true,
    mine_enabled: true,
    from_addresses: ['p2tr:0', 'p2wpkh:0'],
  });

  const result = await rawProvider.alkanesExecuteFull(
    toAddresses,
    '',
    protostone,
    config.feeRate ?? 2,
    null,
    optionsJson
  );

  const parsed = typeof result === 'string' ? JSON.parse(result) : result;

  return {
    txid: parsed?.txid || parsed?.reveal_txid || '',
    revealTxid: parsed?.reveal_txid,
    rawTx: parsed?.rawTx,
  };
}

// ============================================================================
// View Function Helpers (for simulate calls)
// ============================================================================

/**
 * Build calldata array for contract view calls
 * Format: [contract_block, contract_tx, opcode, ...args]
 */
export function buildCalldata(
  contract: AlkaneId,
  opcode: number,
  args: (bigint | number)[] = []
): number[] {
  return [
    contract.block,
    contract.tx,
    opcode,
    ...args.map((arg) => Number(arg)),
  ];
}

/**
 * Build calldata for querying a position
 */
export function buildGetPositionCalldata(positionId: number): number[] {
  const contracts = getFireContracts();
  // Opcode 10: GetPosition
  return buildCalldata(contracts.fireStaking, 10, [BigInt(positionId)]);
}

/**
 * Build calldata for querying pending rewards
 */
export function buildGetPendingRewardsCalldata(): number[] {
  const contracts = getFireContracts();
  // Opcode 11: GetPendingRewards
  return buildCalldata(contracts.fireStaking, 11, []);
}

/**
 * Build calldata for querying total staked
 */
export function buildGetTotalStakedCalldata(): number[] {
  const contracts = getFireContracts();
  // Opcode 12: GetTotalStaked
  return buildCalldata(contracts.fireStaking, 12, []);
}

/**
 * Build calldata for querying user position count
 */
export function buildGetUserPositionCountCalldata(): number[] {
  const contracts = getFireContracts();
  // Opcode 13: GetUserPositionCount
  return buildCalldata(contracts.fireStaking, 13, []);
}

/**
 * Build calldata for querying current epoch
 */
export function buildGetCurrentEpochCalldata(): number[] {
  const contracts = getFireContracts();
  // Opcode 14: GetCurrentEpoch
  return buildCalldata(contracts.fireStaking, 14, []);
}

/**
 * Build calldata for querying emission rate
 */
export function buildGetEmissionRateCalldata(): number[] {
  const contracts = getFireContracts();
  // Opcode 15: GetCurrentEmissionRate
  return buildCalldata(contracts.fireStaking, 15, []);
}

// ============================================================================
// Validation Helpers
// ============================================================================

/**
 * Validate stake parameters
 */
export function validateStakeParams(params: StakeParams): string | null {
  if (params.amount <= BigInt(0)) {
    return 'Amount must be greater than 0';
  }

  const validDurations = Object.values(LOCK_DURATIONS);
  if (!validDurations.includes(params.lockDuration)) {
    return 'Invalid lock duration';
  }

  return null;
}

/**
 * Validate unstake parameters
 */
export function validateUnstakeParams(params: UnstakeParams): string | null {
  if (params.positionId < 0) {
    return 'Invalid position ID';
  }

  return null;
}

/**
 * Validate extend lock parameters
 */
export function validateExtendLockParams(params: ExtendLockParams): string | null {
  if (params.positionId < 0) {
    return 'Invalid position ID';
  }

  const validDurations = Object.values(LOCK_DURATIONS);
  if (!validDurations.includes(params.newDuration)) {
    return 'Invalid new lock duration';
  }

  return null;
}

// ============================================================================
// Fee Estimation
// ============================================================================

/**
 * Estimate transaction fee
 *
 * @param vbytes - Transaction size in virtual bytes
 * @param feeRate - Fee rate in sats/vbyte
 */
export function estimateFee(vbytes: number, feeRate: number): number {
  return Math.ceil(vbytes * feeRate);
}

/**
 * Estimate stake transaction size
 * Rough estimate based on typical alkanes transaction sizes
 */
export function estimateStakeVbytes(): number {
  // Typical alkanes transaction with token transfer: ~250-350 vbytes
  return 300;
}

/**
 * Estimate unstake/claim transaction size
 */
export function estimateClaimVbytes(): number {
  // Simpler transaction, fewer inputs/outputs
  return 250;
}

// ============================================================================
// Legacy Exports (for backward compatibility)
// ============================================================================

// These are deprecated - use the execute* functions instead
export async function buildStakeTransaction(
  params: StakeParams,
  senderAddress: string,
  config: { network: string; feeRate?: number }
): Promise<never> {
  throw new Error(
    'buildStakeTransaction is deprecated. Use executeStake(provider, params, config) instead.'
  );
}

export async function buildUnstakeTransaction(
  params: UnstakeParams,
  senderAddress: string,
  config: { network: string; feeRate?: number }
): Promise<never> {
  throw new Error(
    'buildUnstakeTransaction is deprecated. Use executeUnstake(provider, params, config) instead.'
  );
}

export async function buildClaimTransaction(
  senderAddress: string,
  config: { network: string; feeRate?: number }
): Promise<never> {
  throw new Error(
    'buildClaimTransaction is deprecated. Use executeClaim(provider, config) instead.'
  );
}

export async function buildExtendLockTransaction(
  params: ExtendLockParams,
  senderAddress: string,
  config: { network: string; feeRate?: number }
): Promise<never> {
  throw new Error(
    'buildExtendLockTransaction is deprecated. Use executeExtendLock(provider, params, config) instead.'
  );
}
