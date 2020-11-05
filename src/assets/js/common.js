export function getUrl(e) {
    const url = e.search
    const theRequest = {}
    if (url.indexOf('?') !== -1) {
        const str = url.substr(1)
        const strs = str.split('&')
        for (let i = 0; i < strs.length; i += 1) {
            theRequest[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1])
        }
    }
    return theRequest
}

/**
 *
 * 通过当前语言选择123
 * @function chooseLang
 * @param {当前的语言} lang
 * @returns
 */
export function chooseLang(lang) {
    switch (lang) {
    case 'zh': return 1
    case 'en': return 2
    case 'ko': return 3
    default: return 1
    }
}

/**
 * 小数位截取，不足补0
 * @param {要截取的数字} value
 * @param {小数位数} num
 */
/* eslint-disable */
export function foFixed(value, num) {
    // console.log(value)
    let a = value.toString()
    if (a.indexOf('-') >= 0 && String(a).indexOf('e') !== -1) { // 是否有-并且有e，是为科学计数法
        a = `0${String(Number(a) + 1).substr(1)}`
    }
    const b = a.indexOf('.')
    const c = a.length
    let i
    if (num === 0) {
        if (b !== -1) {
            a = a.substring(0, b)
        }
        return a
    }
    // 如果没有小数点
    if (b === -1) {
        a = `${a}.`
        for (i = 1; i <= num; i += 1) {
            a = `${a}0`
        }
    } else {
        // 有小数点，超出位数自动截取，否则补0
        a = a.substring(0, b + num + 1)
        for (i = c; i <= b + num; i += 1) {
            a = `${a}0`
        }
    }
    return a
}
/**
 * 判断特殊的mac
 */
export function isMac() {
    const pla = navigator.platform
    if (pla.includes('Mac')) {
        return true
    }
    return false
}

/**
 * 
 */
export function IsPC() {
  var userAgentInfo = navigator.userAgent;
  var Agents = ["Android", "iPhone",
              "SymbianOS", "Windows Phone",
              "iPad", "iPod"];
  var flag = true;
  for (var v = 0; v < Agents.length; v++) {
      if (userAgentInfo.indexOf(Agents[v]) > 0) {
          flag = false;
          break;
      }
  }
  return flag;
}

/**
 * 判断图片
 */
