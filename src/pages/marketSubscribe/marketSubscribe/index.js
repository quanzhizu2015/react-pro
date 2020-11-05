import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import moment from 'moment'
import message from '@/components/message'

import { IsPC } from '@/assets/js/common.js'
import './index.scss'

@withRouter
@connect(state => ({
    apis: state.apis
}))
export default class MarketSubscribe extends Component {
    constructor() {
        super()
        this.state = {
            adList: [],
            mouseIndex: null
        }
    }
    componentDidMount() {
        this.getAdvertisingTodayList()
    }
    getAdvertisingTodayList = async () => {
        try {
            const params = {
                pageIndex: 1,
                pageSize: 2,
            }
            const res = await this.props.apis.getAdvertisingTodayListFetch(params)
            this.setState({ adList: res.data })
        } catch (error) {
            message.error(error)
        }
    }
    handleMouse = (id, type) => {
        if (type === 'in') {
            this.setState({ mouseIndex: id })
        } else {
            this.setState({ mouseIndex: null })
        }
    }
    filterStars = (stars) => {
        if (!stars || stars === '0') return null
        const arr = new Array(Number(stars)).fill('')
        return arr.map((item, key) => <i className="iconfont iconxingxing" key={key} />)
    }


    filterStatus = (item) => {
        const { status } = item
        switch (status) {
        case 1:
            return <div className="status grey"><i className="iconfont icondengdai" />认购未开始</div>
        case 2:
            return <div className="status yellow"><i className="iconfont icondengdai" />认购中...</div>
        case 3:
            return <div className="status grey"><i className="iconfont iconright-1" />已结束</div>
        case 4:
            return <div className="status grey"><i className="iconfont iconright-1" />已结束</div>
        case 5:
            return <div className="status red"><i className="iconfont icongantanhao2" />认购失败</div>
        case 6:
            return <div className="status red"><i className="iconfont icongantanhao2" />认购失败</div>
        case 7:
            return <div className="status grey"><i className="iconfont icondengdai" />认购已取消</div>
        case 8:
            return <div className="status grey"><i className="iconfont icondengdai" />认购已取消</div>
        case 9:
            return <div className="status grey"><i className="iconfont icondengdai" />认购已取消</div>
        default:
            return status
        }
    }
    jumpLink = (item) => {
        if (IsPC()) return false
        this.props.history.push(`/comm/subscribe/info?id=${item.id}`)
        return true
    }
    render() {
        const { adList, mouseIndex } = this.state
        return (
            <div className="marketSubscribe">
                {
                    adList && adList.length > 0 ?
                        <div className="marketSubscribe-top">
                            <h4>今日认购</h4>
                            <div className="marketSubscribe-topMain">
                                {
                                    adList && adList.length > 0 ?
                                        adList.map(item => (
                                            <div
                                                key={item.id}
                                                className="marketSubscribe-topItem"
                                                onMouseEnter={() => { this.handleMouse(item.id, 'in') }}
                                                onMouseLeave={() => { this.handleMouse(item.id, 'out') }}
                                                onClick={() => { this.jumpLink(item) }}
                                            >
                                                <div
                                                    className="marketSubscribe-topLeft"
                                                    style={item.adPictureUrl !== '' ? { background: `url(${item.adPictureUrl}) center center / auto 100% no-repeat` } : null}
                                                >
                                                    {this.filterStatus(item)}
                                                    <h4>{item.name}正式启动</h4>
                                                    <div className="div">{item.title}</div>
                                                </div>
                                                <div className="marketSubscribe-topRight">
                                                    <h5>{item.ad}</h5>
                                                    <p>发售时间: {moment(item.startTime).format('YYYY-MM-DD HH:mm')}-{moment(item.endTime).format('YYYY-MM-DD HH:mm')}</p>
                                                    <p>配售份额: {item.releaseAmount}</p>
                                                    <p>兑换币种: {item.currency}</p>
                                                    <p>风险评估: {this.filterStars(item.risk)}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;投资回报率: {this.filterStars(item.rateReturn)}</p>
                                                </div>
                                                {
                                                    mouseIndex === item.id ?
                                                        <div className="btnBg">
                                                            {
                                                                item.status === 1 || item.status === 2 || item.status === 3 || item.status === 4 || item.status === 5 || item.status === 6 ?
                                                                    <div onClick={() => { this.props.history.push(`/comm/subscribe/info?id=${item.id}`) }}>
                                                                        DTO认购
                                                                    </div>
                                                                    :
                                                                    <div onClick={() => { message.info('暂时无法认购') }}>
                                                                        暂时无法认购
                                                                    </div>
                                                            }
                                                        </div>
                                                        :
                                                        null
                                                }
                                            </div>
                                        ))
                                        :
                                        null
                                }
                            </div>
                        </div>
                        :
                        null
                }
            </div>
        )
    }
}
