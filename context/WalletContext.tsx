'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useMemo, useState, useCallback, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

// Import from the unified client module
import {
  AlkanesClient,
  KeystoreSigner,
  BrowserWalletSigner,
  AlkanesProvider,
  connectWallet as sdkConnectWallet,
  getAvailableWallets as sdkGetAvailableWallets,
  createReadOnlyProvider,
  type SignedPsbt,
  type BalanceSummary,
  type WalletOption,
  type NetworkType,
} from '@alkanes/ts-sdk';

// Also import types we still need
import {
  KeystoreManager,
  createKeystore,
  unlockKeystore,
  KeystoreStorage,
  getWalletById,
  type BrowserWalletInfo,
  type UTXO,
} from '@alkanes/ts-sdk';

export type Network = 'mainnet' | 'testnet' | 'signet' | 'regtest';

// Storage keys
const STORAGE_KEYS = {
  ENCRYPTED_KEYSTORE: 'alkanes_encrypted_keystore',
  WALLET_NETWORK: 'alkanes_wallet_network',
  SESSION_MNEMONIC: 'alkanes_session_mnemonic',
  BROWSER_WALLET: 'alkanes_browser_wallet',
} as const;

// Map app network names to SDK network names
function toSdkNetwork(network: Network): NetworkType {
  switch (network) {
    case 'mainnet':
      return 'mainnet';
    case 'testnet':
    case 'signet':
      return 'testnet';
    case 'regtest':
      return 'regtest';
    default:
      return 'mainnet';
  }
}

type Account = {
  taproot?: { address: string; pubkey: string; pubKeyXOnly: string; hdPath: string };
  nativeSegwit?: { address: string; pubkey: string; hdPath: string };
  spendStrategy: { addressOrder: string[]; utxoSortGreatestToLeast: boolean; changeAddress: string };
  network: Network;
};

type FormattedUtxo = {
  txId: string;
  outputIndex: number;
  satoshis: number;
  scriptPk: string;
  address: string;
  inscriptions: any[];
  runes: any[];
  alkanes: Record<string, { value: string; name: string; symbol: string }>;
  indexed: boolean;
  confirmations: number;
};

// Wallet type discriminator
type WalletType = 'keystore' | 'browser' | null;

type WalletContextType = {
  // Connection state
  isConnectModalOpen: boolean;
  onConnectModalOpenChange: (isOpen: boolean) => void;
  isConnected: boolean;
  isInitializing: boolean;

  // Unified client (new)
  client: AlkanesClient | null;

  // Wallet type
  walletType: WalletType;

  // Wallet data (backward compatible)
  address: string;
  paymentAddress: string;
  publicKey: string;
  account: Account;
  network: Network;

  // Legacy accessors (for backward compatibility)
  wallet: any | null; // KeystoreSigner
  browserWallet: any | null; // BrowserWalletSigner

  // Actions
  createWallet: (password: string) => Promise<{ mnemonic: string }>;
  unlockWallet: (password: string) => Promise<void>;
  restoreWallet: (mnemonic: string, password: string) => Promise<void>;
  connectBrowserWallet: (walletInfo: BrowserWalletInfo) => Promise<void>;
  disconnect: () => void;
  signPsbt: (psbtBase64: string) => Promise<string>;
  signMessage: (message: string) => Promise<string>;

  // Balance and UTXO methods (now with provider integration)
  getBalance: () => Promise<BalanceSummary>;
  getUtxos: () => Promise<FormattedUtxo[]>;
  getSpendableUtxos: () => Promise<FormattedUtxo[]>;
  getSpendableTotalBalance: () => Promise<number>;

  // Transaction methods
  sendTransaction: (psbtBase64: string) => Promise<{ txid: string }>;
  broadcastTransaction: (txHex: string) => Promise<string>;

  // For compatibility
  hasStoredKeystore: boolean;

  // Wallet options for UI
  getWalletOptions: () => Promise<WalletOption[]>;
};

const WalletContext = createContext<WalletContextType | null>(null);

interface WalletProviderProps {
  children: ReactNode;
  network: Network;
}

