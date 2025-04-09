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
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/index.jade', to: './' }
      ]
    })
  ]
};
