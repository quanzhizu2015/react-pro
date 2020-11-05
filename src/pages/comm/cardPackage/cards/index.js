import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { Pagination } from 'antd'
import moment from 'moment'
import message from '@/components/message'
import NoData from '@/assets/img/market/nodata.png'
import './index.scss'

@withRouter
@connect(state => ({
    apis: state.apis,
    userAuth: state.userAuth,
}))
class CardsList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentPage: 1,
            cardsList: []
        }
    }
    componentDidMount() {
        this.getCardsList()
    }
    getCardsList = async () => {
        const { currentPage } = this.state
        try {
            const params = {
                pageSize: 8,
                pageIndex: currentPage,
            }
            const res = await this.props.apis.getCardsList(params)
            if (res.code === 0) {
                this.setState({
                    cardsList: res.data.list,
                    total: res.data.total
                })
            }
        } catch (error) {
            message.error(error)
        }
    }
    handleJump = () => {
        this.props.history.push('/comm/subscribe/list')
    }
    render() {
        const { cardsList, total, currentPage } = this.state
        return (
            <div className="cardsList">
                {
                    cardsList && cardsList.length > 0 ?
                        cardsList.map(item => (
                            <div className="cardsList-item" key={item.id}>
                                <div className="cardsList-itemLeft">
                                    <h5>可用卡券{item.remaining}张</h5>
                                    <p>起投额 {item.couponConditions} {item.currency || 'USDT'}</p>
                                    <span>过期时间: {moment(item.gmtExpired).format('YYYY-MM-DD HH:mm')}</span>
                                </div>
                                <div className="cardsList-itemRight">
                                    <h5>金额</h5>
                                    <p>{item.couponAmount}</p>
                                    <span>({item.currency || 'USDT'})</span>
                                    {
                                        item.status === 1 ?
                                            <div onClick={() => { this.handleJump() }}>
                                                立即使用
                                            </div>
                                            :
                                            <div className="disable">
                                                已过期
                                            </div>
                                    }
                                </div>
                            </div>
                        ))
                        :
                        <div className="noData">
                            <img src={NoData} alt="" />
                            <p>暂无卡券</p>
                        </div>
                }
                {
                    total > 8 ?
                        <Pagination
                            style={{ width: '100%', textAlign: 'center', marginTop: '20px' }}
                            current={currentPage}
                            pageSize={8}
                            total={total}
                            onChange={(e) => { this.setState({ currentPage: e }, () => { this.getCardsList() }) }}
                        />
                        :
                        null
                }
            </div>
        )
    }
}
export default CardsList

