#!/bin/bash
set -e

# ============================================
# Deploy Alkanes to Cloud Run
# ============================================

# Configuration
PROJECT_ID="${GCP_PROJECT_ID:-alkanes-governance}"
REGION="${GCP_REGION:-us-central1}"
SERVICE_NAME="alkanes-docs"
SQL_INSTANCE_NAME="alkanes-postgres"
REDIS_INSTANCE_NAME="alkanes-redis"
VPC_CONNECTOR_NAME="alkanes-connector"

# Image configuration
IMAGE_NAME="${REGION}-docker.pkg.dev/${PROJECT_ID}/alkanes-docker/${SERVICE_NAME}"

echo "============================================"
echo "Deploying Alkanes to Cloud Run"
echo "Project: $PROJECT_ID"
echo "Region: $REGION"
echo "============================================"

# Set project
gcloud config set project "$PROJECT_ID"

# Get connection info
SQL_CONNECTION_NAME=$(gcloud sql instances describe "$SQL_INSTANCE_NAME" --format="value(connectionName)")
REDIS_IP=$(gcloud redis instances describe "$REDIS_INSTANCE_NAME" --region="$REGION" --format="value(host)")
DB_PASSWORD=$(gcloud secrets versions access latest --secret=db-password)

# Build the container
echo "→ Building container image..."
gcloud builds submit \
    --tag "$IMAGE_NAME:latest" \
    --timeout=20m \
    .

# Deploy to Cloud Run
echo "→ Deploying to Cloud Run..."
gcloud run deploy "$SERVICE_NAME" \
    --image "$IMAGE_NAME:latest" \
    --platform managed \
    --region "$REGION" \
    --allow-unauthenticated \
    --port 3000 \
    --cpu 1 \
    --memory 512Mi \
    --min-instances 0 \
    --max-instances 10 \
    --concurrency 80 \
    --timeout 60 \
    --vpc-connector "$VPC_CONNECTOR_NAME" \
    --add-cloudsql-instances "$SQL_CONNECTION_NAME" \
    --set-env-vars "NODE_ENV=production" \
    --set-env-vars "NEXT_PUBLIC_NETWORK=mainnet" \
    --set-env-vars "DATABASE_URL=postgresql://alkanes:${DB_PASSWORD}@/alkanes_docs?host=/cloudsql/${SQL_CONNECTION_NAME}" \
    --set-env-vars "REDIS_URL=redis://${REDIS_IP}:6379"

# Get the service URL
SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" --region="$REGION" --format="value(status.url)")

echo ""
echo "============================================"
echo "Deployment complete!"
echo "============================================"
echo ""
echo "Service URL: $SERVICE_URL"
echo ""
echo "Run database migrations:"
echo "  gcloud run jobs execute prisma-migrate --region=$REGION"
