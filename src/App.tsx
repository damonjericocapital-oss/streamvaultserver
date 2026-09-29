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
import { ViewType, Torrent } from './types';
import { AIAction, AIInsight } from './types/ai';
import { mockTorrents, mockStats } from './data/mockData';
import { generateAutoInsights } from './engine/aiEngine';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [torrents, setTorrents] = useState<Torrent[]>(mockTorrents);
  const [streamingTorrent, setStreamingTorrent] = useState<Torrent | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [isAIAgentOpen, setIsAIAgentOpen] = useState(false);
  const [autoPilot, setAutoPilot] = useState(false);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);

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

  const handleStream = (torrent: Torrent) => {
    setStreamingTorrent(torrent);
  };

  const renderView = () => {
    switch (currentView) {
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
      default:
        return <Dashboard stats={mockStats} torrents={torrents} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-500/3 rounded-full blur-3xl" />
      </div>

      {/* Sidebar */}
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        isConnected={isConnected}
      />

      {/* Main Content */}
      <main className="ml-64 relative z-10 min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/50 px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Quick search torrents..."
                  className="w-72 px-4 py-2 pl-10 rounded-xl bg-gray-800/50 border border-gray-700/50 text-sm text-white placeholder-gray-500 outline-none focus:border-emerald-500/50 transition-colors"
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
              {/* Speed Indicator */}
              <div className="flex items-center gap-4 px-4 py-2 rounded-xl bg-gray-800/50 border border-gray-700/50">
                <div className="flex items-center gap-1.5">
                  <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" />
                  </svg>
                  <span className="text-xs font-mono text-emerald-400">40.8 MB/s</span>
                </div>
                <div className="w-px h-4 bg-gray-700" />
                <div className="flex items-center gap-1.5">
                  <svg className="w-3 h-3 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 112 0v11.586l2.293-2.293a1 1 0 011.414 0z" />
                  </svg>
                  <span className="text-xs font-mono text-cyan-400">6.76 MB/s</span>
                </div>
              </div>

              {/* Add Torrent Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-sm font-medium shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-shadow"
              >
                <Plus className="w-4 h-4" />
                Add Torrent
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
          <StreamPlayer torrent={streamingTorrent} onClose={() => setStreamingTorrent(null)} />
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
