import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { Pagination } from 'antd'
import moment from 'moment'

import { IsPC } from '@/assets/js/common.js'
import message from '@/components/message'
import Banner from '../../../market/marketBanner'

import './index.scss'

@withRouter
@connect(state => ({
    apis: state.apis
}))
export default class SubscribeList extends Component {
    constructor() {
        super()
        this.state = {
            mouseIndex: null,
            currentPage: 1,
            total: 0,
            adList: [],
            DTOList: [
                {
                    id: 0,
                    name: '什么是DTO?',
                    status: false,
                    pList: [
                        {
                            id: 0,
                            text: 'Domain Token Onboarding，简称DTO，是GoodToken推出的新一代utility token发行与监督协议。DTO协议遵循传统金融市场开发的信息披露机制，为投资者提供全方位项目资讯和评估。通过GoodToken账户可直接投资各类优质项目，优化投资成本。',
                        },
                        {
                            id: 1,
                            text: 'Domain Token Onboarding，简称DTO，是GoodToken推出的新一代utility DTO能为项目方提供快速发行的服务和持续的营销支持。项目只经过GoodToken的深度调查和合规审查。才能被批准参加DTO。DTO期间，项目方将发行一定数量的token，开通过超额认购的模式以增加市场期望。',
                        }
                    ]
                },
                {
                    id: 1,
                    name: 'DTO有几个阶段?',
                    status: false,
                    pList: [{ id: 0, text: '4个阶段，先到先得、比例认购、清算和分配、开放交易和充提' }]
                },
                {
                    id: 2,
                    name: '通过DTO将如何保护用户?',
                    status: false,
                    pList: [{ id: 0, text: 'DTO项目的认购超额才能成功，如果失败则认购资金全部返还给用户' }]
                }
            ],
            DTONoneList: [
                {
                    id: 0,
                    name: '第一步KYC认购',
                    status: false,
                    pList: [{ id: 0, text: '参与DTO用户需完成GoodToken规定的KYC认证。' }]
                },
                {
                    id: 1,
                    name: '第二步DTO认购',
                    status: false,
                    pList: [
                        {
                            id: 0,
                            text: '1.DTO认购中，将Token Sale总量分为两部分，分别依次采用 “先到先得”和“比例分配”的模式进行认购。认购前会提前公布DTO发行总量，各部分数量，认购开始时间，认购价格，认购比重，单一账户认购数量限制，参与认购资质等要求。',
                        },
                        {
                            id: 1,
                            text: '2.率先采用“先到先得”模式开始认购，抢完即止，认购时长限定。DTO开始前，将会公布“先到先得”阶段个人硬顶。“先到先得”认购完毕之后立即开启“比例分配”认购，”比例分配”认购持续时长限定。',
                        },
                        {
                            id: 2,
                            text: '3.当超过认购总份额，则认为DTO成功。',
                        }
                    ]
                },
                {
                    id: 2,
                    name: '第三步清算和分配?',
                    status: false,
                    pList: [
                        {
                            id: 0,
                            text: '1.清算是指由GoodToken进行的DTO结果计算过程。最终结果将在清算完成后发布，包括但不限于参与人数，上市日期等。',
                        },
                        {
                            id: 1,
                            text: '2.在 “先到先得”部分成功认购的用户，其认购的Token数量与最终获得的Token数量比例为1:1',
                        },
                        {
                            id: 2,
                            text: '3.在 “比例分配”部分成功认购的用户，申请认购数量越多，最终获得Token的数量就越多',
                        },
                        {
                            id: 3,
                            text: '  - 个人认购数量：单一用户在 “比例分配”部分的认购数量',
                        },
                        {
                            id: 4,
                            text: '  - 本场认购成功比率：比例认购部分发行数量/比例认购部分认购总量',
                        },
                        {
                            id: 5,
                            text: '  - 比例认购部分发行数量：指在 “比例分配” 部分的发行量',
                        },
                        {
                            id: 6,
                            text: '  - 个人参与比例认购时成功认购数量：个人认购数量*本场认购成功比率',
                        },
                        {
                            id: 7,
                            text: '示例：假设本次DTO将发行100个token，其中70个于比例认购。比例认购阶段认购总量为200，参与者认购了50个token，他将在比例认购阶段获得token个数为17.5个token=50(70/200)',
                        }
                    ]
                }
            ],
            warningList: [
                {
                    index: 0,
                    text: '1. GoodToken交易所DTO交易仅适用于允许此类参与的地区和司法管辖区的用户。',
                },
                {
                    index: 1,
                    text: '2. 由于区域政策和法规，市场，技术，不可抗力或其他情况等因素，Token价格可能会大幅波动，所有交易不可撤销且不可退款。',
                },
                {
                    index: 2,
                    text: '3. 数字货币是一个高风险的销售项目，请合理评估您自己的风险承受能力并合理地进行交易，GoodToken.com不承担任何担保或责任。',
                },
                {
                    index: 3,
                    text: '4. 退出风险：由于Token的底层技术或者GoodToken资产网络交易平台的原因，您购买的 Token 可能无法全部或者部分提现。',
                },
                {
                    index: 4,
                    text: '5. GoodToken.com提供的所有商品和服务均按 “原样” 提供，不提供任何担保，包括但不限于：',
                    textList: [
                        { id: 0, text: '-任何适销性担保;' },
                        { id: 1, text: '-任何对特定用途的适用性的保证;' },
                        { id: 2, text: '-任何侵犯第三方知识产权保证;' },
                        { id: 3, text: '-任何法律明示或暗示的交易过程，履行过程，行业惯例及其他;' },
                    ]
                },
                {
                    index: 5,
                    text: '6. 在任何情况下，GoodToken.com不承担任何反担保的索赔或因供应商未能履行其对您的担保义务引起的任何损害的责任。',
                },
            ]
        }
    }
    componentDidMount() {
        this.getAdvertisingList()
    }
    getAdvertisingList = async () => {
        try {
            const params = {
                pageIndex: this.state.currentPage,
                pageSize: 8,
            }
            const res = await this.props.apis.getAdvertisingListFetch(params)
            this.setState({
                adList: res.data.list,
                total: res.data.total
            })
        } catch (error) {
            message.error(error)
        }
    }
    handleMouse = (item, type) => {
        const { id, status } = item
        if (status === 1 || status === 2 || status === 3 || status === 4 || status === 5 || status === 6) {
            if (type === 'in') {
                this.setState({ mouseIndex: id })
            } else {
                this.setState({ mouseIndex: null })
            }
        }
    }
    handleChoose = (item, type) => {
        if (type === 0) {
            const array = this.state.DTOList
            array.forEach((index, key) => {
                if (item.id === index.id) {
                    array[key].status = !array[key].status
                }
            })
            this.setState({ DTOList: array })
        } else {
            const array = this.state.DTONoneList
            array.forEach((index, key) => {
                if (item.id === index.id) {
                    array[key].status = !array[key].status
                }
            })
            this.setState({ DTONoneList: array })
        }
    }
    filterStatus = (item) => {
        const { status } = item
        switch (status) {
        case 1:
            return <div className="grey"><i className="iconfont icondengdai" />认购未开始</div>
        case 2:
            return <div className="yellow"><i className="iconfont icondengdai" />认购中...</div>
        case 3:
            return <div className="grey"><i className="iconfont iconright-1" />已结束</div>
        case 4:
            return <div className="grey"><i className="iconfont iconright-1" />已结束</div>
        case 5:
            return <div className="red"><i className="iconfont icongantanhao2" />认购失败</div>
        case 6:
            return <div className="red"><i className="iconfont icongantanhao2" />认购失败</div>
        case 7:
            return <div className="grey"><i className="iconfont icondengdai" />认购已取消</div>
        case 8:
            return <div className="grey"><i className="iconfont icondengdai" />认购已取消</div>
        case 9:
            return <div className="grey"><i className="iconfont icondengdai" />认购已取消</div>
        default:
            return status
        }
    }
    filterStars = (stars) => {
        if (!stars || stars === '0') return null
        const arr = new Array(Number(stars)).fill('')
        return arr.map((item, key) => <i className="iconfont iconxingxing" key={key} />)
    }
    jumpLink = (item) => {
        if (IsPC()) return false
        this.props.history.push(`/comm/subscribe/info?id=${item.id}`)
        return true
    }
    render() {
        const {
            adList,
            mouseIndex,
            DTOList,
            DTONoneList,
            warningList,
            currentPage,
            total
        } = this.state
        return (
            <div className="subscribeList">
                <div className="subscribeList-banner">
                    <Banner location={5} />
                </div>
                <div className="subscribeList-list">
                    <div className="subscribeList-listMain">
                        <h4>项目列表</h4>
                        <ul className="ul">
                            {
                                adList && adList.length > 0 ?
                                    adList.map(item => (
                                        <li
                                            key={item.id}
                                            onMouseOver={() => { this.handleMouse(item, 'in') }}
                                            onMouseOut={() => { this.handleMouse(item, 'out') }}
                                            onClick={() => { this.jumpLink(item) }}
                                        >
                                            <div
                                                className="subscribeList-itemTop"
                                                // style={{
                                                //     background: `url(${item.adPictureUrl}) center center / auto 100% no-repeat`
                                                // }}
                                                style={item.adPictureUrl !== '' ? { background: `url(${item.adPictureUrl}) center center / auto 100% no-repeat` } : null}
                                            >
                                                <h5>{item.name}正式启动</h5>
                                                <p>{item.title}</p>
                                                {this.filterStatus(item)}
                                            </div>
                                            <div className="subscribeList-itemBottom">
                                                <h5>{item.ad}</h5>
                                                <p>发售时间: {moment(item.startTime).format('YYYY.MM.DD')}-{moment(item.endTime).format('YYYY.MM.DD')}</p>
                                                <p>配售份额: {item.releaseAmount}</p>
                                                <p>兑换币种: {item.currency}</p>
                                                <p>风险评估: {this.filterStars(item.risk)} &nbsp;&nbsp;投资回报率: {this.filterStars(item.rateReturn)}</p>
                                            </div>
                                            <div
                                                className={mouseIndex === item.id ? 'active btn' : 'btn'}
                                                onClick={() => { this.props.history.push(`/comm/subscribe/info?id=${item.id}`) }}
                                            >
                                                查看详情
                                            </div>
                                        </li>
                                    ))
                                    :
                                    null
                            }
                        </ul>
                        {
                            total > 8 ?
                                <Pagination
                                    style={{ textAlign: 'center' }}
                                    current={currentPage}
                                    pageSize={8}
                                    total={total}
                                    onChange={(e) => { this.setState({ currentPage: e }, () => { this.getAdvertisingList() }) }}
                                />
                                :
                                null
                        }
                    </div>
                </div>
                <div className="subscribeList-collapse">
                    <div className="subscribeList-collapseMain">
                        <h5>DTO</h5>
                        <ul>
                            {
                                DTOList.map(item => (
                                    <li key={item.id}>
                                        <div style={{ borderBottom: `${item.status ? '1px solid #e6e6e6' : '1px solid transparent'}` }} onClick={() => { this.handleChoose(item, 0) }}>
                                            <p>{item.name}</p>
                                            <i className={item.status ? 'iconfont iconzhankai1 rotate' : 'iconfont iconzhankai1'} />
                                        </div>
                                        <div className={item.status ? 'active' : 'none'}>
                                            {
                                                item.pList.map(cat => (
                                                    <p key={cat.id}>
                                                        {cat.text}
                                                    </p>
                                                ))
                                            }
                                        </div>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                    <div className="subscribeList-collapseMain">
                        <h5>DTO参与指南</h5>
                        <ul>
                            {
                                DTONoneList.map(item => (
                                    <li key={item.id}>
                                        <div style={{ borderBottom: `${item.status ? '1px solid #e6e6e6' : '1px solid transparent'}` }} onClick={() => { this.handleChoose(item, 1) }}>
                                            <p>{item.name}</p>
                                            <i className={item.status ? 'iconfont iconzhankai1 rotate' : 'iconfont iconzhankai1'} />
                                        </div>
                                        <div className={item.status ? 'active' : 'none'}>
                                            {
                                                item.pList.map(cat => (
                                                    <p key={cat.id}>
                                                        {cat.text}
                                                    </p>
                                                ))
                                            }
                                        </div>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                </div>
                <div className="subscribeList-warning">
                    <div className="subscribeList-warningMain">
                        <h5>风险提示</h5>
                        {
                            warningList.map(item => (
                                <React.Fragment key={item.index}>
                                    <p key={item.index}>{item.text}</p>
                                    {
                                        item.textList && item.textList.length > 0 ?
                                            item.textList.map(cat => (
                                                <p className="textList" key={cat.id}>{cat.text}</p>
                                            ))
                                            :
                                            null
                                    }
                                </React.Fragment>
                            ))
                        }
                    </div>
                </div>
            </div>
        )
    }
}
