#!/bin/bash
set -e

# ============================================
# GCP Project Setup for Alkanes Governance
# ============================================

# Configuration (override with environment variables)
PROJECT_ID="${GCP_PROJECT_ID:-alkanes-governance}"
REGION="${GCP_REGION:-us-central1}"
ZONE="${GCP_ZONE:-us-central1-a}"

# Service names
SQL_INSTANCE_NAME="alkanes-postgres"
REDIS_INSTANCE_NAME="alkanes-redis"
CLOUD_RUN_SERVICE="alkanes-docs"
VPC_CONNECTOR_NAME="alkanes-connector"

# Database config
DB_NAME="alkanes_docs"
DB_USER="alkanes"
DB_TIER="${DB_TIER:-db-f1-micro}"  # Use db-g1-small for production

# Redis config
REDIS_TIER="${REDIS_TIER:-basic}"
REDIS_SIZE="${REDIS_SIZE:-1}"  # GB

echo "============================================"
echo "Setting up GCP project: $PROJECT_ID"
echo "Region: $REGION"
echo "============================================"

# Check if gcloud is authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | head -1 > /dev/null 2>&1; then
    echo "Please authenticate with gcloud first:"
    echo "  gcloud auth login"
    exit 1
fi

# Set the project
echo "→ Setting project to $PROJECT_ID..."
gcloud config set project "$PROJECT_ID"

# Enable required APIs
echo "→ Enabling required APIs..."
gcloud services enable \
    run.googleapis.com \
    sqladmin.googleapis.com \
    redis.googleapis.com \
    secretmanager.googleapis.com \
    vpcaccess.googleapis.com \
    cloudbuild.googleapis.com \
    containerregistry.googleapis.com \
    artifactregistry.googleapis.com

# Create VPC connector for private communication
echo "→ Creating VPC connector..."
if ! gcloud compute networks vpc-access connectors describe "$VPC_CONNECTOR_NAME" --region="$REGION" > /dev/null 2>&1; then
    gcloud compute networks vpc-access connectors create "$VPC_CONNECTOR_NAME" \
        --region="$REGION" \
        --range="10.8.0.0/28" \
        --min-instances=2 \
        --max-instances=3
else
    echo "  VPC connector already exists"
fi

# Create Cloud SQL PostgreSQL instance
echo "→ Creating Cloud SQL PostgreSQL instance..."
if ! gcloud sql instances describe "$SQL_INSTANCE_NAME" > /dev/null 2>&1; then
    gcloud sql instances create "$SQL_INSTANCE_NAME" \
        --database-version=POSTGRES_16 \
        --tier="$DB_TIER" \
        --edition=ENTERPRISE \
        --region="$REGION" \
        --storage-type=SSD \
        --storage-size=10GB \
        --storage-auto-increase \
        --backup-start-time="04:00" \
        --availability-type=zonal \
        --root-password="$(openssl rand -base64 24)"

    echo "→ Creating database..."
    gcloud sql databases create "$DB_NAME" --instance="$SQL_INSTANCE_NAME"

    echo "→ Creating database user..."
    DB_PASSWORD=$(openssl rand -base64 24)
    gcloud sql users create "$DB_USER" \
        --instance="$SQL_INSTANCE_NAME" \
        --password="$DB_PASSWORD"

    # Store password in Secret Manager
    echo "→ Storing database password in Secret Manager..."
    echo -n "$DB_PASSWORD" | gcloud secrets create db-password --data-file=-
else
    echo "  Cloud SQL instance already exists"
    DB_PASSWORD=$(gcloud secrets versions access latest --secret=db-password 2>/dev/null || echo "")
fi

# Create Cloud Memorystore Redis instance
echo "→ Creating Cloud Memorystore Redis instance..."
if ! gcloud redis instances describe "$REDIS_INSTANCE_NAME" --region="$REGION" > /dev/null 2>&1; then
    gcloud redis instances create "$REDIS_INSTANCE_NAME" \
        --size="$REDIS_SIZE" \
        --region="$REGION" \
        --tier="$REDIS_TIER" \
        --redis-version=redis_7_0 \
        --connect-mode=PRIVATE_SERVICE_ACCESS || {
            # Fallback to direct peering if private service access not set up
            gcloud redis instances create "$REDIS_INSTANCE_NAME" \
                --size="$REDIS_SIZE" \
                --region="$REGION" \
                --tier="$REDIS_TIER" \
                --redis-version=redis_7_0
        }
else
    echo "  Redis instance already exists"
fi

# Get Redis IP
REDIS_IP=$(gcloud redis instances describe "$REDIS_INSTANCE_NAME" --region="$REGION" --format="value(host)" 2>/dev/null || echo "")

# Get Cloud SQL connection name
SQL_CONNECTION_NAME=$(gcloud sql instances describe "$SQL_INSTANCE_NAME" --format="value(connectionName)" 2>/dev/null || echo "")

# Create Artifact Registry repository
echo "→ Creating Artifact Registry repository..."
if ! gcloud artifacts repositories describe alkanes-docker --location="$REGION" > /dev/null 2>&1; then
    gcloud artifacts repositories create alkanes-docker \
        --repository-format=docker \
        --location="$REGION" \
        --description="Docker images for Alkanes"
else
    echo "  Artifact Registry repository already exists"
fi

# Grant Cloud Run service account access to Secret Manager
echo "→ Setting up IAM permissions..."
PROJECT_NUMBER=$(gcloud projects describe "$PROJECT_ID" --format="value(projectNumber)")
CLOUD_RUN_SA="${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"

gcloud secrets add-iam-policy-binding db-password \
    --member="serviceAccount:${CLOUD_RUN_SA}" \
    --role="roles/secretmanager.secretAccessor" 2>/dev/null || true

# Grant Cloud Run access to Cloud SQL
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:${CLOUD_RUN_SA}" \
    --role="roles/cloudsql.client" 2>/dev/null || true

echo ""
echo "============================================"
echo "Setup complete!"
echo "============================================"
echo ""
echo "Resources created:"
echo "  - Cloud SQL: $SQL_INSTANCE_NAME ($DB_TIER)"
echo "  - Database: $DB_NAME"
echo "  - Redis: $REDIS_INSTANCE_NAME ($REDIS_SIZE GB)"
echo "  - VPC Connector: $VPC_CONNECTOR_NAME"
echo ""
echo "Connection info:"
echo "  - SQL Connection: $SQL_CONNECTION_NAME"
echo "  - Redis IP: $REDIS_IP"
echo ""
echo "Next steps:"
echo "  1. Create .env.production with these values"
echo "  2. Run: ./gcp/deploy.sh"
echo ""
echo "Environment variables for Cloud Run:"
echo "  DATABASE_URL=postgresql://$DB_USER:<password>@/$DB_NAME?host=/cloudsql/$SQL_CONNECTION_NAME"
echo "  REDIS_URL=redis://$REDIS_IP:6379"
