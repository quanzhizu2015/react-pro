import React, { Component } from 'react'
import { connect } from 'react-redux'
import { I18n } from 'react-i18next'
import ProgressBar from '@/components/progressBar/index'
import Button from '@/components/button/index'
import './know.scss'

// import ReactDom from 'react-dom';
@connect(state => ({
    test: state.test,
    testAction: state.testAction
}))
class Know extends Component {
    componentWillMount() {
    }
    nextQuestion = () => {
        this.props.history.push('/common/futures/answer')
    }
    nextExpert = () => {
        this.props.history.push('/common/futures/activate?isExpert=true')
    }
    render() {
        const wordsArr = [
            {
                word: <I18n>{t => t('tradequalification.knowtrade')}</I18n>,
                icon: 'point',
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
        const knowContent = [
            {
                key: 0,
                label: 'tradequalification.label0',
                content: []
            },
            {
                key: 1,
                label: 'tradequalification.label',
                content: [
                    'tradequalification.content1',
                    'tradequalification.content2',
                    'tradequalification.content3',
                    'tradequalification.content4',
                    'tradequalification.content5',
                    'tradequalification.content6',
                ]
            }, {
                key: 2,
                label: 'tradequalification.label1',
                content: [
                    'tradequalification.content7',
                    'tradequalification.content8',
                    'tradequalification.content9',
                ]
            }, {
                key: 3,
                label: 'tradequalification.label2',
                content: [
                    'tradequalification.content10',
                    'tradequalification.content11',
                ]
            }, {
                key: 4,
                label: 'tradequalification.label3',
                content: [
                    'tradequalification.content14',
                ]
            }, {
                key: 5,
                label: 'tradequalification.label4',
                content: [
                    'tradequalification.content15',
                    'tradequalification.content16',
                    'tradequalification.content17',
                ]
            }
        ]
        return (
            <div className="know">
                <I18n>
                    {t => (
                        <div className="know-main">
                            <div className="know-mainTop">
                                <h3>{t('tradequalification.opentradetitle')}</h3>
                                <p>{t('tradequalification.opentradesubtitle')}</p>
                                <ProgressBar step={1} words={wordsArr} />
                            </div>
                            <div className="know-body">
                                {knowContent.map(item => (
                                    <div key={item.label}>
                                        <div className="label-style1">
                                            <p>{t(item.label)}</p>
                                        </div>
                                        <div className="content-style">
                                            {item.content.map((itemContent, index) => (
                                                <div key={index} className="content-child">
                                                    <p>{t(itemContent)}</p>
                                                </div>
                                            ))}
                                        </div>
                                        {
                                            item.key === 3 ?
                                                <div>
                                                    <table>
                                                        <tr>
                                                            <td>{t('tradequalification.tab1')}</td>
                                                            <td>{t('tradequalification.tab2')}</td>
                                                            <td>{t('tradequalification.tab3')}</td>
                                                            <td>{t('tradequalification.tab4')}</td>
                                                            <td>{t('tradequalification.tab5')}</td>
                                                            <td>{t('tradequalification.tab6')}</td>
                                                            <td>{t('tradequalification.tab7')}</td>
                                                            <td>{t('tradequalification.tab8')}</td>
                                                            <td>{t('tradequalification.tab9')}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>BTC1912</td>
                                                            <td>{t('tradequalification.tab10')}</td>
                                                            <td>10</td>
                                                            <td>6000</td>
                                                            <td>10</td>
                                                            <td>10.5</td>
                                                            <td>1.05</td>
                                                            <td>0.5</td>
                                                            <td>50%</td>
                                                        </tr>
                                                    </table>
                                                    <div className="content-child1">
                                                        <p>{t('tradequalification.content12')}</p>
                                                        <br />
                                                        <p>{t('tradequalification.content13')}</p>
                                                    </div>
                                                    <table>
                                                        <tr>
                                                            <td>{t('tradequalification.tab1')}</td>
                                                            <td>{t('tradequalification.tab2')}</td>
                                                            <td>{t('tradequalification.tab3')}</td>
                                                            <td>{t('tradequalification.tab4')}</td>
                                                            <td>{t('tradequalification.tab5')}</td>
                                                            <td>{t('tradequalification.tab6')}</td>
                                                            <td>{t('tradequalification.tab7')}</td>
                                                            <td>{t('tradequalification.tab8')}</td>
                                                            <td>{t('tradequalification.tab9')}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>BTC1912</td>
                                                            <td>{t('tradequalification.tab10')}</td>
                                                            <td>10</td>
                                                            <td>6000</td>
                                                            <td>10</td>
                                                            <td>9.5</td>
                                                            <td>0.95</td>
                                                            <td>0.5</td>
                                                            <td>50%</td>
                                                        </tr>
                                                    </table>
                                                </div>
                                                :
                                                null
                                        }
                                    </div>
                                ))}
                            </div>
                            <div className="know-button">
                                <Button onClick={this.nextQuestion} style={{ width: '140px', height: '32px', lineHeight: '28px' }}>{t('tradequalification.startquestion')}</Button>
                                <p className="know-expert" onClick={() => this.nextExpert()} theme="primary">{t('tradequalification.expertis')}</p>
                            </div>
                        </div>
                    )}
                </I18n>
            </div>
        )
    }
}
export default Know

