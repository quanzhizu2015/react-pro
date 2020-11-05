/* eslint-disable*/
import React from 'react'
import { connect } from 'react-redux'
import { I18n } from 'react-i18next'
// import Message from '@/components/message'
import { Tooltip } from 'antd'
import bigdecimal from 'bigdecimal'
import Spin from '@/components/loading'
import './tradelist.scss'

const { BigDecimal } = bigdecimal
let dealTableHeight
// /* eslint-disable */
function timestampToTime(timestamp) {
    const date = new Date(timestamp)
    const h = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
    const m = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
    const s = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
    return `${h}:${m}:${s}`
}
function scrollToMiddle() {
    const upBox = document.getElementById('upBox')
    const dnBox = document.getElementById('dnBox')
    if (upBox) upBox.scrollTop = 10000
    if (dnBox) dnBox.scrollTop = 0
}
function fillDecimal(price, decimalPrice) {
    // if (Number(price) >= 100000) {
    //     return ~~price // eslint-disable-line
    // }
    let len // 小数点后面的位数
    if (price.toString().indexOf('.') !== -1) {
        len = price.toString().split('.')[1].length
    } else { // 如果是整数，则返回小数点位数 === 0
        len = 0
    }
    if (len === Number(decimalPrice) || Number(decimalPrice) <= 0) {
        return price
    }
    if (len > Number(decimalPrice)) {
        let ans = Number(price).toFixed(Number(decimalPrice));
        ans = Number(ans - 1).toFixed(Number(decimalPrice));
        return ans;
    }
    const decArr = [0, 1, 2, 3, 4, 5, 6, 7, 8]
    let zeroArr = []
    // 根据当前精度进行补0
    switch (Number(decimalPrice)) {
    case 1: zeroArr = ['.0', '', '', '', '', '', '', '']
        break
    case 2: zeroArr = ['.00', '0', '', '', '', '', '', '']
        break
    case 3: zeroArr = ['.000', '00', '0', '', '', '', '']
        break
    case 4: zeroArr = ['.0000', '000', '00', '0', '', '', '', '']
        break
    case 5: zeroArr = ['.00000', '0000', '000', '00', '0', '', '', '']
        break
    case 6: zeroArr = ['.000000', '00000', '0000', '000', '00', '0', '', '']
        break
    case 7: zeroArr = ['.0000000', '000000', '00000', '0000', '000', '00', '0', '']
        break
    case 8: zeroArr = ['.00000000', '0000000', '000000', '00000', '0000', '000', '00', '0']
        break
    default: break
    }
    for (let i = 0; i < decArr.length; i += 1) {
        if (len === decArr[i]) {
            return `${price}${zeroArr[i]}`
        }
    }
    // debugger
    // console.log("price:");
    // console.log(price);
    return price
}
// function cutDecimal(price) {
//     if (Number(price) >= 100000) {
//         return ~~price // eslint-disable-line
//     }
//     return price
// }
function cutOutPrice(price, type, decNew) { // use: cutOutPrice(priceLast, priceType, decimalPrice(新位数))
    let res = price
    const tens = 10 ** decNew
    if (type === 1) {
        res = Math.floor(Number(res) * tens) / tens
    } else {
        res = Math.ceil(Number(res) * tens) / tens
    }
    
    if (res.toString().includes('e-')) {
        // 数已经很小了，这里都做向上取整处理，否则会出现0.0000000的情况
        res = Math.floor(Number(res) * tens)
        let have = res.toString().length-1
        let zero = ''
        for (let i = 1; i < decNew-have; i += 1) {
            zero += '0'
        }
        res = `0.${zero}${res}`
    }
    // 截取后还要进行补零操作⬇
    return fillDecimal(res, decNew)
}
function transferDecimalMenuListValue(item) {
    const zero = '0'
    let res = ''
    if (item > 0) {
        for (let i = 1; i < item; i += 1) {
            res += zero
        }
        return `0.${res}1`
    } else if (item === 0) {
        return 1
    }
    return 1 / (10 ** item)
}
function isMac() {
    const pla = navigator.platform
    if (pla.includes('Mac')) {
        return true
    }
    return false
}
// 涨跌幅上下箭头设置
function filterUp(e) {
    if (e !== undefined) {
        if (String(e).indexOf('-') === -1) {
            return true
        }
        return false
    }
    return false
}
function calculationSum(arr, index, type, decimalAmount) {
    let res = 0
    const tens = 10 ** decimalAmount
    if (type === 'up') {
        for (let i = index; i < arr.length; i += 1) {
            res += Number(arr[i].amount)
        }
        return Math.ceil(Number(res) * tens) / tens
        // return res.toFixed(decimalAmount)
    }
    for (let i = 0; i <= index; i += 1) {
        res += Number(arr[i].amount)
    }
    return Math.ceil(Number(res) * tens) / tens
}
// let UPSUM = 0;
// let DNSUM = 0;

