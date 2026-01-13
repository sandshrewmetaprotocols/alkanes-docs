import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a Bitcoin address for display (truncated)
 */
export function formatAddress(address: string, chars = 6): string {
  if (!address) return "";
  if (address.length <= chars * 2) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

/**
 * Format satoshis to BTC
 */
export function satsToBtc(sats: number | bigint): string {
  const btc = Number(sats) / 100_000_000;
  return btc.toFixed(8).replace(/\.?0+$/, "");
}

/**
 * Format a large number with commas
 */
export function formatNumber(num: number | bigint): string {
  return num.toLocaleString();
}

/**
 * Format DIESEL amount (6 decimals)
 */
export function formatDiesel(amount: bigint): string {
  const value = Number(amount) / 1_000_000;
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 6,
  });
}

/**
 * Parse DIESEL amount to bigint
 */
export function parseDiesel(amount: string): bigint {
  const value = parseFloat(amount);
  if (isNaN(value)) return BigInt(0);
  return BigInt(Math.floor(value * 1_000_000));
}

/**
 * Format a date for display
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Format a datetime for display
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} day${days === 1 ? "" : "s"} ago`;
  }
  if (hours > 0) {
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }
  if (minutes > 0) {
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  }
  return "just now";
}

/**
 * Format time remaining (e.g., "2 days left")
 */
export function formatTimeRemaining(endDate: Date | string): string {
  const end = typeof endDate === "string" ? new Date(endDate) : endDate;
  const now = new Date();
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) {
    return "Ended";
  }

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} day${days === 1 ? "" : "s"} left`;
  }
  if (hours > 0) {
    return `${hours} hour${hours === 1 ? "" : "s"} left`;
  }
  if (minutes > 0) {
    return `${minutes} minute${minutes === 1 ? "" : "s"} left`;
  }
  return "Less than a minute";
}

/**
 * Sleep for a given number of milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generate a random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

/**
 * Validate a Bitcoin address (basic check)
 */
export function isValidBitcoinAddress(address: string): boolean {
  // Basic validation - starts with expected prefixes
  const mainnetPrefixes = ["1", "3", "bc1"];
  const testnetPrefixes = ["m", "n", "2", "tb1"];
  const regtestPrefixes = ["m", "n", "2", "bcrt1"];

  const allPrefixes = [
    ...mainnetPrefixes,
    ...testnetPrefixes,
    ...regtestPrefixes,
  ];

  return allPrefixes.some((prefix) => address.startsWith(prefix));
}