export function chooseImg(name, nameList, type) {
    if (name && !type) {
        name = name.split('/')[0];
    }
    if (nameList) {
        const imgArr = nameList.filter(item => name === item.name)
        return imgArr[0].logo
    }
    // // const HTTP_HOST = "https://www.funcoin.info/fimages/"
    // // switch (name) {
    // // case 'ETH': return `${HTTP_HOST}20190403/be5473f168104ea9999c9e95a13cc049.png`
    // // case 'ETC': return `${HTTP_HOST}20190403/9129b7cb4711450abe5552bfe3faf087.png`
    // // case 'BTC': return `${HTTP_HOST}20190403/2a404908accd48afb422bb0e0b649cbe.png`
    // // case 'IPT': return `${HTTP_HOST}20190403/b8137b8b27944d4caad72ba1d48c2759.png`
    // // case 'BCH': return `${HTTP_HOST}20190403/dde736e069e2485b8d950d3fc5e93444.png`
    // // case 'LTC': return `${HTTP_HOST}20190403/348bbfcb47d44fde9fcda86e3e6c73b6.png`
    // // case 'OPS': return `${HTTP_HOST}20190403/f570e23eb13547eb8a61b061a94d1408.png`
    // // case 'LEEK': return `${HTTP_HOST}20190403/69368cb80d3549e2b7a44c3fe862d0cc.png`
    // // case 'HGT': return `${HTTP_HOST}20190403/f8871cfbfafb4a0883eed964f448b5c8.png`
    // // case 'HSR': return `${HTTP_HOST}20190403/4082d00274b44212be53082a53a0619c.png`
    // // case 'LMC': return `${HTTP_HOST}20190403/d1b83643e6bf4c48bdb0be617cf383ac.png`
    // // case 'DOGE': return `${HTTP_HOST}20190403/713d4817e1594cf5b5cbca51daa1209f.png`
    // // case 'WDC': return `${HTTP_HOST}20190403/1350f3493c7e48a9983880504ea9c1f4.png`
    // // case 'EAC': return `${HTTP_HOST}20190403/0b3aee713e5848b8aaf6a8332effb076.png`
    // // case 'QRK': return `${HTTP_HOST}20190403/39865ce795fb465eb49bf71397313cd8.jpg`
    // // case 'KPL': return `${HTTP_HOST}20190403/29e9860421d140f39efa8243fa99fe79.png`
    // // case 'FLC': return `${HTTP_HOST}20190403/2a5228e99d5d428ca4890a02b10b3453.png`
    // // case 'IFC': return `${HTTP_HOST}20190403/2aa592e2d67d4ef8963a9ee8a2ff7d3f.png`
    // // case 'QTUM': return `${HTTP_HOST}20190403/8a3483b9e8cb4cb9ade9383d317884a1.png`
    // // case 'XWC': return `${HTTP_HOST}20190403/3b640337e5b747db8e7d5a914e47fe11.png`
    // // case 'OCN': return `${HTTP_HOST}20190403/1033cc0e28204036b137f71f09c85507.png`
    // // case 'BTP': return `${HTTP_HOST}20190403/c07e4a524f804ccb8663c68478c0b8ce.png`
    // // case 'IBC': return `${HTTP_HOST}20190403/7c010edfef804aaa856c755b528e885e.png`
    // // case 'ZMOT': return `${HTTP_HOST}20190403/3ff318863da94b038b034ef5a3adf119.png`
    // // case 'OR': return `${HTTP_HOST}20190403/769ba32e50ef4a828bd71f34bd354385.jpg`
    // // case 'QAC': return `${HTTP_HOST}20190403/910fab325bfb4d1a9fb79326561cb5e3.png`
    // // case 'EOS': return `${HTTP_HOST}20190403/175a1a9a55794811818f522d30c196a5.png`
    // // case 'IOST': return `${HTTP_HOST}20190403/36d2ea45cf3144418a1e867c097893f6.png`
    // // case 'WICC': return `${HTTP_HOST}20190403/911636cbaba64f9698cf059b3f2269aa.png`
    // // case 'OMG': return `${HTTP_HOST}20190403/05e70ff6274a4ae0b3d8f392a1179389.png`
    // // case 'FUN': return `${HTTP_HOST}20190403/16ccf1977f214ad99ebbb4b51432fd63.png`
    // // case 'EBK': return `${HTTP_HOST}20190403/1ad83ef63c8f428883b42e164e4d8e47.jpg`
    // // case 'QSFC': return `${HTTP_HOST}20190403/7847e68a1e264fddbace91a37fa8533b.png`
    // // case 'DSCB': return `${HTTP_HOST}20190403/465197e5ef6d455a99a3959a8fb42c2a.png`
    // // case 'AICN': return `${HTTP_HOST}20190403/63ea5d129ec142918c213863a5a37fca.jpeg`
    // // case 'FUNT': return `${HTTP_HOST}20190403/0bcd3372e5f440b89ddbd4f329f30a41.jpg`
    // // case 'OST': return `${HTTP_HOST}20190403/eac0d7ccd00c4ed4809653e8bfb424dc.png`
    // // case 'ZXC': return `${HTTP_HOST}20190424/4b7d4cf56c8b45afb31b47ba4dfa7599.png`
    // // case 'LAD': return `${HTTP_HOST}2019-05-17/1932f2a562404d508ba374a66a7dc600.png`
    // // case 'PC': return `${HTTP_HOST}20190529/849de5c43b784587ae1d1d14f31fcc10.PNG`
    // // case 'HTP': return `${HTTP_HOST}20190603/9fbdc3dcc6454b34858d80691934a746.jpg`
    // // default: return `${HTTP_HOST}20190402/873a4ecbb51e486392de021bc004a8d3.png`
    // }
}
