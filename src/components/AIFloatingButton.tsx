import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, X, Zap, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { AIInsight } from '../types/ai';
import { Torrent, ServerStats } from '../types';
import { generateAutoInsights } from '../engine/aiEngine';

interface AIButtonProps {
  onClick: () => void;
  isOpen: boolean;
  torrents: Torrent[];
  stats: ServerStats;
}

export default function AIFloatingButton({ onClick, isOpen, torrents, stats }: AIButtonProps) {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [showInsights, setShowInsights] = useState(false);
  const [pulseCount, setPulseCount] = useState(0);

  // Generate insights periodically
  useEffect(() => {
    const newInsights = generateAutoInsights(torrents, stats);
    setInsights(newInsights);
    setPulseCount(newInsights.filter((i) => i.severity === 'critical' || i.severity === 'warning').length);
  }, [torrents, stats]);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      default:
        return <Info className="w-4 h-4 text-cyan-400" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'border-red-500/30 bg-red-500/5';
      case 'warning':
        return 'border-amber-500/30 bg-amber-500/5';
      case 'success':
        return 'border-emerald-500/30 bg-emerald-500/5';
      default:
        return 'border-cyan-500/30 bg-cyan-500/5';
    }
  };

  return (
    <>
      {/* Insights Panel */}
      <AnimatePresence>
        {showInsights && insights.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-[75] w-80 bg-gray-900/98 backdrop-blur-2xl rounded-2xl border border-gray-700/50 shadow-2xl shadow-black/50 overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-semibold text-white">AI Insights</span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                  {insights.length}
                </span>
              </div>
              <button
                onClick={() => setShowInsights(false)}
                className="p-1 rounded hover:bg-gray-800 text-gray-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="max-h-64 overflow-y-auto p-3 space-y-2">
              {insights.map((insight) => (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-3 rounded-xl border ${getSeverityColor(insight.severity)}`}
                >
                  <div className="flex items-start gap-2">
                    {getSeverityIcon(insight.severity)}
                    <div className="flex-1">
                      <p className="text-xs font-medium text-white">{insight.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{insight.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      {!isOpen && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="fixed bottom-6 right-6 z-[75] flex flex-col items-end gap-3"
        >
          {/* Insights Toggle */}
          {insights.length > 0 && (
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowInsights(!showInsights)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-800/90 backdrop-blur-sm border border-gray-700/50 text-xs text-gray-300 hover:text-white hover:border-emerald-500/30 transition-all shadow-lg"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{insights.length} insights</span>
              {pulseCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-amber-500 text-[10px] text-white flex items-center justify-center font-bold">
                  {pulseCount}
                </span>
              )}
            </motion.button>
          )}

          {/* Main AI Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClick}
            className="relative group"
          >
            {/* Glow Effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />

            {/* Pulse Ring */}
            {pulseCount > 0 && (
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-full bg-amber-500/30"
              />
            )}

            {/* Button */}
            <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-xl shadow-emerald-500/30">
              <Brain className="w-6 h-6 text-white" />
            </div>

            {/* Label */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-gray-800 text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Ask NEXUS AI
            </div>
          </motion.button>
        </motion.div>
      )}
    </>
  );
}
