import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import { autobind } from 'core-decorators'
import QRCode from 'qrcode.react'
import cs from 'classnames'
import Button from '../button'
import Menue from '../menu'
import { I18n } from 'react-i18next'
import './index.scss'
import Logo1 from '@/assets/img/logo/logo1-2.png' // OAK
import Logo2 from '@/assets/img/logo/logo1-1.png' // OAK


@withRouter
@connect(state => ({
    setLang: state.setLang,
    userAuth: state.userAuth,
    clearUserAuth: state.clearUserAuth,
    theme: state.theme,
    dispatch: state.dispatch,
    changeTheme: state.changeTheme,
    apis: state.apis,
    wsObj: state.wsObj,
    sendWs: state.sendWs,
    wsData: state.wsData,
    helpcenter: state.helpcenter,
    httpConfig: state.httpConfig,
    lang: state.lang,
    AppConfig: state.AppConfig
}))
export default class Header extends Component {
    static defaultProps = {
        type: 'normal',
        showLeft: true
    }
    constructor() {
        super()
        this.state = {
            isTop: true,
            scrollLeft: 0,
            isRead: true,
            // modalIsOpen: 'none',
        }
    }
    componentWillMount() {
        window.addEventListener('scroll', this.listenScrolling)
        if (this.props.wsData) {
            if (this.props.wsData.ws_9 !== undefined) {
                this.setState({ isRead: this.props.wsData.ws_9 })
            }
        }
    }
    componentDidMount() {
    }
    componentWillReceiveProps(props) {
        if (props.wsData !== this.props.wsData) {
            if (props.wsData.ws_9 !== undefined) {
                this.setState({ isRead: props.wsData.ws_9 })
            }
        }
    }
    componentWillUnmount() {
        window.removeEventListener('scroll', this.listenScrolling)
    }
    @autobind
    changeLang(e) {
        if (e === 'en') {
            this.i18n.changeLanguage('en')
            this.props.dispatch(this.props.setLang('en'))
            localStorage.lang = 'en'
        } else if (e === 'zh') {
            this.i18n.changeLanguage('zh')
            this.props.dispatch(this.props.setLang('zh'))
            localStorage.lang = 'zh'
        }
        if (e === 'ko') {
            this.i18n.changeLanguage('ko')
            this.props.dispatch(this.props.setLang('ko'))
            localStorage.lang = 'ko'
        }
    }
    @autobind
    listenScrolling() {
        const scrollingE = document.scrollingElement || document.documentElement
        const isTop = scrollingE.scrollTop === 0
        this.setState({
            isTop,
            scrollLeft: scrollingE.scrollLeft
        })
    }
    @autobind
    async logout() {
        // 点击退出登录在localstorage中存入当前的路由
        localStorage.pathName = `${window.location.pathname}${window.location.search}`
        const paramAry = {
            reqType: -2,
            sessionId: localStorage.sessionId
        }
        await this.props.dispatch(this.props.sendWs(this.props.wsObj, JSON.stringify(paramAry)))
        const res = await this.props.apis.logout()
        this.props.dispatch(this.props.clearUserAuth())
        if (res.code === 0) {
            localStorage.removeItem('sessionId')
            // localStorage.clear()
            this.props.history.push('/common/login')
            // 清除localstorg
        }
    }
    @autobind
    changeTheme() {
        let t = 'night'
        if (this.props.theme === 'night') {
            t = 'light'
        }
        this.props.dispatch(this.props.changeTheme(t))
    }

    // @autobind
    // handleMouseOver() {
    //     this.setState({
    //         modalIsOpen: 'block',
    //     })
    // }
    // @autobind
    // handleMouseOut() {
    //     this.setState({
    //         modalIsOpen: 'none',
    //     })
    // }
    // @autobind
    // handleMouseUserOver() {
    //     this.setState({
    //         modalIsOpen: 'block',
    //     })
    // }
    // 黑白主题切换
    showTheme() {
        if (this.props.showTheme) {
            if (this.props.theme === 'night') {
                return <div className="header-theme"><i onClick={this.changeTheme} className="iconfont icon-taiyang" /></div>
            }
            return <div className="header-theme"><i onClick={this.changeTheme} className="iconfont icon-yueliang" /></div>
        }
        return <div className="header-theme" />
    }

