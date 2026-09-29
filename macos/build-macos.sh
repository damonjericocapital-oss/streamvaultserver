#!/bin/bash

# StreamVault macOS Build Script
# This script builds the StreamVault desktop app for macOS

set -e  # Exit on error

echo "🚀 Building StreamVault for macOS..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: package.json not found. Please run this script from the project root.${NC}"
    exit 1
fi

# Step 1: Build the web app
echo -e "${BLUE}Step 1: Building web application...${NC}"
npm run build
echo -e "${GREEN}✓ Web app built successfully${NC}"
echo ""

# Step 2: Copy built files to macos directory
echo -e "${BLUE}Step 2: Preparing macOS app structure...${NC}"
mkdir -p macos/dist
cp -r dist/* macos/dist/
echo -e "${GREEN}✓ Files copied to macos/dist${NC}"
echo ""

# Step 3: Install macOS dependencies
echo -e "${BLUE}Step 3: Installing macOS dependencies...${NC}"
cd macos
npm install
echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

# Step 4: Build the macOS app
echo -e "${BLUE}Step 4: Building macOS application...${NC}"
npm run build
echo -e "${GREEN}✓ macOS app built successfully${NC}"
echo ""

# Step 5: Show output location
echo -e "${BLUE}Step 5: Locating build output...${NC}"
if [ -d "release" ]; then
    echo -e "${GREEN}✓ Build output found in macos/release/${NC}"
    echo ""
    echo -e "${YELLOW}Build artifacts:${NC}"
    ls -lh release/
    echo ""
else
    echo -e "${RED}Error: Build output not found${NC}"
    exit 1
fi

# Step 6: Create DMG if it doesn't exist
if [ -f "release/StreamVault-1.0.0.dmg" ]; then
    echo -e "${GREEN}✓ DMG installer created successfully${NC}"
    echo ""
    echo -e "${YELLOW}📦 Your macOS app is ready!${NC}"
    echo ""
    echo "Location: macos/release/StreamVault-1.0.0.dmg"
    echo ""
    echo "To install:"
    echo "  1. Double-click StreamVault-1.0.0.dmg"
    echo "  2. Drag StreamVault to Applications folder"
    echo "  3. Launch from Applications or Spotlight"
    echo ""
else
    echo -e "${YELLOW}Note: DMG file not found. You may need to run the build manually.${NC}"
fi

echo -e "${GREEN}✨ Build complete!${NC}"
