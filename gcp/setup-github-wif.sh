#!/bin/bash
set -e

# ============================================
# Setup Workload Identity Federation for GitHub Actions
# ============================================

# Configuration - EDIT THESE
PROJECT_ID="${GCP_PROJECT_ID:-alkanes-governance}"
GITHUB_ORG="${GITHUB_ORG:-kungfuflex}"    # Your GitHub org/username
GITHUB_REPO="${GITHUB_REPO:-alkanes.build}"  # Your repo name

echo "============================================"
echo "Setting up Workload Identity Federation"
echo "Project: $PROJECT_ID"
echo "GitHub: $GITHUB_ORG/$GITHUB_REPO"
echo "============================================"
echo ""

# Check if variables are set
if [ "$GITHUB_ORG" = "sandshrewmetaprotocols" ]; then
    echo "WARNING: Using default GITHUB_ORG value"
    echo "Set GITHUB_ORG environment variable to your org/username"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Set project
gcloud config set project "$PROJECT_ID"

# Get project number
PROJECT_NUMBER=$(gcloud projects describe "$PROJECT_ID" --format="value(projectNumber)")
echo "Project Number: $PROJECT_NUMBER"

# Enable IAM APIs
echo "→ Enabling IAM APIs..."
gcloud services enable \
    iamcredentials.googleapis.com \
    iam.googleapis.com

# Create Workload Identity Pool
echo "→ Creating Workload Identity Pool..."
if ! gcloud iam workload-identity-pools describe github-pool --location=global > /dev/null 2>&1; then
    gcloud iam workload-identity-pools create github-pool \
        --project="$PROJECT_ID" \
        --location="global" \
        --display-name="GitHub Actions Pool"
else
    echo "  Pool already exists"
fi

# Create OIDC Provider
echo "→ Creating OIDC Provider..."
if ! gcloud iam workload-identity-pools providers describe github-provider --location=global --workload-identity-pool=github-pool > /dev/null 2>&1; then
    gcloud iam workload-identity-pools providers create-oidc github-provider \
        --project="$PROJECT_ID" \
        --location="global" \
        --workload-identity-pool="github-pool" \
        --display-name="GitHub Provider" \
        --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository,attribute.repository_owner=assertion.repository_owner" \
        --attribute-condition="assertion.repository_owner == '${GITHUB_ORG}'" \
        --issuer-uri="https://token.actions.githubusercontent.com"
else
    echo "  Provider already exists"
fi

# Create Service Account
SA_NAME="github-actions"
SA_EMAIL="${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"

echo "→ Creating Service Account..."
if ! gcloud iam service-accounts describe "$SA_EMAIL" > /dev/null 2>&1; then
    gcloud iam service-accounts create "$SA_NAME" \
        --display-name="GitHub Actions Service Account"
else
    echo "  Service account already exists"
fi

# Grant roles to service account
echo "→ Granting IAM roles..."
ROLES=(
    "roles/run.admin"
    "roles/artifactregistry.writer"
    "roles/cloudsql.client"
    "roles/secretmanager.secretAccessor"
    "roles/iam.serviceAccountUser"
    "roles/redis.viewer"
    "roles/vpcaccess.user"
)

for ROLE in "${ROLES[@]}"; do
    echo "  Adding $ROLE..."
    gcloud projects add-iam-policy-binding "$PROJECT_ID" \
        --member="serviceAccount:${SA_EMAIL}" \
        --role="$ROLE" \
        --quiet > /dev/null 2>&1 || true
done

# Allow GitHub to impersonate service account
echo "→ Setting up Workload Identity binding..."
gcloud iam service-accounts add-iam-policy-binding "$SA_EMAIL" \
    --project="$PROJECT_ID" \
    --role="roles/iam.workloadIdentityUser" \
    --member="principalSet://iam.googleapis.com/projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/github-pool/attribute.repository/${GITHUB_ORG}/${GITHUB_REPO}" \
    --quiet > /dev/null 2>&1 || true

# Output GitHub secrets
echo ""
echo "============================================"
echo "Setup complete!"
echo "============================================"
echo ""
echo "Add these secrets to your GitHub repository:"
echo "(Settings → Secrets and variables → Actions)"
echo ""
echo "┌────────────────────────────────────────────────────────────────────────────────┐"
echo "│ Secret Name          │ Value                                                   │"
echo "├────────────────────────────────────────────────────────────────────────────────┤"
printf "│ %-20s │ %-55s │\n" "GCP_PROJECT_ID" "$PROJECT_ID"
echo "├────────────────────────────────────────────────────────────────────────────────┤"
printf "│ %-20s │ %-55s │\n" "WIF_PROVIDER" "projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/github-pool/providers/github-provider"
echo "├────────────────────────────────────────────────────────────────────────────────┤"
printf "│ %-20s │ %-55s │\n" "WIF_SERVICE_ACCOUNT" "$SA_EMAIL"
echo "└────────────────────────────────────────────────────────────────────────────────┘"
echo ""
echo "Full WIF_PROVIDER value (copy this):"
echo "projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/github-pool/providers/github-provider"
echo ""
