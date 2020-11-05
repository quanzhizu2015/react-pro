import React, { Component } from 'react'
import Formsy from 'formsy-react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import FtSteps, { Step } from '../ftStep'
import { I18n } from 'react-i18next'
import AcInput from '../acInput'
import Button from '../button'
import { chooseLang } from '@/assets/js/common'
// import securty from '../../assets/js/security'
// import base64 from 'crypto-js/enc-base64'
// import sha256 from 'crypto-js/sha256'
import './index.scss'


@withRouter
@connect(state => ({
    apis: state.apis,
    userAuth: state.userAuth,
    lang: state.lang,
}))
export default class ForgetPwd extends Component {
    constructor() {
        super()
        this.state = {
            current: '1',
            disabled: true,
            pictureurl: '',
            userAuthState: false,
            codeNumber: 60,
            zxcvbn: null
        }
        this.stepNext = this.stepNext.bind(this)
        this.submit = this.submit.bind(this)
        this.getpicturecode = this.getpicturecode.bind(this)
        this.sendCodeHandler = this.sendCodeHandler.bind(this)
        this.reFeshCode = this.reFeshCode.bind(this)
    }
    componentWillMount() {
        this.getpicturecode()
        this.setZxcvbn()
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.lang !== this.props.lang && this.forgetForm) {
            setTimeout(() => {
                this.forgetForm.validateForm()
            }, 20)
        }
    }
    async getpicturecode() {
        const res = await this.props.apis.getpicture()
        if (res.code === 0) {
            let url = res.data
            url = `data:image/png;base64,${url}`
            this.setState({
                pictureurl: url
            })
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
    async sendCodeHandler() {
        const param = {
            language: chooseLang(this.props.lang)
        }
        const res = await this.props.apis.getupdatepwd(param)
        if (res.code === 0) {
            return true
        }
        return false
    }
    async stepNext(model) {
        const res = await this.props.apis.checkverify(model)
        if (res.code === 0) {
            this.forgetForm.reset()
            this.setState({
                userAuthState: res.data ? res.data : false,
                current: '2'
            })
        }
    }
    async submit(model) {
        let z
        console.log(model)
        const params = {}
        const keys = Object.keys(model)
        keys.forEach((key) => {
            params[key] = model[key]
        })
        if (this.state.zxcvbn) {
            z = this.state.zxcvbn(params.pwd || '')
        }
        console.log(params)
        params.passwdSecurityLevel = (z && z.score) ? z.score : 0
        // const saltpwd = `abc${params.loginPwd}`
        // const secretpwd = sha256(saltpwd)
        // params.loginPwd = base64.stringify(secretpwd)
        // params.loginPwd = securty(0, params.loginPwd)
        // const saltrepwd = `abc${params.reLoginPwd}`
        // const secretrepwd = sha256(saltrepwd)
        // params.reLoginPwd = base64.stringify(secretrepwd)
        // params.reLoginPwd = securty(0, params.reLoginPwd)
        const res = await this.props.apis.resetpwd(params)
        if (res.code === 0) {
            this.setState({
                current: '3',
                codeNumber: '0'
            })
            return true
        }
        return false
    }
    reFeshCode() {
        this.getpicturecode()
    }
    stepOne() {
        return (
            <I18n>
                {
                    t => (
                        <Formsy
                            ref={(forgetForm) => { this.forgetForm = forgetForm }}
                            className="ac-form ft-forget-form"
                            onValidSubmit={this.stepNext}
                            onValid={() => { this.setDisabled(false) }}
                            onInvalid={() => { this.setDisabled(true) }}
                        >
                            <AcInput
                                icon="iconzhanghao"
                                placeholder={t('logReg.accountTitle')}
                                name="userSymbol"
                                validationError={t('logReg.accountError')}
                                required
                            />
                            <AcInput
                                icon="iconyanzhengma"
                                showpiture
                                reFresh={this.reFeshCode}
                                pictureurl={this.state.pictureurl}
                                sendCodeHandler={this.getpicturecode}
                                placeholder={t('logReg.picPlace')}
                                name="captchaCode"
                                validationError={t('logReg.picError')}
                                required
                            />
                            <div className="ft-forget-submit">
                                <Button disabled={this.state.disabled} type="submit" theme="primary">{t('logReg.nextInfo')}</Button>
                            </div>
                        </Formsy>
                    )
                }
            </I18n>
        )
    }
    stepSecond() {
        const { userAuthState } = this.state
        return (
            <I18n>
                {
                    t => (
                        <Formsy
                            ref={(forgetForm) => { this.forgetForm = forgetForm }}
                            className="ac-form ft-forget-form"
                            onValidSubmit={this.submit}
                            onValid={() => { this.setDisabled(false) }}
                            onInvalid={() => { this.setDisabled(true) }}
                        >
                            <AcInput
                                icon="iconmima"
                                placeholder={t('logReg.pwdNewPlace')}
                                type="password"
                                name="loginPwd"
                                validations="minLength:6,maxLength:32"
                                validationError={t('logReg.pwdNewError')}
                                required
                            />
                            <AcInput
                                icon="iconmima"
                                placeholder={t('logReg.rePwdHolder')}
                                type="password"
                                name="reLoginPwd"
                                validations="equalsField:loginPwd"
                                validationError={t('logReg.rePwdError')}
                                required
                            />
                            {
                                userAuthState && userAuthState.isGoogleAuth ?
                                    <AcInput
                                        icon="iconyanzhengma"
                                        placeholder={t('logReg.googlePlace')}
                                        name="googleCode"
                                        validations="isLength:6"
                                        validationError={t('logReg.googleError')}
                                        required
                                    />
                                    :
                                    null
                            }
                            {
                                userAuthState && userAuthState.isPhoneAuth ?
                                    <AcInput
                                        icon="iconyanzhengma"
                                        showCode={this.state.codeNumber}
                                        placeholder={t('logReg.msgCodePlace')}
                                        name="verifyCode"
                                        sendCodeHandler={this.sendCodeHandler}
                                        validations="isLength:6"
                                        validationError={t('logReg.msgCodeError')}
                                        required
                                    />
                                    :
                                    null
                            }
                            <div className="ft-forget-submit">
                                <Button disabled={this.state.disabled} type="submit" theme="primary">{t('logReg.nextInfo')}</Button>
                            </div>
                        </Formsy>
                    )
                }
            </I18n>
        )
    }
    render() {
        return (
            <I18n>
                {
                    t => (
                        <div className="ft-forget">
                            <div className="ft-forget-title">
                                <div>
                                    {t('logReg.forgetPass')}
                                </div>
                            </div>
                            <FtSteps className="ft-forget-step" current={this.state.current}>
                                <Step value="1">{t('logReg.forgetTitle1')}</Step>
                                <Step value="2">{t('logReg.forgetTitle2')}</Step>
                                <Step value="3" type="check">{t('logReg.forgetTitle3')}</Step>
                            </FtSteps>
                            {this.state.current === '1' ? this.stepOne() : null}
                            {this.state.current === '2' ? this.stepSecond() : null}
                            {this.state.current === '3' ? (
                                <div className="ft-forget-success">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="200" height="200">
                                        <use xlinkHref="#iconresetpassword" width="200" />
                                    </svg>
                                    <p>{t('logReg.forgetSucc')}</p>
                                    <Link to="login">{t('logReg.forgetLogin')}</Link>
                                </div>
                            ) : null}
                        </div>
                    )
                }
            </I18n>
        )
    }
}
