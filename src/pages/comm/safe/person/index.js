import React, { Component } from 'react'
import { connect } from 'react-redux'
import { I18n } from 'react-i18next'
import QRCode from 'qrcode.react'
import Message from '@/components/message'
import Button from '@/components/button/index'
import './person.scss'
import Load from '@/assets/img/safe/loading.png'
import Right from '@/assets/img/safe/right.png'
import None from '@/assets/img/safe/none.png'

@connect(state => ({
    apis: state.apis,
}))
class SafePerson extends Component {
    constructor() {
        super()
        this.state = {
            faceIdToken: '',
            firstName: '',
            identityCard: '',
            cardCheckStatus: '',
            kycLevel: '',
        }
    }
    componentWillMount() {
        this.getDefaultValue()
    }
    getToken = async () => {
        const res = await this.props.apis.getFaceIdToken()
        if (res.code === 0) {
            this.setState({ faceIdToken: res.data })
        }
    }
    getDefaultValue = async () => {
        const result = await this.props.apis.getKYCAuth()
        if (result && result.code === 0) {
            this.setState({
                kycLevel: result.data.kycLevel,
                firstName: result.data.firstName,
                identityCard: result.data.identityCard,
                cardCheckStatus: result.data.cardCheckStatus ? result.data.cardCheckStatus : 0,
            })
            if (result.data.kycLevel !== 2) {
                this.getToken()
            }
        }
    }
    setStatus = async () => {
        try {
            const res = await this.props.apis.setIdentify()
            if (res.code === 0) {
                Message.success('请重新认证! ')
                this.getDefaultValue()
            }
        } catch (err) {
            Message.error(err)
        }
    }
    backSafeMain = () => {
        this.props.history.push('/comm/security/main')
    }
    render() {
        const { faceIdToken, kycLevel, cardCheckStatus } = this.state
        return (
            <div>
                <I18n>
                    {(t) => {
                        this.t = t
                        return (
                            <div className="person">
                                {
                                    cardCheckStatus === 0 || (cardCheckStatus === 2 && kycLevel === 1) ?
                                        <React.Fragment>
                                            <div className="person-title">{t('person.certificationtitle')}</div>
                                            <div className="person-subtitle">{t('person.certificationsubtitle')}</div>
                                            <div className="person-line" />
                                            <div className="chinaCode">
                                                {
                                                    kycLevel === 1 ?
                                                        <React.Fragment>
                                                            <h4>
                                                                <i className="iconfont iconright-1" />
                                                                恭喜您，您已通过初级认证!
                                                            </h4>
                                                            <span>请扫描下方二维码，进行高级认证</span>
                                                        </React.Fragment>
                                                        :
                                                        <span>(请扫描下方二维码，进行身份认证)</span>
                                                }
                                                {
                                                    faceIdToken ?
                                                        <QRCode style={{ display: 'block', marginLeft: '60px' }} size={200} value={faceIdToken} />
                                                        :
                                                        null

                                                }
                                            </div>
                                            <Button onClick={this.backSafeMain} style={{ width: '140px', background: '#fff' }}>{t('person.return')}</Button>
                                            <Button
                                                style={{ minWidth: '140px', marginLeft: '30px' }}
                                                onClick={() => { this.getDefaultValue() }}
                                            >
                                                已经提交
                                            </Button>
                                        </React.Fragment>
                                        :
                                        <React.Fragment>
                                            {
                                                cardCheckStatus === 1 ?
                                                    <div className="safe-load">
                                                        <img src={Load} alt="" />
                                                        <p>{t('person.checking')}</p>
                                                        <span>{t('person.checkedWating')}</span>
                                                    </div>
                                                    :
                                                    null
                                            }
                                            {
                                                cardCheckStatus === 2 ?
                                                    <div className="safe-right">
                                                        <img src={Right} alt="" />
                                                        <p>{t('person.checkedSuccess')}</p>
                                                        <ul>
                                                            <li>
                                                                <span>{t('person.username')}</span>
                                                                <span>{this.state.firstName}</span>
                                                            </li>
                                                            <li>
                                                                <span>{t('person.idcardnumber2')}</span>
                                                                <span>{this.state.identityCard}</span>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                    :
                                                    null
                                            }
                                            {
                                                cardCheckStatus === 3 ?
                                                    <div className="safe-none">
                                                        <img src={None} alt="" />
                                                        <p>{t('person.checkedFailed')}</p>
                                                        <div className="safe-none-btn" onClick={() => { this.setStatus() }}>{t('person.checkedAgain')}</div>
                                                    </div>
                                                    :
                                                    null
                                            }
                                        </React.Fragment>
                                }
                            </div>
                        )
                    }}
                </I18n>
            </div>
        )
    }
}
export default SafePerson

