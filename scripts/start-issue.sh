#!/bin/bash
set -e
GREEN='\033[0;32m'
NC='\033[0m'

BRANCH=$1
COMMIT=$2

if [ -z "$BRANCH" ]; then
  echo "Usage: ./scripts/start-issue.sh <branch-name> [commit-message]"
  exit 1
fi

printf "${GREEN}→ Syncing main...${NC}\n"
git checkout main
git pull origin main

printf "${GREEN}→ Creating branch $BRANCH..."
git checkout -b "$BRANCH"

printf "${GREEN}✓ Ready. Make your changes, then run:${NC}\n"
echo "  ./scripts/finish-issue.sh \"$COMMIT\""