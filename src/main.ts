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

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      // Enable Node integration to allow require in renderer
      nodeIntegration: true,
      contextIsolation: false
    },
  });

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

    // Load the HTML from temp directory
    mainWindow.loadURL(`file://${tempHtmlPath}`);
    } catch (err) {
      console.error('Error loading jade file:', err);
      // Fallback to webpack entry
      mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
   }
    // Open the DevTools.
    mainWindow.webContents.openDevTools();
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
