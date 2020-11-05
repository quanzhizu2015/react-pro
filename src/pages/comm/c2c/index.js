import React from 'react'
import { Pagination, Select, Modal, Form, Input, Icon, Upload, List, Avatar, Message, Button } from 'antd'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import Spin from '@/components/loading'
import History from './history'

import './index.scss'

import message from '@/components/message'
// import NotifyPop from '@/components/notifyPop'
import wechatImg from '@/assets/img/c2c/wechat.png'
import alipayImg from '@/assets/img/c2c/alipay.png'
import cardImg from '@/assets/img/c2c/bank.png'


const { Option } = Select

const payTypes = {
    weixin: 2,
    zhifubao: 1,
    yinhang: 0
}
function getBase64(img, callback) {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result))
    reader.readAsDataURL(img)
}
function beforeUpload(file) {
    // const isJPG = file.type === 'image/jpeg'
    // if (!isJPG) {
    //     message.error('You can only upload JPG file!')
    // }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!')
    }
    return isLt2M
}
const payTypesName = {
    2: '微信',
    1: '支付',
    0: '银行'
}
const payTypesIcon = {
    2: 'wechat',
    1: 'alipay',
    0: 'credit-card'
}
@withRouter
@connect(state => ({
    apis: state.apis,
    lang: state.lang,
    userAuth: state.userAuth
}))
export default class C2c extends React.Component {
    constructor() {
        super()
        this.state = {
            indexTab: 0,
            tableList: [],
            direct: 'buy',
            startT: 1,
            activeIndex: '',
            amount: '',
            selfPayInfo: [],
            AmountInputStyle: false,
            AddpaymentMethod: false,
            payType: null,
            advItem: null,
            loading: false,
            imageUrl: null,
            paySwitch: null,
            paySwitchFlag: false,
            bank_card: null,
            user_account: null,
            user_card: null,
            user_bank: null,
            reloadHistory: false,
            loadingState: true,
            c2cTabList: [
                {
                    name: '我要买入',
                    id: 0,
                },
                {
                    name: '我要卖出',
                    id: 1,
                }
            ],
            c2cCurrency: { name: null },
            currencyList: []
        }
    }
    componentWillMount() {
        this.urlInit()
    }
    componentDidMount() {
        if (this.props.lang !== 'zh') {
            this.props.history.push('/home')
        }
        this.getSelfPayInfo()
    }

    componentWillReceiveProps(props) {
        if (props.lang !== 'zh') {
            this.props.history.push('/home')
        }
    }

