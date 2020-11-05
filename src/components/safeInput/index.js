import React, { Component } from 'react'
// import { connect } from 'react-redux'
import { withFormsy, propTypes } from 'formsy-react'
import { I18n } from 'react-i18next'
import './safeinput.scss'


@withFormsy
export default class SafeInput extends Component {
    static propTypes = {
        ...propTypes
    }
    constructor(props) {
        super(props)
        this.state = {
            typeState: 'text',
            sendCodeLoading: false,
            codeTime: 0,
        }
        if (this.props.defaultValue) {
            this.props.setValue(this.props.defaultValue)
        }
        this.onChange = this.onChange.bind(this)
        this.handleCode = this.handleCode.bind(this)
    }
    componentDidMount() {
        this.changeType()
        this.initCode()
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.defaultValue && this.props.defaultValue !== nextProps.defaultValue) {
            this.props.setValue(nextProps.defaultValue)
        }
    }
    onChange(e) {
        if (this.props.validator) {
            const reg = this.props.validator
            if (e.target.value !== '') {
                if (reg.test(e.target.value)) {
                    this.props.setValue(e.target.value)
                }
            } else {
                this.props.setValue(e.target.value)
            }
        } else {
            this.props.setValue(e.target.value)
        }
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
    // 发送验证码
    async handleCode() {
        if (this.state.sendCodeLoading || this.state.codeTime !== 0) {
            return
        }
        const res = await this.props.sendCode()
        if (res === true) {
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
        // localStorage[this.props.codeKey] = new Date().getTime()
    }
    // 验证码倒计时
    codeTimeInterval() {
        setTimeout(() => {
            if (this.state.codeTime > 0) {
                this.setState({
                    codeTime: this.state.codeTime - 1
                })
                this.codeTimeInterval()
            }
        }, 1000)
    }
    // 验证码发送按钮
    codePanel() {
        if (this.props.btnState) {
            const btnClass = ['sendcode-btn', this.props.classNameBtn]
            return (
                <I18n>
                    {
                        t => (
                            <div className={btnClass.join(' ')}>
                                {
                                    this.state.codeTime === 0 ?
                                        <a
                                            onClick={this.handleCode}
                                            disabled={this.props.codeDisabled}
                                        >{t('safe.sendcode')}
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
    // 判断输入框的类型
    changeType() {
        if (this.props.type === '0') { // 普通的输入框
            this.setState({ typeState: 'text' })
        } else if (this.props.type === '1') { // 密码框
            this.setState({ typeState: 'password' })
        } else {
            this.setState({ typeState: 'text' })
        }
    }
    render() {
        const prop = this.props
        const classes = [this.props.className]
        const classess = [this.props.classNameInput]
        const errorClass = ['errorMsg', this.props.classNamError]
        const errorMessage = this.props.getErrorMessage()
        return (
            <div className="safeInput-wrap">
                <div className="safeInput-form">
                    <p className={classes.join(' ')}>{prop.label}</p>
                    <div className="sendcode-wrap">
                        <input
                            onChange={this.onChange}
                            type={this.state.typeState}
                            onBlur={this.props.getBlue}
                            style={this.props.InputStyle}
                            maxLength={this.props.maxLength}
                            placeholder={this.props.placeholder}
                            value={this.props.getValue() || ''}
                            disabled={this.props.disable}
                            className={classess.join(' ')}
                        />
                        {this.codePanel()}
                    </div>
                    <span className={errorClass.join(' ')}>{errorMessage}</span>
                </div>
            </div>
        )
    }
}
