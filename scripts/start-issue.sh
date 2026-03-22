#!/bin/bash
set -e

BRANCH=$1
COMMIT=$2

if [ -z "$BRANCH" ]; then
  echo "Usage: ./scripts/start-issue.sh <branch-name> [commit-message]"
  exit 1
fi

echo "→ Syncing main..."
git checkout main
git pull origin main

echo "→ Creating branch $BRANCH..."
git checkout -b "$BRANCH"

echo "✓ Ready. Make your changes, then run:"
echo "  ./scripts/finish-issue.sh \"$COMMIT\""