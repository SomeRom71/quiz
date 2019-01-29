const path = require('path')

const glob = require('glob')
const webpack = require('webpack')
const merge = require('webpack-merge')
const HtmlPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const StylelintPlugin = require('stylelint-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const CleanPlugin = require('clean-webpack-plugin')
const { StatsWriterPlugin } = require('webpack-stats-plugin')

const parts = require('./webpack.parts')

const lintJSOptions = {
  emitWarning: true,
  // Fail only on errors
  failOnWarning: false,
  failOnError: true,

  // Toggle autofix
  fix: true,
  cache: true,

  formatter: require('eslint-friendly-formatter')
}

/*
  To move all assets to some static folder
  getPaths({ staticDir: 'some-name' })

  To rename asset build folder
  getPaths({ js: 'some-name' })

  To move assets to the root build folder
  getPaths({ css: '' })

  Defaults values:
     sourceDir - 'app',
      buildDir - 'build',
     staticDir - '',

        images - 'images',
         fonts - 'fonts',
           css - 'styles',
            js - 'scripts'
*/
const paths = getPaths()

const lintStylesOptions = {
  context: path.resolve(__dirname, `${paths.app}/styles`),
  syntax: 'scss',
  emitErrors: false,
  fix: true
}

const cssPreprocessorLoader = { loader: 'fast-sass-loader' }

const commonConfig = merge([
  {
    context: paths.app,
    resolve: {
      unsafeCache: true,
      symlinks: false
    },
    entry: `${paths.app}/scripts`,
    output: {
      path: paths.build,
      publicPath: parts.publicPath
    },
    stats: {
      warningsFilter: warning => warning.includes('entrypoint size limit'),
      children: false,
      modules: false
    },
    plugins: [
      new HtmlPlugin({
        template: './index.pug'
      }),
      new FriendlyErrorsPlugin(),
      new StylelintPlugin(lintStylesOptions)
    ],
    module: {
      noParse: /\.min\.js/
    }
  },
  parts.loadPug(),
  parts.lintJS({ include: paths.app, options: lintJSOptions }),
  parts.loadFonts({
    include: paths.app,
    options: {
      name: '[name].[ext]',
      outputPath: `${paths.fonts}`
    }
  })
])

const productionConfig = merge([
  {
    mode: 'production',
    optimization: {
      splitChunks: {
        chunks: 'all'
      },
      runtimeChunk: 'single'
    },
    output: {
      chunkFilename: `${paths.js}/[name].js`,
      filename: `${paths.js}/[name].js`
    },
    performance: {
      hints: 'warning', // 'error' or false are valid too
      maxEntrypointSize: 100000, // in bytes
      maxAssetSize: 450000 // in bytes
    },
    plugins: [
      new StatsWriterPlugin({ fields: null, filename: '../stats.json' }),
      new webpack.HashedModuleIdsPlugin(),
      new ManifestPlugin(),
      new CleanPlugin(paths.build)
    ]
  },
  parts.loadJS({
    include: paths.app,
    options: {
      cacheDirectory: true
    }
  }),
  parts.extractCSS({
    include: paths.app,
    use: [parts.autoprefix(), cssPreprocessorLoader],
    options: {
      filename: `${paths.css}/[name].css`,
      chunkFilename: `${paths.css}/[id].css`
    }
  }),
  parts.purifyCSS({
    paths: glob.sync(`${paths.app}/**/*.+(pug|js)`, { nodir: true }),
    styleExtensions: ['.css', '.scss']
  }),
  parts.loadImages({
    include: paths.app,
    options: {
      limit: 100,
      name: `${paths.images}/[name].[ext]`
    }
  }),
  // should go after loading images
  parts.optimizeImages()
])

const developmentConfig = merge([
  {
    mode: 'development'
  },
  parts.devServer({
    host: process.env.HOST,
    port: process.env.PORT
  }),
  parts.loadCSS({ include: paths.app, use: [cssPreprocessorLoader] }),
  parts.loadImages({ include: paths.app }),
  parts.loadJS({ include: paths.app })
])

module.exports = env => {
  process.env.NODE_ENV = env

  return merge(
    commonConfig,
    env === 'production' ? productionConfig : developmentConfig
  )
}

function getPaths ({
  sourceDir = 'app',
  buildDir = 'build',
  staticDir = '',
  images = 'images',
  fonts = 'fonts',
  js = 'scripts',
  css = 'styles'
} = {}) {
  const assets = { images, fonts, js, css }

  return Object.keys(assets).reduce((obj, assetName) => {
    const assetPath = assets[assetName]

    obj[assetName] = !staticDir ? assetPath : `${staticDir}${assetPath}`

    return obj
  }, {
    app: path.join(__dirname, sourceDir),
    build: path.join(__dirname, buildDir),
    staticDir
  })
}
