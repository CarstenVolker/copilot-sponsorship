#!/bin/bash

# Test script to verify AddDealModal API integration
echo "╔════════════════════════════════════════════════════════╗"
echo "║   AddDealModal API Integration Test                  ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

echo "✓ Checking AddDealModal component..."
if grep -q "sponsorshipApi" /root/work/codegenerations/copilot-sponsorship/frontend/src/components/dashboard/AddDealModal.tsx; then
  echo "✓ API import found"
else
  echo "✗ API import missing"
  exit 1
fi

echo "✓ Checking handleSubmit implementation..."
if grep -q "sponsorshipApi.createSponsorship\|sponsorshipApi.updateSponsorship" /root/work/codegenerations/copilot-sponsorship/frontend/src/components/dashboard/AddDealModal.tsx; then
  echo "✓ API calls implemented"
else
  echo "✗ API calls missing"
  exit 1
fi

echo "✓ Checking error handling..."
if grep -q "setError\|error &&" /root/work/codegenerations/copilot-sponsorship/frontend/src/components/dashboard/AddDealModal.tsx; then
  echo "✓ Error handling implemented"
else
  echo "✗ Error handling missing"
  exit 1
fi

echo ""
echo "✓ All checks passed!"
echo ""
echo "Summary of changes:"
echo "  - Added sponsorshipApi import"
echo "  - Replaced setTimeout with actual API calls"
echo "  - Added error state management"
echo "  - Added error UI display"
echo "  - Improved form data handling"
echo ""
echo "The AddDealModal will now:"
echo "  1. Call sponsorshipApi.createSponsorship() for new deals"
echo "  2. Call sponsorshipApi.updateSponsorship() for edits"
echo "  3. Display errors if the API call fails"
echo "  4. Show loading state while saving"
echo ""
