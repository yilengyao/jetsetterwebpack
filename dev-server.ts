import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import { spawn, ChildProcess } from 'child_process';
import path from 'path';

// Set environment variables BEFORE importing config
process.env.NODE_ENV = 'development';
process.env.DEV_SERVER = 'true';

// Import the webpack config
// Note: You might need to update this path if your config is elsewhere
import config from './webpack.renderer.config';

// Ensure webpack-hot-middleware is available
const webpackHotMiddleware = require('webpack-hot-middleware');

// Update any configuration in dev-server.ts to use consistent port
process.env.WEBPACK_DEV_SERVER_PORT = '8080'; // Add this near the top

// In your webpack config, ensure all WebSocket references use this port:
const port = process.env.WEBPACK_DEV_SERVER_PORT || '8080';

const compiler = webpack(config);
// With this safer approach:
if (compiler.options.output) {
    compiler.options.output.publicPath = 'http://localhost:8080/';
} else {
    console.warn('Warning: compiler.options.output is undefined');
}

// Define server options with proper typing
const serverOptions: WebpackDevServer.Configuration = {
    hot: true,
    static: {
        directory: path.join(__dirname, 'dist'),
        publicPath: '/',
    },
    historyApiFallback: true,
    host: 'localhost',
    port: 8080,
    client: {
        webSocketURL: 'ws://localhost:8080/ws',
    },
    webSocketServer: 'ws',
    devMiddleware: {
        publicPath: 'http://localhost:8080/'
    },
    setupMiddlewares: (middlewares, devServer) => {
      // Add webpack-hot-middleware
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }
      
      // Add hot middleware
      middlewares.push({
        name: 'webpack-hot-middleware',
        middleware: webpackHotMiddleware(compiler, {
          path: '/__webpack_hmr',
          heartbeat: 10 * 1000
        })
      });
      
      return middlewares;
    }
}

const server = new WebpackDevServer(serverOptions, compiler);

// Start the server
const startServer = async (): Promise<void> => {
    console.log('Starting development server...');

    try {
        await server.start();
        console.log('Webpack Dev Server running at http://localhost:8080');

        // 1. Why we need to set timeout and wait for serve to be ready?
        // Start Electron after the dev server is ready
        setTimeout(() => {
            // 2. what are the argument for spawn?, does it have to be 'electron' can it by 'foo'?
            const electronProcess: ChildProcess = spawn('electron', ['.'], {
                env: process.env,
                // 3. what does stdio: 'inherit' do?
                stdio: 'inherit'
            });

            // 4. Is this the cleanup script?
            electronProcess.on('close', () => {
                server.stop().then(() => {
                    console.log('Server stopped');
                });
            });
        }, 2000);
    
    } catch (err) {
        console.error('Failed to start development server:', err);
    }
}

// Run the server
startServer();