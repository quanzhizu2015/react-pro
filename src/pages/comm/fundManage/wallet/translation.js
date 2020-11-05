import React, { Component } from 'react'
import Formsy from 'formsy-react'
import { I18n } from 'react-i18next'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
// import securty from '../../../../assets/js/security'
import bigdecimal from 'bigdecimal'

import FundInput from '@/components/fundInput'
import Button from '@/components/button'
import NotifyPop from '@/components/notifyPop'
import Message from '@/components/message'
import { chooseLang, foFixed } from '@/assets/js/common'


function caleNum(data, num) {
    // const r = foFixed(Number(data), num)
    return foFixed(Number(data), num)
}
@connect(state => ({
    userAuth: state.userAuth,
    apis: state.apis,
    lang: state.lang,
}))
export default class Translation extends Component {
    constructor() {
        super()
        this.state = {
            disabled: false,
            loading: false,
            toAddress: null,
            amount: 0,
            recordsData: [],
            resetSend: null,
            fee: 0,
            visable: false
        }
        this.sendCodeHandler = this.sendCodeHandler.bind(this)
        this.withDraw = this.withDraw.bind(this)
    }
    componentWillMount() {
        const { isFundPwdSet, isPhoneAuth, isGoogleAuth } = this.props.userAuth
        if (isFundPwdSet && isPhoneAuth && isGoogleAuth) {
            this.getRecords()
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.lang !== this.props.lang && this.fundForm !== undefined) {
            setTimeout(() => {
                this.fundForm.validateForm()
            }, 20)
        }
    }
    setDisabled(disabled) {
        this.setState({ disabled })
    }
    setAmountFee(amount) {
        const { BigDecimal } = bigdecimal
        const { assetName } = this.props.value
        // const { withdrawFeeRate } = this.props.withdrawal
        const { withdrawFeeRate, minWithdrawFeeStandard, withdrawAmountMaxDecimalPlaces } = this.props.withdrawal.find((element) => (element.assetName === assetName))
        const b = new BigDecimal(withdrawAmountMaxDecimalPlaces)
        const m = Number(amount)
        if (Number(amount) < (Number(minWithdrawFeeStandard) + Number(withdrawAmountMaxDecimalPlaces))) {
            this.setState({
                amount,
                fee: new BigDecimal(minWithdrawFeeStandard).add(new BigDecimal(withdrawAmountMaxDecimalPlaces)).toString()
            })
        } else if (m !== 0 && !isNaN(m)) {
            const feeNext = Number(BigDecimal(amount).multiply(BigDecimal(withdrawFeeRate)).toPlainString()) < Number(minWithdrawFeeStandard) ? Number(minWithdrawFeeStandard) : Number(BigDecimal(amount).multiply(BigDecimal(withdrawFeeRate)).toPlainString()).toFixed(b.scale())
            this.setState({
                amount,
                fee: feeNext
            })
        } else {
            this.setState({
                amount: 0,
                fee: 0
            })
        }
        // /* eslint-disable-next-line */
        // if (m !== 0 && !isNaN(m)) {
        //     this.setState({
        //         amount,
        //         fee: BigDecimal(amount).multiply(BigDecimal(withdrawFeeRate)).toPlainString()
        //     })
        // } else {
        //     this.setState({
        //         amount: 0,
        //         fee: 0
        //     })
        // }
    }
    async getRecords() {
        const { assetId } = this.props.value
        const res = await this.props.apis.recentWithdraw({
            assetId
        })
        if (res.code === 0) {
            this.setState({
                recordsData: res.data
            })
        }
    }
    async sendCodeHandler() {
        try {
            const res = await this.props.apis.sendCode({
                verifyType: 2,
                templateType: 1,
                // language: this.props.lang === 'zh' ? 1 : 2,
                language: chooseLang(this.props.lang)
            })
            if (res.code === 0) return true
        } catch (e) {
            Message.error(e.message)
        }
        return false
    }
    async withDraw(model) {
        if (this.state.loading) {
            return
        }
        const { assetId, assetName } = this.props.value
        const params = {
            assetId,
            assetName,
            toAddress: model.toAddress,
            amount: model.amount instanceof Array ? model.amount[0] : model.amount,
            fee: this.state.fee,
            googleCode: model.googleCode,
            smsCode: model.smsCode,
            // password: securty(1, model.password),
            password: model.password,
            remark: model.remark
        }
        this.setState({
            loading: true
        })
        if (this.props.chain) {
            params.chain = this.props.chain
        }
        try {
            const res = await this.props.apis.withdraw(params)
            if (res.code === 0) {
                if (res.data && res.data.isSuccess) {
                    this.setState({
                        visable: true,
                        resetSend: new Date().getTime()
                    })
                } else {
                    const errMsg = res.data.isVerify ? window.t('fundManage.walletTrans.error19') : window.t('fundManage.walletTrans.error18')
                    Message.error(`${errMsg} ${res.data.amount} ${res.data.assetName}`)
                }
            }
        } catch (e) {
            Message.error(e.message)
        }
        this.setState({
            loading: false
        })
    }
    render() {
        const { BigDecimal } = bigdecimal
        const { userAuth, withdrawal } = this.props
        const { assetName, amount } = this.props.value
        const { withKYCVerifyWithdrawAmount, withoutKYCVerifyWithdrawAmount } = withdrawal.find((element) => (element.assetName === assetName))
        const { minWithdrawFeeStandard, withdrawAmountMaxDecimalPlaces, minWithdrawalAmount } = withdrawal.find((element) => (element.assetName === assetName))
        // const { fee, withVerifyAmount, withoutVerifyAmount } = withdrawal[assetName.toLocaleLowerCase()] || {}
        const { toAddress, recordsData } = this.state
        const records = []
        const minfixed = new BigDecimal(withdrawAmountMaxDecimalPlaces)
        const minfixedOne = new BigDecimal(minWithdrawalAmount)

        const minFee = new BigDecimal(minWithdrawFeeStandard).add(new BigDecimal(withdrawAmountMaxDecimalPlaces)).toString()
        const maxFee = userAuth.cardCheckStatus === 2 ? withKYCVerifyWithdrawAmount : withoutKYCVerifyWithdrawAmount
        if (recordsData.length > 0) {
            if (toAddress) {
                recordsData.forEach((item) => {
                    if ((item.toAddress && item.toAddress.indexOf(toAddress) !== -1) ||
                        (item.remark && item.remark.indexOf(toAddress) !== -1)) {
                        records.push({
                            value: item.toAddress,
                            dropValue: (
                                <div className="fund-drop-item">
                                    {item.toAddress}<span>{item.remark}</span>
                                </div>
                            )
                        })
                    }
                })
            } else {
                recordsData.forEach((item) => {
                    records.push({
                        value: item.toAddress,
                        dropValue: (
                            <div className="fund-drop-item">
                                {item.toAddress}<span>{item.remark}</span>
                            </div>
                        )
                    })
                })
            }
        }

        const errorMsg = []
        if (!userAuth.isFundPwdSet) {
            errorMsg.push('fundManage.walletTrans.error10')
        }
        if (!userAuth.isPhoneAuth) {
            errorMsg.push('fundManage.walletTrans.error11')
        }
        if (!userAuth.isGoogleAuth) {
            errorMsg.push('fundManage.walletTrans.error12')
        }
        if (errorMsg.length !== 0) {
            return (
                <I18n>
                    {
                        t =>
                            (
                                <div className="translation-tips">
                                    <span className="translation-tips-msg">
                                        {t('fundManage.walletTrans.error13')}
                                        {errorMsg.map((item, index) => {
                                            if (index > 0) return `、${t(item)}`
                                            return t(item)
                                        })}
                                    </span><br />
                                    <Link className="ft-link" to="/comm/security/main">{t('fundManage.walletTrans.error14')}</Link>
                                </div>
                            )
                    }
                </I18n>
            )
        }
        if (Number(amount) < Number(minFee)) {
            return (
                <I18n>
                    {
                        t => (
                            <div className="translation-tips translation-tips-middle">
                                <span>{t('fundManage.walletTrans.error15')}{assetName}{t('fundManage.walletTrans.error16')}</span><br />
                            </div>
                        )
                    }
                </I18n>
            )
        }
        // let addressValidate
        // if (assetName === 'BTC' || assetName === 'USDT') {
        //     addressValidate = {
        //         customValid: (values, value) => {
        //             if (!value) {
        //                 return true
        //             }
        //             if (value.length < 27 || value.length > 35) {
        //                 return false
        //             }
        //             return true
        //         }
        //     }
        // } else if (assetName === 'DOGE') {
        //     addressValidate = {
        //         customValid: (values, value) => {
        //             if (!value) {
        //                 return true
        //             }
        //             if (!value.startsWith('D')) {
        //                 return false
        //             }
        //             if (value.length < 29 || value.length > 34) {
        //                 return false
        //             }
        //             return true
        //         }
        //     }
        // } else {
        //     addressValidate = {
        //         customValid: (values, value) => {
        //             if (!value) {
        //                 return true
        //             }
        //             if (!value.startsWith('0x')) {
        //                 return false
        //             }
        //             if (value.length !== 40 && value.length !== 42) {
        //                 return false
        //             }
        //             return true
        //         }
        //     }
        // }
        return (
            <I18n>
                {
                    (t, { i18n }) => {
                        this.t = t
                        const w = i18n.language === 'zh' ? 90 : 200
                        return (
                            <Formsy
                                onValidSubmit={this.withDraw}
                                onChange={(values) => {
                                    this.setAmountFee(values.amount)
                                    this.setState({
                                        toAddress: values.toAddress
                                    })
                                }}
                                ref={(fundForm) => { this.fundForm = fundForm }}
                                onValid={() => { this.setDisabled(false) }}
                                onInvalid={() => { this.setDisabled(true) }}
                                className="wallet-form"
                            >
                                <FundInput
                                    labelWidth={w}
                                    label={t('fundManage.walletTrans.coinType')}
                                    isInput={false}
                                    name="assetName"
                                    value={assetName}
                                />
                                <FundInput
                                    labelWidth={w}
                                    placeholder={t('fundManage.walletTrans.placeholder1')}
                                    label={t('fundManage.walletTrans.getCoin')}
                                    name="toAddress"
                                    records={records}
                                    // validations={addressValidate}
                                    // validationErrors={{
                                    //     customValid: t('fundManage.walletTrans.addressError')
                                    // }}
                                    isSelect
                                    required
                                />
                                <FundInput
                                    placeholder={t('fundManage.walletTrans.placeholder2')}
                                    labelWidth={w}
                                    label={t('fundManage.walletTrans.note')}
                                    name="remark"
                                />
                                <FundInput
                                    placeholder={`${t('fundManage.walletTrans.placeholder3')}${amount}`}
                                    labelWidth={w}
                                    label={t('fundManage.walletTrans.number')}
                                    name="amount"
                                    fixed={minfixed.scale()}
                                    isNumber
                                    validations={{
                                        isNumeric: true,
                                        // isMinFeeB: (values, value) => {
                                        //     const v = caleNum(value)
                                        //     const m = caleNum(minFee)
                                        //     return v % m === 0
                                        // },
                                        amountValidNum: (values, value) => value <= Number(amount),
                                        amountValid: (values, value) => {
                                            let bool = true
                                            if (value < Number(minFee) || value > Number(maxFee)) {
                                                bool = false
                                            }
                                            return bool
                                        }
                                    }}
                                    validationErrors={{
                                        isNumeric: t('fundManage.walletTrans.error4'),
                                        // isMinFeeB: `${t('fundManage.walletTrans.error5')}${minFee}${t('fundManage.walletTrans.error6')}`,
                                        amountValid: `${t('fundManage.walletTrans.error7')}${minfixedOne} ~ ${maxFee}`,
                                        amountValidNum: t('fundManage.walletTrans.error9'),
                                    }}
                                    required
                                />
                                <div className={`translation-numer-tips translation-numer-tips-${this.props.lang}`}>
                                    <div>{t('fundManage.walletTrans.shouxufei')}<span>{this.state.fee}</span></div>
                                    <div>
                                        {t('fundManage.walletTrans.actuallyAcclunt')}
                                        {
                                            caleNum((this.state.amount - this.state.fee), minfixed.scale()) >= 0 ?
                                                <span>{caleNum((this.state.amount - this.state.fee), minfixed.scale())}</span>
                                                :
                                                '--'
                                        }
                                    </div>
                                </div>
                                <FundInput
                                    placeholder={t('fundManage.walletTrans.placeholder4')}
                                    labelWidth={w}
                                    label={t('fundManage.walletTrans.fundPass')}
                                    type="password"
                                    name="password"
                                    linkUrl="/comm/security/forgetfundpassword"
                                    linkText={t('fundManage.walletTrans.forgetPass')}
                                    required
                                />
                                <FundInput
                                    placeholder={t('fundManage.walletTrans.placeholder5')}
                                    labelWidth={w}
                                    codeKey="translation_code_key"
                                    sendCodeHandler={this.sendCodeHandler}
                                    showCode
                                    label={t('fundManage.walletTrans.messageCode')}
                                    resetSend={this.state.resetSend}
                                    name="smsCode"
                                    validations="isLength:6"
                                    maxLength={6}
                                    validationError={t('fundManage.walletTrans.placeholder5')}
                                    required
                                />
                                <FundInput
                                    placeholder={t('fundManage.walletTrans.placeholder6')}
                                    labelWidth={w}
                                    label={t('fundManage.walletTrans.googleCode')}
                                    name="googleCode"
                                    maxLength={6}
                                    validations="isLength:6"
                                    validationError={t('fundManage.walletTrans.placeholder6')}
                                    required
                                />
                                <div className={`wallet-tips wallet-tips-${this.props.lang}`}>
                                    Tips：{t('fundManage.walletTrans.tipInfo8')}{assetName}{t('fundManage.walletTrans.tipInfo9')}<br />
                                    {t('fundManage.walletTrans.tipInfo11')}{t('fundManage.walletTrans.tipInfo3')}<Link to="/comm/fund/history">{t('fundManage.walletTrans.tipInfo4')}</Link>{t('fundManage.walletTrans.tipInfo5')}
                                </div>
                                <div className={`wallet-submit wallet-submit-${this.props.lang}`}>
                                    <Button disabled={this.state.disabled} type="submit" theme="primary">{t('fundManage.walletTrans.mentionCoin')}</Button>
                                </div>
                                <NotifyPop
                                    visable={this.state.visable}
                                    confirm={() => {
                                        this.fundForm.reset()
                                        this.setState({ visable: false })
                                    }}
                                    type="primary"
                                >
                                    <div className="fund-translate-success">
                                        <h3>{t('fundManage.walletTrans.successInfo2')}</h3>
                                        <span>{t('fundManage.walletTrans.successInfo3')}</span>
                                    </div>
                                </NotifyPop>
                            </Formsy>
                        )
                    }
                }
            </I18n>
        )
    }
}
