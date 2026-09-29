import { motion } from 'framer-motion';
import {
  Play,
  Clock,
  HardDrive,
  Wifi,
  Signal,
  Film,
  Music,
  Tv,
  Radio,
} from 'lucide-react';
import { Torrent } from '../types';

interface StreamingViewProps {
  torrents: Torrent[];
  onStream: (torrent: Torrent) => void;
}

export default function StreamingView({ torrents, onStream }: StreamingViewProps) {
  const streamableTorrents = torrents.filter((t) => t.streamable && t.progress > 10);

  const videoTorrents = streamableTorrents.filter((t) =>
    t.files.some((f) => f.type === 'video')
  );
  const audioTorrents = streamableTorrents.filter((t) =>
    t.files.some((f) => f.type === 'audio')
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Stream Center</h2>
          <p className="text-gray-400 text-sm mt-1">
            Stream content directly while downloading • {streamableTorrents.length} streamable
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
          <Signal className="w-4 h-4 text-emerald-400" />
          <span className="text-xs text-emerald-400 font-medium">P2P Streaming Active</span>
        </div>
      </div>

      {/* Now Playing Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-900/40 via-gray-800/80 to-cyan-900/40 border border-emerald-500/20 p-6"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
        <div className="relative flex items-center gap-6">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-xl shadow-emerald-500/20"
          >
            <Play className="w-8 h-8 text-white ml-1" />
          </motion.div>
          <div className="flex-1">
            <p className="text-xs text-emerald-400 font-medium mb-1">NOW STREAMING</p>
            <h3 className="text-xl font-bold text-white">Tears of Steel (2012) [2160p]</h3>
            <p className="text-sm text-gray-400 mt-1">Streaming at 12.3 MB/s • Buffer: 98% • ETA: 7m 42s remaining</p>
            <div className="flex items-center gap-4 mt-3">
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Wifi className="w-3 h-3" /> 67 seeds connected
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Clock className="w-3 h-3" /> 12:35 / 35:42
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <HardDrive className="w-3 h-3" /> 45% downloaded
              </span>
            </div>
          </div>
          <div className="w-48 h-28 rounded-xl bg-gray-900/50 border border-gray-700/50 flex items-center justify-center">
            <div className="text-center">
              <div className="w-10 h-10 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center mb-2">
                <Film className="w-5 h-5 text-emerald-400" />
              </div>
              <p className="text-xs text-gray-500">1080p • HDR</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Video Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Tv className="w-5 h-5 text-violet-400" />
          <h3 className="text-lg font-semibold text-white">Video Content</h3>
          <span className="text-xs text-gray-500 ml-2">{videoTorrents.length} items</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videoTorrents.map((torrent, index) => (
            <motion.div
              key={torrent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="bg-gray-800/50 rounded-2xl border border-gray-700/50 overflow-hidden group cursor-pointer"
              onClick={() => onStream(torrent)}
            >
              {/* Thumbnail */}
              <div className="relative h-36 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                <motion.div
                  className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors"
                  whileHover={{ scale: 1.1 }}
                >
                  <Play className="w-6 h-6 text-white ml-0.5" />
                </motion.div>
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/60 text-xs text-white">
                  {torrent.progress}%
                </div>
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-emerald-500/20 text-xs text-emerald-400 border border-emerald-500/30">
                  Streamable
                </div>
                {/* Progress bar at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                    style={{ width: `${torrent.progress}%` }}
                  />
                </div>
              </div>
              {/* Info */}
              <div className="p-4">
                <h4 className="text-sm font-medium text-white truncate group-hover:text-emerald-400 transition-colors">
                  {torrent.name}
                </h4>
                <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                  <span>{torrent.size}</span>
                  <span className="flex items-center gap-1">
                    <Wifi className="w-3 h-3" /> {torrent.seeds} seeds
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <span className="px-2 py-0.5 rounded text-xs bg-gray-700 text-gray-400">
                    {torrent.category}
                  </span>
                  <span className="px-2 py-0.5 rounded text-xs bg-violet-500/10 text-violet-400">
                    {torrent.status}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Audio Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Radio className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-semibold text-white">Audio Content</h3>
          <span className="text-xs text-gray-500 ml-2">{audioTorrents.length} items</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {audioTorrents.map((torrent, index) => (
            <motion.div
              key={torrent.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800/50 rounded-2xl border border-gray-700/50 p-4 flex items-center gap-4 hover:border-cyan-500/30 transition-all group cursor-pointer"
              onClick={() => onStream(torrent)}
            >
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 flex items-center justify-center flex-shrink-0">
                <Music className="w-7 h-7 text-cyan-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-white truncate group-hover:text-cyan-400 transition-colors">
                  {torrent.name}
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  {torrent.files.filter((f) => f.type === 'audio').length} tracks • {torrent.size}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-emerald-400">{torrent.downloadSpeed}</span>
                  <span className="text-xs text-gray-500">{torrent.progress}% ready</span>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center group-hover:bg-cyan-500/30 transition-colors"
              >
                <Play className="w-4 h-4 text-cyan-400 ml-0.5" />
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
