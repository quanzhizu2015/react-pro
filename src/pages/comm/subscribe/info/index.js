import React from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import moment from 'moment'
import { Tooltip } from 'antd'
import message from '@/components/message'
import NotifyPop from '@/components/notifyPop'

import OneImg from '@/assets/img/market/1.png'
import TwoImg from '@/assets/img/market/2.png'
import ThreeImg from '@/assets/img/market/3.png'
import FourImg from '@/assets/img/market/4.png'
import JianTou from '@/assets/img/market/jiantou.png'

import './index.scss'

/*eslint-disable*/
var nc
@withRouter
@connect(state => ({
    apis: state.apis,
    userAuth: state.userAuth,
    randomKey: state.randomKey,
}))
export default class SubscribeInfo extends React.Component {
    constructor() {
        super()
        this.state = {
            allData: {},
            newDate: {},
            fenValue: '',
            id: '',
            throttle: true,
            showPop: false,
            cardModel: false,
            cardChoose: null,
            total: 0,
            cardList: null,
        }
    }
    componentDidMount() {
        this.getRouterParam()
    }
    componentWillUnmount() {
        clearInterval(this.timer)
    }
    init = () => {
        const ncToken = ['FFFF0N000000000084FD', (new Date()).getTime(), Math.random()].join(':')
        const ncOption = {
            // 声明滑动验证需要渲染的目标元素ID。
            renderTo: '#validation',
            // 应用类型标识。它和使用场景标识（scene字段）一起决定了滑动验证的业务场景与后端对应使用的策略模型。您可以在人机验证控制台的配置管理页签找到对应的appkey字段值，请务必正确填写。
            appkey: 'FFFF0N000000000084FD',
            // 使用场景标识。它和应用类型标识（appkey字段）一起决定了滑动验证的业务场景与后端对应使用的策略模型。您可以在人机验证控制台的配置管理页签找到对应的scene值，请务必正确填写。
            scene: 'nc_activity',
            // 滑动验证码的主键，请勿将该字段定义为固定值。确保每个用户每次打开页面时，其token值都是不同的。系统默认的格式为：”您的appkey”+”时间戳”+”随机数”。
            token: ncToken,
            // 滑动条的宽度。
            customWidth: 352,
            // 业务键字段，可为空。为便于线上问题的排查，建议您按照线上问题定位文档中推荐的方法配置该字段值。
            trans: { key1: 'code200' },
            // 通过Dom的ID属性自动填写trans业务键，可为空。建议您按照线上问题定位文档中推荐的方法配置该字段值。
            elementID: ['usernameID'],
            // 是否自定义配置底层采集组件。如无特殊场景，请使用默认值（0），即不自定义配置底层采集组件。
            is_Opt: 0,
            // 语言。PC端Web页面场景默认支持18国语言，详细配置方法请参见自定义文案与多语言文档。
            language: 'cn',
            // 是否启用。一般情况，保持默认值（true）即可。
            isEnabled: true,
            // 内部网络请求的超时时间。一般情况建议保持默认值（3000ms）。
            timeout: 3000,
            // 允许服务器超时重复次数，默认5次。超过重复次数后将触发报错。
            times: 5,
            // 用于自定义滑动验证各项请求的接口地址。一般情况，请勿配置该参数。
            apimap: {
                // 'analyze': '//a.com/nocaptcha/analyze.jsonp',
                // 'get_captcha': '//b.com/get_captcha/ver3',
                // 'get_captcha': '//pin3.aliyun.com/get_captcha/ver3',
                // 'get_img': '//c.com/get_img',
                // 'checkcode': '//d.com/captcha/checkcode.jsonp',
                // 'umid_Url': '//e.com/security/umscript/3.2.1/um.js',
                // 'uab_Url': '//aeu.alicdn.com/js/uac/909.js',
                // 'umid_serUrl': 'https://g.com/service/um.json'
            },
            // 前端滑动验证通过时会触发该回调参数。您可以在该回调参数中将请求标识（token）、会话ID（sessionid）、签名串（sig）字段记录下来，随业务请求一同发送至您的服务端调用验签。
            callback: (data) => {
                this.setState({
                    SessionId: data.csessionid,
                    sig: data.sig,
                    token: data.token,
                    scene: 'nc_activity'
                })
            }
        }
        if (nc) {
            nc.reload()
        } else {
            nc = new noCaptcha(ncOption)
            // 用于自定义文案。详细配置方法请参见自定义文案与多语言文档。
            nc.upLang('cn', {
                _startTEXT: '请按住滑块，拖动到最右边',
                _yesTEXT: '验证通过',
                _error300: '哎呀，出错了，点击<a href=\"javascript:__nc.reload()\">刷新</a>再来一次',
                _errorNetwork: '网络不给力，请<a href=\"javascript:__nc.reload()\">点击刷新</a>'
            })
        }
    }
    /**
     * 获取路有参数，并请求该ID下的信息
     * @memberof SubscribeInfo
     */
    getRouterParam = () => {
        const { search } = this.props.location
        if (search) {
            this.getAdvertisingInfo(search.slice(4))
            this.setState({ id: search.slice(4) })
        } else {
            this.props.history.push('/comm/subscribe/list')
        }
    }

