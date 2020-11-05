import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { I18n } from 'react-i18next'
import { Tooltip } from 'antd'
// import getUrl from '@/assets/js/common.js'
import { getUrl } from '@/assets/js/common.js'
// import Message from '@/components/message'
import './usdkBar.scss'
import MarketHome from '../../../marketSubscribe/maketHome/index.js'

function getUrlId() {
    const obj = getUrl(window.location)
    if (obj.pairId) {
        return obj.pairId
    }
    return null
}
function doZero(usdkIncrement) {
    if (!usdkIncrement) {
        return '--%'
    }
    if (usdkIncrement === 0) {
        return `${usdkIncrement}.00%`
    } else if (usdkIncrement > 0) {
        return `+${usdkIncrement}%`
    }
    return `${usdkIncrement}%`
}
function filterUp(e) {
    if (e !== undefined) {
        if (String(e).indexOf('-') === -1) {
            return true
        }
        return false
    }
    return false
}
function comTips(word, lang, assetName) {
    if (lang === 'zh') {
        return (
            <I18n>{(t) => (<p>{t(`USDTtrade.${word}`)}</p>)}</I18n>
        )
    }
    return (
        <I18n>{(t) => (<p>{t(`USDTtrade.${word}`)} {assetName} {t('USDTtrade.USDKTipsB')}</p>)}</I18n>
    )
}
// function getIconName(name) {
//     switch (name) {
//     case 'ETH/BTC': return 'ETHBTC'
//     case 'FOTA/BTC': return 'FOTABTC'
//     case 'DOGE/BTC': return 'DOGEBTC'
//     default: return 'ETHBTC'
//     }
// }

