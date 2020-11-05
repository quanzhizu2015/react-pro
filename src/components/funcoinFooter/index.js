import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { I18n } from 'react-i18next'
// import weixin from '../../assets/img/footer/erweima.png' // FUNCOIN
import weixin from '@/assets/img/footer/image3.jpg' // OAK
// import qq from '../../assets/img/footer/qq.jpg' // FUNCOIN
import qq from '@/assets/img/footer/qq-oak.jpg' // OAK
import OAKIMG from '@/assets/img/logo/logo1-2.png' // OAK
import './index.scss'
import message from '@/components/message'

@withRouter
@connect(state => ({
    // httpConfig: state.httpConfig,
    lang: state.lang,
    apis: state.apis,
}))
export default class funcoinFooter extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showQQ: false,
            showWeiXin: false,
            friendLink: null
        }
    }
    componentDidMount() {
        this.getFriendLink()
    }
    getFriendLink = async () => {
        try {
            const res = await this.props.apis.getLinkList()
            if (res.code === 0) {
                this.setState({ friendLink: res.data })
            }
        } catch (e) {
            message.error(e)
        }
    }
    // 跳转链接
    goToLink = (item) => {
        if (item.icon === 'iconweixin' || item.icon === 'iconqq') return false
        window.open(`${item.link}`)
        return true
    }
    // 显示微信
    handleMouse = (icon) => {
        if (icon === 'iconweixin') {
            this.setState({ showWeiXin: true })
            return true
        }
        if (icon === 'iconqq') {
            this.setState({ showQQ: true })
            return true
        }
        return false
    }
    render() {
        const { friendLink } = this.state
        const contantList = [{
            index: 1,
            icon: 'iconFacebook',
            link: 'https://www.facebook.com/GoodTokenGroup',
        }, {
            index: 2,
            icon: 'iconweibo',
            link: 'http://weibo.cn/GoodToken',
        }, {
            index: 3,
            icon: 'iconweixin',
            link: 'http://shang.qq.com/wpa/qunwpa?idkey=5e780920c76507b4853baecee5b95dcfae5f823e3fd6f87b15c3923e9f9557a0',
        }, {
            index: 4,
            icon: 'iconqq',
            link: 'http://shang.qq.com/wpa/qunwpa?idkey=5e780920c76507b4853baecee5b95dcfae5f823e3fd6f87b15c3923e9f9557a0',
        }, {
            index: 5,
            icon: 'icontelegram',
            link: 'https://t.me/GoodTokenGroup'
        }, {
            index: 6,
            icon: 'iconbiyong1',
            link: 'https://0.plus/GoodTokenGroup'
        }]
        // const { httpConfig } = this.props
        const footerLeft = {
            name: t('footer.tit'),
            desc: t('footer.tit0'),
        }
        const footerList = [
            {
                name: t('footer.title1'),
                li: [
                    {
                        name: t('footer.cont1_2'),
                        link: 'https://goodtoken.zendesk.com/hc/zh-cn/sections/360005440674-%E5%85%AC%E5%91%8A'
                    },
                    {
                        name: t('footer.cont3_4'),
                        // link: 'https://funcoinsupport.zendesk.com/hc/zh-cn' // FUNCOIN
                        link: 'https://goodtoken.zendesk.com/hc/zh-cn' // OAK
                    },
                    // {
                    //     name: t('footer.cont1_3'),
                    //     link: 'http://goodtoken.mikecrm.com/c3P7JaC',
                    // },
                ]
            },
            {
                name: t('footer.title2'),
                li: [
                    {
                        name: t('footer.cont2_1'),
                        link: 'https://goodtoken.zendesk.com/hc/zh-cn/articles/360035127614-GoodToken%E4%BD%BF%E7%94%A8%E5%8D%8F%E8%AE%AE'
                    },
                    {
                        name: t('footer.cont2_3'),
                        link: 'https://goodtoken.zendesk.com/hc/zh-cn/articles/360035613213-%E6%B3%95%E5%BE%8B%E7%94%B3%E6%98%8E'
                    },
                    {
                        name: t('footer.cont2_2'),
                        link: 'https://goodtoken.zendesk.com/hc/zh-cn/articles/360035127054-%E9%9A%90%E7%A7%81%E7%94%B3%E6%98%8E'
                    }
                ]
            },
            // {
            //     name: t('footer.title3'),
            //     li: [
            //         // {
            //         //     name: t('footer.cont3_1'),
            //         //     link: ''
            //         // },
            //         // {
            //         //     name: t('footer.cont3_3'),
            //         //     link: 'https://coinoak.zendesk.com/hc/zh-cn'
            //         // },
            //         {
            //             name: t('footer.cont3_4'),
            //             // link: 'https://funcoinsupport.zendesk.com/hc/zh-cn' // FUNCOIN
            //             link: 'https://coinoak.zendesk.com/hc/zh-cn' // OAK
            //         }
            //     ]
            // },
            {
                name: t('footer.title4'),
                li: [{
                    name: t('footer.cont4_1'),
                    link: '/upCoin'
                }, {
                    name: t('footer.cont4_2'),
                    link: '/comm/fee'
                }, {
                    name: t('footer.cont3_2'),
                    link: '/comm/api',
                    type: true
                }
                ]
            }
        ]
        return (
            <I18n>
                {(t, { i18n }) => {
                    this.i18n = i18n
                    this.t = t
                    return (
                        <div className={friendLink ? 'funcoin-footer funcoin-footer-active' : 'funcoin-footer'}>
                            <div className="footer-main">
                                <div className="footer-left">
                                    {/* <h1>{footerLeft.name}</h1> */}
                                    <img src={OAKIMG} alt="" onClick={() => { this.props.history.push('/') }} />
                                    <span>{footerLeft.desc}</span>
                                    <div className="footer-leftMain">
                                        {
                                            contantList.map((item) => (
                                                <div key={item.index} className="icon-item" onClick={() => { this.goToLink(item) }}>
                                                    <i
                                                        className={`iconfont ${item.icon}`}
                                                        onMouseOver={() => { this.handleMouse(item.icon) }}
                                                        onMouseOut={() => { this.setState({ showQQ: false, showWeiXin: false }) }}
                                                    />
                                                </div>
                                            ))
                                        }
                                        <div className={this.state.showWeiXin ? 'active qrcode' : 'qrcode'}>
                                            <img src={weixin} alt="" />
                                        </div>
                                        <div className={this.state.showQQ ? 'active qrcode' : 'qrcode'}>
                                            <img src={qq} alt="" />
                                        </div>
                                    </div>
                                    <em>© 2019-2020 GoodToken</em>
                                </div>
                                <div className="footer-right">
                                    {
                                        footerList.map((item) => (
                                            <ul key={item.name}>
                                                <li>{item.name}</li>
                                                {
                                                    item.li.map((cat) => (
                                                        <li key={cat.name}>
                                                            {
                                                                cat.type ?
                                                                    <React.Fragment>
                                                                        {
                                                                            this.props.lang === 'zh' ?
                                                                                <Link to={cat.link}>{cat.name}</Link>
                                                                                :
                                                                                null
                                                                        }
                                                                    </React.Fragment>
                                                                    :
                                                                    <a target="_blank" rel="noopener noreferrer" href={cat.link}>{cat.name}</a>
                                                            }
                                                        </li>
                                                    ))
                                                }
                                            </ul>
                                        ))
                                    }
                                </div>
                            </div>
                            {
                                friendLink && friendLink.length > 0 ?
                                    <div className="footer-link">
                                        <ul>
                                            <li>{t('footer.title5')}: </li>
                                            {
                                                friendLink.map(item => (
                                                    <li
                                                        key={item.name}
                                                        onClick={() => { window.open(item.hyperlinks) }}
                                                    >
                                                        {item.name}
                                                    </li>
                                                ))
                                            }
                                        </ul>
                                    </div>
                                    :
                                    null
                            }
                        </div>
                    )
                }}
            </I18n>
        )
    }
}
