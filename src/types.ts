export interface Torrent {
  id: string;
  name: string;
  size: string;
  sizeBytes: number;
  progress: number;
  status: 'downloading' | 'seeding' | 'paused' | 'completed' | 'error' | 'queued';
  downloadSpeed: string;
  uploadSpeed: string;
  seeds: number;
  peers: number;
  eta: string;
  addedDate: string;
  category: string;
  files: TorrentFile[];
  magnetLink?: string;
  streamable: boolean;
  thumbnail?: string;
}

export interface TorrentFile {
  name: string;
  size: string;
  type: 'video' | 'audio' | 'subtitle' | 'other';
  progress: number;
  streamable: boolean;
}

export interface ServerStats {
  downloadSpeed: number;
  uploadSpeed: number;
  totalDownloaded: string;
  totalUploaded: string;
  activeTorrents: number;
  totalTorrents: number;
  diskSpace: string;
  diskUsed: string;
  uptime: string;
  cpuUsage: number;
  memoryUsage: number;
}

export type ViewType =
  | 'home'
  | 'movies'
  | 'shows'
  | 'music'
  | 'continue'
  | 'favorites'
  | 'recent'
  | 'dashboard'
  | 'torrents'
  | 'streaming'
  | 'search'
  | 'settings'
  | 'files'
  | 'ai'
  | 'deploy';
