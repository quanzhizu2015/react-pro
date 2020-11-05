import React, { Component } from 'react'
import { connect } from 'react-redux'
import Formsy from 'formsy-react'
import { I18n } from 'react-i18next'
import Message from '@/components/message'
import SafeInput from '@/components/safeInput'
import NotifyPop from '@/components/notifyPop'
import { chooseLang } from '@/assets/js/common'
// import getUrl from '@/assets/js/common.js'
import Button from '@/components/button'
import './forgetpass.scss'
// import securty from '../../../../assets/js/security'
// import base64 from 'crypto-js/enc-base64'
// // import Base64 from 'crypto-js/enc-base64'
// import sha256 from 'crypto-js/sha256'

// import ReactDom from 'react-dom';
@connect(state => ({
    apis: state.apis,
    userAuth: state.userAuth,
    getUserAuth: state.getUserAuth,
    lang: state.lang,
}))
class SafeForgetPass extends Component {
    constructor() {
        super()
        this.state = {
            disabled: true,
            formVal: '',
            visable: false,
            loading: false
        }
        this.handleBack = this.handleBack.bind(this)
        this.sendCode = this.sendCode.bind(this)
        this.handleForm = this.handleForm.bind(this)
        this.submit = this.submit.bind(this)
        this.handleConfirm = this.handleConfirm.bind(this)
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.lang !== this.props.lang && this.safeForm !== undefined) {
            setTimeout(() => {
                this.safeForm.validateForm()
            }, 20)
        }
    }
    // 判断按钮是否可以点击
    setDisabled(disabled) {
        this.setState({
            disabled
        })
    }
    // 点击返回
    handleBack() {
        this.props.history.push('/comm/security/main')
    }
    // 获取表单值
    handleForm(values) {
        this.setState({
            formVal: values
        })
    }
    // 弹窗确定
    handleConfirm() {
        this.setState({
            visable: false
        })
        this.props.history.push('/comm/security/main')
    }
    // 发送验证码
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
    // 忘记资金密码表单提交
    async submit() {
        this.setState({ loading: true })
        // const secretpwd = sha256(`123${this.state.formVal.pass}`)
        // const newpwd = securty(1, this.state.formVal.pass)
        // const newpwd = this.state.formVal.pass
        // console.log(this.state.formVal.passwd, this.state.formVal.passconfirm)
        // const secretrepwd = sha256(`123${this.state.formVal.passconfirm}`)
        // const newrepwd = securty(1, this.state.formVal.passconfirm)
        // const newrepwd = this.state.formVal.passconfirm
        const {
            passconfirm,
            emailcode,
            googlecode,
            messagecode,
        } = this.state.formVal
        const params = {
            pwd: passconfirm, // 新密码
            repwd: passconfirm, // 确认新密码
            emailCode: emailcode, // 邮箱验证码
            googleCode: googlecode, // 谷歌验证码
            phoneCode: messagecode,
        }
        try {
            const res = await this.props.apis.forgetfundpass(params)
            this.setState({ loading: false })
            if (res.code === 0) {
                this.setState({
                    visable: true
                })
                this.props.dispatch(this.props.getUserAuth())
            }
        } catch (e) {
            Message.error(e.message)
        }
    }
    render() {
        const { userAuth } = this.props
        return (
            <I18n>
                {
                    t => (
                        <div className="forgetpass-wrap">
                            <div className="forgetpass-title">{t('safe.forgetpass')}</div>
                            <div className="line" />
                            <div className="forgetpass-fromWrap">
                                <Formsy
                                    onChange={(values) => { this.handleForm(values) }}
                                    onValidSubmit={this.submit}
                                    onValid={() => { this.setDisabled(false) }}
                                    onInvalid={() => { this.setDisabled(true) }}
                                    ref={(safeForm) => { this.safeForm = safeForm }}
                                >
                                    <SafeInput
                                        type="1"
                                        label={t('safe.newpass')}
                                        placeholder={t('safe.newpassPlaceholder')}
                                        name="pass"
                                        maxLength="32"
                                        validations="minLength:6,maxLength:32"
                                        validationError={t('safe.passError')}
                                        required
                                        className={this.props.lang === 'zh' ? '' : 'enLabel'}
                                        classNameInput={this.props.lang === 'zh' ? '' : 'enInput'}
                                    />
                                    <SafeInput
                                        type="1"
                                        label={t('safe.confirmNewPass')}
                                        placeholder={t('safe.confirmNewPassPlaceholder')}
                                        name="passconfirm"
                                        maxLength="32"
                                        validations="equalsField:pass"
                                        validationError={t('safe.passError2')}
                                        required
                                        className={this.props.lang === 'zh' ? '' : 'enLabel'}
                                        classNameInput={this.props.lang === 'zh' ? '' : 'enInput'}
                                    />
                                    {
                                        userAuth && userAuth.isPhoneAuth ?
                                            <SafeInput
                                                type="0"
                                                label={t('safe.messagecode')}
                                                placeholder={t('safe.messagecodePlaceholder')}
                                                maxLength={6}
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
                                                classNameInput={this.props.lang === 'zh' ? '' : 'enInput'}
                                            />
                                            :
                                            null
                                    }
                                    {
                                        userAuth && userAuth.isEmailAuth ?
                                            <SafeInput
                                                type="0"
                                                label={t('safe.emailcode')}
                                                placeholder={t('safe.emailcodePlaceholder')}
                                                maxLength={6}
                                                validations={{
                                                    matchRegexp: /^\d+$/,
                                                    minLength: 6,
                                                    maxLength: 6
                                                }}
                                                validationError={t('safe.emailcodePlaceholder')}
                                                sendCode={async () => {
                                                    const r = await this.sendCode('1')
                                                    return r
                                                }}
                                                codeKey="mailcode"
                                                btnState
                                                required
                                                name="emailcode"
                                                className={this.props.lang === 'zh' ? '' : 'enLabel'}
                                                classNameInput={this.props.lang === 'zh' ? '' : 'enInput'}
                                            />
                                            :
                                            null
                                    }
                                    {
                                        userAuth && userAuth.isGoogleAuth ?
                                            <SafeInput
                                                type="0"
                                                label={t('safe.googlecode')}
                                                placeholder={t('safe.googlecodePlaceholder')}
                                                maxLength={6}
                                                validations={{
                                                    matchRegexp: /^\d+$/,
                                                    minLength: 6,
                                                    maxLength: 6
                                                }}
                                                validationError={t('safe.googlecodePlaceholder')}
                                                name="googlecode"
                                                required
                                                className={this.props.lang === 'zh' ? '' : 'enLabel'}
                                                classNameInput={this.props.lang === 'zh' ? '' : 'enInput'}
                                            />
                                            :
                                            null
                                    }
                                    <div className={this.props.lang === 'zh' ? 'changelopass-btn' : 'changelopass-btn enBtn'}>
                                        <Button style={{ width: '140px', background: '#fff' }} onClick={this.handleBack}>{t('safe.back')}</Button>
                                        <Button type="submit" disabled={this.state.disabled} style={{ width: '140px', marginLeft: '30px' }} theme="primary" loading={this.state.loading} loadMsg={t('safe.confirm')}>{t('safe.confirm')}</Button>
                                    </div>
                                </Formsy>
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
                                    <p>{t('safe.modifySuccess')}</p>
                                </div>
                            </NotifyPop>
                        </div>
                    )
                }
            </I18n>
        )
    }
}
export default SafeForgetPass

