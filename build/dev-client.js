(function() {
    'use strict';
    require('eventsource-polyfill');

    const options = require('querystring').parse(__resourceQuery.slice(1));

    // 这里还没引入babel-polyfill，所以不能使用es6语法
    if (!('reload' in options)) {
        options.reload = true;
    }

    // autoConnect=false 设置自动连接为手动连接，以改变client的参数；
    const WebpackHotMiddlewareClient = require('webpack-hot-middleware/client?autoConnect=false&reload=true');

    WebpackHotMiddlewareClient.setOptionsAndConnect(options);

    // client 订阅事件
    WebpackHotMiddlewareClient.subscribe(function(payload) {

        // 当接收到刷新事件时，刷新当前页面
        if (payload.action === 'reload' || payload.reload === true) {
            window.location.reload();
        }

    });

    module.exports = WebpackHotMiddlewareClient;
}());
