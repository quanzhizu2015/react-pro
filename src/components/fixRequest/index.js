import React, { Component } from 'react'

import './index.scss'

export default class fixRequest extends Component {
    static defaultProps = {
        point: true
    }
    constructor() {
        super()
        this.state = {
        }
    }
    render() {
        return (
            <div className="fix-request" onClick={() => { window.open('https://goodtoken.zendesk.com/hc/zh-cn/requests/new') }}>
                <i className="iconfont icongongdantibao" />
            </div>
        )
    }
}
