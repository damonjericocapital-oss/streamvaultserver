# 🍎 Building StreamVault for macOS - Complete Guide

This guide walks you through building and distributing StreamVault as a native macOS application.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Build](#quick-build)
3. [Manual Build](#manual-build)
4. [Code Signing](#code-signing)
5. [Notarization](#notarization)
6. [Distribution](#distribution)
7. [App Store Submission](#app-store-submission)

---

## 🔧 Prerequisites

### Required Software

1. **macOS** (10.15 or later)
2. **Xcode** (13.0 or later)
   ```bash
   xcode-select --install
   ```

3. **Node.js** (18.0 or later)
   ```bash
   # Using Homebrew
   brew install node
   
   # Or download from https://nodejs.org/
   ```

4. **Git**
   ```bash
   brew install git
   ```

### Optional (for distribution)

5. **Apple Developer Account** ($99/year)
   - Required for code signing and notarization
   - Sign up at [developer.apple.com](https://developer.apple.com)

---

## 🚀 Quick Build

### One-Command Build

```bash
# From project root
./macos/build-macos.sh
```

This script will:
1. Build the web application
2. Copy files to the macOS wrapper
3. Install dependencies
4. Create the .app bundle
5. Generate DMG installer

**Output**: `macos/release/StreamVault-1.0.0.dmg`

---

## 🔨 Manual Build

### Step 1: Build Web App

```bash
# From project root
npm install
npm run build
```

### Step 2: Prepare macOS Directory

```bash
cd macos

# Copy built web app
mkdir -p dist
cp -r ../dist/* dist/

# Install Electron dependencies
npm install
```

### Step 3: Build Electron App

```bash
# Build for all architectures (Universal)
npm run build

# Or build for specific architecture
npm run build -- --x64    # Intel only
npm run build -- --arm64  # Apple Silicon only
```

### Step 4: Verify Build

```bash
# Check output
ls -lh release/

# You should see:
# - StreamVault-1.0.0.dmg
# - StreamVault-1.0.0-mac.zip
# - mac/StreamVault.app
```

---

## 🔐 Code Signing

Code signing is required for distribution outside the Mac App Store.

### Step 1: Get Certificate

1. Log in to [Apple Developer](https://developer.apple.com)
2. Go to **Certificates, Identifiers & Profiles**
3. Click **Certificates** → **+**
4. Select **Developer ID Application**
5. Follow the instructions to create and download

### Step 2: Install Certificate

```bash
# Double-click the .cer file to install
# Or use Keychain Access to import
```

### Step 3: Sign the App

Create `macos/build/entitlements.mac.plist` (already included):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>com.apple.security.cs.allow-jit</key>
    <true/>
    <key>com.apple.security.cs.allow-unsigned-executable-memory</key>
    <true/>
    <key>com.apple.security.cs.allow-dyld-environment-variables</key>
    <true/>
    <key>com.apple.security.network.client</key>
    <true/>
    <key>com.apple.security.network.server</key>
    <true/>
</dict>
</plist>
```

Build with signing:

```bash
cd macos

# Set environment variables
export APPLE_ID="your@email.com"
export APPLE_TEAM_ID="YOUR_TEAM_ID"
export APPLE_ID_PASSWORD="your-app-specific-password"

# Build with signing
npm run build -- --mac --publish=never
```

### Step 4: Verify Signature

```bash
# Check if app is signed
codesign -vvv release/mac/StreamVault.app

# Should show: valid on disk and satisfies its Designated Requirement
```

---

## ✅ Notarization

Notarization is required for macOS 10.15+ to run apps from unidentified developers.

### Step 1: Create App-Specific Password

1. Go to [appleid.apple.com](https://appleid.apple.com)
2. Sign in with your Apple ID
3. Go to **Security** → **App-Specific Passwords**
4. Click **Generate** and save the password

### Step 2: Notarize the App

```bash
# Create a zip file for notarization
cd release
ditto -c -k --keepParent StreamVault.app StreamVault.zip

# Submit for notarization
xcrun notarytool submit StreamVault.zip \
  --apple-id "your@email.com" \
  --team-id "YOUR_TEAM_ID" \
  --password "your-app-specific-password" \
  --wait

# Note the submission ID
```

### Step 3: Check Status

```bash
# Check notarization status
xcrun notarytool info SUBMISSION_ID \
  --apple-id "your@email.com" \
  --team-id "YOUR_TEAM_ID" \
  --password "your-app-specific-password"
```

### Step 4: Staple the Ticket

```bash
# Once approved, staple the ticket to the app
xcrun stapler staple StreamVault.app

# Verify
spctl -a -vvv StreamVault.app
# Should show: accepted
```

### Step 5: Rebuild DMG

```bash
# Rebuild DMG with notarized app
cd ..
npm run build:dmg
```

---

## 📦 Distribution

### Option 1: Direct Download

1. **Upload DMG to your website**:
   ```bash
   # Example: Upload to GitHub Releases
   gh release create v1.0.0 release/StreamVault-1.0.0.dmg
   ```

2. **Provide download link**:
   ```markdown
   [Download StreamVault for macOS](https://github.com/yourusername/streamvault/releases/download/v1.0.0/StreamVault-1.0.0.dmg)
   ```

3. **Include installation instructions** (see README.md)

### Option 2: Homebrew Cask

Create `Casks/streamvault.rb`:

```ruby
cask "streamvault" do
  version "1.0.0"
  sha256 "YOUR_SHA256_HASH"

  url "https://github.com/yourusername/streamvault/releases/download/v#{version}/StreamVault-#{version}.dmg"
  name "StreamVault"
  desc "Ultimate streaming server for macOS"
  homepage "https://streamvault.app"

  app "StreamVault.app"

  zap trash: [
    "~/Library/Application Support/StreamVault",
    "~/Library/Preferences/com.streamvault.app.plist",
  ]
end
```

Users can install with:
```bash
brew install --cask streamvault
```

### Option 3: Sparkle Updates

Add auto-update support with [Sparkle](https://sparkle-project.org/):

1. **Add Sparkle to package.json**:
   ```json
   {
     "build": {
       "mac": {
         "target": ["dmg", "zip"]
       },
       "publish": {
         "provider": "generic",
         "url": "https://updates.streamvault.app"
       }
     }
   }
   ```

2. **Host update manifest**:
   ```xml
   <?xml version="1.0" encoding="utf-8"?>
   <rss version="2.0" xmlns:sparkle="http://www.andymatuschak.org/xml-namespaces/sparkle">
     <channel>
       <title>StreamVault Updates</title>
       <item>
         <title>Version 1.0.0</title>
         <pubDate>Thu, 01 Jan 2024 00:00:00 +0000</pubDate>
         <enclosure url="https://updates.streamvault.app/StreamVault-1.0.0.dmg"
                    sparkle:version="1"
                    sparkle:shortVersionString="1.0.0"
                    length="12345678"
                    type="application/octet-stream" />
       </item>
     </channel>
   </rss>
   ```

---

## 🏪 App Store Submission

To submit to the Mac App Store:

### Step 1: Prepare for App Store

Modify `macos/package.json`:

```json
{
  "build": {
    "mac": {
      "target": "mas",
      "category": "public.app-category.entertainment",
      "entitlements": "build/entitlements.mas.plist",
      "entitlementsInherit": "build/entitlements.masinherit.plist",
      "hardenedRuntime": false
    }
  }
}
```

### Step 2: Create App Store Entitlements

Create `macos/build/entitlements.mas.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>com.apple.security.app-sandbox</key>
    <true/>
    <key>com.apple.security.network.client</key>
    <true/>
    <key>com.apple.security.network.server</key>
    <true/>
    <key>com.apple.security.files.user-selected.read-write</key>
    <true/>
</dict>
</plist>
```

### Step 3: Build for App Store

```bash
cd macos
npm run build:mas
```

### Step 4: Validate with Transporter

1. Open **Transporter** app (from Xcode)
2. Drag the `.pkg` file into Transporter
3. Click **Validate**
4. Fix any issues reported

### Step 5: Submit to App Store Connect

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Create a new app
3. Fill in app information
4. Upload the validated package
5. Submit for review

---

## 🧪 Testing

### Test Locally

```bash
# Run without building
cd macos
npm run dev
```

### Test DMG Installation

```bash
# Mount the DMG
hdiutil attach release/StreamVault-1.0.0.dmg

# Copy to Applications
cp -R /Volumes/StreamVault/StreamVault.app /Applications/

# Unmount
hdiutil detach /Volumes/StreamVault

# Launch
open /Applications/StreamVault.app
```

### Test on Clean macOS

1. **Create a fresh VM**:
   ```bash
   # Using UTM or VirtualBox
   # Install fresh macOS
   ```

2. **Copy the DMG** to the VM

3. **Test installation** and all features

---

## 🐛 Common Issues

### Issue: "App is damaged"

**Solution**:
```bash
xattr -cr /Applications/StreamVault.app
```

### Issue: Code signing fails

**Solution**:
```bash
# Check certificate
security find-identity -v -p codesigning

# Should show your Developer ID certificate
```

### Issue: Notarization fails

**Solution**:
1. Check logs:
   ```bash
   xcrun notarytool log SUBMISSION_ID \
     --apple-id "your@email.com" \
     --team-id "YOUR_TEAM_ID" \
     --password "your-app-specific-password"
   ```

2. Fix issues and resubmit

### Issue: App won't launch

**Solution**:
```bash
# Check console logs
log show --predicate 'process == "StreamVault"' --last 5m

# Or check app logs
cat ~/Library/Logs/StreamVault/main.log
```

---

## 📊 Build Sizes

Typical build sizes:

- **App Bundle**: ~150 MB
- **DMG**: ~160 MB
- **ZIP**: ~140 MB

To reduce size:
1. Enable compression in electron-builder config
2. Remove unused dependencies
3. Use tree-shaking for web app

---

## 🔄 CI/CD with GitHub Actions

Create `.github/workflows/build-macos.yml`:

```yaml
name: Build macOS

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: macos-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm install
    
    - name: Build web app
      run: npm run build
    
    - name: Build macOS app
      run: |
        cd macos
        npm install
        npm run build
      env:
        GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    
    - name: Upload artifacts
      uses: actions/upload-artifact@v3
      with:
        name: macos-build
        path: macos/release/
    
    - name: Create Release
      uses: softprops/action-gh-release@v1
      if: startsWith(github.ref, 'refs/tags/')
      with:
        files: macos/release/*.dmg
```

---

## 📚 Additional Resources

- [Electron Documentation](https://www.electronjs.org/docs)
- [electron-builder Documentation](https://www.electron.build/)
- [Apple Code Signing Guide](https://developer.apple.com/library/archive/documentation/Security/Conceptual/CodeSigningGuide/Introduction/Introduction.html)
- [Apple Notarization Guide](https://developer.apple.com/documentation/security/notarizing_macos_software_before_distribution)

---

## 🎯 Next Steps

1. ✅ Build the app locally
2. ✅ Test on your Mac
3. ✅ Test on a clean macOS VM
4. ⏳ Get Apple Developer certificate (optional)
5. ⏳ Sign and notarize (optional)
6. ⏳ Distribute via GitHub Releases
7. ⏳ Submit to Mac App Store (optional)

---

**Need help?** Open an issue on [GitHub](https://github.com/yourusername/streamvault/issues)
