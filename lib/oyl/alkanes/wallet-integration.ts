/**
 * Alkanes-RS Wallet Integration
 *
 * Integrates alkanes-rs ts-sdk as a keystore backend
 * Provides encrypted keystore management, PSBT signing, and network support
 *
 * NOTE: This module uses dynamic imports to handle cases where ts-sdk isn't built yet
 */

import * as bitcoin from 'bitcoinjs-lib';

// Define Network type locally
export type Network = 'mainnet' | 'testnet' | 'signet' | 'oylnet' | 'regtest';

// ECC library initialization state
let eccInitialized = false;

async function initEccLib() {
  if (eccInitialized) return;

  const ecc = await import('@bitcoinerlab/secp256k1');
  bitcoin.initEccLib(ecc);
  eccInitialized = true;
}

// Type definitions
export type Keystore = {
  mnemonic: string;
  masterFingerprint: string;
  accountXpub: string;
  hdPaths: Record<string, any>;
  network: string;
  createdAt: number;
};

export type EncryptedKeystore = {
  encrypted_mnemonic: string;
  master_fingerprint: string;
  created_at: number;
  version: string;
  pbkdf2_params: {
    salt: string;
    nonce?: string;
    iterations: number;
    algorithm?: string;
  };
  account_xpub: string;
  hd_paths: Record<string, string>;
};

export type AlkanesWalletInstance = {
  getMnemonic(): string;
  getReceivingAddress(index?: number): string;
  getChangeAddress(index?: number): string;
  deriveAddress(type: 'p2wpkh' | 'p2tr', index: number, change: number): { address: string; path: string; publicKey: string };
  signPsbt(psbtBase64: string): string;
  signMessage(message: string, index?: number): Promise<string>;
  getKeystore(): Keystore;
};

/**
 * WASM/SDK module state
 */
let sdkInitialized = false;
let sdkAvailable = false;
let sdkModule: any = null;

/**
 * Check if the Alkanes SDK is available
 */
export async function checkSdkAvailable(): Promise<boolean> {
  if (sdkInitialized) return sdkAvailable;

  try {
    sdkModule = await import('@alkanes/ts-sdk');
    sdkAvailable = true;
    sdkInitialized = true;
    console.log('✅ Alkanes SDK loaded successfully');
    return true;
  } catch (error) {
    sdkAvailable = false;
    sdkInitialized = true;
    console.warn('⚠️ Alkanes SDK not available - ensure dependencies are installed with `pnpm install`');
    return false;
  }
}

/**
 * Initialize WASM module (call once at app startup)
 */
export async function initAlkanesWasm() {
  await initEccLib();
  return checkSdkAvailable();
}

/**
 * Get network type for alkanes SDK
 */
function getAlkanesNetwork(network: Network): 'mainnet' | 'testnet' | 'regtest' | 'signet' {
  switch (network) {
    case 'mainnet':
      return 'mainnet';
    case 'testnet':
      return 'testnet';
    case 'regtest':
      return 'regtest';
    case 'signet':
    case 'oylnet':
      return 'signet';
    default:
      return 'mainnet';
  }
}

/**
 * Get bitcoinjs-lib network
 */
export function getBitcoinJsNetwork(network: Network): bitcoin.Network {
  switch (network) {
    case 'mainnet':
      return bitcoin.networks.bitcoin;
    case 'testnet':
      return bitcoin.networks.testnet;
    case 'regtest':
      return bitcoin.networks.regtest;
    case 'signet':
    case 'oylnet':
      return bitcoin.networks.testnet; // signet uses testnet params
    default:
      return bitcoin.networks.bitcoin;
  }
}

/**
 * Ensure SDK is loaded
 */
async function ensureSdk() {
  if (!sdkInitialized) {
    await checkSdkAvailable();
  }
  if (!sdkAvailable || !sdkModule) {
    throw new Error('Alkanes SDK not available. Ensure dependencies are installed with `pnpm install`.');
  }
  return sdkModule;
}

