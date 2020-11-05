/* eslint-disable */
import React from 'react'
import { connect } from 'react-redux'
import './marketline.scss'
import { withRouter } from 'react-router'
import throttle from 'lodash/throttle';
const TradingView = require('TradingView')
import Socket from './api/socket'
import Datafeed from './api/datafees'

const paramary = {
    resolution: '15', // 1m
    klineId: '', // 从数据来选择
    type: 2, // 2是USDT
    limit: 150,
    endTime: parseInt((Date.now() / 1000), 10)
}
let isHistory = {
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
        this.symbolName = '';
        this.pairId = '';
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
    }
    componentWillReceiveProps(props) {
        if (props.usdkData !== this.props.usdkData) {
            if (!props.usdkData.name || !props.usdkData.pairId) return false
            this.symbolName = props.usdkData.name
            this.pairId = props.usdkData.pairId
            paramary.klineId = props.usdkData.pairId
            const param = {
                reqType: 7,
                type: 3,
                param: paramary
            }
            this.getklinelist(param)
            this.init()
        }
        // 切换币种
        if (props.usdkData && this.props.usdkData && props.usdkData !== this.props.usdkData) {
            const ticker = this.symbolName + "-" + this.interval;
            delete this.cacheData[ticker]
            if(this.widgets && this.widgets._ready === true) this.widgets.setSymbol(props.usdkData.name.toLocaleUpperCase(), this.interval, () => {} )
            paramary.klineId =  props.usdkData.pairId
            this.symbolName = props.usdkData.name
            isHistory = {
                endTime: null,
                isRequestHistory: false
            }
        }
        if(props.usdkData && props.wsData && props.wsData.ws_7 && props.wsData.ws_7 !== this.props.wsData.ws_7) {// 渲染k线数据
            if (JSON.stringify(props.wsData.ws_7) !== JSON.stringify(this.props.wsData.ws_7)) {
                socket.on('message', this.getMessage(props.wsData.ws_7))
            }
        }
    }
    componentWillUnmount() {
        if (this.widgets && this.widgets._ready === true) {
            this.widgets = null
        }
        const param = {
            reqType: -5,
            type: 7
        }
        this.props.dispatch(this.props.sendWs(this.props.wsObj, JSON.stringify(param)))
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
    getMessage = (data) => {
        const ticker = `${this.symbolName}-${this.interval}`
        if (!data) return false
        if (data.hasOwnProperty('firstHisFlag') === true && data.hasOwnProperty('noData') === true) return false
        if (data.data.length === 0) return false
        // 全部数据
        if (data.hasOwnProperty('firstHisFlag') === true && !isHistory.isRequestHistory) {
            this.cacheData[ticker] = data.data
            if (data.data.length > 1) {
                this.lastTime = data.data[length - 1].time
            } else {
                this.lastTime = data.data[0].time
            }
            this.subscribe()
            return false
        }
        // 增量数据
        if (data.data.length === 1 && data.hasOwnProperty('firstHisFlag') === false) {
            let barsData = data.data[0]
            if (barsData.time > this.lastTime && this.cacheData[ticker] && this.cacheData[ticker].length) {
                this.cacheData[ticker].push(barsData)
                this.lastTime = barsData.time
            } else if(barsData.time === this.lastTime && this.cacheData[ticker] && this.cacheData[ticker].length){
                this.cacheData[ticker][this.cacheData[ticker].length - 1] = barsData
            }
            this.datafeeds.barsUpdater.updateData()
            return false
        }
        // 历史数据
        if(data.data && data.data.length > 1 && data.hasOwnProperty('firstHisFlag') === true && isHistory.isRequestHistory) {
            this.cacheData[ticker] = data.data.concat(this.cacheData[ticker])
            isHistory = {
                endTime: null,
                isRequestHistory: false
            }
            return false
        }
    }
    initMessage = (symbolInfo, resolution, rangeStartDate, rangeEndDate, onLoadedCallback) => {
        paramary.resolution = resolution
        let param
        if (isHistory.endTime) {
            param = {
                reqType: 7,
                type: 3,
                param: {
                    resolution, // 1m
                    klineId: paramary.klineId, // 从数据来选择
                    type: 2, // 2是USDT
                    limit: 120,
                    endTime: this.filterTime(isHistory.endTime, resolution)
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
    getBars = (symbolInfo, resolution, rangeStartDate, rangeEndDate, onLoadedCallback) => {
        // 切换时间
        const ticker = `${this.symbolName}-${this.interval}`
        if (resolution !== this.interval) {
          delete this.cacheData[ticker]
          isHistory = {
              endTime: null,
              isRequestHistory: false
          }
          this.initMessage(symbolInfo, resolution, rangeStartDate, rangeEndDate, onLoadedCallback)
        }
        this.interval = resolution
        // 更新图表
        if (this.cacheData[ticker]) {
            onLoadedCallback(this.cacheData[ticker])
        } else {
            let self = this
            this.getBarTimer = setTimeout(function() {
                self.getBars(symbolInfo, resolution, rangeStartDate, rangeEndDate, onLoadedCallback)
            }, 1000)
        }
        // 是否需要历史数据
        if (this.cacheData[ticker] && this.widgets && this.widgets._ready && !isHistory.isRequestHistory) {
            const rangeTime = this.widgets.chart().getVisibleRange()  // 可视区域时间值(秒) {from, to}
            const dataTime = this.cacheData[ticker][0].time // 返回数据第一条时间
            if (rangeTime.from * 1000 <= dataTime + 28800000) { // true 不用请求 false 需要请求后续
                isHistory = {
                    endTime: dataTime / 1000,
                    isRequestHistory: true
                }
                this.initMessage(symbolInfo, resolution, rangeStartDate, rangeEndDate, onLoadedCallback)
            }
        }
    }
    filterTime = (time, resolution) => {
        const Time = new Date(time * 1000)
        if (resolution === '1') return Time.setMinutes(Time.getMinutes() - 1) / 1000
        if (resolution === '15') return Time.setMinutes(Time.getMinutes() - 15) / 1000
        if (resolution === '60') return Time.setHours(Time.getHours() - 1) / 1000
        if (resolution === '1D') return Time.setDate(Time.getDate() - 1) / 1000
    }
    getPoints = async () => {
        const res = await this.props.apis.tradePairs()
        if (res.code === 0) {
            this.props.dispatch(this.props.savePoints(res.data))
        }
    }
    onClose = () => {
        socket.doOpen()
        socket.on('open', function() {
            subscribe()
        });
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
