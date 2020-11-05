import React, { Component } from 'react'

import './index.scss'

const noticeList = [
    {
        index: 1,
        name: 'GoodToken 3.0 正式上线公告',
        link: '/market',
    },
    {
        index: 2,
        name: 'GoodToken结束FUNT挖矿',
        link: '/market',
    },
    {
        index: 3,
        name: 'GoodToken暂停ETH以及所有ERC20代币的充币公告',
        link: '/market',
    }
]
export default class marketAffiche extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    render() {
        return (
            <div className="market-affiche">
                {
                    noticeList.map((item) => (
                        <div key={item.index}><a href="http://s.funcoin.info/content.html?259" target="blank">{item.name}</a></div>
                    ))
                }
            </div>
        )
    }
}
