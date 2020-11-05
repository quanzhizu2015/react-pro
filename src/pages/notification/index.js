import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { I18n } from 'react-i18next'
import Helmet from 'react-helmet'
import Header from '@/components/header'
import Footer from '@/components/funcoinFooter'
// import Message from '@/components/message'
import { Pagination } from 'antd'
import './notification.scss'

let paramAryfresh
@connect(state => ({
    userAuth: state.userAuth,
    theme: state.theme,
    apis: state.apis,
    lang: state.lang,
    wsObj: state.wsObj,
    wsData: state.wsData,
    sendWs: state.sendWs,
    wsConnet: state.wsConnet
}))
export default class Notification extends React.Component {
    constructor() {
        super()
        this.state = {
            noticeData: {
                zh: [],
                en: [],
                ko: [],
            },
            renderData: [],
            active: null,
            pageInfo: {
                total: 0,
                pageSize: 10,
                pageNum: 1,
            }
        }
        this.init = 0
    }
    componentDidMount() {
        this.getNoticeList()
    }
    componentWillReceiveProps(props) {
        if (props.wsData.ws_9 === true) {
            return
        }
        if (props.wsConnet === true && props.wsConnet !== this.props.wsConnet && paramAryfresh) {
            this.props.dispatch(this.props.sendWs(this.props.wsObj, JSON.stringify(paramAryfresh)))
        }
        if (props.wsData.ws_9 && this.props.wsData.ws_9 !== props.wsData.ws_9) {
            const newdata = props.wsData.ws_9
            const objZh = newdata.infos.find(n => n.language === 'zh')
            const objEn = newdata.infos.find(n => n.language === 'en')
            const objKo = newdata.infos.find(n => n.language === 'ko')
            this.state.pageInfo.total = newdata.rowCount || 0
            this.setState({
                noticeData: {
                    zh: objZh ? objZh.list : [],
                    en: objEn ? objEn.list : [],
                    ko: objKo ? objKo.list : [],
                }
            })
            if (this.props.lang === 'zh') {
                this.setState({
                    renderData: objZh ? objZh.list : []
                }, () => { this.init = 1 })
            } else if (this.props.lang === 'en') {
                this.setState({
                    renderData: objEn ? objEn.list : []
                }, () => { this.init = 1 })
            } else {
                // console.log(objKo.list)
                this.setState({
                    renderData: objKo ? objKo.list : []
                }, () => { this.init = 1 })
            }
        }
        const { noticeData } = this.state
        if (props.lang !== this.props.lang) {
            let arr = []
            arr = noticeData[props.lang]
            this.setState({
                renderData: arr || []
            })
        }
    }
    async getNoticeList(page) { // 走websocket
        let userAuth = null
        if (localStorage.userAuth) userAuth = JSON.parse(localStorage.userAuth)
        const { pageInfo } = this.state
        const paramary = {
            userId: userAuth ? userAuth.userId : null,
            pageNum: page || 1,
            pageSize: pageInfo.pageSize || 10
        }
        const params = {
            reqType: 9,
            handleType: 1,
            param: JSON.stringify(paramary)
        }
        paramAryfresh = params
        this.props.dispatch(this.props.sendWs(this.props.wsObj, JSON.stringify(params)))
        // try {
        //     const res = await this.props.apis.getNoticeList(params)
        //     if (res.code === 0) {
        //         const objZh = res.data.infos.find(n => n.language === 'zh')
        //         const objEn = res.data.infos.find(n => n.language === 'en')
        //         this.state.pageInfo.total = res.data.rowCount || 0
        //         this.setState({
        //             noticeData: {
        //                 zh: objZh ? objZh.list : [],
        //                 en: objEn ? objEn.list : []
        //             }
        //         })
        //         if (this.props.lang === 'zh') {
        //             this.setState({
        //                 renderData: objZh ? objZh.list : []
        //             })
        //         } else {
        //             this.setState({
        //                 renderData: objEn ? objEn.list : []
        //             })
        //         }
        //     }
        // } catch (e) {
        //     Message.error(e.message)
        // }
    }
    openUp = (i) => {
        const { active } = this.state
        this.setState({ active: active === i ? null : i })
    }
    changePage = (page) => {
        this.getNoticeList(page)
        this.state.pageInfo.pageNum = page
    }
    render() {
        const {
            renderData,
            pageInfo,
            active
        } = this.state
        // const { lang } = this.props
        return (
            <I18n>
                {
                    (t, { i18n }) => {
                        this.t = t
                        this.i18n = i18n
                        return (
                            <div className="notification">
                                <Helmet>
                                    <title>{t('notice.noticeTitle')}</title>
                                    <meta content={t('notice.noticeContent')} name="description" />
                                    <meta content={t('notice.noticeKeywords')} name="keywords" />
                                </Helmet>
                                <Header showPadding isFixed />
                                <section className="main">
                                    <div className="top">
                                        <h1>{t('notice.noticeHead')}</h1>
                                    </div>
                                    <ul className="list">
                                        {
                                            renderData.map((item, index) => {
                                                const time = moment(item.infoTime).format('YYYY-MM-DD HH:mm:ss')
                                                const isActive = active === index
                                                let url = ''
                                                let word = 'look'
                                                switch (Number(item.infoType)) {
                                                case 1: url = '/comm/fund/transfer'; word = 'add'
                                                    break
                                                case 2: url = '/comm/fund/history/futures/filled'
                                                    break
                                                case 3: url = '/comm/fund/wallet'
                                                    break
                                                case 4: url = '/USDTbank/details/repayment'
                                                    break
                                                case 5: url = '/USDTbank/details/repayment'
                                                    break
                                                case 6: url = '/USDTbank/details/borrowing'
                                                    break
                                                case 7: url = '/USDTbank/details/repayment'
                                                    break
                                                case 8: url = '/USDTbank/details/borrowing'
                                                    break
                                                case 11: url = '/comm/fund/history/futures/filled'
                                                    break
                                                case 12: url = null
                                                    break
                                                case 13: url = '/comm/security/verification'
                                                    break
                                                default: url = '/notification'; word = 'look'
                                                    break
                                                }
                                                return (
                                                    <li key={index}>
                                                        <div className="left">
                                                            <span className="title">{item.title}</span>
                                                            <span className="time">{time}</span>
                                                        </div>
                                                        <i className="gun" />
                                                        <div className={`openUp ${isActive ? 'active' : ''}`} onClick={() => this.openUp(index)}>{t(`notice.${isActive ? 'openDown' : 'openUp'}`)}</div>
                                                        <div className="detailBox" style={isActive ? { height: '150px', opacity: '1' } : { height: '0', opacity: '0', padding: '0' }}>
                                                            <p>{item.infoMsg}</p>
                                                            {
                                                                url ? <Link to={url}>{t(`notice.${word}`)}</Link> : null
                                                            }
                                                        </div>
                                                    </li>
                                                )
                                            })
                                        }
                                    </ul>
                                </section>
                                <div className="page">
                                    <Pagination
                                        defaultCurrent={1}
                                        size="small"
                                        onChange={this.changePage}
                                        total={pageInfo.total}
                                        current={pageInfo.pageNum}
                                        pageSize={pageInfo.pageSize}
                                        style={{ textAlign: 'right' }}
                                    />
                                </div>
                                <Footer />
                            </div>
                        )
                    }
                }
            </I18n>
        )
    }
}
