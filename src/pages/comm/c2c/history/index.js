import React from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { Pagination } from 'antd'
import moment from 'moment'

import message from '@/components/message'
import './index.scss'


const tabList = [{
    name: '进行中',
    id: '1, 2',
}, {
    name: '已完成',
    id: '3',
}, {
    name: '已取消',
    id: '4',
}, {
    name: '全部',
    id: null,
}]

@withRouter
@connect(state => ({
    apis: state.apis,
}))
export default class C2CHistory extends React.Component {
    constructor() {
        super()
        this.state = {
            activeIndex: null,
            historyList: [],
            currentPage: 1,
            total: null,
        }
    }
    componentDidMount() {
        this.getOrderList()
    }
    getOrderList = async () => {
        const { currentPage, activeIndex } = this.state
        const params = {
            pageIndex: currentPage || 1,
            pageSize: 5,
            statusList: activeIndex,
        }
        try {
            const res = await this.props.apis.getC2COrderList(params)
            if (res.code === 0) {
                this.setState({
                    historyList: res.data.list,
                    total: res.data.total
                })
            }
        } catch (e) {
            message.error(e.message)
        }
    }
    chooseItem = (item) => {
        this.setState({ activeIndex: item.id, currentPage: 1 }, () => { this.getOrderList() })
    }
    filterStatus = (item) => {
        if (item.direction === 0) return '等待商家付款'
        if (item.direction === 1) return '待付款'
        return true
    }
    render() {
        const { activeIndex, historyList } = this.state
        return (
            <div className="c2c-history">
                <h4>买卖历史记录</h4>
                <ul className="c2c-history-tab">
                    {
                        tabList.map(item => (
                            <li
                                key={item.id}
                                onClick={() => { this.chooseItem(item) }}
                                className={activeIndex === item.id ? 'active' : null}
                            >
                                {item.name}
                            </li>
                        ))
                    }
                </ul>
                <table>
                    <thead>
                        <th width="22%">订单号</th>
                        <th width="7%">类型</th>
                        <th width="14%">价格</th>
                        <th width="10%">数量</th>
                        <th width="14%">总金额</th>
                        <th width="17%">时间</th>
                        <th width="14%">状态</th>
                    </thead>
                    <tbody>
                        {
                            historyList && historyList.length > 0 ?
                                <React.Fragment>
                                    {
                                        historyList.map(item => (
                                            <tr>
                                                <td className="cursor" onClick={() => { this.props.history.push(`/comm/c2cInfo?id=${item.id}`) }}>{item.id}</td>
                                                <td
                                                    className={item.direction === 0 ? 'red' : 'green'}
                                                >
                                                    {item.direction === 0 ? '卖出' : '买入'}
                                                </td>
                                                <td>{item.price} {item.currency}</td>
                                                <td>{item.amount} {item.assetName}</td>
                                                <td>{Number(item.price * item.amount).toFixed(2)} {item.currency}</td>
                                                <td>{moment(item.gmtCreate).format('YYYY/MM/DD HH:mm:ss')}</td>
                                                <td>
                                                    {item.status === 0 ? <span><i className="iconfont icondengdai red" />未确认</span> : null}
                                                    {item.status === 1 ? <span><i className="iconfont icondengdai red" />{this.filterStatus(item)}</span> : null}
                                                    {item.status === 2 ? <span><i className="iconfont icondengdai red" />待确认</span> : null}
                                                    {item.status === 3 ? <span><i className="iconfont iconright-1" />已成交</span> : null}
                                                    {item.status === 4 ? <span><i className="iconfont iconguanbidefuben" />已取消</span> : null}
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </React.Fragment>
                                :
                                <tr className="noData">
                                    <td colSpan="7">
                                        <svg className="icon" aria-hidden="true" width="100">
                                            <use xlinkHref="#iconzanwushuju-bai1" width="100" />
                                        </svg>
                                        <br />
                                        暂无数据
                                    </td>
                                </tr>
                        }
                    </tbody>
                </table>
                {
                    historyList && historyList.length > 0 ?
                        <Pagination
                            style={{ textAlign: 'center' }}
                            current={this.state.currentPage}
                            pageSize={5}
                            total={this.state.total}
                            onChange={(e) => { this.setState({ currentPage: e }, () => { this.getOrderList() }) }}
                        />
                        :
                        null
                }
            </div>
        )
    }
}
