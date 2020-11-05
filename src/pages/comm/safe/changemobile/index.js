import React, { Component } from 'react'
import { connect } from 'react-redux'
import Formsy from 'formsy-react'
import { I18n } from 'react-i18next'
import Message from '@/components/message'
import SelectedInput from '@/components/selectedInput'
import area from '@/tools/area.js'
import SafeInput from '@/components/safeInput'
import NotifyPop from '@/components/notifyPop'
import Button from '@/components/button'
import { chooseLang } from '@/assets/js/common'
import './index.scss'
import i18n from '../../../../i18n'

const chinaCode = {
    name_en: 'China',
    name_zh: '中国',
    key: 'CN',
    code: '86'
}
@connect(state => ({
    apis: state.apis,
    getUserAuth: state.getUserAuth,
    lang: state.lang,
}))
class ChangeMobile extends Component {
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
        this.handleForm = this.handleForm.bind(this)
        this.submit = this.submit.bind(this)
        this.handleConfirm = this.handleConfirm.bind(this)
        this.sendCode = this.sendCode.bind(this)
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
    // 按钮是否可点击
    setDisabled(disabled) {
        this.setState({
            disabled
        })
    }
    // 点击返回按钮
    handleBack() {
        this.props.history.push('/comm/security/main')
    }
    // 弹窗确定
    handleConfirm() {
        this.setState({
            visable: false
        })
        this.props.history.push('/comm/security/main')
    }
    // 获取表单值
    handleForm(values) {
        this.setState({
            formVal: values
        })
    }
    // 发送验证码
    async sendCode() {
        const keys = this.state.selectedInput.split('_')
        const params = {
            type: 1,
            phone: this.state.formVal.mobile,
            phoneCountryCode: keys[1],
            // language: this.props.lang === 'zh' ? 1 : 2,
            language: chooseLang(this.props.lang)
        }
        const res = await this.props.apis.sendphonecode(params)
        if (res.code === 0) {
            return true
        }
        return false
    }
    // 修改手机号表单提交
    async submit() {
        this.setState({ loading: true })
        let params
        if (this.state.selectedInput === `${chinaCode.key}_${chinaCode.code}`) {
            const keys = this.state.selectedInput.split('_')
            params = {
                phoneCountryCode: keys[1], // 手机国家码
                phoneCountryKey: keys[0], // 手机号国家Id
                phone: this.state.formVal.mobile, // 新手机号
                smsCode: this.state.formVal.messagecode, // 短信验证码
                googleCode: this.state.formVal.googlecode, // 谷歌验证码,
                emailCode: '' // 邮箱验证码
            }
        } else {
            const keys = this.state.selectedInput.split('_')
            params = {
                phoneCountryCode: keys[1], // 手机国家码
                phoneCountryKey: keys[0], // 手机号国家Id
                phone: this.state.formVal.mobile, // 新手机号
                smsCode: this.state.formVal.messagecode, // 短信验证码
                googleCode: this.state.formVal.googlecode, // 谷歌验证码
                emailCode: '' // 邮箱验证码
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
        // if (this.phone !== undefined) {
        //     codeDisabled = !this.phone.isValid()
        // }
        if (this.phone) codeDisabled = !this.phone.isValid()
        return (
            <I18n>
                {
                    t => (
                        <div>
                            <div className="changelopass-title">{t('safe.changemobile')}</div>
                            <p className="safenotice">{t('safe.changemobileInfo')}</p>
                            <div className="line" />
                            <div className="changemobile-fromWrap">
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
                                            width={this.props.lang === 'zh' ? '' : '400px'}
                                        />
                                    </div>
                                    <SafeInput
                                        ref={(phone) => { this.phone = phone }}
                                        type="0"
                                        label={t('safe.newmobile')}
                                        placeholder={t('safe.mobilePlaceholder')}
                                        name="mobile"
                                        maxLength="20"
                                        validations={{
                                            matchRegexp: /^\d+$/,
                                            minLength: 3,
                                            maxLength: 20
                                        }}
                                        validationError={t('safe.mobileError')}
                                        required
                                        className={this.props.lang === 'zh' ? '' : 'enLabel'}
                                        classNameInput={this.props.lang === 'zh' ? '' : 'enInput'}
                                    />
                                    <SafeInput
                                        type="0"
                                        label={t('safe.messagecode')}
                                        placeholder={t('safe.messagecodePlaceholder')}
                                        codeDisabled={codeDisabled}
                                        sendCode={this.sendCode}
                                        btnState
                                        name="messagecode"
                                        maxLength="6"
                                        validations={{
                                            matchRegexp: /^\d+$/,
                                            maxLength: 6
                                        }}
                                        validationError={t('safe.messagecodePlaceholder')}
                                        required
                                        className={this.props.lang === 'zh' ? '' : 'enLabel'}
                                        classNameInput={this.props.lang === 'zh' ? '' : 'enInput'}
                                    />
                                    <SafeInput
                                        type="0"
                                        label={t('safe.googlecode')}
                                        placeholder={t('safe.googlecodePlaceholder')}
                                        name="googlecode"
                                        maxLength="6"
                                        validations={{
                                            matchRegexp: /^\d+$/,
                                            maxLength: 6
                                        }}
                                        validationError={t('safe.googlecodePlaceholder')}
                                        required
                                        className={this.props.lang === 'zh' ? '' : 'enLabel'}
                                        classNameInput={this.props.lang === 'zh' ? '' : 'enInput'}
                                    />
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
                                    <p>{t('safe.modifySuccess')}</p>
                                </div>
                            </NotifyPop>
                        </div>
                    )
                }
            </I18n>
        )
    }
}
export default ChangeMobile

