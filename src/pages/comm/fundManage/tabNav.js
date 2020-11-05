import React from 'react'
import { I18n } from 'react-i18next'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import cs from 'classnames'
import i18n from '../../../i18n'

@withRouter
@connect()
export default class TabNav extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            lineStyle: {
            },
            target: null,
        }
        this.switchRouter = this.switchRouter.bind(this)
    }
    componentDidMount() {
        // 遍历this,找到当前的pathname包含其中的key的数据
        const { pathname } = this.props.location
        let target = null
        Object.keys(this).forEach((key) => {
            if (pathname.indexOf(key) >= 0) {
                target = this[key]
            }
        })
        if (target) this.switchRouter(target)
        // 绑定语言切换
        i18n.on('languageChanged', this.onLanguageChanged)
    }
    componentWillReceiveProps(props) {
        if (this.props.location !== props.location) {
            this.switchRouter(this[props.location.pathname])
        }
    }
    onLanguageChanged = () => {
        setTimeout(() => {
            this.switchRouter(this[this.props.location.pathname])
        }, 0)
    }
    switchRouter(target) {
        let targetClone = this.state.target
        if (target) {
            targetClone = target
        }
        const left = targetClone.offsetLeft - targetClone.parentElement.offsetLeft
        this.setState({
            lineStyle: {
                left: `${left}px`,
                width: `${targetClone.offsetWidth}px`
            },
            target: targetClone,
        })
    }
    render() {
        const { pathname } = this.props.location
        return (
            <I18n>
                {
                    t => (
                        <div className="tabNav">
                            <ul>
                                <li ref={(target) => { this['/comm/fund/wallet'] = target }} className={cs({ activeLi: pathname === '/comm/fund/wallet' })} >
                                    <Link to="/comm/fund/wallet">{t('fundManage.wallet')}</Link>
                                </li>
                                <li ref={(target) => { this['/comm/fund/history'] = target }} className={cs({ activeLi: pathname.indexOf('/comm/fund/history') >= 0 })}>
                                    <Link to="/comm/fund/history">{t('fundManage.record')}</Link>
                                </li>
                            </ul>
                            <div className="tabNavLine">
                                <div className="activeLine" style={this.state.lineStyle} />
                            </div>
                        </div>
                    )
                }
            </I18n>
        )
    }
}
