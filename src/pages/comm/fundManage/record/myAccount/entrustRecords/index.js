import React from 'react'
import { I18n } from 'react-i18next'
import { Pagination, Popover } from 'antd'
import moment from 'moment'
import { connect } from 'react-redux'
import Spin from '@/components/loading'
import DataPicker from '@/components/datapicker'
import MoneyTable from '@/components/moneyTable'
// import Message from '@/components/message'
import './index.scss'

@connect(state => ({
    apis: state.apis
}))
class EntrustRecords extends React.Component {
    constructor() {
        super()
        this.state = {
            dataList: [],
            pageSize: 10,
            currentPage: 1,
            // status: '',
            total: 0,
            startTime: '',
            endTime: '',
            loading: false,
        }
    }

    componentDidMount() {
        this.queryEntrustRecords()
    }

    // 查询委托历史记录
    queryEntrustRecords = async (page, startTime, endTime) => {
        this.setState({
            loading: true
        })
        const res = await this.props.apis.tradeEntrus({
            pageSize: this.state.pageSize,
            pageNo: page || this.state.currentPage,
            status: this.state.status,
            startTime: startTime !== null && startTime !== undefined ? startTime : this.state.startTime,
            endTime: endTime !== null && endTime !== undefined ? endTime : this.state.endTime,
            // contractId: param.pairId // redux来的合约ID
        })
        if (res && res.code === 0) {
            this.setState({
                dataList: res.data.item,
                total: res.data.total,
                loading: false,
            })
        } else {
            this.setState({
                dataList: [],
                total: 0,
                loading: false,
            })
        }
    }

    // 处理时间空间的change事件
    handleTime = (date) => {
        let startTime = ''
        let endTime = ''
        if (date.startTime !== null && date.startTime !== undefined && date.startTime !== '') {
            startTime = new Date(date.startTime).getTime()
        }
        if (date.startTime !== null && date.startTime !== undefined && date.startTime !== '') {
            endTime = new Date(date.endTime).getTime()
        }
        this.queryEntrustRecords(1, startTime, endTime)
        this.setState({
            currentPage: 1,
            startTime,
            endTime,
        })
    }

    handlePage = (page) => {
        this.queryEntrustRecords(page)
        this.setState({
            currentPage: page,
        })
    }

