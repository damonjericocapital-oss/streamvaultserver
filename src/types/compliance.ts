export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  maxDevices: number;
  maxQuality: '4k' | '1080p' | '720p' | '480p';
  storageLimit: number; // GB
  aiFeatures: boolean;
  dlnaAccess: boolean;
  paidContent: boolean;
  priority: 'free' | 'basic' | 'standard' | 'premium' | 'enterprise';
}

export interface UserSubscription {
  planId: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'cancelled' | 'trial';
  autoRenew: boolean;
  paymentMethod: string;
}

export interface RTAConfig {
  enabled: boolean;
  ratingSystem: 'mpaa' | 'pegi' | 'custom';
  requireVerification: boolean;
  blockUnderage: boolean;
  adultContentWarning: boolean;
  restrictedCategories: string[];
}

export interface ContentModerationConfig {
  enabled: boolean;
  aiDetection: boolean;
  illegalContentBlock: boolean;
  csamDetection: boolean; // Child Sexual Abuse Material
  violenceDetection: boolean;
  hateSpeechDetection: boolean;
  reportSystem: boolean;
  autoQuarantine: boolean;
  confidenceThreshold: number; // 0-100
}

export interface ChildProtectionConfig {
  enabled: boolean;
  parentalControls: boolean;
  kidProfiles: boolean;
  contentFiltering: boolean;
  timeLimits: boolean;
  activityMonitoring: boolean;
  blockChat: boolean;
  blockPurchases: boolean;
  requirePin: boolean;
}

export interface PlatformConfig {
  ios: boolean;
  macos: boolean;
  android: boolean;
  windows: boolean;
  linux: boolean;
  pwa: boolean;
  offlineMode: boolean;
  pushNotifications: boolean;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'USD',
    interval: 'month',
    features: [
      'Basic streaming',
      '720p quality',
      '2 devices',
      '10 GB storage',
      'Community support',
    ],
    maxDevices: 2,
    maxQuality: '720p',
    storageLimit: 10,
    aiFeatures: false,
    dlnaAccess: false,
    paidContent: false,
    priority: 'free',
  },
  {
    id: 'standard',
    name: 'Standard',
    price: 9.99,
    currency: 'USD',
    interval: 'month',
    features: [
      'HD streaming (1080p)',
      '5 devices',
      '100 GB storage',
      'AI recommendations',
      'DLNA casting',
      'Priority support',
    ],
    maxDevices: 5,
    maxQuality: '1080p',
    storageLimit: 100,
    aiFeatures: true,
    dlnaAccess: true,
    paidContent: false,
    priority: 'standard',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 19.99,
    currency: 'USD',
    interval: 'month',
    features: [
      '4K HDR streaming',
      '10 devices',
      '1 TB storage',
      'All AI features',
      'DLNA + casting',
      'Paid content access',
      'Priority support 24/7',
      'Early access features',
    ],
    maxDevices: 10,
    maxQuality: '4k',
    storageLimit: 1000,
    aiFeatures: true,
    dlnaAccess: true,
    paidContent: true,
    priority: 'premium',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 49.99,
    currency: 'USD',
    interval: 'month',
    features: [
      'Everything in Premium',
      'Unlimited devices',
      '10 TB storage',
      'Custom AI training',
      'White-label option',
      'API access',
      'Dedicated support',
      'SLA guarantee',
    ],
    maxDevices: 999,
    maxQuality: '4k',
    storageLimit: 10000,
    aiFeatures: true,
    dlnaAccess: true,
    paidContent: true,
    priority: 'enterprise',
  },
];
