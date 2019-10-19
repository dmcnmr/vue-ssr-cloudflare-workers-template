const path = require('path')
const merge = require('webpack-merge')
const baseConfig = require('@vue/cli-service/webpack.config.js')

const config = merge.smart(baseConfig, {
  mode: 'production',
  entry: './src/entry-client.js',
  output: {
    path: path.resolve(__dirname, 'dist/client')
  }
})

module.exports = config
