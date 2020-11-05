import React from 'react'
import { I18n } from 'react-i18next'
import { connect } from 'react-redux'
import PopFramework from '../popFramework'
import Message from '@/components/message'
import './leveragePop.scss'

const leverage = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
// const leverageMax = 10

@connect(state => ({
    apis: state.apis,
    changeLeverage: state.changeLeverage
}))
class LeveragePop extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visable: this.props.visable,
            value: this.props.value ? this.props.value : 1,
            errorDisplay: false,
            title1: '调整杠杆',
            title2: '调整杠杆失败',
            leverageFail: false
        }
    }
    handleInput = (e) => {
        // 校验输入的数据是否为1-10
        const { value } = e.target
        let flag = false
        for (let i = 0; i < leverage.length; i += 1) {
            if (value === leverage[i] || `${value}` === leverage[i]) {
                this.setState({
                    value,
                    errorDisplay: false
                })
                flag = true
            }
        }
        if (!flag) {
            // 表示输入错误
            this.setState({
                value,
                errorDisplay: true
            })
        }
    }
    // 处理从拉伸条来的数据，四舍五入放到Input中
    handleProcessVal = (value) => {
        if (value && value !== this.state.value) {
            // 针对value进行四舍五入
            const processValue = Math.round(value * Number(leverage[leverage.length - 1]))
            if (processValue !== this.state.value) {
                // 表示当前需要变动
                this.handleInput({ target: { value: processValue } })
            }
        }
    }
    confirm = () => {
        // 判断leverageFail是否为true，若为true，则回到调整杠杆的界面，若为false，则向后台发送请求调整杠杆
        if (!this.state.leverageFail) {
            // 调用后台将杠杆数据存入后台
            const res = { code: 0 }
            if (res && res.code === 0) {
                Message.success('调整杠杆成功', 'night')
                this.setState({
                    visable: false
                })
                this.props.changeLeverage(this.state.value)
            } else {
                this.setState({
                    leverageFail: true
                })
            }
        } else {
            this.setState({
                leverageFail: false
            })
        }
    }
    cancel = () => {
        this.setState({
            visable: false
        })
    }
    render() {
        return (
            <I18n>
                {
                    t => (
                        <div className="leverage-main">
                            {t('')}
                            <PopFramework height={250} title={this.state.leverageFail ? this.state.title2 : this.state.title1} visable={this.state.visable} notips={false} confirm={this.confirm} cancel={this.cancel}>
                                {
                                    !this.state.leverageFail ?
                                        <div>
                                            <div className="leverage-name">
                                                <span className="label-common ft-theme-label">合约名称：</span>
                                                <span className="value-common ft-theme-s2">BTC系列合约</span>
                                            </div>
                                            <div className="leverage-value">
                                                <span className="label-common ft-theme-label">杠杆</span>
                                                <input className="ft-theme-s2" value={this.state.value} onChange={this.handleInput} />
                                            </div>
                                            <div style={!this.state.errorDisplay ? { display: 'none' } : {}}>
                                                <span className="error-msg">当前杠杆仅能输入1-10的整数</span>
                                            </div>
                                        </div>
                                        :
                                        <div>
                                            <div className="callback ft-theme-label">
                                                <span>请撤销所有挂点后再调整合约杠杆</span>
                                            </div>
                                            <div className="no-balance">
                                                <span>资金不足无法调高杠杆</span>
                                            </div>
                                        </div>
                                }
                            </PopFramework>
                        </div>
                    )
                }
            </I18n>
        )
    }
}

export default LeveragePop
