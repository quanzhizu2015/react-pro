import React, { Component } from 'react'
import cs from 'classnames'
import { I18n } from 'react-i18next'
import './index.scss'


export default class Assetvaluation extends Component {
    constructor() {
        super()
        this.state = {
        }
    }
    componentWillMount() {
    }
    render() {
        const { className, assetmentVal } = this.props
        // console.log(assetmentVal)
        return (
            /* 资产估值模块 */
            <I18n>
                {
                    t => (
                        <div className={cs('assetvaluation-wrap', className)}>
                            <span>{t('fundManage.walletTrans.assetValuation')}：</span>
                            <b>{assetmentVal.totalValuation} </b>
                            <span>USDT</span>
                            {
                                assetmentVal.totalValCny ?
                                    <i>≈ <span>{assetmentVal.totalValCny}</span> CNY</i>
                                    :
                                    null
                            }
                        </div>
                    )
                }
            </I18n>
        )
    }
}
