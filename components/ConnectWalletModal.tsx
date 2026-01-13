'use client';

import { ChevronRight, Plus, Key, Lock, Eye, EyeOff, Copy, Check, Download, Cloud, Upload, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

import { useWallet } from '@/context/WalletContext';
import {
  BROWSER_WALLETS,
  GoogleDriveBackup,
  unlockKeystore,
  type BrowserWalletInfo,
  type WalletBackupInfo,
  type WalletOption,
} from '@alkanes/ts-sdk';

type WalletView = 'select' | 'create' | 'restore-mnemonic' | 'restore-json' | 'restore-drive-picker' | 'restore-drive-unlock' | 'browser-extension' | 'unlock' | 'show-mnemonic';

export default function ConnectWalletModal() {
  const {
    network,
    isConnectModalOpen,
    onConnectModalOpenChange,
    hasStoredKeystore: hasExistingKeystoreFromContext,
    createWallet: createWalletFromContext,
    unlockWallet: unlockWalletFromContext,
    restoreWallet: restoreWalletFromContext,
    connectBrowserWallet,
    disconnect,
    getWalletOptions,
  } = useWallet();

  const [view, setView] = useState<WalletView>('select');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordHintInput, setPasswordHintInput] = useState('');
  const [mnemonic, setMnemonic] = useState('');
  const [generatedMnemonic, setGeneratedMnemonic] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [hasExistingKeystore, setHasExistingKeystore] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mnemonicConfirmed, setMnemonicConfirmed] = useState(false);
  const [walletOptions, setWalletOptions] = useState<WalletOption[]>([]);
  const [driveBackups, setDriveBackups] = useState<WalletBackupInfo[]>([]);
  const [selectedDriveWallet, setSelectedDriveWallet] = useState<WalletBackupInfo | null>(null);
  const [passwordHint, setPasswordHint] = useState<string | null>(null);
  const [driveConfigured, setDriveConfigured] = useState(false);
  const [uploadedKeystore, setUploadedKeystore] = useState<string | null>(null);
  const [driveBackup] = useState(() => new GoogleDriveBackup());
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Computed values from wallet options
  const installedWallets = walletOptions.filter(w => w.installed);
  const allWallets = walletOptions;

  useEffect(() => {
    if (isConnectModalOpen) {
      setHasExistingKeystore(hasExistingKeystoreFromContext);
      setView('select');
      resetForm();
      // Load wallet options using the unified SDK method
      getWalletOptions().then(setWalletOptions).catch(console.error);
      // Check Google Drive configuration
      setDriveConfigured(driveBackup.isConfigured());
    }
  }, [isConnectModalOpen, hasExistingKeystoreFromContext, driveBackup, getWalletOptions]);

  const resetForm = () => {
    setPassword('');
    setConfirmPassword('');
    setMnemonic('');
    setGeneratedMnemonic('');
    setError(null);
    setIsLoading(false);
    setShowPassword(false);
    setCopied(false);
    setMnemonicConfirmed(false);
    setUploadedKeystore(null);
    setDriveBackups([]);
    setSelectedDriveWallet(null);
    setPasswordHint(null);
  };

  const handleClose = () => {
    onConnectModalOpenChange(false);
    resetForm();
  };

  const handleCreateWallet = async () => {
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await createWalletFromContext(password);
      setGeneratedMnemonic(result.mnemonic);
      setView('show-mnemonic');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create wallet');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackupToDrive = async () => {
    if (!generatedMnemonic || !password) {
      setError('Missing wallet data for backup');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await driveBackup.initialize();
      const encrypted = localStorage.getItem('alkanes_encrypted_keystore');

      if (!encrypted) {
        throw new Error('Encrypted keystore not found');
      }

      await driveBackup.backupWallet(
        encrypted,
        'My Bitcoin Wallet',
        passwordHintInput || undefined
      );

      alert('Wallet backed up to your Google Drive!');
    } catch (err) {
      console.error('Drive backup error:', err);
      setError(err instanceof Error ? err.message : 'Failed to backup to Google Drive');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmMnemonic = () => {
    handleClose();
  };

  const handleRestoreFromMnemonic = async () => {
    if (!mnemonic.trim()) {
      setError('Please enter your mnemonic phrase');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await restoreWalletFromContext(mnemonic.trim(), password);
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to restore wallet');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnlockKeystore = async () => {
    if (!password) {
      setError('Please enter your password');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await unlockWalletFromContext(password);
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unlock wallet');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteKeystore = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('alkanes_encrypted_keystore');
      localStorage.removeItem('alkanes_wallet_network');
    }
    disconnect();
    setHasExistingKeystore(false);
    setView('select');
  };

  const copyMnemonic = async () => {
    await navigator.clipboard.writeText(generatedMnemonic);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLoadDriveBackups = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await driveBackup.initialize();
      const wallets = await driveBackup.listWallets();
      setDriveBackups(wallets);
      setView('restore-drive-picker');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load backups from Google Drive');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectDriveWallet = async (walletInfo: WalletBackupInfo) => {
    setSelectedDriveWallet(walletInfo);
    setIsLoading(true);
    setError(null);

    try {
      const result = await driveBackup.restoreWallet(walletInfo.folderId);
      setMnemonic(result.encryptedKeystore);
      setPasswordHint(result.passwordHint);
      setView('restore-drive-unlock');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load wallet from Google Drive');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestoreFromDrive = async () => {
    if (!password) {
      setError('Please enter your password');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const keystore = await unlockKeystore(mnemonic, password);
      await restoreWalletFromContext(keystore.mnemonic, password);
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unlock wallet. Check your password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        JSON.parse(content);
        setUploadedKeystore(content);
        setError(null);
      } catch {
        setError('Invalid keystore file. Please upload a valid JSON keystore.');
        setUploadedKeystore(null);
      }
    };
    reader.onerror = () => {
      setError('Failed to read file');
      setUploadedKeystore(null);
    };
    reader.readAsText(file);
  };

  const handleRestoreFromJson = async () => {
    if (!uploadedKeystore) {
      setError('Please upload a keystore file');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const keystore = await unlockKeystore(uploadedKeystore, password);
      await restoreWalletFromContext(keystore.mnemonic, password);
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unlock wallet. Check your password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectBrowserWallet = async (wallet: WalletOption | BrowserWalletInfo) => {
    setIsLoading(true);
    setError(null);

    try {
      // Convert WalletOption to BrowserWalletInfo if needed
      const walletInfo: BrowserWalletInfo = 'injectionKey' in wallet
        ? wallet
        : BROWSER_WALLETS.find((w: BrowserWalletInfo) => w.id === wallet.id) || {
            id: wallet.id,
            name: wallet.name,
            icon: wallet.icon,
            injectionKey: wallet.id,
            website: '',
            supportsPsbt: true,
            supportsTaproot: true,
            supportsOrdinals: false,
            mobileSupport: false,
          };

      await connectBrowserWallet(walletInfo);
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnectModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/50 px-4"
      onClick={handleClose}
    >
      <div
        className="w-[480px] max-w-[92vw] overflow-hidden rounded-2xl border border-white/20 bg-black shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-4 pb-2">
          <h2 className="text-xl font-semibold text-white">
            {view === 'select' && 'Connect Wallet'}
            {view === 'create' && 'Create New Wallet'}
            {view === 'restore-mnemonic' && 'Restore from Mnemonic'}
            {view === 'restore-json' && 'Restore from Keystore'}
            {view === 'restore-drive-picker' && 'Select Backup'}
            {view === 'restore-drive-unlock' && 'Unlock Wallet'}
            {view === 'browser-extension' && 'Browser Wallets'}
            {view === 'unlock' && 'Unlock Wallet'}
            {view === 'show-mnemonic' && 'Save Recovery Phrase'}
          </h2>
          <button
            onClick={handleClose}
            className="rounded-full p-1 text-white/50 hover:bg-white/10 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          {view === 'select' && (
            <div className="flex flex-col gap-3">
              {/* Keystore Options */}
              <div className="mb-2">
                <div className="mb-2 text-sm font-medium text-white/70">Keystore Wallet</div>

                {hasExistingKeystore && (
                  <button
                    onClick={() => setView('unlock')}
                    className="w-full flex items-center justify-between rounded-xl border border-white/20 bg-white/5 p-4 mb-2 transition-colors hover:bg-white/10"
                  >
                    <div className="flex items-center gap-3">
                      <Lock size={24} className="text-blue-400" />
                      <div className="text-left">
                        <div className="font-medium text-white">Unlock Existing Wallet</div>
                        <div className="text-sm text-white/50">Enter password to unlock</div>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-white/50" />
                  </button>
                )}

                <button
                  onClick={() => setView('create')}
                  className="w-full flex items-center justify-between rounded-xl border border-white/20 bg-white/5 p-4 mb-2 transition-colors hover:bg-white/10"
                >
                  <div className="flex items-center gap-3">
                    <Plus size={24} className="text-green-400" />
                    <div className="text-left">
                      <div className="font-medium text-white">Create New Wallet</div>
                      <div className="text-sm text-white/50">Generate a new recovery phrase</div>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-white/50" />
                </button>

                <button
                  onClick={() => setView('restore-mnemonic')}
                  className="w-full flex items-center justify-between rounded-xl border border-white/20 bg-white/5 p-4 mb-2 transition-colors hover:bg-white/10"
                >
                  <div className="flex items-center gap-3">
                    <Key size={24} className="text-yellow-400" />
                    <div className="text-left">
                      <div className="font-medium text-white">Restore from Mnemonic</div>
                      <div className="text-sm text-white/50">Import existing recovery phrase</div>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-white/50" />
                </button>

                <button
                  onClick={() => setView('restore-json')}
                  className="w-full flex items-center justify-between rounded-xl border border-white/20 bg-white/5 p-4 mb-2 transition-colors hover:bg-white/10"
                >
                  <div className="flex items-center gap-3">
                    <Upload size={24} className="text-orange-400" />
                    <div className="text-left">
                      <div className="font-medium text-white">Restore from Keystore File</div>
                      <div className="text-sm text-white/50">Import exported JSON keystore</div>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-white/50" />
                </button>

                {driveConfigured && (
                  <button
                    onClick={handleLoadDriveBackups}
                    disabled={isLoading}
                    className="w-full flex items-center justify-between rounded-xl border border-white/20 bg-white/5 p-4 transition-colors hover:bg-white/10 disabled:opacity-50"
                  >
                    <div className="flex items-center gap-3">
                      <Cloud size={24} className="text-blue-400" />
                      <div className="text-left">
                        <div className="font-medium text-white">Restore from Google Drive</div>
                        <div className="text-sm text-white/50">Recover wallet from your Drive</div>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-white/50" />
                  </button>
                )}
              </div>

              {/* Browser Extension Wallets */}
              <div className="mt-2">
                <div className="mb-2 text-sm font-medium text-white/70">Browser Extension</div>
                <button
                  onClick={() => setView('browser-extension')}
                  className="w-full flex items-center justify-between rounded-xl border border-white/20 bg-white/5 p-4 transition-colors hover:bg-white/10"
                >
                  <div className="flex items-center gap-3">
                    <Download size={24} className="text-purple-400" />
                    <div className="text-left">
                      <div className="font-medium text-white">Connect Browser Extension</div>
                      <div className="text-sm text-white/50">
                        {installedWallets.length > 0
                          ? `${installedWallets.length} wallet${installedWallets.length > 1 ? 's' : ''} detected`
                          : walletOptions.length > 0 ? 'No wallets installed' : 'Loading...'}
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-white/50" />
                </button>
              </div>

              {hasExistingKeystore && (
                <button
                  onClick={handleDeleteKeystore}
                  className="mt-3 text-sm text-red-400 hover:text-red-300"
                >
                  Delete stored wallet
                </button>
              )}
            </div>
          )}

          {view === 'create' && (
            <div className="flex flex-col gap-4">
              <div>
                <label className="mb-1 block text-sm text-white/70">Password (min 8 characters)</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-white/50 bg-transparent px-4 py-3 pr-10 text-white placeholder:text-white/50 outline-none focus:border-white"
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm text-white/70">Confirm Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-lg border border-white/50 bg-transparent px-4 py-3 text-white placeholder:text-white/50 outline-none focus:border-white"
                  placeholder="Confirm password"
                />
              </div>

              {driveConfigured && (
                <div>
                  <label className="mb-1 block text-sm text-white/70">
                    Password Hint (Optional)
                  </label>
                  <input
                    type="text"
                    value={passwordHintInput}
                    onChange={(e) => setPasswordHintInput(e.target.value)}
                    className="w-full rounded-lg border border-white/50 bg-transparent px-4 py-3 text-white placeholder:text-white/50 outline-none focus:border-white"
                    placeholder="e.g., My cat's name + birth year"
                  />
                  <div className="mt-1 text-xs text-white/50">
                    For Google Drive backup. Don't include your actual password.
                  </div>
                </div>
              )}

              {error && <div className="text-sm text-red-400">{error}</div>}

              <div className="flex gap-3">
                <button
                  onClick={() => { setView('select'); resetForm(); }}
                  className="flex-1 rounded-lg border border-white/30 py-3 font-medium text-white transition-colors hover:bg-white/10"
                >
                  Back
                </button>
                <button
                  onClick={handleCreateWallet}
                  disabled={isLoading}
                  className="flex-1 rounded-lg bg-primary py-3 font-medium text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50"
                >
                  {isLoading ? 'Creating...' : 'Create Wallet'}
                </button>
              </div>
            </div>
          )}

          {view === 'show-mnemonic' && (
            <div className="flex flex-col gap-4">
              <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 text-sm text-yellow-400">
                Write down these words in order and store them safely. This is the only way to recover your wallet.
              </div>

              <div className="relative rounded-lg border border-white/20 bg-white/5 p-4">
                <div className="grid grid-cols-3 gap-2 font-mono text-sm">
                  {generatedMnemonic.split(' ').map((word, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="text-white/50">{i + 1}.</span>
                      <span className="text-white">{word}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={copyMnemonic}
                  className="absolute right-2 top-2 rounded p-1 text-white/50 hover:bg-white/10 hover:text-white"
                  title="Copy to clipboard"
                >
                  {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                </button>
              </div>

              <label className="flex items-center gap-2 text-sm text-white/70">
                <input
                  type="checkbox"
                  checked={mnemonicConfirmed}
                  onChange={(e) => setMnemonicConfirmed(e.target.checked)}
                  className="rounded"
                />
                I have saved my recovery phrase securely
              </label>

              {error && <div className="text-sm text-red-400">{error}</div>}

              {driveConfigured && (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={handleBackupToDrive}
                    disabled={isLoading}
                    className="w-full rounded-lg bg-primary py-3 font-medium text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Cloud className="animate-pulse" size={18} />
                        Backing up...
                      </>
                    ) : (
                      <>
                        <Cloud size={18} />
                        Backup to Google Drive
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleConfirmMnemonic}
                    disabled={!mnemonicConfirmed}
                    className="text-sm text-white/50 hover:text-white py-2 disabled:opacity-50"
                  >
                    Skip backup
                  </button>
                </div>
              )}

              {!driveConfigured && (
                <button
                  onClick={handleConfirmMnemonic}
                  disabled={!mnemonicConfirmed}
                  className="rounded-lg bg-primary py-3 font-medium text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50"
                >
                  Continue to Wallet
                </button>
              )}
            </div>
          )}

          {view === 'restore-mnemonic' && (
            <div className="flex flex-col gap-4">
              <div>
                <label className="mb-1 block text-sm text-white/70">Recovery Phrase</label>
                <textarea
                  value={mnemonic}
                  onChange={(e) => setMnemonic(e.target.value)}
                  className="h-24 w-full resize-none rounded-lg border border-white/50 bg-transparent px-4 py-3 text-white placeholder:text-white/50 outline-none focus:border-white"
                  placeholder="Enter your 12 or 24 word recovery phrase"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-white/70">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-white/50 bg-transparent px-4 py-3 pr-10 text-white placeholder:text-white/50 outline-none focus:border-white"
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {error && <div className="text-sm text-red-400">{error}</div>}

              <div className="flex gap-3">
                <button
                  onClick={() => { setView('select'); resetForm(); }}
                  className="flex-1 rounded-lg border border-white/30 py-3 font-medium text-white transition-colors hover:bg-white/10"
                >
                  Back
                </button>
                <button
                  onClick={handleRestoreFromMnemonic}
                  disabled={isLoading}
                  className="flex-1 rounded-lg bg-primary py-3 font-medium text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50"
                >
                  {isLoading ? 'Restoring...' : 'Restore Wallet'}
                </button>
              </div>
            </div>
          )}

          {view === 'restore-json' && (
            <div className="flex flex-col gap-4">
              <div className="rounded-lg border border-orange-500/30 bg-orange-500/10 p-3 text-sm text-orange-400">
                Upload a previously exported JSON keystore file to restore your wallet.
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/70">Keystore File</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
                    uploadedKeystore
                      ? 'border-green-500/50 bg-green-500/10'
                      : 'border-white/30 hover:border-white/50 hover:bg-white/5'
                  }`}
                >
                  {uploadedKeystore ? (
                    <div className="flex items-center justify-center gap-2 text-green-400">
                      <Check size={20} />
                      <span>Keystore file loaded</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-white/50">
                      <Upload size={24} />
                      <span>Click to upload keystore JSON</span>
                    </div>
                  )}
                </button>
              </div>

              <div>
                <label className="mb-1 block text-sm text-white/70">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleRestoreFromJson()}
                    className="w-full rounded-lg border border-white/50 bg-transparent px-4 py-3 pr-10 text-white placeholder:text-white/50 outline-none focus:border-white"
                    placeholder="Enter keystore password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {error && <div className="text-sm text-red-400">{error}</div>}

              <div className="flex gap-3">
                <button
                  onClick={() => { setView('select'); resetForm(); }}
                  className="flex-1 rounded-lg border border-white/30 py-3 font-medium text-white transition-colors hover:bg-white/10"
                >
                  Back
                </button>
                <button
                  onClick={handleRestoreFromJson}
                  disabled={isLoading || !uploadedKeystore}
                  className="flex-1 rounded-lg bg-primary py-3 font-medium text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50"
                >
                  {isLoading ? 'Restoring...' : 'Restore Wallet'}
                </button>
              </div>
            </div>
          )}

          {view === 'browser-extension' && (
            <div className="flex flex-col gap-3">
              <div className="mb-2 text-sm text-white/70">
                Connect using a browser extension wallet:
              </div>

              {installedWallets.length > 0 ? (
                <div className="max-h-80 overflow-y-auto space-y-2">
                  {installedWallets.map((wallet) => {
                    // Get additional info from BROWSER_WALLETS if available
                    const fullInfo = BROWSER_WALLETS.find((w: BrowserWalletInfo) => w.id === wallet.id);
                    return (
                      <button
                        key={wallet.id}
                        onClick={() => handleConnectBrowserWallet(wallet)}
                        disabled={isLoading}
                        className="w-full flex items-center justify-between rounded-xl border border-white/20 bg-white/5 p-4 transition-colors hover:bg-white/10 disabled:opacity-50"
                      >
                        <div className="flex items-center gap-3">
                          <img src={wallet.icon} alt={wallet.name} className="w-8 h-8" />
                          <div className="text-left">
                            <div className="font-medium text-white">{wallet.name}</div>
                            <div className="text-xs text-white/50 flex gap-2">
                              {fullInfo?.supportsTaproot && <span>Taproot</span>}
                              {fullInfo?.supportsOrdinals && <span>Ordinals</span>}
                            </div>
                          </div>
                        </div>
                        <ChevronRight size={20} className="text-white/50" />
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-white/70 mb-4">No browser wallets detected</div>
                  <div className="text-sm text-white/50 mb-4">Install one of these wallets:</div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {allWallets.filter(w => !w.installed).slice(0, 5).map((wallet) => {
                      const fullInfo = BROWSER_WALLETS.find((w: BrowserWalletInfo) => w.id === wallet.id);
                      return (
                        <a
                          key={wallet.id}
                          href={fullInfo?.website || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 rounded-lg border border-white/20 hover:bg-white/5 transition-colors"
                        >
                          <img src={wallet.icon} alt={wallet.name} className="w-6 h-6" />
                          <span className="flex-1 text-left text-sm text-white">{wallet.name}</span>
                          <Download size={16} className="text-white/50" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

              {error && <div className="text-sm text-red-400">{error}</div>}

              <button
                onClick={() => { setView('select'); resetForm(); }}
                className="w-full rounded-lg border border-white/30 py-3 font-medium text-white transition-colors hover:bg-white/10"
              >
                Back
              </button>
            </div>
          )}

          {view === 'restore-drive-picker' && (
            <div className="flex flex-col gap-3">
              {driveBackups.length > 0 ? (
                <>
                  <div className="text-sm text-white/70 mb-2">
                    Select a wallet backup to restore:
                  </div>
                  <div className="max-h-80 overflow-y-auto space-y-2">
                    {driveBackups.map((backup) => (
                      <button
                        key={backup.folderId}
                        onClick={() => handleSelectDriveWallet(backup)}
                        disabled={isLoading}
                        className="w-full flex items-center justify-between rounded-xl border border-white/20 bg-white/5 p-4 transition-colors hover:bg-white/10 disabled:opacity-50"
                      >
                        <div className="flex items-center gap-3">
                          <Cloud size={24} className="text-blue-400" />
                          <div className="text-left">
                            <div className="font-medium text-white">{backup.walletLabel}</div>
                            <div className="text-xs text-white/50">
                              {new Date(backup.timestamp).toLocaleDateString()}
                              {backup.hasPasswordHint && ' - Has password hint'}
                            </div>
                          </div>
                        </div>
                        <ChevronRight size={20} className="text-white/50" />
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-white/50">
                  No wallet backups found in your Google Drive
                </div>
              )}

              {error && <div className="text-sm text-red-400">{error}</div>}

              <button
                onClick={() => { setView('select'); resetForm(); }}
                className="w-full rounded-lg border border-white/30 py-3 font-medium text-white transition-colors hover:bg-white/10"
              >
                Back
              </button>
            </div>
          )}

          {view === 'restore-drive-unlock' && selectedDriveWallet && (
            <div className="flex flex-col gap-4">
              <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Cloud size={16} className="text-blue-400" />
                  <div className="text-sm font-medium text-blue-400">
                    {selectedDriveWallet.walletLabel}
                  </div>
                </div>
                {passwordHint && (
                  <div className="text-xs text-white/50 mt-1">
                    <span className="font-medium">Hint:</span> {passwordHint}
                  </div>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm text-white/70">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleRestoreFromDrive()}
                    className="w-full rounded-lg border border-white/50 bg-transparent px-4 py-3 pr-10 text-white placeholder:text-white/50 outline-none focus:border-white"
                    placeholder="Enter wallet password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && <div className="text-sm text-red-400">{error}</div>}

              <button
                onClick={handleRestoreFromDrive}
                disabled={isLoading || !password}
                className="w-full rounded-lg bg-primary py-3 font-medium text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50"
              >
                {isLoading ? 'Unlocking...' : 'Unlock Wallet'}
              </button>

              <button
                onClick={() => { setView('restore-drive-picker'); resetForm(); }}
                className="w-full rounded-lg border border-white/30 py-3 font-medium text-white transition-colors hover:bg-white/10"
              >
                Back
              </button>
            </div>
          )}

          {view === 'unlock' && (
            <div className="flex flex-col gap-4">
              <div>
                <label className="mb-1 block text-sm text-white/70">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleUnlockKeystore()}
                    className="w-full rounded-lg border border-white/50 bg-transparent px-4 py-3 pr-10 text-white placeholder:text-white/50 outline-none focus:border-white"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {error && <div className="text-sm text-red-400">{error}</div>}

              <div className="flex gap-3">
                <button
                  onClick={() => { setView('select'); resetForm(); }}
                  className="flex-1 rounded-lg border border-white/30 py-3 font-medium text-white transition-colors hover:bg-white/10"
                >
                  Back
                </button>
                <button
                  onClick={handleUnlockKeystore}
                  disabled={isLoading}
                  className="flex-1 rounded-lg bg-primary py-3 font-medium text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50"
                >
                  {isLoading ? 'Unlocking...' : 'Unlock'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
