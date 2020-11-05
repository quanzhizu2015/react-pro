import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import QRCode from 'qrcode.react'
import moment from 'moment'
import { Pagination } from 'antd'
import Message from '@/components/message'

import './index.scss'

@withRouter
@connect(state => ({
    apis: state.apis,
    userAuth: state.userAuth
}))
export default class SubscribeInvite extends Component {
    constructor() {
        super()
        this.state = {
            inviteCode: '',
            active: false,
            inviteList: [],
            pageSize: 10,
            pageIndex: 1,
            total: 0,
        }
    }
    componentDidMount() {
        if (this.props.userAuth) {
            this.getInviteCode()
            this.getInviteList()
        } else {
            this.props.history.push('/common/login')
        }
    }
    /**
     * 获取邀请码
     * @memberof SubscribeInvite
     */
    getInviteCode = async () => {
        try {
            const res = await this.props.apis.getInviteCode()
            if (res.code === 0) {
                this.setState({ inviteCode: res.data })
            }
        } catch (error) {
            Message.error(error)
        }
    }
    /**
     * 获取邀请列表
     * @memberof SubscribeInvite
     */
    getInviteList = async () => {
        try {
            const { pageSize, pageIndex } = this.state
            const params = {
                pageSize,
                pageIndex
            }
            const res = await this.props.apis.getInviteList(params)
            if (res.code === 0) {
                this.setState({
                    inviteList: res.data.list,
                    total: res.data.total
                })
            }
        } catch (error) {
            Message.error(error)
        }
    }
    render() {
        const {
            inviteCode,
            active,
            inviteList,
            total,
            pageIndex
        } = this.state
        return (
            <div className="subscribeInvite">
                <div className="subscribeInvite-banner" />
                <div className="subscribeInvite-main">
                    <div className="subscribeInvite-mainTop">
                        <div className="mainTop-left">
                            <h4>我的邀请</h4>
                            <div className="mainTop-leftMain">
                                <div className="leftMain-left">
                                    <p>邀请链接</p>
                                    <div>
                                        {`https://www.goodtoken.com/register?inviteCode=${inviteCode}`}
                                        <CopyToClipboard text={`https://www.goodtoken.com/register?inviteCode=${inviteCode}`} onCopy={() => { Message.success('复制成功') }}>
                                            <i className="iconfont iconfuzhi3" />
                                        </CopyToClipboard>
                                        <i
                                            className="iconfont iconerweima-"
                                            onMouseEnter={() => { this.setState({ active: true }) }}
                                            onMouseLeave={() => { this.setState({ active: false }) }}
                                        />
                                        <p className={active ? 'active' : ''}>
                                            <QRCode size={77} value={`https://www.goodtoken.com/register?inviteCode=${inviteCode}`} />
                                        </p>
                                    </div>
                                </div>
                                <div className="leftMain-right">
                                    <p>邀请码</p>
                                    <div>
                                        {inviteCode}
                                        <CopyToClipboard text={inviteCode} onCopy={() => { Message.success('复制成功') }}>
                                            <i className="iconfont iconfuzhi3" />
                                        </CopyToClipboard>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mainTop-right">
                            <p>邀请总人数</p>
                            <span>{total}</span>
                        </div>
                    </div>
                    <div className="subscribeInvite-mainBottom">
                        <h4>邀请列表</h4>
                        <table>
                            <thead>
                                <tr>
                                    <th>邀请时间</th>
                                    <th width="25%">我的邀请</th>
                                    <th width="50%">二级人数</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    inviteList && inviteList.length > 0 ?
                                        inviteList.map((item, index) => (
                                            <tr key={index}>
                                                <td>{moment(item.inviteTime).format('YYYY-MM-DD')}</td>
                                                <td>{item.account || '--'}</td>
                                                <td>{item.inviteCount || '--'}</td>
                                            </tr>
                                        ))
                                        :
                                        <tr className="noData">
                                            <td colSpan="5">
                                                <i className="iconfont iconzanwujilu" />
                                                <p>暂无记录</p>
                                            </td>
                                        </tr>
                                }
                            </tbody>
                        </table>
                        {
                            inviteList && inviteList.length > 10 ?
                                <Pagination
                                    style={{ textAlign: 'center' }}
                                    current={pageIndex}
                                    pageSize={8}
                                    total={total}
                                    onChange={(e) => { this.setState({ pageIndex: e }, () => { this.getInviteList() }) }}
                                />
                                :
                                null
                        }
                    </div>
                </div>
            </div>
        )
    }
}
