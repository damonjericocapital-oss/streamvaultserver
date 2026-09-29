import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Globe,
  Zap,
  Volume2,
  Settings,
  Check,
  AlertCircle,
  Activity,
  Cpu,
  Wifi,
} from 'lucide-react';
import {
  TranslationConfig,
  LatencyConfig,
  DolbyConfig,
  SUPPORTED_LANGUAGES,
} from '../types/advanced';

interface AdvancedSettingsProps {
  translation: TranslationConfig;
  latency: LatencyConfig;
  dolby: DolbyConfig;
  onTranslationChange: (config: TranslationConfig) => void;
  onLatencyChange: (config: LatencyConfig) => void;
  onDolbyChange: (config: DolbyConfig) => void;
  onClose: () => void;
}

export default function AdvancedPlayerSettings({
  translation,
  latency,
  dolby,
  onTranslationChange,
  onLatencyChange,
  onDolbyChange,
  onClose,
}: AdvancedSettingsProps) {
  const [activeTab, setActiveTab] = useState<'translation' | 'latency' | 'dolby'>('translation');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-24 right-6 z-50 w-96 bg-gray-900/98 backdrop-blur-2xl rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gradient-to-r from-amber-500/5 to-orange-500/5">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-semibold text-white">Advanced Settings</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
        >
          ×
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800">
        <button
          onClick={() => setActiveTab('translation')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-xs font-medium transition-colors ${
            activeTab === 'translation'
              ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-500/5'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          Translation
        </button>
        <button
          onClick={() => setActiveTab('latency')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-xs font-medium transition-colors ${
            activeTab === 'latency'
              ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-500/5'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          Latency
        </button>
        <button
          onClick={() => setActiveTab('dolby')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-xs font-medium transition-colors ${
            activeTab === 'dolby'
              ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-500/5'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Volume2 className="w-3.5 h-3.5" />
          Dolby
        </button>
      </div>

      {/* Content */}
      <div className="max-h-96 overflow-y-auto">
        {activeTab === 'translation' && (
          <div className="p-4 space-y-4">
            {/* Enable Translation */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Live Translation</p>
                <p className="text-xs text-gray-500">Real-time subtitle translation</p>
              </div>
              <button
                onClick={() => onTranslationChange({ ...translation, enabled: !translation.enabled })}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  translation.enabled ? 'bg-amber-500' : 'bg-gray-600'
                }`}
              >
                <motion.div
                  animate={{ x: translation.enabled ? 20 : 2 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                />
              </button>
            </div>

            {translation.enabled && (
              <>
                {/* Source Language */}
                <div>
                  <label className="text-xs text-gray-400 mb-2 block">Source Language</label>
                  <select
                    value={translation.sourceLanguage}
                    onChange={(e) =>
                      onTranslationChange({ ...translation, sourceLanguage: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm outline-none focus:border-amber-500"
                  >
                    <option value="auto">Auto-detect</option>
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Target Language */}
                <div>
                  <label className="text-xs text-gray-400 mb-2 block">Translate to</label>
                  <select
                    value={translation.targetLanguage}
                    onChange={(e) =>
                      onTranslationChange({ ...translation, targetLanguage: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm outline-none focus:border-amber-500"
                  >
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quality */}
                <div>
                  <label className="text-xs text-gray-400 mb-2 block">Translation Quality</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['standard', 'high', 'premium'] as const).map((quality) => (
                      <button
                        key={quality}
                        onClick={() => onTranslationChange({ ...translation, quality })}
                        className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                          translation.quality === quality
                            ? 'bg-amber-500 text-white'
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        {quality.charAt(0).toUpperCase() + quality.slice(1)}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                    <Activity className="w-3 h-3" />
                    <span>
                      Latency: {translation.quality === 'premium' ? '~100ms' : translation.quality === 'high' ? '~200ms' : '~300ms'}
                    </span>
                    <span>•</span>
                    <span>
                      Accuracy: {translation.quality === 'premium' ? '98%' : translation.quality === 'high' ? '92%' : '85%'}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'latency' && (
          <div className="p-4 space-y-4">
            {/* Network Status */}
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Wifi className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-medium text-emerald-400">Network Status: Excellent</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <p className="text-gray-500">Latency</p>
                  <p className="text-white font-mono">23ms</p>
                </div>
                <div>
                  <p className="text-gray-500">Jitter</p>
                  <p className="text-white font-mono">2ms</p>
                </div>
                <div>
                  <p className="text-gray-500">Packet Loss</p>
                  <p className="text-white font-mono">0%</p>
                </div>
              </div>
            </div>

            {/* Target Latency */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block">
                Target Latency: {latency.targetLatency}ms
              </label>
              <input
                type="range"
                min="100"
                max="2000"
                step="100"
                value={latency.targetLatency}
                onChange={(e) =>
                  onLatencyChange({ ...latency, targetLatency: Number(e.target.value) })
                }
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Low (100ms)</span>
                <span>High (2000ms)</span>
              </div>
            </div>

            {/* Buffer Size */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block">
                Buffer Size: {latency.bufferSize}s
              </label>
              <input
                type="range"
                min="1"
                max="30"
                value={latency.bufferSize}
                onChange={(e) =>
                  onLatencyChange({ ...latency, bufferSize: Number(e.target.value) })
                }
                className="w-full"
              />
            </div>

            {/* Prebuffer */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block">
                Prebuffer: {latency.prebufferSeconds}s
              </label>
              <input
                type="range"
                min="0"
                max="10"
                value={latency.prebufferSeconds}
                onChange={(e) =>
                  onLatencyChange({ ...latency, prebufferSeconds: Number(e.target.value) })
                }
                className="w-full"
              />
            </div>

            {/* Adaptive Bitrate */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Adaptive Bitrate</p>
                <p className="text-xs text-gray-500">Adjust quality based on network</p>
              </div>
              <button
                onClick={() =>
                  onLatencyChange({ ...latency, adaptiveBitrate: !latency.adaptiveBitrate })
                }
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  latency.adaptiveBitrate ? 'bg-amber-500' : 'bg-gray-600'
                }`}
              >
                <motion.div
                  animate={{ x: latency.adaptiveBitrate ? 20 : 2 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                />
              </button>
            </div>

            {/* Network Optimization */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block">Network Optimization</label>
              <div className="grid grid-cols-3 gap-2">
                {(['speed', 'balanced', 'quality'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => onLatencyChange({ ...latency, networkOptimization: mode })}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      latency.networkOptimization === mode
                        ? 'bg-amber-500 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'dolby' && (
          <div className="p-4 space-y-4">
            {/* Dolby Status */}
            <div className="p-3 rounded-lg bg-violet-500/10 border border-violet-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Volume2 className="w-4 h-4 text-violet-400" />
                <span className="text-sm font-medium text-violet-400">Dolby Audio Active</span>
              </div>
              <div className="text-xs text-gray-400">
                <p>Device: 5.1 Surround Sound System</p>
                <p>Codec: Dolby Digital Plus</p>
              </div>
            </div>

            {/* Dolby Atmos */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white flex items-center gap-2">
                  Dolby Atmos
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-400">
                    PREMIUM
                  </span>
                </p>
                <p className="text-xs text-gray-500">Immersive 3D audio</p>
              </div>
              <button
                onClick={() => onDolbyChange({ ...dolby, atmos: !dolby.atmos })}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  dolby.atmos ? 'bg-violet-500' : 'bg-gray-600'
                }`}
              >
                <motion.div
                  animate={{ x: dolby.atmos ? 20 : 2 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                />
              </button>
            </div>

            {/* Volume Leveler */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Volume Leveler</p>
                <p className="text-xs text-gray-500">Normalize audio levels</p>
              </div>
              <button
                onClick={() => onDolbyChange({ ...dolby, volumeLeveler: !dolby.volumeLeveler })}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  dolby.volumeLeveler ? 'bg-amber-500' : 'bg-gray-600'
                }`}
              >
                <motion.div
                  animate={{ x: dolby.volumeLeveler ? 20 : 2 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                />
              </button>
            </div>

            {/* Dialogue Enhancer */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block">
                Dialogue Enhancement: {dolby.dialogueEnhancer}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={dolby.dialogueEnhancer}
                onChange={(e) =>
                  onDolbyChange({ ...dolby, dialogueEnhancer: Number(e.target.value) })
                }
                className="w-full"
              />
            </div>

            {/* Bass Enhancement */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block">
                Bass Enhancement: {dolby.bassEnhancement}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={dolby.bassEnhancement}
                onChange={(e) =>
                  onDolbyChange({ ...dolby, bassEnhancement: Number(e.target.value) })
                }
                className="w-full"
              />
            </div>

            {/* Virtualizer */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Virtualizer</p>
                <p className="text-xs text-gray-500">Simulate surround sound</p>
              </div>
              <button
                onClick={() => onDolbyChange({ ...dolby, virtualizer: !dolby.virtualizer })}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  dolby.virtualizer ? 'bg-amber-500' : 'bg-gray-600'
                }`}
              >
                <motion.div
                  animate={{ x: dolby.virtualizer ? 20 : 2 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                />
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
