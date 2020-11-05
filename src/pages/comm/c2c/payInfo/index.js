import React from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import { Popover } from 'antd'
import moment from 'moment'

import message from '@/components/message'
import NotifyPop from '@/components/notifyPop'
import './index.scss'

@withRouter
@connect(state => ({
    apis: state.apis,
}))
export default class C2CInfo extends React.Component {
    constructor() {
        super()
        this.state = {
            orderId: null,
            payId: null,
            payIndex: null,
            time: 0,
            timeNow: {
                M: '00',
                S: '00'
            },
            orderInfo: null,
            InfoVisible: false,
            InfoVisible1: false,
            payInfo: null
        }
    }
    componentDidMount() {
        this.getAddressParam()
    }
    componentWillUnmount() {
        clearInterval(this.time)
    }
    onlyInterval = () => {
        const { time } = this.state
        if (time >= 0) {
            const data = {
                M: Math.floor(time / 60),
                S: Math.floor(time % 60)
            }
            this.setState({
                timeNow: data,
                time: time - 1
            })
        } else {
            clearInterval(this.time)
            setTimeout(() => {
                message.warning('您的订单已超时!')
                this.getOrderInfo()
            }, 2000)
        }
    }
    getAddressParam = () => {
        const { search } = this.props.location
        if (search) {
            this.setState({ orderId: search.slice(4) }, () => { this.getOrderInfo() })
        } else {
            this.props.history.push('/comm/c2c')
        }
    }
    // 获取订单信息
    getOrderInfo = async () => {
        const { orderId } = this.state
        const params = {
            orderId
        }
        try {
            const res = await this.props.apis.getC2CAdInfo(params)
            if (res.code === 0) {
                if (
                    (res.data && res.data.createTime)
                    &&
                    ((res.data.status === 1 && res.data.orderDirection === 1)
                    || (res.data.status === 0 && res.data.orderDirection === 0))) {
                    const createT = res.data.createTime / 1000
                    const now = Date.parse(new Date()) / 1000
                    const time = now - createT
                    const countDown = (res.data.expireTime / 1000) - createT
                    this.setState(
                        {
                            time: countDown - time
                        },
                        () => {
                            if (this.time) return false
                            this.time = setInterval(() => { this.onlyInterval() }, 1000)
                            return true
                        }
                    )
                }
                this.setState({
                    orderInfo: res.data,
                })
                // this.props.history.push('/comm/c2c')
            }
        } catch (e) {
            message.error(e.message)
        }
    }
    openNotifyBuy = () => {
        this.setState({ InfoVisible: true })
    }
    // 已支付
    handleFinished = async () => {
        const { orderId, payIndex, payId } = this.state
        const params = {
            id: orderId,
            payId,
            payType: payIndex
        }
        try {
            const res = await this.props.apis.finishedPay(params)
            if (res.code === 0) {
                message.success('你的订单已支付，请耐心等待')
                this.props.history.push('/comm/c2c')
            } else {
                this.getOrderInfo()
            }
        } catch (e) {
            message.error(e.message)
        }
    }

