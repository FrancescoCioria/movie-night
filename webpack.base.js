var path = require('path');
var webpack = require('webpack');

var paths = {
  APP: path.resolve(__dirname, './app'),
  MAIN: path.resolve(__dirname, '.')
};

module.exports = {

  output: {
    path: paths.APP,
    filename: 'bundle.js'
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel?stage=0&loose',
        include: [paths.APP],
        exclude: /node_modules/
      }
    ],
    preLoaders: [
      {
        test: /\.jsx?$/,
        loader: 'eslint',
        include: paths.APP,
        exclude: /node_modules/
      }
    ]
  }

};