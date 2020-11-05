import React, { Component } from 'react'
import { I18n } from 'react-i18next'
import { withFormsy, propTypes } from 'formsy-react'

import './index.scss'

@withFormsy
export default class AcInput extends Component {
    static defaultProp = {
        type: 'text'
    }
    static propTypes = {
        ...propTypes
    }
    constructor(props) {
        super(props)
        this.state = {
            scoreMap: [{
                width: '25%',
                color: '#E74C4C',
                text: <I18n>{t => t('logReg.lower')}</I18n>
            }, {
                width: '25%',
                color: '#E74C4C',
                text: <I18n>{t => t('logReg.lower')}</I18n>
            }, {
                width: '50%',
                color: '#E09D51',
                text: <I18n>{t => t('logReg.medium')}</I18n>
            }, {
                width: '75%',
                color: '#3D79EC',
                text: <I18n>{t => t('logReg.strong')}</I18n>
            }, {
                width: '100%',
                color: '#63BE64',
                text: <I18n>{t => t('logReg.veryStrong')}</I18n>
            }],
            sendCodeLoading: false,
            zxcvbn: null,
            codeTime: 0
        }
        this.onChange = this.onChange.bind(this)
        this.sendCode = this.sendCode.bind(this)
        this.reFreshonClick = this.reFreshonClick.bind(this)
    }
    componentWillMount() {
        this.initCode()
        this.setZxcvbn()
    }
    componentDidMount() {
        if (this.props.initFocus) {
            this.textInput.focus()
        }
    }
    onChange(e) {
        this.props.setValue(e.target.value)
    }
    async setZxcvbn() {
        this.setState({
            zxcvbn: (await import('zxcvbn')).default
        })
    }
    initCode() {
        const time = localStorage[this.props.codeKey]
        const nowTime = new Date().getTime()
        const s = Math.floor(((time - nowTime) / 1000) + 60)
        if (s > 0) {
            this.setState({
                codeTime: s
            })
            this.codeTimeInterval()
        }
    }
    async sendCode() {
        if (this.state.sendCodeLoading || this.state.codeTime !== 0) {
            return
        }
        this.setState({
            sendCodeLoading: true
        })
        const r = await this.props.sendCodeHandler()
        if (r) {
            // localStorage[this.props.codeKey] = new Date().getTime()
            this.setState({
                sendCodeLoading: false,
                codeTime: 60
            })
            this.codeTimeInterval()
        } else {
            this.setState({
                sendCodeLoading: false
            })
        }
    }
    reFreshonClick() {
        this.props.reFresh()
    }
    handleSelectChange(e) {
        this.state.area = e.target.value
        this.setState({})
        this.setSelected()
    }
    // 验证码倒计时
    codeTimeInterval() {
        setTimeout(() => {
            const codenumber = this.state.codeTime
            if (codenumber > 0) {
                this.setState({
                    codeTime: codenumber - 1
                })
                this.codeTimeInterval()
            }
        }, 1000)
    }
    // 图形验证码
    codepiture() {
        if (this.props.showpiture) {
            return (
                <div className="ac-piturecode">
                    <img alt="" src={this.props.pictureurl} id="img" />
                    <i
                        className={['iconfont iconshuaxin', this.state.flashFlag === 'true' ? 'animation-rotate' : ''].join(' ')}
                        onClick={this.reFreshonClick}
                    />
                </div>
            )
        }
        return ''
    }
    // 验证码发送按钮
    codePanel() {
        if (this.props.showCode) {
            return (
                <I18n>
                    {
                        t => (
                            <div className="ac-code">
                                {
                                    this.state.codeTime === 0 ?
                                        <a
                                            disabled={this.props.codeDisabled}
                                            onClick={this.sendCode}
                                        >
                                            {t('safe.sendcode')}
                                        </a> :
                                        <span>{this.state.codeTime}s</span>
                                }
                            </div>
                        )
                    }
                </I18n>
            )
        }
        return ''
    }
    // 密码安全性进度条
    drawProgress() {
        if (this.props.showProgress) {
            let idx = 0
            const value = this.props.getValue()
            let score
            if (value && this.state.zxcvbn) {
                const z = this.state.zxcvbn(this.props.getValue() || '')
                idx = z.score
                score = this.state.scoreMap[idx]
            } else {
                score = {
                    width: '0',
                    color: '#E74C4C'
                }
            }
            return (
                <div className="ac-progress">
                    <i
                        style={{
                            width: score.width,
                            background: score.color
                        }}
                    />
                    <span>{score.text}</span>
                </div>
            )
        }
        return ''
    }
    render() {
        const errorMessage = this.props.getErrorMessage()
        const autocomplete = this.props.type === 'password' ? 'new-password' : 'off'
        return (
            <div className="ac-input" >
                <i className={['iconfont ac-input-icon', this.props.icon].join(' ')} />
                <input
                    style={this.props.inputStyle}
                    ref={(input) => { this.textInput = input }}
                    onChange={this.onChange}
                    type={this.props.type}
                    autoComplete={autocomplete}
                    maxLength={this.props.maxLength}
                    value={this.props.getValue() || ''}
                    placeholder={this.props.placeholder}
                    onBlur={this.props.getBlue}
                    disabled={this.props.inputDisabled}
                />
                <span className="ac-error">{errorMessage}</span>
                {this.codepiture()}
                {this.codePanel()}
                {this.drawProgress()}
            </div>
        )
    }
}
