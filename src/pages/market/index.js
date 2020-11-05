import React, { Component } from 'react'
import { connect } from 'react-redux'
import { I18n } from 'react-i18next'
import Helmet from 'react-helmet'
import QRCode from 'qrcode.react'
import Header from '@/components/header'
import Footer from '@/components/funcoinFooter'

import MarketCard from './marketCard' // 轮播图
import './market.scss'
import MarketHome from './maketHome/index.js'
import MarketBanner from './marketBanner'
import MarketNotice from './marketNotice'
import message from '@/components/message'

import AppImg from '@/assets/img/market/app.png'

@connect(state => ({
    apis: state.apis,
    userAuth: state.userAuth,
    AndroidConfig: state.AndroidConfig,
    AppConfig: state.AppConfig
    // closeWs: state.closeWs
}))
export default class Market extends Component {
    constructor(props) {
        super(props)
        this.state = {
            defaultSelected: null,
            userAuth: this.props.userAuth
        }
    }
    componentDidMount() {
        this.getDefaultTab()
    }
    async componentWillReceiveProps(nextProps) {
        if (this.props.userAuth !== nextProps.userAuth) {
            await this.setState({
                userAuth: nextProps.userAuth
            })
            this.getDefaultTab()
        }
    }
    componentWillUnmount() {
        this.setState({
            userAuth: null
        })
    }
    getDefaultTab = async () => {
        // 先判断是否登录
        if (this.getUserAuth() === 1) {
            const dataRes = await this.props.apis.getDefaultTab()
            if (dataRes && dataRes.code === 0) {
                await this.setState({
                    defaultSelected: dataRes.data
                })
            } else {
                await this.setState({
                    defaultSelected: 0
                })
            }
        } else if (this.getUserAuth() === 0) {
            const { collections } = localStorage
            if (!collections || JSON.parse(collections).length <= 0) {
                this.setState({
                    defaultSelected: 0
                })
            } else {
                this.setState({
                    defaultSelected: 0
                })
            }
        }
        // const defaultSelected = 1
    }
    getUserAuth = () => {
        if (this.state.userAuth === null || this.state.userAuth === undefined) {
            return -1
        } else if (this.state.userAuth && this.state.userAuth !== 0) {
            return 1
            // return false
        }
        return 0
    }
    jumpApp = (f) => {
        if (f) {
            window.location.href = this.props.AndroidConfig
        } else {
            message.info('请扫描上方二维码下载app')
        }
    }
    render() {
        const { history } = this.props
        return (
            <I18n>
                {
                    t => (

                        <div className="Market">
                            <Helmet>
                                <title>{t('market.marketTitle')}</title>
                                <meta content={t('market.marketContent')} name="description" />
                                <meta content={t('market.marketKeywords')} name="keywords" />
                            </Helmet>
                            <Header type="market" />
                            <div className="Market-header">
                                <MarketBanner location={2} />
                            </div>
                            <MarketNotice />
                            {/* <MarketAffiche /> */}
                            <div className="Market-market">
                                <div className="Market-market-main">
                                    <MarketCard />
                                </div>
                            </div>
                            <div className="Market-table">
                                <div className="Market-table-main">
                                    {
                                        this.state.defaultSelected !== null && this.state.defaultSelected !== undefined ?
                                            <MarketHome history={history} defaultSelected={this.state.defaultSelected} />
                                            :
                                            null
                                    }
                                </div>
                            </div>
                            <div className="Market-app">
                                <div className="Market-app-main">
                                    <div className="Market-app-main-left">
                                        <QRCode
                                            value={this.props.AppConfig}
                                            style={{
                                                width: '140px',
                                                height: '140px',
                                                background: '#fff',
                                                padding: '5px'
                                            }}
                                        />
                                        <p>请扫描官方二维码下载OAK APP</p>
                                        <div className="qrcode">
                                            <div onClick={() => { this.jumpApp() }}>
                                                <i className="iconfont iconios" />
                                                <span>IOS</span>
                                            </div>
                                            <div onClick={() => { this.jumpApp(1) }}>
                                                <i className="iconfont iconanzhuologo1" />
                                                <span>Android</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="Market-app-main-right">
                                        <img src={AppImg} alt="" />
                                    </div>
                                </div>
                            </div>
                            <Footer />
                        </div>
                    )
                }
            </I18n>
        )
    }
}
