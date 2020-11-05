import React, { Component } from 'react'
import { autobind } from 'core-decorators'
import cs from 'classnames'

import './index.scss'

export default class FtRadio extends Component {
    constructor() {
        super()
        this.state = {
            value: null
        }
    }
    @autobind
    clear() {
        this.setState({ value: null })
    }
    @autobind
    select(value) {
        this.setState({ value })
        if (this.props.callback) this.props.callback(value)
    }
    render() {
        let typeClass = 'ft-radio-g'
        if (this.props.theme === 'red') {
            typeClass = 'ft-radio-r'
        }
        return (
            <ul className={cs('ft-radio', typeClass, this.props.className)} >
                {this.props.items.map((item, index) => (
                    <li
                        className={cs({ active: this.state.value === item.value })}
                        key={index}
                        onClick={() => { this.select(item.value) }}
                    >
                        <span className="ft-theme-label">{item.text}</span>
                    </li>
                ))}
            </ul>
        )
    }
}
