import React from 'react'
import { Switch, Redirect } from 'react-router-dom'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import RouteWithSubRoutes from '@/components/routeWithSubRoutes'
import Message from '@/components/message'
import { chooseImg } from '@/assets/js/common'

import './main.scss'

@withRouter

@connect(state => ({
    apis: state.apis,
    saveCoinimg: state.saveCoinimg,
    coinImg: state.coinImg,
    saveC2cCurrency: state.saveC2cCurrency
}))
export default class C2C extends React.Component {
    constructor() {
        super()
        this.state = {
            coinList: [],
            activeIndex: 1,
        }
    }
    componentDidMount() {
        this.getCurrencyList()
        this.getCoinList()
    }
    // 获取c2c币种列表
    getCurrencyList = async () => {
        try {
            const res = await this.props.apis.getC2CCurrency()
            if (res.code === 0 && res.data.length > 0) {
                this.setState({
                    coinList: res.data,
                })
                this.chooseItem(res.data[0])
            }
        } catch (e) {
            Message.error(e.message)
        }
    }
    // 获取全部币种图片信息
    getCoinList = async () => {
        try {
            const res = await this.props.apis.assetsLogo()
            if (res.code === 0) {
                this.props.dispatch(this.props.saveCoinimg(res.data))
            }
        } catch (e) {
            Message.error(e.Message)
        }
    }
    // 选择币种
    chooseItem = (item) => {
        this.setState({ activeIndex: item.id })
        this.props.dispatch(this.props.saveC2cCurrency(item))
        this.props.history.push('/comm/c2c/ad')
    }
    // 跳转历史记录
    jumpHistory = () => {
        this.setState({ activeIndex: null })
        this.props.history.push('/comm/c2c/history')
    }
    render() {
        const {
            coinList,
            activeIndex
        } = this.state
        return (
            <div className="c2c-main">
                <div className="c2c-navbar">
                    <ul>
                        {
                            coinList.map(item => (
                                <li
                                    className={activeIndex === item.id ? 'active' : null}
                                    key={item.id}
                                    onClick={() => { this.chooseItem(item) }}
                                >
                                    <img width="24px" height="24px" src={chooseImg(item.name, this.props.coinImg, 0)} alt="" />
                                    {item.name}
                                </li>
                            ))
                        }
                    </ul>
                    <ul className="c2c-navBar-history">
                        <li>
                            <i className="iconfont iconshezhi1" />
                            交易管理
                        </li>
                        <li
                            onClick={() => { this.jumpHistory() }}
                            className={this.props.location.pathname === '/comm/c2c/history' ? 'active' : null}
                        >
                            法币账单
                        </li>
                    </ul>
                </div>
                <div className="c2c-container">
                    <Switch>
                        {
                            this.props.routes.map((route, i) =>
                                <RouteWithSubRoutes key={i} {...route} />)
                        }
                        <Redirect to="/comm/c2c/ad" />
                    </Switch>
                </div>
            </div>
        )
    }
}
