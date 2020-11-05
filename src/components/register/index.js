import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import Formsy from 'formsy-react'
import cs from 'classnames'
import Message from '@/components/message'
import { I18n } from 'react-i18next'
import qs from 'qs'

import AcInput from '../acInput'
import AcCheckbox from '../acCheckbox'
import AcSelect from '../acSelect'
import Button from '../button'
import NotifyPop from '@/components/notifyPop'
// import securty from '../../assets/js/security'
import { chooseLang } from '@/assets/js/common'
// import CryptoJS from 'crypto-js'
// import base54 from 'crypto-js/enc-base64'
// import sha256 from 'crypto-js/sha256'

import './index.scss'
/*eslint-disable*/
var nc

@withRouter
@connect(state => ({
    apis: state.apis,
    lan: state.lang,
    getUserAuth: state.getUserAuth,
    saveSessionId: state.saveSessionId,
    // userAuth: state.userAuth,
    lang: state.lang,
    helpcenter: state.helpcenter,
}))
export default class Register extends Component {
    constructor() {
        super()
        this.state = {
            // 注册类型 email 注册，mobile 手机注册
            typeTab: 'mobile',
            disabled: true,
            visable: false,
            codeinit: true,
            // emailValidate: true,
            inviteCode: null,
            loading: false,
            zxcvbn: null,
            SessionId: '',
            sig: '',
            token: '',
            scene: 'nc_activity'
        }
        this.tabChange = this.tabChange.bind(this)
        this.setDisabled = this.setDisabled.bind(this)
        this.sendCodeHandler = this.sendCodeHandler.bind(this)
        // this.getBlue = this.getBlue.bind(this)
        this.submit = this.submit.bind(this)
    }
    componentWillMount() {
        const prefixed = qs.parse(this.props.location.search, { ignoreQueryPrefix: true })
        if (prefixed.inviteCode) {
            this.setState({
                inviteCode: prefixed.inviteCode
            })
        }
        this.setZxcvbn()
        // this.state.inviteCode
    }
    componentDidMount() {
        this.init()
    }
    componentWillReceiveProps(nextProps) {
        const { typeTab } = this.state
        const { lang } = this.props
        if (nextProps.lang !== lang) {
            setTimeout(() => {
                if (typeTab === 'email') {
                    this.emailRef.validateForm()
                } else {
                    this.mobileRef.validateForm()
                }
            }, 20)
        }
    }
    setDisabled(disabled) {
        this.setState({
            disabled
        })
    }
    async setZxcvbn() {
        this.setState({
            zxcvbn: (await import('zxcvbn')).default
        })
    }

