import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import moment from 'moment'
import { I18n } from 'react-i18next'
import { Pagination, Checkbox, DatePicker, Tooltip } from 'antd' //  Spin, Icon
import Spin from '@/components/loading'
import Message from '@/components/message'
// import { foFixed } from '@/assets/js/common'
import './tradeTable.scss'

const { RangePicker } = DatePicker

function isMac() {
    const pla = navigator.platform
    if (pla.includes('Mac')) {
        return true
    }
    return false
}
let paramAryfresh
@withRouter
@connect(state => ({
    theme: state.theme,
    apis: state.apis,
    wsObj: state.wsObj,
    sendWs: state.sendWs,
    wsData: state.wsData,
    usdkData: state.usdkData,
    userAuth: state.userAuth,
    clearUserAuth: state.clearUserAuth,
    getUsdkData: state.getUsdkData,
    lang: state.lang,
    helpcenter: state.helpcenter,
    wsConnet: state.wsConnet
}))
class TradeTable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ActiveLi: 0,
            startTT: '',
            weituoTotal: null,
            lishiTotal: null,
            lishiCurrent: 1,
            weituoT: null,
            hidecheck: 0,
            endTT: '',
            lishiList: [],
            weituoList: [],
            zichanList: [],
            checkHide: false,
            checkWeituo: false,
            loading: false,
            showTip: false,
        }
        this.WsGet = this.WsGet.bind(this)
        this.getOutOrder = this.getOutOrder.bind(this)
        this.getWeituoList = this.getWeituoList.bind(this)
        this.getLishiList = this.getLishiList.bind(this)
        this.weituoCancleAll = this.weituoCancleAll.bind(this)
        this.getZichanList = this.getZichanList.bind(this)
        this.filterWeituo = this.filterWeituo.bind(this)
        this.filterBuySell = this.filterBuySell.bind(this)
        this.chicangRef = React.createRef()
    }
    componentWillMount() {
        // if (this.props.userAuth === 0) return
        // if (this.props.userAuth === null) {
        //     this.setState({
        //         loading: false
        //     })
        //     // return
        // }
    }
    componentDidMount() {
        // this.isWin = false
        // if (window.navigator.platform === 'Win32') {
        //     this.isWin = true
        // }
        if (this.props.userAuth && this.props.usdkData && this.props.usdkData.assetId) {
            this.getWeituoList(0, 1, 20)
        }
    }
    componentWillReceiveProps(props) {
        if (props.userAuth === 0) return
        if (props.wsConnet === true && props.wsConnet !== this.props.wsConnet && paramAryfresh) {
            this.props.dispatch(this.props.sendWs(this.props.wsObj, JSON.stringify(paramAryfresh)))
        }
        if ((props.userAuth !== this.props.userAuth) && props.usdkData) {
            this.getWeituoList(0, 1, 20, props.usdkData.pairId)
            this.setState({ ActiveLi: 0 })
        }
        if (props.usdkData && (props.usdkData !== this.props.usdkData)) {
            this.getWeituoList(0, 1, 20, props.usdkData.pairId)
            this.setState({ ActiveLi: 0 })
        }
        if (props.wsData !== this.props.wsData) {
            if (props.wsData.ws_5) {
                if ((!this.props.wsData.ws_5 || props.wsData.ws_5.myOrder.entrustOrderDTO !== this.props.wsData.ws_5.myOrder.entrustOrderDTO) && props.wsData.ws_5.myOrder.entrustOrderDTO) {
                    this.setState({
                        weituoList: props.wsData.ws_5.myOrder.entrustOrderDTO.item,
                        weituoTotal: props.wsData.ws_5.myOrder.entrustOrderDTO.total
                    })
                } else if ((!this.props.wsData.ws_5 || props.wsData.ws_5.myOrder.historyOrderDTO !== this.props.wsData.ws_5.myOrder.historyOrderDTO) && props.wsData.ws_5.myOrder.historyOrderDTO) {
                    this.setState({
                        lishiList: props.wsData.ws_5.myOrder.historyOrderDTO.item,
                        lishiTotal: props.wsData.ws_5.myOrder.historyOrderDTO.total
                    })
                } else if ((!this.props.wsData.ws_5 || props.wsData.ws_5.myOrder.assetInfo !== this.props.wsData.ws_5.myOrder.assetInfo) && props.wsData.ws_5.myOrder.assetInfo) {
                    this.setState({
                        zichanList: props.wsData.ws_5.myOrder.assetInfo.item,
                    })
                }
            }
        }
    }
    componentWillUnmount() {
        this.props.dispatch(this.props.sendWs(this.props.wsObj, JSON.stringify({
            reqType: -5,
            type: 5
        })))
    }
    // tab1--委托
    async getWeituoList(f, page, pageS, id) {
        this.setState({
            weituoT: page || 1,
            // loading: true,
        })
        if (f === 1) { // 选中
            this.setState({ hidecheck: 1 })
            const param = {
                pageSize: pageS || 20,
                pageNo: page || 1,
                assetId: id || this.props.usdkData.pairId,
                status: '8,9',
                type: 1,
                pairId: id || this.props.usdkData.pairId, // redux来的合约ID
                tab: 1
            }
            // if (this.props.sessionId) {
            this.WsGet(param)
            // }
            // try {
            //     param = {
            //         pageSize: pageS || 4,
            //         pageNo: page || 1,
            //         assetId: this.props.usdkData ? this.props.usdkData.assetId : '',
            //         status: '8,9',
            //         type: 1,
            //         pairId: this.props.usdkData ? this.props.usdkData.assetId : '', // redux来的合约ID
            //         tab: 1,
            //     }
            //     const res = await this.props.apis.USDTtradeOrderlist({
            //         pageSize: param.pageSize,
            //         pageNo: param.pageNo,
            //         assetId: param.assetId,
            //         status: param.status
            //     })
            //     if (res.code === 0) {
            //         this.setState({
            //             weituoList: res.data.item,
            //             weituoTotal: res.data.total,
            //         })
            //         // websocket
            //         // const Obj = this.state.weituoList
            //         // const dataObj = await this.WsGet(param).entrustOrderDTO
            //         // if (dataObj) {
            //         //     this.setState({ weituoList: dataObj })
            //         // }
            //     } else if (res.code === 401) {
            //         this.props.dispatch(this.props.clearUserAuth())
            //         // 登录超时
            //     }
            //     // else if (res.code === 401) {
            //     //     Message.error(this.t('USDTtrade.NoLogin'), 'night')
            //     //     // 登出
            //     // }
            // } catch (e) {
            //     Message.error(e.msg, 'night')
            // }
            // this.setState({ loading: false })
            // this.WsGet(param)
        } else {
            this.setState({ hidecheck: 0 })
            const param = {
                pageSize: pageS || 20,
                pageNo: page || 1,
                assetId: id || this.props.usdkData.assetId,
                status: '8,9',
                type: 1,
                pairId: '', // redux来的合约ID
                tab: 1
            }
            // if (this.props.sessionId) {
            this.WsGet(param)
            // }
            // try {
            //     param = {
            //         pageSize: pageS || 4,
            //         pageNo: page || 1,
            //         assetId: '',
            //         status: '8,9',
            //         type: 1,
            //         pairId: '', // redux来的合约ID
            //         tab: 1,
            //     }
            //     const res = await this.props.apis.USDTtradeOrderlist({
            //         pageSize: param.pageSize,
            //         pageNo: param.pageNo,
            //         status: param.status
            //     })
            //     if (res.code === 0) {
            //         this.setState({
            //             weituoList: res.data.item,
            //             weituoTotal: res.data.total,
            //         })
            //         // websocket
            //         // const Obj = this.state.weituoList
            //     } else if (res.code === 401) {
            //         this.props.dispatch(this.props.clearUserAuth())
            //         // 登录超时
            //     }
            //     // else if (res.code === 401) {
            //     //     Message.error(this.t('USDTtrade.NoLogin'), 'night')
            //     //     // 登出
            //     // }
            // } catch (e) {
            //     Message.error(e.msg, 'night')
            // }
            // this.setState({ loading: false })
            // this.WsGet(param)
            // if (dataObj) {
            //     this.setState({ weituoList: dataObj })
            // }
        }
    }
    // tab2--历史
    async getLishiList(page, pageS) {
        this.setState({
            // loading: true,
            lishiCurrent: page || 1
        })
        const param = {
            pageSize: pageS || 20,
            pageNo: page || 1,
            startTime: this.state.startTT || '',
            endTime: this.state.endTT || '',
            type: 1,
            tab: 2
        }
        // if (this.props.sessionId) {
        this.WsGet(param)
        // }
        // try {
        //     param = {
        //         pageSize: pageS || 4,
        //         pageNo: page || 1,
        //         startTime: this.state.startTT || '',
        //         endTime: this.state.endTT || '',
        //         type: 1,
        //         tab: 2,
        //     }
        //     const res = await this.props.apis.USDTtradeOrderlist({
        //         pageSize: param.pageSize,
        //         pageNo: param.pageNo,
        //         startTime: param.startTime,
        //         endTime: param.endTime
        //     })
        //     if (res.code === 0) {
        //         this.setState({
        //             lishiList: res.data.item,
        //             lishiTotal: res.data.total
        //         })
        //         // websocket
        //         // const Obj = this.state.lishiList
        //         // const dataObj = await this.WsGet(param).historyOrderDTO
        //         // if (dataObj) {
        //         //     this.setState({ lishiList: dataObj })
        //         // }
        //     } else if (res.code === 401) {
        //         this.props.dispatch(this.props.clearUserAuth())
        //         // 登录超时
        //     }
        //     // else if (res.code === 401) {
        //     //     Message.error(this.t('USDTtrade.NoLogin'), 'night')
        //     //     // 登录失效
        //     // }
        // } catch (e) {
        //     Message.error(e.msg, 'night')
        // }
        // this.setState({ loading: false })
        // this.WsGet(param)
    }
    // tab3--资产
    async getZichanList(f) {
        // this.setState({
        //     loading: true
        // })
        const param = {
            type: 1,
            tab: 5,
            isHidden: f
        }
        // if (this.props.sessionId) {
        this.WsGet(param)
        // }
        // try {
        //     param = {
        //         type: 1,
        //         tab: 5,
        //         isHidden: f,
        //     }
        //     const res = await this.props.apis.USDTtradeasset({
        //         isHidden: f
        //     })
        //     if (res.code === 0) {
        //         this.setState({
        //             zichanList: res.data.item,
        //         })
        //     } else if (res.code === 401) {
        //         this.props.dispatch(this.props.clearUserAuth())
        //         // 登录超时
        //     }
        //     // else if (res.code === 401) {
        //     //     Message.error(this.t('USDTtrade.NoLogin'), 'night')
        //     //     // 登录超时
        //     // }
        // } catch (e) {
        //     Message.error(e.message, 'night')
        // }
        // this.setState({ loading: false })
        // this.WsGet(param)
    }
    // 委托---撤销订单
    async getOutOrder(f) {
        this.setState({
            loading: true
        })
        try {
            const res = await this.props.apis.USDTtradeCancle({
                id: f
            })
            if (res.code === 0) {
                Message.success(this.t('USDTtrade.SuccessChedan'), 'night')
                this.getWeituoList(this.state.hidecheck, this.state.weituoT, 20)
            } else if (res.code === 401) {
                this.props.dispatch(this.props.clearUserAuth())
                // 登录超时
            }
            // else if (res.code === 401) {
            //     Message.error(this.t('USDTtrade.NoLogin'), 'night')
            //     // 登录超时
            // }
        } catch (e) {
            Message.error(e.msg, 'night')
        }
        this.setState({ loading: false })
    }
    // 获取websocket信息
    async WsGet(param) { // param 参数；e htpp获取数据
        // 再请求ws
        const paramT = {
            id: param.assetId ? param.assetId : this.props.usdkData.assetId,
            param,
            reqType: 5,
            type: 1,
            sessionId: localStorage.sessionId || ''
        }
        paramAryfresh = paramT
        this.props.dispatch(this.props.sendWs(this.props.wsObj, JSON.stringify(paramT)))
    }
    // 委托---隐藏其他交易对
    handleCheckBox = (e) => {
        if (this.props.userAuth) {
            if (e.target.checked === true) {
                this.setState({ checkWeituo: true })
                this.getWeituoList(1, this.state.weituoT, 20)
            } else {
                this.setState({ checkWeituo: false })
                this.getWeituoList(0, this.state.weituoT, 20)
            }
        } else {
            Message.error(this.t('USDTtrade.NoLogin'), 'night')
        }
    }
    // 资产---隐藏小额币种checkbox
    handleCheckBoxOne = (e) => {
        if (e.target.checked === true) {
            this.setState({ checkHide: true })
            this.getZichanList(1)
        } else {
            this.setState({ checkHide: false })
            this.getZichanList(0)
        }
    }
    // 历史---选择时间
    handleTimePiker = (e, f) => {
        if (e.length === 0) {
            this.setState({
                startTT: '',
                endTT: ''
            })
        } else {
            this.setState({
                startTT: new Date(`${f[0]} 00:00:00`).getTime(),
                endTT: new Date(`${f[1]} 23:59:59`).getTime(),
            })
        }
    }
    // 历史查询按钮
    findHistory = () => {
        this.getLishiList()
        // this.setState({
        //     endTT: '42555146196',
        //     startTT: '0'
        // })
    }
    // 筛选类型
    filterWeituo = (e) => {
        // 8-已报，9-部成，10-已成，3-部撤，4-已撤
        const name = [8, 9, 10, 3, 4]
        const lever = [this.t('USDTtrade.filterWeituo1'), this.t('USDTtrade.filterWeituo2'), this.t('USDTtrade.filterWeituo3'), this.t('USDTtrade.filterWeituo4'), this.t('USDTtrade.filterWeituo5')]
        for (let i = 0; i < name.length; i += 1) {
            if (e === name[i]) {
                return lever[i]
            }
        }
        return '--'
    }
    // 筛选多空
    filterBuySell = (e) => {
        const name = [1, 2]
        const lever = [this.t('USDTtrade.filterBuySell1'), this.t('USDTtrade.filterBuySell2')]
        for (let i = 0; i < name.length; i += 1) {
            if (e === name[i]) {
                return lever[i]
            }
        }
        return '--'
    }
    // 筛选委托类型 orderType
    filterOrderType = (e) => {
        const name = [1, 2, 3]
        // const lever = ['现价单', '市价单', '强平单', '现价单']
        const lever = [this.t('USDTtrade.filterOrderType1'), this.t('USDTtrade.filterOrderType2'), this.t('USDTtrade.filterOrderType3'), this.t('USDTtrade.filterOrderType1')]
        for (let i = 0; i < name.length; i += 1) {
            if (e === name[i]) {
                return lever[i]
            }
        }
        return '--'
    }
    chooseLi = (e) => {
        if (this.props.userAuth) {
            this.setState({ ActiveLi: e })
            if (e === 0) {
                this.getWeituoList(0, 1, 20)
                this.setState({
                    checkWeituo: false,
                    startTT: '',
                    endTT: ''
                })
            } else if (e === 1) {
                this.getLishiList(1, 20)
            } else if (e === 2) {
                this.getZichanList(0)
                this.setState({
                    checkHide: false,
                    startTT: '',
                    endTT: ''
                })
            }
        } else {
            Message.error(this.t('USDTtrade.NoLogin'), 'night')
        }
    }
    // 委托全撤
    async weituoCancleAll() {
        if (this.props.userAuth) {
            if (this.state.weituoTotal) {
                try {
                    const res = await this.props.apis.USDTtradeCancleAll()
                    if (res.code === 0) {
                        Message.success(this.t('USDTtrade.SuccessChedan'), 'night')
                        this.getWeituoList(this.state.hidecheck, this.state.weituoT, 20)
                    } else if (res.code === 401) {
                        this.props.dispatch(this.props.clearUserAuth())
                        // 登录超时
                    }
                    // else if (res.code === 401) {
                    //     Message.error(this.t('USDTtrade.NoLogin'), 'night')
                    //     // 登录超时
                    // }
                } catch (e) {
                    Message.error(e.message, 'night')
                }
            } else {
                Message.error(this.t('USDTtrade.noOrder'), 'night')
            }
        } else {
            Message.error(this.t('USDTtrade.NoLogin'), 'night')
        }
    }
    handleClickJump = (item) => {
        if (item.assetId === 2) {
            return false
        }
        if (this.props.usdkData && this.props.usdkData.assetId) {
            if (this.props.usdkData.assetId === item.assetId) {
                return false
            }
            this.props.dispatch(this.props.getUsdkData(item.assetId))
            this.props.history.replace(`./spot?pairId=${item.assetId}`)
        }
        return true
    }
    //   if (this.props.contractData && this.props.contractData.contractId && (this.props.contractData.contractId !== id)) {
    //     await this.props.dispatch(this.props.getContractData(id))
    //     this.props.history.replace(`./futures?contractId=${id}`)
    // }
    render() {
        // console.log(this.props.helpcenter)
        // const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />
        const ulList = [{
            key: 0,
            name: 'USDTtrade.USDKentrust'
        }, {
            key: 1,
            name: 'USDTtrade.USDKHistory'
        }, {
            key: 2,
            name: 'USDTtrade.USDKZichan'
        }]
        const ulwidth = this.chicangRef.current ? this.chicangRef.current.offsetWidth - 21 : 'width: calc(100% - 21px)'
        // ----委托/历史---- //
        // 现货的交易对
        const entrust1 = (<I18n>{(t) => (<div className="pop-contant cursor"><span>{t('USDTtrade.entrust1')}</span></div>)}</I18n>)
        // 该委托的买卖方向
        const entrust2 = (<I18n>{(t) => (<div className="pop-contant cursor"><span>{t('USDTtrade.entrust2')}</span></div>)}</I18n>)
        // 该委托的委托类型，
        const entrust3 = (<I18n>{(t) => (<div className="pop-contant cursor"><span>{t('USDTtrade.entrust3')}</span><br /><a href={`${this.props.helpcenter}${t('helpUrl.EntrustypeSpot')}`} target="_blank" rel="noopener noreferrer">{t('Contrade.entrust3o1')}</a></div>)}</I18n>)
        // 委托的买入/卖出价格
        const entrust4 = (<I18n>{(t) => (<div className="pop-contant cursor"><span>{t('USDTtrade.entrust4')}</span></div>)}</I18n>)
        // 委托的买入/卖出数量
        const entrust5 = (<I18n>{(t) => (<div className="pop-contant cursor"><span>{t('USDTtrade.entrust5')}</span></div>)}</I18n>)
        // 该委托的状态，分为未成交、已成交、部分成交、已撤销、部分撤销
        const entrust6 = (<I18n>{(t) => (<div className="pop-contant cursor"><span dangerouslySetInnerHTML={{ __html: t('USDTtrade.entrust6') }} /></div>)}</I18n>)
        // 该委托的成交均价
        const entrust7 = (<I18n>{(t) => (<div className="pop-contant cursor"><span>{t('USDTtrade.entrust7')}</span></div>)}</I18n>)
        // 该委托的已成交数量
        const entrust8 = (<I18n>{(t) => (<div className="pop-contant cursor"><span>{t('USDTtrade.entrust8')}</span></div>)}</I18n>)
        // 该委托的未成交数量
        const entrust9 = (<I18n>{(t) => (<div className="pop-contant cursor"><span>{t('USDTtrade.entrust9')}</span></div>)}</I18n>)
        // 该委托提交的时间
        const entrust10 = (<I18n>{(t) => (<div className="pop-contant cursor"><span>{t('USDTtrade.entrust10')}</span></div>)}</I18n>)
        // 勾选后隐藏除当前现货交易对外的其他现货交易对
        const entrust11 = (<I18n>{(t) => (<div className="pop-contant cursor"><span>{t('USDTtrade.entrust11')}</span></div>)}</I18n>)
        return (
            <div className="USDTtradeTable">
                <I18n>
                    {
                        (t) => {
                            this.t = t
                            return (
                                <Spin spinning={this.state.loading}>
                                    {/* <Spin className="USDKLoading" spinning={this.state.loading} indicator={antIcon}> */}
                                    <ul className="TradeTable-title">
                                        {
                                            ulList.map((item, index) => (
                                                <li key={index} className={this.state.ActiveLi === item.key ? 'liActive ft-theme-border1 ft-theme-label hover' : 'ft-theme-border1 ft-theme-label hover'} onClick={() => { this.chooseLi(item.key) }}>
                                                    {t(item.name)}
                                                    {
                                                        this.state.ActiveLi === item.key ?
                                                            <div className={this.props.theme === 'night' ? 'triangleNight' : 'triangle'} />
                                                            :
                                                            null
                                                    }
                                                </li>
                                            ))
                                        }
                                        {
                                            this.state.ActiveLi === 0 ?
                                                <li className="TradeTable-FindList">
                                                    <span
                                                        onMouseEnter={() => { this.setState({ showTip: true }) }}
                                                        onMouseLeave={() => { this.setState({ showTip: false }) }}
                                                    >
                                                        <Checkbox
                                                            checked={this.state.checkWeituo}
                                                            className={this.props.theme === 'night' ? 'checkNone hover' : 'checkNonelight hover'}
                                                            onChange={(e) => { this.handleCheckBox(e) }}
                                                        >
                                                            {
                                                                this.state.showTip ?
                                                                    <Tooltip overlayClassName="pop-main" title={entrust11}>
                                                                        <svg>
                                                                            <use style={{ pointerEvents: 'none' }} xlinkHref="#iconwenhao1" width="8px" height="8px" />
                                                                        </svg>
                                                                    </Tooltip>
                                                                    :
                                                                    null
                                                            }
                                                            {t('USDTtrade.USDKentrustHide')}
                                                        </Checkbox>
                                                    </span>
                                                    <button className="hover" onClick={() => { this.weituoCancleAll() }}>{t('USDTtrade.USDKentrustCancleAll')}</button>
                                                </li>
                                                :
                                                null
                                        }
                                        {
                                            this.state.ActiveLi === 1 ?
                                                <li className="TradeTable-FindList">
                                                    <RangePicker
                                                        className={this.props.theme === 'night' ? 'timeNone hover' : 'timeNonelight hover'}
                                                        onChange={this.handleTimePiker}
                                                        placeholder={[t('Contrade.startTime'), t('Contrade.endTime')]}
                                                    />
                                                    <button className="hover" onClick={() => { this.findHistory() }}>{t('USDTtrade.USDKHistoryFind')}</button>
                                                </li>
                                                :
                                                null
                                        }
                                        {
                                            this.state.ActiveLi === 2 ?
                                                <li className="TradeTable-FindList">
                                                    <Checkbox checked={this.state.checkHide} className={this.props.theme === 'night' ? 'checkNone hover' : 'checkNonelight hover'} onChange={(e) => { this.handleCheckBoxOne(e) }}>{t('USDTtrade.USDKZichanHide')}</Checkbox>
                                                </li>
                                                :
                                                null
                                        }
                                    </ul>
                                    {
                                        this.state.ActiveLi === 0 ?
                                            <div className="TradeTab weituo" ref={this.chicangRef}>
                                                <div className="Trade-table-tit" style={isMac() ? { width: ulwidth } : null}>
                                                    {/* 现货 */}
                                                    <span className="firstOne hide ft-theme-label cursor left trade-middle">
                                                        <Tooltip overlayClassName="pop-main" placement="topLeft" title={entrust1}>
                                                            {t('USDTtrade.USDKentrust1')}
                                                        </Tooltip>
                                                    </span>
                                                    {/* 买/卖 */}
                                                    <span className="ft-theme-label hide cursor left" style={{ width: '6%' }}>
                                                        <Tooltip overlayClassName="pop-main" title={entrust2}>
                                                            {t('USDTtrade.USDKentrust2')}
                                                        </Tooltip>
                                                    </span>
                                                    {/* 委托类型 */}
                                                    <span className="ft-theme-label hide cursor left" style={{ width: '6%' }}>
                                                        <Tooltip overlayClassName="pop-main" title={entrust3}>
                                                            {t('USDTtrade.USDKentrust9')}
                                                        </Tooltip>
                                                    </span>
                                                    {/* 委托价格 */}
                                                    <span className="ft-theme-label hide cursor left" style={{ width: '10%' }}>
                                                        <Tooltip overlayClassName="pop-main" title={entrust4}>
                                                            {t('USDTtrade.USDKentrust5')}
                                                        </Tooltip>
                                                    </span>
                                                    {/* 委托数量 */}
                                                    <span className="ft-theme-label hide cursor left" style={{ width: '9%' }}>
                                                        <Tooltip overlayClassName="pop-main" title={entrust5}>
                                                            {t('USDTtrade.USDKentrust3')}
                                                        </Tooltip>
                                                    </span>
                                                    {/* 委托状态 */}
                                                    <span className="ft-theme-label hide cursor left">
                                                        <Tooltip overlayClassName="pop-main" title={entrust6}>
                                                            {t('USDTtrade.USDKentrust6')}
                                                        </Tooltip>
                                                    </span>
                                                    {/* 成交均价 */}
                                                    <span className="ft-theme-label hide cursor left">
                                                        <Tooltip overlayClassName="pop-main" title={entrust7}>
                                                            {t('USDTtrade.USDKentrust7')}
                                                        </Tooltip>
                                                    </span>
                                                    {/* 已成交数量 */}
                                                    <span className="ft-theme-label hide cursor left" style={{ width: '10%' }}>
                                                        <Tooltip overlayClassName="pop-main" title={entrust8}>
                                                            {t('USDTtrade.USDKentrust10')}
                                                        </Tooltip>
                                                    </span>
                                                    {/* 未成交数量 */}
                                                    <span className="ft-theme-label hide cursor left" style={{ width: '10%' }}>
                                                        <Tooltip overlayClassName="pop-main" title={entrust9}>
                                                            {t('USDTtrade.USDKentrust11')}
                                                        </Tooltip>
                                                    </span>
                                                    {/* 委托时间 */}
                                                    <span className="ft-theme-label hide cursor trade-lang left" style={{ width: '13%' }}>
                                                        <Tooltip overlayClassName="pop-main" title={entrust10}>
                                                            {t('USDTtrade.USDKentrust8')}
                                                        </Tooltip>
                                                    </span>
                                                    <span className="ft-theme-label hide right" />
                                                </div>
                                                <div className="scrollKiller">
                                                    <ul className="Trade-table" style={isMac() ? { width: ulwidth } : { width: '100%' }}>
                                                        {
                                                            this.state.weituoList && this.state.weituoList.length !== 0 ?
                                                                this.state.weituoList.map((item, index) => (
                                                                    <li key={index} className="ft-theme-border">
                                                                        {/* 现货 */}
                                                                        <span className={item.transactionType === 1 ? 'red firstOne ft-theme-s3 hide left trade-middle' : 'green firstOne ft-theme-s3 hide left trade-middle'}>{item.assetName}</span>
                                                                        {/* 买/卖 */}
                                                                        <span className={item.transactionType === 1 ? 'red ft-theme-s3 hide left' : 'green ft-theme-s3 hide left'} style={{ width: '6%' }}>{this.filterBuySell(item.transactionType)}</span>
                                                                        {/* 委托类型 */}
                                                                        <span className="ft-theme-s3 hide left" style={{ width: '6%' }}>{this.filterOrderType(item.orderType)}</span>
                                                                        {/* 委托价格 */}
                                                                        <span className="ft-theme-s3 hide left" style={{ width: '10%' }}>{item.price}</span>
                                                                        {/* 委托数量 */}
                                                                        <span className={item.transactionType === 1 ? 'red ft-theme-s3 hide left' : 'green ft-theme-s3 hide left'} style={{ width: '9%' }}>{item.totalAmount}</span>
                                                                        {/* 委托状态 */}
                                                                        <span className="ft-theme-s3 hide left">{this.filterWeituo(item.status)}</span>
                                                                        {/* 成交均价 */}
                                                                        <span className="ft-theme-s3 hide left">{item.purchasePrice}</span>
                                                                        {/* 已成交数量 */}
                                                                        <span className="ft-theme-s3 hide left" style={{ width: '10%' }}>{item.filledAmount}</span>
                                                                        {/* 未成交数量 */}
                                                                        <span className="ft-theme-s3 hide left" style={{ width: '10%' }}>{item.unfilledAmount}</span>
                                                                        {/* 委托时间 */}
                                                                        <span className="ft-theme-s3 hide trade-lang left" style={{ width: '13%' }}>{moment(item.gmtCreate).format('MM/DD HH:mm:ss')}</span>
                                                                        <span className="right hide">
                                                                            <span className="Trade-chedan" onClick={() => { this.getOutOrder(item.id) }}>{t('USDTtrade.USDKentrustCancle')}</span>
                                                                        </span>
                                                                    </li>
                                                                ))
                                                                :
                                                                <li className={this.props.theme === 'night' ? 'ft-theme-border ft-theme-s3 Nodata' : 'ft-theme-border ft-theme-s3 NodataLight'}>
                                                                    {t('USDTtrade.Nodata')}
                                                                </li>
                                                        }
                                                    </ul>
                                                </div>
                                                {
                                                    this.state.weituoTotal && this.state.weituoTotal > 20 ?
                                                        <div className="Trade-page">
                                                            <Pagination current={this.state.weituoT} defaultPageSize={20} size="small" total={this.state.weituoTotal} onChange={(e) => { this.getWeituoList(this.state.checkWeituo ? 1 : 0, e, 20) }} />
                                                        </div>
                                                        :
                                                        null
                                                }
                                            </div>
                                            :
                                            null
                                    }
                                    {
                                        this.state.ActiveLi === 1 ?
                                            <div className="TradeTab lishi" ref={this.chicangRef}>
                                                <div className="Trade-table-tit" style={isMac() ? { width: ulwidth } : null}>
                                                    {/* 现货  */}
                                                    <span className="firstOne ft-theme-label hide trade-middle left cursor" style={{ width: '12%' }}>
                                                        <Tooltip overlayClassName="pop-main" placement="topLeft" title={entrust1}>
                                                            {t('USDTtrade.USDKHistory1')}
                                                        </Tooltip>
                                                    </span>
                                                    {/* 买/卖 */}
                                                    <span className="ft-theme-label hide cursor left" style={{ width: '5%' }}>
                                                        <Tooltip overlayClassName="pop-main" title={entrust2}>
                                                            {t('USDTtrade.USDKHistory2')}
                                                        </Tooltip>
                                                    </span>
                                                    {/* 委托类型 */}
                                                    <span className="ft-theme-label hide cursor left" style={{ width: '6%' }}>
                                                        <Tooltip overlayClassName="pop-main" title={entrust3}>
                                                            {t('USDTtrade.USDKHistory9')}
                                                        </Tooltip>
                                                    </span>
                                                    {/* 委托价格 */}
                                                    <span className="ft-theme-label hide cursor left">
                                                        <Tooltip overlayClassName="pop-main" title={entrust4}>
                                                            {t('USDTtrade.USDKHistory5')}
                                                        </Tooltip>
                                                    </span>
                                                    {/* 委托数量 */}
                                                    <span className="ft-theme-label hide cursor left">
                                                        <Tooltip overlayClassName="pop-main" title={entrust5}>
                                                            {t('USDTtrade.USDKHistory3')}
                                                        </Tooltip>
                                                    </span>
                                                    {/* 委托状态 */}
                                                    <span className="ft-theme-label hide cursor left">
                                                        <Tooltip overlayClassName="pop-main" title={entrust6}>
                                                            {t('USDTtrade.USDKHistory6')}
                                                        </Tooltip>
                                                    </span>
                                                    {/* 成交均价 */}
                                                    <span className="ft-theme-label hide cursor left" style={{ width: '11%' }}>
                                                        <Tooltip overlayClassName="pop-main" title={entrust7}>
                                                            {t('USDTtrade.USDKHistory7')}
                                                        </Tooltip>
                                                    </span>
                                                    {/* 已成交数量 */}
                                                    <span className="ft-theme-label hide cursor left" style={{ width: '11%' }}>
                                                        <Tooltip overlayClassName="pop-main" title={entrust8}>
                                                            {t('USDTtrade.USDKHistory10')}
                                                        </Tooltip>
                                                    </span>
                                                    {/* 未成交数量 */}
                                                    <span className="ft-theme-label hide cursor left" style={{ width: '11%' }}>
                                                        <Tooltip overlayClassName="pop-main" title={entrust9}>
                                                            {t('USDTtrade.USDKHistory11')}
                                                        </Tooltip>
                                                    </span>
                                                    {/* 委托时间 */}
                                                    <span className="ft-theme-label hide cursor trade-lang left">
                                                        <Tooltip overlayClassName="pop-main" title={entrust10}>
                                                            {t('USDTtrade.USDKHistory8')}
                                                        </Tooltip>
                                                    </span>
                                                </div>
                                                <div className="scrollKiller">
                                                    <ul className="Trade-table" style={isMac() ? { width: ulwidth } : { width: '100%' }}>
                                                        {
                                                            this.state.lishiList && this.state.lishiList.length !== 0 ?
                                                                this.state.lishiList.map((item, index) => (
                                                                    <li key={index} className="ft-theme-border">
                                                                        {/* 现货  */}
                                                                        <span className={item.transactionType === 1 ? 'red firstOne ft-theme-s3 hide trade-middle left' : 'green firstOne ft-theme-s3 hide trade-middle left'} style={{ width: '12%' }}>{item.assetName}</span>
                                                                        {/* 买/卖 */}
                                                                        <span className={item.transactionType === 1 ? 'red ft-theme-s3 hide left' : 'green ft-theme-s3 hide left'} style={{ width: '5%' }}>{this.filterBuySell(item.transactionType)}</span>
                                                                        {/* 委托类型 */}
                                                                        <span className="ft-theme-s3 hide left" style={{ width: '6%' }}>{this.filterOrderType(item.orderType)}</span>
                                                                        {/* 委托价格 */}
                                                                        <span className="ft-theme-s3 hide left">{item.price}</span>
                                                                        {/* 委托数量 */}
                                                                        <span className={item.transactionType === 1 ? 'red ft-theme-s3 hide left' : 'green ft-theme-s3 hide left'}>{item.totalAmount}</span>
                                                                        {/* 委托状态 */}
                                                                        <span className="ft-theme-s3 hide left">{this.filterWeituo(item.status)}</span>
                                                                        {/* 成交均价 */}
                                                                        <span className="ft-theme-s3 hide left" style={{ width: '11%' }}>{item.purchasePrice}</span>
                                                                        {/* 已成交数量 */}
                                                                        <span className="ft-theme-s3 hide left" style={{ width: '11%' }}>{item.filledAmount}</span>
                                                                        {/* 未成交数量 */}
                                                                        <span className="ft-theme-s3 hide left" style={{ width: '11%' }}>{item.unfilledAmount}</span>
                                                                        {/* 委托时间 */}
                                                                        <span className="ft-theme-s3 hide trade-lang left">{moment(item.gmtCreate).format('YYYY-MM-DD HH:mm:ss')}</span>
                                                                    </li>
                                                                ))
                                                                :
                                                                <li className={this.props.theme === 'night' ? 'ft-theme-border ft-theme-s3 Nodata' : 'ft-theme-border ft-theme-s3 NodataLight'}>
                                                                    {t('USDTtrade.Nodata')}
                                                                </li>
                                                        }
                                                    </ul>
                                                </div>
                                                {
                                                    this.state.lishiTotal && this.state.lishiTotal > 20 ?
                                                        <div className="Trade-page">
                                                            <Pagination current={this.state.lishiCurrent} size="small" defaultPageSize={20} total={this.state.lishiTotal} onChange={(e) => { this.getLishiList(e, 20) }} />
                                                        </div>
                                                        :
                                                        null
                                                }
                                            </div>
                                            :
                                            null
                                    }
                                    {
                                        this.state.ActiveLi === 2 ?
                                            <div className="TradeTab zichan" ref={this.chicangRef}>
                                                <div className="Trade-table-tit" style={isMac() ? { width: ulwidth } : null}>
                                                    <span className="firstOne ft-theme-label hide left">{t('USDTtrade.USDKZichan1')}</span>
                                                    {/* 总量 */}
                                                    <span className="ft-theme-label hide left">{t('USDTtrade.USDKZichan5')}</span>
                                                    <span className="ft-theme-label hide left">{t('USDTtrade.USDKZichan2')}</span>
                                                    <span className="ft-theme-label hide left">{t('USDTtrade.USDKZichan3')}</span>
                                                    <span className="ft-theme-label hide left">{t('USDTtrade.USDKZichan4')}</span>
                                                </div>
                                                <div className="scrollKiller">
                                                    <ul className="Trade-table" style={isMac() ? { width: ulwidth } : { width: '100%' }}>
                                                        {
                                                            this.state.zichanList && this.state.zichanList.length !== 0 ?
                                                                this.state.zichanList.map((item, index) => (
                                                                    <li key={index} className="ft-theme-border cursor" onClick={() => { this.handleClickJump(item) }}>
                                                                        <span className="firstOne ft-theme-s3 hide left">{item.assetName}</span>
                                                                        <span className="ft-theme-s3 hide left">
                                                                            {item.totalAmount}
                                                                            {/* {
                                                                                item.assetName === 'BTC' ?
                                                                                    <Tooltip overlayClassName="pop-main" placement="topLeft" title={item.totalAmount}>
                                                                                        {Number(item.totalAmount).toFixed(4)}
                                                                                        {foFixed(Number(item.totalAmount), 4)}
                                                                                    </Tooltip>
                                                                                    :
                                                                                    item.totalAmount
                                                                            } */}
                                                                        </span>
                                                                        <span className="ft-theme-s3 hide left">
                                                                            {item.amount}
                                                                            {/* {
                                                                                item.assetName === 'BTC' ?
                                                                                    <Tooltip overlayClassName="pop-main" placement="topLeft" title={item.amount}>
                                                                                        {Number(item.amount).toFixed(4)}
                                                                                        {foFixed(Number(item.amount), 4)}
                                                                                    </Tooltip>
                                                                                    :
                                                                                    item.amount
                                                                            } */}
                                                                        </span>
                                                                        <span className="ft-theme-s3 hide left">
                                                                            {item.lockedAmount}
                                                                            {/* {
                                                                                item.assetName === 'BTC' ?
                                                                                    <Tooltip overlayClassName="pop-main" placement="topLeft" title={item.lockedAmount}>
                                                                                        {Number(item.lockedAmount).toFixed(4)}
                                                                                        {foFixed(Number(item.lockedAmount), 4)}
                                                                                    </Tooltip>
                                                                                    :
                                                                                    item.lockedAmount
                                                                            } */}
                                                                        </span>
                                                                        <span className="ft-theme-s3 hide left">
                                                                            {item.valuation}
                                                                            {/* <Tooltip overlayClassName="pop-main" placement="topLeft" title={item.valuation}>
                                                                                {Number(item.valuation).toFixed(4)}
                                                                                {foFixed(Number(item.valuation), 4)}
                                                                            </Tooltip> */}
                                                                        </span>
                                                                    </li>
                                                                ))
                                                                :
                                                                <li className={this.props.theme === 'night' ? 'ft-theme-border ft-theme-s3 Nodata' : 'ft-theme-border ft-theme-s3 NodataLight'}>
                                                                    {t('USDTtrade.Nodata')}
                                                                </li>
                                                        }
                                                    </ul>
                                                </div>
                                            </div>
                                            :
                                            null
                                    }
                                    {/* </Spin> */}
                                </Spin>
                            )
                        }
                    }
                </I18n>
            </div>
        )
    }
}
export default TradeTable

