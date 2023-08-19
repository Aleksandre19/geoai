const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: {
    chat: './js/original/chat/main.js',
    style: './css/original/style.css'
  },

  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'js/webpack/chat'),
    assetModuleFilename: '../../../css/webpack/assets/[hash][ext][query]',
    publicPath: '/',
    clean: true,
  },

   module: {
     rules: [
      {
        test: /\.js$/,       // Apply this rule to files ending in .js
        exclude: /node_modules/,  // Do not apply to files in the node_modules directory
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        type: 'asset/resource'
      }
    ]
  },
   
  plugins: [
    new MiniCssExtractPlugin({
      filename: '../../../css/webpack/css/styles.bundle.css'
    }),
    new webpack.IgnorePlugin({
        resourceRegExp: /^style\.bundle\.js$/,  // This regular expression will match the output JS file for the 'style' entry
    }),
  ]
};