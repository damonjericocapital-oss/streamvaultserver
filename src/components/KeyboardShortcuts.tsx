import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Keyboard } from 'lucide-react';

interface KeyboardShortcutsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function KeyboardShortcuts({ isOpen, onClose }: KeyboardShortcutsProps) {
  const shortcuts = [
    {
      category: 'Navigation',
      items: [
        { keys: ['G', 'H'], description: 'Go to Home' },
        { keys: ['G', 'M'], description: 'Go to Movies' },
        { keys: ['G', 'S'], description: 'Go to TV Shows' },
        { keys: ['G', 'T'], description: 'Go to Torrents' },
        { keys: ['G', 'A'], description: 'Go to AI Agent' },
      ],
    },
    {
      category: 'Playback',
      items: [
        { keys: ['Space'], description: 'Play/Pause' },
        { keys: ['K'], description: 'Play/Pause' },
        { keys: ['F'], description: 'Toggle Fullscreen' },
        { keys: ['M'], description: 'Mute/Unmute' },
        { keys: ['←'], description: 'Seek backward 10s' },
        { keys: ['→'], description: 'Seek forward 10s' },
        { keys: ['↑'], description: 'Volume up' },
        { keys: ['↓'], description: 'Volume down' },
        { keys: ['C'], description: 'Toggle subtitles' },
      ],
    },
    {
      category: 'Actions',
      items: [
        { keys: ['N'], description: 'Open notifications' },
        { keys: ['A'], description: 'Open activity feed' },
        { keys: ['Q'], description: 'Open quick actions' },
        { keys: ['?'], description: 'Show keyboard shortcuts' },
        { keys: ['Esc'], description: 'Close modal/panel' },
      ],
    },
    {
      category: 'Media',
      items: [
        { keys: ['S'], description: 'Start shuffle play' },
        { keys: ['/'], description: 'Focus search' },
        { keys: ['Ctrl', 'K'], description: 'Command palette' },
      ],
    },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-3xl bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl max-h-[80vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                  <Keyboard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Keyboard Shortcuts</h2>
                  <p className="text-sm text-gray-400">Master StreamVault with keyboard</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {shortcuts.map((category, idx) => (
                <motion.div
                  key={category.category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider mb-3">
                    {category.category}
                  </h3>
                  <div className="space-y-2">
                    {category.items.map((shortcut, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2 bg-gray-800/50 rounded-lg"
                      >
                        <span className="text-sm text-gray-300">{shortcut.description}</span>
                        <div className="flex items-center gap-1">
                          {shortcut.keys.map((key, j) => (
                            <React.Fragment key={j}>
                              <kbd className="px-2 py-1 text-xs font-mono font-semibold text-gray-300 bg-gray-700 border border-gray-600 rounded">
                                {key}
                              </kbd>
                              {j < shortcut.keys.length - 1 && (
                                <span className="text-xs text-gray-500">+</span>
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-800 bg-gray-800/30">
            <p className="text-xs text-gray-500 text-center">
              Press <kbd className="px-2 py-0.5 text-xs font-mono bg-gray-700 rounded">?</kbd> to
              toggle this help panel
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
