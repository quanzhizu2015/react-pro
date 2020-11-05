import React from 'react'
import { I18n } from 'react-i18next'
import { Pagination, Select } from 'antd'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import moment from 'moment'
import Button from '@/components/button'
import MoneyTable from '@/components/moneyTable'
import NotifyPop from '@/components/notifyPop'
import Message from '@/components/message'
import './transfer.scss'
import DataPicker from '../../../../components/datapicker'
// import securty from '../../../../assets/js/security'
// import base64 from 'crypto-js/enc-base64'
// // import Base64 from 'crypto-js/enc-base64'
// import sha256 from 'crypto-js/sha256'

const REG = /^\d+(\.\d*)?$/ // eslint-disable-line
// const REG = /^\d+[\.\d+]*$/
const accountType = {
    walletAccount: 1,
    contractAccount: 2
}
const minCoinNum = 0.00000001 // 最小划转金额
const USDK_ID = 2 // USDK对应的ID
const selectList = [
    {
        key: '0',
        value: <I18n>{t => t('transfer.accountall')}</I18n>
    }, {
        key: '1',
        value: <I18n>{t => t('transfer.mywallet')}</I18n>
    }, {
        key: '2',
        value: <I18n>{t => t('transfer.account')}</I18n>
    }
]
@connect(state => ({
    apis: state.apis,
    userAuth: state.userAuth,
}))
export default class Transfer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            myWalletBalance: '',
            accountBalance: '',
            dataHeader: [
                {
                    name: <I18n>{t => t('transfer.from')}</I18n>,
                    key: 'fromTypeLabel',
                    width: '25%'
                }, {
                    name: <I18n>{t => t('transfer.totype')}</I18n>,
                    key: 'toTypeLabel',
                    width: '25%'
                }, {
                    name: <I18n>{t => t('transfer.amount')}</I18n>,
                    key: 'amount',
                    width: '25%'
                }, {
                    name: <I18n>{t => t('transfer.time')}</I18n>,
                    key: 'txTime',
                    width: '25%'
                }
            ],
            dataList: [],
            total: 0,
            currentPage: 1,
            pageSize: 10,
            fromType: 0,
            toType: 0,
            startTime: '',
            endTime: '',
            toTypeValue: selectList[0].value,
            visable: false,
            setvisable: false,
            zijinPass: '',
            passErrorMsg: '',
            txFrom: 1,
            txTo: 2,
            inputFromMyWallet: '',
            errorFromMyWallet: '',
            inputFromAccount: '',
            errorFromAccount: '',
            isHashPosition: false, // 是否持仓，带交易模块加入后从接口获取
            loading: false
        }
    }
    componentDidMount() {
        this.textInput.focus()
        this.queryValidatorCoin()
        this.getTransferRecord(this.state.currentPage, this.state.pageSize)
    }
    // 获取划转记录
    getTransferRecord = async (currentPage, pageSizeDef, fromType, toType, startTime, endTime) => {
        const param = {
            pageNo: currentPage,
            pageSize: pageSizeDef,
        }
        if (fromType && fromType !== '' && fromType !== '0') {
            param.fromType = fromType
        }
        if (toType && toType !== '' && toType !== '0') {
            param.toType = toType
        }
        if (startTime && startTime !== '' && startTime !== '0') {
            param.startTime = new Date(startTime).getTime()
        }
        if (endTime && endTime !== '' && endTime !== '0') {
            param.endTime = new Date(endTime).getTime()
        }
        const result = await this.props.apis.queryTransferRecord(param)
        if (result && result.code === 0) {
            const datalist = result.data.data
            if (datalist && datalist.length > 0) {
                for (let i = 0; i < datalist.length; i += 1) {
                    if (datalist[i].fromType === accountType.walletAccount) {
                        datalist[i].fromTypeLabel = <I18n>{t => t('transfer.mywallet')}</I18n>
                        datalist[i].toTypeLabel = <I18n>{t => t('transfer.account')}</I18n>
                    } else {
                        datalist[i].fromTypeLabel = <I18n>{t => t('transfer.account')}</I18n>
                        datalist[i].toTypeLabel = <I18n>{t => t('transfer.mywallet')}</I18n>
                    }
                    datalist[i].txTime = moment(datalist[i].gmtCreate).format('YYYY-MM-DD HH:mm:ss')
                }
                this.setState({
                    dataList: datalist,
                    total: result.data.total,
                    currentPage
                })
            } else if (currentPage - 1 > 0) {
                this.getTransferRecord(
                    currentPage - 1,
                    pageSizeDef,
                    fromType,
                    toType,
                    startTime,
                    endTime
                )
            } else {
                this.setState({
                    dataList: [],
                    total: 0,
                    currentPage: 1
                })
            }
        } else {
            Message.error(result.msg)
        }
    }
    getGoogleValue = (e) => {
        this.setState({
            zijinPass: e.target.value
        })
    }
    // 处理‘从’下拉框的选中
    handleFrom = (value) => {
        // 修改toType
        let toTypekey = this.state.toType
        let { toTypeValue } = this.state
        if (value === selectList[1].key) {
            toTypekey = selectList[2].key
            toTypeValue = selectList[2].value
        } else if (value === selectList[2].key) {
            toTypekey = selectList[1].key
            toTypeValue = selectList[1].value
        } else {
            toTypekey = selectList[0].key
            toTypeValue = selectList[0].value
        }
        this.getTransferRecord(
            this.state.currentPage,
            this.state.pageSize,
            value,
            toTypekey,
            this.state.startTime,
            this.state.endTime
        )
        this.setState({
            fromType: value,
            toType: toTypekey,
            toTypeValue
        })
    }
    // 处理‘至’下拉框的选中，暂时没用
    handleTo = (value) => {
        this.getTransferRecord(
            this.state.currentPage,
            this.state.pageSize,
            this.state.fromType,
            value,
            this.state.startTime,
            this.state.endTime
        )
        this.setState({
            toType: value
        })
    }
    // 处理时间选择框的选择
    handleTime = (data) => {
        this.getTransferRecord(
            this.state.currentPage,
            this.state.pageSize,
            this.state.fromType,
            this.state.toType,
            data.startTime,
            data.endTime
        )
        this.setState({
            startTime: data.startTime,
            endTime: data.endTime
        })
    }
    // 点击划转按钮时
    transferClick = async (from, to) => {
        if (from === 1) {
            // 表示当前为我的钱包到合约账户，检查errorFromMyWallet是否存在值，存在，则不可点击
            if (this.state.errorFromMyWallet !== '' || this.state.inputFromMyWallet === '') {
                return
            }
        } else if (from === 2) {
            // 表示当前为合约账户到我的钱包，检查errorFromAccount是否存在值，存在，则不可点击
            if (this.state.errorFromAccount !== '' || this.state.inputFromAccount === '') {
                return
            }
        }
        if (this.props.userAuth.isFundPwdSet === false) {
            await this.setState({
                setvisable: true,
                visable: false
            })
        } else {
            try {
                const resv = await this.props.apis.verifyPassword()
                if (resv.code === 0) {
                    let inputValue = ''
                    if (from === 1) {
                        inputValue = this.state.inputFromMyWallet
                    } else {
                        inputValue = this.state.inputFromAccount
                    }
                    const res = await this.props.apis.transferMoney({
                        fromType: from,
                        toType: to,
                        amount: inputValue,
                    })
                    if (res && res.code === 0) {
                        if (from === 1) {
                            this.setState({
                                visable: false,
                                zijinPass: '',
                                inputFromMyWallet: ''
                            })
                        } else {
                            this.setState({
                                visable: false,
                                zijinPass: '',
                                inputFromAccount: ''
                            })
                        }
                        Message.success(this.t('fundManage.walletTrans.successInfo'))
                        // 划转成功，刷新数据
                        this.queryValidatorCoin()
                        this.getTransferRecord(
                            this.state.currentPage,
                            this.state.pageSize,
                            this.state.fromType,
                            this.state.toType,
                            this.state.startTime,
                            this.state.endTime
                        )
                    }
                } else {
                    await this.setState({
                        setvisable: false,
                        visable: true,
                        txFrom: from,
                        txTo: to
                    })
                    this.passInput.focus()
                }
            } catch (e) {
                Message.error(e.message)
            }
        }
    }
    // 处理分页函数
    handlePage = (page) => {
        this.getTransferRecord(
            page,
            this.state.pageSize,
            this.state.fromType,
            this.state.toType,
            this.state.startTime,
            this.state.endTime
        )
        this.setState({
            currentPage: page
        })
    }
    // 划转输入资金密码表单提交
    handleConfirm = async () => {
        if (this.state.zijinPass === '') {
            this.setState({ passErrorMsg: this.t('transfer.passnotnull') })
        } else {
            if (!this.state.loading) {
                try {
                    // const secredPwd = sha256(`123${this.state.zijinPass}`)
                    // const Pwd = base64.stringify(secredPwd)
                    // const Pwd = securty(1, this.state.zijinPass)
                    const Pwd = this.state.zijinPass
                    const resv = await this.props.apis.verifyPwd({ password: Pwd })
                    if (resv.code === 0) {
                        let inputValue = ''
                        this.setState({
                            loading: true
                        })
                        if (this.state.txFrom === 1) {
                            inputValue = this.state.inputFromMyWallet
                        } else {
                            inputValue = this.state.inputFromAccount
                        }
                        const res = await this.props.apis.transferMoney({
                            fromType: this.state.txFrom,
                            toType: this.state.txTo,
                            amount: inputValue,
                            // password: this.state.zijinPass
                        })
                        if (res && res.code === 0) {
                            if (this.state.txFrom === 1) {
                                this.setState({
                                    visable: false,
                                    zijinPass: '',
                                    inputFromMyWallet: ''
                                    // visable1: true,
                                })
                            } else {
                                this.setState({
                                    visable: false,
                                    zijinPass: '',
                                    inputFromAccount: ''
                                    // visable1: true,
                                })
                            }
                            Message.success(this.t('fundManage.walletTrans.successInfo'))
                            // 划转成功，刷新数据
                            this.queryValidatorCoin()
                            this.getTransferRecord(
                                this.state.currentPage,
                                this.state.pageSize,
                                this.state.fromType,
                                this.state.toType,
                                this.state.startTime,
                                this.state.endTime
                            )
                        }
                    }
                } catch (e) {
                    Message.error(this.t('transfer.transferfail'))
                }
            }
            this.setState({
                loading: false
            })
        }
    }
    enterPress = (e) => {
        if (e.which === 13) {
            this.handleConfirm()
        }
    }
    cancelHandle = () => {
        this.setState({
            visable: false,
            setvisable: false
        })
    }
    handleInputFromMyWallet = (e) => {
        // 判断是否合法
        let inputValue = e.target.value
        if (inputValue === '') {
            this.setState({
                inputFromMyWallet: inputValue,
                errorFromMyWallet: ''
            })
        } else {
            inputValue = inputValue.replace(/^()*(\d+)\.(\d\d\d\d\d\d\d\d).*$/, '$1$2.$3') // 禁止输入八位以上的小数
            let errorFromMyWallet = ''
            const reg = /^[0-9]+.?[0-9]*$/ // 判断是否是数字
            if (!REG.test(inputValue)) return
            if (!reg.test(inputValue)) {
                // 不是两位小数
                errorFromMyWallet = <I18n>{t => t('transfer.errorNum')}</I18n>
                return
            } else if (Number(inputValue) < minCoinNum) {
                // 输入的数据不为最小提现额度
                errorFromMyWallet = <I18n>{t => t('transfer.errorNum')}</I18n>
            } else if (Number(inputValue) > this.state.myWalletBalance) {
                // 输入的数据超过了可用额度
                errorFromMyWallet = <I18n>{t => (<p>{t('transfer.errorValidator')}<Link to="/trade/spot">{t('transfer.usdktransfer')}</Link>{t('transfer.errorValidator2')}</p>)}</I18n>
            }
            this.setState({
                inputFromMyWallet: inputValue,
                errorFromMyWallet
            })
        }
    }
    handleInputFromAccount = (e) => {
        // 判断是否合法
        let inputValue = e.target.value
        if (inputValue === '') {
            this.setState({
                inputFromAccount: inputValue,
                errorFromAccount: ''
            })
        } else {
            inputValue = inputValue.replace(/^()*(\d+)\.(\d\d\d\d\d\d\d\d).*$/, '$1$2.$3') // 禁止输入八位以上的小数
            let errorFromAccount = ''
            const reg = /^[0-9]+.?[0-9]*$/ // 判断是否是数字
            if (!REG.test(inputValue)) return
            if (!reg.test(inputValue)) {
                // 不是数字
                errorFromAccount = <I18n>{t => t('transfer.errorNum')}</I18n>
                return
            } else if (Number(inputValue) < minCoinNum) {
                // 输入的数据不为最小提现额度
                errorFromAccount = <I18n>{t => t('transfer.errorNum')}</I18n>
            } else if (Number(inputValue) > this.state.accountBalance) {
                // 输入的数据超过了可用额度
                errorFromAccount = <I18n>{t => t('transfer.errorValidator3')}</I18n>
            }
            this.setState({
                inputFromAccount: inputValue,
                errorFromAccount
            })
        }
    }
    goToForget = () => {
        this.props.history.push('/comm/security/forgetfundpassword')
    }
    // 查询可用资产
    queryValidatorCoin = async () => {
        let walletAmount = 0.00
        const result = await this.props.apis.queryWallet()
        if (result && result.code === 0) {
            const walletCoins = result.data.item
            for (let i = 0; i < walletCoins.length; i += 1) {
                if (walletCoins[i].assetId === USDK_ID) {
                    walletAmount = walletCoins[i].amount
                    break
                }
            }
        } else {
            Message.error(result.msg)
        }
        let accountAmount = 0.00
        const res = await this.props.apis.fundInfo()
        if (res && res.code === 0) {
            accountAmount = res.data.available
            // 判断：用户是否持仓，有则显示tips提示！
            if (res.data.lockedAmount && res.data.margin && (Number(res.data.lockedAmount) !== 0 || Number(res.data.margin) !== 0)) {
                this.setState({ isHashPosition: true })
            }
        } else {
            // Message.error(result.msg)
            Message.error(res.msg)
        }
        this.setState({
            inputFromMyWallet: walletAmount,
            myWalletBalance: walletAmount,
            inputFromAccount: accountAmount,
            accountBalance: accountAmount,
        })
    }
    render() {
        const { Option } = Select
        return (
            <I18n>
                {
                    (t) => {
                        this.t = t
                        return (
                            <div className="transfer-body">
                                <div className="transfer-wallet">
                                    <div className="center-line">
                                        <div className="display-inline">
                                            <div className="wallet-title">
                                                <span>{t('transfer.mywallet')}</span>
                                                <div>
                                                    <svg className="icon" aria-hidden="true">
                                                        <use xlinkHref="#iconhuazhuanlan1" />
                                                    </svg>
                                                </div>
                                                <span>{t('transfer.account')}</span>
                                            </div>
                                            <div className="transfer-num">
                                                <span className="number-style">{t('transfer.transferAmount')}</span>
                                                <div className="input-body">
                                                    <input type="text" className="input-style" onChange={this.handleInputFromMyWallet} value={this.state.inputFromMyWallet} ref={(input) => { this.textInput = input }} />
                                                    <span className="button-span">
                                                        <Button className="button-blue" onClick={() => this.transferClick(1, 2)}>{t('transfer.transferButton')}</Button>
                                                        {/* <span className="balance-style">{t('transfer.validatorBalance')}{this.state.myWalletBalance}&nbsp;USDT</span> */}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="error-style">
                                                <span>
                                                    {this.state.errorFromMyWallet}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="right-block">
                                        <div className="display-inline">
                                            <div className="wallet-title">
                                                <span>{t('transfer.account')}</span>
                                                <div>
                                                    <svg className="icon" aria-hidden="true">
                                                        <use xlinkHref="#iconhuazhuanhong1" />
                                                    </svg>
                                                </div>
                                                <span>{t('transfer.mywallet')}</span>
                                            </div>
                                            <div className="transfer-num">
                                                <span className="number-style">{t('transfer.transferAmount')}</span>
                                                <div className="input-body">
                                                    <input className="input-style" onChange={this.handleInputFromAccount} value={this.state.inputFromAccount} />
                                                    <span className="button-span">
                                                        <Button className="button-blue button-red" onClick={() => this.transferClick(2, 1)}>{t('transfer.transferButton')}</Button>
                                                        {/* <span className="balance-style">{t('transfer.validatorBalance')}{this.state.accountBalance}&nbsp;USDT</span> */}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="error-style">
                                                <span>
                                                    {this.state.errorFromAccount}
                                                </span>
                                            </div>
                                            <div className={this.state.isHashPosition ? 'tips-message-style' : 'tips-message-style hidden'}>
                                                <span>{t('transfer.tipsMessage')}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div className="semi-circle2" />
                                    <div className="semi-circle" /> */}
                                    {/* <div className="display-inline">
                                        <hr className="center-line" />
                                    </div> */}
                                </div>
                                <div className="transfer-record">
                                    <div className="record-header">
                                        <span className="record-title">{t('transfer.transferRecord')}</span>
                                        <div className="record-filter">
                                            <div className="inline-style">
                                                <span className="from-style">{t('transfer.from')}</span>
                                                <Select defaultValue="0" className="select-style" style={{ width: '100px', height: '25px' }} onChange={this.handleFrom}>
                                                    {
                                                        selectList.map(item => (
                                                            <Option value={item.key} key={item.key}>
                                                                {item.value}
                                                            </Option>
                                                        ))
                                                    }
                                                </Select>
                                                <span className="to-style">{t('transfer.totype')}</span>
                                                {/* <Select defaultValue="0"
                                                    className="select-style"
                                                    style={{ width: '100px', height: '25px' }}
                                                    onChange={this.handleTo}>
                                                    {
                                                        selectList.map(item => (
                                                            <Option value={item.key} key={item.key}>
                                                                {item.value}
                                                            </Option>
                                                        ))
                                                    }
                                                </Select> */}
                                                {/* <Input
                                                    className="select-style"
                                                    style={{ width: '100px', height: '25px' }}
                                                    value={this.state.toTypeValue}
                                                    disabled
                                                /> */}
                                                <span className="select-style totype-style">
                                                    {this.state.toTypeValue}
                                                </span>
                                                <span className="time-style">{t('transfer.time')}</span>
                                                <DataPicker className="picker-style" onChange={this.handleTime} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="record-body">
                                        <MoneyTable
                                            model="theme"
                                            dataSource={this.state.dataList}
                                            dataHeader={this.state.dataHeader}
                                        />
                                        {
                                            this.state.total && this.state.total > 0 ?
                                                <Pagination style={{ textAlign: 'right', paddingBottom: '20px' }} current={this.state.currentPage} size="small" total={this.state.total} onChange={this.handlePage} />
                                                :
                                                null
                                        }
                                    </div>
                                </div>
                                {/* 设置资金密码 */}
                                <NotifyPop
                                    // type="primary"
                                    visable={this.state.setvisable}
                                    width="410"
                                    height="233"
                                    cancel={this.cancelHandle}
                                >
                                    <div className="transferBox-value">
                                        <h5>{t('fundManage.walletTrans.setpwdtradeTitle')}</h5>
                                        <div className="transferBox-con">
                                            <p className="p">{t('fundManage.walletTrans.setpwdtradeText')}</p>
                                            <Link className="a" to="/comm/security/bindfundpassword">
                                                {t('fundManage.walletTrans.error14')}
                                            </Link>
                                        </div>
                                    </div>
                                </NotifyPop>
                                <NotifyPop
                                    // type="primary"
                                    visable={this.state.visable}
                                    width="410"
                                    height="233"
                                    confirm={this.handleConfirm}
                                    cancel={this.cancelHandle}
                                    loading={this.state.loading}
                                >
                                    <div className="transferBox-value">
                                        <h5>{t('transfer.cointransfer')}</h5>
                                        <div className="transferBox-con">
                                            <input
                                                ref={(passInput) => { this.passInput = passInput }}
                                                autoComplete="new-password"
                                                type="password"
                                                onChange={(e) => { this.getGoogleValue(e) }}
                                                placeholder={t('transfer.passplaceholder')}
                                                onKeyPress={(e) => { this.enterPress(e) }}
                                            />
                                            <p className="transferBox-forget" onClick={this.goToForget}>{t('transfer.forgetpass')}</p>
                                            <p>{this.state.passErrorMsg}</p>
                                        </div>
                                    </div>
                                </NotifyPop>
                            </div>
                        )
                    }
                }
            </I18n>
        )
    }
}
