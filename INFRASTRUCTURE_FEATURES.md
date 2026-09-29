# 🚀 StreamVault Infrastructure Features

## Overview

StreamVault now includes enterprise-grade infrastructure features for maximum performance, security, and flexibility. These features provide complete control over your torrent streaming server.

---

## 🔶 VLC Integration

### Features
- **External Player Support**: Launch VLC for advanced playback capabilities
- **Hardware Acceleration**: GPU-accelerated video decoding
- **Network Caching**: Configurable buffer for smooth streaming
- **Audio/Subtitle Sync**: Fine-tune synchronization (±500ms)
- **Custom Arguments**: Pass any VLC command-line options
- **Path Configuration**: Auto-detect or manually set VLC executable

### Configuration
```typescript
interface VLCConfig {
  enabled: boolean;
  path: string;                    // VLC executable path
  useVLCForAll: boolean;           // Use VLC for all media
  hardwareAcceleration: boolean;   // GPU decoding
  networkCaching: number;          // Buffer in ms (300-10000)
  audioSync: number;               // Audio offset in ms
  subtitleSync: number;            // Subtitle offset in ms
  customArgs: string[];            // Additional VLC arguments
}
```

### Usage
1. Navigate to **Settings → Infrastructure → VLC Plugin**
2. Enable VLC integration
3. Set VLC executable path (auto-detected on most systems)
4. Click "Test VLC Installation" to verify
5. Configure hardware acceleration and caching
6. Adjust sync offsets if needed

### Common VLC Paths
- **Linux**: `/usr/bin/vlc`
- **macOS**: `/Applications/VLC.app/Contents/MacOS/VLC`
- **Windows**: `C:\Program Files\VideoLAN\VLC\vlc.exe`

---

## 🔗 Torrent Client Connectors

### Supported Clients
- **qBittorrent** (Recommended) - Full API support
- **Transmission** - Web UI integration
- **Deluge** - Daemon connection
- **rTorrent** - XML-RPC interface
- **µTorrent** - Web API

### Features
- **Multi-Client Support**: Connect to multiple torrent clients simultaneously
- **Connection Testing**: Verify connectivity before use
- **SSL/TLS**: Secure connections to remote clients
- **Authentication**: Username/password support
- **Web UI Access**: Quick launch buttons for client interfaces
- **Status Monitoring**: Real-time connection status

### Configuration
```typescript
interface TorrentClientConfig {
  id: string;
  name: string;
  type: 'qbittorrent' | 'transmission' | 'deluge' | 'rtorrent' | 'utorrent';
  host: string;                    // IP or hostname
  port: number;                    // API port
  username?: string;               // Optional auth
  password?: string;               // Optional auth
  useSSL: boolean;                 // HTTPS connection
  connected: boolean;              // Connection status
  lastChecked?: string;            // Last test timestamp
}
```

### Setup Guide

#### qBittorrent
1. Enable Web UI in qBittorrent settings
2. Set username/password
3. Note the port (default: 8080)
4. In StreamVault: Add Client → qBittorrent
5. Enter host, port, and credentials
6. Click "Test Connection"

#### Transmission
1. Enable Remote Control in Transmission preferences
2. Set authentication
3. Note the port (default: 9091)
4. In StreamVault: Add Client → Transmission
5. Configure connection details

### Default Ports
- qBittorrent: 8080
- Transmission: 9091
- Deluge: 8112
- rTorrent: 80 (XML-RPC)
- µTorrent: 8080

---

## ⚡ Speed Optimization

### Features
- **Global Speed Limits**: Cap download/upload speeds (0 = unlimited)
- **Connection Limits**: Control max connections globally and per-torrent
- **Upload Slots**: Manage upload capacity
- **Queue Management**: Limit active downloads/uploads
- **Speed Scheduler**: Time-based speed limits
- **Adaptive Control**: Dynamic adjustment based on network conditions

