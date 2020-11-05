import React from 'react'
import Helmet from 'react-helmet'
import { I18n } from 'react-i18next'
import LoginComponent from '@/components/login'

import './index.scss'

export default function Login() {
    return (
        <div className="pg-login">
            <I18n>
                {
                    t => (
                        <Helmet>
                            <title>{t('logReg.loginTitle')}</title>
                            <meta content={t('logReg.loginContent')} name="description" />
                            <meta content={t('logReg.loginKeywords')} name="keywords" />
                        </Helmet>
                    )
                }
            </I18n>
            <LoginComponent />
        </div>
    )
}
