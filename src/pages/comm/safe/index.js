import React, { Component } from 'react'
import { Switch, Redirect } from 'react-router-dom'
import RouteWithSubRoutes from '@/components/routeWithSubRoutes'
import { I18n } from 'react-i18next'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import './safe.scss'

// import ReactDom from 'react-dom';
@connect(state => ({
    userAuth: state.userAuth,
}))
class Safe extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeLi: 0,
            ulList: [
                {
                    key: 1, name: 'safe.safe', lank: '/comm/security/main'
                },
                {
                    key: 2, name: 'safe.person', lank: '/comm/security/verification'
                }
                // {
                //     key: 3, name: 'safe.heightset', lank: '/comm/security/leverage'
                // }
                // {
                //     key: 4, name: 'safe.mylevel', lank: '/comm/security/level'
                // }
            ],
        }
    }
    componentWillMount() {
        this.getLanguage()
    }
    componentWillReceiveProps(props) {
        if (this.props.location !== props.location) {
            this.getLanguage(props)
        }
    }
    getLanguage = (props) => {
        // debugger
        let e = this.props.location.pathname
        if (props) {
            e = props.location.pathname
        }
        // if (e === '/comm/security/main') {
        //     this.setState({ activeLi: 1 })
        // }
        if (e === '/comm/security/verification') {
            this.setState({ activeLi: 2 })
        } else if (e === '/comm/security/leverage') {
            this.setState({ activeLi: 3 })
        } else {
            this.setState({ activeLi: 1 })
        }
    }
    // 点击跳转
    changeActive = (e, f) => {
        this.setState({ activeLi: e })
        if (f !== this.props.location.pathname) {
            this.props.history.push(f)
        }
    }
    render() {
        if (this.props.userAuth === 0) {
            return null
        }
        return (
            <div className="safe">
                <I18n>
                    {
                        t => (
                            <div className="safe-main">
                                <Helmet>
                                    <title>{t('safe.safeTitle')}</title>
                                    <meta content={t('safe.safeContent')} name="description" />
                                    <meta content={t('safe.safeKeywords')} name="keywords" />
                                </Helmet>
                                <div className="safe-mainUl">
                                    <ul>
                                        {
                                            this.state.ulList.map(item => (
                                                <li key={item.key} className={this.state.activeLi === item.key ? 'active' : ''} onClick={() => this.changeActive(item.key, item.lank)}>
                                                    {t(item.name)}
                                                    {
                                                        this.state.activeLi === item.key ?
                                                            <i className="iconfont iconmsnui-triangle-right" />
                                                            :
                                                            null
                                                    }
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </div>
                                <div className="safe-mainChild">
                                    <Switch>
                                        {
                                            this.props.routes.map((route, i) =>
                                                <RouteWithSubRoutes key={i} {...route} />)
                                        }
                                        <Redirect to="/comm/security/main" />
                                    </Switch>
                                </div>
                            </div>
                        )
                    }
                </I18n>
            </div>
        )
    }
}
export default Safe