### Configuration
```typescript
interface SpeedOptimization {
  maxDownloadSpeed: number;        // MB/s (0 = unlimited)
  maxUploadSpeed: number;          // MB/s (0 = unlimited)
  maxConnections: number;          // Total connections
  maxConnectionsPerTorrent: number;
  maxUploadSlots: number;
  maxUploadSlotsPerTorrent: number;
  enableQueueing: boolean;
  maxActiveDownloads: number;
  maxActiveUploads: number;
  schedulerEnabled: boolean;
  schedulerRules: SchedulerRule[];
}

interface SchedulerRule {
  id: string;
  name: string;
  startTime: string;               // HH:MM format
  endTime: string;                 // HH:MM format
  days: number[];                  // 0-6 (Sun-Sat)
  downloadLimit: number;           // MB/s
  uploadLimit: number;             // MB/s
  enabled: boolean;
}
```

### Speed Scheduler Examples

#### Night Mode (Full Speed)
```
Time: 00:00 - 08:00
Days: Monday-Sunday
Download: Unlimited
Upload: Unlimited
```

#### Work Hours (Limited)
```
Time: 09:00 - 17:00
Days: Monday-Friday
Download: 5 MB/s
Upload: 1 MB/s
```

#### Weekend Boost
```
Time: 00:00 - 23:59
Days: Saturday, Sunday
Download: Unlimited
Upload: 10 MB/s
```

### Recommended Settings

#### For 100 Mbps Connection
- Max Download: 10 MB/s
- Max Upload: 2 MB/s
- Max Connections: 500
- Upload Slots: 50

#### For 1 Gbps Connection
- Max Download: 100 MB/s
- Max Upload: 20 MB/s
- Max Connections: 2000
- Upload Slots: 200

---

## 🌱 Seeding Management

### Features
- **Ratio Control**: Set target share ratios (0 = unlimited)
- **Time Limits**: Configure seeding duration
- **Completion Actions**: Auto-pause/remove when done
- **Super Seeding**: Optimize initial seeding
- **Sequential Download**: Download pieces in order (for streaming)
- **First/Last Piece Priority**: Speed up preview
- **Tracker Management**: Add/remove trackers
- **Auto-Add Trackers**: Apply tracker list to new torrents

### Configuration
```typescript
interface SeedingConfig {
  defaultRatio: number;            // Target ratio (0 = unlimited)
  defaultSeedTime: number;         // Minutes (0 = unlimited)
  actionOnComplete: 'pause' | 'remove' | 'remove_torrent' | 'remove_all';
  enableSuperSeeding: boolean;
  sequentialDownload: boolean;
  firstLastPiecePriority: boolean;
  autoAddTrackers: boolean;
  trackerList: string[];
  shareRatioLimit: number;
  seedTimeLimit: number;
}
```

### Completion Actions
- **Pause**: Stop seeding but keep torrent
- **Remove Torrent**: Delete .torrent file, keep data
- **Remove All**: Delete both torrent and data
- **Remove .torrent**: Same as "Remove Torrent"

### Popular Public Trackers
```
udp://tracker.opentrackr.org:1337/announce
udp://open.stealth.si:80/announce
udp://tracker.tiny-vps.com:6969/announce
udp://tracker.moeking.me:6969/announce
udp://exodus.desync.com:6969/announce
udp://tracker.birkenwald.de:6969/announce
```

### Seeding Strategies

#### Ratio-Based
- Set ratio to 2.0 (upload 2x what you download)
- Good for maintaining good standing in private trackers

#### Time-Based
- Seed for 24 hours (1440 minutes)
- Ensures availability without indefinite seeding

#### Hybrid
- Ratio: 1.5 OR Time: 48 hours (whichever comes first)
- Balanced approach for most users

---

## 🔒 Security Settings

### Features
- **Protocol Encryption**: Prefer/Force/Disable encryption
- **Anonymous Mode**: Hide client fingerprint
- **IP Filtering**: Block specific IPs or ranges
- **Network Features**: Control DHT, PeX, LPD, UPnP, NAT-PMP
- **Port Randomization**: Use different port each session
- **Secure Connections**: Enforce encrypted peer connections

### Configuration
```typescript
interface SecurityConfig {
  encryption: 'prefer' | 'force' | 'disable';
  anonymousMode: boolean;
  enableIPFilter: boolean;
  ipFilterFile?: string;
  blockedIPs: string[];
  enablePeerExchange: boolean;
  enableDHT: boolean;
  enableLPD: boolean;
  enableUPnP: boolean;
  enableNATPMP: boolean;
  randomizePort: boolean;
  portRange: string;
  enableRSSFeed: boolean;
  secureConnections: boolean;
}
```

