const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: [
    './lib/apis/youtube.js',
    './lib/apis/github.js'
  ],
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js'
  },
  resolveLoader: {
    root: path.join(__dirname, 'node_modules'),
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/,
        query: {
                presets: ['es2015']
            }
      }
    ]
  }
}