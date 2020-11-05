import React, { Component } from 'react'
import { connect } from 'react-redux'
import { I18n } from 'react-i18next'
import { Checkbox } from 'antd'

// import Button from '@/components/button'
// import openimg from '@/assets/img/open/open.png'
// import expertimg from '@/assets/img/open/opentrade.svg'
import Message from '@/components/message'
import ProgressBar from '@/components/progressBar/index'
import './open.scss'

// import ReactDom from 'react-dom';
@connect(state => ({
    apis: state.apis,
    test: state.test,
    testAction: state.testAction,
    getUserAuth: state.getUserAuth
}))
class Open extends Component {
    constructor() {
        super()
        this.state = {
            isExpert: 0,
            checkboxV: false,
            // showXieyi: true
        }
        this.isExpert = this.isExpert.bind(this)
        this.isChecked = this.isChecked.bind(this)
        this.handleClick = this.handleClick.bind(this)
    }
    componentDidMount() {
        this.isExpert()
        // this.isChecked()
    }
    isExpert() {
        if (this.props.location.search) {
            this.setState({
                isExpert: 1
            })
        } else {
            this.setState({
                isExpert: 0
            })
        }
    }
    isChecked(e) {
        this.setState({
            checkboxV: e.target.checked
        })
    }
    // 点击按钮提交
    handleClick = async () => {
        try {
            const res = await this.props.apis.opencontract({
                contractType: 0,
                isExpert: this.state.isExpert
            })
            if (res.code === 0) {
                await this.props.dispatch(this.props.getUserAuth())
                Message.success(<I18n>{t => t('tradequalification.successInfo')}</I18n>)
            }
        } catch (e) {
            Message.error(e.message)
        }
        // this.props.history.push('/trade/futures')
    }
    render() {
        const wordsArr = [
            {
                word: <I18n>{t => t('tradequalification.knowtrade')}</I18n>,
                icon: 'point'
            },
            {
                word: <I18n>{t => t('tradequalification.question')}</I18n>,
                icon: 'point'
            },
            {
                word: <I18n>{t => t('tradequalification.opentrade')}</I18n>,
                icon: 'point'
            }
        ]
        return (
            <I18n>
                {
                    t => (
                        <div className="open">
                            <div className="open-wrap">
                                <div>{t('tradequalification.openTrade')}</div>
                                <p>{t('tradequalification.opentradesubtitle')}</p>
                                <ProgressBar step={3} words={wordsArr} />
                                {
                                    this.state.isExpert === 1 ?
                                        <div className="ifopen">
                                            <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="200" height="200">
                                                <use xlinkHref="#iconkaitongjiaoyi" width="200" />
                                            </svg>
                                            <p>{t('tradequalification.startTrade')}</p>
                                        </div>
                                        :
                                        <div className="ifopen">
                                            <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="200" height="200">
                                                <use xlinkHref="#iconresetpassword" width="200" />
                                            </svg>
                                            <p>{t('tradequalification.contragulationTrade')}</p>
                                        </div>
                                }
                                <div className="agree">
                                    <Checkbox onChange={(e) => { this.isChecked(e) }} />
                                    <span>{t('tradequalification.canTradeL')}</span>
                                    <a href="/common/futures/agreement" target="_blank">{t('tradequalification.agreement')}</a>
                                </div>
                                <div>
                                    <button
                                        disabled={!this.state.checkboxV}
                                        onClick={this.handleClick}
                                    >
                                        {t('tradequalification.openTrade')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                }
            </I18n>
        )
    }
}
export default Open

