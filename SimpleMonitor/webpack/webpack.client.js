const { root } = require('./helpers');
const clientBundleOutputDir = root('./wwwroot/dist');

/**
 * This is a client config which should be merged on top of common config
 */
module.exports = {
  entry: {
    'main': root('./ClientApp/main.ts'),
    'angular2': root('./ClientApp/angular2.ts')
  },
  output: {
    path: clientBundleOutputDir
  },
  target: 'web',
  plugins: [

  ]
};
