(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{1166:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n=r(a(37)),l=r(a(33)),i=r(a(36)),u=r(a(35)),s=r(a(34)),o=r(a(2));function r(e){return e&&e.__esModule?e:{default:e}}a(1176);var c=function(e){function t(e){(0,l.default)(this,t);var a=(0,u.default)(this,(t.__proto__||(0,n.default)(t)).call(this,e));return a.state={activeStep:e.step},a}return(0,s.default)(t,e),(0,i.default)(t,[{key:"componentWillReceiveProps",value:function(e){this.setState({activeStep:e.step})}},{key:"render",value:function(){var e=this;return o.default.createElement("div",{id:"proBar"},o.default.createElement("ul",null,this.props.words.map(function(t,a){var n,l;return l="point"===t.icon?o.default.createElement("div",{className:"point"}):o.default.createElement("div",{className:"true"}),n=a!==e.props.words.length-1?o.default.createElement("div",{className:"dashed"}):null,o.default.createElement("li",{className:e.state.activeStep===a+1?"activeStep":null,key:a},l,o.default.createElement("span",null,t.word),n)})))}}]),t}(o.default.Component);t.default=c},1176:function(e,t,a){},1447:function(e,t,a){},1452:function(e,t,a){},1453:function(e,t,a){},1454:function(e,t,a){},795:function(e,a,n){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var l,i=v(n(256)),u=v(n(255)),s=v(n(37)),o=v(n(33)),r=v(n(36)),c=v(n(35)),d=v(n(34)),f=n(2),m=v(f),p=n(64),h=n(94),E=n(143),g=v(n(906)),y=v(n(145));function v(e){return e&&e.__esModule?e:{default:e}}n(1447);var b=(0,p.connect)(function(e){return{test:e.test,testAction:e.testAction,apis:e.apis,lan:e.lang,userAuth:e.userAuth,getUserAuth:e.getUserAuth}})(l=function(e){function a(){var e=this;(0,o.default)(this,a);var n,l=(0,c.default)(this,(a.__proto__||(0,s.default)(a)).call(this));return l.getGoogleValue=function(e){l.setState({googleCode:e.target.value}),6===e.target.value.length&&/^[0-9]*$/.test(e.target.value)?l.setState({BtnDisable:!0}):l.setState({BtnDisable:!1})},l.changeSlide=function(){!1===l.props.userAuth.isGoogleAuth?y.default.error(l.t("safe.bindGoogleFirst")):l.setState({visable:!0})},l.exChangeNickName=function(){l.setState({showNickChange:!0}),setTimeout(function(){l.input.focus()},0)},l.blurCommit=(n=(0,u.default)(i.default.mark(function a(n){var u;return i.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(!n||12<n.length||n.length<2)return y.default.warning(t("safe.pleaseSetNickName")),e.abrupt("return",!1);e.next=3;break;case 3:return u={nickname:n},e.next=6,l.props.apis.putUserName(u);case 6:return 0===e.sent.code&&y.default.success(t("safe.setSuccess")),l.props.dispatch(l.props.getUserAuth()),l.setState({showNickChange:!1}),e.abrupt("return",!0);case 11:case"end":return e.stop()}},a,e)})),function(e){return n.apply(this,arguments)}),l.state={slideState:"safeSlideClose",visable:!1,googleCode:"",googleYanz:"",BtnDisable:!1,showNickChange:!1,nickValue:""},l.changeSlide=l.changeSlide.bind(l),l.queding=l.queding.bind(l),l.quxiao=l.quxiao.bind(l),l.GetUserAuth=l.GetUserAuth.bind(l),l.getGoogleValue=l.getGoogleValue.bind(l),l.googleYanZ=l.googleYanZ.bind(l),l}var n;return(0,d.default)(a,e),(0,r.default)(a,[{key:"componentWillMount",value:function(){this.GetUserAuth()}},{key:"componentDidMount",value:function(){this.setState({nickValue:this.props.userAuth.nickname})}},{key:"componentWillReceiveProps",value:function(e){this.props.userAuth!==e.userAuth&&this.GetUserAuth(e.userAuth.isGoogleLogin),e.userAuth&&this.setState({nickValue:e.userAuth.nickname})}},{key:"setmobile",value:function(){this.props.history.push("/comm/security/bindMobile")}},{key:"GetUserAuth",value:function(e){null!=e?!1===e?this.setState({slideState:"safeSlideClose"}):this.setState({slideState:"safeSlideOpen"}):this.props.userAuth&&(!1===this.props.userAuth.isGoogleLogin?this.setState({slideState:"safeSlideClose"}):this.setState({slideState:"safeSlideOpen"}))}},{key:"changemobile",value:function(){!0===this.props.userAuth.isGoogleAuth?this.props.history.push("/comm/security/changeMobile"):y.default.error(this.t("safe.bindGoogleFirst"))}},{key:"googleYanZ",value:(n=(0,u.default)(i.default.mark(function e(){var t;return i.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,this.props.apis.usergoogleLogin({googleCode:this.state.googleCode});case 3:0===(t=e.sent).code?(this.setState({visable:!1,googleCode:"",BtnDisable:!1}),this.props.dispatch(this.props.getUserAuth()),this.GetUserAuth(),y.default.success(this.t("safe.googleSucces"))):this.setState({googleYanz:this.t("errors."+t.code)}),e.next=11;break;case 7:e.prev=7,e.t0=e.catch(0),y.default.error(e.t0.message),this.setState({googleYanz:e.t0.message});case 11:case"end":return e.stop()}},e,this,[[0,7]])})),function(){return n.apply(this,arguments)})},{key:"queding",value:function(){""===this.state.googleCode?this.setState({googleYanz:this.t("safe.googleNull")}):this.googleYanZ()}},{key:"quxiao",value:function(){this.setState({visable:!1,googleCode:"",googleYanz:""})}},{key:"changelopass",value:function(){!0===this.props.userAuth.isGoogleAuth?this.props.history.push("/comm/security/changelogincode"):!0===this.props.userAuth.isPhoneAuth?this.props.history.push("/comm/security/changelogincode"):!0===this.props.userAuth.isEmailAuth?this.props.history.push("/comm/security/changelogincode"):y.default.error(this.t("safe.bindMandE"))}},{key:"bindgoogle",value:function(){!0===this.props.userAuth.isPhoneAuth?this.props.history.push("/comm/security/bindgoogle"):!0===this.props.userAuth.isEmailAuth?this.props.history.push("/comm/security/bindgoogle"):y.default.error(this.t("safe.bindMandE"))}},{key:"nobindgoogle",value:function(){!0===this.props.userAuth.isPhoneAuth?this.props.history.push("/comm/security/unbindgoogle"):!0===this.props.userAuth.isEmailAuth?this.props.history.push("/comm/security/unbindgoogle"):y.default.error(this.t("safe.bindMandE"))}},{key:"forgetpass",value:function(){!0===this.props.userAuth.isPhoneAuth?this.props.history.push("/comm/security/forgetfundpassword"):!0===this.props.userAuth.isEmailAuth?this.props.history.push("/comm/security/forgetfundpassword"):y.default.error(this.t("safe.bindMandE"))}},{key:"bindpass",value:function(){this.props.history.push("/comm/security/bindfundpassword")}},{key:"changepass",value:function(){this.props.history.push("/comm/security/changefundpassword")}},{key:"bindemail",value:function(){this.props.history.push("/comm/security/bindEmail")}},{key:"render",value:function(){var e=this,t=this.props.userAuth||"",a=this.state,n=a.showNickChange,l=a.nickValue;return m.default.createElement("div",{className:"SafeMain"},m.default.createElement(E.I18n,null,function(a){return e.t=a,m.default.createElement("div",null,m.default.createElement("ul",{className:"SafeMain-Ul"},m.default.createElement("li",null,a("safe.safeTit")),m.default.createElement("li",null,m.default.createElement("table",null,m.default.createElement("tbody",null,m.default.createElement("tr",null,m.default.createElement("td",null,m.default.createElement("span",null,a("safe.nickName")),t.nickname?m.default.createElement("i",{className:"iconfont iconduihao2"}):m.default.createElement("i",{className:"iconfont iconchahao"})),m.default.createElement("td",{className:"SafeMian-tit SafeMain-google"},m.default.createElement("input",{style:{borderBottom:n?"1px solid #E7EBF2":"1px solid transparent"},type:"text",value:l,ref:function(t){e.input=t},disabled:!n,onKeyPress:function(t){13===t.which&&e.blurCommit(t.target.value)},onBlur:function(t){e.blurCommit(t.target.value)},onChange:function(t){e.setState({nickValue:t.target.value})},placeholder:a(n?"safe.pleaseSetNickName":"safe.clickSetNickName")})),m.default.createElement("td",null,m.default.createElement("span",{onClick:function(){e.exChangeNickName()}},a("safe.safeChange")))),m.default.createElement("tr",null,m.default.createElement("td",null,m.default.createElement("span",null,a("safe.safeLoginPass")),m.default.createElement("i",{className:"iconfont iconduihao2"})),m.default.createElement("td",{className:"SafeMian-tit SafeMain-google"},m.default.createElement("span",null,a("safe.safeLevel")),m.default.createElement("span",{className:0===t.passwordSecurityLevel||1===t.passwordSecurityLevel?"active btn":"btn"},a("safe.safelow")),m.default.createElement("span",{className:2===t.passwordSecurityLevel?"active btn":"btn"},a("safe.safemiddle")),m.default.createElement("span",{className:3===t.passwordSecurityLevel?"active btn":"btn"},a("safe.safehigh")),m.default.createElement("span",{className:4===t.passwordSecurityLevel?"active btn":"btn"},a("safe.safehighter")),m.default.createElement("span",{className:"zh"===e.props.lan?"habener":"habenerEn"},a("safe.safeloginGoogle")),m.default.createElement("span",{className:"Safe-googleSlide",onClick:function(){e.changeSlide()}},m.default.createElement("span",{className:"safeSlideClose"===e.state.slideState?"Safe-googleSlideLide":"Safe-googleSlideLide Safe-googleSlideLideActive"},a("safe."+e.state.slideState)))),m.default.createElement("td",null,m.default.createElement("span",{onClick:function(){e.changelopass()}},a("safe.safeChange")))),m.default.createElement("tr",null,m.default.createElement("td",null,m.default.createElement("span",null,a("safe.safeBindPhone")),!1===t.isPhoneAuth?m.default.createElement("i",{className:"iconfont iconchahao"}):m.default.createElement("i",{className:"iconfont iconduihao2"})),m.default.createElement("td",{className:"SafeMian-tit"},m.default.createElement("span",null,a("safe.safeMobInfo5"))),m.default.createElement("td",null,!1===t.isPhoneAuth?m.default.createElement("span",{onClick:function(){e.setmobile()}},a("safe.safeSet")):m.default.createElement("span",{onClick:function(){e.changemobile()}},a("safe.safeChange")))),m.default.createElement("tr",null,m.default.createElement("td",null,m.default.createElement("span",{style:{lineHeight:"en"===e.props.lan?"40px":"80px"}},a("safe.safeGoogleBind")),!1===t.isGoogleAuth?m.default.createElement("i",{className:"iconfont iconchahao"}):m.default.createElement("i",{className:"iconfont iconduihao2"})),m.default.createElement("td",{className:"SafeMian-tit"},m.default.createElement("span",null,a("safe.safeMobInfo")),m.default.createElement("span",null,a("safe.safeMobInfo1")," ",m.default.createElement(h.Link,{to:"/comm/security/guide"},a("safe.safeMobInfo2")),";",a("safe.safeMobInfo3"),":",m.default.createElement(h.Link,{to:"/comm/security/guide",className:"weightBoard"}," Andriod/iOS"))),m.default.createElement("td",null,!1===t.isGoogleAuth?m.default.createElement("span",{onClick:function(){e.bindgoogle()}},a("safe.safeSet")):m.default.createElement("span",{onClick:function(){e.nobindgoogle()}},a("safe.noBind")))),m.default.createElement("tr",null,m.default.createElement("td",null,m.default.createElement("span",null,a("safe.safePass")),!1===t.isFundPwdSet?m.default.createElement("i",{className:"iconfont iconchahao"}):m.default.createElement("i",{className:"iconfont iconduihao2"})),m.default.createElement("td",{className:"SafeMian-tit"},m.default.createElement("span",null,a("safe.safePassInfo"))),m.default.createElement("td",null,!1===t.isFundPwdSet?m.default.createElement("span",{onClick:function(){e.bindpass()}},a("safe.safeSet")):m.default.createElement("span",null,m.default.createElement("span",{onClick:function(){e.forgetpass()}},a("safe.safeForget"),"？"),m.default.createElement("span",{onClick:function(){e.changepass()}},a("safe.safeChange"))))),m.default.createElement("tr",null,m.default.createElement("td",null,m.default.createElement("span",null,a("safe.safeEmail")),!1===t.isEmailAuth?m.default.createElement("i",{className:"iconfont iconchahao",style:{lineHeight:"80px"}}):m.default.createElement("i",{className:"iconfont iconduihao2",style:{lineHeight:"80px"}})),m.default.createElement("td",{className:"SafeMian-tit"},m.default.createElement("span",null,a("safe.safeEmailInfo"))),m.default.createElement("td",null,!1===t.isEmailAuth?m.default.createElement("span",{onClick:function(){e.bindemail()}},a("safe.safeSet")):null)))))),m.default.createElement(g.default,{disable:e.state.BtnDisable,visable:e.state.visable,width:"378",height:"233",confirm:e.queding,cancel:e.quxiao},m.default.createElement("div",{className:"safeGoogle"},m.default.createElement("h5",null,a("safe.OpenCloseGoogle")),m.default.createElement("div",{className:"safeGoogle-con"},m.default.createElement("input",{type:"text",maxLength:"6",onChange:function(t){e.getGoogleValue(t)},placeholder:a("safe.googleNull")}),m.default.createElement("p",null,e.state.googleYanz)))))}))}}]),a}(f.Component))||l;a.default=b},800:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n,l=h(a(37)),i=h(a(33)),u=h(a(36)),s=h(a(35)),o=h(a(34)),r=a(2),c=h(r),d=a(64),f=a(143),m=h(a(1166)),p=h(a(830));function h(e){return e&&e.__esModule?e:{default:e}}a(1452);var E=(0,d.connect)(function(e){return{test:e.test,testAction:e.testAction}})(n=function(e){function t(){var e,a,n,u;(0,i.default)(this,t);for(var o=arguments.length,r=Array(o),c=0;c<o;c++)r[c]=arguments[c];return(a=n=(0,s.default)(this,(e=t.__proto__||(0,l.default)(t)).call.apply(e,[this].concat(r)))).nextQuestion=function(){n.props.history.push("/common/futures/answer")},n.nextExpert=function(){n.props.history.push("/common/futures/activate?isExpert=true")},u=a,(0,s.default)(n,u)}return(0,o.default)(t,e),(0,u.default)(t,[{key:"componentWillMount",value:function(){}},{key:"render",value:function(){var e=this,t=[{word:c.default.createElement(f.I18n,null,function(e){return e("tradequalification.knowtrade")}),icon:"point"},{word:c.default.createElement(f.I18n,null,function(e){return e("tradequalification.question")}),icon:"point"},{word:c.default.createElement(f.I18n,null,function(e){return e("tradequalification.opentrade")}),icon:"point"}],a=[{key:0,label:"tradequalification.label0",content:[]},{key:1,label:"tradequalification.label",content:["tradequalification.content1","tradequalification.content2","tradequalification.content3","tradequalification.content4","tradequalification.content5","tradequalification.content6"]},{key:2,label:"tradequalification.label1",content:["tradequalification.content7","tradequalification.content8","tradequalification.content9"]},{key:3,label:"tradequalification.label2",content:["tradequalification.content10","tradequalification.content11"]},{key:4,label:"tradequalification.label3",content:["tradequalification.content14"]},{key:5,label:"tradequalification.label4",content:["tradequalification.content15","tradequalification.content16","tradequalification.content17"]}];return c.default.createElement("div",{className:"know"},c.default.createElement(f.I18n,null,function(n){return c.default.createElement("div",{className:"know-main"},c.default.createElement("div",{className:"know-mainTop"},c.default.createElement("h3",null,n("tradequalification.opentradetitle")),c.default.createElement("p",null,n("tradequalification.opentradesubtitle")),c.default.createElement(m.default,{step:1,words:t})),c.default.createElement("div",{className:"know-body"},a.map(function(e){return c.default.createElement("div",{key:e.label},c.default.createElement("div",{className:"label-style1"},c.default.createElement("p",null,n(e.label))),c.default.createElement("div",{className:"content-style"},e.content.map(function(e,t){return c.default.createElement("div",{key:t,className:"content-child"},c.default.createElement("p",null,n(e)))})),3===e.key?c.default.createElement("div",null,c.default.createElement("table",null,c.default.createElement("tr",null,c.default.createElement("td",null,n("tradequalification.tab1")),c.default.createElement("td",null,n("tradequalification.tab2")),c.default.createElement("td",null,n("tradequalification.tab3")),c.default.createElement("td",null,n("tradequalification.tab4")),c.default.createElement("td",null,n("tradequalification.tab5")),c.default.createElement("td",null,n("tradequalification.tab6")),c.default.createElement("td",null,n("tradequalification.tab7")),c.default.createElement("td",null,n("tradequalification.tab8")),c.default.createElement("td",null,n("tradequalification.tab9"))),c.default.createElement("tr",null,c.default.createElement("td",null,"BTC1912"),c.default.createElement("td",null,n("tradequalification.tab10")),c.default.createElement("td",null,"10"),c.default.createElement("td",null,"6000"),c.default.createElement("td",null,"10"),c.default.createElement("td",null,"10.5"),c.default.createElement("td",null,"1.05"),c.default.createElement("td",null,"0.5"),c.default.createElement("td",null,"50%"))),c.default.createElement("div",{className:"content-child1"},c.default.createElement("p",null,n("tradequalification.content12")),c.default.createElement("br",null),c.default.createElement("p",null,n("tradequalification.content13"))),c.default.createElement("table",null,c.default.createElement("tr",null,c.default.createElement("td",null,n("tradequalification.tab1")),c.default.createElement("td",null,n("tradequalification.tab2")),c.default.createElement("td",null,n("tradequalification.tab3")),c.default.createElement("td",null,n("tradequalification.tab4")),c.default.createElement("td",null,n("tradequalification.tab5")),c.default.createElement("td",null,n("tradequalification.tab6")),c.default.createElement("td",null,n("tradequalification.tab7")),c.default.createElement("td",null,n("tradequalification.tab8")),c.default.createElement("td",null,n("tradequalification.tab9"))),c.default.createElement("tr",null,c.default.createElement("td",null,"BTC1912"),c.default.createElement("td",null,n("tradequalification.tab10")),c.default.createElement("td",null,"10"),c.default.createElement("td",null,"6000"),c.default.createElement("td",null,"10"),c.default.createElement("td",null,"9.5"),c.default.createElement("td",null,"0.95"),c.default.createElement("td",null,"0.5"),c.default.createElement("td",null,"50%")))):null)})),c.default.createElement("div",{className:"know-button"},c.default.createElement(p.default,{onClick:e.nextQuestion,style:{width:"140px",height:"32px",lineHeight:"28px"}},n("tradequalification.startquestion")),c.default.createElement("p",{className:"know-expert",onClick:function(){return e.nextExpert()},theme:"primary"},n("tradequalification.expertis"))))}))}}]),t}(r.Component))||n;t.default=E},801:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n,l=g(a(37)),i=g(a(33)),u=g(a(36)),s=g(a(35)),o=g(a(34)),r=a(2),c=g(r),d=a(64),f=g(a(145)),m=g(a(1166)),p=g(a(906)),h=g(a(830)),E=a(143);function g(e){return e&&e.__esModule?e:{default:e}}a(1454),a(1453);var y=(0,d.connect)(function(e){return{test:e.test,testAction:e.testAction}})(n=function(e){function t(e){(0,i.default)(this,t);var a=(0,s.default)(this,(t.__proto__||(0,l.default)(t)).call(this,e));return a.getBack=function(){a.setState({visable:!0})},a.handleCommit=function(){a.setState({allChecked:!0}),a.state.answer[0].ans===a.state.answerList[0].yes&&a.state.answer[1].ans===a.state.answerList[1].yes&&a.state.answer[2].ans===a.state.answerList[2].yes&&a.state.answer[3].ans===a.state.answerList[3].yes&&a.state.answer[4].ans===a.state.answerList[4].yes&&a.state.answer[5].ans===a.state.answerList[5].yes&&a.state.answer[6].ans===a.state.answerList[6].yes?a.props.history.push("/common/futures/activate"):f.default.error(c.default.createElement(E.I18n,null,function(e){return e("tradequalification.tip")}))},a.chooseRadoo=function(e,t,n){var l=a.state.answer;l[e-1].poin=n,1===e&&t===n?(l[0].ans=n,l[0].inde=e):2===e&&t===n?(l[1].ans=n,l[1].inde=e):3===e&&t===n?(l[2].ans=n,l[2].inde=e):4===e&&t===n?(l[3].ans=n,l[3].inde=e):5===e&&t===n?(l[4].ans=n,l[4].inde=e):6===e&&t===n?(l[5].ans=n,l[5].inde=e):7===e&&t===n?(l[6].ans=n,l[6].inde=e):(l[e-1].ans="99",l[e-1].inde=e),a.setState({answer:l}),l[0].ans&&l[1].ans&&l[2].ans&&l[3].ans&&l[4].ans&&l[5].ans&&l[6].ans&&a.setState({btnGrey:!0})},a.state={visable:!1,btnGrey:!1,allChecked:!1,answer:[{ans:"",inde:"",poin:""},{ans:"",inde:"",poin:""},{ans:"",inde:"",poin:""},{ans:"",inde:"",poin:""},{ans:"",inde:"",poin:""},{ans:"",inde:"",poin:""},{ans:"",inde:"",poin:""}],answerList:[{key:1,word:c.default.createElement(E.I18n,null,function(e){return e("tradequalification.question1")}),ans1:c.default.createElement(E.I18n,null,function(e){return e("tradequalification.answer1")}),ans2:c.default.createElement(E.I18n,null,function(e){return e("tradequalification.answer2")}),yes:"0"},{key:2,word:c.default.createElement(E.I18n,null,function(e){return e("tradequalification.question2")}),ans1:c.default.createElement(E.I18n,null,function(e){return e("tradequalification.answer3")}),ans2:c.default.createElement(E.I18n,null,function(e){return e("tradequalification.answer4")}),yes:"1"},{key:3,word:c.default.createElement(E.I18n,null,function(e){return e("tradequalification.question3")}),ans1:c.default.createElement(E.I18n,null,function(e){return e("tradequalification.answer5")}),ans2:c.default.createElement(E.I18n,null,function(e){return e("tradequalification.answer6")}),yes:"1"},{key:4,word:c.default.createElement(E.I18n,null,function(e){return e("tradequalification.question4")}),ans1:c.default.createElement(E.I18n,null,function(e){return e("tradequalification.answer7")}),ans2:c.default.createElement(E.I18n,null,function(e){return e("tradequalification.answer8")}),yes:"1"},{key:5,word:c.default.createElement(E.I18n,null,function(e){return e("tradequalification.question5")}),ans1:c.default.createElement(E.I18n,null,function(e){return e("tradequalification.answer9")}),ans2:c.default.createElement(E.I18n,null,function(e){return e("tradequalification.answer10")}),yes:"1"},{key:6,word:c.default.createElement(E.I18n,null,function(e){return e("tradequalification.question6")}),ans1:c.default.createElement(E.I18n,null,function(e){return e("tradequalification.answer11")}),ans2:c.default.createElement(E.I18n,null,function(e){return e("tradequalification.answer12")}),yes:"1"},{key:7,word:c.default.createElement(E.I18n,null,function(e){return e("tradequalification.question7")}),ans1:c.default.createElement(E.I18n,null,function(e){return e("tradequalification.answer13")}),ans2:c.default.createElement(E.I18n,null,function(e){return e("tradequalification.answer14")}),yes:"1"}]},a.quxiao=a.quxiao.bind(a),a.queding=a.queding.bind(a),a}return(0,o.default)(t,e),(0,u.default)(t,[{key:"componentWillMount",value:function(){}},{key:"queding",value:function(){this.setState({visable:!1}),this.props.history.push("/common/futures/learn")}},{key:"quxiao",value:function(){this.setState({visable:!1})}},{key:"render",value:function(){var e=this,t=[{word:c.default.createElement(E.I18n,null,function(e){return e("tradequalification.knowtrade")}),icon:"point"},{word:c.default.createElement(E.I18n,null,function(e){return e("tradequalification.question")}),icon:"point"},{word:c.default.createElement(E.I18n,null,function(e){return e("tradequalification.opentrade")}),icon:"point"}],a={padding:"0 20px 0 20px",textAlign:"center",marginTop:"32px"};return c.default.createElement(E.I18n,null,function(n){return c.default.createElement("div",{className:"answer"},c.default.createElement("div",{className:"answer-main"},c.default.createElement("div",{className:"answer-mainTop"},c.default.createElement("h3",null,n("tradequalification.opentradetitle")),c.default.createElement("p",null,n("tradequalification.opentradesubtitle")),c.default.createElement(m.default,{step:2,words:t})),c.default.createElement("div",{className:"answer-mainCon"},e.state.answerList.map(function(t){return c.default.createElement("div",{key:t.key},c.default.createElement("div",{className:"answer-title"},t.word,!0===e.state.allChecked?c.default.createElement("span",null,e.state.answer[t.key-1].ans===t.yes?c.default.createElement("i",{className:"iconfont iconduihao2"}):null,"99"===e.state.answer[t.key-1].ans?c.default.createElement("i",{className:"iconfont iconchahao"}):null):null),c.default.createElement("span",{className:"answer-radio"},c.default.createElement("span",{className:"answer-axiba",onClick:function(){e.chooseRadoo(t.key,t.yes,"0")}},c.default.createElement("span",{className:"0"===e.state.answer[t.key-1].poin?"radio":"radio active"},c.default.createElement("span",null)),t.ans1),c.default.createElement("span",{className:"answer-axiba",onClick:function(){e.chooseRadoo(t.key,t.yes,"1")}},c.default.createElement("span",{className:"1"===e.state.answer[t.key-1].poin?"radio":"radio active"},c.default.createElement("span",null)),t.ans2)))})),c.default.createElement("div",{className:"answer-mainFoot"},c.default.createElement(h.default,{onClick:function(){e.getBack()}},n("tradequalification.info1")),c.default.createElement(h.default,{theme:"primary",disabled:!1===e.state.btnGrey,onClick:function(){e.handleCommit()}},n("tradequalification.info2")))),c.default.createElement(p.default,{Popstyle:a,visable:e.state.visable,width:"378",height:"233",confirm:e.queding,cancel:e.quxiao},c.default.createElement("p",{className:"NotifyP"},n("tradequalification.info3"))))})}}]),t}(r.Component))||n;t.default=y},830:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n=d(a(37)),l=d(a(33)),i=d(a(36)),u=d(a(35)),s=d(a(34)),o=a(2),r=d(o),c=d(a(852));function d(e){return e&&e.__esModule?e:{default:e}}a(850);var f=function(e){function t(){(0,l.default)(this,t);var e=(0,u.default)(this,(t.__proto__||(0,n.default)(t)).call(this));return e.state={loadingBall:!1},e}return(0,s.default)(t,e),(0,i.default)(t,[{key:"componentWillMount",value:function(){this.props.loading&&this.setState({loadingBall:!0})}},{key:"componentWillReceiveProps",value:function(e){e.loading!==this.props.loading&&(e.loading?this.setState({loadingBall:!0}):(this.setState({loadingBall:!1}),this.loadInterval&&clearTimeout(this.loadInterval)))}},{key:"render",value:function(){var e=this.props,t=e.className,a=e.type,n=void 0===a?"button":a,l=e.loading,i=void 0!==l&&l,u=e.theme,s=e.size,o=e.disabled,d=e.children,f=e.loadMsg,m=e.style,p=e.onClick,h=["ft-button",t];return s&&h.push("ft-size-"+s),u&&h.push("ft-color-"+u),r.default.createElement("button",{className:h.join(" "),style:m,onClick:p,type:n,disabled:o||i},f&&i?f:d,this.state.loadingBall?r.default.createElement(c.default,null):null)}}]),t}(o.Component);t.default=f},850:function(e,t,a){},851:function(e,t,a){},852:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(){return l.default.createElement("div",{className:"loadingBall"},l.default.createElement("span",{className:"one"}),l.default.createElement("span",{className:"two"}),l.default.createElement("span",{className:"three"}))};var n,l=(n=a(2))&&n.__esModule?n:{default:n};a(851)},906:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=m(a(37)),l=m(a(33)),i=m(a(36)),u=m(a(35)),s=m(a(34)),o=a(2),r=m(o),c=a(143),d=m(a(830)),f=m(a(250));function m(e){return e&&e.__esModule?e:{default:e}}a(909);var p=function(e){function t(){(0,l.default)(this,t);var e=(0,u.default)(this,(t.__proto__||(0,n.default)(t)).call(this));return e.state={PopStyle:{position:"absolute",top:"40%",left:"50%",width:"400px",height:"250px",marginLeft:"-200px",marginTop:"-125px"}},e}return(0,s.default)(t,e),(0,i.default)(t,[{key:"componentWillMount",value:function(){this.PopInit()}},{key:"componentWillReceiveProps",value:function(){this.PopInit()}},{key:"PopInit",value:function(){this.props.width&&this.props.height&&this.setState({PopStyle:{position:"absolute",top:"40%",left:"50%",width:this.props.width+"px",height:this.props.height+"px",marginLeft:"-"+(this.props.width/2).toFixed(0)+"px",marginTop:"-"+(this.props.height/2).toFixed(0)+"px",background:this.props.background}})}},{key:"render",value:function(){var e=this;return r.default.createElement(c.I18n,null,function(t){return e.t=t,r.default.createElement("div",null,!0===e.props.visable?r.default.createElement("div",{className:"Notify"},r.default.createElement("div",{style:e.state.PopStyle,className:(0,f.default)("NotifyPop",e.props.className)},"primary"===e.props.type?null:r.default.createElement("i",{className:"iconfont iconchahao1",onClick:e.props.cancel}),r.default.createElement("div",{style:e.props.Popstyle},e.props.children),e.props.confirm?r.default.createElement("div",{className:"Notify-footer"},"primary"===e.props.type?r.default.createElement(d.default,{style:e.state.btnStyle,theme:"primary",disabled:!1===e.props.disable,className:"btnPrimary",onClick:e.props.confirm},t("bonus.sure")):r.default.createElement(d.default,{theme:"primary",disabled:!1===e.props.disable,className:"btn",onClick:e.props.confirm,loading:e.props.loading},t("bonus.sure"))):null)):null)})}}]),t}(o.Component);t.default=p},909:function(e,t,a){}}]);