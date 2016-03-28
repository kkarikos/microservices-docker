var path = require('path');
var port = 8000;
var srcPath = path.join(__dirname, '/../src');

module.exports = {
  port: port,
  resolve: {
    extensions: ['', '.js', '.jsx'],
    alias: {
      actions: srcPath + '/actions/',
      components: srcPath + '/components/',
      constants: srcPath + '/constants/',
      stores: srcPath + '/stores/',
      styles: srcPath + '/styles/',
      scripts: srcPath + '/scripts/'
    }
  },
  externals: {},
  module: {
    preLoaders: [
      {
        test: /\.(js|jsx)$/,
        include: path.join(__dirname, 'src'),
        loader: 'eslint'
      }
    ],
    loaders: [
      { test: /\.css$/, loader: 'style!css' },
      { test: /\.(png|jpg|jpeg|gif|svg)$/, loader: 'url?limit=8192'},
      { test: /\.json$/, loader: 'json' },
      { test: /\.(woff|woff2)$/, loader: 'url-loader?limit=100000'},
      { test: /\.(ttf|eot)$/, loader: 'file-loader'}
    ]
  }
};
