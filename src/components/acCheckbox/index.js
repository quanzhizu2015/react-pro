import React, { Component } from 'react'
import { withFormsy, propTypes } from 'formsy-react'
import { Checkbox } from 'antd'

import './index.scss'

@withFormsy
export default class AcCheckbox extends Component {
    static propTypes = {
        ...propTypes
    }
    constructor() {
        super()
        this.onChange = this.onChange.bind(this)
    }
    onChange(e) {
        this.props.setValue(e.target.checked)
    }
    render() {
        const { className, children } = this.props
        return (
            <div className={`ac-checkbox ${className}`}>
                <Checkbox
                    checked={this.props.getValue()}
                    onChange={this.onChange}
                >
                    {children}
                </Checkbox>
            </div>
        )
    }
}
