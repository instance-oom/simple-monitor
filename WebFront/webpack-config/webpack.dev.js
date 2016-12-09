var WebpackMerge = require('webpack-merge');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var CommonConfig = require('./webpack.common.js');
var Helpers = require('./helpers');

module.exports = WebpackMerge(CommonConfig,
  {
    devtool: 'source-map',

    output: {
      path: Helpers.root('wwwroot'),
      publicPath: '/',
      filename: '[name].[hash].js',
      chunkFilename: '[id].[hash].chunk.js'
    },

    plugins: [
      new CleanWebpackPlugin(
        [
          './wwwroot'
        ]
      ),
      new ExtractTextPlugin('[name].css'),
      new CopyWebpackPlugin([
        {
          from: 'WebFront/src/static',
          to: 'static'
        }
      ])
    ]
  });