    render() {
        const dataHeader = [
            {
                name: <I18n>{t => t('fundManage.tranRecord.contractName')}</I18n>, // 合约名称
                key: 'action',
                width: '8%',
                render: item => <span className={item.orderDirection === 1 ? 'span-color-red' : 'span-color-green'}>{item.contractName}</span>
            }, {
                name: <I18n>{t => t('fundManage.tranRecord.typeChoose')}</I18n>, // 多空
                key: 'action',
                width: '6%',
                render: item => (
                    item.orderDirection === 1 ?
                        <span className="span-color-red"><I18n>{t => t('fundManage.tranRecord.filterBuySell1')}</I18n></span>
                        :
                        <span className="span-color-green"><I18n>{t => t('fundManage.tranRecord.filterBuySell2')}</I18n></span>
                )
            }, {
                name: <I18n>{t => t('fundManage.tranRecord.entrustType')}</I18n>, // 委托类型TODO
                key: 'action',
                width: '7%',
                render: (item) => {
                    if (item.orderType === 1) {
                        return <I18n>{t => t('fundManage.tranRecord.entrustType1')}</I18n>
                    } else if (item.orderType === 2) {
                        return <I18n>{t => t('fundManage.tranRecord.entrustType2')}</I18n>
                    } else if (item.orderType === 3) {
                        return <I18n>{t => t('fundManage.tranRecord.entrustType3')}</I18n>
                    } else if (item.orderType === 4) {
                        return <I18n>{t => t('fundManage.tranRecord.entrustType4')}</I18n>
                    } else if (item.orderType === 5) {
                        return <I18n>{t => t('fundManage.tranRecord.entrustType5')}</I18n>
                    }
                    return '--'
                }
            }, {
                name: <I18n>{t => t('fundManage.tranRecord.entrustPrice')}</I18n>, // 委托价格
                key: 'action',
                width: '10%',
                render: (item) => (
                    item.price !== undefined && item.price.length !== undefined && item.price.length >= 10 ?
                        <Popover
                            placement="top"
                            content={<div>{item.price}</div>}
                        >
                            <span>{`${item.price.slice(0, 9)}...`}</span>
                        </Popover>
                        :
                        <span>{`${item.price}`}</span>
                )
            }, {
                name: <I18n>{t => t('fundManage.tranRecord.entrustPriceNum')}</I18n>, // 委托金额TODO
                key: 'action',
                width: '12%',
                render: (item) => (
                    item.entrustValue !== undefined && item.entrustValue.length !== undefined && item.entrustValue.length >= 17 ?
                        <Popover
                            placement="top"
                            content={<div>{item.entrustValue}</div>}
                        >
                            <span>{`${item.entrustValue.slice(0, 16)}...`}</span>
                        </Popover>
                        :
                        <span>{`${item.entrustValue}`}</span>
                )
            }, {
                name: <I18n>{t => t('fundManage.tranRecord.entrustStatus')}</I18n>, // 委托状态
                key: 'action',
                width: '9%',
                render: (item) => {
                    if (item.status === 8) {
                        return <I18n>{t => t('fundManage.tranRecord.filterWeituo1')}</I18n>
                    } else if (item.status === 9) {
                        return <I18n>{t => t('fundManage.tranRecord.filterWeituo2')}</I18n>
                    } else if (item.status === 10) {
                        return <I18n>{t => t('fundManage.tranRecord.filterWeituo3')}</I18n>
                    } else if (item.status === 3) {
                        return <I18n>{t => t('fundManage.tranRecord.filterWeituo4')}</I18n>
                    } else if (item.status === 4) {
                        return <I18n>{t => t('fundManage.tranRecord.filterWeituo5')}</I18n>
                    }
                    return '--'
                }
            }, {
                name: <I18n>{t => t('fundManage.tranRecord.bargainPrice')}</I18n>, // 成交均价
                key: 'purchasePrice',
                width: '10%'
            }, {
                name: <I18n>{t => t('fundManage.tranRecord.hasEntrustNum')}</I18n>, // 已成交金额TODO
                key: 'filledValue',
                width: '12%',
                render: (item) => (
                    item.filledValue !== undefined && item.filledValue.length !== undefined && item.filledValue.length >= 17 ?
                        <Popover
                            placement="top"
                            content={<div>{item.filledValue}</div>}
                        >
                            <span>{`${item.filledValue.slice(0, 16)}...`}</span>
                        </Popover>
                        :
                        <span>{`${item.filledValue}`}</span>
                )
            }, {
                name: <I18n>{t => t('fundManage.tranRecord.notEntrustNum')}</I18n>, // 未成交金额TODO
                key: 'unfilledValue',
                width: '12%',
                render: (item) => (
                    item.unfilledValue !== undefined && item.unfilledValue.length !== undefined && item.unfilledValue.length >= 17 ?
                        <Popover
                            placement="top"
                            content={<div>{item.unfilledValue}</div>}
                        >
                            <span>{`${item.unfilledValue.slice(0, 16)}...`}</span>
                        </Popover>
                        :
                        <span>{`${item.unfilledValue}`}</span>
                )
            }, {
                name: <I18n>{t => t('fundManage.tranRecord.entrustTime')}</I18n>, // 委托时间
                key: 'action',
                width: '13%',
                align: 'right',
                render: item => <span>{moment(item.gmtCreate).format('YYYY-MM-DD HH:mm:ss')}</span>
            }
        ]
        return (
            <I18n>
                {
                    (t) => {
                        this.t = t
                        return (
                            <div className="entrust-records">
                                <div className="record-filter">
                                    <div className="inline-style">
                                        <span className="time-style">{t('fundManage.tranRecord.time')}</span>
                                        <DataPicker className="picker-style" onChange={this.handleTime} />
                                    </div>
                                </div>
                                <div className="record-body">
                                    <Spin spinning={this.state.loading}>
                                        <MoneyTable
                                            model="theme"
                                            dataSource={this.state.dataList}
                                            dataHeader={dataHeader}
                                        />
                                        {
                                            this.state.total && this.state.total > 0 ?
                                                <Pagination size="small" current={this.state.currentPage} className="pagination" total={this.state.total} onChange={this.handlePage} />
                                                :
                                                null
                                        }
                                    </Spin>
                                </div>
                            </div>
                        )
                    }
                }
            </I18n>
        )
    }
}

export default EntrustRecords
