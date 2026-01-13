/**
 * BIP-322 Generic Signed Message Format
 *
 * This module provides signing and verification for Bitcoin message signatures
 * using the BIP-322 standard, which supports all modern address types:
 * - P2WPKH (Native SegWit - bc1q...)
 * - P2TR (Taproot - bc1p...)
 * - P2SH-P2WPKH (Nested SegWit - 3...)
 * - P2PKH (Legacy - 1...) via BIP-137 fallback
 *
 * @see https://github.com/bitcoin/bips/blob/master/bip-0322.mediawiki
 */

import { Signer, Verifier } from 'bip322-js';

export interface VerificationResult {
  valid: boolean;
  error?: string;
  addressType?: 'p2wpkh' | 'p2tr' | 'p2sh-p2wpkh' | 'p2pkh' | 'unknown';
}

export interface SigningResult {
  signature: string;
  address: string;
  message: string;
}

/**
 * Detect address type from a Bitcoin address
 */
export function detectAddressType(address: string): 'p2wpkh' | 'p2tr' | 'p2sh-p2wpkh' | 'p2pkh' | 'unknown' {
  if (!address) return 'unknown';

  // Mainnet
  if (address.startsWith('bc1q')) return 'p2wpkh';
  if (address.startsWith('bc1p')) return 'p2tr';
  if (address.startsWith('3')) return 'p2sh-p2wpkh';
  if (address.startsWith('1')) return 'p2pkh';

  // Testnet
  if (address.startsWith('tb1q')) return 'p2wpkh';
  if (address.startsWith('tb1p')) return 'p2tr';
  if (address.startsWith('2')) return 'p2sh-p2wpkh';
  if (address.startsWith('m') || address.startsWith('n')) return 'p2pkh';

  // Regtest
  if (address.startsWith('bcrt1q')) return 'p2wpkh';
  if (address.startsWith('bcrt1p')) return 'p2tr';

  return 'unknown';
}

/**
 * Verify a BIP-322 or BIP-137 message signature
 *
 * @param address - The Bitcoin address that allegedly signed the message
 * @param message - The message that was signed
 * @param signature - The signature in base64 format
 * @param strictVerification - If true, enforce strict BIP-137 address flag verification
 * @returns VerificationResult with validity and optional error details
 *
 * @example
 * ```ts
 * const result = verifyMessage(
 *   'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
 *   'Hello, world!',
 *   'AkgwRQIhALxr5...'
 * );
 *
 * if (result.valid) {
 *   console.log('Signature is valid');
 * } else {
 *   console.log('Invalid signature:', result.error);
 * }
 * ```
 */
export function verifyMessage(
  address: string,
  message: string,
  signature: string,
  strictVerification: boolean = false
): VerificationResult {
  // Input validation
  if (!address || typeof address !== 'string') {
    return { valid: false, error: 'Invalid address: address is required' };
  }

  if (!message || typeof message !== 'string') {
    return { valid: false, error: 'Invalid message: message is required' };
  }

  if (!signature || typeof signature !== 'string') {
    return { valid: false, error: 'Invalid signature: signature is required' };
  }

  const addressType = detectAddressType(address);

  if (addressType === 'unknown') {
    return {
      valid: false,
      error: `Unsupported address format: ${address.slice(0, 10)}...`,
      addressType
    };
  }

  try {
    // Attempt BIP-322 verification (handles BIP-137 fallback internally)
    const isValid = Verifier.verifySignature(
      address,
      message,
      signature,
      strictVerification
    );

    return { valid: isValid, addressType };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown verification error';
    return {
      valid: false,
      error: `Verification failed: ${errorMessage}`,
      addressType
    };
  }
}

/**
 * Sign a message using BIP-322 format
 *
 * @param privateKey - Private key in WIF or hex format
 * @param address - The Bitcoin address corresponding to the private key
 * @param message - The message to sign
 * @returns SigningResult with the signature and metadata
 *
 * @example
 * ```ts
 * const result = signMessage(
 *   'L2Gkw3kKJ6N...', // WIF private key
 *   'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
 *   'Hello, world!'
 * );
 *
 * console.log('Signature:', result.signature);
 * ```
 */
export function signMessage(
  privateKey: string,
  address: string,
  message: string
): SigningResult {
  if (!privateKey || typeof privateKey !== 'string') {
    throw new Error('Invalid private key: private key is required');
  }

  if (!address || typeof address !== 'string') {
    throw new Error('Invalid address: address is required');
  }

  if (!message || typeof message !== 'string') {
    throw new Error('Invalid message: message is required');
  }

  const addressType = detectAddressType(address);

  if (addressType === 'unknown') {
    throw new Error(`Unsupported address format: ${address.slice(0, 10)}...`);
  }

  try {
    const signature = Signer.sign(privateKey, address, message);

    // Handle both string and Buffer return types
    const signatureString = typeof signature === 'string'
      ? signature
      : signature.toString('base64');

    return {
      signature: signatureString,
      address,
      message
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown signing error';
    throw new Error(`Signing failed: ${errorMessage}`);
  }
}

/**
 * Verify a message signature and return a simple boolean
 * Convenience wrapper around verifyMessage for simple use cases
 */
export function isValidSignature(
  address: string,
  message: string,
  signature: string
): boolean {
  return verifyMessage(address, message, signature).valid;
}

/**
 * Verify a governance/forum signature with standard message format
 * Used for verifying actions like votes, proposals, and forum posts
 *
 * @param address - The Bitcoin address that signed
 * @param action - The action being verified (e.g., 'vote', 'proposal', 'post')
 * @param payload - JSON-serializable payload that was signed
 * @param signature - The signature in base64 format
 * @param timestamp - Optional timestamp to include in message
 */
export function verifyActionSignature(
  address: string,
  action: string,
  payload: Record<string, unknown>,
  signature: string,
  timestamp?: number
): VerificationResult {
  // Reconstruct the message that should have been signed
  const messageData = timestamp
    ? { ...payload, timestamp }
    : payload;

  const message = JSON.stringify(messageData);

  return verifyMessage(address, message, signature);
}

// Re-export types from bip322-js for convenience
export { Signer, Verifier } from 'bip322-js';
