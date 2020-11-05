import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { I18n } from 'react-i18next'
import NotifyPop from '@/components/notifyPop'
import Message from '@/components/message'
import './main.scss'

// import ReactDom from 'react-dom';
@connect(state => ({
    test: state.test,
    testAction: state.testAction,
    apis: state.apis,
    lan: state.lang,
    userAuth: state.userAuth,
    getUserAuth: state.getUserAuth
}))
class SafeMain extends Component {
    constructor() {
        super()
        this.state = {
            slideState: 'safeSlideClose',
            visable: false,
            googleCode: '',
            googleYanz: '',
            BtnDisable: false,
            showNickChange: false,
            nickValue: '',
        }
        this.changeSlide = this.changeSlide.bind(this)
        this.queding = this.queding.bind(this)
        this.quxiao = this.quxiao.bind(this)
        this.GetUserAuth = this.GetUserAuth.bind(this)
        this.getGoogleValue = this.getGoogleValue.bind(this)
        this.googleYanZ = this.googleYanZ.bind(this)
    }
    componentWillMount() {
        this.GetUserAuth()
    }
    componentDidMount() {
        // eslint-disable-next-line react/no-did-mount-set-state
        this.setState({ nickValue: this.props.userAuth.nickname })
    }
    componentWillReceiveProps(props) {
        if (this.props.userAuth !== props.userAuth) {
            this.GetUserAuth(props.userAuth.isGoogleLogin)
        }
        if (props.userAuth) {
            this.setState({ nickValue: props.userAuth.nickname })
        }
    }
    // 设置手机
    setmobile() {
        this.props.history.push('/comm/security/bindMobile')
    }
    getGoogleValue = (e) => {
        this.setState({
            googleCode: e.target.value
        })
        const reg = /^[0-9]*$/
        if (e.target.value.length === 6 && reg.test(e.target.value)) {
            this.setState({
                BtnDisable: true
            })
        } else {
            this.setState({
                BtnDisable: false
            })
        }
        // this.setState({ googleCode: e.target.value })
        // if (e.target.value === '') {
        //     this.setState({ googleYanz: '谷歌验证码不能为空' })
        // } else {
        //     this.setState({
        //         googleYanz: '',
        //         BtnDisable: true
        //     })
        // }
    }
    // 获取用户认证信息
    GetUserAuth(isGoogleLog) {
        if (isGoogleLog !== undefined && isGoogleLog !== null) {
            const addr = isGoogleLog
            if (addr === false) {
                this.setState({ slideState: 'safeSlideClose' })
            } else {
                this.setState({ slideState: 'safeSlideOpen' })
            }
        } else if (this.props.userAuth) {
            const addr = this.props.userAuth.isGoogleLogin
            if (addr === false) {
                this.setState({ slideState: 'safeSlideClose' })
            } else {
                this.setState({ slideState: 'safeSlideOpen' })
            }
        }
    }
    // 修改手机号
    changemobile() {
        const { isGoogleAuth } = this.props.userAuth
        if (isGoogleAuth) {
            this.props.history.push('/comm/security/changeMobile')
        } else {
            Message.error(this.t('safe.bindGoogleFirst'))
        }
    }
    // 修改slide开关状态
    changeSlide = () => {
        const { isGoogleAuth } = this.props.userAuth
        if (isGoogleAuth === false) {
            Message.error(this.t('safe.bindGoogleFirst'))
            // this.setState({ slideState: '关' })
        } else {
            this.setState({ visable: true })
        }
    }
    // 谷歌验证
    async googleYanZ() {
        try {
            const res = await this.props.apis.usergoogleLogin({
                googleCode: this.state.googleCode
            })
            if (res.code === 0) {
                this.setState({
                    visable: false,
                    googleCode: '',
                    BtnDisable: false
                })
                this.props.dispatch(this.props.getUserAuth())
                this.GetUserAuth()
                Message.success(this.t('safe.googleSucces'))
            } else {
                this.setState({ googleYanz: this.t(`errors.${res.code}`) })
            }
        } catch (e) {
            Message.error(e.message)
            this.setState({ googleYanz: e.message })
        }
    }
    // 点击弹框确定按钮
    queding() {
        if (this.state.googleCode === '') {
            this.setState({ googleYanz: this.t('safe.googleNull') })
        } else {
            this.googleYanZ()
        }
    }
    quxiao() {
        this.setState({
            visable: false,
            googleCode: '',
            googleYanz: ''
        })
    }
    // 修改登录密码
    changelopass() {
        const { isGoogleAuth, isPhoneAuth, isEmailAuth } = this.props.userAuth
        if (isGoogleAuth || isPhoneAuth || isEmailAuth) {
            this.props.history.push('/comm/security/changelogincode')
        } else {
            Message.error(this.t('safe.bindMandE'))
        }
    }
    // 绑定 google
    bindgoogle() {
        const { isPhoneAuth, isEmailAuth } = this.props.userAuth
        if (isPhoneAuth || isEmailAuth) {
            this.props.history.push('/comm/security/bindgoogle')
        } else {
            Message.error(this.t('safe.bindMandE'))
        }
    }
    // 解除绑定 google
    nobindgoogle() {
        const { isPhoneAuth, isEmailAuth } = this.props.userAuth
        if (isPhoneAuth || isEmailAuth) {
            this.props.history.push('/comm/security/unbindgoogle')
        } else {
            Message.error(this.t('safe.bindMandE'))
        }
    }
    // 忘记资金密码
    forgetpass() {
        const { isPhoneAuth, isEmailAuth } = this.props.userAuth
        if (isPhoneAuth || isEmailAuth) {
            this.props.history.push('/comm/security/forgetfundpassword')
        } else {
            Message.error(this.t('safe.bindMandE'))
        }
    }
    // 设置资金密码
    bindpass() {
        this.props.history.push('/comm/security/bindfundpassword')
    }
    // 修改资金密码
    changepass() {
        this.props.history.push('/comm/security/changefundpassword')
    }
    // 绑定邮箱
    bindemail() {
        this.props.history.push('/comm/security/bindEmail')
    }
    // 修改昵称
    exChangeNickName = () => {
        this.setState({ showNickChange: true }) // 可以修改
        setTimeout(() => {
            this.input.focus()
        }, 0)
    }
    // 失去焦点，校验，提交
    blurCommit = async (val) => {
        // 校验
        if (!val || val.length > 12 || val.length < 2) {
            Message.warning(t('safe.pleaseSetNickName'))
            return false
        }

        const params = {
            nickname: val
        }
        const res = await this.props.apis.putUserName(params)
        if (res.code === 0) {
            Message.success(t('safe.setSuccess'))
        }
        // 请求
        this.props.dispatch(this.props.getUserAuth())
        this.setState({ showNickChange: false })
        return true
    }
    render() {
        const prop = this.props.userAuth || ''
        const { showNickChange, nickValue } = this.state
        return (
            <div className="SafeMain">
                <I18n>
                    {
                        (t) => {
                            this.t = t
                            return (
                                <div>
                                    <ul className="SafeMain-Ul">
                                        <li>{t('safe.safeTit')}</li>
                                        <li>
                                            <table>
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <span>{t('safe.nickName')}</span>
                                                            {
                                                                !prop.nickname ?
                                                                    <i className="iconfont iconchahao" />
                                                                    :
                                                                    <i className="iconfont iconduihao2" />
                                                            }
                                                        </td>
                                                        <td className="SafeMian-tit SafeMain-google">
                                                            <input
                                                                style={{ borderBottom: `${showNickChange ? '1px solid #E7EBF2' : '1px solid transparent'}` }}
                                                                type="text"
                                                                value={nickValue}
                                                                ref={refs => { this.input = refs }}
                                                                disabled={!showNickChange}
                                                                onKeyPress={(e) => { if (e.which === 13) this.blurCommit(e.target.value) }}
                                                                onBlur={(e) => { this.blurCommit(e.target.value) }}
                                                                onChange={(e) => { this.setState({ nickValue: e.target.value }) }}
                                                                placeholder={showNickChange ? t('safe.pleaseSetNickName') : t('safe.clickSetNickName')}
                                                            />
                                                        </td>
                                                        <td>
                                                            <span onClick={() => { this.exChangeNickName() }}>{t('safe.safeChange')}</span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <span>{t('safe.safeLoginPass')}</span>
                                                            <i className="iconfont iconduihao2" />
                                                            {/* <i className="iconfont iconchahao" /> */}
                                                        </td>
                                                        <td className="SafeMian-tit SafeMain-google">
                                                            {/* <span>{t('safe.safeLevel')}</span>
                                                            <span className={prop.kycLevel === 0 ? 'active btn' : 'btn'}>{t('safe.safelow')}</span>
                                                            <span className={prop.kycLevel === 1 ? 'active btn' : 'btn'}>{t('safe.safemiddle')}</span>
                                                            <span className={prop.kycLevel === 2 ? 'active btn' : 'btn'}>{t('safe.safehigh')}</span>
                                                            <span className={prop.kycLevel === 3 ? 'active btn' : 'btn'}>{t('safe.safehighter')}</span> */}
                                                            <span>{t('safe.safeLevel')}</span>
                                                            <span className={prop.passwordSecurityLevel === 0 || prop.passwordSecurityLevel === 1 ? 'active btn' : 'btn'}>{t('safe.safelow')}</span>
                                                            <span className={prop.passwordSecurityLevel === 2 ? 'active btn' : 'btn'}>{t('safe.safemiddle')}</span>
                                                            <span className={prop.passwordSecurityLevel === 3 ? 'active btn' : 'btn'}>{t('safe.safehigh')}</span>
                                                            <span className={prop.passwordSecurityLevel === 4 ? 'active btn' : 'btn'}>{t('safe.safehighter')}</span>
                                                            {/* </td>
                                                            <td className="SafeMain-google"> */}
                                                            <span className={this.props.lan === 'zh' ? 'habener' : 'habenerEn'}>{t('safe.safeloginGoogle')}</span>
                                                            <span className="Safe-googleSlide" onClick={() => { this.changeSlide() }}>
                                                                <span className={this.state.slideState === 'safeSlideClose' ? 'Safe-googleSlideLide' : 'Safe-googleSlideLide Safe-googleSlideLideActive'}>{t(`safe.${this.state.slideState}`)}</span>
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <span onClick={() => { this.changelopass() }}>{t('safe.safeChange')}</span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <span>{t('safe.safeBindPhone')}</span>
                                                            {
                                                                prop.isPhoneAuth === false ?
                                                                    <i className="iconfont iconchahao" />
                                                                    :
                                                                    <i className="iconfont iconduihao2" />
                                                            }
                                                        </td>
                                                        <td className="SafeMian-tit">
                                                            <span>{t('safe.safeMobInfo5')}</span>
                                                        </td>
                                                        {/* <td /> */}
                                                        <td>
                                                            {/* 是否认证手机号，认证显示修改，未认证显示设置 */}
                                                            {
                                                                prop.isPhoneAuth === false ?
                                                                    <span onClick={() => { this.setmobile() }}>
                                                                        {t('safe.safeSet')}
                                                                    </span>
                                                                    :
                                                                    <span onClick={() => { this.changemobile() }}>
                                                                        {t('safe.safeChange')}
                                                                    </span>
                                                            }
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <span style={{ lineHeight: `${this.props.lan === 'en' ? '40px' : '80px'}` }}>{t('safe.safeGoogleBind')}</span>
                                                            {
                                                                prop.isGoogleAuth === false ?
                                                                    <i className="iconfont iconchahao" />
                                                                    :
                                                                    <i className="iconfont iconduihao2" />
                                                            }
                                                        </td>
                                                        <td className="SafeMian-tit">
                                                            <span>
                                                                {t('safe.safeMobInfo')}
                                                            </span>
                                                            <span>
                                                                {t('safe.safeMobInfo1')} <Link to="/comm/security/guide">{t('safe.safeMobInfo2')}</Link>;{t('safe.safeMobInfo3')}:<Link to="/comm/security/guide" className="weightBoard"> Andriod/iOS</Link>
                                                            </span>
                                                        </td>
                                                        {/* <td /> */}
                                                        <td>
                                                            {
                                                                prop.isGoogleAuth === false ?
                                                                    <span onClick={() => { this.bindgoogle() }}>
                                                                        {t('safe.safeSet')}
                                                                    </span>
                                                                    :
                                                                    <span onClick={() => { this.nobindgoogle() }}>
                                                                        {t('safe.noBind')}
                                                                    </span>
                                                            }
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <span>{t('safe.safePass')}</span>
                                                            {
                                                                prop.isFundPwdSet === false ?
                                                                    <i className="iconfont iconchahao" />
                                                                    :
                                                                    <i className="iconfont iconduihao2" />
                                                            }
                                                        </td>
                                                        <td className="SafeMian-tit">
                                                            <span>{t('safe.safePassInfo')}</span>
                                                        </td>
                                                        {/* <td /> */}
                                                        <td>
                                                            {
                                                                prop.isFundPwdSet === false ?
                                                                    <span onClick={() => { this.bindpass() }}>{t('safe.safeSet')}</span>
                                                                    :
                                                                    <span>
                                                                        <span onClick={() => { this.forgetpass() }}>
                                                                            {t('safe.safeForget')}？
                                                                        </span>
                                                                        <span onClick={() => { this.changepass() }}>
                                                                            {t('safe.safeChange')}
                                                                        </span>
                                                                    </span>
                                                            }
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <span>{t('safe.safeEmail')}</span>
                                                            {
                                                                prop.isEmailAuth === false ?
                                                                    <i className="iconfont iconchahao" style={{ lineHeight: '80px' }} />
                                                                    :
                                                                    <i className="iconfont iconduihao2" style={{ lineHeight: '80px' }} />
                                                            }
                                                        </td>
                                                        <td className="SafeMian-tit">
                                                            <span>{t('safe.safeEmailInfo')}</span>
                                                        </td>
                                                        {/* <td /> */}
                                                        <td>
                                                            {
                                                                prop.isEmailAuth === false ?
                                                                    <span onClick={() => { this.bindemail() }}>{t('safe.safeSet')}</span>
                                                                    :
                                                                    null
                                                            }
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </li>
                                    </ul>
                                    <NotifyPop
                                        disable={this.state.BtnDisable}
                                        visable={this.state.visable}
                                        width="378"
                                        height="233"
                                        confirm={this.queding}
                                        cancel={this.quxiao}
                                    >
                                        <div className="safeGoogle">
                                            <h5>{t('safe.OpenCloseGoogle')}</h5>
                                            <div className="safeGoogle-con">
                                                <input type="text" maxLength="6" onChange={(e) => { this.getGoogleValue(e) }} placeholder={t('safe.googleNull')} />
                                                {/* googleNull */}
                                                <p>{this.state.googleYanz}</p>
                                            </div>
                                        </div>
                                    </NotifyPop>
                                </div>
                            )
                        }
                    }
                </I18n>
            </div>
        )
    }
}
export default SafeMain

