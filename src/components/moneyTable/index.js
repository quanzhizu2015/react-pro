import React, { Component } from 'react'
import { I18n } from 'react-i18next'
import cs from 'classnames'
import './moneytable.scss'

class MoneyTable extends Component {
    constructor() {
        super()
        this.state = {
            // showLi: false,
            // changeLi: ''
            arrowLeft: 0
        }
    }
    componentWillReceiveProps(props) {
        if (props.expand !== this.props.expand) {
            this.state.arrowLeft = 0
        }
    }
    componentDidUpdate() {
        this.setArrowLeft()
    }
    setArrowLeft() {
        if (this.state.arrowLeft === 0 &&
            this.props.expand &&
            this.props.expand.bLeft &&
            this.expandDiv) {
            this.setState({
                arrowLeft: (this.props.expand.bLeft - this.expandDiv.offsetLeft)
                    + (this.props.expand.bWidth / 2)
            })
        }
    }
    renderHeader() {
        return this.props.dataHeader.map((item, i) => {
            const style = {
                width: item.width,
                textAlign: item.align,
                marginLeft: item.marginLeft
            }
            return (
                <span key={i} style={style}>
                    {item.name}
                </span>
            )
        })
    }
    renderContant(item, i) {
        return this.props.dataHeader.map((opt, index) => {
            const style = {
                width: opt.width,
                textAlign: opt.align,
                marginLeft: opt.marginLeft
            }
            return (
                <span key={`${item[this.props.expandkey]}_${i}_${opt.key}_${index}`} style={style}>
                    {
                        opt.key === 'action' ?
                            <div>
                                {opt.render(
                                    item,
                                    i
                                )}
                            </div>
                            :
                            item[opt.key]
                    }
                </span>
            )
        })
    }
    renderExpand(item) {
        if (this.props.expand) {
            const { key, keyValue, expandRender } = this.props.expand
            const arrowStyle = {
                left: `${this.state.arrowLeft}px`
            }

            if (item[key] === keyValue) {
                return (
                    <div className="expand-div" ref={(expandDiv) => { this.expandDiv = expandDiv }}>
                        {expandRender}
                        <i className="expand-arrow" style={arrowStyle} />
                    </div>
                )
            }
        }
        return null
    }
    render() {
        // const hasData = (this.props.dataSource && this.props.dataSource.length !== 0)
        return (
            <I18n>
                {
                    t => (
                        <div className={cs('moneytable', this.props.className)}>
                            <div className="tableOne">
                                <ul>
                                    {/* 头部 */}
                                    <li>
                                        {this.renderHeader()}
                                    </li>
                                    {
                                        (this.props.dataSource && this.props.dataSource.length !== 0) ?
                                            this.props.dataSource.map((item, i) => (
                                                // 数据
                                                <li key={i}>
                                                    {this.renderContant(item, i)}
                                                    {this.renderExpand(item)}
                                                </li>
                                            ))
                                            :
                                            null
                                    }
                                    {
                                        this.props.dataSource && this.props.dataSource.length !== 0 ?
                                            null
                                            :
                                            <li className="noData">
                                                <svg className="icon" aria-hidden="true" width="100">
                                                    <use xlinkHref="#iconno-data" width="100" />
                                                </svg>
                                                <p>{t('market.nodata')}</p>
                                            </li>
                                    }
                                </ul>
                            </div>
                        </div>
                    )
                }
            </I18n>
        )
    }
}
export default MoneyTable
