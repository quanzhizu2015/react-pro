import React, { Component } from 'react'
import { connect } from 'react-redux'
import Formsy from 'formsy-react'
import { autobind } from 'core-decorators'
import { withRouter } from 'react-router'
// import { Link } from 'react-router-dom'
import { Tooltip } from 'antd'

// import Spin from '@/components/loading'
import CommonLoading from '@/components/loading'
import { I18n } from 'react-i18next'

import './index.scss'
import TradeInput from '@/components/tradeInput'
import TradeButton from '@/components/tradeButton'
// import FtRadio from '@/components/ftRadio'
import Message from '@/components/message'
// import TradeMenu from '@/components/tradeMenu'
import TradeConfirm from './tradeConfirm.js'
import { isMac } from '@/assets/js/common'

function calePrice(sq, price, math) {
    const temp = 10 ** sq
    const data = math(price * temp)
    return data / temp
}

function commonTip(str) {
    return (
        <I18n>{
            (t) => (<div className="pop-contant cursor"><span>{t(str)}</span></div>)}
        </I18n>
    )
}
let paramAryfresh
// import ReactDom from 'react-dom';
@withRouter
@connect(state => ({
    apis: state.apis,
    lang: state.lang,
    userAuth: state.userAuth,
    wsObj: state.wsObj,
    wsData: state.wsData,
    clearUserAuth: state.clearUserAuth,
    usdkData: state.usdkData,
    getUsdkData: state.getUsdkData,
    tradePrice: state.tradePrice,
    sendWs: state.sendWs,
    wsConnet: state.wsConnet
}))
export default class TradeForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tradeDisabled: true,
            currentTabIndex: 0, // 展示限价单还是市价单,0对应限价单，1对应市价单
            // model: null,
            assetInfo: [
                {
                    assetId: 2,
                    assetName: 'BTC',
                },
                {
                    assetId: 3,
                    assetName: 'ETH',
                },
                {
                    assetId: 4,
                    assetName: 'EOS',
                }
            ]
        }
    }
    componentWillMount() {
        // if (this.props.wsData && this.props.wsData.ws_2 && this.props.wsData.ws_2.match.length > 0) {
        //     this.price = this.props.wsData.ws_2.match[0].price
        // }
        if (this.props.userAuth && this.props.usdkData) {
            this.userRecord = true
            // this.getAmount(this.props.usdkData.assetId, '2')
            // this.getAmount(this.props.usdkData.assetId, '1')
            this.getAssetInfo(this.props.usdkData.assetId)
        } else if (this.props.userAuth) {
            this.userRecord = true
        }
        if (this.props.usdkData) {
            this.dataRecord = true
        }
        this.firstValue = true
        this.firstFocus = true
    }
    componentDidMount() {
        if (this.dataRecord && this.props.usdkData && this.props.usdkData.assetName) {
            setTimeout(this.initAmountValue, 20)
        }
    }
    componentWillReceiveProps(props) {
        if (props.wsConnet === true && props.wsConnet !== this.props.wsConnet && paramAryfresh) {
            this.props.dispatch(this.props.sendWs(this.props.wsObj, JSON.stringify(paramAryfresh)))
        }
        if (props.lang !== this.props.lang) {
            setTimeout(() => {
                this.tradeForm.validateForm()
            }, 20)
        }
        if (props.userAuth && props.userAuth !== this.props.userAuth) {
            this.userRecord = true
        }
        if (props.usdkData && props.usdkData !== this.props.usdkData) {
            this.price = ''
            this.tradeForm.reset()
            this.dataRecord = true
            this.ftInput = undefined
            // setTimeout(() => {
            //     this.initAmountValue()
            // }, 20)
        }
        // 确认账户已登陆，获取相对应信息
        if (this.userRecord && this.dataRecord) {
            this.dataRecord = false
            this.getAssetInfo(props.usdkData.assetId)
            // this.getAmount(props.usdkData.assetId, '2')
            // this.getAmount(props.usdkData.assetId, '1')
        }
        if (props.tradePrice !== this.props.tradePrice) {
            this.price = props.tradePrice.price.toString()
            this.changePriceType(true)
        }
        if (props.wsData && props.wsData.ws_6 !== this.props.wsData.ws_6) {
            this.state.assetInfo = props.wsData.ws_6
            this.setState({})
        }
        if (
            props.wsData
            && props.wsData.ws_2
            && props.wsData.ws_2 !== this.props.wsData.ws_2
            && (!this.currentId || props.wsData.ws_2.id !== this.currentId)
            && this.firstValue && props.usdkData) {
            this.currentId = props.wsData.ws_2.id
            this.firstValue = false
            this.changeEvent = true
            this.ws_2 = props.wsData.ws_2
            this.ftInput = 2
            // this.model为空的情况
            this.initAmountValue()
            if (this.model) {
                setTimeout(() => {
                    this.changeUsdkData(this.model)
                }, 20)
            }
        }
        // this.initInputData(props)
    }
    componentWillUnmount() {
        this.props.dispatch(this.props.sendWs(this.props.wsObj, JSON.stringify({
            reqType: -5,
            type: 6
        })))
    }
    async getAssetInfo(assetId) {
        if (localStorage.sessionId) {
            paramAryfresh = {
                id: assetId,
                reqType: 6,
                type: 1,
                sessionId: localStorage.sessionId
            }
            this.props.dispatch(this.props.sendWs(this.props.wsObj, JSON.stringify({
                id: assetId,
                reqType: 6,
                type: 1,
                sessionId: localStorage.sessionId
            })))
        }
        // try {
        //     const res = await this.props.apis.USDKFundInfo({
        //         assetId
        //     })
        //     if (res.code === 0) {
        //         this.doneBool = true
        //         this.setState({
        //             assetInfo: res.data
        //         })
        //         // this.initInputData()
        //     } else if (res.code === 401) {
        //         this.props.dispatch(this.props.clearUserAuth())
        //         // 登录超时
        //     }
        // } catch (e) {
        //     Message.error(e.message, 'night')
        // }
    }
    @autobind
    initDefaultAmount() {
        const { name } = this.props.usdkData
        let decimal
        if (name.startsWith('BTC')) {
            decimal = '0.01'
        } else if (name.startsWith('ETH')) {
            decimal = '0.01'
        } else if (name.startsWith('EOS')) {
            decimal = '1'
        } else if (name.startsWith('BCH')) {
            decimal = '0.1'
        } else if (name.startsWith('ETC')) {
            decimal = '1'
        } else if (name.startsWith('LTC')) {
            decimal = '0.1'
        } else if (name.startsWith('FOTA')) {
            decimal = '100.00'
        } else if (name.startsWith('DOGE')) {
            decimal = '100.00'
        }
        return decimal
    }

    @autobind
    initAmountValue() {
        if (!this.props.usdkData) return
        const decimal = this.initDefaultAmount()
        this.ftInput = 2
        this.tradeForm.inputs[1].setValue(decimal)
        this.model = {
            totalAmount: decimal
        }
        this.firstValue = true
    }
    // async getAmount(assetId, orderDirection) {
    //     if (this.getAmountInterval) {
    //         clearTimeout(this.getAmountInterval)
    //     }
    //     if (this.props.userAuth === null || this.props.userAuth === 0) return
    //     try {
    //         const res = await this.props.apis.USDKAvailable({
    //             assetId,
    //             orderDirection
    //         })
    //         if (res.code === 0) {
    //             if (orderDirection === '2') {
    //                 this.state.buyMaxAmount = res.data
    //             } else {
    //                 this.state.sellMaxAmount = res.data
    //             }
    //             this.setState({})
    //             if (this.state.buyMaxAmount && this.state.sellMaxAmount) {
    //                 // 记录状态第一次点击清除内容
    //                 this.firstFocus = true
    //                 this.firstValue = true
    //                 this.ftInput = 2
    //                 if (Number(this.state.buyMaxAmount) > Number(this.state.sellMaxAmount)) {
    //                     this.tradeForm.inputs[1].setValue(this.state.buyMaxAmount)
    //                 } else {
    //                     this.tradeForm.inputs[1].setValue(this.state.sellMaxAmount)
    //                 }
    //             }
    //         } else if (res.code === 401) {
    //             // 清除登录信息
    //             const response = await this.props.apis.logout()
    //             if (response.code === 0) {
    //                 this.props.dispatch(this.props.clearUserAuth())
    //             }
    //         }
    //     } catch (e) {
    //         Message.error(e.message, 'night')
    //     }
    // }
    // 计算初始化价格
    // @autobind
    // initInputData(propsTemp) {
    //     const props = propsTemp || this.props
    //     if (!this.doneBool || !props.wsData.ws_2) {
    //         return
    //     }
    //     let priceData
    //     if (props.wsData.ws_2.match.length > 0) {
    //         priceData = props.wsData.ws_2.match[0].price * this.state.assetInfo.avaliableAsset
    //     }
    //     this.ftInput = 1
    //     if (priceData && priceData > this.state.assetInfo.availableUsdk) {
    //         this.tradeForm.inputs[0].setValue(Number(priceData).toString())
    //     } else {
    //         this.tradeForm.inputs[0].setValue(Number(this.state.assetInfo.availableUsdk).toString())
    //     }
    //     this.doneBool = false
    // }
    @autobind
    async trading(transactionType) {
        // if (this.props.usdkData.tradeEnable) {
        const { currentTabIndex } = this.state
        const { userAuth, history, location } = this.props
        if (userAuth === 0) {
            history.push(`/common/login?hrefLink=${encodeURIComponent(location.pathname)}${encodeURIComponent(location.search)}`)
            return
        }
        const { inputs } = this.tradeForm
        for (let i = 0; i < inputs.length; i += 1) {
            const el = inputs[i]
            const msg = el.getErrorMessage()
            if (msg) {
                Message.error(msg, 'night')
                return
            }
        }
        const model = {
            ...this.tradeForm.getModel()
        }
        // console.log('model---', model.totalPrice)
        if (currentTabIndex === 0) {
            model.priceType = this.state.tradeDisabled ? 0 : 1
        } else if (currentTabIndex === 1) {
            model.priceType = 2
        }
        if (currentTabIndex === 0 && this.state.tradeDisabled) {
            if (!this.props.wsData.ws_1 || !this.props.wsData.ws_1.entrust) {
                Message.error(this.t('USDTtrade.noRivalPrice'), 'night')
                return
            }
            const { asks, bids } = this.props.wsData.ws_1.entrust
            if (transactionType === 2) {
                if (!(asks && asks.length > 0)) {
                    Message.error(this.t('USDTtrade.noRivalPrice'), 'night')
                    return
                }
                model.price = asks[asks.length - 1].price
            } else {
                if (!(bids && bids.length > 0)) {
                    Message.error(this.t('USDTtrade.noRivalPrice'), 'night')
                    return
                }
                const z = 0
                model.price = bids[z].price
            }
            model.totalPrice = model.price * model.totalAmount
        }
        // if (currentTabIndex === 1) {
        //     if (!this.props.wsData.ws_1 || !this.props.wsData.ws_1.entrust) {
        //         Message.error(this.t('USDTtrade.noMarketPrice'), 'night')
        //         return
        //     }
        //     const { asks, bids } = this.props.wsData.ws_1.entrust
        //     if (transactionType === 2) {
        //         if (!(asks && asks.length > 0)) {
        //             Message.error(this.t('USDTtrade.noMarketPrice'), 'night')
        //             return
        //         }
        //         model.price = asks[asks.length - 1].price
        //     } else {
        //         if (!(bids && bids.length > 0)) {
        //             Message.error(this.t('USDTtrade.noMarketPrice'), 'night')
        //             return
        //         }
        //         const z = 0
        //         model.price = bids[z].price
        //     }
        // }
        model.assetId = this.props.usdkData.pairId
        model.assetName = this.props.usdkData.name
        model.buyFeeRate = this.props.usdkData.buyFeeRate
        model.sellFeeRate = this.props.usdkData.sellFeeRate
        // model.totalPrice = model.price * model.totalAmount
        // if (transactionType === 2) {
        //     this.nowForm = this.bForm
        //     if (this.state.tradeDisabled) {
        //         temp.price = this.props.priceData.sell.low
        //     }
        // } else {
        //     this.nowForm = this.sForm
        //     if (this.state.tradeDisabled) {
        //         temp.price = this.props.priceData.buy.high
        //     }
        // }
        this.tradeRef.trading(model, transactionType)
        // } else {
        //     Message.error('该交易对暂未开放交易', 'night')
        // }
    }
    // 合约变更
    @autobind
    changeUsdkData(model) {
        const { currentTabIndex } = this.state
        if (!this.changeEvent && JSON.stringify(this.model) === JSON.stringify(model)) {
            return
        }
        this.changeEvent = false
        this.model = model || this.model
        this.setState({})
        const getBool = val => (val || val === 0)
        let priceData
        if (this.state.tradeDisabled || currentTabIndex === 1) {
            const ws2 = this.props.wsData.ws_2 || this.ws_2
            if (ws2 && ws2.match && ws2.match.length > 0) {
                priceData = Number(ws2.match[0].price)
            }
        } else {
            priceData = model.price
        }
        if (getBool(priceData) && this.tradeForm) {
            if (this.ftInput === 1 && getBool(model.totalPrice)) {
                if (priceData === '0') {
                    Message.error(this.t('USDTtrade.priceError'), 'night')
                    this.tradeForm.inputs[1].setValue('')
                    return
                }
                const amount = (model.totalPrice / priceData).toFixed(this.props.usdkData.usdkTradeAmountPrecision)
                this.tradeForm.inputs[1].setValue(Number(amount).toString())
            } else if (this.ftInput === 2 && model.totalAmount && getBool(model.totalAmount)) {
                const tPrice = (model.totalAmount * priceData).toFixed(8)
                this.tradeForm.inputs[2].setValue(tPrice.toString())
            }
        }
        // this.setState({
        //     model
        // })
        if (!this.state.tradeDisabled) this.price = model.price
        delete this.ws_2
    }
    @autobind
    radioEv(pv, maxAmount) {
        // 修改对应数量
        if (maxAmount || maxAmount === 0) {
            const val = calePrice(this.props.usdkData.usdkTradeAmountPrecision, Number(pv * maxAmount), Math.floor)
            this.tradeForm.inputs[1].setValue(val)
            this.ftInput = 2
            this.changeUsdkData({
                ...this.tradeForm.getModel(),
                totalAmount: val
            })
        }
    }
    @autobind
    clearRadio(isClear) {
        if (this.firstFocus && isClear) {
            this.firstFocus = false
            this.tradeForm.inputs[2].setValue('')
            this.tradeForm.inputs[1].setValue('')
        }
        // this.buyRadio.clear()
        // this.sellRadio.clear()
    }
    @autobind
    changePriceType(isSetFalse) {
        this.changeEvent = true
        this.ftInput = 2
        if (isSetFalse) {
            this.state.tradeDisabled = false
            this.setState({})
            this.tradeForm.inputs[0].setValue(this.price)
            setTimeout(() => {
                this.priceRef.inputRef.focus()
            }, 20)
            return
        }
        if (this.state.tradeDisabled) {
            this.state.tradeDisabled = false
            this.setState({})
            this.tradeForm.inputs[0].setValue(this.price)
            setTimeout(() => {
                this.priceRef.inputRef.focus()
            }, 20)
            // setTimeout(() => {
            //     document.querySelector('.trade-form-pirce').querySelector('input').focus()
            // }, 20)
        } else {
            this.setState({
                tradeDisabled: true
            })
        }
    }
    @autobind
    switchTab(index) {
        this.setState({
            currentTabIndex: index
        }, () => {
            this.initAmountValue()
            this.changeEvent = true
            if (this.model) {
                setTimeout(() => {
                    this.changeUsdkData(this.model)
                }, 20)
            }
        })
    }
    @autobind
    renderOrderTabs() {
        const { currentTabIndex } = this.state
        return (
            <I18n>
                {
                    (t) => {
                        this.t = t
                        const list = [t('USDTtrade.limitedOrder'), t('USDTtrade.marketOrder')]
                        const tabToolTip = [t('USDTtrade.limitOrderTip'), t('USDTtrade.marketOrderTip')]
                        return (
                            <ul className="limitSelect">
                                {
                                    list.map((item, index) => {
                                        const toolTipHtml = (
                                            <I18n>{
                                                () => (<div className="pop-contant cursor"><span>{tabToolTip[index]}</span></div>)}
                                            </I18n>
                                        )
                                        return (
                                            <li
                                                key={index}
                                                className={`limitTab ${currentTabIndex === index ? 'active' : ''}`}
                                                onClick={() => this.switchTab(index)}
                                            >
                                                <span className="limitTab-sp">
                                                    {item}
                                                    <Tooltip overlayClassName="pop-main" title={toolTipHtml}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" className="icontooltip">
                                                            <use style={{ pointerEvents: 'none' }} xlinkHref="#iconwenhao1" />
                                                        </svg>
                                                    </Tooltip>
                                                </span>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        )
                    }
                }
            </I18n>
        )
    }
    render() {
        const { currentTabIndex } = this.state
        const zeroValidate = {
            zeroValidate: (values, value) => value !== '0' && !!value
        }
        let lastPrice
        if (this.props.wsData.ws_1 && this.props.wsData.ws_1.entrust && this.props.wsData.ws_1.entrust.asks && this.props.wsData.ws_1.entrust.asks.length > 0) {
            const { asks } = this.props.wsData.ws_1.entrust
            if (asks && asks.length > 0) {
                lastPrice = asks[asks.length - 1]
            }
        } if (this.props.wsData.ws_2 && this.props.wsData.ws_2.match && this.props.wsData.ws_2.match.length > 0) {
            lastPrice = Number(this.props.wsData.ws_2.match[0].price)
        }
        let assetName
        if (this.props.usdkData) {
            const bNames = this.props.usdkData.name.split('/')
            assetName = bNames['0']
        }
        // let buyTotalPrice
        // let sellTotalPrice
        // if (this.state.buyMaxAmount) {
        //     if (this.state.tradeDisabled && this.props.priceData) {
        //         if (this.props.priceData.sell.low) {
        //             buyTotalPrice = this.props.priceData.sell.low * this.state.buyMaxAmount
        //         }
        //     } else if (this.state.model) {
        //         buyTotalPrice = this.state.model.price * this.state.buyMaxAmount
        //     }
        // }
        // if (this.state.sellMaxAmount) {
        //     if (this.state.tradeDisabled && this.props.priceData) {
        //         if (this.props.priceData.buy.high) {
        //             sellTotalPrice = this.props.priceData.buy.high * this.state.sellMaxAmount
        //         }
        //     } else if (this.state.model) {
        //         sellTotalPrice = this.state.model.price * this.state.sellMaxAmount
        //     }
        // }
        // const selectItems = [
        //     {
        //         value: 0.25,
        //         text: '25%'
        //     },
        //     {
        //         value: 0.5,
        //         text: '50%'
        //     },
        //     {
        //         value: 0.75,
        //         text: '75%'
        //     },
        //     {
        //         value: 1,
        //         text: '100%'
        //     }
        // ]
        const { assetInfo, tradeDisabled } = this.state
        let bN
        let amountPrecision
        let pricePrecision
        // let maxMinPricePrecision
        let baseN = 'BTC'
        if (this.props.usdkData) {
            const sp = 0
            const sp1 = 1
            bN = this.props.usdkData.name.split('/')[sp]
            baseN = this.props.usdkData.name.split('/')[sp1]
            amountPrecision = this.props.usdkData.usdkTradeAmountPrecision
            pricePrecision = this.props.usdkData.usdkTradePricePrecision
            // maxMinPricePrecision = this.props.usdkData.usdkMaxMinPricePrecision
        }
        let buyMaxAmount = 0
        let sellMaxAmount = 0
        if (assetInfo && assetInfo.length > 0 && assetName) {
            // 获取当前所对应的现货
            const currentAsset = assetInfo.filter(item => item.assetName === assetName)
            const currentBTC = assetInfo.filter(item => item.assetName === baseN)
            sellMaxAmount = (currentAsset && currentAsset[0] && currentAsset[0].availableAmount) ? currentAsset[0].availableAmount : 0
            // 市价单逻辑和限价单的对手价展示逻辑一样
            if ((currentTabIndex === 1 || tradeDisabled) && lastPrice) {
                if (lastPrice === '0') {
                    buyMaxAmount = 0
                } else {
                    buyMaxAmount = (currentBTC && currentBTC[0] && currentBTC[0].availableAmount) ? currentBTC[0].availableAmount / lastPrice : 0
                }
            } else if (!tradeDisabled && this.model && this.model.price) {
                if (parseFloat(this.model.price) === 0) {
                    buyMaxAmount = 0
                } else {
                    buyMaxAmount = (currentBTC && currentBTC[0] && currentBTC[0].availableAmount) ? currentBTC[0].availableAmount / this.model.price : 0
                }
            }
        }
        return (
            <I18n>
                {
                    (t) => {
                        this.t = t
                        return (
                            <div className="trade-form">
                                {/* <Spin spinning={this.props.userAuth !== 0 && (!this.props.userAuth || !this.props.usdkData)} > */}
                                <TradeConfirm
                                    ref={(tradeRef) => { this.tradeRef = tradeRef }}
                                    apis={this.props.apis}
                                    userAuth={this.props.userAuth}
                                    history={this.props.history}
                                    location={this.props.location}
                                    callback={() => {
                                        this.ftInput = 2
                                        this.tradeForm.inputs[1].setValue(this.initDefaultAmount())
                                        this.getAssetInfo(this.props.usdkData.assetId)
                                    }}
                                />
                                <CommonLoading
                                    classes="trade-form-flex"
                                    spinning={this.props.userAuth !== 0 && (!this.props.userAuth || !this.props.usdkData)}
                                >
                                    <div className="trade-form-flex">
                                        {this.renderOrderTabs()}
                                        {
                                            currentTabIndex === 0 &&
                                            <Formsy
                                                ref={(ref) => {
                                                    if (ref) {
                                                        this.tradeForm = ref
                                                    }
                                                }}
                                                className="trade-form-content"
                                                onChange={this.changeUsdkData}
                                            >
                                                <TradeInput
                                                    name="price"
                                                    onClick={
                                                        () => {
                                                            this.changePriceType(true)
                                                        }
                                                    }
                                                    region={(0.1 ** pricePrecision).toFixed(pricePrecision)}
                                                    label={(
                                                        <a
                                                            className="trade-form-a"
                                                            onClick={
                                                                (e) => {
                                                                    this.changePriceType()
                                                                    e.stopPropagation()
                                                                }
                                                            }
                                                        >
                                                            {this.state.tradeDisabled ? t('USDTtrade.rivalPriceHack') : t('USDTtrade.specifiedPrice')}
                                                            <i className="iconfont iconqiehuan" />
                                                        </a>
                                                    )}
                                                    disabledText={t('USDTtrade.text1')}
                                                    innerRef={(ref) => { this.priceRef = ref }}
                                                    fixed={pricePrecision}
                                                    onFocus={() => {
                                                        this.ftInput = 2
                                                        this.clearRadio()
                                                    }}
                                                    showTipIcon
                                                    tooltip={this.state.tradeDisabled ? t('USDTtrade.rivalPriceTip') : t('USDTtrade.specifiedPriceTip')}
                                                    disabledShowMask
                                                    disabled={this.state.tradeDisabled}
                                                    showEditInput={!this.state.tradeDisabled}
                                                    isNumber
                                                    validations={this.state.tradeDisabled ? null : zeroValidate}
                                                    validationError={t('USDTtrade.priceError')}
                                                />
                                                <TradeInput
                                                    name="totalAmount"
                                                    onFocus={
                                                        () => {
                                                            this.ftInput = 2
                                                            this.clearRadio(true)
                                                        }
                                                    }
                                                    tooltip={t(`USDTtrade.${assetName}numberTip`)}
                                                    region={(0.1 ** amountPrecision).toFixed(amountPrecision)}
                                                    fixed={amountPrecision}
                                                    label={t('USDTtrade.number')}
                                                    unit={assetName}
                                                    isNumber
                                                    showEditInput
                                                    validations={zeroValidate}
                                                    validationError={t('USDTtrade.numberError')}
                                                />
                                                {/* <div className="trade-form-b">
                                                    <div className="trade-form-first">
                                                        <a
                                                            className="trade-form-a ft-theme-label"
                                                            onClick={
                                                                () => {
                                                                    this.changePriceType()
                                                                }
                                                            }
                                                        >
                                                            {this.state.tradeDisabled ? t('USDTtrade.rivalPrice') : t('USDTtrade.specifiedPrice')}
                                                        </a>
                                                    </div>
                                                    <TradeInput
                                                        className="trade-form-input trade-form-pirce"
                                                        name="price"
                                                        label={t('USDTtrade.number')}
                                                        fixed={pricePrecision}
                                                        onFocus={() => { this.ftInput = 2 }}
                                                        disabled={this.state.tradeDisabled}
                                                        isNumber
                                                        validations={this.state.tradeDisabled ? null : zeroValidate}
                                                        validationError={t('USDTtrade.priceError')}
                                                    />
                                                </div> */}
                                                <TradeInput
                                                    className="trade-form-top"
                                                    type="text"
                                                    name="totalPrice"
                                                    region={(0.1 ** 8).toFixed(8)}
                                                    label={t('USDTtrade.gold')}
                                                    tooltip={t('USDTtrade.priceTip')}
                                                    isNumber
                                                    unit={baseN}
                                                    onFocus={() => {
                                                        this.ftInput = 1
                                                        this.clearRadio(true)
                                                    }}
                                                    disabled={this.state.tradeDisabled}
                                                    disabledText={t('USDTtrade.text4')}
                                                    showEditInput={false}
                                                    fixed={8}
                                                    validations={zeroValidate}
                                                    validationError={t('USDTtrade.goldError')}
                                                />
                                            </Formsy>
                                        }
                                        {
                                            currentTabIndex === 1 &&
                                            <Formsy
                                                ref={(ref) => {
                                                    if (ref) {
                                                        this.tradeForm = ref
                                                    }
                                                }}
                                                className="trade-form-content"
                                                onChange={this.changeUsdkData}
                                            >
                                                <TradeInput
                                                    name="price"
                                                    region={(0.1 ** pricePrecision).toFixed(pricePrecision)}
                                                    label={(
                                                        <a
                                                            className="trade-form-a"
                                                            onClick={
                                                                (e) => {
                                                                    this.changePriceType()
                                                                    e.stopPropagation()
                                                                }
                                                            }
                                                        >
                                                            {t('USDTtrade.USDKDeal2')}
                                                        </a>
                                                    )}
                                                    disabledText={t('USDTtrade.text2')}
                                                    innerRef={(ref) => { this.priceRef = ref }}
                                                    fixed={pricePrecision}
                                                    onFocus={() => {
                                                        this.ftInput = 2
                                                        this.clearRadio()
                                                    }}
                                                    showEditInput={false}
                                                    disabled
                                                    isNumber
                                                />
                                                <TradeInput
                                                    name="totalAmount"
                                                    onFocus={
                                                        () => {
                                                            this.ftInput = 2
                                                            this.clearRadio(true)
                                                        }
                                                    }
                                                    region={(0.1 ** amountPrecision).toFixed(amountPrecision)}
                                                    fixed={amountPrecision}
                                                    label={t('USDTtrade.number')}
                                                    unit={assetName}
                                                    tooltip={t('USDTtrade.numberTip')}
                                                    isNumber
                                                    showEditInput
                                                    validations={zeroValidate}
                                                    validationError={t('USDTtrade.numberError')}
                                                />
                                                {/* <div className="trade-form-b">
                                                    <div className="trade-form-first">
                                                        <a
                                                            className="trade-form-a ft-theme-label"
                                                            onClick={
                                                                () => {
                                                                    this.changePriceType()
                                                                }
                                                            }
                                                        >
                                                            {this.state.tradeDisabled ? t('USDTtrade.rivalPrice') : t('USDTtrade.specifiedPrice')}
                                                        </a>
                                                    </div>
                                                    <TradeInput
                                                        className="trade-form-input trade-form-pirce"
                                                        name="price"
                                                        label={t('USDTtrade.number')}
                                                        fixed={pricePrecision}
                                                        onFocus={() => { this.ftInput = 2 }}
                                                        disabled={this.state.tradeDisabled}
                                                        isNumber
                                                        validations={this.state.tradeDisabled ? null : zeroValidate}
                                                        validationError={t('USDTtrade.priceError')}
                                                    />
                                                </div> */}
                                                <TradeInput
                                                    className="trade-form-top"
                                                    type="text"
                                                    name="totalPrice"
                                                    region={(0.1 ** 8).toFixed(8)}
                                                    label={t('USDTtrade.gold')}
                                                    tooltip={t('USDTtrade.priceTip')}
                                                    isNumber
                                                    showEditInput={false}
                                                    onFocus={() => {
                                                        this.ftInput = 1
                                                        this.clearRadio(true)
                                                    }}
                                                    fixed={8}
                                                    disabled
                                                    disabledText={t('USDTtrade.text3')}
                                                    validations={zeroValidate}
                                                    validationError={t('USDTtrade.goldError')}
                                                />
                                            </Formsy>
                                        }
                                        <div className="trade-form-content ft-trade-border" >
                                            <div className="trade-form-button trade-form-button-mt">
                                                <TradeButton onClick={() => { this.trading(2) }}>
                                                    {t('USDTtrade.buy')} {bN}
                                                </TradeButton>
                                                <TradeButton theme="red" onClick={() => { this.trading(1) }}>
                                                    {t('USDTtrade.sell')} {bN}
                                                </TradeButton>
                                            </div>
                                            <div className="trade-form-p">
                                                <div className="trade-form-max">
                                                    <span className="ft-theme-label">
                                                        <Tooltip overlayClassName="pop-main" title={commonTip('USDTtrade.maximumBuyTip')}>
                                                            {t('USDTtrade.maximumBuy')}
                                                        </Tooltip>
                                                    </span>
                                                    {
                                                        buyMaxAmount || buyMaxAmount === 0 ?
                                                            <span className="ft-theme-s5">
                                                                <Tooltip title={calePrice(amountPrecision, Number(buyMaxAmount), Math.floor)} >
                                                                    {calePrice(amountPrecision, Number(buyMaxAmount), Math.floor) || '0'}
                                                                </Tooltip>
                                                            </span>
                                                            :
                                                            null
                                                    }
                                                </div>
                                                <div className="trade-form-max">
                                                    <span className="ft-theme-label">
                                                        <Tooltip overlayClassName="pop-main" title={commonTip('USDTtrade.maximumSellTip')}>
                                                            {t('USDTtrade.maximumSell')}
                                                        </Tooltip>
                                                    </span>
                                                    {
                                                        buyMaxAmount || buyMaxAmount === 0 ?
                                                            <span className="ft-theme-s5">
                                                                <Tooltip title={Number(sellMaxAmount)} >
                                                                    {Number(sellMaxAmount)}
                                                                </Tooltip>
                                                            </span>
                                                            :
                                                            null
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CommonLoading>
                                <CommonLoading
                                    classes="trade-form-flex trade-form-flex-right"
                                    spinning={this.props.userAuth !== 0 && (!this.props.userAuth || !this.props.usdkData)}
                                >
                                    <div className="trade-form-flex trade-form-flex-right">
                                        <div className="trade-form-wrap">
                                            <div className="trade-form-content" style={{ width: isMac() ? 'calc(100% + 32px)' : 'calc(100% + 48px)' }}>
                                                <div className="trade-asset-info">
                                                    <div className="trade-form-link">
                                                        <span className="ft-theme-label ft-theme-left">{t('USDTtrade.wallet')}</span>
                                                        {/* <Tooltip overlayClassName="pop-main" placement="topRight" title={commonTip('USDTtrade.capitalTransferTip')}>
                                                            <Link className="trade-link-button ft-right" to="/comm/fund/transfer" target="_blank">{t('USDTtrade.capitalTransfer')}</Link>
                                                        </Tooltip> */}
                                                    </div>
                                                    {
                                                        assetInfo && assetInfo.length > 0 && assetInfo.map(item => (
                                                            <div className="wallet-block" key={item.assetId}>
                                                                <div className="trade-account-item">
                                                                    <span className="ft-theme-label">
                                                                        <Tooltip overlayClassName="pop-main" title={commonTip(`USDTtrade.${item.assetName}total`)}>
                                                                            { item.assetName }
                                                                        </Tooltip>
                                                                    </span>
                                                                    <span className="ft-theme-s5 ft-right">{ item.totalAmount ? item.totalAmount : '----' }</span>
                                                                </div>
                                                                <div className="trade-account-item">
                                                                    <span className="ft-theme-label">
                                                                        <Tooltip overlayClassName="pop-main" title={commonTip(`USDTtrade.${item.assetName}available`)}>
                                                                            {t('USDTtrade.available')}{ item.assetName }
                                                                        </Tooltip>
                                                                    </span>
                                                                    <span className="ft-theme-s5 ft-right">{ item.availableAmount ? item.availableAmount : '----' }</span>
                                                                </div>
                                                                <div className="trade-account-item">
                                                                    <span className="ft-theme-label">
                                                                        <Tooltip overlayClassName="pop-main" title={commonTip(`USDTtrade.${item.assetName}frozen`)}>
                                                                            {t('USDTtrade.frozen')}{ item.assetName }
                                                                        </Tooltip>
                                                                    </span>
                                                                    <span className="ft-theme-s5 ft-right">{ item.lockedAmount ? item.lockedAmount : '----' }</span>
                                                                </div>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CommonLoading>
                                {/* </Spin> */}
                            </div>
                        )
                    }
                }
            </I18n>
        )
    }
}
