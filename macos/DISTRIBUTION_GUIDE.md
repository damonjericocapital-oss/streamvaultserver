# 📦 StreamVault macOS Distribution Guide

This guide covers all methods to distribute StreamVault to macOS users.

## 🎯 Distribution Methods

### 1. Direct Download (Recommended for Most Users)

**Best for**: Personal projects, open source, small teams

#### Steps:

1. **Build the app**:
   ```bash
   ./macos/build-macos.sh
   ```

2. **Upload to GitHub Releases**:
   ```bash
   # Install GitHub CLI
   brew install gh
   
   # Create release
   gh release create v1.0.0 \
     --title "StreamVault v1.0.0" \
     --notes "Initial release" \
     macos/release/StreamVault-1.0.0.dmg
   ```

3. **Provide download link**:
   ```markdown
   ## Download for macOS
   
   [Download StreamVault-1.0.0.dmg](https://github.com/yourusername/streamvault/releases/download/v1.0.0/StreamVault-1.0.0.dmg)
   
   **SHA256**: `abc123...` (for verification)
   ```

4. **Include installation instructions**:
   ```markdown
   ### Installation
   
   1. Download the DMG file
   2. Double-click to mount
   3. Drag StreamVault to Applications
   4. Launch from Applications
   ```

**Pros**:
- ✅ Free
- ✅ Easy to set up
- ✅ Automatic updates via GitHub
- ✅ No Apple Developer account needed

**Cons**:
- ❌ Users see "unidentified developer" warning
- ❌ Manual installation required

---

### 2. Homebrew Cask

**Best for**: Developer audience, tech-savvy users

#### Steps:

1. **Create a cask repository**:
   ```bash
   # Create repo
   mkdir homebrew-streamvault
   cd homebrew-streamvault
   
   # Initialize git
   git init
   ```

2. **Create Casks/streamvault.rb**:
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
       "~/Library/Caches/com.streamvault.app",
     ]
   end
   ```

3. **Calculate SHA256**:
   ```bash
   shasum -a 256 macos/release/StreamVault-1.0.0.dmg
   ```

4. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Add StreamVault cask"
   git remote add origin https://github.com/yourusername/homebrew-streamvault.git
   git push -u origin main
   ```

5. **Users install with**:
   ```bash
   brew tap yourusername/streamvault
   brew install --cask streamvault
   ```

**Pros**:
- ✅ One-command installation
- ✅ Easy updates (`brew upgrade`)
- ✅ Familiar to developers
- ✅ Free

**Cons**:
- ❌ Limited to technical users
- ❌ Still shows "unidentified developer" warning

---

### 3. Signed & Notarized DMG

**Best for**: Professional distribution, business users

#### Requirements:
- Apple Developer Account ($99/year)

#### Steps:

1. **Get certificates**:
   - Developer ID Application
   - Developer ID Installer

2. **Build with signing**:
   ```bash
   cd macos
   
   export APPLE_ID="your@email.com"
   export APPLE_TEAM_ID="YOUR_TEAM_ID"
   export APPLE_ID_PASSWORD="app-specific-password"
   
   npm run build
   ```

3. **Notarize**:
   ```bash
   cd release
   
   # Create zip
   ditto -c -k --keepParent StreamVault.app StreamVault.zip
   
   # Submit for notarization
   xcrun notarytool submit StreamVault.zip \
     --apple-id "$APPLE_ID" \
     --team-id "$APPLE_TEAM_ID" \
     --password "$APPLE_ID_PASSWORD" \
     --wait
   
   # Staple ticket
   xcrun stapler staple StreamVault.app
   ```

4. **Rebuild DMG**:
   ```bash
   cd ..
   npm run build:dmg
   ```

5. **Distribute**:
   - Upload to your website
   - Use CDN for fast downloads
   - Provide direct download link

**Pros**:
- ✅ No security warnings
- ✅ Professional appearance
- ✅ Automatic Gatekeeper approval
- ✅ Builds trust with users

**Cons**:
- ❌ Requires Apple Developer account ($99/year)
- ❌ More complex setup

---

### 4. Mac App Store

**Best for**: Maximum reach, consumer audience

#### Requirements:
- Apple Developer Account ($99/year)
- App Store Connect account
- App review approval

#### Steps:

1. **Prepare for App Store**:
   - Remove any non-App Store compatible code
   - Use App Store sandbox entitlements
   - Ensure all features work in sandbox

2. **Build for App Store**:
   ```bash
   cd macos
   npm run build:mas
   ```

