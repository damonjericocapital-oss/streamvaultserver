import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Lock, User as UserIcon, ArrowRight, Sparkles, Shield } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { AvatarConfig } from '../types/user';

export default function LoginScreen() {
  const { users, login, masterPin, isFirstRun, createUser, changeMasterPin } = useUser();
  const [mode, setMode] = useState<'select' | 'login' | 'create' | 'setup'>('select');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  // New user form state
  const [newUsername, setNewUsername] = useState('');
  const [newPin, setNewPin] = useState('');
  const [newAvatar, setNewAvatar] = useState<AvatarConfig>({
    type: 'gradient',
    colors: ['#f59e0b', '#ef4444'],
  });
  const [newRole, setNewRole] = useState<'admin' | 'user' | 'kid'>('user');

  // First-run setup
  const [setupStep, setSetupStep] = useState(0);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPin, setAdminPin] = useState('');

  useEffect(() => {
    if (isFirstRun || users.length === 0) {
      setMode('setup');
    } else if (users.length === 1 && !users[0].pin) {
      // Single user with no PIN - auto-login
      login(users[0].username, '');
    }
  }, []);

  const handleUserSelect = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    if (!user.pin) {
      // No PIN required
      login(user.username, '');
      return;
    }

    setSelectedUser(userId);
    setMode('login');
    setPin('');
    setError('');
  };

  const handlePinSubmit = () => {
    const user = users.find((u) => u.id === selectedUser);
    if (!user) return;

    const result = login(user.username, pin);
    if (!result.success) {
      setError(result.error || 'Invalid PIN');
      setShake(true);
      setPin('');
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleCreateUser = () => {
    if (!newUsername.trim()) {
      setError('Username is required');
      return;
    }
    if (users.some((u) => u.username.toLowerCase() === newUsername.toLowerCase())) {
      setError('Username already exists');
      return;
    }
    createUser(newUsername, newPin, newAvatar, newRole);
    setMode('select');
    setNewUsername('');
    setNewPin('');
    setError('');
  };

  const handleSetupComplete = () => {
    if (!adminUsername.trim() || !adminPin.trim()) {
      setError('Username and PIN are required');
      return;
    }
    if (adminPin.length < 4) {
      setError('PIN must be at least 4 digits');
      return;
    }
    changeMasterPin(adminPin);
    createUser(adminUsername, adminPin, { type: 'gradient', colors: ['#f59e0b', '#ef4444'] }, 'admin');
    setMode('select');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] bg-gray-950 overflow-hidden"
    >
      {/* Cinematic Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-gray-950 to-orange-900/20" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        <AnimatePresence mode="wait">
          {mode === 'setup' && (
            <SetupScreen
              key="setup"
              step={setupStep}
              username={adminUsername}
              pin={adminPin}
              error={error}
              onUsernameChange={setAdminUsername}
              onPinChange={setAdminPin}
              onError={setError}
              onNext={() => {
                if (!adminUsername.trim()) {
                  setError('Username is required');
                  return;
                }
                setError('');
                setSetupStep(1);
              }}
              onComplete={handleSetupComplete}
            />
          )}

          {mode === 'select' && (
            <motion.div
              key="select"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-4xl"
            >
              {/* Logo */}
              <div className="text-center mb-12">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-2xl shadow-amber-500/30"
                >
                  <Play className="w-10 h-10 text-white fill-white" />
                </motion.div>
                <h1 className="text-4xl font-bold text-white mb-2">Who's watching?</h1>
                <p className="text-gray-400">Select your profile to continue</p>
              </div>

              {/* User Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-8">
                {users.map((user, index) => (
                  <motion.button
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleUserSelect(user.id)}
                    className="group flex flex-col items-center"
                  >
                    <div
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden mb-3 ring-2 ring-transparent group-hover:ring-amber-400 transition-all shadow-xl"
                      style={{
                        background: `linear-gradient(135deg, ${user.avatar.colors[0]}, ${user.avatar.colors[1]})`,
                      }}
                    >
                      {user.avatar.type === 'emoji' && user.avatar.emoji && (
                        <div className="w-full h-full flex items-center justify-center text-4xl">
                          {user.avatar.emoji}
                        </div>
                      )}
                      {user.avatar.type === 'initial' && user.avatar.initial && (
                        <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-white">
                          {user.avatar.initial}
                        </div>
                      )}
                      {user.avatar.type === 'gradient' && (
                        <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-white/80">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors font-medium">
                      {user.username}
                    </span>
                    {user.role === 'admin' && (
                      <span className="text-[10px] text-amber-400 mt-1">Admin</span>
                    )}
                    {user.role === 'kid' && (
                      <span className="text-[10px] text-emerald-400 mt-1">Kids</span>
                    )}
                  </motion.button>
                ))}

                {/* Add User Button */}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: users.length * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setMode('create')}
                  className="group flex flex-col items-center"
                >
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-2 border-dashed border-gray-700 group-hover:border-amber-400 flex items-center justify-center transition-all mb-3">
                    <span className="text-4xl text-gray-600 group-hover:text-amber-400 transition-colors">+</span>
                  </div>
                  <span className="text-sm text-gray-500 group-hover:text-white transition-colors">
                    Add Profile
                  </span>
                </motion.button>
              </div>

              {/* Manage Profiles */}
              {users.some((u) => u.role === 'admin') && (
                <div className="text-center">
                  <button
                    onClick={() => setMode('create')}
                    className="text-sm text-gray-500 hover:text-white transition-colors"
                  >
                    Manage Profiles
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {mode === 'login' && (
            <motion.div
              key="login"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-md"
            >
              {/* User Avatar */}
              <div className="text-center mb-8">
                {(() => {
                  const user = users.find((u) => u.id === selectedUser);
                  if (!user) return null;
                  return (
                    <div
                      className="w-28 h-28 mx-auto rounded-2xl mb-4 shadow-2xl"
                      style={{
                        background: `linear-gradient(135deg, ${user.avatar.colors[0]}, ${user.avatar.colors[1]})`,
                      }}
                    >
                      <div className="w-full h-full flex items-center justify-center text-5xl font-bold text-white/80">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                    </div>
                  );
                })()}
                <h2 className="text-2xl font-bold text-white mb-2">
                  {users.find((u) => u.id === selectedUser)?.username}
                </h2>
                <p className="text-gray-400 text-sm">Enter your PIN to continue</p>
              </div>

              {/* PIN Input */}
              <motion.div
                animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.4 }}
                className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800 p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Lock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-400">PIN Code</span>
                </div>

                <input
                  type="password"
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value);
                    setError('');
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handlePinSubmit()}
                  placeholder="Enter 4-digit PIN"
                  maxLength={10}
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white text-center text-2xl tracking-widest font-mono outline-none focus:border-amber-500 transition-colors"
                />

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm mt-3 text-center"
                  >
                    {error}
                  </motion.p>
                )}

                <div className="flex items-center gap-3 mt-6">
                  <button
                    onClick={() => {
                      setMode('select');
                      setSelectedUser(null);
                      setPin('');
                      setError('');
                    }}
                    className="flex-1 px-4 py-3 rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors font-medium"
                  >
                    Back
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePinSubmit}
                    disabled={!pin}
                    className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {mode === 'create' && (
            <motion.div
              key="create"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-md"
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Create Profile</h2>
                <p className="text-gray-400 text-sm">Set up a new user account</p>
              </div>

              <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800 p-6 space-y-4">
                {/* Username */}
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Username</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => {
                        setNewUsername(e.target.value);
                        setError('');
                      }}
                      placeholder="Enter username"
                      maxLength={20}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                </div>

                {/* PIN */}
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">
                    PIN Code <span className="text-gray-600">(optional)</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="password"
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value)}
                      placeholder="4-digit PIN"
                      maxLength={10}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Role */}
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Profile Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['admin', 'user', 'kid'] as const).map((role) => (
                      <button
                        key={role}
                        onClick={() => setNewRole(role)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          newRole === role
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600'
                        }`}
                      >
                        {role === 'admin' && '👑 Admin'}
                        {role === 'user' && '👤 User'}
                        {role === 'kid' && '🧒 Kids'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Avatar Selection */}
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Avatar Color</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      ['#f59e0b', '#ef4444'],
                      ['#06b6d4', '#3b82f6'],
                      ['#10b981', '#059669'],
                      ['#8b5cf6', '#ec4899'],
                      ['#1e293b', '#475569'],
                      ['#f43f5e', '#fb7185'],
                      ['#f59e0b', '#fbbf24'],
                      ['#10b981', '#34d399'],
                    ].map((colors, i) => (
                      <button
                        key={i}
                        onClick={() => setNewAvatar({ type: 'gradient', colors: colors as [string, string] })}
                        className={`w-full aspect-square rounded-lg transition-all ${
                          newAvatar.colors[0] === colors[0] && newAvatar.colors[1] === colors[1]
                            ? 'ring-2 ring-white scale-110'
                            : 'hover:scale-105'
                        }`}
                        style={{
                          background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {error && (
                  <p className="text-red-400 text-sm text-center">{error}</p>
                )}

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      setMode('select');
                      setError('');
                    }}
                    className="flex-1 px-4 py-3 rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCreateUser}
                    className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium flex items-center justify-center gap-2"
                  >
                    Create
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function SetupScreen({
  step,
  username,
  pin,
  error,
  onUsernameChange,
  onPinChange,
  onError,
  onNext,
  onComplete,
}: {
  step: number;
  username: string;
  pin: string;
  error: string;
  onUsernameChange: (v: string) => void;
  onPinChange: (v: string) => void;
  onError: (v: string) => void;
  onNext: () => void;
  onComplete: () => void;
}) {
  return (
    <motion.div
      key="setup"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-md"
    >
      {/* Logo */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-2xl shadow-amber-500/30"
        >
          <Play className="w-10 h-10 text-white fill-white" />
        </motion.div>
        <h1 className="text-3xl font-bold text-white mb-2">Welcome to StreamVault</h1>
        <p className="text-gray-400">Let's set up your server</p>
      </div>

      <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800 p-6">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-6">
          <div className={`flex-1 h-1 rounded-full ${step >= 0 ? 'bg-amber-500' : 'bg-gray-700'}`} />
          <div className={`flex-1 h-1 rounded-full ${step >= 1 ? 'bg-amber-500' : 'bg-gray-700'}`} />
        </div>

        {step === 0 && (
          <>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-semibold text-white">Create Admin Account</h3>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              This account will have full control over the server, including managing other users.
            </p>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Admin Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    onUsernameChange(e.target.value);
                    onError('');
                  }}
                  placeholder="e.g. admin"
                  maxLength={20}
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:border-amber-500 transition-colors"
                />
              </div>
              <button
                onClick={onNext}
                className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium flex items-center justify-center gap-2"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-semibold text-white">Set Your PIN</h3>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              This PIN will be required to sign in and will serve as the master PIN for managing other users.
            </p>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Master PIN</label>
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => {
                    onPinChange(e.target.value);
                    onError('');
                  }}
                  placeholder="Enter 4-digit PIN"
                  maxLength={10}
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white text-center text-2xl tracking-widest font-mono outline-none focus:border-amber-500 transition-colors"
                />
              </div>
              {error && <p className="text-red-400 text-sm text-center">{error}</p>}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onError('')}
                  className="flex-1 px-4 py-3 rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors font-medium"
                >
                  Back
                </button>
                <button
                  onClick={onComplete}
                  className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium flex items-center justify-center gap-2"
                >
                  Complete Setup
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
