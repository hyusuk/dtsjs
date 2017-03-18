var path = require('path')
var webpack = require('webpack')

module.exports = {
  entry: './src/dts.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: 'dts.js',
    libraryTarget: "var",
    library: "dtsjs"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  performance: {
    hints: false
  },
  devtool: '#source-map'
}
