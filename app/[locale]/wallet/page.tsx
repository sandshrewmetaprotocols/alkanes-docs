"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Copy, Check, Download, Cloud, AlertTriangle, Key, Shield, ExternalLink, Wallet, RefreshCw } from "lucide-react";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useWallet } from "@/context/WalletContext";
import AddressAvatar from "@/components/AddressAvatar";
import { GoogleDriveBackup, type WalletBackupInfo } from "@alkanes/ts-sdk";
import { useWalletBalances, formatBalance, formatBtcBalance } from "@/hooks/useWalletBalances";

export default function WalletDashboardPage() {
  const t = useTranslations();
  const router = useRouter();
  const {
    isConnected,
    address,
    paymentAddress,
    publicKey,
    network,
    wallet,
    browserWallet,
    disconnect,
    onConnectModalOpenChange,
    hasStoredKeystore,
  } = useWallet();

  const [copied, setCopied] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupError, setBackupError] = useState<string | null>(null);
  const [backupSuccess, setBackupSuccess] = useState(false);
  const [existingBackups, setExistingBackups] = useState<WalletBackupInfo[]>([]);
  const [loadingBackups, setLoadingBackups] = useState(false);
  const [driveBackup] = useState(() => new GoogleDriveBackup());
  const [driveConfigured, setDriveConfigured] = useState(false);

  // Check if Google Drive is configured
  useEffect(() => {
    setDriveConfigured(driveBackup.isConfigured());
  }, [driveBackup]);

  // Redirect if not connected
  useEffect(() => {
    if (!isConnected) {
      onConnectModalOpenChange(true);
    }
  }, [isConnected, onConnectModalOpenChange]);

  const copyToClipboard = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleExportKeystore = () => {
    if (typeof window === "undefined") return;

    const keystore = localStorage.getItem("alkanes_encrypted_keystore");
    if (!keystore) {
      alert("No keystore found to export");
      return;
    }

    setIsExporting(true);

    try {
      const blob = new Blob([keystore], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `alkanes-wallet-${address?.slice(0, 8) || "backup"}-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  };

  const handleBackupToDrive = async () => {
    if (!driveConfigured) {
      setBackupError("Google Drive is not configured");
      return;
    }

    const keystore = localStorage.getItem("alkanes_encrypted_keystore");
    if (!keystore) {
      setBackupError("No keystore found to backup");
      return;
    }

    setIsBackingUp(true);
    setBackupError(null);
    setBackupSuccess(false);

    try {
      await driveBackup.initialize();
      await driveBackup.backupWallet(
        keystore,
        `Wallet ${address?.slice(0, 8) || "backup"}`,
        undefined
      );
      setBackupSuccess(true);
      setTimeout(() => setBackupSuccess(false), 3000);
    } catch (err) {
      console.error("Backup error:", err);
      setBackupError(err instanceof Error ? err.message : "Failed to backup to Google Drive");
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleLoadBackups = async () => {
    if (!driveConfigured) return;

    setLoadingBackups(true);
    try {
      await driveBackup.initialize();
      const backups = await driveBackup.listWallets();
      setExistingBackups(backups);
    } catch (err) {
      console.error("Failed to load backups:", err);
    } finally {
      setLoadingBackups(false);
    }
  };

  const handleDeleteBackup = async (folderId: string) => {
    if (!confirm("Are you sure you want to delete this backup?")) return;

    try {
      await driveBackup.deleteWallet(folderId);
      setExistingBackups((prev) => prev.filter((b) => b.folderId !== folderId));
    } catch (err) {
      console.error("Failed to delete backup:", err);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    router.push("/");
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-[color:var(--sf-muted)] mb-4">Please connect your wallet to continue</p>
            <button
              onClick={() => onConnectModalOpenChange(true)}
              className="btn-primary"
            >
              Connect Wallet
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isKeystoreWallet = !!wallet && !browserWallet;
  const isBrowserWallet = !!browserWallet;

  // Fetch wallet balances for the connected address
  // For keystore wallets, also check the payment address (native segwit) since tokens may be on either address
  const { data: balances, isLoading: balancesLoading, refetch: refetchBalances } = useWalletBalances(address);
  const { data: paymentBalances, isLoading: paymentBalancesLoading, refetch: refetchPaymentBalances } = useWalletBalances(
    paymentAddress !== address ? paymentAddress : undefined
  );

  // Merge balances from both addresses
  const mergedBalances = useMemo(() => {
    if (!balances && !paymentBalances) return undefined;

    const primary = balances || { btcBalance: 0, btcBalanceFormatted: '0', tokens: [], address: '', timestamp: 0 };
    const payment = paymentBalances;

    if (!payment) return primary;

    // Merge BTC balances
    const totalBtc = primary.btcBalance + payment.btcBalance;

    // Merge token balances - combine tokens from both addresses
    const tokenMap = new Map<string, typeof primary.tokens[0]>();

    // Add primary address tokens
    for (const token of primary.tokens) {
      tokenMap.set(token.runeId, token);
    }

    // Add payment address tokens (or combine if already exists)
    for (const token of payment.tokens) {
      const existing = tokenMap.get(token.runeId);
      if (existing) {
        // Combine balances
        const combinedBalance = BigInt(existing.balance) + BigInt(token.balance);
        tokenMap.set(token.runeId, {
          ...existing,
          balance: combinedBalance.toString(),
          balanceFormatted: Number(combinedBalance) / Math.pow(10, existing.decimals),
        });
      } else {
        tokenMap.set(token.runeId, token);
      }
    }

    return {
      btcBalance: totalBtc,
      btcBalanceFormatted: (totalBtc / 100000000).toFixed(8),
      tokens: Array.from(tokenMap.values()),
      address: primary.address,
      timestamp: Date.now(),
    };
  }, [balances, paymentBalances]);

  // Combined loading state
  const isBalancesLoading = balancesLoading || paymentBalancesLoading;

  // Combined refetch
  const handleRefetchBalances = () => {
    refetchBalances();
    if (paymentAddress !== address) {
      refetchPaymentBalances();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-[color:var(--sf-text)]">Wallet Dashboard</h1>
          <p className="text-[color:var(--sf-muted)]">
            Manage your wallet, addresses, and backups
          </p>
        </div>

        {/* Wallet Overview Card */}
        <div className="glass-card p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <AddressAvatar address={address} size={64} />
              <div>
                <div className="text-lg font-semibold text-[color:var(--sf-text)]">
                  {isBrowserWallet ? (browserWallet?.info?.name || "Browser Wallet") : "Keystore Wallet"}
                </div>
                <div className="text-sm text-[color:var(--sf-muted)]">
                  Network: <span className="capitalize">{network}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isBrowserWallet && browserWallet?.info?.icon && (
                <img
                  src={browserWallet.info.icon}
                  alt={browserWallet.info.name || "Wallet"}
                  className="w-8 h-8"
                />
              )}
              {isKeystoreWallet && (
                <div className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-medium flex items-center gap-1">
                  <Shield size={12} />
                  Local Keystore
                </div>
              )}
            </div>
          </div>

          {/* Addresses Section */}
          <div className="space-y-4">
            {/* Primary Address */}
            <div className="p-4 rounded-xl bg-[color:var(--sf-surface)] border border-[color:var(--sf-outline)]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[color:var(--sf-muted)]">
                  {isKeystoreWallet ? "Taproot Address (Ordinals)" : "Connected Address"}
                </span>
                <button
                  onClick={() => copyToClipboard(address, "address")}
                  className="text-[color:var(--sf-muted)] hover:text-[color:var(--sf-primary)] transition-colors"
                >
                  {copied === "address" ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                </button>
              </div>
              <div className="font-mono text-sm text-[color:var(--sf-text)] break-all">
                {address}
              </div>
            </div>

            {/* Payment Address (for keystore wallets) */}
            {isKeystoreWallet && paymentAddress && paymentAddress !== address && (
              <div className="p-4 rounded-xl bg-[color:var(--sf-surface)] border border-[color:var(--sf-outline)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[color:var(--sf-muted)]">Payment Address (Native SegWit)</span>
                  <button
                    onClick={() => copyToClipboard(paymentAddress, "payment")}
                    className="text-[color:var(--sf-muted)] hover:text-[color:var(--sf-primary)] transition-colors"
                  >
                    {copied === "payment" ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                  </button>
                </div>
                <div className="font-mono text-sm text-[color:var(--sf-text)] break-all">
                  {paymentAddress}
                </div>
              </div>
            )}

            {/* Public Key */}
            {publicKey && (
              <div className="p-4 rounded-xl bg-[color:var(--sf-surface)] border border-[color:var(--sf-outline)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[color:var(--sf-muted)]">Public Key</span>
                  <button
                    onClick={() => copyToClipboard(publicKey, "pubkey")}
                    className="text-[color:var(--sf-muted)] hover:text-[color:var(--sf-primary)] transition-colors"
                  >
                    {copied === "pubkey" ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                  </button>
                </div>
                <div className="font-mono text-xs text-[color:var(--sf-text)] break-all">
                  {publicKey}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Balances Section */}
        <div className="glass-card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-[color:var(--sf-text)] flex items-center gap-2">
              <Wallet size={20} />
              Balances
            </h2>
            <button
              onClick={handleRefetchBalances}
              disabled={isBalancesLoading}
              className="p-2 rounded-lg text-[color:var(--sf-muted)] hover:text-[color:var(--sf-primary)] hover:bg-[color:var(--sf-surface)] transition-colors disabled:opacity-50"
              title="Refresh balances"
            >
              <RefreshCw size={16} className={isBalancesLoading ? "animate-spin" : ""} />
            </button>
          </div>

          {isBalancesLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-[color:var(--sf-surface)] border border-[color:var(--sf-outline)] animate-pulse"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[color:var(--sf-outline)]" />
                      <div>
                        <div className="h-4 w-20 bg-[color:var(--sf-outline)] rounded mb-1" />
                        <div className="h-3 w-16 bg-[color:var(--sf-outline)] rounded" />
                      </div>
                    </div>
                    <div className="h-5 w-24 bg-[color:var(--sf-outline)] rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : mergedBalances ? (
            <div className="space-y-3">
              {/* BTC Balance */}
              <div className="p-4 rounded-xl bg-[color:var(--sf-surface)] border border-[color:var(--sf-outline)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">₿</span>
                    </div>
                    <div>
                      <div className="font-semibold text-[color:var(--sf-text)]">Bitcoin</div>
                      <div className="text-xs text-[color:var(--sf-muted)]">BTC</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-[color:var(--sf-text)]">
                      {formatBtcBalance(mergedBalances.btcBalance)}
                    </div>
                    <div className="text-xs text-[color:var(--sf-muted)]">
                      {mergedBalances.btcBalance.toLocaleString()} sats
                    </div>
                  </div>
                </div>
              </div>

              {/* Token Balances */}
              {mergedBalances.tokens.map((token) => (
                <div
                  key={token.runeId}
                  className="p-4 rounded-xl bg-[color:var(--sf-surface)] border border-[color:var(--sf-outline)]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {token.runeId === '2:0' ? (
                        <Image
                          src="/images/diesel-logo.png"
                          alt="DIESEL"
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      ) : (
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          token.runeId === '32:0' ? 'bg-gradient-to-br from-blue-500 to-blue-600' :
                          token.runeId === '2:56801' ? 'bg-gradient-to-br from-green-500 to-green-600' :
                          token.runeId.includes('LP') || token.symbol.includes('LP') ? 'bg-gradient-to-br from-purple-500 to-purple-600' :
                          'bg-gradient-to-br from-gray-500 to-gray-600'
                        }`}>
                          <span className="text-white font-bold text-sm">
                            {token.symbol.slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-[color:var(--sf-text)]">{token.name}</div>
                        <div className="text-xs text-[color:var(--sf-muted)]">{token.symbol}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-[color:var(--sf-text)]">
                        {formatBalance(token.balanceFormatted)}
                      </div>
                      <div className="text-xs text-[color:var(--sf-muted)]">
                        {token.runeId}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {mergedBalances.tokens.length === 0 && (
                <div className="text-center py-6 text-[color:var(--sf-muted)]">
                  No alkane tokens found
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6 text-[color:var(--sf-muted)]">
              Unable to load balances
            </div>
          )}
        </div>

        {/* Backup & Security Section (for keystore wallets only) */}
        {isKeystoreWallet && hasStoredKeystore && (
          <div className="glass-card p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-[color:var(--sf-text)] flex items-center gap-2">
              <Key size={20} />
              Backup & Security
            </h2>

            <div className="space-y-4">
              {/* Warning */}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
                <AlertTriangle size={20} className="text-yellow-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-600 dark:text-yellow-400">
                  <p className="font-medium mb-1">Keep your wallet secure</p>
                  <p className="text-yellow-600/80 dark:text-yellow-400/80">
                    Always maintain a backup of your recovery phrase or encrypted keystore.
                    Never share your recovery phrase with anyone.
                  </p>
                </div>
              </div>

              {/* Backup Options */}
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Export Keystore */}
                <button
                  onClick={handleExportKeystore}
                  disabled={isExporting}
                  className="flex items-center gap-3 p-4 rounded-xl border border-[color:var(--sf-outline)] bg-[color:var(--sf-surface)] hover:border-[color:var(--sf-primary)] transition-colors disabled:opacity-50"
                >
                  <Download size={24} className="text-[color:var(--sf-primary)]" />
                  <div className="text-left">
                    <div className="font-medium text-[color:var(--sf-text)]">
                      {isExporting ? "Exporting..." : "Export Keystore"}
                    </div>
                    <div className="text-xs text-[color:var(--sf-muted)]">
                      Download encrypted JSON file
                    </div>
                  </div>
                </button>

                {/* Google Drive Backup */}
                {driveConfigured && (
                  <button
                    onClick={handleBackupToDrive}
                    disabled={isBackingUp}
                    className="flex items-center gap-3 p-4 rounded-xl border border-[color:var(--sf-outline)] bg-[color:var(--sf-surface)] hover:border-[color:var(--sf-primary)] transition-colors disabled:opacity-50"
                  >
                    <Cloud size={24} className="text-blue-500" />
                    <div className="text-left">
                      <div className="font-medium text-[color:var(--sf-text)]">
                        {isBackingUp ? "Backing up..." : "Backup to Drive"}
                      </div>
                      <div className="text-xs text-[color:var(--sf-muted)]">
                        Secure cloud backup
                      </div>
                    </div>
                  </button>
                )}
              </div>

              {backupError && (
                <div className="text-sm text-red-500 p-3 rounded-lg bg-red-500/10">
                  {backupError}
                </div>
              )}

              {backupSuccess && (
                <div className="text-sm text-green-500 p-3 rounded-lg bg-green-500/10">
                  Wallet backed up successfully to Google Drive!
                </div>
              )}

              {/* Existing Backups */}
              {driveConfigured && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-[color:var(--sf-text)]">Google Drive Backups</span>
                    <button
                      onClick={handleLoadBackups}
                      disabled={loadingBackups}
                      className="text-xs text-[color:var(--sf-primary)] hover:underline disabled:opacity-50"
                    >
                      {loadingBackups ? "Loading..." : "Refresh"}
                    </button>
                  </div>

                  {existingBackups.length > 0 ? (
                    <div className="space-y-2">
                      {existingBackups.map((backup) => (
                        <div
                          key={backup.folderId}
                          className="flex items-center justify-between p-3 rounded-lg bg-[color:var(--sf-surface)] border border-[color:var(--sf-outline)]"
                        >
                          <div className="flex items-center gap-3">
                            <Cloud size={18} className="text-blue-500" />
                            <div>
                              <div className="text-sm font-medium text-[color:var(--sf-text)]">
                                {backup.walletLabel}
                              </div>
                              <div className="text-xs text-[color:var(--sf-muted)]">
                                {new Date(backup.timestamp).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <a
                              href={backup.folderUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 text-[color:var(--sf-muted)] hover:text-[color:var(--sf-primary)]"
                            >
                              <ExternalLink size={14} />
                            </a>
                            <button
                              onClick={() => handleDeleteBackup(backup.folderId)}
                              className="p-1 text-red-500 hover:text-red-400"
                            >
                              <span className="text-xs">Delete</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-sm text-[color:var(--sf-muted)]">
                      Click refresh to load existing backups
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Browser Wallet Info */}
        {isBrowserWallet && (
          <div className="glass-card p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-[color:var(--sf-text)] flex items-center gap-2">
              <Shield size={20} />
              Wallet Information
            </h2>
            <div className="p-4 rounded-xl bg-[color:var(--sf-surface)] border border-[color:var(--sf-outline)]">
              <p className="text-sm text-[color:var(--sf-muted)]">
                Connected via <strong>{browserWallet?.info?.name || "Browser Wallet"}</strong> browser extension.
                Your keys are managed by the extension wallet.
              </p>
              {browserWallet?.info?.website && (
                <a
                  href={browserWallet.info.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-2 text-sm text-[color:var(--sf-primary)] hover:underline"
                >
                  Visit {browserWallet.info.name || "wallet"} <ExternalLink size={14} />
                </a>
              )}
            </div>
          </div>
        )}

        {/* Disconnect Button */}
        <div className="flex justify-center">
          <button
            onClick={handleDisconnect}
            className="px-6 py-3 rounded-xl border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-colors"
          >
            Disconnect Wallet
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
