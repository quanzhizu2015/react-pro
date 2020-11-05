import React from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import message from '@/components/message'

import './index.scss'

@withRouter
@connect(state => ({
    apis: state.apis,
}))
export default class C2CInfo extends React.Component {
    constructor() {
        super()
        this.state = {
            feeList: []
        }
    }
    componentDidMount() {
        this.getFeeInfo()
    }
    getFeeInfo = async () => {
        try {
            const res = await this.props.apis.getFeeInfo()
            if (res.code === 0) {
                this.setState({ feeList: res.data })
            }
        } catch (error) {
            message.error(error.message)
        }
    }
    render() {
        const { feeList } = this.state
        return (
            <div className="feeInfo">
                <div className="feeInfo-main">
                    <div className="feeInfo-main-head">
                        费率说明
                    </div>
                    <div className="feeInfo-main-contain">
                        <div className="feeInfo-main-contain1">
                            <div>
                                <h4>交易费率</h4>
                                <p>0.2%交易手续费 （扣除收取到的资产）</p>
                            </div>
                            <div>
                                <h4>充值费率</h4>
                                <p>免费</p>
                            </div>
                            <div>
                                <h4>提现费率</h4>
                                <p>提现手续费将会根据区块实际情况定期调整</p>
                            </div>
                        </div>
                        <div className="feeInfo-main-contain2">
                            <table>
                                <thead>
                                    <th width="30%">币种</th>
                                    <th width="30%">币种全称</th>
                                    <th width="20%">最小提币数量</th>
                                    <th width="20%">手续费率</th>
                                </thead>
                                <tbody>
                                    {
                                        feeList && feeList.length > 0 ?
                                            feeList.map(item => (
                                                <tr>
                                                    <td>{item.name || '--'}</td>
                                                    <td>{item.fullName || '--'}</td>
                                                    <td>{item.minLimitAmount || '--'}</td>
                                                    <td>{item.feeRate || '--'}{item.minFeeStandard ? `（${item.minFeeStandard}）` : ''}</td>
                                                </tr>
                                            ))
                                            :
                                            <tr className="noDate">
                                                <td colSpan="4">
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
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
