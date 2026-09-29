import { motion } from 'framer-motion';
import {
  Home,
  Film,
  Tv,
  Music,
  Play,
  Search,
  Settings,
  FolderOpen,
  Zap,
  Wifi,
  WifiOff,
  Brain,
  Download,
  Sparkles,
  Clock,
  Heart,
} from 'lucide-react';
import { ViewType } from '../types';

interface SidebarProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  isConnected: boolean;
}

const mainNavItems: { id: ViewType; label: string; icon: React.ElementType }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'movies', label: 'Movies', icon: Film },
  { id: 'shows', label: 'TV Shows', icon: Tv },
  { id: 'music', label: 'Music', icon: Music },
];

const libraryNavItems: { id: ViewType; label: string; icon: React.ElementType }[] = [
  { id: 'continue', label: 'Continue Watching', icon: Clock },
  { id: 'favorites', label: 'Watchlist', icon: Heart },
  { id: 'recent', label: 'Recently Added', icon: Sparkles },
];

const systemNavItems: { id: ViewType; label: string; icon: React.ElementType }[] = [
  { id: 'ai', label: 'NEXUS AI', icon: Brain },
  { id: 'torrents', label: 'Downloads', icon: Download },
  { id: 'search', label: 'Search', icon: Search },
  { id: 'files', label: 'Files', icon: FolderOpen },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ currentView, setCurrentView, isConnected }: SidebarProps) {
  return (
    <motion.aside
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="w-60 bg-gray-950/98 backdrop-blur-xl border-r border-gray-800/50 flex flex-col h-screen fixed left-0 top-0 z-50"
    >
      {/* Logo */}
      <div className="p-5 border-b border-gray-800/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Play className="w-5 h-5 text-white fill-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight">StreamVault</h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Smart Media Server</p>
          </div>
        </div>
      </div>

      {/* Connection Status */}
      <div className="px-3 py-2 mx-3 mt-3 rounded-lg bg-gray-800/30 border border-gray-800/50">
        <div className="flex items-center gap-2">
          {isConnected ? (
            <>
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs text-emerald-400 font-medium">Connected</span>
              <span className="ml-auto text-[10px] text-gray-600 font-mono">40.8 MB/s</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5 text-red-400" />
              <span className="text-xs text-red-400 font-medium">Offline</span>
            </>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-6 overflow-y-auto">
        {/* Main Library */}
        <div>
          <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider px-3 mb-2">Library</p>
          <div className="space-y-0.5">
            {mainNavItems.map((item) => (
              <NavItem key={item.id} item={item} currentView={currentView} setCurrentView={setCurrentView} />
            ))}
          </div>
        </div>

        {/* Smart Lists */}
        <div>
          <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider px-3 mb-2">Smart Lists</p>
          <div className="space-y-0.5">
            {libraryNavItems.map((item) => (
              <NavItem key={item.id} item={item} currentView={currentView} setCurrentView={setCurrentView} />
            ))}
          </div>
        </div>

        {/* System */}
        <div>
          <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider px-3 mb-2">System</p>
          <div className="space-y-0.5">
            {systemNavItems.map((item) => (
              <NavItem key={item.id} item={item} currentView={currentView} setCurrentView={setCurrentView} />
            ))}
          </div>
        </div>
      </nav>

      {/* Bottom Stats */}
      <div className="p-3 border-t border-gray-800/50">
        <div className="flex items-center justify-between text-[10px] text-gray-600 px-2">
          <span>9 titles • 45.2 GB</span>
          <span className="flex items-center gap-1">
            <Zap className="w-2.5 h-2.5 text-emerald-500" />
            P2P Active
          </span>
        </div>
      </div>
    </motion.aside>
  );
}

function NavItem({
  item,
  currentView,
  setCurrentView,
}: {
  item: { id: ViewType; label: string; icon: React.ElementType };
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
}) {
  const isActive = currentView === item.id;
  const Icon = item.icon;

  return (
    <motion.button
      whileHover={{ x: 2 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setCurrentView(item.id)}
      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
        isActive
          ? 'bg-gradient-to-r from-amber-500/10 to-orange-500/5 text-amber-400 border border-amber-500/20'
          : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
      }`}
    >
      <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : ''}`} />
      {item.label}
      {item.id === 'ai' && (
        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
      )}
    </motion.button>
  );
}
