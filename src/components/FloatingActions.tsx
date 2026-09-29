import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Activity, Zap } from 'lucide-react';
import { Notification } from '../types/notifications';

interface FloatingActionsProps {
  notifications: Notification[];
  onOpenNotifications: () => void;
  onOpenActivity: () => void;
  onOpenQuickActions: () => void;
}

export default function FloatingActions({
  notifications,
  onOpenNotifications,
  onOpenActivity,
  onOpenQuickActions,
}: FloatingActionsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <AnimatePresence>
        {isExpanded && (
          <>
            {/* Notifications Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0, y: 20 }}
              transition={{ delay: 0.1 }}
              onClick={onOpenNotifications}
              className="absolute bottom-16 right-0 w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all relative"
            >
              <Bell className="w-5 h-5 text-white" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </motion.button>

            {/* Activity Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              exit={{ opacity: 0, scale: 0, y: 20 }}
              onClick={onOpenActivity}
              className="absolute bottom-16 right-14 w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all"
            >
              <Activity className="w-5 h-5 text-white" />
            </motion.button>

            {/* Quick Actions Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              exit={{ opacity: 0, scale: 0, y: 20 }}
              onClick={onOpenQuickActions}
              className="absolute bottom-16 right-28 w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all"
            >
              <Zap className="w-5 h-5 text-white" />
            </motion.button>
          </>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-xl hover:shadow-2xl transition-all"
      >
        <motion.div
          animate={{ rotate: isExpanded ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-white text-2xl font-bold"
        >
          {isExpanded ? '×' : '+'}
        </motion.div>
      </motion.button>
    </div>
  );
}
