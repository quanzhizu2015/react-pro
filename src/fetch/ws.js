function createWebSocket(url) {
    const wsProtocol = window.location.protocol === 'http:' ? 'ws' : 'wss'
    return () => {
        // const ws = new WebSocket(`${wsProtocol}://${window.location.host}/api/${url}`)
        // const ws = new WebSocket(`wss://${window.location.host}/api/${url}`)
        // const ws = new WebSocket(`wss://fota.com/api/${url}`)
        // const ws = new BrowserWebSocket(`wss://fota.com/api/${url}`)
        // const ws = `${wsProtocol}://${window.location.host}/api/${url}`
        const BrowserWebSocket = window.WebSocket || window.MozWebSocket
        const ws = new BrowserWebSocket(`${wsProtocol}://${window.location.host}/api/${url}`)
        // const ws = new BrowserWebSocket(`${wsProtocol}://192.168.124.3:8092/api/${url}`)
        // const ws = new BrowserWebSocket(`${wsProtocol}://172.16.50.201:8088/api/${url}`)
        // const ws = new BrowserWebSocket(`${wsProtocol}://116.62.199.156:9089/api/${url}`)
        // const ws = new BrowserWebSocket(`${wsProtocol}://localhost:8092/api/${url}`)
        // const ws = new BrowserWebSocket(`${wsProtocol}://172.20.10.4:8092/api/${url}`)
        return ws
    }
}

export default {
    createWs: createWebSocket('websocket')
}
