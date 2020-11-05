import React from 'react'
import { I18n } from 'react-i18next'
import { Pagination } from 'antd'
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
class ReferrRecords extends React.Component {
    constructor() {
        super()
        this.state = {
            dataList: [],
            currentPage: 1,
            pageSize: 10,
            total: 0,
            startTime: '',
            endTime: '',
            loading: false,
        }
    }

    componentDidMount() {
        // 获取返佣记录
        this.queryReferrRecords()
    }

    queryReferrRecords = async (page, startTime, endTime) => {
        this.setState({
            loading: true,
        })
        const param = {
            pageNo: page || this.state.currentPage,
            pageSize: this.state.pageSize,
            startTime: startTime !== null && startTime !== undefined ? startTime : this.state.startTime,
            endTime: endTime !== null && endTime !== undefined ? endTime : this.state.endTime,
        }
        const res = await this.props.apis.getReferrList(param)
        if (res && res.code === 0) {
            this.setState({
                total: res.data.rowCount,
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
        this.queryReferrRecords(1, startTime, endTime)
        this.setState({
            startTime,
            endTime,
            currentPage: 1,
        })
    }

    handlePage = (page) => {
        this.queryReferrRecords(page)
        this.setState({
            currentPage: page
        })
    }

    render() {
        const dataHeader = [
            {
                name: <I18n>{t => t('fundManage.tranRecord.referrNum')}</I18n>,
                key: 'totalRebate',
                width: '35%'
            }, {
                name: <I18n>{t => t('fundManage.tranRecord.referrTime')}</I18n>,
                key: 'action',
                width: '35%',
                render: item => <span>{moment(item.time).format('YYYY-MM-DD HH:mm:ss')}</span>
            }, {
                name: <I18n>{t => t('fundManage.tranRecord.referrStatus')}</I18n>,
                key: 'action',
                width: '30%',
                align: 'right',
                render: item => (
                    item.status === 1 ?
                        <span><I18n>{t => t('fundManage.tranRecord.referrrStatus1')}</I18n></span>
                        :
                        <span><I18n>{t => t('fundManage.tranRecord.referrStatus2')}</I18n></span>
                )
            }
        ]
        return (
            <I18n>
                {
                    (t) => {
                        this.t = t
                        return (
                            <div className="referr-records">
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

export default ReferrRecords
