/* eslint-disable */
import React from 'react'
import { connect } from 'react-redux'
import './marketline.scss'
import { withRouter } from 'react-router'
import throttle from 'lodash/throttle';
const TradingView = require('TradingView')
import Socket from './api/socket'
import Datafeed from './api/datafees'

let paramAryfresh
// const socket = new Socket()
const paramary = {
    resolution: '15', // 1m
    klineId: '', // 从数据来选择
    type: 2, // 2是USDT
    limit: 150,
    endTime: parseInt((Date.now() / 1000), 10)
}
const isHistory = {
    isRequestHistory: false,
    endTime: null,
}
const socket = new Socket()
let firstInit = true
@withRouter
@connect(state => ({
    apis: state.apis,
    theme: state.theme,
    usdkData: state.usdkData,
    contractData: state.contractData,
    lang: state.lang,
    wsObj: state.wsObj,
    wsData: state.wsData,
    sendWs: state.sendWs,
    wsConnet: state.wsConnet,
    dispatch: state.dispatch,
    savePoints: state.savePoints,
    points: state.points
}))

export default class Tradingview extends React.Component {
    constructor(props) {
        super(props)
        this.widgets = null;
        this.datafeeds = new Datafeed(this);
        this.symbolName = 'ETH/BTC';
        this.interval = '15';
        this.cacheData = {};
        this.lastTime = null;
        this.getBarTimer = null;
        this.isLoading = true;
        this.initMessage = throttle(this.initMessage, 1000); // 函数节流
    }
    componentDidMount() {
        this.cacheData = {}
        this.getPoints()
        // 发送推送
        // this.init()
    }
    componentWillReceiveProps(props) {
        if (document.getElementById('tv_chart_container') === null) {
            return
        }
        // 重连重新订阅并k线重新加载
        // if (props.wsConnet === true && props.wsConnet !== this.props.wsConnet && paramAryfresh) {
        //     this.getklinelist(paramAryfresh)
        //     if (this.widgets && this.widgets._ready === true) {
        //         this.widgets.setSymbol(JSON.stringify(this.symbolName), paramary.resolution)
        //     }
        // }
        // 第一次请求
        if (props.usdkData && firstInit) {
            this.symbolName = props.usdkData.name
            paramary.klineId =  props.usdkData.pairId
            const param = {
                reqType: 7,
                type: 3,
                param: paramary,
            }
            this.getklinelist(param)
            this.init()
            firstInit = false
        }
        // 切换币种
        if (props.usdkData && this.props.usdkData && props.usdkData !== this.props.usdkData) {
            const ticker = this.symbolName + "-" + this.interval;
            delete this.cacheData[ticker]
            if(this.widgets && this.widgets._ready === true) this.widgets.setSymbol(props.usdkData.name.toLocaleUpperCase(), this.interval, () => {} )
            paramary.klineId =  props.usdkData.pairId
            this.symbolName = props.usdkData.name
            // 去 getbar 里面调用 initMessage 里发请求
        }
        if(props.usdkData && props.wsData && props.wsData.ws_7 && props.wsData.ws_7 !== this.props.wsData.ws_7) {// 渲染k线数据
            if (JSON.stringify(props.wsData.ws_7) !== JSON.stringify(this.props.wsData.ws_7)) {
                socket.on('message', this.onMessage(props.wsData.ws_7))
            }
        }
    }
    componentWillUnmount() {
        firstInit = true
        if (this.widgets && this.widgets._ready === true) { // eslint-disable-line
            // widget.remove()
            this.widgets = null
        }
        const param = {
            reqType: -5,
            type: 7
        }
        this.props.dispatch(this.props.sendWs(this.props.wsObj, JSON.stringify(param)))
    }
    getPoints = async () => {
        const res = await this.props.apis.tradePairs()
        if (res.code === 0) {
            this.props.dispatch(this.props.savePoints(res.data))
        }
    }
    init = () => {
        var resolution = this.interval;
        var chartType = (localStorage.getItem('tradingview.chartType') || '1')*1;
        var locale = this.props.lang;
        var skin = this.props.theme;
        if (!this.widgets) {
            this.widgets = new TradingView.widget({
                autosize: true,
                symbol:this.symbolName,
                interval: resolution,
                container_id: 'tv_chart_container',
                datafeed: this.datafeeds,
                library_path: '/static/TradingView/charting_library/',                    
                enabled_features: ['left_toolbar'],
                timezone: 'Asia/Shanghai',
                // timezone: 'Etc/UTC',
                custom_css_url: './css/tradingview_'+skin+'.css',
                locale,
                debug: false,
                disabled_features: [
                    'edit_buttons_in_legend',
                    'timeframes_toolbar',
                    'go_to_date',
                    'volume_force_overlay',
                    'header_symbol_search',
                    'header_undo_redo',
                    'caption_button_text_if_possible',
                    'header_resolutions',
                    'header_interval_dialog_button',
                    'show_interval_dialog_on_key_press',
                    // 'left_toolbar',
                    // 'control_bar',
                    'header_compare',
                    // 'header_chart_type',
                    'header_screenshot',
                    'header_saveload'
                ],
                //preset: "mobile",
                overrides: this.getOverrides(skin),
                studies_overrides: this.getStudiesOverrides(skin)
            })
            var thats = this.widgets;
            thats.onChartReady(function() {
                // createStudy();
                createButton(buttons);
            })
            var buttons = [
                {title:'1m',resolution:'1',chartType:1},
                {title:'15m',resolution:'15',chartType:1},
                {title:'1h',resolution:'60',chartType:1},
                {title:'1D',resolution:'1D',chartType:1},
            ];
            function createButton(buttons){
                for(var i = 0; i < buttons.length; i++){
                    (function(button){
                        let defaultClass =
                        thats.createButton()
                        .attr('title', button.title).addClass(`mydate ${button.resolution === '15' ? 'active' : ''}`)
                        .text(button.title)
                        .on('click', function(e) {
                            if (this.className.indexOf('active')> -1){// 已经选中
                                return false
                            }
                            let curent =e.currentTarget.parentNode.parentElement.childNodes
                            for(let index of curent) {
                                if (index.className.indexOf('my-group')> -1 && index.childNodes[0].className.indexOf('active')> -1) {
                                    index.childNodes[0].className = index.childNodes[0].className.replace('active', '')
                                }
                            }
                            this.className = `${this.className} active`
                            thats.chart().setResolution(button.resolution, function onReadyCallback() {})
                        }).parent().addClass('my-group'+(button.resolution == paramary.resolution ? ' active':''))
                    })(buttons[i])
                }
            }
        }
    }
    getklinelist = async(param) => {
        if (!param.param.klineId) return // TODO 未完成初始化
        // 订阅消息
        this.props.dispatch(this.props.sendWs(this.props.wsObj, JSON.stringify(param)))
        // this.subscribe()
    }
    unSubscribe = (interval) => {
        var thats = this;
        //停止订阅，删除过期缓存、缓存时间、缓存状态
        var ticker = thats.symbolName + "-" + interval;
        var tickertime = ticker + "load";
        var tickerstate = ticker + "state";
        // var tickerCallback = ticker + "Callback";
        delete thats.cacheData[ticker];
        delete thats.cacheData[tickertime];
        delete thats.cacheData[tickerstate];
        // delete thats.cacheData[tickerCallback];
    }
    // 获取增量
    subscribe = () => {
        // 订阅增量数据
        const param = {
            reqType: 7,
            type: 2,
            param: paramary
        }
        this.props.dispatch(this.props.sendWs(this.props.wsObj, JSON.stringify(param)))
    }
    // 渲染数据
    onMessage = (data) => {
        let thats = this
        if (data === []) {
            return
        }
        let newdata = []
        if(data && data.data) {
            newdata = data.data
        }
        const ticker = `${thats.symbolName}-${thats.interval}`
        // 第一次全部更新
        if (newdata && newdata.length >= 1 && data.firstHisFlag === 'true' && paramary.klineId === data.klineId && paramary.resolution === data.resolution && !thats.cacheData[ticker]) {
          // websocket返回的值，数组代表时间段历史数据，不是增量
            // let list = []
            var tickerstate = `${ticker}state`
            // 如果没有缓存数据，则直接填充，发起订阅
            if(!thats.cacheData[ticker]){
                thats.cacheData[ticker] = newdata
                thats.subscribe()
            }
            // 新数据即当前时间段需要的数据，直接喂给图表插件
            // 如果出现历史数据不见的时候，就说明 onLoadedCallback 是undefined
            if(thats.cacheData['onLoadedCallback']){ // ToDo
                thats.cacheData['onLoadedCallback'](newdata)
            }
            //请求完成，设置状态为false
            thats.cacheData[tickerstate] = false
            //记录当前缓存时间，即数组最后一位的时间
            thats.lastTime = thats.cacheData[ticker][thats.cacheData[ticker].length - 1].time
        }
        // 更新历史数据
        if(newdata && newdata.length >= 1 && data.hasOwnProperty('firstHisFlag') === true && data.firstHisFlag === 'true' && paramary.klineId === data.klineId && paramary.resolution === data.resolution && thats.cacheData[ticker] && isHistory.isRequestHistory) {
            thats.cacheData[ticker] = newdata.concat(thats.cacheData[ticker])
            isHistory.isRequestHistory = false
            return false
        }
        // 单条数据
        if (newdata && newdata.length === 1 && data.hasOwnProperty('firstHisFlag') === false && data.klineId === paramary.klineId  && paramary.resolution === data.resolution) {
            //构造增量更新数据
            let barsData = newdata[0]
            //如果增量更新数据的时间大于缓存时间，而且缓存有数据，数据长度大于0
            if (barsData.time > thats.lastTime && thats.cacheData[ticker] && thats.cacheData[ticker].length) {
                //增量更新的数据直接加入缓存数组
                thats.cacheData[ticker].push(barsData)
                //修改缓存时间
                thats.lastTime = barsData.time
            } else if(barsData.time === thats.lastTime && thats.cacheData[ticker] && thats.cacheData[ticker].length){
                //如果增量更新的时间等于缓存时间，即在当前时间颗粒内产生了新数据，更新当前数据
                thats.cacheData[ticker][thats.cacheData[ticker].length - 1] = barsData
            }
            // 通知图表插件，可以开始增量更新的渲染了
            thats.datafeeds.barsUpdater.updateData()
        }
    }
    onClose = () => {
        socket.doOpen()
        socket.on('open', function() {
            subscribe()
        });
    }
    initMessage = (symbolInfo, resolution, rangeStartDate, rangeEndDate, onLoadedCallback) => {
        let that = this
        //保留当前回调
        that.cacheData['onLoadedCallback'] = onLoadedCallback;
        //获取需要请求的数据数目
        let limit = that.initLimit(resolution, rangeStartDate, rangeEndDate)
        //如果当前时间节点已经改变，停止上一个时间节点的订阅，修改时间节点值
        if(that.interval !== resolution){
            that.interval = resolution
            paramary.endTime = parseInt((Date.now() / 1000), 10)
        } else {
            paramary.endTime = rangeEndDate
        }
        //获取当前时间段的数据，在onMessage中执行回调onLoadedCallback
        paramary.limit = limit
        paramary.resolution = resolution
        let param
        // 分批次获取历史
        if (isHistory.isRequestHistory) {
            param = {
                reqType: 7,
                type: 3,
                param: {
                    resolution, // 1m
                    klineId: paramary.klineId, // 从数据来选择
                    type: 2, // 2是USDT
                    limit: 120,
                    endTime: isHistory.endTime
                },
            }
        } else {
            param = {
                reqType: 7,
                type: 3,
                param: paramary,
            }
        }
        this.getklinelist(param)
    }
    initLimit = (resolution, rangeStartDate, rangeEndDate) => {
        var limit = 0;
        switch(resolution){
            case '1D' : limit = 150; break;
            case '60' : limit = 150; break;
            case '15' : limit = 150; break;
            case '1' : limit = 150; break;
            default : limit = 150; break;
        }
        return limit;
    }
    getBars = (symbolInfo, resolution, rangeStartDate, rangeEndDate, onLoadedCallback) => {
        const timeInterval = resolution
        this.interval = resolution
        let ticker = `${this.symbolName}-${resolution}`
        let tickerload = `${ticker}load`
        var tickerstate = `${ticker}state`
        //如果缓存没有数据，而且未发出请求，记录当前节点开始时间
        // 切换时间或币种
        this.cacheData[tickerload] = rangeStartDate
        if(!this.cacheData[ticker] && !this.cacheData[tickerstate]){
            this.cacheData[tickerload] = rangeStartDate
            //发起请求，从websocket获取当前时间段的数据
            this.initMessage(symbolInfo, resolution, rangeStartDate, rangeEndDate, onLoadedCallback)
            //设置状态为true
            this.cacheData[tickerstate] = true
        }
        if(!this.cacheData[tickerload] || this.cacheData[tickerload] > rangeStartDate){
            //如果缓存有数据，但是没有当前时间段的数据，更新当前节点时间
            this.cacheData[tickerload] = rangeStartDate;
            //发起请求，从websocket获取当前时间段的数据
            this.initMessage(symbolInfo, resolution, rangeStartDate, rangeEndDate, onLoadedCallback);
            //设置状态为true
            this.cacheData[tickerstate] = true
        }
        //正在从websocket获取数据，禁止一切操作
        if(this.cacheData[tickerstate]){
            return false
        }
        // 拿到历史数据，更新图表
        // console.log(this.cacheData[ticker], this.cacheData[ticker].length)
        if (this.cacheData[ticker] && this.cacheData[ticker].length >= 1) {
            this.isLoading = false
            let newBars = []
            onLoadedCallback(this.cacheData[ticker])
        } else {
            let self = this
            this.getBarTimer = setTimeout(function() {
                self.getBars(symbolInfo, resolution, rangeStartDate, rangeEndDate, onLoadedCallback)
            }, 10)
        }
        // 判断是否需要获取之前的数据
        if (this.cacheData[ticker] && this.cacheData[ticker].length > 120 && this.widgets && this.widgets._ready && !isHistory.isRequestHistory && timeInterval !== '1D') {
            const rangeTime = this.widgets.chart().getVisibleRange()  // 可视区域时间值(秒) {from, to}
            const dataTime = this.cacheData[ticker][0].time // 返回数据第一条时间
            // if (isHistory.endTime && (isHistory.endTime = dataTime / 1000)) return false // 同一时间的请求不应该发送多条
            if (rangeTime.from * 1000 <= dataTime + 28800000) { // true 不用请求 false 需要请求后续
                isHistory.endTime = dataTime / 1000
                isHistory.isRequestHistory = true
                this.initMessage(symbolInfo, resolution, rangeStartDate, rangeEndDate, onLoadedCallback)
            }
        }
    }
    getOverrides = (theme) => {
        var themes = {
            'light': {
                up: '#24b647',
                down: '#e74c4c',
                bg: '#191d27',
                grid: 'rgba(54,59,77,0.5)',
                text: '#3c455c'
            },
            'night': {
                up: '#24b647',
                down: '#e74c4c',
                bg: '#191d27',
                grid: 'rgba(54,59,77,0.5)',
                text: '#3c455c'
            }
        };
        var t = themes[theme];
        return {
          'symbolWatermarkProperties.color': 'rgba(210,246,254, 0.1)',
          'volumePaneSize': 'medium',
          'paneProperties.topMargin': 10,
          'paneProperties.bottomMargin': 10,
          'scalesProperties.lineColor': t.text,
          'scalesProperties.textColor': t.text,
          'paneProperties.background': t.bg,
          'paneProperties.vertGridProperties.color': t.grid,
          'paneProperties.horzGridProperties.color': t.grid,
          'mainSeriesProperties.candleStyle.upColor': t.up,
          'mainSeriesProperties.candleStyle.downColor': t.down,
          'mainSeriesProperties.candleStyle.wickUpColor': t.up,
          'mainSeriesProperties.candleStyle.wickDownColor': t.down,
          'mainSeriesProperties.candleStyle.barColorsOnPrevClose': !1,
          'mainSeriesProperties.hollowCandleStyle.upColor': t.up,
          'mainSeriesProperties.hollowCandleStyle.downColor': t.down,
          'mainSeriesProperties.hollowCandleStyle.drawWick': !0,
          'mainSeriesProperties.hollowCandleStyle.drawBorder': !0,
          'mainSeriesProperties.visible': !1,
          'scalesProperties.showLeftScale': !1,
          'scalesProperties.showRightScale': !0,
        }
    }
    getStudiesOverrides = (theme) => {
        var themes = {
            "light": {
                c0: "#e74c4c",
                c1: "#24b647",
                t: 75,
                v: !1
            },
            "night": {
                c0: "#e74c4c",
                c1: "#24b647",
                t: 75,
                v: !1
            }
        };
        var t = themes[theme];
        return {
            "volume.volume.color.0": t.c0,
            "volume.volume.color.1": t.c1,
            "volume.volume.transparency": t.t,
            "volume.options.showStudyArguments": t.v
        }
    }
    resetTheme = (skin) => {
        this.widgets.addCustomCSSFile('./css/tradingview_'+skin+'.css');
        this.widgets.applyOverrides(this.getOverrides(skin));
        this.widgets.applyStudiesOverrides(this.getStudiesOverrides(skin));
    }
    render() {
        return (
            <div className="kline ft-theme-kline ">
                <div className="kline_box">
                    <div className="kline_box" id="tv_chart_container">
                    </div>
                </div>
            </div>
        )
    }
}
