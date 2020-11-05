# Version

> v1.0.1

# react-web

> react, webpack构建

## 项目结构 ##

```
.
├── mock  ----------------------------- 本地mock配置文件
├── abc.json  ------------------------- 项目构建配置文件
├── package.json  --------------------- 项目配置
├── README.md  ------------------------ 说明文件
├── build  ---------------------------- 构建代码文件
├── config  --------------------------- 构建配置文件
├── index.html  ----------------------- 入口页面
└── src  ------------------------------ 源码目录
    ├── assets  ----------------------- 项目资源文件目录（图片、字体等）
    ├── components  ------------------- 业务模块集合目录（组件）
    ├── fetch  ------------------------ ajax请求管理文件
    ├──   └── api  -------------------- 请求配置 (axios ajax配置管理文件)
    ├── pages  ------------------------ 页面集合目录
    ├── reducers  --------------------- redux文件目录
    ├── App.js  ----------------------- react公共配置文件
    └── main.js  ---------------------- 项目级入口配置文件
```

## 环境准备

``` bash
# 安装依赖
npm install || yarn install

# 启动本地调试 localhost:8080
npm run dev || yarn dev

# 本地打包压缩
npm run build || yarn build

# 生成page文件
npm run init page `name` # 配置发生改变暂不可用

# 生成component文件
npm run init component `name` # 配置发生改变暂不可用
```
## 反代理配置

本地代码想要访问测试环境接口可以通过以下配置
`/config/index.js` 
``` bash
dev: {
  proxyTable: {
    '/api': {
      target: 'http://jsonplaceholder.typicode.com/',
      changeOrigin: true,
      pathRewrite: {'^/api': ''}
    }
  }
}
```

## 本地ajax mock 配置

可以直接返回一段json例如
`/mock/users/user.json` 

``` bash
{
  "code|1": [0, 0, 0, 0, 1],
  "data": {
    "list|10": [
      {
        "id|+1": 1,
        "name": "@name",
        "age|20-30": 1,
        "email": "@email",
        "date": "@date"
      }
    ]
  }
}
```

也可以写业务代码自定义返回参数
`/mock/users/user.js` 

``` bash
module.exports = function (req) {
  const uid = req.query.uid;

  if (!uid) {
    return {
      code: -1,
      msg: 'no uid',
    }
  }

  return {
    code: 0,
    data: {
      "uid": +uid,
      "name": "@name",
      "age|20-30": 1,
      "email": "@email",
      "date": "@date",
    },
  };
};
```

引入以上配置在`config/mock.js`文件中添加配置
``` bash
module.exports = {
    'GET::/api/1.json': 'mock::/users/list.json',
    'GET::/test/2.json': 'mock::/users/user.js',
}
```
注：数据mock优先级低于反代理配置同父级，目录会被覆盖

## 引入新的页面

页面统一在`/src/pages`目录中添加<br/>
同事当项目无限大的时候通过router一次性加载全部的页面需要用户非常大耐心<br />
所有我们在代码中统一使用router按需加载配置，在`routes.js`添加page使用如下方式
``` bash
{
    path: '/',
    component: loadableHandler(() => import('./pages/home'))
}
```
命令生成page，routes会自动加入该配置

## 自定义模块组件

页面和组件分开目录编写有益于代码维护，自定义组件或业务公共模块统一在`/src/components/`目录开发结构可与pages相同

## 开发所需技术

* typescript      javascript的超集，扩展javascript的语法
* react           主要架构
* redux           状态管理工具
* react-i18next   国际化插件
* react-router    react路由插件
* axios           ajax异步请求插件   
* css-modules     css模块工具适合react样式开发
* sass            css预处理结合css-modules

## react-i18next国际化

项目已添加国际支持 <br/>
详细情况 https://github.com/i18next/react-i18next

``` bash

@button-primary-bg-color: #ea2f2f;
@button-primary-active-bg-color: #da2f2f;

```

## formInput组件

添加安全设置input组件<br/>
引入:`import SafeInput from '@/components/safeInput'`<br/>
使用:`<SafeInput onChange={} onBlur={} onFocus={} type="0" btnState lable="谷歌验证码" placeholder="请输入谷歌验证码" />`<br/>
注解:(1)onChange是获取value值得地方,使用e.target.value获取<br/>
    (2)type值为0或者不传是为普通的text输入框;type值为1时为password输入框<br/>
    (3)btnState为发送验证码按钮<br/>
    (4)lable为前置内容<br/>
    (5)placerholder为默认内容<br/>

## notifyPop组件
添加弹框组件<br/>
引入:`import NotifyPop from '../../../components/notifyPop'`<br/>
使用:`<NotifyPop type="primary" visable={this.state.visable} width="400" height="250" contant="<div>123</div>" confirm={} cancel={} />`<br/>
注解:(1)visable是开关弹框得位置,true为打开,false为关闭<br/>
    (2)width和height控制宽高,不传默认400*250<br/>
    (3)contant为传入的内容(需要带html标签)<br/>
    (4)type是弹框类型，type为primary的时候是痰喘的提示类型，按钮居中，右上角带有取消叉号；type不传的时候右上角叉号没有，按钮居右
    (4)confirm和cancel是点击确定和取消发生的函数,如果不穿,按钮消失<br/>

## moneyTable组件
资金模块table组件<br/>
引入:`import MoneyTable from '@/components/moneyTable'`<br/>
使用:`<MoneyTable model="primary" dataShow={this.state.divShow} dataSource={this.state.dataList} dataHeader={this.state.dataHeader} InCoin={this.Incoin} OutCoin={this.Outcoin} GetBack={this.Getback} GetInfo={this.Getinfo />`<br/>
注解:(1)model是 表格的类型，primary的时候是带button的模式,theme为不带button模式<br/>
    (2)dataShow为下面要渲染的内容(model为primary时可见)
    (2)dataSource为表格内的数据，可以使从后台借口返回的内容<br/>
    (3)dataHeader为表头的内容，`dataHeader: [{name: '币种',key: 'assetName',width: '5%',}]`name为名称；key为dataSource内的字段名称，width为当前列宽度。(需要注意的是，当type为primary的时候width相加需要为85%，theme时则是100%) <br/>
    (4)InCoin(充币按钮)OutCoin(提币按钮)GetBack(撤销按钮)GetInfo(详情按钮)；不穿的话，按钮不出现，每个按钮点击会返回两个参数，当前列的所有数据，以及点击的类别

## progressBar组件

进度条组件<br/>
引入:`import ProgressBar from '../../../components/progressBar'`<br/>
使用:`<ProgressBar step={} words={[]}" />`<br/>
注解:(1)step为当前步骤为第几步<br/>
    (2)words传一个数组，形式如[{word:'输入账号', icon: 'point'},{...},...]<br/>
    (3)数组有两个参数，其中word为步骤条显示的文字，icon为文字前面的图案是否为圆点还是对勾<br/>