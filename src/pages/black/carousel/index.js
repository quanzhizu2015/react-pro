import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
// import Message from '@/components/message'
import './index.scss'
import { autobind } from 'core-decorators'
import i18n from '../../../i18n'

let paramAryfresh
@withRouter
@connect(state => ({
    apis: state.apis,
    theme: state.theme,
    wsObj: state.wsObj,
    sendWs: state.sendWs,
    wsData: state.wsData,
    clearUserAuth: state.clearUserAuth,
    lang: state.lang,
    contractData: state.contractData,
    getContractData: state.getContractData,
    getUsdkData: state.getUsdkData,
    usdkData: state.usdkData,
    wsConnet: state.wsConnet
}))
export default class Carousel extends Component {
    constructor() {
        super()
        this.state = {
            horseLampList: [],
            horseLeft: 0,
            timer: 0,
            horseLampwidth: 0,
        }
    }
    componentDidMount() {
        if (this.state.timer) clearInterval(this.state.timer)
        this.getHorseLamp()
    }
    componentWillReceiveProps(props) {
        if (props.wsConnet === true && props.wsConnet !== this.props.wsConnet && paramAryfresh) {
            this.props.dispatch(this.props.sendWs(this.props.wsObj, JSON.stringify(paramAryfresh)))
        }
        if (props.wsData !== this.props.wsData && props.wsData.ws_3) {
            this.setState({
                horseLampList: props.wsData.ws_3,
                horseLampwidth: 205 * props.wsData.ws_3.length
            })
        }
    }
    componentWillUnmount() {
        clearInterval(this.state.timer)
        const param = {
            reqType: -5,
            type: 3
        }
        this.props.dispatch(this.props.sendWs(this.props.wsObj, JSON.stringify(param)))
    }
    // 获取跑马灯27个数据
    @autobind
    async getHorseLamp() {
        const param = {
            reqType: 3
        }
        paramAryfresh = param
        this.props.dispatch(this.props.sendWs(this.props.wsObj, JSON.stringify(param)))
        this.horseInterval()
    }
    horseEnter = (e) => {
        if (e.nativeEvent) {
            e.nativeEvent.stopImmediatePropagation()
        }
        if (this.state.timer) clearInterval(this.state.timer)
    }
    @autobind
    horseInterval(e) {
        if (this.state.timer > 0) {
            if (e !== undefined) {
                e.nativeEvent.stopImmediatePropagation()
            }
            clearInterval(this.state.timer)
        }
        this.state.timer = setInterval(() => {
            if (!this.ulRef) {
                clearInterval(this.state.timer)
                return
            }
            let dLeft = this.state.horseLeft - 1
            if (dLeft < -this.state.horseLampwidth) {
                dLeft = 0
            }
            // if (this.ulRef.offsetWidth && this.ulRef.offsetWidth === -dLeft) {
            //     dLeft = 0
            // }
            this.setState({
                horseLeft: dLeft
            })
        }, 30)
    }
    @autobind
    // 点击跳转
    async handleClick(id, type) {
        if (id !== undefined && type !== undefined) {
            if (type === 1) { // 合约
                if (this.props.location.pathname.startsWith('/trade/spot')) { // 当前为usdt兑换页面拿不到contractId
                    await this.props.dispatch(this.props.getContractData(id))
                    this.props.history.push(`/trade/futures?contractId=${id}`)
                } else if (this.props.location.pathname.startsWith('/trade/futures')) { // 合约交易页面可以拿到contractId
                    if (this.props.contractData && this.props.contractData.contractId && (this.props.contractData.contractId !== id)) {
                        await this.props.dispatch(this.props.getContractData(id))
                        this.props.history.push(`/trade/futures?contractId=${id}`)
                    }
                }
            } else if (type === 2) { // usdt兑换
                if (this.props.location.pathname === '/trade/futures') { // 合约交易拿不到assetId
                    await this.props.dispatch(this.props.getUsdkData(id))
                    this.props.history.push(`/trade/spot?pairId=${id}`)
                } else if (this.props.location.pathname.startsWith('/trade/spot')) {
                    if (this.props.usdkData && this.props.usdkData.pairId && (this.props.usdkData.pairId !== id)) {
                        await this.props.dispatch(this.props.getUsdkData(id))
                        this.props.history.push(`/trade/spot?pairId=${id}`)
                    }
                }
            }
        }
    }
    render() {
        return (
            <div
                className="carousel-box ft-theme-carousel-box"
                onMouseEnter={this.horseEnter}
                onMouseLeave={this.horseInterval}
            >
                <div
                    style={{
                        left: `${this.state.horseLeft}px`
                    }}
                >
                    <ul
                        ref={(ref) => { this.ulRef = ref }}
                        className="carousel-box-ul box-ul ft-theme-box-ul"
                    >
                        {
                            this.state.horseLampList !== [] ?
                                this.state.horseLampList.map((item, index) => (
                                    <li key={index} onClick={() => { this.handleClick(item.contractId, item.type) }} style={{ cursor: item.type === 0 ? 'auto' : 'pointer' }}>
                                        <span>
                                            {
                                                item.symbol.indexOf('指数') > -1 ?
                                                    item.symbol.replace('指数', `${i18n.t('carousel.index')}`)
                                                    :
                                                    item.symbol
                                            }
                                        </span>
                                        {/* <span>{this.props.lang === 'zh' ? item.symbol : item.symbol.replace('指数', ' Index')}</span> */}
                                        <span className={item.increment >= 0 ? 'increase' : 'decrease'}>{item.price}</span>
                                        {
                                            item.increment === undefined || item.increment === null ?
                                                <span>--%</span>
                                                :
                                                <span className={item.increment >= 0 ? 'increase' : 'decrease'}>{item.increment >= 0 ? `+${item.increment}` : item.increment}%</span>
                                        }
                                    </li>
                                ))
                                :
                                null
                        }
                    </ul>
                    <ul
                        ref={(ref) => { this.ulRef = ref }}
                        className="carousel-box-ul box-ul ft-theme-box-ul"
                    >
                        {
                            this.state.horseLampList !== [] ?
                                this.state.horseLampList.map((item, index) => (
                                    <li key={index} onClick={() => { this.handleClick(item.contractId, item.type) }} style={{ cursor: item.type === 0 ? 'auto' : 'pointer' }}>
                                        <span>
                                            {
                                                item.symbol.indexOf('指数') > -1 ?
                                                    item.symbol.replace('指数', `${i18n.t('carousel.index')}`)
                                                    :
                                                    item.symbol
                                            }
                                        </span>
                                        <span className={item.increment >= 0 ? 'increase' : 'decrease'}>{item.price}</span>
                                        {
                                            item.increment === undefined || item.increment === null ?
                                                <span>--%</span>
                                                :
                                                <span className={item.increment >= 0 ? 'increase' : 'decrease'}>{item.increment >= 0 ? `+${item.increment}` : item.increment}%</span>
                                        }
                                    </li>
                                ))
                                :
                                null
                        }
                    </ul>
                </div>
            </div>
        )
    }
}
