import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';
import { Plus, X, Upload, Link2, FileUp } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TorrentList from './components/TorrentList';
import StreamPlayer from './components/StreamPlayer';
import StreamingView from './components/StreamingView';
import SearchView from './components/SearchView';
import SettingsView from './components/SettingsView';
import FileBrowser from './components/FileBrowser';
import AIAgent from './components/AIAgent';
import AIFloatingButton from './components/AIFloatingButton';
import AIPanel from './components/AIPanel';
import MediaHome from './components/MediaHome';
import MediaDetail from './components/MediaDetail';
import DeployGuide from './components/DeployGuide';
import LoginScreen from './components/LoginScreen';
import UserMenu from './components/UserMenu';
import GroupTheater from './components/GroupTheater';
import AgeVerification from './components/AgeVerification';
import AdvancedPlayerSettings from './components/AdvancedPlayerSettings';
import VLCIntegration from './components/VLCIntegration';
import TorrentClientConnectors from './components/TorrentClientConnectors';
import SpeedOptimizationPanel from './components/SpeedOptimizationPanel';
import SeedingManagement from './components/SeedingManagement';
import SecuritySettings from './components/SecuritySettings';
import VPNConfiguration from './components/VPNConfiguration';
import AdminPaymentConfig from './components/AdminPaymentConfig';
import RevenueDashboard from './components/RevenueDashboard';
import NotificationsCenter from './components/NotificationsCenter';
import ActivityFeed from './components/ActivityFeed';
import QuickActionsPanel from './components/QuickActionsPanel';
import FloatingActions from './components/FloatingActions';
import KeyboardShortcuts from './components/KeyboardShortcuts';
import LocalNetworkGuide from './components/LocalNetworkGuide';
import { UserProvider, useUser } from './context/UserContext';
import { ViewType, Torrent } from './types';
import { AIAction, AIInsight } from './types/ai';
import { MediaItem } from './data/mediaLibrary';
import { mockTorrents, mockStats } from './data/mockData';
import { generateAutoInsights } from './engine/aiEngine';
import {
  TranslationConfig,
  LatencyConfig,
  DolbyConfig,
  TheaterRoom,
} from './types/advanced';
import {
  VLCConfig,
  TorrentClientConfig,
  SpeedOptimization,
  SeedingConfig,
  SecurityConfig,
  VPNConfig,
} from './types/infrastructure';
import {
  MediaHunterConfig,
  DLNAConfig,
  TroubleshooterConfig,
  ShuffleConfig,
  PaidContentConfig,
  AntiBufferingConfig,
} from './types/ecosystem';
import { PaymentGatewayConfig, RevenueStats, Transaction } from './types/payment';
import {
  RTAConfig,
  ContentModerationConfig,
  ChildProtectionConfig,
  PlatformConfig,
} from './types/compliance';
import { Notification, ActivityItem, QuickAction } from './types/notifications';
import MediaHunter from './components/MediaHunter';
import DLNACasting from './components/DLNACasting';
import AITroubleshooter from './components/AITroubleshooter';
import ShufflePlayer from './components/ShufflePlayer';
import PaidViewing from './components/PaidViewing';
import AntiBufferingEngine from './components/AntiBufferingEngine';
import SubscriptionManager from './components/SubscriptionManager';
import ComplianceSettings from './components/ComplianceSettings';
import PlatformSupport from './components/PlatformSupport';

function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

