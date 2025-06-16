#!/bin/bash

# Load environment variables from .env file
set -a && source .env && set +a

echo "Creating AdventureWorks database and products collection…"

az cosmosdb mongodb collection create \
  --account-name $AZURE_COSMOS_ACCOUNT_NAME \
  --database-name adventureworks \
  --name products \
  --resource-group $AZURE_RESOURCE_GROUP

echo "✅ AdventureWorks collection created successfully"
