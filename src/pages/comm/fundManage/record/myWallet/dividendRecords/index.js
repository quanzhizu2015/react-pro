import React from 'react'
import { I18n } from 'react-i18next'
import { Select, Pagination } from 'antd'
import moment from 'moment'
import { connect } from 'react-redux'
import Spin from '@/components/loading'
import DataPicker from '@/components/datapicker'
import MoneyTable from '@/components/moneyTable'
// import Message from '@/components/message'
import './index.scss'


@connect(state => ({
    apis: state.apis,
    // userAuth: state.userAuth,
}))
// 分红记录
class DividendRecords extends React.Component {
    constructor() {
        super()
        this.state = {
            dataList: [],
            currentPage: 1,
            pageSize: 10,
            total: 0,
            startTime: '',
            endTime: '',
            selectType: 0,
            loading: false,
        }
    }

    componentDidMount() {
        // 获取权益分红列表
        this.queryDividendRecords()
    }

    handleTypeChange = (e) => {
        this.queryDividendRecords(1, e)
        this.setState({
            currentPage: 1,
            selectType: e
        })
    }

    queryDividendRecords = async (page, type, startTime, endTime) => {
        this.setState({
            loading: true,
        })
        let profitType = type
        if (type !== null && type !== undefined) {
            if (type === 0) {
                profitType = null
            }
        } else {
            profitType = this.state.selectType === 0 ? null : this.state.selectType
        }
        const param = {
            pageNo: page || this.state.currentPage,
            pageSize: this.state.pageSize,
            startTime: startTime !== null && startTime !== undefined ? startTime : this.state.startTime,
            endTime: endTime !== null && endTime !== undefined ? endTime : this.state.endTime,
            profitType,
        }
        const res = await this.props.apis.getDividendRecords(param)
        if (res && res.code === 0) {
            this.setState({
                total: res.data.total,
                dataList: res.data.data,
                loading: false,
            })
        } else {
            this.setState({
                total: 0,
                dataList: [],
                loading: false
            })
        }
    }

    handleTime = (date) => {
        let startTime = ''
        let endTime = ''
        if (date.startTime !== null && date.startTime !== undefined && date.startTime !== '') {
            startTime = new Date(date.startTime).getTime()
        }
        if (date.startTime !== null && date.startTime !== undefined && date.startTime !== '') {
            endTime = new Date(date.endTime).getTime()
        }
        this.queryDividendRecords(1, this.state.selectType, startTime, endTime)
        this.setState({
            startTime,
            endTime,
            currentPage: 1,
        })
    }

    handlePage = (page) => {
        this.queryDividendRecords(page)
        this.setState({
            currentPage: page
        })
    }

    render() {
        const { Option } = Select
        const typelist = [
            {
                id: 0,
                value: <I18n>{t => t('fundManage.tranRecord.allType')}</I18n>,
            },
            {
                id: 1,
                value: <I18n>{t => t('fundManage.tranRecord.lockDividend')}</I18n>,
            },
            {
                id: 2,
                value: <I18n>{t => t('fundManage.tranRecord.notLockDividend')}</I18n>,
            }
        ]
        const dataHeader = [
            {
                name: <I18n>{t => t('fundManage.tranRecord.lockTypes')}</I18n>,
                key: 'action',
                width: '30%',
                render: item => (
                    item.profitType === 1 ?
                        <span><I18n>{t => t('fundManage.tranRecord.lockDividend')}</I18n></span>
                        :
                        <span><I18n>{t => t('fundManage.tranRecord.notLockDividend')}</I18n></span>
                )
            }, {
                name: <I18n>{t => t('fundManage.tranRecord.dividendNum')}</I18n>,
                key: 'profitAmount',
                width: '30%'
            }, {
                name: <I18n>{t => t('fundManage.tranRecord.lockTime')}</I18n>,
                key: 'action',
                width: '30%',
                render: item => <span>{moment(item.gmtCreate).format('YYYY-MM-DD HH:mm:ss')}</span>
            }, {
                name: <I18n>{t => t('fundManage.tranRecord.lockStatus')}</I18n>,
                key: 'action',
                width: '10%',
                align: 'right',
                render: item => (
                    item.status === 1 ?
                        <span><I18n>{t => t('fundManage.tranRecord.toAccount')}</I18n></span>
                        :
                        <span><I18n>{t => t('fundManage.tranRecord.notToAccount')}</I18n></span>
                )
            }
        ]
        return (
            <I18n>
                {
                    (t) => {
                        this.t = t
                        return (
                            <div className="dividend-records">
                                <div className="record-filter">
                                    <div className="inline-style">
                                        <span className="from-style">{t('fundManage.tranRecord.transfertype')}</span>
                                        <Select defaultValue={0} className="select-style" style={{ width: '130px', height: '25px' }} onChange={this.handleTypeChange}>
                                            {
                                                typelist === [] ?
                                                    <Option value={0}>
                                                        {t('fundManage.tranRecord.allType')}
                                                    </Option>
                                                    :
                                                    typelist.map(item => (
                                                        <Option value={item.id} key={item.id}>
                                                            {item.value}
                                                        </Option>
                                                    ))
                                            }
                                        </Select>
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

export default DividendRecords
