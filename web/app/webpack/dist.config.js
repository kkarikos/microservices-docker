var path = require('path');
var webpack = require('webpack');
var _ = require('lodash');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var baseConfig = require('./base.config');
var args = require('minimist')(process.argv.slice(2));

var srcPath = path.join(__dirname, '/../src');
var folder = (args.env === 'dist') ? args.env :  'dist-' + args.env;
var outputPath = path.join(__dirname, '/../' + folder + '/assets');
var configPath = srcPath + '/config/' + args.env + '.js';

var config = _.merge({
  entry: {
    app: path.join(__dirname, '../src/client'),
    vendor: [
      'history',
      'immutable',
      'lodash',
      'react',
      'react-addons-css-transition-group',
      'react-dom',
      'react-interpolate-component',
      'react-redux',
      'react-router',
      'react-router-redux',
      'react-translate-component',
      'redux',
      'redux-thunk',
      'redux-logger',
      'superagent'
    ]
  },
  output: {
    path: outputPath,
    filename: '[name].js?[chunkhash]',
    chunkFilename: '[name].js?[chunkhash]',
    publicPath: 'assets/',
    sourceMapFilename: 'debugging/[name].map',
  },
  cache: false,
  devtool: 'source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.ejs',
      title: '',
      appMountId: 'app',
      filename: '../index.html',
      inject: false,
      chunksSortMode: 'none'
    }),
    new ExtractTextPlugin('styles.css', { allChunks: true }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.DefinePlugin({
  				"process.env": {
  					NODE_ENV: JSON.stringify("production")
  				}
  	}),
    new webpack.DefinePlugin({
      __DEVELOPMENT__: false,
      __DEVTOOLS__: false
    }),
    new webpack.optimize.CommonsChunkPlugin({
        names: ['vendor', 'manifest']
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      comments:false,
      compress: {
        warnings: false
      }
    }),
    new webpack.NoErrorsPlugin()
  ]
}, baseConfig);

config.resolve.alias.config = configPath;

config.module.loaders.push({
  test: /\.(js|jsx)$/,
  loader: 'babel',
  include: path.join(__dirname, '/../src')
});

config.module.loaders.push({
  test: /\.scss$/,
  loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]!autoprefixer?browsers=last 2 Chrome version!sass?outputStyle=expanded&sourceMap'),
});

module.exports = config;
