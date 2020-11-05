import React from 'react'
import { I18n } from 'react-i18next'

class DetailInfo extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    componentDidMount() {

    }
    render() {
        const { item, typelist } = this.props
        return (
            <I18n>
                {
                    t => (
                        <div className="detail-info">
                            <div>
                                {
                                    item.transferType === typelist.chargeCoin.key ?
                                        <span className="address">
                                            <span className="detail-label">{t('fundManage.tranRecord.chargeAddress')}</span>
                                            <span className="detail-value">{this.props.item.fromAddress ? this.props.item.fromAddress : '--'}</span>
                                        </span>
                                        :
                                        <span className="address">
                                            <span className="detail-label">{t('fundManage.tranRecord.mentionAddress')}</span>
                                            <span className="detail-value">{this.props.item.toAddress ? this.props.item.toAddress : '--'}</span>
                                        </span>
                                }
                                <span>
                                    <span className="detail-label">{t('fundManage.tranRecord.txTime')}</span>
                                    <span className="detail-value">{this.props.item.txTime ? this.props.item.txTime : '--'}</span>
                                </span>
                            </div>
                            <div>
                                <span className="detail-label">{t('fundManage.tranRecord.txHash')}</span>
                                <span className="detail-value">{this.props.item.txHash}</span>
                            </div>
                        </div>
                    )
                }
            </I18n>
        )
    }
}

export default DetailInfo
