import React, { Component } from 'react'
import { connect } from 'react-redux'
import Swiper from 'swiper/dist/js/swiper.js'
import 'swiper/dist/css/swiper.min.css'
import bigdecimal from 'bigdecimal'
import Spin from '@/components/loading'
import { chooseImg } from '@/assets/js/common'
import { withRouter } from 'react-router'

import './index.scss'

const { BigDecimal } = bigdecimal
@withRouter
/* eslint-disable */
@connect(state => ({
    apis: state.apis,
    userAuth: state.userAuth,
    wsData: state.wsData,
    ws_14: state.wsData.ws_14,
    wsObj: state.wsObj,
    sendWs: state.sendWs,
    wsConnet: state.wsConnet,
    lang: state.lang,
    coinImg: state.coinImg
}))
export default class MarketCard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            // leftSide: 50,
            currentIndex: 0,
            cardList: [
              {
                amount: '--',
                klineNameL: '--',
                now: '--',
                dailyReturn: '--',
                id: 0
              },
              {
                amount: '--',
                klineNameL: '--',
                now: '--',
                dailyReturn: '--',
                id: 1
              },
              {
                amount: '--',
                klineNameL: '--',
                now: '--',
                dailyReturn: '--',
                id: 2
              },
              {
                amount: '--',
                klineNameL: '--',
                now: '--',
                dailyReturn: '--',
                id: 3
              },
              {
                amount: '--',
                klineNameL: '--',
                now: '--',
                dailyReturn: '--',
                id: 4
              }
            ],
            choose: true,
            loadingState: false,
        }
    }
    componentDidMount() {
        this.init()
        this.getWsCardData()
        this.setState({ loadingState: true })
    }
    componentWillReceiveProps(props) {
        if (props.wsData && this.props.wsData) {
            if (props.wsData.ws_10 && this.props.wsData.ws_10 ) {
                const { ws_10 } = props.wsData;
                this.setState({  })
                this.setState({
                    cardList: ws_10,
                    loadingState: false
                })
                this.pickOpenInit()
            }
        }
    }
    componentWillUnmount() {
        const param = {
            reqType: -5,
            type: 10
        }
        this.props.dispatch(this.props.sendWs(this.props.wsObj, JSON.stringify(param)))
    }
    // 判断是否调用init
    pickOpenInit = () => {
        const { choose } = this.state;
        if (choose) {
            setTimeout(() => {
                this.init();
            }, 200)
            this.setState({ choose: false })
        }
    }
    // 初始化swiper
    init = () => {
        var mySwiper = new Swiper('.swiper-container', {
            slidesPerView: 4,
            spaceBetween: 30,
            observer: true, // 修改swiper自己或子元素时，自动初始化swiper 
            observeParents: false, // 修改swiper的父元素时，自动初始化swiper 
            loop: true,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            autoplay: {
                delay: 2500,
                stopOnLastSlide: false,
                disableOnInteraction: false,
            },
            onSlideChangeEnd: function(swiper){ 
                swiper.update();  
                mySwiper.startAutoplay();
                mySwiper.reLoop();  
            }
        });
    }
    // 获取websocket数据
    getWsCardData = () => {
        const paramAry = {
            reqType: 10,
            param: {
                type: 10,
                // subType: 14,
                // sessionId: localStorage.sessionId || null
            }
        }
        this.props.dispatch(this.props.sendWs(this.props.wsObj, JSON.stringify(paramAry)))
    }
    handleClick = (item) => {
        // 跳转到USDKURL中
        this.props.history.push(`/trade/spot?pairId=${item.klineId}`)
    }
    // 筛选看涨看跌
    filterUpDown = (amount) => {
        if (amount) {
            if(Number(amount) === 0) {
                return 'swipe-none'
            } else {
                if (amount.indexOf('-') !== -1) {
                    return 'swipe-down'
                } else {
                    return 'swipe-up'
                }
            }
            
        }
    }
    getCoin = (item) => {
        if (item && item.length > 0) {
            return item.split('/')
        }
        return ''
    }
    render() {
        const { cardList, loadingState } = this.state;
        // console.log(cardList)
        return (
            <div className="swiper-main">
            
            <div className="swiper-container">
                {
                    cardList ?
                        <div className="swiper-wrapper">
                            {
                                cardList.map((item) => (
                                    <div key={item.id}  
                                        className="swiper-slide" 
                                        onClick={() => this.handleClick(item) }
                                    >
                                        <Spin spinning={loadingState}>
                                            <p>
                                                <span>{this.getCoin(item.klineName)[0]}</span>
                                                /
                                                {this.getCoin(item.klineName)[1]}
                                            </p>
                                            {/* <img src={item.logo} /> */}
                                            {
                                                !loadingState && item.klineName ?
                                                    <img width="20px" height="20px" src={chooseImg(item.klineName, this.props.coinImg)} />
                                                    :
                                                    null
                                            }
                                            {/* <img width="20px" height="20px" src={item.logo} /> */}
                                            {/* <img width="20px" height="20px" src="https://cdn.mytoken.org/FuNmFv6paCxFy511qw4S8PWQ37rn" /> */}
                                            {/* 最新价 */}
                                            <span className="swipe-lable">{t('market.newPrice')}</span>
                                            <div className="swipe-content">
                                                <span>{item.now || '--'}</span>
                                                {
                                                  item.cnyRate && item.cnyRate !== '--' ?
                                                    <span className="swipe-none">
                                                        ≈ {(BigDecimal(item.now).multiply(BigDecimal(item.cnyRate)).floatValue()).toFixed(2)} CNY
                                                    </span>
                                                    :
                                                    null
                                                }
                                            </div>
                                            {/* 成交额 */}
                                            <span className="swipe-lable">{t('market.tradeVolume')}</span>
                                            <div className="swipe-content">
                                                <span>{item.amount || '--'} {item.assetName || ''}</span>
                                                <span className={this.filterUpDown(item.dailyReturn)}>
                                                    {item.dailyReturn || '--'} %
                                                </span>
                                            </div>
                                        </Spin>
                                    </div>
                                ))
                            }
                        </div>
                        :
                        null
                }
            </div>
            <div
                className="swiper-button-next"
                style={{
                    right: '0',
                    outline: 'none',
                    top: '46%',
                    backgroundSize: '50%',
                    backgroundColor: 'rgba(181,181,181,0.2)',
                    width: '25px',
                    height: '54px',
                    borderRadius: '6px',
                }}
            />
            <div
                className="swiper-button-prev"
                style={{
                    left: '0',
                    outline: 'none',
                    top: '46%',
                    backgroundSize: '50%',
                    backgroundColor: 'rgba(181,181,181,0.2)',
                    width: '25px',
                    height: '54px',
                    borderRadius: '6px',
                }}
            />
            </div>
        )
    }
}
