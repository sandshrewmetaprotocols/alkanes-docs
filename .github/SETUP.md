# CI/CD Setup Guide

This guide explains how to configure GitHub Actions and Google Cloud Platform for continuous integration and deployment.

## Overview

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│  GitHub Push    │ ──▶  │  GitHub Actions  │ ──▶  │   Cloud Run     │
│  (main branch)  │      │  (Build & Test)  │      │   (Deploy)      │
└─────────────────┘      └──────────────────┘      └─────────────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │ Artifact Registry│
                         │ (Docker Images)  │
                         └──────────────────┘
```

## Prerequisites

1. A GCP project with billing enabled
2. GitHub repository with admin access
3. `gcloud` CLI installed locally

---

## Step 1: GCP Project Setup

### 1.1 Set Environment Variables

```bash
export GCP_PROJECT_ID="alkanes-governance"  # Your project ID
export GCP_PROJECT_NUMBER=$(gcloud projects describe $GCP_PROJECT_ID --format="value(projectNumber)")
export REGION="us-central1"
```

### 1.2 Enable Required APIs

```bash
gcloud config set project $GCP_PROJECT_ID

gcloud services enable \
  run.googleapis.com \
  sqladmin.googleapis.com \
  redis.googleapis.com \
  secretmanager.googleapis.com \
  vpcaccess.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com \
  iamcredentials.googleapis.com \
  iam.googleapis.com
```

### 1.3 Create Artifact Registry Repository

```bash
gcloud artifacts repositories create alkanes-docker \
  --repository-format=docker \
  --location=$REGION \
  --description="Docker images for Alkanes"
```

---

## Step 2: Workload Identity Federation (Recommended)

Workload Identity Federation allows GitHub Actions to authenticate to GCP without storing service account keys.

### 2.1 Create Workload Identity Pool

```bash
gcloud iam workload-identity-pools create "github-pool" \
  --project="$GCP_PROJECT_ID" \
  --location="global" \
  --display-name="GitHub Actions Pool"
```

### 2.2 Create Workload Identity Provider

```bash
gcloud iam workload-identity-pools providers create-oidc "github-provider" \
  --project="$GCP_PROJECT_ID" \
  --location="global" \
  --workload-identity-pool="github-pool" \
  --display-name="GitHub Provider" \
  --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository,attribute.repository_owner=assertion.repository_owner" \
  --issuer-uri="https://token.actions.githubusercontent.com"
```

### 2.3 Create Service Account for GitHub Actions

```bash
gcloud iam service-accounts create github-actions \
  --display-name="GitHub Actions Service Account"
```

### 2.4 Grant Permissions to Service Account

```bash
SA_EMAIL="github-actions@${GCP_PROJECT_ID}.iam.gserviceaccount.com"

# Cloud Run Admin
gcloud projects add-iam-policy-binding $GCP_PROJECT_ID \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/run.admin"

# Artifact Registry Writer
gcloud projects add-iam-policy-binding $GCP_PROJECT_ID \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/artifactregistry.writer"

# Cloud SQL Client
gcloud projects add-iam-policy-binding $GCP_PROJECT_ID \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/cloudsql.client"

# Secret Manager Accessor
gcloud projects add-iam-policy-binding $GCP_PROJECT_ID \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/secretmanager.secretAccessor"

# Service Account User (to deploy Cloud Run)
gcloud projects add-iam-policy-binding $GCP_PROJECT_ID \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/iam.serviceAccountUser"

# Redis Admin (for getting instance info)
gcloud projects add-iam-policy-binding $GCP_PROJECT_ID \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/redis.viewer"

# VPC Access User
gcloud projects add-iam-policy-binding $GCP_PROJECT_ID \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/vpcaccess.user"
```

### 2.5 Allow GitHub to Impersonate Service Account

Replace `YOUR_GITHUB_ORG` and `YOUR_REPO` with your values:

```bash
GITHUB_ORG="YOUR_GITHUB_ORG"  # e.g., "sandshrewmetaprotocols"
GITHUB_REPO="YOUR_REPO"       # e.g., "alkanes-docs"

