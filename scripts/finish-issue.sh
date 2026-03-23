#!/bin/bash
set -e
GREEN='\033[0;32m'
NC='\033[0m'

COMMIT=$1
BRANCH=$(git rev-parse --abbrev-ref HEAD)

if [ -z "$COMMIT" ]; then
  echo "Usage: ./scripts/finish-issue.sh <commit-message>"
  exit 1
fi

printf "${GREEN} Running tests...${NC}\n"
npm run test:coverage
echo "-----------------------------"
echo

printf "${GREEN} Running tests...${NC}\n"
git pull origin $BRANCH
echo "-----------------------------"
echo

printf "${GREEN} → Committing...${NC}\n"
git add .
git commit -m "$COMMIT"
echo "-----------------------------"
echo

printf "${GREEN} → Pushing $BRANCH...${NC}\n"
git push -u origin "$BRANCH"
echo "-----------------------------"
echo

printf "${GREEN} ✓ Done. Open your PR at:${NC}\n"
echo "  https://github.com/budget-control-fm/budget-control-fm-core/compare/$BRANCH"
echo