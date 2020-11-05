import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import Formsy from 'formsy-react'
import Message from '@/components/message'
import cs from 'classnames'
import { I18n } from 'react-i18next'
import qs from 'qs'
// import securty from '../../assets/js/security'
// import CryptoJS from 'crypto-js'
// import base64 from 'crypto-js/enc-base64'
// import sha256 from 'crypto-js/sha256'
import { chooseLang } from '@/assets/js/common'

import AcInput from '../acInput'
import Button from '../button'

import './index.scss'
@withRouter
@connect(state => ({
    apis: state.apis,
    getUserAuth: state.getUserAuth,
    // userAuth: state.userAuth,
    saveSessionId: state.saveSessionId,
    wsObj: state.wsObj,
    sendWs: state.sendWs,
    lang: state.lang
}))
export default class Login extends Component {
    constructor() {
        super()
        this.state = {
            typeTab: !localStorage.loginType || localStorage.loginType === '1' ? 'mobile' : 'email',
            loading: false,
            account: localStorage.account,
            loginType: localStorage.loginType,
            disabled: false
        }
        this.setDisabled = this.setDisabled.bind(this)
        this.login = this.login.bind(this)
    }
    componentDidMount() {
        // 网页记住密码校验
        setTimeout(() => {
            if (this.state.typeTab === 'email') {
                this.emailForm.validateForm()
            } else {
                this.mobileForm.validateForm()
            }
        }, 300)
    }
    componentWillReceiveProps(nextProps) {
        const { typeTab } = this.state
        const { lang } = this.props
        if (nextProps.lang !== lang) {
            setTimeout(() => {
                if (typeTab === 'email') {
                    this.emailForm.validateForm()
                } else {
                    this.mobileForm.validateForm()
                }
            }, 20)
        }
    }
    setDisabled(disabled) {
        this.setState({
            disabled
        })
    }
    tabChange(typeTab) {
        this.setState({
            typeTab
        })
        if (typeTab === 'email') {
            this.emailForm.validateForm()
            setTimeout(() => {
                this.emailRef.textInput.focus()
            }, 20)
            // this
        } else {
            this.mobileForm.validateForm()
            setTimeout(() => {
                this.mobileRef.textInput.focus()
            }, 20)
        }
    }
    async login(model) {
        if (this.state.loading) {
            return
        }
        this.setState({
            loading: true
        })
        const params = {}
        const keys = Object.keys(model)
        keys.forEach((key) => {
            params[key] = model[key]
        })
        if (this.state.typeTab === 'email') {
            params.type = 1
        } else {
            params.type = 0
        }
        // if (this.props.lang === 'zh') {
        //     params.language = 1 // 中文
        // } else {
        //     params.language = 2 // 英文
        // }
        params.language = chooseLang(this.props.lang)
        // const salt = `abc${params.pwd}`
        // const secret = sha256(salt)
        // params.pwd = base64.stringify(secret)
        // params.pwd = securty(0, params.pwd)
        try {
            const res = await this.props.apis.login(params)
            if (res.code === 0) {
                if (this.state.typeTab === 'email') {
                    localStorage.account = model.email
                    localStorage.loginType = 0
                } else {
                    localStorage.account = model.phone
                    localStorage.loginType = 1
                }
                if (res.data === 'IS_GOOGLE_LOGIN') {
                    this.props.history.push('/common/verification')
                    return
                }
                localStorage.sessionId = res.data.sessionId
                await this.props.dispatch(this.props.saveSessionId(res.data.sessionId))
                const paramAry = {
                    reqType: -4,
                    sessionId: res.data.sessionId
                }
                await this.props.dispatch(this.props.sendWs(this.props.wsObj, JSON.stringify(paramAry)))
                await this.props.dispatch(this.props.getUserAuth())
                this.setState({
                    loading: false
                })
                // if (this.props.userAuth) {
                //     // 开通合约交易，开始订阅保证金爆仓消息
                //     const param = {
                //         reqType: 1
                //     }
                //     // debugger
                //     this.props.dispatch(this.props.sendBondWs(JSON.stringify(param)))
                // }
                const param = qs.parse(this.props.location.search, { ignoreQueryPrefix: true })
                if (param.backUrl) {
                    this.props.history.push(param.backUrl)
                }
                if (param.hrefLink) {
                    window.location.href = param.hrefLink
                }
                if (localStorage.pathName === '/common/login' || localStorage.pathName === '/common/register' || localStorage.pathName === '/common/register' || localStorage.pathName === '/common/forgotpassword' || localStorage.pathName === '/login' || localStorage.pathName === undefined) {
                    // debugger
                    this.props.history.push('/home')
                }
                //  else {
                //     history.back()
                // }
                if (!param.backUrl && !param.hrefLink) {
                    const pathUrl = localStorage.pathName
                    if (pathUrl) {
                        // // if (pathUrl.startsWith('/common/futures') && this.props.userAuth.isFutureTradeAuth) { // 去除合约答题
                        // if (pathUrl.startsWith('/common/futures')) { // 去除合约答题
                        //     // this.props.history.push('/trade/futures')
                        // } else
                        if (pathUrl === '/common/login' || pathUrl === '/common/register' || pathUrl === '/common/register' || pathUrl === '/common/forgotpassword' || pathUrl === '/common/verification' || pathUrl === '/login') {
                            this.props.history.push('/home')
                        } else {
                            this.props.history.push(pathUrl)
                            // history.back()
                        }
                    } else {
                        this.props.history.push('/home')
                    }
                }
            } else {
                this.setState({
                    loading: false
                })
            }
        } catch (e) {
            this.setState({
                loading: false
            })
            Message.error(e.message)
        }
    }
    loginByEmail() {
        const { t } = this
        let email
        const { account, loginType, typeTab } = this.state
        if (loginType === '0') email = account
        return (
            <Formsy
                key="email"
                ref={(ref) => {
                    this.emailForm = ref
                }}
                onValidSubmit={this.login}
                onValid={() => { this.setDisabled(false) }}
                onInvalid={() => { this.setDisabled(true) }}
                className={cs({
                    'ac-form': true,
                    'ft-hide': typeTab !== 'email'
                })}
            >
                <AcInput
                    icon="iconyouxiang"
                    placeholder={t('logReg.emailHolder')}
                    name="email"
                    validations="isEmail"
                    initFocus={!localStorage.loginType || localStorage.loginType === '0'}
                    value={email}
                    validationError={t('logReg.emailError')}
                    innerRef={(ref) => { this.emailRef = ref }}
                    required
                />
                <AcInput
                    icon="iconmima"
                    placeholder={t('logReg.pwdHolder')}
                    type="password"
                    name="pwd"
                    minLength="6"
                    maxLength="32"
                    validations="minLength:6,maxLength:32"
                    validationError={t('logReg.pwdError')}
                    required
                />
                <Button loadMsg={t('logReg.logining')} loading={this.state.loading} type="submit" disabled={this.state.disabled} theme="primary" className="ac-submit login-submit">{t('logReg.login')}</Button>
                <div className="ac-form-bottom">
                    <div className="ac-form-bottom-left">
                        {/* {t('logReg.noAccount')} */}
                        <Link className="ft-link" to={this.props.registerHref ? this.props.registerHref : 'register'}>{t('logReg.register')}</Link>
                    </div>
                    <div className="ac-form-bottom-right">
                        <Link className="ft-link" to={this.props.forgetHref ? this.props.forgetHref : 'forgotpassword'}>{t('logReg.fPwd')}</Link>
                    </div>
                </div>
            </Formsy>
        )
    }
    loginByMobole() {
        const { t } = this
        let mobile
        const { account, loginType, typeTab } = this.state
        if (loginType === '1') mobile = account
        return (
            <Formsy
                key="mobile"
                ref={(ref) => {
                    this.mobileForm = ref
                }}
                onValidSubmit={this.login}
                onValid={() => { this.setDisabled(false) }}
                onInvalid={() => { this.setDisabled(true) }}
                className={cs({
                    'ac-form': true,
                    'ft-hide': typeTab !== 'mobile'
                })}
            >
                <AcInput
                    icon="iconshouji"
                    placeholder={t('logReg.mobileHolder')}
                    name="phone"
                    initFocus={localStorage.loginType === '1'}
                    minLength="6"
                    maxLength="20"
                    value={mobile}
                    validations={{ matchRegexp: /^[0-9]+$/ }}
                    validationError={t('logReg.mobileError')}
                    innerRef={(ref) => { this.mobileRef = ref }}
                    required
                />
                <AcInput
                    icon="iconmima"
                    placeholder={t('logReg.pwdHolder')}
                    type="password"
                    name="pwd"
                    minLength="6"
                    maxLength="32"
                    validations="minLength:6,maxLength:32"
                    validationError={t('logReg.pwdError')}
                    required
                />
                <Button loadMsg={t('logReg.logining')} loading={this.state.loading} type="submit" disabled={this.state.disabled} theme="primary" className="ac-submit login-submit">{t('logReg.login')}</Button>
                <div className="ac-form-bottom">
                    <div className="ac-form-bottom-left">
                        {/* {t('logReg.noAccount')} */}
                        <Link className="ft-link" to={this.props.registerHref ? this.props.registerHref : 'register'}>{t('logReg.register')}</Link>
                    </div>
                    <div className="ac-form-bottom-right">
                        <Link className="ft-link" to={this.props.forgetHref ? this.props.forgetHref : 'forgotpassword'}>{t('logReg.fPwd')}</Link>
                    </div>
                </div>
            </Formsy>
        )
    }
    render() {
        const tabActive = {
            [this.state.typeTab]: 'active'
        }
        return (
            <I18n>
                {
                    (t) => {
                        this.t = t
                        return (
                            <div className="login">
                                <div className="ac-title">
                                    Welcome to <span className="ft-bold">GoodToken</span><br />
                                    {/* 切换登录文案 */}
                                    {/* <p className="ac-title-desc">Exchange the Future</p> */}
                                    {/* <p className="ac-title-desc">{t('logReg.modeleMatch')}</p> */}
                                </div>
                                <div className="ac-tab">
                                    <div className={cs('ac-tab-item', tabActive.mobile)}>
                                        <a onClick={() => { this.tabChange('mobile') }}>{t('logReg.mobile')}</a>
                                    </div>
                                    <div className={cs('ac-tab-item', tabActive.email)}>
                                        <a onClick={() => { this.tabChange('email') }}>{t('logReg.email')}</a>
                                    </div>
                                </div>
                                {this.loginByEmail()}
                                {this.loginByMobole()}
                            </div>
                        )
                    }
                }
            </I18n>
        )
    }
}
