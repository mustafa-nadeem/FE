#!/bin/bash

# Deploy to Surge.sh
# Usage: ./deploy.sh [domain]
# If no domain is provided, Surge will generate a random subdomain

cd build

if [ -z "$1" ]; then
  echo "Deploying to Surge.sh (random subdomain)..."
  npx --yes surge . --project ./
else
  echo "Deploying to $1..."
  npx --yes surge . "$1" --project ./
fi

echo "Deployment complete!"