export function WalletProvider({ children, network }: WalletProviderProps) {
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [client, setClient] = useState<AlkanesClient | null>(null);
  const [walletType, setWalletType] = useState<WalletType>(null);
  const [hasStoredKeystore, setHasStoredKeystore] = useState(false);

  // Store mnemonic for keystore operations
  const [currentMnemonic, setCurrentMnemonic] = useState<string | null>(null);

  // Check for stored keystore and restore session on mount
  useEffect(() => {
    const initializeWallet = async () => {
      if (typeof window === 'undefined') return;

      const stored = localStorage.getItem(STORAGE_KEYS.ENCRYPTED_KEYSTORE);
      setHasStoredKeystore(!!stored);

      // Check for active session (survives page navigation but not tab close)
      const sessionMnemonic = sessionStorage.getItem(STORAGE_KEYS.SESSION_MNEMONIC);
      if (sessionMnemonic && stored) {
        try {
          // Create client with mnemonic
          const sdkNetwork = toSdkNetwork(network);
          const newClient = AlkanesClient.withMnemonic(sessionMnemonic, sdkNetwork);
          await newClient.initialize();

          setClient(newClient);
          setWalletType('keystore');
          setCurrentMnemonic(sessionMnemonic);
        } catch (error) {
          console.error('Failed to restore session wallet:', error);
          sessionStorage.removeItem(STORAGE_KEYS.SESSION_MNEMONIC);
        }
      }

      // Check for browser wallet reconnection
      const browserWalletId = sessionStorage.getItem(STORAGE_KEYS.BROWSER_WALLET);
      if (browserWalletId && !sessionMnemonic) {
        try {
          const sdkNetwork = toSdkNetwork(network);
          const newClient = await sdkConnectWallet(browserWalletId, sdkNetwork);
          setClient(newClient);
          setWalletType('browser');
          // Restore wallet info from ID
          const walletInfo = getWalletById(browserWalletId);
          if (walletInfo) {
            setConnectedWalletInfo(walletInfo);
          }
        } catch (error) {
          console.error('Failed to reconnect browser wallet:', error);
          sessionStorage.removeItem(STORAGE_KEYS.BROWSER_WALLET);
        }
      }

      setIsInitializing(false);
    };

    initializeWallet();
  }, [network]);

  // Derive addresses from client
  const addresses = useMemo(() => {
    if (!client) {
      return {
        nativeSegwit: { address: '', pubkey: '', hdPath: '' },
        taproot: { address: '', pubkey: '', pubKeyXOnly: '', hdPath: '' },
      };
    }

    // For keystore signer, we can get both address types
    if (walletType === 'keystore' && client.signer instanceof KeystoreSigner) {
      const signer = client.signer as KeystoreSigner;

      // Get full address info from the signer (includes address, publicKey, and path)
      const segwitInfo = signer.getAddressInfo('p2wpkh', 0);
      const taprootInfo = signer.getAddressInfo('p2tr', 0);

      return {
        nativeSegwit: {
          address: segwitInfo?.address || '',
          pubkey: segwitInfo?.publicKey || '',
          hdPath: segwitInfo?.path || '',
        },
        taproot: {
          address: taprootInfo?.address || '',
          pubkey: taprootInfo?.publicKey || '',
          pubKeyXOnly: taprootInfo?.publicKey?.slice(2) || '',
          hdPath: taprootInfo?.path || '',
        },
      };
    }

    // For browser wallet, we only have one address
    // We'll get it asynchronously in the effect below
    return {
      nativeSegwit: { address: '', pubkey: '', hdPath: '' },
      taproot: { address: '', pubkey: '', pubKeyXOnly: '', hdPath: '' },
    };
  }, [client, walletType]);

  // Track browser wallet address separately
  const [browserAddress, setBrowserAddress] = useState<{ address: string; publicKey: string }>({ address: '', publicKey: '' });

  // Track connected browser wallet info
  const [connectedWalletInfo, setConnectedWalletInfo] = useState<BrowserWalletInfo | null>(null);

  useEffect(() => {
    if (client && walletType === 'browser') {
      (async () => {
        try {
          const address = await client.getAddress();
          const publicKey = await client.getPublicKey();
          setBrowserAddress({ address, publicKey });
        } catch (e) {
          console.error('Failed to get browser wallet address:', e);
        }
      })();
    } else {
      setBrowserAddress({ address: '', publicKey: '' });
    }
  }, [client, walletType]);

  // Build account structure
  const account: Account = useMemo(() => {
    const effectiveAddresses = walletType === 'browser'
      ? {
          nativeSegwit: {
            address: browserAddress.address,
            pubkey: browserAddress.publicKey,
            hdPath: ''
          },
          taproot: {
            address: '',
            pubkey: '',
            pubKeyXOnly: '',
            hdPath: ''
          },
        }
      : addresses;

    return {
      nativeSegwit: effectiveAddresses.nativeSegwit.address ? effectiveAddresses.nativeSegwit : undefined,
      taproot: effectiveAddresses.taproot.address ? effectiveAddresses.taproot : undefined,
      spendStrategy: {
        addressOrder: ['nativeSegwit', 'taproot'],
        utxoSortGreatestToLeast: true,
        changeAddress: 'nativeSegwit',
      },
      network,
    };
  }, [addresses, browserAddress, walletType, network]);

  // Primary address
  const primaryAddress = useMemo(() => {
    if (walletType === 'browser') {
      return browserAddress.address;
    }
    return addresses.taproot.address || addresses.nativeSegwit.address;
  }, [walletType, browserAddress, addresses]);

  const paymentAddress = useMemo(() => {
    if (walletType === 'browser') {
      return browserAddress.address;
    }
    return addresses.nativeSegwit.address;
  }, [walletType, browserAddress, addresses]);

  const publicKey = useMemo(() => {
    if (walletType === 'browser') {
      return browserAddress.publicKey;
    }
    return addresses.nativeSegwit.pubkey;
  }, [walletType, browserAddress, addresses]);

  // Create new wallet
  const createNewWallet = useCallback(async (password: string): Promise<{ mnemonic: string }> => {
    const sdkNetwork = toSdkNetwork(network);
    const { keystore: encrypted, mnemonic } = await createKeystore(password, { network: sdkNetwork });

    // Create client with mnemonic
    const newClient = AlkanesClient.withMnemonic(mnemonic, sdkNetwork);
    await newClient.initialize();

    // Store encrypted keystore
    localStorage.setItem(STORAGE_KEYS.ENCRYPTED_KEYSTORE, encrypted);
    localStorage.setItem(STORAGE_KEYS.WALLET_NETWORK, network);

    // Store mnemonic in session for page navigation persistence
    sessionStorage.setItem(STORAGE_KEYS.SESSION_MNEMONIC, mnemonic);
    sessionStorage.removeItem(STORAGE_KEYS.BROWSER_WALLET);

    setClient(newClient);
    setWalletType('keystore');
    setCurrentMnemonic(mnemonic);
    setHasStoredKeystore(true);

    return { mnemonic };
  }, [network]);

  // Unlock existing wallet
  const unlockWalletFn = useCallback(async (password: string): Promise<void> => {
    const encrypted = localStorage.getItem(STORAGE_KEYS.ENCRYPTED_KEYSTORE);
    if (!encrypted) {
      throw new Error('No wallet found. Please create or restore a wallet first.');
    }

    const keystore = await unlockKeystore(encrypted, password);
    const sdkNetwork = toSdkNetwork(network);

    // Create client with mnemonic
    const newClient = AlkanesClient.withMnemonic(keystore.mnemonic, sdkNetwork);
    await newClient.initialize();

    // Store mnemonic in session for page navigation persistence
    sessionStorage.setItem(STORAGE_KEYS.SESSION_MNEMONIC, keystore.mnemonic);
    sessionStorage.removeItem(STORAGE_KEYS.BROWSER_WALLET);

    setClient(newClient);
    setWalletType('keystore');
    setCurrentMnemonic(keystore.mnemonic);
  }, [network]);

  // Restore wallet from mnemonic
  const restoreWalletFn = useCallback(async (mnemonic: string, password: string): Promise<void> => {
    const manager = new KeystoreManager();
    const trimmedMnemonic = mnemonic.trim();

    if (!manager.validateMnemonic(trimmedMnemonic)) {
      throw new Error('Invalid mnemonic phrase');
    }

    const sdkNetwork = toSdkNetwork(network);

    // Create client with mnemonic
    const newClient = AlkanesClient.withMnemonic(trimmedMnemonic, sdkNetwork);
    await newClient.initialize();

    // Create keystore and encrypt
    const keystore = manager.createKeystore(trimmedMnemonic, { network: sdkNetwork });
    const encrypted = await manager.exportKeystore(keystore, password, { pretty: true });
    const encryptedStr = typeof encrypted === 'string' ? encrypted : JSON.stringify(encrypted, null, 2);

    localStorage.setItem(STORAGE_KEYS.ENCRYPTED_KEYSTORE, encryptedStr);
    localStorage.setItem(STORAGE_KEYS.WALLET_NETWORK, network);
    sessionStorage.setItem(STORAGE_KEYS.SESSION_MNEMONIC, trimmedMnemonic);
    sessionStorage.removeItem(STORAGE_KEYS.BROWSER_WALLET);

    setClient(newClient);
    setWalletType('keystore');
    setCurrentMnemonic(trimmedMnemonic);
    setHasStoredKeystore(true);
  }, [network]);

  // Connect browser wallet
  const connectBrowserWalletFn = useCallback(async (walletInfo: BrowserWalletInfo): Promise<void> => {
    const sdkNetwork = toSdkNetwork(network);

    // Use the unified connectWallet function
    const newClient = await sdkConnectWallet(walletInfo.id, sdkNetwork);

    setClient(newClient);
    setWalletType('browser');
    setCurrentMnemonic(null);
    setConnectedWalletInfo(walletInfo);

    // Store that we're using a browser wallet
    sessionStorage.setItem(STORAGE_KEYS.BROWSER_WALLET, walletInfo.id);
    sessionStorage.removeItem(STORAGE_KEYS.SESSION_MNEMONIC);
  }, [network]);

  // Disconnect wallet
  const disconnect = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEYS.SESSION_MNEMONIC);
    sessionStorage.removeItem(STORAGE_KEYS.BROWSER_WALLET);

    if (client) {
      client.disconnect().catch(console.error);
    }

    setClient(null);
    setWalletType(null);
    setCurrentMnemonic(null);
    setConnectedWalletInfo(null);
    setIsConnectModalOpen(false);
  }, [client]);

  // Sign PSBT
  const signPsbt = useCallback(async (psbtBase64: string): Promise<string> => {
    if (!client) {
      throw new Error('Wallet not connected');
    }

    const signed = await client.signPsbt(psbtBase64, { finalize: true });
    return signed.psbtHex;
  }, [client]);

  // Sign message
  const signMessage = useCallback(async (message: string): Promise<string> => {
    if (!client) {
      throw new Error('Wallet not connected');
    }
    return client.signMessage(message);
  }, [client]);

  // Get balance using provider
  const getBalance = useCallback(async (): Promise<BalanceSummary> => {
    if (!client) {
      return { confirmed: 0, unconfirmed: 0, total: 0, utxos: [] };
    }
    return client.getBalance();
  }, [client]);

  // Get UTXOs using provider
  const getUtxos = useCallback(async (): Promise<FormattedUtxo[]> => {
    if (!client) {
      return [];
    }

    const utxos = await client.getUtxos();
    const address = await client.getAddress();

    // Format UTXOs to match expected structure
    return utxos.map((utxo: UTXO) => ({
      txId: utxo.txid,
      outputIndex: utxo.vout,
      satoshis: utxo.value,
      scriptPk: utxo.scriptPubKey || '',
      address: address,
      inscriptions: [],
      runes: [],
      alkanes: {},
      indexed: true,
      confirmations: utxo.status?.confirmed ? 6 : 0,
    }));
  }, [client]);

  const getSpendableUtxos = useCallback(async (): Promise<FormattedUtxo[]> => {
    // For now, all UTXOs are considered spendable
    return getUtxos();
  }, [getUtxos]);

  const getSpendableTotalBalance = useCallback(async (): Promise<number> => {
    const balance = await getBalance();
    return balance.total;
  }, [getBalance]);

  // Send transaction (sign and broadcast)
  const sendTransaction = useCallback(async (psbtBase64: string): Promise<{ txid: string }> => {
    if (!client) {
      throw new Error('Wallet not connected');
    }

    const result = await client.sendTransaction(psbtBase64);
    return { txid: result.txid };
  }, [client]);

  // Broadcast raw transaction
  const broadcastTransaction = useCallback(async (txHex: string): Promise<string> => {
    if (!client) {
      throw new Error('Wallet not connected');
    }
    return client.broadcastTransaction(txHex);
  }, [client]);

  // Get wallet options for UI
  const getWalletOptions = useCallback(async (): Promise<WalletOption[]> => {
    return sdkGetAvailableWallets();
  }, []);

  const onConnectModalOpenChange = useCallback((isOpen: boolean) => {
    setIsConnectModalOpen(isOpen);
  }, []);

  // Legacy accessors for backward compatibility
  const legacyWallet = useMemo(() => {
    if (walletType === 'keystore' && client) {
      // Return a proxy object that mimics the old AlkanesWallet interface
      const signer = client.signer as KeystoreSigner;
      return {
        signPsbt: (psbt: string) => client.signPsbt(psbt).then((r: { psbtHex: string }) => r.psbtHex),
        signMessage: (msg: string, index: number) => client.signMessage(msg),
        deriveAddress: (type: any, account: number, index: number) => {
          return signer.deriveAddress(type, index);
        },
        exportMnemonic: () => signer.exportMnemonic(),
        exportToKeystore: (password: string) => signer.exportToKeystore(password),
      };
    }
    return null;
  }, [client, walletType]);

  const legacyBrowserWallet = useMemo(() => {
    if (walletType === 'browser' && client) {
      // Return a proxy object that mimics the old ConnectedWallet interface
      return {
        signPsbt: (psbtHex: string) => client.signPsbt(psbtHex).then((r: { psbtHex: string }) => r.psbtHex),
        signMessage: (msg: string) => client.signMessage(msg),
        disconnect: () => client.disconnect(),
        address: browserAddress.address,
        publicKey: browserAddress.publicKey,
        getNetwork: () => network,
        info: connectedWalletInfo,
      };
    }
    return null;
  }, [client, walletType, browserAddress, network, connectedWalletInfo]);

  // Build context value
  const contextValue = useMemo<WalletContextType>(
    () => ({
      isConnectModalOpen,
      onConnectModalOpenChange,
      isConnected: !!client,
      isInitializing,

      client,
      walletType,

      address: primaryAddress,
      paymentAddress,
      publicKey,
      account,
      network,

      // Legacy accessors
      wallet: legacyWallet,
      browserWallet: legacyBrowserWallet,

      createWallet: createNewWallet,
      unlockWallet: unlockWalletFn,
      restoreWallet: restoreWalletFn,
      connectBrowserWallet: connectBrowserWalletFn,
      disconnect,
      signPsbt,
      signMessage,

      getBalance,
      getUtxos,
      getSpendableUtxos,
      getSpendableTotalBalance,

      sendTransaction,
      broadcastTransaction,

      hasStoredKeystore,
      getWalletOptions,
    }),
    [
      isConnectModalOpen,
      onConnectModalOpenChange,
      client,
      walletType,
      isInitializing,
      primaryAddress,
      paymentAddress,
      publicKey,
      account,
      network,
      legacyWallet,
      legacyBrowserWallet,
      createNewWallet,
      unlockWalletFn,
      restoreWalletFn,
      connectBrowserWalletFn,
      disconnect,
      signPsbt,
      signMessage,
      getBalance,
      getUtxos,
      getSpendableUtxos,
      getSpendableTotalBalance,
      sendTransaction,
      broadcastTransaction,
      hasStoredKeystore,
      getWalletOptions,
    ]
  );

  if (isInitializing) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}

// Export additional hook for accessing the unified client directly
export function useAlkanesClient() {
  const { client, isConnected } = useWallet();
  return { client, isConnected };
}
