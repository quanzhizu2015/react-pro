import React, { Component } from 'react'
import { connect } from 'react-redux'
import Formsy from 'formsy-react'
import { I18n } from 'react-i18next'
import { autobind } from 'core-decorators'
import Message from '@/components/message'
import NotifyPop from '@/components/notifyPop'
import SafeInput from '@/components/safeInput'
import Button from '@/components/button'
import { chooseLang } from '@/assets/js/common'
// import getUrl from '@/assets/js/common.js'
import './changelogpass.scss'
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
class SafeChangeLoPass extends Component {
    constructor() {
        super()
        this.state = {
            disabled: true,
            formVal: '',
            visable: false,
            loading: false,
            zxcvbn: null
        }
    }
    componentDidMount() {
        this.setZxcvbn()
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.lang !== this.props.lang && this.safeForm !== undefined) {
            setTimeout(() => {
                this.safeForm.validateForm()
            }, 20)
        }
    }
    // 按钮是否可点击
    @autobind
    setDisabled(disabled) {
        this.setState({
            disabled
        })
    }
    // 引入插件库
    @autobind
    async setZxcvbn() {
        this.setState({
            zxcvbn: (await import('zxcvbn')).default
        })
    }
    // 获取表单值
    @autobind
    handleForm(values) {
        this.setState({
            formVal: values
        })
    }
    // 点击返回按钮
    @autobind
    handleBack() {
        this.props.history.push('/comm/security/main')
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
    // 点击提交表单
    @autobind
    async submit() {
        this.setState({ loading: true })
        // const salt = `abc${params.pwd}`
        let z
        // const secretoldpassword = sha256(`abc${this.state.formVal.oldpassword}`)
        // const secretnewpassword = sha256(`abc${this.state.formVal.newpassword}`)
        // const secretconfirmNewPass = sha256(`abc${this.state.formVal.confirmNewPass}`)
        if (this.state.zxcvbn) {
            z = this.state.zxcvbn(this.state.formVal.newpassword)
        }
        // params.pwd = CryptoJS.enc.Base64.stringify(secretoldpassword)
        const {
            oldpassword,
            newpassword,
            confirmNewPass,
            messagecode,
            emailcode,
            googlecode
        } = this.state.formVal
        const params = {
            oldLoginPwd: oldpassword,
            loginPwd: newpassword,
            reLoginPwd: confirmNewPass,
            emailCode: emailcode, // 邮箱验证码
            googleCode: googlecode, // 谷歌验证码
            phoneCode: messagecode,
            passwdSecurityLevel: (z && z.score) ? z.score : 0
        }
        try {
            const res = await this.props.apis.changeloPass(params)
            this.setState({ loading: false })
            if (res.code === 0) {
                this.setState({
                    visable: true
                })
                this.props.dispatch(this.props.getUserAuth())
            }
            // else {
            //     Message.error(res.msg)
            // }
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
                        <div>
                            <div className="changelopass-title">{t('safe.changelopass')}</div>
                            <div className="line" />
                            <div className="changelopass-fromWrap">
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
                                        name="oldpassword"
                                        maxLength="32"
                                        validations="minLength:6,maxLength:32"
                                        validationError={t('safe.oldpassPlace')}
                                        required
                                        className={this.props.lang === 'zh' ? '' : 'enLabel'}
                                        classNameInput={this.props.lang === 'zh' ? '' : 'enInput'}
                                    />
                                    <SafeInput
                                        type="1"
                                        label={t('safe.newpass')}
                                        placeholder={t('safe.newPassError')}
                                        name="newpassword"
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
                                        name="confirmNewPass"
                                        maxLength="32"
                                        validations="equalsField:newpassword"
                                        validationError={t('safe.passError2')}
                                        required
                                        className={this.props.lang === 'zh' ? '' : 'enLabel'}
                                        classNameInput={this.props.lang === 'zh' ? '' : 'enInput'}
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
                                                className={this.props.lang === 'zh' ? '' : 'enLabel'}
                                                classNameInput={this.props.lang === 'zh' ? '' : 'enInput'}
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
                                                    btnState
                                                    codeKey="messagecode"
                                                    sendCode={async () => {
                                                        const r = await this.sendCode('2')
                                                        return r
                                                    }}
                                                    name="messagecode"
                                                    required
                                                    className={this.props.lang === 'zh' ? '' : 'enLabel'}
                                                    classNameInput={this.props.lang === 'zh' ? '' : 'enInput'}
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
                                                    codeKey="mailcode"
                                                    btnState
                                                    sendCode={async () => {
                                                        const r = await this.sendCode('1')
                                                        return r
                                                    }}
                                                    name="emailcode"
                                                    required
                                                    className={this.props.lang === 'zh' ? '' : 'enLabel'}
                                                    classNameInput={this.props.lang === 'zh' ? '' : 'enInput'}
                                                />
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
export default SafeChangeLoPass

