import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Brain, AlertTriangle, CheckCircle, Info, Zap, RefreshCw } from 'lucide-react';
import { TroubleshooterConfig, TroubleshooterIssue } from '../types/ecosystem';

interface AITroubleshooterProps {
  config: TroubleshooterConfig;
  onConfigChange: (config: TroubleshooterConfig) => void;
  onClose: () => void;
}

export default function AITroubleshooter({ config, onConfigChange, onClose }: AITroubleshooterProps) {
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    if (config.enabled) {
      const interval = setInterval(() => {
        // Simulate real-time monitoring
        const mockIssues: TroubleshooterIssue[] = [
          {
            id: '1',
            type: 'network',
            severity: 'warning',
            title: 'High Latency Detected',
            description: 'Network latency is above 200ms, may affect streaming quality',
            detectedAt: new Date().toISOString(),
            resolved: false,
            autoFixable: true,
            solution: 'Optimizing network buffer size',
          },
          {
            id: '2',
            type: 'storage',
            severity: 'info',
            title: 'Storage Usage at 75%',
            description: 'Consider cleaning up old downloads to free space',
            detectedAt: new Date(Date.now() - 300000).toISOString(),
            resolved: false,
            autoFixable: false,
          },
          {
            id: '3',
            type: 'performance',
            severity: 'info',
            title: 'CPU Usage Normal',
            description: 'All systems running within normal parameters',
            detectedAt: new Date().toISOString(),
            resolved: true,
            autoFixable: false,
            autoFixed: true,
          },
        ];
        onConfigChange({ ...config, issues: mockIssues });
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [config.enabled]);

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      const issues: TroubleshooterIssue[] = [
        {
          id: '1',
          type: 'network',
          severity: 'warning',
          title: 'Buffer Underrun Detected',
          description: 'Streaming buffer dropped below threshold 3 times in last hour',
          detectedAt: new Date().toISOString(),
          resolved: false,
          autoFixable: true,
          solution: 'Increasing prebuffer to 5 seconds',
        },
        {
          id: '2',
          type: 'download',
          severity: 'info',
          title: 'Slow Torrent Detected',
          description: '3 torrents have fewer than 5 seeds',
          detectedAt: new Date().toISOString(),
          resolved: false,
          autoFixable: true,
          solution: 'Adding more trackers to improve peer discovery',
        },
        {
          id: '3',
          type: 'security',
          severity: 'info',
          title: 'Encryption Disabled',
          description: 'Protocol encryption is set to disabled',
          detectedAt: new Date().toISOString(),
          resolved: false,
          autoFixable: true,
          solution: 'Recommend enabling encryption for privacy',
        },
        {
          id: '4',
          type: 'playback',
          severity: 'info',
          title: 'All Systems Optimal',
          description: 'Playback performance is excellent',
          detectedAt: new Date().toISOString(),
          resolved: true,
          autoFixable: false,
          autoFixed: true,
        },
      ];
      onConfigChange({ ...config, issues });
      setAnalyzing(false);
    }, 2000);
  };

  const handleAutoFix = (issueId: string) => {
    const updatedIssues = config.issues.map((issue) =>
      issue.id === issueId ? { ...issue, resolved: true, autoFixed: true } : issue
    );
    onConfigChange({ ...config, issues: updatedIssues });
  };

  const handleAutoFixAll = () => {
    const updatedIssues = config.issues.map((issue) =>
      issue.autoFixable && !issue.resolved
        ? { ...issue, resolved: true, autoFixed: true }
        : issue
    );
    onConfigChange({ ...config, issues: updatedIssues });
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      default:
        return <Info className="w-4 h-4 text-cyan-400" />;
    }
  };

  const unresolvedCount = config.issues.filter((i) => !i.resolved).length;
  const autoFixableCount = config.issues.filter((i) => i.autoFixable && !i.resolved).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-24 right-6 z-50 w-[550px] bg-gray-900/98 backdrop-blur-2xl rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gradient-to-r from-cyan-500/5 to-blue-500/5">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-cyan-400" />
          <div>
            <h3 className="text-sm font-semibold text-white">AI Troubleshooter</h3>
            <p className="text-xs text-gray-500">Real-time system monitoring & auto-fix</p>
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
        {/* Enable Monitoring */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
          <div>
            <p className="text-sm font-medium text-white">Enable AI Monitoring</p>
            <p className="text-xs text-gray-500">Continuously monitor system health</p>
          </div>
          <button
            onClick={() => onConfigChange({ ...config, enabled: !config.enabled })}
            className={`relative w-11 h-6 rounded-full transition-colors ${
              config.enabled ? 'bg-cyan-500' : 'bg-gray-600'
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
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-center">
                <p className="text-2xl font-bold text-cyan-400">{config.issues.length}</p>
                <p className="text-xs text-gray-500">Total Issues</p>
              </div>
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-center">
                <p className="text-2xl font-bold text-amber-400">{unresolvedCount}</p>
                <p className="text-xs text-gray-500">Unresolved</p>
              </div>
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-center">
                <p className="text-2xl font-bold text-emerald-400">{autoFixableCount}</p>
                <p className="text-xs text-gray-500">Auto-Fixable</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleAnalyze}
                disabled={analyzing}
                className="flex-1 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 text-sm font-medium hover:bg-cyan-500/30 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${analyzing ? 'animate-spin' : ''}`} />
                {analyzing ? 'Analyzing...' : 'Run Full Analysis'}
              </button>
              {autoFixableCount > 0 && (
                <button
                  onClick={handleAutoFixAll}
                  className="px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-colors flex items-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  Auto-Fix All
                </button>
              )}
            </div>

            {/* Issues List */}
            <div className="space-y-2">
              {config.issues.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No issues detected</p>
                  <p className="text-xs mt-1">System is running smoothly</p>
                </div>
              ) : (
                config.issues.map((issue) => (
                  <motion.div
                    key={issue.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-3 rounded-lg border ${
                      issue.resolved
                        ? 'bg-emerald-500/5 border-emerald-500/20'
                        : 'bg-gray-800/50 border-gray-700/50'
                    }`}
                  >
                    <div className="flex items-start gap-2 mb-2">
                      {issue.resolved ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        getSeverityIcon(issue.severity)
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">{issue.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{issue.description}</p>
                      </div>
                    </div>

                    {issue.solution && (
                      <div className="ml-6 mb-2">
                        <p className="text-xs text-cyan-400">💡 {issue.solution}</p>
                      </div>
                    )}

                    {!issue.resolved && issue.autoFixable && (
                      <div className="ml-6">
                        <button
                          onClick={() => handleAutoFix(issue.id)}
                          className="px-3 py-1 rounded bg-cyan-500/20 text-cyan-400 text-xs font-medium hover:bg-cyan-500/30 transition-colors flex items-center gap-1"
                        >
                          <Zap className="w-3 h-3" />
                          Auto-Fix
                        </button>
                      </div>
                    )}

                    {issue.resolved && issue.autoFixed && (
                      <div className="ml-6">
                        <p className="text-xs text-emerald-400">✓ Auto-fixed by AI</p>
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </div>

            {/* Monitor Interval */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block">
                Monitor Interval: {config.monitorInterval} seconds
              </label>
              <input
                type="range"
                min="5"
                max="300"
                step="5"
                value={config.monitorInterval}
                onChange={(e) =>
                  onConfigChange({ ...config, monitorInterval: Number(e.target.value) })
                }
                className="w-full"
              />
            </div>

            {/* Auto-Fix */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
              <div>
                <p className="text-sm font-medium text-white">Auto-Fix Issues</p>
                <p className="text-xs text-gray-500">Automatically fix detected problems</p>
              </div>
              <button
                onClick={() => onConfigChange({ ...config, autoFix: !config.autoFix })}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  config.autoFix ? 'bg-cyan-500' : 'bg-gray-600'
                }`}
              >
                <motion.div
                  animate={{ x: config.autoFix ? 20 : 2 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                />
              </button>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
