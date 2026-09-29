export interface User {
  id: string;
  username: string;
  pin?: string;
  avatar: AvatarConfig;
  role: 'admin' | 'user' | 'kid';
  createdAt: string;
  lastLogin?: string;
  preferences: UserPreferences;
  watchHistory: WatchHistoryEntry[];
  watchlist: string[]; // media IDs
}

export interface AvatarConfig {
  type: 'gradient' | 'initial' | 'emoji';
  colors: [string, string];
  initial?: string;
  emoji?: string;
}

export interface UserPreferences {
  autoPlay: boolean;
  autoNext: boolean;
  subtitles: boolean;
  subtitleLanguage: string;
  audioLanguage: string;
  playbackSpeed: number;
  quality: 'auto' | '4k' | '1080p' | '720p' | '480p';
  theme: 'dark' | 'midnight' | 'amoled';
  notifications: boolean;
  parentalControls: ParentalControls;
}

export interface ParentalControls {
  enabled: boolean;
  maxRating: number; // 1-10
  blockedGenres: string[];
  pinRequired: boolean;
}

export interface WatchHistoryEntry {
  mediaId: string;
  watchedAt: string;
  progress: number; // 0-100
  completed: boolean;
  duration: number; // seconds watched
  rating?: number; // user's 1-5 star rating
}

export interface AuthState {
  isAuthenticated: boolean;
  currentUser: User | null;
  users: User[];
  masterPin: string;
}

export const AVATAR_PRESETS: { name: string; config: AvatarConfig }[] = [
  { name: 'Sunset', config: { type: 'gradient', colors: ['#f59e0b', '#ef4444'] } },
  { name: 'Ocean', config: { type: 'gradient', colors: ['#06b6d4', '#3b82f6'] } },
  { name: 'Forest', config: { type: 'gradient', colors: ['#10b981', '#059669'] } },
  { name: 'Violet', config: { type: 'gradient', colors: ['#8b5cf6', '#ec4899'] } },
  { name: 'Midnight', config: { type: 'gradient', colors: ['#1e293b', '#475569'] } },
  { name: 'Rose', config: { type: 'gradient', colors: ['#f43f5e', '#fb7185'] } },
  { name: 'Amber', config: { type: 'gradient', colors: ['#f59e0b', '#fbbf24'] } },
  { name: 'Emerald', config: { type: 'gradient', colors: ['#10b981', '#34d399'] } },
];

export const EMOJI_AVATARS = ['🎬', '🍿', '🎭', '🎮', '🎵', '🌟', '🔥', '⚡', '🚀', '🎯', '🦊', '🐼', '🦁', '🐯', '🦄', '🐉'];
