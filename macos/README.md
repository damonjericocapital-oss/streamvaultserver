# StreamVault for macOS

Native macOS desktop application for StreamVault - the ultimate streaming server.

![StreamVault](https://img.shields.io/badge/version-1.0.0-blue)
![macOS](https://img.shields.io/badge/macOS-10.15+-silver)
![License](https://img.shields.io/badge/license-MIT-green)

## 🎯 Features

- 🎬 **Native macOS App** - Built with Electron for optimal performance
- 🌐 **Local Network Streaming** - Stream to any device on your network
- 🧠 **AI-Powered** - Smart recommendations and auto-optimization
- 📱 **Multi-Platform** - Works with iOS, Android, Smart TVs, and more
- 🔒 **Secure** - Local-first architecture with optional cloud sync
- ⚡ **Fast** - Hardware-accelerated video playback

## 📋 Requirements

- **macOS**: 10.15 (Catalina) or later
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 500MB for app + your media library
- **Network**: Local network access for streaming features

## 🚀 Quick Start

### Option 1: Download Pre-built App (Recommended)

1. Download the latest release:
   - [StreamVault-1.0.0.dmg](./release/StreamVault-1.0.0.dmg) (Universal - Intel & Apple Silicon)

2. Install:
   - Double-click the `.dmg` file
   - Drag StreamVault to your Applications folder
   - Launch from Applications or Spotlight (Cmd+Space)

3. First Launch:
   - macOS may show a security warning - click "Open"
   - Grant necessary permissions when prompted
   - Follow the setup wizard

### Option 2: Build from Source

```bash
# Clone the repository
git clone https://github.com/yourusername/streamvault.git
cd streamvault

# Install dependencies
npm install

# Build for macOS
./macos/build-macos.sh

# The app will be in macos/release/
```

## 📦 Installation

### From DMG

1. **Download** the `.dmg` file
2. **Open** the DMG by double-clicking
3. **Drag** StreamVault.app to Applications folder
4. **Eject** the DMG (right-click → Eject)
5. **Launch** StreamVault from Applications

### First Launch Security

macOS Gatekeeper may block the app on first launch:

1. **Right-click** (or Control-click) StreamVault.app
2. Select **"Open"** from the context menu
3. Click **"Open"** in the security dialog
4. The app will now launch normally

Alternatively, allow in System Preferences:
1. Go to **System Preferences → Security & Privacy → General**
2. Click **"Open Anyway"** for StreamVault
3. Enter your password to confirm

## 🎮 Usage

### Basic Navigation

- **Home** (Cmd+1) - Browse your media library
- **Movies** (Cmd+2) - View all movies
- **TV Shows** (Cmd+3) - View all TV shows
- **Torrents** (Cmd+4) - Manage downloads

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd+,` | Open Preferences |
| `Cmd+N` | New Window |
| `Cmd+O` | Add Torrent |
| `Space` | Play/Pause |
| `Cmd+.` | Stop |
| `Cmd+→` | Next |
| `Cmd+←` | Previous |
| `Cmd+↑` | Volume Up |
| `Cmd+↓` | Volume Down |
| `Cmd+M` | Mute |
| `Cmd+/` | Show Shortcuts |

### Local Network Access

Access StreamVault from other devices on your network:

1. **Find your Mac's IP**:
   ```bash
   ipconfig getifaddr en0  # WiFi
   # or
   ipconfig getifaddr en1  # Ethernet
   ```

2. **Access from other devices**:
   - Open browser on phone/tablet/TV
   - Navigate to `http://YOUR_MAC_IP:3000`
   - Example: `http://192.168.1.100:3000`

3. **Install as PWA** (mobile):
   - iOS Safari: Share → Add to Home Screen
   - Android Chrome: Menu → Install app

## 🔧 Configuration

### Preferences (Cmd+,)

- **General**: Auto-start, theme, notifications
- **Downloads**: Default save location, speed limits
- **Streaming**: Quality settings, transcoding
- **Network**: Port configuration, DLNA settings
- **AI**: NEXUS AI preferences

### Data Storage

StreamVault stores data in:
```
~/Library/Application Support/StreamVault/
├── config.json          # App configuration
├── database/            # Media library database
├── cache/              # Temporary files
└── logs/               # Application logs
```

### Media Library

Default media locations:
```
~/Movies/               # Movies
~/TV Shows/             # TV Shows
~/Music/                # Music
~/Downloads/            # Downloads
```

## 🛠️ Development

### Prerequisites

- Node.js 18+ and npm
- Xcode Command Line Tools
- Git

### Setup Development Environment

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# In another terminal, start Electron
cd macos
npm install
npm run dev
```

### Build for Distribution

```bash
# Build universal app (Intel + Apple Silicon)
./macos/build-macos.sh

# Build for specific architecture
cd macos
npm run build -- --x64    # Intel only
npm run build -- --arm64  # Apple Silicon only
```

### Code Signing (Optional)

For distribution outside the Mac App Store:

1. **Get Apple Developer Certificate**:
   - Enroll in Apple Developer Program ($99/year)
   - Create Developer ID certificate

2. **Sign the app**:
   ```bash
   cd macos
   npm run build -- --mac --publish=never
   ```

3. **Notarize** (required for macOS 10.15+):
   ```bash
   xcrun notarytool submit release/StreamVault-1.0.0.dmg \
     --apple-id "your@email.com" \
     --team-id "YOUR_TEAM_ID" \
     --password "app-specific-password"
   ```

## 🐛 Troubleshooting

### App Won't Open

**Issue**: "StreamVault" is damaged and can't be opened

**Solution**:
```bash
xattr -cr /Applications/StreamVault.app
```

### Network Access Issues

**Issue**: Can't access from other devices

**Solutions**:
1. Check macOS firewall:
   - System Preferences → Security & Privacy → Firewall
   - Allow incoming connections for StreamVault

2. Verify server is running:
   - Check menu bar icon
   - Look for "Server Online" status

3. Test locally first:
   - Open `http://localhost:3000` in browser

### Performance Issues

**Issue**: Slow playback or high CPU usage

**Solutions**:
1. **Enable hardware acceleration**:
   - Preferences → Streaming → Hardware Acceleration

2. **Reduce quality**:
   - Preferences → Streaming → Max Quality

3. **Close other apps**:
   - Check Activity Monitor for resource usage

### Database Issues

**Issue**: Media not showing up

**Solutions**:
1. **Rescan library**:
   - File → Rescan Media Library

2. **Check permissions**:
   - Ensure StreamVault has access to media folders
   - System Preferences → Security & Privacy → Files and Folders

3. **Rebuild database**:
   ```bash
   rm ~/Library/Application\ Support/StreamVault/database/*
   # Restart app
   ```

## 🔄 Updating

### Automatic Updates

StreamVault checks for updates automatically:
1. Click the menu bar icon
2. Select "Check for Updates"
3. Follow the prompts to install

### Manual Updates

1. Download the latest `.dmg`
2. Quit StreamVault (Cmd+Q)
3. Delete the old app from Applications
4. Install the new version

## 📊 System Requirements

### Minimum
- macOS 10.15 (Catalina)
- 4GB RAM
- 500MB disk space
- Intel Core i3 or Apple M1

### Recommended
- macOS 13+ (Ventura)
- 8GB RAM
- 1GB disk space
- Intel Core i5 or Apple M1 Pro

## 🔐 Privacy & Security

### Data Collection
- **No telemetry** - All data stays on your Mac
- **Local processing** - AI runs locally
- **No cloud required** - Works completely offline

### Permissions
StreamVault requests these macOS permissions:
- **Network**: For streaming to other devices
- **Files**: To access your media library
- **Microphone**: For voice chat (optional)
- **Camera**: For video features (optional)

All permissions are optional and can be revoked in System Preferences.

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) first.

### Development Setup
```bash
git clone https://github.com/yourusername/streamvault.git
cd streamvault
npm install
npm run dev
```

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

## 🙏 Acknowledgments

- Built with [Electron](https://www.electronjs.org/)
- UI framework: [React](https://reactjs.org/)
- Icons: [Lucide](https://lucide.dev/)
- Animations: [Framer Motion](https://www.framer.com/motion/)

## 📞 Support

- **Documentation**: [docs.streamvault.app](https://docs.streamvault.app)
- **Issues**: [GitHub Issues](https://github.com/yourusername/streamvault/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/streamvault/discussions)
- **Email**: support@streamvault.app

## 🗺️ Roadmap

- [ ] Mac App Store release
- [ ] Menu bar quick access
- [ ] Touch Bar support
- [ ] Handoff with iOS app
- [ ] Siri Shortcuts integration
- [ ] AirPlay receiver mode

---

**Made with ❤️ for macOS**

© 2024 StreamVault. All rights reserved.
