import React from 'react'
import { Switch, Redirect } from 'react-router-dom'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import RouteWithSubRoutes from '@/components/routeWithSubRoutes'
import Header from '@/components/header'

import './index.scss'

@withRouter
@connect()
export default class Common extends React.Component {
    render() {
        const style = {}
        if (this.props.location.pathname.startsWith('/comm/fund')) {
            style.backgroundColor = '#f7f8f9'
        }
        return (
            <div>
                <div className="common" style={style}>
                    <Header showPadding isFixed />
                    <Switch>
                        {
                            this.props.routes.map((route, i) =>
                                <RouteWithSubRoutes key={i} {...route} />)
                        }
                        <Redirect to="/common/login" />
                    </Switch>
                </div>
            </div>
        )
    }
}
