import React, { PureComponent } from 'react'
import Formsy from 'formsy-react'
import { I18n } from 'react-i18next'
import { Link } from 'react-router-dom'

import FundInput from '@/components/fundInput'

export default class Recharge extends PureComponent {
    render() {
        const {
            address,
            assetName,
            id,
            f
        } = this.props.value
        let asset
        if (!f) {
            asset = assetName
        }
        if (f === 'omni') {
            asset = `${assetName}-Tether`
        } else if (f === 'erc20') {
            asset = `${assetName}-ERC-20`
        }
        return (
            <I18n>
                {
                    (t, { i18n }) => {
                        const w = i18n.language === 'zh' ? 76 : 170
                        return (
                            <Formsy className="wallet-form">
                                <FundInput
                                    labelWidth={w}
                                    label={t('fundManage.walletTrans.coinType')}
                                    isInput={false}
                                    name="bz"
                                    value={asset}
                                />
                                <FundInput
                                    labelWidth={w}
                                    label={t('fundManage.walletTrans.coinAddress')}
                                    name="address"
                                    showQrCode
                                    value={address}
                                    disabled
                                />
                                {
                                    assetName === 'EOS' ?
                                        <FundInput
                                            labelWidth={w}
                                            label="地址标签"
                                            name="addressTip"
                                            value={id}
                                            disabled
                                        />
                                        :
                                        null
                                }
                                <div className="wallet-tips">Tips：{t('fundManage.walletTrans.tipInfo1')}{assetName}{t('fundManage.walletTrans.tipType')}{t('fundManage.walletTrans.tipInfo11')}{t('fundManage.walletTrans.tipInfo3')}<Link to="/comm/fund/history">{t('fundManage.walletTrans.tipInfo4')}</Link>{t('fundManage.walletTrans.tipInfo5')}</div>
                            </Formsy>
                        )
                    }
                }
            </I18n>
        )
    }
}
