import React, { Component } from 'react'
import { Switch, Redirect } from 'react-router-dom'
import { withRouter } from 'react-router'
import RouteWithSubRoutes from '@/components/routeWithSubRoutes'
import { I18n } from 'react-i18next'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import './index.scss'

/*eslint-disable */
@withRouter
@connect(state => ({
    userAuth: state.userAuth,
}))
class CardPackage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeLi: 1,
            ulList: [
                {
                    key: 1, name: 'cards.tit1', lank: '/comm/card/package'
                },
                {
                    key: 2, name: 'cards.tit2', lank: '/comm/card/history'
                }
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
        let e = this.props.location.pathname
        if (props) {
            e = props.location.pathname
        }
        // if (e === '/comm/security/main') {
        //     this.setState({ activeLi: 1 })
        // }
        if (e === '/comm/card/package') {
            this.setState({ activeLi: 1 })
        } else if (e === '/comm/card/history') {
            this.setState({ activeLi: 2 })
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
            <div className="card">
                <I18n>
                    {
                        t => (
                            <div className="card-main">
                                <Helmet>
                                    <title>{t('safe.safeTitle')}</title>
                                    <meta content={t('safe.safeContent')} name="description" />
                                    <meta content={t('safe.safeKeywords')} name="keywords" />
                                </Helmet>
                                <div className="card-mainUl">
                                    <ul>
                                        {
                                            this.state.ulList.map(item => (
                                                <li
                                                    key={item.key}
                                                    className={this.state.activeLi === item.key ? 'active' : ''}
                                                    onClick={() => this.changeActive(item.key, item.lank)}
                                                >
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
                                <div className="card-mainChild">
                                    <Switch>
                                        {
                                            this.props.routes.map((route, i) =>
                                                <RouteWithSubRoutes key={i} {...route} />)
                                        }
                                        <Redirect to="/comm/card/package" />
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
export default CardPackage

