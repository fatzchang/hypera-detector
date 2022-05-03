const config = require("./webpack.core");
const path = require('path');

module.exports = {
  ...config,
  mode: 'development',
  devServer: {
    static: {
      directory: path.join(__dirname, './src'),
    },
    historyApiFallback: true
  }
}
  