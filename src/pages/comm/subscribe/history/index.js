import React from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { Pagination } from 'antd'
import moment from 'moment'

import message from '@/components/message'
import NoData from '@/assets/img/market/nodata.png'
import './index.scss'

@withRouter
@connect(state => ({
    apis: state.apis
}))
export default class SubscribeHistory extends React.Component {
    constructor() {
        super()
        this.state = {
            historyList: [],
            total: 0,
            currentPage: 1,
        }
    }

    componentDidMount() {
        this.getHistoryList()
    }
    getHistoryList = async () => {
        try {
            const params = {
                pageIndex: this.state.currentPage,
                pageSize: 10,
            }
            const res = await this.props.apis.getAdvertisingHistoryFetch(params)
            this.setState({
                historyList: res.data.list,
                total: res.data.total
            })
        } catch (error) {
            message.error(error)
        }
    }
    filterStatus = (status) => {
        switch (status) {
        case 1:
            return <td className="yellow">认购中...</td>
        case 2:
            return <td className="green">认购成功</td>
        case 3:
            return <td className="red">认购失败</td>
        default:
            return status
        }
    }
    render() {
        const { historyList, total, currentPage } = this.state
        return (
            <div className="subscribeHistory">
                <div className="subscribeHistory-main">
                    <h5>认购记录</h5>
                    <table>
                        <thead>
                            <tr>
                                <th>域名</th>
                                <th>认购资金</th>
                                <th>认购份数</th>
                                <th>认购时间</th>
                                <th>认购状态</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                historyList && historyList.length > 0 ?
                                    historyList.map(item => (
                                        <tr key={item.id}>
                                            <td width="24.9%">{item.name}</td>
                                            <td width="24.9%">{item.amount} USDT</td>
                                            <td width="16.6%">{item.count} 份</td>
                                            <td width="16.6%">{moment(item.gmtCreate).format('YYYY-MM-DD HH:mm:ss')}</td>
                                            { this.filterStatus(item.status) }
                                        </tr>
                                    ))
                                    :
                                    <tr className="noData">
                                        <td colSpan="5">
                                            <img src={NoData} alt="" />
                                            <p>暂无认购记录</p>
                                        </td>
                                    </tr>
                            }
                        </tbody>
                    </table>
                    {
                        total > 10 ?
                            <Pagination
                                style={{ textAlign: 'center', marginTop: '20px' }}
                                current={currentPage}
                                pageSize={10}
                                total={total}
                                onChange={(e) => { this.setState({ currentPage: e }, () => { this.getHistoryList() }) }}
                            />
                            :
                            null
                    }
                </div>
            </div>
        )
    }
}
