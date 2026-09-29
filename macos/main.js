const { app, BrowserWindow, Menu, shell, ipcMain } = require('electron');
const path = require('path');
const Store = require('electron-store');

// Initialize configuration store
const store = new Store({
  name: 'config',
  defaults: {
    windowBounds: { width: 1400, height: 900 },
    lastUrl: '',
    autoStart: false,
    theme: 'dark'
  }
});

let mainWindow;

function createWindow() {
  const { width, height } = store.get('windowBounds');
  
  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    minWidth: 1024,
    minHeight: 768,
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 15, y: 15 },
    backgroundColor: '#030712',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: true,
      allowRunningInsecureContent: false
    },
    icon: path.join(__dirname, 'build', 'icon.png'),
    show: false
  });

  // Load the app
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Save window bounds on resize
  mainWindow.on('resize', () => {
    const { width, height } = mainWindow.getBounds();
    store.set('windowBounds', { width, height });
  });

  // Handle window close
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

// Create custom menu
function createMenu() {
  const template = [
    {
      label: 'StreamVault',
      submenu: [
        {
          label: 'About StreamVault',
          click: () => {
            const { dialog } = require('electron');
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About StreamVault',
              message: 'StreamVault',
              detail: `Version: 1.0.0\n\nUltimate Streaming Server for macOS\n\n© 2024 StreamVault`,
              buttons: ['OK']
            });
          }
        },
        { type: 'separator' },
        {
          label: 'Preferences...',
          accelerator: 'Cmd+,',
          click: () => {
            mainWindow.webContents.send('navigate', '/settings');
          }
        },
        { type: 'separator' },
        {
          label: 'Services',
          role: 'services'
        },
        { type: 'separator' },
        {
          label: 'Hide StreamVault',
          accelerator: 'Cmd+H',
          role: 'hide'
        },
        {
          label: 'Hide Others',
          accelerator: 'Cmd+Option+H',
          role: 'hideOthers'
        },
        {
          label: 'Show All',
          role: 'unhide'
        },
        { type: 'separator' },
        {
          label: 'Quit StreamVault',
          accelerator: 'Cmd+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'File',
      submenu: [
        {
          label: 'New Window',
          accelerator: 'Cmd+N',
          click: () => {
            createWindow();
          }
        },
        {
          label: 'Close Window',
          accelerator: 'Cmd+W',
          click: () => {
            mainWindow.close();
          }
        },
        { type: 'separator' },
        {
          label: 'Add Torrent...',
          accelerator: 'Cmd+O',
          click: () => {
            mainWindow.webContents.send('show-add-modal');
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'delete' },
        { type: 'separator' },
        { role: 'selectAll' }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Home',
          accelerator: 'Cmd+1',
          click: () => {
            mainWindow.webContents.send('navigate', '/');
          }
        },
        {
          label: 'Movies',
          accelerator: 'Cmd+2',
          click: () => {
            mainWindow.webContents.send('navigate', '/movies');
          }
        },
        {
          label: 'TV Shows',
          accelerator: 'Cmd+3',
          click: () => {
            mainWindow.webContents.send('navigate', '/shows');
          }
        },
        {
          label: 'Torrents',
          accelerator: 'Cmd+4',
          click: () => {
            mainWindow.webContents.send('navigate', '/torrents');
          }
        },
        { type: 'separator' },
        {
          label: 'Reload',
          accelerator: 'Cmd+R',
          click: () => {
            mainWindow.reload();
          }
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: 'Cmd+Option+I',
          click: () => {
            mainWindow.webContents.toggleDevTools();
          }
        },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Playback',
      submenu: [
        {
          label: 'Play/Pause',
          accelerator: 'Space',
          click: () => {
            mainWindow.webContents.send('playback', 'toggle');
          }
        },
        {
          label: 'Stop',
          accelerator: 'Cmd+.',
          click: () => {
            mainWindow.webContents.send('playback', 'stop');
          }
        },
        { type: 'separator' },
        {
          label: 'Next',
          accelerator: 'Cmd+Right',
          click: () => {
            mainWindow.webContents.send('playback', 'next');
          }
        },
        {
          label: 'Previous',
          accelerator: 'Cmd+Left',
          click: () => {
            mainWindow.webContents.send('playback', 'previous');
          }
        },
        { type: 'separator' },
        {
          label: 'Volume Up',
          accelerator: 'Cmd+Up',
          click: () => {
            mainWindow.webContents.send('playback', 'volumeUp');
          }
        },
        {
          label: 'Volume Down',
          accelerator: 'Cmd+Down',
          click: () => {
            mainWindow.webContents.send('playback', 'volumeDown');
          }
        },
        {
          label: 'Mute',
          accelerator: 'Cmd+M',
          click: () => {
            mainWindow.webContents.send('playback', 'mute');
          }
        }
      ]
    },
    {
      label: 'Window',
      submenu: [
        {
          label: 'Minimize',
          accelerator: 'Cmd+M',
          role: 'minimize'
        },
        {
          label: 'Zoom',
          role: 'zoom'
        },
        { type: 'separator' },
        {
          label: 'Bring All to Front',
          role: 'front'
        }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Documentation',
          click: () => {
            shell.openExternal('https://docs.streamvault.app');
          }
        },
        {
          label: 'Report Issue',
          click: () => {
            shell.openExternal('https://github.com/streamvault/issues');
          }
        },
        { type: 'separator' },
        {
          label: 'Keyboard Shortcuts',
          accelerator: 'Cmd+/',
          click: () => {
            mainWindow.webContents.send('show-shortcuts');
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// App lifecycle
app.whenReady().then(() => {
  createMenu();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC handlers
ipcMain.handle('get-config', () => {
  return store.store;
});

ipcMain.handle('set-config', (event, key, value) => {
  store.set(key, value);
  return true;
});

ipcMain.handle('get-version', () => {
  return app.getVersion();
});

// Handle app updates
ipcMain.on('check-for-updates', () => {
  // Implement update checking logic here
  console.log('Checking for updates...');
});
