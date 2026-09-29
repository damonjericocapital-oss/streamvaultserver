export interface TranslationConfig {
  enabled: boolean;
  sourceLanguage: string;
  targetLanguage: string;
  autoDetect: boolean;
  quality: 'standard' | 'high' | 'premium';
  delay: number; // ms
}

export interface TheaterRoom {
  id: string;
  name: string;
  host: string;
  participants: TheaterParticipant[];
  mediaId: string;
  mediaTitle: string;
  createdAt: string;
  isPrivate: boolean;
  maxParticipants: number;
  voiceChatEnabled: boolean;
  chatEnabled: boolean;
}

export interface TheaterParticipant {
  id: string;
  username: string;
  avatar: {
    colors: [string, string];
    initial: string;
  };
  isHost: boolean;
  isMuted: boolean;
  isSpeaking: boolean;
  joinedAt: string;
}

export interface VoiceChatState {
  isConnected: boolean;
  isMuted: boolean;
  isDeafened: boolean;
  inputDevice: string;
  outputDevice: string;
  volume: number;
  noiseSuppression: boolean;
  echoCancellation: boolean;
}

export interface AgeVerification {
  verified: boolean;
  birthDate?: string;
  age?: number;
  verifiedAt?: string;
  method: 'birthdate' | 'id' | 'parental';
}

export interface LatencyConfig {
  targetLatency: number; // ms
  bufferSize: number; // seconds
  adaptiveBitrate: boolean;
  networkOptimization: 'balanced' | 'speed' | 'quality';
  prebufferSeconds: number;
}

export interface DolbyConfig {
  enabled: boolean;
  atmos: boolean;
  digitalPlus: boolean;
  volumeLeveler: boolean;
  dialogueEnhancer: number; // 0-100
  bassEnhancement: number; // 0-100
  virtualizer: boolean;
}

export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  message: string;
  timestamp: string;
  type: 'text' | 'reaction' | 'system';
  reaction?: string;
}

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
];

export const CONTENT_RATINGS = {
  G: { label: 'General', minAge: 0, color: '#10b981' },
  PG: { label: 'Parental Guidance', minAge: 7, color: '#3b82f6' },
  PG13: { label: 'PG-13', minAge: 13, color: '#f59e0b' },
  R: { label: 'Restricted', minAge: 17, color: '#ef4444' },
  NC17: { label: 'Adults Only', minAge: 18, color: '#7c3aed' },
};
