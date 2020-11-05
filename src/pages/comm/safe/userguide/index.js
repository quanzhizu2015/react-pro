import React from 'react'
import { I18n } from 'react-i18next'
import Button from '@/components/button'
import Apple from '@/assets/img/safe/Apple.png'
import Google from '@/assets/img/safe/Google.png'
import Tentent from '@/assets/img/safe/Tentent.png'
import './userguide.scss'

export default class UserGuide extends React.Component {
    constructor() {
        super()
        this.goBack = this.goBack.bind(this)
    }
    goBack() {
        this.props.history.push('/comm/security/main')
    }
    render() {
        return (
            <I18n>
                {
                    t => (
                        <div id="userguide">
                            <h1>{t('safe.userguide')}</h1>
                            <div className="line" />
                            <div className="p1 pi">
                                <p>{t('safe.userguideInfo1')}</p>
                                <div className="right">
                                    <i className="iconfont iconiOS" />
                                    <ul>
                                        <li className="hover1 iconfont">
                                            APP Store
                                            <div className="erCode">
                                                <img src={Apple} alt="apple" />
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="p2 pi">
                                <p>{t('safe.userguideInfo2')}</p>
                                <div className="right">
                                    <i className="iconfont iconAndroid" />
                                    <ul>
                                        <li className="hover2 iconfont">
                                            Google Play
                                            <div className="erCode">
                                                <img src={Google} alt="Google" />
                                            </div>
                                        </li>
                                        <li className="hover3 iconfont">
                                            {t('safe.userguideInfo3')}
                                            <div className="erCode">
                                                <img src={Tentent} alt="Tentent" />
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <Button style={{ width: '140px' }} onClick={this.goBack}>{t('safe.back')}</Button>
                        </div>
                    )
                }
            </I18n>
        )
    }
}
