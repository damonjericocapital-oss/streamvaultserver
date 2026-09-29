# 🍎 StreamVault macOS Distribution - Complete Package

## 📦 What's Included

This package contains everything you need to build and distribute StreamVault as a native macOS application.

### Files Structure

```
macos/
├── package.json              # Electron app configuration
├── main.js                   # Electron main process
├── preload.js                # Secure IPC bridge
├── build/
│   ├── Info.plist           # macOS app metadata
│   └── entitlements.mac.plist  # App permissions
├── build-macos.sh           # One-command build script
├── install.sh               # Automated installer
├── README.md                # User documentation
├── BUILD_GUIDE.md          # Developer build guide
└── DISTRIBUTION_GUIDE.md   # Distribution methods
```

---

## 🚀 Quick Start

### For Users (Download & Install)

1. **Download** the latest release:
   - [StreamVault-1.0.0.dmg](./release/StreamVault-1.0.0.dmg)

2. **Install**:
   ```bash
   # Double-click the DMG, then:
   # Option 1: Drag to Applications
   # Option 2: Run installer script
   ./install.sh
   ```

3. **Launch**:
   - Open from Applications folder
   - Or use Spotlight (Cmd+Space) → "StreamVault"

### For Developers (Build from Source)

```bash
# From project root
./macos/build-macos.sh

# Output: macos/release/StreamVault-1.0.0.dmg
```

---

## 🎯 Features

### Native macOS Experience

- ✅ **Native Menu Bar** - Full macOS menu integration
- ✅ **Keyboard Shortcuts** - Cmd+N, Cmd+Q, etc.
- ✅ **Window Management** - Resize, minimize, fullscreen
- ✅ **Dark Mode** - Automatic theme detection
- ✅ **Retina Display** - High-DPI support
- ✅ **Apple Silicon** - Native M1/M2/M3 support
- ✅ **Universal Binary** - Works on Intel & Apple Silicon

### macOS-Specific Features

- 🎬 **Media Keys** - Play/pause with keyboard media keys
- 🔔 **Notifications** - Native macOS notifications
- 🎤 **Microphone** - Voice chat support
- 📹 **Camera** - Video features support
- 🌐 **Local Network** - DLNA & device discovery
- 💾 **File Associations** - Open .torrent files directly
- 🔗 **URL Schemes** - streamvault:// and magnet:// links

---

## 📋 System Requirements

### Minimum
- **macOS**: 10.15 (Catalina) or later
- **RAM**: 4GB
- **Storage**: 500MB + media library
- **CPU**: Intel Core i3 or Apple M1

### Recommended
- **macOS**: 13+ (Ventura)
- **RAM**: 8GB+
- **Storage**: 1GB+ SSD
- **CPU**: Intel Core i5 or Apple M1 Pro

---

## 🔧 Installation Methods

### Method 1: DMG Installer (Recommended)

```bash
# 1. Download DMG
# 2. Double-click to mount
# 3. Drag to Applications
# 4. Launch from Applications
```

**Pros**: Simple, familiar to Mac users
**Cons**: Manual installation

### Method 2: Homebrew

```bash
brew tap yourusername/streamvault
brew install --cask streamvault
```

**Pros**: One command, easy updates
**Cons**: For technical users only

### Method 3: Automated Script

```bash
# After mounting DMG
./install.sh
```

**Pros**: Handles everything automatically
**Cons**: Requires terminal

---

## 🎮 Usage

### First Launch

1. **Open StreamVault** from Applications
2. **Grant permissions** when prompted:
   - Network access (for streaming)
   - File access (for media library)
   - Microphone (optional, for voice chat)

