import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Check, Trash2, Filter } from 'lucide-react';
import { Notification } from '../types/notifications';

interface NotificationsCenterProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
  onClose: () => void;
}

export default function NotificationsCenter({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onClearAll,
  onClose,
}: NotificationsCenterProps) {
  const [filter, setFilter] = useState<'all' | 'unread' | Notification['type']>('all');

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.read;
    return n.type === filter;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'critical':
        return 'border-red-500/50 bg-red-500/5';
      case 'high':
        return 'border-orange-500/50 bg-orange-500/5';
      case 'medium':
        return 'border-yellow-500/50 bg-yellow-500/5';
      case 'low':
        return 'border-gray-700/50 bg-gray-800/30';
    }
  };

  const getTypeIcon = (type: Notification['type']) => {
    switch (type) {
      case 'download':
        return '⬇️';
      case 'stream':
        return '▶️';
      case 'ai':
        return '🧠';
      case 'system':
        return '⚙️';
      case 'social':
        return '👥';
      case 'security':
        return '🔒';
      case 'update':
        return '🔄';
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
            <Bell className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white">Notifications</h2>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold bg-amber-500 text-white rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onMarkAllAsRead}
            disabled={unreadCount === 0}
            className="flex-1 px-3 py-1.5 text-xs font-medium bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Mark all as read
          </button>
          <button
            onClick={onClearAll}
            disabled={notifications.length === 0}
            className="flex-1 px-3 py-1.5 text-xs font-medium bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Clear all
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mt-3 overflow-x-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
              filter === 'all'
                ? 'bg-amber-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
              filter === 'unread'
                ? 'bg-amber-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Unread
          </button>
          <button
            onClick={() => setFilter('download')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
              filter === 'download'
                ? 'bg-amber-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Downloads
          </button>
          <button
            onClick={() => setFilter('ai')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
              filter === 'ai'
                ? 'bg-amber-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            AI
          </button>
          <button
            onClick={() => setFilter('system')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
              filter === 'system'
                ? 'bg-amber-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            System
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto">
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <Bell className="w-12 h-12 mb-3 opacity-30" />
            <p className="text-sm">No notifications</p>
          </div>
        ) : (
          <div className="p-2 space-y-2">
            <AnimatePresence>
              {filteredNotifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -300 }}
                  className={`p-3 rounded-lg border ${getPriorityColor(
                    notification.priority
                  )} ${!notification.read ? 'ring-1 ring-amber-500/30' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{getTypeIcon(notification.type)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-semibold text-white">
                          {notification.title}
                        </h3>
                        <div className="flex items-center gap-1">
                          {!notification.read && (
                            <button
                              onClick={() => onMarkAsRead(notification.id)}
                              className="p-1 rounded hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                              title="Mark as read"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                          )}
                          <button
                            onClick={() => onDelete(notification.id)}
                            className="p-1 rounded hover:bg-gray-700 text-gray-400 hover:text-red-400 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{notification.message}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">
                          {new Date(notification.timestamp).toLocaleString()}
                        </span>
                        {notification.action && (
                          <button
                            onClick={() => {
                              // Handle action
                              console.log('Action:', notification.action);
                            }}
                            className="px-2 py-1 text-xs font-medium bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded transition-colors"
                          >
                            {notification.action.label}
                          </button>
                        )}
                      </div>
                    </div>
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
