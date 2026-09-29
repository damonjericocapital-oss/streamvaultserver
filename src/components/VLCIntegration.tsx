import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Settings, Folder, Check, AlertCircle } from 'lucide-react';
import { VLCConfig } from '../types/infrastructure';

interface VLCIntegrationProps {
  config: VLCConfig;
  onConfigChange: (config: VLCConfig) => void;
  onClose: () => void;
}

export default function VLCIntegration({ config, onConfigChange, onClose }: VLCIntegrationProps) {
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);

  const handleTestVLC = async () => {
    setTesting(true);
    setTestResult(null);
    
    // Simulate VLC detection
    setTimeout(() => {
      setTesting(false);
      setTestResult(config.path ? 'success' : 'error');
    }, 1500);
  };

  const handleLaunchVLC = (streamUrl: string) => {
    // In production, this would launch VLC with the stream URL
    console.log('Launching VLC with:', streamUrl);
    console.log('VLC Path:', config.path);
    console.log('Custom args:', config.customArgs);
    
    // Simulate launch
    alert(`VLC would launch with:\n${streamUrl}\n\nPath: ${config.path}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-24 right-6 z-50 w-[500px] bg-gray-900/98 backdrop-blur-2xl rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gradient-to-r from-orange-500/5 to-red-500/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
            <span className="text-lg">🔶</span>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">VLC Integration</h3>
            <p className="text-xs text-gray-500">Advanced playback with VLC Player</p>
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
        {/* Enable VLC */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
          <div>
            <p className="text-sm font-medium text-white">Enable VLC Integration</p>
            <p className="text-xs text-gray-500">Use VLC for all media playback</p>
          </div>
          <button
            onClick={() => onConfigChange({ ...config, enabled: !config.enabled })}
            className={`relative w-11 h-6 rounded-full transition-colors ${
              config.enabled ? 'bg-orange-500' : 'bg-gray-600'
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
            {/* VLC Path */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block">VLC Executable Path</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={config.path}
                  onChange={(e) => onConfigChange({ ...config, path: e.target.value })}
                  placeholder="/usr/bin/vlc or C:\Program Files\VideoLAN\VLC\vlc.exe"
                  className="flex-1 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm outline-none focus:border-orange-500 transition-colors"
                />
                <button className="px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors">
                  <Folder className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Common paths: /usr/bin/vlc (Linux), /Applications/VLC.app/Contents/MacOS/VLC (macOS)
              </p>
            </div>

            {/* Test Connection */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleTestVLC}
                disabled={testing}
                className="flex-1 px-4 py-2 rounded-lg bg-orange-500/20 text-orange-400 text-sm font-medium hover:bg-orange-500/30 transition-colors disabled:opacity-50"
              >
                {testing ? 'Testing...' : 'Test VLC Installation'}
              </button>
              <AnimatePresence>
                {testResult && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm ${
                      testResult === 'success'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {testResult === 'success' ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Found</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4" />
                        <span>Not Found</span>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Hardware Acceleration */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
              <div>
                <p className="text-sm font-medium text-white">Hardware Acceleration</p>
                <p className="text-xs text-gray-500">Use GPU for video decoding</p>
              </div>
              <button
                onClick={() =>
                  onConfigChange({ ...config, hardwareAcceleration: !config.hardwareAcceleration })
                }
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  config.hardwareAcceleration ? 'bg-orange-500' : 'bg-gray-600'
                }`}
              >
                <motion.div
                  animate={{ x: config.hardwareAcceleration ? 20 : 2 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                />
              </button>
            </div>

            {/* Network Caching */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block">
                Network Caching: {config.networkCaching}ms
              </label>
              <input
                type="range"
                min="300"
                max="10000"
                step="100"
                value={config.networkCaching}
                onChange={(e) =>
                  onConfigChange({ ...config, networkCaching: Number(e.target.value) })
                }
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Low latency (300ms)</span>
                <span>Smooth playback (10s)</span>
              </div>
            </div>

            {/* Sync Offsets */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-400 mb-2 block">
                  Audio Sync: {config.audioSync}ms
                </label>
                <input
                  type="range"
                  min="-500"
                  max="500"
                  step="10"
                  value={config.audioSync}
                  onChange={(e) =>
                    onConfigChange({ ...config, audioSync: Number(e.target.value) })
                  }
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-2 block">
                  Subtitle Sync: {config.subtitleSync}ms
                </label>
                <input
                  type="range"
                  min="-500"
                  max="500"
                  step="10"
                  value={config.subtitleSync}
                  onChange={(e) =>
                    onConfigChange({ ...config, subtitleSync: Number(e.target.value) })
                  }
                  className="w-full"
                />
              </div>
            </div>

            {/* Custom Arguments */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block">Custom VLC Arguments</label>
              <textarea
                value={config.customArgs.join('\n')}
                onChange={(e) =>
                  onConfigChange({ ...config, customArgs: e.target.value.split('\n') })
                }
                placeholder="--no-video-title-show&#10;--qt-start-minimized"
                rows={3}
                className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm outline-none focus:border-orange-500 transition-colors resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">One argument per line</p>
            </div>

            {/* Quick Launch */}
            <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
              <p className="text-xs text-orange-400 mb-2">Quick Launch Example</p>
              <button
                onClick={() => handleLaunchVLC('http://localhost:8080/stream/movie.mp4')}
                className="w-full px-4 py-2 rounded-lg bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4" />
                Launch VLC with Test Stream
              </button>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
