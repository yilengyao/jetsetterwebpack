const rules = require('./webpack.rules');
const webpack = require('webpack');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isDevelopment = process.env.NODE_ENV !== 'production';

// Update your entry configuration to specify the correct webpack-hot-middleware client settings
const entry = isDevelopment
  ? [
      // Explicitly set the correct host and port
      'webpack-hot-middleware/client?path=http://localhost:8080/__webpack_hmr&timeout=20000&reload=true',
      './src/renderer.tsx'
    ]
  : './src/renderer.tsx';

// const plugins = require('./webpack.plugins');

// rules.push({
//   test: /\.jade$/,
//   use: 'pug-loader'
// });

rules.push(
  // Add rule for JS/JSX files
  {
    test: /\.jsx?$/,
    exclude: /node_modules/,
    use: [
      {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react'],
          plugins: [
            isDevelopment && require.resolve('react-refresh/babel')
          ].filter(Boolean)
        }
      }
    ]
  } 
)

rules.push(
  // Add rule for JS/JSX files
  {
    test: /\.jsx?$/,
    exclude: /node_modules/,
    use: [
      {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react'],
          plugins: [
            isDevelopment && require.resolve('react-refresh/babel')
          ].filter(Boolean)
        }
      }
    ]
  } 
)

module.exports = {
  mode: isDevelopment ? 'development' : 'production',
  entry: entry,
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.jade$/,
        use: ['pug-loader']
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: isDevelopment
          }
        }
      }
    ],
  },
  plugins: [
    isDevelopment && new webpack.HotModuleReplacementPlugin(),
    isDevelopment && new ReactRefreshWebpackPlugin({
      overlay: {
        sockHost: 'localhost',
        sockPort: 8080,
        sockPath: '/ws'
      }
    }),
    // Add HtmlWebpackPlugin to generate HTML
    // new HtmlWebpackPlugin({
      // template: './src/index.html'
    // }),
    // Add this plugin for development
    isDevelopment && new HtmlWebpackPlugin({
      template: './src/index.jade', // Use Jade template directly
      filename: 'index.html',
      inject: true
    }),
    // Keep your existing HTML plugin for production
    !isDevelopment && new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
  ].filter(Boolean),
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.scss', '.jade'],
  },
  // Add devServer configuration
  devServer: {
    hot: true,
    port: 8080,
    host: 'localhost',
    client: {
      webSocketURL: 'ws://localhost:8080/ws' // Explicitly set WebSocket URL
    }
  },
  performance: {
    hints: false, // Disable size warnings
    // OR set higher limits:
    // maxEntrypointSize: 500000,
    // maxAssetSize: 500000
  }
};
