import React, { Component } from 'react'
import { I18n } from 'react-i18next'
import Button from '../../components/button'
import cs from 'classnames'
import './notifyPop.scss'

class NotifyPop extends Component {
    constructor() {
        super()
        this.state = {
            PopStyle: {
                position: 'absolute',
                top: '40%',
                left: '50%',
                width: '400px',
                height: '250px',
                marginLeft: '-200px',
                marginTop: '-125px',
            }
        }
    }
    componentWillMount() {
        this.PopInit()
    }
    componentWillReceiveProps() {
        this.PopInit()
    }
    PopInit() {
        // 如果没传宽度和高度，就显示默认的宽度400高度250
        if (this.props.width && this.props.height) {
            this.setState({
                PopStyle: {
                    position: 'absolute',
                    top: '40%',
                    left: '50%',
                    width: `${this.props.width}px`,
                    height: `${this.props.height}px`,
                    marginLeft: `-${(this.props.width / 2).toFixed(0)}px`,
                    marginTop: `-${(this.props.height / 2).toFixed(0)}px`,
                    background: this.props.background
                }
            })
        }
    }
    render() {
        return (
            <I18n>
                {
                    (t) => {
                        this.t = t
                        return (
                            <div>
                                {
                                    this.props.visable === true ?
                                        <div className="Notify">
                                            <div style={this.state.PopStyle} className={cs('NotifyPop', this.props.className)}>
                                                {
                                                    this.props.type === 'primary' ?
                                                        null
                                                        :
                                                        <i className="iconfont iconchahao1" onClick={this.props.cancel} />
                                                }
                                                <div style={this.props.Popstyle}>
                                                    {this.props.children}
                                                </div>
                                                {
                                                    this.props.confirm ?
                                                        <div className="Notify-footer">
                                                            {
                                                                this.props.type === 'primary' ?
                                                                    <Button style={this.state.btnStyle} theme="primary" disabled={this.props.disable === false} className="btnPrimary" onClick={this.props.confirm}>{t('bonus.sure')}</Button>
                                                                    :
                                                                    <Button theme="primary" disabled={this.props.disable === false} className="btn" onClick={this.props.confirm} loading={this.props.loading}>{t('bonus.sure')}</Button>
                                                            }
                                                        </div>
                                                        :
                                                        null
                                                }
                                            </div>
                                        </div>
                                        :
                                        null
                                }
                            </div>
                        )
                    }
                }
            </I18n>
        )
    }
}
export default NotifyPop

