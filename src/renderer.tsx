/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/process-model
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */
import React from 'react';
import { createRoot } from 'react-dom/client';
import Application from './components/Application';

import './style.scss';

// Get the container element
const container = document.getElementById('application') || document.getElementById('root');

// Ensure container exists
if (!container) {
    throw new Error('Target container not found in the DOM');
}

// Create a root
const root = createRoot(container);

  // Add a safety check
  if (!window.electronAPI || !window.electronAPI.database) {
    console.error("electronAPI or database is not available!");
  }

// InitialRender
root.render(<Application />)

