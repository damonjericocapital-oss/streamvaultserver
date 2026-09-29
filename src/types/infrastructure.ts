export interface VLCConfig {
  enabled: boolean;
  path: string;
  useVLCForAll: boolean;
  hardwareAcceleration: boolean;
  networkCaching: number; // ms
  audioSync: number; // ms offset
  subtitleSync: number; // ms offset
  customArgs: string[];
}

export interface TorrentClientConfig {
  id: string;
  name: string;
  type: 'qbittorrent' | 'transmission' | 'deluge' | 'rtorrent' | 'utorrent';
  host: string;
  port: number;
  username?: string;
  password?: string;
  useSSL: boolean;
  connected: boolean;
  lastChecked?: string;
  apiEndpoint?: string;
}

export interface SpeedOptimization {
  maxDownloadSpeed: number; // MB/s, 0 = unlimited
  maxUploadSpeed: number; // MB/s, 0 = unlimited
  maxConnections: number;
  maxConnectionsPerTorrent: number;
  maxUploadSlots: number;
  maxUploadSlotsPerTorrent: number;
  enableQueueing: boolean;
  maxActiveDownloads: number;
  maxActiveUploads: number;
  schedulerEnabled: boolean;
  schedulerRules: SchedulerRule[];
}

export interface SchedulerRule {
  id: string;
  name: string;
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  days: number[]; // 0-6 (Sunday-Saturday)
  downloadLimit: number; // MB/s
  uploadLimit: number; // MB/s
  enabled: boolean;
}

export interface SeedingConfig {
  defaultRatio: number; // 0 = unlimited
  defaultSeedTime: number; // minutes, 0 = unlimited
  actionOnComplete: 'pause' | 'remove' | 'remove_torrent' | 'remove_all';
  enableSuperSeeding: boolean;
  sequentialDownload: boolean;
  firstLastPiecePriority: boolean;
  autoAddTrackers: boolean;
  trackerList: string[];
  shareRatioLimit: number;
  seedTimeLimit: number; // minutes
}

export interface SecurityConfig {
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

export interface VPNConfig {
  enabled: boolean;
  provider: 'custom' | 'nordvpn' | 'expressvpn' | 'privateinternet' | 'mullvad';
  protocol: 'openvpn' | 'wireguard' | 'ikev2';
  server?: string;
  config?: string;
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

export const TORRENT_CLIENTS = [
  { type: 'qbittorrent', name: 'qBittorrent', defaultPort: 8080, icon: '🟢' },
  { type: 'transmission', name: 'Transmission', defaultPort: 9091, icon: '🔴' },
  { type: 'deluge', name: 'Deluge', defaultPort: 8112, icon: '🟡' },
  { type: 'rtorrent', name: 'rTorrent', defaultPort: 80, icon: '🔵' },
  { type: 'utorrent', name: 'µTorrent', defaultPort: 8080, icon: '🟠' },
];

export const VPN_PROVIDERS = [
  { id: 'nordvpn', name: 'NordVPN', icon: '🇫🇮' },
  { id: 'expressvpn', name: 'ExpressVPN', icon: '🇻🇬' },
  { id: 'privateinternet', name: 'Private Internet Access', icon: '🇺🇸' },
  { id: 'mullvad', name: 'Mullvad', icon: '🇸🇪' },
  { id: 'custom', name: 'Custom OpenVPN/WireGuard', icon: '⚙️' },
];
