import { createActions } from 'redux-actions'
import Message from '@/components/message'

export default function createActionsHandler(apis) {
    // let wsObj
    const wsDatas = []
    const websocketParam = []
    // let websocketOpen = false
    let timeout = 0 // 9分钟发一次心跳
    const actions = createActions({
        SET_LANG: lang => ({
            lang
        }),
        SET_LANG_SRC: langSrc => ({
            langSrc
        }),
        CHANGE_THEME: (theme) => {
            localStorage.theme = theme
            return {
                theme
            }
        },
        GET_USER_AUTH: async () => {
            try {
                const res = await apis.getUserAuth()
                if (res.code === 0) {
                    localStorage.userAuth = JSON.stringify(res.data)
                    localStorage.auth = res.data.token || ''
                    return {
                        userAuth: res.data
                    }
                }
                if (res.code === 401) { // 登录过期
                    localStorage.userAuth = 0
                    return {
                        userAuth: 0
                    }
                }
            } catch (e) {
                // message.error(e.message)
            }
            localStorage.userAuth = 0
            return {
                userAuth: 0
            }
        },
        GET_SWITH: async () => {
            try {
                const res = await apis.switch()
                if (res.code === 0) {
                    if (res.data.jump === 1) {
                        return {
                            swith: true
                        }
                    }
                    return {
                        swith: false
                    }
                }
            } catch (e) {
                // message.error(e.message)
            }
            return {
                swith: false
            }
        },
        CLEAR_USER_AUTH: () => ({ userAuth: 0 }),
        GET_CONTRACT_DATA: async (contractId) => {
            const params = {}
            if (contractId) params.contractId = contractId
            try {
                const res = await apis.contractListFirst(params)
                if (res.code === 0) {
                    return {
                        contractData: res.data,
                        asynchronous: null
                    }
                }
            } catch (e) {
                Message.error(e.message)
            }
            return {
                contractData: null,
                asynchronous: true
            }
        },
        GET_USDK_DATA: async (pairId) => {
            const params = {}
            if (pairId) params.pairId = pairId.toString()
            try {
                const res = await apis.USDKListFirst(params)
                if (res.code === 0) {
                    return {
                        usdkData: res.data,
                        asynchronous: null
                    }
                }
            } catch (e) {
                Message.error(e.message)
            }
            return {
                usdkData: null,
                asynchronous: true
            }
        },
        CHANGE_LEVERAGE: leverage => ({ leverage }),
        SET_WS: wsObj => ({ wsObj }),
        SET_WS_STATUS: wsConnet => ({ wsConnet }),
        /* eslint-disable */
        SEND_WS: async (wsObj, data) => {
            // 断线重连参数
            if (data && data !== 'ping') {
                if (JSON.parse(data).reqType !== -5) {
                    if (websocketParam && websocketParam.length) {
                        let shouldChange = null
                        websocketParam.forEach((item, index) => {
                            if (JSON.parse(data).reqType === 7) {
                                if (item.type === JSON.parse(data).type) {
                                    shouldChange = index
                                }
                            } else {
                                if (item.reqType === JSON.parse(data).reqType) {
                                    shouldChange = index
                                }
                            }
                        })
                        if (shouldChange) { // 如果type有相等的,需要进行替换
                            websocketParam.splice(shouldChange, 1, JSON.parse(data))
                        } else { // 如果没有相等的，直接放进去
                            websocketParam.push(JSON.parse(data))
                        }
                    } else { // 第一次进行插入
                        websocketParam.push(JSON.parse(data))
                    }
                } else if (JSON.parse(data).reqType === -5) { // 取消订阅的时候删除该内容
                    for (let i = 0; i < websocketParam.length; i += 1) {
                        if (websocketParam[i].reqType === JSON.parse(data).type) {
                            websocketParam.splice(i, 1)
                        }
                    }
                }
            }
            if (wsObj === null) {
                return
            }
            wsObj.onopen = () => {// eslint-disable-line
                for (let i = wsDatas.length - 1; i >= 0; i -= 1) {
                    wsObj.send(wsDatas[i])
                    wsDatas.splice(i, 1)
                }
            }
            if (wsObj.readyState === 0) { // 正在建立连接连接，还没有完成
                wsDatas.push(data)
            } else {
                wsObj.send(data)
            }
            // if (wsObj.readyState !== 1) {
            //     wsDatas.push(data)
            // }
            // wsDatas = [...new Set(wsDatas)] // 数组去重es6新写法
            // console.log(wsDatas)
            // if (wsObj.readyState === 1) {
            //     if (wsDatas.length === 0) {
            //         wsObj.send(data)
            //     } else {
            //         for (let i = wsDatas.length - 1; i >= 0; i -= 1) {
            //             wsObj.send(wsDatas[i])
            //             wsDatas.splice(i, 1)
            //         }
            //     }
            // }
            return {
                websocketParams: websocketParam
            }
        },
        CLEAR_WEBSOCKET_PARAMS: () => ({
            websocketParams: null
        }),
        CLOSE_WS: (wsObj) => {
            if (wsObj) {
                wsObj.close()
                timeout = 0
            }
            return {
                wsObj,
                timeout,
            }
        },
        SET_WS_DATA: data => ({
            wsData: data
        }),
        CLEAR_WS_DATA: () => ({
            wsData: {}
        }),
        SAVE_PRICE_DATA: data => ({
            priceData: data
        }),
        SAVE_SESSION_ID: data => ({
            sessionId: data
        }),
        PASS_DEEP_PRICE: price => ({
            tradePrice: {
                price,
                d: new Date().getTime()
            }
        }),
        SEND_FUND_COMPONENT: component => ({
            headerFundComponent: component
        }),
        SAVE_LEVER: data => ({
            lever: data
        }),
        SAVE_UDESK_LOAD: data => ({
            udeskLoaded: data
        }),
        SAVE_POINTS: data => ({
            points: data
        }),
        SAVE_COINIMG: data => ({
            coinImg: data
        }),
        SAVE_C2C_CURRENCY: data => ({
            c2cCurrency: data
        }),
    })
    return actions
}
