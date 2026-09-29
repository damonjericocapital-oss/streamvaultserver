const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Configuration
  getConfig: () => ipcRenderer.invoke('get-config'),
  setConfig: (key, value) => ipcRenderer.invoke('set-config', key, value),
  
  // App info
  getVersion: () => ipcRenderer.invoke('get-version'),
  
  // Navigation
  navigate: (path) => ipcRenderer.send('navigate', path),
  
  // Playback controls
  playback: (action) => ipcRenderer.send('playback', action),
  
  // UI controls
  showAddModal: () => ipcRenderer.send('show-add-modal'),
  showShortcuts: () => ipcRenderer.send('show-shortcuts'),
  
  // Updates
  checkForUpdates: () => ipcRenderer.send('check-for-updates'),
  
  // Event listeners
  onNavigate: (callback) => ipcRenderer.on('navigate', (event, path) => callback(path)),
  onPlayback: (callback) => ipcRenderer.on('playback', (event, action) => callback(action)),
  onShowAddModal: (callback) => ipcRenderer.on('show-add-modal', () => callback()),
  onShowShortcuts: (callback) => ipcRenderer.on('show-shortcuts', () => callback()),
  
  // Remove listeners
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel)
});
