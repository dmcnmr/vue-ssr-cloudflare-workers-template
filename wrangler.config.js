const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('@vue/cli-service/webpack.config.js')
const { find, get, findIndex } = require('lodash')

const config = merge.smart(baseConfig, {
  mode: 'production',
  entry: './src/entry-worker.js',
  target: 'webworker',
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'dist/server')
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.VUE_ENV': JSON.stringify('server'),
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ],
  optimization: {
    runtimeChunk: false,
    splitChunks: false
  },
  performance: {
    hints: false
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'vue-loader',
            options: {
              compilerOptions: {
                whitespace: 'condense'
              },
              optimizeSSR: true,
              productionMode: true,
              hotReload: false
            }
          }
        ]
      }
    ]
  }
})

const index = findIndex(config.module.rules, rule =>
  find(get(rule, 'use') || [], ({ loader }) => loader === 'babel-loader')
)

if (index !== -1) {
  config.module.rules.splice(index, 1)
}

module.exports = config
