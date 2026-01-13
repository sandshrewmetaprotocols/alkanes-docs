"use client";

import { useQuery } from "@tanstack/react-query";

interface SdkVersionData {
  version: string;
  shortHash: string;
  fullHash: string;
  versionWithHash: string;
  packageUrl: string;
  commitMessage: string;
  commitDate: string;
  branch: string;
  repository: string;
  cachedAt: string;
}

interface SdkVersionApiResponse {
  success: boolean;
  data?: SdkVersionData;
  cached?: boolean;
  error?: string;
  fallback?: {
    packageUrl: string;
    note: string;
  };
}

/**
 * Hook to fetch the latest @alkanes/ts-sdk version from the develop branch
 * Version format: {semver}-{shortHash} (e.g., 0.1.1-0bcdeabc)
 * Used in documentation to show the current installation URL
 */
export function useSdkVersion() {
  return useQuery({
    queryKey: ["sdk-version"],
    queryFn: async (): Promise<SdkVersionData> => {
      const res = await fetch("/api/sdk-version");
      const data: SdkVersionApiResponse = await res.json();

      if (!data.success || !data.data) {
        // If API fails, return a fallback that still works
        throw new Error(data.error || "Failed to fetch SDK version");
      }

      return data.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - matches Redis cache TTL
    refetchInterval: false, // Don't auto-refresh, version doesn't change often
    retry: 1, // Only retry once
  });
}

/**
 * Format commit date as relative time or ISO date
 */
export function formatCommitDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours === 0) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return `${diffMins} minutes ago`;
    }
    return `${diffHours} hours ago`;
  }
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;

  return date.toLocaleDateString();
}
