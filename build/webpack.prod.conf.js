const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const config = require('../config')
const utils = require('./utils')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ThemeWebpackPlugin = require('./theme-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const loadMinified = require('./load-minified')
const HtmlIncludeAssetsPlugin = require('html-webpack-include-assets-plugin')
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin')
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')

const { env } = config.build

const HappyPack = require('happypack')
const count = require('os').cpus().length // node 提供的系统操作模块
// 根据我的系统的内核数量 指定线程池个数 也可以其他数量
const happyThreadPool = HappyPack.ThreadPool({size: count})

const webpackConfig = merge(baseWebpackConfig, {
    mode: JSON.parse(env.NODE_ENV),
    // devtool: config.build.productionSourceMap ? '#source-map' : false,
    output: {
        path: config.build.assetsRoot,
        filename: utils.assetsPath('js/[name].[chunkhash].js'),
        chunkFilename: utils.assetsPath('js/[name].[chunkhash].js')
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'happypack/loader?id=scss'
                    // 'fast-css-loader?minimize=true&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
                    // 'fast-sass-loader',
                    // 'postcss-loader'
                ],
                include: [utils.resolve('src'), utils.resolve('test')]
            }
        ]
    },
    plugins: [
        // scss
        new HappyPack({
            id: 'scss',
            // 是否向cmd 输出信息
            verbose: false,
            threadPool: happyThreadPool,
            loaders: [
                // 'style-loader',
                {
                    loader: "fast-css-loader",
                    options: {
                        sourceMap: true,
                        minimize: true,
                        importLoaders: 1 // 前面有几个loader
                    }
                }, {
                    loader: "fast-sass-loader",
                    options: {
                        sourceMap: true,
                    }
                },{
                    loader: "postcss-loader",
                    options: {
                        sourceMap: true,
                        config: { path: utils.resolve('build/postcss.config') }
                    }
                }
            ]
        }),
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en|zh-cn|ko/),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.optimize.MinChunkSizePlugin({
            minChunkSize: 70000
        }),
        new ParallelUglifyPlugin({
            cacheDir: '.cache/',
            // other uglify options
            uglifyJS: {
                output: {
                    // 最紧凑的输出
                    beautify: false,
                    // 删除所有的注释
                    comments: false,
                },
                compress: {
                    // 在UglifyJs删除没有用到的代码时不输出警告
                    warnings: false,
                    // 删除所有的 `console` 语句
                    // 还可以兼容ie浏览器
                    drop_console: true,
                    // 内嵌定义了但是只用到一次的变量
                    collapse_vars: true,
                    // 提取出出现多次但是没有定义成变量去引用的静态值
                    reduce_vars: true,
                },
                sourceMap: false
            }
        }),
        new MiniCssExtractPlugin({
            filename: utils.assetsPath('css/[name].[contenthash].css'),
            chunkFilename: utils.assetsPath('css/[name].[contenthash].css')
            // filename: "[name].css"
        }),
        new webpack.DefinePlugin({
            'process.env': env,
            'process.config': JSON.stringify({
                suffix: ''
            })
        }),
        new webpack.DllReferencePlugin({
            manifest: require('../dll/vendors-manifest.json')
        }),
        new HtmlWebpackPlugin({
            filename: config.build.index,
            template: 'index.html',
            inject: true,
            inlineSource: '.css$',
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
            },
            chunksSortMode: 'dependency',
            serviceWorkerLoader: `<script>${loadMinified(path.resolve(__dirname, 'service-worker-prod.js'))}</script>`
        }),
        new HtmlIncludeAssetsPlugin({
            assets: utils.assetsPath('../dll/vendors.dll.js'), // 添加的资源相对html的路径
            append: false // false 在其他资源的之前添加 true 在其他资源之后添加
        }),
        new HtmlWebpackInlineSourcePlugin(),
        new ThemeWebpackPlugin(config.themes),
        new SWPrecacheWebpackPlugin({
            cacheId: 'fotaweb',
            filename: 'service-worker.js',
            // 注册pwa的静态资源文件类型
            staticFileGlobs: [`${config.build.assetsRoot}/**/*.{js,css}`],
            minify: true,
            navigateFallback: config.build.assetsPublicPath + 'index.html',
            stripPrefix: config.build.assetsRoot
        }),
        // copy custom static assets
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, '../static'),
                to: config.build.assetsSubDirectory,
                ignore: ['.*']
            },
            {
                from: path.resolve(__dirname, '../robots.txt'),
                to: config.build.assetsRoot
            },
            {
                from: path.resolve(__dirname, '../.project'),
                to: config.build.assetsRoot
            },
            {
                from: path.resolve(__dirname, '../dll'),
                to: config.build.assetsRoot+ '/dll',
                ignore: ['.*']
            }
        ]),
        new webpack.DefinePlugin({
            BODYMOVIN_EXPRESSION_SUPPORT: false
        })

    ],
    optimization: {
        runtimeChunk: {
            name: 'manifest'
        },
        splitChunks: {
            chunks: "initial",
            minSize: 70000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '.',
            name: true,
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors",
                    reuseExistingChunk: true
                },
                tools: {
                    test: /[\\/]src[\\/]tools[\\/]/,
                    name: "tools"
                }
            }
        },
    },
    performance: {
        hints: false
    }
})

if (config.build.productionGzip) {
    const CompressionWebpackPlugin = require('compression-webpack-plugin')

    webpackConfig.plugins.push(
        new CompressionWebpackPlugin({
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: new RegExp(
                '\\.(' +
                config.build.productionGzipExtensions.join('|') +
                ')$'
            ),
            threshold: 10240,
            minRatio: 0.8
        })
    )
}

if (config.build.bundleAnalyzerReport) {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
    webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
