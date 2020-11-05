import React, { Component } from 'react'
import { connect } from 'react-redux'
import QRCode from 'qrcode.react'

import message from '@/components/message'
import './index.scss'
import One from '@/assets/img/market/1-1.png'
import Two from '@/assets/img/market/1-2.png'
import Three from '@/assets/img/market/1-3.png'
import Four from '@/assets/img/market/1-4.png'
import AppImg from '@/assets/img/market/app.png'

// import OneImg from '@/assets/img/market/1.png'
// import TwoImg from '@/assets/img/market/2.png'
// import ThreeImg from '@/assets/img/market/3.png'
// import FourImg from '@/assets/img/market/4.png'

// import JianTou from '@/assets/img/market/jiantou.png'

@connect(state => ({
    apis: state.apis,
    AndroidConfig: state.AndroidConfig,
    AppConfig: state.AppConfig
}))
export default class MarketDescribe extends Component {
    jumpApp = (f) => {
        if (f) {
            window.location.href = this.props.AndroidConfig
        } else {
            message.info('请扫描上方二维码下载app')
        }
    }
    render() {
        return (
            <div className="marketDescribe">
                {/* <div className="marketDescribe-one">
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
                </div> */}

                <div className="marketSubscribe-bottom">
                    <div className="marketSubscribe-bottomMain">
                        <div className="marketSubscribe-bottomLeft" />
                        <div className="marketSubscribe-bottomRight">
                            <h5>Domain Token Onboarding</h5>
                            <p>Domain Token Onboarding，简称DTO，是GoodToken推出的新一代utility token发行与监督协议。DTO协议遵循传统金融市场开发的信息披露机制，为投资者提供全方位项目信息披露。在GoodToken,唯有通过DTO协议的通证才可以挂牌交易，项目需满足以下基本条件</p>
                            <div>
                                <i className="iconfont iconduihao" />
                                项目在DTO阶段认购超出总额度
                            </div>
                            <br />
                            <div>
                                <i className="iconfont iconduihao" />
                                项目需达到GoodToken研发的多维度评估模型基础分数
                            </div>
                            <span>
                                咨询DTO事宜，请发邮件至：
                                <span>DTO@GOODTOKEN.COM</span>
                            </span>
                        </div>
                    </div>
                </div>

                <div className="Market-app">
                    <div className="Market-app-main">
                        <div className="Market-app-main-left">
                            <QRCode
                                value={this.props.AppConfig}
                                style={{
                                    width: '140px',
                                    height: '140px',
                                    background: '#fff',
                                    padding: '5px'
                                }}
                            />
                            <p>请扫描官方二维码下载GoodToken APP</p>
                            <div className="qrcode">
                                <div onClick={() => { this.jumpApp() }}>
                                    <i className="iconfont iconios" />
                                    <span>IOS</span>
                                </div>
                                <div onClick={() => { this.jumpApp(1) }}>
                                    <i className="iconfont iconanzhuologo1" />
                                    <span>Android</span>
                                </div>
                            </div>
                        </div>
                        <div className="Market-app-main-right">
                            <img src={AppImg} alt="" />
                        </div>
                    </div>
                </div>
                <div className="marketDescribe-two">
                    <div className="marketDescribe-twoMain">
                        <div className="marketDescribe-twoLeft">
                            <h5>全球首家域名资产通证平台</h5>
                            <p>GOODTOKEN是一个基于区块链技术的域名资产交易平台，致力于通过先进的区块链技术与创新商业模式对域名这个万亿规模的数字资产市场进行创新与升级。创世团队有着五年以上区块链交易所开发和运营经验，十年以上域名投资经验。GOODTOKEN的使命是让域名在流动中创造更大的价值。</p>
                        </div>
                        <div className="marketDescribe-twoRight" />
                    </div>
                </div>
                <div className="marketDescribe-three">
                    <div className="marketDescribe-threeMain">
                        <h4>核心优势</h4>
                        <div className="marketDescribe-threeBottom">
                            <div className="marketDescribe-threeItem">
                                <img src={One} alt="" />
                                <p>创新模式</p>
                                <span>域名申购、交易、交割</span>
                            </div>
                            <div className="marketDescribe-threeItem">
                                <img src={Two} alt="" />
                                <p>资产保障</p>
                                <span>域名资产已托管到本平台</span>
                            </div>
                            <div className="marketDescribe-threeItem">
                                <img src={Three} alt="" />
                                <p>规则透明</p>
                                <span>公开透明</span>
                            </div>
                            <div className="marketDescribe-threeItem">
                                <img src={Four} alt="" />
                                <p>交易便捷快速</p>
                                <span>金融级交易系统</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
