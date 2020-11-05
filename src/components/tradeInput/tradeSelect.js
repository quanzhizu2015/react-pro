import React, { Component } from 'react'
import { withFormsy, propTypes } from 'formsy-react'
import { withRouter } from 'react-router'
import { autobind } from 'core-decorators'
import cs from 'classnames'

import './index.scss'
@withRouter
@withFormsy
export default class TradeInput extends Component {
    static propTypes = {
        ...propTypes
    }
    static defaultProps = {
        type: 'text',
        unit: '',
        maxLength: 12
    }
    constructor() {
        super()
        this.state = {
            nowValue: '',
            placeholder: null,
            visible: false
        }
    }
    componentWillMount() {
        this.initNowValue(this.props)
    }
    componentWillReceiveProps(props) {
        this.initNowValue(props)
        if (props.showSlider && Number(props.maxNumber)) {
            const value = props.getValue() || 0
            const pv = (value / props.maxNumber).toFixed(3)
            if (this.pv !== pv) {
                this.pv = pv
            }
        }
    }
    @autobind
    onChange(e) {
        if (this.props.disabled) {
            return
        }
        let { value } = e.target
        if (!this.controlFixed(value)) {
            return
        }
        if (this.props.isInt || this.props.fixed === 0) {
            if (/^(\d*)?$/.test(value)) this.props.setValue(Number(value))
        } else if (this.props.isNumber) {
            // 先把非数字的都替换掉，除了数字和.
            value = value.replace(/[^\d.]/g, '')
            // 保证只有出现一个.而没有多个.
            value = value.replace(/\.{2,}/g, '.')
            // 必须保证第一个为数字而不是.
            value = value.replace(/^\./g, '')
            if (/^0\d/.test(value)) value = value.substr(1)
            // 保证.只出现一次，而不能出现两次以上
            value = value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
            // if (value > this.props.maxNumber) value = this.props.maxNumber
            // if (!value) value = '0'
            this.props.setValue(value)
        } else {
            this.props.setValue(value)
        }
        if (this.props.showSlider && Number(this.props.maxNumber)) {
            let tempValue
            if (this.props.maxNumber && value > this.props.maxNumber) {
                tempValue = this.props.maxNumber
            } else {
                tempValue = value
            }
            tempValue = tempValue || 0
            this.pv = (tempValue / this.props.maxNumber).toFixed(3)
        }
    }
    @autobind
    controlFixed(value) {
        if (this.props.fixed) {
            const vals = value.split('.')
            if (vals.length === 2) {
                return vals[1].length <= this.props.fixed
            }
        }
        return true
    }
    @autobind
    initNowValue(propsP) {
        const props = propsP || this.props
        if (props.dataList) {
            for (let i = 0; i < props.dataList.length; i += 1) {
                const el = props.dataList[i]
                if (!this.state.visible && el[this.props.valueKey] === props.getValue()) {
                    this.setState({
                        nowValue: el[this.props.labelKey]
                    })
                    break
                }
            }
        }
    }
    @autobind
    sliderCallback(pv) {
        if (this.props.maxNumber && pv !== this.pv) {
            let n = 2
            if (this.props.isInt || this.props.fixed === 0) {
                n = 0
            }
            this.props.setValue(Number((this.props.maxNumber * pv).toFixed(n)))
        }
    }
    @autobind
    selectItem(item) {
        this.props.setValue(item[this.props.valueKey])
        if (this.props.callback) this.props.callback(item[this.props.valueKey])
        if (this.props.onChange) this.props.onChange(item[this.props.valueKey])
    }
    @autobind
    selectFocus() {
        this.setState({
            visible: true,
            nowValue: '',
            placeholder: this.state.nowValue
        })
    }
    @autobind
    selectInput() {
        const datas = []
        if (this.props.dataList) {
            for (let i = 0; i < this.props.dataList.length; i += 1) {
                const el = this.props.dataList[i]
                if (el[this.props.labelKey].toLocaleUpperCase().indexOf(this.state.nowValue.toLocaleUpperCase()) !== -1) {
                    datas.push(el)
                }
            }
        }
        return (
            <div>
                <input
                    className="ft-theme-input ft-theme-s3"
                    type="text"
                    placeholder={this.state.placeholder || this.props.placeholder}
                    onFocus={this.selectFocus}
                    onBlur={() => {
                        this.setState({
                            visible: false
                        })
                        this.initNowValue()
                    }}
                    onChange={(e) => { this.setState({ nowValue: e.target.value }) }}
                    value={this.state.nowValue}
                />
                {
                    this.state.visible ?
                        <ul className="trade-select-list ft-theme-bg-select">
                            {datas.map(item => (
                                <li className="ft-theme-bg-select-li ft-theme-s2" onMouseDown={() => { this.selectItem(item) }} key={item[this.props.valueKey]}>{item[this.props.labelKey]}</li>
                            ))}
                        </ul> : null
                }
            </div>
        )
    }
    @autobind
    inputFocus() {
        this.inputRef.focus()
    }
    render() {
        return (
            <div className={cs('trade-main trade-select ft-trade-border', this.props.className)}>
                <div className="trade-input-panel">
                    <span className="ft-theme-label trade-input-label" onClick={this.inputFocus} >
                        {this.props.label}
                    </span>
                    {this.selectInput()}
                    {
                        this.props.maxNumber || this.props.maxNumber === 0 ?
                            <span onClick={this.inputFocus} className="trade-input-ts ft-theme-label">{'≤'}{this.props.maxNumber}{this.props.unit}</span> :
                            null
                    }
                </div>
                {
                    this.props.rightTip ?
                        <a className="trade-input-ts2 ft-theme-ts-bg ft-theme-s1" target="_blank" >{this.props.rightTip}</a> :
                        null
                }
            </div>
        )
    }
}
