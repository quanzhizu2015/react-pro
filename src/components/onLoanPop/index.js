import React, { Component } from 'react'
import cs from 'classnames'
import { autobind } from 'core-decorators'

import './index.scss'

export default class OnLoanPop extends Component {
    static defaultProps = {
        type: 'primary',
        title: '标题'
    }
    state = {
        visible: false
    }
    componentDidMount() {
    }
    @autobind
    open() {
        this.setState({
            visible: true
        })
        document.body.style.overflow = 'hidden'
    }
    @autobind
    close() {
        this.setState({
            visible: false
        })
        document.body.style.overflow = null
        const { onClose } = this.props
        if (onClose) onClose()
    }
    render() {
        const {
            title,
            className,
            type,
            children,
            popStyle,
            ...others
        } = this.props
        const { visible } = this.state
        return (
            visible ?
                <div {...others} className={cs('on-loan-pop', className)}>
                    <div className="on-loan-pop-mask" />
                    <div style={popStyle} className="on-loan-pop-content">
                        <div className="on-loan-pop-title">
                            <h3 className={type} >{title}</h3>
                            <i className="iconfont iconchahao1" onClick={this.close} />
                        </div>
                        { children }
                    </div>
                </div> :
                null
        )
    }
}