3. **Follow setup wizard**:
   - Choose media folders
   - Configure preferences
   - Connect to local network

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd+,` | Preferences |
| `Cmd+N` | New Window |
| `Cmd+O` | Add Torrent |
| `Cmd+1` | Home |
| `Cmd+2` | Movies |
| `Cmd+3` | TV Shows |
| `Cmd+4` | Torrents |
| `Space` | Play/Pause |
| `Cmd+.` | Stop |
| `Cmd+→` | Next |
| `Cmd+←` | Previous |
| `Cmd+↑` | Volume Up |
| `Cmd+↓` | Volume Down |
| `Cmd+M` | Mute |
| `Cmd+?` | Help |

### Menu Bar

- **StreamVault**: About, Preferences, Quit
- **File**: New Window, Add Torrent
- **Edit**: Standard edit operations
- **View**: Navigation, Reload, Fullscreen
- **Playback**: Play, Stop, Next, Previous, Volume
- **Window**: Minimize, Zoom
- **Help**: Documentation, Shortcuts

---

## 🔐 Security & Privacy

### App Signing

**Unsigned Version** (GitHub Releases):
- Shows "unidentified developer" warning
- Right-click → Open to bypass
- Fully functional

**Signed Version** (App Store/Website):
- No warnings
- Automatic Gatekeeper approval
- Requires Apple Developer account

### Data Storage

All data stored locally:
```
~/Library/Application Support/StreamVault/
├── config.json       # Settings
├── database/         # Media library
├── cache/           # Temporary files
└── logs/            # App logs
```

### Permissions

StreamVault requests:
- ✅ **Network**: For streaming to devices
- ✅ **Files**: To access media library
- ⚪ **Microphone**: Voice chat (optional)
- ⚪ **Camera**: Video features (optional)

All permissions can be revoked in System Preferences.

---

## 🐛 Troubleshooting

### "App is damaged and can't be opened"

**Solution**:
```bash
xattr -cr /Applications/StreamVault.app
```

### "Cannot be opened because the developer cannot be verified"

**Solution**:
1. Right-click (Control-click) StreamVault.app
2. Select "Open"
3. Click "Open" in dialog

### App won't launch

**Check logs**:
```bash
cat ~/Library/Logs/StreamVault/main.log
```

**Reset app**:
```bash
rm -rf ~/Library/Application\ Support/StreamVault
```

### Network access issues

**Check firewall**:
1. System Preferences → Security & Privacy → Firewall
2. Allow incoming connections for StreamVault

**Test locally**:
```bash
curl http://localhost:3000
```

---

## 📊 Performance

### Typical Resource Usage

- **Memory**: 200-400 MB
- **CPU**: 1-5% (idle), 10-30% (streaming)
- **Disk**: Minimal (mostly cache)
- **Network**: Depends on streaming activity

### Optimization Tips

1. **Enable hardware acceleration**:
   - Preferences → Streaming → Hardware Acceleration

2. **Limit concurrent streams**:
   - Preferences → Streaming → Max Streams

3. **Reduce cache size**:
   - Preferences → Advanced → Cache Size

---

## 🔄 Updates

### Check for Updates

1. Click menu bar icon
2. Select "Check for Updates"
3. Follow prompts to download

### Manual Update

1. Download latest DMG
2. Quit StreamVault (Cmd+Q)
3. Delete old app from Applications
4. Install new version

### Automatic Updates

StreamVault checks for updates automatically and notifies you when a new version is available.

---

## 📦 Distribution Options

### 1. Direct Download (Free)
- Upload DMG to GitHub Releases
- Users download and install manually
- Shows security warning (can be bypassed)

**Best for**: Open source, personal projects

### 2. Signed & Notarized ($99/year)
- Apple Developer account required
- No security warnings
- Professional appearance

**Best for**: Commercial products, business users

### 3. Mac App Store ($99/year + 30%)
- Maximum reach
- Automatic updates
- Strict review process

**Best for**: Consumer market, maximum visibility

### 4. Homebrew Cask (Free)
- One-command installation
- Easy updates
- Developer audience

**Best for**: Technical users, developers

See [DISTRIBUTION_GUIDE.md](./DISTRIBUTION_GUIDE.md) for detailed instructions.

---

## 🛠️ Development

### Build from Source

```bash
# Prerequisites
- Node.js 18+
- Xcode Command Line Tools
- Git

# Clone and build
git clone https://github.com/yourusername/streamvault.git
cd streamvault
./macos/build-macos.sh
```

### Development Mode

```bash
# Terminal 1: Web app
npm run dev

