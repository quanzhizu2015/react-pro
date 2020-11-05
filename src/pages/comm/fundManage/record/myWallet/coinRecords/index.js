import React from 'react'
import { I18n } from 'react-i18next'
import { Select, Pagination } from 'antd'
import moment from 'moment'
import { connect } from 'react-redux'

import Spin from '@/components/loading'
import DataPicker from '@/components/datapicker'
import MoneyTable from '@/components/moneyTable'
import NotifyPop from '@/components/notifyPop'
import Message from '@/components/message'
import './record.scss'
import DetailInfo from './detailInfo'

const statuslist = {
    pendingCheck: {
        key: 1,
        value: <I18n>{t => t('fundManage.tranRecord.pendingCheck')}</I18n>
    }, // 待审核
    refuseCheck: {
        key: 2,
        value: <I18n>{t => t('fundManage.tranRecord.refuseCheck')}</I18n>
    }, // 审核不通过
    pendingSend: {
        key: 3,
        value: <I18n>{t => t('fundManage.tranRecord.pendingSend')}</I18n>
    }, // 待发送
    pendingConfirm: {
        key: 4,
        value: <I18n>{t => t('fundManage.tranRecord.pendingConfirm')}</I18n>
    }, // 未确认
    alreadyConfirm: {
        key: 5,
        value: <I18n>{t => t('fundManage.tranRecord.alreadyConfirm')}</I18n>
    }, // 已确认
    fail: {
        key: 6,
        value: <I18n>{t => t('fundManage.tranRecord.fail')}</I18n>
    }, // 失败
    cancle: {
        key: 7,
        value: <I18n>{t => t('fundManage.tranRecord.cancle')}</I18n>
    }, // 取消
    // 失败
    checking: {
        key: 10,
        value: '审核中'
    }, // 取消
}
const typelist = {
    all: {
        key: 0,
        value: <I18n>{t => t('fundManage.tranRecord.allType')}</I18n>
    },
    chargeCoin: {
        key: 1,
        value: <I18n>{t => t('fundManage.tranRecord.chargeCoin')}</I18n>
    }, // 充币
    mentionCoin: {
        key: 2,
        value: <I18n>{t => t('fundManage.tranRecord.mentionCoin')}</I18n>
    } // 提币
}
const USDK_ID = 1
@connect(state => ({
    apis: state.apis
}))
export default class Record extends React.Component {
    constructor(props) {
        super(props)
        const types = [typelist.all, typelist.chargeCoin, typelist.mentionCoin]
        this.state = {
            dataHeader: [
                {
                    name: <I18n>{t => t('fundManage.tranRecord.coinType')}</I18n>,
                    key: 'assetName',
                    width: '12%'
                }, {
                    name: <I18n>{t => t('fundManage.tranRecord.time')}</I18n>,
                    key: 'txTime',
                    width: '23%'
                }, {
                    name: <I18n>{t => t('fundManage.tranRecord.transfertype')}</I18n>,
                    key: 'typeValue',
                    width: '15%'
                }, {
                    name: <I18n>{t => t('fundManage.tranRecord.amount')}</I18n>,
                    key: 'amount',
                    width: '15%'
                }, {
                    name: <I18n>{t => t('fundManage.tranRecord.fee')}</I18n>,
                    key: 'fee',
                    width: '15%'
                }, {
                    name: <I18n>{t => t('fundManage.tranRecord.status')}</I18n>,
                    key: 'statusValue',
                    width: '10%'
                }, {
                    name: <I18n>{t => t('fundManage.tranRecord.operation')}</I18n>,
                    key: 'action',
                    width: '10%',
                    align: 'right',
                    render: (item) => {
                        if (item.transferType === typelist.chargeCoin.key) {
                            // 当前为充币逻辑
                            // return (
                            //     <button
                            //         className="money-table-button"
                            //         onClick={(e) => {
                            //             this.handleDetailClick(e, item)
                            //         }}
                            //     >
                            //         <I18n>{t => t('fundManage.tranRecord.detail')}</I18n>
                            //     </button>
                            // )
                        }
                        // 下面表示提币
                        if (item.status === statuslist.pendingConfirm.key ||
                            item.status === statuslist.alreadyConfirm.key) {
                            return (
                                <button
                                    className="money-table-button"
                                    onClick={(e) => {
                                        this.handleDetailClick(e, item)
                                    }}
                                >
                                    <I18n>{t => t('fundManage.tranRecord.detail')}</I18n>
                                </button>
                            )
                        } else if (item.status === statuslist.pendingCheck.key) {
                            return (
                                <button
                                    className="money-table-button"
                                    onClick={() => {
                                        this.handleBack(item)
                                    }}
                                >
                                    <I18n>{t => t('fundManage.tranRecord.callback')}</I18n>
                                </button>
                            )
                        }
                        return (
                            <span style={{ marginRight: '13px' }}>--</span>
                        )
                    }
                }
            ],
            expand: {
                key: 'id',
                keyValue: null,
                expandRender: null
            },
            dataList: [],
            total: 0,
            currentPage: 1,
            pageSize: 10,
            coinType: 0,
            accountType: 0,
            startTime: '',
            endTime: '',
            coinTypeList: [{
                key: '0',
                value: <I18n>{t => t('transfer.accountall')}</I18n>
            }],
            typelist: types,
            item: {},
            visiable: false,
            expandVisible: false,
            loading: false,
        }
    }
    componentDidMount() {
        this.getTransferRecords(
            this.state.currentPage,
            this.state.pageSize,
            this.state.coinType,
            this.state.startTime,
            this.state.endTime,
            this.state.accountType
        )
        this.getCoinTypes()
    }
    getTransferRecords = async (page, pageSize, coinType, startTime, endTime, accountType) => {
        this.setState({
            loading: true,
        })
        const param = {
            pageNo: page,
            pageSize
        }
        if (coinType && coinType !== '' && coinType !== 0) {
            param.assetId = coinType
        }
        if (startTime && startTime !== '' && startTime !== 0) {
            param.startTime = new Date(startTime).getTime()
        }
        if (endTime && endTime !== '' && endTime !== 0) {
            param.endTime = new Date(endTime).getTime()
        }
        if (accountType && accountType !== '' && accountType !== 0) {
            param.transferType = accountType
        }
        const result = await this.props.apis.queryCoinRecord(param)
        if (result && result.code === 0) {
            // 将数据进行封装
            const { data } = result.data
            if (data.length > 0) {
                for (let i = 0; i < data.length; i += 1) {
                    data[i].txTime = moment(data[i].gmtCreate).format('YYYY-MM-DD HH:mm:ss')
                    if (data[i].transferType === typelist.chargeCoin.key) {
                        data[i].typeValue = typelist.chargeCoin.value
                        data[i].amount = `+${data[i].amount}`
                    } else {
                        data[i].typeValue = typelist.mentionCoin.value
                        data[i].amount = `-${data[i].amount}`
                    }
                    if (data[i].fee === 0 || data[i].fee === '0') {
                        data[i].fee = '--'
                    }
                    data[i].statusValue = this.getStatusValue(data[i].status)
                }
                this.setState({
                    dataList: data,
                    total: result.data.total,
                    currentPage: page,
                    loading: false,
                })
            } else if (page - 1 > 0) {
                this.getTransferRecords(
                    page - 1,
                    pageSize,
                    coinType,
                    startTime,
                    endTime,
                    accountType
                )
            } else {
                this.setState({
                    dataList: [],
                    total: 0,
                    currentPage: 1,
                    loading: false,
                })
            }
        } else {
            // Message.error(result.msg)
            this.setState({
                dataList: [],
                total: 0,
                currentPage: 1,
                loading: false,
            })
        }
    }
    getStatusValue = (key) => {
        if (key === statuslist.pendingCheck.key) {
            return statuslist.pendingCheck.value
        } else if (key === statuslist.refuseCheck.key) {
            return statuslist.refuseCheck.value
        } else if (key === statuslist.pendingSend.key) {
            return statuslist.pendingSend.value
        } else if (key === statuslist.pendingConfirm.key) {
            return statuslist.pendingConfirm.value
        } else if (key === statuslist.alreadyConfirm.key) {
            return statuslist.alreadyConfirm.value
        } else if (key === statuslist.fail.key) {
            return statuslist.fail.value
        } else if (key === statuslist.checking.key) {
            return statuslist.checking.value
        }
        return statuslist.cancle.value
    }
    getCoinTypes = async () => {
        const result = await this.props.apis.queryCoinTypes()
        const coinTypes = []
        // coinTYpes 中添加全部
        coinTypes.push({
            key: '0',
            value: <I18n>{t => t('transfer.accountall')}</I18n>
        })
        if (result && result.code === 0) {
            const { data } = result
            for (let i = 0; i < data.length; i += 1) {
                if (data[i].id !== USDK_ID) {
                    coinTypes.push({
                        key: data[i].id,
                        value: data[i].name
                    })
                }
            }
        } else {
            result.warning(result.msg)
        }
        this.setState({
            coinTypeList: coinTypes
        })
    }
    handlePage = (page) => {
        this.getTransferRecords(
            page,
            this.state.pageSize,
            this.state.coinType,
            this.state.startTime,
            this.state.endTime,
            this.state.accountType
        )
        this.setState({
            currentPage: page
        })
    }
    handleCoinType = (key) => {
        if (key === '0') {
            // 表示全部
            this.getTransferRecords(
                this.state.currentPage,
                this.state.pageSize,
                '',
                this.state.startTime,
                this.state.endTime,
                this.state.accountType
            )
            this.setState({
                coinType: ''
            })
        } else {
            this.getTransferRecords(
                this.state.currentPage,
                this.state.pageSize,
                key,
                this.state.startTime,
                this.state.endTime,
                this.state.accountType
            )
            this.setState({
                coinType: key
            })
        }
    }
    handleType = (key) => {
        if (key === '0') {
            // 表示全部
            this.getTransferRecords(
                this.state.currentPage,
                this.state.pageSize,
                this.state.coinType,
                this.state.startTime,
                this.state.endTime,
                ''
            )
            this.setState({
                accountType: ''
            })
        } else {
            this.getTransferRecords(
                this.state.currentPage,
                this.state.pageSize,
                this.state.coinType,
                this.state.startTime,
                this.state.endTime,
                key
            )
            this.setState({
                accountType: key
            })
        }
    }
    handleTime = (data) => {
        this.getTransferRecords(
            this.state.currentPage,
            this.state.pageSize,
            this.state.coinType,
            data.startTime,
            data.endTime,
            this.state.accountType
        )
        this.setState({
            startTime: data.startTime,
            endTime: data.endTime
        })
    }
    handleBack = (item) => {
        this.setState({
            item,
            visiable: true
        })
    }
    handleCancle = () => {
        this.setState({
            visiable: false
        })
    }
    handleConfirm = async () => {
        const result = await this.props.apis.calbackCoin({
            id: this.state.item.id
        })
        if (result && result.code === 0) {
            Message.success(this.t('fundManage.tranRecord.callbacksuccess'))
            this.handleCancle()
            this.getTransferRecords(
                this.state.currentPage,
                this.state.pageSize,
                this.state.coinType,
                this.state.startTime,
                this.state.endTime,
                this.state.accountType
            )
        } else {
            Message.error(result ? result.msg : this.t('fundManage.tranRecord.callbackfail'))
            this.handleCancle()
        }
    }
    handleDetailClick = (e, record) => {
        if (this.state.expandVisible === true) {
            // 表示已经打开
            if (this.state.expand.keyValue === record.id) {
                this.setState({
                    expand: {
                        key: 'id',
                        keyValue: null,
                        expandRender: null
                    },
                    expandVisible: false,
                })
            } else {
                this.setState({
                    expand: {
                        key: 'id',
                        keyValue: record[this.state.expand.key],
                        expandRender: <DetailInfo
                            item={record}
                            typelist={typelist}
                        />,
                        bLeft: e.target.offsetLeft,
                        bWidth: e.target.offsetWidth
                    },
                    expandVisible: true
                })
            }
        } else {
            this.setState({
                expand: {
                    key: 'id',
                    keyValue: record[this.state.expand.key],
                    expandRender: <DetailInfo
                        item={record}
                        typelist={typelist}
                    />,
                    bLeft: e.target.offsetLeft,
                    bWidth: e.target.offsetWidth
                },
                expandVisible: true
            })
        }
    }
    render() {
        const { Option } = Select
        return (
            <I18n>
                { (t) => {
                    this.t = t
                    return (
                        <div className="charge-money">
                            <div className="record-filter">
                                <div className="inline-style">
                                    <span className="from-style">{t('fundManage.tranRecord.coinType')}</span>
                                    <Select defaultValue="0" className="select-style" style={{ width: '100px', height: '25px' }} onChange={this.handleCoinType}>
                                        {
                                            this.state.coinTypeList === [] ?
                                                <Option value="全部" />
                                                :
                                                this.state.coinTypeList.map(item => (
                                                    <Option value={item.key} key={item.key}>
                                                        {item.value}
                                                    </Option>
                                                ))
                                        }
                                    </Select>
                                    <span className="time-style">{t('fundManage.tranRecord.time')}</span>
                                    <DataPicker className="picker-style" onChange={this.handleTime} />
                                    <span className="to-style">{t('fundManage.tranRecord.transfertype')}</span>
                                    <Select defaultValue={0} className="select-style" style={{ width: '100px', height: '25px' }} onChange={this.handleType}>
                                        {
                                            this.state.typelist.map(item => (
                                                <Option value={item.key} key={item.key}>
                                                    {item.value}
                                                </Option>
                                            ))
                                        }
                                    </Select>
                                </div>
                            </div>
                            <div className="record-body">
                                <Spin spinning={this.state.loading}>
                                    <MoneyTable
                                        model="theme"
                                        dataSource={this.state.dataList}
                                        dataHeader={this.state.dataHeader}
                                        // expandIdx={this.state.expandIdx}
                                        // expandPannel={this.state.expandPannel}
                                        expand={this.state.expand}
                                    />
                                    {
                                        this.state.total && this.state.total > 0 ?
                                            <Pagination size="small" current={this.state.currentPage} className="pagination" total={this.state.total} onChange={this.handlePage} />
                                            :
                                            null
                                    }
                                </Spin>
                            </div>
                            <NotifyPop
                                // type="primary"
                                visable={this.state.visiable}
                                width="310"
                                height="200"
                                confirm={this.handleConfirm}
                                cancel={this.handleCancle}
                            >
                                <div className="transferBox-value">
                                    <div className="transferBox-con">
                                        <p>{t('fundManage.tranRecord.confirmBack')}</p>
                                    </div>
                                </div>
                            </NotifyPop>
                        </div>
                    )
                }}
            </I18n>
        )
    }
}
