import React, { Component } from 'react'
import { I18n } from 'react-i18next'
import { connect } from 'react-redux'
import Button from '@/components/button'
import { Checkbox } from 'antd'
import './popFramework.scss'

@connect(state => ({
    theme: state.theme,
}))
class PopFramework extends Component {
    constructor(props) {
        super(props)
        this.state = {
            PopStyle: {
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: this.props.width ? `${this.props.width}px` : '330px',
                height: this.props.height ? `${this.props.height}px` : '331px',
                marginLeft: this.props.width ? `-${(this.props.width / 2).toFixed(0)}px` : '-165px',
                marginTop: this.props.height ? `-${(this.props.height / 2).toFixed(0)}px` : '-165px',
            },
            checkInput: false
        }
    }
    componentWillMount() {
        // // 判断是否需要弹框
        // const { whetherShow } = localStorage
        // if (whetherShow === true || whetherShow === 'true') {
        //     this.setState({
        //         visable: false
        //     })
        //     // 调用原来的传入的confirm接口进行提交
        //     if (this.props.confirm) {
        //         this.props.confirm()
        //     }
        // } else {
        //     this.popInit()
        // }
        this.popInit()
    }
    popInit() {
        // 如果没传宽度和高度，就显示默认的宽度330高度330
        if (this.props.width && this.props.height) {
            this.setState({
                PopStyle: {
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: `${this.props.width}px`,
                    height: `${this.props.height}px`,
                    marginLeft: `-${(this.props.width / 2).toFixed(0)}px`,
                    marginTop: `-${(this.props.height / 2).toFixed(0)}px`,
                }
            })
        }
    }
    confirm = () => {
        // 判断是否已经将下次不在提示勾选上
        // 将勾选上的数据放置在localStorage中
        let boxChecked = false
        if (this.state.checkInput) {
            boxChecked = this.state.checkInput
        }
        // 调用父层的确定方法
        if (this.props.confirm) {
            this.props.confirm(boxChecked)
        }
    }
    cancel = () => {
        if (this.props.cancel) {
            this.props.cancel()
        }
    }
    handleCheckBox = (e) => {
        if (e.target.checked === true) {
            this.setState({ checkInput: true })
        } else {
            this.setState({ checkInput: false })
        }
    }
    render() {
        return (
            <I18n>
                {
                    t => (
                        <div>
                            {
                                this.props.visible === true ?
                                    <div className="pop-framework">
                                        <div style={this.state.PopStyle} className="pop-content ft-theme-bg-default">
                                            <span className="pop-title ft-theme-pop-title">{this.props.title}</span>
                                            <i className="iconfont iconchahao1" onClick={this.cancel} />
                                            <div style={this.props.Popstyle}>
                                                {this.props.children}
                                            </div>
                                            <div className="button-footer">
                                                {
                                                    this.props.notips === true ?
                                                        <span className="footer-notips">
                                                            <Checkbox checked={this.state.checkInput} className={this.props.theme === 'night' ? 'checkNone' : 'checkNonelight'} onChange={(e) => { this.handleCheckBox(e) }}>{t('popFramework.notipsnext')}</Checkbox>
                                                            {/* <input type="checkbox" ref={(checkBox) => { this.checkBox = checkBox }} /> */}
                                                            {/* <span className="notips-span ft-theme-pop-notip">下次不再提示</span> */}
                                                        </span>
                                                        :
                                                        null
                                                }
                                                <Button style={this.state.btnStyle} theme="primary" loading={this.props.loading} disabled={this.props.disable === false} className="btnPrimary" onClick={this.confirm}>{t('popFramework.confirm')}</Button>
                                                {/*
                                                <Button theme="primary" disabled={this.props.disable === false} className="btn" onClick={this.props.confirm}>确定</Button> */}
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    null
                            }
                        </div>
                    )
                }
            </I18n>
        )
    }
}
export default PopFramework

