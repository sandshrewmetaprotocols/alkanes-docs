# GCP Deployment Guide

This guide sets up the Alkanes documentation and governance platform on Google Cloud Platform.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Cloud Load Balancer                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Cloud Run                               │
│                   (alkanes-docs app)                         │
│                    - Next.js 15                              │
│                    - Auto-scaling                            │
└─────────────────────────────────────────────────────────────┘
                    │                    │
                    ▼                    ▼
┌──────────────────────────┐  ┌──────────────────────────────┐
│      Cloud SQL           │  │      Cloud Memorystore       │
│    (PostgreSQL 16)       │  │        (Redis 7)             │
│  - Governance data       │  │  - Session cache             │
│  - Forum discussions     │  │  - Rate limiting             │
│  - User profiles         │  │  - Real-time features        │
└──────────────────────────┘  └──────────────────────────────┘
```

## Prerequisites

1. Google Cloud SDK installed (`gcloud`)
2. A GCP project with billing enabled
3. Required APIs enabled (see setup script)

## Quick Setup

```bash
# 1. Set your project ID
export GCP_PROJECT_ID="alkanes-governance"

# 2. Run the setup script
./gcp/setup.sh

# 3. Deploy
./gcp/deploy.sh
```

## Services Used

| Service | Purpose | Pricing Tier |
|---------|---------|--------------|
| Cloud Run | App hosting | Pay-per-request |
| Cloud SQL | PostgreSQL database | db-f1-micro (dev) / db-g1-small (prod) |
| Cloud Memorystore | Redis cache | basic-1gb |
| Secret Manager | Secure credentials | Per-access |
| Cloud Build | CI/CD | Free tier available |

## Environment Variables

Set in Cloud Run or `.env.production`:

```env
DATABASE_URL=postgresql://USER:PASS@/alkanes?host=/cloudsql/PROJECT:REGION:INSTANCE
REDIS_URL=redis://10.0.0.X:6379
NEXT_PUBLIC_NETWORK=mainnet
```

## Estimated Costs (Development)

- Cloud Run: ~$0-5/month (low traffic)
- Cloud SQL (db-f1-micro): ~$10/month
- Memorystore (1GB): ~$35/month
- **Total**: ~$45-50/month for dev environment

## Production Recommendations

1. Enable Cloud SQL High Availability
2. Use private VPC connector for Cloud Run → Cloud SQL
3. Set up Cloud Armor for DDoS protection
4. Enable Cloud CDN for static assets
5. Use Cloud Monitoring alerts
