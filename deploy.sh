#!/usr/bin/env bash

# ==============================================================================
# Coupon Portal Frontend Deployment Script
# Target Service Name: coupon-portal-fe
# ==============================================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

FE_DIR="${FE_DIR:-/var/www/portal-coupon-fe}"
BRANCH="${BRANCH:-dev}"

if [ ! -d "$FE_DIR" ]; then
  if [ -d "/var/www/coupon-portal-fe" ]; then
    FE_DIR="/var/www/coupon-portal-fe"
  elif [ -d "/var/www/coupon-fe" ]; then
    FE_DIR="/var/www/coupon-fe"
  fi
fi

echo -e "${CYAN}========================================================================${NC}"
echo -e "${CYAN}             Deploying Coupon Portal Frontend                           ${NC}"
echo -e "${CYAN}========================================================================${NC}"

if [ -d "$FE_DIR" ]; then
  cd "$FE_DIR"
else
  cd "$(dirname "$0")"
fi

if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo -e "${YELLOW}➜ Pulling latest frontend code (origin/${BRANCH})...${NC}"
  git fetch origin "$BRANCH" || true
  git checkout "$BRANCH" || true
  git pull origin "$BRANCH" || true
fi

echo -e "${YELLOW}➜ Installing npm dependencies...${NC}"
npm install

echo -e "${YELLOW}➜ Building production static assets (npm run build)...${NC}"
npm run build

echo -e "${GREEN}========================================================================${NC}"
echo -e "${GREEN}✓ Coupon Portal Frontend deployment completed successfully!              ${NC}"
echo -e "${GREEN}========================================================================${NC}"
