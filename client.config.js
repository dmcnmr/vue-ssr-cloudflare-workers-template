const path = require('path')
const merge = require('webpack-merge')
const baseConfig = require('@vue/cli-service/webpack.config.js')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const PreloadWebpackPlugin = require('@vue/preload-webpack-plugin')
const { remove } = require('lodash')

const config = merge.smart(baseConfig, {
  mode: 'production',
  entry: './src/entry-client.js',
  output: {
    path: path.resolve(__dirname, 'dist/client')
  },
  plugins: [new VueSSRClientPlugin()]
})

remove(
  config.plugins,
  plugin =>
    plugin instanceof PreloadWebpackPlugin ||
    plugin instanceof HtmlWebpackPlugin
)

module.exports = config
