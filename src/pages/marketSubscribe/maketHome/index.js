import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import Spin from '@/components/loading'
import Message from '@/components/message'
import { chooseImg } from '@/assets/js/common'
import nodata from '../../../assets/img/market/nodate.png'
import './style.scss'

// 正则匹配正确数值
function regFun(s) {
    const pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>?~！\\@#￥……&*（）——|{}【】‘；：”“'。，、？]")
    let rs = ''
    for (let i = 0; i < s.length; i += 1) {
        rs += s.substr(i, 1).replace(pattern, '').replace('\\', '')
    }
    return rs
}
@withRouter
/* eslint-disable */
@connect(state => ({
    apis: state.apis,
    userAuth: state.userAuth,
    wsData: state.wsData,
    ws_14: state.wsData.ws_14,
    wsObj: state.wsObj,
    sendWs: state.sendWs,
    wsConnet: state.wsConnet,
    lang: state.lang,
    getUsdkData: state.getUsdkData,
    saveCoinimg: state.saveCoinimg,
    coinImg: state.coinImg

}))
export default class MarketHome extends Component {
    constructor(props) {
        super(props)
        this.state = {
            marketTable: [],
            indexTab: 1, // TAB 选择区 默认改成1
            indexName: 'BTC',
            loadingState: true,
            filterStatus: false, // 是否根据24h涨跌幅排序
            inputValue: '',
            tabPaneList: [],
        }
    }
    componentWillMount() {
      this.getCoinList() // Todo
    }
    componentDidMount() {
        // do something
        this.getMarketBase()
    }
    componentWillReceiveProps(props) {
        if (props.ws_14 && props.ws_14 !== this.props.ws_14) {
            let hotTabWs;
            const { inputValue } = this.state;
            if (inputValue) {
                hotTabWs = props.ws_14.data.filter((item) => item.klineName && item.klineName.search(inputValue.toUpperCase()) !== -1)
            } else {
                hotTabWs = props.ws_14.data
            }
            this.filterDaily(hotTabWs)
            this.setState({ loadingState: false })
        }
    }
    componentWillUnmount() {
        const param = {
            reqType: -5,
            type: 11
        }
        this.props.dispatch(this.props.sendWs(this.props.wsObj, JSON.stringify(param)))
    }
    getDataYes = () => { // TODO
        if (!this.props.ws_14) {
            this.setLoading = setTimeout(() => {
                this.setState({ loadingState: false })
            }, 1000)
        } else {
            clearTimeout(this.setLoading)
        }
    }
     // 获取websocket数据
    getWsCardData = (base = null) => {
        // debugger
        const paramAry = {
            reqType: 11,
            param: {
                type: 11,
                subType: 14,
                base,
                sessionId: localStorage.sessionId || null
            }
        }
        this.props.dispatch(this.props.sendWs(this.props.wsObj, JSON.stringify(paramAry)))
        this.getDataYes() // TODO
    }
    // 获取全部币种图片信息
    getCoinList = async () => {
        try {
            const res = await this.props.apis.assetsLogo()
            if (res.code === 0) {
                this.props.dispatch(this.props.saveCoinimg(res.data))
            }
        } catch (e) {}
    }
    // 获取交易区
    getMarketBase = async () => {
        try {
            const res = await this.props.apis.marketBase()
            if (res.code === 0) {
                const b = res.data;
                this.setState({
                    indexTab: b[0].baseId,
                    indexName: b[0].name
                })
                this.getWsCardData(b[0].baseId)
                const a = {assetId: 0, name: "自选", logo: null, baseId: -1, sort: 10000}
                b.unshift(a)
                this.setState({ tabPaneList: b })
            }
        } catch (f) {}
    }
    // 选择自选内容
    setOptional = async(e, id, open) => {
        e.stopPropagation();
        if (!localStorage.sessionId) return false;
        if (!open) { // 选中
            try {
                const param = {
                    ids: [id],
                    status: 0,
                    type: 2,
                }
                const res = await this.props.apis.collection(param)
                if (res.code === 0) {
                    Message.success('自选成功')
                }
            } catch (f) {}
        } else { // 取消
            try {
                const param = {
                    ids: [id],
                    status: 1,
                    type: 2,
                }
                const res = await this.props.apis.collectionDel(param)
                if (res.code === 0) {
                    Message.success('取消自选成功')
                }
            } catch (f) {}
        }
    }
    // 选择交易区tab
    chooseTab = (id, name) => {
      this.setState({ loadingState: true })
        this.setState({
            indexTab: id,
            indexName: name,
            inputValue: ''
        })
        this.getWsCardData(id === 0 ? null : id)
    }
    // 输入框改变，准备搜索
    handleSearch = (value) => {
        const realValue = regFun(value)
        this.setState({
            inputValue: realValue.toUpperCase(),
        })
    }
    setFilter = () => {
        this.setState({ filterStatus: !this.state.filterStatus }, () => { this.filterDaily(this.state.marketTable) })
    }
    // 点击24h涨幅排序3
    filterDaily = (e) => {
        const { filterStatus } = this.state
        if (filterStatus) {
            let arr = e
            const len = arr.length;
            if(len === 1) {
                return
            }
            for(let i = 0; i < len; i += 1) {
                for(let j = 0; j < len - 1; j += 1) {
                    if (arr[j].dailyReturn === '--') arr[j].dailyReturn = 0
                    //如果前一个值比后一个值大，那么交换位置
                    if(Number(arr[j].dailyReturn) < Number(arr[j+1].dailyReturn)) {
                        const temp = arr[j];
                        arr[j] = arr[j+1];
                        arr[j+1] = temp; 
                    }
                }
            }
            this.setState({ marketTable: arr })
        } else {
            this.setState({ marketTable: e })
        }
    }
    // 筛选看涨看跌
    filterUpDown1 = (amount, f) => {
        if (!amount || amount === '--') return false
        if (f === 1) {
            if (amount.indexOf('-') !== -1) {
                return 'red'
            } else {
                return 'green'
            }
        } else if (f === 2) {
            if (amount.indexOf('-') !== -1) {
                return 'iconfont iconjiantouxia'
            } else {
                return 'iconfont iconjiantoushang'
            }
        }
    }
    // chooseOwnTab
    render() {
        const {
            tabPaneList,
            indexTab,
            marketTable,
            inputValue,
            loadingState
        } = this.state
        const { theme } = this.props
        return (
            <div className={!theme ? 'tabPane' : 'tabPane tabPane-trade'}>
                <div className="tabPane-header">
                    <div className="tabPane-header-nav">
                        <ul>
                            {
                                tabPaneList && tabPaneList.length > 0 ? (
                                    tabPaneList.map((item) => (
                                        <li
                                            key={item.baseId}
                                            onClick={() => { this.chooseTab(item.baseId, item.name) }}
                                            className={indexTab === item.baseId ? 'active' : null}
                                        >
                                            
                                            {
                                                item.assetId === 0 ?
                                                    <i className="iconfont iconxingxing2" />
                                                    :
                                                    <img width="20px" height="20px" src={chooseImg(item.name, this.props.coinImg, 0)} />
                                            }
                                            {item.name}
                                        </li>
                                    ))
                                ) : null
                            }
                        </ul>
                    </div>
                    <div className="tabPane-header-search">
                        <input
                            type="text" 
                            value={inputValue}
                            onChange={(e) => { this.handleSearch(e.target.value); }}
                        />
                        <i className="iconfont iconhebingxingzhuang1" />
                    </div>
                </div>
                <Spin spinning={loadingState} classs={theme ? 'market-loadingNull' : 'market-loading'}>
                    <table className="tabPane-content">
                        <thead>
                            <tr>
                                {/* 名称 */}
                                <th style={{ width: !theme ? '20%' : '40%' }}>{t('market.freeContractName')}</th>
                                {/* 最新价 */}
                                <th style={{ width: !theme ? '15%' : '30%' }}>{t('market.freeNewPrice')}</th>
                                {/* 涨幅 */}
                                <th style={{ width: !theme ? '15%' : '30%' }} onClick={ () => this.setFilter() }>{t('market.freeIncrease')}</th>
                                {
                                    !theme ?
                                        <React.Fragment>
                                            {/* 最高价 */}
                                            <th style={{ width: '15%' }}>{t('market.highPrice')}</th>
                                            {/* 最低价 */}
                                            <th style={{ width: '18%' }}>{t('market.lowPrice')}</th>
                                            {/* 24H量 */}
                                            <th style={{ width: '17%' }}>{t('market.tradeVolume')}</th>
                                        </React.Fragment>
                                        :
                                        null
                                }
                            </tr>
                        </thead>
                        <tbody>
                            <React.Fragment>
                                {
                                    marketTable.length > 0 ? marketTable.map((item) => (
                                        <tr key={item.id} onClick={() => { 
                                            this.props.dispatch(this.props.getUsdkData(item.klineId));
                                            this.props.history.push(`/trade/spot?pairId=${item.klineId}`)}}>
                                            <td style={{ width: !theme ? '20%' : '40%' }}>
                                                <i
                                                    className={item.hot ? 'iconfont iconxingxing1' : 'iconfont iconxingxing2'}
                                                    onClick={(e) => { this.setOptional(e, item.klineId, item.hot ? true : false) }}
                                                />
                                                {/* <i className="iconfont icontable-btc" /> */}
                                                {
                                                    item.klineName && this.props.coinImg ?
                                                        <img width="20px" height="20px" src={chooseImg(item.klineName, this.props.coinImg)} />
                                                        :
                                                        null
                                                }
                                                {/* <img width="20px" height="20px" src={item.logo} /> */}
                                                {/* <img width="20px" height="20px" src="https://cdn.mytoken.org/FuNmFv6paCxFy511qw4S8PWQ37rn" /> */}
                                                {item.klineName || '--'}
                                            </td>
                                            <td style={{ width: !theme ? '15%' : '30%' }}>{item.now || '--'}</td>
                                            <td className={this.filterUpDown1(item.dailyReturn, 1)} style={{ width: !theme ? '15%' : '30%' }}>
                                            {/* <td className={this.filterUpDown1(0, 1)} style={{ width: '15%' }}> */}
                                                {item.dailyReturn > 0 ? '+' : null}{item.dailyReturn || '--'}%
                                                {/* {item.dailyReturn >= 0 ? '+' : null}{item.dailyReturn || '--'}% */}
                                                <i className={this.filterUpDown1(item.dailyReturn, 2)} />
                                                {/* <i className={this.filterUpDown1(0, 2)} /> */}
                                            </td>
                                            {
                                                !theme ?
                                                    <React.Fragment>
                                                        <td style={{ width: '15%' }}>{item.high || '--'}</td>
                                                        <td style={{ width: '18%' }}>{item.low || '--'}</td>
                                                        <td style={{ width: '17%' }}>{item.amount || '--'} {item.assetName || ''}</td>
                                                    </React.Fragment>
                                                    :
                                                    null
                                            }
                                        </tr>
                                    ))
                                    :
                                    <div align="center" className="nodata">
                                        <img src={nodata} alt=""/>
                                        <p>
                                            {t('market.nodata')}
                                        </p>
                                    </div>
                                }
                            </React.Fragment>
                        </tbody>
                    </table>
                </Spin>
            </div>
        )
    }
}