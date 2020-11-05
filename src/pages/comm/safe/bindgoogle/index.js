import React, { Component } from 'react'
import { connect } from 'react-redux'
import { autobind } from 'core-decorators'
import { I18n } from 'react-i18next'
import SafeInput from '@/components/safeInput'
import NotifyPop from '@/components/notifyPop'
import Button from '@/components/button'
import Message from '@/components/message'
import { chooseLang } from '@/assets/js/common'
// import { getUrl } from '@/assets/js/common.js'
import Formsy from 'formsy-react'
import QRCode from 'qrcode.react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import './bindgoogle.scss'

// import ReactDom from 'react-dom';
@connect(state => ({
    apis: state.apis,
    userAuth: state.userAuth,
    getUserAuth: state.getUserAuth,
    lang: state.lang,
}))
class SafeBindGoogle extends Component {
    constructor() {
        super()
        this.state = {
            typeInfo: '',
            disabled: true,
            formVal: '',
            visable: false,
            googleRcode: '',
            googlepath: '',
            loading: false
        }
    }
    componentDidMount() {
        this.bindGoogle()
        this.getGoogleRcode()
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.userAuth && nextProps.userAuth !== this.props.userAuth) {
            this.bindGoogle()
        }
        if (nextProps.lang !== this.props.lang && this.safeForm !== undefined) {
            setTimeout(() => {
                this.safeForm.validateForm()
            }, 20)
        }
    }
    // 判断按钮是否可以点击
    @autobind
    setDisabled(disabled) {
        this.setState({
            disabled
        })
    }
    // 获取谷歌验证二维码
    @autobind
    async getGoogleRcode() {
        try {
            const res = await this.props.apis.googlercode()
            if (res.code === 0) {
                this.setState({
                    googleRcode: res.data.secretkey,
                    googlepath: res.data.qrCodeData.replace(/&amp;/g, '&')
                })
            }
        } catch (e) {
            Message.error(e.message)
        }
    }
    // 点击返回按钮
    @autobind
    handleBack() {
        this.props.history.push('/comm/security/main')
    }
    // 获取表单值
    @autobind
    handleForm(values) {
        this.setState({
            formVal: values
        })
    }
    // 弹窗确定
    @autobind
    handleConfirm() {
        this.setState({
            visable: false
        })
        this.props.history.push('/comm/security/main')
    }
    // 发送验证码
    @autobind
    async sendCode(e) {
        const params = {
            verifyType: e,
            templateType: e,
            // language: this.props.lang === 'zh' ? 1 : 2,
            language: chooseLang(this.props.lang)
        }
        const res = await this.props.apis.sendCode(params)
        if (res.code === 0) {
            return true
        }
        return false
    }
    // 绑定谷歌验证表单提交
    @autobind
    async submit() {
        this.setState({ loading: true })
        let params
        if (this.state.typeInfo === '2') { // 短信验证码
            params = {
                smsCode: this.state.formVal.messagecode,
                googleCode: this.state.formVal.googlecode
            }
        } else if (this.state.typeInfo === '3') { // 邮箱验证码
            params = {
                emailCode: this.state.formVal.emailcode,
                googleCode: this.state.formVal.googlecode
            }
        }
        try {
            const res = await this.props.apis.bindgoogle(params)
            this.setState({ loading: false })
            if (res.code === 0) {
                this.props.dispatch(this.props.getUserAuth())
                this.setState({
                    visable: true,
                })
            }
            // else {
            //     Message.error(res.msg)
            // }
        } catch (e) {
            Message.error(e.message)
        }
    }
    // 判断是否绑定邮箱或手机
    @autobind
    bindGoogle() {
        if (this.props.userAuth && this.props.userAuth.isPhoneAuth !== null && this.props.userAuth.isEmailAuth !== null) {
            if ((this.props.userAuth.isPhoneAuth === true
                && this.props.userAuth.isEmailAuth === true)
                || this.props.userAuth.isPhoneAuth === true) {
                this.setState({
                    typeInfo: '2'
                })
            } else if (this.props.userAuth.isEmailAuth === true) {
                this.setState({
                    typeInfo: '3'
                })
            }
        }
    }
    render() {
        return (
            <I18n>
                {
                    t => (
                        <div>
                            <div className="changelopass-title">{t('safe.bindgoogle')}</div>
                            <p className="safenotice">{t('safe.safeNotice')}</p>
                            <div className="line" />
                            <div className="wrap">
                                <div>
                                    <div className="google">
                                        <span>{t('safe.googleInfo')}</span>
                                        <div className={this.props.lang === 'zh' ? 'googlecode' : 'googlecode googleEn'}>
                                            <QRCode value={this.state.googlepath} style={{ width: '68px', height: '68px', float: 'left' }} />
                                            <div className="word">
                                                {/* <div>{this.state.googleRcode}</div> */}
                                                <div>{this.state.googleRcode}</div>
                                            </div>
                                            <div className="googleline" />
                                            <CopyToClipboard text={this.state.googleRcode} onCopy={() => { Message.success(t('safe.googleCopy')) }}>
                                                <i className="iconfont iconfuzhi1" />
                                            </CopyToClipboard>
                                        </div>
                                    </div>
                                    <p className={this.props.lang === 'zh' ? 'googlep' : 'googlep googlepEn'}>{t('safe.googleText')}</p>
                                    <Formsy
                                        onChange={(values) => { this.handleForm(values) }}
                                        onValidSubmit={this.submit}
                                        onValid={() => { this.setDisabled(false) }}
                                        onInvalid={() => { this.setDisabled(true) }}
                                        ref={(safeForm) => { this.safeForm = safeForm }}
                                    >
                                        {
                                            this.state.typeInfo === '2' ?
                                                <SafeInput
                                                    type="0"
                                                    label={t('safe.messagecode')}
                                                    placeholder={t('safe.messagecodePlaceholder')}
                                                    maxLength="6"
                                                    validations={{
                                                        matchRegexp: /^\d+$/,
                                                        minLength: 6,
                                                        maxLength: 6
                                                    }}
                                                    validationError={t('safe.messagecodePlaceholder')}
                                                    btnState
                                                    sendCode={async () => {
                                                        const r = await this.sendCode('2')
                                                        return r
                                                    }}
                                                    codeKey="messagecode"
                                                    name="messagecode"
                                                    required
                                                    className={this.props.lang === 'zh' ? '' : 'enLabel'}
                                                    classNameInput={this.props.lang === 'zh' ? '' : 'enGoogleInput'}
                                                    classNamError={this.props.lang === 'zh' ? '' : 'enGoogleErrorMsg'}
                                                    classNameBtn="googleBtn"
                                                />
                                                :
                                                null
                                        }
                                        {
                                            this.state.typeInfo === '3' ?
                                                <SafeInput
                                                    type="0"
                                                    label={t('safe.emailcode')}
                                                    placeholder={t('safe.emailcodePlaceholder')}
                                                    maxLength="6"
                                                    validations={{
                                                        matchRegexp: /^\d+$/,
                                                        minLength: 6,
                                                        maxLength: 6
                                                    }}
                                                    validationError={t('safe.emailcodePlaceholder')}
                                                    btnState
                                                    sendCode={async () => {
                                                        const r = await this.sendCode('1')
                                                        return r
                                                    }}
                                                    codeKey="emailcode"
                                                    name="emailcode"
                                                    required
                                                    className={this.props.lang === 'zh' ? '' : 'enLabel'}
                                                    classNameInput={this.props.lang === 'zh' ? '' : 'enGoogleInput'}
                                                    classNamError={this.props.lang === 'zh' ? '' : 'enGoogleErrorMsg'}
                                                    classNameBtn="googleBtn"
                                                />
                                                :
                                                null
                                        }
                                        <SafeInput
                                            type="0"
                                            label={t('safe.googlecode')}
                                            placeholder={t('safe.googlecodePlaceholder')}
                                            maxLength="6"
                                            validations={{
                                                matchRegexp: /^\d+$/,
                                                minLength: 6,
                                                maxLength: 6
                                            }}
                                            validationError={t('safe.googlecodePlaceholder')}
                                            name="googlecode"
                                            required
                                            className={this.props.lang === 'zh' ? '' : 'enLabel'}
                                            classNameInput={this.props.lang === 'zh' ? '' : 'enGoogleInput'}
                                            classNamError={this.props.lang === 'zh' ? '' : 'enGoogleErrorMsg'}
                                        />
                                        <div className={this.props.lang === 'zh' ? 'bindgoogle-btn' : 'bindgoogle-btn enGoogleBtn'}>
                                            <Button style={{ width: '140px', background: '#fff' }} onClick={this.handleBack}>{t('safe.back')}</Button>
                                            <Button type="submit" disabled={this.state.disabled} style={{ width: '140px', marginLeft: '30px' }} theme="primary" loading={this.state.loading} loadMsg={t('safe.confirm')}>{t('safe.confirm')}</Button>
                                        </div>
                                    </Formsy>
                                </div>
                                <div className="googleInfo">
                                    <p>{t('safe.googleInfo1')}</p>
                                    <p>{t('safe.googleInfo2')}</p>
                                    <p>{t('safe.googleInfo3')}</p>
                                </div>
                            </div>
                            <NotifyPop
                                type="primary"
                                visable={this.state.visable}
                                width="400"
                                height="250"
                                confirm={this.handleConfirm}
                            >
                                <div className="success-modal">
                                    <i className="iconfont iconright-1" />
                                    <p>{t('safe.bindSuccess')}</p>
                                </div>
                            </NotifyPop>
                        </div>
                    )
                }
            </I18n>
        )
    }
}
export default SafeBindGoogle

