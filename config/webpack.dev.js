const config = require("./webpack.core");

module.exports = {
  ...config,
  mode: 'development',
  devServer: {
    static: {
      directory: 'dist',
      publicPath: 'http://localhost:3000/dist' //will be used to determine where the bundles should be served from and takes precedence.
    },
    port: 3000,
    // historyApiFallback: true,
  }
}