"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { WalletProvider } from "@/context/WalletContext";

// Detect network from environment or hostname
function detectNetwork(): "mainnet" | "testnet" | "signet" | "regtest" {
  if (typeof window === "undefined") {
    return (process.env.NEXT_PUBLIC_NETWORK as any) || "mainnet";
  }

  const hostname = window.location.hostname;

  if (hostname.includes("signet") || hostname.includes("staging")) {
    return "signet";
  }
  if (hostname.includes("testnet")) {
    return "testnet";
  }
  if (hostname.includes("regtest") || hostname.includes("localhost")) {
    return "regtest";
  }

  return (process.env.NEXT_PUBLIC_NETWORK as any) || "mainnet";
}

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  const network = detectNetwork();

  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider network={network}>{children}</WalletProvider>
    </QueryClientProvider>
  );
}
