import React from 'react'
import { I18n } from 'react-i18next'
import { withRouter } from 'react-router'
import { Link, Switch, Redirect } from 'react-router-dom'
import RouteWithSubRoutes from '@/components/routeWithSubRoutes'

import './index.scss'

@withRouter
export default class Record extends React.Component {
    constructor() {
        super()
        this.state = {}
    }

    render() {
        return (
            <I18n>
                {
                    t => (
                        <div className="record">
                            <ul>
                                <li className={this.props.location.pathname.indexOf('/comm/fund/history/wallet') >= 0 ? 'tab-style tab-active' : 'tab-style'} >
                                    <Link to="/comm/fund/history/wallet">{t('fundManage.tranRecord.walletAccount')}</Link>
                                </li>
                            </ul>
                            <div className="innerRouter">
                                <Switch>
                                    {
                                        this.props.routes.map((route, i) =>
                                            <RouteWithSubRoutes key={i} {...route} />)
                                    }
                                    <Redirect to="/comm/fund/history/wallet" />
                                </Switch>
                            </div>
                        </div>
                    )
                }
            </I18n>
        )
    }
}