    showLeft() {
        const { t } = this
        if (this.props.showLeft) {
            let { pathname } = this.props.location
            if (!pathname) pathname = ''
            return (
                <div className="header-left">
                    <div className="header-left-first">
                        <Link to="/">
                            {/* <svg className="icon" aria-hidden="true">
                                <use xlinkHref="#icon-logo" />
                            </svg> */}
                            {/* FUNCOIN */}
                            {/* <img src={this.props.lang === 'zh' ? Logo : LogoEn} alt="" /> */}
                            {/* OAK */}
                            {
                                this.props.type === 'trade' || this.props.type === 'market' ?
                                    <img src={Logo1} alt="" />
                                    :
                                    <img src={Logo2} alt="" />
                            }
                            {/* <i className="icon iconfont icon-logo4" /> */}
                        </Link>
                        {/* <i className="iconfont icon-fortunalogozhongwen" /> */}
                    </div>
                    <ul>
                        <li
                            className={cs({ active: pathname.startsWith('/trade/spot') })}
                        >
                            <div>
                                <Link
                                    to="/trade/spot"
                                >
                                    {t('header.usdkEx')}
                                </Link>
                                <i />
                            </div>
                        </li>
                        {/* 法币交易 */}
                        {/* C2C隐藏 */}
                        {/* {
                            this.props.lang === 'zh' ?
                                <li
                                    className={cs({ active: pathname.startsWith('/comm/c2c') })}
                                >
                                    <div>
                                        <Link
                                            to="/comm/c2c"
                                        >
                                            {t('header.c2c')}
                                        </Link>
                                        <i />
                                    </div>
                                </li>
                                :
                                null
                        } */}

                        <li
                            className={cs({ active: pathname.startsWith('/upCoin') })}
                        >
                            <div>
                                <Link
                                    to="/upCoin"
                                >
                                    {t('header.upCoin')}
                                </Link>
                                <i />
                            </div>
                        </li>
                        <li
                            className={cs({ active: pathname.startsWith('/comm/subscribe/list') })}
                        >
                            <div>
                                <Link
                                    to="/comm/subscribe/list"
                                >
                                    {t('header.subscribe')}
                                </Link>
                                <i />
                            </div>
                        </li>
                        <li
                            className={cs({ active: pathname.startsWith('/help') })}
                        >
                            <div>
                                <a
                                    href="https://goodtoken.zendesk.com/hc/zh-cn/categories/360002326173-%E6%96%B0%E6%89%8B%E6%95%99%E7%A8%8B"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {t('header.newHelp')}
                                </a>
                                <i />
                            </div>
                        </li>
                        <li
                            className={cs({ active: pathname.startsWith('/help') })}
                        >
                            <div>
                                <a
                                    href="https://goodtoken.zendesk.com/hc/zh-cn/articles/360036843854-%E5%8A%A0%E5%85%A5GoodToken%E7%A4%BE%E7%BE%A4-%E8%8E%B7%E5%8F%96GoodToken%E5%8A%A8%E6%80%81%E5%BF%AB%E4%BA%BA%E4%B8%80%E6%AD%A5"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {t('header.addBlock')}
                                </a>
                                <i />
                            </div>
                        </li>
                    </ul>
                </div>
            )
        }
        return null
    }
    showBell() {
        const { isRead, isTop } = this.state
        const { location, theme, isFixed } = this.props
        let bell = 'shense'
        if (theme === 'night') {
            bell = 'baise'
        }
        if (!location.pathname.startsWith('/trade')) {
            bell = 'shense'
        }
        if (this.props.type === 'market' || this.props.type === 'invite') {
            bell = 'baise'
            if (isFixed && !isTop) {
                bell = 'shense'
            }
        }
        if (location.pathname.startsWith('/home')) {
            bell = 'baise'
        }
        return (
            <svg className="iconBell" aria-hidden="true">
                <use xlinkHref={`#iconxiaoxizhongxin-${bell}${isRead ? '' : '1'}`} />
            </svg>
        )
    }
    render() {
        let { pathname } = this.props.location
        if (!pathname) pathname = ''
        const loginAttr = this.props.loginAttr || {
            onClick: () => {
                let prepathname
                if (window.location.pathname === '/common/login') {
                    // 登录页面/common/login
                    prepathname = '/login'
                } else {
                    prepathname = window.location.pathname
                }
                localStorage.pathName = `${prepathname}${window.location.search}`
                this.props.history.push('/common/login')
            }
        }
        const registerAttr = this.props.registerAttr || {
            onClick: () => { this.props.history.push('/common/register') }
        }
        const stb = this.props.isFixed && !this.state.isTop
        return (
            <I18n>
                {(t, { i18n }) => {
                    this.i18n = i18n
                    this.t = t
                    return (
                        <div>
                            {this.props.showPadding ? <div className="header-padding" /> : null}
                            <div
                                style={
                                    stb ? {
                                        left: `-${this.state.scrollLeft}px`
                                    } : null
                                }
                                className={cs({
                                    header: true,
                                    [`header-${this.props.type}`]: !stb,
                                    'header-fixed': stb,

                                })}
                            >
                                {this.showLeft()}
                                <div className="header-right">
                                    <ul className="header-right-menu">
                                        {/* app下载 */}
                                        <li>
                                            <div>
                                                <a
                                                    className="header-app"
                                                    onMouseOver={this.handleMouseOver}
                                                    onMouseLeave={this.handleMouseOut}
                                                >
                                                    {t('header.Appname')}
                                                    <div
                                                        className="header-appdownload"
                                                        style={{ display: this.state.modalIsOpen }}
                                                        onMouseOver={this.handleMouseUserOver}
                                                        onMouseLeave={this.handleMouseOut}
                                                    >
                                                        <QRCode
                                                            value={this.props.AppConfig}
                                                        />
                                                        <p>{t('header.Appcontent')}</p>
                                                    </div>
                                                </a>
                                                <i />

                                            </div>
                                        </li>
                                        {/* 邀请返佣 */}
                                        {/* <li
                                            className={cs({ active: pathname.startsWith('/invite') })}
                                        >
                                            <div>
                                                <Link
                                                    to="/invite"
                                                >
                                                    {t('header.Referral')}
                                                </Link>
                                                <i />
                                            </div>
                                        </li> */}
                                        {/* 平台分红 */}
                                        {/* <li
                                            className={cs({ active: pathname.startsWith('/dividends') })}
                                        >
                                            <div>
                                                <Link
                                                    to="/dividends"
                                                >
                                                    {t('header.interestsBonus')}
                                                </Link>
                                                <i />
                                            </div>
                                        </li> */}
                                        {/* 帮助中心 */}
                                        <li>
                                            <div>
                                                <a
                                                    href="https://www.goodtoken.com/fimages/20191011/0750b700a5b241b3aac979fb814da0f9.pdf"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    {t('header.whitePaper')}
                                                </a>
                                                <i />
                                            </div>
                                        </li>
                                        <li
                                            className={cs({ active: pathname.startsWith('/help') })}
                                        >
                                            <div>
                                                <a
                                                    // to="/help"
                                                    href={t('header.helpUrl')}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    {t('header.help')}
                                                </a>
                                                <i />
                                            </div>
                                        </li>
                                        {/* 活动 */}
                                        {/* <li
                                            className={cs({ active: pathname.startsWith('/help') })}
                                        >
                                            <div>
                                                <Link
                                                    to="/help"
                                                >
                                                    {t('header.help')}
                                                </Link>
                                                <i />
                                            </div>
                                        </li> */}
                                    </ul>
                                    {/* {this.showTheme()} */}
                                    {/* <div className="header-theme" /> */}
                                    {
                                        this.props.userAuth ?
                                            <div className="header-logined">
                                                <Menue
                                                    width={120}
                                                    textAlign="flex-end"
                                                    items={[
                                                        <Link to="/comm/fund/wallet"><i className="iconfont iconGroup1" />{t('header.wallet')}</Link>,
                                                        <Link to="/comm/security/main"><i className="iconfont iconshezhi" />{t('header.safe')}</Link>,
                                                        <Link to="/comm/subscribe/invite"><i className="iconfont iconyaoqing1" />我的邀请</Link>,
                                                        <Link to="/comm/card/package"><i className="iconfont iconkabao" />我的卡包</Link>,
                                                        <Link to="/comm/subscribe/history"><i className="iconfont iconjilu123" />认购记录</Link>,
                                                        <a onClick={this.logout} ><i className="iconfont icontuichu" />{t('header.logout')}</a>
                                                    ]}
                                                >
                                                    {this.props.userAuth.nickname ? this.props.userAuth.nickname : this.props.userAuth.registerAccount}
                                                </Menue>
                                            </div> :
                                            <div className="header-tab-pannel">
                                                <div>
                                                    <a {...loginAttr} >
                                                        { pathname.endsWith('login') ? <Button size="small">{t('header.login')}</Button> : t('header.login') }
                                                    </a>
                                                </div>
                                                <div style={{ marginLeft: '5px' }}>
                                                    <a {...registerAttr} >
                                                        { pathname.endsWith('register') ? <Button size="small">{t('header.register')}</Button> : t('header.register') }
                                                    </a>
                                                </div>
                                            </div>
                                    }
                                    {
                                        this.props.userAuth ?
                                            <Link to="/notification" target="_blank" style={{ marginLeft: '50px' }}>
                                                {/* <i className={`iconfont ft-theme-s3 ${bell}`} /> */}
                                                {this.showBell()}
                                            </Link>
                                            : null
                                    }
                                    <div className="header-global">
                                        <Menue
                                            width={90}
                                            mrLeft={-12}
                                            isTheme={this.props.showTheme}
                                            items={[
                                                <a style={{ justifyContent: 'flex-start', color: 'inherit' }} onClick={() => { this.changeLang('en') }} className="languageSvg">
                                                    <svg style={{ pointerEvents: 'none' }} className="icon-one" aria-hidden="true">
                                                        <use xlinkHref="#iconmeiguoguoqi" />
                                                    </svg>EN
                                                </a>,
                                                <a style={{ justifyContent: 'flex-start', color: 'inherit' }} onClick={() => { this.changeLang('zh') }} className="languageSvg">
                                                    <svg style={{ pointerEvents: 'none' }} className="icon-one" aria-hidden="true">
                                                        <use xlinkHref="#iconguoqi" />
                                                    </svg>中文
                                                </a>,
                                                // <a style={{ justifyContent: 'flex-start', color: 'inherit' }} onClick={() => { this.changeLang('ko') }} className="languageSvg">
                                                //     <svg style={{ pointerEvents: 'none' }} className="icon-one" aria-hidden="true">
                                                //         <use xlinkHref="#iconhanguo1" />
                                                //     </svg>한국어
                                                // </a>
                                            ]}
                                        >
                                            {
                                                i18n.language === 'en' ?
                                                    <span>
                                                        <svg style={{ pointerEvents: 'none' }} className="icon" aria-hidden="true">
                                                            <use xlinkHref="#iconmeiguoguoqi" />
                                                        </svg>EN
                                                    </span>
                                                    :
                                                    null
                                            }
                                            {
                                                i18n.language === 'zh' ?
                                                    <span>
                                                        <svg style={{ pointerEvents: 'none' }} className="icon" aria-hidden="true">
                                                            <use xlinkHref="#iconguoqi" />
                                                        </svg>中文
                                                    </span>
                                                    :
                                                    null
                                            }
                                            {
                                                i18n.language === 'ko' ?
                                                    <span>
                                                        <svg style={{ pointerEvents: 'none' }} className="icon" aria-hidden="true">
                                                            <use xlinkHref="#iconhanguo1" />
                                                        </svg>한국어
                                                    </span>
                                                    :
                                                    null
                                            }
                                        </Menue>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }}
            </I18n>
        )
    }
}
