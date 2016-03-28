var path = require('path');
var webpack = require('webpack');
var _ = require('lodash');
var baseConfig = require('./base.config');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var publicPath = '/';
var srcPath = path.join(__dirname, '/../src');

var config = _.merge({
  entry: [
    'webpack-dev-server/client?http://127.0.0.1:8000',
    'webpack/hot/only-dev-server',
    './src/client.js'
  ],
  output: {
    path: path.join(__dirname, '/../dist/assets'),
    filename: 'app.js',
    publicPath: publicPath
  },
  devServer: {
    historyApiFallback: true,
    hot: true,
    port: 8000,
    publicPath: publicPath,
    noInfo: false
  },
  cache: true,
  devtool: 'eval',
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.ejs',
      title: '',
      appMountId: 'app',
      filename: 'index.html',
      inject: false
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.OldWatchingPlugin(),
    new webpack.DefinePlugin({
      __DEVELOPMENT__: false,
      __DEVTOOLS__: false
    })
  ]
}, baseConfig);

config.resolve.alias.config = srcPath + '/config/dev.js';

config.module.loaders.push({
  test: /\.(js|jsx)$/,
  loader: 'react-hot!babel',
  include: path.join(__dirname, '/../src')
});

config.module.loaders.push({
  test: /\.scss$/,
  loader: 'style!css?modules&importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]!autoprefixer?browsers=last 2 Chrome version!sass?outputStyle=expanded&sourceMap',
});

module.exports = config;
