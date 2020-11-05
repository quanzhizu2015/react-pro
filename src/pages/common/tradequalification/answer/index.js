import React, { Component } from 'react'
import { connect } from 'react-redux'
import Message from '@/components/message'
import ProgressBar from '@/components/progressBar/index'
import NotifyPop from '@/components/notifyPop'
import Button from '@/components/button'
import { I18n } from 'react-i18next'
import '../trade.scss'
import './answer.scss'

// import ReactDom from 'react-dom';
@connect(state => ({
    test: state.test,
    testAction: state.testAction
}))

class Answer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visable: false,
            btnGrey: false,
            allChecked: false,
            answer: [{
                ans: '',
                inde: '',
                poin: '',
            },
            {
                ans: '',
                inde: '',
                poin: '',
            },
            {
                ans: '',
                inde: '',
                poin: '',
            },
            {
                ans: '',
                inde: '',
                poin: '',
            },
            {
                ans: '',
                inde: '',
                poin: '',
            },
            {
                ans: '',
                inde: '',
                poin: '',
            },
            {
                ans: '',
                inde: '',
                poin: '',
            }],
            answerList: [
                {
                    key: 1,
                    word: <I18n>{t => t('tradequalification.question1')}</I18n>,
                    ans1: <I18n>{t => t('tradequalification.answer1')}</I18n>,
                    ans2: <I18n>{t => t('tradequalification.answer2')}</I18n>,
                    yes: '0'
                },
                {
                    key: 2,
                    word: <I18n>{t => t('tradequalification.question2')}</I18n>,
                    ans1: <I18n>{t => t('tradequalification.answer3')}</I18n>,
                    ans2: <I18n>{t => t('tradequalification.answer4')}</I18n>,
                    yes: '1'
                },
                {
                    key: 3,
                    word: <I18n>{t => t('tradequalification.question3')}</I18n>,
                    ans1: <I18n>{t => t('tradequalification.answer5')}</I18n>,
                    ans2: <I18n>{t => t('tradequalification.answer6')}</I18n>,
                    yes: '1'
                },
                {
                    key: 4,
                    word: <I18n>{t => t('tradequalification.question4')}</I18n>,
                    ans1: <I18n>{t => t('tradequalification.answer7')}</I18n>,
                    ans2: <I18n>{t => t('tradequalification.answer8')}</I18n>,
                    yes: '1'
                },
                {
                    key: 5,
                    word: <I18n>{t => t('tradequalification.question5')}</I18n>,
                    ans1: <I18n>{t => t('tradequalification.answer9')}</I18n>,
                    ans2: <I18n>{t => t('tradequalification.answer10')}</I18n>,
                    yes: '1'
                },
                {
                    key: 6,
                    word: <I18n>{t => t('tradequalification.question6')}</I18n>,
                    ans1: <I18n>{t => t('tradequalification.answer11')}</I18n>,
                    ans2: <I18n>{t => t('tradequalification.answer12')}</I18n>,
                    yes: '1'
                },
                {
                    key: 7,
                    word: <I18n>{t => t('tradequalification.question7')}</I18n>,
                    ans1: <I18n>{t => t('tradequalification.answer13')}</I18n>,
                    ans2: <I18n>{t => t('tradequalification.answer14')}</I18n>,
                    yes: '1'
                }
            ]
        }
        this.quxiao = this.quxiao.bind(this)
        this.queding = this.queding.bind(this)
    }
    componentWillMount() {
    }
    // 返回上一步
    getBack = () => {
        this.setState({ visable: true })
    }
    handleCommit = () => {
        this.setState({ allChecked: true })
        if (this.state.answer[0].ans === this.state.answerList[0].yes
            && this.state.answer[1].ans === this.state.answerList[1].yes
            && this.state.answer[2].ans === this.state.answerList[2].yes
            && this.state.answer[3].ans === this.state.answerList[3].yes
            && this.state.answer[4].ans === this.state.answerList[4].yes
            && this.state.answer[5].ans === this.state.answerList[5].yes
            && this.state.answer[6].ans === this.state.answerList[6].yes) {
            // Message.success('恭喜你答对全部题目')
            this.props.history.push('/common/futures/activate')
        } else {
            Message.error(<I18n>{t => t('tradequalification.tip')}</I18n>)
        }
    }
    // 点击弹框确定按钮
    queding() {
        this.setState({ visable: false })
        this.props.history.push('/common/futures/learn')
    }
    // 点击弹框取消按钮
    quxiao() {
        this.setState({ visable: false })
    }
    // 判断题目是否正确
    chooseRadoo = (e, f, g) => {
        const ary = this.state.answer
        ary[e - 1].poin = g
        if (e === 1 && f === g) {
            ary[0].ans = g
            ary[0].inde = e
        } else if (e === 2 && f === g) {
            ary[1].ans = g
            ary[1].inde = e
        } else if (e === 3 && f === g) {
            ary[2].ans = g
            ary[2].inde = e
        } else if (e === 4 && f === g) {
            ary[3].ans = g
            ary[3].inde = e
        } else if (e === 5 && f === g) {
            ary[4].ans = g
            ary[4].inde = e
        } else if (e === 6 && f === g) {
            ary[5].ans = g
            ary[5].inde = e
        } else if (e === 7 && f === g) {
            ary[6].ans = g
            ary[6].inde = e
        } else {
            ary[e - 1].ans = '99'
            ary[e - 1].inde = e
        }
        this.setState({ answer: ary })
        if (ary[0].ans
            && ary[1].ans
            && ary[2].ans
            && ary[3].ans
            && ary[4].ans
            && ary[5].ans
            && ary[6].ans) {
            this.setState({ btnGrey: true })
        }
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
        const PopStyle = {
            padding: '0 20px 0 20px',
            textAlign: 'center',
            marginTop: '32px',
        }
        return (
            <I18n>
                {
                    t => (
                        <div className="answer">
                            <div className="answer-main">
                                <div className="answer-mainTop">
                                    <h3>{t('tradequalification.opentradetitle')}</h3>
                                    <p>{t('tradequalification.opentradesubtitle')}</p>
                                    <ProgressBar step={2} words={wordsArr} />
                                </div>
                                <div className="answer-mainCon">
                                    {
                                        this.state.answerList.map(item => (
                                            <div key={item.key}>
                                                <div className="answer-title">
                                                    {item.word}
                                                    {
                                                        this.state.allChecked === true ?
                                                            <span>
                                                                {
                                                                    this.state.answer[item.key - 1].ans
                                                                    === item.yes ?
                                                                        <i className="iconfont iconduihao2" />
                                                                        :
                                                                        null
                                                                }
                                                                {
                                                                    this.state.answer[item.key - 1].ans === '99' ?
                                                                        <i className="iconfont iconchahao" />
                                                                        :
                                                                        null
                                                                }
                                                            </span>
                                                            :
                                                            null
                                                    }
                                                </div>
                                                {/* <span className="answer-radio">
                                                    <span
                                                        className={this.state.answer[item.key - 1].ans === '0' ? 'radio' : 'radio active'}
                                                        onClick={() => { this.chooseRadoo(item.key, item.yes, '0') }}
                                                    >
                                                        <span />
                                                    </span>
                                                    {item.ans1}
                                                    <span
                                                        className={this.state.answer[item.key - 1].ans === '99' ? 'radio' : 'radio active'}
                                                        onClick={() => { this.chooseRadoo(item.key, item.yes, '1') }}
                                                    >
                                                        <span />
                                                    </span>
                                                    {item.ans2}
                                                </span> */}
                                                <span className="answer-radio">
                                                    <span className="answer-axiba" onClick={() => { this.chooseRadoo(item.key, item.yes, '0') }}>
                                                        <span className={this.state.answer[item.key - 1].poin === '0' ? 'radio' : 'radio active'}>
                                                            <span />
                                                        </span>
                                                        {item.ans1}
                                                    </span>
                                                    <span className="answer-axiba" onClick={() => { this.chooseRadoo(item.key, item.yes, '1') }}>
                                                        <span className={this.state.answer[item.key - 1].poin === '1' ? 'radio' : 'radio active'}>
                                                            <span />
                                                        </span>
                                                        {item.ans2}
                                                    </span>
                                                </span>
                                            </div>
                                        ))
                                    }
                                </div>
                                <div className="answer-mainFoot">
                                    <Button onClick={() => { this.getBack() }}>{t('tradequalification.info1')}</Button>
                                    <Button theme="primary" disabled={this.state.btnGrey === false} onClick={() => { this.handleCommit() }}>{t('tradequalification.info2')}</Button>
                                </div>
                            </div>
                            <NotifyPop
                                Popstyle={PopStyle}
                                visable={this.state.visable}
                                width="378"
                                height="233"
                                confirm={this.queding}
                                cancel={this.quxiao}
                            >
                                <p className="NotifyP">{t('tradequalification.info3')}</p>
                            </NotifyPop>
                        </div>
                    )
                }
            </I18n>
        )
    }
}
export default Answer