    // 已收款
    handleFinished1 = async () => {
        const { orderId, payIndex } = this.state
        const params = {
            id: orderId,
            payType: payIndex
        }
        try {
            const res = await this.props.apis.finishedSell(params)
            if (res.code === 0) {
                message.success('你的订单确认，请耐心等待')
                this.props.history.push('/comm/c2c')
            }
        } catch (e) {
            message.error(e.message)
        }
    }
    // 取消订单
    cancelOrder = async () => {
        const { orderId } = this.state
        const params = {
            id: orderId
        }
        try {
            const res = await this.props.apis.cancelC2COrderList(params)
            if (res.code === 0) {
                this.getOrderInfo()
                message.success('您的订单已取消！')
            }
        } catch (e) {
            message.error(e.message)
        }
    }
    render() {
        const {
            payIndex,
            orderId,
            timeNow,
            orderInfo,
            payInfo
        } = this.state
        return (
            <div className="c2c-info">
                <div className="c2c-info-main">
                    <span className="order">订单：#{orderId}</span>
                    {
                        orderInfo ?
                            <span className="order">时间：{moment(orderInfo.createTime).format('YYYY-MM-DD HH:mm:ss')}</span>
                            :
                            null

                    }
                    {
                        orderInfo ?
                            <div className="c2cInfo-head">
                                <h3>
                                    您向
                                    {orderInfo.nickName}
                                    {orderInfo.orderDirection === 1 ? '购买' : '出售'}
                                    <span className={orderInfo.orderDirection === 1 ? 'green' : 'red'}>
                                        &nbsp;&nbsp;{orderInfo.amount} {orderInfo.assetName}
                                    </span>
                                </h3>
                                <p>单价:&nbsp;&nbsp;&nbsp;&nbsp;{orderInfo.price}  {orderInfo.currency}</p>
                                <p>总价:&nbsp;&nbsp;&nbsp;&nbsp;{orderInfo.totalPrice}  {orderInfo.currency}</p>
                            </div>
                            :
                            null
                    }
                    {
                        orderInfo && (orderInfo.status === 0 || orderInfo.status === 1 || orderInfo.status === 2) ?
                            <React.Fragment>
                                {
                                    orderInfo && orderInfo.payInfoList ?
                                        <div className="c2cInfo-content">
                                            <p className="c2cInfo-content-tit">
                                                {orderInfo.orderDirection === 1 ? '卖方收款方式' : '您的收款方式'}
                                            </p>
                                            {/* <div className="c2cInfo-content-tip">
                                                <i className="iconfont icongantanhao2" />
                                                <span>
                                                    您必须用
                                                    <span className="red">实名为（*潇）</span>
                                                    的账户向以下账号自行转账
                                                </span>
                                            </div> */}
                                            <div className="c2cInfo-content-pay">
                                                {
                                                    orderInfo.payInfoList.map(item => (
                                                        <div className="c2cInfo-content-payItem" key={item.payType}>
                                                            {
                                                                (orderInfo.orderDirection === 0 && orderInfo.status === 1) || (orderInfo.orderDirection === 1 && orderInfo.status === 2) ?
                                                                    null
                                                                    :
                                                                    <i
                                                                        onClick={() => { this.setState({ payIndex: item.payType, payId: item.payId, payInfo: item }) }}
                                                                        className={`iconfont check ${payIndex === item.payType ? 'iconyixuanzhong' : 'iconweixuanzhong'}`}
                                                                    />
                                                            }
                                                            {item.payType === 0 ? <i className="iconfont iconyinhangka" /> : null}
                                                            {item.payType === 1 ? <i className="iconfont iconzhifubao" /> : null}
                                                            {item.payType === 2 ? <i className="iconfont iconweixin1" /> : null}
                                                            <span className="grey">
                                                                {item.payType === 0 ? '银行卡' : null}
                                                                {item.payType === 1 ? '支付宝' : null}
                                                                {item.payType === 2 ? '微信' : null}
                                                            </span>
                                                            <span className="item">{item.realName}</span>
                                                            <span className="item">{item.payId}</span>
                                                            {
                                                                item.payType === 0 ?
                                                                    <span className="item">{item.bankName}</span>
                                                                    :
                                                                    <Popover
                                                                        placement="right"
                                                                        content={
                                                                            <img
                                                                                style={{ maxWidth: '200px', maxHeight: '600px' }}
                                                                                src={item.payQr}
                                                                                alt=""
                                                                            />
                                                                        }
                                                                    >
                                                                        <i className="iconfont iconerweima1" />
                                                                    </Popover>
                                                            }
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                            {
                                                orderInfo.status === 1 && orderInfo.orderDirection === 1 ?
                                                    <div className="c2cInfo-content-payTime">
                                                        待支付，请于
                                                        <span>
                                                            {timeNow.M}
                                                            分
                                                            {timeNow.S}
                                                            秒
                                                        </span>
                                                        内支付
                                                        {orderInfo.totalPrice}  {orderInfo.currency}
                                                    </div>
                                                    :
                                                    null
                                            }
                                            {
                                                orderInfo.status === 0 && orderInfo.orderDirection === 0 ?
                                                    <div className="c2cInfo-content-payTime">
                                                        待确认，请于
                                                        <span>
                                                            {timeNow.M}
                                                            分
                                                            {timeNow.S}
                                                            秒
                                                        </span>
                                                        内确认订单。
                                                    </div>
                                                    :
                                                    null
                                            }
                                            {
                                                orderInfo.status === 1 && orderInfo.orderDirection === 1 ?
                                                    <React.Fragment>
                                                        <div
                                                            className={payIndex !== null ? 'c2cInfo-content-payBtn' : 'c2cInfo-content-payBtn disable'}
                                                            onClick={() => { this.openNotifyBuy() }}
                                                        >
                                                            已支付
                                                        </div>
                                                        <div className="c2cInfo-content-payCancel" onClick={() => { this.cancelOrder() }}>
                                                            取消订单
                                                        </div>
                                                    </React.Fragment>
                                                    :
                                                    null
                                            }
                                            {
                                                orderInfo.status === 0 && orderInfo.orderDirection === 0 ?
                                                    <React.Fragment>
                                                        <div
                                                            className={payIndex !== null ? 'c2cInfo-content-payBtn' : 'c2cInfo-content-payBtn disable'}
                                                            onClick={() => { this.setState({ InfoVisible1: true }) }}
                                                        >
                                                            确认
                                                        </div>
                                                        <div className="c2cInfo-content-payCancel" onClick={() => { this.cancelOrder() }}>
                                                            取消订单
                                                        </div>
                                                    </React.Fragment>
                                                    :
                                                    null
                                            }
                                        </div>
                                        :
                                        <div className="c2cInfo-content">
                                            <div className="c2cInfo-content-payTime">
                                                {/* 在{timeNow.M}分{timeNow.S}秒内 */}
                                                待收款，您将收到{orderInfo.totalPrice}  {orderInfo.currency}，请注意查收。
                                            </div>
                                            {/* <div
                                                className="c2cInfo-content-payBtn"
                                                onClick={() => { this.handlehad() }}
                                            >
                                                已收款
                                            </div> */}
                                        </div>
                                }
                            </React.Fragment>
                            :
                            null
                    }
                    {
                        orderInfo && orderInfo.status === 3 ?
                            <div className="c2cInfo-content-cancel">
                                <i className="iconfont iconduihao2" />
                                <p>订单已成交</p>
                                <div onClick={() => { this.props.history.push('/comm/c2c/adomm/c2c/ad') }}>返回</div>
                            </div>
                            :
                            null
                    }
                    {
                        orderInfo && orderInfo.status === 4 ?
                            <div className="c2cInfo-content-cancel">
                                <i className="iconfont iconguanbidefuben" />
                                <p>订单已取消</p>
                                <div onClick={() => { this.props.history.push('/comm/c2c/adomm/c2c/ad') }}>返回</div>
                            </div>
                            :
                            null
                    }
                    <div className="c2cInfo-foot">
                        <p className="c2cInfo-foot-tit">转款注意事项</p>
                        <p>1. 请注意确认收款账号。转错账号无法充值成功，造成的损失需要由自己承担。</p>
                        <p>2. 在转账过程中<span>切勿备注类似BTC、USDT等一切与虚拟币交易相关的敏感信息</span>,以免造成您的汇款被拦截、银行卡被冻结等问题,因此到账延迟,商家有权拒绝成交。</p>
                        <p>3. 请在转账时，填写正确的转账金额，若金额不正确，可能会导致交易失败。</p>
                        <p>4. 买入资产转账成功后，请及时点击“完成转账”按钮，否则订单可能会当作超时处理。</p>
                        <p>5. 订单请在15分钟内完成转账，超时订单会自动取消。</p>
                        <p>6. 请使用本人绑定的银行卡进行汇款,否则商家可拒绝成交。</p>
                    </div>
                </div>
                {
                    payInfo && orderInfo ?
                        <React.Fragment>
                            <NotifyPop
                                visable={this.state.InfoVisible}
                                width="540"
                                height={payInfo.payType === 0 ? '360' : '580'}
                                cancel={() => { this.setState({ InfoVisible: false }) }}
                                confirm={() => { this.handleFinished() }}
                            >
                                <div className="popPayType">
                                    <h5>确认付款</h5>
                                    <div className="popPayType-item">
                                        <span className="label">订单号：</span>
                                        <span>#{orderId}</span>
                                    </div>
                                    <div className="popPayType-item">
                                        <span className="label">总价：</span>
                                        <span>{orderInfo.totalPrice}  {orderInfo.currency}</span>
                                    </div>
                                    <div className="popPayType-item">
                                        <span className="label">账号：</span>
                                        <span>{payInfo.payId}</span>
                                    </div>
                                    {
                                        payInfo.payType === 0 ?
                                            <div className="popPayType-item">
                                                <span className="label">银行：</span>
                                                <span>{payInfo.bankName}</span>
                                            </div>
                                            :
                                            <div className="popPayType-item">
                                                <span className="label">二维码：</span>
                                                <img
                                                    style={{ maxWidth: '200px', maxHeight: '300px' }}
                                                    src={payInfo.payQr}
                                                    alt=""
                                                />
                                            </div>
                                    }
                                </div>
                            </NotifyPop>
                            <NotifyPop
                                visable={this.state.InfoVisible1}
                                width="540"
                                height={payInfo.payType === 0 ? '360' : '580'}
                                cancel={() => { this.setState({ InfoVisible1: false }) }}
                                confirm={() => { this.handleFinished1() }}
                            >
                                {
                                    payInfo && orderInfo ?
                                        <div className="popPayType">
                                            <h5>确认订单</h5>
                                            <div className="popPayType-item">
                                                <span className="label">订单号：</span>
                                                <span>#{orderId}</span>
                                            </div>
                                            <div className="popPayType-item">
                                                <span className="label">总价：</span>
                                                <span>{orderInfo.totalPrice}  {orderInfo.currency}</span>
                                            </div>
                                            <div className="popPayType-item">
                                                <span className="label">账号：</span>
                                                <span>{payInfo.payId}</span>
                                            </div>
                                            {
                                                payInfo.payType === 0 ?
                                                    <div className="popPayType-item">
                                                        <span className="label">银行：</span>
                                                        <span>{payInfo.bankName}</span>
                                                    </div>
                                                    :
                                                    <div className="popPayType-item">
                                                        <span className="label">二维码：</span>
                                                        <img
                                                            style={{ maxWidth: '200px', maxHeight: '300px' }}
                                                            src={payInfo.payQr}
                                                            alt=""
                                                        />
                                                    </div>
                                            }
                                        </div>
                                        :
                                        null
                                }
                            </NotifyPop>
                        </React.Fragment>
                        :
                        null
                }
            </div>
        )
    }
}
