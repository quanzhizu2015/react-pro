import axios from 'axios'
import api from './api'
import baseURL from 'baseURL'
import message from '@/components/message'
import Alert86 from '@/components/alert86'
import httpErrorHandler from './httpErrorHandler.js' // http错误处理
// 公共参数配置
const instance = axios.create({
    baseURL,
    timeout: 30000,
    // contentType: 'application/json',
    headers: {
        'content-type': 'application/json'
    },
})

// 在实例已创建后修改默认值
// 返回结果公共处理
instance.interceptors.response.use((res) => {
    if (!res) {
        return Promise.reject(res)
    }
    // 未登录状态
    if (res.data && res.data.code === 401 && window.routerHistory) {
        localStorage.userAuth = 0
        const { pathname } = window.routerHistory.location
        if (pathname.startsWith('/comm/fund') ||
            pathname.startsWith('/comm/security/main') ||
            pathname.endsWith('/lend') ||
            pathname.endsWith('/repayment') ||
            pathname.startsWith('/common/futures')) {
            window.routerHistory.replace(`/common/login?backUrl=${pathname}`)
        }
    }
    if (res.data && res.data.code === 101701) {
        const { pathname } = window.routerHistory.location
        if (pathname.startsWith('/trade')) {
            window.routerHistory.replace('/tradingcontest')
        }
    }
    // IP 限制
    if (res.data && res.data.code === 86404) {
        Alert86.warning('您所在的国家或地区不在FOTA的服务范围内，FOTA暂未开放服务的国家或地区包括：中国大陆，古巴、伊朗、朝鲜、克里米亚、苏丹、马来西亚、叙利亚、美国[包括所有美国领土，如波多黎各、美属萨摩亚、关岛、北马里亚纳群岛邦、美属维尔京群岛（圣克罗伊岛，圣约翰岛和圣托马斯岛）]、孟加拉国、玻利维亚、厄瓜多尔和吉尔吉斯斯坦。', '非常抱歉')
    }
    if (!res.config.unTs && res.data.code && res.data.code !== 0 && res.data.code !== 401 && res.data.code !== 101701 && res.data.code !== 86404 && res.data.code !== 101700 && res.data.code !== 120031) {
        const { pathname } = window.routerHistory.location
        if (pathname.startsWith('/trade/spot')) {
            const aL = window.t(`errors.${res.data.code}`)
            const aN = aL.charAt(aL.length - 1)
            if (!isNaN(aN)) { // 是数字--未知的错误类型
                message.error(window.t('errors.50000'), 'night')
            } else {
                message.error(window.t(`errors.${res.data.code}`), 'night')
            }
        } else {
            const aL = window.t(`errors.${res.data.code}`)
            const aN = aL.charAt(aL.length - 1)
            if (!isNaN(aN)) { // 是数字--未知的错误类型
                message.error(window.t('errors.50000'))
            } else {
                message.error(window.t(`errors.${res.data.code}`))
            }
        }
    }
    return res.data
}, httpErrorHandler)

// 创建单个请求
function createApi(config) {
    return (data) => {
        if (config.method === 'get') {
            return instance({
                ...config,
                params: {
                    ...data,
                    _t: new Date().getTime()
                    // lang: localStorage.lang
                }
            })
        } else if (config.method === 'post' && config.headerParams) {
            return instance({
                ...config,
                headers: {
                    Authorization: localStorage.auth || '',
                    sessionId: data.headerParams.sessionId,
                    sig: data.headerParams.sig,
                    afsToken: data.headerParams.afsToken,
                    scene: data.headerParams.scene,
                },
                data: {
                    ...data,
                    headerParams: null
                    // lang: localStorage.lang
                }
            })
        }
        return instance({
            ...config,
            headers: {
                Authorization: localStorage.auth || ''
            },
            data: {
                ...data,
                // lang: localStorage.lang
            }
        })
    }
}
const apis = {}

Object.entries(api).forEach((item) => {
    apis[item[0]] = createApi(item[1])
})

export default apis
