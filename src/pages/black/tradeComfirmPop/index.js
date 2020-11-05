import React from 'react'
import { I18n } from 'react-i18next'
import './tradeComfirmPop.scss'
import PopFramework from '../popFramework'

class TradeComfirmPop extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    // componentWillMount() {
    //     // 判断是否需要弹框
    //     const { whetherShow } = localStorage
    //     if (whetherShow === true || whetherShow === 'true') {
    //         // 调用原来的传入的confirm接口进行提交
    //         if (this.props.confirm) {
    //             this.props.confirm()
    //         }
    //     }
    // }
    // componentWillReceiveProps(nextProps) {
    //     console.log(nextProps)
    // }
    render() {
        return (
            <I18n>
                {
                    t => (
                        <div className="trade-pop">
                            {t('')}
                            <PopFramework loading={this.props.loading} visible={this.props.visible} notips confirm={this.props.confirm} cancel={this.props.cancel}>
                                <div className="trade-title ft-theme-s2">{this.props.title}</div>
                                {
                                    this.props.dataList ?
                                        this.props.dataList.map((item, index) => (
                                            <div className="trade-type" key={index}>
                                                <span className="label-common ft-theme-pop-notip">{item.label}</span>
                                                <span className="value-common ft-theme-pop-title">{item.value}</span>
                                            </div>
                                        ))
                                        :
                                        null
                                }
                            </PopFramework>
                        </div>
                    )
                }
            </I18n>
        )
    }
}

export default TradeComfirmPop
