var Webpack = require('webpack');
var WebpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var CommonConfig = require('./webpack.common.js');
var Helpers = require('./helpers');

const env = process.env.NODE_ENV = process.env.ENV = 'production';

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
    new Webpack.NoErrorsPlugin(),
    new Webpack.optimize.UglifyJsPlugin({
      mangle: {
        keep_fnames: true
      }
    }),
    new ExtractTextPlugin('[name].[hash].css'),
    new Webpack.DefinePlugin({
      'process.env': {
        'ENV': JSON.stringify(env)
      }
    }),
    new CopyWebpackPlugin([
      {
        from: 'WebFront/src/static',
        to: 'static'
      }
    ])
  ]
});
