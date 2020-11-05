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
    lang: state.lang,
    // userAuth: state.userAuth,
}))
// 分红记录
class OptionRecords extends React.Component {
    constructor() {
        super()
        this.state = {
            dataList: [],
            currentPage: 1,
            pageSize: 10,
            total: 0,
            startTime: '',
            endTime: '',
            currency: '',
            loading: false,
        }
    }
    componentDidMount() {
        // 获取权益分红列表
        this.queryDividendRecords()
    }
    queryDividendRecords = async (page, startTime, endTime, currency) => {
        this.setState({
            loading: true,
        })
        const param = {
            pageNum: page || this.state.currentPage,
            pageSize: this.state.pageSize,
            startTime: startTime !== null && startTime !== undefined ? startTime : this.state.startTime,
            endTime: endTime !== null && endTime !== undefined ? endTime : this.state.endTime,
            currency: currency !== null && currency !== undefined ? currency : this.state.currency,
        }
        const res = await this.props.apis.optionRecords(param)
        if (res && res.code === 0) {
            this.setState({
                total: res.data.total,
                dataList: res.data.record,
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
    exportRecordsList = async () => {
        const { startTime, endTime, currency } = this.state
        // console.log(`http://${location.host}/api/option/order/export?startTime=${startTime}&endTime=${endTime}&lang=${this.props.lang}`)
        window.open(`${location.protocol}//${location.host}/api/option/order/export?startTime=${startTime}&endTime=${endTime}&lang=${this.props.lang}&currency=${currency}`)
        // await this.props.apis.exportRecords({ startTime, endTime })
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
        this.queryDividendRecords(1, startTime, endTime)
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

    handleTypeChange = (type) => {
        const { startTime, endTime } = this.state
        this.queryDividendRecords(1, startTime, endTime, type)
        this.setState({
            currency: type
        })
    }

    render() {
        const { Option } = Select
        const typelist = [
            {
                id: '',
                value: <I18n>{t => t('fundManage.tranRecord.allType')}</I18n>,
            },
            {
                id: 2,
                value: 'BTC',
            },
            {
                id: 3,
                value: 'ETH',
            },
            {
                id: 4,
                value: 'FOTA',
            },
            {
                id: 9,
                value: 'DOGE',
            },
            {
                id: 999,
                value: 'DEMO',
            },
        ]
        const dataHeader = [
            {
                name: <I18n>{t => t('fundManage.tranRecord.accountType')}</I18n>,
                key: 'action',
                width: '10%',
                align: 'left',
                render: item => {
                    let accountName = null
                    switch (item.currency) {
                    case 2: accountName = 'BTC'; break
                    case 3: accountName = 'ETH'; break
                    case 4: accountName = 'FOTA'; break
                    case 9: accountName = 'DOGE'; break
                    case 999: accountName = 'DEMO'; break
                    default: accountName = 'Unknow'; break
                    }
                    return accountName
                }
            }, {
                name: <I18n>{t => t('fundManage.tranRecord.buyTime')}</I18n>,
                key: 'action',
                width: '15%',
                render: item => <span>{moment(item.tradingTime).format('YYYY-MM-DD HH:mm:ss')}</span>
            }, {
                name: <I18n>{t => t('fundManage.tranRecord.pingcangTime')}</I18n>,
                key: 'action',
                width: '15%',
                render: item => <span>{moment(item.settlementTime).format('YYYY-MM-DD HH:mm:ss')}</span>
            }, {
                name: <I18n>{t => t('fundManage.tranRecord.biaodiZichan')}</I18n>,
                key: 'asset',
                width: '10%',
                align: 'center',
            }, {
                name: <I18n>{t => t('fundManage.tranRecord.investment')}</I18n>,
                key: 'price',
                width: '15%',
                align: 'center',
            }, {
                name: <I18n>{t => t('fundManage.tranRecord.profit')}</I18n>,
                key: 'action',
                width: '15%',
                align: 'center',
                render: item => (
                    item.profit > 0 ? `+${item.profit}` : item.profit
                )
            }, {
                name: <I18n>{t => t('fundManage.tranRecord.valuement')}</I18n>,
                key: 'action',
                width: '20%',
                align: 'right',
                render: item => (
                    (item.price + item.profit).toFixed(8)
                )
            }
        ]
        return (
            <I18n>
                {
                    (t) => {
                        this.t = t
                        return (
                            <div className="option-records">
                                <div className="record-filter">
                                    <div className="inline-style">
                                        <span className="from-style">{t('fundManage.tranRecord.transfertype')}</span>
                                        <Select defaultValue="" className="select-style" style={{ width: '130px', height: '25px' }} onChange={this.handleTypeChange}>
                                            {
                                                typelist === [] ?
                                                    <Option value="">
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
                                        <div className="export-btn" onClick={this.exportRecordsList}>{t('fundManage.tranRecord.export')}</div>
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

export default OptionRecords
