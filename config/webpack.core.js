const path = require('path');
const srcPath = path.resolve(__dirname, '../src')
const distPath = path.resolve(__dirname, '../dist')

module.exports = {
  entry: {
    popup: path.resolve(srcPath, "./popup.js"),
    // options: path.resolve(srcPath, "./src/index-options.js"),
  },
  output: {
    filename: '[name].bundle.js',
    path: distPath,
    publicPath: '',
  },
  module: {
      
  },
  plugins: [
    
  ]
}