    // 获取币种列表
    getCurrencyList = async (id) => {
        const res = await this.props.apis.getC2CCurrency()
        if (res.code === 0) {
            if (res.data) {
                this.setState({ currencyList: res.data })
                if (!id) {
                    this.setState({
                        c2cCurrency: res.data[0]
                    }, () => { this.getAdList() })
                } else {
                    for (let i = 0; i < res.data.length; i += 1) {
                        if (Number(id) === Number(res.data[i].id)) {
                            this.setState({
                                c2cCurrency: res.data[i]
                            }, () => { this.getAdList() })
                        }
                    }
                }
            }
        }
    }
    // 获取广告列表
    getAdList = async (page, pageS) => {
        const { c2cCurrency, direct } = this.state
        // 对于buy 实际上对广告商来说是卖
        const pageI = page || 1
        const res = await this.props.apis.getC2CList({
            direction: direct === 'buy' ? 1 : 0,
            pageSize: pageS || 5,
            pageIndex: pageI,
            assetId: c2cCurrency.id
        })
        if (res.code === 0) {
            this.setState({
                tableList: res.data.list,
                total: res.data.total,
                startT: pageI,
                loadingState: false
            }, () => {
            })
        } else {
            this.setState({ loadingState: false })
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
    // 获取URL参数
    urlInit = () => {
        const params = this.props.history.location.search.substr(1)
        const urlSearchParam = new URLSearchParams(params)
        const assetsId = urlSearchParam.get('id')
        if (!assetsId) {
            this.getCurrencyList()
            return false
        }
        this.getCurrencyList(assetsId)
        return true
    }
    // 选择币种
    chooseAssets = (item) => {
        this.setState({
            loadingState: true,
            c2cCurrency: item
        }, () => { this.getAdList() })
    }
    // 选择tab
    chooseTab = (e) => {
        this.setState({
            loadingState: true,
            indexTab: e,
            activeIndex: ''
        })
        if (e === 0) {
            this.setState({ direct: 'buy' }, () => { this.getAdList() })
        }
        if (e === 1) {
            this.setState({ direct: 'sell' }, () => { this.getAdList() })
        }
    }
    showAddPayment = async (item) => {
        /* let di = 0 */
        if (this.state.direct !== 'buy') {
            this.setState({
                AddpaymentMethod: true,
                advItem: item,
            })
        }
        // 对于buy 实际上对广告商来说是卖
        /* if (this.state.direct === 'buy') {
            di = 1
         } */

        /* const res = await this.props.apis.placeOrder({
            adId: advId,
            assetId: assetI,
            assetName: assetN,
            currency: curry,
            amount: Number(this.state.amount),
            direction: di,
            payType: 1,
        })
        if (res.code === 0) {
            // console.log('ok')
        } else if (res.code === 401) {
            this.props.history.push(`/common/login?hrefLink=${encodeURIComponent(location.pathname)}`)
        } */
    }
    chooseItem = (item) => {
        if (!this.props.userAuth) {
            message.warning('您还没有登录哦')
            this.props.history.push('/common/login')
            return false
        }
        // 如果是买的话直接弹出
        // console.log(this.state.direct)
        // if (this.state.direct === 'buy') {
        if (this.state.activeIndex === item.id) {
            this.setState({ activeIndex: '' })
            return false
        }
        this.setState({
            activeIndex: item.id,
            amount: '',
        })
        // } else {
        //     if (item.)
        //     console.log('sell')
        // }
        return true
    }
    /* eslint-disable */
    handleAmountInput = (e, item) => {
        const { maxDecimalPlaces } = this.state.c2cCurrency // 最大小数位数
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
        // const reg = /[^0-9]/g
        // // const { amount } = this.state
        // if (!reg.test(e.target.value)) {
        //     const value = Math.floor(this.accMul(e.target.value, item.price))
        //     // const value = parseInt(amount + e.target.value, 10)
        //     if (value <= item.maxPrice) {
        //         this.setState({
        //             amount: e.target.value
        //         })
        //     } else {
        //         message.warning('输入金额不在商家限额范围内')
        //     }
        // } else {
        //     message.warning('请输入数字')
        // }
    }
    handleSelectChange = current => {
        this.setState({
            payType: payTypes[current]
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
    /* eslint-disable */
    accMul = (arg1, arg2) => {
        let m = 0
        const s1 = arg1.toString()
        const s2 = arg2.toString()
        try {
            m += s1.split('.')[1].length
        } catch (e) {
        }
        try {
            m += s2.split('.')[1].length
        } catch (e) {
        }
        const end1 = Number(s1.replace('.', ''))
        const end2 = Number(s2.replace('.', ''))
        const end3 = 10 ** m
        return (end1 * end2) / end3
    }
    CancalPayfor = () => {
        this.setState({
            AddpaymentMethod: false,
            advItem: null
        })
    }
    //买卖下单
    placeOrder = (item) => {
        const returnTrue = this.accMul(this.state.amount, item.price)
        if (returnTrue < item.minPrice) {
            message.warning('下单金额小于商家限额')
            return false
        }
        const { selfPayInfo, direct } = this.state
      
        const arry = [{
            title: "支付宝", flag: item.isStandAlipay && (direct === 'buy' || selfPayInfo.lastIndexOf(1) >= 0) , Icon: alipayImg, payType: 1, adId: item.id, color: "#6495ED",
            assetId: item.assetId
        },
        {
            title: "银行", flag: item.isStandBank && (direct === 'buy' || selfPayInfo.lastIndexOf(0) >= 0), Icon: cardImg, payType: 0, adId: item.id, color: "#00CD00",
            assetId: item.assetId
        }, {
            title: "微信", flag: item.isStandWechat && (direct === 'buy' || selfPayInfo.lastIndexOf(2) >= 0), Icon: wechatImg, payType: 2, adId: item.id, color: "#EEC900",
            assetId: item.assetId
        }].filter((item) => item.flag === true);
        if (arry.length === 1) {
            this.SwtichPlaceOrder(arry[0]);
        }
        else {
            this.setState({
                paySwitch: arry,
                paySwitchFlag: true
            })
        }
    }
    CancelModal = () => {
        if (this.state.paySwitchFlag) {
            this.setState({
                paySwitchFlag: false
            })
        }
        else {
            this.setState({
                paySwitchFlag: true
            })
        }
    }
    SwtichPlaceOrder = (item) => {
        const { amount, c2cCurrency, activeIndex, tableList } = this.state
        const direct = this.state.direct === 'buy' ? 1: 0;
        const arr = tableList.filter(item => item.id === activeIndex )
        const config = {
            adId: item.adId,
            assetId: item.assetId,
            assetName: c2cCurrency.name,
            currency: "CNY",
            amount: Number(amount),
            payType: item.payType,
            direction: direct,
            price: Number(arr[0].price)
        }
        this.props.apis.placeOrder(config).then((res) => {
            if (res.code === 0) {
                Message.success("下单成功", 1);
                this.getAdList()
                this.setState({ reloadHistory: !this.state.reloadHistory })
            }
        }).then(() => {
            this.setState({
                paySwitchFlag: false
            })
        })
    }
    renderPayment = (item) => {
        let _map = [{ title: "支付宝", flag: item.isStandAlipay }, { title: "银行卡", flag: item.isStandBank }, { title: "微信", flag: item.isStandWechat }].filter(flags => flags.flag === 1)
        return _map.map((title, index) => <span className="span_sell" key={title.title}>{title.title}{_map.length - 1 === index ? "" : "/"}</span>)
    }
    Submbit = () => {
        if (this.state.payType === 0) {
            const config = {
                payType: this.state.payType,
                payId: this.state.bank_card,
                realName: this.state.user_card,
                bankName: this.state.user_bank
            }
            this.props.apis.bindUserInfo(config).then((res) => {
                if (res.code === 0) {
                    this.setState({
                        bank_card: "",
                        user_bank: "",
                        user_card: '',
                        AddpaymentMethod: false
                    })
                    this.getSelfPayInfo()
                }
            })
        }
        else {
            const config = {
                payType: this.state.payType,
                payId: this.state.user_account,
                payQr: this.state.imgUrl,
                realName: this.state.user_card
            }
            this.props.apis.bindUserInfo(config).then((res) => {
                if (res.code === 0) {
                    this.setState({
                        imageUrl: "",
                        user_account: "",
                        user_card: '',
                        AddpaymentMethod: false
                    })
                    this.getSelfPayInfo()
                }
            })
        }
    }
    handleChange = (item, e) => {
        this.setState({
            [item]: e.target.value
        })
    }
    checkPayType = (item) => {
        const { selfPayInfo } = this.state 
        let x = []
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
            return false;
        }
        let rst = false;
        x.forEach(payInfo => {
            if (selfPayInfo.lastIndexOf(payInfo) >= 0) {
                rst = true;
                return rst;
            }
        });
        return rst;
    }
    render() {
        const {
            indexTab,
            tableList,
            AmountInputStyle,
            imageUrl,
            c2cCurrency,
            currencyList,
            c2cTabList,
            loading,
            loadingState,
        } = this.state
        const uploadButton = (
            <div className="addPayForm_columns">
                <Icon type={loading ? "loading" : "plus"} />
                <div className="ant-upload-text">请上传二维码</div>
            </div>
        );
        return (
            <div className="cto">
                <Modal visible={this.state.AddpaymentMethod} footer={null} onCancel={this.CancalPayfor} title={'添加收款方式'} width={400}>
                    <Form labelAlign="left" style={{ width: "300px" }} className="addPayForm">
                        <div style={{ display: "flex", width: "300px", position: "relative" }} className="addPayForm_columns">
                            <Icon
                                type={payTypesIcon[this.state.payType]}
                                style={{
                                    position: "absolute",
                                    left: "12px",
                                    top: "9px",
                                    zIndex: "5"
                                }}
                            />
                            <div
                                style={{
                                    position: "absolute",
                                    left: "33px",
                                    top: "6px",
                                    zIndex: "5"
                                }}
                            >
                                支付手段
                            </div>
                            <Select onSelect={this.handleSelectChange} >
                                {
                                    this.state.advItem && this.state.advItem.isStandAlipay ? <Option value="zhifubao">支付宝</Option> : null
                                }
                                {
                                    this.state.advItem && this.state.advItem.isStandWechat ? <Option value="weixin">微信</Option> : null
                                }
                                {
                                    this.state.advItem && this.state.advItem.isStandBank ? <Option value="yinhang">银行</Option>
                                    : null
                                }
                                
                            </Select>
                        </div>
                        {this.state.payType === 0 ? (
                            ""
                        ) : (
                                <div style={{ position: "relative" }} className="addPayForm_columns">
                                    <Input
                                        prefix={
                                            <Icon type={this.state.payType === 1 ? "wechat" : "alipay"} />
                                        }
                                        style={{
                                            position: "relative",
                                            width: "300px"
                                        }}
                                        placeholder={`请输入${payTypesName[this.state.payType]}账号`}
                                        ref="user_account"
                                        value={this.state.user_account}
                                        onChange={(e) => this.handleChange("user_account", e)}
                                    />
                                    <span style={{ position: "absolute", left: "33px", top: "6px" }}>
                                        {payTypesName[this.state.payType]}账号
                                    </span>
                                </div>
                            )}

                        {this.state.payType === 0 ? <Input className="addPayForm_columns" placeholder="请输入银行卡号" ref="bank_card" value={this.state.bank_card} onChange={(e) => this.handleChange("bank_card", e)} /> : ""}
                        {this.state.payType === 0 ? (
                            <div>
                                <Input placeholder="请输入银行" className="addPayForm_columns" ref="user_bank" value={this.state.user_bank} onChange={(e) => this.handleChange("user_bank", e)}></Input>
                                <div style={{ position: "relative" }} className="addPayForm_columns">
                                    <Input
                                        prefix={<Icon type="user" />}
                                        style={{
                                            position: "relative",
                                            width: "300px"
                                        }}
                                        placeholder={`请输入身份证名字`}
                                        ref="user_card"
                                        value={this.state.user_card}
                                        onChange={(e) => this.handleChange("user_card", e)}
                                    />
                                    <span style={{ position: "absolute", left: "33px", top: "6px" }}>
                                        真实姓名
                                    </span>
                                </div>
                            </div>
                        ) : (
                                <div style={{ position: "relative" }} className="addPayForm_columns">
                                    <Input
                                        prefix={<Icon type="wechat" />}
                                        style={{
                                            position: "relative",
                                            width: "300px"
                                        }}
                                        placeholder={`请输入身份证名字`}
                                        ref="user_card"
                                        value={this.state.user_card}
                                        onChange={(e) => this.handleChange("user_card", e)}
                                    />
                                    <span style={{ position: "absolute", left: "33px", top: "6px" }}>
                                        真实姓名
                                    </span>
                                </div>
                            )}
                        {this.state.payType !== 0 ? (
                            <div style={{ width: "300px", height: "150px", display: "flex", justifyContent: "center" }}>
                                <Upload
                                    name="file"
                                    listType="picture-card"
                                    onChange={this.handleChangeImg}
                                    beforeUpload={beforeUpload}
                                    showUploadList={false}
                                    action="/api/files/upload"
                                >
                                    {imageUrl ? (
                                        <div style={{ width: "145px", height: "110px" }}>
                                            <img src={imageUrl} alt="avatar" style={{ maxHeight: "100%" }} />
                                        </div>
                                    ) : (
                                            uploadButton
                                        )}
                                </Upload>
                            </div>
                        ) : (
                                ""
                            )}
                        <Button type="primary" style={{ margin: "0 auto", display: "block" }} onClick={() => this.Submbit()}>确认</Button>
                    </Form>
                </Modal>
                <Modal visible={this.state.paySwitchFlag} title="支付方式" onCancel={this.CancelModal} footer={null} className="switchPay">
                    <List itemLayout="horizontal" dataSource={this.state.paySwitch} renderItem={item => (
                        <List.Item onClick={() => this.SwtichPlaceOrder(item)} className="switchPay_column">
                            <List.Item.Meta title={item.title} avatar={<Avatar src={item.Icon}></Avatar>} />
                        </List.Item>
                    )}>
                    </List>
                </Modal>
                <div className="cto-contain">
                    <ul className="cto-nav">
                        <li className="title">法币交易</li>
                        {
                            c2cTabList.map(item => (
                                <li
                                    key={item.id}
                                    onClick={() => { this.chooseTab(item.id) }}
                                    className={indexTab === item.id ? 'active' : ''}
                                >
                                    {item.name}
                                </li>
                            ))
                        }
                    </ul>
                    <div className="cto-main">
                        <ul className="cto-main-tab">
                            {
                                currencyList && currencyList.length > 0 ?
                                    <React.Fragment>
                                        {
                                            currencyList.map(item => (
                                                <li
                                                    key={item.id}
                                                    className={item.id === c2cCurrency.id ? 'active' : null}
                                                    onClick={() => { this.chooseAssets(item) }}
                                                >
                                                    {item.name}
                                                </li>
                                            ))
                                        }
                                    </React.Fragment>
                                    :
                                    null
                            }
                            {/* <li className={indexTab === 0 ? 'active' : ''} onClick={() => { this.chooseTab(0) }}>买入{c2cCurrency}</li>
                            <li className={indexTab === 1 ? 'active' : ''} onClick={() => { this.chooseTab(1) }}>卖出{c2cCurrency}</li> */}
                        </ul>
                        <div className="c2c">
                            <Spin spinning={loadingState} classs="loadingT">
                                <ul>
                                    <li>
                                        <span>商家</span>
                                        <span>数量</span>
                                        <span>限额</span>
                                        <span>单价</span>
                                        <span>支付方式</span>
                                        <span>操作</span>
                                    </li>
                                    {
                                        tableList && tableList.length > 0 ?
                                            tableList.map((item) => (
                                                <li key={item.id}>
                                                    <div>
                                                        <span>{item.userNickName}</span>
                                                        <span>{item.amount} {item.assetName}</span>
                                                        <span>{item.minPrice}-{item.maxPrice} {item.currency}</span>
                                                        <span>{item.price} {item.currency}</span>
                                                        <span>
                                                            {item.isStandWechat ? <img src={wechatImg} alt="微信" /> : ''}
                                                            {item.isStandAlipay ? <img src={alipayImg} alt="支付宝" /> : ''}
                                                            {item.isStandBank ? <img src={cardImg} alt="银行卡" /> : ''}
                                                        </span>
                                                        <span>
                                                            <div className="btn" onClick={() => this.chooseItem(item)}>
                                                                {
                                                                    this.state.direct === 'buy' ? '买入' : '卖出'
                                                                }
                                                            </div>
                                                        </span>
                                                    </div>
                                                    <div className="choose-form" style={{ height: this.state.activeIndex === item.id ? '80px' : '0px' }}>
                                                        {
                                                            this.state.direct === 'sell' && !this.checkPayType(item)?
                                                                <div className="choose-nope">
                                                                    <div style={{ textAlign: "right", marginRight: "73px" }}>
                                                                        <span className="">
                                                                            买家仅支持通过
                                                                            {
                                                                                this.renderPayment(item)
                                                                            }
                                                                            向您付款，您需要添加并激活相应收款方式
                                                                        </span>
                                                                        <span className="cursor nope-add" onClick={() => this.showAddPayment(item)}>去添加</span>
                                                                        <span className="cursor nope-cancel" onClick={() => { this.setState({ activeIndex: '' }) }}>取消</span>
                                                                    </div>
                                                                </div>
                                                                :
                                                                <div className="choose-yep">
                                                                    <input type="text" placeholder={c2cCurrency.name} onChange={(e) => this.handleAmountInput(e, item)} value={this.state.amount} style={AmountInputStyle ? { border: "1px solid black" } : { border: "1xp solid red" }} />
                                                                    <span>{c2cCurrency.name}</span>
                                                                    <span>≈</span>
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
                                                                    <span>CNY</span>
                                                                    {/* <input type="text" placeholder="银行账户持有人姓名" /> */}
                                                                    <div className="btn" onClick={() => this.placeOrder(item)}>下单</div>
                                                                    <span onClick={() => { this.setState({ activeIndex: '' }) }}>取消</span>
                                                                </div>
                                                        }
                                                    </div>
                                                </li>
                                            ))
                                        :
                                        <li className="listNodata">
                                            <i className="iconfont iconzanwujilu1" />
                                            <p>{t('tradeGame.noData')}</p>
                                        </li>
                                    }
                                </ul>
                            </Spin>
                        </div>
                        {
                            this.state.total && this.state.total > 5 ?
                                <Pagination current={this.state.startT} defaultPageSize={5} size="small" total={this.state.total} onChange={(e) => { this.getAdList(e, 5) }} />
                                :
                                null
                        }
                        <History reload={this.state.reloadHistory} currency={c2cCurrency} />
                    </div>
                </div>
            </div>
        )
    }
}
