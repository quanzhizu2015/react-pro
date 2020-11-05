import React, { Component } from 'react'
import { connect } from 'react-redux'
import cs from 'classnames'
import { withRouter } from 'react-router'
// import { I18n } from 'react-i18next'
import './index.scss'
import i18next from '../../i18n'


function moveElement(ref) {
    // const mDom = reactDom.findDOMNode(ref)
    if (ref !== null) {
        document.body.appendChild(ref)
    } else {
        document.getElementById('thememessage').innerHTML = ''
    }
}

@withRouter
@connect(state => ({
    // wsBondData: state.wsBondData,
    wsData: state.wsData,
    theme: state.theme,
    message: ''
}))
export default class CommMessage extends Component {
    state = {
        visible: false,
        message: null,
    }
    componentDidMount() {
        if (this.props.wsData && this.props.wsData.ws_12) {
            this.showMsg(this.props.wsData.ws_12.type)
        }
    }
    componentWillReceiveProps(props) {
        if (props.wsData && props.wsData.ws_12) {
            if (!this.props.wsData.ws_12 || props.wsData.ws_12 !== this.props.wsData.ws_12) {
                this.showMsg(props.wsData.ws_12.type)
            }
        }
    }
    showMsg(type) {
        this.setState({
            visible: true
        })
        if (type === 1) {
            this.setState({
                message: i18next.t('commMessage.message1')
            })
        }
        if (type === 2) {
            this.setState({
                message: i18next.t('commMessage.message2')
            })
        }
        if (type === 3) {
            this.setState({
                message: i18next.t('commMessage.message3')
            })
        }
        if (type === 4) {
            this.setState({
                message: i18next.t('commMessage.message4')
            })
        }
        setTimeout(() => {
            this.setState({
                visible: false
            })
        }, 3000)
    }
    closemessage = () => {
        this.setState({
            visible: false
        })
    }
    render() {
        const { visible } = this.state
        const { location } = this.props
        const { pathname } = location
        // const v = visible || true
        if (visible && pathname) {
            return (
                <div
                    ref={moveElement}
                    id="thememessage"
                    className={cs({
                        'ft-theme-message': pathname.startsWith('/trade')
                    }, 'thememessage')}
                >
                    <i className="iconfont iconchahao1" onClick={this.closemessage} />
                    <svg className={cs('icon')}>
                        <use xlinkHref="#icongantanhao1" width="40" />
                    </svg>
                    {/* `${this.state.horseLeft}px` */}
                    {/* {t(`commMessage.message${this.state.type}`)} */}
                    {this.state.message}
                </div>
            )
        }
        return (
            <div
                // ref={moveElement}
                id="thememessage"
            />
        )
    }
}
