import React from 'react'
import { I18n } from 'react-i18next'
import { withRouter } from 'react-router'
import { Link, Switch, Redirect } from 'react-router-dom'
import RouteWithSubRoutes from '@/components/routeWithSubRoutes'

import './index.scss'

@withRouter
export default class MyAccount extends React.Component {
    constructor() {
        super()
        this.state = {}
    }

    render() {
        return (
            <I18n>
                {
                    t => (
                        <div className="myaccount">
                            <ul className="myaccount-ul">
                                <li className={this.props.location.pathname === '/comm/fund/history/futures/orders' ? 'subtab-style subtab-active' : 'subtab-style'} >
                                    <Link to="/comm/fund/history/futures/orders">{t('fundManage.tranRecord.entrust')}</Link>
                                </li>
                                <li className={this.props.location.pathname === '/comm/fund/history/futures/filled' ? 'subtab-style subtab-active' : 'subtab-style'} >
                                    <Link to="/comm/fund/history/futures/filled">{t('fundManage.tranRecord.makeBargain')}</Link>
                                </li>
                            </ul>
                            <div className="innerRouter">
                                <Switch>
                                    {
                                        this.props.routes.map((route, i) =>
                                            <RouteWithSubRoutes key={i} {...route} />)
                                    }
                                    <Redirect to="/comm/fund/history/futures/orders" />
                                </Switch>
                            </div>
                        </div>
                    )
                }
            </I18n>
        )
    }
}
