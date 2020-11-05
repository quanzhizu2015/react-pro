// 配置简化转换
function conversion(url, method, config) {
    return {
        url,
        method,
        ...config,
    }
}

// ajax通用配置
export default {
    news: conversion(`/news${process.config.suffix}`, 'get'),
    // 获取底部友情链接
    getLinkList: conversion('link/list', 'get'),
    // web端获取某个区域下的活动（孙武子）
    getActiveList: conversion('site/content/activites', 'get'),
    // ---未注册状态或者修改手机号状态下
    // 账户 / 设置用户昵称
    putUserName: conversion('account/user/nickname', 'post'),
    // 账户 / 根据手机号发送验证码
    sendphonecode: conversion('account/code/phone', 'post'),
    // 账户 / 根据邮箱发送邮件
    sendEmailcode: conversion('account/code/email', 'post'),
    // ----注册后
    // 账户 / 获取用户认证信息
    getUserAuth: conversion('account/user/info/auth', 'get', { unTs: true }),
    // 账户 / 获取用户认证信息
    getKYCAuth: conversion('account/auth/kyc', 'get', { unTs: true }),
    // 账户 / 获取用户认证信息
    setIdentify: conversion('account/auth/reset ', 'post'),
    // 账户 / 开启或关闭谷歌验证
    usergoogleLogin: conversion('account/google/verification/login/access/switch', 'post'),
    // 账户 / 获取用户基本信息
    getUserBaseInfo: conversion('account/user/info/basic', 'get'),
    // 账户 / 资金密码忘记
    sendfundPwd: conversion('account/fundPwd/forget', 'PUT'),
    // 账户 / 修改资金密码
    revisefundPwd: conversion('account/fundPwd', 'PUT'),
    // 账户 / 资金密码绑定
    bindfundPwd: conversion('account/fundPwd', 'post'),
    // 账户 / 绑定谷歌验证
    bindgoogleauth: conversion('account/googleauth', 'post'),
    // 账户 / 绑定邮箱
    bindemail: conversion('account/email', 'post'),
    // 账户 / 登陆密码修改
    revisepwd: conversion('account/user/login/pwd', 'post'),
    // 账户 / 重置登陆密码
    resetpwd: conversion('account/user/login/pwd', 'put'),
    // 账户 / 忘记登陆密码-获取图片验证码
    getpicture: conversion('account/captcha/picture', 'get'),
    // 账户 / 忘记登陆密码-校验图片验证码
    checkverify: conversion('account/captcha/verify', 'post'),
    // 账户 / 重置密码，发送账号验证码
    getupdatepwd: conversion('/account/code/updatePwd', 'get'),
    // 账户 / 身份认证图片上传
    upload: conversion('auth/idcard/picture', 'post'),
    // 账户 / 开通合约交易
    opencontract: conversion('account/contract-opening', 'post'),
    // 账户 / 身份认证提交审核
    authUserIdentity: conversion('account/auth/idcard', 'post'),
    // 账户 / 创建用户
    regist: conversion('account/user/register', 'post', { headerParams: true }),
    // 账户 / 登录
    login: conversion('account/user/login', 'post'),
    // 账户 / 谷歌登录验证
    googleCheck: conversion('account/user/googleCheck', 'get'),
    // 账户 / 退出
    logout: conversion('account/user/logout', 'post'),
    //  账户 / 发送短信或邮箱验证码
    sendCode: conversion('account/verification/code', 'post'),
    // 账户 / 判断用户是否存在
    checkUser: conversion('account/user/checkUser', 'get'),

    // 安全设置 / 修改登陆密码
    changeloPass: conversion('account/user/login/pwd', 'post'),
    // 安全设置 / 绑定邮箱
    bindEmail: conversion('account/email', 'post'),
    // 安全设置 / 绑定谷歌验证
    bindgoogle: conversion('account/google/verification', 'post'),
    // 安全设置 / 解除谷歌验证
    nobindgoogle: conversion('account/google/verification', 'delete'),
    // 安全设置 / 获取谷歌验证二维码
    googlercode: conversion('account/google/verification/secretkey', 'get'),
    // 安全设置 / 绑定资金密码
    bindfundpass: conversion('account/fundPwd', 'post'),
    // 安全设置 / 修改资金密码
    changefundpass: conversion('account/fundPwd', 'put'),
    // 安全设置 / 忘记资金密码
    forgetfundpass: conversion('account/fundPwd/forget', 'put'),
    // 安全设置 / 设置手机号/修改手机号
    mobile: conversion('account/user/phone', 'post'),

    // 资金 / 钱包账户信息
    queryWallet: conversion('asset/capital', 'get'),
    // 资金 / 获取资金划转记录
    queryTransferRecord: conversion('asset/transfer/record/asset', 'get'),
    // 资金 / 获取合约账户信息
    queryContract: conversion('asset/contract', 'get'),
    // 资金 / 资金划转接口
    transferMoney: conversion('asset/transfer', 'post'),
    // 资金 / 获取充提币记录
    queryCoinRecord: conversion('asset/transfer/record/coin', 'get'),
    // 资金 / 获取冲币地址
    getAddress: conversion('asset/deposit/address', 'get'),
    // 资金 / 获取币种列表
    queryCoinTypes: conversion('asset/coin/list', 'get'),
    // 资金 / 提币
    withdraw: conversion('asset/withdraw', 'post'),
    // 资金 / 提现配置
    getConfig: conversion('config', 'get'),
    // 资金 / 获取最近提币纪录
    recentWithdraw: conversion('asset/withdraw/address', 'get'),
    // 资金 / 撤销提币
    calbackCoin: conversion('asset/withdraw/cancel', 'get'),
    // 行情 / 获取27个数据跑马灯
    getHorseLamp: conversion('market/horselamp', 'get'),
    // 行情 / 未登录下卡片查询
    offlineCard: conversion('market/offline/card', 'get', { unTs: true }),

    // 所有交易对
    tradePairs: conversion('/trade/pair/all', 'get'),
    // 行情 / 登录状态卡片查询
    inlineCard: conversion('market/card', 'get'),
    // 行情 / 登录状态添加卡片
    addCard: conversion('market/card', 'post'),
    // 行情 / 登录状态删除卡片
    delCard: conversion('market/card', 'delete'),
    // 行情 / 登录状态卡片查询
    getAllContractUsdk: conversion('market/contract-usdk', 'get'),

    // 交易 / 校验密码时效
    verifyPassword: conversion('user/verify/trade/password', 'get', { unTs: true }),
    // 交易 /  资金密码校验
    verifyPwd: conversion('user/verify/trade/password', 'post'),
    // 交易 / 【合约交易】左上角合约下拉列表 第一次请求用的！只有当前合约信息，为了数据快速渲染
    contractListFirst: conversion('contract/list/first', 'get'),
    // 交易 / 【合约交易】左上角合约下拉列表
    contractList: conversion('contract/list', 'get'),
    // 交易 / 【合约交易】左上下拉右边：资金信息
    fundInfo: conversion('contract/account', 'get'),
    // 交易 / 【合约交易/【USDK交易】右上成交列表
    dealList: conversion('matched/order/info', 'get'),
    // 交易 / 【合约交易】深度列表
    deepList: conversion('entrust/depth', 'get'),
    // 交易（行情） / 【合约交易】交易页面跑马灯下方标的物合约价格、现货指数、持仓量等信息
    oneDayInfo: conversion('market/contract', 'get'),
    // 交易 / 【合约交易】委托列表 资金管理=>合约账户=>委托
    tradeEntrus: conversion('contract/entrust/list', 'get'),
    // 交易 / 【合约交易】查看合约持仓列表
    tradePosition: conversion('contract/position', 'get'),
    // 交易 / 【合约交易】合约成交列表
    tradeMatched: conversion('contract/matched', 'get'),
    // 交易 / 【合约交易】合约历史列表
    tradeHistory: conversion('contract/history', 'get'),
    // 交易 / 【合约交易】计算保证金
    calculateMargin: conversion('contract/preciseMargin', 'post'),
    // 交易 / 【合约交易】委托提交
    tradeSubmit: conversion('/contract/order', 'post'),
    // 交易 / 【合约交易】平仓撤销反向单
    tradeOrigin: conversion('/contract/order/cancelReverse', 'post'),
    // 交易 / 【合约交易】取消订单
    tradeCancle: conversion('contract/order', 'delete'),
    // 交易 / 【合约交易】撤销全部委托
    tradeCancelAll: conversion('contract/order/cancel-all', 'delete'),

    // 交易 / 【USDK交易】左上角USDK下拉列表 第一次请求用的！只有当前币种信息，为了数据快速渲染
    USDKListFirst: conversion('usdk/list/first', 'get'),
    // 交易 / 【USDK交易】左上角USDK下拉列表
    USDKList: conversion('usdk/list', 'get'),
    // 交易 / 【USDK交易】左上下拉右边：资金信息
    USDKFundInfo: conversion('usdk/account', 'get'),
    // 交易（行情） / 【USDK交易】交易页面跑马灯下方标的物合约价格、现货指数、持仓量等信息
    USDKDayInfo: conversion('market/usdk', 'get'),
    // 交易 / 【USDK交易】委托列表查询
    USDTtradeOrderlist: conversion('usdk/orderlist', 'get'),
    // 交易 / 【USDK交易】委托提交
    USDKSubmit: conversion('/usdk/order', 'post'),
    // 交易 / 【USDK交易】取消订单
    USDTtradeCancle: conversion('usdk/order', 'delete'),
    // 交易 / 【USDK交易】撤销全部委托
    USDTtradeCancleAll: conversion('usdk/order/cancel-all', 'delete'),
    // 交易 / 获取杠杆设置
    getLeval: conversion('/contract/lever', 'get'),
    // 交易 / 调整杠杆接口
    setLeval: conversion('/contract/lever', 'post'),
    // 交易 / 【usdk】个人资产
    USDTtradeasset: conversion('usdk/asset/info', 'get'),
    // 交易 / 【交易】货币汇率
    getExchangeRate: conversion('/usdk/asset/exchangeRate', 'get'),
    // 交易 /  获取usdk可购买额度
    USDKAvailable: conversion('/usdk/available', 'get'),
    // 交易 /  获取合约可购买额度
    contractAvailable: conversion('/contract/available', 'get'),
    // 行情 / 24小时行情
    queryAllQuotations: conversion('market/quotations', 'get'),
    // 行情 / 24小时行情置顶
    pickTop: conversion('market/promotion', 'post'),
    // 行情 / 24小时行情收藏
    collection: conversion('market/collection', 'post'),
    // 行情 / 24小时行情取消收藏，与collection的传输类型不同
    collectionDel: conversion('market/collection', 'delete'),
    // 行情 / 24小时行情，获取是否存在自选数据
    getDefaultTab: conversion('market/quotations/collection', 'get'),

    // 分红 / 分红页相关展示数据
    getBonusData: conversion('/loan/rightAntProfit', 'get'),
    // 分红 / 分红页面抬头
    getBonusHead: conversion('/loan/headOfProfit', 'get'),
    // 分红 / 分红页锁仓fota
    lockFota: conversion('/loan/lock', 'post'),
    // 分红 / 分红页解锁fota
    unlockFota: conversion('/loan/unlock', 'post'),
    // 分红 / 获取解锁中fota列表记录
    getUnlockingList: conversion('/loan/getUnlockedRecord', 'get'),
    // 分红 / 取消解锁按钮
    cancelUnlocking: conversion('/loan/cancelUnlock', 'post'),
    // 借贷&锁仓 / 【借贷】放贷
    sendLending: conversion('loan/lend', 'post'),
    // 借贷&锁仓 / 【借贷】放贷页面获取用户放贷信息
    getLending: conversion('loan/lend', 'get'),
    // 借贷&锁仓 / 【借贷】借贷总信息
    getLendInfo: conversion('/loan/info', 'get'),
    // 借贷&锁仓 / 【借贷】终止放贷合约
    stopLending: conversion('loan/lend/cancel', 'get'),
    // 借贷&锁仓 / 【借贷】获取房贷纪录
    getLendRecord: conversion('/loan/lend/record', 'get'),
    // 借贷&锁仓 / 【借贷】利息收益
    getInterest: conversion('loan/lend/interest', 'get'),
    // 还款计划列表
    replayList: conversion('/loan/mortgage/orderlist', 'get'),
    // 设置自动还款
    setAutoPay: conversion('/loan/autopay', 'post'),
    // 还款
    loanPay: conversion('/loan/pay', 'post'),
    // 增加抵押物
    loanAppend: conversion('/loan/mortgage/append', 'post'),

    // 借贷&锁仓 / 【借贷】获取所有人的放贷列表
    getOrderList: conversion('/loan/lend/orderlist', 'get'),
    // 借贷&锁仓 / 【借贷】我要借款中我的借款的信息
    getPayInfo: conversion('/loan/pay/info', 'get'),
    // 借贷&锁仓&资金 / 【资金】分页获取分红记录@王冕
    getDividendRecords: conversion('/loan/getProfitRecord', 'get'),
    // 借贷&锁仓 / 【借贷】借款记录
    getBorrowRecords: conversion('/loan/mortgage/record', 'get'),
    // 借贷&锁仓 / 【借贷】分页获取锁仓和解锁记录@王冕
    getLockedRecords: conversion('/loan/getLockRecord', 'get'),
    // 借贷&锁仓 / 【借贷】我要借款
    postBorrowMoney: conversion('/loan/mortgage', 'post'),

    // 一分钟期权 / 查询交易记录(分页)
    optionRecords: conversion('/option/order/page', 'get'),
    // 一分钟期权 / 下载csv文件
    exportRecords: conversion('/option/order/export', 'get'),

    // 帮助中心 - 平台公告 site/content/text
    platNotice: conversion('/site/content/text', 'get'),

    // 行情 / 获取后台配置图片
    getContentPic: conversion('/site/content/picture', 'get'),
    // 行情 / 获取公告内容
    getContentText: conversion('/site/content/text', 'get'),

    // 通知中心 / 获取消息列表
    getNoticeList: conversion('/notify/msg/list', 'get'),

    // 账户 / 初始化签名认证算法(孟德)
    getSHA1Sign: conversion('account/code/sha1/create', 'get'),
    // 模拟交易大赛开关
    switch: conversion('/contest/config', 'get'),
    // 模拟交易大赛 / 获取个人信息
    moniTradePerson: conversion('/contest/personalInfo', 'get'),

    // 模拟交易大赛 / 获取排行榜单
    moniTradeList: conversion('/contest/leaderBoard', 'get'),

    // 模拟交易大赛 / 获取当前期数
    moniTradeNow: conversion('/contest/currentPeriod', 'get'),

    // 模拟交易获取邀请记录
    getinviteRecord: conversion('/contest/inviteRecord', 'get'),
    // 模拟交易获取邀请码
    getInviteCode: conversion('/activity/invite/code', 'get'),
    // 邀请码
    // 邀请返佣邀请设置
    getInviteConfig: conversion('/activity/invite/config', 'get'),
    // 邀请排行榜前3
    getInviteTop: conversion('/activity/invite/top', 'get'),
    // 我的邀请统计
    getInviteStatistics: conversion('/activity/invite/info', 'get'),
    // 邀请记录
    getInviteList: conversion('/activity/invite/list', 'get'),
    // 返佣记录
    getReferrList: conversion('/activity/invite/rebate', 'get'),
    // 获取邀请码
    getCode: conversion('/activity/invite/code', 'get'),
    // 交易区base
    marketBase: conversion('/trade/pair/base', 'get'),
    // 提交上币申请表单
    postFormData: conversion('/apply/add', 'post'),
    // 查询C2C币种
    getC2CCurrency: conversion('/c2c/asset/list', 'get'),
    // 查询C2C列表
    getC2CList: conversion('/c2c/ad/list', 'get'),
    // 查询C2C订单信息
    getC2CAdInfo: conversion('/c2c/order/advanced', 'get'),
    // 订单下单
    placeOrder: conversion('/c2c/order/place', 'post'),
    // c2c 订单列表
    getC2COrderList: conversion('/c2c/order/list', 'get'),
    // c2c 订单列表撤销
    cancelC2COrderList: conversion('/c2c/order/cancel', 'post'),
    // 支付
    getC2CPayInfo: conversion('/user/pay/personal', 'get'),
    // 获取个人收款信息
    getPerSonPayInfo: conversion('/user/pay/personal', 'get'),
    // 卖出添加支付手段图片上传
    getSellImg: conversion('/files/upload', 'post'),
    // 绑定用户信息:
    bindUserInfo: conversion('/user/pay/bind', 'post'),
    // 查询用户信息:
    getOrderInfo: conversion('/c2c/order/info', 'get'),
    // 查看个人的收款信息,
    LookPersonSellInfo: conversion('/user/pay/personal', 'get'),
    // 已付款
    finishedPay: conversion('/c2c/order/pay', 'post'),
    // 已确认
    finishedSell: conversion('/c2c/order/confirm/ask', 'post'),
    // api创建key
    createKey: conversion('/api_key/create', 'post'),
    // api获取key
    getKey: conversion('/api_key/keys', 'post'),
    // api删除key
    delKey: conversion('/api_key/delete', 'post'),
    // api信息key
    infoKey: conversion('/api_key/info', 'post'),
    // api信息key
    assetsLogo: conversion('/asset/logos', 'get'),
    // 获取费率信息
    getFeeInfo: conversion('/asset/coin/list/fee', 'get'),
    // 获取认购列表
    getAdvertisingListFetch: conversion('/domains/advertising', 'get'),
    // 获取今日认购列表
    getAdvertisingTodayListFetch: conversion('/domains/advertising/today', 'get'),
    // 获取认购详情
    getAdvertisingInfoFetch: conversion('/domains/details', 'get'),
    // 发起认购
    sendAdvertisingFetch: conversion('/domains/subscribe', 'post', { headerParams: true }),
    // 获取认购历史
    getAdvertisingHistoryFetch: conversion('/domains/subscribe/records', 'get'),
    // goodtoken锁仓
    getLockedList: conversion('/account/user/list/locked?', 'get'),
    // 获取faceId-token
    getFaceIdToken: conversion('/face/token', 'post'),
    // 卡券列表
    getCardsList: conversion('/coupon/list', 'get'),
    // 未使用的卡券
    getCardsUnUsed: conversion('/coupon/untapped', 'get'),
    // 卡券使用
    getCardsUsedList: conversion('/coupon/used/records', 'get'),
    // 获取自己的DTO申请列表
    getApplyList: conversion('/apply/list', 'get')
}
