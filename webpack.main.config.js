const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/main.ts',
  module: {
    rules: require('./webpack.rules')
  },
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
  },
  // Add this external configuration
  externals: {
    'pug': 'commonjs pug',
    'sass': 'commonjs sass',
    'chokidar': 'commonjs chokidar',
    'tedious': 'commonjs tedious',
    'mysql': 'commonjs mysql',
    'mysql2': 'commonjs mysql2',
    'oracledb': 'commonjs oracledb',
    'pg': 'commonjs pg',
    'pg-query-stream': 'commonjs pg-query-stream'
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/index.jade', to: './' }
      ]
    })
  ]
};
