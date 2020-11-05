import React, { Component } from 'react'
import { withFormsy, propTypes } from 'formsy-react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Link } from 'react-router-dom'
import { I18n } from 'react-i18next'
import QRCode from 'qrcode.react'
import PropTypes from 'prop-types'

import './index.scss'
import Button from '../button'
import MoneySelect from '../moneySelect'
import Message from '@/components/message'

@withFormsy
export default class FundInput extends Component {
    static propTypes = {
        ...propTypes,
        type: PropTypes.string,
        disabled: PropTypes.bool,
        isInput: PropTypes.bool
    }
    static defaultProps = {
        type: 'text',
        disabled: false,
        isInput: true
    }
    constructor(props) {
        super(props)
        this.state = {
            qrVisible: false,
            sendCodeLoading: false,
            wait: 0
        }
        this.onChange = this.onChange.bind(this)
        this.onSelectChange = this.onSelectChange.bind(this)
        this.showQrHandler = this.showQrHandler.bind(this)
        this.hideQrHandler = this.hideQrHandler.bind(this)
        this.sendCode = this.sendCode.bind(this)
    }
    componentWillMount() {
        const time = localStorage[this.props.codeKey]
        const nowTime = new Date().getTime()
        const s = Math.floor(((time - nowTime) / 1000) + 60)
        if (s > 0) {
            this.setState({
                wait: s
            })
            this.waitInterval()
        }
    }
    componentWillReceiveProps(props) {
        if (props.resetSend && props.resetSend !== this.props.resetSend) {
            this.clearTimeout()
        }
    }
    onChange(e) {
        let { value } = e.target
        if (this.props.fixed === 0) {
            if (/^(\d*)?$/.test(value)) this.props.setValue(Number(value))
        } else if (this.props.isNumber) {
            // 先把非数字的都替换掉，除了数字和.
            value = value.replace(/[^\d.]/g, '')
            // 保证只有出现一个.而没有多个.
            // value = value.replace(/\.{0,2}/g, '.')
            // 必须保证第一个为数字而不是.
            value = value.replace(/^\./g, '')
            if (/^0\d/.test(value)) value = value.substr(1)
            // 保证.只出现一次，而不能出现两次以上
            value = value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
            // <input type="text" onkeyup="this.value=this.value.toString().match(/^\d+(?:\.\d{0,2})?/)"/>
            if (this.props.fixed === 3) {
                value = value.match(/^\d+(?:\.\d{0,3})?/)
            }
            if (this.props.fixed === 2) {
                value = value.match(/^\d+(?:\.\d{0,2})?/)
            }
            if (this.props.fixed === 4) {
                value = value.match(/^\d+(?:\.\d{0,4})?/)
            }
            if (this.props.fixed === 8) {
                value = value.match(/^\d+(?:\.\d{0,8})?/)
            }
            // 只能输入两个小数
            this.props.setValue(value)
        } else {
            this.props.setValue(value)
        }
    }
    onSelectChange(value) {
        this.props.setValue(value)
    }
    clearTimeout() {
        if (this.setTimeout) {
            clearTimeout(this.setTimeout)
        }
        localStorage.setItem(this.props.codeKey, '')
        this.setState({
            wait: 0
        })
    }
    showQrHandler() {
        this.setState({
            qrVisible: true
        })
    }
    async sendCode() {
        if (this.state.sendCodeLoading || this.state.wait !== 0) {
            return
        }
        this.setState({
            sendCodeLoading: true
        })
        const r = await this.props.sendCodeHandler()
        this.state.sendCodeLoading = false
        if (r) {
            // localStorage[this.props.codeKey] = new Date().getTime()
            this.setState({
                sendCodeLoading: false,
                wait: 60
            })
            this.waitInterval()
        } else {
            this.setState({
                sendCodeLoading: false
            })
        }
    }
    // 验证码倒计时
    waitInterval() {
        this.setTimeout = setTimeout(() => {
            if (this.state.wait > 0) {
                this.setState({
                    wait: this.state.wait - 1
                })
                this.waitInterval()
            }
        }, 1000)
    }
    hideQrHandler() {
        this.setState({
            qrVisible: false
        })
    }
    render() {
        const errorMessage = this.props.getErrorMessage()
        const autocomplete = this.props.type === 'password' ? 'new-password' : 'off'
        const forId = this.props.forId || Math.floor((Math.random() + 1) * 1000000000)
        const {
            isInput,
            isSelect,
            labelWidth,
            showQrCode,
            showCode,
            linkUrl,
            linkText
        } = this.props

        function onCopyHandler() {
            Message.success(<I18n>{t => t('fundManage.walletTrans.copyInfo')}</I18n>)
        }
        return (
            <I18n>
                {
                    t => (
                        <div className="fund-input" >
                            {/* eslint-disable-next-line */}
                            <label style={{ width: labelWidth || '80px' }} htmlFor={forId}>{this.props.label}</label>
                            {
                                isInput ? [
                                    <div key="fund-input" className="fund-input-board">
                                        {
                                            isSelect ?
                                                <MoneySelect
                                                    inputClass="fund-input-select"
                                                    onChange={this.onSelectChange}
                                                    placeholder={this.props.placeholder}
                                                    value={this.props.getValue() || ''}
                                                    records={this.props.records}
                                                />
                                                :
                                                <input
                                                    key="input"
                                                    style={showQrCode ? { width: '485px' } : null}
                                                    disabled={this.props.disabled}
                                                    id={forId}
                                                    // onKeyup={this.onChange}
                                                    onChange={this.onChange}
                                                    type={this.props.type}
                                                    maxLength={this.props.maxLength}
                                                    autoComplete={autocomplete}
                                                    value={this.props.getValue() || ''}
                                                    placeholder={this.props.placeholder}
                                                />
                                        }
                                        { linkUrl ? <Link to={linkUrl} className="fund-input-btn">{linkText}</Link> : null }
                                        { showCode ?
                                            <a onClick={this.sendCode} disabled={this.state.wait !== 0} className="fund-input-btn">
                                                {this.state.wait === 0 ? t('fundManage.walletTrans.sendCode') : `${this.state.wait}s`}
                                            </a> : null }
                                    </div>,
                                    errorMessage ?
                                        <span key="error" className="fund-error">{errorMessage}</span>
                                        :
                                        null
                                ] : <span className="fund-value">{this.props.getValue() || ''}</span>
                            }
                            {
                                showQrCode ? [
                                    <CopyToClipboard key="copyToClipboard" text={this.props.getValue() || ''} onCopy={onCopyHandler}>
                                        <Button onClick={this.copyHandler} style={{ fontSize: '14px', height: '40px' }}>{t('fundManage.walletTrans.copyAddress')}</Button>
                                    </CopyToClipboard>,
                                    <div
                                        key="fund-qrcode"
                                        className="fund-qrcode"
                                        onMouseEnter={this.showQrHandler}
                                        onMouseLeave={this.hideQrHandler}
                                    >
                                        <Button style={{ width: '40px', height: '40px', padding: 0 }} >
                                            <i className="iconfont iconerweima" />
                                        </Button>
                                        {
                                            this.state.qrVisible ?
                                                <div className="fund-qrcode-pic">
                                                    <QRCode size={77} value={this.props.getValue() || ''} />
                                                </div> :
                                                null
                                        }
                                    </div>,
                                ] : ''
                            }
                        </div>
                    )
                }
            </I18n>
        )
    }
}
