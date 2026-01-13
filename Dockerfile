# Alkanes Documentation & Governance Platform
# Multi-stage build for Cloud Run deployment

# ============================================
# Stage 1: Dependencies
# ============================================
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

# Copy package files and prisma schema (needed for postinstall)
COPY package.json pnpm-lock.yaml* ./
COPY prisma ./prisma/

# Copy ts-sdk (local dependency)
COPY ts-sdk ./ts-sdk/

# Install dependencies
RUN pnpm install --frozen-lockfile

# ============================================
# Stage 2: Builder
# ============================================
FROM node:20-alpine AS builder
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN pnpm db:generate

# Build the application
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN pnpm build


# ============================================
# Stage 3: Runner
# ============================================
FROM node:20-alpine3.18 AS runner
WORKDIR /app

# Alpine 3.18 has OpenSSL 1.1 which Prisma needs
RUN apk add --no-cache openssl

# Install Prisma CLI globally for migrations
RUN npm install -g prisma@5.22.0

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Note: @alkanes/ts-sdk is included in standalone via serverExternalPackages
# The SDK's WASM files are resolved from node_modules at runtime

# Copy Prisma schema for migrations
COPY --from=builder /app/prisma ./prisma

# Set ownership
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

CMD ["node", "server.js"]
