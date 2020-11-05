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
import './bindemail.scss'

// import ReactDom from 'react-dom';
@connect(state => ({
    apis: state.apis,
    getUserAuth: state.getUserAuth,
    userAuth: state.userAuth,
    lang: state.lang,
}))
class SafeBindEmail extends Component {
    constructor() {
        super()
        this.state = {
            disabled: true,
            formVal: '',
            visable: false,
            loading: false
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
    // 设置按钮是否可以点击
    @autobind
    setDisabled(disabled) {
        this.setState({
            disabled
        })
    }
    @autobind
    async getBlue() {
        if (!this.state.formVal.Email) {
            return false
        }
        const params = {
            account: this.state.formVal.Email,
        }
        const res = await this.props.apis.checkUser(params)
        if (res.code === 0) {
            return true
        }
        Message.error(res.msg)
        return false
    }
    // 返回按钮
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
        if (e === '1') { // 邮箱
            const params = {
                email: this.state.formVal.Email,
                type: 1,
                // language: this.props.lang === 'zh' ? 1 : 2,
                language: chooseLang(this.props.lang)
            }
            const res = await this.props.apis.sendEmailcode(params)
            if (res.code === 0) {
                return true
            }
        } else if (e === '2') { // 短信
            const params = {
                verifyType: 2,
                templateType: 1,
                // language: this.props.lang === 'zh' ? 1 : 2,
                language: chooseLang(this.props.lang)
            }
            const res = await this.props.apis.sendCode(params)
            if (res.code === 0) {
                return true
            }
            Message.error(res.msg)
        }
        return false
    }
    // 绑定邮箱表单提交
    @autobind
    async submit() {
        this.setState({ loading: true })
        const email = this.state.formVal.Email
        const emailCode = this.state.formVal.emailcode
        const smsCode = this.state.formVal.messagecode
        const googleCode = this.state.formVal.googlecode
        try {
            const res = await this.props.apis.bindEmail({
                email,
                emailCode,
                smsCode,
                googleCode
            })
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
    render() {
        let codeDisabled = true
        if (this.email) codeDisabled = !this.email.isValid()
        const { userAuth } = this.props
        return (
            <I18n>
                {
                    t => (
                        <div>
                            <div className="changelopass-title">{t('safe.bindemail')}</div>
                            <div className="line" />
                            <div className="bindemail-fromWrap">
                                <Formsy
                                    onChange={(values) => { this.handleForm(values) }}
                                    onValidSubmit={this.submit}
                                    onValid={() => { this.setDisabled(false) }}
                                    onInvalid={() => { this.setDisabled(true) }}
                                    ref={(safeForm) => { this.safeForm = safeForm }}
                                >
                                    <SafeInput
                                        ref={(email) => { this.email = email }}
                                        type="0"
                                        label={t('safe.bindemialTitle')}
                                        placeholder={t('safe.bindemailPlace')}
                                        name="Email"
                                        getBlue={this.getBlue}
                                        validations="isEmail"
                                        validationError={t('safe.illegalEmial')}
                                        required
                                        className={this.props.lang === 'zh' ? '' : 'enLabel'}
                                        classNameInput={this.props.lang === 'zh' ? '' : 'enInput'}
                                    />
                                    <SafeInput
                                        type="0"
                                        codeDisabled={codeDisabled}
                                        label={t('safe.emailcode')}
                                        placeholder={t('safe.emailcodePlaceholder')}
                                        maxLength={6}
                                        validations={{
                                            matchRegexp: /^\d+$/,
                                            minLength: 6,
                                            maxLength: 6
                                        }}
                                        validationError={t('safe.emailcodePlaceholder')}
                                        codeKey="emailcode"
                                        sendCode={async () => {
                                            const r = await this.sendCode('1')
                                            return r
                                        }}
                                        btnState
                                        name="emailcode"
                                        required
                                        className={this.props.lang === 'zh' ? '' : 'enLabel'}
                                        classNameInput={this.props.lang === 'zh' ? '' : 'enInput'}
                                    />
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
                                        codeKey="messagecode"
                                        sendCode={async () => {
                                            const r = await this.sendCode('2')
                                            return r
                                        }}
                                        btnState
                                        name="messagecode"
                                        required
                                        className={this.props.lang === 'zh' ? '' : 'enLabel'}
                                        classNameInput={this.props.lang === 'zh' ? '' : 'enInput'}
                                    />
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
export default SafeBindEmail

