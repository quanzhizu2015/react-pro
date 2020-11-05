import React from 'react'
import { BrowserRouter as Router, Switch, Redirect } from 'react-router-dom'
import { LocaleProvider } from 'antd'
import { I18n } from 'react-i18next'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import enUS from 'antd/lib/locale-provider/en_US'
import routes from './routes.js'
import RouteWithSubRoutes from './components/routeWithSubRoutes'
import Hook from './components/hook'
import Statistics from './components/statistics'
import CommMessage from './components/commMessage'
import Websockt from './components/websocket'
import './styles/App.scss'

// require('./assets/iconfont/iconfont.js')
// import indexFooter from './components/footer'
export default function App() {
    return (
        <I18n>
            {
                (t, { i18n }) => (
                    <Router>
                        <div className="routerMain">
                            <Websockt />
                            <Hook />
                            <Statistics />
                            <CommMessage />
                            <LocaleProvider locale={i18n.language === 'zh' ? zhCN : enUS}>
                                <Switch>
                                    {
                                        routes.map(route => (
                                            <RouteWithSubRoutes {...route} key={route.path} />
                                        ))
                                    }
                                    <Redirect from="/" exact to="/home" />
                                    <Redirect from="/*" to="/error" />
                                </Switch>
                            </LocaleProvider>
                        </div>
                    </Router>
                )
            }
            {/* <indexFooter /> */}
        </I18n>
    )
}
