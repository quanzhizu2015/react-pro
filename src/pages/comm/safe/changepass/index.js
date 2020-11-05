import React, { Component } from 'react'
import { connect } from 'react-redux'
import Formsy from 'formsy-react'
import { I18n } from 'react-i18next'
import Message from '@/components/message'
import SafeInput from '@/components/safeInput'
import NotifyPop from '@/components/notifyPop'
import Button from '@/components/button'
import './changepass.scss'
// import securty from '../../../../assets/js/security'
// import CryptoJS from 'crypto-js'
// // import Base64 from 'crypto-js/enc-base64'
// import sha256 from 'crypto-js/sha256'

// import ReactDom from 'react-dom';
@connect(state => ({
    apis: state.apis,
    userAuth: state.userAuth,
    getUserAuth: state.getUserAuth,
    lang: state.lang,
}))
class SafeChangePass extends Component {
    constructor() {
        super()
        this.state = {
            disabled: true,
            formVal: '',
            visable: false,
            loading: false
        }
        this.handleBack = this.handleBack.bind(this)
        this.handleForm = this.handleForm.bind(this)
        this.submit = this.submit.bind(this)
        this.handleConfirm = this.handleConfirm.bind(this)
        this.changePass = this.changePass.bind(this)
    }
    componentWillMount() {
        this.changePass()
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.lang !== this.props.lang && this.safeForm !== undefined) {
            setTimeout(() => {
                this.safeForm.validateForm()
            }, 20)
        }
    }
    // 按钮是否可点击
    setDisabled(disabled) {
        this.setState({
            disabled
        })
    }
    changePass() {
        if (this.props.userAuth.isGoogleAuth === false) {
            Message.error(<I18n>{t => t('safe.bindGoogleFirst')}</I18n>)
            this.props.history.push('/comm/security')
        }
    }
    // 点击返回按钮
    handleBack() {
        this.props.history.push('/comm/security/main')
    }
    // 弹窗确定
    handleConfirm() {
        this.setState({
            visable: false
        })
        this.props.history.push('/comm/security/main')
    }
    // 获取表单值
    handleForm(values) {
        this.setState({
            formVal: values
        })
    }
    // 修改资金密码表单提交
    async submit() {
        this.setState({ loading: true })
        // const secretoldPwd = sha256(`123${this.state.formVal.password}`)
        // const oldPwd = securty(1, this.state.formVal.password)
        // const oldPwd = this.state.formVal.password
        // const secretpwd = sha256(`123${this.state.formVal.Newpassword}`)
        // const pwd = securty(1, this.state.formVal.Newpassword)
        // const pwd = this.state.formVal.Newpassword
        // const secretrepwd = sha256(`123${this.state.formVal.confirmpassword}`)
        // const repwd = securty(1, this.state.formVal.confirmpassword)
        // const repwd = this.state.formVal.confirmpassword
        // const oldPwd = this.state.formVal.password // 原密码
        // const pwd = this.state.formVal.Newpassword // 新密码
        // const repwd = this.state.formVal.confirmpassword // 确认密码
        // const googleCode = this.state.formVal.googlecode // 谷歌验证码
        const {
            password,
            Newpassword,
            confirmpassword,
            googlecode,
            messagecode,
            emailcode
        } = this.state.formVal
        try {
            const res = await this.props.apis.changefundpass({
                oldPwd: password,
                pwd: Newpassword,
                repwd: confirmpassword,
                googleCode: googlecode,
                phoneCode: messagecode,
                emailCode: emailcode,
            })
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
        const { lang, userAuth } = this.props
        return (
            <I18n>
                {
                    t => (
                        <div>
                            <div className="changepass-title">{t('safe.changepass')}</div>
                            <div className="line" />
                            <div className="changepass-fromWrap">
                                <Formsy
                                    onChange={(values) => { this.handleForm(values) }}
                                    onValidSubmit={this.submit}
                                    onValid={() => { this.setDisabled(false) }}
                                    onInvalid={() => { this.setDisabled(true) }}
                                    ref={(safeForm) => { this.safeForm = safeForm }}
                                >
                                    <SafeInput
                                        type="1"
                                        label={t('safe.oldpass')}
                                        placeholder={t('safe.oldpassPlace')}
                                        name="password"
                                        maxLength="32"
                                        validations="minLength:6,maxLength:32"
                                        validationError={t('safe.passError')}
                                        required
                                        className={lang === 'zh' ? '' : 'enLabel'}
                                        classNameInput={lang === 'zh' ? '' : 'enInput'}
                                    />
                                    <SafeInput
                                        type="1"
                                        label={t('safe.newpass')}
                                        placeholder={t('safe.newpassPlaceholder')}
                                        name="Newpassword"
                                        maxLength="32"
                                        validations="minLength:6,maxLength:32"
                                        validationError={t('safe.passError')}
                                        required
                                        className={lang === 'zh' ? '' : 'enLabel'}
                                        classNameInput={lang === 'zh' ? '' : 'enInput'}
                                    />
                                    <SafeInput
                                        type="1"
                                        label={t('safe.confirmNewPass')}
                                        placeholder={t('safe.confirmNewPassPlaceholder')}
                                        name="confirmpassword"
                                        maxLength="32"
                                        validations="equalsField:Newpassword"
                                        validationError={t('safe.passError2')}
                                        required
                                        className={lang === 'zh' ? '' : 'enLabel'}
                                        classNameInput={lang === 'zh' ? '' : 'enInput'}
                                    />
                                    {
                                        // eslint-disable-next-line no-nested-ternary
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
                                                className={lang === 'zh' ? '' : 'enLabel'}
                                                classNameInput={lang === 'zh' ? '' : 'enInput'}
                                            />
                                            :
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
                                                    sendCode={async () => {
                                                        const r = await this.sendCode('2')
                                                        return r
                                                    }}
                                                    codeKey="messagecode"
                                                    btnState
                                                    name="messagecode"
                                                    required
                                                    className={lang === 'zh' ? '' : 'enLabel'}
                                                    classNameInput={lang === 'zh' ? '' : 'enInput'}
                                                />
                                                :
                                                // eslint-disable-next-line react/jsx-indent
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
                                                    name="emailcode"
                                                    required
                                                    className={lang === 'zh' ? '' : 'enLabel'}
                                                    classNameInput={lang === 'zh' ? '' : 'enInput'}
                                                />
                                    }
                                    <div className={lang === 'zh' ? 'changelopass-btn' : 'changelopass-btn enBtn'}>
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
export default SafeChangePass

