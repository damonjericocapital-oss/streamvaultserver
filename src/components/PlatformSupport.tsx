import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Monitor, Apple, Download, CheckCircle, ExternalLink } from 'lucide-react';
import { PlatformConfig } from '../types/compliance';

interface PlatformSupportProps {
  config: PlatformConfig;
  onClose: () => void;
}

export default function PlatformSupport({ config, onClose }: PlatformSupportProps) {
  const platforms = [
    {
      id: 'ios',
      name: 'iOS',
      icon: '🍎',
      version: 'iOS 14+',
      status: config.ios ? 'available' : 'coming-soon',
      installMethod: 'App Store',
      features: ['Full streaming', 'Offline mode', 'Push notifications', 'AirPlay support'],
    },
    {
      id: 'macos',
      name: 'macOS',
      icon: '💻',
      version: 'macOS 11+',
      status: config.macos ? 'available' : 'coming-soon',
      installMethod: 'App Store / DMG',
      features: ['Native app', 'Menu bar integration', 'Keyboard shortcuts', 'Handoff support'],
    },
    {
      id: 'android',
      name: 'Android',
      icon: '🤖',
      version: 'Android 8+',
      status: config.android ? 'available' : 'coming-soon',
      installMethod: 'Play Store',
      features: ['Full streaming', 'Chromecast', 'Background play', 'Widget support'],
    },
    {
      id: 'windows',
      name: 'Windows',
      icon: '🪟',
      version: 'Windows 10+',
      status: config.windows ? 'available' : 'coming-soon',
      installMethod: 'Microsoft Store / EXE',
      features: ['Native app', 'System tray', 'Auto-start', 'Media keys'],
    },
    {
      id: 'linux',
      name: 'Linux',
      icon: '🐧',
      version: 'Ubuntu 20.04+',
      status: config.linux ? 'available' : 'coming-soon',
      installMethod: 'AppImage / Flatpak',
      features: ['Native app', 'System integration', 'Wayland support', 'CLI tools'],
    },
    {
      id: 'pwa',
      name: 'Web (PWA)',
      icon: '🌐',
      version: 'Any modern browser',
      status: config.pwa ? 'available' : 'coming-soon',
      installMethod: 'Browser install',
      features: ['Install to home screen', 'Offline mode', 'Push notifications', 'Cross-platform'],
    },
  ];

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
          <Smartphone className="w-5 h-5 text-blue-400" />
          <div>
            <h3 className="text-sm font-semibold text-white">Platform Support</h3>
            <p className="text-xs text-gray-500">Install StreamVault on your devices</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
        >
          ×
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
        {platforms.map((platform) => (
          <motion.div
            key={platform.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-4 rounded-xl bg-gray-800/50 border border-gray-700/50 hover:border-gray-600/50 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{platform.icon}</span>
                <div>
                  <h4 className="text-sm font-semibold text-white">{platform.name}</h4>
                  <p className="text-xs text-gray-500">{platform.version}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {platform.status === 'available' ? (
                  <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs">
                    <CheckCircle className="w-3 h-3" />
                    Available
                  </span>
                ) : (
                  <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs">
                    Coming Soon
                  </span>
                )}
              </div>
            </div>

            {/* Features */}
            <div className="mb-3">
              <p className="text-xs text-gray-400 mb-2">Features:</p>
              <div className="flex flex-wrap gap-1">
                {platform.features.map((feature, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-gray-700/50 text-xs text-gray-300"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            {/* Install Button */}
            {platform.status === 'available' && (
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium hover:opacity-90 transition-opacity">
                <Download className="w-4 h-4" />
                Install via {platform.installMethod}
              </button>
            )}

            {platform.status === 'coming-soon' && (
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gray-700 text-gray-400 text-sm font-medium cursor-not-allowed">
                <ExternalLink className="w-4 h-4" />
                Join Waitlist
              </button>
            )}
          </motion.div>
        ))}

        {/* PWA Install Instructions */}
        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
            <Monitor className="w-4 h-4 text-blue-400" />
            Install as PWA (Web App)
          </h4>
          <div className="space-y-2 text-xs text-gray-400">
            <p>
              <strong className="text-white">iOS Safari:</strong> Tap Share → Add to Home Screen
            </p>
            <p>
              <strong className="text-white">Android Chrome:</strong> Tap menu → Install app
            </p>
            <p>
              <strong className="text-white">Desktop Chrome:</strong> Click install icon in address bar
            </p>
            <p>
              <strong className="text-white">macOS Safari:</strong> File → Add to Dock
            </p>
          </div>
        </div>

        {/* System Requirements */}
        <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/30">
          <h4 className="text-sm font-semibold text-white mb-2">System Requirements</h4>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-gray-500 mb-1">Minimum</p>
              <ul className="space-y-1 text-gray-400">
                <li>• 2GB RAM</li>
                <li>• 500MB storage</li>
                <li>• Internet connection</li>
              </ul>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Recommended</p>
              <ul className="space-y-1 text-gray-400">
                <li>• 4GB+ RAM</li>
                <li>• 1GB+ storage</li>
                <li>• Fast internet (10Mbps+)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
