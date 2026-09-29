import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap } from 'lucide-react';
import { QuickAction, QUICK_ACTIONS } from '../types/notifications';

interface QuickActionsPanelProps {
  onAction: (action: QuickAction) => void;
  onClose: () => void;
}

export default function QuickActionsPanel({ onAction, onClose }: QuickActionsPanelProps) {
  const [executing, setExecuting] = useState<string | null>(null);

  const handleAction = (action: QuickAction) => {
    setExecuting(action.id);
    setTimeout(() => {
      onAction(action);
      setExecuting(null);
    }, 500);
  };

  const categories = {
    media: QUICK_ACTIONS.filter((a) => a.category === 'media'),
    system: QUICK_ACTIONS.filter((a) => a.category === 'system'),
    ai: QUICK_ACTIONS.filter((a) => a.category === 'ai'),
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed bottom-24 right-6 w-80 bg-gray-900/95 backdrop-blur-xl border border-gray-800 rounded-2xl shadow-2xl z-50"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white">Quick Actions</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
        {/* Media Actions */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Media
          </h3>
          <div className="space-y-2">
            {categories.media.map((action) => (
              <motion.button
                key={action.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAction(action)}
                disabled={executing === action.id}
                className="w-full flex items-center gap-3 p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
              >
                <span className="text-2xl">{action.icon}</span>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-white">{action.label}</p>
                  <p className="text-xs text-gray-400">{action.description}</p>
                </div>
                {executing === action.id && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full"
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* System Actions */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            System
          </h3>
          <div className="space-y-2">
            {categories.system.map((action) => (
              <motion.button
                key={action.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAction(action)}
                disabled={executing === action.id}
                className="w-full flex items-center gap-3 p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
              >
                <span className="text-2xl">{action.icon}</span>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-white">{action.label}</p>
                  <p className="text-xs text-gray-400">{action.description}</p>
                </div>
                {executing === action.id && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full"
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* AI Actions */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            AI
          </h3>
          <div className="space-y-2">
            {categories.ai.map((action) => (
              <motion.button
                key={action.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAction(action)}
                disabled={executing === action.id}
                className="w-full flex items-center gap-3 p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
              >
                <span className="text-2xl">{action.icon}</span>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-white">{action.label}</p>
                  <p className="text-xs text-gray-400">{action.description}</p>
                </div>
                {executing === action.id && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full"
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