let paramAryfresh
@withRouter
@connect(state => ({
    apis: state.apis,
    getUsdkData: state.getUsdkData,
    usdkData: state.usdkData,
    wsObj: state.wsObj,
    sendWs: state.sendWs,
    wsData: state.wsData,
    clearUserAuth: state.clearUserAuth,
    asynchronous: state.asynchronous,
    wsConnet: state.wsConnet,
    lang: state.lang
}))
export default class USDKBar extends React.Component {
    constructor() {
        super()
        this.state = {
            usdkList: {},
            // renderArr: [],
            isShowSelectBox: false,
            urlId: getUrlId() || null,
            usdk24Info: {}, // 24h合约信息
            defaultSelected: false,
        }
        this.offSelectBox = this.offSelectBox.bind(this)
    }
    componentWillMount() {
        // this.setState({ urlId: getUrlId() })
    }
    componentDidMount() {
        this.getUsdkDatas()
        document.addEventListener('click', this.offSelectBox)
    }
    componentWillReceiveProps(props) {
        if (props.wsConnet === true && props.wsConnet !== this.props.wsConnet && paramAryfresh) {
            this.props.dispatch(this.props.sendWs(this.props.wsObj, JSON.stringify(paramAryfresh)))
        }
        if (props.usdkData && props.usdkData !== this.props.usdkData) {
            this.setState({
                usdkList: props.usdkData,
                // renderArr: props.usdkData.item,
                urlId: props.usdkData.pairId,
                isShowSelectBox: false
            })
            this.get24hInfo(props.usdkData.pairId)
            this.getRealUsdkData(props.usdkData.pairId)
        }
        if (props.wsData !== this.props.wsData) {
            if (props.wsData.ws_4) {
                const setSure = this.props.usdkData && props.wsData.ws_4 && Number(this.props.usdkData.pairId) === props.wsData.ws_4.id
                if (setSure) this.setState({ usdk24Info: props.wsData.ws_4 })
            }
        }
        if (getUrlId() && props.asynchronous && !props.usdkData && !this.props.usdkData) {
            this.setState({ urlId: null }, () => {
                this.getUsdkDatas()
            })
            window.history.pushState(null, null, '/trade/spot')
        }
    }
    componentWillUnmount() {
        document.removeEventListener('click', this.offSelectBox)
        this.props.dispatch(this.props.sendWs(this.props.wsObj, JSON.stringify({
            reqType: -5,
            type: 4
        })))
    }
    async getUsdkDatas() {
        await this.props.dispatch(this.props.getUsdkData(this.state.urlId))
    }
    async getRealUsdkData(id) {
        const param = {
            pairId: id
        }
        const res = await this.props.apis.USDKList(param)
        if (res.code === 0) {
            // this.setState({ renderArr: res.data.item })
        } else if (res.code === 401) {
            this.props.dispatch(this.props.clearUserAuth())
            // 登录超时
        }
    }
    async get24hInfo(id) {
        const param = {
            reqType: 4,
            type: 1,
            id: id || '1000',
        }
        paramAryfresh = param
        await this.props.dispatch(this.props.sendWs(this.props.wsObj, JSON.stringify(param)))
    }
    changeIconPage(id) {
        this.props.dispatch(this.props.getUsdkData(id))
        this.props.history.replace(`./spot?pairId=${id}`)
        this.setState({ isShowSelectBox: false })
    }
    openFuckingBox(e) {
        const { isShowSelectBox } = this.state
        // console.log(this.ref_box.clientHeight)
        e.nativeEvent.stopImmediatePropagation()
        if (!isShowSelectBox) {
            this.getRealUsdkData(this.state.urlId)
        }
        this.setState({
            defaultSelected: true,
            isShowSelectBox: !isShowSelectBox
        })
    }
    offSelectBox(e) {
        const oMenu = document.querySelector('.fuckingBox')
        if (oMenu && !oMenu.contains(e.target) && this.state.isShowSelectBox) {
            this.setState({ isShowSelectBox: false })
        }
    }
    render() {
        const {
            isShowSelectBox,
            usdkList,
            // renderArr,
            usdk24Info
        } = this.state
        const { lang } = this.props
        let [selectStyle, arrowIcon] = [null, null]
        if (isShowSelectBox) {
            selectStyle = {
                visibility: 'visible',
                height: '270px',
                // height: 80 + (renderArr.length * 30),
                width: '450px',
                opacity: '1'
            }
            arrowIcon = 'iconjiantouarrow492'
        } else {
            selectStyle = {
                visibility: 'hidden',
                height: '54px',
                width: '180px',
                opacity: '1'
            }
            arrowIcon = 'iconjiantouarrow486'
        }
        // 选择现货交易对
        const TIPS01 = (<I18n>{(t) => (<p>{t('USDTtrade.USDKTips1')}</p>)}</I18n>)
        const NAME = usdkList ? usdkList.name : 'ETH/BTC'
        return (
            <I18n>
                {
                    t => (
                        <div id="usdkBar">
                            <div className="leftBar">
                                {/* <div className="dot" /> */}
                                <div className="menuOpen ft-theme-menuOpen" onClick={e => this.openFuckingBox(e)}>
                                    <Tooltip title={TIPS01} placement="bottom">
                                        {/* <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px">
                                            <use xlinkHref={`#icon${getIconName(NAME)}`} />
                                        </svg> */}
                                        <h2 className="ft-theme-s3">{NAME}</h2>
                                    </Tooltip>
                                    <i className={`iconfont ft-theme-s3 ${arrowIcon}`} />
                                </div>
                                <div ref={(target) => { this.ref_box = target }} className="fuckingBox ft-theme-bg-select" style={selectStyle}>
                                    <div className="title_box ft-theme-title_box" onClick={e => this.openFuckingBox(e)}>
                                        {/* <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px">
                                            <use xlinkHref={`#icon${getIconName(NAME)}`} />
                                        </svg> */}
                                        <h2 className="ft-theme-s3">{NAME}</h2>
                                        <i className={`iconfont ft-theme-s3 ${arrowIcon}`} />
                                    </div>
                                    <div className="select_table">
                                        {
                                            this.state.defaultSelected ?
                                                <MarketHome theme history={history} defaultSelected={this.state.defaultSelected} />
                                                :
                                                null
                                        }
                                    </div>
                                    {/* <table className="select_table">
                                        <thead>
                                            <tr>
                                                <th className="ft-theme-label">{t('USDTtrade.USDKCoin1')}</th>
                                                <th className="ft-theme-label">{t('USDTtrade.USDKCoin2')}</th>
                                                <th className="ft-theme-label">{t('USDTtrade.USDKCoin3')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                renderArr ?
                                                    renderArr.map((item, index) => {
                                                        let [isup, increase] = [false, null]
                                                        if (item.increase === null || item.increase === null) {
                                                            increase = '--'
                                                        }
                                                        if (item.increase && item.increase.indexOf('-') === -1) {
                                                            isup = true
                                                            increase = `+${item.increase}%`
                                                        } else if (item.increase && item.increase.indexOf('-') !== -1) {
                                                            increase = `${item.increase}%`
                                                        }
                                                        return (
                                                            <tr key={index} className="ft-theme-tr-hover" onClick={() => this.changeIconPage(item.id)}>
                                                                <td className="ft-theme-s3">{item.name}</td>
                                                                <td className={isup ? 'green' : 'red'}>{increase || '-'}</td>
                                                                <td className="ft-theme-s3">{item.filledPrice}</td>
                                                            </tr>
                                                        )
                                                    })
                                                    :
                                                    null
                                            }
                                        </tbody>
                                    </table> */}
                                </div>
                                {/* <div className="col_line ft-theme-col-line" /> */}
                            </div>
                            <div className="rightBar">
                                <div id="coinInfo">
                                    <div className="big_price">
                                        <h1 className={filterUp(usdk24Info.usdkIncrement) ? 'green' : 'red'}>{usdk24Info.usdkPrice}</h1>
                                        <i className={filterUp(usdk24Info.usdkIncrement) ? 'iconfont iconjiantoushang' : 'iconfont iconjiantouxia'} />
                                        <span className={filterUp(usdk24Info.usdkIncrement) ? 'green' : 'red'}>{doZero(usdk24Info.usdkIncrement)}</span>
                                    </div>
                                    <i className="cline" />
                                    {/* <div className="otherTradeAreas">
                                        <span onClick={() => this.changeIconPage(1)}>BTC</span>
                                        <span onClick={() => this.changeIconPage(9)}>ETH</span>
                                        <span onClick={() => this.changeIconPage(4)}>KRW</span>
                                        <div className="dropDown">
                                            <i className="iconfont ft-theme-s3 iconjiantouarrow486" />
                                            <div className="dropDown-content">
                                                <ul>
                                                    <li onClick={() => this.changeIconPage(1)}>FUNT</li>
                                                    <li onClick={() => this.changeIconPage(1)}>EOS</li>
                                                    <li onClick={() => this.changeIconPage(1)}>asdfads</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <i className="cline" /> */}
                                    <div className="right_box">
                                        <ul className="right_list">
                                            <li>
                                                <span>{usdk24Info.volumeIn24Hour || '-'}</span>
                                                <Tooltip title={comTips('USDKTips2', lang, NAME)} placement="bottom">
                                                    <p>{t('USDTtrade.USDKCoin24h1')}</p>
                                                </Tooltip>
                                            </li>
                                            <li>
                                                <span>{usdk24Info.highestIn24Hour || '-'}</span>
                                                <Tooltip title={comTips('USDKTips3', lang, NAME)} placement="bottom">
                                                    <p>{t('USDTtrade.USDKCoin24h2')}</p>
                                                </Tooltip>
                                            </li>
                                            <li>
                                                <span>{usdk24Info.lowestIn24Hour || '-'}</span>
                                                <Tooltip title={comTips('USDKTips4', lang, NAME)} placement="bottom">
                                                    <p>{t('USDTtrade.USDKCoin24h3')}</p>
                                                </Tooltip>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
            </I18n>
        )
    }
}
