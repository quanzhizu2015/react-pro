import React, { Component } from 'react'
import './index.scss'

const delay = ['0s', '0.2s', '0.4s', '0.6s', '0.8s', '1s', '1.2s', '1.4s']

export default class Spin extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    render() {
        return (
            <div className="fota-loading-main">
                {
                    this.props.spinning ?
                        <div className={`fota-loading ${this.props.classs}`}>
                            {/* <div className="spinner">
                                <div className="rect1" />
                                <div className="rect2" />
                                <div className="rect3" />
                                <div className="rect4" />
                                <div className="rect5" />
                            </div> */}
                            {/* <div className="fota-loader" /> */}
                            <div className="funcoin-loading">
                                {
                                    delay.map(item => (
                                        <div className="funcoin-item" style={{ animationDelay: item }} />
                                    ))
                                }
                            </div>
                        </div>
                        :
                        null
                }
                {this.props.children}
            </div>
        )
    }
}
