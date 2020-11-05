import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { Pagination } from 'antd'
import moment from 'moment'
import NoData from '@/assets/img/market/nodata.png'
import './index.scss'

@withRouter
@connect(state => ({
    apis: state.apis,
    userAuth: state.userAuth,
}))
class CardHistory extends Component {
    constructor(props) {
        super(props)
        this.state = {
            historyList: null,
            total: 0,
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
            const res = await this.props.apis.getCardsUsedList(params)
            this.setState({
                historyList: res.data.list,
                total: res.data.total
            })
        } catch (error) {
            message.error(error)
        }
    }
    render() {
        const { total, historyList, currentPage } = this.state
        return (
            <div className="cardHistory">
                <table>
                    <thead>
                        <tr>
                            <th>记录ID</th>
                            <th>名称</th>
                            <th>抵扣金额</th>
                            <th>认购金额</th>
                            <th>日期</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            historyList && historyList.length > 0 ?
                                historyList.map(item => (
                                    <tr key={item.id}>
                                        <td>{item.id}</td>
                                        <td>{item.name}</td>
                                        <td>{item.deduction}</td>
                                        <td>{item.subscribe}</td>
                                        <td>{moment(item.gmtCreate).format('YYYY-MM-DD HH:mm:ss')}</td>
                                    </tr>
                                ))
                                :
                                <tr className="noData">
                                    <td colSpan="5">
                                        <img src={NoData} alt="" />
                                        <p>暂无使用记录</p>
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
        )
    }
}
export default CardHistory

