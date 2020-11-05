import React from 'react'
import { I18n } from 'react-i18next'
import { Select, Pagination } from 'antd'
import { connect } from 'react-redux'
import moment from 'moment'
import Spin from '@/components/loading'
import MoneyTable from '@/components/moneyTable'
// import Message from '@/components/message'
import './index.scss'

/*eslint-disable*/
@connect(state => ({
    apis: state.apis,
    // userAuth: state.userAuth,
}))
class LockRecords extends React.Component {
    constructor() {
        super()
        this.state = {
            dataList: [],
            currentPage: 1,
            pageSize: 10,
            total: 0,
            selectType: 0,
            loading: false,
        }
    }

    componentDidMount() {
        // 获取权益分红列表
        this.queryLockRecords()
    }

    handleTypeChange = (e) => {
        this.queryLockRecords(1, e)
        this.setState({
            currentPage: 1,
            selectType: e
        })
    }

    queryLockRecords = async (page, type) => {
        this.setState({
            loading: true,
        })
        let operateType = type
        if (type !== null && type !== undefined) {
            if (type === 0) {
                operateType = null
            }
        } else {
            operateType = this.state.selectType === 0 ? null : this.state.selectType
        }
        const param = {
            pageNo: page || this.state.currentPage,
            pageSize: this.state.pageSize,
            type: operateType,
        }
        const res = await this.props.apis.getLockedList(param)
        if (res && res.code === 0) {
            this.setState({
                total: res.data.total,
                dataList: res.data.list,
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

    handlePage = (page) => {
        this.queryLockRecords(page)
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
                value: <I18n>{t => t('fundManage.tranRecord.lockOperateFOTA')}</I18n>,
            },
            {
                id: 2,
                value: <I18n>{t => t('fundManage.tranRecord.unLockOperateFOTA')}</I18n>,
            }
        ]
        const dataHeader = [
            {
                name: <I18n>{t => t('fundManage.tranRecord.coinType')}</I18n>,
                key: 'assetName',
                width: '20%'
            }, {
                name: <I18n>{t => t('fundManage.tranRecord.amount')}</I18n>,
                key: 'amount',
                width: '20%'
            }, {
                name: <I18n>{t => t('fundManage.tranRecord.lockTime')}</I18n>,
                key: 'action',
                width: '20%',
                render: item => <span>{moment(item.gmtCreate).format('YYYY-MM-DD HH:mm:ss')}</span>
            }, {
                name: <I18n>{t => t('fundManage.tranRecord.lockTypes')}</I18n>,
                key: 'action',
                width: '20%',
                render: item => (
                    item.type === 1 ?
                        <span><I18n>{t => t('fundManage.tranRecord.lockOperateFOTA')}</I18n></span>
                        :
                        <span><I18n>{t => t('fundManage.tranRecord.unLockOperateFOTA')}</I18n></span>
                )
            }, {
                name: <I18n>{t => t('fundManage.tranRecord.lockTypesInfo')}</I18n>,
                key: 'action',
                width: '20%',
                render: item => {
                  switch (item.operateType) {
                    case 1:
                        return <span>认购赠送锁仓</span>
                    case 2:
                        return <span>平台发放锁仓</span>
                    case 3:
                        return <span>自然解锁</span>
                    case 4:
                        return <span>加速解锁</span>
                    case 5:
                        return <span>注册赠送锁仓</span>
                    case 6:
                        return <span>邀请赠送锁仓</span>
                    default:
                    }
                }
            }
        ]
        return (
            <I18n>
                {
                    (t) => {
                        this.t = t
                        return (
                            <div className="lock-records">
                                <div className="record-filter">
                                    <div className="inline-style">
                                        <span className="from-style">{t('fundManage.tranRecord.transfertype')}</span>
                                        <Select defaultValue={0} className="select-style" style={{ width: '100px', height: '25px' }} onChange={this.handleTypeChange}>
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
                                    </div>
                                </div>
                                <div className="record-body">
                                    <Spin spinning={this.state.loading} classs="loadingT">
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

export default LockRecords
