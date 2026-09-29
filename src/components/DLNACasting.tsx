import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Cast, Wifi, WifiOff, RefreshCw, Check, Play } from 'lucide-react';
import { DLNAConfig, DLNADevice, DLNA_DEVICE_TYPES } from '../types/ecosystem';

interface DLNACastingProps {
  config: DLNAConfig;
  onConfigChange: (config: DLNAConfig) => void;
  onClose: () => void;
}

export default function DLNACasting({ config, onConfigChange, onClose }: DLNACastingProps) {
  const [scanning, setScanning] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      const mockDevices: DLNADevice[] = [
        {
          id: '1',
          name: 'Living Room TV',
          type: 'tv',
          manufacturer: 'Samsung',
          model: 'QN90A',
          ipAddress: '192.168.1.100',
          supportedFormats: ['4K', '1080p', 'H.265', 'HDR10'],
          connected: true,
          icon: '📺',
        },
        {
          id: '2',
          name: 'Bedroom TV',
          type: 'tv',
          manufacturer: 'LG',
          model: 'C1',
          ipAddress: '192.168.1.101',
          supportedFormats: ['4K', '1080p', 'Dolby Vision'],
          connected: true,
          icon: '📺',
        },
        {
          id: '3',
          name: 'Sonos Speaker',
          type: 'speaker',
          manufacturer: 'Sonos',
          model: 'Beam',
          ipAddress: '192.168.1.102',
          supportedFormats: ['AAC', 'MP3', 'FLAC'],
          connected: true,
          icon: '🔊',
        },
        {
          id: '4',
          name: 'PlayStation 5',
          type: 'console',
          manufacturer: 'Sony',
          model: 'PS5',
          ipAddress: '192.168.1.103',
          supportedFormats: ['4K', '1080p', 'HDR'],
          connected: true,
          icon: '🎮',
        },
      ];
      onConfigChange({ ...config, devices: mockDevices });
      setScanning(false);
    }, 2000);
  };

  const handleConnectDevice = (deviceId: string) => {
    const updatedDevices = config.devices.map((d) =>
      d.id === deviceId ? { ...d, connected: !d.connected } : d
    );
    onConfigChange({ ...config, devices: updatedDevices });
  };

  const handleCast = (deviceId: string) => {
    setSelectedDevice(deviceId);
    setTimeout(() => {
      alert(`Casting to ${config.devices.find((d) => d.id === deviceId)?.name}`);
      setSelectedDevice(null);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-24 right-6 z-50 w-[600px] bg-gray-900/98 backdrop-blur-2xl rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gradient-to-r from-purple-500/5 to-pink-500/5">
        <div className="flex items-center gap-2">
          <Cast className="w-5 h-5 text-purple-400" />
          <div>
            <h3 className="text-sm font-semibold text-white">DLNA & Home Share</h3>
            <p className="text-xs text-gray-500">Cast to devices on your network</p>
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
        {/* Enable DLNA */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
          <div>
            <p className="text-sm font-medium text-white">Enable DLNA Server</p>
            <p className="text-xs text-gray-500">Share your library with other devices</p>
          </div>
          <button
            onClick={() => onConfigChange({ ...config, enabled: !config.enabled })}
            className={`relative w-11 h-6 rounded-full transition-colors ${
              config.enabled ? 'bg-purple-500' : 'bg-gray-600'
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
            {/* Server Name */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block">Server Name</label>
              <input
                type="text"
                value={config.serverName}
                onChange={(e) => onConfigChange({ ...config, serverName: e.target.value })}
                placeholder="StreamVault Server"
                className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            {/* Share Options */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-lg bg-gray-800/50">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-300">Share Library</p>
                  <button
                    onClick={() =>
                      onConfigChange({ ...config, shareLibrary: !config.shareLibrary })
                    }
                    className={`relative w-9 h-5 rounded-full transition-colors ${
                      config.shareLibrary ? 'bg-purple-500' : 'bg-gray-600'
                    }`}
                  >
                    <motion.div
                      animate={{ x: config.shareLibrary ? 14 : 2 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm"
                    />
                  </button>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-gray-800/50">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-300">Share Downloads</p>
                  <button
                    onClick={() =>
                      onConfigChange({ ...config, shareDownloads: !config.shareDownloads })
                    }
                    className={`relative w-9 h-5 rounded-full transition-colors ${
                      config.shareDownloads ? 'bg-purple-500' : 'bg-gray-600'
                    }`}
                  >
                    <motion.div
                      animate={{ x: config.shareDownloads ? 14 : 2 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm"
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Quality */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block">Max Streaming Quality</label>
              <div className="grid grid-cols-4 gap-2">
                {(['4k', '1080p', '720p', '480p'] as const).map((quality) => (
                  <button
                    key={quality}
                    onClick={() => onConfigChange({ ...config, maxStreamingQuality: quality })}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      config.maxStreamingQuality === quality
                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                        : 'bg-gray-800 text-gray-300 border border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    {quality.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Device Discovery */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Discovered Devices ({config.devices.length})
                </h4>
                <button
                  onClick={handleScan}
                  disabled={scanning}
                  className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3 h-3 ${scanning ? 'animate-spin' : ''}`} />
                  {scanning ? 'Scanning...' : 'Scan Network'}
                </button>
              </div>

              <div className="space-y-2">
                {config.devices.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Cast className="w-12 h-12 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No devices found</p>
                    <p className="text-xs mt-1">Click "Scan Network" to discover devices</p>
                  </div>
                ) : (
                  config.devices.map((device) => {
                    const deviceType = DLNA_DEVICE_TYPES[device.type];
                    return (
                      <motion.div
                        key={device.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-3 rounded-lg bg-gray-800/50 border border-gray-700/50"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{deviceType.icon}</span>
                            <div>
                              <p className="text-sm font-medium text-white">{device.name}</p>
                              <p className="text-xs text-gray-500">
                                {device.manufacturer} {device.model} • {device.ipAddress}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {device.connected ? (
                              <div className="flex items-center gap-1 px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 text-xs">
                                <Wifi className="w-3 h-3" />
                                Online
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 px-2 py-1 rounded bg-gray-700 text-gray-400 text-xs">
                                <WifiOff className="w-3 h-3" />
                                Offline
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex-1 flex flex-wrap gap-1">
                            {device.supportedFormats.slice(0, 3).map((format) => (
                              <span
                                key={format}
                                className="px-2 py-0.5 rounded bg-gray-700 text-xs text-gray-400"
                              >
                                {format}
                              </span>
                            ))}
                          </div>
                          <button
                            onClick={() => handleCast(device.id)}
                            disabled={selectedDevice === device.id || !device.connected}
                            className="px-3 py-1.5 rounded-lg bg-purple-500 text-white text-xs font-medium hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                          >
                            {selectedDevice === device.id ? (
                              <>
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                  className="w-3 h-3 border-2 border-white border-t-transparent rounded-full"
                                />
                                Connecting...
                              </>
                            ) : (
                              <>
                                <Play className="w-3 h-3" />
                                Cast
                              </>
                            )}
                          </button>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
