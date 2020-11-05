import React from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { Pagination, Icon, Select, Upload } from 'antd'

import NotifyPop from '@/components/notifyPop'
import message from '@/components/message'
import Spin from '@/components/loading'

import './index.scss'

const { Option } = Select

function getBase64(img, callback) {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result))
    reader.readAsDataURL(img)
}
function beforeUpload(file) {
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!')
    }
    return isLt2M
}
// const payTypesName = {
//     2: '微信',
//     1: '支付',
//     0: '银行'
// }
// const payTypesIcon = {
//     2: 'wechat',
//     1: 'alipay',
//     0: 'credit-card'
// }
const tableWidth = ['13.6%', '16.6%', '22.6%', '19.6%', '13.6%', '13.6%']
const ulList = [{
    id: 1,
    name: '我要购买'
},
{
    id: 0,
    name: '我要出售'
}]
@withRouter

@connect(state => ({
    userAuth: state.userAuth,
    apis: state.apis,
    saveCoinimg: state.saveCoinimg,
    coinImg: state.coinImg,
    c2cCurrency: state.c2cCurrency,
}))
export default class C2C extends React.Component {
    constructor() {
        super()
        this.state = {
            activeIndex: 1,
            dealIndex: -1,
            adList: [],
            loadingState: true,
            total: null,
            currentPage: 1,
            amount: '',
            loading: false,
            imageUrl: '',
            imgUrl: '',
            payType: null,
            payId: '',
            realName: '',
            bankName: '',
            // paySwitchFlag: false,
            // paySwitch: null
        }
    }
    componentDidMount() {
        this.init()
        this.getSelfPayInfo()
        // this.getAdList()
    }
    componentWillReceiveProps(nextProp) {
        if (nextProp.c2cCurrency && nextProp.c2cCurrency !== this.props.c2cCurrency) {
            this.setState({ loadingState: true })
            this.getAdList(nextProp.c2cCurrency)
        }
    }
    getSelfPayInfo = async () => {
        const res = await this.props.apis.LookPersonSellInfo()
        if (res.code === 0) {
            const x = []
            res.data.forEach(element => {
                x.push(element.payType)
            })
            this.setState({ selfPayInfo: x })
        }
    }
    // 获取广告列表
    getAdList = async (c2cCurrency) => {
        try {
            const { activeIndex, currentPage } = this.state
            // 对于buy 实际上对广告商来说是卖
            // const pageI = page || 1
            const params = {
                direction: activeIndex,
                pageSize: 5,
                pageIndex: currentPage || 1,
                assetId: c2cCurrency ? c2cCurrency.id : this.props.c2cCurrency.id
            }
            const res = await this.props.apis.getC2CList(params)
            if (res.code === 0) {
                this.setState({
                    adList: res.data.list,
                    total: res.data.total,
                    loadingState: false,
                })
            }
        } catch (e) {
            message.error(e.message)
        }
    }
    init = () => {
        if (this.props.c2cCurrency) {
            this.getAdList()
        } else {
            setTimeout(() => { this.init() }, 100)
        }
    }
    // 选择买入卖出
    chooseIndex = (id) => {
        this.setState({
            activeIndex: id,
            loadingState: true,
        }, () => { this.getAdList() })
    }
    // 选择订单，展开信息
    dealChoose = (id) => {
        if (!this.props.userAuth) {
            message.warning('请先登录！')
            localStorage.setItem('pathName', '/comm/c2c/ad')
            this.props.history.push('/common/login')
            return false
        }
        this.setState({ dealIndex: id, amount: '' })
        return true
    }
    // 买卖下单
    placeOrder = (item) => {
        const returnTrue = this.accMul(this.state.amount, item.price)
        if (returnTrue < item.minPrice) {
            message.warning('下单金额小于商家限额')
            return false
        }
        // const { selfPayInfo, activeIndex } = this.state
        // const arry = [{
        //     icon: 'iconfont iconzhifubao',
        //     title: '支付宝',
        //     flag: item.isStandAlipay && (activeIndex === 1 || selfPayInfo.lastIndexOf(1) >= 0),
        //     payType: 1,
        //     adId: item.id,
        //     assetId: item.assetId
        // },
        // {
        //     icon: 'iconfont iconyinhangka',
        //     title: '银行',
        //     flag: item.isStandBank && (activeIndex === 1 || selfPayInfo.lastIndexOf(0) >= 0),
        //     payType: 0,
        //     adId: item.id,
        //     assetId: item.assetId
        // }, {
        //     icon: 'iconfont iconweixin1',
        //     title: '微信',
        //     flag: item.isStandWechat && (activeIndex === 1 || selfPayInfo.lastIndexOf(2) >= 0),
        //     payType: 2,
        //     adId: item.id,
        //     assetId: item.assetId
        // }].filter(itemIndex => itemIndex.flag === true)
        // if (activeIndex === 1) {
        //     this.SwitchPlaceOrder(arry[0])
        //     return false
        // }
        // this.setState({
        //     paySwitch: arry,
        //     paySwitchFlag: true
        // })
        // return true
        this.SwitchPlaceOrder(item)
        return true
    }
    // 下单接口
    SwitchPlaceOrder = (item) => {
        const {
            amount,
            activeIndex,
            dealIndex,
            adList
        } = this.state
        const { c2cCurrency } = this.props
        const arr = adList.filter(itemIndex => itemIndex.id === dealIndex)
        const config = {
            adId: item.id,
            assetId: item.assetId,
            assetName: c2cCurrency.name,
            currency: 'CNY',
            amount: Number(amount),
            // payType: item.payType,
            direction: activeIndex,
            price: Number(arr[0].price)
        }
        this.props.apis.placeOrder(config).then((res) => {
            if (res.code === 0) {
                message.success('下单成功!')
                // this.getAdList()
                this.props.history.push(`/comm/c2cInfo?id=${res.data}`)
            }
        }).then(() => {
            // this.setState({
            //     paySwitchFlag: false
            // })
        })
    }
    showAddPayment = async () => { // item
        if (this.state.direct !== 'buy') {
            this.setState({
                AddpaymentMethod: true,
                // advItem: item,
            })
        }
    }
    // 选择支付方式
    handleSelectChange = current => {
        // console.log(current)
        this.setState({
            payType: current
        })
    }
    handleChangeImg = info => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true })
            return
        }
        const imgUrl = info.file.response.data
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, imageUrl =>
                this.setState({
                    imageUrl,
                    loading: false,
                    imgUrl
                }))
        }
    }
    CancalPayfor = () => {
        this.setState({
            AddpaymentMethod: false,
            // advItem: null
        })
    }
    // CancelModal = () => {
    //     if (this.state.paySwitchFlag) {
    //         this.setState({
    //             paySwitchFlag: false
    //         })
    //     } else {
    //         this.setState({
    //             paySwitchFlag: true
    //         })
    //     }
    // }
    Submbit = () => {
        const {
            payType,
            payId,
            realName,
            bankName,
            imgUrl,
        } = this.state
        const config = {
            payType,
            payId,
            realName,
            bankName,
            payQr: imgUrl,
        }
        this.props.apis.bindUserInfo(config).then((res) => {
            if (res.code === 0) {
                this.setState({
                    payId: '',
                    realName: '',
                    bankName: '',
                    imageUrl: '',
                    imgUrl: '',
                    AddpaymentMethod: false
                })
                message.success('绑定成功')
                this.getSelfPayInfo()
            }
        })
    }
    checkPayType = (item) => {
        const { selfPayInfo } = this.state
        const x = []
        if (item.isStandAlipay) {
            x.push(1)
        }
        if (item.isStandBank) {
            x.push(0)
        }
        if (item.isStandWechat) {
            x.push(2)
        }
        if (!selfPayInfo) {
            return false
        }
        let rst = false
        x.forEach(payInfo => {
            if (selfPayInfo.lastIndexOf(payInfo) >= 0) {
                rst = true
                return rst
            }
            return true
        })
        return rst
    }
    handleChange = (item, e) => {
        this.setState({
            [item]: e.target.value
        })
    }
    // 关闭下单
    cancelOrder = () => {
        this.setState({
            dealIndex: null,
            amount: ''
        })
    }
    /* eslint-disable */
    // 更改输入框
    handleAmountInput = (e, item) => {
        const { maxDecimalPlaces } = this.props.c2cCurrency // 最大小数位数
        let { value } = e.target
        // 非数字替换掉，除了数字和.
        value = value.replace(/[^\d\.]/g, '')
        // 保证第一个为数字而不是.
        value = value.replace(/^\./g, '')
        // 保证连续只有出现一个.而没有多个.
        value = value.replace(/\.{2,}/g, '.')
        // 保证.只出现一次，而不能出现两次以上
        value = value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
        // 判断是否是小数
        if (value.indexOf('.') > -1) {
            if (value.toString().split(".")[1].length > maxDecimalPlaces) {
                message.info(`最大小数位数为${maxDecimalPlaces}位`)
                return false
            }
        }
        const value1 = Math.floor(this.accMul(value, item.price))
        if (value1 <= item.maxPrice) {
            this.setState({
                amount: value
            })
        } else {
            message.warning('输入金额不在商家限额范围内')
        }
    }
    /* eslint-disable */
    accMul = (arg1, arg2) => {
        let m = 0
        const s1 = arg1.toString()
        const s2 = arg2.toString()
        try {
            m += s1.split('.')[1].length
        } catch (e) {
            // message.warning(e)
        }
        try {
            m += s2.split('.')[1].length
        } catch (e) {
            // message.warning(e)
        }
        const end1 = Number(s1.replace('.', ''))
        const end2 = Number(s2.replace('.', ''))
        const end3 = 10 ** m
        const end4 = (end1 * end2) / end3
        return end4.toFixed(2)
    }
    renderPayment = (item) => {
        let _map = [
            { title: "支付宝", flag: item.isStandAlipay },
            { title: "银行卡", flag: item.isStandBank },
            { title: "微信", flag: item.isStandWechat }
        ].filter(flags => flags.flag === 1)
        return _map.map((title, index) => <span className="span_sell" key={title.title}>{title.title}{_map.length - 1 === index ? "" : "/"}</span>)
    }
    filterColor = (id) => {
        const { activeIndex } = this.state
        if (id === activeIndex && id === 0) {
            return '#E74C4C'
        } else if (id === activeIndex && id === 1) {
            return '#4CC273'
        } else {
            return null
        }
    }
    render() {
        const {
            activeIndex,
            adList,
            dealIndex,
            loadingState,
            loading,
            payType,
            imageUrl,
            // paySwitch
        } = this.state
        const { c2cCurrency } = this.props
        const uploadButton = (
            <div className="addPayForm_columns">
                <Icon type={loading ? "loading" : "plus"} />
                <div className="ant-upload-text">请上传二维码</div>
            </div>
        )
        return (
            <div className="c2c-ad">
                <ul className="c2c-ad-title">
                    {
                        ulList.map(item => (
                            <li
                                style={{ color: this.filterColor(item.id) }}
                                onClick={() => { this.chooseIndex(item.id) }}
                                key={item.id}
                            >
                                {item.name}
                            </li>
                        ))
                    }
                </ul>
                <ul className="c2c-ad-table">
                    <li className="c2c-ad-th flexLi">
                        <div style={{width: tableWidth[0]}}>商家</div>
                        <div style={{width: tableWidth[1]}}>数量</div>
                        <div style={{width: tableWidth[2]}}>限额</div>
                        <div style={{width: tableWidth[3]}}>单价</div>
                        <div style={{width: tableWidth[4]}}>支付方式</div>
                        <div style={{width: tableWidth[5]}}>操作</div>
                    </li>
                    <Spin spinning={loadingState} classs="loadingT">
                        {
                            adList && adList.length > 0 ?
                                <React.Fragment>
                                    {
                                        adList.map(item => (
                                            <React.Fragment>
                                                {
                                                    item.id === dealIndex ?
                                                        <li className="activeLi flexLi">
                                                            <div className="activeLi-item">
                                                                <p>{item.userNickName}</p>
                                                                <p>{item.amount} {item.assetName}</p>
                                                                <p>
                                                                    {item.isStandWechat ? <i className="iconfont iconweixin1" /> : null}
                                                                    {item.isStandAlipay ? <i className="iconfont iconzhifubao" /> : null}
                                                                    {item.isStandBank ? <i className="iconfont iconyinhangka" /> : null}
                                                                </p>
                                                            </div>
                                                            <div className="activeLi-item">
                                                                <p className="weight">{item.price} {item.currency}</p>
                                                                <p>{item.minPrice}-{item.maxPrice} {item.currency}</p>
                                                            </div>
                                                            {
                                                                activeIndex === 0 &&  !this.checkPayType(item) ?
                                                                    <div className="activeLi-item-last">
                                                                        <p>
                                                                            买家支持&nbsp;
                                                                            {
                                                                                this.renderPayment(item)
                                                                            }
                                                                            &nbsp; 向您付款，您需要添加并激活相应收款方式
                                                                            <span className="cursor" onClick={() => this.showAddPayment(item)}>&nbsp;去添加</span>
                                                                        </p>
                                                                        <p className="cancel"  onClick={() => { this.cancelOrder() }}>取消</p>
                                                                    </div>
                                                                    :
                                                                    <div className="activeLi-item-last-input">
                                                                        <input
                                                                            className="coinInput"
                                                                            type="text"
                                                                            placeholder={c2cCurrency.name}
                                                                            onChange={(e) => this.handleAmountInput(e, item)}
                                                                            value={this.state.amount}
                                                                        />
                                                                        <i className="iconfont iconzhuanhuan" />
                                                                        <input
                                                                            type="text"
                                                                            placeholder="CNY"
                                                                            readOnly="readonly"
                                                                            value={
                                                                                this.state.amount ?
                                                                                    this.accMul(this.state.amount, item.price)
                                                                                    :
                                                                                    ''
                                                                            }
                                                                        />
                                                                        <p className="btn" onClick={() => { this.placeOrder(item) }}>下单</p>
                                                                        <span className="cancel" onClick={() => { this.cancelOrder() }}>取消</span>
                                                                        {
                                                                            item.direction === 1 ?
                                                                                <p className="p-tip">买方付款限时为15分钟</p>
                                                                                :
                                                                                null
                                                                        }
                                                                    </div>
                                                            }
                                                        </li>
                                                        :
                                                        <li className="flexLi">
                                                            <div className="li-item" style={{width: tableWidth[0]}}>{item.userNickName}</div>
                                                            <div className="li-item" style={{width: tableWidth[1]}}>{item.amount} {item.assetName}</div>
                                                            <div className="li-item" style={{width: tableWidth[2]}}>{item.minPrice}-{item.maxPrice} {item.currency}</div>
                                                            <div className="li-item weight" style={{width: tableWidth[3]}}>{item.price} {item.currency}</div>
                                                            <div className="li-item" style={{width: tableWidth[4]}}>
                                                                {item.isStandWechat ? <i className="iconfont iconweixin1" /> : null}
                                                                {item.isStandAlipay ? <i className="iconfont iconzhifubao" /> : null}
                                                                {item.isStandBank ? <i className="iconfont iconyinhangka" /> : null}
                                                            </div>
                                                            <div className="li-item" style={{width: tableWidth[5]}}>
                                                                <p
                                                                    onClick={() => { this.dealChoose(item.id) }}
                                                                    className={activeIndex === 1 ? 'buy' : null}
                                                                >
                                                                    {activeIndex === 1 ? '购买' : '出售'}
                                                                </p>
                                                            </div>
                                                        </li>
                                                }
                                            </React.Fragment>
                                        ))
                                    }
                                </React.Fragment>
                                :
                                <li className="noData">
                                    <svg className="icon" aria-hidden="true" width="100">
                                        <use xlinkHref="#iconzanwushuju-bai1" width="100" />
                                    </svg>
                                    <br />
                                    暂无数据
                                </li>
                        }
                    </Spin>
                </ul>
                {
                    adList && this.state.total > 5 ?
                        <Pagination
                            style={{ textAlign: 'center' }}
                            current={this.state.currentPage}
                            pageSize={5}
                            total={this.state.total}
                            onChange={(e) => { this.setState({ currentPage: e }, () => { this.getAdList() }) }}
                        />
                        :
                        null
                }
                <NotifyPop
                    visable={this.state.AddpaymentMethod}
                    width="540"
                    height="600"
                    confirm={this.Submbit}
                    cancel={this.CancalPayfor}
                >
                    <div className="c2c-payType">
                        <h5>添加收款方式</h5>
                        <div className="c2c-payItem">
                            <p className="label">支付方式</p>
                            <Select
                                placeholder="请选择支付方式"
                                style={{ width: '100%', height: '36px' }}
                                onChange={this.handleSelectChange}
                            >
                                <Option value="2">微信</Option>
                                <Option value="1">支付宝</Option>
                                <Option value="0">银行卡</Option>
                            </Select>
                        </div>
                        <div className="c2c-payItem">
                            <p className="label">支付账号</p>
                            <input
                                placeholder="请输入您的支付账号"
                                value={this.state.payId}
                                onChange={(e) => { this.setState({ payId: e.target.value })}}
                            />
                        </div>
                        <div className="c2c-payItem">
                            <p className="label">真实姓名</p>
                            <input
                                placeholder="请输入您的真实姓名"
                                value={this.state.realName}
                                onChange={(e) => { this.setState({ realName: e.target.value })}}
                            />
                        </div>
                        {
                            payType !== '0' ?
                                <div className="c2c-payItem">
                                    <p className="label">二维码</p>
                                    <Upload
                                        name="file"
                                        listType="picture-card"
                                        onChange={this.handleChangeImg}
                                        beforeUpload={beforeUpload}
                                        showUploadList={false}
                                        action="/api/files/upload"
                                    >
                                        {imageUrl ? (
                                            <div style={{ height: "120px" }}>
                                                <img src={imageUrl} alt="avatar" style={{ maxHeight: "100%" }} />
                                            </div>
                                        ) : (
                                                uploadButton
                                            )}
                                    </Upload>
                                </div>
                                :
                                <div className="c2c-payItem">
                                    <p className="label">开户行</p>
                                    <input
                                        placeholder="请输入您的开户行"
                                        value={this.state.bankName}
                                        onChange={(e) => { this.setState({ bankName: e.target.value })}}
                                    />
                                </div>
                        }
                    </div>
                </NotifyPop>
                {/* <NotifyPop
                    visable={this.state.paySwitchFlag}
                    width="540"
                    height="330"
                    cancel={this.CancelModal}
                >
                    <div className="popPayType">
                        <h5>请选择收款方式</h5>
                        <ul>
                            {
                                paySwitch ?
                                    paySwitch.map(item => (
                                        <li
                                            onClick={() => this.SwitchPlaceOrder(item)}
                                        >
                                            <i className={item.icon} />
                                            <span>{item.title}</span>
                                        </li>
                                    ))
                                    :
                                    null
                            }
                        </ul>
                    </div>
                </NotifyPop> */}
            </div>
        )
    }
}
