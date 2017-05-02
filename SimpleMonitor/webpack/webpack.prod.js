const webpack = require('webpack');

/**
 * This is a prod config to be merged with the Client config
 */
module.exports = {
  output: {
    filename: '[name].min.js'
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.UglifyJsPlugin()
  ]
};