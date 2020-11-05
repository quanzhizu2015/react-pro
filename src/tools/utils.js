// 格式化金额，111222333 => 111,222,333
function formateMoney(money, num) {
    if (money === 'null') {
        return null
    }
    const moneyStr = money.toString()
    const totalLength = moneyStr.length
    const digitLength = num ? num + 1 : 3
    let result = ''
    let i = moneyStr.indexOf('.') > -1 ? moneyStr.indexOf('.') : totalLength
    if (moneyStr.indexOf('.') > -1) {
        result += moneyStr.substring(moneyStr.indexOf('.'), moneyStr.indexOf('.') + digitLength)
    } else if (moneyStr.indexOf('.') === -1) {
        if (num === 8 || num === 4 || num === 2 || num === 1) { // num为这些数值时整数不需要加.00
            result += ''
        } else {
            result += '.00'
        }
        // result += '.00'
    }
    while (i >= 0) {
        if (i - 3 > 0) {
            result = `,${moneyStr.substring(i - 3, i)}${result}`
        } else {
            result = `${moneyStr.substring(i - 3, i)}${result}`
        }
        i -= 3
    }
    // console.log(result)
    return result
}

// 校验输入框内容是否符合数字规则
function checkInputNumber(value) {
    const reg = /^([1-9](\d+)?(\.\d{0,2})?$)|(^0$)|(^\d\.\d{0,2})$/
    if (value === '') {
        return true
    }
    return reg.test(value)
}

function checkFixNumber(value, fixed) {
    if (fixed) {
        const vals = value.split('.')
        if (vals.length === 2 && fixed < vals[1].length) {
            return false
        }
    }
    let valTemp = value
    // 先把非数字的都替换掉，除了数字和.
    valTemp = valTemp.replace(/[^\d.]/g, '')
    // 保证只有出现一个.而没有多个.
    valTemp = valTemp.replace(/\.{2,}/g, '.')
    // 必须保证第一个为数字而不是.
    valTemp = valTemp.replace(/^\./g, '')
    if (/^0\d/.test(valTemp)) valTemp = value.substr(1)
    // 保证.只出现一次，而不能出现两次以上
    valTemp = valTemp.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
    return valTemp
}


// 校验输入框内容是否为数字
function isRealNum(val) {
    // isNaN()函数 把空串 空格 以及NUll 按照0来处理 所以先去除
    if (val === '' || val == null) {
        return false
    }
    if (!isNaN(val)) {
        return true
    }
    return false
}
// 清除localstorage信息----行情table内容
function clearStorageData() {
    if (localStorage.collections && localStorage.collections.length > 0) {
        localStorage.collections = []
    }
    if (localStorage.collectTop && localStorage.collectTop.length > 0) {
        localStorage.collectTop = []
    }
    if (localStorage.contractTop && localStorage.contractTop.length > 0) {
        localStorage.contractTop = []
    }
    if (localStorage.usdkTop && localStorage.usdkTop.length > 0) {
        localStorage.usdkTop = []
    }
}

export default {
    formateMoney,
    checkInputNumber,
    checkFixNumber,
    isRealNum,
    clearStorageData,
}