# Terminal 2: Electron
cd macos
npm run dev
```

### Debugging

```bash
# View logs
cat ~/Library/Logs/StreamVault/main.log

# Open DevTools
Cmd+Option+I (in app)

# Check console
Console.app → Filter: StreamVault
```

---

## 📚 Documentation

### User Documentation
- [README.md](./README.md) - User guide
- [INSTALLATION.md](./INSTALLATION.md) - Installation instructions

### Developer Documentation
- [BUILD_GUIDE.md](./BUILD_GUIDE.md) - Build from source
- [DISTRIBUTION_GUIDE.md](./DISTRIBUTION_GUIDE.md) - Distribution methods

### Project Documentation
- [../README.md](../README.md) - Main project README
- [../docs/](../docs/) - Full documentation

---

## 🤝 Contributing

Contributions welcome! See [../CONTRIBUTING.md](../CONTRIBUTING.md)

### Development Setup

```bash
# Clone
git clone https://github.com/yourusername/streamvault.git
cd streamvault

# Install dependencies
npm install

# Start development
npm run dev
```

---

## 📞 Support

### Getting Help

- **Documentation**: [docs.streamvault.app](https://docs.streamvault.app)
- **Issues**: [GitHub Issues](https://github.com/yourusername/streamvault/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/streamvault/discussions)
- **Email**: support@streamvault.app

### Reporting Issues

When reporting issues, include:
- macOS version (System Preferences → About)
- StreamVault version (StreamVault → About)
- Steps to reproduce
- Error messages (from logs)
- Screenshots if applicable

---

## 🗺️ Roadmap

### Coming Soon

- [ ] Menu bar quick access
- [ ] Touch Bar support (MacBook Pro)
- [ ] Handoff with iOS app
- [ ] Siri Shortcuts integration
- [ ] AirPlay receiver mode
- [ ] Widget for Notification Center
- [ ] Quick Actions integration
- [ ] Automator support

### Under Consideration

- [ ] Apple Watch companion app
- [ ] CarPlay integration
- [ ] HomeKit support
- [ ] Continuity Camera support

---

## 📄 License

MIT License - see [../LICENSE](../LICENSE)

---

## 🙏 Acknowledgments

- **Electron** - Cross-platform desktop apps
- **React** - UI framework
- **Framer Motion** - Animations
- **Lucide** - Icons
- **Apple** - macOS platform

---

## 🎉 Get Started

### For Users

1. **Download**: [StreamVault-1.0.0.dmg](./release/StreamVault-1.0.0.dmg)
2. **Install**: Drag to Applications
3. **Launch**: Open from Applications
4. **Enjoy**: Start streaming!

### For Developers

```bash
# Build
./macos/build-macos.sh

# Run
cd macos
npm run dev
```

---

**Made with ❤️ for macOS**

© 2024 StreamVault. All rights reserved.

---

## 📊 Quick Reference

### File Locations

| Item | Location |
|------|----------|
| App | `/Applications/StreamVault.app` |
| Config | `~/Library/Application Support/StreamVault/config.json` |
| Database | `~/Library/Application Support/StreamVault/database/` |
| Cache | `~/Library/Caches/com.streamvault.app/` |
| Logs | `~/Library/Logs/StreamVault/` |
| Preferences | `~/Library/Preferences/com.streamvault.app.plist` |

### Useful Commands

```bash
# Open app
open /Applications/StreamVault.app

# View logs
tail -f ~/Library/Logs/StreamVault/main.log

# Reset app
rm -rf ~/Library/Application\ Support/StreamVault

# Check signature
codesign -vvv /Applications/StreamVault.app

# Remove quarantine
xattr -cr /Applications/StreamVault.app
```

### Environment Variables

```bash
# Development
NODE_ENV=development npm run dev

# Custom port
PORT=8080 npm run dev

# Debug mode
DEBUG=true npm run dev
```

---

**Need help?** Check the [BUILD_GUIDE.md](./BUILD_GUIDE.md) or open an [issue](https://github.com/yourusername/streamvault/issues).
