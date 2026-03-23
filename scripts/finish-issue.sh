#!/bin/bash
set -e

COMMIT=$1
BRANCH=$(git rev-parse --abbrev-ref HEAD)

if [ -z "$COMMIT" ]; then
  echo "Usage: ./scripts/finish-issue.sh <commit-message>"
  exit 1
fi

echo -e "\e[32m→ Running tests...\e[0m"
npm run test:coverage
echo "-----------------------------"
echo

echo -e "\e[32m→ Running tests...\e[0m"
git pull origin $BRANCH
echo "-----------------------------"
echo

echo -e "\e[32m→ Committing...\e[0m"
git add .
git commit -m "$COMMIT"
echo "-----------------------------"
echo

echo -e "\e[32m→ Pushing $BRANCH...\e[0m"
git push -u origin "$BRANCH"
echo "-----------------------------"
echo

echo -e "\e[32m✓ Done. Open your PR at:"
echo "  https://github.com/budget-control-fm/budget-control-fm-core/compare/$BRANCH"
echo