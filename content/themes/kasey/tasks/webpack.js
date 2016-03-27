'use strict';

const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const chalk = require('chalk');

let sassLoaderPaths = ([]).concat(require('bourbon').includePaths, require('bourbon-neat').includePaths);

let compiler = webpack({
  entry: './entry',
  output: {
    path: './assets',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
    {
      test: /\.jsx?$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel', // 'babel-loader' is also a legal name to reference
      query: {
        presets: ['react', 'es2015']
      }
    },
    {
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract('style', `css!sass?${JSON.stringify({includePaths:sassLoaderPaths})}`)
    }
    ]
  },
  sassLoader: {
    includePaths: ([]).concat(require('bourbon').includePaths, require('bourbon-neat').includePaths)
  },
  plugins: [
    new ExtractTextPlugin('styles.css'),
  ]
});

compiler.watch({

}, function(err, stats) {
  if(err)
    return console.error(chalk.red(err));
  var jsonStats = stats.toJson();
  if(jsonStats.errors.length > 0)
    return console.error(chalk.red(jsonStats.errors));
  if(jsonStats.warnings.length > 0)
    return console.warn(chalk.yellow(jsonStats.warnings));
  console.log(chalk.green('Success'));
});
