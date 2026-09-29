import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User as UserIcon, LogOut, Settings, ChevronDown, Shield, Sparkles } from 'lucide-react';
import { useUser } from '../context/UserContext';

interface UserMenuProps {
  onOpenSettings: () => void;
}

export default function UserMenu({ onOpenSettings }: UserMenuProps) {
  const { currentUser, logout, users } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!currentUser) return null;

  const isAdmin = currentUser.role === 'admin';
  const otherUsersCount = users.length - 1;

  return (
    <div className="relative" ref={menuRef}>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-gray-800/50 transition-colors"
      >
        {/* Avatar */}
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${currentUser.avatar.colors[0]}, ${currentUser.avatar.colors[1]})`,
          }}
        >
          {currentUser.avatar.type === 'emoji' && currentUser.avatar.emoji ? (
            <span className="text-base">{currentUser.avatar.emoji}</span>
          ) : currentUser.avatar.type === 'initial' && currentUser.avatar.initial ? (
            currentUser.avatar.initial
          ) : (
            currentUser.username.charAt(0).toUpperCase()
          )}
        </div>

        {/* Username */}
        <div className="hidden sm:block text-left">
          <p className="text-sm font-medium text-white leading-tight">{currentUser.username}</p>
          <p className="text-[10px] text-gray-500 leading-tight capitalize">{currentUser.role}</p>
        </div>

        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-64 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl overflow-hidden z-50"
          >
            {/* User Info Header */}
            <div className="p-4 border-b border-gray-800 bg-gradient-to-br from-gray-900 to-gray-900/50">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold text-white shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${currentUser.avatar.colors[0]}, ${currentUser.avatar.colors[1]})`,
                  }}
                >
                  {currentUser.avatar.type === 'emoji' && currentUser.avatar.emoji ? (
                    <span>{currentUser.avatar.emoji}</span>
                  ) : currentUser.avatar.type === 'initial' && currentUser.avatar.initial ? (
                    currentUser.avatar.initial
                  ) : (
                    currentUser.username.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold truncate">{currentUser.username}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {isAdmin && <Shield className="w-3 h-3 text-amber-400" />}
                    <p className="text-xs text-gray-400 capitalize">{currentUser.role}</p>
                    {currentUser.lastLogin && (
                      <>
                        <span className="text-gray-700">•</span>
                        <p className="text-xs text-gray-500">
                          {formatLastLogin(currentUser.lastLogin)}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="px-4 py-3 border-b border-gray-800 grid grid-cols-2 gap-2">
              <div className="text-center">
                <p className="text-lg font-bold text-white">{currentUser.watchHistory.length}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Watched</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-white">{currentUser.watchlist.length}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Watchlist</p>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              {isAdmin && otherUsersCount > 0 && (
                <div className="px-4 py-2">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                    {otherUsersCount} other profile{otherUsersCount > 1 ? 's' : ''}
                  </p>
                  <div className="flex items-center gap-1 mt-1.5">
                    {users
                      .filter((u) => u.id !== currentUser.id)
                      .slice(0, 5)
                      .map((user) => (
                        <div
                          key={user.id}
                          className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold text-white"
                          style={{
                            background: `linear-gradient(135deg, ${user.avatar.colors[0]}, ${user.avatar.colors[1]})`,
                          }}
                          title={user.username}
                        >
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                      ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  onOpenSettings();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
              >
                <Settings className="w-4 h-4" />
                Preferences
              </button>

              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function formatLastLogin(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}
