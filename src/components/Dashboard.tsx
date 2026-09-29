import { motion } from 'framer-motion';
import {
  Download,
  Upload,
  HardDrive,
  Activity,
  Cpu,
  MemoryStick,
  Clock,
  TrendingUp,
  Server,
  ArrowDownCircle,
  ArrowUpCircle,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ServerStats, Torrent } from '../types';
import { speedHistory } from '../data/mockData';

interface DashboardProps {
  stats: ServerStats;
  torrents: Torrent[];
}

export default function Dashboard({ stats, torrents }: DashboardProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Server Dashboard</h2>
          <p className="text-gray-400 text-sm mt-1">Real-time monitoring & statistics</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-emerald-400 font-medium">Server Online</span>
        </div>
      </div>

      {/* Stats Grid */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={ArrowDownCircle}
          label="Download Speed"
          value={`${stats.downloadSpeed} MB/s`}
          color="emerald"
          subtext={`Total: ${stats.totalDownloaded}`}
        />
        <StatCard
          icon={ArrowUpCircle}
          label="Upload Speed"
          value={`${stats.uploadSpeed} MB/s`}
          color="cyan"
          subtext={`Total: ${stats.totalUploaded}`}
        />
        <StatCard
          icon={Activity}
          label="Active Torrents"
          value={`${stats.activeTorrents} / ${stats.totalTorrents}`}
          color="violet"
          subtext="5 downloading, 2 seeding"
        />
        <StatCard
          icon={HardDrive}
          label="Storage"
          value={`${stats.diskUsed} / ${stats.diskSpace}`}
          color="amber"
          subtext="70% used"
        />
      </motion.div>

      {/* System Stats */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SystemStatCard icon={Cpu} label="CPU Usage" value={stats.cpuUsage} color="emerald" />
        <SystemStatCard icon={MemoryStick} label="Memory" value={stats.memoryUsage} color="cyan" />
        <SystemStatCard icon={Clock} label="Uptime" value={null} text={stats.uptime} color="violet" />
      </motion.div>

      {/* Speed Chart */}
      <motion.div variants={item} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-semibold text-white">Network Activity</h3>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-gray-400">Download</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-1.5 rounded-full bg-cyan-400" />
              <span className="text-gray-400">Upload</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={speedHistory}>
            <defs>
              <linearGradient id="downloadGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="uploadGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="time" stroke="#6b7280" fontSize={11} />
            <YAxis stroke="#6b7280" fontSize={11} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '12px',
                fontSize: '12px',
              }}
              labelStyle={{ color: '#9ca3af' }}
            />
            <Area
              type="monotone"
              dataKey="download"
              stroke="#10b981"
              fill="url(#downloadGradient)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="upload"
              stroke="#06b6d4"
              fill="url(#uploadGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Recent Activity */}
      <motion.div variants={item} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Server className="w-5 h-5 text-violet-400" />
          <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
        </div>
        <div className="space-y-3">
          {torrents.slice(0, 5).map((torrent) => (
            <div
              key={torrent.id}
              className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-700/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-2 h-2 rounded-full ${
                    torrent.status === 'downloading'
                      ? 'bg-emerald-400 animate-pulse'
                      : torrent.status === 'seeding'
                      ? 'bg-cyan-400'
                      : torrent.status === 'completed'
                      ? 'bg-violet-400'
                      : 'bg-gray-500'
                  }`}
                />
                <span className="text-sm text-gray-300 truncate max-w-md">{torrent.name}</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>{torrent.size}</span>
                <span
                  className={`px-2 py-0.5 rounded-full ${
                    torrent.status === 'downloading'
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : torrent.status === 'seeding'
                      ? 'bg-cyan-500/10 text-cyan-400'
                      : torrent.status === 'completed'
                      ? 'bg-violet-500/10 text-violet-400'
                      : 'bg-gray-500/10 text-gray-400'
                  }`}
                >
                  {torrent.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  subtext,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
  subtext: string;
}) {
  const colorClasses: Record<string, string> = {
    emerald: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/20 text-emerald-400',
    cyan: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/20 text-cyan-400',
    violet: 'from-violet-500/20 to-violet-500/5 border-violet-500/20 text-violet-400',
    amber: 'from-amber-500/20 to-amber-500/5 border-amber-500/20 text-amber-400',
  };

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.02 }}
      className={`bg-gradient-to-br ${colorClasses[color]} border rounded-2xl p-5`}
    >
      <div className="flex items-center gap-3 mb-3">
        <Icon className="w-5 h-5" />
        <span className="text-sm text-gray-400">{label}</span>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{subtext}</p>
    </motion.div>
  );
}

function SystemStatCard({
  icon: Icon,
  label,
  value,
  text,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: number | null;
  text?: string;
  color: string;
}) {
  const colorMap: Record<string, string> = {
    emerald: 'bg-emerald-400',
    cyan: 'bg-cyan-400',
    violet: 'bg-violet-400',
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-400">{label}</span>
        </div>
        {value !== null && <span className="text-sm font-mono text-white">{value}%</span>}
        {text && <span className="text-sm font-mono text-white">{text}</span>}
      </div>
      {value !== null && (
        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${value}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`h-full rounded-full ${colorMap[color]}`}
          />
        </div>
      )}
    </div>
  );
}