3. **Create App Store listing**:
   - Go to [App Store Connect](https://appstoreconnect.apple.com)
   - Create new app
   - Fill in metadata:
     - Name, subtitle, description
     - Screenshots (1280x800, 1440x900)
     - App icon (1024x1024)
     - Keywords, category
     - Privacy policy URL

4. **Upload package**:
   ```bash
   # Use Transporter app
   open -a Transporter
   
   # Drag .pkg file into Transporter
   # Click Upload
   ```

5. **Submit for review**:
   - Fill in review notes
   - Provide test account if needed
   - Submit for review

6. **Wait for approval** (1-7 days)

**Pros**:
- ✅ Maximum visibility
- ✅ Automatic updates
- ✅ Trusted by users
- ✅ Revenue sharing (70/30)

**Cons**:
- ❌ 30% revenue cut
- ❌ Strict review process
- ❌ Sandbox limitations
- ❌ Slower update cycle

---

### 5. Installer Package (.pkg)

**Best for**: Enterprise deployment, IT admins

#### Steps:

1. **Create installer script**:
   ```bash
   #!/bin/bash
   
   # Pre-install
   echo "Installing StreamVault..."
   
   # Copy app
   cp -R "$PACKAGE_PATH/StreamVault.app" "/Applications/"
   
   # Set permissions
   chmod -R 755 "/Applications/StreamVault.app"
   
   # Post-install
   echo "Installation complete!"
   ```

2. **Build package**:
   ```bash
   pkgbuild \
     --root macos/release/mac/StreamVault.app \
     --identifier com.streamvault.app \
     --version 1.0.0 \
     --install-location /Applications \
     --scripts scripts \
     StreamVault-1.0.0.pkg
   ```

3. **Sign package** (optional):
   ```bash
   productsign --sign "Developer ID Installer" \
     StreamVault-1.0.0.pkg \
     StreamVault-1.0.0-signed.pkg
   ```

4. **Distribute**:
   - Direct download
   - MDM (Mobile Device Management)
   - ARD (Apple Remote Desktop)

**Pros**:
- ✅ Silent installation
- ✅ Enterprise-friendly
- ✅ Can install to multiple Macs
- ✅ Customizable installation

**Cons**:
- ❌ More complex to create
- ❌ Requires admin privileges
- ❌ Less user-friendly

---

## 📊 Comparison Table

| Method | Cost | Ease | Reach | Updates | Warnings |
|--------|------|------|-------|---------|----------|
| Direct Download | Free | Easy | Medium | Manual | Yes |
| Homebrew | Free | Easy | Low | Automatic | Yes |
| Signed DMG | $99/yr | Medium | High | Manual | No |
| App Store | $99/yr + 30% | Hard | Maximum | Automatic | No |
| Installer Package | Free | Hard | Low | Manual | No |

---

## 🚀 Recommended Strategy

### For Open Source / Personal Projects

1. **Primary**: Direct download via GitHub Releases
2. **Secondary**: Homebrew cask for developers
3. **Optional**: Signed DMG if you get Apple Developer account

### For Commercial Products

1. **Primary**: Signed & notarized DMG from your website
2. **Secondary**: Mac App Store for maximum reach
3. **Optional**: Enterprise installer for business customers

### For Enterprise / Business

1. **Primary**: Installer package with MDM support
2. **Secondary**: Signed DMG for individual users
3. **Optional**: App Store for consumer market

---

## 📝 Distribution Checklist

### Before Release

- [ ] Test on clean macOS installation
- [ ] Test on both Intel and Apple Silicon
- [ ] Verify all features work
- [ ] Check app size (< 200MB ideal)
- [ ] Create release notes
- [ ] Update version number
- [ ] Generate SHA256 checksums

### For Signed Distribution

- [ ] Apple Developer account active
- [ ] Certificates installed
- [ ] App signed successfully
- [ ] Notarization submitted
- [ ] Notarization approved
- [ ] Ticket stapled
- [ ] Tested on clean macOS

### For App Store

- [ ] App Store Connect account
- [ ] App metadata complete
- [ ] Screenshots uploaded
- [ ] Privacy policy URL
- [ ] Support URL
- [ ] Test account (if needed)
- [ ] Review notes prepared
- [ ] Submitted for review

### After Release

- [ ] Announce on social media
- [ ] Update website
- [ ] Update documentation
- [ ] Monitor for issues
- [ ] Respond to user feedback
- [ ] Plan next update

---

## 🔄 Update Strategies

### Manual Updates (Direct Download)

```javascript
// In main.js
const { dialog } = require('electron');
const { autoUpdater } = require('electron-updater');

autoUpdater.setFeedURL({
  provider: 'generic',
  url: 'https://updates.streamvault.app'
});

autoUpdater.checkForUpdates();

autoUpdater.on('update-available', () => {
  dialog.showMessageBox({
    type: 'info',
    title: 'Update Available',
    message: 'A new version is available. Download now?',
    buttons: ['Download', 'Later']
  }).then(result => {
    if (result.response === 0) {
      shell.openExternal('https://streamvault.app/download');
    }
  });
});
```

### Automatic Updates (App Store)

- Handled automatically by macOS
- Users get notifications
- No code required

### Sparkle Framework (Signed DMG)

```javascript
// Add to package.json
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

---

## 📈 Analytics & Tracking

### Track Downloads

```javascript
// Simple analytics
fetch('https://analytics.streamvault.app/download', {
  method: 'POST',
  body: JSON.stringify({
    version: app.getVersion(),
    platform: process.platform,
    arch: process.arch,
    timestamp: new Date().toISOString()
  })
});
```

### Track Usage (Optional)

```javascript
// Respect user privacy
if (userOptedIn) {
  // Send anonymous usage data
}
```

---

## 🎯 Success Metrics

Track these metrics:

1. **Downloads**: Total downloads per day/week
2. **Active users**: Daily/weekly active users
3. **Retention**: Users who return after 7/30 days
4. **Crash rate**: Percentage of sessions that crash
5. **Update adoption**: % of users on latest version

---

## 📞 Support

For distribution questions:
- Email: support@streamvault.app
- GitHub: [Issues](https://github.com/yourusername/streamvault/issues)
- Docs: [docs.streamvault.app](https://docs.streamvault.app)

---

**Ready to distribute?** Start with direct download via GitHub Releases, then expand to other methods as your user base grows!
