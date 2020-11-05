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
class makeBargainRecords extends React.Component {
    constructor() {
        super()
        this.state = {
            dataList: [],
            pageSize: 10,
            currentPage: 1,
            total: 0,
            startTime: '',
            endTime: '',
            loading: false,
        }
    }

    componentDidMount() {
        this.queryEntrustRecords()
    }

    // 查询成交历史记录
    queryEntrustRecords = async (page, startTime, endTime) => {
        this.setState({
            loading: true
        })
        const res = await this.props.apis.tradeMatched({
            pageSize: this.state.pageSize,
            pageNo: page || this.state.currentPage,
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
                width: '12%',
                render: item => <span className={item.orderDirection === 1 ? 'span-color-red' : 'span-color-green'}>{item.contractName}</span>
            }, {
                name: <I18n>{t => t('fundManage.tranRecord.typeChoose')}</I18n>, // 多空
                key: 'action',
                width: '13%',
                render: item => (
                    item.orderDirection === 1 ?
                        <span className="span-color-red"><I18n>{t => t('fundManage.tranRecord.filterBuySell1')}</I18n></span>
                        :
                        <span className="span-color-green"><I18n>{t => t('fundManage.tranRecord.filterBuySell2')}</I18n></span>
                )
            }, {
                name: <I18n>{t => t('fundManage.tranRecord.bargainType')}</I18n>, // 成交类型
                key: 'action',
                width: '15%',
                render: (item) => {
                    if (item.closeType === 1) {
                        return <I18n>{t => t('fundManage.tranRecord.bargainType1')}</I18n>
                    } else if (item.closeType === 2) {
                        return <I18n>{t => t('fundManage.tranRecord.bargainType2')}</I18n>
                    } else if (item.closeType === 3) {
                        return <I18n>{t => t('fundManage.tranRecord.bargainType3')}</I18n>
                    } else if (item.closeType === 4) {
                        return <I18n>{t => t('fundManage.tranRecord.bargainType4')}</I18n>
                    } else if (item.closeType === 5) {
                        return <I18n>{t => t('fundManage.tranRecord.bargainType5')}</I18n>
                    }
                    return '--'
                }
            }, {
                name: <I18n>{t => t('fundManage.tranRecord.makePrice')}</I18n>, // 成交价格
                key: 'action',
                width: '15%',
                render: item => (
                    item.filledPrice !== undefined && item.filledPrice.length !== undefined && item.filledPrice.length >= 10 ?
                        <Popover
                            placement="top"
                            content={<div>{item.filledPrice}</div>}
                        >
                            <span>{`${item.filledPrice.slice(0, 9)}...`}</span>
                        </Popover>
                        :
                        <span>{`${item.filledPrice}`}</span>
                )
            }, {

                name: <I18n>{t => t('fundManage.tranRecord.bargainNum')}</I18n>, // 成交金额TODO
                key: 'action',
                width: '20%',
                render: item => (
                    item.matchValue !== undefined && item.matchValue.length !== undefined && item.matchValue.length >= 17 ?
                        <Popover
                            placement="top"
                            content={<div>{item.matchValue}</div>}
                        >
                            <span>{`${item.matchValue.slice(0, 16)}...`}</span>
                        </Popover>
                        :
                        <span>{`${item.matchValue}`}</span>
                )
            }, {
                name: <I18n>{t => t('fundManage.tranRecord.feePrice')}</I18n>, // 手续费
                key: 'fee',
                width: '10%'
            }, {
                name: <I18n>{t => t('fundManage.tranRecord.bargainTime')}</I18n>, // 成交时间
                key: 'action',
                width: '15%',
                align: 'right',
                render: item => <span>{moment(item.filledDate).format('YYYY-MM-DD HH:mm:ss')}</span>
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

export default makeBargainRecords
