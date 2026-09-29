import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Activity, Filter } from 'lucide-react';
import { ActivityItem } from '../types/notifications';

interface ActivityFeedProps {
  activities: ActivityItem[];
  onClose: () => void;
}

export default function ActivityFeed({ activities, onClose }: ActivityFeedProps) {
  const [filter, setFilter] = useState<'all' | ActivityItem['type']>('all');

  const filteredActivities = activities.filter((a) => {
    if (filter === 'all') return true;
    return a.type === filter;
  });

  const getTypeIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'download_complete':
        return '✅';
      case 'download_start':
        return '⬇️';
      case 'stream_start':
        return '▶️';
      case 'stream_stop':
        return '⏹️';
      case 'user_login':
        return '👤';
      case 'ai_action':
        return '🧠';
      case 'system_event':
        return '⚙️';
    }
  };

  const getTypeColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'download_complete':
        return 'text-emerald-400';
      case 'download_start':
        return 'text-blue-400';
      case 'stream_start':
        return 'text-purple-400';
      case 'stream_stop':
        return 'text-gray-400';
      case 'user_login':
        return 'text-amber-400';
      case 'ai_action':
        return 'text-cyan-400';
      case 'system_event':
        return 'text-orange-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="fixed right-0 top-0 bottom-0 w-96 bg-gray-900/95 backdrop-blur-xl border-l border-gray-800 shadow-2xl z-50 flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">Activity Feed</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
              filter === 'all'
                ? 'bg-cyan-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('download_complete')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
              filter === 'download_complete'
                ? 'bg-cyan-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Downloads
          </button>
          <button
            onClick={() => setFilter('stream_start')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
              filter === 'stream_start'
                ? 'bg-cyan-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Streaming
          </button>
          <button
            onClick={() => setFilter('ai_action')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
              filter === 'ai_action'
                ? 'bg-cyan-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            AI
          </button>
          <button
            onClick={() => setFilter('user_login')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
              filter === 'user_login'
                ? 'bg-cyan-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Users
          </button>
        </div>
      </div>

      {/* Activity List */}
      <div className="flex-1 overflow-y-auto">
        {filteredActivities.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <Activity className="w-12 h-12 mb-3 opacity-30" />
            <p className="text-sm">No activity yet</p>
          </div>
        ) : (
          <div className="p-2">
            <AnimatePresence>
              {filteredActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative pl-8 pb-4 last:pb-0"
                >
                  {/* Timeline line */}
                  {index < filteredActivities.length - 1 && (
                    <div className="absolute left-[11px] top-6 bottom-0 w-px bg-gray-800" />
                  )}

                  {/* Icon */}
                  <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center text-sm">
                    {getTypeIcon(activity.type)}
                  </div>

                  {/* Content */}
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className={`text-sm font-semibold ${getTypeColor(activity.type)}`}>
                        {activity.title}
                      </h3>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {new Date(activity.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{activity.description}</p>
                    {activity.user && (
                      <p className="text-xs text-gray-500 mt-1">by {activity.user}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
}
