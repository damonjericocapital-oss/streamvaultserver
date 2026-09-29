import { motion } from 'framer-motion';
import { X, Zap, Shield, Activity, Cpu, Wifi } from 'lucide-react';
import { AntiBufferingConfig } from '../types/ecosystem';

interface AntiBufferingEngineProps {
  config: AntiBufferingConfig;
  onConfigChange: (config: AntiBufferingConfig) => void;
  onClose: () => void;
}

export default function AntiBufferingEngine({
  config,
  onConfigChange,
  onClose,
}: AntiBufferingEngineProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-24 right-6 z-50 w-[550px] bg-gray-900/98 backdrop-blur-2xl rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gradient-to-r from-emerald-500/5 to-teal-500/5">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-emerald-400" />
          <div>
            <h3 className="text-sm font-semibold text-white">Anti-Buffering Engine</h3>
            <p className="text-xs text-gray-500">Smart buffering & flicker reduction</p>
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
        {/* Enable Engine */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
          <div>
            <p className="text-sm font-medium text-white">Enable Anti-Buffering</p>
            <p className="text-xs text-gray-500">Smart buffering across ecosystem</p>
          </div>
          <button
            onClick={() => onConfigChange({ ...config, enabled: !config.enabled })}
            className={`relative w-11 h-6 rounded-full transition-colors ${
              config.enabled ? 'bg-emerald-500' : 'bg-gray-600'
            }`}
          >
            <motion.div
              animate={{ x: config.enabled ? 20 : 2 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
            />
          </button>
        </div>

        {config.enabled && (
          <>
            {/* Status */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-center">
                <Activity className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                <p className="text-xs text-gray-400">Buffer</p>
                <p className="text-sm font-bold text-emerald-400">Optimal</p>
              </div>
              <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-center">
                <Wifi className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
                <p className="text-xs text-gray-400">Network</p>
                <p className="text-sm font-bold text-cyan-400">Stable</p>
              </div>
              <div className="p-3 rounded-lg bg-violet-500/10 border border-violet-500/20 text-center">
                <Cpu className="w-5 h-5 text-violet-400 mx-auto mb-1" />
                <p className="text-xs text-gray-400">CPU</p>
                <p className="text-sm font-bold text-violet-400">Normal</p>
              </div>
            </div>

            {/* Adaptive Bitrate */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
              <div>
                <p className="text-sm font-medium text-white">Adaptive Bitrate</p>
                <p className="text-xs text-gray-500">Auto-adjust quality based on network</p>
              </div>
              <button
                onClick={() =>
                  onConfigChange({ ...config, adaptiveBitrate: !config.adaptiveBitrate })
                }
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  config.adaptiveBitrate ? 'bg-emerald-500' : 'bg-gray-600'
                }`}
              >
                <motion.div
                  animate={{ x: config.adaptiveBitrate ? 20 : 2 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                />
              </button>
            </div>

            {/* Prebuffer */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block">
                Prebuffer: {config.prebufferSeconds}s
              </label>
              <input
                type="range"
                min="1"
                max="30"
                value={config.prebufferSeconds}
                onChange={(e) =>
                  onConfigChange({ ...config, prebufferSeconds: Number(e.target.value) })
                }
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Low latency (1s)</span>
                <span>Smooth playback (30s)</span>
              </div>
            </div>

            {/* Cache Size */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block">
                Cache Size: {config.cacheSize} MB
              </label>
              <input
                type="range"
                min="64"
                max="2048"
                step="64"
                value={config.cacheSize}
                onChange={(e) =>
                  onConfigChange({ ...config, cacheSize: Number(e.target.value) })
                }
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>64 MB</span>
                <span>2 GB</span>
              </div>
            </div>

            {/* Advanced Features */}
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                Advanced Features
              </h4>

              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
                <div>
                  <p className="text-sm font-medium text-white">Network Prediction</p>
                  <p className="text-xs text-gray-500">Predict and pre-fetch content</p>
                </div>
                <button
                  onClick={() =>
                    onConfigChange({
                      ...config,
                      networkPrediction: !config.networkPrediction,
                    })
                  }
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    config.networkPrediction ? 'bg-emerald-500' : 'bg-gray-600'
                  }`}
                >
                  <motion.div
                    animate={{ x: config.networkPrediction ? 20 : 2 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
                <div>
                  <p className="text-sm font-medium text-white">Peer Boost</p>
                  <p className="text-xs text-gray-500">Use P2P to speed up streaming</p>
                </div>
                <button
                  onClick={() =>
                    onConfigChange({ ...config, peerBoost: !config.peerBoost })
                  }
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    config.peerBoost ? 'bg-emerald-500' : 'bg-gray-600'
                  }`}
                >
                  <motion.div
                    animate={{ x: config.peerBoost ? 20 : 2 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
                <div>
                  <p className="text-sm font-medium text-white">Prioritize Video</p>
                  <p className="text-xs text-gray-500">Download video before audio/subs</p>
                </div>
                <button
                  onClick={() =>
                    onConfigChange({ ...config, prioritizeVideo: !config.prioritizeVideo })
                  }
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    config.prioritizeVideo ? 'bg-emerald-500' : 'bg-gray-600'
                  }`}
                >
                  <motion.div
                    animate={{ x: config.prioritizeVideo ? 20 : 2 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
                <div>
                  <p className="text-sm font-medium text-white">Flicker Reduction</p>
                  <p className="text-xs text-gray-500">Eliminate visual flickering</p>
                </div>
                <button
                  onClick={() =>
                    onConfigChange({
                      ...config,
                      flickerReduction: !config.flickerReduction,
                    })
                  }
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    config.flickerReduction ? 'bg-emerald-500' : 'bg-gray-600'
                  }`}
                >
                  <motion.div
                    animate={{ x: config.flickerReduction ? 20 : 2 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
                <div>
                  <p className="text-sm font-medium text-white">Frame Sync</p>
                  <p className="text-xs text-gray-500">Synchronize frames to display</p>
                </div>
                <button
                  onClick={() =>
                    onConfigChange({ ...config, frameSync: !config.frameSync })
                  }
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    config.frameSync ? 'bg-emerald-500' : 'bg-gray-600'
                  }`}
                >
                  <motion.div
                    animate={{ x: config.frameSync ? 20 : 2 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                  />
                </button>
              </div>
            </div>

            {/* Info */}
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <div className="flex items-start gap-2">
                <Zap className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-300">
                  <p className="font-semibold mb-1">Smart Buffering Active</p>
                  <p className="text-gray-400">
                    The anti-buffering engine monitors your network conditions in real-time and
                    dynamically adjusts buffer size, pre-fetching, and quality to ensure smooth
                    playback without interruptions.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
