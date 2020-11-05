import React, { Component } from 'react'
import { connect } from 'react-redux'
import message from '@/components/message'
import { I18n } from 'react-i18next'

import './index.scss'

function toText(text) {
    const textDom = document.createElement('div')
    textDom.innerHTML = text
    return textDom.innerText
}

@connect(state => ({
    apis: state.apis
}))
export default class MarketNotice extends Component {
    state = {
        notices: null,
        idx: 0
    }
    componentWillMount() {
        this.initBanner()
    }
    componentWillUnmount() {
        if (this.invertTimeout) {
            clearTimeout(this.invertTimeout)
        }
    }
    async initBanner() {
        const { apis } = this.props
        // this.setState({
        //     loading: true
        // })
        try {
            const res = await apis.getContentText({
                location: 2
            })
            // this.setState({
            //     loading: false
            // })
            if (res.code === 0) {
                this.setState({
                    notices: res.data.allInfos
                })
                this.swiperNotice()
            }
        } catch (e) {
            message.error(e.message)
            // this.setState({
            //     loading: false
            // })
        }
    }
    swiperNotice() {
        if (this.invertTimeout) {
            clearTimeout(this.invertTimeout)
        }
        this.invertTimeout = setTimeout(() => {
            const { idx, notices } = this.state
            if (notices && (idx >= notices.length - 1)) {
                this.setState({
                    idx: idx + 1
                })
                setTimeout(() => {
                    this.setState({
                        idx: 0
                    })
                }, 300)
            } else {
                this.setState({
                    idx: idx + 1
                })
            }
            this.swiperNotice()
        }, 3000)
    }
    render() {
        const { notices, idx } = this.state
        // const loadIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />
        const style = idx === 0 ? {
            transition: 'none'
        } : null
        return notices && notices.length > 0 ? (
            <I18n>
                {
                    (t, { i18n }) => {
                        const key = i18n.language === 'zh' ? 0 : 1
                        const noticeDatas = []
                        for (let i = 0; i < notices.length; i += 1) {
                            const noticeLangs = notices[i].allLanguage
                            for (let j = 0; j < noticeLangs.length; j += 1) {
                                const notice = noticeLangs[j]
                                notice.index = notices[i].index
                                if (key === notice.language) {
                                    noticeDatas.push(notice)
                                }
                            }
                        }
                        return (
                            noticeDatas.length > 0 ? (
                                <div className="Market-notice">
                                    <div className="Market-notice-content">
                                        <i className="iconfont iconlaba" />
                                        <ul
                                            style={{
                                                ...style,
                                                transform: `translateY(-${idx * 42}px)`
                                            }}
                                        >
                                            {
                                                noticeDatas.map((item, i) => (<li key={i}><a href={`${item.hyperlink}`}>{toText(item.title)}</a></li>))
                                            }
                                            <li>
                                                <a href={`${noticeDatas[0].hyperlink}`}>{toText(noticeDatas[0].title)}</a>
                                            </li>
                                        </ul>
                                        <div>
                                            {/* 这个连接最好走后台配置 */}
                                            <a href={t('market.moreLink')} target="_blank" rel="noopener noreferrer" >{t('market.more')}</a>
                                        </div>
                                    </div>
                                </div>
                            ) : null
                        )
                    }
                }
            </I18n>
        ) : null
    }
}
