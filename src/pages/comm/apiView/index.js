import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Table, Tag, Icon, Checkbox } from 'antd'
import moment from 'moment'
import Formsy from 'formsy-react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import NotifyPop from '@/components/notifyPop'
import SafeInput from '@/components/safeInput'
import Button from '@/components/button'
import Message from '@/components/message'
import { chooseLang } from '@/assets/js/common'
import './index.scss'

// import ReactDom from 'react-dom';
@connect(state => ({
    userAuth: state.userAuth,
    apis: state.apis,
    lang: state.lang,
}))
class ApiView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            columns: [
                {
                    title: '备注名',
                    dataIndex: 'flag',
                    key: 'flag',
                },
                {
                    title: 'apiKey',
                    dataIndex: 'apikey',
                    key: 'apikey',
                },
                {
                    title: '权限',
                    key: 'level',
                    render: (item) => (
                        this.filterLever(item.level)
                    )
                },
                {
                    title: '创建时间',
                    key: 'createTime',
                    render: (item) => (
                        moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')
                    )
                },
                {
                    title: '操作',
                    key: 'action',
                    render: (item) => (
                        <span>
                            <Tag color="blue" onClick={() => { this.openInfo(item) }}>详情</Tag>
                            <Tag color="red" onClick={() => { this.openDel(item) }}>删除</Tag>
                        </span>
                    ),
                },
            ],
            visible: false,
            dataList: [],
            formVal: null,
            checkVal: false,
            zjVisible: false,
            password: null,
            openType: '',
            infoItem: null,
            apiVisible: false,
            delItem: null
        }
    }
    componentWillMount() {
        // this.getLanguage()
        this.getDataList()
    }
    getDataList = async () => {
        const res = await this.props.apis.getKey()
        if (res.code === 0) {
            this.setState({
                dataList: res.data,
            })
        }
    }
    setDisabled = (disabled) => {
        this.setState({
            disabled
        })
    }
    submit = async () => {
        const { formVal, checkVal } = this.state
        let codeType = ''
        let code = ''
        if (formVal.emailcode) {
            codeType = 2
            code = formVal.emailcode
        }
        if (formVal.googlecode) {
            codeType = 3
            code = formVal.googlecode
        }
        if (formVal.messagecode) {
            codeType = 1
            code = formVal.messagecode
        }
        const params = {
            flag: formVal.beizhu,
            code,
            codeType,
            level: checkVal ? 2 : 1,
        }
        const res = await this.props.apis.createKey(params)
        if (res.code === 0) {
            this.getDataList()
            Message.success('创建成功')
            this.setState({
                visible: false,
                checkVal: false
            })
        }
    }
    handleForm = (values) => {
        this.setState({
            formVal: values
        })
    }
    sendCode = async (e) => {
        if (e === '1') { // 邮箱
            const params = {
                verifyType: 1,
                templateType: 1,
                language: chooseLang(this.props.lang)
            }
            const res = await this.props.apis.sendCode(params)
            if (res.code === 0) {
                return true
            }
        } else if (e === '2') { // 短信
            const params = {
                verifyType: 2,
                templateType: 1,
                language: chooseLang(this.props.lang)
            }
            const res = await this.props.apis.sendCode(params)
            if (res.code === 0) {
                return true
            }
            Message.error(res.msg)
        }
        return false
    }
    openDel = (item) => {
        this.setState({
            delItem: item,
            password: '',
            zjVisible: true,
            openType: 'del'
        })
    }
    openInfo = (item) => {
        this.setState({
            infoItem: item,
            password: '',
            zjVisible: true,
            openType: 'Info'
        })
    }
    tradeNext = async () => {
        const {
            openType,
            password,
            delItem,
            infoItem
        } = this.state
        try {
            if (openType === 'del') {
                // console.log(this.delItem)
                // debugger
                const params = {
                    apiKey: delItem.apikey,
                    code: password,
                    codeType: 4
                }
                const res = await this.props.apis.delKey(params)
                if (res.code === 0) {
                    this.getDataList()
                    this.setState({ zjVisible: false })
                    Message.success('删除成功')
                }
            } else {
                const params = {
                    apiKey: infoItem.apikey,
                    code: password,
                    codeType: 4
                }
                const res = await this.props.apis.infoKey(params)
                if (res.code === 0) {
                    this.state.infoItem.secrect = res.data.accessSecret
                    this.setState({
                        zjVisible: false,
                        apiVisible: true
                    })
                }
            }
        } catch (e) {
            Message.error(e.message)
        }
    }
    filterLever = (e) => {
        if (e === 1) {
            return '只读'
        }
        return '全部'
    }
    applyApi = () => {
        if (!this.props.userAuth) {
            this.props.history.push('/common/login')
        } else if (this.state.dataList.length >= 5) {
            Message.info('申请Api的数量不能超过5条哦')
        } else {
            this.setState({ visible: true })
        }
    }
    render() {
        const {
            columns,
            dataList,
            visible,
            checkVal,
            password,
            zjVisible,
            apiVisible,
            infoItem
        } = this.state
        const { lang, userAuth } = this.props
        return (
            <div className="api-view">
                <div className="api-main">
                    <div className="api-header">
                        <p>
                            我的API
                        </p>
                        <p>
                            <Icon type="plus-square" />
                            <span onClick={() => { this.applyApi() }}>
                              申请API
                            </span>
                        </p>
                    </div>
                    <div className="api-container">
                        <p className="cont">使用方法：用表单post的方式，post参数并跳转到此网址，显示我们的支付页。</p>
                        <span>步骤：</span>
                        <Tag color="geekblue">点击申请API</Tag>
                        <Icon type="swap-right" />
                        <Tag color="geekblue">创建属于自己的Key</Tag>
                        <Icon type="swap-right" />
                        <Tag color="geekblue">查看API详情</Tag>
                        <Icon type="swap-right" />
                        <Tag color="geekblue">根据文档详情进行开发交易</Tag>
                        <Icon type="swap-right" />
                        <span className="cont-link" onClick={() => { window.open('https://github.com/coinoak/api-docs/blob/master/websocekt_api_cn.md') }}>websocket API /</span>
                        <span className="cont-link" onClick={() => { window.open('https://github.com/coinoak/api-docs/blob/master/rest_api_cn.md') }}> HTTP API</span>
                        <Table columns={columns} dataSource={dataList} pagination={false} />
                    </div>
                </div>

                <NotifyPop
                    className="ft-theme-bg-default api-view-pop"
                    visable={visible}
                    width="540"
                    height="280"
                    cancel={() => { this.setState({ visible: false }) }}
                >
                    <div className="">
                        <h5 className="ft-theme-s3" >申请API</h5>
                        <Formsy
                            onChange={(values) => { this.handleForm(values) }}
                            onValidSubmit={this.submit}
                            onValid={() => { this.setDisabled(false) }}
                            onInvalid={() => { this.setDisabled(true) }}
                            ref={(safeForm) => { this.safeForm = safeForm }}
                        >
                            <SafeInput
                                type="0"
                                label="备注名"
                                placeholder="请输入备注名"
                                name="beizhu"
                                required
                                className={lang === 'zh' ? '' : 'enLabel'}
                                classNameInput={lang === 'zh' ? '' : 'enGoogleInput'}
                                classNamError={lang === 'zh' ? '' : 'enGoogleErrorMsg'}
                            />
                            {
                                userAuth && !userAuth.isGoogleAuth ?
                                    <React.Fragment>
                                        {
                                            userAuth.isPhoneAuth ?
                                                <SafeInput
                                                    type="0"
                                                    label={t('safe.messagecode')}
                                                    placeholder={t('safe.messagecodePlaceholder')}
                                                    maxLength="6"
                                                    validations={{
                                                        matchRegexp: /^\d+$/,
                                                        minLength: 6,
                                                        maxLength: 6
                                                    }}
                                                    validationError={t('safe.messagecodePlaceholder')}
                                                    btnState
                                                    sendCode={async () => {
                                                        const r = await this.sendCode('2')
                                                        return r
                                                    }}
                                                    codeKey="messagecode"
                                                    name="messagecode"
                                                    required
                                                    className={lang === 'zh' ? '' : 'enLabel'}
                                                    classNameInput={lang === 'zh' ? '' : 'enGoogleInput'}
                                                    classNamError={lang === 'zh' ? '' : 'enGoogleErrorMsg'}
                                                    classNameBtn="googleBtn"
                                                />
                                                :
                                                <SafeInput
                                                    type="0"
                                                    label={t('safe.emailcode')}
                                                    placeholder={t('safe.emailcodePlaceholder')}
                                                    maxLength={6}
                                                    validations={{
                                                        matchRegexp: /^\d+$/,
                                                        minLength: 6,
                                                        maxLength: 6
                                                    }}
                                                    validationError={t('safe.emailcodePlaceholder')}
                                                    codeKey="emailcode"
                                                    sendCode={async () => {
                                                        const r = await this.sendCode('1')
                                                        return r
                                                    }}
                                                    btnState
                                                    name="emailcode"
                                                    required
                                                    className={lang === 'zh' ? '' : 'enLabel'}
                                                    classNameInput={lang === 'zh' ? '' : 'enInput'}
                                                />
                                        }
                                    </React.Fragment>
                                    :
                                    <SafeInput
                                        type="0"
                                        label={t('safe.googlecode')}
                                        placeholder={t('safe.googlecodePlaceholder')}
                                        maxLength={6}
                                        validations={{
                                            matchRegexp: /^\d+$/,
                                            minLength: 6,
                                            maxLength: 6
                                        }}
                                        validationError={t('safe.googlecodePlaceholder')}
                                        name="googlecode"
                                        required
                                        className={lang === 'zh' ? '' : 'enLabel'}
                                        classNameInput={lang === 'zh' ? '' : 'enInput'}
                                    />
                            }
                            <div className="api-checkBox">
                                <span className="api-checkBox-label">
                                    权限
                                </span>
                                <Checkbox defaultChecked disabled />
                                <span className="tips-label">只读</span>
                                <Checkbox value={checkVal} onChange={() => { this.setState({ checkVal: !checkVal }) }} />
                                <span className="tips-label">全部</span>
                            </div>
                            <div className={lang === 'zh' ? 'bindgoogle-btn' : 'bindgoogle-btn enGoogleBtn'}>
                                <Button style={{ width: '140px', background: '#fff' }} onClick={() => { this.setState({ visible: false }) }}>{t('safe.back')}</Button>
                                <Button type="submit" disabled={this.state.disabled} style={{ width: '140px', marginLeft: '30px' }} theme="primary">{t('safe.confirm')}</Button>
                            </div>
                        </Formsy>
                    </div>
                </NotifyPop>
                {
                    userAuth && userAuth.isFundPwdSet ?
                        <NotifyPop
                            // type="primary"comfirmVisible
                            className="ft-theme-bg-default"
                            visable={zjVisible}
                            width="410"
                            height="233"
                            confirm={() => { this.tradeNext() }}
                            cancel={() => { this.setState({ zjVisible: false, password: '' }) }}
                        >
                            <div className="trade-box">
                                <h5 className="ft-theme-s3">请输入交易密码</h5>
                                <div className="trade-box-con">
                                    <input
                                        className="ft-theme-box-input"
                                        autoComplete="new-password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => { this.setState({ password: e.target.value }) }}
                                        placeholder={t('Contrade.pwdHolder')}
                                        onKeyPress={(e) => { if (e.which === 13) this.tradeNext() }}
                                    />
                                    <p className="trade-box-forget">
                                        <Link to="/comm/security/forgetfundpassword">{t('Contrade.tradeFwd')}</Link>
                                    </p>
                                </div>
                            </div>
                        </NotifyPop>
                        :
                        <NotifyPop
                            // type="primary"comfirmVisible
                            className="ft-theme-bg-default"
                            visable={zjVisible}
                            width="410"
                            height="233"
                            cancel={() => { this.setState({ zjVisible: false }) }}
                        >
                            <div className="trade-box-value">
                                <h5 className="ft-theme-s3" >{t('Contrade.tradeTs')}</h5>
                                <div className="trade-box-ts ft-theme-label">
                                    <div className="trade-box-content">{t('Contrade.tradeText')}</div>
                                    <Link to="/comm/security/main">{t('Contrade.tradeLink')}</Link>
                                </div>
                            </div>
                        </NotifyPop>
                }
                <NotifyPop
                    // type="primary"comfirmVisible
                    className="ft-theme-bg-default api-view-pop"
                    visable={apiVisible}
                    width="800"
                    height="350"
                    cancel={() => { this.setState({ apiVisible: false }) }}
                >
                    <div className="trade-box-value">
                        <h5 className="ft-theme-s3" >API详情</h5>
                        {
                            infoItem ?
                                <React.Fragment>
                                    <div className="info-item">
                                        <p className="info-label">备注名</p>
                                        <p>{infoItem.flag}</p>
                                    </div>
                                    <div className="info-item">
                                        <p className="info-label">权限</p>
                                        <p>{this.filterLever(infoItem.level)}</p>
                                    </div>
                                    <div className="info-item">
                                        <p className="info-label">ApiKey</p>
                                        <p>{infoItem.apikey}</p>
                                        <CopyToClipboard text={infoItem.apikey} onCopy={() => { Message.success(t('safe.googleCopy')) }}>
                                            <i className="iconfont iconfuzhi1" />
                                        </CopyToClipboard>
                                    </div>
                                    <div className="info-item">
                                        <p className="info-label">密钥</p>
                                        <p>{infoItem.secrect}</p>
                                        <CopyToClipboard text={infoItem.secrect} onCopy={() => { Message.success(t('safe.googleCopy')) }}>
                                            <i className="iconfont iconfuzhi1" />
                                        </CopyToClipboard>
                                    </div>
                                    <div className="info-item">
                                        <p className="info-label">创建时间</p>
                                        <p>{moment(infoItem.createTime).format('YYYY-MM-DD HH:mm:ss')}</p>
                                    </div>
                                    <p className="info-tips">注意: 密钥请妥善保管，不要被陌生人看到</p>
                                    <div className={lang === 'zh' ? 'bindgoogle-btn' : 'bindgoogle-btn enGoogleBtn'}>
                                        <Button onClick={() => { this.setState({ apiVisible: false }) }}>{t('safe.confirm')}</Button>
                                    </div>
                                </React.Fragment>
                                :
                                null
                        }
                    </div>
                </NotifyPop>
            </div>
        )
    }
}
export default ApiView

