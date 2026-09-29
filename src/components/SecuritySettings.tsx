import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Shield, AlertTriangle, Check, Plus, Trash2 } from 'lucide-react';
import { SecurityConfig } from '../types/infrastructure';

interface SecuritySettingsProps {
  config: SecurityConfig;
  onConfigChange: (config: SecurityConfig) => void;
  onClose: () => void;
}

export default function SecuritySettings({ config, onConfigChange, onClose }: SecuritySettingsProps) {
  const [newBlockedIP, setNewBlockedIP] = useState('');

  const handleAddBlockedIP = () => {
    if (!newBlockedIP.trim()) return;
    onConfigChange({
      ...config,
      blockedIPs: [...config.blockedIPs, newBlockedIP.trim()],
    });
    setNewBlockedIP('');
  };

  const handleRemoveBlockedIP = (index: number) => {
    onConfigChange({
      ...config,
      blockedIPs: config.blockedIPs.filter((_, i) => i !== index),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-24 right-6 z-50 w-[550px] bg-gray-900/98 backdrop-blur-2xl rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gradient-to-r from-red-500/5 to-orange-500/5">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-red-400" />
          <div>
            <h3 className="text-sm font-semibold text-white">Security Settings</h3>
            <p className="text-xs text-gray-500">Privacy and data protection</p>
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
        {/* Encryption */}
        <div>
          <label className="text-xs text-gray-400 mb-2 block">Protocol Encryption</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 'prefer', label: 'Prefer', desc: 'Use if available' },
              { value: 'force', label: 'Force', desc: 'Required' },
              { value: 'disable', label: 'Disable', desc: 'Off' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() =>
                  onConfigChange({
                    ...config,
                    encryption: option.value as SecurityConfig['encryption'],
                  })
                }
                className={`p-3 rounded-lg text-left transition-all ${
                  config.encryption === option.value
                    ? 'bg-red-500/20 border border-red-500/50 text-red-400'
                    : 'bg-gray-800 border border-gray-700 text-gray-300 hover:border-gray-600'
                }`}
              >
                <p className="text-xs font-medium">{option.label}</p>
                <p className="text-[10px] text-gray-500 mt-0.5">{option.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Anonymous Mode */}
        <div className="p-3 rounded-lg bg-gray-800/50">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-sm font-medium text-white flex items-center gap-2">
                Anonymous Mode
                {config.anonymousMode && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                    ACTIVE
                  </span>
                )}
              </p>
              <p className="text-xs text-gray-500">
                Strip identifying information from peer exchanges
              </p>
            </div>
            <button
              onClick={() =>
                onConfigChange({ ...config, anonymousMode: !config.anonymousMode })
              }
              className={`relative w-11 h-6 rounded-full transition-colors ${
                config.anonymousMode ? 'bg-red-500' : 'bg-gray-600'
              }`}
            >
              <motion.div
                animate={{ x: config.anonymousMode ? 20 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
              />
            </button>
          </div>
          {config.anonymousMode && (
            <div className="mt-2 p-2 rounded bg-emerald-500/10 border border-emerald-500/20">
              <p className="text-xs text-emerald-400">
                ✓ Client fingerprint hidden
                <br />
                ✓ Listen port randomized
                <br />✓ User agent spoofed
              </p>
            </div>
          )}
        </div>

        {/* Network Features */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            Network Features
          </h4>

          <div className="grid grid-cols-2 gap-2">
            {[
              { key: 'enableDHT', label: 'DHT', desc: 'Distributed Hash Table' },
              { key: 'enablePeerExchange', label: 'PeX', desc: 'Peer Exchange' },
              { key: 'enableLPD', label: 'LPD', desc: 'Local Peer Discovery' },
              { key: 'enableUPnP', label: 'UPnP', desc: 'Port Mapping' },
              { key: 'enableNATPMP', label: 'NAT-PMP', desc: 'Port Mapping' },
              { key: 'secureConnections', label: 'Secure', desc: 'Secure Connections' },
            ].map((feature) => (
              <div
                key={feature.key}
                className="flex items-center justify-between p-2 rounded-lg bg-gray-800/50"
              >
                <div>
                  <p className="text-xs font-medium text-white">{feature.label}</p>
                  <p className="text-[10px] text-gray-500">{feature.desc}</p>
                </div>
                <button
                  onClick={() =>
                    onConfigChange({
                      ...config,
                      [feature.key]: !config[feature.key as keyof SecurityConfig],
                    })
                  }
                  className={`relative w-9 h-5 rounded-full transition-colors ${
                    config[feature.key as keyof SecurityConfig] ? 'bg-red-500' : 'bg-gray-600'
                  }`}
                >
                  <motion.div
                    animate={{
                      x: config[feature.key as keyof SecurityConfig] ? 16 : 2,
                    }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm"
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Port Configuration */}
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
            <div>
              <p className="text-sm font-medium text-white">Randomize Port on Start</p>
              <p className="text-xs text-gray-500">Use different port each session</p>
            </div>
            <button
              onClick={() =>
                onConfigChange({ ...config, randomizePort: !config.randomizePort })
              }
              className={`relative w-11 h-6 rounded-full transition-colors ${
                config.randomizePort ? 'bg-red-500' : 'bg-gray-600'
              }`}
            >
              <motion.div
                animate={{ x: config.randomizePort ? 20 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
              />
            </button>
          </div>

          {!config.randomizePort && (
            <div>
              <label className="text-xs text-gray-400 mb-2 block">Port Range</label>
              <input
                type="text"
                value={config.portRange}
                onChange={(e) => onConfigChange({ ...config, portRange: e.target.value })}
                placeholder="6881-6889"
                className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm outline-none focus:border-red-500 transition-colors"
              />
            </div>
          )}
        </div>

        {/* IP Filter */}
        <div className="p-3 rounded-lg bg-gray-800/50">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-sm font-medium text-white">IP Filter</p>
              <p className="text-xs text-gray-500">Block connections from specific IPs</p>
            </div>
            <button
              onClick={() =>
                onConfigChange({ ...config, enableIPFilter: !config.enableIPFilter })
              }
              className={`relative w-11 h-6 rounded-full transition-colors ${
                config.enableIPFilter ? 'bg-red-500' : 'bg-gray-600'
              }`}
            >
              <motion.div
                animate={{ x: config.enableIPFilter ? 20 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
              />
            </button>
          </div>

          {config.enableIPFilter && (
            <div className="space-y-2 mt-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newBlockedIP}
                  onChange={(e) => setNewBlockedIP(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddBlockedIP()}
                  placeholder="192.168.1.1 or 10.0.0.0/24"
                  className="flex-1 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm outline-none focus:border-red-500 transition-colors"
                />
                <button
                  onClick={handleAddBlockedIP}
                  disabled={!newBlockedIP.trim()}
                  className="px-3 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1 max-h-32 overflow-y-auto">
                {config.blockedIPs.length === 0 ? (
                  <p className="text-center py-2 text-xs text-gray-500">No IPs blocked</p>
                ) : (
                  config.blockedIPs.map((ip, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 rounded bg-gray-900/50 group"
                    >
                      <span className="text-xs text-gray-300">{ip}</span>
                      <button
                        onClick={() => handleRemoveBlockedIP(index)}
                        className="p-1 rounded hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Security Warning */}
        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-amber-300">
              <p className="font-semibold mb-1">Security Notice</p>
              <p className="text-gray-400">
                For maximum privacy, consider using a VPN in addition to these settings. Disable
                DHT, PeX, and LPD when using anonymous mode for complete privacy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
