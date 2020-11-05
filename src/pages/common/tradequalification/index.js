import React, { Component } from 'react'
import { Switch, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import RouteWithSubRoutes from '@/components/routeWithSubRoutes'
import { I18n } from 'react-i18next'
import Helmet from 'react-helmet'

@connect(state => ({
    userAuth: state.userAuth,
}))
class TradeQualification extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    render() {
        return (
            <div className="tradequalification">
                <I18n>
                    {
                        t => (
                            <div>
                                <Helmet>
                                    <title>{t('tradequalification.tradequTitle')}</title>
                                </Helmet>
                                <Switch>
                                    {
                                        this.props.routes.map((route, i) =>
                                            <RouteWithSubRoutes key={i} {...route} />)
                                    }
                                    <Redirect to="/common/futures/learn" />
                                </Switch>
                            </div>
                        )
                    }
                </I18n>
            </div>
        )
    }
}
export default TradeQualification