### Encryption Levels

#### Prefer (Recommended)
- Use encryption if peer supports it
- Fall back to unencrypted if needed
- Good balance of compatibility and privacy

#### Force
- Only connect to encrypted peers
- Maximum privacy
- May reduce peer availability

#### Disable
- No encryption
- Maximum compatibility
- Not recommended for privacy

### Anonymous Mode
When enabled:
- ✓ Client fingerprint hidden
- ✓ Listen port randomized
- ✓ User agent spoofed
- ✓ No client identification

### IP Filtering
Block specific IPs or ranges:
- Single IP: `192.168.1.100`
- CIDR range: `10.0.0.0/24`
- Wildcard: `172.16.*.*`

### Privacy Recommendations

#### Maximum Privacy
```
Encryption: Force
Anonymous Mode: ON
DHT: OFF
PeX: OFF
LPD: OFF
UPnP: OFF
Randomize Port: ON
```

#### Balanced
```
Encryption: Prefer
Anonymous Mode: OFF
DHT: ON
PeX: ON
LPD: ON
UPnP: ON
Randomize Port: OFF
```

---

## 🛡️ VPN Configuration

### Supported Providers
- **NordVPN** - Large server network
- **ExpressVPN** - Fast and reliable
- **Private Internet Access (PIA)** - Budget-friendly
- **Mullvad** - Privacy-focused
- **Custom** - OpenVPN/WireGuard configs

### Features
- **Kill Switch**: Block internet if VPN disconnects
- **Auto-Connect**: Connect on app start
- **DNS Leak Protection**: Force DNS through VPN
- **Split Tunneling**: Route specific apps through VPN
- **Bypass LAN**: Allow local network without VPN
- **Connection Status**: Real-time monitoring

### Configuration
```typescript
interface VPNConfig {
  enabled: boolean;
  provider: 'custom' | 'nordvpn' | 'expressvpn' | 'privateinternet' | 'mullvad';
  protocol: 'openvpn' | 'wireguard' | 'ikev2';
  server?: string;
  config?: string;                 // Config file path
  username?: string;
  password?: string;
  killSwitch: boolean;
  autoConnect: boolean;
  bypassLocalNetwork: boolean;
  dnsLeakProtection: boolean;
  splitTunneling: boolean;
  splitTunnelApps: string[];
  connected: boolean;
  serverLocation?: string;
  ipAddress?: string;
}
```

### Protocol Comparison

#### WireGuard (Recommended)
- ✓ Fastest performance
- ✓ Modern cryptography
- ✓ Low overhead
- ✗ Newer, less tested

#### OpenVPN
- ✓ Most compatible
- ✓ Highly configurable
- ✓ Well-tested
- ✗ Slower than WireGuard

#### IKEv2
- ✓ Good for mobile
- ✓ Fast reconnection
- ✓ Native support
- ✗ Less flexible

### Setup Examples

#### NordVPN + WireGuard
1. Select provider: NordVPN
2. Protocol: WireGuard
3. Enter NordVPN credentials
4. Enable Kill Switch
5. Enable DNS Leak Protection
6. Click Connect

#### Custom OpenVPN
1. Select provider: Custom
2. Protocol: OpenVPN
3. Upload .ovpn config file
4. Enter username/password if required
5. Configure advanced options
6. Click Connect

### VPN Recommendations

#### For Torrenting
```
Provider: Any no-logs VPN
Protocol: WireGuard or OpenVPN
Kill Switch: ON
DNS Leak Protection: ON
Bypass LAN: ON
```

#### For Maximum Privacy
```
Provider: Mullvad (cash payment)
Protocol: WireGuard
Kill Switch: ON
DNS Leak Protection: ON
Split Tunneling: OFF
```

### VPN + Security Best Practices
1. **Use VPN + Encryption**: Double layer of protection
2. **Enable Kill Switch**: Prevent IP leaks
3. **Choose No-Logs Provider**: Ensure privacy
4. **Test for Leaks**: Use ipleak.net
5. **Randomize Port**: Additional anonymity

