#!/bin/bash
set -e

COMMIT=$1
BRANCH=$(git rev-parse --abbrev-ref HEAD)

if [ -z "$COMMIT" ]; then
  echo "Usage: ./scripts/finish-issue.sh <commit-message>"
  exit 1
fi

echo "→ Running tests..."
npm run test:coverage

echo "\n→ Running tests..."
git pull origin $BRANCH

echo "→ Committing..."
git add .
git commit -m "$COMMIT"

echo "→ Pushing $BRANCH..."
git push -u origin "$BRANCH"

echo "✓ Done. Open your PR at:"
echo "  https://github.com/budget-control-fm/budget-control-fm-core/compare/$BRANCH"