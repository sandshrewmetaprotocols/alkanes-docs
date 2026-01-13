import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";
import path from "path";

export default defineConfig({
  plugins: [react(), wasm(), topLevelAwait()],
  optimizeDeps: {
    exclude: ['@alkanes/ts-sdk'],
  },
  test: {
    environment: "happy-dom",
    server: {
      deps: {
        inline: ['@alkanes/ts-sdk'],
      },
    },
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    include: ["**/*.{test,spec}.{ts,tsx}"],
    exclude: [
      "**/node_modules/**",
      "**/reference/**",
      "**/ts-sdk/**",
      "**/.external-build/**",
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "text-summary", "json", "html"],
      reportsDirectory: "./coverage",
      include: [
        "app/**/*.{ts,tsx}",
        "lib/**/*.{ts,tsx}",
        "context/**/*.{ts,tsx}",
        "components/**/*.{ts,tsx}",
      ],
      exclude: [
        "**/*.d.ts",
        "**/node_modules/**",
        "**/reference/**",
        "**/ts-sdk/**",
        "**/.external-build/**",
        "**/tests/**",
        "**/__mocks__/**",
        // Exclude integration code requiring external services
        "lib/oyl/alkanes/**",
        // Exclude prisma.ts (just exports the client)
        "lib/prisma.ts",
        // Exclude context requiring SDK integration
        "context/**",
        // Exclude page components that require full app context
        "app/page.tsx",
        "app/layout.tsx",
        "app/providers.tsx",
        "app/docs/**",
        "app/forum/page.tsx",
        "app/forum/[slug]/page.tsx",
        "app/forum/new/page.tsx",
        "app/governance/page.tsx",
        // Exclude locale pages (require full app context)
        "app/[locale]/**/page.tsx",
      ],
      thresholds: {
        global: {
          statements: 97,
          branches: 97,
          functions: 97,
          lines: 97,
        },
      },
    },
    mockReset: true,
    restoreMocks: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
      "@alkanes/ts-sdk/wasm": path.resolve(__dirname, "./ts-sdk/build/wasm/index.js"),
      "@alkanes/ts-sdk": path.resolve(__dirname, "./ts-sdk/dist/index.mjs"),
    },
  },
});
