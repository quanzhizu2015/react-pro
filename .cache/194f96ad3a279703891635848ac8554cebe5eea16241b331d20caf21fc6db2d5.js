{"source":"(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{1166:function(e,t,a){\"use strict\";Object.defineProperty(t,\"__esModule\",{value:!0}),t.default=void 0;var n=r(a(37)),l=r(a(33)),i=r(a(36)),u=r(a(35)),s=r(a(34)),o=r(a(2));function r(e){return e&&e.__esModule?e:{default:e}}a(1176);var c=function(e){function a(e){(0,l.default)(this,a);var t=(0,u.default)(this,(a.__proto__||(0,n.default)(a)).call(this,e));return t.state={activeStep:e.step},t}return(0,s.default)(a,e),(0,i.default)(a,[{key:\"componentWillReceiveProps\",value:function(e){this.setState({activeStep:e.step})}},{key:\"render\",value:function(){var l=this;return o.default.createElement(\"div\",{id:\"proBar\"},o.default.createElement(\"ul\",null,this.props.words.map(function(e,t){var a=null,n=null;return n=\"point\"===e.icon?o.default.createElement(\"div\",{className:\"point\"}):o.default.createElement(\"div\",{className:\"true\"}),a=t!==l.props.words.length-1?o.default.createElement(\"div\",{className:\"dashed\"}):null,o.default.createElement(\"li\",{className:l.state.activeStep===t+1?\"activeStep\":null,key:t},n,o.default.createElement(\"span\",null,e.word),a)})))}}]),a}(o.default.Component);t.default=c},1176:function(e,t,a){},1447:function(e,t,a){},1452:function(e,t,a){},1453:function(e,t,a){},1454:function(e,t,a){},795:function(e,a,n){\"use strict\";Object.defineProperty(a,\"__esModule\",{value:!0});var l,u=v(n(256)),s=v(n(255)),o=v(n(37)),r=v(n(33)),i=v(n(36)),c=v(n(35)),d=v(n(34)),f=n(2),m=v(f),p=n(64),h=n(94),E=n(143),g=v(n(906)),y=v(n(145));function v(e){return e&&e.__esModule?e:{default:e}}n(1447);var b=(0,p.connect)(function(e){return{test:e.test,testAction:e.testAction,apis:e.apis,lan:e.lang,userAuth:e.userAuth,getUserAuth:e.getUserAuth}})(l=function(e){function n(){var l=this;(0,r.default)(this,n);var a,i=(0,c.default)(this,(n.__proto__||(0,o.default)(n)).call(this));return i.getGoogleValue=function(e){i.setState({googleCode:e.target.value});6===e.target.value.length&&/^[0-9]*$/.test(e.target.value)?i.setState({BtnDisable:!0}):i.setState({BtnDisable:!1})},i.changeSlide=function(){!1===i.props.userAuth.isGoogleAuth?y.default.error(i.t(\"safe.bindGoogleFirst\")):i.setState({visable:!0})},i.exChangeNickName=function(){i.setState({showNickChange:!0}),setTimeout(function(){i.input.focus()},0)},i.blurCommit=(a=(0,s.default)(u.default.mark(function e(a){var n;return u.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(!a||12<a.length||a.length<2)return y.default.warning(t(\"safe.pleaseSetNickName\")),e.abrupt(\"return\",!1);e.next=3;break;case 3:return n={nickname:a},e.next=6,i.props.apis.putUserName(n);case 6:return 0===e.sent.code&&y.default.success(t(\"safe.setSuccess\")),i.props.dispatch(i.props.getUserAuth()),i.setState({showNickChange:!1}),e.abrupt(\"return\",!0);case 11:case\"end\":return e.stop()}},e,l)})),function(e){return a.apply(this,arguments)}),i.state={slideState:\"safeSlideClose\",visable:!1,googleCode:\"\",googleYanz:\"\",BtnDisable:!1,showNickChange:!1,nickValue:\"\"},i.changeSlide=i.changeSlide.bind(i),i.queding=i.queding.bind(i),i.quxiao=i.quxiao.bind(i),i.GetUserAuth=i.GetUserAuth.bind(i),i.getGoogleValue=i.getGoogleValue.bind(i),i.googleYanZ=i.googleYanZ.bind(i),i}var a;return(0,d.default)(n,e),(0,i.default)(n,[{key:\"componentWillMount\",value:function(){this.GetUserAuth()}},{key:\"componentDidMount\",value:function(){this.setState({nickValue:this.props.userAuth.nickname})}},{key:\"componentWillReceiveProps\",value:function(e){this.props.userAuth!==e.userAuth&&this.GetUserAuth(e.userAuth.isGoogleLogin),e.userAuth&&this.setState({nickValue:e.userAuth.nickname})}},{key:\"setmobile\",value:function(){this.props.history.push(\"/comm/security/bindMobile\")}},{key:\"GetUserAuth\",value:function(e){if(null!=e)!1===e?this.setState({slideState:\"safeSlideClose\"}):this.setState({slideState:\"safeSlideOpen\"});else if(this.props.userAuth){!1===this.props.userAuth.isGoogleLogin?this.setState({slideState:\"safeSlideClose\"}):this.setState({slideState:\"safeSlideOpen\"})}}},{key:\"changemobile\",value:function(){!0===this.props.userAuth.isGoogleAuth?this.props.history.push(\"/comm/security/changeMobile\"):y.default.error(this.t(\"safe.bindGoogleFirst\"))}},{key:\"googleYanZ\",value:(a=(0,s.default)(u.default.mark(function e(){var t;return u.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,this.props.apis.usergoogleLogin({googleCode:this.state.googleCode});case 3:0===(t=e.sent).code?(this.setState({visable:!1,googleCode:\"\",BtnDisable:!1}),this.props.dispatch(this.props.getUserAuth()),this.GetUserAuth(),y.default.success(this.t(\"safe.googleSucces\"))):this.setState({googleYanz:this.t(\"errors.\"+t.code)}),e.next=11;break;case 7:e.prev=7,e.t0=e.catch(0),y.default.error(e.t0.message),this.setState({googleYanz:e.t0.message});case 11:case\"end\":return e.stop()}},e,this,[[0,7]])})),function(){return a.apply(this,arguments)})},{key:\"queding\",value:function(){\"\"===this.state.googleCode?this.setState({googleYanz:this.t(\"safe.googleNull\")}):this.googleYanZ()}},{key:\"quxiao\",value:function(){this.setState({visable:!1,googleCode:\"\",googleYanz:\"\"})}},{key:\"changelopass\",value:function(){!0===this.props.userAuth.isGoogleAuth?this.props.history.push(\"/comm/security/changelogincode\"):!0===this.props.userAuth.isPhoneAuth?this.props.history.push(\"/comm/security/changelogincode\"):!0===this.props.userAuth.isEmailAuth?this.props.history.push(\"/comm/security/changelogincode\"):y.default.error(this.t(\"safe.bindMandE\"))}},{key:\"bindgoogle\",value:function(){!0===this.props.userAuth.isPhoneAuth?this.props.history.push(\"/comm/security/bindgoogle\"):!0===this.props.userAuth.isEmailAuth?this.props.history.push(\"/comm/security/bindgoogle\"):y.default.error(this.t(\"safe.bindMandE\"))}},{key:\"nobindgoogle\",value:function(){!0===this.props.userAuth.isPhoneAuth?this.props.history.push(\"/comm/security/unbindgoogle\"):!0===this.props.userAuth.isEmailAuth?this.props.history.push(\"/comm/security/unbindgoogle\"):y.default.error(this.t(\"safe.bindMandE\"))}},{key:\"forgetpass\",value:function(){!0===this.props.userAuth.isPhoneAuth?this.props.history.push(\"/comm/security/forgetfundpassword\"):!0===this.props.userAuth.isEmailAuth?this.props.history.push(\"/comm/security/forgetfundpassword\"):y.default.error(this.t(\"safe.bindMandE\"))}},{key:\"bindpass\",value:function(){this.props.history.push(\"/comm/security/bindfundpassword\")}},{key:\"changepass\",value:function(){this.props.history.push(\"/comm/security/changefundpassword\")}},{key:\"bindemail\",value:function(){this.props.history.push(\"/comm/security/bindEmail\")}},{key:\"render\",value:function(){var t=this,a=this.props.userAuth||\"\",e=this.state,n=e.showNickChange,l=e.nickValue;return m.default.createElement(\"div\",{className:\"SafeMain\"},m.default.createElement(E.I18n,null,function(e){return t.t=e,m.default.createElement(\"div\",null,m.default.createElement(\"ul\",{className:\"SafeMain-Ul\"},m.default.createElement(\"li\",null,e(\"safe.safeTit\")),m.default.createElement(\"li\",null,m.default.createElement(\"table\",null,m.default.createElement(\"tbody\",null,m.default.createElement(\"tr\",null,m.default.createElement(\"td\",null,m.default.createElement(\"span\",null,e(\"safe.nickName\")),a.nickname?m.default.createElement(\"i\",{className:\"iconfont iconduihao2\"}):m.default.createElement(\"i\",{className:\"iconfont iconchahao\"})),m.default.createElement(\"td\",{className:\"SafeMian-tit SafeMain-google\"},m.default.createElement(\"input\",{style:{borderBottom:n?\"1px solid #E7EBF2\":\"1px solid transparent\"},type:\"text\",value:l,ref:function(e){t.input=e},disabled:!n,onKeyPress:function(e){13===e.which&&t.blurCommit(e.target.value)},onBlur:function(e){t.blurCommit(e.target.value)},onChange:function(e){t.setState({nickValue:e.target.value})},placeholder:e(n?\"safe.pleaseSetNickName\":\"safe.clickSetNickName\")})),m.default.createElement(\"td\",null,m.default.createElement(\"span\",{onClick:function(){t.exChangeNickName()}},e(\"safe.safeChange\")))),m.default.createElement(\"tr\",null,m.default.createElement(\"td\",null,m.default.createElement(\"span\",null,e(\"safe.safeLoginPass\")),m.default.createElement(\"i\",{className:\"iconfont iconduihao2\"})),m.default.createElement(\"td\",{className:\"SafeMian-tit SafeMain-google\"},m.default.createElement(\"span\",null,e(\"safe.safeLevel\")),m.default.createElement(\"span\",{className:0===a.passwordSecurityLevel||1===a.passwordSecurityLevel?\"active btn\":\"btn\"},e(\"safe.safelow\")),m.default.createElement(\"span\",{className:2===a.passwordSecurityLevel?\"active btn\":\"btn\"},e(\"safe.safemiddle\")),m.default.createElement(\"span\",{className:3===a.passwordSecurityLevel?\"active btn\":\"btn\"},e(\"safe.safehigh\")),m.default.createElement(\"span\",{className:4===a.passwordSecurityLevel?\"active btn\":\"btn\"},e(\"safe.safehighter\")),m.default.createElement(\"span\",{className:\"zh\"===t.props.lan?\"habener\":\"habenerEn\"},e(\"safe.safeloginGoogle\")),m.default.createElement(\"span\",{className:\"Safe-googleSlide\",onClick:function(){t.changeSlide()}},m.default.createElement(\"span\",{className:\"safeSlideClose\"===t.state.slideState?\"Safe-googleSlideLide\":\"Safe-googleSlideLide Safe-googleSlideLideActive\"},e(\"safe.\"+t.state.slideState)))),m.default.createElement(\"td\",null,m.default.createElement(\"span\",{onClick:function(){t.changelopass()}},e(\"safe.safeChange\")))),m.default.createElement(\"tr\",null,m.default.createElement(\"td\",null,m.default.createElement(\"span\",null,e(\"safe.safeBindPhone\")),!1===a.isPhoneAuth?m.default.createElement(\"i\",{className:\"iconfont iconchahao\"}):m.default.createElement(\"i\",{className:\"iconfont iconduihao2\"})),m.default.createElement(\"td\",{className:\"SafeMian-tit\"},m.default.createElement(\"span\",null,e(\"safe.safeMobInfo5\"))),m.default.createElement(\"td\",null,!1===a.isPhoneAuth?m.default.createElement(\"span\",{onClick:function(){t.setmobile()}},e(\"safe.safeSet\")):m.default.createElement(\"span\",{onClick:function(){t.changemobile()}},e(\"safe.safeChange\")))),m.default.createElement(\"tr\",null,m.default.createElement(\"td\",null,m.default.createElement(\"span\",{style:{lineHeight:\"en\"===t.props.lan?\"40px\":\"80px\"}},e(\"safe.safeGoogleBind\")),!1===a.isGoogleAuth?m.default.createElement(\"i\",{className:\"iconfont iconchahao\"}):m.default.createElement(\"i\",{className:\"iconfont iconduihao2\"})),m.default.createElement(\"td\",{className:\"SafeMian-tit\"},m.default.createElement(\"span\",null,e(\"safe.safeMobInfo\")),m.default.createElement(\"span\",null,e(\"safe.safeMobInfo1\"),\" \",m.default.createElement(h.Link,{to:\"/comm/security/guide\"},e(\"safe.safeMobInfo2\")),\";\",e(\"safe.safeMobInfo3\"),\":\",m.default.createElement(h.Link,{to:\"/comm/security/guide\",className:\"weightBoard\"},\" Andriod/iOS\"))),m.default.createElement(\"td\",null,!1===a.isGoogleAuth?m.default.createElement(\"span\",{onClick:function(){t.bindgoogle()}},e(\"safe.safeSet\")):m.default.createElement(\"span\",{onClick:function(){t.nobindgoogle()}},e(\"safe.noBind\")))),m.default.createElement(\"tr\",null,m.default.createElement(\"td\",null,m.default.createElement(\"span\",null,e(\"safe.safePass\")),!1===a.isFundPwdSet?m.default.createElement(\"i\",{className:\"iconfont iconchahao\"}):m.default.createElement(\"i\",{className:\"iconfont iconduihao2\"})),m.default.createElement(\"td\",{className:\"SafeMian-tit\"},m.default.createElement(\"span\",null,e(\"safe.safePassInfo\"))),m.default.createElement(\"td\",null,!1===a.isFundPwdSet?m.default.createElement(\"span\",{onClick:function(){t.bindpass()}},e(\"safe.safeSet\")):m.default.createElement(\"span\",null,m.default.createElement(\"span\",{onClick:function(){t.forgetpass()}},e(\"safe.safeForget\"),\"？\"),m.default.createElement(\"span\",{onClick:function(){t.changepass()}},e(\"safe.safeChange\"))))),m.default.createElement(\"tr\",null,m.default.createElement(\"td\",null,m.default.createElement(\"span\",null,e(\"safe.safeEmail\")),!1===a.isEmailAuth?m.default.createElement(\"i\",{className:\"iconfont iconchahao\",style:{lineHeight:\"80px\"}}):m.default.createElement(\"i\",{className:\"iconfont iconduihao2\",style:{lineHeight:\"80px\"}})),m.default.createElement(\"td\",{className:\"SafeMian-tit\"},m.default.createElement(\"span\",null,e(\"safe.safeEmailInfo\"))),m.default.createElement(\"td\",null,!1===a.isEmailAuth?m.default.createElement(\"span\",{onClick:function(){t.bindemail()}},e(\"safe.safeSet\")):null)))))),m.default.createElement(g.default,{disable:t.state.BtnDisable,visable:t.state.visable,width:\"378\",height:\"233\",confirm:t.queding,cancel:t.quxiao},m.default.createElement(\"div\",{className:\"safeGoogle\"},m.default.createElement(\"h5\",null,e(\"safe.OpenCloseGoogle\")),m.default.createElement(\"div\",{className:\"safeGoogle-con\"},m.default.createElement(\"input\",{type:\"text\",maxLength:\"6\",onChange:function(e){t.getGoogleValue(e)},placeholder:e(\"safe.googleNull\")}),m.default.createElement(\"p\",null,t.state.googleYanz)))))}))}}]),n}(f.Component))||l;a.default=b},800:function(e,t,a){\"use strict\";Object.defineProperty(t,\"__esModule\",{value:!0});var n,o=h(a(37)),r=h(a(33)),l=h(a(36)),c=h(a(35)),i=h(a(34)),u=a(2),d=h(u),s=a(64),f=a(143),m=h(a(1166)),p=h(a(830));function h(e){return e&&e.__esModule?e:{default:e}}a(1452);var E=(0,s.connect)(function(e){return{test:e.test,testAction:e.testAction}})(n=function(e){function s(){var e,t,a,n;(0,r.default)(this,s);for(var l=arguments.length,i=Array(l),u=0;u<l;u++)i[u]=arguments[u];return(t=a=(0,c.default)(this,(e=s.__proto__||(0,o.default)(s)).call.apply(e,[this].concat(i)))).nextQuestion=function(){a.props.history.push(\"/common/futures/answer\")},a.nextExpert=function(){a.props.history.push(\"/common/futures/activate?isExpert=true\")},n=t,(0,c.default)(a,n)}return(0,i.default)(s,e),(0,l.default)(s,[{key:\"componentWillMount\",value:function(){}},{key:\"render\",value:function(){var e=this,t=[{word:d.default.createElement(f.I18n,null,function(e){return e(\"tradequalification.knowtrade\")}),icon:\"point\"},{word:d.default.createElement(f.I18n,null,function(e){return e(\"tradequalification.question\")}),icon:\"point\"},{word:d.default.createElement(f.I18n,null,function(e){return e(\"tradequalification.opentrade\")}),icon:\"point\"}],n=[{key:0,label:\"tradequalification.label0\",content:[]},{key:1,label:\"tradequalification.label\",content:[\"tradequalification.content1\",\"tradequalification.content2\",\"tradequalification.content3\",\"tradequalification.content4\",\"tradequalification.content5\",\"tradequalification.content6\"]},{key:2,label:\"tradequalification.label1\",content:[\"tradequalification.content7\",\"tradequalification.content8\",\"tradequalification.content9\"]},{key:3,label:\"tradequalification.label2\",content:[\"tradequalification.content10\",\"tradequalification.content11\"]},{key:4,label:\"tradequalification.label3\",content:[\"tradequalification.content14\"]},{key:5,label:\"tradequalification.label4\",content:[\"tradequalification.content15\",\"tradequalification.content16\",\"tradequalification.content17\"]}];return d.default.createElement(\"div\",{className:\"know\"},d.default.createElement(f.I18n,null,function(a){return d.default.createElement(\"div\",{className:\"know-main\"},d.default.createElement(\"div\",{className:\"know-mainTop\"},d.default.createElement(\"h3\",null,a(\"tradequalification.opentradetitle\")),d.default.createElement(\"p\",null,a(\"tradequalification.opentradesubtitle\")),d.default.createElement(m.default,{step:1,words:t})),d.default.createElement(\"div\",{className:\"know-body\"},n.map(function(e){return d.default.createElement(\"div\",{key:e.label},d.default.createElement(\"div\",{className:\"label-style1\"},d.default.createElement(\"p\",null,a(e.label))),d.default.createElement(\"div\",{className:\"content-style\"},e.content.map(function(e,t){return d.default.createElement(\"div\",{key:t,className:\"content-child\"},d.default.createElement(\"p\",null,a(e)))})),3===e.key?d.default.createElement(\"div\",null,d.default.createElement(\"table\",null,d.default.createElement(\"tr\",null,d.default.createElement(\"td\",null,a(\"tradequalification.tab1\")),d.default.createElement(\"td\",null,a(\"tradequalification.tab2\")),d.default.createElement(\"td\",null,a(\"tradequalification.tab3\")),d.default.createElement(\"td\",null,a(\"tradequalification.tab4\")),d.default.createElement(\"td\",null,a(\"tradequalification.tab5\")),d.default.createElement(\"td\",null,a(\"tradequalification.tab6\")),d.default.createElement(\"td\",null,a(\"tradequalification.tab7\")),d.default.createElement(\"td\",null,a(\"tradequalification.tab8\")),d.default.createElement(\"td\",null,a(\"tradequalification.tab9\"))),d.default.createElement(\"tr\",null,d.default.createElement(\"td\",null,\"BTC1912\"),d.default.createElement(\"td\",null,a(\"tradequalification.tab10\")),d.default.createElement(\"td\",null,\"10\"),d.default.createElement(\"td\",null,\"6000\"),d.default.createElement(\"td\",null,\"10\"),d.default.createElement(\"td\",null,\"10.5\"),d.default.createElement(\"td\",null,\"1.05\"),d.default.createElement(\"td\",null,\"0.5\"),d.default.createElement(\"td\",null,\"50%\"))),d.default.createElement(\"div\",{className:\"content-child1\"},d.default.createElement(\"p\",null,a(\"tradequalification.content12\")),d.default.createElement(\"br\",null),d.default.createElement(\"p\",null,a(\"tradequalification.content13\"))),d.default.createElement(\"table\",null,d.default.createElement(\"tr\",null,d.default.createElement(\"td\",null,a(\"tradequalification.tab1\")),d.default.createElement(\"td\",null,a(\"tradequalification.tab2\")),d.default.createElement(\"td\",null,a(\"tradequalification.tab3\")),d.default.createElement(\"td\",null,a(\"tradequalification.tab4\")),d.default.createElement(\"td\",null,a(\"tradequalification.tab5\")),d.default.createElement(\"td\",null,a(\"tradequalification.tab6\")),d.default.createElement(\"td\",null,a(\"tradequalification.tab7\")),d.default.createElement(\"td\",null,a(\"tradequalification.tab8\")),d.default.createElement(\"td\",null,a(\"tradequalification.tab9\"))),d.default.createElement(\"tr\",null,d.default.createElement(\"td\",null,\"BTC1912\"),d.default.createElement(\"td\",null,a(\"tradequalification.tab10\")),d.default.createElement(\"td\",null,\"10\"),d.default.createElement(\"td\",null,\"6000\"),d.default.createElement(\"td\",null,\"10\"),d.default.createElement(\"td\",null,\"9.5\"),d.default.createElement(\"td\",null,\"0.95\"),d.default.createElement(\"td\",null,\"0.5\"),d.default.createElement(\"td\",null,\"50%\")))):null)})),d.default.createElement(\"div\",{className:\"know-button\"},d.default.createElement(p.default,{onClick:e.nextQuestion,style:{width:\"140px\",height:\"32px\",lineHeight:\"28px\"}},a(\"tradequalification.startquestion\")),d.default.createElement(\"p\",{className:\"know-expert\",onClick:function(){return e.nextExpert()},theme:\"primary\"},a(\"tradequalification.expertis\"))))}))}}]),s}(u.Component))||n;t.default=E},801:function(e,t,a){\"use strict\";Object.defineProperty(t,\"__esModule\",{value:!0});var n,i=g(a(37)),u=g(a(33)),l=g(a(36)),s=g(a(35)),o=g(a(34)),r=a(2),c=g(r),d=a(64),f=g(a(145)),m=g(a(1166)),p=g(a(906)),h=g(a(830)),E=a(143);function g(e){return e&&e.__esModule?e:{default:e}}a(1454),a(1453);var y=(0,d.connect)(function(e){return{test:e.test,testAction:e.testAction}})(n=function(e){function t(e){(0,u.default)(this,t);var l=(0,s.default)(this,(t.__proto__||(0,i.default)(t)).call(this,e));return l.getBack=function(){l.setState({visable:!0})},l.handleCommit=function(){l.setState({allChecked:!0}),l.state.answer[0].ans===l.state.answerList[0].yes&&l.state.answer[1].ans===l.state.answerList[1].yes&&l.state.answer[2].ans===l.state.answerList[2].yes&&l.state.answer[3].ans===l.state.answerList[3].yes&&l.state.answer[4].ans===l.state.answerList[4].yes&&l.state.answer[5].ans===l.state.answerList[5].yes&&l.state.answer[6].ans===l.state.answerList[6].yes?l.props.history.push(\"/common/futures/activate\"):f.default.error(c.default.createElement(E.I18n,null,function(e){return e(\"tradequalification.tip\")}))},l.chooseRadoo=function(e,t,a){var n=l.state.answer;n[e-1].poin=a,1===e&&t===a?(n[0].ans=a,n[0].inde=e):2===e&&t===a?(n[1].ans=a,n[1].inde=e):3===e&&t===a?(n[2].ans=a,n[2].inde=e):4===e&&t===a?(n[3].ans=a,n[3].inde=e):5===e&&t===a?(n[4].ans=a,n[4].inde=e):6===e&&t===a?(n[5].ans=a,n[5].inde=e):7===e&&t===a?(n[6].ans=a,n[6].inde=e):(n[e-1].ans=\"99\",n[e-1].inde=e),l.setState({answer:n}),n[0].ans&&n[1].ans&&n[2].ans&&n[3].ans&&n[4].ans&&n[5].ans&&n[6].ans&&l.setState({btnGrey:!0})},l.state={visable:!1,btnGrey:!1,allChecked:!1,answer:[{ans:\"\",inde:\"\",poin:\"\"},{ans:\"\",inde:\"\",poin:\"\"},{ans:\"\",inde:\"\",poin:\"\"},{ans:\"\",inde:\"\",poin:\"\"},{ans:\"\",inde:\"\",poin:\"\"},{ans:\"\",inde:\"\",poin:\"\"},{ans:\"\",inde:\"\",poin:\"\"}],answerList:[{key:1,word:c.default.createElement(E.I18n,null,function(e){return e(\"tradequalification.question1\")}),ans1:c.default.createElement(E.I18n,null,function(e){return e(\"tradequalification.answer1\")}),ans2:c.default.createElement(E.I18n,null,function(e){return e(\"tradequalification.answer2\")}),yes:\"0\"},{key:2,word:c.default.createElement(E.I18n,null,function(e){return e(\"tradequalification.question2\")}),ans1:c.default.createElement(E.I18n,null,function(e){return e(\"tradequalification.answer3\")}),ans2:c.default.createElement(E.I18n,null,function(e){return e(\"tradequalification.answer4\")}),yes:\"1\"},{key:3,word:c.default.createElement(E.I18n,null,function(e){return e(\"tradequalification.question3\")}),ans1:c.default.createElement(E.I18n,null,function(e){return e(\"tradequalification.answer5\")}),ans2:c.default.createElement(E.I18n,null,function(e){return e(\"tradequalification.answer6\")}),yes:\"1\"},{key:4,word:c.default.createElement(E.I18n,null,function(e){return e(\"tradequalification.question4\")}),ans1:c.default.createElement(E.I18n,null,function(e){return e(\"tradequalification.answer7\")}),ans2:c.default.createElement(E.I18n,null,function(e){return e(\"tradequalification.answer8\")}),yes:\"1\"},{key:5,word:c.default.createElement(E.I18n,null,function(e){return e(\"tradequalification.question5\")}),ans1:c.default.createElement(E.I18n,null,function(e){return e(\"tradequalification.answer9\")}),ans2:c.default.createElement(E.I18n,null,function(e){return e(\"tradequalification.answer10\")}),yes:\"1\"},{key:6,word:c.default.createElement(E.I18n,null,function(e){return e(\"tradequalification.question6\")}),ans1:c.default.createElement(E.I18n,null,function(e){return e(\"tradequalification.answer11\")}),ans2:c.default.createElement(E.I18n,null,function(e){return e(\"tradequalification.answer12\")}),yes:\"1\"},{key:7,word:c.default.createElement(E.I18n,null,function(e){return e(\"tradequalification.question7\")}),ans1:c.default.createElement(E.I18n,null,function(e){return e(\"tradequalification.answer13\")}),ans2:c.default.createElement(E.I18n,null,function(e){return e(\"tradequalification.answer14\")}),yes:\"1\"}]},l.quxiao=l.quxiao.bind(l),l.queding=l.queding.bind(l),l}return(0,o.default)(t,e),(0,l.default)(t,[{key:\"componentWillMount\",value:function(){}},{key:\"queding\",value:function(){this.setState({visable:!1}),this.props.history.push(\"/common/futures/learn\")}},{key:\"quxiao\",value:function(){this.setState({visable:!1})}},{key:\"render\",value:function(){var t=this,a=[{word:c.default.createElement(E.I18n,null,function(e){return e(\"tradequalification.knowtrade\")}),icon:\"point\"},{word:c.default.createElement(E.I18n,null,function(e){return e(\"tradequalification.question\")}),icon:\"point\"},{word:c.default.createElement(E.I18n,null,function(e){return e(\"tradequalification.opentrade\")}),icon:\"point\"}],n={padding:\"0 20px 0 20px\",textAlign:\"center\",marginTop:\"32px\"};return c.default.createElement(E.I18n,null,function(e){return c.default.createElement(\"div\",{className:\"answer\"},c.default.createElement(\"div\",{className:\"answer-main\"},c.default.createElement(\"div\",{className:\"answer-mainTop\"},c.default.createElement(\"h3\",null,e(\"tradequalification.opentradetitle\")),c.default.createElement(\"p\",null,e(\"tradequalification.opentradesubtitle\")),c.default.createElement(m.default,{step:2,words:a})),c.default.createElement(\"div\",{className:\"answer-mainCon\"},t.state.answerList.map(function(e){return c.default.createElement(\"div\",{key:e.key},c.default.createElement(\"div\",{className:\"answer-title\"},e.word,!0===t.state.allChecked?c.default.createElement(\"span\",null,t.state.answer[e.key-1].ans===e.yes?c.default.createElement(\"i\",{className:\"iconfont iconduihao2\"}):null,\"99\"===t.state.answer[e.key-1].ans?c.default.createElement(\"i\",{className:\"iconfont iconchahao\"}):null):null),c.default.createElement(\"span\",{className:\"answer-radio\"},c.default.createElement(\"span\",{className:\"answer-axiba\",onClick:function(){t.chooseRadoo(e.key,e.yes,\"0\")}},c.default.createElement(\"span\",{className:\"0\"===t.state.answer[e.key-1].poin?\"radio\":\"radio active\"},c.default.createElement(\"span\",null)),e.ans1),c.default.createElement(\"span\",{className:\"answer-axiba\",onClick:function(){t.chooseRadoo(e.key,e.yes,\"1\")}},c.default.createElement(\"span\",{className:\"1\"===t.state.answer[e.key-1].poin?\"radio\":\"radio active\"},c.default.createElement(\"span\",null)),e.ans2)))})),c.default.createElement(\"div\",{className:\"answer-mainFoot\"},c.default.createElement(h.default,{onClick:function(){t.getBack()}},e(\"tradequalification.info1\")),c.default.createElement(h.default,{theme:\"primary\",disabled:!1===t.state.btnGrey,onClick:function(){t.handleCommit()}},e(\"tradequalification.info2\")))),c.default.createElement(p.default,{Popstyle:n,visable:t.state.visable,width:\"378\",height:\"233\",confirm:t.queding,cancel:t.quxiao},c.default.createElement(\"p\",{className:\"NotifyP\"},e(\"tradequalification.info3\"))))})}}]),t}(r.Component))||n;t.default=y},830:function(e,t,a){\"use strict\";Object.defineProperty(t,\"__esModule\",{value:!0}),t.default=void 0;var n=r(a(37)),l=r(a(33)),i=r(a(36)),u=r(a(35)),s=r(a(34)),o=a(2),p=r(o),h=r(a(852));function r(e){return e&&e.__esModule?e:{default:e}}a(850);var c=function(e){function t(){(0,l.default)(this,t);var e=(0,u.default)(this,(t.__proto__||(0,n.default)(t)).call(this));return e.state={loadingBall:!1},e}return(0,s.default)(t,e),(0,i.default)(t,[{key:\"componentWillMount\",value:function(){this.props.loading&&this.setState({loadingBall:!0})}},{key:\"componentWillReceiveProps\",value:function(e){e.loading!==this.props.loading&&(e.loading?this.setState({loadingBall:!0}):(this.setState({loadingBall:!1}),this.loadInterval&&clearTimeout(this.loadInterval)))}},{key:\"render\",value:function(){var e=this.props,t=e.className,a=e.type,n=void 0===a?\"button\":a,l=e.loading,i=void 0!==l&&l,u=e.theme,s=e.size,o=e.disabled,r=e.children,c=e.loadMsg,d=e.style,f=e.onClick,m=[\"ft-button\",t];return s&&m.push(\"ft-size-\"+s),u&&m.push(\"ft-color-\"+u),p.default.createElement(\"button\",{className:m.join(\" \"),style:d,onClick:f,type:n,disabled:o||i},c&&i?c:r,this.state.loadingBall?p.default.createElement(h.default,null):null)}}]),t}(o.Component);t.default=c},850:function(e,t,a){},851:function(e,t,a){},852:function(e,t,a){\"use strict\";Object.defineProperty(t,\"__esModule\",{value:!0}),t.default=function(){return i.default.createElement(\"div\",{className:\"loadingBall\"},i.default.createElement(\"span\",{className:\"one\"}),i.default.createElement(\"span\",{className:\"two\"}),i.default.createElement(\"span\",{className:\"three\"}))};var n,l=a(2),i=(n=l)&&n.__esModule?n:{default:n};a(851)},906:function(e,t,a){\"use strict\";Object.defineProperty(t,\"__esModule\",{value:!0});var n=m(a(37)),l=m(a(33)),i=m(a(36)),u=m(a(35)),s=m(a(34)),o=a(2),r=m(o),c=a(143),d=m(a(830)),f=m(a(250));function m(e){return e&&e.__esModule?e:{default:e}}a(909);var p=function(e){function t(){(0,l.default)(this,t);var e=(0,u.default)(this,(t.__proto__||(0,n.default)(t)).call(this));return e.state={PopStyle:{position:\"absolute\",top:\"40%\",left:\"50%\",width:\"400px\",height:\"250px\",marginLeft:\"-200px\",marginTop:\"-125px\"}},e}return(0,s.default)(t,e),(0,i.default)(t,[{key:\"componentWillMount\",value:function(){this.PopInit()}},{key:\"componentWillReceiveProps\",value:function(){this.PopInit()}},{key:\"PopInit\",value:function(){this.props.width&&this.props.height&&this.setState({PopStyle:{position:\"absolute\",top:\"40%\",left:\"50%\",width:this.props.width+\"px\",height:this.props.height+\"px\",marginLeft:\"-\"+(this.props.width/2).toFixed(0)+\"px\",marginTop:\"-\"+(this.props.height/2).toFixed(0)+\"px\",background:this.props.background}})}},{key:\"render\",value:function(){var t=this;return r.default.createElement(c.I18n,null,function(e){return t.t=e,r.default.createElement(\"div\",null,!0===t.props.visable?r.default.createElement(\"div\",{className:\"Notify\"},r.default.createElement(\"div\",{style:t.state.PopStyle,className:(0,f.default)(\"NotifyPop\",t.props.className)},\"primary\"===t.props.type?null:r.default.createElement(\"i\",{className:\"iconfont iconchahao1\",onClick:t.props.cancel}),r.default.createElement(\"div\",{style:t.props.Popstyle},t.props.children),t.props.confirm?r.default.createElement(\"div\",{className:\"Notify-footer\"},\"primary\"===t.props.type?r.default.createElement(d.default,{style:t.state.btnStyle,theme:\"primary\",disabled:!1===t.props.disable,className:\"btnPrimary\",onClick:t.props.confirm},e(\"bonus.sure\")):r.default.createElement(d.default,{theme:\"primary\",disabled:!1===t.props.disable,className:\"btn\",onClick:t.props.confirm,loading:t.props.loading},e(\"bonus.sure\"))):null)):null)})}}]),t}(o.Component);t.default=p},909:function(e,t,a){}}]);"}