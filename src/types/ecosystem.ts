export interface MediaHunterConfig {
  localPaths: ScanPath[];
  cloudProviders: CloudProvider[];
  autoScan: boolean;
  scanInterval: number; // minutes
  fileTypes: string[];
  excludePatterns: string[];
  lastScan?: string;
  totalFiles: number;
}

export interface ScanPath {
  id: string;
  path: string;
  name: string;
  enabled: boolean;
  recursive: boolean;
  lastScanned?: string;
  fileCount: number;
}

export interface CloudProvider {
  id: string;
  type: 'google_drive' | 'dropbox' | 'onedrive' | 'mega' | 'plex_cloud';
  name: string;
  connected: boolean;
  rootFolder?: string;
  fileCount: number;
  lastSync?: string;
}

export interface DLNADevice {
  id: string;
  name: string;
  type: 'tv' | 'speaker' | 'console' | 'phone' | 'other';
  manufacturer: string;
  model: string;
  ipAddress: string;
  supportedFormats: string[];
  connected: boolean;
  icon?: string;
}

export interface DLNAConfig {
  enabled: boolean;
  serverName: string;
  shareLibrary: boolean;
  shareDownloads: boolean;
  transcodeOnFly: boolean;
  maxStreamingQuality: '4k' | '1080p' | '720p' | '480p';
  devices: DLNADevice[];
}

export interface TroubleshooterIssue {
  id: string;
  type: 'network' | 'storage' | 'performance' | 'security' | 'playback' | 'download';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  detectedAt: string;
  resolved: boolean;
  autoFixable: boolean;
  autoFixed?: boolean;
  solution?: string;
}

export interface TroubleshooterConfig {
  enabled: boolean;
  autoFix: boolean;
  monitorInterval: number; // seconds
  notifications: boolean;
  issues: TroubleshooterIssue[];
}

export interface ShuffleConfig {
  enabled: boolean;
  mode: 'complete_random' | 'by_genre' | 'by_mood' | 'smart_ai';
  includeWatched: boolean;
  minRating: number;
  genres: string[];
  moods: string[];
  history: string[]; // media IDs played
}

export interface PaidContentConfig {
  enabled: boolean;
  currency: string;
  paymentMethods: string[];
  priceTiers: PriceTier[];
  rentalPeriod: number; // hours
  purchasePermanent: boolean;
}

export interface PriceTier {
  id: string;
  name: string;
  price: number;
  quality: string;
  description: string;
}

export interface AntiBufferingConfig {
  enabled: boolean;
  adaptiveBitrate: boolean;
  prebufferSeconds: number;
  networkPrediction: boolean;
  peerBoost: boolean;
  cacheSize: number; // MB
  prioritizeVideo: boolean;
  flickerReduction: boolean;
  frameSync: boolean;
}

export const CLOUD_PROVIDERS = [
  { type: 'google_drive', name: 'Google Drive', icon: '🔵' },
  { type: 'dropbox', name: 'Dropbox', icon: '🔷' },
  { type: 'onedrive', name: 'OneDrive', icon: '🟦' },
  { type: 'mega', name: 'MEGA', icon: '🔴' },
  { type: 'plex_cloud', name: 'Plex Cloud', icon: '🟠' },
];

export const DLNA_DEVICE_TYPES = {
  tv: { label: 'Smart TV', icon: '📺' },
  speaker: { label: 'Speaker', icon: '🔊' },
  console: { label: 'Game Console', icon: '🎮' },
  phone: { label: 'Phone/Tablet', icon: '📱' },
  other: { label: 'Other Device', icon: '🔌' },
};
