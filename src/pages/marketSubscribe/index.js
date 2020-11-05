import React, { Component } from 'react'
import { connect } from 'react-redux'
import { I18n } from 'react-i18next'
import Helmet from 'react-helmet'
import Header from '@/components/header'
import Footer from '@/components/funcoinFooter'

// import MarketCard from './marketCard' // 轮播图
import MarketSubscribe from './marketSubscribe'
import './market.scss'
import MarketHome from './maketHome/index.js'
import MarketBanner from './marketBanner'
import MarketNotice from './marketNotice'
import MarketDescribe from './marketDescribe'
import FixRequest from '@/components/fixRequest'


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
                            <FixRequest />
                            <Header type="market" />
                            <div className="Market-header">
                                <MarketBanner />
                            </div>
                            <MarketNotice />
                            <MarketSubscribe />
                            {/* <MarketAffiche /> */}
                            {/* <div className="Market-market">
                                <div className="Market-market-main">
                                    <MarketCard />
                                </div>
                            </div> */}
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
                            <MarketDescribe />
                            <Footer />
                        </div>
                    )
                }
            </I18n>
        )
    }
}
