import base64 from 'crypto-js/enc-base64'
import sha256 from 'crypto-js/sha256'
import sha1 from 'crypto-js/sha1'

export function udeskSecurity(account) {
    const timep = new Date()
    // 时间戳
    const timestamp = timep.getTime()
    // 随机数
    const nonce = ~~(Math.random() * 10000000000) // eslint-disable-line
    // udesk-im-key key获取位置【Udesk管理中心-即时通讯-网页插件-管理/添加客户信息中的KEY】
    const key = '160a04353ee3ee437292dc31380c3a5d'
    let signStr = `nonce=${nonce}&timestamp=${timestamp}&web_token=${account}&${key}`
    // 进行加密操作：http://www.udesk.cn/doc/thirdparty/webim/#-_4
    signStr = sha1(signStr)
    signStr = signStr.toString()
    signStr = signStr.toUpperCase()
    return {
        signStr,
        timestamp,
        nonce
    }
}

export default function security(salt, e) {
    let saltNew
    if (salt === 0) {
        saltNew = 'abc'
    } else {
        saltNew = '123'
    }
    const secretpwd = sha256(`${saltNew}${e}`)
    const securityString = base64.stringify(secretpwd)
    return securityString
}
