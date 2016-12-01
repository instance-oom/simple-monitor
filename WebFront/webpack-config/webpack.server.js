var WebpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CommonConfig = require('./webpack.common.js');
var Helpers = require('./helpers');

module.exports = WebpackMerge(CommonConfig,
{
  devtool: 'cheap-module-eval-source-map',

  output: {
    path: Helpers.root('dist'),
    filename: '[name].js',
    chunkFilename: '[id].chunk.js'
  },

  plugins: [
    new ExtractTextPlugin('[name].css')
  ],

  devServer: {
    host: '0.0.0.0',
    contentBase: './src',
    port: 9000,
    inline: true,
    historyApiFallback: {
      index: '/'
    },
    stats: 'minimal'
  }
});
