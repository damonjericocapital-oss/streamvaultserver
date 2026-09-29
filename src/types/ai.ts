export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  actions?: AIAction[];
  metadata?: {
    type?: 'analysis' | 'recommendation' | 'alert' | 'action' | 'insight';
    confidence?: number;
  };
}

export interface AIAction {
  id: string;
  label: string;
  type: 'download' | 'stream' | 'pause' | 'resume' | 'delete' | 'optimize' | 'organize' | 'settings';
  payload?: any;
  icon?: string;
}

export interface AIAgentState {
  isActive: boolean;
  isProcessing: boolean;
  mode: 'chat' | 'monitor' | 'auto';
  autoPilot: boolean;
  insights: AIInsight[];
}

export interface AIInsight {
  id: string;
  type: 'performance' | 'storage' | 'network' | 'security' | 'recommendation';
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'critical' | 'success';
  timestamp: Date;
  action?: AIAction;
}
