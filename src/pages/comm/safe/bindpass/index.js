import React, { Component } from 'react'
import { connect } from 'react-redux'
import Formsy from 'formsy-react'
import { I18n } from 'react-i18next'
import { autobind } from 'core-decorators'
import Message from '@/components/message'
import SafeInput from '@/components/safeInput'
import NotifyPop from '@/components/notifyPop'
import Button from '@/components/button'
import { chooseLang } from '@/assets/js/common'
import './bindpass.scss'
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
class SafeBindPass extends Component {
    constructor() {
        super()
        this.state = {
            disabled: true,
            formVal: '',
            visable: false,
            loading: false,
        }
    }
    componentWillMount() {
    }
    componentWillReceiveProps(nextProps) {
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
    // 获取表单值
    @autobind
    handleForm(values) {
        this.setState({
            formVal: values
        })
    }

    // 发送验证码
    sendCode = async (e) => {
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
    // 绑定资金密码表单提交
    @autobind
    async submit() {
        this.setState({ loading: true })
        // const pwd = this.state.formVal.password // 密码
        // const repwd = this.state.formVal.confirmPassword // 确认密码
        const googleCode = this.state.formVal.googlecode // 谷歌验证码
        // const salt = `123${pwd}`
        // const secretpwd = sha256(`123${this.state.formVal.password}`)
        // const pwd = base64.stringify(secretpwd)
        // const pwd = securty(1, this.state.formVal.password)
        const pwd = this.state.formVal.password
        // const secretrepew = sha256(`123${this.state.formVal.confirmPassword}`)
        // const repwd = base64.stringify(secretrepew)
        // const repwd = securty(1, this.state.formVal.confirmPassword)
        const repwd = this.state.formVal.confirmPassword
        const { messagecode, emailcode } = this.state.formVal
        try {
            const res = await this.props.apis.bindfundpass({
                pwd,
                repwd,
                phoneCode: messagecode,
                emailCode: emailcode,
                googleCode
            })
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
        const { userAuth, lang } = this.props
        return (
            <I18n>
                {
                    t => (
                        <div>
                            <div className="changelopass-title">{t('safe.bindpass')}</div>
                            <div className="line" />
                            <div className="bindpass-fromWrap">
                                <Formsy
                                    onChange={(values) => { this.handleForm(values) }}
                                    onValidSubmit={this.submit}
                                    onValid={() => { this.setDisabled(false) }}
                                    onInvalid={() => { this.setDisabled(true) }}
                                    ref={(safeForm) => { this.safeForm = safeForm }}
                                >
                                    <SafeInput
                                        type="1"
                                        label={t('safe.bindpassword')}
                                        placeholder={t('safe.bindpassPlace')}
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
                                        label={t('safe.bindpassConfirm')}
                                        placeholder={t('safe.bindpassConfirmPlace')}
                                        name="confirmPassword"
                                        maxLength="32"
                                        validations="equalsField:password"
                                        validationError={t('safe.passError2')}
                                        required
                                        className={lang === 'zh' ? '' : 'enLabel'}
                                        classNameInput={lang === 'zh' ? '' : 'enInput'}
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
                                                name="emailcode"
                                                required
                                                className={lang === 'zh' ? '' : 'enLabel'}
                                                classNameInput={lang === 'zh' ? '' : 'enInput'}
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
                                                className={lang === 'zh' ? '' : 'enLabel'}
                                                classNameInput={lang === 'zh' ? '' : 'enInput'}
                                            />
                                            :
                                            null
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
                                    <p>{t('safe.setSuccess')}</p>
                                </div>
                            </NotifyPop>
                        </div>
                    )
                }
            </I18n>
        )
    }
}
export default SafeBindPass