let paramAryfresh1
let paramAryfresh2
@connect(state => ({
    wsApis: state.wsApis,
    apis: state.apis,
    wsObj: state.wsObj,
    sendWs: state.sendWs,
    setWsData: state.setWsData,
    ws_2: state.wsData.ws_2,
    ws_1: state.wsData.ws_1,
    ws_4: state.wsData.ws_4,
    savePriceData: state.savePriceData,
    priceData: state.priceData,
    contractData: state.contractData,
    usdkData: state.usdkData,
    passDeepPrice: state.passDeepPrice,
    wsConnet: state.wsConnet
}))
export default class TradeList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            dealTableData: [],
            deepUpData: [],
            deepDnData: [],
            deepDecArr: [],
            decimalPrice: 3, // 深度列表 价格 小数点位数
            decimalAmount: 3, // 深度列表 数量 小数点位数
            deepMaxUp: 0,
            deepMaxDn: 0,
            priceLast: '0',
            priceType: 1,
            priceIsUp: true, // 最新价格与之前相比是否涨了
            isShowDropMenu: false,
            loading1: true,
            loading2: true,
            dealTablePaddingBottom: {},
            cnyRate: 0,
        }
        this.offDropMenu = this.offDropMenu.bind(this)
        this.initws4 = 0
        this.deepBoxUpRef = React.createRef()
    }
    componentDidMount() {
        const dealTable = document.querySelector('.deal_table')
        dealTableHeight = dealTable.clientHeight
        this.computePadding()
        document.addEventListener('click', this.offDropMenu, false)
    }
    componentWillReceiveProps(props) {
        // console.log(props);

        if (props.wsConnet === true && props.wsConnet !== this.props.wsConnet && paramAryfresh1) {
            this.props.dispatch(this.props.sendWs(this.props.wsObj, JSON.stringify(paramAryfresh1)))
        }
        if (props.wsConnet === true && props.wsConnet !== this.props.wsConnet && paramAryfresh2) {
            this.props.dispatch(this.props.sendWs(this.props.wsObj, JSON.stringify(paramAryfresh2)))
        }
        if (props.usdkData && (props.usdkData !== this.props.usdkData)) {
            this.initws4 = 0
            this.props.dispatch(this.props.setWsData({ ws_2: null }))
            this.setState({
                deepDecArr: props.usdkData.usdkPrecision || [],
                decimalPrice: props.usdkData.usdkPrecision[0] ? props.usdkData.usdkPrecision[0] : 3,
                decimalAmount: props.usdkData.usdkTradeAmountPrecision,
                deepMaxUp: 0,
                deepMaxDn: 0,
            })
            this.getDealListData(props.usdkData.pairId)
            this.getDeepListData(props.usdkData.pairId, props.usdkData.usdkPrecision[0] ? props.usdkData.usdkPrecision[0].toString() : 2)
        }
        if (props.contractData && (props.contractData !== this.props.contractData)) {
            this.initws4 = 0
            this.props.dispatch(this.props.setWsData({ ws_2: null }))
            this.setState({
                deepDecArr: props.contractData.contractPrecision || [],
                decimalPrice: props.contractData.contractPrecision[0] ? props.contractData.contractPrecision[0] : 3,
                decimalAmount: props.contractData.contractTradeAmountPrecision + 1,
                deepMaxUp: 0,
                deepMaxDn: 0,
            })
            this.getDealListData(props.contractData.contractId)
            // console.log(this.getDealListData(props.contractData.contractPrecision))
            this.getDeepListData(props.contractData.contractId, props.contractData.contractPrecision[0] ? props.contractData.contractPrecision[0].toString() : 3)
        }
        if (props.ShowAtao !== this.props.ShowAtao) {
            this.computePadding()
            scrollToMiddle()
        }
        if (props.ws_4 && (props.ws_4 !== this.props.ws_4) && (props.ws_4.usdkPrice || props.ws_4.contractPrice) && this.initws4 === 0) {
            if (this.props.comType === 'usdk' && props.ws_4.usdkPrice) {
                this.settingInitPriceLast(props.ws_4)
            }
            if (this.props.comType === 'contract' && props.ws_4.contractPrice) {
                this.settingInitPriceLast(props.ws_4)
            }
        }
        if (props.ws_2 && props.ws_2.cnyRate) {
            this.setState({ // 拿到数据就将loading去除
                cnyRate: props.ws_2.cnyRate,
            })
        }
        // 动态渲染成交列表
        if (props.ws_2 && props.ws_2 !== this.props.ws_2) {
            this.setState({ // 拿到数据就将loading去除
                loading2: false,
            })
            let sureSet
            if (this.props.comType === 'usdk') {
                sureSet = this.props.usdkData && props.ws_2 && this.props.usdkData.pairId === Number(props.ws_2.id)
            } else {
                sureSet = this.props.contractData && props.ws_2 && this.props.contractData.contractId === Number(props.ws_2.id)
            }
            if (sureSet && props.ws_2.match) {
                if (props.ws_2.match[0] === undefined) {
                    this.setState({
                        priceLast: '0',
                        dealTableData: []
                    })
                } else {
                    this.setState({
                        dealTableData: props.ws_2.match,
                        priceLast: props.ws_2.match[0].price,
                        priceType: props.ws_2.match[0].matchType
                        // loading2: false,
                    })
                    if (this.props.ws_2 && this.props.ws_2.match && this.props.ws_2.match[0] !== undefined) {
                        const newp = props.ws_2.match[0].price
                        const oldp = this.props.ws_2.match[0].price
                        // const priceUpPct = (((newp - oldp) / oldp) * 100).toFixed(2)
                        // console.log('deal', oldp, newp)
                        if (newp !== oldp) this.setState({ priceIsUp: newp > oldp })
                    }
                }
            }
            //  else {
            //     this.setState({ loading2: false })
            // }
        }
        // 动态渲染深度列表
        if (props.ws_1 && props.ws_1 !== this.props.ws_1) {
            let sureSet
            if (this.props.comType === 'usdk') {
                sureSet = this.props.usdkData && props.ws_1.entrust && this.props.usdkData.pairId === Number(props.ws_1.entrust.id)
            }
            
            if (sureSet && props.ws_1.entrust) {
                const [upArr, dnArr] = [[], []]
                let [upMax, dnMax] = [null, null]
                let arrAsk50 = []
                let arrBid50 = []
                if (props.ws_1.entrust.asks && props.ws_1.entrust.asks.length >= 0) {
                    arrAsk50 = props.ws_1.entrust.asks.slice(-50)
                    let arrAsk50Before
                    arrAsk50.forEach(item => upArr.push(item.amount))
                    upMax = calculationSum(arrAsk50, 0, 'up', this.state.decimalAmount)
                    // 锣鼓喧天鞭炮齐鸣
                    if (this.props.ws_1 && this.props.ws_1.entrust.asks && this.props.ws_1.entrust.asks.length > 0) {
                        arrAsk50Before = this.props.ws_1.entrust.asks.slice(-50)
                        arrAsk50.forEach((item, index) => {
                            const beforeItem = arrAsk50Before.find(n => n.price === item.price)
                            if (beforeItem && beforeItem.amount !== item.amount) arrAsk50[index].isFlickingUp = item.amount > beforeItem.amount
                        })
                    }
                    this.setState({ deepMaxUp: upMax })
                }
                if (props.ws_1.entrust.bids && props.ws_1.entrust.bids.length >= 0) {
                    arrBid50 = props.ws_1.entrust.bids.slice(0, 50)
                    let arrBid50Before
                    arrBid50.forEach(item => dnArr.push(item.amount))
                    dnMax = calculationSum(arrBid50, 0, 'up', this.state.decimalAmount)
                    // 红旗招展人山人海
                    if (this.props.ws_1 && this.props.ws_1.entrust.bids && this.props.ws_1.entrust.bids.length > 0) {
                        arrBid50Before = this.props.ws_1.entrust.bids.slice(0, 50)
                        arrBid50.forEach((item, index) => {
                            const beforeItem = arrBid50Before.find(n => n.price === item.price)
                            if (beforeItem && beforeItem.amount !== item.amount) arrBid50[index].isFlickingUp = item.amount > beforeItem.amount
                        })
                    }
                    this.setState({ deepMaxDn: dnMax })
                }
                this.setState({
                    deepUpData: arrAsk50,
                    deepDnData: arrBid50,
                    loading1: false
                })
            } else {
                this.setState({ loading1: false })
            }
        }
    }
    componentWillUnmount() {
        document.removeEventListener('click', this.offDropMenu)
        this.props.dispatch(this.props.sendWs(this.props.wsObj, JSON.stringify({
            reqType: -5,
            type: 2
        })))
        this.props.dispatch(this.props.sendWs(this.props.wsObj, JSON.stringify({
            reqType: -5,
            type: 1
        })))
    }
    // 获取成交列表
    async getDealListData(id) {
        this.setState({
            dealTableData: null,
            priceLast: '0',
            // loading2: true,
        })
        let param = null
        if (this.props.comType === 'usdk') {
            // debugger
            param = {
                reqType: 2,
                type: 1,
                id: id || (this.props.usdkData ? this.props.usdkData.pairId : '1')
            }
        }
        paramAryfresh2 = param
        this.props.dispatch(this.props.sendWs(this.props.wsObj, JSON.stringify(param)))
    }
    // 获取深度列表
    async getDeepListData(id, dec) {
        this.setState({
            deepUpData: [],
            deepDnData: [],
            // loading1: true
        })
        let param = null
        if (this.props.comType === 'usdk') {
            // debugger
            param = {
                reqType: 1,
                type: 1,
                id: id || (this.props.usdkData ? this.props.usdkData.pairId : '1'), //默认 pair 1
                param: dec || '3'
            }
        } else {
            param = {
                reqType: 1,
                type: 2,
                id: id || (this.props.contractData ? this.props.contractData.contractId : '2'),
                param: dec || '3'
            }
        }
        paramAryfresh1 = param
        // 去除深度列表的首次http请求
        // try {
        //     const res = await this.props.apis.deepList(param)
        //     if (res.code === 0 && res.data && res.data.entrust) {
        //         const [upArr, dnArr] = [[], []]
        //         let [upMax, dnMax] = [null, null]
        //         if (res.data.entrust.asks && res.data.entrust.asks.length > 0) {
        //             res.data.entrust.asks.slice(-50).forEach(item => upArr.push(item.amount))
        //             upMax = calculationSum(res.data.entrust.asks.slice(-50), 0, 'up', this.state.decimalAmount)
        //             this.setState({ deepMaxUp: upMax })
        //         }
        //         if (res.data.entrust.bids && res.data.entrust.bids.length > 0) {
        //             res.data.entrust.bids.slice(0, 50).forEach(item => dnArr.push(item.amount))
        //             dnMax = calculationSum(res.data.entrust.bids.slice(0, 50), 0, 'up', this.state.decimalAmount)
        //             this.setState({ deepMaxDn: dnMax })
        //         }
        //         this.setState({
        //             deepUpData: res.data.entrust.asks ? res.data.entrust.asks.slice(-50) : [],
        //             deepDnData: res.data.entrust.bids ? res.data.entrust.bids.slice(0, 50) : [],
        //             loading1: false
        //         })
        //         // this.props.dispatch(this.props.sendWs(JSON.stringify(param)))
        //     } else {
        //         this.setState({ loading1: false })
        //     }
        // } catch (e) {
        //     Message.warning(e.message)
        // }
        this.props.dispatch(this.props.sendWs(this.props.wsObj, JSON.stringify(param)))
    }
    // 获取深度列表 纯WebSocket 改变小数的时候用到
    getDeepListWs(decimal) {
        let param = null
        if (this.props.comType === 'usdk') {
            // debugger
            param = {
                reqType: 1,
                type: 1,
                id: this.props.usdkData ? this.props.usdkData.pairId : '1',
                param: decimal || '3'
            }
        } else {
            param = {
                reqType: 1,
                type: 2,
                id: this.props.contractData ? this.props.contractData.contractId : '2',
                param: decimal || '3'
            }
        }
        paramAryfresh1 = param
        this.props.dispatch(this.props.sendWs(this.props.wsObj, JSON.stringify(param)))
    }
    settingInitPriceLast(ws4) {
        if (ws4) {
            if (this.props.comType === 'usdk') {
                // console.log(ws4.usdkPrice, filterUp(ws4.usdkIncrement))
                this.setState({
                    priceLast: ws4.usdkPrice || '0',
                    priceIsUp: filterUp(ws4.usdkIncrement)
                })
            } else {
                // console.log(ws4.contractPrice, filterUp(ws4.contractIncrement))
                this.setState({
                    priceLast: ws4.contractPrice || '0',
                    priceIsUp: filterUp(ws4.contractIncrement)
                })
            }
        }
        this.initws4 = 1
    }
    // 成交列表 通过动态调整padding-bottom以显示完整数据
    computePadding() {
        const dealTable = document.querySelector('.deal_table')
        if (dealTable) {
            // const h = dealTable.clientHeight
            const pb = ((dealTableHeight / 17).toFixed(3) - parseInt(dealTableHeight / 17, 10)) * 17
            this.setState({ dealTablePaddingBottom: { paddingBottom: `${pb}px` } })
        }
        window.onresize = () => { this.setState({}) }
    }
    // 改变小数位数
    changeDecimal = (e) => {
        this.getDeepListWs(e.target.dataset.value)
        this.setState({
            decimalPrice: e.target.dataset.value
        })
    }
    openDropMenu(e) {
        // e.stopPropagation() // 这个不好使！坑啊，重点在下面！⬇
        // debugger
        e.nativeEvent.stopImmediatePropagation()
        this.setState({ isShowDropMenu: !this.state.isShowDropMenu })
    }
    offDropMenu() {
        // debugger
        if (this.state.isShowDropMenu) {
            this.setState({ isShowDropMenu: false, })
        }
    }
    // 传递买/卖价格 存到Redux，给法海
    passPriceToRedux(price) {
        this.props.dispatch(this.props.passDeepPrice(price))
    }
    changeScence = (value) => {
        let a = value.toString()
        if (a.indexOf('-') >= 0 && String(a).indexOf('e') !== -1) { // 是否有-并且有e，是为科学计数法
            a = `0${String(Number(a) + 1).substr(1)}`
        }
        if (a >= 0.01) {
            // console.log(a)
            return Number(a).toFixed(2)
        } else {
            return Number(a).toFixed(4)
        }
    }
    render() {
        const {
            isShowDropMenu,
            dealTableData,
            deepUpData,
            deepDnData,
            deepDecArr,
            deepMaxUp,
            deepMaxDn,
            priceLast,
            priceType,
            priceIsUp,
            decimalPrice,
            decimalAmount,
            dealTablePaddingBottom,
            loading1,
            loading2,
            cnyRate,
        } = this.state
        // console.log('priceLast', priceLast, 'priceIsUp', priceIsUp)
        const { comType } = this.props
        let [selectStyle, arrowIcon] = [null, null]
        if (isShowDropMenu) {
            selectStyle = { visibility: 'visible', opacity: '1' }
            arrowIcon = 'iconjiantouarrow492'
        } else {
            selectStyle = { visibility: 'hidden', opacity: '0' }
            arrowIcon = 'iconjiantouarrow486'
        }
        const ulwidth = 'width: calc(100% - 21px)'
        const TIPS01 = (<I18n>{(t) => (<span className="tipsPara" dangerouslySetInnerHTML={{ __html: t('USDTtrade.TIPSDeep') }} />)}</I18n>)
        return (
            <I18n>
                {
                    t => (
                        <div id="tradelist" className="ft-theme-bg-auto">
                            <div className="left_box ft-theme-bg-default">
                                <Spin spinning={loading1} classs="loadingT">
                                    <div className="head_title">
                                        <p className="ft-theme-s3">{t('USDTtrade.USDKDeep')}</p>
                                        <div className="select_menu">
                                            <div className="select_open" onClick={e => this.openDropMenu(e)}>
                                                <p className="ft-theme-label">{transferDecimalMenuListValue(decimalPrice)}</p>
                                                <Tooltip overlayClassName="pop-main" title={TIPS01} placement="bottom">
                                                    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" className="svgTooltip">
                                                        <use style={{ pointerEvents: 'none' }} xlinkHref="#iconwenhao1" />
                                                    </svg>
                                                </Tooltip>
                                                <i className={`iconfont ft-theme-s3 ${arrowIcon}`} />
                                            </div>
                                            <ul className="select_drop ft-theme-bg-select ft-theme-s1" style={selectStyle}>
                                                {
                                                    deepDecArr ?
                                                        deepDecArr.map((item, index) => (
                                                            <li
                                                                key={index}
                                                                data-value={item}
                                                                onClick={(e) => { this.changeDecimal(e) }}
                                                                className="ft-theme-dropmenu-li-hover"
                                                            >
                                                                {transferDecimalMenuListValue(item)}
                                                                {/* {t(`USDTtrade.USDKDeepD${item}`)} */}
                                                            </li>
                                                        ))
                                                        :
                                                        null
                                                }
                                            </ul>
                                        </div>
                                        <div className="clearboth" />
                                        <div className="title_line ft-theme-col-line" />
                                        <ul>
                                            <li className="ft-theme-label">{t('USDTtrade.USDKDeep1')}{comType === 'usdk' ? '' : '($)'}</li>
                                            {
                                                comType === 'usdk' ?
                                                    <li className="ft-theme-label">{t(`USDTtrade.${comType === 'usdk' ? 'USDKAmount' : 'USDKDeep2'}`)}</li>
                                                    :
                                                    <li className="ft-theme-label">{t(`USDTtrade.${comType === 'usdk' ? 'USDKAmount' : 'USDKDeep2'}`)}(<i className="iconfont iconbitebi" />)</li>
                                            }
                                            {
                                                comType === 'usdk' ?
                                                    <li className="ft-theme-label">{t(`USDTtrade.${comType === 'usdk' ? 'USDKAmountSum' : 'USDKDeep3'}`)}</li>
                                                    :
                                                    <li className="ft-theme-label">{t(`USDTtrade.${comType === 'usdk' ? 'USDKAmountSum' : 'USDKDeep3'}`)}(<i className="iconfont iconbitebi" />)</li>
                                            }
                                        </ul>
                                    </div>
                                    <div className={`outerbox ${isMac() ? 'mac' : 'window'}`}>
                                        <div className="innerbox inner_up">
                                            <div className="deep_up_box" ref={this.deepBoxUpRef} id="upBox">
                                                <ul className="deep_up_ul" style={isMac() ? { width: ulwidth } : null} id="upUl">
                                                    {
                                                        deepUpData && deepUpData.length > 0 ?
                                                            deepUpData.map((item, index) => {
                                                                const price = fillDecimal(item.price, decimalPrice)
                                                                const amount = cutOutPrice(Number(item.amount), 2, decimalAmount)
                                                                const sum = calculationSum(deepUpData, index, 'up', decimalAmount)
                                                                const percent = (sum / deepMaxUp) * 100
                                                                let animationClass = ''
                                                                if (item.isFlickingUp !== undefined) animationClass = item.isFlickingUp ? 'upAnimation' : 'dnAnimation'
                                                                return (
                                                                    <li key={index} className="ft-theme-deep-hover" onClick={() => this.passPriceToRedux(price)}>
                                                                        <div className="info_line">
                                                                            <p className="price">{price}</p>
                                                                            <p className={`num ft-theme-s3 ${animationClass}`}>{amount}</p>
                                                                            <p className="sum ft-theme-s3">{cutOutPrice(sum, 2, decimalAmount)}</p>
                                                                        </div>
                                                                        {/* <div className="deep_line0" style={{ width: `${percent <= 1 ? 1 : percent}%` }} /> */}
                                                                        <div className="deep_line">
                                                                            <div className="deep_line_color" style={{ width: `${percent <= 1 ? 1 : percent}%` }} />
                                                                        </div>
                                                                        <div className="hover_line" />
                                                                    </li>
                                                                )
                                                            })
                                                            :
                                                            null
                                                    }
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="last_price ft-theme-bg-last_price" onClick={scrollToMiddle}>
                                            <p className={priceIsUp ? 'green' : 'red'} onClick={() => this.passPriceToRedux(priceLast)}>
                                                {
                                                    decimalPrice === deepDecArr[0] ?
                                                        priceLast
                                                        :
                                                        cutOutPrice(priceLast, priceType, decimalPrice)
                                                }
                                                <i className={`iconfont ${priceIsUp ? 'iconjiantouarrow492 green' : 'iconjiantouarrow486 red'}`} />
                                                <span>
                                                ≈&nbsp;
                                                {
                                                    this.changeScence(
                                                        BigDecimal(
                                                            decimalPrice === deepDecArr[0] ? priceLast : cutOutPrice(priceLast, priceType, decimalPrice)
                                                        ).multiply(BigDecimal(cnyRate || 0)).floatValue()
                                                    )
                                                } CNY
                                                </span>
                                                {/* <span>{Number(priceUpPct) >= 0 ? '+' : ''}{priceUpPct}%</span> */}
                                            </p>
                                        </div>
                                        <div className="innerbox inner_dn">
                                            <div className="deep_dn_box" id="dnBox">
                                                <ul className="deep_down_ul" style={isMac() ? { width: ulwidth } : null}>
                                                    {
                                                        deepDnData && deepDnData.length > 0 ?
                                                            deepDnData.map((item, index) => {
                                                                const price = fillDecimal(item.price, decimalPrice)
                                                                const amount = cutOutPrice(Number(item.amount), 2, decimalAmount)
                                                                const sum = calculationSum(deepDnData, index, 'dn', decimalAmount)
                                                                const percent = (sum / deepMaxDn) * 100
                                                                let animationClass = ''
                                                                if (item.isFlickingUp !== undefined) animationClass = item.isFlickingUp ? 'upAnimation' : 'dnAnimation'
                                                                return (
                                                                    <li
                                                                        key={index}
                                                                        className="ft-theme-deep-hover"
                                                                        onClick={() => this.passPriceToRedux(price)}
                                                                    >
                                                                        <div className="info_line">
                                                                            <p className="price">{price}</p>
                                                                            <p className={`num ft-theme-s3 ${animationClass}`}>{amount}</p>
                                                                            <p className="sum ft-theme-s3">{cutOutPrice(sum, 2, decimalAmount)}</p>
                                                                        </div>
                                                                        {/* <div className="deep_line0" style={{ width: `${percent <= 1 ? 1 : percent}%` }} /> */}
                                                                        <div className="deep_line">
                                                                            <div className="deep_line_color" style={{ width: `${percent <= 1 ? 1 : percent}%` }} />
                                                                        </div>
                                                                        <div className="hover_line" />
                                                                    </li>
                                                                )
                                                            })
                                                            :
                                                            null
                                                    }
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </Spin>
                            </div>
                            <div className="right_box ft-theme-bg-default">
                                <Spin spinning={loading2} classs="loadingT loadingD">
                                    <div className="head_title">
                                        <p className="ft-theme-s3">{t('USDTtrade.USDKDeal')}</p>
                                        <div className="title_line ft-theme-col-line" />
                                        <ul>
                                            <li className="ft-theme-label">{t('USDTtrade.USDKDeal1')}</li>
                                            <li className="ft-theme-label">{t('USDTtrade.USDKDeal2')}{comType === 'usdk' ? '' : '($)'}</li>
                                            {
                                                comType === 'usdk' ?
                                                    <li className="ft-theme-label">{t(`USDTtrade.${comType === 'usdk' ? 'USDKAmount' : 'USDKDeal3'}`)}</li>
                                                    :
                                                    <li className="ft-theme-label">{t(`USDTtrade.${comType === 'usdk' ? 'USDKAmount' : 'USDKDeal3'}`)}(<i className="iconfont iconbitebi" />)</li>
                                            }
                                        </ul>
                                    </div>
                                    <table className="deal_table" style={dealTablePaddingBottom}>
                                        <tbody>
                                            {
                                                dealTableData && dealTableData.length > 0 ?
                                                    dealTableData.map((item, index) => {
                                                        const timing = timestampToTime(item.ts)
                                                        const amount = cutOutPrice(Number(item.amount), 2, decimalAmount)
                                                        return (
                                                            <tr key={index} className="ft-theme-deal-hover" onClick={() => this.passPriceToRedux(item.price)}>
                                                                <td className="ft-theme-s3">{timing}</td>
                                                                <td className={item.matchType === 1 ? 'green' : 'red'}><span>{item.price}</span></td>
                                                                <td className="ft-theme-s3">{amount}</td>
                                                            </tr>
                                                        )
                                                    })
                                                    :
                                                    null
                                            }
                                        </tbody>
                                    </table>
                                </Spin>
                            </div>
                        </div>
                    )
                }
            </I18n>
        )
    }
}