import { motion } from 'framer-motion';
import {
  Brain,
  Zap,
  Shield,
  Activity,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  Cpu,
  BarChart3,
  Power,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { AIInsight } from '../types/ai';
import { Torrent, ServerStats } from '../types';

interface AIPanelProps {
  torrents: Torrent[];
  stats: ServerStats;
  insights: AIInsight[];
  autoPilot: boolean;
  onToggleAutoPilot: () => void;
}

export default function AIPanel({ torrents, stats, insights, autoPilot, onToggleAutoPilot }: AIPanelProps) {
  const healthScore = calculateHealth(stats, torrents);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Brain className="w-6 h-6 text-emerald-400" />
            AI Command Center
          </h2>
          <p className="text-gray-400 text-sm mt-1">NEXUS intelligent monitoring & automation</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleAutoPilot}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            autoPilot
              ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/20'
              : 'bg-gray-800 text-gray-400 border border-gray-700 hover:text-white'
          }`}
        >
          <Power className="w-4 h-4" />
          {autoPilot ? 'Auto-Pilot ON' : 'Auto-Pilot OFF'}
        </motion.button>
      </div>

      {/* Health Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-400">Server Health Score</h3>
          <span className={`text-3xl font-bold ${
            healthScore > 80 ? 'text-emerald-400' : healthScore > 60 ? 'text-amber-400' : 'text-red-400'
          }`}>
            {healthScore}
          </span>
        </div>
        <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${healthScore}%` }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className={`h-full rounded-full ${
              healthScore > 80
                ? 'bg-gradient-to-r from-emerald-500 to-cyan-500'
                : healthScore > 60
                ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                : 'bg-gradient-to-r from-red-500 to-rose-500'
            }`}
          />
        </div>
        <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
          <span>{healthScore > 80 ? '🟢 Excellent' : healthScore > 60 ? '🟡 Good' : '🔴 Needs Attention'}</span>
          <span>Last checked: just now</span>
        </div>
      </motion.div>

      {/* AI Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        <MetricCard
          icon={TrendingUp}
          label="Efficiency"
          value="94%"
          trend="+2.3%"
          color="emerald"
        />
        <MetricCard
          icon={Activity}
          label="Network Health"
          value="Good"
          trend="Stable"
          color="cyan"
        />
        <MetricCard
          icon={Cpu}
          label="Resource Usage"
          value={`${stats.cpuUsage}%`}
          trend={stats.cpuUsage > 70 ? 'High' : 'Normal'}
          color={stats.cpuUsage > 70 ? 'amber' : 'emerald'}
        />
        <MetricCard
          icon={BarChart3}
          label="Share Ratio"
          value="1.42"
          trend="+0.05"
          color="violet"
        />
      </div>

      {/* Auto-Pilot Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`rounded-2xl border p-5 ${
          autoPilot
            ? 'bg-emerald-500/5 border-emerald-500/30'
            : 'bg-gray-800/50 border-gray-700/50'
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Zap className={`w-5 h-5 ${autoPilot ? 'text-emerald-400' : 'text-gray-500'}`} />
            <h3 className="text-sm font-semibold text-white">Auto-Pilot Mode</h3>
          </div>
          {autoPilot && (
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-emerald-400">Active</span>
            </div>
          )}
        </div>
        {autoPilot ? (
          <div className="space-y-2">
            <AutoPilotTask label="Optimizing connection pool" status="complete" />
            <AutoPilotTask label="Monitoring download speeds" status="active" />
            <AutoPilotTask label="Auto-categorizing new torrents" status="active" />
            <AutoPilotTask label="Seeding ratio management" status="pending" />
          </div>
        ) : (
          <p className="text-xs text-gray-500">
            Enable Auto-Pilot to let NEXUS automatically optimize your server, manage downloads, and maintain health.
          </p>
        )}
      </motion.div>

      {/* AI Insights Feed */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-white">Live Insights</h3>
          </div>
          <button className="text-xs text-gray-500 hover:text-white flex items-center gap-1 transition-colors">
            <RefreshCw className="w-3 h-3" /> Refresh
          </button>
        </div>
        <div className="space-y-2">
          {insights.length > 0 ? (
            insights.map((insight, index) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-xl bg-gray-800/30 border border-gray-700/30 hover:border-gray-600/50 transition-colors"
              >
                <div className="mt-0.5">
                  {insight.severity === 'critical' && <AlertCircle className="w-4 h-4 text-red-400" />}
                  {insight.severity === 'warning' && <AlertCircle className="w-4 h-4 text-amber-400" />}
                  {insight.severity === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  {insight.severity === 'info' && <Activity className="w-4 h-4 text-cyan-400" />}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-white">{insight.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{insight.description}</p>
                </div>
                <span className="text-[10px] text-gray-600 flex items-center gap-1 whitespace-nowrap">
                  <Clock className="w-3 h-3" />
                  {formatTimeAgo(insight.timestamp)}
                </span>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500 text-sm">
              <Shield className="w-8 h-8 mx-auto mb-2 text-gray-700" />
              <p>All systems nominal</p>
              <p className="text-xs mt-1">No issues detected</p>
            </div>
          )}
        </div>
      </div>

      {/* AI Actions Log */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-violet-400" />
          <h3 className="text-sm font-semibold text-white">Recent AI Actions</h3>
        </div>
        <div className="space-y-2">
          {[
            { action: 'Optimized connection settings', time: '2m ago', type: 'optimize' },
            { action: 'Categorized 3 new torrents', time: '5m ago', type: 'organize' },
            { action: 'Adjusted buffer for streaming', time: '8m ago', type: 'stream' },
            { action: 'Cleared 120MB cache', time: '15m ago', type: 'maintenance' },
            { action: 'Reconnected to 5 lost peers', time: '22m ago', type: 'network' },
          ].map((log, i) => (
            <div key={i} className="flex items-center gap-3 text-xs">
              <div className={`w-1.5 h-1.5 rounded-full ${
                log.type === 'optimize' ? 'bg-emerald-400' :
                log.type === 'organize' ? 'bg-violet-400' :
                log.type === 'stream' ? 'bg-cyan-400' :
                log.type === 'maintenance' ? 'bg-amber-400' :
                'bg-blue-400'
              }`} />
              <span className="text-gray-300 flex-1">{log.action}</span>
              <span className="text-gray-600">{log.time}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  trend,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  trend: string;
  color: string;
}) {
  const colors: Record<string, string> = {
    emerald: 'text-emerald-400',
    cyan: 'text-cyan-400',
    violet: 'text-violet-400',
    amber: 'text-amber-400',
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4"
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${colors[color]}`} />
        <span className="text-xs text-gray-500">{label}</span>
      </div>
      <p className={`text-xl font-bold ${colors[color]}`}>{value}</p>
      <p className="text-xs text-gray-500 mt-1">{trend}</p>
    </motion.div>
  );
}

function AutoPilotTask({ label, status }: { label: string; status: 'active' | 'complete' | 'pending' }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      {status === 'complete' && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
      {status === 'active' && <div className="w-3 h-3 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />}
      {status === 'pending' && <div className="w-3 h-3 rounded-full border border-gray-600" />}
      <span className={status === 'pending' ? 'text-gray-500' : 'text-gray-300'}>{label}</span>
    </div>
  );
}

function calculateHealth(stats: ServerStats, torrents: Torrent[]): number {
  let score = 100;
  if (stats.cpuUsage > 80) score -= 15;
  else if (stats.cpuUsage > 60) score -= 5;
  if (stats.memoryUsage > 80) score -= 15;
  else if (stats.memoryUsage > 60) score -= 5;
  const errors = torrents.filter((t) => t.status === 'error').length;
  score -= errors * 10;
  return Math.max(0, Math.min(100, score));
}

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  return `${Math.floor(seconds / 3600)}h ago`;
}
