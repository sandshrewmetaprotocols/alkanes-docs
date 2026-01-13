#!/bin/bash
# Create the Cloud Run job for running Prisma migrations
# Run this once to set up the migration job

set -e

# Configuration
REGION="us-central1"
PROJECT_ID=$(gcloud config get-value project)
SQL_INSTANCE="alkanes-postgres"
VPC_CONNECTOR="alkanes-connector"
SERVICE_NAME="alkanes-docs"

echo "Creating Prisma migration job..."

# Get connection info
DB_PASSWORD=$(gcloud secrets versions access latest --secret=db-password)
SQL_CONNECTION=$(gcloud sql instances describe ${SQL_INSTANCE} --format='value(connectionName)')

# Get the latest image
IMAGE="${REGION}-docker.pkg.dev/${PROJECT_ID}/alkanes-docker/${SERVICE_NAME}:latest"

# Create the Cloud Run job
gcloud run jobs create prisma-migrate \
  --image "${IMAGE}" \
  --region "${REGION}" \
  --vpc-connector "${VPC_CONNECTOR}" \
  --add-cloudsql-instances "${SQL_CONNECTION}" \
  --set-env-vars "DATABASE_URL=postgresql://alkanes:${DB_PASSWORD}@/alkanes_docs?host=/cloudsql/${SQL_CONNECTION}" \
  --command "npx" \
  --args "prisma,db,push,--skip-generate" \
  --max-retries 1 \
  --task-timeout 300s \
  --memory 512Mi \
  --cpu 1 || \
gcloud run jobs update prisma-migrate \
  --image "${IMAGE}" \
  --region "${REGION}" \
  --vpc-connector "${VPC_CONNECTOR}" \
  --add-cloudsql-instances "${SQL_CONNECTION}" \
  --set-env-vars "DATABASE_URL=postgresql://alkanes:${DB_PASSWORD}@/alkanes_docs?host=/cloudsql/${SQL_CONNECTION}" \
  --command "npx" \
  --args "prisma,db,push,--skip-generate"

echo "Migration job created/updated. Now executing..."

# Execute the job
gcloud run jobs execute prisma-migrate \
  --region "${REGION}" \
  --wait

echo "Migration complete!"
