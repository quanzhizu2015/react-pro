const path = require('path');
const utils = require('./utils');
const babelPloyfill = require('babel-polyfill');
const miniCssExtractPlugin = require('mini-css-extract-plugin')

const projectRoot = path.resolve(__dirname, '../');

const config = require('../config');

const HappyPack = require('happypack');
const count = require('os').cpus().length; // node 提供的系统操作模块
// 根据我的系统的内核数量 指定线程池个数 也可以其他数量
const happyThreadPool = HappyPack.ThreadPool({size: count})

let webpackConfig = {
    entry: {
        app: ['babel-polyfill','./src/main.js'],
        vendors: ["react", "react-dom", "redux", "react-redux", "react-router-dom"],
        ...config.themes
    },
    output: {
        path: config.build.assetsRoot,
        filename: '[name].js',
        publicPath: process.env.NODE_ENV === 'production' ?
            config.build.assetsPublicPath : config.dev.assetsPublicPath
    },
    externals: {
        baseURL: 'baseURL',
        TradingView: 'TradingView',
        _hmt: '_hmt'
    },
    resolve: {
        extensions: ['.js', '.json'],
        alias: {
            '@': utils.resolve('src')
        },
        mainFields: ['main'],
    },
    module: {
        noParse: [/react\.min\.js$/],
        rules: [
            {
                test: /\.js$/,
                use: 'happypack/loader?id=babel',
                exclude: [utils.resolve('node_modules')],
                // include: path.resolve(__dirname, 'src')
                include: [utils.resolve('src'), utils.resolve('test')]
            },
            {
                test: /\.js$/,
                loader: 'eslint-loader',
                enforce: 'pre',
                include: [utils.resolve('src'), utils.resolve('test')],
                exclude: [utils.resolve('datafeeds')],
                options: {
                    formatter: require('eslint-friendly-formatter')
                }
            },
            {
                test: /\.(png|jpe?g|gif)(\?.*)?$/,
                loader: 'url-loader',
                include: [utils.resolve('src'), utils.resolve('test')],
                options: {
                    limit: 10000,
                    name: utils.assetsPath('img/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.svg(\?.*)?$/,
                loader: 'react-svg-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('img/[name].[hash:7].[ext]')
                },
                exclude: [utils.resolve('node_modules'), utils.resolve('src/assets/iconfont/iconfont.svg')]
            },
            {
                test: /\.svg(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
                },
                include: [utils.resolve('src/assets/iconfont/iconfont.svg')]
            },
            {
                test: /\.(woff2?|eot|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                use: 'url-loader?limit=100000&mimetype=application/octet-stream',
            },
            {
                test: /\.css$/,
                use: [
                    // miniCssExtractPlugin,
                    'style-loader',
                    'happypack/loader?id=css'
                ],
                // loader: 'HappyPack/loader?id=css',
                // use: [
                //     'style-loader',
                //     'fast-css-loader?minimize=true&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
                //     'postcss-loader'
                // ],
                include: [utils.resolve('node_modules')]
            }
        ],
    },
    plugins: [
        new HappyPack({ // 基础参数设置
          id: 'babel', // 上面loader?后面指定的id
          loaders: ['babel-loader?cacheDirectory'], // 实际匹配处理的loader
          threadPool: happyThreadPool,
          // cache: true // 已被弃用
          verbose: true
        }),
        // css
        new HappyPack({
            id: 'css',
            // 是否向cmd 输出信息
            verbose: false,
            threadPool: happyThreadPool,
            loaders: [
                // 'style-loader',
                {
                    loader: "fast-css-loader",
                    options: {
                        sourceMap: true,
                        importLoaders: 1 // 前面有几个loader
                    }
                }, {
                    loader: "postcss-loader",
                    options: {
                        sourceMap: true,
                        config: { path: './build/postcss.config' }
                    }
                }
            ]
        })
    ],
}

module.exports = webpackConfig
