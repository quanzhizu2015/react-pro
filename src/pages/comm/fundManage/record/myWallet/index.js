import React from 'react'
import { I18n } from 'react-i18next'
import { withRouter } from 'react-router'
import { Link, Switch, Redirect } from 'react-router-dom'
import RouteWithSubRoutes from '@/components/routeWithSubRoutes'

import './index.scss'

@withRouter
export default class MyWallet extends React.Component {
    constructor() {
        super()
        this.state = {}
    }

    render() {
        return (
            <I18n>
                {
                    t => (
                        <div className="mywallet">
                            <ul className="mywallet-tabUl">
                                <li className={this.props.location.pathname === '/comm/fund/history/wallet/fundhistory' ? 'subtab-style subtab-active' : 'subtab-style'} >
                                    <Link to="/comm/fund/history/wallet/fundhistory">{t('fundManage.tranRecord.coinrecords')}</Link>
                                </li>
                                <li className={this.props.location.pathname === '/comm/fund/history/wallet/lockhistory' ? 'subtab-style subtab-active' : 'subtab-style'} >
                                    <Link to="/comm/fund/history/wallet/lockhistory">{t('fundManage.tranRecord.lockrecords')}</Link>
                                </li>
                                {/* <li className={this.props.location.pathname === '/comm/fund/history/wallet/dividendhistory' ? 'subtab-style subtab-active' : 'subtab-style'} >
                                    <Link to="/comm/fund/history/wallet/dividendhistory">{t('fundManage.tranRecord.dividendrecords')}</Link>
                                </li>
                                <li className={this.props.location.pathname === '/comm/fund/history/wallet/referrhistory' ? 'subtab-style subtab-active' : 'subtab-style'} >
                                    <Link to="/comm/fund/history/wallet/referrhistory">{t('fundManage.tranRecord.referrRecord')}</Link>
                                </li>
                                <li className={this.props.location.pathname === '/comm/fund/history/wallet/optionhistory' ? 'subtab-style subtab-active' : 'subtab-style'} >
                                    <Link to="/comm/fund/history/wallet/optionhistory">{t('fundManage.tranRecord.optionhistory')}</Link>
                                </li> */}
                            </ul>
                            <div className="innerRouter">
                                <Switch>
                                    {
                                        this.props.routes.map((route, i) =>
                                            <RouteWithSubRoutes key={i} {...route} />)
                                    }
                                    <Redirect to="/comm/fund/history/wallet/fundhistory" />
                                </Switch>
                            </div>
                        </div>
                    )
                }
            </I18n>
        )
    }
}
