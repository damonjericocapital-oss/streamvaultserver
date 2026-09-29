import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, Check, AlertCircle, RefreshCw, ExternalLink } from 'lucide-react';
import { TorrentClientConfig, TORRENT_CLIENTS } from '../types/infrastructure';

interface TorrentClientConnectorsProps {
  clients: TorrentClientConfig[];
  onClientsChange: (clients: TorrentClientConfig[]) => void;
  onClose: () => void;
}

export default function TorrentClientConnectors({
  clients,
  onClientsChange,
  onClose,
}: TorrentClientConnectorsProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newClient, setNewClient] = useState<Partial<TorrentClientConfig>>({
    type: 'qbittorrent',
    host: 'localhost',
    port: 8080,
    useSSL: false,
  });
  const [testing, setTesting] = useState<string | null>(null);

  const handleAddClient = () => {
    if (!newClient.name || !newClient.host) return;

    const client: TorrentClientConfig = {
      id: Date.now().toString(),
      name: newClient.name!,
      type: newClient.type as TorrentClientConfig['type'],
      host: newClient.host!,
      port: newClient.port!,
      username: newClient.username,
      password: newClient.password,
      useSSL: newClient.useSSL || false,
      connected: false,
    };

    onClientsChange([...clients, client]);
    setShowAddForm(false);
    setNewClient({
      type: 'qbittorrent',
      host: 'localhost',
      port: 8080,
      useSSL: false,
    });
  };

  const handleRemoveClient = (id: string) => {
    onClientsChange(clients.filter((c) => c.id !== id));
  };

  const handleTestConnection = async (id: string) => {
    setTesting(id);
    
    // Simulate connection test
    setTimeout(() => {
      const updatedClients = clients.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            connected: true,
            lastChecked: new Date().toISOString(),
          };
        }
        return c;
      });
      onClientsChange(updatedClients);
      setTesting(null);
    }, 1500);
  };

  const handleClientTypeChange = (type: TorrentClientConfig['type']) => {
    const clientInfo = TORRENT_CLIENTS.find((c) => c.type === type);
    setNewClient({
      ...newClient,
      type,
      name: clientInfo?.name || '',
      port: clientInfo?.defaultPort || 8080,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-24 right-6 z-50 w-[600px] bg-gray-900/98 backdrop-blur-2xl rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gradient-to-r from-blue-500/5 to-cyan-500/5">
        <div>
          <h3 className="text-sm font-semibold text-white">Torrent Client Connectors</h3>
          <p className="text-xs text-gray-500">Connect to external torrent clients</p>
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
        {/* Connected Clients */}
        <div className="space-y-2">
          {clients.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">No torrent clients connected</p>
              <p className="text-xs mt-1">Add a client to get started</p>
            </div>
          ) : (
            clients.map((client) => (
              <motion.div
                key={client.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-3 rounded-lg bg-gray-800/50 border border-gray-700/50"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">
                      {TORRENT_CLIENTS.find((c) => c.type === (client.type as string))?.icon}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-white">{client.name}</p>
                      <p className="text-xs text-gray-500">
                        {client.useSSL ? 'https' : 'http'}://{client.host}:{client.port}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {client.connected ? (
                      <div className="flex items-center gap-1 px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 text-xs">
                        <Check className="w-3 h-3" />
                        Connected
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 px-2 py-1 rounded bg-gray-700 text-gray-400 text-xs">
                        <AlertCircle className="w-3 h-3" />
                        Disconnected
                      </div>
                    )}
                    <button
                      onClick={() => handleRemoveClient(client.id)}
                      className="p-1 rounded hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => handleTestConnection(client.id)}
                    disabled={testing === client.id}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 text-xs font-medium hover:bg-blue-500/30 transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
                  >
                    {testing === client.id ? (
                      <>
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-3 h-3" />
                        Test Connection
                      </>
                    )}
                  </button>
                  <button className="px-3 py-1.5 rounded-lg bg-gray-700 text-gray-300 text-xs hover:bg-gray-600 transition-colors flex items-center gap-1">
                    <ExternalLink className="w-3 h-3" />
                    Open Web UI
                  </button>
                </div>

                {client.lastChecked && (
                  <p className="text-xs text-gray-600 mt-2">
                    Last checked: {new Date(client.lastChecked).toLocaleString()}
                  </p>
                )}
              </motion.div>
            ))
          )}
        </div>

        {/* Add New Client */}
        {!showAddForm ? (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full p-3 rounded-lg border-2 border-dashed border-gray-700 hover:border-blue-500/50 text-gray-400 hover:text-blue-400 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm">Add Torrent Client</span>
          </button>
        ) : (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 rounded-lg bg-gray-800/50 border border-gray-700/50 space-y-3"
          >
            <h4 className="text-sm font-medium text-white">Add New Client</h4>

            {/* Client Type */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block">Client Type</label>
              <div className="grid grid-cols-2 gap-2">
                {TORRENT_CLIENTS.map((client) => (
                  <button
                    key={client.type}
                    onClick={() => handleClientTypeChange(client.type as TorrentClientConfig['type'])}
                    className={`p-2 rounded-lg text-left transition-all ${
                      newClient.type === client.type
                        ? 'bg-blue-500/20 border border-blue-500/50 text-blue-400'
                        : 'bg-gray-800 border border-gray-700 text-gray-300 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{client.icon}</span>
                      <span className="text-xs font-medium">{client.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Host */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block">Host</label>
              <input
                type="text"
                value={newClient.host || ''}
                onChange={(e) => setNewClient({ ...newClient, host: e.target.value })}
                placeholder="localhost"
                className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Port */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block">Port</label>
              <input
                type="number"
                value={newClient.port || ''}
                onChange={(e) => setNewClient({ ...newClient, port: Number(e.target.value) })}
                placeholder="8080"
                className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Username */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block">Username (optional)</label>
              <input
                type="text"
                value={newClient.username || ''}
                onChange={(e) => setNewClient({ ...newClient, username: e.target.value })}
                placeholder="admin"
                className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block">Password (optional)</label>
              <input
                type="password"
                value={newClient.password || ''}
                onChange={(e) => setNewClient({ ...newClient, password: e.target.value })}
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Use SSL */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Use SSL/HTTPS</p>
                <p className="text-xs text-gray-500">Secure connection</p>
              </div>
              <button
                onClick={() => setNewClient({ ...newClient, useSSL: !newClient.useSSL })}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  newClient.useSSL ? 'bg-blue-500' : 'bg-gray-600'
                }`}
              >
                <motion.div
                  animate={{ x: newClient.useSSL ? 20 : 2 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                />
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-gray-300 text-sm hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddClient}
                disabled={!newClient.host}
                className="flex-1 px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Client
              </button>
            </div>
          </motion.div>
        )}

        {/* Info */}
        <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <p className="text-xs text-blue-400 mb-1">💡 Tip</p>
          <p className="text-xs text-gray-400">
            Make sure your torrent client's Web UI is enabled and accessible. Check your client's
            settings for API access and authentication requirements.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
