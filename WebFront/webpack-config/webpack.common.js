var Webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var ResolveNgRoute = require('@angularclass/resolve-angular-routes');
var Helpers = require('./helpers');
console.log(Helpers.root('WebFront', 'src/app'))
module.exports = {
  entry: {
    'polyfills': './WebFront/src/polyfills.ts',
    'vendor': './WebFront/src/vendor.ts',
    'app': './WebFront/src/main.ts'
  },

  resolve: {
    extensions: ['.ts', '.js']
  },

  module: {
    loaders: [
      {
        test: /\.ts$/,
        loaders: ['awesome-typescript-loader', 'angular2-template-loader']
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        loader: 'file?name=assets/[name].[hash].[ext]'
      },
      {
        test: /\.css$/,
        exclude: Helpers.root('WebFront', 'src/app'),
        loader: ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader: 'css-loader?sourceMap'
        })
      },
      {
        test: /\.css$/,
        include: Helpers.root('WebFront', 'src/app'),
        loader: 'raw-loader'
      }
    ]
  },

  plugins: [
    new Webpack.ContextReplacementPlugin(
      // The (\\|\/) piece accounts for path separators in *nix and Windows
      /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
      Helpers.root('WebFront', 'src'),
      ResolveNgRoute(Helpers.root('WebFront', 'src'))
    ),
    new Webpack.optimize.CommonsChunkPlugin({
      name: ['app', 'vendor', 'polyfills']
    }),
    new HtmlWebpackPlugin({
      template: 'WebFront/src/index.html'
    })
  ]
};
