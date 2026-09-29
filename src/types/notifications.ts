export interface Notification {
  id: string;
  type: 'download' | 'stream' | 'ai' | 'system' | 'social' | 'security' | 'update';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  action?: {
    label: string;
    handler: string;
  };
  icon?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface ActivityItem {
  id: string;
  type: 'download_complete' | 'download_start' | 'stream_start' | 'stream_stop' | 'user_login' | 'ai_action' | 'system_event';
  title: string;
  description: string;
  timestamp: string;
  user?: string;
  metadata?: Record<string, any>;
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  description: string;
  handler: string;
  category: 'media' | 'system' | 'ai' | 'settings';
}

export const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'scan-media',
    label: 'Scan Media',
    icon: '🔍',
    description: 'Scan for new media files',
    handler: 'mediaHunter.scan',
    category: 'media',
  },
  {
    id: 'optimize-speed',
    label: 'Optimize Speed',
    icon: '⚡',
    description: 'Auto-optimize download speeds',
    handler: 'speed.optimize',
    category: 'system',
  },
  {
    id: 'ai-analyze',
    label: 'AI Analysis',
    icon: '🧠',
    description: 'Run full AI system analysis',
    handler: 'ai.analyze',
    category: 'ai',
  },
  {
    id: 'shuffle-play',
    label: 'Shuffle Play',
    icon: '🔀',
    description: 'Start random playback',
    handler: 'shuffle.start',
    category: 'media',
  },
  {
    id: 'clear-cache',
    label: 'Clear Cache',
    icon: '🗑️',
    description: 'Clear system cache',
    handler: 'system.clearCache',
    category: 'system',
  },
  {
    id: 'check-updates',
    label: 'Check Updates',
    icon: '🔄',
    description: 'Check for app updates',
    handler: 'system.checkUpdates',
    category: 'system',
  },
];