/**
 * Create a new encrypted keystore
 *
 * @param password - Encryption password (min 8 characters)
 * @param network - Bitcoin network
 * @param wordCount - Mnemonic word count (12, 15, 18, 21, or 24)
 * @returns Encrypted keystore JSON and mnemonic
 */
export async function createAlkanesKeystore(
  password: string,
  network: Network = 'mainnet',
  wordCount: 12 | 15 | 18 | 21 | 24 = 12
): Promise<{ keystore: string; mnemonic: string }> {
  const sdk = await ensureSdk();

  try {
    const config = { network: getAlkanesNetwork(network) };
    const result = await sdk.createKeystore(password, config, wordCount);

    return {
      keystore: result.keystore,
      mnemonic: result.mnemonic,
    };
  } catch (error) {
    console.error('Error creating keystore:', error);
    throw new Error(`Failed to create keystore: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Unlock an encrypted keystore
 *
 * @param keystoreJson - Encrypted keystore JSON string
 * @param password - Decryption password
 * @returns Decrypted keystore object
 */
export async function unlockAlkanesKeystore(
  keystoreJson: string,
  password: string
): Promise<Keystore> {
  const sdk = await ensureSdk();

  try {
    const keystore = await sdk.unlockKeystore(keystoreJson, password);
    return keystore;
  } catch (error) {
    console.error('Error unlocking keystore:', error);
    throw new Error(`Failed to unlock keystore: ${error instanceof Error ? error.message : 'Wrong password or corrupted keystore'}`);
  }
}

/**
 * Create an Alkanes wallet from keystore
 *
 * @param keystore - Decrypted keystore object
 * @returns Alkanes wallet instance
 */
export async function createAlkanesWallet(
  keystore: Keystore
): Promise<AlkanesWalletInstance> {
  const sdk = await ensureSdk();

  try {
    const alkanesWallet = await sdk.createWallet(keystore);

    // Wrap alkanes wallet with our interface
    return {
      getMnemonic: () => keystore.mnemonic,
      getReceivingAddress: (index = 0) => {
        const addressInfo = alkanesWallet.deriveAddress('p2wpkh', index, 0);
        return addressInfo.address;
      },
      getChangeAddress: (index = 0) => {
        const addressInfo = alkanesWallet.deriveAddress('p2wpkh', index, 1);
        return addressInfo.address;
      },
      deriveAddress: (type, index, change) => {
        const addressInfo = alkanesWallet.deriveAddress(type as any, index, change);
        return {
          address: addressInfo.address,
          path: addressInfo.path,
          publicKey: addressInfo.publicKey || '',
        };
      },
      signPsbt: (psbtBase64: string) => {
        if (typeof alkanesWallet.signPsbt === 'function') {
          return alkanesWallet.signPsbt(psbtBase64);
        }
        throw new Error('signPsbt not available');
      },
      signMessage: async (message: string, index = 0) => {
        if (typeof alkanesWallet.signMessage === 'function') {
          return alkanesWallet.signMessage(message, 0, index);
        }
        throw new Error('signMessage not available');
      },
      getKeystore: () => keystore,
    };
  } catch (error) {
    console.error('Error creating alkanes wallet:', error);
    throw new Error(`Failed to create wallet: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Complete wallet setup flow
 */
export async function setupAlkanesWallet(
  password: string,
  network: Network = 'mainnet'
) {
  const { keystore: keystoreJson, mnemonic } = await createAlkanesKeystore(password, network);
  const keystore = await unlockAlkanesKeystore(keystoreJson, password);
  const wallet = await createAlkanesWallet(keystore);

  const address = wallet.getReceivingAddress(0);
  const taprootAddress = wallet.deriveAddress('p2tr', 0, 0).address;

  return {
    wallet,
    keystore: keystoreJson,
    mnemonic,
    address,
    taprootAddress,
  };
}

/**
 * Restore wallet from encrypted keystore
 */
export async function restoreAlkanesWallet(
  keystoreJson: string,
  password: string,
  network: Network = 'mainnet'
) {
  const keystore = await unlockAlkanesKeystore(keystoreJson, password);
  const wallet = await createAlkanesWallet(keystore);

  const address = wallet.getReceivingAddress(0);
  const taprootAddress = wallet.deriveAddress('p2tr', 0, 0).address;

  return {
    wallet,
    address,
    taprootAddress,
  };
}

/**
 * Restore wallet from mnemonic phrase
 */
export async function restoreFromMnemonic(
  mnemonic: string,
  password: string,
  network: Network = 'mainnet'
) {
  const sdk = await ensureSdk();

  const manager = new sdk.KeystoreManager();
  if (!manager.validateMnemonic(mnemonic)) {
    throw new Error('Invalid mnemonic phrase');
  }

  const config = { network: getAlkanesNetwork(network) };
  const internalKeystore = manager.createKeystore(mnemonic, config);
  const keystoreJson = await manager.exportKeystore(internalKeystore, password, { pretty: false });

  const wallet = await createAlkanesWallet(internalKeystore);
  const address = wallet.getReceivingAddress(0);
  const taprootAddress = wallet.deriveAddress('p2tr', 0, 0).address;

  return {
    wallet,
    keystore: typeof keystoreJson === 'string' ? keystoreJson : JSON.stringify(keystoreJson),
    mnemonic,
    address,
    taprootAddress,
  };
}

/**
 * Validate mnemonic phrase
 */
export async function validateMnemonic(mnemonic: string): Promise<boolean> {
  try {
    const sdk = await ensureSdk();
    const manager = new sdk.KeystoreManager();
    return manager.validateMnemonic(mnemonic);
  } catch {
    // Fallback: basic validation
    const words = mnemonic.trim().split(/\s+/);
    return [12, 15, 18, 21, 24].includes(words.length);
  }
}

/**
 * Storage keys for keystore
 */
export const STORAGE_KEYS = {
  ENCRYPTED_KEYSTORE: 'alkanes_encrypted_keystore',
  WALLET_NETWORK: 'alkanes_wallet_network',
} as const;

/**
 * Save encrypted keystore to storage
 */
export function saveKeystoreToStorage(keystoreJson: string, network: Network) {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEYS.ENCRYPTED_KEYSTORE, keystoreJson);
    localStorage.setItem(STORAGE_KEYS.WALLET_NETWORK, network);
  } catch (error) {
    console.error('Failed to save keystore to storage:', error);
  }
}

/**
 * Load encrypted keystore from storage
 */
export function loadKeystoreFromStorage(): { keystore: string; network: Network } | null {
  if (typeof window === 'undefined') return null;

  try {
    const keystore = localStorage.getItem(STORAGE_KEYS.ENCRYPTED_KEYSTORE);
    const network = localStorage.getItem(STORAGE_KEYS.WALLET_NETWORK) as Network;

    if (keystore && network) {
      return { keystore, network };
    }
  } catch (error) {
    console.error('Failed to load keystore from storage:', error);
  }

  return null;
}

/**
 * Clear keystore from storage
 */
export function clearKeystoreFromStorage() {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_KEYS.ENCRYPTED_KEYSTORE);
    localStorage.removeItem(STORAGE_KEYS.WALLET_NETWORK);
  } catch (error) {
    console.error('Failed to clear keystore from storage:', error);
  }
}

/**
 * Check if alkanes wallet is available in storage
 */
export function hasStoredKeystore(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem(STORAGE_KEYS.ENCRYPTED_KEYSTORE);
}

/**
 * Get SDK availability status (for UI display)
 */
export function isSdkAvailable(): boolean {
  return sdkAvailable;
}
