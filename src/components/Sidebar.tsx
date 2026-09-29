import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Download,
  Play,
  Search,
  Settings,
  FolderOpen,
  Zap,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { ViewType } from '../types';

interface SidebarProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  isConnected: boolean;
}

const navItems: { id: ViewType; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'torrents', label: 'Torrents', icon: Download },
  { id: 'streaming', label: 'Stream', icon: Play },
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
      className="w-64 bg-gray-900/95 backdrop-blur-xl border-r border-gray-800 flex flex-col h-screen fixed left-0 top-0 z-50"
    >
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">StreamTorrent</h1>
            <p className="text-xs text-gray-400">Ultimate Server v3.0</p>
          </div>
        </div>
      </div>

      {/* Connection Status */}
      <div className="px-4 py-3 mx-4 mt-4 rounded-lg bg-gray-800/50 border border-gray-700/50">
        <div className="flex items-center gap-2">
          {isConnected ? (
            <>
              <Wifi className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-emerald-400 font-medium">Connected</span>
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4 text-red-400" />
              <span className="text-sm text-red-400 font-medium">Disconnected</span>
            </>
          )}
        </div>
        <div className="mt-1 text-xs text-gray-500">
          {isConnected ? 'DHT: Active • PeX: On' : 'Attempting reconnection...'}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          const Icon = item.icon;
          return (
            <motion.button
              key={item.id}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/10 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-500/5'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400"
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Bottom Stats */}
      <div className="p-4 border-t border-gray-800">
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">↓ Download</span>
            <span className="text-emerald-400 font-mono">40.8 MB/s</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">↑ Upload</span>
            <span className="text-cyan-400 font-mono">6.76 MB/s</span>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
