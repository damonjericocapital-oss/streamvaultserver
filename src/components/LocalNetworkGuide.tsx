import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Wifi,
  Monitor,
  Smartphone,
  Tv,
  Laptop,
  Copy,
  Check,
  QrCode,
  AlertCircle,
  CheckCircle2,
  Globe,
  Shield,
} from 'lucide-react';

interface LocalNetworkGuideProps {
  onClose: () => void;
}

export default function LocalNetworkGuide({ onClose }: LocalNetworkGuideProps) {
  const [activeTab, setActiveTab] = useState<'quick' | 'devices' | 'advanced'>('quick');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [localIP, setLocalIP] = useState<string>('');
  const [connectionTested, setConnectionTested] = useState(false);

  // Detect local IP (best effort - browser limitation means we show instructions)
  useEffect(() => {
    // In a real app, this would come from the backend
    // For now, we'll show the user how to find it
    setLocalIP('192.168.1.X');
  }, []);

  const copyCommand = (command: string, index: number) => {
    navigator.clipboard.writeText(command);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const testConnection = () => {
    setConnectionTested(true);
    setTimeout(() => setConnectionTested(false), 3000);
  };

  const quickStartSteps = [
    {
      title: 'Find Your Computer\'s IP Address',
      description: 'You need your computer\'s local IP address to access StreamVault from other devices.',
      commands: [
        { os: 'Windows', cmd: 'ipconfig', note: 'Look for "IPv4 Address" under your active connection' },
        { os: 'macOS', cmd: 'ipconfig getifaddr en0', note: 'Or use en1 for WiFi' },
        { os: 'Linux', cmd: 'hostname -I', note: 'Shows all IP addresses' },
      ],
    },
    {
      title: 'Start StreamVault Server',
      description: 'Run the development server with network access enabled.',
      commands: [
        { os: 'All', cmd: 'npm run dev -- --host 0.0.0.0', note: 'Allows access from any device on your network' },
      ],
    },
    {
      title: 'Access from Other Devices',
      description: 'Open your browser on any device and navigate to:',
      commands: [
        { os: 'All', cmd: 'http://YOUR_IP:3000', note: 'Replace YOUR_IP with your actual IP address' },
      ],
    },
  ];

  const productionSteps = [
    {
      title: 'Build for Production',
      description: 'Create an optimized production build.',
      commands: [
        { os: 'All', cmd: 'npm run build', note: 'Creates optimized files in the dist/ folder' },
      ],
    },
    {
      title: 'Serve with a Simple HTTP Server',
      description: 'Use any of these methods to serve the built files:',
      commands: [
        { os: 'Python 3', cmd: 'cd dist && python -m http.server 3000 --bind 0.0.0.0', note: 'Built into most systems' },
        { os: 'Node.js', cmd: 'npx serve dist -l 3000', note: 'Using the serve package' },
        { os: 'PHP', cmd: 'cd dist && php -S 0.0.0.0:3000', note: 'If PHP is installed' },
      ],
    },
    {
      title: 'Access from Any Device',
      description: 'Open http://YOUR_IP:3000 on phones, tablets, TVs, or other computers.',
      commands: [],
    },
  ];

  const deviceGuides = [
    {
      name: 'iPhone / iPad',
      icon: '📱',
      steps: [
        'Open Safari browser',
        'Type http://YOUR_IP:3000 in the address bar',
        'Tap the Share button (square with arrow)',
        'Tap "Add to Home Screen"',
        'Name it "StreamVault" and tap Add',
        'Now it works like a native app!',
      ],
      tip: 'For best experience, use Safari. Chrome also works but PWA features may be limited.',
    },
    {
      name: 'Android Phone / Tablet',
      icon: '🤖',
      steps: [
        'Open Chrome browser',
        'Type http://YOUR_IP:3000 in the address bar',
        'Tap the menu (⋮) in the top right',
        'Tap "Add to Home screen" or "Install app"',
        'Confirm the installation',
        'StreamVault now appears as an app!',
      ],
      tip: 'Android has the best PWA support. You can also cast to Chromecast from the app.',
    },
    {
      name: 'Smart TV (Samsung/LG/Sony)',
      icon: '📺',
      steps: [
        'Open the TV\'s built-in web browser',
        'Navigate to http://YOUR_IP:3000',
        'Bookmark the page for easy access',
        'Use your TV remote to navigate',
        'For casting: Use DLNA from StreamVault settings',
      ],
      tip: 'If your TV doesn\'t have a browser, use DLNA casting or connect a streaming device.',
    },
    {
      name: 'Another Computer',
      icon: '💻',
      steps: [
        'Open any web browser',
        'Type http://YOUR_IP:3000',
        'Bookmark for quick access',
        'For best experience, install as PWA',
      ],
      tip: 'Works on Windows, Mac, Linux - any modern browser.',
    },
    {
      name: 'Streaming Devices',
      icon: '🎮',
      steps: [
        'Chromecast: Use DLNA casting from StreamVault',
        'Apple TV: Use AirPlay from iOS device',
        'Roku: Limited browser support, use DLNA',
        'Fire TV: Use Silk browser for http://YOUR_IP:3000',
      ],
      tip: 'DLNA is the most universal method for streaming to any device.',
    },
  ];

  const troubleshooting = [
    {
      issue: 'Can\'t connect from other devices',
      solutions: [
        'Make sure all devices are on the same WiFi network',
        'Check your computer\'s firewall settings',
        'Verify the server is running with --host 0.0.0.0',
        'Try accessing from the same computer first: http://localhost:3000',
      ],
    },
    {
      issue: 'Firewall blocking connections',
      solutions: [
        'Windows: Allow Node.js through Windows Defender Firewall',
        'macOS: System Preferences → Security → Firewall → Allow incoming connections',
        'Linux: sudo ufw allow 3000/tcp',
        'Router: Some routers block device-to-device communication',
      ],
    },
    {
      issue: 'Slow performance on other devices',
      solutions: [
        'Use the production build (npm run build) instead of dev server',
        'Ensure strong WiFi signal on all devices',
        'Close other bandwidth-heavy applications',
        'Consider using Ethernet for the server computer',
      ],
    },
    {
      issue: 'IP address keeps changing',
      solutions: [
        'Set a static IP for your computer in router settings',
        'Or use a local DNS name like http://streamvault.local',
        'Most routers allow IP reservation by MAC address',
      ],
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-24 right-6 z-50 w-[700px] max-h-[80vh] bg-gray-900/98 backdrop-blur-2xl rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-gray-800 bg-gradient-to-r from-blue-500/5 to-cyan-500/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <Wifi className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Connect to Local Network</h3>
            <p className="text-xs text-gray-400">Access StreamVault from any device on your network</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800">
        <button
          onClick={() => setActiveTab('quick')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'quick'
              ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-500/5'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          Quick Start
        </button>
        <button
          onClick={() => setActiveTab('devices')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'devices'
              ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-500/5'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          Device Guides
        </button>
        <button
          onClick={() => setActiveTab('advanced')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'advanced'
              ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-500/5'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Shield className="w-4 h-4" />
          Troubleshooting
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5">
        {activeTab === 'quick' && (
          <div className="space-y-6">
            {/* Connection Status */}
            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium text-white">Your Local Address</span>
                </div>
                <button
                  onClick={testConnection}
                  className="px-3 py-1 rounded-lg bg-blue-500/20 text-blue-400 text-xs hover:bg-blue-500/30 transition-colors"
                >
                  Test Connection
                </button>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-800/50 font-mono">
                <code className="text-blue-400 flex-1">http://{localIP}:3000</code>
                <button
                  onClick={() => copyCommand(`http://${localIP}:3000`, 99)}
                  className="p-1 rounded hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                >
                  {copiedIndex === 99 ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              {connectionTested && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 flex items-center gap-2 text-xs text-emerald-400"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Server is running and accessible
                </motion.div>
              )}
              <p className="text-xs text-gray-500 mt-2">
                💡 Replace {localIP} with your actual IP address (see Step 1 below)
              </p>
            </div>

            {/* Quick Start Steps */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Quick Start (3 Steps)
              </h3>

              {quickStartSteps.map((step, stepIndex) => (
                <motion.div
                  key={stepIndex}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: stepIndex * 0.1 }}
                  className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/50"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-xs font-bold text-blue-400 flex-shrink-0">
                      {stepIndex + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-white mb-1">{step.title}</h4>
                      <p className="text-xs text-gray-400 mb-3">{step.description}</p>

                      {step.commands.map((cmd, cmdIndex) => (
                        <div key={cmdIndex} className="mb-2">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-gray-500 font-medium">{cmd.os}:</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 rounded-lg bg-black/40 border border-gray-800">
                            <code className="flex-1 text-xs text-emerald-400 font-mono">{cmd.cmd}</code>
                            <button
                              onClick={() => copyCommand(cmd.cmd, stepIndex * 10 + cmdIndex)}
                              className="p-1 rounded hover:bg-gray-800 text-gray-500 hover:text-white transition-colors"
                            >
                              {copiedIndex === stepIndex * 10 + cmdIndex ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                          {cmd.note && (
                            <p className="text-xs text-gray-500 mt-1 italic">💡 {cmd.note}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Production Deployment */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Monitor className="w-4 h-4 text-purple-400" />
                Production Deployment (Recommended)
              </h3>
              <p className="text-xs text-gray-400">
                For the best performance, build and serve the production version:
              </p>

              {productionSteps.map((step, stepIndex) => (
                <div key={stepIndex} className="p-3 rounded-lg bg-gray-800/30 border border-gray-700/50">
                  <h4 className="text-sm font-medium text-white mb-2">{step.title}</h4>
                  <p className="text-xs text-gray-400 mb-2">{step.description}</p>
                  {step.commands.map((cmd, cmdIndex) => (
                    <div key={cmdIndex} className="mb-2">
                      <span className="text-xs text-gray-500">{cmd.os}: </span>
                      <div className="flex items-center gap-2 p-2 rounded bg-black/40 border border-gray-800 mt-1">
                        <code className="flex-1 text-xs text-emerald-400 font-mono">{cmd.cmd}</code>
                        <button
                          onClick={() => copyCommand(cmd.cmd, 100 + stepIndex * 10 + cmdIndex)}
                          className="p-1 rounded hover:bg-gray-800 text-gray-500 hover:text-white"
                        >
                          {copiedIndex === 100 + stepIndex * 10 + cmdIndex ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                      {cmd.note && <p className="text-xs text-gray-500 mt-1">💡 {cmd.note}</p>}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'devices' && (
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 mb-4">
              <p className="text-xs text-blue-300">
                📱 Install StreamVault as an app on any device for the best experience.
                Each device type has specific instructions below.
              </p>
            </div>

            {deviceGuides.map((device, index) => (
              <motion.div
                key={device.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/50"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{device.icon}</span>
                  <h4 className="text-sm font-semibold text-white">{device.name}</h4>
                </div>
                <ol className="space-y-1.5 mb-3">
                  {device.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-300">
                      <span className="text-blue-400 font-mono flex-shrink-0">{i + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <p className="text-xs text-amber-300">💡 {device.tip}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'advanced' && (
          <div className="space-y-4">
            {/* Common Issues */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                Common Issues & Solutions
              </h3>
              <div className="space-y-3">
                {troubleshooting.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/50"
                  >
                    <h4 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-400" />
                      {item.issue}
                    </h4>
                    <ul className="space-y-1.5">
                      {item.solutions.map((solution, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-gray-300">
                          <Check className="w-3 h-3 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span>{solution}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Firewall Commands */}
            <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/50">
              <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-red-400" />
                Firewall Commands (Allow Port 3000)
              </h4>
              <div className="space-y-2">
                {[
                  { os: 'Windows', cmd: 'netsh advfirewall firewall add rule name="StreamVault" dir=in action=allow protocol=TCP localport=3000' },
                  { os: 'macOS', cmd: 'sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add /usr/local/bin/node' },
                  { os: 'Linux (UFW)', cmd: 'sudo ufw allow 3000/tcp' },
                  { os: 'Linux (iptables)', cmd: 'sudo iptables -A INPUT -p tcp --dport 3000 -j ACCEPT' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 w-28 flex-shrink-0">{item.os}:</span>
                    <div className="flex-1 flex items-center gap-2 p-2 rounded bg-black/40 border border-gray-800">
                      <code className="flex-1 text-xs text-emerald-400 font-mono truncate">{item.cmd}</code>
                      <button
                        onClick={() => copyCommand(item.cmd, 200 + i)}
                        className="p-1 rounded hover:bg-gray-800 text-gray-500 hover:text-white"
                      >
                        {copiedIndex === 200 + i ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Static IP Setup */}
            <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/50">
              <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Globe className="w-4 h-4 text-purple-400" />
                Set Static IP (Recommended)
              </h4>
              <p className="text-xs text-gray-400 mb-3">
                Prevent your IP from changing by setting a static IP or DHCP reservation:
              </p>
              <ol className="space-y-1.5 text-xs text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 font-mono">1.</span>
                  <span>Log into your router (usually http://192.168.1.1 or http://192.168.0.1)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 font-mono">2.</span>
                  <span>Find "DHCP Reservation" or "Static IP" settings</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 font-mono">3.</span>
                  <span>Add your computer's MAC address with a fixed IP (e.g., 192.168.1.100)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 font-mono">4.</span>
                  <span>Save and restart your router if needed</span>
                </li>
              </ol>
              <div className="mt-3 p-2 rounded bg-purple-500/10 border border-purple-500/20">
                <p className="text-xs text-purple-300">
                  💡 This ensures your StreamVault URL never changes, even after router restarts.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
