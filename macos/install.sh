#!/bin/bash

# StreamVault macOS Installation Script
# This script automates the installation process

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}"
echo "╔════════════════════════════════════════╗"
echo "║                                        ║"
echo "║     StreamVault macOS Installer        ║"
echo "║                                        ║"
echo "╚════════════════════════════════════════╝"
echo -e "${NC}"

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    echo -e "${RED}Error: Please don't run this script as root${NC}"
    exit 1
fi

# Check if DMG is mounted
if [ ! -d "/Volumes/StreamVault" ]; then
    echo -e "${YELLOW}DMG not mounted. Please mount StreamVault.dmg first${NC}"
    echo -e "${BLUE}You can mount it by double-clicking the DMG file${NC}"
    exit 1
fi

echo -e "${GREEN}✓ DMG is mounted${NC}"

# Check if app exists
if [ ! -d "/Volumes/StreamVault/StreamVault.app" ]; then
    echo -e "${RED}Error: StreamVault.app not found in DMG${NC}"
    exit 1
fi

echo -e "${GREEN}✓ StreamVault.app found${NC}"

# Check if already installed
if [ -d "/Applications/StreamVault.app" ]; then
    echo -e "${YELLOW}StreamVault is already installed${NC}"
    read -p "Do you want to replace it? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${BLUE}Installation cancelled${NC}"
        exit 0
    fi
    
    # Remove old version
    echo -e "${BLUE}Removing old version...${NC}"
    rm -rf "/Applications/StreamVault.app"
fi

# Copy app to Applications
echo -e "${BLUE}Installing StreamVault...${NC}"
cp -R "/Volumes/StreamVault/StreamVault.app" "/Applications/"

echo -e "${GREEN}✓ Installation complete${NC}"

# Remove quarantine attribute (fixes "app is damaged" issue)
echo -e "${BLUE}Removing quarantine attribute...${NC}"
xattr -cr "/Applications/StreamVault.app" 2>/dev/null || true

echo -e "${GREEN}✓ Quarantine removed${NC}"

# Ask to launch
read -p "Launch StreamVault now? (Y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Nn]$ ]]; then
    echo -e "${BLUE}Launching StreamVault...${NC}"
    open "/Applications/StreamVault.app"
fi

# Unmount DMG
read -p "Unmount the DMG? (Y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Nn]$ ]]; then
    echo -e "${BLUE}Unmounting DMG...${NC}"
    hdiutil detach "/Volumes/StreamVault" 2>/dev/null || true
    echo -e "${GREEN}✓ DMG unmounted${NC}"
fi

echo ""
echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                        ║${NC}"
echo -e "${GREEN}║     Installation Successful! ✓         ║${NC}"
echo -e "${GREEN}║                                        ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}StreamVault is now installed in:${NC}"
echo -e "${YELLOW}/Applications/StreamVault.app${NC}"
echo ""
echo -e "${BLUE}You can:${NC}"
echo -e "  • Launch from Applications folder"
echo -e "  • Use Spotlight (Cmd+Space) and type 'StreamVault'"
echo -e "  • Add to Dock for quick access"
echo ""
echo -e "${BLUE}First launch tips:${NC}"
echo -e "  • Grant permissions when prompted"
echo -e "  • Check Preferences (Cmd+,) to customize"
echo -e "  • Press ? for keyboard shortcuts"
echo ""
echo -e "${GREEN}Enjoy StreamVault! 🎬${NC}"
