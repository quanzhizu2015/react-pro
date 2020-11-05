import React from 'react'
import { Switch, Redirect } from 'react-router-dom'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import RouteWithSubRoutes from '@/components/routeWithSubRoutes'
import Header from '@/components/header'

import './index.scss'

@withRouter
@connect(state => ({
    apis: state.apis,
    theme: state.theme,
    getSwith: state.getSwith,
    headerFundComponent: state.headerFundComponent
}))

export default class Black extends React.Component {
    constructor(props) {
        super(props)
        this.getMoniSwitch = this.getMoniSwitch.bind(this)
    }
    componentWillMount() {
        // 获取开关
        this.getMoniSwitch()
    }
    async getMoniSwitch() {
        this.props.dispatch(this.props.getSwith())
    }
    render() {
        return (
            <div className="black ft-theme-bg-default">
                {/* showTheme */}
                <Header type="trade" />
                <link rel="stylesheet" href={window.themeUrl[this.props.theme]} />
                <Switch>
                    {
                        this.props.routes.map((route, i) =>
                            <RouteWithSubRoutes key={i} {...route} />)
                    }
                    <Redirect to="/trade/spot" />
                </Switch>
            </div>
        )
    }
}
