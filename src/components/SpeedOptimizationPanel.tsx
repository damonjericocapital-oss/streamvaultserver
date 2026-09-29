import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Zap, Clock, Plus, Trash2 } from 'lucide-react';
import { SpeedOptimization, SchedulerRule } from '../types/infrastructure';

interface SpeedOptimizationPanelProps {
  config: SpeedOptimization;
  onConfigChange: (config: SpeedOptimization) => void;
  onClose: () => void;
}

export default function SpeedOptimizationPanel({
  config,
  onConfigChange,
  onClose,
}: SpeedOptimizationPanelProps) {
  const [showScheduler, setShowScheduler] = useState(false);

  const handleAddRule = () => {
    const newRule: SchedulerRule = {
      id: Date.now().toString(),
      name: 'New Rule',
      startTime: '00:00',
      endTime: '23:59',
      days: [0, 1, 2, 3, 4, 5, 6],
      downloadLimit: 0,
      uploadLimit: 0,
      enabled: true,
    };
    onConfigChange({
      ...config,
      schedulerRules: [...config.schedulerRules, newRule],
    });
  };

  const handleUpdateRule = (id: string, updates: Partial<SchedulerRule>) => {
    onConfigChange({
      ...config,
      schedulerRules: config.schedulerRules.map((rule) =>
        rule.id === id ? { ...rule, ...updates } : rule
      ),
    });
  };

  const handleRemoveRule = (id: string) => {
    onConfigChange({
      ...config,
      schedulerRules: config.schedulerRules.filter((rule) => rule.id !== id),
    });
  };

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-24 right-6 z-50 w-[550px] bg-gray-900/98 backdrop-blur-2xl rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gradient-to-r from-emerald-500/5 to-cyan-500/5">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-emerald-400" />
          <div>
            <h3 className="text-sm font-semibold text-white">Speed Optimization</h3>
            <p className="text-xs text-gray-500">Manage transfer speeds and scheduling</p>
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
        {/* Speed Limits */}
        <div className="space-y-3">
          <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            Global Speed Limits
          </h4>

          {/* Download Speed */}
          <div>
            <label className="text-xs text-gray-400 mb-2 block">
              Max Download Speed: {config.maxDownloadSpeed === 0 ? 'Unlimited' : `${config.maxDownloadSpeed} MB/s`}
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={config.maxDownloadSpeed}
              onChange={(e) =>
                onConfigChange({ ...config, maxDownloadSpeed: Number(e.target.value) })
              }
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Unlimited (0)</span>
              <span>100 MB/s</span>
            </div>
          </div>

          {/* Upload Speed */}
          <div>
            <label className="text-xs text-gray-400 mb-2 block">
              Max Upload Speed: {config.maxUploadSpeed === 0 ? 'Unlimited' : `${config.maxUploadSpeed} MB/s`}
            </label>
            <input
              type="range"
              min="0"
              max="50"
              step="1"
              value={config.maxUploadSpeed}
              onChange={(e) =>
                onConfigChange({ ...config, maxUploadSpeed: Number(e.target.value) })
              }
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Unlimited (0)</span>
              <span>50 MB/s</span>
            </div>
          </div>
        </div>

        {/* Connection Limits */}
        <div className="space-y-3">
          <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            Connection Limits
          </h4>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-400 mb-2 block">Max Connections</label>
              <input
                type="number"
                value={config.maxConnections}
                onChange={(e) =>
                  onConfigChange({ ...config, maxConnections: Number(e.target.value) })
                }
                className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-2 block">Per Torrent</label>
              <input
                type="number"
                value={config.maxConnectionsPerTorrent}
                onChange={(e) =>
                  onConfigChange({
                    ...config,
                    maxConnectionsPerTorrent: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-400 mb-2 block">Upload Slots</label>
              <input
                type="number"
                value={config.maxUploadSlots}
                onChange={(e) =>
                  onConfigChange({ ...config, maxUploadSlots: Number(e.target.value) })
                }
                className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-2 block">Per Torrent</label>
              <input
                type="number"
                value={config.maxUploadSlotsPerTorrent}
                onChange={(e) =>
                  onConfigChange({
                    ...config,
                    maxUploadSlotsPerTorrent: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Queue Settings */}
        <div className="p-3 rounded-lg bg-gray-800/50">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-medium text-white">Enable Queueing</p>
              <p className="text-xs text-gray-500">Limit active transfers</p>
            </div>
            <button
              onClick={() =>
                onConfigChange({ ...config, enableQueueing: !config.enableQueueing })
              }
              className={`relative w-11 h-6 rounded-full transition-colors ${
                config.enableQueueing ? 'bg-emerald-500' : 'bg-gray-600'
              }`}
            >
              <motion.div
                animate={{ x: config.enableQueueing ? 20 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
              />
            </button>
          </div>

          {config.enableQueueing && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-400 mb-2 block">Max Active Downloads</label>
                <input
                  type="number"
                  value={config.maxActiveDownloads}
                  onChange={(e) =>
                    onConfigChange({
                      ...config,
                      maxActiveDownloads: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-2 block">Max Active Uploads</label>
                <input
                  type="number"
                  value={config.maxActiveUploads}
                  onChange={(e) =>
                    onConfigChange({ ...config, maxActiveUploads: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>
          )}
        </div>

        {/* Scheduler */}
        <div className="p-3 rounded-lg bg-gray-800/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <div>
                <p className="text-sm font-medium text-white">Speed Scheduler</p>
                <p className="text-xs text-gray-500">Set time-based speed limits</p>
              </div>
            </div>
            <button
              onClick={() =>
                onConfigChange({ ...config, schedulerEnabled: !config.schedulerEnabled })
              }
              className={`relative w-11 h-6 rounded-full transition-colors ${
                config.schedulerEnabled ? 'bg-emerald-500' : 'bg-gray-600'
              }`}
            >
              <motion.div
                animate={{ x: config.schedulerEnabled ? 20 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
              />
            </button>
          </div>

          {config.schedulerEnabled && (
            <div className="space-y-2">
              {config.schedulerRules.map((rule) => (
                <div key={rule.id} className="p-2 rounded-lg bg-gray-900/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={rule.name}
                      onChange={(e) => handleUpdateRule(rule.id, { name: e.target.value })}
                      className="flex-1 px-2 py-1 rounded bg-gray-800 border border-gray-700 text-white text-xs outline-none focus:border-emerald-500"
                    />
                    <button
                      onClick={() => handleRemoveRule(rule.id)}
                      className="p-1 rounded hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-gray-500">Start Time</label>
                      <input
                        type="time"
                        value={rule.startTime}
                        onChange={(e) => handleUpdateRule(rule.id, { startTime: e.target.value })}
                        className="w-full px-2 py-1 rounded bg-gray-800 border border-gray-700 text-white text-xs outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">End Time</label>
                      <input
                        type="time"
                        value={rule.endTime}
                        onChange={(e) => handleUpdateRule(rule.id, { endTime: e.target.value })}
                        className="w-full px-2 py-1 rounded bg-gray-800 border border-gray-700 text-white text-xs outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Days</label>
                    <div className="flex gap-1">
                      {days.map((day, index) => (
                        <button
                          key={day}
                          onClick={() => {
                            const newDays = rule.days.includes(index)
                              ? rule.days.filter((d) => d !== index)
                              : [...rule.days, index];
                            handleUpdateRule(rule.id, { days: newDays });
                          }}
                          className={`flex-1 px-1 py-1 rounded text-xs font-medium transition-colors ${
                            rule.days.includes(index)
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-gray-800 text-gray-500 border border-gray-700'
                          }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-gray-500">Download (MB/s)</label>
                      <input
                        type="number"
                        value={rule.downloadLimit}
                        onChange={(e) =>
                          handleUpdateRule(rule.id, { downloadLimit: Number(e.target.value) })
                        }
                        className="w-full px-2 py-1 rounded bg-gray-800 border border-gray-700 text-white text-xs outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Upload (MB/s)</label>
                      <input
                        type="number"
                        value={rule.uploadLimit}
                        onChange={(e) =>
                          handleUpdateRule(rule.id, { uploadLimit: Number(e.target.value) })
                        }
                        className="w-full px-2 py-1 rounded bg-gray-800 border border-gray-700 text-white text-xs outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={handleAddRule}
                className="w-full p-2 rounded-lg border-2 border-dashed border-gray-700 hover:border-emerald-500/50 text-gray-400 hover:text-emerald-400 transition-colors flex items-center justify-center gap-1 text-xs"
              >
                <Plus className="w-3 h-3" />
                Add Rule
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
