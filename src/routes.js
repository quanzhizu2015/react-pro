import loadableHandler from '@/components/loadableHandler'

module.exports = [{
    path: '/home',
    component: loadableHandler(() => import(/* webpackChunkName: "home", webpackPrefetch: true */'./pages/marketSubscribe'))
},
{
    path: '/trade',
    component: loadableHandler(() => import('./pages/black')),
    routes: [
        {
            path: '/trade/spot',
            component: loadableHandler(() => import('./pages/black/USDTtrade'))
        }
    ]
},
{
    path: '/upCoin',
    component: loadableHandler(() => import('./pages/others/upCoin'))
},
{
    path: '/notification',
    component: loadableHandler(() => import('./pages/notification')),
},
{
    path: '/common',
    component: loadableHandler(() => import('./pages/common')),
    routes: [
        {
            path: '/common/login',
            component: loadableHandler(() => import('./pages/common/login'))
        },
        {
            path: '/common/register',
            component: loadableHandler(() => import('./pages/common/register'))
        },
        {
            path: '/common/forgotpassword',
            component: loadableHandler(() => import('./pages/common/forgetPwd'))
        },
        {
            path: '/common/verification',
            component: loadableHandler(() => import('./components/chromeVerify'))
        },
        {
            path: '/common/futures',
            component: loadableHandler(() => import('./pages/common/tradequalification')),
            routes: [{
                path: '/common/futures/answer',
                component: loadableHandler(() => import('./pages/common/tradequalification/answer')),
            }, {
                path: '/common/futures/learn',
                component: loadableHandler(() => import('./pages/common/tradequalification/know')),
            }, {
                path: '/common/futures/activate',
                component: loadableHandler(() => import('./pages/common/tradequalification/open')),
            }, {
                path: '/common/futures/agreement',
                component: loadableHandler(() => import('./pages/common/tradequalification/agreement')),
            }]
        },
    ]
},
{
    path: '/comm',
    component: loadableHandler(() => import('./pages/comm')),
    routes: [{
        path: '/comm/card',
        component: loadableHandler(() => import('./pages/comm/cardPackage')),
        routes: [{
            path: '/comm/card/package',
            component: loadableHandler(() => import('./pages/comm/cardPackage/cards'))
        }, {
            path: '/comm/card/history',
            component: loadableHandler(() => import('./pages/comm/cardPackage/history'))
        }]
    },
    {
        path: '/comm/security',
        component: loadableHandler(() => import('./pages/comm/safe')),
        routes: [{
            path: '/comm/security/main',
            component: loadableHandler(() => import('./pages/comm/safe/main')),
        }, {
            path: '/comm/security/bindMobile',
            component: loadableHandler(() => import('./pages/comm/safe/mobile')),
        }, {
            path: '/comm/security/changeMobile',
            component: loadableHandler(() => import('./pages/comm/safe/changemobile')),
        }, {
            path: '/comm/security/changelogincode',
            component: loadableHandler(() => import('./pages/comm/safe/changelogpass')),
        }, {
            path: '/comm/security/forgetfundpassword',
            component: loadableHandler(() => import('./pages/comm/safe/forgetpass')),
        }, {
            path: '/comm/security/bindEmail',
            component: loadableHandler(() => import('./pages/comm/safe/bindemail')),
        }, {
            path: '/comm/security/bindfundpassword',
            component: loadableHandler(() => import('./pages/comm/safe/bindpass')),
        }, {
            path: '/comm/security/changefundpassword',
            component: loadableHandler(() => import('./pages/comm/safe/changepass')),
        }, {
            path: '/comm/security/bindgoogle',
            component: loadableHandler(() => import('./pages/comm/safe/bindgoogle')),
        }, {
            path: '/comm/security/verification',
            component: loadableHandler(() => import('./pages/comm/safe/person')),
        }, {
            path: '/comm/security/unbindgoogle',
            component: loadableHandler(() => import('./pages/comm/safe/nobindgoogle')),
        }, {
            path: '/comm/security/guide',
            component: loadableHandler(() => import('./pages/comm/safe/userguide')),
        }]
    },
    {
        path: '/comm/fund',
        component: loadableHandler(() => import('./pages/comm/fundManage')),
        routes: [{
            path: '/comm/fund/wallet',
            component: loadableHandler(() => import('./pages/comm/fundManage/wallet'))
        }, {
            path: '/comm/fund/history',
            component: loadableHandler(() => import('./pages/comm/fundManage/record')),
            routes: [{
                path: '/comm/fund/history/wallet',
                component: loadableHandler(() => import('./pages/comm/fundManage/record/myWallet')),
                routes: [{
                    path: '/comm/fund/history/wallet/fundhistory',
                    component: loadableHandler(() => import('./pages/comm/fundManage/record/myWallet/coinRecords')),
                }, {
                    path: '/comm/fund/history/wallet/lockhistory',
                    component: loadableHandler(() => import('./pages/comm/fundManage/record/myWallet/lockRecords')),
                }, {
                    path: '/comm/fund/history/wallet/dividendhistory',
                    component: loadableHandler(() => import('./pages/comm/fundManage/record/myWallet/dividendRecords')),
                }, {
                    path: '/comm/fund/history/wallet/referrhistory',
                    component: loadableHandler(() => import('./pages/comm/fundManage/record/myWallet/referrRecords')),
                }, {
                    path: '/comm/fund/history/wallet/optionhistory',
                    component: loadableHandler(() => import('./pages/comm/fundManage/record/myWallet/optionhistory')),
                }]
            }, {
                path: '/comm/fund/history/futures',
                component: loadableHandler(() => import('./pages/comm/fundManage/record/myAccount')),
                routes: [{
                    path: '/comm/fund/history/futures/orders',
                    component: loadableHandler(() => import('./pages/comm/fundManage/record/myAccount/entrustRecords')),
                },
                {
                    path: '/comm/fund/history/futures/filled',
                    component: loadableHandler(() => import('./pages/comm/fundManage/record/myAccount/makeBargainRecords')),
                }]
            }],
        }]
    },
    {
        path: '/comm/subscribe/list',
        component: loadableHandler(() => import('./pages/comm/subscribe/list')),
    },
    {
        path: '/comm/subscribe/info',
        component: loadableHandler(() => import('./pages/comm/subscribe/info')),
    },
    {
        path: '/comm/subscribe/history',
        component: loadableHandler(() => import('./pages/comm/subscribe/history')),
    },
    {
        path: '/comm/subscribe/invite',
        component: loadableHandler(() => import('./pages/comm/subscribe/invite')),
    },
    {
        path: '/comm/c2c',
        component: loadableHandler(() => import('./pages/comm/c2c/main.js')),
        routes: [{
            path: '/comm/c2c/ad',
            component: loadableHandler(() => import('./pages/comm/c2c/ad')),
        },
        {
            path: '/comm/c2c/history',
            component: loadableHandler(() => import('./pages/comm/c2c/history')),
        }]
    },
    {
        path: '/comm/c2cInfo',
        component: loadableHandler(() => import('./pages/comm/c2c/payInfo')),
    },
    {
        path: '/comm/api',
        component: loadableHandler(() => import('./pages/comm/apiView')),
    },
    {
        path: '/comm/fee',
        component: loadableHandler(() => import('./pages/comm/fee')),
    }
    ]
},
{
    path: '/error',
    component: loadableHandler(() => import('./pages/error'))
}]
