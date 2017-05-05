const webpackMerge = require('webpack-merge');
const commonPartial = require('./webpack/webpack.common');
const { getAotPlugin } = require('./webpack/webpack.aot');

module.exports = function (options, webpackOptions) {
  options = options || {};  
  
   console.log(`Running build for client with AoT Compilation`);

  let clientConfig = webpackMerge({},
    commonPartial,    
    {
      plugins: [
        getAotPlugin('client', true)
      ]
    });

  if (options.prod) {
    clientConfig = webpackMerge({}, clientConfig);    
  } else {
    clientConfig.devtool = 'inline-source-map';
  }

  const configs = [];
  configs.push(clientConfig);

  return configs;
}