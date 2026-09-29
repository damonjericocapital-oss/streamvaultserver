import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, AvatarConfig, UserPreferences, WatchHistoryEntry, AVATAR_PRESETS } from '../types/user';

interface UserContextType extends AuthState {
  login: (username: string, pin: string) => { success: boolean; error?: string };
  logout: () => void;
  createUser: (username: string, pin: string, avatar: AvatarConfig, role: 'admin' | 'user' | 'kid') => void;
  deleteUser: (userId: string) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  addToWatchHistory: (entry: WatchHistoryEntry) => void;
  toggleWatchlist: (mediaId: string) => void;
  rateMedia: (mediaId: string, rating: number) => void;
  changeMasterPin: (newPin: string) => void;
  isFirstRun: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const STORAGE_KEY = 'streamvault_users';
const AUTH_KEY = 'streamvault_auth';
const MASTER_PIN_KEY = 'streamvault_master_pin';

const DEFAULT_PREFERENCES: UserPreferences = {
  autoPlay: true,
  autoNext: true,
  subtitles: false,
  subtitleLanguage: 'en',
  audioLanguage: 'en',
  playbackSpeed: 1,
  quality: 'auto',
  theme: 'dark',
  notifications: true,
  parentalControls: {
    enabled: false,
    maxRating: 10,
    blockedGenres: [],
    pinRequired: false,
  },
};

function loadUsers(): User[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveUsers(users: User[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

function loadCurrentUser(): User | null {
  try {
    const stored = localStorage.getItem(AUTH_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function saveCurrentUser(user: User | null) {
  if (user) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(AUTH_KEY);
  }
}

function getMasterPin(): string {
  return localStorage.getItem(MASTER_PIN_KEY) || '';
}

function setMasterPin(pin: string) {
  localStorage.setItem(MASTER_PIN_KEY, pin);
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(loadUsers);
  const [currentUser, setCurrentUser] = useState<User | null>(loadCurrentUser);
  const [masterPin, setMasterPinState] = useState<string>(getMasterPin);
  const [isFirstRun, setIsFirstRun] = useState<boolean>(!localStorage.getItem(STORAGE_KEY));

  useEffect(() => {
    saveUsers(users);
  }, [users]);

  useEffect(() => {
    saveCurrentUser(currentUser);
  }, [currentUser]);

  const login = (username: string, pin: string) => {
    const user = users.find((u) => u.username.toLowerCase() === username.toLowerCase());
    if (!user) return { success: false, error: 'User not found' };
    if (user.pin && user.pin !== pin) {
      // Check master pin as fallback
      if (masterPin && pin === masterPin) {
        const updated = { ...user, lastLogin: new Date().toISOString() };
        setUsers((prev) => prev.map((u) => (u.id === user.id ? updated : u)));
        setCurrentUser(updated);
        return { success: true };
      }
      return { success: false, error: 'Incorrect PIN' };
    }
    const updated = { ...user, lastLogin: new Date().toISOString() };
    setUsers((prev) => prev.map((u) => (u.id === user.id ? updated : u)));
    setCurrentUser(updated);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const createUser = (username: string, pin: string, avatar: AvatarConfig, role: 'admin' | 'user' | 'kid') => {
    const newUser: User = {
      id: Math.random().toString(36).substring(2, 11),
      username,
      pin,
      avatar,
      role,
      createdAt: new Date().toISOString(),
      preferences: DEFAULT_PREFERENCES,
      watchHistory: [],
      watchlist: [],
    };
    setUsers((prev) => [...prev, newUser]);
    return newUser;
  };

  const deleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    if (currentUser?.id === userId) {
      setCurrentUser(null);
    }
  };

  const updateUser = (userId: string, updates: Partial<User>) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, ...updates } : u)));
    if (currentUser?.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, ...updates } : null));
    }
  };

  const updatePreferences = (prefs: Partial<UserPreferences>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, preferences: { ...currentUser.preferences, ...prefs } };
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updated : u)));
    setCurrentUser(updated);
  };

  const addToWatchHistory = (entry: WatchHistoryEntry) => {
    if (!currentUser) return;
    const existing = currentUser.watchHistory.findIndex((h) => h.mediaId === entry.mediaId);
    let newHistory;
    if (existing >= 0) {
      newHistory = [...currentUser.watchHistory];
      newHistory[existing] = entry;
    } else {
      newHistory = [entry, ...currentUser.watchHistory];
    }
    const updated = { ...currentUser, watchHistory: newHistory };
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updated : u)));
    setCurrentUser(updated);
  };

  const toggleWatchlist = (mediaId: string) => {
    if (!currentUser) return;
    const isInList = currentUser.watchlist.includes(mediaId);
    const newWatchlist = isInList
      ? currentUser.watchlist.filter((id) => id !== mediaId)
      : [mediaId, ...currentUser.watchlist];
    const updated = { ...currentUser, watchlist: newWatchlist };
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updated : u)));
    setCurrentUser(updated);
  };

  const rateMedia = (mediaId: string, rating: number) => {
    if (!currentUser) return;
    const newHistory = currentUser.watchHistory.map((h) =>
      h.mediaId === mediaId ? { ...h, rating } : h
    );
    const updated = { ...currentUser, watchHistory: newHistory };
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updated : u)));
    setCurrentUser(updated);
  };

  const changeMasterPin = (newPin: string) => {
    setMasterPinState(newPin);
    setMasterPin(newPin);
  };

  return (
    <UserContext.Provider
      value={{
        isAuthenticated: !!currentUser,
        currentUser,
        users,
        masterPin,
        login,
        logout,
        createUser,
        deleteUser,
        updateUser,
        updatePreferences,
        addToWatchHistory,
        toggleWatchlist,
        rateMedia,
        changeMasterPin,
        isFirstRun,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
}
