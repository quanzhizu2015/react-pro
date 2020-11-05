import React from 'react'
import Assetvaluation from './assetvaluation'
import MoneyTable from '@/components/moneyTable'
import { connect } from 'react-redux'
import { I18n } from 'react-i18next'
import { Popover } from 'antd'
import cs from 'classnames'

import Recharge from './recharge.js'
import Translation from './translation.js'
import Message from '@/components/message'
import './index.scss'

@connect(state => ({
    apis: state.apis,
    userAuth: state.userAuth
}))
export default class MyWallet extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            dataTable: null,
            totalValuation: {},
            // isWhiteList: null,
            withdrawal: null,
            USDKInIndex: null,
            expand: {
                key: 'assetId',
                keyValue: null,
                expandRender: null
            },
            addressLoading: false
        }
        this.showRecharge = this.showRecharge.bind(this)
        this.showTranslation = this.showTranslation.bind(this)
        this.queryWallet = this.queryWallet.bind(this)
    }
    componentWillMount() {
        this.queryWallet()
        // this.getConfig()
    }
    async getConfig() {
        try {
            const res = await this.props.apis.getConfig()
            if (res.code === 0) {
                this.setState({
                    withdrawal: res.data.withdrawal
                })
            }
        } catch (e) {
            Message.error(e.message)
        }
    }
    async queryWallet() { // 提币进来接口
        try {
            const res = await this.props.apis.queryWallet()
            if (res.code === 0) {
                this.setState({
                    withdrawal: res.data.item
                })
                if (res.data.item.length > 0) {
                    const dataTable = []
                    for (let i = 0; i < res.data.item.length; i += 1) {
                        // if (res.data.item[i].assetName !== 'USDT') {
                        dataTable.push(res.data.item[i])
                        // }
                    }
                    const obj = {
                        totalValuation: res.data.totalValuation,
                        totalUsdValuation: res.data.totalUsdValuation,
                        totalValCny: res.data.totalValCny
                    }
                    Object.assign(this.state.totalValuation, obj)
                    this.setState({
                        dataTable,
                        // totalValuation: res.data,
                        // isWhiteList: res.data.isWhiteList
                    })
                }
            }
        } catch (e) {
            Message.error(e.message)
        }
    }
    // 展示提币模块
    showTranslation(e, record, f) {
        if (record.assetId === this.state.expand.keyValue && record.assetName !== 'USDT' && this.state.expand.type === 2) {
            this.setState({
                expand: {
                    key: 'assetId',
                    keyValue: null,
                    expandRender: null,
                    USDKOutIndex: null
                }
            })
            return
        }
        const { offsetLeft, offsetWidth } = e.target
        // debugger
        this.setState({
            USDKOutIndex: f,
            expand: {
                type: 2,
                key: 'assetId',
                keyValue: record.assetId,
                expandRender: f ? <Translation chain={f} withdrawal={this.state.withdrawal} value={record} /> : <Translation withdrawal={this.state.withdrawal} value={record} />,
                bLeft: offsetLeft,
                bWidth: offsetWidth
            }
        })
    }
    // 展示冲币模块
    async showRecharge(e, record, f) {
        if (record.assetName === 'EBK') {
            return
        }
        if (this.state.addressLoading) {
            return
        }
        if (record.assetId === this.state.expand.keyValue && record.assetName !== 'USDT' && this.state.expand.type === 1) {
            this.setState({
                expand: {
                    key: 'assetId',
                    keyValue: null,
                    expandRender: null,
                    USDKInIndex: null
                },
            })
            return
        }
        this.setState({
            addressLoading: record.assetId,
            USDKInIndex: f,
        })
        const { offsetLeft, offsetWidth } = e.target
        // 设置请求等待等待
        const res = await this.props.apis.getAddress({
            assetId: record.assetId,
            assetName: record.assetName,
            chain: f || null
        })
        if (res.code === 0) {
            const { userId } = this.props.userAuth
            this.setState({
                addressLoading: false,
                expand: {
                    key: 'assetId',
                    keyValue: record.assetId,
                    type: 1,
                    expandRender: (
                        <Recharge value={{
                            ...record,
                            address: res.data,
                            id: userId,
                            f
                        }}
                        />
                    ),
                    bLeft: offsetLeft,
                    bWidth: offsetWidth,
                }
            })
        } else {
            Message.error(res.msg)
        }
    }
    render() {
        const {
            expandIdx,
            expandPannel,
            expand,
            dataTable,
            totalValuation,
            USDKInIndex,
            USDKOutIndex,
            // isWhiteList
        } = this.state
        const dataHeader = [
            {
                name: <I18n>{t => t('fundManage.walletTrans.coinType')}</I18n>,
                key: 'action',
                width: '15%',
                render: record => (
                    <div>
                        {/* <svg className="bz-icon" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="18" height="18">
                            <use xlinkHref={`#icontable-${record.assetName.toLocaleLowerCase()}`} width="18" />
                        </svg> */}
                        <span className="bz-assetName">{record.assetName}</span>
                    </div>
                ),
            },
            {
                name: <I18n>{t => t('fundManage.walletTrans.canuse')}</I18n>,
                key: 'amount',
                width: '15%',
            },
            {
                name: <I18n>{t => t('fundManage.walletTrans.frozen')}</I18n>,
                key: 'action',
                width: '15%',
                render: record => (
                    <div>
                        {record.lockedAmount}{' '}
                        <Popover
                            placement="bottom"
                            content={
                                <div>
                                    <p className="contentInfo"><I18n>{t => t('fundManage.walletTrans.accountFrozen2')}</I18n>{record.assetName}: <span>{record.orderLockedAmount}</span></p>
                                    <p className="contentInfo"><I18n>{t => t('fundManage.walletTrans.moneyFrozen')}</I18n>{record.assetName}: <span>{record.withdrawLockedAmount}</span></p>
                                </div>
                            }
                        >
                            <i className="iconfont iconicon-question" />
                        </Popover>
                    </div>
                )
            },
            {
                name: <I18n>{t => t('fundManage.walletTrans.lockPosition')}</I18n>,
                key: 'action',
                width: '20%',
                render: record => <div>{record.lockAccountAmount}{' '}</div>
            },
            {
                name: <I18n>{t => t('fundManage.walletTrans.valutionUsdk')}</I18n>,
                key: 'valuation',
                width: '20%'
            },
            {
                name: <I18n>{t => t('fundManage.walletTrans.operation')}</I18n>,
                key: 'action',
                width: '15%',
                align: 'right',
                render: record => (
                    <React.Fragment>
                        {
                            record.depositEnable ?
                                <React.Fragment>
                                    {
                                        record.assetName === 'USDT' ?
                                            <Popover
                                                placement="bottom"
                                                content={
                                                    <ul className="wallet-chong-tooltip">
                                                        <li className={USDKInIndex === 'omni' ? 'active' : null} onClick={(e) => { this.showRecharge(e, record, 'omni') }} >USDT-Tether</li>
                                                        <li className={USDKInIndex === 'erc20' ? 'active' : null} onClick={(e) => { this.showRecharge(e, record, 'erc20') }}>USDT-ERC-20</li>
                                                    </ul>
                                                }
                                            >
                                                <button
                                                    className={cs({
                                                        'money-table-button': true,
                                                        active: record.assetId === this.state.expand.keyValue && this.state.expand.type === 1,
                                                    })}
                                                >
                                                    <I18n>{t => t('fundManage.walletTrans.addCoin')}</I18n>
                                                </button>
                                            </Popover>
                                            :
                                            <button
                                                className={cs({
                                                    'money-table-button': true,
                                                    active: record.assetId === this.state.expand.keyValue && this.state.expand.type === 1,
                                                })}
                                                onClick={(e) => { this.showRecharge(e, record) }}
                                            >
                                                <I18n>{t => t('fundManage.walletTrans.addCoin')}</I18n>
                                            </button>
                                    }
                                </React.Fragment>
                                :
                                <button className="disable">
                                    <I18n>{t => t('fundManage.walletTrans.addCoin')}</I18n>
                                </button>
                        }
                        {
                            record.withdrawalEnable ?
                                <React.Fragment>
                                    {
                                        record.assetName === 'USDT' ?
                                            <Popover
                                                placement="bottom"
                                                content={
                                                    <ul className="wallet-chong-tooltip">
                                                        <li className={USDKOutIndex === 'omni' ? 'active' : null} onClick={(e) => { this.showTranslation(e, record, 'omni') }} >USDT-Tether</li>
                                                        <li className={USDKOutIndex === 'erc20' ? 'active' : null} onClick={(e) => { this.showTranslation(e, record, 'erc20') }}>USDT-ERC-20</li>
                                                    </ul>
                                                }
                                            >
                                                <button
                                                    className={cs({
                                                        'money-table-button': true,
                                                        active: record.assetId === this.state.expand.keyValue && this.state.expand.type === 2
                                                    })}
                                                    // onClick={(e) => { this.showTranslation(e, record) }}
                                                >
                                                    <I18n>{t => t('fundManage.walletTrans.mentionCoin')}</I18n>
                                                </button>
                                            </Popover>
                                            :
                                            <button
                                                className={cs({
                                                    'money-table-button': true,
                                                    active: record.assetId === this.state.expand.keyValue && this.state.expand.type === 2
                                                })}
                                                onClick={(e) => { this.showTranslation(e, record) }}
                                            >
                                                <I18n>{t => t('fundManage.walletTrans.mentionCoin')}</I18n>
                                            </button>
                                    }
                                </React.Fragment>
                                :
                                <button className="disable">
                                    <I18n>{t => t('fundManage.walletTrans.mentionCoin')}</I18n>
                                </button>
                        }
                    </React.Fragment>
                )
            }
        ]
        return (
            <div>
                <Assetvaluation assetmentVal={totalValuation} />

                {/* <i className="iconfont iconltc" />
                <i className="iconfont iconETH" />
                <i className="iconfont iconbtc" />
                <i className="iconfont iconfota" />
                <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="16" height="16">
                    <use xlinkHref="#iconbtc1" width="16" />
                </svg> */}
                <MoneyTable
                    className="ft-mt-10"
                    model="primary"
                    onChange={this.handleClick}
                    expandIdx={expandIdx}
                    expandPannel={expandPannel}
                    expand={expand}
                    dataSource={dataTable}
                    dataHeader={dataHeader}
                />
            </div>
        )
    }
}
