import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  Trash2,
  ChevronDown,
  ChevronUp,
  Download,
  Upload,
  Users,
  Clock,
  FolderOpen,
  Magnet,
  MoreHorizontal,
} from 'lucide-react';
import { useState } from 'react';
import { Torrent } from '../types';

interface TorrentListProps {
  torrents: Torrent[];
  onStream: (torrent: Torrent) => void;
}

export default function TorrentList({ torrents, onStream }: TorrentListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const filteredTorrents = filter === 'all' ? torrents : torrents.filter((t) => t.status === filter);

  const statusColors: Record<string, string> = {
    downloading: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    seeding: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    paused: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    completed: 'bg-violet-500/10 text-violet-400 border-violet-500/30',
    error: 'bg-red-500/10 text-red-400 border-red-500/30',
    queued: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Torrent Manager</h2>
          <p className="text-gray-400 text-sm mt-1">{torrents.length} torrents • {filteredTorrents.length} shown</p>
        </div>
        <div className="flex items-center gap-2">
          {['all', 'downloading', 'seeding', 'completed', 'paused', 'queued'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === status
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-gray-800 text-gray-400 hover:text-white border border-gray-700'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Torrent List */}
      <div className="space-y-2">
        <AnimatePresence>
          {filteredTorrents.map((torrent, index) => (
            <motion.div
              key={torrent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden hover:border-gray-600/50 transition-all"
            >
              {/* Main Row */}
              <div className="p-4">
                <div className="flex items-center gap-4">
                  {/* Progress Ring */}
                  <div className="relative w-12 h-12 flex-shrink-0">
                    <svg className="w-12 h-12 -rotate-90">
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        fill="none"
                        stroke="#374151"
                        strokeWidth="3"
                      />
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        fill="none"
                        stroke={torrent.progress === 100 ? '#8b5cf6' : '#10b981'}
                        strokeWidth="3"
                        strokeDasharray={`${(torrent.progress / 100) * 125.6} 125.6`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                      {torrent.progress}%
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-white truncate">{torrent.name}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs border ${statusColors[torrent.status]}`}>
                        {torrent.status}
                      </span>
                      {torrent.streamable && (
                        <span className="px-2 py-0.5 rounded-full text-xs bg-purple-500/10 text-purple-400 border border-purple-500/30">
                          Streamable
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Download className="w-3 h-3" /> {torrent.downloadSpeed}
                      </span>
                      <span className="flex items-center gap-1">
                        <Upload className="w-3 h-3" /> {torrent.uploadSpeed}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" /> {torrent.seeds}S/{torrent.peers}P
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {torrent.eta}
                      </span>
                      <span>{torrent.size}</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="mt-2 w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${torrent.progress}%` }}
                        transition={{ duration: 1 }}
                        className={`h-full rounded-full ${
                          torrent.progress === 100
                            ? 'bg-gradient-to-r from-violet-500 to-purple-500'
                            : 'bg-gradient-to-r from-emerald-500 to-cyan-500'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {torrent.streamable && torrent.progress > 10 && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onStream(torrent)}
                        className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                      >
                        <Play className="w-4 h-4" />
                      </motion.button>
                    )}
                    <button className="p-2 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors">
                      <Pause className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setExpandedId(expandedId === torrent.id ? null : torrent.id)}
                      className="p-2 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                    >
                      {expandedId === torrent.id ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              <AnimatePresence>
                {expandedId === torrent.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-gray-700/50 overflow-hidden"
                  >
                    <div className="p-4 space-y-3">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                        <div>
                          <span className="text-gray-500">Category</span>
                          <p className="text-white font-medium mt-0.5">{torrent.category}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Added</span>
                          <p className="text-white font-medium mt-0.5">{torrent.addedDate}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Seeds</span>
                          <p className="text-emerald-400 font-medium mt-0.5">{torrent.seeds}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Peers</span>
                          <p className="text-cyan-400 font-medium mt-0.5">{torrent.peers}</p>
                        </div>
                      </div>

                      {/* Files */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <FolderOpen className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-300 font-medium">Files ({torrent.files.length})</span>
                        </div>
                        <div className="space-y-1">
                          {torrent.files.map((file, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-gray-900/50 text-xs"
                            >
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    file.type === 'video'
                                      ? 'bg-emerald-400'
                                      : file.type === 'audio'
                                      ? 'bg-cyan-400'
                                      : file.type === 'subtitle'
                                      ? 'bg-amber-400'
                                      : 'bg-gray-500'
                                  }`}
                                />
                                <span className="text-gray-300">{file.name}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-gray-500">{file.size}</span>
                                <span className="text-gray-500">{file.progress}%</span>
                                {file.streamable && (
                                  <span className="text-purple-400 text-xs">▶ stream</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-2">
                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-700 text-gray-300 text-xs hover:bg-gray-600 transition-colors">
                          <Magnet className="w-3 h-3" /> Copy Magnet
                        </button>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs hover:bg-red-500/20 transition-colors">
                          <Trash2 className="w-3 h-3" /> Remove
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
