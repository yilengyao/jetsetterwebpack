/// <reference path="./declarations.d.ts" />
import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import pug from 'pug';
import fs from 'fs'; 
import * as sass from 'sass';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

let reloadWatcher: any = null;

console.log("Original env:", process.env.NODE_ENV);

// In development mode, enable electron-reload
if (process.env.NODE_ENV && process.env.NODE_ENV.trim() === 'development') {
  try {
    console.log("Attempting to set up live reload in development mode");
    
    // Skip the buggy electron-reload entirely
    const appPath = app.getAppPath();
    console.log("App path:", appPath);
    
    
    // Instead, directly watch for changes and reload manually
    if (!process.env.DEV_SERVER && process.type === 'browser') {
      console.log("Setting up manual file watching");
      
      // Watch the key directories
      const chokidar = require('chokidar');
      const watcher = chokidar.watch([
        path.join(appPath, 'src'),
        path.join(appPath, '.webpack')
      ], {
        ignored: /node_modules/,
        persistent: true
      });
      
      // When files change, reload the app
      watcher.on('change', (path) => {
        console.log(`File ${path} changed, reloading...`);
        if (mainWindow) {
          mainWindow.reload();
        }
      });
      
      // Store the watcher to prevent garbage collection
      reloadWatcher = watcher;
    }
  } catch (err) {
    console.error('Failed to set up electron-reload:', err);
  }
}

let mainWindow: BrowserWindow | null = null;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      // Enable Node integration to allow require in renderer
      nodeIntegration: true,
      contextIsolation: false,
      // Add these settings:
      webSecurity: true,
      allowRunningInsecureContent: false,
      // This enables the preload script to work properly
      // with webpack's bundling:
      sandbox: false
    },
  });

  // Choose which URL to load based on environment
  if (process.env.NODE_ENV === 'development' && process.env.DEV_SERVER) {
    // Use webpack dev server with hot reloading
    console.log('Loading from webpack dev server');
    mainWindow.loadURL('http://localhost:8080');
  } else {
    // and load the index.html of the app.
    // mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
    try {
      // Create temp directory for resources
      const tempDir = path.join(app.getPath('temp'), 'electron-jade-app');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      // Correct path to your jade file (it's in .webpack/main)
      const jadePath = path.join(__dirname, 'index.jade');

      // Copy style.css from src to temp directory as style.css
      const srcStylePath = path.join(app.getAppPath(), 'src', 'style.scss');
      const tempStylePath = path.join(tempDir, 'style.css');

      if (fs.existsSync(srcStylePath)) {
        try {
          // Compile SCSS to CSS
          const result = sass.compile(srcStylePath);

          // Write the compiled CSS to the tmp directory
          fs.writeFileSync(tempStylePath, result.css);
          console.log('SCSS compiled successfully');
        } catch (sassError) {
          console.error('Error compiling SCSS:', sassError);
          // If SCSS compilation fails, fall back to copying the file
          fs.copyFileSync(srcStylePath, tempStylePath);
        }
      }

      // Copy renderer.js to temp directory
      const rendererPath = path.join(app.getAppPath(), '.webpack', 'renderer', 'main_window', 'index.js');
      const tempRendererPath = path.join(tempDir, 'renderer.js');

      if (fs.existsSync(rendererPath)) {
        fs.copyFileSync(rendererPath, tempRendererPath);
      }

      // Compile the jade file to HTML
      const html = pug.renderFile(jadePath, {
        // You can pass variables to your template here
        pretty: true,
        baseUrl: `file://${tempDir}/`
      });

      // Write HTML to temp directory
      const tempHtmlPath = path.join(tempDir, 'index.html');
      fs.writeFileSync(tempHtmlPath, html);

      console.log('Loading from webpack build');
      mainWindow.loadURL(`file://${tempHtmlPath}`);
    } catch (err) {
      console.error('Error loading jade file:', err);
      // Fallback to webpack entry
      mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
    }  
  }
  // Open DevTools in development mode
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
