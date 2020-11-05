import React from 'react'
import { Switch, Redirect } from 'react-router-dom'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import RouteWithSubRoutes from '@/components/routeWithSubRoutes'
import Header from '@/components/header'
import Footer from '@/components/funcoinFooter'

import './index.scss'

@withRouter
@connect()
export default class Comm extends React.Component {
    render() {
        const style = {}
        if (this.props.location.pathname.startsWith('/comm/fund') || this.props.location.pathname.startsWith('/comm/c2c')) {
            style.backgroundColor = '#f7f8f9'
        }
        return (
            <div>
                <div className="comm" style={style}>
                    <Header showPadding isFixed />
                    <Switch>
                        {
                            this.props.routes.map((route, i) =>
                                <RouteWithSubRoutes key={i} {...route} />)
                        }
                        <Redirect to="/comm/security/main" />
                    </Switch>
                    <Footer />
                </div>
            </div>
        )
    }
}