    init = () => {
        const ncToken = ['FFFF0N000000000084FD', (new Date()).getTime(), Math.random()].join(':')
        const ncOption = {
            // 声明滑动验证需要渲染的目标元素ID。
            renderTo: '#validation',
            // 应用类型标识。它和使用场景标识（scene字段）一起决定了滑动验证的业务场景与后端对应使用的策略模型。您可以在人机验证控制台的配置管理页签找到对应的appkey字段值，请务必正确填写。
            appkey: 'FFFF0N000000000084FD',
            // 使用场景标识。它和应用类型标识（appkey字段）一起决定了滑动验证的业务场景与后端对应使用的策略模型。您可以在人机验证控制台的配置管理页签找到对应的scene值，请务必正确填写。
            scene: 'nc_activity',
            // 滑动验证码的主键，请勿将该字段定义为固定值。确保每个用户每次打开页面时，其token值都是不同的。系统默认的格式为：”您的appkey”+”时间戳”+”随机数”。
            token: ncToken,
            // 滑动条的宽度。
            customWidth: 352,
            // 业务键字段，可为空。为便于线上问题的排查，建议您按照线上问题定位文档中推荐的方法配置该字段值。
            trans: { key1: 'code200' },
            // 通过Dom的ID属性自动填写trans业务键，可为空。建议您按照线上问题定位文档中推荐的方法配置该字段值。
            elementID: ['usernameID'],
            // 是否自定义配置底层采集组件。如无特殊场景，请使用默认值（0），即不自定义配置底层采集组件。
            is_Opt: 0,
            // 语言。PC端Web页面场景默认支持18国语言，详细配置方法请参见自定义文案与多语言文档。
            language: 'cn',
            // 是否启用。一般情况，保持默认值（true）即可。
            isEnabled: true,
            // 内部网络请求的超时时间。一般情况建议保持默认值（3000ms）。
            timeout: 3000,
            // 允许服务器超时重复次数，默认5次。超过重复次数后将触发报错。
            times: 5,
            // 用于自定义滑动验证各项请求的接口地址。一般情况，请勿配置该参数。
            apimap: {
                // 'analyze': '//a.com/nocaptcha/analyze.jsonp',
                // 'get_captcha': '//b.com/get_captcha/ver3',
                // 'get_captcha': '//pin3.aliyun.com/get_captcha/ver3',
                // 'get_img': '//c.com/get_img',
                // 'checkcode': '//d.com/captcha/checkcode.jsonp',
                // 'umid_Url': '//e.com/security/umscript/3.2.1/um.js',
                // 'uab_Url': '//aeu.alicdn.com/js/uac/909.js',
                // 'umid_serUrl': 'https://g.com/service/um.json'
            },
            // 前端滑动验证通过时会触发该回调参数。您可以在该回调参数中将请求标识（token）、会话ID（sessionid）、签名串（sig）字段记录下来，随业务请求一同发送至您的服务端调用验签。
            callback: (data) => {
                this.setState({
                    SessionId: data.csessionid,
                    sig: data.sig,
                    token: data.token,
                    scene: 'nc_activity'
                })
            }
        }
        if (nc) {
            nc.reload()
        } else {
            nc = new noCaptcha(ncOption)
            // 用于自定义文案。详细配置方法请参见自定义文案与多语言文档。
            nc.upLang('cn', {
                _startTEXT: '请按住滑块，拖动到最右边',
                _yesTEXT: '验证通过',
                _error300: '哎呀，出错了，点击<a href=\"javascript:__nc.reload()\">刷新</a>再来一次',
                _errorNetwork: '网络不给力，请<a href=\"javascript:__nc.reload()\">点击刷新</a>'
            })
        }
    }
    tabChange(typeTab) {
        this.setState({
            typeTab,
            codeinit: true
        })
        nc.reload()
        if (typeTab === 'email') {
            this.emailRef.validateForm()
            setTimeout(() => {
                this.emailInput.textInput.focus()
            }, 20)
        } else {
            this.mobileRef.validateForm()
            setTimeout(() => {
                this.mobileInput.textInput.focus()
            }, 20)
        }
    }
    async sendCodeHandler() {
        const { phone, country } = this.mobileRef.getModel()
        const { email } = this.emailRef.getModel()
        let params
        let res
        if (this.state.typeTab === 'email') {
            if (!this.email.isValid()) {
                return false
            }
            params = {
                email,
                type: 1,
                // language: this.props.lan === 'zh' ? 1 : 2,
                language: chooseLang(this.props.lang)
            }
            res = await this.props.apis.sendEmailcode(params)
        } else if (this.state.typeTab === 'mobile') {
            if (!this.phone.isValid()) {
                return false
            }
            // if (this.props.lan === 'zh') {
            //     params.language = 1
            // } else {
            //     params.language = 2
            // }
            params = {
                phone,
                type: 0,
                phoneCountryCode: country.code,
                language: chooseLang(this.props.lang)
            }
            res = await this.props.apis.sendphonecode(params)
        }
        if (res.code === 0) {
            // Message.success('send success')
            return true
        }
        return false
    }
    async submit(model) {
        const {
            SessionId,
            sig,
            token,
            scene,
        } = this.state
        if (SessionId && sig && token) {
            const params = {}
            const headerParams = {
                  sessionId: SessionId,
                  sig,
                  afsToken: token,
                  scene
            }
            params.headerParams = headerParams
            let z
            const keys = Object.keys(model)
            keys.forEach((key) => {
                if (key === 'country') {
                    params.country = model[key].code
                    params.countryKey = model[key].key
                } else {
                    params[key] = model[key]
                }
            })
            // if (this.props.lan === 'zh') {
            //     params.language = 1
            // } else {
            //     params.language = 2
            // }
            params.language = chooseLang(this.props.lang)
            if (this.state.typeTab === 'email') {
                params.type = 1
            } else {
                params.type = 0
            }
            if (this.state.zxcvbn) {
                z = this.state.zxcvbn(params.pwd || '')
            }
            params.passwdSecurityLevel = (z && z.score) ? z.score : 0
            // const salt = `abc${params.pwd}`
            // const secret = sha256(salt)
            // params.pwd = base54.stringify(secret)
            // params.pwd = securty(0, params.pwd)
            // const saltrepwd = `abc${params.repwd}`
            // const secretrepwd = sha256(saltrepwd)
            // params.repwd = base54.stringify(secretrepwd)
            // params.repwd = securty(0, params.repwd)
            try {
                this.setState({
                    loading: true
                })
                const res = await this.props.apis.regist(params)
                this.setState({
                    loading: false
                })
                if (res.code === 0) {
                    this.setState({
                        visable: true,
                    })
                    localStorage.sessionId = res.data.sessionId
                    await this.props.dispatch(this.props.saveSessionId(res.data.sessionId))
                }
            } catch (e) {
                this.setState({
                    loading: false
                })
                Message.error(e.message)
            }
        } else {
            Message.warning('请进行滑动验证')
        }
        
    }
    registerByEmail() {
        const { t } = this
        const { typeTab, SessionId  } = this.state
        // const { typeTab, emailValidate } = this.state
        let codeDisabled = true
        if (this.email) codeDisabled = !this.email.isValid()
        // let inputDisabled
        // if (this.state.inviteCode) {
        //     inputDisabled = true
        // } else {
        //     inputDisabled = false
        // }
        return (
            <Formsy
                ref={(ref) => { this.emailRef = ref }}
                className={cs({
                    'ac-form': true,
                    'ft-hide': typeTab !== 'email'
                })}
                onValidSubmit={this.submit}
                // onChange={this.getBlue}
                onValid={() => { this.setDisabled(false) }}
                onInvalid={() => { this.setDisabled(true) }}
            >
                <AcInput
                    ref={(email) => { this.email = email }}
                    innerRef={(ref) => { this.emailInput = ref }}
                    icon="iconyouxiang"
                    placeholder={t('logReg.emailHolder')}
                    name="email"
                    validations={{
                        isEmail: true,
                        // accountValidate: () => emailValidate
                    }}
                    validationErrors={{
                        isEmail: t('logReg.emailError'),
                        // accountValidate: '账号已存在'
                    }}
                    initFocus
                    required
                />
                <AcInput
                    icon="iconyanzhengma"
                    showCode={this.state.codeinit}
                    sendCodeHandler={this.sendCodeHandler}
                    codeDisabled={codeDisabled}
                    codeKey="registerEmail"
                    placeholder={t('logReg.capchaHolder')}
                    name="capcha"
                    maxLength={6}
                    validations="isLength:6"
                    validationError={t('logReg.capchaHolder')}
                    required
                />
                <AcInput
                    icon="iconmima"
                    showProgress
                    placeholder={t('logReg.regPwdHolder')}
                    type="password"
                    name="pwd"
                    maxLength={32}
                    validations="minLength:6,maxLength:32"
                    validationError={t('logReg.pwdError')}
                    required
                />
                <AcInput
                    icon="iconmima"
                    placeholder={t('logReg.rePwdHolder')}
                    type="password"
                    name="repwd"
                    maxLength={32}
                    validations="equalsField:pwd"
                    validationError={t('logReg.rePwdError')}
                    required
                />
                <AcInput
                    icon="iconyaoqing"
                    placeholder={t('logReg.codeHolder')}
                    value={this.state.inviteCode}
                    name="invitationCode"
                    validations="isLength:6"
                    validationError={t('logReg.codeError')}
                    maxLength={6}
                    // inputDisabled={inputDisabled}
                />
                <AcCheckbox value={false} name="agreeServiceRule" validations="isTrue" className="register-clause">
                    {t('logReg.agreeLabel')}{' '}
                    {/* FUNCOIN */}
                    {/* <Link to={`${this.props.lang === 'zh' ? 'https://funcoinsupport.zendesk.com/hc/zh-cn/articles/360023773053-%E4%BD%BF%E7%94%A8%E6%9D%A1%E6%AC%BE' : 'https://funcoinsupport.zendesk.com/hc/zh-cn/articles/360023773053-%E4%BD%BF%E7%94%A8%E6%9D%A1%E6%AC%BE'}`} target="_blank" rel="noopener noreferrer" className="ft-link">{t('logReg.label1')}</Link>{' '} */}
                    {/* OAK */}
                    <Link to={`${this.props.lang === 'zh' ? 'https://goodtoken.zendesk.com/hc/zh-cn/articles/360035127614-GoodToken%E4%BD%BF%E7%94%A8%E5%8D%8F%E8%AE%AE' : 'https://goodtoken.zendesk.com/hc/zh-cn/articles/360035127614-GoodToken%E4%BD%BF%E7%94%A8%E5%8D%8F%E8%AE%AE'}`} target="_blank" rel="noopener noreferrer" className="ft-link">{t('logReg.label1')}</Link>{' '}
                    {/* FUNCOIN */}
                    {/* <Link to={`${this.props.lang === 'zh' ? 'https://funcoinsupport.zendesk.com/hc/zh-cn/articles/360023770633-%E9%9A%90%E7%A7%81%E6%9D%A1%E6%AC%BE' : 'https://funcoinsupport.zendesk.com/hc/zh-cn/articles/360023770633-%E9%9A%90%E7%A7%81%E6%9D%A1%E6%AC%BE'}`} target="_blank" rel="noopener noreferrer" className="ft-link">{t('logReg.label3')}</Link> */}
                    {/* OAK */}
                    <Link to={`${this.props.lang === 'zh' ? 'https://goodtoken.zendesk.com/hc/zh-cn/articles/360035127054-%E9%9A%90%E7%A7%81%E7%94%B3%E6%98%8E' : 'https://goodtoken.zendesk.com/hc/zh-cn/articles/360035127054-%E9%9A%90%E7%A7%81%E7%94%B3%E6%98%8E'}`} target="_blank" rel="noopener noreferrer" className="ft-link">{t('logReg.label3')}</Link>
                </AcCheckbox>
                <Button loadMsg={t('logReg.registering')} loading={this.state.loading} type="submit" disabled={this.state.disabled || !SessionId} theme="primary" className="ac-submit login-submit">{t('logReg.register')}</Button>
            </Formsy>
        )
    }
    registerByMobole() {
        const { t } = this
        const { typeTab, SessionId } = this.state
        let codeDisabled = true
        if (this.phone) codeDisabled = !this.phone.isValid()
        // let inputDisabled
        // if (this.state.inviteCode) {
        //     inputDisabled = true
        // } else {
        //     inputDisabled = false
        // }
        return (
            <Formsy
                onValidSubmit={this.submit}
                ref={(ref) => { this.mobileRef = ref }}
                className={cs({
                    'ac-form': true,
                    'ft-hide': typeTab !== 'mobile'
                })}
                // onChange={(values) => { this.phone = `${values.country.code} ${values.phone}` }}
                onValid={() => { this.setDisabled(false) }}
                onInvalid={() => { this.setDisabled(true) }}
            >
                <div className="ac-selectbox">
                    <AcSelect
                        icon="iconshouji"
                        placeholder={t('logReg.internationalHolder')}
                        name="country"
                        validationError={t('logReg.internationalError')}
                        required
                    />
                    <AcInput
                        ref={(phone) => { this.phone = phone }}
                        innerRef={(ref) => { this.mobileInput = ref }}
                        placeholder={t('logReg.mobileHolder')}
                        name="phone"
                        refname="phone"
                        maxLength={20}
                        validations={{
                            matchRegexp: /^\d+$/,
                            minLength: 3,
                            maxLength: 20
                        }}
                        validationError={t('logReg.mobileError')}
                        required
                        inputStyle={{ paddingLeft: '20px' }}
                    />
                </div>
                <AcInput
                    icon="iconyanzhengma"
                    showCode={this.state.codeinit}
                    sendCodeHandler={this.sendCodeHandler}
                    codeDisabled={codeDisabled}
                    codeKey="registerMobile"
                    placeholder={t('logReg.msgHolder')}
                    name="capcha"
                    maxLength={6}
                    validations="isLength:6"
                    validationError={t('logReg.msgError')}
                    required
                />
                <AcInput
                    icon="iconmima"
                    showProgress
                    placeholder={t('logReg.regPwdHolder')}
                    type="password"
                    name="pwd"
                    maxLength={32}
                    validations="minLength:6,maxLength:32"
                    validationError={t('logReg.pwdError')}
                    required
                />
                <AcInput
                    icon="iconmima"
                    placeholder={t('logReg.rePwdHolder')}
                    type="password"
                    name="repwd"
                    maxLength={32}
                    validations="equalsField:pwd"
                    validationError={t('logReg.rePwdError')}
                    required
                />
                <AcInput
                    icon="iconyaoqing"
                    placeholder={t('logReg.codeHolder')}
                    value={this.state.inviteCode}
                    name="invitationCode"
                    validations="isLength:6"
                    validationError={t('logReg.codeError')}
                    maxLength={6}
                    // inputDisabled={inputDisabled}
                />
                <AcCheckbox
                    value={false}
                    name="agreeServiceRule"
                    validations="isTrue"
                    className="register-clause"
                >
                    {t('logReg.agreeLabel')}{' '}
                    <Link to={`${this.props.lang === 'zh' ? 'https://goodtoken.zendesk.com/hc/zh-cn/articles/360035127614-GoodToken使用协议' : 'https://goodtoken.zendesk.com/hc/zh-cn/articles/360035127614-GoodToken使用协议'}`} target="_blank" rel="noopener noreferrer" className="ft-link">{t('logReg.label1')}</Link>{' '}
                    {/* <Link to={`${this.props.helpcenter}${this.props.lang === 'zh' ? 'zh-cn/articles/360012970633-%E5%85%8D%E8%B4%A3%E5%A3%B0%E6%98%8E' : 'en-us/articles/360012967933-Disclaimer'}`} target="_blank" rel="noopener noreferrer" className="ft-link">{t('logReg.label2')}</Link>{' '} */}
                    <Link to={`${this.props.lang === 'zh' ? 'https://goodtoken.zendesk.com/hc/zh-cn/articles/360035127054-%E9%9A%90%E7%A7%81%E7%94%B3%E6%98%8E' : 'https://goodtoken.zendesk.com/hc/zh-cn/articles/360035127054-%E9%9A%90%E7%A7%81%E7%94%B3%E6%98%8E'}`} target="_blank" rel="noopener noreferrer" className="ft-link">{t('logReg.label3')}</Link>
                </AcCheckbox>
                <Button loadMsg={t('logReg.registering')} loading={this.state.loading} type="submit" disabled={this.state.disabled || !SessionId} theme="primary" className="ac-submit login-submit">{t('logReg.register')}</Button>
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
                            <div className="register">
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
                                {this.registerByMobole()}
                                {this.registerByEmail()}
                                <div
                                    id="validation"
                                    className="nc-container"
                                />
                                <NotifyPop
                                    visable={this.state.visable}
                                    confirm={async () => {
                                        await this.props.dispatch(this.props.getUserAuth())
                                        this.setState({
                                            visable: false
                                        })
                                        if (localStorage.pathName === '/invite') {
                                            this.props.history.push('/invite')
                                        } else {
                                            this.props.history.push('/home')
                                        }
                                        // if (!this.props.userAuth.isFutureTradeAuth) {
                                        //     this.props.history.push('/common/futures')
                                        // } else {
                                        //     this.props.history.push('/comm/fund/wallet')
                                        // }
                                    }}
                                    type="primary"
                                >
                                    <div className="ft-dialog-success">
                                        <h3>{t('logReg.registerSuccess')}</h3>
                                        <span>{t('logReg.backBtn')}</span>
                                    </div>
                                </NotifyPop>
                            </div>
                        )
                    }
                }
            </I18n>
        )
    }
}
