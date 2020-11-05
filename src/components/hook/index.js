import { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

// 公共路由钩子方法
@withRouter
@connect(state => ({
    userAuth: state.userAuth,
    swith: state.swith,
    getUserAuth: state.getUserAuth,
    clearUserAuth: state.clearUserAuth,
    setWs: state.setWs,
    setWsData: state.setWsData,
    clearWsData: state.clearWsData,
    sessionId: state.sessionId,
    saveSessionId: state.saveSessionId,
    setWsStatus: state.setWsStatus,
    wsObj: state.wsObj,
    sendWs: state.sendWs,
    lang: state.lang,
}))
export default class Hook extends Component {
    componentWillMount() {
        // 初始化认证信息
        this.props.dispatch(this.props.getUserAuth())
        window.routerHistory = this.props.history
    }
    componentDidMount() {
    }
    componentWillReceiveProps(props) {
        const { userAuth } = localStorage
        if (props.userAuth === 0 || !props.userAuth) {
            if (this.props.location !== props.location && JSON.stringify(props.userAuth) !== userAuth
            ) {
                this.props.dispatch(this.props.clearUserAuth())
                this.props.dispatch(this.props.getUserAuth())
            }
        }
        const { pathname, search } = props.location
        // debugger
        if (JSON.stringify(props.userAuth) === '0' &&
            (pathname.startsWith('/comm/fund') ||
            pathname.startsWith('/comm/security/main') ||
            pathname.startsWith('/common/futures') ||
            pathname.startsWith('/comm/security/leverage') ||
            pathname.endsWith('/lend') ||
            pathname.endsWith('/repayment'))) {
            this.props.dispatch(this.props.clearUserAuth())
            localStorage.userAuth = 0
            props.history.replace(`/common/login?backUrl=${encodeURIComponent(pathname)}${encodeURIComponent(search)}`)
        }
        // if (JSON.stringify(props.userAuth) !== '0' && (props.userAuth !== this.props.userAuth) && localStorage.sessionId) {
        //     const paramAry = {
        //         reqType: -3,
        //         sessionId: localStorage.sessionId
        //     }
        //     props.dispatch(props.sendWs(props.wsObj, JSON.stringify(paramAry)))
        // }

        // if ((JSON.stringify(props.userAuth) !== '0' && (props.userAuth !== this.props.userAuth)) || (props.wsConnet === true && props.wsConnet !== this.props.wsConnet)) { // 对公共websocket处理，检测下登录状态，加上sessionId
        //     const param = {
        //         reqType: 12
        //     }
        //     props.dispatch(props.sendWs(props.wsObj, JSON.stringify(param)))
        // }

        // if (props.userAuth && !props.userAuth.isFutureTradeAuth) {
        //     props.history.replace('/common/futures')
        // }
        // if (props.userAuth && props.userAuth.isFutureTradeAuth && localStorage.pathName.startsWith('/common/futures')) {
        //     props.history.replace('/trade/futures')
        // }
        // if (JSON.stringify(props.userAuth) !== '0' && (props.userAuth !== this.props.userAuth)) { // 当前是登录状态
        //     if (search.indexOf('inviteCode') !== -1) { // 找到邀请码
        //         props.history.replace('/invite')
        //     }
        // }
        if (props.swith === true && pathname.startsWith('/trade')) {
            props.history.replace('/tradingcontest')
        }
        if (props.history !== this.props.history) {
            window.routerHistory = this.props.history
        }
    }
    componentWillUnmount() {
        if (this.timer) clearInterval(this.timer)
    }
    render() {
        return null
    }
}