gcloud iam service-accounts add-iam-policy-binding \
  "github-actions@${GCP_PROJECT_ID}.iam.gserviceaccount.com" \
  --project="$GCP_PROJECT_ID" \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/projects/${GCP_PROJECT_NUMBER}/locations/global/workloadIdentityPools/github-pool/attribute.repository/${GITHUB_ORG}/${GITHUB_REPO}"
```

### 2.6 Get WIF Provider Resource Name

```bash
echo "WIF_PROVIDER: projects/${GCP_PROJECT_NUMBER}/locations/global/workloadIdentityPools/github-pool/providers/github-provider"
echo "WIF_SERVICE_ACCOUNT: github-actions@${GCP_PROJECT_ID}.iam.gserviceaccount.com"
```

---

## Step 3: Create Secrets

### 3.1 Database Connection String Secret

```bash
# Get the database password (from setup.sh or manually)
DB_PASSWORD="your-db-password"
SQL_CONNECTION=$(gcloud sql instances describe alkanes-postgres --format='value(connectionName)')

# Create the connection string secret
echo -n "postgresql://alkanes:${DB_PASSWORD}@/alkanes_docs?host=/cloudsql/${SQL_CONNECTION}" | \
  gcloud secrets create db-connection-string --data-file=-

# Grant Cloud Run access
gcloud secrets add-iam-policy-binding db-connection-string \
  --member="serviceAccount:${GCP_PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

---

## Step 4: Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add these secrets:

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `GCP_PROJECT_ID` | `alkanes-governance` | Your GCP project ID |
| `WIF_PROVIDER` | `projects/123.../providers/github-provider` | From step 2.6 |
| `WIF_SERVICE_ACCOUNT` | `github-actions@....iam.gserviceaccount.com` | From step 2.6 |

### Alternative: Service Account Key (Less Secure)

If you can't use Workload Identity Federation:

```bash
# Create key file
gcloud iam service-accounts keys create key.json \
  --iam-account=github-actions@${GCP_PROJECT_ID}.iam.gserviceaccount.com

# Copy contents to GitHub secret GCP_SA_KEY
cat key.json

# Delete local key
rm key.json
```

Then update `.github/workflows/deploy.yml` to use `credentials_json` instead of `workload_identity_provider`.

---

## Step 5: Run GCP Infrastructure Setup

```bash
# Run the setup script to create Cloud SQL, Redis, etc.
./gcp/setup.sh
```

---

## Step 6: Test the Pipeline

1. Push a commit to the `main` branch
2. Go to GitHub → Actions tab
3. Watch the CI workflow run
4. On success, the Deploy workflow will automatically deploy to Cloud Run

---

## Workflow Summary

### CI Workflow (`.github/workflows/ci.yml`)
- **Triggers:** Push to `main`/`develop`, Pull Requests to `main`
- **Jobs:**
  - Lint & Type Check
  - Build Next.js app
  - Test Docker build

### Deploy Workflow (`.github/workflows/deploy.yml`)
- **Triggers:** Push to `main`, Manual dispatch
- **Jobs:**
  - Build & push Docker image to Artifact Registry
  - Deploy to Cloud Run
  - Run database migrations

---

## Troubleshooting

### "Permission denied" errors

Check that the service account has all required roles:
```bash
gcloud projects get-iam-policy $GCP_PROJECT_ID \
  --flatten="bindings[].members" \
  --filter="bindings.members:github-actions@" \
  --format="table(bindings.role)"
```

### "Workload Identity Federation" errors

Verify the attribute mapping:
```bash
gcloud iam workload-identity-pools providers describe github-provider \
  --location="global" \
  --workload-identity-pool="github-pool" \
  --project="$GCP_PROJECT_ID"
```

### Cloud Run deployment fails

Check Cloud Run logs:
```bash
gcloud run services logs read alkanes-docs --region=$REGION --limit=50
```

---

## Cost Optimization

1. **Cloud Run:** Set `--min-instances 0` for scale-to-zero
2. **Cloud SQL:** Use `db-f1-micro` for dev, `db-g1-small` for prod
3. **Artifact Registry:** Set lifecycle policies to delete old images:
   ```bash
   gcloud artifacts repositories set-cleanup-policies alkanes-docker \
     --location=$REGION \
     --policy=keep-last-5-versions
   ```
