import { motion } from 'framer-motion';
import {
  Settings as SettingsIcon,
  Download,
  Upload,
  HardDrive,
  Shield,
  Globe,
  Bell,
  Palette,
  Save,
  RotateCcw,
  Users,
  Trash2,
  Edit3,
} from 'lucide-react';
import { useState } from 'react';
import { useUser } from '../context/UserContext';

export default function SettingsView() {
  const { currentUser, users, deleteUser, updatePreferences } = useUser();
  const [settings, setSettings] = useState({
    downloadPath: '/downloads/torrents',
    maxDownloadSpeed: 0,
    maxUploadSpeed: 0,
    maxConnections: 200,
    maxPeersPerTorrent: 50,
    enableDHT: true,
    enablePeX: true,
    enableLPD: true,
    enableUPnP: true,
    encryption: 'prefer',
    portRange: '6881-6889',
    autoStart: true,
    startMinimized: false,
    enableNotifications: true,
    streamBuffer: 30,
    streamQuality: 'auto',
    theme: 'dark',
    language: 'en',
  });

  const updateSetting = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Settings</h2>
          <p className="text-gray-400 text-sm mt-1">Configure your streaming torrent server</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gray-800 text-gray-400 text-sm hover:text-white border border-gray-700 transition-colors">
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-sm font-medium hover:opacity-90 transition-opacity">
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </div>

      {/* Profiles Management (Admin only) */}
      {currentUser?.role === 'admin' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden"
        >
          <div className="p-5 border-b border-gray-700/50">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-semibold text-white">User Profiles</h3>
              <span className="text-xs text-gray-500 ml-2">{users.length} profile{users.length > 1 ? 's' : ''}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Manage who has access to your server</p>
          </div>
          <div className="divide-y divide-gray-700/30">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 hover:bg-gray-700/20 transition-colors">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold text-white"
                    style={{
                      background: `linear-gradient(135deg, ${user.avatar.colors[0]}, ${user.avatar.colors[1]})`,
                    }}
                  >
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white flex items-center gap-2">
                      {user.username}
                      {user.id === currentUser.id && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400">You</span>
                      )}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-500 capitalize">{user.role}</span>
                      <span className="text-gray-700">•</span>
                      <span className="text-xs text-gray-500">{user.watchHistory.length} watched</span>
                      {user.pin && (
                        <>
                          <span className="text-gray-700">•</span>
                          <span className="text-xs text-gray-500">PIN protected</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {user.id !== currentUser.id && (
                  <button
                    onClick={() => {
                      if (confirm(`Delete profile "${user.username}"?`)) {
                        deleteUser(user.id);
                      }
                    }}
                    className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Infrastructure Quick Access */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden"
      >
        <div className="p-5 border-b border-gray-700/50">
          <div className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-violet-400" />
            <h3 className="text-lg font-semibold text-white">Infrastructure</h3>
          </div>
          <p className="text-xs text-gray-500 mt-1">Advanced server configuration and integrations</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-5">
          <InfrastructureButton
            icon="🔶"
            title="VLC Plugin"
            description="Advanced playback"
            color="orange"
            onClick={() => {
              const event = new CustomEvent('openInfrastructure', { detail: 'vlc' });
              window.dispatchEvent(event);
            }}
          />
          <InfrastructureButton
            icon="🔗"
            title="Torrent Clients"
            description="Connect external apps"
            color="blue"
            onClick={() => {
              const event = new CustomEvent('openInfrastructure', { detail: 'clients' });
              window.dispatchEvent(event);
            }}
          />
          <InfrastructureButton
            icon="⚡"
            title="Speed Control"
            description="Optimize transfers"
            color="emerald"
            onClick={() => {
              const event = new CustomEvent('openInfrastructure', { detail: 'speed' });
              window.dispatchEvent(event);
            }}
          />
          <InfrastructureButton
            icon="🌱"
            title="Seeding"
            description="Manage ratios"
            color="cyan"
            onClick={() => {
              const event = new CustomEvent('openInfrastructure', { detail: 'seeding' });
              window.dispatchEvent(event);
            }}
          />
          <InfrastructureButton
            icon="🔒"
            title="Security"
            description="Privacy & encryption"
            color="red"
            onClick={() => {
              const event = new CustomEvent('openInfrastructure', { detail: 'security' });
              window.dispatchEvent(event);
            }}
          />
          <InfrastructureButton
            icon="🛡️"
            title="VPN"
            description="Secure connection"
            color="violet"
            onClick={() => {
              const event = new CustomEvent('openInfrastructure', { detail: 'vpn' });
              window.dispatchEvent(event);
            }}
          />
          <InfrastructureButton
            icon="🔍"
            title="Media Hunter"
            description="Find local & cloud media"
            color="blue"
            onClick={() => {
              const event = new CustomEvent('openInfrastructure', { detail: 'media-hunter' });
              window.dispatchEvent(event);
            }}
          />
          <InfrastructureButton
            icon="📺"
            title="DLNA Cast"
            description="Stream to devices"
            color="purple"
            onClick={() => {
              const event = new CustomEvent('openInfrastructure', { detail: 'dlna' });
              window.dispatchEvent(event);
            }}
          />
          <InfrastructureButton
            icon="🧠"
            title="AI Fix"
            description="Auto-troubleshoot"
            color="cyan"
            onClick={() => {
              const event = new CustomEvent('openInfrastructure', { detail: 'troubleshooter' });
              window.dispatchEvent(event);
            }}
          />
          <InfrastructureButton
            icon="🔀"
            title="Shuffle Play"
            description="Random discovery"
            color="pink"
            onClick={() => {
              const event = new CustomEvent('openInfrastructure', { detail: 'shuffle' });
              window.dispatchEvent(event);
            }}
          />
          <InfrastructureButton
            icon="💰"
            title="Paid Viewing"
            description="Monetize content"
            color="amber"
            onClick={() => {
              const event = new CustomEvent('openInfrastructure', { detail: 'paid' });
              window.dispatchEvent(event);
            }}
          />
          <InfrastructureButton
            icon="⚡"
            title="Anti-Buffer"
            description="Smooth playback"
            color="emerald"
            onClick={() => {
              const event = new CustomEvent('openInfrastructure', { detail: 'anti-buffering' });
              window.dispatchEvent(event);
            }}
          />
          <InfrastructureButton
            icon="💎"
            title="Subscription"
            description="Monthly plans"
            color="amber"
            onClick={() => {
              const event = new CustomEvent('openInfrastructure', { detail: 'subscription' });
              window.dispatchEvent(event);
            }}
          />
          <InfrastructureButton
            icon="🛡️"
            title="Compliance"
            description="Safety & RTA"
            color="red"
            onClick={() => {
              const event = new CustomEvent('openInfrastructure', { detail: 'compliance' });
              window.dispatchEvent(event);
            }}
          />
          <InfrastructureButton
            icon="📱"
            title="Platforms"
            description="iOS, Android, Mac"
            color="blue"
            onClick={() => {
              const event = new CustomEvent('openInfrastructure', { detail: 'platform' });
              window.dispatchEvent(event);
            }}
          />
          <InfrastructureButton
            icon="💳"
            title="Payment Config"
            description="Admin gateway setup"
            color="emerald"
            onClick={() => {
              const event = new CustomEvent('openInfrastructure', { detail: 'admin-payment' });
              window.dispatchEvent(event);
            }}
          />
          <InfrastructureButton
            icon="📊"
            title="Revenue"
            description="Earnings dashboard"
            color="purple"
            onClick={() => {
              const event = new CustomEvent('openInfrastructure', { detail: 'revenue' });
              window.dispatchEvent(event);
            }}
          />
        </div>
      </motion.div>

      {/* Connection Settings */}
      <SettingsSection icon={Globe} title="Connection" description="Network and connection settings">
        <SettingRow label="Listening Port" description="Port range for incoming connections">
          <input
            type="text"
            value={settings.portRange}
            onChange={(e) => updateSetting('portRange', e.target.value)}
            className="w-40 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm outline-none focus:border-emerald-500 transition-colors"
          />
        </SettingRow>
        <SettingRow label="DHT Network" description="Enable Distributed Hash Table">
          <Toggle checked={settings.enableDHT} onChange={(v) => updateSetting('enableDHT', v)} />
        </SettingRow>
        <SettingRow label="Peer Exchange (PeX)" description="Exchange peers with other peers">
          <Toggle checked={settings.enablePeX} onChange={(v) => updateSetting('enablePeX', v)} />
        </SettingRow>
        <SettingRow label="Local Peer Discovery" description="Discover peers on local network">
          <Toggle checked={settings.enableLPD} onChange={(v) => updateSetting('enableLPD', v)} />
        </SettingRow>
        <SettingRow label="UPnP / NAT-PMP" description="Automatic port forwarding">
          <Toggle checked={settings.enableUPnP} onChange={(v) => updateSetting('enableUPnP', v)} />
        </SettingRow>
        <SettingRow label="Encryption" description="Protocol encryption mode">
          <select
            value={settings.encryption}
            onChange={(e) => updateSetting('encryption', e.target.value)}
            className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm outline-none focus:border-emerald-500"
          >
            <option value="prefer">Prefer Encryption</option>
            <option value="force">Force Encryption</option>
            <option value="disable">Disable Encryption</option>
          </select>
        </SettingRow>
      </SettingsSection>

      {/* Speed Settings */}
      <SettingsSection icon={Download} title="Speed Limits" description="Bandwidth and transfer limits">
        <SettingRow label="Max Download Speed" description="0 = unlimited (MB/s)">
          <input
            type="number"
            value={settings.maxDownloadSpeed}
            onChange={(e) => updateSetting('maxDownloadSpeed', Number(e.target.value))}
            className="w-32 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm outline-none focus:border-emerald-500"
          />
        </SettingRow>
        <SettingRow label="Max Upload Speed" description="0 = unlimited (MB/s)">
          <input
            type="number"
            value={settings.maxUploadSpeed}
            onChange={(e) => updateSetting('maxUploadSpeed', Number(e.target.value))}
            className="w-32 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm outline-none focus:border-emerald-500"
          />
        </SettingRow>
        <SettingRow label="Max Connections (Global)" description="Maximum total connections">
          <input
            type="number"
            value={settings.maxConnections}
            onChange={(e) => updateSetting('maxConnections', Number(e.target.value))}
            className="w-32 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm outline-none focus:border-emerald-500"
          />
        </SettingRow>
        <SettingRow label="Max Peers per Torrent" description="Maximum peers per torrent">
          <input
            type="number"
            value={settings.maxPeersPerTorrent}
            onChange={(e) => updateSetting('maxPeersPerTorrent', Number(e.target.value))}
            className="w-32 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm outline-none focus:border-emerald-500"
          />
        </SettingRow>
      </SettingsSection>

      {/* Streaming Settings */}
      <SettingsSection icon={Upload} title="Streaming" description="Configure streaming behavior">
        <SettingRow label="Stream Buffer Size" description="Pre-buffer size in seconds">
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="5"
              max="120"
              value={settings.streamBuffer}
              onChange={(e) => updateSetting('streamBuffer', Number(e.target.value))}
              className="w-32"
            />
            <span className="text-sm text-white font-mono w-12">{settings.streamBuffer}s</span>
          </div>
        </SettingRow>
        <SettingRow label="Default Stream Quality" description="Quality for streaming playback">
          <select
            value={settings.streamQuality}
            onChange={(e) => updateSetting('streamQuality', e.target.value)}
            className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm outline-none focus:border-emerald-500"
          >
            <option value="auto">Auto (Adaptive)</option>
            <option value="2160p">4K (2160p)</option>
            <option value="1080p">Full HD (1080p)</option>
            <option value="720p">HD (720p)</option>
            <option value="480p">SD (480p)</option>
          </select>
        </SettingRow>
      </SettingsSection>

      {/* Storage Settings */}
      <SettingsSection icon={HardDrive} title="Storage" description="Download paths and disk management">
        <SettingRow label="Download Directory" description="Default save location for downloads">
          <input
            type="text"
            value={settings.downloadPath}
            onChange={(e) => updateSetting('downloadPath', e.target.value)}
            className="w-64 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm outline-none focus:border-emerald-500"
          />
        </SettingRow>
      </SettingsSection>

      {/* Security */}
      <SettingsSection icon={Shield} title="Security" description="Privacy and security settings">
        <SettingRow label="Anonymous Mode" description="Hide identifying information from peers">
          <Toggle checked={false} onChange={() => {}} />
        </SettingRow>
        <SettingRow label="IP Filter" description="Block connections from specific IPs">
          <Toggle checked={false} onChange={() => {}} />
        </SettingRow>
      </SettingsSection>

      {/* Appearance */}
      <SettingsSection icon={Palette} title="Appearance" description="UI customization">
        <SettingRow label="Theme" description="Application color theme">
          <select
            value={settings.theme}
            onChange={(e) => updateSetting('theme', e.target.value)}
            className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm outline-none focus:border-emerald-500"
          >
            <option value="dark">Dark (Default)</option>
            <option value="midnight">Midnight Blue</option>
            <option value="amoled">AMOLED Black</option>
          </select>
        </SettingRow>
      </SettingsSection>

      {/* Notifications */}
      <SettingsSection icon={Bell} title="Notifications" description="Alert and notification preferences">
        <SettingRow label="Enable Notifications" description="Show desktop notifications">
          <Toggle
            checked={settings.enableNotifications}
            onChange={(v) => updateSetting('enableNotifications', v)}
          />
        </SettingRow>
        <SettingRow label="Auto-start on Boot" description="Start server on system boot">
          <Toggle checked={settings.autoStart} onChange={(v) => updateSetting('autoStart', v)} />
        </SettingRow>
      </SettingsSection>
    </motion.div>
  );
}

function SettingsSection({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden"
    >
      <div className="p-5 border-b border-gray-700/50">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      </div>
      <div className="divide-y divide-gray-700/30">{children}</div>
    </motion.div>
  );
}

function SettingRow({
  label,
  description,
  children,
}: {
  label: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-700/20 transition-colors">
      <div>
        <p className="text-sm text-white font-medium">{label}</p>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
      {children}
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors ${
        checked ? 'bg-emerald-500' : 'bg-gray-600'
      }`}
    >
      <motion.div
        animate={{ x: checked ? 20 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
      />
    </button>
  );
}

function InfrastructureButton({
  icon,
  title,
  description,
  color,
  onClick,
}: {
  icon: string;
  title: string;
  description: string;
  color: string;
  onClick: () => void;
}) {
  const colorClasses: Record<string, string> = {
    orange: 'from-orange-500/20 to-orange-500/5 border-orange-500/20 hover:border-orange-500/40',
    blue: 'from-blue-500/20 to-blue-500/5 border-blue-500/20 hover:border-blue-500/40',
    emerald: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40',
    cyan: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/20 hover:border-cyan-500/40',
    red: 'from-red-500/20 to-red-500/5 border-red-500/20 hover:border-red-500/40',
    violet: 'from-violet-500/20 to-violet-500/5 border-violet-500/20 hover:border-violet-500/40',
    purple: 'from-purple-500/20 to-purple-500/5 border-purple-500/20 hover:border-purple-500/40',
    pink: 'from-pink-500/20 to-pink-500/5 border-pink-500/20 hover:border-pink-500/40',
    amber: 'from-amber-500/20 to-amber-500/5 border-amber-500/20 hover:border-amber-500/40',
    teal: 'from-teal-500/20 to-teal-500/5 border-teal-500/20 hover:border-teal-500/40',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`p-4 rounded-xl bg-gradient-to-br ${colorClasses[color]} border text-left transition-all`}
    >
      <div className="text-2xl mb-2">{icon}</div>
      <p className="text-sm font-medium text-white">{title}</p>
      <p className="text-xs text-gray-500 mt-0.5">{description}</p>
    </motion.button>
  );
}
