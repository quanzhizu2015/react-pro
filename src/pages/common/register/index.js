import React from 'react'
import Helmet from 'react-helmet'
import { I18n } from 'react-i18next'
import RegisterComponent from '@/components/register'

import './index.scss'

export default function Register() {
    return (
        <div className="pg-register">
            <I18n>
                {
                    t => (
                        <Helmet>
                            <title>{t('logReg.registerTitle')}</title>
                            <meta content={t('logReg.registerContent')} name="description" />
                            <meta content={t('logReg.registerKeywords')} name="keywords" />
                        </Helmet>
                    )
                }
            </I18n>
            <RegisterComponent />
        </div>
    )
}
