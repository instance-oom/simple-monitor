const webpack = require('webpack');

module.exports = {  
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    filename: '[name].js',
    publicPath: '/dist/'
  },
  module: {
    rules: [
      { test: /\.ts$/, use: '@ngtools/webpack' },
      { test: /\.css$/, use: ['to-string-loader', 'css-loader'] },
      { test: /\.html$/, use: 'html-loader' },
      { test: /\.scss$/, use: ['to-string-loader', 'css-loader', 'sass-loader'] },
      { test: /\.(woff2?|ttf|eot|svg)$/, use: 'url-loader?limit=10000' }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: ['app', 'angular2']
    })
  ]
}