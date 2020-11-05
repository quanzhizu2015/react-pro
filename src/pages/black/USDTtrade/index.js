import React, { Component } from 'react'
import { connect } from 'react-redux'
// import cs from 'classnames'
// import MarketBar from './marketbar'
import USDKBar from './usdkBar'
import TradeTable from './tradeTable'
import TradeList from '../tradelist.js'
import MarketK from '../marketKline1/indextradingview1'
// import MarketK from '../marketKline1/indextradingview1'
// import MarketK from '../TVChartContainer/index.js'
import Spin from '@/components/loading'
// import CoinInfo from './coinInfo'
// import HeaderUSDK from './headerUSDK'
import Carousel from '../carousel'
import TradeForm from './tradeForm'
import Helmet from 'react-helmet'
import { I18n } from 'react-i18next'
import './USDTtrade.scss'

// import ReactDom from 'react-dom';
@connect(state => ({
    userAuth: state.userAuth,
    sendFundComponent: state.sendFundComponent,
    usdkData: state.usdkData,
    // closeWs: state.closeWs,
}))
class USDTtrade extends Component {
    constructor(props) {
        super(props)
        this.state = {
            leftShow: true,
            rightShow: true,
            loading: true,
        }
    }
    componentWillMount() {
        // this.props.dispatch(this.props.sendFundComponent(<HeaderUSDK />))
    }
    componentWillReceiveProps(props) {
        if (props.usdkData) {
            setTimeout(() => {
                this.setState({
                    loading: false
                })
            }, 1000)
        }
    }
    componentWillUnmount() {
    }
    showTab = (type) => {
        if (type === 'left') {
            if (this.state.leftShow === true) {
                this.setState({ leftShow: false })
            } else {
                this.setState({ leftShow: true })
            }
        } else if (type === 'right') {
            if (this.state.rightShow === true) {
                this.setState({ rightShow: false })
            } else {
                this.setState({ rightShow: true })
            }
        }
    }
    render() {
        return (
            <div className="USDTtrade ft-theme-bg-auto">
                <I18n>
                    {
                        t => (
                            <Helmet>
                                <title>{t('USDTtrade.usdtTitle')}</title>
                                <meta content={t('USDTtrade.usdtContent')} name="description" />
                                <meta content={t('USDTtrade.usdtKeywords')} name="keywords" />
                            </Helmet>
                        )
                    }
                </I18n>
                <div className="USDTtrade-left">
                    <div className="USDTtrade-top-K">
                        <Spin classs="ft-theme-Loading" spinning={this.state.loading} >
                            <Carousel />
                            <USDKBar />
                            <MarketK
                                type="2"
                                DataForm={this.props.usdkData}
                            />
                        </Spin>
                    </div>
                    <I18n>
                        {
                            t => (
                                <div className={this.state.leftShow === false ? 'USDTtrade-left-hide ft-theme-bg-default' : 'USDTtrade-bottom-K ft-theme-bg-default'}>
                                    <span className="USDTtrade-showtips ft-theme-label" onClick={() => { this.showTab('left') }}>
                                        {
                                            this.state.leftShow === true ?
                                                // <span>{t('USDTtrade.Hide')}<i className="iconfont iconjiantouarrow486" /></span>
                                                <i className="iconfont iconshouqi" />
                                                :
                                                // <span>{t('USDTtrade.Show')}<i className="iconfont iconjiantouarrow492" /></span>
                                                <i className="iconfont iconshouqi-shang" />
                                        }
                                    </span>
                                    {
                                        this.state.leftShow === true ?
                                            <TradeTable />
                                            :
                                            <p className="hideTit ft-theme-label">{t('USDTtrade.myContarce')}</p>
                                    }
                                </div>
                            )
                        }
                    </I18n>
                </div>
                <div className="USDTtrade-right">
                    <div className="USDTtrade-top-L">
                        {/* ShowAtao true是展开 */}
                        <TradeList ShowAtao={this.state.rightShow} comType="usdk" />
                    </div>
                    <I18n>
                        {
                            t => (
                                <div className={this.state.rightShow === false ? 'USDTtrade-right-hide' : 'USDTtrade-bottom-L'}>
                                    {/* <span className="USDTtrade-showtips ft-theme-label" onClick={() => { this.showTab('right') }}>
                                        {
                                            this.state.rightShow === true ?
                                                // <span>{t('USDTtrade.Hide')}<i className="iconfont iconjiantouarrow486" /></span>、
                                                <i className="iconfont iconshouqi" />
                                                :
                                                // <span>{t('USDTtrade.Show')}<i className="iconfont iconjiantouarrow492" /></span>
                                                <i className="iconfont iconshouqi-shang" />
                                        }
                                    </span> */}
                                    {/* <span
                                        className={cs({
                                            'trade-expand-icon': true,
                                            'trade-expand': this.state.rightShow,
                                            'trade-hide': !this.state.rightShow,
                                            'ft-theme-bg-ab': true
                                        })}
                                        onClick={() => { this.showTab('right') }}
                                    /> */}
                                    {
                                        this.state.rightShow === true ?
                                            <TradeForm />
                                            :
                                            <p className="hideTit ft-theme-label">{t('USDTtrade.myContarce1')}</p>
                                            // null
                                    }
                                </div>
                            )
                        }
                    </I18n>
                </div>
            </div>
        )
    }
}
export default USDTtrade
