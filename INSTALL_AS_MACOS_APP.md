# 🍎 Install StreamVault as a macOS App (30 Seconds)

Your StreamVault is already built! Here's how to install it as a real macOS app.

---

## Method 1: Safari "Add to Dock" (Best - Native Feel)

This creates a real app icon in your Dock that opens StreamVault in its own window, like a native app.

### Steps:

1. **Open Safari** (must be Safari, not Chrome)

2. **Navigate to your StreamVault URL**:
   ```
   https://your-streamvault-url.com
   ```
   Or if running locally:
   ```
   http://localhost:3000
   ```

3. **Click Share button** (square with arrow ↑) in the Safari toolbar

4. **Click "Add to Dock..."**

5. **Name it**: `StreamVault`

6. **Click "Add"**

✅ **Done!** StreamVault now appears in your Dock like a native app!

### What You Get:
- 🎯 App icon in Dock
- 🪟 Opens in its own window (no browser chrome)
- ⌨️ Full keyboard shortcut support
- 🔔 Native macOS notifications
- 📴 Works offline (PWA)
- 🚀 Launches instantly

---

## Method 2: Chrome "Install as App"

1. **Open Chrome**

2. **Navigate to your StreamVault URL**

3. **Click the Install icon** (⊕) in the address bar
   - Or: Menu (⋮) → "Cast, save, and share" → "Install page as app..."

4. **Click "Install"**

✅ StreamVault is now installed as a Chrome app!

---

## Method 3: Create a Standalone .app (Advanced)

If you want a real `.app` bundle you can share:

### Step 1: Create the app structure
```bash
# Open Terminal and run these commands:

mkdir -p ~/Desktop/StreamVault.app/Contents/MacOS
mkdir -p ~/Desktop/StreamVault.app/Contents/Resources
```

### Step 2: Create the launcher script
```bash
cat > ~/Desktop/StreamVault.app/Contents/MacOS/StreamVault << 'EOF'
#!/bin/bash
open -a Safari "http://localhost:3000" --args -hiddenTitleBar -titlebarSeparator=none
EOF

chmod +x ~/Desktop/StreamVault.app/Contents/MacOS/StreamVault
```

### Step 3: Create Info.plist
```bash
cat > ~/Desktop/StreamVault.app/Contents/Info.plist << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleExecutable</key>
    <string>StreamVault</string>
    <key>CFBundleIdentifier</key>
    <string>com.streamvault.app</string>
    <key>CFBundleName</key>
    <string>StreamVault</string>
    <key>CFBundleVersion</key>
    <string>1.0.0</string>
</dict>
</plist>
EOF
```

### Step 4: Move to Applications
```bash
mv ~/Desktop/StreamVault.app /Applications/
```

✅ You now have a real `.app` in Applications!

---

## 🌐 How to Access Your StreamVault

### If it's running locally on your Mac:
```
http://localhost:3000
```

### If it's on another computer on your network:
```
http://YOUR_MAC_IP:3000
```

Find your IP:
```bash
ipconfig getifaddr en0
```

### If it's deployed online:
```
https://your-domain.com
```

---

## 📱 Install on iPhone/iPad Too!

1. Open Safari on iOS
2. Go to your StreamVault URL
3. Tap Share (↑)
4. Tap "Add to Home Screen"
5. Name it "StreamVault"
6. Tap "Add"

✅ Now it's an app on your phone too!

---

## 🎯 The Easiest Path

**Just use Method 1 (Safari Add to Dock).** It takes 30 seconds and gives you a native-feeling app with:
- Dock icon
- Own window
- Offline support
- Notifications
- No build process needed

---

## 🚀 Want to Share With Others?

### Option A: Share the URL
Just send people your StreamVault URL. They can install it themselves using the steps above.

### Option B: Deploy to the Web
Deploy your StreamVault to a free hosting service:

**Vercel (Recommended - Free)**:
```bash
npm i -g vercel
vercel login
vercel --prod
```

**Netlify (Free)**:
```bash
npm i -g netlify-cli
netlify login
netlify deploy --prod --dir=dist
```

**GitHub Pages (Free)**:
```bash
# Push to GitHub, then enable Pages in repo settings
```

Then share the URL with anyone!

---

## ❓ FAQ

**Q: Does it work offline?**
A: Yes! The PWA caches everything. Once loaded, it works without internet.

**Q: Can I use it on multiple devices?**
A: Yes! Install on Mac, iPhone, iPad, Android - any device with a browser.

**Q: Is it a "real" app?**
A: Yes! Modern macOS apps ARE web apps. Spotify, Discord, Slack - they all work this way.

**Q: Will it get updates?**
A: Yes! When you update the web app, all installed PWAs update automatically.

**Q: Can I share the .app file?**
A: Use Method 3 to create a shareable .app bundle, or just share the URL.

---

## 🎉 That's It!

Your StreamVault is ready to use as a macOS app. No complex build process needed!

**Quick recap:**
1. Open Safari → Your URL → Share → Add to Dock
2. Done! 🎊