function AppContent() {
  const { isAuthenticated, addToWatchHistory, currentUser } = useUser();
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [torrents, setTorrents] = useState<Torrent[]>(mockTorrents);
  const [streamingTorrent, setStreamingTorrent] = useState<Torrent | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [isAIAgentOpen, setIsAIAgentOpen] = useState(false);
  const [autoPilot, setAutoPilot] = useState(false);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  // Advanced features state
  const [showGroupTheater, setShowGroupTheater] = useState(false);
  const [theaterRoom, setTheaterRoom] = useState<TheaterRoom | null>(null);
  const [showAgeVerification, setShowAgeVerification] = useState(false);
  const [ageVerificationData, setAgeVerificationData] = useState<{
    requiredAge: number;
    contentTitle: string;
    onVerify: () => void;
  } | null>(null);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [translationConfig, setTranslationConfig] = useState<TranslationConfig>({
    enabled: false,
    sourceLanguage: 'auto',
    targetLanguage: 'en',
    autoDetect: true,
    quality: 'high',
    delay: 0,
  });
  const [latencyConfig, setLatencyConfig] = useState<LatencyConfig>({
    targetLatency: 500,
    bufferSize: 10,
    adaptiveBitrate: true,
    networkOptimization: 'balanced',
    prebufferSeconds: 3,
  });
  const [dolbyConfig, setDolbyConfig] = useState<DolbyConfig>({
    enabled: true,
    atmos: false,
    digitalPlus: true,
    volumeLeveler: true,
    dialogueEnhancer: 50,
    bassEnhancement: 30,
    virtualizer: false,
  });

  // Infrastructure features state
  const [showVLC, setShowVLC] = useState(false);
  const [vlcConfig, setVlcConfig] = useState<VLCConfig>({
    enabled: false,
    path: '',
    useVLCForAll: false,
    hardwareAcceleration: true,
    networkCaching: 1000,
    audioSync: 0,
    subtitleSync: 0,
    customArgs: [],
  });

  const [showTorrentClients, setShowTorrentClients] = useState(false);
  const [torrentClients, setTorrentClients] = useState<TorrentClientConfig[]>([]);

  const [showSpeedOptimization, setShowSpeedOptimization] = useState(false);
  const [speedConfig, setSpeedConfig] = useState<SpeedOptimization>({
    maxDownloadSpeed: 0,
    maxUploadSpeed: 0,
    maxConnections: 500,
    maxConnectionsPerTorrent: 100,
    maxUploadSlots: 50,
    maxUploadSlotsPerTorrent: 10,
    enableQueueing: true,
    maxActiveDownloads: 5,
    maxActiveUploads: 5,
    schedulerEnabled: false,
    schedulerRules: [],
  });

  const [showSeeding, setShowSeeding] = useState(false);
  const [seedingConfig, setSeedingConfig] = useState<SeedingConfig>({
    defaultRatio: 2.0,
    defaultSeedTime: 1440,
    actionOnComplete: 'pause',
    enableSuperSeeding: false,
    sequentialDownload: false,
    firstLastPiecePriority: true,
    autoAddTrackers: true,
    trackerList: [],
    shareRatioLimit: 0,
    seedTimeLimit: 0,
  });

  const [showSecurity, setShowSecurity] = useState(false);
  const [securityConfig, setSecurityConfig] = useState<SecurityConfig>({
    encryption: 'prefer',
    anonymousMode: false,
    enableIPFilter: false,
    blockedIPs: [],
    enablePeerExchange: true,
    enableDHT: true,
    enableLPD: true,
    enableUPnP: true,
    enableNATPMP: false,
    randomizePort: false,
    portRange: '6881-6889',
    enableRSSFeed: false,
    secureConnections: true,
  });

  const [showVPN, setShowVPN] = useState(false);
  const [vpnConfig, setVpnConfig] = useState<VPNConfig>({
    enabled: false,
    provider: 'custom',
    protocol: 'wireguard',
    killSwitch: true,
    autoConnect: false,
    bypassLocalNetwork: true,
    dnsLeakProtection: true,
    splitTunneling: false,
    splitTunnelApps: [],
    connected: false,
  });

  // Ecosystem features state
  const [showMediaHunter, setShowMediaHunter] = useState(false);
  const [mediaHunterConfig, setMediaHunterConfig] = useState<MediaHunterConfig>({
    localPaths: [],
    cloudProviders: [],
    autoScan: false,
    scanInterval: 60,
    fileTypes: ['mp4', 'mkv', 'avi', 'mov', 'mp3', 'flac'],
    excludePatterns: ['*.tmp', '*.part'],
    totalFiles: 0,
  });

  const [showDLNA, setShowDLNA] = useState(false);
  const [dlnaConfig, setDlnaConfig] = useState<DLNAConfig>({
    enabled: false,
    serverName: 'StreamVault',
    shareLibrary: true,
    shareDownloads: false,
    transcodeOnFly: true,
    maxStreamingQuality: '1080p',
    devices: [],
  });

  const [showTroubleshooter, setShowTroubleshooter] = useState(false);
  const [troubleshooterConfig, setTroubleshooterConfig] = useState<TroubleshooterConfig>({
    enabled: false,
    autoFix: false,
    monitorInterval: 30,
    notifications: true,
    issues: [],
  });

  const [showShuffle, setShowShuffle] = useState(false);
  const [shuffleConfig, setShuffleConfig] = useState<ShuffleConfig>({
    enabled: false,
    mode: 'complete_random',
    includeWatched: false,
    minRating: 0,
    genres: [],
    moods: [],
    history: [],
  });

  const [showPaidViewing, setShowPaidViewing] = useState(false);
  const [paidContentConfig, setPaidContentConfig] = useState<PaidContentConfig>({
    enabled: false,
    currency: 'USD',
    paymentMethods: ['Credit Card'],
    priceTiers: [],
    rentalPeriod: 48,
    purchasePermanent: false,
  });

  const [showAntiBuffering, setShowAntiBuffering] = useState(false);
  const [antiBufferingConfig, setAntiBufferingConfig] = useState<AntiBufferingConfig>({
    enabled: true,
    adaptiveBitrate: true,
    prebufferSeconds: 5,
    networkPrediction: true,
    peerBoost: false,
    cacheSize: 512,
    prioritizeVideo: true,
    flickerReduction: true,
    frameSync: true,
  });

  // Subscription and compliance state
  const [showSubscription, setShowSubscription] = useState(false);
  const [currentPlan, setCurrentPlan] = useState('free');

  const [showCompliance, setShowCompliance] = useState(false);
  const [rtaConfig, setRtaConfig] = useState<RTAConfig>({
    enabled: true,
    ratingSystem: 'mpaa',
    requireVerification: true,
    blockUnderage: true,
    adultContentWarning: true,
    restrictedCategories: ['XXX', 'Adult'],
  });

  const [moderationConfig, setModerationConfig] = useState<ContentModerationConfig>({
    enabled: true,
    aiDetection: true,
    illegalContentBlock: true,
    csamDetection: true,
    violenceDetection: true,
    hateSpeechDetection: true,
    reportSystem: true,
    autoQuarantine: true,
    confidenceThreshold: 85,
  });

  const [childProtectionConfig, setChildProtectionConfig] = useState<ChildProtectionConfig>({
    enabled: true,
    parentalControls: true,
    kidProfiles: true,
    contentFiltering: true,
    timeLimits: false,
    activityMonitoring: true,
    blockChat: true,
    blockPurchases: true,
    requirePin: true,
  });

  const [showPlatform, setShowPlatform] = useState(false);
  const [platformConfig, setPlatformConfig] = useState<PlatformConfig>({
    ios: true,
    macos: true,
    android: true,
    windows: true,
    linux: true,
    pwa: true,
    offlineMode: true,
    pushNotifications: true,
  });

  // Admin payment and revenue state
  const [showAdminPayment, setShowAdminPayment] = useState(false);
  const [paymentConfig, setPaymentConfig] = useState<PaymentGatewayConfig>({
    stripe: null,
    paypal: null,
    crypto: null,
    activeGateway: 'none',
    testMode: true,
    webhooks: [],
  });

  const [showRevenueDashboard, setShowRevenueDashboard] = useState(false);
  const [revenueStats] = useState<RevenueStats>({
    totalRevenue: 12450,
    monthlyRecurringRevenue: 3240,
    activeSubscribers: 147,
    churnRate: 2.3,
    averageRevenuePerUser: 22.04,
    revenueByPlan: {
      free: 0,
      standard: 1188,
      premium: 1798,
      enterprise: 254,
    },
    revenueByMonth: [
      { month: 'Jan', revenue: 2100 },
      { month: 'Feb', revenue: 2450 },
      { month: 'Mar', revenue: 2780 },
      { month: 'Apr', revenue: 3120 },
      { month: 'May', revenue: 3240 },
    ],
  });

  const [transactions] = useState<Transaction[]>([
    {
      id: '1',
      userId: 'user1',
      userEmail: 'john@example.com',
      planId: 'premium',
      amount: 19.99,
      currency: 'USD',
      gateway: 'stripe',
      status: 'completed',
      createdAt: '2024-01-15T10:30:00Z',
      gatewayTransactionId: 'pi_1234567890',
    },
    {
      id: '2',
      userId: 'user2',
      userEmail: 'jane@example.com',
      planId: 'standard',
      amount: 9.99,
      currency: 'USD',
      gateway: 'paypal',
      status: 'completed',
      createdAt: '2024-01-14T15:20:00Z',
      gatewayTransactionId: 'PAY-1234567890',
    },
    {
      id: '3',
      userId: 'user3',
      userEmail: 'bob@example.com',
      planId: 'premium',
      amount: 19.99,
      currency: 'USD',
      gateway: 'stripe',
      status: 'pending',
      createdAt: '2024-01-14T09:15:00Z',
    },
  ]);

  // Notifications and activity state
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'download',
      title: 'Download Complete',
      message: 'Big Buck Bunny has finished downloading',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      read: false,
      priority: 'medium',
      icon: '⬇️',
    },
    {
      id: '2',
      type: 'ai',
      title: 'AI Insight',
      message: 'Your server health score improved by 5%',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      read: false,
      priority: 'low',
      icon: '🧠',
    },
    {
      id: '3',
      type: 'system',
      title: 'Update Available',
      message: 'StreamVault v2.1 is ready to install',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      read: true,
      priority: 'high',
      icon: '🔄',
    },
  ]);

  const [showActivity, setShowActivity] = useState(false);
  const [activities] = useState<ActivityItem[]>([
    {
      id: '1',
      type: 'download_complete',
      title: 'Download Complete',
      description: 'Big Buck Bunny (2008) finished downloading',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    },
    {
      id: '2',
      type: 'stream_start',
      title: 'Started Streaming',
      description: 'User started watching Sintel',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      user: 'John',
    },
    {
      id: '3',
      type: 'ai_action',
      title: 'AI Optimization',
      description: 'Auto-optimized download speeds',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
      id: '4',
      type: 'user_login',
      title: 'User Login',
      description: 'Jane logged in from new device',
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      user: 'Jane',
    },
  ]);

  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);

  // Notification handlers
  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  const handleQuickAction = (action: QuickAction) => {
    console.log('Quick action:', action);
    // Add notification for action
    const newNotification: Notification = {
      id: Date.now().toString(),
      type: 'system',
      title: 'Action Executed',
      message: `${action.label} completed successfully`,
      timestamp: new Date().toISOString(),
      read: false,
      priority: 'low',
      icon: action.icon,
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  // Simulate progress updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTorrents((prev) =>
        prev.map((t) => {
          if (t.status === 'downloading' && t.progress < 100) {
            const newProgress = Math.min(100, t.progress + Math.random() * 0.5);
            return {
              ...t,
              progress: Math.round(newProgress * 10) / 10,
              status: newProgress >= 100 ? 'completed' : 'downloading',
            };
          }
          return t;
        })
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Handle infrastructure panel events
  useEffect(() => {
    const handleOpenInfrastructure = (event: CustomEvent<string>) => {
      const panel = event.detail;
      switch (panel) {
        case 'vlc':
          setShowVLC(true);
          break;
        case 'clients':
          setShowTorrentClients(true);
          break;
        case 'speed':
          setShowSpeedOptimization(true);
          break;
        case 'seeding':
          setShowSeeding(true);
          break;
        case 'security':
          setShowSecurity(true);
          break;
        case 'vpn':
          setShowVPN(true);
          break;
        case 'media-hunter':
          setShowMediaHunter(true);
          break;
        case 'dlna':
          setShowDLNA(true);
          break;
        case 'troubleshooter':
          setShowTroubleshooter(true);
          break;
        case 'shuffle':
          setShowShuffle(true);
          break;
        case 'paid':
          setShowPaidViewing(true);
          break;
        case 'anti-buffering':
          setShowAntiBuffering(true);
          break;
        case 'subscription':
          setShowSubscription(true);
          break;
        case 'compliance':
          setShowCompliance(true);
          break;
        case 'platform':
          setShowPlatform(true);
          break;
        case 'admin-payment':
          setShowAdminPayment(true);
          break;
        case 'revenue':
          setShowRevenueDashboard(true);
          break;
      }
    };

    window.addEventListener('openInfrastructure', handleOpenInfrastructure as EventListener);
    return () => {
      window.removeEventListener('openInfrastructure', handleOpenInfrastructure as EventListener);
    };
  }, []);

  // Generate AI insights periodically
  useEffect(() => {
    const updateInsights = () => {
      const insights = generateAutoInsights(torrents, mockStats);
      setAiInsights(insights);
    };
    updateInsights();
    const interval = setInterval(updateInsights, 10000);
    return () => clearInterval(interval);
  }, [torrents]);

  const handleAIAction = (action: AIAction) => {
    // Handle AI actions - in a real app this would trigger actual operations
    console.log('AI Action triggered:', action);
  };

  const handleMediaPlay = (item: MediaItem) => {
    // Find corresponding torrent
    const torrent = torrents.find((t) => t.id === item.torrentId);
    if (torrent) {
      setStreamingTorrent(torrent);
      // Track watch history for current user
      addToWatchHistory({
        mediaId: item.id,
        watchedAt: new Date().toISOString(),
        progress: item.progress || 0,
        completed: (item.progress || 0) >= 100,
        duration: 0,
      });
    }
  };

  const handleMediaDetail = (item: MediaItem) => {
    setSelectedMedia(item);
  };

  const handleStream = (torrent: Torrent) => {
    setStreamingTorrent(torrent);
  };

  const renderView = () => {
    switch (currentView) {
      case 'home':
      case 'movies':
      case 'shows':
      case 'music':
      case 'continue':
      case 'favorites':
      case 'recent':
        return <MediaHome onPlay={handleMediaPlay} onDetail={handleMediaDetail} />;
      case 'dashboard':
        return <Dashboard stats={mockStats} torrents={torrents} />;
      case 'torrents':
        return <TorrentList torrents={torrents} onStream={handleStream} />;
      case 'streaming':
        return <StreamingView torrents={torrents} onStream={handleStream} />;
      case 'ai':
        return (
          <AIPanel
            torrents={torrents}
            stats={mockStats}
            insights={aiInsights}
            autoPilot={autoPilot}
            onToggleAutoPilot={() => setAutoPilot(!autoPilot)}
          />
        );
      case 'search':
        return <SearchView />;
      case 'files':
        return <FileBrowser torrents={torrents} />;
      case 'settings':
        return <SettingsView />;
      case 'deploy':
        return <DeployGuide />;
      default:
        return <MediaHome onPlay={handleMediaPlay} onDetail={handleMediaDetail} />;
    }
  };

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/3 rounded-full blur-3xl" />
      </div>

      {/* Sidebar */}
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        isConnected={isConnected}
      />

      {/* Main Content */}
      <main className="ml-60 relative z-10 min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-gradient-to-b from-gray-950 via-gray-950/95 to-transparent backdrop-blur-xl px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search movies, shows, music..."
                  className="w-80 px-4 py-2.5 pl-10 rounded-xl bg-gray-800/40 border border-gray-700/30 text-sm text-white placeholder-gray-500 outline-none focus:border-amber-500/50 focus:bg-gray-800/60 transition-all"
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* User Menu */}
              <UserMenu onOpenSettings={() => setCurrentView('settings')} />

              {/* Add Content Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-shadow"
              >
                <Plus className="w-4 h-4" />
                Add Content
              </motion.button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Stream Player Overlay */}
      <AnimatePresence>
        {streamingTorrent && (
          <StreamPlayer
            title={streamingTorrent.name}
            backdrop={streamingTorrent.thumbnail}
            onClose={() => setStreamingTorrent(null)}
          />
        )}
      </AnimatePresence>

      {/* Add Torrent Modal */}
      <AnimatePresence>
        {showAddModal && (
          <AddTorrentModal onClose={() => setShowAddModal(false)} />
        )}
      </AnimatePresence>

      {/* AI Agent Chat */}
      <AnimatePresence>
        {isAIAgentOpen && (
          <AIAgent
            isOpen={isAIAgentOpen}
            onClose={() => setIsAIAgentOpen(false)}
            torrents={torrents}
            stats={mockStats}
            onAction={handleAIAction}
          />
        )}
      </AnimatePresence>

      {/* AI Floating Button */}
      <AIFloatingButton
        onClick={() => setIsAIAgentOpen(true)}
        isOpen={isAIAgentOpen}
        torrents={torrents}
        stats={mockStats}
      />

      {/* Media Detail Modal */}
      <AnimatePresence>
        {selectedMedia && (
          <MediaDetail
            item={selectedMedia}
            onClose={() => setSelectedMedia(null)}
            onPlay={handleMediaPlay}
          />
        )}
      </AnimatePresence>

      {/* Group Theater */}
      <AnimatePresence>
        {showGroupTheater && theaterRoom && (
          <GroupTheater room={theaterRoom} onClose={() => setShowGroupTheater(false)} />
        )}
      </AnimatePresence>

      {/* Age Verification */}
      <AnimatePresence>
        {showAgeVerification && ageVerificationData && (
          <AgeVerification
            requiredAge={ageVerificationData.requiredAge}
            contentTitle={ageVerificationData.contentTitle}
            onVerify={(birthDate) => {
              ageVerificationData.onVerify();
              setShowAgeVerification(false);
              setAgeVerificationData(null);
            }}
            onCancel={() => {
              setShowAgeVerification(false);
              setAgeVerificationData(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Advanced Player Settings */}
      <AnimatePresence>
        {showAdvancedSettings && (
          <AdvancedPlayerSettings
            translation={translationConfig}
            latency={latencyConfig}
            dolby={dolbyConfig}
            onTranslationChange={setTranslationConfig}
            onLatencyChange={setLatencyConfig}
            onDolbyChange={setDolbyConfig}
            onClose={() => setShowAdvancedSettings(false)}
          />
        )}
      </AnimatePresence>

      {/* VLC Integration */}
      <AnimatePresence>
        {showVLC && (
          <VLCIntegration
            config={vlcConfig}
            onConfigChange={setVlcConfig}
            onClose={() => setShowVLC(false)}
          />
        )}
      </AnimatePresence>

      {/* Torrent Client Connectors */}
      <AnimatePresence>
        {showTorrentClients && (
          <TorrentClientConnectors
            clients={torrentClients}
            onClientsChange={setTorrentClients}
            onClose={() => setShowTorrentClients(false)}
          />
        )}
      </AnimatePresence>

      {/* Speed Optimization */}
      <AnimatePresence>
        {showSpeedOptimization && (
          <SpeedOptimizationPanel
            config={speedConfig}
            onConfigChange={setSpeedConfig}
            onClose={() => setShowSpeedOptimization(false)}
          />
        )}
      </AnimatePresence>

      {/* Seeding Management */}
      <AnimatePresence>
        {showSeeding && (
          <SeedingManagement
            config={seedingConfig}
            onConfigChange={setSeedingConfig}
            onClose={() => setShowSeeding(false)}
          />
        )}
      </AnimatePresence>

      {/* Security Settings */}
      <AnimatePresence>
        {showSecurity && (
          <SecuritySettings
            config={securityConfig}
            onConfigChange={setSecurityConfig}
            onClose={() => setShowSecurity(false)}
          />
        )}
      </AnimatePresence>

      {/* VPN Configuration */}
      <AnimatePresence>
        {showVPN && (
          <VPNConfiguration
            config={vpnConfig}
            onConfigChange={setVpnConfig}
            onClose={() => setShowVPN(false)}
          />
        )}
      </AnimatePresence>

      {/* Media Hunter */}
      <AnimatePresence>
        {showMediaHunter && (
          <MediaHunter
            config={mediaHunterConfig}
            onConfigChange={setMediaHunterConfig}
            onClose={() => setShowMediaHunter(false)}
          />
        )}
      </AnimatePresence>

      {/* DLNA Casting */}
      <AnimatePresence>
        {showDLNA && (
          <DLNACasting
            config={dlnaConfig}
            onConfigChange={setDlnaConfig}
            onClose={() => setShowDLNA(false)}
          />
        )}
      </AnimatePresence>

      {/* AI Troubleshooter */}
      <AnimatePresence>
        {showTroubleshooter && (
          <AITroubleshooter
            config={troubleshooterConfig}
            onConfigChange={setTroubleshooterConfig}
            onClose={() => setShowTroubleshooter(false)}
          />
        )}
      </AnimatePresence>

      {/* Shuffle Player */}
      <AnimatePresence>
        {showShuffle && (
          <ShufflePlayer
            config={shuffleConfig}
            onConfigChange={setShuffleConfig}
            onPlay={handleMediaPlay}
            onClose={() => setShowShuffle(false)}
          />
        )}
      </AnimatePresence>

      {/* Paid Viewing */}
      <AnimatePresence>
        {showPaidViewing && (
          <PaidViewing
            config={paidContentConfig}
            onConfigChange={setPaidContentConfig}
            onClose={() => setShowPaidViewing(false)}
          />
        )}
      </AnimatePresence>

      {/* Anti-Buffering Engine */}
      <AnimatePresence>
        {showAntiBuffering && (
          <AntiBufferingEngine
            config={antiBufferingConfig}
            onConfigChange={setAntiBufferingConfig}
            onClose={() => setShowAntiBuffering(false)}
          />
        )}
      </AnimatePresence>

      {/* Subscription Manager */}
      <AnimatePresence>
        {showSubscription && (
          <SubscriptionManager
            currentPlan={currentPlan}
            onPlanChange={setCurrentPlan}
            onClose={() => setShowSubscription(false)}
          />
        )}
      </AnimatePresence>

      {/* Compliance Settings */}
      <AnimatePresence>
        {showCompliance && (
          <ComplianceSettings
            rtaConfig={rtaConfig}
            moderationConfig={moderationConfig}
            childProtectionConfig={childProtectionConfig}
            onRTAChange={setRtaConfig}
            onModerationChange={setModerationConfig}
            onChildProtectionChange={setChildProtectionConfig}
            onClose={() => setShowCompliance(false)}
          />
        )}
      </AnimatePresence>

      {/* Platform Support */}
      <AnimatePresence>
        {showPlatform && (
          <PlatformSupport
            config={platformConfig}
            onClose={() => setShowPlatform(false)}
          />
        )}
      </AnimatePresence>

      {/* Admin Payment Configuration */}
      <AnimatePresence>
        {showAdminPayment && (
          <AdminPaymentConfig
            config={paymentConfig}
            onConfigChange={setPaymentConfig}
            onClose={() => setShowAdminPayment(false)}
          />
        )}
      </AnimatePresence>

      {/* Revenue Dashboard */}
      <AnimatePresence>
        {showRevenueDashboard && (
          <RevenueDashboard
            stats={revenueStats}
            transactions={transactions}
            onClose={() => setShowRevenueDashboard(false)}
          />
        )}
      </AnimatePresence>

      {/* Notifications Center */}
      <AnimatePresence>
        {showNotifications && (
          <NotificationsCenter
            notifications={notifications}
            onMarkAsRead={handleMarkNotificationAsRead}
            onMarkAllAsRead={handleMarkAllNotificationsAsRead}
            onDelete={handleDeleteNotification}
            onClearAll={handleClearAllNotifications}
            onClose={() => setShowNotifications(false)}
          />
        )}
      </AnimatePresence>

      {/* Activity Feed */}
      <AnimatePresence>
        {showActivity && (
          <ActivityFeed
            activities={activities}
            onClose={() => setShowActivity(false)}
          />
        )}
      </AnimatePresence>

      {/* Quick Actions Panel */}
      <AnimatePresence>
        {showQuickActions && (
          <QuickActionsPanel
            onAction={handleQuickAction}
            onClose={() => setShowQuickActions(false)}
          />
        )}
      </AnimatePresence>

      {/* Floating Actions */}
      <FloatingActions
        notifications={notifications}
        onOpenNotifications={() => setShowNotifications(true)}
        onOpenActivity={() => setShowActivity(true)}
        onOpenQuickActions={() => setShowQuickActions(true)}
      />

      {/* Keyboard Shortcuts */}
      <KeyboardShortcuts
        isOpen={showKeyboardShortcuts}
        onClose={() => setShowKeyboardShortcuts(false)}
      />
    </div>
  );
}

function AddTorrentModal({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'magnet' | 'file' | 'url'>('magnet');
  const [magnetLink, setMagnetLink] = useState('');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-gray-900 rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <h3 className="text-lg font-semibold text-white">Add Torrent</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-800">
          {[
            { id: 'magnet' as const, label: 'Magnet Link', icon: Link2 },
            { id: 'file' as const, label: 'Torrent File', icon: FileUp },
            { id: 'url' as const, label: 'URL', icon: Upload },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-emerald-400 border-b-2 border-emerald-400 bg-emerald-500/5'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-5">
          {activeTab === 'magnet' && (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Magnet Link</label>
                <textarea
                  value={magnetLink}
                  onChange={(e) => setMagnetLink(e.target.value)}
                  placeholder="magnet:?xt=urn:btih:..."
                  className="w-full h-28 px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white text-sm placeholder-gray-500 outline-none focus:border-emerald-500 resize-none transition-colors"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="sequential"
                  className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-emerald-500 focus:ring-emerald-500"
                />
                <label htmlFor="sequential" className="text-sm text-gray-400">
                  Download sequentially (for streaming)
                </label>
              </div>
            </div>
          )}
          {activeTab === 'file' && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center hover:border-emerald-500/50 transition-colors cursor-pointer">
                <FileUp className="w-10 h-10 text-gray-500 mx-auto mb-3" />
                <p className="text-sm text-gray-400">
                  Drag & drop a .torrent file here, or{' '}
                  <span className="text-emerald-400 cursor-pointer">browse</span>
                </p>
                <p className="text-xs text-gray-600 mt-1">Supports .torrent files</p>
              </div>
            </div>
          )}
          {activeTab === 'url' && (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Torrent URL</label>
                <input
                  type="text"
                  placeholder="https://example.com/file.torrent"
                  className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white text-sm placeholder-gray-500 outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-sm font-medium shadow-lg shadow-emerald-500/20"
          >
            Add Torrent
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default App;
