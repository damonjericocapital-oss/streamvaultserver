import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Globe, Shield, Check, AlertCircle, Power, MapPin } from 'lucide-react';
import { VPNConfig, VPN_PROVIDERS } from '../types/infrastructure';

interface VPNConfigurationProps {
  config: VPNConfig;
  onConfigChange: (config: VPNConfig) => void;
  onClose: () => void;
}

export default function VPNConfiguration({ config, onConfigChange, onClose }: VPNConfigurationProps) {
  const [connecting, setConnecting] = useState(false);

  const handleConnect = async () => {
    setConnecting(true);
    // Simulate connection
    setTimeout(() => {
      onConfigChange({
        ...config,
        connected: true,
        serverLocation: 'Netherlands',
        ipAddress: '185.222.' + Math.floor(Math.random() * 255) + '.' + Math.floor(Math.random() * 255),
      });
      setConnecting(false);
    }, 2000);
  };

  const handleDisconnect = () => {
    onConfigChange({
      ...config,
      connected: false,
      serverLocation: undefined,
      ipAddress: undefined,
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
      <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gradient-to-r from-violet-500/5 to-purple-500/5">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-violet-400" />
          <div>
            <h3 className="text-sm font-semibold text-white">VPN Configuration</h3>
            <p className="text-xs text-gray-500">Secure your torrent traffic</p>
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
        {/* Connection Status */}
        <div
          className={`p-4 rounded-lg border ${
            config.connected
              ? 'bg-emerald-500/10 border-emerald-500/30'
              : 'bg-gray-800/50 border-gray-700/50'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {config.connected ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-sm font-medium text-emerald-400">Connected</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 rounded-full bg-gray-500" />
                  <span className="text-sm font-medium text-gray-400">Disconnected</span>
                </>
              )}
            </div>
            <button
              onClick={config.connected ? handleDisconnect : handleConnect}
              disabled={connecting}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                config.connected
                  ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                  : 'bg-violet-500 text-white hover:bg-violet-600'
              } disabled:opacity-50`}
            >
              {connecting ? (
                <span className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                  Connecting...
                </span>
              ) : config.connected ? (
                <span className="flex items-center gap-2">
                  <Power className="w-4 h-4" />
                  Disconnect
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Power className="w-4 h-4" />
                  Connect
                </span>
              )}
            </button>
          </div>

          {config.connected && config.serverLocation && (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <MapPin className="w-3 h-3" />
                <span>Server: {config.serverLocation}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Globe className="w-3 h-3" />
                <span>IP: {config.ipAddress}</span>
              </div>
            </div>
          )}
        </div>

        {/* VPN Provider */}
        <div>
          <label className="text-xs text-gray-400 mb-2 block">VPN Provider</label>
          <div className="grid grid-cols-2 gap-2">
            {VPN_PROVIDERS.map((provider) => (
              <button
                key={provider.id}
                onClick={() =>
                  onConfigChange({
                    ...config,
                    provider: provider.id as VPNConfig['provider'],
                  })
                }
                className={`p-3 rounded-lg text-left transition-all ${
                  config.provider === provider.id
                    ? 'bg-violet-500/20 border border-violet-500/50 text-violet-400'
                    : 'bg-gray-800 border border-gray-700 text-gray-300 hover:border-gray-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{provider.icon}</span>
                  <span className="text-xs font-medium">{provider.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Protocol */}
        <div>
          <label className="text-xs text-gray-400 mb-2 block">Protocol</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 'openvpn', label: 'OpenVPN' },
              { value: 'wireguard', label: 'WireGuard' },
              { value: 'ikev2', label: 'IKEv2' },
            ].map((protocol) => (
              <button
                key={protocol.value}
                onClick={() =>
                  onConfigChange({
                    ...config,
                    protocol: protocol.value as VPNConfig['protocol'],
                  })
                }
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  config.protocol === protocol.value
                    ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                    : 'bg-gray-800 text-gray-300 border border-gray-700 hover:border-gray-600'
                }`}
              >
                {protocol.label}
              </button>
            ))}
          </div>
        </div>

        {/* Credentials */}
        {config.provider !== 'custom' && (
          <div className="space-y-2">
            <div>
              <label className="text-xs text-gray-400 mb-2 block">Username</label>
              <input
                type="text"
                value={config.username || ''}
                onChange={(e) => onConfigChange({ ...config, username: e.target.value })}
                placeholder="your@email.com"
                className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm outline-none focus:border-violet-500 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-2 block">Password</label>
              <input
                type="password"
                value={config.password || ''}
                onChange={(e) => onConfigChange({ ...config, password: e.target.value })}
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm outline-none focus:border-violet-500 transition-colors"
              />
            </div>
          </div>
        )}

        {/* Advanced Options */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            Advanced Options
          </h4>

          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
            <div>
              <p className="text-sm font-medium text-white">Kill Switch</p>
              <p className="text-xs text-gray-500">Block internet if VPN disconnects</p>
            </div>
            <button
              onClick={() => onConfigChange({ ...config, killSwitch: !config.killSwitch })}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                config.killSwitch ? 'bg-violet-500' : 'bg-gray-600'
              }`}
            >
              <motion.div
                animate={{ x: config.killSwitch ? 20 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
            <div>
              <p className="text-sm font-medium text-white">Auto-Connect</p>
              <p className="text-xs text-gray-500">Connect on application start</p>
            </div>
            <button
              onClick={() => onConfigChange({ ...config, autoConnect: !config.autoConnect })}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                config.autoConnect ? 'bg-violet-500' : 'bg-gray-600'
              }`}
            >
              <motion.div
                animate={{ x: config.autoConnect ? 20 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
            <div>
              <p className="text-sm font-medium text-white">DNS Leak Protection</p>
              <p className="text-xs text-gray-500">Force DNS through VPN</p>
            </div>
            <button
              onClick={() =>
                onConfigChange({ ...config, dnsLeakProtection: !config.dnsLeakProtection })
              }
              className={`relative w-11 h-6 rounded-full transition-colors ${
                config.dnsLeakProtection ? 'bg-violet-500' : 'bg-gray-600'
              }`}
            >
              <motion.div
                animate={{ x: config.dnsLeakProtection ? 20 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
            <div>
              <p className="text-sm font-medium text-white">Bypass Local Network</p>
              <p className="text-xs text-gray-500">Allow LAN traffic without VPN</p>
            </div>
            <button
              onClick={() =>
                onConfigChange({
                  ...config,
                  bypassLocalNetwork: !config.bypassLocalNetwork,
                })
              }
              className={`relative w-11 h-6 rounded-full transition-colors ${
                config.bypassLocalNetwork ? 'bg-violet-500' : 'bg-gray-600'
              }`}
            >
              <motion.div
                animate={{ x: config.bypassLocalNetwork ? 20 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
            <div>
              <p className="text-sm font-medium text-white">Split Tunneling</p>
              <p className="text-xs text-gray-500">Route specific apps through VPN</p>
            </div>
            <button
              onClick={() =>
                onConfigChange({ ...config, splitTunneling: !config.splitTunneling })
              }
              className={`relative w-11 h-6 rounded-full transition-colors ${
                config.splitTunneling ? 'bg-violet-500' : 'bg-gray-600'
              }`}
            >
              <motion.div
                animate={{ x: config.splitTunneling ? 20 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
              />
            </button>
          </div>
        </div>

        {/* Security Info */}
        <div className="p-3 rounded-lg bg-violet-500/10 border border-violet-500/20">
          <div className="flex items-start gap-2">
            <Shield className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-violet-300">
              <p className="font-semibold mb-1">VPN Recommended</p>
              <p className="text-gray-400">
                Using a VPN protects your privacy and prevents ISP throttling. Choose a
                no-logs provider for maximum security.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
