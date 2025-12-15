#!/bin/bash

# Frontend and Backend Integration Verification Script
# This script verifies that the frontend and backend are properly configured

echo "======================================"
echo "Creator Sponsorship Platform Verification"
echo "======================================"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASS="${GREEN}✓${NC}"
FAIL="${RED}✗${NC}"

# Counters
checks_passed=0
checks_failed=0

# Function to check file existence
check_file() {
  if [ -f "$1" ]; then
    echo -e "$PASS $1 exists"
    ((checks_passed++))
  else
    echo -e "$FAIL $1 missing"
    ((checks_failed++))
  fi
}

# Function to check directory existence
check_dir() {
  if [ -d "$1" ]; then
    echo -e "$PASS $1 exists"
    ((checks_passed++))
  else
    echo -e "$FAIL $1 missing"
    ((checks_failed++))
  fi
}

echo "Checking Backend Files..."
check_file "sponsorship-backend/main.go"
check_file "sponsorship-backend/go.mod"
check_file "sponsorship-backend/.env"
check_file "sponsorship-backend/config/config.go"
check_dir "sponsorship-backend/internal/handlers"
check_dir "sponsorship-backend/internal/api/middleware"
check_dir "sponsorship-backend/internal/repositories"
check_dir "sponsorship-backend/internal/database"

echo ""
echo "Checking Frontend Files..."
check_file "frontend/.env.local"
check_file "frontend/package.json"
check_file "frontend/src/lib/api-client.ts"
check_file "frontend/src/lib/auth-api.ts"
check_file "frontend/src/lib/sponsorship-api.ts"
check_file "frontend/src/hooks/useAuth.ts"
check_file "frontend/src/hooks/useSponsorships.ts"
check_dir "frontend/src/components"
check_dir "frontend/src/types"

echo ""
echo "Checking Backend Compilation..."
cd sponsorship-backend 2>/dev/null
if go build . >/dev/null 2>&1; then
  echo -e "$PASS Backend compiles successfully"
  ((checks_passed++))
else
  echo -e "$FAIL Backend compilation failed"
  ((checks_failed++))
fi
cd - >/dev/null

echo ""
echo "Checking Frontend Dependencies..."
cd frontend 2>/dev/null
if [ -d "node_modules" ]; then
  echo -e "$PASS Frontend dependencies installed"
  ((checks_passed++))
else
  echo -e "$FAIL Frontend dependencies not installed"
  ((checks_failed++))
fi
cd - >/dev/null

echo ""
echo "======================================"
echo "Verification Summary"
echo "======================================"
echo -e "Checks Passed: ${GREEN}$checks_passed${NC}"
echo -e "Checks Failed: ${RED}$checks_failed${NC}"

if [ $checks_failed -eq 0 ]; then
  echo -e "${GREEN}All checks passed!${NC}"
  echo ""
  echo "Next steps:"
  echo "1. Start PostgreSQL"
  echo "2. Set up database (see backend/README.md)"
  echo "3. Run backend: cd sponsorship-backend && go run main.go"
  echo "4. Run frontend: cd frontend && npm run dev"
  exit 0
else
  echo -e "${RED}Some checks failed. Please review above.${NC}"
  exit 1
fi
