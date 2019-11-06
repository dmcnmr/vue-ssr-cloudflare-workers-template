const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('@vue/cli-service/webpack.config.js')
const { find, get, findIndex, remove } = require('lodash')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const PreloadWebpackPlugin = require('@vue/preload-webpack-plugin')

const isJS = file => /\.js(\?[^.]+)?$/.test(file)

class FilterJs {
  apply(compiler) {
    compiler.hooks.emit.tapAsync('vue-server-plugin', (compilation, cb) => {
      const stats = compilation.getStats().toJson()
      const entryName = Object.keys(stats.entrypoints)[0]
      const entryInfo = stats.entrypoints[entryName]

      if (!entryInfo) {
        // #5553
        return cb()
      }

      const entryAssets = entryInfo.assets.filter(isJS)

      if (entryAssets.length > 1) {
        throw new Error(
          `Server-side bundle should have one single entry file. ` +
            `Avoid using CommonsChunkPlugin in the server config.`
        )
      }

      stats.assets.forEach(asset => {
        if (!(isJS(asset.name) || asset.name.match(/\.js\.map$/))) {
          // do not emit anything else for server
          delete compilation.assets[asset.name]
        }
      })

      cb()
    })
  }
}

const config = merge.smart(baseConfig, {
  mode: 'production',
  entry: './src/entry-worker.js',
  target: 'webworker',
  devtool: 'inline-cheap-module-source-map',
  output: {
    path: path.resolve(__dirname, 'dist/server'),
    filename: 'index.js'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.VUE_ENV': JSON.stringify('server'),
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new FilterJs(),
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    })
  ],
  optimization: {
    runtimeChunk: false,
    splitChunks: false,
    minimize: false
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

const indexBabelLoader = findIndex(config.module.rules, rule =>
  find(get(rule, 'use') || [], ({ loader }) => loader === 'babel-loader')
)

if (indexBabelLoader !== -1) {
  config.module.rules.splice(indexBabelLoader, 1)
}

remove(
  config.plugins,
  plugin =>
    plugin instanceof PreloadWebpackPlugin ||
    plugin instanceof HtmlWebpackPlugin
)

const indexEslintLoader = findIndex(config.module.rules, rule =>
  find(get(rule, 'use') || [], ({ loader }) => loader === 'eslint-loader')
)

if (indexEslintLoader !== -1) {
  config.module.rules[indexEslintLoader].exclude.unshift(
    /vendor\/vue-server-renderer/
  )
}

module.exports = config
