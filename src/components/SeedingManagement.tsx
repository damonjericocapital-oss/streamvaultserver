import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, Plus, Trash2, Copy } from 'lucide-react';
import { SeedingConfig } from '../types/infrastructure';

interface SeedingManagementProps {
  config: SeedingConfig;
  onConfigChange: (config: SeedingConfig) => void;
  onClose: () => void;
}

export default function SeedingManagement({ config, onConfigChange, onClose }: SeedingManagementProps) {
  const [newTracker, setNewTracker] = useState('');

  const handleAddTracker = () => {
    if (!newTracker.trim()) return;
    onConfigChange({
      ...config,
      trackerList: [...config.trackerList, newTracker.trim()],
    });
    setNewTracker('');
  };

  const handleRemoveTracker = (index: number) => {
    onConfigChange({
      ...config,
      trackerList: config.trackerList.filter((_, i) => i !== index),
    });
  };

  const handleCopyTrackers = () => {
    navigator.clipboard.writeText(config.trackerList.join('\n'));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-24 right-6 z-50 w-[550px] bg-gray-900/98 backdrop-blur-2xl rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gradient-to-r from-cyan-500/5 to-blue-500/5">
        <div className="flex items-center gap-2">
          <Upload className="w-5 h-5 text-cyan-400" />
          <div>
            <h3 className="text-sm font-semibold text-white">Seeding Management</h3>
            <p className="text-xs text-gray-500">Control seeding behavior and ratios</p>
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
        {/* Ratio & Time Limits */}
        <div className="space-y-3">
          <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            Default Limits
          </h4>

          <div>
            <label className="text-xs text-gray-400 mb-2 block">
              Share Ratio Limit: {config.defaultRatio === 0 ? 'Unlimited' : config.defaultRatio}
            </label>
            <input
              type="range"
              min="0"
              max="10"
              step="0.1"
              value={config.defaultRatio}
              onChange={(e) =>
                onConfigChange({ ...config, defaultRatio: Number(e.target.value) })
              }
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Unlimited (0)</span>
              <span>10.0</span>
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-2 block">
              Seed Time Limit: {config.defaultSeedTime === 0 ? 'Unlimited' : `${config.defaultSeedTime} minutes`}
            </label>
            <input
              type="range"
              min="0"
              max="10080"
              step="60"
              value={config.defaultSeedTime}
              onChange={(e) =>
                onConfigChange({ ...config, defaultSeedTime: Number(e.target.value) })
              }
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Unlimited (0)</span>
              <span>7 days</span>
            </div>
          </div>
        </div>

        {/* Action on Complete */}
        <div>
          <label className="text-xs text-gray-400 mb-2 block">When Seeding Completes</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: 'pause', label: 'Pause' },
              { value: 'remove', label: 'Remove Torrent' },
              { value: 'remove_torrent', label: 'Remove .torrent' },
              { value: 'remove_all', label: 'Remove All' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() =>
                  onConfigChange({
                    ...config,
                    actionOnComplete: option.value as SeedingConfig['actionOnComplete'],
                  })
                }
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  config.actionOnComplete === option.value
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'bg-gray-800 text-gray-300 border border-gray-700 hover:border-gray-600'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Advanced Options */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            Advanced Options
          </h4>

          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
            <div>
              <p className="text-sm font-medium text-white">Super Seeding Mode</p>
              <p className="text-xs text-gray-500">Optimize initial seeding</p>
            </div>
            <button
              onClick={() =>
                onConfigChange({ ...config, enableSuperSeeding: !config.enableSuperSeeding })
              }
              className={`relative w-11 h-6 rounded-full transition-colors ${
                config.enableSuperSeeding ? 'bg-cyan-500' : 'bg-gray-600'
              }`}
            >
              <motion.div
                animate={{ x: config.enableSuperSeeding ? 20 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
            <div>
              <p className="text-sm font-medium text-white">Sequential Download</p>
              <p className="text-xs text-gray-500">Download pieces in order</p>
            </div>
            <button
              onClick={() =>
                onConfigChange({
                  ...config,
                  sequentialDownload: !config.sequentialDownload,
                })
              }
              className={`relative w-11 h-6 rounded-full transition-colors ${
                config.sequentialDownload ? 'bg-cyan-500' : 'bg-gray-600'
              }`}
            >
              <motion.div
                animate={{ x: config.sequentialDownload ? 20 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
            <div>
              <p className="text-sm font-medium text-white">First/Last Piece Priority</p>
              <p className="text-xs text-gray-500">Prioritize first and last pieces</p>
            </div>
            <button
              onClick={() =>
                onConfigChange({
                  ...config,
                  firstLastPiecePriority: !config.firstLastPiecePriority,
                })
              }
              className={`relative w-11 h-6 rounded-full transition-colors ${
                config.firstLastPiecePriority ? 'bg-cyan-500' : 'bg-gray-600'
              }`}
            >
              <motion.div
                animate={{ x: config.firstLastPiecePriority ? 20 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
            <div>
              <p className="text-sm font-medium text-white">Auto-Add Trackers</p>
              <p className="text-xs text-gray-500">Add trackers from list to new torrents</p>
            </div>
            <button
              onClick={() =>
                onConfigChange({
                  ...config,
                  autoAddTrackers: !config.autoAddTrackers,
                })
              }
              className={`relative w-11 h-6 rounded-full transition-colors ${
                config.autoAddTrackers ? 'bg-cyan-500' : 'bg-gray-600'
              }`}
            >
              <motion.div
                animate={{ x: config.autoAddTrackers ? 20 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
              />
            </button>
          </div>
        </div>

        {/* Tracker List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Tracker List ({config.trackerList.length})
            </h4>
            <button
              onClick={handleCopyTrackers}
              className="p-1 rounded hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
              title="Copy all trackers"
            >
              <Copy className="w-3 h-3" />
            </button>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newTracker}
              onChange={(e) => setNewTracker(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTracker()}
              placeholder="udp://tracker.example.com:80"
              className="flex-1 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm outline-none focus:border-cyan-500 transition-colors"
            />
            <button
              onClick={handleAddTracker}
              disabled={!newTracker.trim()}
              className="px-3 py-2 rounded-lg bg-cyan-500 text-white text-sm font-medium hover:bg-cyan-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1 max-h-40 overflow-y-auto">
            {config.trackerList.length === 0 ? (
              <p className="text-center py-4 text-xs text-gray-500">No trackers added</p>
            ) : (
              config.trackerList.map((tracker, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded-lg bg-gray-800/50 group"
                >
                  <span className="text-xs text-gray-300 truncate flex-1">{tracker}</span>
                  <button
                    onClick={() => handleRemoveTracker(index)}
                    className="p-1 rounded hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
            <p className="text-xs text-cyan-400 mb-1">💡 Popular Trackers</p>
            <p className="text-xs text-gray-400">
              Add public trackers to improve peer discovery. Common trackers include
              udp://tracker.opentrackr.org:1337, udp://open.stealth.si:80, and
              udp://tracker.tiny-vps.com:6969.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
