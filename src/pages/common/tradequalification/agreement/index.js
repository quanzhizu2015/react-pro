import React, { Component } from 'react'
import { I18n } from 'react-i18next'
import './index.scss'


class agreement extends Component {
    constructor() {
        super()
        this.state = {
        }
    }
    componentDidMount() {
    }
    render() {
        const xieyiContent = [
            {
                label: 'tradequalification.xieyiLabel1',
                content: [
                    'tradequalification.xieyiContent1'
                ]
            }, {
                label: 'tradequalification.xieyiLabel2',
                content: [
                    'tradequalification.xieyiContent2_1',
                    'tradequalification.xieyiContent2_2',
                    'tradequalification.xieyiContent2_6',
                    'tradequalification.xieyiContent2_7',
                    'tradequalification.xieyiContent2_8',
                    'tradequalification.xieyiContent2_9',
                    'tradequalification.xieyiContent2_11',
                    'tradequalification.xieyiContent2_10',
                    'tradequalification.xieyiContent2_3',
                    'tradequalification.xieyiContent2_4',
                    'tradequalification.xieyiContent2_5'
                ]
            }, {
                label: 'tradequalification.xieyiLabel3',
                content: [
                    'tradequalification.xieyiContent3_1',
                    'tradequalification.xieyiContent3_2',
                    'tradequalification.xieyiContent3_3',
                    'tradequalification.xieyiContent3_4',
                    'tradequalification.xieyiContent3_5'
                ]
            }, {
                label: 'tradequalification.xieyiLabel4',
                content: [
                    'tradequalification.xieyiContent4_1',
                    'tradequalification.xieyiContent4_2',
                    'tradequalification.xieyiContent4_3',
                    'tradequalification.xieyiContent4_4',
                    'tradequalification.xieyiContent4_5',
                    // 'tradequalification.xieyiContent4_6',
                ]
            }, {
                label: 'tradequalification.xieyiLabel5',
                content: [
                    'tradequalification.xieyiContent5_1',
                    'tradequalification.xieyiContent5_2',
                    'tradequalification.xieyiContent5_3',
                    'tradequalification.xieyiContent5_4',
                    'tradequalification.xieyiContent5_10',
                    'tradequalification.xieyiContent5_11',
                    'tradequalification.xieyiContent5_12',
                    'tradequalification.xieyiContent5_13',
                    'tradequalification.xieyiContent5_14',
                    'tradequalification.xieyiContent5_15',
                    'tradequalification.xieyiContent5_5',
                    'tradequalification.xieyiContent5_6',
                    'tradequalification.xieyiContent5_7',
                    'tradequalification.xieyiContent5_8',
                    'tradequalification.xieyiContent5_9',
                ]
            }, {
                label: 'tradequalification.xieyiLabel6',
                content: []
            }
        ]
        return (
            <I18n>
                {
                    t => (
                        <div className="agreement-wrap">
                            <p className="agreement-title">{t('tradequalification.xieyi')}</p>
                            <div className="agreement-content">
                                <p>{t('tradequalification.xieyiTime')}</p>
                                {
                                    xieyiContent.map((item, index) => (
                                        <div key={index}>
                                            <p className="agreement1">{t(item.label)}</p>
                                            <div>
                                                {
                                                    item.content.map((itemContent, i) => (
                                                        <p key={i}>{t(itemContent)}</p>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    )
                }
            </I18n>
        )
    }
}
export default agreement

