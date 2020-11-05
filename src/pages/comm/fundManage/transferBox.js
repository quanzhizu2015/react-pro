import React from 'react'
import { Link } from 'react-router-dom'
import { I18n } from 'react-i18next'
import './transferBox.scss'

export default class TransferBox extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            numValue: props.numValue,
        }
    }
    componentDidMount() {
        this.inputNum.focus()
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.numValue !== this.props.numValue) {
            this.setState({
                numValue: nextProps.numValue
            })
        }
    }
    handleChange = (e) => {
        let newInput = e.target.value
        if (newInput === '') {
            this.setState({
                numValue: newInput
            })
            this.props.change(newInput)
        } else {
            const REG = /^\d+(\.\d*)?$/ // eslint-disable-line
            // console.log(newInput, REG.test(newInput))
            if (!REG.test(newInput)) return
            newInput = newInput.replace(/^()*(\d+)\.(\d\d\d\d\d\d\d\d).*$/, '$1$2.$3') // 禁止输入八位以上的小数
            this.setState({
                numValue: newInput
            })
            this.props.change(newInput)
        }
    }
    render() {
        const style = {
            width: this.props.width,
            margin: this.props.margin
        }
        const sanjiao = { right: this.props.right }
        const errorMyWallet = this.props.error ?
            <p>{this.t('fundManage.walletTrans.error2')}{this.t('fundManage.walletTrans.info2')}<Link to="/trade/spot"><span>{this.t('fundManage.walletTrans.info4')}</span></Link>{this.t('fundManage.walletTrans.info3')}</p>
            :
            null
        const errorMyAccount = this.props.error ?
            <p>{this.t('fundManage.walletTrans.error3')}</p>
            :
            null
        const chicangTips = this.props.used && this.props.locked && (Number(this.props.used) !== 0 || Number(this.props.locked) !== 0)
        return (
            <I18n>
                {
                    (t, { i18n }) => {
                        this.t = t
                        const lang = i18n.language
                        return (
                            <div id="transferBox" style={style}>
                                <div className={lang === 'zh' ? 'sanjiao' : 'sanjiao sanjiaoEn'} style={sanjiao} />
                                <div className="fromTo">
                                    <p>{this.props.from}</p>
                                    <div className="arrowIcon">
                                        <svg className="icon" aria-hidden="true">
                                            <use xlinkHref="#iconGroup" />
                                        </svg>
                                    </div>
                                    <p>{this.props.to}</p>
                                </div>
                                <div className="operation">
                                    <div className="number">
                                        <span>{t('fundManage.walletTrans.number')}</span>
                                        <input
                                            type="text"
                                            value={this.state.numValue}
                                            onChange={this.handleChange}
                                            className="numInput"
                                            ref={(inputNum) => { this.inputNum = inputNum }}
                                        />
                                        <div className="errorBox">
                                            {this.props.min ? <p>{t('fundManage.walletTrans.error1')}</p> : null}
                                            {this.props.type === '0' ?
                                                errorMyWallet
                                                :
                                                errorMyAccount
                                            }
                                        </div>
                                    </div>
                                    <div className="button">
                                        <p>Tips：{chicangTips ? <span>{this.t('fundManage.walletTrans.tipInfo10')}<br /></span> : null}{t('fundManage.walletTrans.tipInfo2')}{t('fundManage.walletTrans.tipInfo3')}<Link to="/comm/fund/transfer"><b>{t('fundManage.walletTrans.tipInfo6')}</b></Link>{t('fundManage.walletTrans.tipInfo7')}</p>
                                        {/* <p>您的合约账户仍有持仓，转出USDT可能引起爆仓。<br /></p> */}
                                        <button className="btn" onClick={this.props.click} disabled={this.props.disabled}>{t('fundManage.walletTrans.confirmHua')}</button>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                }
            </I18n>
        )
    }
}
