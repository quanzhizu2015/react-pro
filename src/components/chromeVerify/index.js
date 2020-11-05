import React, { Component } from 'react'
import { connect } from 'react-redux'
import Button from '../button'
import { I18n } from 'react-i18next'
import './chromeVerify.scss'

@connect(state => ({
    apis: state.apis,
    getUserAuth: state.getUserAuth,
    saveSessionId: state.saveSessionId,
    // userAuth: state.userAuth
}))
export default class ChromeVeirfy extends Component {
    constructor(props) {
        super(props)
        this.state = {
            pop: <I18n>{t => t('safe.googlecode')}</I18n>,
            focusBorder: {
                width: '0',
                left: '50%'
            },
            disabled: true,
            codeValue: '',
        }
        this.obfocus = this.obfocus.bind(this)
        this.obblur = this.obblur.bind(this)
    }
    obfocus() {
        this.setState({
            focusBorder: {
                width: '350px',
                left: '0'
            }
        })
    }
    obblur() {
        this.setState({
            focusBorder: {
                width: '0',
                left: '50%'
            }
        })
    }
    change(e) {
        // e.target.value = e.target.value.replace(/[^\d]/g, '')
        this.setState({
            codeValue: e.target.value
        })
        const reg = /^[0-9]*$/
        if (e.target.value.length === 6 && reg.test(e.target.value)) {
            this.submitApi(e.target.value)
        }
        if (e.target.value.length >= 6 && reg.test(e.target.value)) {
            this.setState({
                disabled: false
            })
        } else {
            this.setState({
                disabled: true
            })
        }
    }
    submit(e) {
        if (e.keyCode === 13) {
            if (e.target.value) {
                this.submitApi(e.target.value)
            }
        }
    }
    async submitApi(val) {
        const params = {
            account: localStorage.account,
            code: val
        }
        const res = await this.props.apis.googleCheck(params)
        if (res.code === 0) {
            localStorage.sessionId = res.data.sessionId
            await this.props.dispatch(this.props.saveSessionId(res.data.sessionId))
            await this.props.dispatch(this.props.getUserAuth())
            // this.props.history.push('/comm/security/main')
            // if (JSON.stringify(this.props.userAuth) !== '0') {
            //     history.go(-2)
            // }
            // history.go(-2)
            const pathUrl = localStorage.pathName
            if (pathUrl) {
                if (pathUrl === '/home' || pathUrl === '/home/login' || pathUrl === '/home/register' || pathUrl === '/common/register' || pathUrl === '/common/forgotpassword' || pathUrl === '/login') {
                    this.props.history.push('/')
                } else {
                    this.props.history.push(pathUrl)
                    // history.back()
                }
            } else {
                this.props.history.push('/')
            }
        }
    }
    render() {
        const { focusBorder: style } = this.state
        let showTip = false
        if (this.state.disabled && this.state.codeValue) {
            showTip = true
        }
        return (
            <I18n>
                {
                    t => (
                        <div id="chromeVerify">
                            <i className="iconfont iconyanzhengma" />
                            <p>{this.state.pop}</p>
                            <div className="inputline">
                                <input
                                    type="text"
                                    className="code"
                                    onFocus={this.obfocus}
                                    onBlur={this.obblur}
                                    validations="isNumeric"
                                    onKeyDown={e => this.submit(e)}
                                    onChange={e => this.change(e)}
                                    maxLength="6"
                                    placeholder={t('safe.googlecodePlaceholder')}
                                />
                                {showTip ? <span className="tips">{t('safe.googlecodePlaceholder')}</span> : null}
                            </div>
                            <div className="relative">
                                <div className="inputBorder" style={style} />
                            </div>
                            <Button
                                type="submit"
                                disabled={this.state.disabled}
                                theme="primary"
                                className="ac-submit login-submit chromeBtn"
                                onClick={() => this.submitApi(this.state.codeValue)}
                            >
                                {t('safe.confirm')}
                            </Button>
                        </div>
                    )
                }
            </I18n>
        )
    }
}
