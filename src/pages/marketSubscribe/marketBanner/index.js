import React, { Component } from 'react'
import { connect } from 'react-redux'
import message from '@/components/message'
// import Header from '@/components/header'
import cs from 'classnames'
import { I18n } from 'react-i18next'

import './index.scss'

@connect(state => ({
    apis: state.apis
}))
export default class MarketBanner extends Component {
    state = {
        // loading: false,
        idx: 0,
        banners: null
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
            const res = await apis.getContentPic({
                location: 2
            })
            // this.setState({
            //     loading: false
            // })
            if (res.code === 0) {
                this.setState({
                    banners: res.data.allInfos
                })
                this.intervalPic()
            }
        } catch (e) {
            message.error(e.message)
            // this.setState({
            //     loading: false
            // })
        }
    }
    intervalPic() {
        if (this.invertTimeout) {
            clearTimeout(this.invertTimeout)
        }
        this.invertTimeout = setTimeout(() => {
            const { idx, banners } = this.state
            const bannerDatas = []
            if (banners && banners.length > 0) {
                for (let i = 0; i < banners.length; i += 1) {
                    const bannerLangs = banners[i].allLanguage
                    for (let j = 0; j < bannerLangs.length; j += 1) {
                        const banner = bannerLangs[j]
                        if (this.key === banner.language) {
                            bannerDatas.push(banner)
                        }
                    }
                }
            }
            if (idx >= bannerDatas.length - 1) {
                this.state.idx = 0
                this.setState({})
                this.intervalPic()
            } else {
                this.setState({
                    idx: idx + 1
                })
            }
            this.intervalPic()
        }, 3000)
    }
    swiperHandler(idx) {
        this.setState({ idx })
        this.intervalPic()
    }
    render() {
        const { banners, idx } = this.state
        return (
            <I18n>
                {
                    (t, { i18n }) => {
                        this.key = i18n.language === 'zh' ? 0 : 1
                        const bannerDatas = []
                        if (banners && banners.length > 0) {
                            for (let i = 0; i < banners.length; i += 1) {
                                const bannerLangs = banners[i].allLanguage
                                for (let j = 0; j < bannerLangs.length; j += 1) {
                                    const banner = bannerLangs[j]
                                    if (this.key === banner.language) {
                                        bannerDatas.unshift(banner)
                                    }
                                }
                            }
                        }
                        if (bannerDatas.length > 0 && idx + 1 > bannerDatas.length) {
                            this.setState({
                                idx: 0
                            })
                        }
                        return (
                            <div>
                                {/* <Header type="market" isFixed /> */}
                                <div className="market-banner">
                                    {/* <MarketBannerSpin spinning={loading} /> */}
                                    {
                                        bannerDatas.length > 0 ?
                                            (
                                                [
                                                    <ul key="bannerKey">
                                                        {
                                                            bannerDatas.map((item, i) => (
                                                                <li
                                                                    key={i}
                                                                    test={i + idx}
                                                                    className={cs({
                                                                        active: i === idx
                                                                    })}
                                                                >
                                                                    {/* eslint-disable-next-line */}
                                                                    <a
                                                                        href={item.hyperlink}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        style={{
                                                                            background: `url(${item.url}) center center / auto 100% no-repeat`
                                                                        }}
                                                                    />
                                                                </li>
                                                            ))
                                                        }
                                                    </ul>,
                                                    <div key="bulletKey" className="market-banner-pagination">
                                                        {
                                                            bannerDatas.map((item, i) =>
                                                                (
                                                                    <i
                                                                        key={`bullet-${i}`}
                                                                        onClick={() => {
                                                                            this.swiperHandler(i)
                                                                        }}
                                                                        className={cs({
                                                                            'market-banner-bullet': true,
                                                                            active: i === idx
                                                                        })}
                                                                    />
                                                                ))
                                                        }
                                                    </div>
                                                ]
                                            )
                                            :
                                            null
                                    }
                                </div>
                            </div>
                        )
                    }
                }
            </I18n>
        )
    }
}
