const config = require("./webpack.core")
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  ...config,
  mode: 'production',
  plugins: [
    ...config.plugins,
    
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/manifest.json', to: '[name][ext]' },
        { from: 'src/background_script.js', to: '[name][ext]' },
        { from: 'assets/*', to: '[name][ext]' }
      ]
    }),
    new CleanWebpackPlugin()
  ]
}
