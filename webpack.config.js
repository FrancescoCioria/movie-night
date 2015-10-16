var path = require('path');
var webpack = require('webpack');
var webpackBase = require('./webpack.base');
var assign = require('lodash/object').assign;

var paths = {
  APP: path.resolve(__dirname, './app')
};

module.exports = assign(webpackBase, {

  entry: [
    'webpack/hot/dev-server',
    paths.APP + '/index.js'
  ],

  devtool: 'source-map',

  devServer: {
    contentBase: paths.APP,
    hot: true,
    inline: true,
    hostname: '0.0.0.0',
    port: '8080'
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ]

});
