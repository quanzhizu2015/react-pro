import React, { Component } from 'react'
import { autobind } from 'core-decorators'
import { Link } from 'react-router-dom'
import { I18n } from 'react-i18next'
import bigdecimal from 'bigdecimal'
// import securty from '../../../../assets/js/security'
// import base64 from 'crypto-js/enc-base64'
// import sha256 from 'crypto-js/sha256'
import TradeComfirmPop from '../../tradeComfirmPop'
import NotifyPop from '@/components/notifyPop'
import Message from '@/components/message'
import './tradeConfirm.scss'

const { BigDecimal } = bigdecimal
export default class TradeConfirm extends Component {
    constructor() {
        super()
        this.state = {
            comfirmVisible: false,
            zjVisible: false,
            formData: [],
            pwdErrorMsg: '',
            password: '',
            pwdLoading: false,
            loading: false
        }
    }
    @autobind
    async tradeNext(unValid) {
        const next = () => {
            if (localStorage.showDisplay) {
                this.confirm()
            } else {
                this.setState({
                    zjVisible: false,
                    comfirmVisible: true
                })
            }
        }
        if (unValid) {
            next()
        } else {
            if (this.state.pwdLoading) {
                return
            }
            try {
                this.setState({
                    pwdLoading: true
                })
                // const secredPwd = sha256(`123${this.state.password}`)
                // const Pwd = base64.stringify(secredPwd)
                // const Pwd = securty(1, this.state.password)
                const Pwd = this.state.password
                const res = await this.props.apis.verifyPwd({
                    password: Pwd
                })
                this.setState({
                    pwdLoading: false
                })
                if (res.code === 0) {
                    next()
                } else if (res.code === 401) {
                    this.props.history.push('/common/login')
                }
            } catch (e) {
                this.setState({
                    pwdLoading: false
                })
                Message.error(e.message, 'night')
            }
        }
    }
    changeScence = (value) => {
        let a = value.toString()
        if (String(a).indexOf('-') >= 0 && String(a).indexOf('e') !== -1) { // 是否有-并且有e，是为科学计数法
            a = `0${String(Number(a) + 1).substr(1)}`
        }
        const y = a.indexOf('.') + 1
        // const count = a.length - y
        if (y > 0) {
            a = Number(a).toFixed(12)
            a = parseFloat(a)
        }
        if (String(a).indexOf('-') >= 0 && String(a).indexOf('e') !== -1) { // 是否有-并且有e，是为科学计数法
            a = `0${String(Number(a) + 1).substr(1)}`
        }
        return a
    }
    @autobind
    async trading(model, transactionType) {
        const { userAuth, history, location } = this.props
        if (userAuth === 0) {
            history.push(`/common/login?hrefLink=${encodeURIComponent(location.pathname)}${encodeURIComponent(location.search)}`)
        } else if (userAuth) {
            let transaction
            let feeRate
            this.state.password = ''
            const unit = model.assetName.split('/')
            let priceValue = ''
            let moneyValue = `${Number(model.totalPrice).toFixed(8)} ${unit[1]}`
            switch (model.priceType) {
            case 0:
                priceValue = transactionType === 1 ? this.t('Contrade.bestBuyPrice') : this.t('Contrade.bestSellPrice')
                moneyValue = transactionType === 1 ? this.t('USDTtrade.text5') : this.t('USDTtrade.text6')
                this.state.formTitle = this.t('Contrade.limitOrderConfirm')
                break
            case 1:
                priceValue = model.price
                this.state.formTitle = this.t('Contrade.limitOrderConfirm')
                break
            case 2:
                priceValue = this.t('Contrade.marketPrice')
                moneyValue = this.t('USDTtrade.text3')
                this.state.formTitle = this.t('Contrade.marketOrderConfirm')
                break
            default: break
            }
            if (Number(transactionType) === 2) {
                transaction = <span className="trade-tran-green">{this.t('USDTtrade.buy')}</span>
                // feeRate = `${model.buyFeeRate * model.totalAmount} ${unit[0]}`
                feeRate = `${this.changeScence(BigDecimal(model.buyFeeRate).multiply(BigDecimal(model.totalPrice)).floatValue())} ${unit[1]}`
            } else {
                transaction = <span className="trade-tran-red">{this.t('USDTtrade.sell')} </span>
                // feeRate = `${model.sellFeeRate * model.totalPrice} ${unit[1]}`
                feeRate = `${this.changeScence(BigDecimal(model.sellFeeRate).multiply(BigDecimal(model.totalAmount)).floatValue())} ${unit[0]}`
            }
            this.state.formData = [{
                label: this.t('USDTtrade.currencyLabel'),
                value: model.assetName
            }, {
                label: this.t('USDTtrade.numberLabel'),
                value: `${model.totalAmount} ${unit[0]}`
            }, {
                label: this.t('USDTtrade.goldLabel'),
                value: moneyValue
            }, {
                label: this.t('USDTtrade.feeLabel'),
                value: feeRate || '--'
            }, {
                label: this.t('USDTtrade.priceLabel'),
                value: priceValue
            }, {
                label: this.t('USDTtrade.typeLabel'),
                value: transaction
            }]
            this.model = model
            this.model.orderDirection = transactionType
            try {
                const res = await this.props.apis.verifyPassword()
                if (res.code === 0) {
                    this.tradeNext(true)
                } else if (res.code === 401) {
                    this.props.history.push('/common/login')
                } else {
                    this.setState({
                        pwdErrorMsg: '',
                        zjVisible: true
                    })
                }
            } catch (e) {
                Message.error(e.message, 'night')
            }
        }
    }
    @autobind
    enterPress(e) {
        if (e.which === 13) {
            this.tradeNext()
        }
    }
    @autobind
    async confirm(display) {
        if (this.state.loading) {
            return
        }
        if (display) {
            localStorage.showDisplay = display
        }
        const params = {
            obj: {
                ...this.model
            }
        }
        // if (this.state.password) params.password = this.state.password
        try {
            this.setState({
                loading: true
            })
            const res = await this.props.apis.USDKSubmit(params)
            this.setState({
                loading: false
            })
            if (res.code === 0) {
                if (this.props.callback) this.props.callback()
                Message.success(this.t('USDTtrade.tradeSuccess'), 'night')
                this.setState({
                    zjVisible: false,
                    comfirmVisible: false
                })
            } else if (res.code === 401) {
                this.props.history.push('/common/login')
            }
        } catch (e) {
            this.setState({
                loading: false
            })
            Message.error(e.message, 'night')
        }
    }
    @autobind
    changePwd(e) {
        const { value } = e.target
        if (value.length < 6 || value.length > 32) {
            this.setState({
                pwdErrorMsg: this.t('USDTtrade.pwdError')
            })
        } else {
            this.setState({
                pwdErrorMsg: ''
            })
        }
        this.setState({ password: value })
    }
    render() {
        return (
            <I18n>
                { (t) => {
                    this.t = t
                    return (
                        <div>
                            <TradeComfirmPop
                                cancel={() => { this.setState({ comfirmVisible: false }) }}
                                confirm={this.confirm}
                                visible={this.state.comfirmVisible}
                                dataList={this.state.formData}
                                loading={this.state.loading}
                                title={this.state.formTitle}
                            />
                            {
                                this.props.userAuth && this.props.userAuth.isFundPwdSet ?
                                    <NotifyPop
                                        // type="primary"comfirmVisible
                                        className="ft-theme-bg-default trade-box-main"
                                        visable={this.state.zjVisible}
                                        width="410"
                                        height="233"
                                        background="#212838"
                                        confirm={() => { this.tradeNext() }}
                                        cancel={() => { this.setState({ zjVisible: false }) }}
                                    >
                                        <div className="trade-box">
                                            <h5 className="ft-theme-s3">{t('USDTtrade.tradeTitle')}</h5>
                                            <div className="trade-box-conbox">
                                                <input
                                                    className="ft-theme-box-input"
                                                    autoComplete="off"
                                                    type="password"
                                                    value={this.state.password}
                                                    onChange={this.changePwd}
                                                    placeholder={t('USDTtrade.pwdHolder')}
                                                    onKeyPress={(e) => { this.enterPress(e) }}
                                                />
                                                <p className="trade-box-forget"><Link to="/comm/security/forgetfundpassword">{t('USDTtrade.tradeFwd')} </Link></p>
                                                <p>{this.state.pwdErrorMsg}</p>
                                            </div>
                                        </div>
                                    </NotifyPop>
                                    :
                                    <NotifyPop
                                        // type="primary"comfirmVisible
                                        className="ft-theme-bg-default"
                                        visable={this.state.zjVisible}
                                        width="410"
                                        height="233"
                                        background="#212838"
                                        loading={this.state.pwdLoading}
                                        // confirm={() => { this.setState({ zjVisible: false }) }}
                                        cancel={() => { this.setState({ zjVisible: false }) }}
                                    >
                                        {/* 交易框资金密码提示框 */}
                                        <div className="trade-box-value">
                                            <h5 className="ft-theme-s3">{t('USDTtrade.tradeTs')} </h5>
                                            <div className="trade-box-ts ft-theme-label">
                                                <div className="trade-box-content">{t('USDTtrade.tradeText')} </div>
                                                <Link to="/comm/security/main">{t('USDTtrade.tradeLink')} </Link>
                                            </div>
                                        </div>
                                    </NotifyPop>
                            }
                        </div>
                    )
                }}
            </I18n>
        )
    }
}
