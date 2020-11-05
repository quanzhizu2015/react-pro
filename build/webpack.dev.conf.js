const utils = require('./utils')
const path = require('path')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ThemeWebpackPlugin = require('./theme-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin')
const HappyPack = require('happypack')
const count = require('os').cpus().length // node 提供的系统操作模块
// 根据我的系统的内核数量 指定线程池个数 也可以其他数量
const happyThreadPool = HappyPack.ThreadPool({size: count})

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
    baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

const { env } = config.dev

module.exports = merge(baseWebpackConfig, {
    mode: JSON.parse(env.NODE_ENV),
    devtool: '#cheap-module-eval-source-map',
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'happypack/loader?id=themescss'
                    // 'fast-css-loader?minimize=true&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
                    // 'fast-sass-loader',
                    // 'postcss-loader'
                ],
                include: [utils.resolve('src/themes')]
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'happypack/loader?id=scss'
                    // 'fast-css-loader?minimize=true&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
                    // 'fast-sass-loader',
                    // 'postcss-loader'
                ],
                include: [utils.resolve('src'), utils.resolve('test')],
                exclude: [utils.resolve('src/themes')]
            }
        ]
    },
    plugins: [
        // themescss
        new HappyPack({
            id: 'themescss',
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
                },{
                    loader: "fast-sass-loader",
                    options: {
                        sourceMap: true
                    }
                }, {
                    loader: "postcss-loader",
                    options: {
                        sourceMap: true,
                        config: { path: './postcss.config' }
                    }
                }
            ]
        }),
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
                },{
                    loader: "fast-sass-loader",
                    options: {
                        sourceMap: true
                    }
                }, {
                    loader: "postcss-loader",
                    options: {
                        sourceMap: true,
                        config: { path: './postcss.config' }
                    }
                }
            ]
        }),
        new webpack.optimize.MinChunkSizePlugin({
            minChunkSize: 70000
        }),
        // new webpack.optimize.ModuleConcatenationPlugin(),
        // new DuplicatePackageCheckerPlugin(),
        new MiniCssExtractPlugin({
            filename: utils.assetsPath('css/[name].[contenthash].css'),
            chunkFilename: utils.assetsPath('css/[name].[contenthash].css')
        }),
        new webpack.DefinePlugin({
            'process.env': env,
            'process.config': JSON.stringify({
                suffix: '.json'
            })
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            inject: true
        }),
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en|zh-cn|ko/),
        new ThemeWebpackPlugin(config.themes),
        new FriendlyErrorsPlugin(),
    ]
})
