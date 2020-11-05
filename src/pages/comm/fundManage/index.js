import React from 'react'
import { I18n } from 'react-i18next'
import { Switch, Redirect } from 'react-router-dom'
import RouteWithSubRoutes from '@/components/routeWithSubRoutes'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'

import './fundManage.scss'
import TabNav from './tabNav'

@connect(state => ({
    userAuth: state.userAuth
}))
export default class Fund extends React.Component {
    render() {
        // if (this.props.userAuth === null) {
        //     return null
        // }
        return (
            <I18n>
                {
                    t => (
                        <div className="fundManage">
                            <Helmet>
                                <title>{t('fundManage.fundManageTitle')}</title>
                                <meta content={t('fundManage.fundManageContent')} name="description" />
                                <meta content={t('fundManage.fundManageKeywords')} name="keywords" />
                            </Helmet>
                            <div className="box1200">
                                <div>{t('fundManage.title')}</div>
                                <TabNav />
                                <div className="innerRouter">
                                    <Switch>
                                        {
                                            this.props.routes.map((route, i) =>
                                                <RouteWithSubRoutes key={i} {...route} />)
                                        }
                                        <Redirect to="/comm/fund/wallet" />
                                    </Switch>
                                    {/* {
                                        this.props.userAuth === null ?
                                            null :
                                            <Switch>
                                                {
                                                    this.props.routes.map((route, i) =>
                                                        <RouteWithSubRoutes key={i} {...route} />)
                                                }
                                                <Redirect to="/comm/fund/wallet" />
                                            </Switch>

                                    } */}
                                </div>
                            </div>
                        </div>
                    )
                }
            </I18n>
        )
    }
}
