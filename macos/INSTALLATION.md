# 📥 StreamVault macOS Installation Guide

This guide walks you through installing StreamVault on your Mac.

## 🎯 Quick Install (3 Steps)

### Step 1: Download

Download the latest version:
- [StreamVault-1.0.0.dmg](https://github.com/yourusername/streamvault/releases/download/v1.0.0/StreamVault-1.0.0.dmg)

Or build from source:
```bash
git clone https://github.com/yourusername/streamvault.git
cd streamvault
./macos/build-macos.sh
```

### Step 2: Install

**Option A: Drag & Drop**
1. Double-click the downloaded `.dmg` file
2. Drag `StreamVault.app` to your Applications folder
3. Eject the DMG (right-click → Eject)

**Option B: Automated Script**
```bash
# After mounting the DMG
./install.sh
```

### Step 3: Launch

- Open from Applications folder
- Or use Spotlight: `Cmd+Space` → type "StreamVault" → Enter

---

## 🔐 First Launch Security

macOS may show a security warning on first launch. Here's how to handle it:

### Warning: "StreamVault" cannot be opened because the developer cannot be verified

**Solution 1: Right-Click Method** (Recommended)
1. Right-click (or Control-click) on StreamVault.app
2. Select "Open" from the context menu
3. Click "Open" in the security dialog
4. The app will now launch normally

**Solution 2: System Preferences**
1. Try to open StreamVault (it will be blocked)
2. Go to System Preferences → Security & Privacy → General
3. Click "Open Anyway" for StreamVault
4. Enter your password to confirm
5. Click "Open"

**Solution 3: Remove Quarantine** (Advanced)
```bash
xattr -cr /Applications/StreamVault.app
```

---

## 🎮 Initial Setup

### First Launch

1. **Grant Permissions** (when prompted):
   - ✅ Network access (for streaming to devices)
   - ✅ File access (to access your media library)
   - ⚪ Microphone (optional - for voice chat)
   - ⚪ Camera (optional - for video features)

2. **Setup Wizard**:
   - Choose your media folders
   - Configure download location
   - Set up local network access
   - Create your profile

3. **Explore**:
   - Press `?` to see keyboard shortcuts
   - Open Preferences (Cmd+,) to customize
   - Check the Help menu for documentation

### Recommended First Steps

1. **Add Media Folders**:
   - Preferences → Library → Add Folder
   - Select your Movies, TV Shows, Music folders

2. **Configure Downloads**:
   - Preferences → Downloads → Set save location
   - Set speed limits if needed

3. **Enable AI Features**:
   - Preferences → AI → Enable NEXUS AI
   - Configure auto-optimization

4. **Connect Devices**:
   - Preferences → Network → Scan for devices
   - Connect to Smart TVs, speakers, etc.

---

## 📱 Access from Other Devices

### Find Your Mac's IP Address

```bash
# WiFi
ipconfig getifaddr en0

# Ethernet
ipconfig getifaddr en1
```

Your IP will be something like: `192.168.1.100`

### Access from Other Devices

1. **Open browser** on phone/tablet/TV
2. **Navigate to**: `http://YOUR_MAC_IP:3000`
   - Example: `http://192.168.1.100:3000`
3. **Bookmark** for easy access

### Install as App (Mobile)

**iPhone/iPad**:
1. Open Safari → `http://YOUR_MAC_IP:3000`
2. Tap Share button (square with arrow)
3. Tap "Add to Home Screen"
4. Name it "StreamVault" → Add

**Android**:
1. Open Chrome → `http://YOUR_MAC_IP:3000`
2. Tap menu (⋮) → "Add to Home screen"
3. Confirm installation

---

## ⚙️ Configuration

### Preferences (Cmd+,)

**General**:
- Auto-start on login
- Theme (Dark/Light/System)
- Notifications
- Language

**Library**:
- Media folders
- Auto-scan interval
- File types to include
- Exclude patterns

**Downloads**:
- Default save location
- Speed limits
- Max concurrent downloads
- Auto-delete completed

**Streaming**:
- Max quality
- Hardware acceleration
- Buffer size
- Transcoding settings

**Network**:
- Port number
- DLNA settings
- Device discovery
- Remote access

**AI**:
- Enable NEXUS AI
- Auto-optimization
- Recommendations
- Privacy settings

### Data Locations

StreamVault stores data in:
```
~/Library/Application Support/StreamVault/
├── config.json          # Your settings
├── database/            # Media library database
├── cache/               # Temporary files
└── logs/                # Application logs
```

---

## 🔄 Updating

### Check for Updates

1. Click menu bar icon (if enabled)
2. Select "Check for Updates"
3. Follow prompts to download and install

### Manual Update

1. Download latest DMG
2. Quit StreamVault (Cmd+Q)
3. Delete old app from Applications
4. Install new version

### Automatic Updates

StreamVault checks for updates automatically and notifies you when a new version is available.

---

## 🐛 Troubleshooting

### App Won't Open

**Issue**: "StreamVault is damaged and can't be opened"

**Solution**:
```bash
xattr -cr /Applications/StreamVault.app
```

**Issue**: App crashes on launch

**Solution**:
```bash
# Check logs
cat ~/Library/Logs/StreamVault/main.log

# Reset app
rm -rf ~/Library/Application\ Support/StreamVault

# Restart app
open /Applications/StreamVault.app
```

### Network Issues

**Issue**: Can't access from other devices

**Solutions**:
1. Check firewall:
   - System Preferences → Security & Privacy → Firewall
   - Allow incoming connections for StreamVault

2. Verify server is running:
   - Check menu bar icon
   - Look for "Server Online" status

3. Test locally:
   ```bash
   curl http://localhost:3000
   ```

**Issue**: Slow streaming

**Solutions**:
1. Enable hardware acceleration:
   - Preferences → Streaming → Hardware Acceleration

2. Reduce quality:
   - Preferences → Streaming → Max Quality

3. Check network:
   - Ensure strong WiFi signal
   - Use Ethernet for server if possible

### Media Not Showing

**Issue**: Movies/TV shows not appearing

**Solutions**:
1. Rescan library:
   - File → Rescan Media Library

2. Check permissions:
   - System Preferences → Security & Privacy → Files and Folders
   - Ensure StreamVault has access

3. Verify folder paths:
   - Preferences → Library → Check folder paths

4. Check file formats:
   - Supported: MP4, MKV, AVI, MOV, MP3, FLAC
   - Check Preferences → Library → File Types

### Database Issues

**Issue**: Database corrupted

**Solution**:
```bash
# Backup config
cp ~/Library/Application\ Support/StreamVault/config.json ~/config.backup

# Delete database
rm -rf ~/Library/Application\ Support/StreamVault/database

# Restart app (will rebuild database)
open /Applications/StreamVault.app
```

### Performance Issues

**Issue**: High CPU usage

**Solutions**:
1. Check active streams:
   - Reduce concurrent streams
   - Lower quality settings

2. Disable unused features:
   - Preferences → Disable AI if not needed
   - Turn off auto-scan

3. Restart app:
   ```bash
   # Quit
   Cmd+Q
   
   # Clear cache
   rm -rf ~/Library/Caches/com.streamvault.app
   
   # Restart
   open /Applications/StreamVault.app
   ```

---

## 🗑️ Uninstallation

### Complete Uninstall

```bash
# 1. Quit StreamVault
Cmd+Q

# 2. Remove app
rm -rf /Applications/StreamVault.app

# 3. Remove data
rm -rf ~/Library/Application\ Support/StreamVault
rm -rf ~/Library/Caches/com.streamvault.app
rm -rf ~/Library/Preferences/com.streamvault.app.plist
rm -rf ~/Library/Logs/StreamVault

# 4. Remove from Dock (if added)
# Right-click Dock icon → Options → Remove from Dock
```

### Keep Data (Reinstall Later)

```bash
# Only remove app, keep data
rm -rf /Applications/StreamVault.app

# Data remains in:
# ~/Library/Application Support/StreamVault/
```

---

## 📞 Support

### Getting Help

- **Documentation**: [docs.streamvault.app](https://docs.streamvault.app)
- **GitHub Issues**: [Report a bug](https://github.com/yourusername/streamvault/issues)
- **Discussions**: [Ask a question](https://github.com/yourusername/streamvault/discussions)
- **Email**: support@streamvault.app

### Providing Information

When reporting issues, include:
- macOS version (System Preferences → About)
- StreamVault version (StreamVault → About)
- Steps to reproduce
- Error messages (from logs)
- Screenshots if applicable

### Log Files

```bash
# Main log
cat ~/Library/Logs/StreamVault/main.log

# Crash reports
ls ~/Library/Logs/DiagnosticReports/ | grep StreamVault
```

---

## 🎓 Tips & Tricks

### Productivity Tips

1. **Use keyboard shortcuts**:
   - Press `?` to see all shortcuts
   - Cmd+1-4 for quick navigation
   - Space for play/pause

2. **Add to Dock**:
   - Drag StreamVault.app to Dock
   - Right-click → Options → Keep in Dock

3. **Use Spotlight**:
   - Cmd+Space → "StreamVault" → Enter
   - Faster than navigating to Applications

4. **Multiple windows**:
   - Cmd+N to open new window
   - Useful for browsing and streaming simultaneously

### Performance Tips

1. **Enable hardware acceleration**:
   - Preferences → Streaming → Hardware Acceleration
   - Reduces CPU usage significantly

2. **Limit concurrent downloads**:
   - Preferences → Downloads → Max Concurrent
   - Prevents system slowdown

3. **Use Ethernet for server**:
   - More stable than WiFi
   - Better for streaming

4. **Regular maintenance**:
   - Clear cache periodically
   - Rescan library monthly
   - Check for updates

### Network Tips

1. **Set static IP**:
   - Prevents URL from changing
   - Router settings → DHCP Reservation

2. **Use local DNS**:
   - http://streamvault.local (if supported)
   - Easier to remember than IP

3. **Port forwarding**:
   - Only if accessing from outside network
   - Forward port 3000 to your Mac

4. **Firewall rules**:
   - Allow StreamVault through firewall
   - System Preferences → Security → Firewall

---

## ✅ Installation Checklist

After installation, verify:

- [ ] App launches without errors
- [ ] Permissions granted (network, files)
- [ ] Media folders configured
- [ ] Can access from other devices
- [ ] Keyboard shortcuts work
- [ ] Preferences save correctly
- [ ] Downloads work
- [ ] Streaming works
- [ ] AI features enabled (optional)

---

## 🎉 You're All Set!

StreamVault is now installed and ready to use!

**Next steps**:
1. Add your media folders
2. Configure preferences
3. Connect your devices
4. Start streaming!

**Need help?** Check the [README](./README.md) or [BUILD_GUIDE](./BUILD_GUIDE.md)

---

**Enjoy StreamVault!** 🎬✨