    /**
     * 获取卡券内容
     * @memberof SubscribeInfo
     */
    getCardsList = async () => {
        const { id, fenValue, allData } = this.state
        const params = { domainId: id }
        try {
            const res = await this.props.apis.getCardsUnUsed(params)
            if (res.code === 0) {
                const value = (fenValue * allData.discountPrice).toFixed(allData.decimal)
                if (res.data && res.data.length > 0) {
                    const axiba = res.data.filter(item => item.couponConditions <= value)
                    if (axiba.length > 0) {
                        this.setState({
                            cardList: axiba,
                            total: axiba.length
                        })
                    }
                }
            }
        } catch (error) {
            message.error(error)
        }
    }
    /**
     * 获取广告信息，掉接口，并赋值
     * @memberof SubscribeInfo
     */
    getAdvertisingInfo = async (id) => {
        const params = { id }
        try {
            const res = await this.props.apis.getAdvertisingInfoFetch(params)
            if (res.code === 0) {
                this.setState({ allData: res.data })
                if (res.data) {
                    if (res.data.status === 1) {
                        this.countFun(res.data.startTime)
                    } else if (res.data.status === 2) {
                        this.countFun(res.data.endTime)
                    }
                }
            }
        } catch (error) {
            message.error(error)
        }
    }
    /**
     * 倒计时
     * @memberof SubscribeInfo
     */
    countFun = (time) => {
        const endTime = new Date(time).getTime()
        let sysSecond = (endTime - new Date().getTime())
        this.timer = setInterval(() => {
        // 防止倒计时出现负数
            if (sysSecond > 1000) {
                sysSecond -= 1000
                const day = Math.floor((sysSecond / 1000 / 3600) / 24)
                const hour = Math.floor((sysSecond / 1000 / 3600) % 24)
                const minute = Math.floor((sysSecond / 1000 / 60) % 60)
                const second = Math.floor((sysSecond / 1000) % 60)
                const date = {
                    D: day,
                    H: hour < 10 ? `0${hour}` : hour,
                    m: minute < 10 ? `0${minute}` : minute,
                    s: second < 10 ? `0${second}` : second
                }
                this.setState({
                    newDate: date
                })
            } else {
                clearInterval(this.timer)
                this.getRouterParam()
            }
        }, 1000)
    }
    /**
     * 处理认购份数输入框，不能出现数字以外内容
     * @memberof SubscribeInfo
     */
    handleChangeValue = (e) => {
        let { value } = e.target
        // 去掉所有的非数字
        value = value.replace(/[^\d]/g, '')
        this.setState({ fenValue: value })
    }
    handleEnterKey = (e) => {
        if (e.nativeEvent.keyCode === 13) {
            this.handleSub()
        }
    }
    jumpLink = () => {
        if (this.props.userAuth) {
            this.props.history.push('/comm/subscribe/history')
        } else {
            message.warning('您还没有登录哦')
            this.props.history.push('/common/login')
        }
    }
    /**
     * 打开确认弹窗前，校验
     *
     * @memberof SubscribeInfo
     */
    handleSub = () => {
        const {
            fenValue,
            allData,
        } = this.state
        if (this.props.userAuth) {
            if (fenValue) {
                if (fenValue >= allData.minAmount) {
                    if (fenValue <= allData.maxAmount) {
                        if (fenValue <= allData.remaining) {
                            this.getCardsList()
                            this.setState({ showPop: true }, () => {
                                this.init()
                            })
                        } else {
                            message.info('剩余认购份额不足!')
                        }
                    } else {
                        message.info('认购份数大于限制份额!')
                    }
                } else {
                    message.info('认购份数小于起投份额!')
                }
            } else {
                message.info('请输入认购份数!')
            }
        } else {
            message.warning('您还没有登录哦')
            this.props.history.push('/common/login')
        }
    }
    /**
     * 确定认购，调用接口函数
     * @param fenValue [份数]
     * @param id [订单ID]
     * @param currency [币种]
     * @param assetId [币种ID]
     * @memberof SubscribeInfo
     */
    handleSubmit = async () => {
        const {
            fenValue,
            allData,
            id,
            cardChoose,
            SessionId,
            sig,
            token,
        } = this.state
        if (SessionId && sig && token) {
            const params = {
                id,
                amount: fenValue,
                currency: allData.currency,
                assetId: allData.assetId,
                domainSec: this.props.randomKey,
            }
            if (cardChoose) {
                if (cardChoose.couponConditions < (fenValue * allData.discountPrice).toFixed(allData.decimal)) {
                    params.couponId = cardChoose.id
                    this.submitFetch(params)
                } else {
                    message.error('认购份额小于优惠券使用额度，请重新选择')
                }
            } else {
                this.submitFetch(params)
            }
        } else {
            message.warning('请进行滑动验证')
        }
    }
    /**
     * 调用接口
     * @memberof SubscribeInfo
     */
    submitFetch = async (params) => {
        const {
            throttle,
            id,
            SessionId,
            sig,
            token,
            scene,
        } = this.state
        if (throttle) {
            this.setState({ throttle: false })
            const headerParams = {
                  sessionId: SessionId,
                  sig,
                  afsToken: token,
                  scene
            }
            params.headerParams = headerParams
            try {
                const res = await this.props.apis.sendAdvertisingFetch(params)
                if (res.code === 0) {
                    message.success('认购成功')
                    this.setState({
                        throttle: true,
                        fenValue: '',
                        showPop: false,
                        cardChoose: null,
                        SessionId: null,
                        sig: null,
                        token: null,
                    })
                    this.getAdvertisingInfo(id)
                    this.getCardsList()
                } else {
                    this.setState({
                        showPop: false,
                        throttle: true,
                        SessionId: null,
                        sig: null,
                        token: null,
                    })
                }
            } catch (error) {
                message.error(error)
            }
        }
    }
    handleCancel = () => {
        this.setState({
            showPop: false,
            throttle: true,
            cardChoose: null,
            SessionId: null,
            sig: null,
            token: null,
        })
    }
    /**
     * 弹窗内打开/关闭卡券
     * @function handleOpenCards
     * @memberof SubscribeInfo
     */
    handleOpenCards = () => {
        const { cardModel, total } = this.state
        if (total > 0) {
            this.setState({ cardModel: !cardModel })
        }
    }
    clearChooseCards = (e) => {
        e.stopPropagation()
        this.setState({ cardChoose: null })
    }
    handelChooseCards = (item) => {
        this.setState({
            cardModel: false,
            cardChoose: item,
        })
    }
    filterStatus = (status) => {
        switch (status) {
        case 1:
            return <div>认购未开始</div>
        case 2:
            return null
        case 3:
            return <div>认购成功</div>
        case 4:
            return <div>认购成功</div>
        case 5:
            return <div>认购失败</div>
        case 6:
            return <div>认购失败</div>
        case 7:
            return <div>认购已取消</div>
        case 8:
            return <div>认购已取消</div>
        case 9:
            return <div>认购已取消</div>
        default:
            return status
        }
    }
    /**
     * 渲染table无状态组件
     * @memberof SubscribeInfo
     */
    renderTable = (list, tit) => {
        if (!list || list.length === 0) return false
        const keys = []
        const values = []
        list.forEach((item) => {
            keys.push(Object.keys(item)[0])
            values.push(Object.values(item)[0])
        })
        if (keys.length > 1) {
            while (keys.length < 6) {
                keys.push('')
                values.push('')
            }
        }
        return (
            <div className="subscribeInfo-fourItem">
                <h5>{tit || '--'}</h5>
                <table>
                    <thead>
                        <tr>
                            {
                                keys.map((item, index) => (
                                    <th width="16.6%" key={index}>{item}</th>
                                ))
                            }
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            {
                                values.map((item, index) => (
                                    <td key={index}>{item}</td>
                                ))
                            }
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
    render() {
        const {
            allData,
            newDate,
            fenValue,
            showPop,
            cardChoose,
            cardModel,
            total,
            cardList,
            token
        } = this.state
        return (
            <div className="subscribeInfo">
                <div className="subscribeInfo-main">
                    <div className="subscribeInfo-one">
                        <h4>DTO认购</h4>
                        <h3>{allData.name || '--'}</h3>
                        {
                            allData.status === 2 || allData.status === 1 ?
                                <div>
                                    {
                                        allData.status === 1 ?
                                            '距分配认购开始'
                                            :
                                            '比例分配认购倒计时'
                                    }
                                    :&nbsp;&nbsp;&nbsp;&nbsp;
                                    <span>
                                        <b>{newDate.D || '00'}</b>
                                        天&nbsp;&nbsp;
                                        <b>{newDate.H || '00'}</b>
                                        h&nbsp;&nbsp;
                                        <b>{newDate.m || '00'}</b>
                                        m&nbsp;&nbsp;
                                        <b>{newDate.s || '00'}</b>
                                        s
                                    </span>
                                </div>
                                :
                                this.filterStatus(allData.status)
                        }
                    </div>
                    <div className="subscribeInfo-two">
                        <div className="subscribeInfo-twoLeft">
                            <h5>[ DTO认购 ] {allData.title}</h5>
                            <ul>
                                {
                                    allData && allData.tags && allData.tags.length > 0 ?
                                        allData.tags.map((item, index) => (
                                            <li
                                                key={index}
                                                className={`li${index + 1}`}
                                            >
                                                {item}
                                            </li>
                                        ))
                                        :
                                        null
                                }
                            </ul>
                            <div className="marketDescribe-one">
                                <div className="one-item one">
                                    <img src={OneImg} alt="" />
                                    <p>项目选择</p>
                                    <span>100%亲选好域名</span>
                                </div>
                                <div className="one-item two">
                                    <img src={JianTou} alt="" />
                                </div>
                                <div className="one-item one">
                                    <img src={TwoImg} alt="" />
                                    <p>抢购预认购份额</p>
                                    <span>区块链专利技术</span>
                                </div>
                                <div className="one-item two">
                                    <img src={JianTou} alt="" />
                                </div>
                                <div className="one-item one">
                                    <img src={ThreeImg} alt="" />
                                    <p>坐收域名收益</p>
                                    <span>高成长价值分工</span>
                                </div>
                                <div className="one-item two">
                                    <img src={JianTou} alt="" />
                                </div>
                                <div className="one-item one">
                                    <img src={FourImg} alt="" />
                                    <p>出售获利</p>
                                    <span>充足的二级流动性</span>
                                </div>
                            </div>
                        </div>
                        <div className="subscribeInfo-twoRight">
                            {/* <div className="subscribeInfo-tag">
                                <span onClick={() => { window.open('https://goodtoken.zendesk.com/hc/zh-cn/articles/360035228734-%E8%AE%A4%E8%B4%AD%E8%B5%A0%E9%80%81GTE') }}>
                                    认购赠送GTE
                                    <i className="iconfont iconzhankai" />
                                </span>
                            </div> */}
                            <div className="subscribeInfo-tit">
                                <span className="weight">{allData.discountPrice || '--'}</span>
                                <span>USDT/份</span>
                                <Tooltip
                                    title={(
                                        <span onClick={() => { window.open('https://goodtoken.zendesk.com/hc/zh-cn/articles/360035714073-%E8%AE%A4%E8%B4%AD%E8%A7%84%E5%88%99') }}><u>认购规则</u></span>
                                    )}
                                    overlayClassName="subscribeInfo-tooltip"
                                >
                                    <i className="iconfont icongantanhao2" />
                                </Tooltip>
                                <s>{allData.price || '--'}/份</s>
                            </div>
                            <p className="subscribeInfo-fen">认购份额: <span>{allData.minAmount || '--'}-{allData.maxAmount || '--'}份</span></p>
                            <div className="subscribeInfo-flex">
                                <p>配售份额:</p>
                                <p>{allData.releaseAmount || '--'}份</p>
                            </div>
                            <p className="subscribeInfo-last">剩余{allData.remaining || '--'}份</p>
                            {
                                allData.remaining && allData.releaseAmount ?
                                    <div className="subscribeInfo-has">
                                        <span style={{ width: `${(1 - (allData.remaining / allData.releaseAmount)) * 100}%` }} />
                                    </div>
                                    :
                                    null
                            }
                            {/* <div className="subscribeInfo-has">
                                <span style={{ width: `${(1 - (allData.remaining / allData.releaseAmount)) * 100}%` }} />
                            </div> */}
                            <div className="subscribeInfo-flex">
                                <p>兑换币种:</p>
                                <p>{allData.currency || '--'}</p>
                            </div>
                            <div className="subscribeInfo-input">
                                <input
                                    type="text"
                                    placeholder="请输入认购份数"
                                    value={fenValue}
                                    onChange={(e) => { this.handleChangeValue(e) }}
                                    onKeyPress={(e) => { this.handleEnterKey(e) }}
                                />
                                <span>(份)</span>
                            </div>
                            <div className="subscribeInfo-time">
                                <p>开始时间：{moment(allData.startTime).format('YYYY-MM-DD HH:mm:ss')}</p>
                                <p>结束时间：{moment(allData.endTime).format('YYYY-MM-DD HH:mm:ss')}</p>
                            </div>
                            {
                                allData.status === 2 ?
                                    <div
                                        className={fenValue ? 'subscribeInfo-btn' : 'subscribeInfo-btn disable'}
                                        onClick={() => { this.handleSub() }}
                                    >
                                        立即认购
                                    </div>
                                    :
                                    <div
                                        className="subscribeInfo-btn disable"
                                    >
                                        {this.filterStatus(allData.status)}
                                    </div>
                            }
                            <h5 onClick={() => { this.jumpLink() }}><u>我的认购记录</u></h5>
                        </div>
                    </div>
                    <div className="subscribeInfo-three">
                        <div className="subscribeInfo-threeItem">
                            <h5>项目简介</h5>
                            <div dangerouslySetInnerHTML={{ __html: allData.introduction }} />
                        </div>
                        <div className="subscribeInfo-threeItem">
                            <h5>发行规则</h5>
                            <div dangerouslySetInnerHTML={{ __html: allData.issue }} />
                        </div>
                        <div className="subscribeInfo-threeItem">
                            <h5>收益评测</h5>
                            <div dangerouslySetInnerHTML={{ __html: allData.benefits }} />
                        </div>
                    </div>
                    <div className="subscribeInfo-four">
                        <h4>域名评测</h4>
                        {this.renderTable(allData.attribute, '基本属性')}
                        {this.renderTable(allData.appearance, '域名品相')}
                        {this.renderTable(allData.otherSuffixRegistration, '其他后缀注册情况')}
                        {this.renderTable(allData.valueAddModule, '增值模块属性')}
                        {this.renderTable(allData.commercial, '商业价值')}
                        {this.renderTable(allData.commercialAttr, '商业价值属性')}
                    </div>
                </div>
                <NotifyPop
                    visable={showPop}
                    width="472"
                    height="505"
                    confirm={this.handleSubmit}
                    cancel={this.handleCancel}
                    disable={token || false}
                >
                    <div className="subscribeInfo-pop">
                        <h4>确认认购</h4>
                        <ul>
                            <li>
                                <p>认购资金: </p>
                                <p>{(fenValue * allData.discountPrice).toFixed(allData.decimal)}  USDT</p>
                            </li>
                            <li>
                                <p>认购份额: </p>
                                <p>{fenValue || '--'}  份</p>
                            </li>
                            <li onClick={() => { this.handleOpenCards() }}>
                                <p>卡券: </p>
                                <p className="hasNum">
                                    {
                                        !cardChoose ?
                                            <React.Fragment>
                                                {
                                                    total > 0 ?
                                                        <div className="has">
                                                            <i className="iconfont iconbiaoqian-" />
                                                            {total}个可用
                                                        </div>
                                                        :
                                                        <div className="none">
                                                            暂无可用
                                                        </div>
                                                }
                                            </React.Fragment>
                                            :
                                            null
                                    }
                                    {
                                        cardChoose ?
                                            <div className="choose">
                                                {cardChoose.couponAmount}{cardChoose.currency || 'USDT'}
                                                <i
                                                    className="iconfont iconguanbidefuben"
                                                    onClick={(e) => { this.clearChooseCards(e) }}
                                                />
                                            </div>
                                            :
                                            null
                                    }
                                    <i
                                        className="iconfont iconzhankai"
                                    />
                                </p>
                            </li>
                            <li
                                id="validation"
                                className="nc-container"
                            />
                            <li className="hasDel">
                                <span className="span">
                                    {
                                        cardChoose ?
                                            <React.Fragment>
                                                金额 {((fenValue * allData.discountPrice).toFixed(allData.decimal) - cardChoose.couponAmount).toFixed(allData.decimal)}
                                                <span>(已抵扣{cardChoose.couponAmount})</span>
                                                &nbsp;{cardChoose.currency || 'USDT'}
                                            </React.Fragment>
                                            :
                                            <React.Fragment>
                                                金额 {(fenValue * allData.discountPrice).toFixed(allData.decimal)}
                                                &nbsp;USDT
                                            </React.Fragment>
                                    }
                                </span>
                            </li>
                        </ul>
                        {
                            cardModel ?
                                <div className="subscribeInfo-pop-cards">
                                    <div className="subscribeInfo-pop-cardScroll">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>金额</th>
                                                    <th>起投额</th>
                                                    <th>过期时间</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    cardList.map(item => (
                                                        <tr
                                                            key={item.id}
                                                            onClick={() => { this.handelChooseCards(item) }}
                                                        >
                                                            <td>{item.couponAmount} {item.currency || 'USDT'}</td>
                                                            <td>{item.couponConditions} {item.currency || 'USDT'}</td>
                                                            <td>{moment(item.gmtExpired).format('YYYY-MM-DD')}</td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </table>
                                        <i onClick={() => { this.setState({ cardModel: false }) }} className="iconfont iconguanbi1" />
                                    </div>
                                </div>
                                :
                                null
                        }
                    </div>
                </NotifyPop>
            </div>
        )
    }
}
