const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const srcPath = path.resolve(__dirname, '../src')
const distPath = path.resolve(__dirname, '../dist')

module.exports = {
  entry: {
    popup: path.resolve(srcPath, "./popup/popup.js"),
    // options: path.resolve(srcPath, "./src/index-options.js"),
  },
  output: {
    filename: '[name].bundle.js',
    path: distPath,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader",
        options: { presets: ["@babel/env"] }
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'popup.html',
      template: 'src/popup/popup.html',
      chunks: ['popup']
    }),
  ]
}