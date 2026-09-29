import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Folder, Cloud, Plus, Trash2, RefreshCw, Check, Search } from 'lucide-react';
import { MediaHunterConfig, ScanPath, CloudProvider, CLOUD_PROVIDERS } from '../types/ecosystem';

interface MediaHunterProps {
  config: MediaHunterConfig;
  onConfigChange: (config: MediaHunterConfig) => void;
  onClose: () => void;
}

export default function MediaHunter({ config, onConfigChange, onClose }: MediaHunterProps) {
  const [scanning, setScanning] = useState(false);
  const [newPath, setNewPath] = useState('');
  const [newPathName, setNewPathName] = useState('');

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      const updatedPaths = config.localPaths.map((p) => ({
        ...p,
        lastScanned: new Date().toISOString(),
        fileCount: Math.floor(Math.random() * 500) + 100,
      }));
      onConfigChange({
        ...config,
        localPaths: updatedPaths,
        lastScan: new Date().toISOString(),
        totalFiles: updatedPaths.reduce((sum, p) => sum + p.fileCount, 0),
      });
      setScanning(false);
    }, 2000);
  };

  const handleAddPath = () => {
    if (!newPath) return;
    const newPathObj: ScanPath = {
      id: Date.now().toString(),
      path: newPath,
      name: newPathName || newPath.split('/').pop() || 'New Folder',
      enabled: true,
      recursive: true,
      fileCount: 0,
    };
    onConfigChange({
      ...config,
      localPaths: [...config.localPaths, newPathObj],
    });
    setNewPath('');
    setNewPathName('');
  };

  const handleRemovePath = (id: string) => {
    onConfigChange({
      ...config,
      localPaths: config.localPaths.filter((p) => p.id !== id),
    });
  };

  const handleConnectCloud = (provider: CloudProvider) => {
    const updatedProviders = config.cloudProviders.map((p) =>
      p.id === provider.id ? { ...p, connected: true, lastSync: new Date().toISOString() } : p
    );
    onConfigChange({ ...config, cloudProviders: updatedProviders });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-24 right-6 z-50 w-[600px] bg-gray-900/98 backdrop-blur-2xl rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gradient-to-r from-blue-500/5 to-purple-500/5">
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-blue-400" />
          <div>
            <h3 className="text-sm font-semibold text-white">Media Hunter</h3>
            <p className="text-xs text-gray-500">Discover media across local & cloud storage</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-center">
            <p className="text-2xl font-bold text-blue-400">{config.totalFiles}</p>
            <p className="text-xs text-gray-500">Total Files</p>
          </div>
          <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20 text-center">
            <p className="text-2xl font-bold text-purple-400">{config.localPaths.length}</p>
            <p className="text-xs text-gray-500">Local Paths</p>
          </div>
          <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-center">
            <p className="text-2xl font-bold text-cyan-400">
              {config.cloudProviders.filter((p) => p.connected).length}
            </p>
            <p className="text-xs text-gray-500">Cloud Providers</p>
          </div>
        </div>

        {/* Local Paths */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <Folder className="w-3 h-3" />
              Local Media Paths
            </h4>
            <button
              onClick={handleScan}
              disabled={scanning}
              className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${scanning ? 'animate-spin' : ''}`} />
              {scanning ? 'Scanning...' : 'Scan All'}
            </button>
          </div>

          <div className="space-y-2">
            {config.localPaths.map((path) => (
              <motion.div
                key={path.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-3 rounded-lg bg-gray-800/50 border border-gray-700/50"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{path.name}</p>
                    <p className="text-xs text-gray-500 font-mono">{path.path}</p>
                  </div>
                  <button
                    onClick={() => handleRemovePath(path.id)}
                    className="p-1 rounded hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span>{path.fileCount} files</span>
                  {path.lastScanned && (
                    <span>Last scan: {new Date(path.lastScanned).toLocaleDateString()}</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Add New Path */}
          <div className="mt-3 p-3 rounded-lg bg-gray-800/30 border border-dashed border-gray-700">
            <div className="space-y-2">
              <input
                type="text"
                value={newPathName}
                onChange={(e) => setNewPathName(e.target.value)}
                placeholder="Folder name (e.g., Movies)"
                className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm outline-none focus:border-blue-500 transition-colors"
              />
              <input
                type="text"
                value={newPath}
                onChange={(e) => setNewPath(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddPath()}
                placeholder="/path/to/media/folder"
                className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm outline-none focus:border-blue-500 transition-colors"
              />
              <button
                onClick={handleAddPath}
                disabled={!newPath}
                className="w-full px-3 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Path
              </button>
            </div>
          </div>
        </div>

        {/* Cloud Providers */}
        <div>
          <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
            <Cloud className="w-3 h-3" />
            Cloud Storage
          </h4>

          <div className="grid grid-cols-2 gap-2">
            {CLOUD_PROVIDERS.map((provider) => {
              const connected = config.cloudProviders.find(
                (p) => p.type === provider.type && p.connected
              );
              return (
                <motion.button
                  key={provider.type}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    const existing = config.cloudProviders.find((p) => p.type === provider.type);
                    if (existing) {
                      handleConnectCloud(existing);
                    } else {
                      const newProvider: CloudProvider = {
                        id: Date.now().toString(),
                        type: provider.type as CloudProvider['type'],
                        name: provider.name,
                        connected: true,
                        fileCount: Math.floor(Math.random() * 200),
                        lastSync: new Date().toISOString(),
                      };
                      onConfigChange({
                        ...config,
                        cloudProviders: [...config.cloudProviders, newProvider],
                      });
                    }
                  }}
                  className={`p-3 rounded-lg text-left transition-all ${
                    connected
                      ? 'bg-emerald-500/10 border border-emerald-500/30'
                      : 'bg-gray-800/50 border border-gray-700/50 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{provider.icon}</span>
                    <span className="text-sm font-medium text-white">{provider.name}</span>
                  </div>
                  {connected ? (
                    <div className="flex items-center gap-1 text-xs text-emerald-400">
                      <Check className="w-3 h-3" />
                      <span>Connected</span>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500">Click to connect</p>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Auto Scan */}
        <div className="p-3 rounded-lg bg-gray-800/50">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-sm font-medium text-white">Auto-Scan</p>
              <p className="text-xs text-gray-500">Automatically scan for new media</p>
            </div>
            <button
              onClick={() => onConfigChange({ ...config, autoScan: !config.autoScan })}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                config.autoScan ? 'bg-blue-500' : 'bg-gray-600'
              }`}
            >
              <motion.div
                animate={{ x: config.autoScan ? 20 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
              />
            </button>
          </div>
          {config.autoScan && (
            <div>
              <label className="text-xs text-gray-400 mb-1 block">
                Scan Interval: {config.scanInterval} minutes
              </label>
              <input
                type="range"
                min="5"
                max="1440"
                step="5"
                value={config.scanInterval}
                onChange={(e) =>
                  onConfigChange({ ...config, scanInterval: Number(e.target.value) })
                }
                className="w-full"
              />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
