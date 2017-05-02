const webpackMerge = require('webpack-merge');
const commonPartial = require('./webpack/webpack.common');
const clientPartial = require('./webpack/webpack.client');
const prodPartial = require('./webpack/webpack.prod');
const { getAotPlugin } = require('./webpack/webpack.aot');

module.exports = function(options, webpackOptions) {
  webpackOptions = webpackOptions || {};
  
   console.log(`Running build for client with AoT Compilation`);

  let clientConfig = webpackMerge({},
    commonPartial,
    clientPartial,
    {
      plugins: [
        getAotPlugin('client', true)
      ]
    });

  if (webpackOptions.prod) {
    clientConfig = webpackMerge({}, clientConfig, prodPartial);    
  } else {
    clientConfig.devtool = 'inline-source-map';
  }

  const configs = [];
  configs.push(clientConfig);

  return configs;
}