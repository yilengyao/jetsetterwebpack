const rules = require('./webpack.rules');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const isDevelopment = process.env.NODE_ENV !== 'production';
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

module.exports = {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
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
    ],
  },
  plugins: [
    isDevelopment && new ReactRefreshWebpackPlugin()
  ].filter(Boolean),
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.jade'],
  },
};
