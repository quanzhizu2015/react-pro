import React, { Component } from 'react'
import { connect } from 'react-redux'
import Formsy from 'formsy-react'
import { I18n } from 'react-i18next'
import Message from '@/components/message'
import area from '@/tools/area.js'
import SelectedInput from '@/components/selectedInput'
import SafeInput from '@/components/safeInput'
import NotifyPop from '@/components/notifyPop'
import Button from '@/components/button'
import { chooseLang } from '@/assets/js/common'
import i18n from '../../../../i18n'
import './mobile.scss'


const chinaCode = {
    name_en: 'China',
    name_zh: '中国',
    key: 'CN',
    code: '86'
}
@connect(state => ({
    test: state.test,
    testAction: state.testAction,
    getUserAuth: state.getUserAuth,
    userAuth: state.userAuth,
    apis: state.apis,
    lang: state.lang,
}))
class SafeMobile extends Component {
    constructor() {
        super()
        let lng = localStorage.lang || (navigator.language || navigator.browserLanguage) || 'en'
        if (lng === 'ko') {
            lng = 'en'
        }
        // 获取国籍信息
        const listinfo = []
        for (let i = 0; i < area.length; i += 1) {
            listinfo.push({
                key: area[i].key,
                code: area[i].code,
                value: area[i][`name_${lng}`]
            })
        }
        this.state = {
            selectedInput: `${chinaCode.key}_${chinaCode.code}`,
            selectedDefault: `${chinaCode.key}_${chinaCode.code}`,
            disabled: true,
            formVal: '',
            visable: false,
            loading: false,
            listinfo,
        }
        this.handleBack = this.handleBack.bind(this)
        this.sendCode = this.sendCode.bind(this)
        this.handleForm = this.handleForm.bind(this)
        this.handleConfirm = this.handleConfirm.bind(this)
        this.getBlue = this.getBlue.bind(this)
        this.submit = this.submit.bind(this)
    }
    componentDidMount() {
        i18n.on('languageChanged', this.onLanguageChanged)
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.lang !== this.props.lang && this.safeForm !== undefined) {
            setTimeout(() => {
                this.safeForm.validateForm()
            }, 20)
        }
    }
    onLanguageChanged = () => {
        setTimeout(() => {
            let lng = localStorage.lang || (navigator.language || navigator.browserLanguage) || 'en'
            if (lng === 'ko') {
                lng = 'en'
            }
            // 获取国籍信息
            const listinfo = []
            for (let i = 0; i < area.length; i += 1) {
                listinfo.push({
                    key: area[i].key,
                    code: area[i].code,
                    value: area[i][`name_${lng}`]
                })
            }
            this.setState({
                listinfo
            })
        }, 0)
    }
    // 判断按钮是否可以点击
    setDisabled(disabled) {
        this.setState({
            disabled
        })
    }
    async getBlue() {
        if (!this.state.formVal.mobile) {
            return false
        }
        const params = {
            account: this.state.formVal.mobile,
        }
        const res = await this.props.apis.checkUser(params)
        if (res.code === 0) {
            return true
        }
        return false
    }
    // 弹窗确定
    handleConfirm() {
        this.setState({
            visable: false
        })
        this.props.history.push('/comm/security/main')
    }
    // 发送验证码
    async sendCode(e) {
        if (e === '1') {
            const params = {
                verifyType: 1,
                templateType: 1,
                // language: this.props.lang === 'zh' ? 1 : 2,
                language: chooseLang(this.props.lang)
            }
            const res = await this.props.apis.sendCode(params)
            if (res.code === 0) {
                return true
            }
        } else {
            const keys = this.state.selectedInput.split('_')
            const params = {
                type: 0,
                phone: this.state.formVal.mobile,
                phoneCountryCode: keys[1],
                // language: this.props.lang === 'zh' ? 1 : 2,
                language: chooseLang(this.props.lang)
            }
            const res = await this.props.apis.sendphonecode(params)
            if (res.code === 0) {
                return true
            }
        }
        return false
    }
    // 点击返回按钮
    handleBack() {
        this.props.history.push('/comm/security/main')
    }
    // 获取表单值
    handleForm(values) {
        this.setState({
            formVal: values
        })
    }
    // 手机绑定表单提交
    async submit() {
        this.setState({ loading: true })
        let params
        if (this.state.selectedInput === `${chinaCode.key}_${chinaCode.code}`) {
            const keys = this.state.selectedInput.split('_')
            params = {
                phoneCountryCode: keys[1], // 手机号国家码
                phoneCountryKey: keys[0], // 手机号国家Id
                phone: this.state.formVal.mobile, // 新手机号
                smsCode: this.state.formVal.messagecode, // 短信验证码
                emailCode: this.state.formVal.emailcode, // 邮箱验证码
                googleCode: this.state.formVal.googlecode
            }
        } else {
            const keys = this.state.selectedInput.split('_')
            params = {
                phoneCountryCode: keys[1], // 手机号国家码
                phoneCountryKey: keys[0], // 手机号国家Id
                phone: this.state.formVal.mobile, // 新手机号
                smsCode: this.state.formVal.messagecode, // 短信验证码
                emailCode: this.state.formVal.emailcode, // 邮箱验证码
                googleCode: this.state.formVal.googlecode
            }
        }
        try {
            const res = await this.props.apis.mobile(params)
            this.setState({ loading: false })
            if (res.code === 0) {
                this.setState({
                    visable: true
                })
                this.props.dispatch(this.props.getUserAuth())
            }
            // else {
            //     Message.error(res.msg)
            // }
        } catch (e) {
            Message.error(e.message)
        }
    }
    handleSelected = (e) => {
        this.setState({
            selectedInput: e
        })
    }
    render() {
        let codeDisabled = true
        if (this.phone) codeDisabled = !this.phone.isValid()
        const { userAuth } = this.props
        return (
            <I18n>
                {
                    t => (
                        <div>
                            <div className="changelopass-title">{t('safe.mobile')}</div>
                            <p className="safenotice">{t('safe.mobileInfo')}</p>
                            <div className="line" />
                            <div className="mobile-fromWrap">
                                <Formsy
                                    onChange={(values) => { this.handleForm(values) }}
                                    onValidSubmit={this.submit}
                                    onValid={() => { this.setDisabled(false) }}
                                    onInvalid={() => { this.setDisabled(true) }}
                                    ref={(safeForm) => { this.safeForm = safeForm }}
                                >
                                    <div className="selected-style">
                                        <SelectedInput
                                            infolist={this.state.listinfo}
                                            label={t('safe.changemobileNationality')}
                                            selectDefault={this.state.selectedDefault}
                                            onSelectChange={e => this.handleSelected(e)}
                                            className={this.props.lang === 'zh' ? '' : 'enSelcet'}
                                            width={this.props.lang === 'zh' ? '' : '410px'}
                                        />
                                    </div>
                                    <SafeInput
                                        ref={(phone) => { this.phone = phone }}
                                        type="0"
                                        label={t('safe.mobile1')}
                                        placeholder={t('safe.mobile1Place')}
                                        name="mobile"
                                        getBlue={this.getBlue}
                                        maxLength={20}
                                        validations={{
                                            matchRegexp: /^\d+$/,
                                            minLength: 3,
                                            maxLength: 20
                                        }}
                                        validationError={t('safe.mobile1Place')}
                                        required
                                        className={this.props.lang === 'zh' ? '' : 'enLabel'}
                                        classNameInput={this.props.lang === 'zh' ? '' : 'enInput'}
                                    />
                                    <SafeInput
                                        type="0"
                                        codeDisabled={codeDisabled}
                                        label={t('safe.messagecode')}
                                        placeholder={t('safe.messagecodePlaceholder')}
                                        maxLength={6}
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
                                        className={this.props.lang === 'zh' ? '' : 'enLabel'}
                                        classNameInput={this.props.lang === 'zh' ? '' : 'enInput'}
                                    />
                                    <SafeInput
                                        type="0"
                                        label={t('safe.emailcode')}
                                        placeholder={t('safe.emailcodePlaceholder')}
                                        maxLength="6"
                                        validations={{
                                            matchRegexp: /^\d+$/,
                                            minLength: 6,
                                            maxLength: 6
                                        }}
                                        validationError={t('safe.emailcodePlaceholder')}
                                        sendCode={async () => {
                                            const r = await this.sendCode('1')
                                            return r
                                        }}
                                        codeKey="mailcode"
                                        btnState
                                        name="emailcode"
                                        required
                                        className={this.props.lang === 'zh' ? '' : 'enLabel'}
                                        classNameInput={this.props.lang === 'zh' ? '' : 'enInput'}
                                    />
                                    {
                                        userAuth && userAuth.isGoogleAuth ?
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
                                            :
                                            null
                                    }
                                    <div className={this.props.lang === 'zh' ? 'changelopass-btn' : 'changelopass-btn enBtn'}>
                                        <Button style={{ width: '140px', background: '#fff' }} onClick={this.handleBack}>{t('safe.back')}</Button>
                                        <Button type="submit" disabled={this.state.disabled} style={{ width: '140px', marginLeft: '30px' }} theme="primary" loading={this.state.loading} loadMsg={t('safe.confirm')}>{t('safe.confirm')}</Button>
                                    </div>
                                </Formsy>
                            </div>
                            <NotifyPop
                                type="primary"
                                visable={this.state.visable}
                                width="400"
                                height="250"
                                confirm={this.handleConfirm}
                            >
                                <div className="success-modal">
                                    <i className="iconfont iconright-1" />
                                    <p>{t('safe.setSuccess')}</p>
                                </div>
                            </NotifyPop>
                        </div>
                    )
                }
            </I18n>
        )
    }
}
export default SafeMobile

