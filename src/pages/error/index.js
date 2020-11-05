import React from 'react'
import { connect } from 'react-redux'
import { I18n } from 'react-i18next'
import './index.scss'


@connect(state => ({
    lang: state.lang,
}))
export default class Error extends React.Component {
    constructor(props) {
        super(props)
        this.goLinkToHome = this.goLinkToHome.bind(this)
    }
    goLinkToHome() {
        this.props.history.push('/home')
    }
    render() {
        return (
            <I18n>
                {
                    t => (
                        <div className="error">
                            <div className="error-main">
                                <p>
                                    {t('error.tip1')}
                                </p>
                                <button onClick={this.goLinkToHome}>
                                    {t('error.tip2')}
                                </button>
                            </div>
                        </div>
                    )
                }
            </I18n>

        )
    }
}
