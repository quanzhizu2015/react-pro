const path = require('path')
const webpack = require('webpack')
// const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// const MomentLocalesPlugin = require('moment-locales-webpack-plugin')

module.exports = {
    // mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    entry: {
        vendors: [
            // 'babel-polyfill',
            'react',
            'react-dom',
            'react-router',
            'react-router-dom',
            'redux',
            'react-loadable',
            'react-helmet',
            'i18next',
            'react-i18next',
            'antd',
        ]
    },
    output: {
        path: path.resolve('./dist'),
        filename: '[name].dll.js',
        library: '[name]_library'
    },
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            loader: 'babel-loader',
            exclude: /node_modules/
        }]
    },

    plugins: [
        /*
          @desc: https://webpack.js.org/plugins/module-concatenation-plugin/
          "作用域提升(scope hoisting)",使代码体积更小[函数申明会产生大量代码](#webpack3)
        */
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn|en/),
        new webpack.DllPlugin({
            path: path.resolve('./dist', '[name]-manifest.json'),
            name: '[name]_library'
        }),
        // new BundleAnalyzerPlugin({ analyzerPort: 18011 }),
        // new ParallelUglifyPlugin({
        //     cacheDir: '.cache/',
        //     // other uglify options
        //     uglifyJS: {
        //         output: {
        //             // 最紧凑的输出
        //             beautify: false,
        //             // 删除所有的注释
        //             comments: false,
        //         },

        //         compress: {
        //             // 在UglifyJs删除没有用到的代码时不输出警告
        //             warnings: false,
        //             // 删除所有的 `console` 语句
        //             // 还可以兼容ie浏览器
        //             drop_console: true,
        //             // 内嵌定义了但是只用到一次的变量
        //             collapse_vars: true,
        //             // 提取出出现多次但是没有定义成变量去引用的静态值
        //             reduce_vars: true,
        //         },
        //         sourceMap: false
        //     }
        // }),
        // Compress extracted CSS. We are using this plugin so that possible
        // duplicated CSS from different components can be deduped.
        // new OptimizeCSSAssetsPlugin({
        //     canPrint: false,
        //     cssProcessorOptions: {
        //         safe: true,
        //     }
        // })

    ]
}
