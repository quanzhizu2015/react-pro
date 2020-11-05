import React, { Component } from 'react'
import { connect } from 'react-redux'
import Formsy from 'formsy-react'
import { I18n } from 'react-i18next'
import Message from '@/components/message'
import SafeInput from '@/components/safeInput'
import NotifyPop from '@/components/notifyPop'
import Button from '@/components/button'
import { chooseLang } from '@/assets/js/common'
// import getUrl from '@/assets/js/common.js'
import './index.scss'

// import ReactDom from 'react-dom';
@connect(state => ({
    apis: state.apis,
    userAuth: state.userAuth,
    // getUserAuth: state.getUserAuth,
    lang: state.lang,
}))
class SafeNoBindGoogle extends Component {
    constructor() {
        super()
        this.state = {
            typeInfo: '',
            disabled: true,
            formVal: '',
            visable: false,
            loading: false
        }
        this.handleBack = this.handleBack.bind(this)
        this.noBingGoogle = this.noBingGoogle.bind(this)
        this.sendCode = this.sendCode.bind(this)
        this.handleForm = this.handleForm.bind(this)
        this.submit = this.submit.bind(this)
        this.handleConfirm = this.handleConfirm.bind(this)
    }
    componentDidMount() {
        this.noBingGoogle()
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.userAuth && nextProps.userAuth !== this.props.userAuth) {
            this.noBingGoogle()
        }
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
    // 点击返回按钮
    handleBack() {
        this.props.history.push('/comm/security/main')
    }
    // 解除谷歌绑定前置条件
    noBingGoogle() {
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
    // 接触谷歌绑定表单提交
    async submit() {
        this.setState({ loading: true })
        let params
        if (this.state.typeInfo === '2') { // 手机验证码
            params = {
                smsCode: this.state.formVal.messagecode, // 短信验证码
                googleCode: this.state.formVal.googlecode // 谷歌验证码
            }
        } else if (this.state.typeInfo === '3') { // 邮箱验证码
            params = {
                emailCode: this.state.formVal.emailcode, // 邮箱验证码
                googleCode: this.state.formVal.googlecode // 谷歌验证码
            }
        }
        if (this.props.userAuth.isGoogleLogin === true) {
            this.setState({ loading: false })
            Message.error(<I18n>{t => t('safe.nobindgoogleInfo')}</I18n>)
        } else {
            try {
                const res = await this.props.apis.nobindgoogle(params)
                this.setState({ loading: false })
                if (res.code === 0) {
                    this.setState({
                        visable: true
                    })
                    // this.props.dispatch(this.props.getUserAuth())
                }
                // else {
                //     Message.error(res.msg)
                // }
            } catch (e) {
                Message.error(e.message)
            }
        }
    }
    render() {
        return (
            <I18n>
                {
                    t => (
                        <div>
                            <div className="changelopass-title">{t('safe.nobindgoogle')}</div>
                            <div className="line" />
                            <div className="nobindgoogle-fromWrap">
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
                                                className={this.props.lang === 'zh' ? '' : 'enLabel'}
                                                classNameInput={this.props.lang === 'zh' ? '' : 'enInput'}
                                            />
                                            : null
                                    }
                                    {
                                        this.state.typeInfo === '3' ?
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
                                                className={this.props.lang === 'zh' ? '' : 'enLabel'}
                                                classNameInput={this.props.lang === 'zh' ? '' : 'enInput'}
                                            />
                                            : null
                                    }
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
                                    <p>{t('safe.nobindSuccess')}</p>
                                </div>
                            </NotifyPop>
                        </div>
                    )
                }
            </I18n>
        )
    }
}
export default SafeNoBindGoogle