---

## 🎛️ Accessing Infrastructure Features

### From Settings Page
1. Navigate to **Settings** (gear icon in sidebar)
2. Scroll to **Infrastructure** section
3. Click any feature card to open configuration panel

### Quick Access Buttons
- 🔶 **VLC Plugin** - Advanced playback
- 🔗 **Torrent Clients** - External app integration
- ⚡ **Speed Control** - Transfer optimization
- 🌱 **Seeding** - Ratio management
- 🔒 **Security** - Privacy settings
- 🛡️ **VPN** - Secure connection

### Keyboard Shortcuts
All infrastructure panels can be closed with `Esc` key.

---

## 🔧 Advanced Configuration

### Configuration Persistence
All settings are automatically saved to localStorage and persist across sessions.

### Export/Import (Future)
Planned feature to export/import all infrastructure settings for backup or migration.

### API Integration (Future)
REST API endpoints planned for remote configuration:
```
GET /api/config/vlc
PUT /api/config/vlc
GET /api/config/clients
POST /api/config/clients
...
```

---

## 📊 Performance Impact

### Resource Usage
- **VLC Integration**: Minimal (only when launching)
- **Torrent Clients**: ~5MB per connection
- **Speed Optimization**: Negligible
- **Seeding Management**: Negligible
- **Security Settings**: Negligible
- **VPN**: Depends on provider/protocol (typically 5-10% speed reduction)

### Network Impact
- **Encryption**: 5-10% overhead
- **VPN**: 5-20% overhead (varies by provider)
- **Anonymous Mode**: Minimal
- **IP Filtering**: Negligible

---

## 🐛 Troubleshooting

### VLC Not Found
- Verify VLC is installed
- Check executable path
- Try manual path entry
- Restart application after installation

### Torrent Client Connection Failed
- Verify client is running
- Check Web UI is enabled
- Confirm port is correct
- Verify credentials
- Check firewall settings
- Try "Test Connection" button

### Speed Not Changing
- Check if scheduler is overriding
- Verify limits are set correctly
- Restart torrent client connection
- Check client-side limits

### VPN Not Connecting
- Verify credentials
- Check server availability
- Try different protocol
- Disable kill switch temporarily
- Check firewall/antivirus

### IP Leak Detected
- Enable DNS Leak Protection
- Enable Kill Switch
- Test at ipleak.net
- Try different VPN server
- Contact VPN support

---

## 📚 Additional Resources

### Documentation
- [VLC Command Line](https://wiki.videolan.org/VLC_command-line_help/)
- [qBittorrent API](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-4.1))
- [WireGuard Documentation](https://www.wireguard.com/)

### Tools
- [ipleak.net](https://ipleak.net) - Test for IP/DNS leaks
- [speedtest.net](https://speedtest.net) - Test connection speed
- [whatismyip.com](https://whatismyip.com) - Verify IP address

### Communities
- r/qBittorrent
- r/VPNTorrents
- r/Privacy

---

## 🚀 Best Practices

### For Maximum Performance
1. Use WireGuard VPN protocol
2. Enable hardware acceleration in VLC
3. Set appropriate speed limits
4. Use SSD for downloads
5. Enable sequential download for streaming

### For Maximum Privacy
1. Use VPN + Force encryption
2. Enable Anonymous Mode
3. Disable DHT/PeX/LPD
4. Randomize port
5. Use no-logs VPN provider

### For Reliability
1. Enable Kill Switch
2. Connect to multiple torrent clients
3. Set up speed scheduler
4. Configure auto-seeding rules
5. Monitor connection status

---

## ✅ Feature Status

| Feature | Status | Version |
|---------|--------|---------|
| VLC Integration | ✅ Complete | 1.0 |
| Torrent Clients | ✅ Complete | 1.0 |
| Speed Optimization | ✅ Complete | 1.0 |
| Seeding Management | ✅ Complete | 1.0 |
| Security Settings | ✅ Complete | 1.0 |
| VPN Configuration | ✅ Complete | 1.0 |

---

**Last Updated**: 2024
**Version**: 1.0
**Status**: Production Ready
