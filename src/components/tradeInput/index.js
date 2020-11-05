import React, { Component } from 'react'
import { Tooltip } from 'antd'
import { I18n } from 'react-i18next'
import { withFormsy, propTypes } from 'formsy-react'
import { autobind } from 'core-decorators'
import cs from 'classnames'
import { BigDecimal } from 'bigdecimal'

import './index.scss'


@withFormsy
export default class TradeInput extends Component {
    static propTypes = {
        ...propTypes
    }
    static defaultProps = {
        disabledText: '--',
        region: '1',
        type: 'text',
        unit: '',
        maxLength: 12
    }
    constructor() {
        super()
        this.state = {
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.value !== this.props.value) {
            nextProps.setValue(nextProps.value)
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
    inputFocus() {
        this.inputRef.focus()
    }
    @autobind
    textInput() {
        const autocomplete = this.props.type === 'password' ? 'new-password' : 'off'
        return (
            <input
                ref={(ref) => { this.inputRef = ref }}
                onChange={this.onChange}
                onFocus={this.props.onFocus ? this.props.onFocus : null}
                type={this.props.type}
                autoComplete={autocomplete}
                value={this.props.disabled ? this.props.disabledText : this.props.getValue() || ''}
                placeholder={this.props.placeholder}
                className="ft-theme-input ft-theme-s3 ft-theme-input-mask"
                disabled={this.props.disabled}
                maxLength={this.props.maxLength}
            />
        )
    }
    @autobind
    longPress(event) {
        this.startPress = true
        this.timeout = setTimeout(() => {
            const longEvent = () => {
                if (this.startPress) {
                    event()
                    this.inval = setTimeout(longEvent, 100)
                }
            }
            longEvent()
        }, 800)
    }
    @autobind
    exitLongPress() {
        this.startPress = false
        if (this.inval) {
            clearTimeout(this.inval)
        }
        if (this.timeout) {
            clearTimeout(this.timeout)
        }
    }
    @autobind
    add() {
        this.inputRef.focus()
        if (this.props.onClick) this.props.onClick()
        const value = this.props.getValue()
        if (value) {
            // const val = parseFloat(value) + 1
            const val = Number(BigDecimal(value).add(BigDecimal(this.props.region)).floatValue()).toFixed(this.props.fixed)
            this.props.setValue(val)
        } else {
            this.props.setValue(this.props.region)
        }
    }
    @autobind
    del() {
        this.inputRef.focus()
        if (this.props.onClick) this.props.onClick()
        const value = this.props.getValue()
        if (value && Number(value) - Number(this.props.region) > 0) {
            const val = Number(BigDecimal(value).subtract(BigDecimal(this.props.region)).floatValue()).toFixed(this.props.fixed)
            this.props.setValue(val)
        } else {
            this.props.setValue('0')
        }
    }
    @autobind
    editInput() {
        return (
            <div className="trade-edit" >
                <a className="ft-theme-ts-bg ft-theme-s3 ft-theme-ts-bg-hover" onMouseDown={() => { this.longPress(this.add) }} onMouseOut={this.exitLongPress} onMouseUp={this.exitLongPress} onClick={this.add}>+</a>
                <a className="ft-theme-ts-bg ft-theme-s3 ft-theme-ts-bg-hover" onMouseDown={() => { this.longPress(this.del) }} onMouseOut={this.exitLongPress} onMouseUp={this.exitLongPress} onClick={this.del}>-</a>
            </div>
        )
    }
    @autobind
    renderMask() {
        if (this.props.disabled) {
            return (
                <div
                    className="trade-input-mask"
                    onClick={this.props.onClick}
                />
            )
        }
        if (this.props.disabledShowMask) {
            return (
                <div
                    className="trade-input-mask trade-input-mask-short"
                    onClick={this.props.onClick}
                >
                    <span className="ft-theme-label trade-input-label">
                        {this.renderLabel()}
                        {this.renderToolTip()}
                    </span>
                </div>
            )
        }
        return null
    }
    @autobind
    renderToolTip() {
        if (this.props.showTipIcon) {
            const tooltipStr = this.props.tooltip ? this.props.tooltip : ''
            const toolTipHtml = (
                <I18n>{
                    () => (<div className="pop-contant cursor"><span>{tooltipStr}</span></div>)}
                </I18n>
            )
            return (
                <Tooltip overlayClassName="pop-main" title={toolTipHtml}>
                    <span className="icon-question-bg">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" className="icon-question">
                            <use style={{ pointerEvents: 'none' }} xlinkHref="#iconwenhao1" />
                        </svg>
                    </span>
                </Tooltip>
            )
        }
        return null
    }
    @autobind
    renderLabel() {
        if (!this.props.showTipIcon && this.props.tooltip) {
            const tooltipStr = this.props.tooltip ? this.props.tooltip : ''
            const toolTipHtml = (
                <I18n>{
                    () => (<div className="pop-contant cursor"><span>{tooltipStr}</span></div>)}
                </I18n>
            )
            return (
                <Tooltip overlayClassName="pop-main" title={toolTipHtml}>
                    {this.props.label}
                </Tooltip>
            )
        }
        return this.props.label
    }
    render() {
        return (
            <div className={cs('trade-main trade-input ft-trade-border', this.props.className)}>
                <div
                    className="trade-input-panel"
                >
                    {this.renderMask()}
                    <span className="ft-theme-label trade-input-label" onClick={this.inputFocus} >
                        {this.renderLabel()}
                        {this.renderToolTip()}
                    </span>
                    {this.textInput()}
                    <span onClick={this.inputFocus} className="trade-input-ts ft-theme-label">{this.props.disabled ? '' : this.props.unit}</span>
                </div>
                {this.props.showEditInput && this.editInput()}
            </div>
        )
    }
}
